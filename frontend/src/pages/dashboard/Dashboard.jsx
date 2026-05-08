import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import CreateRoomModal from '../../components/create-room/CreateRoomModal';

const API_URL = 'http://localhost:4000/api';

const Dashboard = () => {
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (query = '') => {
    try {
      setLoading(true);
      const [myRoomsRes, searchRes] = await Promise.all([
        axios.get(`${API_URL}/room/my-rooms`, { withCredentials: true }),
        axios.get(`${API_URL}/room/search?q=${query}`, { withCredentials: true })
      ]);
      
      setJoinedRooms(myRoomsRes.data.payload || []);
      setAvailableRooms(searchRes.data.payload || []);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms(searchQuery);
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await axios.post(`${API_URL}/room/${roomId}/request-join`, {}, { withCredentials: true });
      navigate(`/room/${roomId}`);
    } catch (err) {
      if (err.response?.data?.message === "You are already a member") {
         navigate(`/room/${roomId}`);
      } else if (err.response?.data?.message === "Join request already pending") {
         alert("Your request to join this room is pending approval.");
      } else {
         alert(err.response?.data?.message || 'Failed to join room');
      }
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center font-body-base bg-black">
      
      <Navbar onOpenCreateRoom={() => setIsCreateModalOpen(true)} />
      
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 pt-32 pb-20 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 w-full">
        
        {/* Left Column: Joined Rooms */}
        <section className="flex flex-col">
          <h2 className="text-spacex-nav mb-8 tracking-[2px] opacity-70">JOINED ROOMS</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
            {loading ? (
              <div className="text-spacex-body opacity-50 uppercase">Loading telemetry...</div>
            ) : joinedRooms.length === 0 ? (
              <div className="text-spacex-body opacity-50 uppercase">No joined rooms.</div>
            ) : (
              <div className="space-y-8">
                {joinedRooms.map(room => (
                  <div 
                    key={room.roomId} 
                    onClick={() => navigate(`/room/${room.roomId}`)}
                    className="group cursor-pointer border-b border-[rgba(240,240,250,0.1)] pb-6 hover:border-[rgba(240,240,250,0.5)] transition-colors"
                  >
                    <h3 className="text-spacex-h2 text-2xl font-bold uppercase tracking-[1px] mb-2 group-hover:text-white transition-colors">{room.title}</h3>
                    <p className="text-spacex-body opacity-70 line-clamp-2 uppercase">{room.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Available Rooms */}
        <section className="flex flex-col gap-12">
          <form onSubmit={handleSearch} className="w-full relative">
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-white/50 text-[24px]">search</span>
            <input 
              type="text" 
              placeholder="SEARCH PUBLIC ROOMS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-[rgba(240,240,250,0.35)] pl-10 pr-4 py-4 text-spacex-nav text-lg focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
            />
          </form>

          <div className="flex flex-col">
            <h2 className="text-spacex-nav mb-8 tracking-[2px] opacity-70">AVAILABLE ROOMS</h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="text-spacex-body opacity-50 uppercase">Scanning frequencies...</div>
              ) : availableRooms.length === 0 ? (
                <div className="text-spacex-body opacity-50 uppercase">No public rooms.</div>
              ) : (
                <div className="grid grid-cols-1 gap-10">
                  {availableRooms.map(room => (
                    <div 
                      key={room.roomId} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[rgba(240,240,250,0.1)] pb-8 hover:border-[rgba(240,240,250,0.3)] transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-spacex-h2 text-2xl font-bold uppercase tracking-[1px]">{room.title}</h3>
                          <span className="text-spacex-micro border border-white/20 px-2 py-1">{room.language || 'SYS'}</span>
                        </div>
                        <p className="text-spacex-body opacity-70 line-clamp-2 uppercase max-w-xl">{room.description}</p>
                      </div>
                      <button 
                        onClick={() => handleJoinRoom(room.roomId)}
                        className="btn-ghost shrink-0"
                      >
                        JOIN ROOM
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      {isCreateModalOpen && (
        <CreateRoomModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={(roomId) => navigate(`/room/${roomId}`)}
        />
      )}
    </div>
  );
};

export default Dashboard;
