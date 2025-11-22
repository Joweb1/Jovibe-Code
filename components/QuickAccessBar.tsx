
import React, { useEffect, useRef } from 'react';

interface QuickAccessBarProps {
  onInsert: (text: string, type: 'text' | 'tag' | 'func' | 'smartClose' | 'indent') => void;
  isOpen: boolean;
  onToggle: () => void;
  context: 'html' | 'css' | 'javascript';
}

interface QuickItem {
  label: string;
  value: string;
  type: 'text' | 'tag' | 'func' | 'smartClose' | 'indent';
  display?: React.ReactNode;
}

const IndentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
  </svg>
);

const CloseTagIcon = () => (
  <span className="font-mono font-bold text-brand-accent">&lt;/&gt;</span>
);

const HTML_ITEMS: QuickItem[] = [
  { label: 'Indent', value: '  ', type: 'indent', display: <IndentIcon /> },
  { label: 'Close Tag', value: '', type: 'smartClose', display: <CloseTagIcon /> },
  { label: '<', value: '<', type: 'text' },
  { label: '>', value: '>', type: 'text' },
  { label: '/', value: '/', type: 'text' },
  { label: '=', value: '=', type: 'text' },
  { label: '"', value: '"', type: 'text' },
  { label: 'div', value: 'div', type: 'tag' },
  { label: 'span', value: 'span', type: 'tag' },
  { label: 'class', value: 'class=""', type: 'func' },
  { label: 'id', value: 'id=""', type: 'func' },
  { label: 'a', value: 'a', type: 'tag' },
  { label: 'img', value: 'img', type: 'tag' },
  { label: 'p', value: 'p', type: 'tag' },
  { label: 'ul', value: 'ul', type: 'tag' },
  { label: 'li', value: 'li', type: 'tag' },
  { label: 'br', value: 'br', type: 'tag' },
  { label: 'style', value: 'style', type: 'tag' },
  { label: 'script', value: 'script', type: 'tag' },
];

const CSS_ITEMS: QuickItem[] = [
  { label: 'Indent', value: '  ', type: 'indent', display: <IndentIcon /> },
  { label: '{ }', value: '{\n  \n}', type: 'func' },
  { label: ':', value: ': ', type: 'text' },
  { label: ';', value: ';', type: 'text' },
  { label: '.', value: '.', type: 'text' },
  { label: '#', value: '#', type: 'text' },
  { label: 'px', value: 'px', type: 'text' },
  { label: '%', value: '%', type: 'text' },
  { label: 'rem', value: 'rem', type: 'text' },
  { label: '!imp', value: '!important', type: 'text' },
  { label: 'flex', value: 'display: flex;', type: 'text' },
  { label: 'grid', value: 'display: grid;', type: 'text' },
  { label: 'color', value: 'color: ', type: 'text' },
  { label: 'bg', value: 'background: ', type: 'text' },
  { label: 'margin', value: 'margin: ', type: 'text' },
  { label: 'padding', value: 'padding: ', type: 'text' },
];

const JS_ITEMS: QuickItem[] = [
  { label: 'Indent', value: '  ', type: 'indent', display: <IndentIcon /> },
  { label: '{ }', value: '{\n  \n}', type: 'func' },
  { label: '( )', value: '()', type: 'func' },
  { label: '[ ]', value: '[]', type: 'func' },
  { label: '=>', value: ' => ', type: 'text' },
  { label: '=', value: ' = ', type: 'text' },
  { label: '.', value: '.', type: 'text' },
  { label: ';', value: ';', type: 'text' },
  { label: 'const', value: 'const ', type: 'text' },
  { label: 'let', value: 'let ', type: 'text' },
  { label: 'func', value: 'function () {\n  \n}', type: 'func' },
  { label: 'if', value: 'if () {\n  \n}', type: 'func' },
  { label: 'else', value: 'else {\n  \n}', type: 'func' },
  { label: 'return', value: 'return ', type: 'text' },
  { label: 'log', value: 'console.log()', type: 'func' },
];

const LAYERS = [
  { name: 'HTML', items: HTML_ITEMS, color: 'text-brand-primary bg-brand-primary/10' },
  { name: 'CSS', items: CSS_ITEMS, color: 'text-blue-400 bg-blue-400/10' },
  { name: 'JS', items: JS_ITEMS, color: 'text-yellow-400 bg-yellow-400/10' },
];

export const QuickAccessBar: React.FC<QuickAccessBarProps> = ({ onInsert, isOpen, onToggle, context }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the correct layer based on context
  useEffect(() => {
    if (scrollContainerRef.current) {
      const layerIndex = context === 'javascript' ? 2 : context === 'css' ? 1 : 0;
      const width = scrollContainerRef.current.clientWidth;
      
      scrollContainerRef.current.scrollTo({
        left: layerIndex * width,
        behavior: 'smooth'
      });
    }
  }, [context]);

  return (
    <div 
        className={`absolute top-0 bottom-0 right-0 z-40 flex transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[4.5rem]'}`}
    >
      {/* Toggle Button (Tab) */}
      <div className="flex flex-col justify-center items-end h-full w-6 relative z-50 pointer-events-none">
        <button
          onClick={onToggle}
          className="pointer-events-auto bg-base-300 border border-base-100 border-r-0 rounded-l-lg p-1 shadow-[-2px_0_5px_rgba(0,0,0,0.1)] hover:bg-base-100 text-brand-primary transition-colors -mr-[1px]"
          title={isOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          {isOpen ? (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
               <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
             </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
               <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" />
             </svg>
          )}
        </button>
      </div>

      {/* Main Vertical Bar */}
      <div className="w-[4.5rem] bg-base-300 border-l border-base-100 shadow-xl h-full relative flex flex-col">
        
        {/* Horizontal Scroll Container (Layers) */}
        {/* Using Native Snap Scrolling for X-axis switching */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide flex flex-row"
        >
            {LAYERS.map((layer, idx) => (
                <div key={idx} className="w-[4.5rem] h-full flex-shrink-0 snap-center flex flex-col">
                    {/* Header */}
                    <div className={`h-8 flex items-center justify-center text-xs font-bold border-b border-base-100 ${layer.color}`}>
                        {layer.name}
                    </div>

                    {/* Vertical Scroll Container (Items) */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide p-2 pb-4 flex flex-col gap-2">
                        {layer.items.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => onInsert(item.value, item.type)}
                                className="w-full h-10 flex-shrink-0 bg-base-100 hover:bg-base-200 rounded border border-base-content/5 text-base-content font-mono text-sm flex items-center justify-center active:scale-95 transition-transform shadow-sm"
                                title={item.label}
                            >
                                {item.display || item.label}
                            </button>
                        ))}
                        {/* Spacer */}
                        <div className="h-12 flex-shrink-0"></div>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Paginator Dots */}
         <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none opacity-30">
            <div className={`w-1 h-1 rounded-full ${context === 'html' ? 'bg-brand-primary' : 'bg-base-content'}`}></div>
            <div className={`w-1 h-1 rounded-full ${context === 'css' ? 'bg-brand-primary' : 'bg-base-content'}`}></div>
            <div className={`w-1 h-1 rounded-full ${context === 'javascript' ? 'bg-brand-primary' : 'bg-base-content'}`}></div>
         </div>
      </div>
    </div>
  );
};
