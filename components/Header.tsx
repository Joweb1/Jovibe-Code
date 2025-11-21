import React from 'react';

interface HeaderProps {
  onRenameClick: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRenameClick, onToggleSidebar }) => {
  return (
    <header className="bg-base-200 p-3 shadow-md flex justify-between items-center z-20">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M14.474 2.376a1.25 1.25 0 00-1.423-.442l-8.5 3.75a1.25 1.25 0 00-.801 1.15V17.25a1.25 1.25 0 001.25 1.25h.183a1.25 1.25 0 001.196-1.02L7.5 13l3.24 3.24a1.25 1.25 0 001.768 0l5.25-5.25a1.25 1.25 0 000-1.768L13.75 5.21l3.73-2.072a1.25 1.25 0 00-.006-2.762zM9.526 8.5H6.25a.75.75 0 000 1.5h3.276a.75.75 0 000-1.5z" clipRule="evenodd" />
        </svg>
        <h1 className="text-xl font-bold text-base-content">Jovibe Code</h1>
      </div>
      <div className="flex items-center gap-2">
         <button
          onClick={onRenameClick}
          className="bg-base-300 hover:bg-opacity-80 text-base-content font-semibold p-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          title="Rename file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
          </svg>
        </button>
        <button
          onClick={onToggleSidebar}
          className="bg-base-300 hover:bg-opacity-80 text-base-content font-semibold p-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          title="Open projects"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;