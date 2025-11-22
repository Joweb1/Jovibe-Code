
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getCaretCoordinates } from '../utils/caretCoordinates';
import { HTML_TAGS, HTML_ATTRS, CSS_PROPS, CSS_PROP_VALUES, JS_KEYWORDS, VOID_ELEMENTS } from '../constants/keywords';
import { QuickAccessBar } from './QuickAccessBar';
import { ColorPicker } from './ColorPicker';

// Make Prism available on the window object for TypeScript
declare global {
    interface Window {
        Prism: {
            highlightElement(element: Element): void;
        };
    }
}

interface EditorPanelProps {
  sourceDoc: string;
  onSourceDocChange: (value: string) => void;
  fileName: string;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

type SuggestionType = 'tag' | 'attr' | 'value' | 'none' | 'color' | 'css-prop' | 'css-value';
type EditorContext = 'html' | 'css' | 'javascript';

const EditorPanel: React.FC<EditorPanelProps> = ({
  sourceDoc,
  onSourceDocChange,
  fileName,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Autocomplete State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Color Picker State
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [matchStart, setMatchStart] = useState(0);
  const [suggestionType, setSuggestionType] = useState<SuggestionType>('none');

  // Quick Access Bar State
  const [isQuickBarOpen, setIsQuickBarOpen] = useState(true);
  const [editorContext, setEditorContext] = useState<EditorContext>('html');

  // When sourceDoc changes, highlight the code block
  useEffect(() => {
    if (codeRef.current && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [sourceDoc]);

  // Calculate line numbers
  const lineCount = useMemo(() => sourceDoc.split('\n').length, [sourceDoc]);
  const lineNumbers = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => i + 1);
  }, [lineCount]);

  // Synchronize scrolling between textarea, pre, and line numbers
  const handleScroll = () => {
    if (preRef.current && textareaRef.current && lineNumbersRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      const scrollLeft = textareaRef.current.scrollLeft;

      preRef.current.scrollTop = scrollTop;
      lineNumbersRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
      
      // If suggestions/popups are open, force close on scroll to avoid misalignment
      if (showSuggestions) setShowSuggestions(false);
      if (showColorPicker) setShowColorPicker(false);
    }
  };

  const determineContext = (text: string, pos: number): EditorContext => {
    const prefix = text.substring(0, pos);
    const lastStyleStart = prefix.lastIndexOf('<style');
    const lastStyleEnd = prefix.lastIndexOf('</style>');
    const lastScriptStart = prefix.lastIndexOf('<script');
    const lastScriptEnd = prefix.lastIndexOf('</script>');

    // Simple check: if we are after a start tag and haven't seen an end tag, we are inside.
    if (lastStyleStart > lastStyleEnd) return 'css';
    if (lastScriptStart > lastScriptEnd) return 'javascript';
    return 'html';
  };

  const updateSuggestions = (text: string, pos: number) => {
      const context = determineContext(text, pos);
      
      // Sync context state for QuickAccessBar
      if (context !== editorContext) {
          setEditorContext(context);
      }

      const sub = text.substring(0, pos);
      
      let suggestionsList: string[] = [];
      let startOffset = 0;
      let type: SuggestionType = 'none';
      
      // CSS Color Picker Detection (specific trigger)
      if (context === 'css') {
          // Detects: space/colon/comma + # + optional hex chars
          const colorMatch = sub.match(/([:,\s]\s*)(#[a-fA-F0-9]*)$/);
          
          if (colorMatch) {
             const hexValue = colorMatch[2];
             // Configure for color picker
             setSuggestions([]);
             setShowSuggestions(false);
             setMatchStart(pos - hexValue.length);
             setSuggestionType('color');
             
             if (textareaRef.current) {
                setShowColorPicker(true);
             }
             return; // Stop processing standard suggestions
          }
      }

      // If no color match, proceed with standard suggestions
      setShowColorPicker(false);

      if (context === 'html') {
          // Check if we are typing a tag name: looks like `<tag`
          // Find the last `<`
          const lastOpen = sub.lastIndexOf('<');
          const lastClose = sub.lastIndexOf('>');
          
          // If we have an open angle bracket that isn't closed yet
          if (lastOpen > lastClose && lastOpen !== -1) {
              const tagContent = sub.substring(lastOpen + 1);
              // If there is a space, we are typing attributes
              if (/\s/.test(tagContent)) {
                 // Attribute Context
                 const attrMatch = tagContent.match(/([a-zA-Z0-9-]*)$/);
                 if (attrMatch) {
                     const matchStr = attrMatch[1];
                     // Only suggest if user has started typing something or if they just typed space
                     if (matchStr.length > 0) {
                         suggestionsList = HTML_ATTRS.filter(a => a.startsWith(matchStr.toLowerCase()));
                         startOffset = pos - matchStr.length;
                         type = 'attr';
                     } else {
                         suggestionsList = []; 
                     }
                 }
              } else {
                 // Tag Name Context
                 const matchStr = tagContent; // everything after <
                 if (matchStr.length > 0) {
                     suggestionsList = HTML_TAGS.filter(t => t.startsWith(matchStr.toLowerCase()));
                     startOffset = pos - matchStr.length;
                     type = 'tag';
                 }
              }
          }
      } else if (context === 'css') {
          // Find the start of the current declaration to check if we are in property or value
          // We search backwards for the last delimiter that ends a previous declaration/rule
          const lastSeparatorIndex = Math.max(sub.lastIndexOf(';'), sub.lastIndexOf('{'), sub.lastIndexOf('}'));
          const currentDeclaration = sub.substring(lastSeparatorIndex + 1);
          
          // If the current declaration segment contains a colon, we are in the value part
          if (currentDeclaration.includes(':')) {
              const parts = currentDeclaration.split(':');
              const propName = parts[0].trim();
              const valuePart = parts[1]; // Don't trim start yet to preserve spaces for typing logic if needed, but logic below handles it via regex
              
              // Extract last word being typed for value autocomplete
              const valMatch = valuePart.match(/([a-zA-Z0-9-#]*)$/);
              
              if (valMatch) {
                  const matchStr = valMatch[1];
                  const allowedValues = CSS_PROP_VALUES[propName] || [];
                  
                  if (allowedValues.length > 0) {
                       // Filter suggestions
                       suggestionsList = allowedValues.filter(v => v.toLowerCase().startsWith(matchStr.toLowerCase()));
                       startOffset = pos - matchStr.length;
                       type = 'css-value';
                  }
              }
          } else {
              // We are in the property part
              const propMatch = currentDeclaration.match(/([a-zA-Z0-9-]+)$/);
              if (propMatch) {
                  const matchStr = propMatch[1];
                  suggestionsList = CSS_PROPS.filter(p => p.startsWith(matchStr.toLowerCase()));
                  startOffset = pos - matchStr.length;
                  type = 'css-prop';
              }
          }

      } else if (context === 'javascript') {
          // JS Keyword Context
          const wordMatch = sub.match(/([a-zA-Z0-9_$]+)$/);
          if (wordMatch) {
              const matchStr = wordMatch[1];
              suggestionsList = JS_KEYWORDS.filter(k => k.startsWith(matchStr)); 
              startOffset = pos - matchStr.length;
              type = 'value';
          }
      }

      if (suggestionsList.length > 0) {
          // Limit to top 10
          setSuggestions(suggestionsList.slice(0, 10));
          setSuggestionIndex(0);
          setMatchStart(startOffset);
          setSuggestionType(type);
          
          if (textareaRef.current) {
              const caret = getCaretCoordinates(textareaRef.current, pos);
              setCoords({ 
                  top: caret.top + caret.height,
                  left: caret.left 
              });
              setShowSuggestions(true);
          }
      } else {
          setShowSuggestions(false);
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Handle Color Picker Keys
      if (showColorPicker) {
          if (e.key === 'Escape') {
              e.preventDefault();
              setShowColorPicker(false);
              return;
          }
          // We don't trap Enter/Arrows for color picker currently to allow typing custom hex
      }

      // Handle Autocomplete Keys
      if (showSuggestions) {
          if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSuggestionIndex(prev => (prev + 1) % suggestions.length);
          } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
          } else if (e.key === 'Tab' || e.key === 'Enter') {
              e.preventDefault();
              insertSuggestion(suggestions[suggestionIndex]);
          } else if (e.key === 'Escape') {
              e.preventDefault();
              setShowSuggestions(false);
          }
      } else {
          // Handle Tab for indentation if suggestions are not showing
          if (e.key === 'Tab') {
              e.preventDefault();
              handleQuickInsert('  ', 'indent');
          }
      }
  };

  // Handle cursor updates when simply moving around (not typing text)
  const handleCursorMove = () => {
      if (textareaRef.current) {
          const pos = textareaRef.current.selectionEnd;
          const ctx = determineContext(sourceDoc, pos);
          if (ctx !== editorContext) {
              setEditorContext(ctx);
          }
      }
  };

  const insertSuggestion = (suggestion: string) => {
      if (!textareaRef.current) return;
      
      const before = sourceDoc.substring(0, matchStart);
      const after = sourceDoc.substring(textareaRef.current.selectionEnd);
      
      let insertion = suggestion;
      let newCursorPos = matchStart + suggestion.length;
      
      // Smart insertion logic
      if (suggestionType === 'attr') {
          insertion = `${suggestion}=""`;
          // Place cursor between quotes
          newCursorPos = matchStart + suggestion.length + 2;
      } else if (suggestionType === 'tag') {
          // Check if it's a void element (self-closing or no closing tag needed)
          if (VOID_ELEMENTS.includes(suggestion)) {
              insertion = `${suggestion}>`;
              newCursorPos = matchStart + suggestion.length + 1;
          } else {
              // Add closing tag and place cursor in between
              insertion = `${suggestion}></${suggestion}>`;
              newCursorPos = matchStart + suggestion.length + 1;
          }
      } else if (suggestionType === 'css-prop') {
          // Add colon and space for CSS properties
          insertion = `${suggestion}: `;
          newCursorPos = matchStart + suggestion.length + 2;
      } else if (suggestionType === 'css-value') {
          // Add semicolon for CSS values
          insertion = `${suggestion};`;
          newCursorPos = matchStart + suggestion.length + 1;
      }
      
      const newText = before + insertion + after;
      onSourceDocChange(newText);
      
      requestAnimationFrame(() => {
          if (textareaRef.current) {
              textareaRef.current.selectionStart = newCursorPos;
              textareaRef.current.selectionEnd = newCursorPos;
              textareaRef.current.focus();
          }
      });
      
      setShowSuggestions(false);
  };

  const insertColor = (color: string) => {
      if (!textareaRef.current) return;
      
      const before = sourceDoc.substring(0, matchStart);
      const after = sourceDoc.substring(textareaRef.current.selectionEnd);
      
      const newText = before + color + after;
      onSourceDocChange(newText);
      
      requestAnimationFrame(() => {
          if (textareaRef.current) {
              const newPos = matchStart + color.length;
              textareaRef.current.selectionStart = newPos;
              textareaRef.current.selectionEnd = newPos;
              textareaRef.current.focus();
          }
      });
      
      setShowColorPicker(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      const pos = e.target.selectionEnd;
      
      onSourceDocChange(val);
      updateSuggestions(val, pos);
  };

  // --- Quick Access Bar Logic ---

  const findTagToClose = (textBeforeCursor: string): string | null => {
      const tags: string[] = [];
      // Match tags: <name>, </name>, <name />, <name ...>
      // Regex captures: 1: slash? 2: tagName 3: selfCloseSlash?
      const regex = /<(\/?)([a-zA-Z0-9-]+)[^>]*?(\/?)>/g;
      let match;
      
      // We need to process the string sequentially
      while ((match = regex.exec(textBeforeCursor)) !== null) {
          const [_, slash, tagName, selfClosing] = match;
          const isClosing = slash === '/';
          const isSelfClosing = selfClosing === '/' || VOID_ELEMENTS.includes(tagName.toLowerCase());
          
          if (isClosing) {
              if (tags.length > 0 && tags[tags.length - 1] === tagName) {
                  tags.pop();
              }
          } else if (!isSelfClosing) {
              tags.push(tagName);
          }
      }
      
      return tags.length > 0 ? tags[tags.length - 1] : null;
  };

  const handleQuickInsert = (val: string, type: 'text' | 'tag' | 'func' | 'smartClose' | 'indent') => {
      if (!textareaRef.current) return;
      
      const pos = textareaRef.current.selectionEnd;
      const before = sourceDoc.substring(0, pos);
      const after = sourceDoc.substring(pos);
      
      let insertion = val;
      let cursorOffset = val.length;
      
      if (type === 'smartClose') {
          const tagToClose = findTagToClose(before);
          if (tagToClose) {
              insertion = `</${tagToClose}>`;
              cursorOffset = insertion.length;
          } else {
              // Fallback if no tag found or all closed
              insertion = '>';
              cursorOffset = 1;
          }
      } else if (type === 'tag') {
           if (VOID_ELEMENTS.includes(val)) {
               insertion = `<${val}>`;
               cursorOffset = insertion.length;
           } else {
               insertion = `<${val}></${val}>`;
               // Place cursor inside
               cursorOffset = val.length + 2; // < + val + >
           }
      } else if (type === 'func') {
          // For functions/blocks like {} or () or console.log()
          // We look for where the cursor should be. 
          // Convention: if value contains '()', place inside. If '{\n \n}', place inside.
          if (val.includes('{\n')) {
              // Block style
              insertion = val;
              // Rough estimate: finding the newline and adding indent
              cursorOffset = val.indexOf('\n') + 3; // \n + space + space
          } else if (val.includes('""')) {
              cursorOffset = val.indexOf('""') + 1;
          } else if (val.endsWith('()')) {
              cursorOffset = val.length - 1;
          } else if (val.endsWith('[]')) {
              cursorOffset = val.length - 1;
          }
      }
      
      const newText = before + insertion + after;
      onSourceDocChange(newText);
      
      requestAnimationFrame(() => {
          if (textareaRef.current) {
              const newPos = pos + cursorOffset;
              textareaRef.current.selectionStart = newPos;
              textareaRef.current.selectionEnd = newPos;
              textareaRef.current.focus();
          }
      });
  };

  const sharedTypoClasses = "font-mono font-normal leading-6 tracking-normal [font-variant-ligatures:none] [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale] [font-synthesis:none] [tab-size:4]";
  
  const editorPaddingClasses = isQuickBarOpen ? "p-4 pr-[5rem]" : "p-4"; 

  return (
    <div className="flex flex-col h-full bg-base-200 rounded-lg overflow-hidden border border-base-300 relative">
       <div className="bg-base-300 border-b border-base-300 px-4 py-2 text-sm font-medium text-base-content flex justify-between items-center z-20 relative">
          <span>{fileName}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-base-100"
              title="Undo (Ctrl+Z)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M15.75 2a.75.75 0 0 0-.75.75v3.23c-1.638-2.134-4.153-3.48-7-3.48C4.022 2.5 1 5.522 1 9.5s3.022 7 7 7c3.22 0 5.92-1.928 6.75-4.606a.75.75 0 0 0-1.45-.394A5.5 5.5 0 1 1 8 5.5a5.418 5.418 0 0 1 3.42 1.256.75.75 0 0 0 1.06.028l2.5-2.25a.75.75 0 0 0-.53-1.284z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-base-100"
              title="Redo (Ctrl+Y)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.25 2A.75.75 0 0 1 5 2.75v3.23c1.638-2.134-4.153-3.48 7-3.48 3.978 0 7 3.022 7 7s-3.022 7-7 7c-3.22 0-5.92-1.928-6.75-4.606a.75.75 0 0 1 1.45-.394A5.5 5.5 0 1 0 12 5.5a5.418 5.418 0 0 0-3.42 1.256.75.75 0 0 1-1.06.028l-2.5-2.25a.75.75 0 0 1 .53-1.284z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
       </div>
      <div className="flex flex-1 overflow-hidden relative">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className={`py-4 pl-4 pr-2 text-right text-base-content-secondary select-none bg-base-300 overflow-y-hidden ${sharedTypoClasses} pb-16`}
          aria-hidden="true"
        >
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>
        
        {/* Editor Area */}
        <div className="relative flex-1 group">
          <textarea
            ref={textareaRef}
            value={sourceDoc}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleCursorMove}
            onScroll={handleScroll}
            onClick={(e) => {
                setShowSuggestions(false);
                setShowColorPicker(false);
                handleCursorMove();
            }}
            onBlur={() => {
                setTimeout(() => {
                    setShowSuggestions(false);
                    // Don't automatically close color picker on blur immediately as interacting with the picker causes a blur
                }, 150);
            }}
            className={`absolute inset-0 w-full h-full bg-transparent text-transparent text-[14px] caret-white z-10 overflow-auto resize-none focus:outline-none whitespace-pre ${sharedTypoClasses} ${editorPaddingClasses} transition-[padding] duration-300`}
            placeholder={`Write your HTML, CSS, and JavaScript code here...`}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
          />
          <pre 
            ref={preRef} 
            className={`language-html absolute inset-0 w-full h-full pointer-events-none overflow-auto whitespace-pre ${sharedTypoClasses} ${editorPaddingClasses} transition-[padding] duration-300`}
            aria-hidden="true">
            <code ref={codeRef} className="language-html">
              {sourceDoc + '\n'}
            </code>
          </pre>

          {/* Autocomplete Dropdown */}
          {showSuggestions && (
             <div 
                className="absolute z-50 bg-base-300 border border-base-100 shadow-2xl rounded-lg overflow-hidden min-w-[180px]"
                style={{ 
                    top: coords.top - (textareaRef.current?.scrollTop || 0), 
                    left: coords.left - (textareaRef.current?.scrollLeft || 0) 
                }}
             >
                 <ul className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-base-content-secondary scrollbar-track-base-100">
                     {suggestions.map((item, idx) => (
                         <li 
                            key={item}
                            className={`px-3 py-2 text-sm cursor-pointer font-mono flex items-center justify-between ${idx === suggestionIndex ? 'bg-brand-primary text-white' : 'text-base-content hover:bg-base-100'}`}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent blur
                                insertSuggestion(item);
                            }}
                         >
                             <span>{item}</span>
                             <span className="opacity-50 text-xs uppercase">{suggestionType === 'none' ? '' : (suggestionType.replace('css-', ''))}</span>
                         </li>
                     ))}
                 </ul>
             </div>
          )}

          {/* Color Picker Popup */}
          {showColorPicker && (
              <ColorPicker 
                onSelect={insertColor} 
                onClose={() => setShowColorPicker(false)}
                style={{ 
                    position: 'fixed',
                    top: '15%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    maxWidth: '90vw'
                }}
              />
          )}
          
          <QuickAccessBar 
            onInsert={handleQuickInsert} 
            isOpen={isQuickBarOpen}
            onToggle={() => setIsQuickBarOpen(!isQuickBarOpen)}
            context={editorContext}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
