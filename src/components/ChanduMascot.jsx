// Chandu, the Moon mission buddy. One SVG, five moods:
// 'happy' (excited), 'think', 'worry', 'cheer' (celebrating), 'encourage'.
const LABELS = {
  happy: 'Chandu the robot, smiling',
  think: 'Chandu the robot, thinking',
  worry: 'Chandu the robot, looking worried',
  cheer: 'Chandu the robot, celebrating',
  encourage: 'Chandu the robot, cheering you on',
};

export default function ChanduMascot({ mood = 'happy', size = 80, animate = 'a-float', className = '', style }) {
  const m = mood === 'encourage' ? 'happy' : mood;
  return (
    <svg
      className={`${animate} ${className}`}
      role="img"
      aria-label={LABELS[mood] || LABELS.happy}
      viewBox="0 0 120 140"
      style={{ width: size, height: (size * 140) / 120, flex: 'none', ...style }}
    >
      <ellipse cx="46" cy="128" rx="5" ry="9" fill="#FFD21F" />
      <ellipse cx="74" cy="128" rx="5" ry="9" fill="#FFD21F" />
      <rect x="39" y="108" width="14" height="13" rx="5" fill="#7758D9" />
      <rect x="67" y="108" width="14" height="13" rx="5" fill="#7758D9" />
      <line x1="60" y1="30" x2="60" y2="16" stroke="#7758D9" strokeWidth="4" strokeLinecap="round" />
      <path
        className="a-twinkle"
        d="M60 1 l3.4 6.9 7.6 1.1 -5.5 5.3 1.3 7.6 -6.8 -3.6 -6.8 3.6 1.3 -7.6 -5.5 -5.3 7.6 -1.1z"
        fill={m === 'worry' ? '#FF6FA5' : '#FFD21F'}
      />
      {m === 'cheer' ? (
        <>
          <circle cx="11" cy="56" r="9" fill="#7758D9" />
          <circle cx="109" cy="56" r="9" fill="#7758D9" />
        </>
      ) : (
        <>
          <circle cx="15" cy="70" r="9" fill="#7758D9" />
          <circle cx="105" cy="70" r="9" fill="#7758D9" />
        </>
      )}
      <circle cx="60" cy="72" r="44" fill="#D9CEFF" />
      <path d="M21 90 A44 44 0 0 0 99 90 Q60 104 21 90Z" fill="#FFFFFF" />
      <rect x="28" y="46" width="64" height="42" rx="20" fill="#121B3B" />
      {m === 'happy' && (
        <g>
          <ellipse cx="46" cy="64" rx="8" ry="10" fill="#4FC3F7" />
          <ellipse cx="74" cy="64" rx="8" ry="10" fill="#4FC3F7" />
          <circle cx="48.5" cy="60" r="3" fill="#FFFFFF" />
          <circle cx="76.5" cy="60" r="3" fill="#FFFFFF" />
          <path d="M50 75 Q60 87 70 75Z" fill="#FFFFFF" />
        </g>
      )}
      {m === 'think' && (
        <g>
          <ellipse cx="48" cy="61" rx="7" ry="9" fill="#4FC3F7" />
          <ellipse cx="76" cy="61" rx="7" ry="9" fill="#4FC3F7" />
          <circle cx="50" cy="57" r="2.8" fill="#FFFFFF" />
          <circle cx="78" cy="57" r="2.8" fill="#FFFFFF" />
          <path d="M53 79 H67" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {m === 'worry' && (
        <g>
          <path d="M37 52 L52 56 M83 52 L68 56" stroke="#FF8FB8" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="46" cy="66" rx="7" ry="8" fill="#4FC3F7" />
          <ellipse cx="74" cy="66" rx="7" ry="8" fill="#4FC3F7" />
          <path d="M50 81 q5 -5 10 0 q5 5 10 0" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )}
      {m === 'cheer' && (
        <g>
          <path d="M39 67 Q46 56 53 67" stroke="#4FC3F7" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M67 67 Q74 56 81 67" stroke="#4FC3F7" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M50 74 Q60 88 70 74Z" fill="#FFFFFF" />
        </g>
      )}
      <circle cx="35" cy="77" r="3.5" fill="#FF8FB8" />
      <circle cx="85" cy="77" r="3.5" fill="#FF8FB8" />
    </svg>
  );
}
