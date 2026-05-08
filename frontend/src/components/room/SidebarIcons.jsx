import React from 'react';

const SidebarIcons = ({ activeSidebarTab, setActiveSidebarTab, showChat, setShowChat, unreadMessages, roomInitial }) => {
  const handleTabClick = (tab) => {
    setActiveSidebarTab(prev => prev === tab ? null : tab);
  };

  return (
    <aside className="bg-black fixed left-0 top-20 bottom-0 flex flex-col items-center py-6 w-16 z-40 border-r border-[rgba(240,240,250,0.35)]">
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Room Initial */}
        <div className="w-10 h-10 border border-white flex items-center justify-center mb-6 text-white font-bold text-xl uppercase">
          {roomInitial || 'K'}
        </div>

        {/* Explorer Toggle */}
        <button
          onClick={() => handleTabClick('explorer')}
          className={`flex flex-col items-center gap-1 w-full py-3 transition-all ${
            activeSidebarTab === 'explorer'
              ? 'text-white opacity-100 border-l-2 border-white'
              : 'text-white opacity-50 hover:opacity-100 border-l-2 border-transparent'
          }`}
          title="Explorer"
        >
          <span className="material-symbols-outlined">folder_open</span>
        </button>

        {/* Members Toggle */}
        <button
          onClick={() => handleTabClick('members')}
          className={`flex flex-col items-center gap-1 w-full py-3 transition-all ${
            activeSidebarTab === 'members'
              ? 'text-white opacity-100 border-l-2 border-white'
              : 'text-white opacity-50 hover:opacity-100 border-l-2 border-transparent'
          }`}
          title="Members"
        >
          <span className="material-symbols-outlined">groups</span>
        </button>

        {/* Chat Toggle */}
        <button
          onClick={() => setShowChat(prev => !prev)}
          className={`relative flex flex-col items-center gap-1 w-full py-3 transition-all ${
            showChat
              ? 'text-white opacity-100 border-l-2 border-white'
              : 'text-white opacity-50 hover:opacity-100 border-l-2 border-transparent'
          }`}
          title="Chat"
        >
          <span className="material-symbols-outlined">chat_bubble</span>
          {unreadMessages > 0 && !showChat && (
            <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-white rounded-full" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default SidebarIcons;
