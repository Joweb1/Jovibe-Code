

import React, { useState, useEffect, useMemo } from 'react';
import type { ConsoleMessage } from '../types';

interface PreviewPanelProps {
  sourceDoc: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ sourceDoc }) => {
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  
  const finalSrcDoc = useMemo(() => {
    const consoleInterceptor = `
      <script>
        // Clear previous console messages on reload
        if (window.parent) {
          window.parent.postMessage({ command: 'clear' }, '*');
        }
        const originalConsole = { ...window.console };
        const post = (type, args) => {
          if (window.parent) {
            // Attempt to serialize arguments safely
            const serializableArgs = args.map(arg => {
              try {
                if (arg instanceof Error) {
                  return arg.toString();
                }
                // Basic check for circular references, not exhaustive
                if (typeof arg === 'object' && arg !== null) {
                  const cache = new Set();
                  return JSON.parse(JSON.stringify(arg, (key, value) => {
                    if (typeof value === 'object' && value !== null) {
                      if (cache.has(value)) {
                        return '[Circular]';
                      }
                      cache.add(value);
                    }
                    return value;
                  }));
                }
                return arg;
              } catch (e) {
                return 'Unserializable Object';
              }
            });
            window.parent.postMessage({ type, message: serializableArgs, timestamp: new Date().toLocaleTimeString() }, '*');
          }
        };
        window.console.log = (...args) => { post('log', args); originalConsole.log(...args); };
        window.console.error = (...args) => { post('error', args); originalConsole.error(...args); };
        window.console.warn = (...args) => { post('warn', args); originalConsole.warn(...args); };
        window.console.info = (...args) => { post('info', args); originalConsole.info(...args); };
        window.addEventListener('error', (e) => {
          post('error', [e.message, 'at', e.filename + ':' + e.lineno]);
        });
      </script>
    `;
    if (sourceDoc.includes('</head>')) {
        return sourceDoc.replace('</head>', `${consoleInterceptor}</head>`);
    } else {
        return `${consoleInterceptor}${sourceDoc}`;
    }
  }, [sourceDoc]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // A basic security check
      if (event.source !== (document.getElementById('preview-iframe') as HTMLIFrameElement)?.contentWindow) {
        return;
      }

      if (event.data.command === 'clear') {
        setConsoleMessages([]);
      } else if (event.data.type && event.data.message) {
        setConsoleMessages((prev) => [...prev, event.data]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-base-content';
    }
  };

  return (
    <div className="flex flex-col h-full bg-base-200 rounded-lg overflow-hidden border border-base-300">
      <iframe
        id="preview-iframe"
        key={sourceDoc} 
        srcDoc={finalSrcDoc}
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
        className="flex-1 w-full h-2/3 border-b border-base-300 bg-white"
      />
      <div className={`${isConsoleCollapsed ? 'flex-none' : 'h-1/3'} flex flex-col`}>
        <div className="flex justify-between items-center bg-base-300 px-4 py-1 border-b border-base-300">
           <h3 className="text-sm font-semibold">Console</h3>
           <div className="flex items-center gap-2">
            <button onClick={() => setConsoleMessages([])} className="text-xs text-base-content-secondary hover:text-base-content">Clear</button>
            <button 
                onClick={() => setIsConsoleCollapsed(p => !p)} 
                className="p-1 rounded-full text-base-content-secondary hover:bg-base-100"
                title={isConsoleCollapsed ? 'Show Console' : 'Hide Console'}
            >
                {isConsoleCollapsed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 0 1-1.06-.02L10 8.832 6.29 12.77a.75.75 0 1 1-1.08-1.04l4.25-4.5a.75.75 0 0 1 1.08 0l4.25 4.5a.75.75 0 0 1-.02 1.06Z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
           </div>
        </div>
        <div className={`flex-1 p-2 overflow-y-auto font-mono text-xs ${isConsoleCollapsed ? 'hidden' : ''}`}>
          {consoleMessages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2 py-1 border-b border-base-300/50 ${getMessageColor(msg.type)}`}>
              <span className="text-base-content-secondary">{msg.timestamp}</span>
              <div className="flex-1 whitespace-pre-wrap break-all">
                {Array.isArray(msg.message) && msg.message.map((arg, i) => (
                  <span key={i}>{typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)} </span>
                ))}
              </div>
            </div>
          ))}
          {consoleMessages.length === 0 && (
            <div className="text-base-content-secondary italic text-center pt-4">Console is empty.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;