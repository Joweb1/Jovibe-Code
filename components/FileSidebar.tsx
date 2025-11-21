import React, { useState, useEffect } from 'react';
import type { Project } from '../types';

interface FileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateNewProject: () => void;
  onDeleteProject: (id: string) => void;
}

const FileSidebar: React.FC<FileSidebarProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onCreateNewProject,
  onDeleteProject,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
    
  // Effect to close the active menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu) {
        const target = event.target as HTMLElement;
        // If the click is not on a menu trigger or within the menu content, close it.
        if (!target.closest(`[data-menu-trigger="${activeMenu}"]`) && !target.closest(`[data-menu-content="${activeMenu}"]`)) {
          setActiveMenu(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  const handleDownload = (project: Project) => {
    const blob = new Blob([project.sourceDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = project.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setActiveMenu(null); // Close menu after action
  };

  const handleDelete = (id: string) => {
    onDeleteProject(id);
    setActiveMenu(null); // Close menu after action
  };
  
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-base-200 text-base-content shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-base-300 flex justify-between items-center">
                <h2 className="text-lg font-bold">Projects</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-base-300">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                </button>
            </div>
            <div className="p-2">
                 <button
                    onClick={onCreateNewProject}
                    className="w-full bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-brand-secondary text-sm flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                    </svg>
                    New File
                </button>
            </div>
            <ul className="flex-1 overflow-y-auto p-2 space-y-1">
                {projects.map(project => (
                    <li key={project.id}>
                        <div
                            onClick={() => onSelectProject(project.id)}
                            className={`w-full text-left text-sm p-2 rounded-md cursor-pointer transition-colors flex justify-between items-center ${
                                project.id === currentProjectId ? 'bg-brand-primary text-white' : 'hover:bg-base-300'
                            }`}
                        >
                           <span className="truncate flex-1 pr-2">{project.name}</span>
                           <div className="relative">
                               <button
                                title="More options"
                                data-menu-trigger={project.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(prev => (prev === project.id ? null : project.id));
                                }}
                                className={`p-1 rounded-full ${project.id === currentProjectId ? 'hover:bg-white/20' : 'hover:bg-base-100'}`}
                               >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                                  </svg>
                               </button>

                               {activeMenu === project.id && (
                                  <div
                                    data-menu-content={project.id}
                                    className="absolute right-0 top-full mt-1 w-40 bg-base-100 rounded-lg shadow-xl z-10 border border-base-300 p-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button 
                                      onClick={() => handleDownload(project)}
                                      className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-base-300 transition-colors text-sm text-base-content"
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" /><path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" /></svg>
                                       Download
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(project.id)}
                                      className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-red-500/20 text-red-400 transition-colors text-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" /></svg>
                                        Delete
                                    </button>
                                  </div>
                               )}
                           </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </aside>
    </>
  );
};

export default FileSidebar;