import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/constants.js';

const CreateRoomModal = ({ onClose, onSuccess }) => {
  const [roomId, setRoomId] = useState(() => crypto.randomUUID());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'public'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...formData, roomId };
      const res = await axios.post(`${API_URL}/room/create`, payload, { withCredentials: true });
      onSuccess(res.data.payload.roomId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/room/${roomId}`;
    if (navigator.share) {
      navigator.share({
        title: formData.title || 'CodeForge Room',
        text: 'Join my collaborative code editor room!',
        url: shareUrl,
      }).catch(err => console.log('Error sharing', err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[rgba(240,240,250,0.35)] w-full max-w-2xl flex flex-col font-body-base overflow-y-auto max-h-[90vh] relative rounded-2xl custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors z-10"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div className="p-6 sm:p-10">
          <h2 className="text-spacex-hero text-center mb-6 sm:mb-10 text-xl sm:text-2xl tracking-[1.5px]">INITIALIZE NEW ROOM</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-8 max-w-xl mx-auto">
            {error && <div className="text-[#ff3333] border border-[#ff3333] bg-[#ff3333]/10 p-4 text-spacex-nav text-center">{error}</div>}
            
            <div className="flex flex-col gap-2">
              <label className="text-spacex-nav opacity-70">ROOM IDENTIFIER</label>
              <input 
                type="text" 
                disabled 
                value={roomId} 
                className="bg-transparent border-b-2 border-[rgba(240,240,250,0.1)] py-2 text-spacex-body opacity-50 cursor-text select-all"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-spacex-nav opacity-70">DESIGNATION (TITLE)</label>
              <input 
                type="text" 
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-[rgba(240,240,250,0.35)] py-2 text-spacex-nav text-lg focus:outline-none focus:border-white transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-spacex-nav opacity-70">MISSION PARAMETERS (DESCRIPTION)</label>
              <textarea 
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-[rgba(240,240,250,0.35)] py-2 text-spacex-nav text-lg focus:outline-none focus:border-white transition-colors resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <select 
                name="visibility" 
                value={formData.visibility} 
                onChange={handleChange}
                className="bg-transparent text-spacex-nav border-b border-[rgba(240,240,250,0.35)] py-2 outline-none uppercase"
              >
                <option value="public" className="bg-black text-white">PUBLIC BROADCAST</option>
                <option value="private" className="bg-black text-white">ENCRYPTED (PRIVATE)</option>
              </select>
              
              <div className="flex gap-4">
                <button type="button" onClick={handleShare} className="text-spacex-nav text-white/50 hover:text-white transition-colors">SHARE</button>
                <button type="button" onClick={handleCopy} className={`text-spacex-nav transition-colors ${copied ? 'text-white font-bold' : 'text-white/50 hover:text-white'}`}>
                  {copied ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-ghost w-full"
              >
                {loading ? 'INITIALIZING...' : 'LAUNCH ROOM'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
