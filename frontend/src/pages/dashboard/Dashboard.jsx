import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import CreateRoomModal from '../../components/create-room/CreateRoomModal';
import RoomDetailsModal from '../../components/dashboard/RoomDetailsModal';

const API_URL = 'http://localhost:4000/api';

const Dashboard = () => {
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadingMyRooms, setLoadingMyRooms] = useState(true);
  const [searchLoading, setSearchLoading] = useState(true);

  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  
  const navigate = useNavigate();


  const openRoomModal = (room, isJoined) => {
    setSelectedRoom({ ...room, isJoined });
    setIsRoomModalOpen(true);
  };

  useEffect(() => {
    fetchMyRooms();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAvailableRooms(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchMyRooms = async () => {
    try {
      setLoadingMyRooms(true);
      const res = await axios.get(`${API_URL}/room/my-rooms`, { withCredentials: true });
      setJoinedRooms(res.data.payload || []);
    } catch (err) {
      console.error('Failed to fetch my rooms', err);
    } finally {
      setLoadingMyRooms(false);
    }
  };

  const fetchAvailableRooms = async (query = '') => {
    try {
      setSearchLoading(true);
      const res = await axios.get(`${API_URL}/room/search?q=${query}`, { withCredentials: true });
      setAvailableRooms(res.data.payload || []);
    } catch (err) {
      console.error('Failed to search rooms', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAvailableRooms(searchQuery);
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

  const getVisibilityBadge = (visibility) => {
    const isPrivate = visibility === 'private';
    return (
      <span className={`text-spacex-micro px-2.5 py-1 rounded-sm border backdrop-blur-sm ${
        isPrivate 
          ? 'border-red-500/30 text-red-400 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
          : 'border-green-500/30 text-green-400 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
      }`}>
        {isPrivate ? 'PRIVATE' : 'PUBLIC'}
      </span>
    );
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center font-body-base bg-black">
      
      <Navbar onOpenCreateRoom={() => setIsCreateModalOpen(true)} />
      
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 pt-32 pb-20 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 w-full">
        
        {/* Left Column: Joined Rooms */}
        <section className="flex flex-col">
          <h2 className="text-spacex-nav mb-8 tracking-[2px] opacity-70">JOINED ROOMS</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
            {loadingMyRooms ? (
              <div className="text-spacex-body opacity-50 uppercase">Loading telemetry...</div>
            ) : joinedRooms.length === 0 ? (
              <div className="text-spacex-body opacity-50 uppercase">No joined rooms.</div>
            ) : (
              <div className="space-y-8">
                {joinedRooms.map(room => (
                  <div 
                    key={room.roomId} 
                    onClick={() => openRoomModal(room, true)}
                    className="group cursor-pointer border-b border-[rgba(240,240,250,0.1)] pb-6 hover:border-[rgba(240,240,250,0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-spacex-h2 text-2xl font-bold uppercase tracking-[1px]">{room.title}</h3>
                      {getVisibilityBadge(room.visibility)}
                    </div>
                    <p className="text-spacex-body opacity-60 line-clamp-2 uppercase group-hover:opacity-80 transition-opacity">{room.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Available Rooms */}
        <section className="flex flex-col gap-12">
          <form onSubmit={handleSearch} className="w-full max-w-md relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="SEARCH PUBLIC ROOMS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3.5 text-spacex-nav text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/30 shadow-[0_0_15px_rgba(255,255,255,0.03)]"
            />
          </form>

          <div className="flex flex-col">
            <h2 className="text-spacex-nav mb-8 tracking-[2px] opacity-70">AVAILABLE ROOMS</h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {searchLoading ? (
                <div className="text-spacex-body opacity-50 uppercase">Scanning frequencies...</div>
              ) : availableRooms.length === 0 ? (
                <div className="text-spacex-body opacity-50 uppercase">No public rooms.</div>
              ) : (
                <div className="grid grid-cols-1 gap-10">
                  {availableRooms.map(room => (
                    <div 
                      key={room.roomId} 
                      onClick={() => openRoomModal(room, false)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[rgba(240,240,250,0.1)] pb-8 hover:border-[rgba(240,240,250,0.3)] transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-spacex-h2 text-2xl font-bold uppercase tracking-[1.5px] group-hover:text-white transition-colors">{room.title}</h3>
                          <span className="text-spacex-micro border border-white/20 px-2.5 py-1 rounded-sm bg-white/5">{room.language || 'SYS'}</span>
                          {getVisibilityBadge(room.visibility)}
                        </div>
                        <p className="text-spacex-body opacity-60 line-clamp-2 uppercase max-w-xl group-hover:opacity-80 transition-opacity">{room.description}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinRoom(room.roomId);
                        }}
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


      {isRoomModalOpen && selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setIsRoomModalOpen(false)}
          onAction={() => {
            if (selectedRoom.isJoined) {
              navigate(`/room/${selectedRoom.roomId}`);
            } else {
              handleJoinRoom(selectedRoom.roomId);
              setIsRoomModalOpen(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;

