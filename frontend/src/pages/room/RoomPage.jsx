import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/navbar/Navbar';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';

// Room Components
import ExplorerPanel from '../../components/room/ExplorerPanel';
import MembersPanel from '../../components/room/MembersPanel';
import EditorTabs from '../../components/room/EditorTabs';
import ConsolePanel from '../../components/room/ConsolePanel';
import ChatPanel from '../../components/room/ChatPanel';
import ResizeHandle from '../../components/room/ResizeHandle';

// Panel size constraints (px)
const EXPLORER_MIN = 180;
const EXPLORER_MAX = 400;
const EXPLORER_DEFAULT = 224;
const CHAT_MIN = 220;
const CHAT_MAX = 500;
const CHAT_DEFAULT = 288;
const CONSOLE_MIN = 80;
const CONSOLE_MAX = 400;
const CONSOLE_DEFAULT = 200;

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
  const [openTabs, setOpenTabs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [copied, setCopied] = useState(false);
  const [activeMembers, setActiveMembers] = useState([]);

  const isTypingLocally = useRef(false);

  // Panel toggle state
  const [activeSidebarTab, setActiveSidebarTab] = useState('explorer');
  const [showChat, setShowChat] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [fileToDelete, setFileToDelete] = useState(null);

  // Resizable panel sizes
  const [explorerWidth, setExplorerWidth] = useState(EXPLORER_DEFAULT);
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT);
  const [consoleHeight, setConsoleHeight] = useState(CONSOLE_DEFAULT);
  const handleExplorerResize = (delta) => {
    setExplorerWidth(prev => Math.min(EXPLORER_MAX, Math.max(EXPLORER_MIN, prev + delta)));
  };
  const handleChatResize = (delta) => {
    // Dragging left edge left = negative delta = wider chat
    setChatWidth(prev => Math.min(CHAT_MAX, Math.max(CHAT_MIN, prev - delta)));
  };
  const handleConsoleResize = (delta) => {
    // Dragging top edge up = negative delta = taller console
    setConsoleHeight(prev => Math.min(CONSOLE_MAX, Math.max(CONSOLE_MIN, prev - delta)));
  };

  // Socket + Room initialization
  useEffect(() => {
    let cancelled = false;

    const initRoom = async () => {
      try {
        const res = await axios.get(`${API_URL}/room/${roomId}`, { withCredentials: true });
        if (cancelled) return;

        const roomData = res.data.payload;
        setRoom(roomData);

        // Fetch chat messages
        try {
          const chatRes = await axios.get(`${API_URL}/chat/${roomId}`, { withCredentials: true });
          if (!cancelled) setMessages(chatRes.data.payload || []);
        } catch (chatErr) {
          console.error("Failed to load chat messages", chatErr);
        }

        if (cancelled) return;
        
        let loadedFiles = roomData.files || [];
        if (loadedFiles.length === 0) {
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
        setOpenTabs([loadedFiles[0].id]);
        setActiveMembers(roomData.members || []);
        setConsoleOutput([]);

        // Initialize Socket
        const socket = io(SOCKET_URL, { withCredentials: true });
        socketRef.current = socket;

        socket.on('connect', () => {
          socket.emit('join_room', { roomId });
          setConsoleOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: 'Connected to collaborative server.', type: 'info' }]);
        });

        socket.on('connect_error', (err) => {
          console.error('Socket connect_error:', err.message);
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
          setOpenTabs(prev => prev.filter(id => id !== data.fileId));
          setActiveFileId(prev => prev === data.fileId ? null : prev);
        });

        socket.on('receive_message', (message) => {
          setMessages(prev => [...prev, message]);
        });

        socket.on('code_running', (data) => {
          setShowConsole(true);
          setConsoleOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `Executing code (${data.language})...`, type: 'info' }]);
        });

        socket.on('code_result', (data) => {
          setShowConsole(true);
          setConsoleOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: data.output || data.error, type: data.error ? 'error' : 'result' }]);
        });

        socket.on('error', (err) => {
          console.error("Socket Error:", err);
          if (err.message.includes('Access denied')) {
            setError(err.message);
          }
        });

      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 403) {
          setError('Access Denied. You are not a member of this room.');
        } else if (err.response?.status === 404) {
          setError('Room not found.');
        } else {
          setError('An error occurred while fetching the room.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initRoom();

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [roomId]);

  // Track unread messages when chat is closed
  useEffect(() => {
    if (!showChat && messages.length > 0) {
      setUnreadMessages(prev => prev + 1);
    }
  }, [messages.length]);

  // Clear unread when chat opens
  useEffect(() => {
    if (showChat) setUnreadMessages(0);
  }, [showChat]);

  // Derived state
  const activeFile = files.find(f => f.id === activeFileId);
  const currentUserId = user?.id || user?._id;
  const currentUserRole = activeMembers.find(m => m.user._id === currentUserId || m.user.id === currentUserId)?.role || 'member';
  const showLeftPanel = activeSidebarTab !== null;

  // --- Handlers ---

  const handleEditorChange = (value) => {
    isTypingLocally.current = true;
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, code: value } : f));
    socketRef.current?.emit('code_change', { roomId, fileId: activeFileId, code: value });
    setTimeout(() => { isTypingLocally.current = false; }, 500);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, language: newLang } : f));
    socketRef.current?.emit('language_change', { roomId, fileId: activeFileId, language: newLang });
  };

  const handleRunCode = () => {
    if (!activeFile) return;
    setShowConsole(true);
    setConsoleOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: 'Submitting to execution engine...', type: 'info' }]);
    socketRef.current?.emit('run_code', { roomId, code: activeFile.code, language: activeFile.language });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socketRef.current?.emit('send_message', { roomId, message: chatInput });
    setChatInput('');
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddFile = (fileName) => {
    const lang = getLanguageFromExt(fileName);
    const newFile = {
      id: crypto.randomUUID(),
      name: fileName,
      language: lang,
      code: '// Start coding here'
    };
    socketRef.current?.emit('add_file', { roomId, file: newFile });
    setFiles(prev => [...prev, newFile]);
    setOpenTabs(prev => [...prev, newFile.id]);
    setActiveFileId(newFile.id);
  };

  const handleDeleteFile = (fileId) => {
    if (files.length <= 1) return alert("Cannot delete the last file!");
    setFileToDelete(fileId);
  };

  const confirmDeleteFile = () => {
    if (!fileToDelete) return;
    socketRef.current?.emit('delete_file', { roomId, fileId: fileToDelete });
    setFiles(prev => prev.filter(f => f.id !== fileToDelete));
    setOpenTabs(prev => prev.filter(id => id !== fileToDelete));
    if (activeFileId === fileToDelete) {
      const remaining = files.filter(f => f.id !== fileToDelete);
      if (remaining.length > 0) setActiveFileId(remaining[0].id);
    }
    setFileToDelete(null);
  };

  const handleCloseTab = (fileId) => {
    setOpenTabs(prev => {
      const next = prev.filter(id => id !== fileId);
      if (activeFileId === fileId) {
        setActiveFileId(next.length > 0 ? next[next.length - 1] : null);
      }
      return next;
    });
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

  // --- Render ---

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
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
          <button onClick={() => navigate('/')} className="btn-ghost opacity-70">
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
          <div className="bg-black border border-[rgba(240,240,250,0.35)] p-8 max-w-sm w-full">
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

      {/* Navbar */}
      <Navbar 
        leftContent={
          <div className="flex items-center gap-6">
            <Link to="/" className="text-[28px] font-bold text-[#f0f0fa] tracking-[4px] uppercase">KODAX</Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/" className="text-spacex-nav opacity-50 hover:opacity-100 transition-opacity">DASHBOARD</Link>
              <span className="text-spacex-nav border-b-2 border-white pb-1">{room?.title || 'PROJECT'}</span>
            </nav>
            {/* Panel toggles */}
            <div className="hidden md:flex items-center gap-1 ml-2">
              <button
                onClick={() => setActiveSidebarTab(prev => prev === 'explorer' ? null : 'explorer')}
                className={`p-2 transition-colors ${activeSidebarTab === 'explorer' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                title="Explorer"
              >
                <span className="material-symbols-outlined text-[20px]">folder_open</span>
              </button>
              <button
                onClick={() => setActiveSidebarTab(prev => prev === 'members' ? null : 'members')}
                className={`p-2 transition-colors ${activeSidebarTab === 'members' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                title="Members"
              >
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </button>
            </div>
          </div>
        }
        centerContent={null}
        rightContent={
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {activeFile && (
              <div className="hidden sm:flex items-center gap-3">
                <select 
                  value={activeFile.language} 
                  onChange={handleLanguageChange}
                  className="bg-transparent text-spacex-nav border-b border-[rgba(240,240,250,0.35)] px-2 py-1 outline-none cursor-pointer uppercase appearance-none"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang} value={lang} className="bg-black text-white">{lang}</option>
                  ))}
                </select>
                <button onClick={handleRunCode} className="text-spacex-nav border border-[rgba(240,240,250,0.35)] px-3 py-2 hover:bg-white hover:text-black transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  EXECUTE
                </button>
                <button onClick={handleShare} className="text-spacex-nav border border-[rgba(240,240,250,0.35)] px-3 py-2 hover:bg-white hover:text-black transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'share'}</span>
                  {copied ? 'COPIED' : 'SHARE'}
                </button>
                {/* Chat toggle */}
                <button
                  onClick={() => setShowChat(prev => !prev)}
                  className={`relative text-spacex-nav border border-[rgba(240,240,250,0.35)] px-3 py-2 transition-colors flex items-center gap-2 text-white hover:bg-white hover:text-black ${
                    showChat ? 'border-white' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  CHAT
                  {unreadMessages > 0 && !showChat && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </button>
              </div>
            )}
          </div>
        }
      />
      
      <div className="flex flex-1 overflow-hidden mt-20">
        {/* Content Area — full width */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel: Explorer or Members */}
          {showLeftPanel && (
            <>
              <section
                style={{ width: explorerWidth }}
                className="bg-black border-r border-[rgba(240,240,250,0.35)] flex flex-col shrink-0"
              >
                {activeSidebarTab === 'explorer' && (
                  <ExplorerPanel
                    files={files}
                    activeFileId={activeFileId}
                    setActiveFileId={setActiveFileId}
                    openTabs={openTabs}
                    setOpenTabs={setOpenTabs}
                    onAddFile={handleAddFile}
                    onDeleteFile={handleDeleteFile}
                  />
                )}
                {activeSidebarTab === 'members' && (
                  <MembersPanel
                    activeMembers={activeMembers}
                    currentUserId={currentUserId}
                    currentUserRole={currentUserRole}
                    onMemberAction={handleMemberAction}
                  />
                )}
              </section>
              {/* Drag handle: Explorer ↔ Editor */}
              <ResizeHandle direction="horizontal" onResize={handleExplorerResize} />
            </>
          )}
          
          {/* Center: Editor + Console */}
          <section className="flex-1 flex flex-col relative overflow-hidden bg-black">
            {/* Editor Tabs */}
            <EditorTabs
              files={files}
              openTabs={openTabs}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
              onCloseTab={handleCloseTab}
            />
            
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
                <div className="h-full w-full flex items-center justify-center text-white/30 text-spacex-nav">
                  SELECT OR CREATE A FILE TO START
                </div>
              )}
            </div>
            
            {/* Drag handle: Editor ↔ Console */}
            {showConsole && (
              <ResizeHandle direction="vertical" onResize={handleConsoleResize} />
            )}

            {/* Console Panel */}
            <ConsolePanel
              consoleOutput={consoleOutput}
              showConsole={showConsole}
              setShowConsole={setShowConsole}
              onClear={() => setConsoleOutput([])}
              height={consoleHeight}
            />
          </section>
          
          {/* Drag handle: Editor ↔ Chat */}
          {showChat && (
            <ResizeHandle direction="horizontal" onResize={handleChatResize} />
          )}

          {/* Right: Chat Panel */}
          {showChat && (
            <ChatPanel
              messages={messages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              onSendMessage={handleSendMessage}
              width={chatWidth}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default RoomPage;