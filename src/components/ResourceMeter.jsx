import { HeartIcon } from './Icon.jsx';

/**
 * One resource meter (0 to 10 game points). Life-support meters show a heart.
 * A meter at 3 or less turns pink. `delta` shows a +2 / -1 badge after a change.
 */
export function ResourceMeter({ name, color, value, delta = 0, essential = false, score = false }) {
  const low = value <= 3 && !score; // a score (Science) is never a warning
  return (
    <div role="meter" aria-label={name === 'Shield' ? 'Radiation safety' : name} aria-valuemin={0} aria-valuemax={10} aria-valuenow={value}
      style={{
        position: 'relative', height: 54, padding: '5px 4px', borderRadius: 14,
        background: low ? 'var(--pink-soft)' : 'var(--indigo-2)', border: `2px solid ${low ? '#FF6FA5' : 'var(--indigo-2)'}`,
        color: low ? 'var(--navy)' : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {essential ? <HeartIcon size={11} /> : <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />}
        <span style={{ fontWeight: 800, fontSize: 13, lineHeight: '15px' }}>{name === 'Shield' ? 'Safety' : name}</span>
      </div>
      <div className="display" style={{ fontSize: 18, lineHeight: '18px' }}>{value}</div>
      <div className="meter-segments" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} className={i < value ? 'filled' : ''} style={{ '--meter-color': color }} />)}</div>
      <div style={{ width: '100%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
        <div className="bar" style={{ height: 5, borderRadius: 3, width: `${value * 10}%`, background: color }} />
      </div>
      {delta !== 0 && (
        <div className="a-pop" style={{ position: 'absolute', top: -9, right: -3, height: 20, padding: '0 6px', borderRadius: 10, background: delta > 0 ? 'var(--gain-color)' : 'var(--loss-color)', color: 'var(--tradeoff-ink)', fontWeight: 800, fontSize: 13, lineHeight: '20px' }}>
          {delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`}
        </div>
      )}
    </div>
  );
}

/** The row of meters shown at the top of a mission. */
export default function ResourceBar({ meters }) {
  return (
    <div
      aria-label="Base meters, game points from 0 to 10" aria-live="polite" aria-atomic="true"
      style={{ flex: 'none', padding: '4px 10px 8px', display: 'grid', gridTemplateColumns: `repeat(${meters.length}, minmax(0, 1fr))`, gap: 5 }}
    >
      {meters.map(({ key, ...meter }) => <ResourceMeter key={key} {...meter} />)}
    </div>
  );
}
