import React from 'react';

interface HeaderProps {
  onRenameClick: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRenameClick, onToggleSidebar }) => {
  return (
    <header className="bg-base-200 p-3 shadow-md flex justify-between items-center z-20">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Jovibe Code Logo" className="h-8 w-8 rounded-full" />
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