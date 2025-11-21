import React, { useState, useEffect } from 'react';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  currentFileName: string;
}

const RenameModal: React.FC<RenameModalProps> = ({ isOpen, onClose, onSave, currentFileName }) => {
  const [newName, setNewName] = useState(currentFileName);

  useEffect(() => {
    if (isOpen) {
      setNewName(currentFileName);
    }
  }, [currentFileName, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (newName.trim()) {
      onSave(newName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-base-200 p-6 rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Rename File</h2>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 bg-base-300 rounded-md border border-base-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          autoFocus
        />
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="bg-base-300 hover:bg-opacity-80 text-base-content font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;
