import React, { useRef, useCallback, useEffect } from 'react';

const ConsolePanel = ({ consoleOutput, showConsole, setShowConsole, onClear, height = 200, onResize }) => {
  const isDragging = useRef(false);
  const startY = useRef(0);

  const handleMouseDown = useCallback((e) => {
    // Only start drag from the header bar area
    if (e.target.closest('[data-no-drag]')) return;
    e.preventDefault();
    isDragging.current = true;
    startY.current = e.clientY;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const delta = e.clientY - startY.current;
      startY.current = e.clientY;
      onResize?.(delta);
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize]);

  return (
    <div
      style={showConsole ? { height } : undefined}
      className={`bg-black border-t border-[rgba(240,240,250,0.35)] flex flex-col shrink-0 overflow-hidden ${
        showConsole ? '' : 'h-10'
      }`}
    >
      {/* Header bar — draggable + clickable toggle */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setShowConsole(prev => !prev)}
        className={`px-6 py-2 flex items-center justify-between bg-[rgba(240,240,250,0.02)] cursor-row-resize select-none shrink-0 h-10 hover:bg-[rgba(240,240,250,0.05)] transition-colors ${
          showConsole ? 'border-b border-[rgba(240,240,250,0.1)]' : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <span
            data-no-drag="true"
            onClick={() => setShowConsole(prev => !prev)}
            className={`material-symbols-outlined text-[16px] text-white/50 transition-transform cursor-pointer ${showConsole ? 'rotate-0' : '-rotate-90'}`}
          >
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
              data-no-drag="true"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="material-symbols-outlined text-white/50 cursor-pointer hover:text-white text-[18px]"
              title="Clear Console"
            >
              block
            </span>
          )}
        </div>
      </div>

      {/* Console output */}
      {showConsole && (
        <div className="min-h-0 flex-1 p-4 font-code-base text-white/80 overflow-y-auto custom-scrollbar flex flex-col gap-2 bg-black">
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
        </div>
      )}
    </div>
  );
};

export default ConsolePanel;
