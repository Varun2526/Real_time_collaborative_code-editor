import React, { useCallback, useEffect, useRef } from 'react';

/**
 * ResizeHandle — A draggable divider between panels.
 * 
 * @param {'horizontal' | 'vertical'} direction - horizontal = left/right drag, vertical = up/down drag
 * @param {function} onResize - called with delta (px) during drag
 * @param {function} onResizeEnd - called when drag ends
 */
const ResizeHandle = ({ direction = 'horizontal', onResize, onResizeEnd }) => {
  const isDragging = useRef(false);
  const startPos = useRef(0);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    startPos.current = direction === 'horizontal' ? e.clientX : e.clientY;
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }, [direction]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
      const delta = currentPos - startPos.current;
      startPos.current = currentPos;
      onResize(delta);
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      onResizeEnd?.();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [direction, onResize, onResizeEnd]);

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`shrink-0 group relative z-30 ${
        isHorizontal
          ? 'w-1 cursor-col-resize hover:w-1 self-stretch'
          : 'h-1 cursor-row-resize hover:h-1 w-full'
      }`}
    >
      {/* Visible line on hover/drag */}
      <div className={`absolute bg-white/0 group-hover:bg-white/30 transition-colors ${
        isHorizontal
          ? 'top-0 bottom-0 left-0 w-1'
          : 'left-0 right-0 top-0 h-1'
      }`} />
      {/* Wider invisible hit area for easier grabbing */}
      <div className={`absolute ${
        isHorizontal
          ? 'top-0 bottom-0 -left-2 w-5'
          : 'left-0 right-0 -top-2 h-5'
      }`} />
    </div>
  );
};

export default ResizeHandle;
