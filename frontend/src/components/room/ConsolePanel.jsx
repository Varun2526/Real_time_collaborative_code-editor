import React from 'react';

const ConsolePanel = ({ consoleOutput, showConsole, setShowConsole, onClear, height = 200 }) => {
  return (
    <div
      style={showConsole ? { height } : undefined}
      className={`bg-black border-t border-[rgba(240,240,250,0.35)] flex flex-col shrink-0 ${
        showConsole ? '' : 'h-10'
      }`}
    >
      {/* Header bar — always visible, acts as toggle */}
      <div
        onClick={() => setShowConsole(prev => !prev)}
        className="px-6 py-2 flex items-center justify-between border-b border-[rgba(240,240,250,0.35)] bg-[rgba(240,240,250,0.02)] cursor-pointer hover:bg-[rgba(240,240,250,0.05)] transition-colors shrink-0 h-10"
      >
        <div className="flex items-center gap-4">
          <span className={`material-symbols-outlined text-[16px] text-white/50 transition-transform ${showConsole ? 'rotate-0' : '-rotate-90'}`}>
            expand_more
          </span>
          <span className="text-spacex-nav">CONSOLE</span>
          {!showConsole && consoleOutput.length > 0 && (
            <span className="text-spacex-micro text-white/30">
              ({consoleOutput.length} {consoleOutput.length === 1 ? 'ENTRY' : 'ENTRIES'})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showConsole && (
            <span
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="material-symbols-outlined text-white/50 cursor-pointer hover:text-white text-[18px]"
              title="Clear Console"
            >
              block
            </span>
          )}
        </div>
      </div>

      {/* Console output — only rendered when expanded */}
      {showConsole && (
        <div className="flex-1 p-4 font-code-base text-white/80 overflow-y-auto custom-scrollbar flex flex-col gap-2 bg-black">
          {consoleOutput.map((out, idx) => (
            <div key={idx} className="flex gap-4">
              <span className="text-white/30 shrink-0">[{out.time}]</span>
              <span
                className={`${
                  out.type === 'error'
                    ? 'text-[#ff3333]'
                    : out.type === 'result'
                    ? 'text-white font-bold'
                    : 'text-white/70'
                } whitespace-pre-wrap`}
              >
                {out.msg}
              </span>
            </div>
          ))}
          {consoleOutput.length === 0 && (
            <span className="text-white/30 text-spacex-nav">AWAITING OUTPUT...</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsolePanel;
