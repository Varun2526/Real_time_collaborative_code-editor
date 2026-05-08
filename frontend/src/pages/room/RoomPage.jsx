import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/navbar/Navbar';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';

const API_URL = 'http://localhost:4000/api';
const SOCKET_URL = 'http://localhost:4000';

const SUPPORTED_LANGUAGES = [
  "javascript", "python", "java", "c++", "c", "ruby", "go", "php"
];

const getLanguageFromExt = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': return 'javascript';
    case 'py': return 'python';
    case 'java': return 'java';
    case 'cpp': return 'c++';
    case 'c': return 'c';
    case 'rb': return 'ruby';
    case 'go': return 'go';
    case 'php': return 'php';
    default: return 'javascript';
  }
};

const RoomPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editor and Socket State
  const socketRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [copied, setCopied] = useState(false);
  const [activeMembers, setActiveMembers] = useState([]);

  const messagesEndRef = useRef(null);
  const isTypingLocally = useRef(false);

  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [fileToDelete, setFileToDelete] = useState(null);
  const [memberMenuOpenId, setMemberMenuOpenId] = useState(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const initRoom = async () => {
      try {
        const res = await axios.get(`${API_URL}/room/${roomId}`, { withCredentials: true });
        const roomData = res.data.payload;
        setRoom(roomData);

        // Fetch chat messages
        try {
          const chatRes = await axios.get(`${API_URL}/chat/${roomId}`, { withCredentials: true });
          setMessages(chatRes.data.payload || []);
        } catch (chatErr) {
          console.error("Failed to load chat messages", chatErr);
        }
        
        let loadedFiles = roomData.files || [];
        if (loadedFiles.length === 0) {
          // Fallback if schema doesn't have files yet
          const fallbackId = crypto.randomUUID();
          loadedFiles = [{ 
            id: fallbackId, 
            name: `main.${roomData.language === 'python' ? 'py' : 'js'}`, 
            language: roomData.language || 'javascript', 
            code: roomData.code || '// Write your code here...' 
          }];
        }

        setFiles(loadedFiles);
        setActiveFileId(loadedFiles[0].id);
        setActiveMembers(roomData.members || []);

        // Initialize Socket
        const socket = io(SOCKET_URL, { 
          withCredentials: true 
        });
        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
          socket.emit('join_room', { roomId });
          setConsoleOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: 'Connected to collaborative server.', type: 'info' }]);
        });

        socket.on('connect_error', (err) => {
          console.error('Socket connect_error:', err.message);
          setConsoleOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `Socket error: ${err.message}`, type: 'error' }]);
        });

        socket.on('user_joined', (data) => {
          setConsoleOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `${data.username || 'A user'} joined the room.`, type: 'info' }]);
        });

        socket.on('code_updated', (data) => {
          if (!isTypingLocally.current) {
            setFiles(prev => prev.map(f => f.id === data.fileId ? { ...f, code: data.code } : f));
          }
        });

        socket.on('language_updated', (data) => {
          setFiles(prev => prev.map(f => f.id === data.fileId ? { ...f, language: data.language } : f));
        });

        socket.on('file_added', (data) => {
          setFiles(prev => [...prev, data.file]);
        });

        socket.on('file_deleted', (data) => {
          setFiles(prev => prev.filter(f => f.id !== data.fileId));
          setActiveFileId(prev => prev === data.fileId ? null : prev);
        });

        socket.on('receive_message', (message) => {
          console.log('Received message:', message);
          setMessages(prev => [...prev, message]);
        });

        socket.on('code_running', (data) => {
          setConsoleOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `Executing code (${data.language})...`, type: 'info' }]);
        });

        socket.on('code_result', (data) => {
          setConsoleOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: data.output || data.error, type: data.error ? 'error' : 'result' }]);
        });

        socket.on('error', (err) => {
          console.error("Socket Error:", err);
          if (err.message.includes('Access denied')) {
            setError(err.message);
          }
        });

      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access Denied. You are not a member of this room.');
        } else if (err.response?.status === 404) {
          setError('Room not found.');
        } else {
          setError('An error occurred while fetching the room.');
        }
      } finally {
        setLoading(false);
      }
    };

    initRoom();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleEditorChange = (value) => {
    isTypingLocally.current = true;
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, code: value } : f));
    socketRef.current?.emit('code_change', { roomId, fileId: activeFileId, code: value });
    
    // Reset typing lock shortly after typing stops
    setTimeout(() => {
      isTypingLocally.current = false;
    }, 500);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, language: newLang } : f));
    socketRef.current?.emit('language_change', { roomId, fileId: activeFileId, language: newLang });
  };

  const handleRunCode = () => {
    if (!activeFile) return;
    setConsoleOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: 'Submitting to execution engine...', type: 'info' }]);
    socketRef.current?.emit('run_code', { roomId, code: activeFile.code, language: activeFile.language });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    console.log('Sending message:', { roomId, message: chatInput }, 'Socket connected:', socketRef.current?.connected);
    socketRef.current?.emit('send_message', { roomId, message: chatInput });
    setChatInput('');
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddFileClick = () => {
    setIsAddingFile(true);
    setNewFileName('');
  };

  const handleNewFileInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsAddingFile(false);
    } else if (e.key === 'Enter') {
      if (!newFileName.trim()) {
        setIsAddingFile(false);
        return;
      }
      const lang = getLanguageFromExt(newFileName);
      const newFile = {
        id: crypto.randomUUID(),
        name: newFileName.trim(),
        language: lang,
        code: '// Start coding here'
      };
      socketRef.current?.emit('add_file', { roomId, file: newFile });
      setFiles(prev => [...prev, newFile]);
      setActiveFileId(newFile.id);
      setIsAddingFile(false);
    }
  };

  const handleDeleteFileClick = (fileId, e) => {
    e.stopPropagation();
    if (files.length <= 1) return alert("Cannot delete the last file!");
    setFileToDelete(fileId);
  };

  const confirmDeleteFile = () => {
    if (!fileToDelete) return;
    socketRef.current?.emit('delete_file', { roomId, fileId: fileToDelete });
    setFiles(prev => prev.filter(f => f.id !== fileToDelete));
    if (activeFileId === fileToDelete) {
      const remaining = files.filter(f => f.id !== fileToDelete);
      if (remaining.length > 0) setActiveFileId(remaining[0].id);
    }
    setFileToDelete(null);
  };

  const fetchRoomMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/room/${roomId}`, { withCredentials: true });
      setActiveMembers(res.data.payload.members || []);
    } catch (err) {
      console.error("Failed to refresh room members", err);
    }
  };

  const handleMemberAction = async (action, userId) => {
    try {
      if (action === 'promote') {
        await axios.patch(`${API_URL}/room/${roomId}/promote/${userId}`, {}, { withCredentials: true });
      } else if (action === 'demote') {
        await axios.patch(`${API_URL}/room/${roomId}/demote/${userId}`, {}, { withCredentials: true });
      } else if (action === 'remove') {
        await axios.post(`${API_URL}/room/${roomId}/remove/${userId}`, {}, { withCredentials: true });
      } else if (action === 'transfer') {
        await axios.patch(`${API_URL}/room/${roomId}/transfer-ownership/${userId}`, {}, { withCredentials: true });
      }
      fetchRoomMembers();
      setMemberMenuOpenId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleRequestJoin = async () => {
    try {
      const res = await axios.post(`${API_URL}/room/${roomId}/request-join`, {}, { withCredentials: true });
      if (res.data.message === "Joined room successfully") {
        setError(null);
        setLoading(true);
        window.location.reload();
      } else {
        setError("Access Request Sent. Awaiting approval from room command.");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send join request');
    }
  };

  const currentUserId = user?.id || user?._id;
  const currentUserRole = activeMembers.find(m => m.user._id === currentUserId || m.user.id === currentUserId)?.role || 'member';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-body-base">
        <h2 className="text-spacex-hero mb-4 text-[#ff3333] text-center px-4 uppercase">{error}</h2>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {(error.includes('Access Denied') || error.includes('Access Request Sent')) && (
            <button 
              onClick={handleRequestJoin}
              disabled={error.includes('Access Request Sent')}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {error.includes('Access Request Sent') ? 'REQUEST PENDING' : 'REQUEST ACCESS'}
            </button>
          )}
          <button 
            onClick={() => navigate('/')}
            className="btn-ghost opacity-70"
          >
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-[#f0f0fa] font-body-base overflow-hidden h-screen flex flex-col relative">
      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black border border-[rgba(240,240,250,0.35)] rounded-none p-8 max-w-sm w-full">
            <h3 className="text-spacex-hero text-2xl mb-4">DELETE FILE?</h3>
            <p className="text-spacex-nav opacity-70 mb-8 leading-relaxed">
              CONFIRM DELETION OF <span className="text-white">{files.find(f => f.id === fileToDelete)?.name}</span>. THIS ACTION CANNOT BE REVERSED.
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setFileToDelete(null)} className="text-spacex-nav hover:text-white transition-colors">CANCEL</button>
              <button onClick={confirmDeleteFile} className="btn-ghost !border-[#ff3333] !text-[#ff3333] hover:!bg-[#ff3333]/10">DELETE</button>
            </div>
          </div>
        </div>
      )}

      <Navbar 
        leftContent={
          <div className="flex items-center gap-8">
            <Link to="/" className="text-[28px] font-bold text-[#f0f0fa] tracking-[4px] uppercase">KODAX</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-spacex-nav opacity-50 hover:opacity-100 transition-opacity">DASHBOARD</Link>
              <span className="text-spacex-nav border-b-2 border-white pb-1">{room?.title || 'PROJECT'}</span>
            </nav>
          </div>
        }
        centerContent={null}
        rightContent={
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {activeFile && (
              <div className="hidden sm:flex items-center gap-4 mr-4">
                <select 
                  value={activeFile.language} 
                  onChange={handleLanguageChange}
                  className="bg-transparent text-spacex-nav border-b border-[rgba(240,240,250,0.35)] px-2 py-1 outline-none cursor-pointer uppercase appearance-none"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang} value={lang} className="bg-black text-white">{lang}</option>
                  ))}
                </select>
                <button onClick={handleRunCode} className="text-spacex-nav border border-[rgba(240,240,250,0.35)] px-4 py-2 hover:bg-white hover:text-black transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  EXECUTE
                </button>
                <button onClick={handleShare} className="text-spacex-nav border border-[rgba(240,240,250,0.35)] px-4 py-2 hover:bg-white hover:text-black transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'share'}</span>
                  {copied ? 'LINK COPIED' : 'SHARE'}
                </button>
              </div>
            )}
          </div>
        }
      />
      
      <div className="flex flex-1 overflow-hidden mt-20">
        {/* SideNavBar */}
        <aside className="bg-black fixed left-0 top-20 bottom-0 flex flex-col items-center py-6 w-16 z-40 border-r border-[rgba(240,240,250,0.35)]">
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="w-10 h-10 border border-white flex items-center justify-center mb-4 text-white font-bold text-xl uppercase">
              {room?.title ? room.title[0] : 'K'}
            </div>
            <button className="flex flex-col items-center gap-1 text-white opacity-100 border-l-2 border-white w-full py-2 transition-transform">
              <span className="material-symbols-outlined">folder_open</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-white opacity-50 hover:opacity-100 w-full py-2 transition-opacity">
              <span className="material-symbols-outlined">groups</span>
            </button>
          </div>
        </aside>
        
        {/* Content Area */}
        <main className="ml-16 flex-1 flex overflow-hidden">
          {/* Left Sidebar: Explorer & Participants */}
          <section className="w-64 bg-black border-r border-[rgba(240,240,250,0.35)] flex flex-col shrink-0">
            <div className="p-4 border-b border-[rgba(240,240,250,0.35)] flex items-center justify-between">
              <span className="text-spacex-nav">EXPLORER</span>
              <button onClick={handleAddFileClick} className="material-symbols-outlined text-white/50 hover:text-white cursor-pointer transition-colors" title="New File">note_add</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <div className="flex items-center gap-2 px-2 py-2 text-spacex-body text-white cursor-pointer rounded">
                <span className="material-symbols-outlined text-white">folder</span>
                <span className="font-bold tracking-[1px] uppercase">WORKSPACE</span>
              </div>
              <div className="ml-4 mt-2 flex flex-col gap-1">
                {files.map(f => (
                  <div 
                    key={f.id} 
                    onClick={() => setActiveFileId(f.id)}
                    className={`group flex items-center justify-between gap-2 px-2 py-2 cursor-pointer transition-colors ${activeFileId === f.id ? 'bg-[rgba(240,240,250,0.1)] text-white' : 'text-white/70 hover:bg-[rgba(240,240,250,0.05)]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined ${activeFileId === f.id ? 'text-white' : 'text-white/50'}`}>description</span>
                      <span className="text-spacex-body uppercase">{f.name}</span>
                    </div>
                    {files.length > 1 && (
                      <span onClick={(e) => handleDeleteFileClick(f.id, e)} className="material-symbols-outlined scale-75 opacity-0 group-hover:opacity-100 hover:text-[#ff3333] transition-opacity">close</span>
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
            
            {/* Participants section */}
            <div className="p-4 border-t border-[rgba(240,240,250,0.35)]">
              <span className="text-spacex-nav mb-4 block">CREW MANIFEST</span>
              <div className="flex flex-col gap-4 pb-6 relative">
                {activeMembers.map((member, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 relative">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 border border-[rgba(240,240,250,0.35)] flex items-center justify-center text-spacex-body font-bold text-white uppercase`}>
                          {member.user.username?.[0] || member.user.name?.[0] || member.user.email?.[0] || 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-black"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-spacex-body font-bold tracking-[1px] uppercase">{member.user.username || member.user.name || 'MEMBER'}</span>
                        <span className="text-spacex-micro opacity-70">{member.role}</span>
                      </div>
                    </div>
                    
                    {/* Actions Menu */}
                    {(currentUserRole === 'owner' || currentUserRole === 'moderator') && (member.user._id !== currentUserId && member.user.id !== currentUserId) && (
                      <button onClick={() => setMemberMenuOpenId(memberMenuOpenId === (member.user._id || member.user.id) ? null : (member.user._id || member.user.id))} className="material-symbols-outlined text-white/50 hover:text-white cursor-pointer text-[18px]">
                        more_vert
                      </button>
                    )}

                    {memberMenuOpenId === (member.user._id || member.user.id) && (
                      <div className="absolute right-0 top-10 bg-black border border-[rgba(240,240,250,0.35)] py-2 z-50 w-48 text-spacex-nav">
                        {currentUserRole === 'owner' && member.role === 'member' && (
                          <button onClick={() => handleMemberAction('promote', member.user._id || member.user.id)} className="w-full text-left px-4 py-2 hover:bg-[rgba(240,240,250,0.1)] transition-colors">PROMOTE TO MOD</button>
                        )}
                        {currentUserRole === 'owner' && member.role === 'moderator' && (
                          <button onClick={() => handleMemberAction('demote', member.user._id || member.user.id)} className="w-full text-left px-4 py-2 hover:bg-[rgba(240,240,250,0.1)] transition-colors">DEMOTE TO CREW</button>
                        )}
                        {currentUserRole === 'owner' && (
                          <button onClick={() => handleMemberAction('transfer', member.user._id || member.user.id)} className="w-full text-left px-4 py-2 hover:bg-[rgba(240,240,250,0.1)] transition-colors">TRANSFER COMMAND</button>
                        )}
                        {((currentUserRole === 'owner') || (currentUserRole === 'moderator' && member.role === 'member')) && (
                          <button onClick={() => handleMemberAction('remove', member.user._id || member.user.id)} className="w-full text-left px-4 py-2 hover:bg-[rgba(255,51,51,0.2)] text-[#ff3333] transition-colors border-t border-[rgba(240,240,250,0.35)] mt-2">EJECT FROM SHIP</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Center: Large Code Editor */}
          <section className="flex-1 flex flex-col relative overflow-hidden bg-black">
            {/* Editor Tabs */}
            <div className="h-12 bg-black flex items-center border-b border-[rgba(240,240,250,0.35)]">
              {activeFile ? (
                <div className="h-full px-6 flex items-center gap-3 bg-[rgba(240,240,250,0.05)] border-t-2 border-white text-spacex-nav border-r border-[rgba(240,240,250,0.35)] min-w-[120px]">
                  <span className="material-symbols-outlined text-white">terminal</span>
                  <span>{activeFile.name}</span>
                </div>
              ) : (
                <div className="h-full px-6 flex items-center text-white/50 text-spacex-nav">
                  NO ACTIVE FILE
                </div>
              )}
            </div>
            
            {/* Monaco Editor */}
            <div className="flex-1 bg-black relative">
              {activeFile ? (
                 <Editor
                    key={activeFile.id}
                    height="100%"
                    language={activeFile.language}
                    theme="vs-dark"
                    value={activeFile.code}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: 'JetBrains Mono, monospace',
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      cursorBlinking: "smooth",
                      cursorSmoothCaretAnimation: "on"
                    }}
                  />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white/30 text-spacex-nav opacity-50">
                  INITIALIZE A FILE TO COMMENCE OPERATIONS
                </div>
              )}
            </div>
            
            {/* Bottom: Console Panel */}
            <div className="h-64 bg-black border-t border-[rgba(240,240,250,0.35)] flex flex-col shrink-0">
              <div className="px-6 py-3 flex items-center justify-between border-b border-[rgba(240,240,250,0.35)] bg-[rgba(240,240,250,0.02)]">
                <div className="flex items-center gap-4">
                  <span className="text-spacex-nav">SYSTEM TELEMETRY (CONSOLE)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span onClick={() => setConsoleOutput([])} className="material-symbols-outlined text-white/50 cursor-pointer hover:text-white" title="Clear Console">block</span>
                </div>
              </div>
              <div className="flex-1 p-4 font-code-base text-white/80 overflow-y-auto custom-scrollbar flex flex-col gap-2 bg-[#000000]">
                {consoleOutput.map((out, idx) => (
                   <div key={idx} className="flex gap-4">
                     <span className="text-white/30 shrink-0">[{out.time}]</span>
                     <span className={`${out.type === 'error' ? 'text-[#ff3333]' : out.type === 'result' ? 'text-white font-bold' : 'text-white/70'} whitespace-pre-wrap`}>{out.msg}</span>
                   </div>
                ))}
                {consoleOutput.length === 0 && (
                  <span className="text-white/30 text-spacex-nav">AWAITING SYSTEM OUTPUT...</span>
                )}
              </div>
            </div>
          </section>
          
          {/* Right Sidebar: Integrated Chat */}
          <section className="w-80 bg-black border-l border-[rgba(240,240,250,0.35)] flex flex-col shrink-0">
            <div className="p-4 border-b border-[rgba(240,240,250,0.35)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white">chat_bubble</span>
                <span className="text-spacex-nav">COMMS CHANNEL</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
              {/* Chat Messages */}
              {messages.length === 0 && (
                <div className="text-center text-spacex-nav text-white/30 mt-8">COMMUNICATION LINK ESTABLISHED. READY FOR TRANSMISSION.</div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-spacex-nav tracking-[1px]">{msg.sender?.username || 'UNKNOWN'}</span>
                    <span className="text-spacex-micro opacity-50">{new Date(msg.createdAt || Date.now()).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-spacex-body text-white/90 break-words border-l-2 border-[rgba(240,240,250,0.35)] pl-4 uppercase">
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-[rgba(240,240,250,0.35)]">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-transparent text-spacex-body border-b border-[rgba(240,240,250,0.35)] pb-3 pr-10 focus:border-white outline-none placeholder:text-white/30 transition-colors uppercase" 
                  placeholder="TRANSMIT MESSAGE..." 
                  type="text" 
                />
                <button type="submit" disabled={!chatInput.trim()} className="absolute right-0 top-0 text-white hover:opacity-70 transition-opacity disabled:opacity-20 cursor-pointer">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default RoomPage;