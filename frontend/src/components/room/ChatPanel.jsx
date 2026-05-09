import React, { useRef, useEffect } from 'react';

const ChatPanel = ({ messages, chatInput, setChatInput, onSendMessage, width = 288, onClose }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <section
      style={{ width }}
      className="bg-black border-l border-[rgba(240,240,250,0.35)] flex flex-col shrink-0 h-full absolute lg:relative right-0 top-0 z-50 lg:z-auto shadow-2xl lg:shadow-none"
    >
      <div className="p-4 border-b border-[rgba(240,240,250,0.35)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-white">chat_bubble</span>
          <span className="text-spacex-nav">CHAT</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white transition-colors" type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
        {messages.length === 0 && (
          <div className="text-center text-spacex-nav text-white/30 mt-8">
            NO MESSAGES YET.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-spacex-nav tracking-[1px]">
                {msg.sender?.username || 'UNKNOWN'}
              </span>
              <span className="text-spacex-micro opacity-50">
                {new Date(msg.createdAt || Date.now()).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-spacex-body text-white/90 break-words border-l-2 border-[rgba(240,240,250,0.35)] pl-4">
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-[rgba(240,240,250,0.35)]">
        <form onSubmit={onSendMessage} className="relative">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full bg-transparent text-spacex-body border-b border-[rgba(240,240,250,0.35)] pb-3 pr-10 focus:border-white outline-none placeholder:text-white/30 transition-colors uppercase"
            placeholder="TYPE A MESSAGE..."
            type="text"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="absolute right-0 top-0 text-white hover:opacity-70 transition-opacity disabled:opacity-20 cursor-pointer"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatPanel;
