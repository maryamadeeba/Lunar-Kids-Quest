// Simple stroke icons drawn as SVG paths (no icon font, no emoji).
const PATHS = {
  back: 'M15 5l-7 7 7 7',
  next: 'M5 12h14M13 6l6 6-6 6',
  play: 'M8 5.5v13l11-6.5z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  lock: 'M5 11h14v9H5zM8 11V8a4 4 0 0 1 8 0v3',
  close: 'M6 6l12 12M18 6L6 18',
  clock: 'M12 5a8 8 0 1 0 0.01 0M12 9v4l3 2M9 2h6',
  headset: 'M4 14v-2a8 8 0 0 1 16 0v2M3 14h4v6H3zM17 14h4v6h-4zM19 20c0 1.5-2 2-5 2',
  sound: 'M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11',
  mute: 'M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM16 9.5l5 5M21 9.5l-5 5',
  rocket: 'M12 3c3 2 5 5.5 5 9.5V16H7v-3.5C7 8.5 9 5 12 3zM12 8a2 2 0 1 0 0.01 0M7 14l-3 3 3 1M17 14l3 3-3 1M10 19l2 2.5 2-2.5',
  sun: 'M12 7.5a4.5 4.5 0 1 0 0.01 0M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8',
  ice: 'M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5',
  pin: 'M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11zM12 8a2 2 0 1 0 0.01 0',
  target: 'M12 3a9 9 0 1 0 0.01 0M12 7a5 5 0 1 0 0.01 0',
  wrench: 'M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.5-8.5a4 4 0 0 0-2-2z',
  atom: 'M12 10.2a1.8 1.8 0 1 0 0.01 0M2 12c0-2.2 4.5-4 10-4s10 1.8 10 4-4.5 4-10 4S2 14.2 2 12z',
  leaf: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19l8-8',
  person: 'M12 4a4 4 0 1 0 0.01 0M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5',
  scale: 'M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z',
  search: 'M11 5a6 6 0 1 0 0.01 0M20 20l-4.5-4.5',
  external: 'M7 17L17 7M9 7h8v8',
};

export default function Icon({ name, d, size = 24, color = '#121B3B', stroke = 2.4, fill = 'none', label, style }) {
  const path = d || PATHS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill}
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ flex: 'none', ...style }}
    >
      <path d={path} />
    </svg>
  );
}

export function StarIcon({ size = 20, color = '#FFD21F', stroke, className = '', style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className} style={{ flex: 'none', ...style }}>
      <path
        d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.9z"
        fill={color}
        stroke={stroke || 'none'}
        strokeWidth={stroke ? 1.2 : 0}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({ size = 12 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label="Life support">
      <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="#FF6FA5" />
    </svg>
  );
}
