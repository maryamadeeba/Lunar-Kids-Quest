import Icon, { StarIcon } from './Icon.jsx';
import { formatClock } from '../hooks/useMissionClock.js';

/**
 * Top bar used in missions: back button, title, step progress,
 * mission clock and the stars earned so far.
 */
export default function ProgressHeader({ title, steps = [], onBack, backLabel = 'Back', clock, stars }) {
  const hurry = clock && clock.seconds <= 30 && clock.active;
  return (
    <div style={{ flex: 'none', padding: '12px 14px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <button type="button" className="btn btn-back" style={{ width: 46, height: 46 }} aria-label={backLabel} onClick={onBack}>
        <Icon name="back" size={24} stroke={3} />
      </button>
      <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <h1 className="display" style={{ fontSize: 15, lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
        <div role="img" aria-label={`Step ${Math.max(1, steps.filter((s) => s !== 'todo').length)} of ${steps.length}`} style={{ display: 'flex', gap: 5 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: '1 1 0', height: 9, borderRadius: 5, background: s === 'done' ? 'var(--yellow)' : s === 'now' ? '#8E95E8' : 'var(--indigo-3)' }} />
          ))}
        </div>
      </div>
      {clock && (
        <div
          className={hurry ? 'a-hurry' : ''}
          role="timer"
          aria-label={`${Math.floor(clock.seconds / 60)} minutes ${clock.seconds % 60} seconds left`}
          style={{ flex: 'none', height: 40, padding: '0 10px', borderRadius: 20, background: hurry ? 'var(--pink)' : '#fff', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}
        >
          <Icon name="clock" size={18} stroke={2.6} />
          {formatClock(clock.seconds)}
        </div>
      )}
      {typeof stars === 'number' && (
        <div role="img" aria-label={`${stars} of 3 stars earned so far`} style={{ flex: 'none', height: 40, padding: '0 8px', borderRadius: 20, background: 'var(--indigo-2)', display: 'flex', alignItems: 'center', gap: 1 }}>
          {[0, 1, 2].map((i) => <StarIcon key={i} size={18} color={i < stars ? '#FFD21F' : '#474DB5'} />)}
        </div>
      )}
    </div>
  );
}
