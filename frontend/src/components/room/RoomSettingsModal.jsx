import React, { useState, useEffect } from 'react';

// Style for select/option visibility
const selectStyleSheet = `
  select option {
    background-color: #1a1a1a;
    color: #f0f0fa;
    padding: 8px 4px;
  }
  select option:hover {
    background-color: #2a2a2a;
  }
`;

const RoomSettingsModal = ({ isOpen, room, onClose, onUpdateRoom, onLeaveRoom, onDeleteRoom, isOwner }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [title, setTitle] = useState(room?.title || '');
  const [description, setDescription] = useState(room?.description || '');
  const [visibility, setVisibility] = useState(room?.visibility || 'private');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync form fields when room data changes
  useEffect(() => {
    if (room) {
      setTitle(room.title || '');
      setDescription(room.description || '');
      setVisibility(room.visibility || 'private');
    }
  }, [room]);

  // Add select option styles when modal is open
  useEffect(() => {
    if (isOpen) {
      const style = document.createElement('style');
      style.textContent = selectStyleSheet;
      style.id = 'room-settings-select-styles';
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('room-settings-select-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [isOpen]);

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (!title.trim()) {
      setError('Room title is required');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateRoom({ title, description, visibility });
      setSuccessMsg('Room information updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
      }, 2000);
    } catch (err) {
      console.error('Update room error:', err);
      setError(err.message || 'Failed to update room');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (window.confirm('Are you sure you want to leave this room?')) {
      setError('');
      setIsSaving(true);
      try {
        await onLeaveRoom();
        // onLeaveRoom handles navigation, so we don't need to do anything here
      } catch (err) {
        console.error('Leave room error:', err);
        setError(err.message || 'Failed to leave room');
        setIsSaving(false);
      }
    }
  };

  const handleDeleteRoom = async () => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      setError('');
      setIsSaving(true);
      try {
        await onDeleteRoom();
        // onDeleteRoom handles navigation, so we don't need to do anything here
      } catch (err) {
        console.error('Delete room error:', err);
        setError(err.message || 'Failed to delete room');
        setIsSaving(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[rgba(240,240,250,0.35)] rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[rgba(240,240,250,0.35)]">
          <h2 className="text-spacex-nav text-white">Room Settings</h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[rgba(240,240,250,0.35)]">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 px-4 py-3 text-spacex-body transition-colors ${
              activeTab === 'info'
                ? 'text-white border-b-2 border-white'
                : 'text-white/50 hover:text-white/70 border-b-2 border-transparent'
            }`}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`flex-1 px-4 py-3 text-spacex-body transition-colors ${
              activeTab === 'danger'
                ? 'text-white border-b-2 border-white'
                : 'text-white/50 hover:text-white/70 border-b-2 border-transparent'
            }`}
          >
            Actions
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-[rgba(255,50,50,0.1)] border border-red-500/50 rounded text-red-400 text-spacex-body">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-[rgba(50,200,50,0.1)] border border-green-500/50 rounded text-green-400 text-spacex-body">
              {successMsg}
            </div>
          )}

          {/* Information Tab */}
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateRoom} className="space-y-4">
              <div>
                <label className="block text-spacex-body text-white/70 mb-2">Room Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[rgba(240,240,250,0.05)] border border-[rgba(240,240,250,0.35)] rounded px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  placeholder="Enter room title"
                  disabled={!isOwner}
                />
              </div>

              <div>
                <label className="block text-spacex-body text-white/70 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[rgba(240,240,250,0.05)] border border-[rgba(240,240,250,0.35)] rounded px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors resize-none h-24"
                  placeholder="Enter room description"
                  disabled={!isOwner}
                />
              </div>

              <div>
                <label className="block text-spacex-body text-white/70 mb-2">Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full bg-[rgba(240,240,250,0.05)] border border-[rgba(240,240,250,0.35)] rounded px-3 py-2 text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  disabled={!isOwner}
                >
                  <option value="private" className="bg-black text-white">Private</option>
                  <option value="public" className="bg-black text-white">Public</option>
                </select>
              </div>

              {isOwner && (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-white text-black px-4 py-2 rounded font-bold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              )}

              {!isOwner && (
                <p className="text-spacex-body text-white/50 text-center">
                  Only the room owner can update these settings
                </p>
              )}
            </form>
          )}

          {/* Actions Tab */}
          {activeTab === 'danger' && (
            <div className="space-y-4">
              {/* Leave Room Button */}
              <button
                onClick={handleLeaveRoom}
                disabled={isSaving}
                className="w-full bg-[rgba(255,150,50,0.1)] hover:bg-[rgba(255,150,50,0.2)] disabled:opacity-50 disabled:cursor-not-allowed border border-orange-500/50 text-orange-400 px-4 py-3 rounded transition-colors flex items-center justify-center gap-2 text-spacex-body"
              >
                <span className="material-symbols-outlined">logout</span>
                {isSaving ? 'Processing...' : 'Leave Room'}
              </button>

              {/* Delete Room Button - Only for Owner */}
              {isOwner && (
                <button
                  onClick={handleDeleteRoom}
                  disabled={isSaving}
                  className="w-full bg-[rgba(255,50,50,0.1)] hover:bg-[rgba(255,50,50,0.2)] disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/50 text-red-400 px-4 py-3 rounded transition-colors flex items-center justify-center gap-2 text-spacex-body"
                >
                  <span className="material-symbols-outlined">delete</span>
                  {isSaving ? 'Processing...' : 'Delete Room'}
                </button>
              )}

              {!isOwner && (
                <p className="text-spacex-body text-white/50 p-3 bg-[rgba(240,240,250,0.05)] rounded border border-[rgba(240,240,250,0.35)]">
                  Only the room owner can delete the room. You can leave the room using the button above.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomSettingsModal;
