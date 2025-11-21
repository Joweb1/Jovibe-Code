

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import GeminiIcon from './GeminiIcon';

interface VibePanelProps {
  onVibeRequest: (prompt: string, image: { data: string, mimeType: string } | null) => void;
  onReset: () => void;
  isLoading: boolean;
  error: string | null;
  chatHistory: ChatMessage[];
}

const LoadingJokes = [
    "Compiling humor modules...",
    "Brewing coffee for the AI...",
    "Why don't programmers like nature? It has too many bugs.",
    "Teaching the AI to code... and to dream.",
    "Reticulating splines...",
    "What's a programmer's favorite hangout place? Foo Bar.",
    "Polishing the pixels...",
    "Why did the computer keep sneezing? It had a virus."
];

const LoadingIndicator = () => {
    const [joke, setJoke] = useState(LoadingJokes[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setJoke(prevJoke => {
                const currentIndex = LoadingJokes.indexOf(prevJoke);
                const nextIndex = (currentIndex + 1) % LoadingJokes.length;
                return LoadingJokes[nextIndex];
            });
        }, 2500);
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="flex items-center gap-3 p-4 text-base-content-secondary animate-pulse">
            <GeminiIcon className="h-6 w-6 text-brand-primary" />
            <p className="text-sm font-medium">{joke}</p>
        </div>
    );
};


const VibePanel: React.FC<VibePanelProps> = ({ onVibeRequest, onReset, isLoading, error, chatHistory }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<{ data: string; mimeType: string; dataUrl: string } | null>(null);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (prompt.trim() && !isLoading) {
      onVibeRequest(prompt, image ? { data: image.data, mimeType: image.mimeType } : null);
      setPrompt('');
      setImage(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setImage({
                data: base64String,
                mimeType: file.type,
                dataUrl: URL.createObjectURL(file)
            });
        };
        reader.readAsDataURL(file);
    }
    setIsAttachmentMenuOpen(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
      }
  };
  
  return (
    <div className="flex flex-col h-full bg-base-200 rounded-lg overflow-hidden border border-base-300">
      <div className="p-4 border-b border-base-300 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <GeminiIcon className="h-6 w-6 text-brand-primary" />
          <h2 className="text-lg font-bold">Jovibe with AI</h2>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-base-content-secondary hover:text-red-400 transition-colors"
          title="Reset to default code"
        >
          Reset Progress
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             {msg.role === 'model' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center">
                  <GeminiIcon className="w-5 h-5 text-white" />
                </div>
             )}
            <div className={`max-w-xl rounded-2xl p-4 ${msg.role === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-base-300 text-base-content rounded-bl-none'}`}>
              {msg.imageUrl && <img src={msg.imageUrl} alt="User attachment" className="rounded-lg mb-2 max-h-48" />}
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && <LoadingIndicator />}
        {error && <p className="text-red-400 text-sm px-4 py-2 bg-red-500/10 rounded-lg">{error}</p>}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-base-300 bg-base-200">
        <div className="relative">
          {image && (
            <div className="absolute bottom-full left-0 mb-2 p-1 bg-base-300 rounded-lg shadow-md">
                <img src={image.dataUrl} alt="Preview" className="h-16 w-16 object-cover rounded" />
                <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">&times;</button>
            </div>
          )}
          <div className="relative flex items-center gap-2 p-1 bg-base-300 rounded-2xl">
              <div className="relative">
                 <button 
                    onClick={() => setIsAttachmentMenuOpen(p => !p)}
                    className="flex-shrink-0 h-10 w-10 rounded-full bg-base-100 hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-center"
                    title="Add file"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
                 </button>
                 {isAttachmentMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-40 bg-base-100 rounded-lg shadow-xl border border-base-300 p-2">
                       <button onClick={() => fileInputRef.current?.click()} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-base-300 transition-colors text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M1 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2-2H3a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.53a.75.75 0 0 1 1.5 0V4h10V3a1 1 0 0 0-1-1H3ZM13.5 7a.75.75 0 0 1-.75.75H3.25a.75.75 0 0 1 0-1.5h9.5a.75.75 0 0 1 .75.75Zm-4-2.5a.75.75 0 0 0 0-1.5H6.25a.75.75 0 0 0 0 1.5h3.25Z" clipRule="evenodd" /></svg>
                          Add Image
                       </button>
                       <button disabled className="w-full text-left flex items-center gap-2 p-2 rounded-md transition-colors text-sm text-base-content-secondary opacity-50 cursor-not-allowed">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 2a1.5 1.5 0 0 1 1.5-1.5h4.152a1.5 1.5 0 0 1 1.04.417l2.854 2.94A1.5 1.5 0 0 1 14 5.059V12.5A1.5 1.5 0 0 1 12.5 14H4A1.5 1.5 0 0 1 2.5 12.5v-10A1.5 1.5 0 0 1 4 2Zm6.5 1.5v1.5a.5.5 0 0 0 .5.5h1.5L10.5 3.5Z" clipRule="evenodd" /></svg>
                          Add PDF
                       </button>
                    </div>
                 )}
                 <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
              </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the changes you want..."
              className="flex-1 p-2.5 bg-transparent text-base-content font-sans text-sm rounded-lg resize-none focus:outline-none max-h-32"
              rows={1}
              disabled={isLoading}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading || !prompt.trim()}
                className="flex-shrink-0 h-10 w-10 rounded-full bg-base-100 hover:bg-brand-primary hover:text-white disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                title="Send"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 3.105a.75.75 0 0 1 .814-.156l12.42 6.21a.75.75 0 0 1 0 1.302l-12.42 6.21a.75.75 0 0 1-.97-1.146L4.54 10 2.95 3.952a.75.75 0 0 1 .155-.847Z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibePanel;