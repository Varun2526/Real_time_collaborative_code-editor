import React from 'react';

const KodaxLogo = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: { fontSize: '20px', tracking: '0.2em' },
    md: { fontSize: '28px', tracking: '4px' },
    lg: { fontSize: '36px', tracking: '6px' },
  };

  const { fontSize, tracking } = sizeMap[size] || sizeMap.md;
  const letters = 'KODAX'.split('');

  return (
    <span
      className={`kodax-logo ${className}`}
      style={{
        fontSize,
        letterSpacing: tracking,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        display: 'inline-flex',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {letters.map((letter, i) => (
        <span
          key={i}
          className="kodax-letter"
          style={{
            display: 'inline-block',
            color: '#f0f0fa',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: `${i * 40}ms`,
          }}
        >
          {letter}
        </span>
      ))}

      <style>{`
        .kodax-logo {
          position: relative;
          transition: letter-spacing 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .kodax-logo:hover {
          letter-spacing: 8px;
        }

        .kodax-logo:hover .kodax-letter:nth-child(1) {
          color: #a78bfa;
          text-shadow: 0 0 20px rgba(167, 139, 250, 0.5);
          transform: translateY(-2px);
        }
        .kodax-logo:hover .kodax-letter:nth-child(2) {
          color: #60a5fa;
          text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
          transform: translateY(-2px);
        }
        .kodax-logo:hover .kodax-letter:nth-child(3) {
          color: #34d399;
          text-shadow: 0 0 20px rgba(52, 211, 153, 0.5);
          transform: translateY(-2px);
        }
        .kodax-logo:hover .kodax-letter:nth-child(4) {
          color: #fbbf24;
          text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
          transform: translateY(-2px);
        }
        .kodax-logo:hover .kodax-letter:nth-child(5) {
          color: #f87171;
          text-shadow: 0 0 20px rgba(248, 113, 113, 0.5);
          transform: translateY(-2px);
        }
      `}</style>
    </span>
  );
};

export default KodaxLogo;
