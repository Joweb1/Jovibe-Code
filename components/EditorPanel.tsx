
import React, { useEffect, useMemo, useRef } from 'react';

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
    }
  };

  // Consistent typographic styles are crucial for aligning the textarea cursor with the highlighted code.
  // These styles must be shared across the line numbers, the textarea, and the code preview. We add
  // explicit, browser-level rules for anti-aliasing and font synthesis to ensure pixel-perfect rendering.
  const sharedTypoClasses = "font-mono font-normal text-base leading-6 tracking-normal [font-variant-ligatures:none] [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale] [font-synthesis:none] [tab-size:4]";
  const editorPaddingClasses = "p-4";

  return (
    <div className="flex flex-col h-full bg-base-200 rounded-lg overflow-hidden border border-base-300">
       <div className="bg-base-300 border-b border-base-300 px-4 py-2 text-sm font-medium text-base-content flex justify-between items-center">
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
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className={`py-4 pl-4 pr-2 text-right text-base-content-secondary select-none bg-base-300 overflow-y-hidden ${sharedTypoClasses}`}
          aria-hidden="true"
        >
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>
        
        {/* Editor Area */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={sourceDoc}
            onChange={(e) => onSourceDocChange(e.target.value)}
            onScroll={handleScroll}
            className={`absolute inset-0 w-full h-full bg-transparent text-transparent caret-white z-10 overflow-auto resize-none focus:outline-none whitespace-pre ${sharedTypoClasses} ${editorPaddingClasses}`}
            placeholder={`Write your HTML, CSS, and JavaScript code here...`}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
          />
          <pre 
            ref={preRef} 
            className={`language-html absolute inset-0 w-full h-full pointer-events-none overflow-auto whitespace-pre ${sharedTypoClasses} ${editorPaddingClasses}`}
            aria-hidden="true">
            <code ref={codeRef} className="language-html">
              {sourceDoc + '\n'}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
