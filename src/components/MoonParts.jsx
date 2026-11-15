// Drawn pieces of the Moon world: stars, Earth, sun, base parts, rover, commander.
// Everything is SVG so it stays sharp and needs no image service.
import { suitWalk } from '../data/mission1.js';

export function Stars({ dots = DEFAULT_STARS }) {
  return (
    <>
      {dots.map(([x, y, r, c, tw], i) => (
        <circle key={i} className={tw ? 'a-twinkle' : undefined} cx={x} cy={y} r={r} fill={c} />
      ))}
    </>
  );
}
const DEFAULT_STARS = [
  [150, 22, 1.8, '#fff', 1], [214, 48, 1.4, '#fff'], [110, 70, 1.3, '#fff'], [260, 20, 1.6, '#4FC3F7', 1], [300, 96, 1.4, '#fff'], [60, 40, 1.3, '#fff'],
];

export function Earth({ cx = 350, cy = 42, r = 22 }) {
  const s = r / 22;
  return (
    <g transform={`translate(${cx - 350 * s} ${cy - 42 * s}) scale(${s})`}>
      <circle cx="350" cy="42" r="22" fill="#2E86DE" />
      <path d="M336 32 q10 -8 20 -2 q4 6 -2 10 q-8 2 -10 10 q-8 2 -12 -6z" fill="#43D13A" />
      <path d="M352 54 q8 -2 12 4 q-4 6 -10 4z" fill="#43D13A" />
    </g>
  );
}

export function Sun({ size = 44, style, className = '' }) {
  return (
    <div className={className} aria-hidden="true" style={{ position: 'absolute', width: size, height: size, ...style }}>
      <svg viewBox="0 0 44 44" style={{ width: size, height: size }}>
        <circle cx="22" cy="22" r="12" fill="#FFD21F" />
        <g stroke="#FFD21F" strokeWidth="3" strokeLinecap="round">
          <line x1="22" y1="2" x2="22" y2="6" /><line x1="22" y1="38" x2="22" y2="42" /><line x1="2" y1="22" x2="6" y2="22" /><line x1="38" y1="22" x2="42" y2="22" />
          <line x1="8" y1="8" x2="11" y2="11" /><line x1="33" y1="33" x2="36" y2="36" /><line x1="8" y1="36" x2="11" y2="33" /><line x1="33" y1="11" x2="36" y2="8" />
        </g>
      </svg>
    </div>
  );
}

/** Two solar panels on poles. `glow` makes them shine in sunlight. */
export function SolarPanels({ glow, width = 54, style, className = '' }) {
  return (
    <svg className={`${glow ? 'a-glow' : ''} ${className}`} aria-hidden="true" viewBox="0 0 54 32" style={{ position: 'absolute', width, height: (width * 32) / 54, ...style }}>
      <line x1="13" y1="30" x2="13" y2="15" stroke="#5B606C" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="30" x2="40" y2="15" stroke="#5B606C" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="1" y="3" width="24" height="12" rx="2" fill="#2E86DE" stroke="#fff" strokeWidth="1.5" transform="rotate(-10 13 9)" />
      <rect x="28" y="3" width="24" height="12" rx="2" fill="#2E86DE" stroke="#fff" strokeWidth="1.5" transform="rotate(-10 40 9)" />
    </svg>
  );
}

/** One solar panel placed by the commander. */
export function OnePanel({ glow, style }) {
  return (
    <svg className={`a-pop ${glow ? 'a-glow' : ''}`} aria-hidden="true" viewBox="0 0 30 26" style={{ position: 'absolute', width: 30, height: 26, ...style }}>
      <line x1="15" y1="24" x2="15" y2="12" stroke="#5B606C" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="2" y="2" width="26" height="11" rx="2" fill="#2E86DE" stroke="#fff" strokeWidth="1.8" transform="rotate(-8 15 7)" />
    </svg>
  );
}

export function Dome({ width = 64, windowColor = '#4FC3F7', antenna = '#FFD21F', antennaClass = '', style, className = '' }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 64 46" style={{ position: 'absolute', width, height: (width * 46) / 64, ...style }}>
      <line x1="32" y1="9" x2="32" y2="1" stroke="#5B606C" strokeWidth="2" strokeLinecap="round" />
      <circle className={antennaClass} cx="32" cy="2.5" r="2.8" fill={antenna} />
      <path d="M2 45 A30 30 0 0 1 62 45Z" fill="#fff" stroke="#9298A5" strokeWidth="1.5" />
      <rect x="26" y="26" width="12" height="19" rx="6" fill="#7758D9" />
      <circle cx="48" cy="33" r="4.5" fill={windowColor} stroke="#121B3B" strokeWidth="1.5" />
      <circle cx="16" cy="33" r="4.5" fill={windowColor} stroke="#121B3B" strokeWidth="1.5" />
    </svg>
  );
}

/** Water tank: the sky-blue fill shows the Water meter. */
export function WaterTank({ level = 5, style, className = '' }) {
  return (
    <div className={className} aria-hidden="true" style={{ position: 'absolute', width: 14, height: 32, border: '2px solid #fff', borderRadius: 5, background: '#5B606C', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', ...style }}>
      <div style={{ width: '100%', height: `${Math.max(0, Math.min(10, level)) * 10}%`, background: '#4FC3F7', transition: 'height 2s ease' }} />
    </div>
  );
}

/** Greenhouse with parrot-green plants. `scales` sets each plant's size. */
export function Greenhouse({ scales = [0.7, 0.7, 0.7], glass = '#DFF7FF', width = 44, style, className = '' }) {
  return (
    <div className={className} aria-hidden="true" style={{ position: 'absolute', width, height: (width * 26) / 44, ...style }}>
      <svg viewBox="0 0 52 32" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
        <path d="M1 31 V14 A25 13 0 0 1 51 14 V31Z" fill={glass} stroke="#fff" strokeWidth="1.5" opacity="0.95" />
      </svg>
      <div style={{ position: 'absolute', left: '12%', right: '12%', bottom: 1, height: '70%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {scales.map((s, i) => (
          <div key={i} style={{ width: 11, height: 17, transform: `scale(${s})`, transformOrigin: '50% 100%', transition: 'transform 2s ease' }}>
            <svg viewBox="0 0 12 18" style={{ width: 11, height: 17 }}>
              <path d="M6 18 V9 M6 10 Q1 8 1 3 Q6 4 6 10 M6 12 Q11 10 11 5 Q6 6 6 12" stroke="#2E9E27" strokeWidth="1.4" fill="#43D13A" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Bubbles({ left, top }) {
  return (
    <>
      {[[0, 2, 8, 0], [12, 6, 6, 0.5], [22, 0, 7, 1]].map(([dx, dy, s, delay], i) => (
        <div key={i} className="a-bubble" aria-hidden="true" style={{ position: 'absolute', left: left + dx, top: top + dy, width: s, height: s, borderRadius: '50%', border: '2px solid #fff', animationDelay: `${delay}s` }} />
      ))}
    </>
  );
}

export function Rover({ style, className = 'move' }) {
  return (
    <div className={className} role="img" aria-label="The Chand Express rover" style={{ position: 'absolute', width: 46, height: 28, ...style }}>
      <svg viewBox="0 0 46 28" style={{ width: 46, height: 28 }}>
        <path d="M26 9 q1 -8 8 -8 q7 0 8 8z" fill="#43D13A" />
        <rect x="2" y="8" width="42" height="13" rx="6" fill="#FF6FA5" />
        <rect x="2" y="14" width="42" height="3" fill="#FFD21F" />
        <path d="M9 10 l3 3 -3 3 -3 -3z M18 10 l3 3 -3 3 -3 -3z" fill="#4FC3F7" />
        <circle cx="11" cy="23" r="4.5" fill="#121B3B" stroke="#4FC3F7" strokeWidth="2" />
        <circle cx="35" cy="23" r="4.5" fill="#121B3B" stroke="#4FC3F7" strokeWidth="2" />
      </svg>
    </div>
  );
}

/** The player's commander, standing or walking on the Moon. */
export function CommanderFigure({ suit, walking, style, className = 'move' }) {
  return (
    <div className={className} style={{ position: 'absolute', width: 53, height: 92, ...style }}>
      <div className={walking ? 'a-walk' : 'a-idle'} style={{ width: 53, height: 92 }}>
        <img src={suitWalk(suit)} alt="Your commander" style={{ width: 53, height: 92, display: 'block' }} />
      </div>
    </div>
  );
}
