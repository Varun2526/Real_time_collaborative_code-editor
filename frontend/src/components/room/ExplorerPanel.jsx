import React, { useState } from 'react';

const ExplorerPanel = ({ files, activeFileId, setActiveFileId, openTabs, setOpenTabs, onAddFile, onDeleteFile }) => {
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const handleFileClick = (fileId) => {
    setActiveFileId(fileId);
    // Add to open tabs if not already open
    setOpenTabs(prev => prev.includes(fileId) ? prev : [...prev, fileId]);
  };

  const handleNewFileInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsAddingFile(false);
    } else if (e.key === 'Enter') {
      if (!newFileName.trim()) {
        setIsAddingFile(false);
        return;
      }
      onAddFile(newFileName.trim());
      setIsAddingFile(false);
      setNewFileName('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[rgba(240,240,250,0.35)] flex items-center justify-between">
        <span className="text-spacex-nav">EXPLORER</span>
        <button
          onClick={() => { setIsAddingFile(true); setNewFileName(''); }}
          className="material-symbols-outlined text-white/50 hover:text-white cursor-pointer transition-colors"
          title="New File"
        >
          note_add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="flex items-center gap-2 px-2 py-2 text-spacex-body text-white cursor-pointer">
          <span className="material-symbols-outlined text-white">folder</span>
          <span className="font-bold tracking-[1px] uppercase">WORKSPACE</span>
        </div>

        <div className="ml-4 mt-2 flex flex-col gap-1">
          {files.map(f => (
            <div
              key={f.id}
              onClick={() => handleFileClick(f.id)}
              className={`group flex items-center justify-between gap-2 px-2 py-2 cursor-pointer transition-colors ${
                activeFileId === f.id
                  ? 'bg-[rgba(240,240,250,0.1)] text-white'
                  : 'text-white/70 hover:bg-[rgba(240,240,250,0.05)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined ${activeFileId === f.id ? 'text-white' : 'text-white/50'}`}>
                  description
                </span>
                <span className="text-spacex-body uppercase">{f.name}</span>
              </div>
              {files.length > 1 && (
                <span
                  onClick={(e) => { e.stopPropagation(); onDeleteFile(f.id); }}
                  className="material-symbols-outlined scale-75 opacity-0 group-hover:opacity-100 hover:text-[#ff3333] transition-opacity cursor-pointer"
                >
                  close
                </span>
              )}
            </div>
          ))}

          {/* Inline Add File Input */}
          {isAddingFile && (
            <div className="flex items-center gap-2 px-2 py-2 bg-[rgba(240,240,250,0.1)] border-l-2 border-white">
              <span className="material-symbols-outlined text-white/50">description</span>
              <input
                type="text"
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={handleNewFileInputKeyDown}
                onBlur={() => setIsAddingFile(false)}
                className="bg-transparent border-none outline-none text-white w-full text-spacex-body uppercase"
                placeholder="FILENAME.EXT"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorerPanel;
