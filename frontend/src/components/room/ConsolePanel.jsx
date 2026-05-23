import React, { useRef, useCallback, useEffect, useState } from 'react';

const ConsolePanel = ({ consoleOutput, showConsole, setShowConsole, onClear, height = 200, onResize, stdin, setStdin, activeTab: activeTabProp, setActiveTab: setActiveTabProp }) => {
  const [activeTabLocal, setActiveTabLocal] = useState('output');
  // Use lifted state from parent if provided, otherwise fall back to local state
  const activeTab = activeTabProp !== undefined ? activeTabProp : activeTabLocal;
  const setActiveTab = setActiveTabProp !== undefined ? setActiveTabProp : setActiveTabLocal;
  const isDragging = useRef(false);
  const startY = useRef(0);

  const handleMouseDown = useCallback((e) => {
    if (!onResize) return;
    // Only start drag from the header bar area
    if (e.target.closest('[data-no-drag]')) return;
    e.preventDefault();
    isDragging.current = true;
    startY.current = e.clientY;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, [onResize]);

  useEffect(() => {
    if (!onResize) return;
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
      className={`console-panel bg-black border-t border-[rgba(240,240,250,0.35)] flex flex-col shrink-0 overflow-hidden ${
        showConsole ? '' : 'h-10'
      }`}
    >
      {/* Header bar — draggable + clickable toggle */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onResize && setShowConsole(prev => !prev)}
        className={`console-header px-6 py-2 flex items-center justify-between bg-[rgba(240,240,250,0.02)] ${onResize ? 'cursor-row-resize' : 'cursor-default'} select-none shrink-0 h-10 hover:bg-[rgba(240,240,250,0.05)] transition-colors ${
          showConsole ? 'border-b border-[rgba(240,240,250,0.1)]' : ''
        }`}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {onResize && (
              <span
                data-no-drag="true"
                onClick={() => setShowConsole(prev => !prev)}
                className={`console-expand-icon material-symbols-outlined text-[16px] text-white/50 transition-transform cursor-pointer ${showConsole ? 'rotate-0' : '-rotate-90'}`}
              >
                expand_more
              </span>
            )}
            <span className="console-title text-spacex-nav">CONSOLE</span>
          </div>

          {showConsole && (
            <div className="flex items-center gap-2 border-l border-white/20 pl-4 h-5" data-no-drag="true">
              <button
                onClick={() => setActiveTab('output')}
                className={`console-tab-btn text-spacex-nav px-2.5 py-1 transition-all cursor-pointer ${
                  activeTab === 'output'
                    ? 'console-tab-btn-active'
                    : 'console-tab-btn-inactive'
                }`}
              >
                OUTPUT
              </button>
              <button
                onClick={() => setActiveTab('input')}
                className={`console-tab-btn text-spacex-nav px-2.5 py-1 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'input'
                    ? 'console-tab-btn-active'
                    : 'console-tab-btn-inactive'
                }`}
              >
                INPUT (STDIN)
                {stdin.trim().length > 0 && (
                  <span className={`console-dot w-1.5 h-1.5 rounded-full ${activeTab === 'input' ? 'console-dot-active' : 'console-dot-inactive'}`} />
                )}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showConsole && (
            <span
              data-no-drag="true"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="console-clear-icon material-symbols-outlined text-white/50 cursor-pointer hover:text-white text-[18px]"
              title="Clear Console"
            >
              block
            </span>
          )}
        </div>
      </div>

      {/* Console content */}
      {showConsole && (
        <div className="console-content min-h-0 flex-1 bg-black flex flex-col">
          {activeTab === 'output' ? (
            /* Output log */
            <div className="console-output flex-1 p-4 font-code-base text-white/80 overflow-y-auto custom-scrollbar flex flex-col gap-2 bg-black">
              {consoleOutput.length === 0 ? (
                <span className="text-white/30 text-spacex-micro">No output generated yet. Click EXECUTE to run code.</span>
              ) : (
                consoleOutput.map((out, idx) => (
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
                ))
              )}
            </div>
          ) : (
            /* Stdin Input block */
            <div className="console-input flex-1 flex flex-col p-4 bg-black">
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter inputs to pass to the program (e.g. for input() or cin)..."
                className="console-textarea flex-1 bg-transparent border-0 text-white/80 font-code-base outline-none resize-none custom-scrollbar placeholder:text-white/20 transition-colors"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsolePanel;
