


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateCode } from './services/geminiService';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import VibePanel from './components/VibePanel';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import RenameModal from './components/RenameModal';
import FileSidebar from './components/FileSidebar';
import type { ActiveView, Project, ChatMessage } from './types';
import { DEFAULT_SOURCE_DOC, DEFAULT_PROJECT_NAME } from './constants';
import { v4 as uuidv4 } from 'uuid'; // Simple unique ID generator

const LOCAL_STORAGE_KEY = 'jovibe-code-session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  
  const [activeView, setActiveView] = useState<ActiveView>('editor');
  const [mode, setMode] = useState<'code' | 'ai'>('code'); // 'code' for editor/preview, 'ai' for vibe/preview
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const currentProject = useMemo(() => {
    return projects.find(p => p.id === currentProjectId) || null;
  }, [projects, currentProjectId]);

  // A separate state for the editor's content to avoid re-rendering the whole app on every keystroke
  const [editorSourceDoc, setEditorSourceDoc] = useState('');

  // Sync editorSourceDoc with the current project's sourceDoc when the project changes
  useEffect(() => {
    if (currentProject) {
      setEditorSourceDoc(currentProject.sourceDoc);
    }
  }, [currentProject]);

  const createDefaultProject = useCallback(() => {
    const newProject: Project = {
        id: uuidv4(),
        name: DEFAULT_PROJECT_NAME,
        sourceDoc: DEFAULT_SOURCE_DOC,
        history: { past: [], future: [] },
        chatHistory: [],
    };
    setProjects([newProject]);
    setCurrentProjectId(newProject.id);
  }, []);

  // Load session from localStorage on initial render
  useEffect(() => {
    try {
        const savedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedSession) {
            const parsedSession = JSON.parse(savedSession);
            
            // Check if session is expired
            if (parsedSession.expiry && Date.now() < parsedSession.expiry) {
                const { projects: savedProjects, currentProjectId: savedCurrentId } = parsedSession.data;

                // Migration: ensure all projects have history and chatHistory objects
                const migratedProjects = savedProjects.map((p: Project) => ({
                    ...p,
                    history: p.history || { past: [], future: [] },
                    chatHistory: p.chatHistory || [],
                }));
                
                if (migratedProjects.length > 0) {
                    setProjects(migratedProjects);
                    // Validate that the saved current project ID is still valid
                    if (savedCurrentId && migratedProjects.some(p => p.id === savedCurrentId)) {
                        setCurrentProjectId(savedCurrentId);
                    } else {
                        setCurrentProjectId(migratedProjects[0].id);
                    }
                    return; // Successfully loaded session
                }
            } else {
                // Session expired, remove it
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        }
        
        // If no valid session was found, create a default project
        createDefaultProject();
    } catch (e) {
        console.error("Failed to load session from localStorage", e);
        // If parsing fails, clear the invalid data and start fresh
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        createDefaultProject();
    }
  }, [createDefaultProject]);

  // Auto-save session to localStorage whenever projects or current project ID change
  useEffect(() => {
    if (projects.length > 0 && currentProjectId) {
        const sessionData = {
            expiry: Date.now() + SESSION_TTL_MS,
            data: {
                projects,
                currentProjectId,
            },
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData));
    }
  }, [projects, currentProjectId]);


  // Debounced effect to commit editor changes to the main project state and history
  useEffect(() => {
    if (!currentProject || editorSourceDoc === currentProject.sourceDoc) {
      return;
    }

    const handler = setTimeout(() => {
      setProjects(prevProjects =>
        prevProjects.map(p => {
          if (p.id === currentProjectId) {
            const newHistory = {
              past: [...p.history.past, p.sourceDoc].slice(-50), // Limit history size
              future: [] as string[] // A new edit clears the future
            };
            return { ...p, sourceDoc: editorSourceDoc, history: newHistory };
          }
          return p;
        })
      );
    }, 800); // 800ms debounce delay

    return () => clearTimeout(handler);
  }, [editorSourceDoc, currentProjectId]);


  const updateCurrentProject = useCallback((updatedProps: Partial<Project>, options: { snapshot?: boolean } = {}) => {
    if (!currentProjectId) return;
    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === currentProjectId) {
            let projectToUpdate = { ...p };
            // If snapshot is requested, save the current state to history
            if (options.snapshot && 'sourceDoc' in updatedProps && updatedProps.sourceDoc !== projectToUpdate.sourceDoc) {
                const newHistory = {
                    past: [...projectToUpdate.history.past, projectToUpdate.sourceDoc].slice(-50),
                    future: [] as string[]
                };
                projectToUpdate.history = newHistory;
            }
            return { ...projectToUpdate, ...updatedProps };
        }
        return p;
      })
    );
  }, [currentProjectId]);

  const handleSourceDocChange = useCallback((newSourceDoc: string) => {
    setEditorSourceDoc(newSourceDoc);
  }, []);
  
  const handleUndo = useCallback(() => {
    setProjects(prevProjects =>
        prevProjects.map(p => {
            if (p.id === currentProjectId) {
                const { past, future } = p.history;
                if (past.length === 0) return p;

                const previousState = past[past.length - 1];
                const newPast = past.slice(0, past.length - 1);
                
                return {
                    ...p,
                    sourceDoc: previousState,
                    history: {
                        past: newPast,
                        future: [p.sourceDoc, ...future]
                    }
                };
            }
            return p;
        })
    );
  }, [currentProjectId]);

  const handleRedo = useCallback(() => {
      setProjects(prevProjects =>
          prevProjects.map(p => {
              if (p.id === currentProjectId) {
                  const { past, future } = p.history;
                  if (future.length === 0) return p;

                  const nextState = future[0];
                  const newFuture = future.slice(1);

                  return {
                      ...p,
                      sourceDoc: nextState,
                      history: {
                          past: [...past, p.sourceDoc],
                          future: newFuture,
                      }
                  };
              }
              return p;
          })
      );
  }, [currentProjectId]);


  const handleVibeRequest = async (prompt: string, image: { data: string; mimeType: string; } | null) => {
    if (!currentProject) return;
    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
        role: 'user',
        content: prompt,
        ...(image && { imageUrl: `data:${image.mimeType};base64,${image.data}` })
    };
    
    // Optimistically update the UI with the user's message
    updateCurrentProject({ chatHistory: [...currentProject.chatHistory, userMessage] });

    try {
      const { sourceDoc: newSourceDoc, summary } = await generateCode(
        prompt,
        currentProject.sourceDoc,
        currentProject.chatHistory,
        image
      );
      
      const modelMessage: ChatMessage = { role: 'model', content: summary };

      updateCurrentProject({ 
        sourceDoc: newSourceDoc,
        // Replace the optimistic user message with the final one and add the model's response
        chatHistory: [...currentProject.chatHistory, userMessage, modelMessage]
      }, { snapshot: true });
      
      // On mobile, switch to preview to show the result
      if (window.innerWidth < 1024) {
        setActiveView('preview');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      // Remove the optimistic user message on error
      updateCurrentProject({ chatHistory: currentProject.chatHistory });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = (newName: string) => {
    let finalName = newName.trim();
    if (finalName) {
      if (!finalName.toLowerCase().endsWith('.html')) {
        finalName += '.html';
      }
      updateCurrentProject({ name: finalName });
    }
    setIsRenameModalOpen(false);
  };

  const handleReset = () => {
    if (currentProject && window.confirm(`Are you sure you want to reset "${currentProject.name}"? This will revert its code to the default template and clear the chat history.`)) {
      updateCurrentProject({ sourceDoc: DEFAULT_SOURCE_DOC, chatHistory: [] }, { snapshot: true });
    }
  };

  const handleCreateNewProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: `new-project-${projects.length + 1}.html`,
      sourceDoc: DEFAULT_SOURCE_DOC,
      history: { past: [], future: [] },
      chatHistory: [],
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
    setIsSidebarOpen(false);
  };

  const handleDeleteProject = (idToDelete: string) => {
    if (window.confirm(`Are you sure you want to permanently delete this project?`)) {
      const newProjects = projects.filter(p => p.id !== idToDelete);
      setProjects(newProjects);

      if (currentProjectId === idToDelete) {
        if (newProjects.length > 0) {
          setCurrentProjectId(newProjects[0].id);
        } else {
          const newProject: Project = {
            id: uuidv4(),
            name: DEFAULT_PROJECT_NAME,
            sourceDoc: DEFAULT_SOURCE_DOC,
            history: { past: [], future: [] },
            chatHistory: [],
          };
          setProjects([newProject]);
          setCurrentProjectId(newProject.id);
        }
      }
    }
  };

  const handleSelectProject = (id: string) => {
    setCurrentProjectId(id);
    setIsSidebarOpen(false);
  };
  
  const handleModeToggle = () => {
    const newMode = mode === 'code' ? 'ai' : 'code';
    setMode(newMode);
    // When switching modes, set a default view for that mode
    if (newMode === 'ai') {
        setActiveView('vibe');
    } else {
        setActiveView('editor');
    }
  };

  if (!currentProject) {
    return <div className="bg-base-100 text-base-content h-screen flex items-center justify-center">Loading...</div>;
  }
  
  const canUndo = (currentProject?.history?.past?.length ?? 0) > 0;
  const canRedo = (currentProject?.history?.future?.length ?? 0) > 0;

  return (
    <div className="flex flex-col h-screen bg-base-100">
       <FileSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={handleSelectProject}
        onCreateNewProject={handleCreateNewProject}
        onDeleteProject={handleDeleteProject}
       />
      <Header onRenameClick={() => setIsRenameModalOpen(true)} onToggleSidebar={() => setIsSidebarOpen(true)} />
      <main className="flex-1 overflow-hidden lg:grid lg:grid-cols-2 lg:gap-2 pt-1.5 px-2 pb-20 lg:pb-2">
        {/* Mobile View */}
        <div className="lg:hidden h-full flex flex-col">
          {mode === 'code' && activeView === 'editor' && <EditorPanel sourceDoc={editorSourceDoc} onSourceDocChange={handleSourceDocChange} fileName={currentProject.name} onUndo={handleUndo} onRedo={handleRedo} canUndo={canUndo} canRedo={canRedo} />}
          {mode === 'ai' && activeView === 'vibe' && <VibePanel onVibeRequest={handleVibeRequest} onReset={handleReset} isLoading={isLoading} error={error} chatHistory={currentProject.chatHistory} />}
          {activeView === 'preview' && <PreviewPanel sourceDoc={editorSourceDoc} />}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex h-full">
          {mode === 'code' ? (
            <EditorPanel sourceDoc={editorSourceDoc} onSourceDocChange={handleSourceDocChange} fileName={currentProject.name} onUndo={handleUndo} onRedo={handleRedo} canUndo={canUndo} canRedo={canRedo} />
          ) : (
            <VibePanel onVibeRequest={handleVibeRequest} onReset={handleReset} isLoading={isLoading} error={error} chatHistory={currentProject.chatHistory} />
          )}
        </div>
        <div className="hidden lg:block h-full">
            <PreviewPanel sourceDoc={editorSourceDoc} />
        </div>
      </main>
      <div className="lg:hidden">
        <BottomNav 
            activeView={activeView} 
            setActiveView={setActiveView} 
            mode={mode}
            onModeToggle={handleModeToggle}
        />
      </div>
       <RenameModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        onSave={handleRename}
        currentFileName={currentProject.name}
      />
    </div>
  );
};

export default App;