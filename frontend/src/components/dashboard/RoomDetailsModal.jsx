import React from 'react';

const RoomDetailsModal = ({ room, onClose, onAction }) => {
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-black border border-[rgba(240,240,250,0.35)] p-8 max-w-lg w-full rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative flex flex-col gap-6" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 material-symbols-outlined text-white/50 hover:text-white transition-colors"
        >
          close
        </button>
        
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3 pr-8">
            <h2 className="text-spacex-h2 text-3xl font-bold uppercase tracking-[1.5px]">{room.title}</h2>
            {room.language && (
              <span className="text-spacex-micro border border-white/20 px-2.5 py-1 rounded-sm bg-white/5">{room.language}</span>
            )}
          </div>
          <span className={`text-spacex-micro px-2.5 py-1 rounded-sm border backdrop-blur-sm w-max ${
            room.visibility === 'private' 
              ? 'border-red-500/30 text-red-400 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
              : 'border-green-500/30 text-green-400 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
          }`}>
            {room.visibility === 'private' ? 'PRIVATE' : 'PUBLIC'}
          </span>
        </div>

        <div className="flex-1">
          <p className="text-spacex-body opacity-80 uppercase leading-relaxed max-h-48 overflow-y-auto custom-scrollbar pr-2">
            {room.description || "NO DESCRIPTION PROVIDED."}
          </p>
        </div>

        <div className="flex items-center justify-end gap-4 mt-4">
          <button 
            onClick={onClose}
            className="text-spacex-nav text-white/60 hover:text-white transition-colors"
          >
            CANCEL
          </button>
          <button 
            onClick={onAction}
            className="btn-ghost hover:scale-105 transform transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            {room.isJoined ? 'ENTER ROOM' : 'JOIN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;
