
export type ActiveView = 'editor' | 'preview' | 'vibe';

export interface ConsoleMessage {
    type: 'log' | 'error' | 'warn' | 'info';
    message: any[];
    timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  imageUrl?: string; // Optional image for user messages
}

export interface Project {
    id: string;
    name: string;
    sourceDoc: string;
    history: {
        past: string[];
        future: string[];
    };
    chatHistory: ChatMessage[];
}
