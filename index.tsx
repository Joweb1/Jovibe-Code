import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Add uuid for unique project IDs
// Note: In a real project, this would be a proper package import.
// For this environment, we'll use a simple in-memory version if not available.
// FIX: Declare v4 on the Window interface to satisfy TypeScript and align with usage.
declare global {
    interface Window {
        v4: () => string;
    }
}
// FIX: Changed polyfill to provide `window.v4` to match the destructuring below.
if (!window.v4) {
    window.v4 = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
const { v4: uuidv4 } = window;


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);