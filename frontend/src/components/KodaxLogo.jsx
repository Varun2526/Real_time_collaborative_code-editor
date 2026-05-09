import React from 'react';

const KodaxLogo = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: { fontSize: '20px', tracking: '0.2em' },
    md: { fontSize: '28px', tracking: '4px' },
    lg: { fontSize: '36px', tracking: '6px' },
  };

  const { fontSize, tracking } = sizeMap[size] || sizeMap.md;
  const letters = 'KODAX'.split('');

  // Each letter gets a unique vibrant color on hover
  const hoverColors = [
    { color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.6)' },  // K - purple
    { color: '#60a5fa', glow: 'rgba(96, 165, 250, 0.6)' },    // O - blue
    { color: '#34d399', glow: 'rgba(52, 211, 153, 0.6)' },    // D - green
    { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.6)' },    // A - gold
    { color: '#f87171', glow: 'rgba(248, 113, 113, 0.6)' },   // X - red
  ];

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
            transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: `${i * 50}ms`,
          }}
        >
          {letter}
        </span>
      ))}

      <style>{`
        .kodax-logo {
          position: relative;
          color: var(--text-primary, #f0f0fa);
        }

        .kodax-logo .kodax-letter {
          color: inherit;
        }

        /* Hover: staggered lift + color wave */
        .kodax-logo:hover .kodax-letter:nth-child(1) {
          color: ${hoverColors[0].color};
          text-shadow: 0 0 18px ${hoverColors[0].glow}, 0 0 40px ${hoverColors[0].glow};
          transform: translateY(-3px) scale(1.08);
        }
        .kodax-logo:hover .kodax-letter:nth-child(2) {
          color: ${hoverColors[1].color};
          text-shadow: 0 0 18px ${hoverColors[1].glow}, 0 0 40px ${hoverColors[1].glow};
          transform: translateY(-3px) scale(1.08);
        }
        .kodax-logo:hover .kodax-letter:nth-child(3) {
          color: ${hoverColors[2].color};
          text-shadow: 0 0 18px ${hoverColors[2].glow}, 0 0 40px ${hoverColors[2].glow};
          transform: translateY(-3px) scale(1.08);
        }
        .kodax-logo:hover .kodax-letter:nth-child(4) {
          color: ${hoverColors[3].color};
          text-shadow: 0 0 18px ${hoverColors[3].glow}, 0 0 40px ${hoverColors[3].glow};
          transform: translateY(-3px) scale(1.08);
        }
        .kodax-logo:hover .kodax-letter:nth-child(5) {
          color: ${hoverColors[4].color};
          text-shadow: 0 0 18px ${hoverColors[4].glow}, 0 0 40px ${hoverColors[4].glow};
          transform: translateY(-3px) scale(1.08);
        }
      `}</style>
    </span>
  );
};

export default KodaxLogo;
