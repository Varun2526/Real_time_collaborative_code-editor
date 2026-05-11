import React from 'react';

const RoomDetailsModal = ({ room, onClose, onAction }) => {
  if (!room) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-black border border-[rgba(240,240,250,0.35)] w-full max-w-lg flex flex-col font-body-base overflow-hidden relative p-8 gap-6" 
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
            <h2 className="text-spacex-h2 text-2xl font-bold uppercase tracking-[1px]">{room.title}</h2>
            {room.language && (
              <span className="text-spacex-micro border border-white/20 px-2 py-1">{room.language}</span>
            )}
          </div>
          <span className={`text-spacex-micro px-2 py-1 border w-max ${
            room.visibility === 'private' 
              ? 'border-red-500/50 text-red-400 bg-red-500/10' 
              : 'border-green-500/50 text-green-400 bg-green-500/10'
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
            className="text-spacex-nav text-white/50 hover:text-white transition-colors"
          >
            CANCEL
          </button>
          <button 
            onClick={onAction}
            className="btn-ghost"
          >
            {room.isJoined ? 'ENTER ROOM' : 'JOIN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;
