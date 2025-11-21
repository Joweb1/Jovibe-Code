

import React from 'react';
import type { ActiveView } from '../types';
import GeminiIcon from './GeminiIcon';

interface BottomNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  mode: 'code' | 'ai';
  onModeToggle: () => void;
}

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, mode, onModeToggle }) => {
  const isPreviewActive = activeView === 'preview';
  
  // The first item in the switch is either 'editor' or 'vibe'
  const firstItemView = mode === 'code' ? 'editor' : 'vibe';
  const firstItemLabel = mode === 'code' ? 'Code' : 'Jovibe AI';
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-base-100/80 backdrop-blur-sm z-20">
      <div className="relative flex justify-center items-center h-16">
        
        {/* Centered Switch Container */}
        <div className="relative flex items-center bg-base-200 p-1.5 rounded-full shadow-lg">
          {/* Animated Highlight */}
          <span
            className="absolute top-1.5 left-1.5 h-[calc(100%-0.75rem)] w-[calc(50%-0.375rem)] bg-brand-primary rounded-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(${isPreviewActive ? '100%' : '0'})` }}
          />
          
          {/* Switch Buttons */}
          <button
            onClick={() => setActiveView(firstItemView as ActiveView)}
            className={`relative z-10 w-40 py-2 text-base font-semibold rounded-full transition-colors duration-300 ${!isPreviewActive ? 'text-white' : 'text-base-content-secondary hover:text-base-content'}`}
          >
            {firstItemLabel}
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`relative z-10 w-40 py-2 text-base font-semibold rounded-full transition-colors duration-300 ${isPreviewActive ? 'text-white' : 'text-base-content-secondary hover:text-base-content'}`}
          >
            Preview
          </button>
        </div>

        {/* Mode Toggle Button */}
        <button
          onClick={onModeToggle}
          className="absolute right-0 flex items-center justify-center h-12 w-12 bg-base-200 text-base-content rounded-full shadow-lg hover:bg-base-300 transition-colors"
          title={mode === 'code' ? 'Switch to AI Mode' : 'Switch to Code Mode'}
        >
          {mode === 'code' ? <GeminiIcon className="h-7 w-7" /> : <CodeIcon />}
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;