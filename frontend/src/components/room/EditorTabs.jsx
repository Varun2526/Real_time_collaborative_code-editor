import React from 'react';

const EditorTabs = ({ files, openTabs, activeFileId, setActiveFileId, onCloseTab }) => {
  // Only show files that are in the openTabs list
  const tabFiles = openTabs
    .map(id => files.find(f => f.id === id))
    .filter(Boolean);

  return (
    <div className="h-12 bg-black flex items-center border-b border-[rgba(240,240,250,0.35)] overflow-x-auto custom-scrollbar">
      {tabFiles.length > 0 ? (
        tabFiles.map(f => (
          <div
            key={f.id}
            onClick={() => setActiveFileId(f.id)}
            className={`h-full px-4 flex items-center gap-2 text-spacex-nav cursor-pointer shrink-0 transition-colors border-r border-[rgba(240,240,250,0.35)] ${
              activeFileId === f.id
                ? 'bg-[rgba(240,240,250,0.05)] border-t-2 border-t-white text-white'
                : 'border-t-2 border-t-transparent text-white/50 hover:text-white/80 hover:bg-[rgba(240,240,250,0.02)]'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${activeFileId === f.id ? 'text-white' : 'text-white/40'}`}>
              description
            </span>
            <span className="uppercase">{f.name}</span>
            <span
              onClick={(e) => { e.stopPropagation(); onCloseTab(f.id); }}
              className={`material-symbols-outlined text-[14px] ml-1 hover:text-[#ff3333] transition-colors ${
                activeFileId === f.id ? 'text-white/50' : 'text-white/30'
              }`}
            >
              close
            </span>
          </div>
        ))
      ) : (
        <div className="h-full px-6 flex items-center text-white/50 text-spacex-nav">
          NO OPEN FILES
        </div>
      )}
    </div>
  );
};

export default EditorTabs;
