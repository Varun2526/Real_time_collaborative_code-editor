import React from 'react';

const EditorTabs = ({ files, openTabs, activeFileId, setActiveFileId, onCloseTab }) => {
  const tabFiles = openTabs
    .map(id => files.find(f => f.id === id))
    .filter(Boolean);

  return (
    <div className="editor-tabs-bar h-9 bg-[#1e1e1e] flex items-end overflow-x-auto shrink-0">
      {tabFiles.length > 0 ? (
        tabFiles.map(f => (
          <div
            key={f.id}
            onClick={() => setActiveFileId(f.id)}
            className={`editor-tab h-9 px-4 flex items-center gap-2 cursor-pointer shrink-0 transition-colors text-[13px] tracking-wide uppercase font-medium ${
              activeFileId === f.id
                ? 'editor-tab-active bg-[#1e1e1e] text-white border-t border-t-white border-b border-b-[#1e1e1e] -mb-[1px] z-10'
                : 'editor-tab-inactive bg-[#2d2d2d] text-white/50 hover:text-white/80 border-t border-t-transparent border-b border-b-[rgba(240,240,250,0.1)]'
            }`}
          >
            <span className={`material-symbols-outlined text-[14px] ${activeFileId === f.id ? 'text-white/70' : 'text-white/30'}`}>
              description
            </span>
            <span>{f.name}</span>
            <span
              onClick={(e) => { e.stopPropagation(); onCloseTab(f.id); }}
              className="material-symbols-outlined text-[14px] ml-1 hover:text-[#ff3333] transition-all cursor-pointer"
              style={{ opacity: activeFileId === f.id ? 0.6 : 0.35 }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = activeFileId === f.id ? 0.6 : 0.35}
            >
              close
            </span>
          </div>
        ))
      ) : (
        <div className="h-9 px-6 flex items-center text-white/30 text-[13px] tracking-wide uppercase">
          NO OPEN FILES
        </div>
      )}
      {/* Fill remaining space with dark background */}
      <div className="flex-1 h-9 border-b border-[rgba(240,240,250,0.1)]" />
    </div>
  );
};

export default EditorTabs;
