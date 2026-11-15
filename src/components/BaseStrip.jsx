import { resourceName } from '../lib/learning.js';
import { METERS } from '../data/missions.js';
import { ORDER } from '../lib/missionLogic.js';

/**
 * "Your base": what the child has built so far and the meters it carries
 * into the next mission. Shown on the Moon Map and in each mission's Ready sheet.
 */
export default function BaseStrip({ base, dark = false, startMeters, meterKeys = [] }) {
  const parts = [
    base.site ? { label: base.site === 'ridge' ? 'Sunny Ridge home' : 'Crater Edge home', bg: base.site === 'ridge' ? 'var(--yellow-soft)' : 'var(--sky-soft)' } : { label: 'No home yet', bg: '#EEF0FF' },
    base.wall && { label: 'Moon-dirt wall', bg: '#E6E0FF' },
    base.tank && { label: 'Oxygen Tank', bg: '#DDF3FF' },
    base.greenhouse && { label: 'Greenhouse', bg: 'var(--green-soft)' },
  ].filter(Boolean);
  const last = [...ORDER].reverse().find((k) => base.after[k]);
  return (
    <div aria-label="Your base" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 10px', borderRadius: 16, background: dark ? 'var(--indigo-2)' : '#F4F5FF' }}>
      <div className="kicker" style={{ fontSize: 13, color: dark ? 'var(--yellow)' : '#5B41B8' }}>YOUR BASE</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {parts.map((p) => <span key={p.label} className="pill" style={{ height: 26, fontSize: 13, background: p.bg, color: 'var(--navy)' }}>{p.label}</span>)}
      </div>
      {startMeters && meterKeys.length > 0 && (
        <div style={{ fontWeight: 700, fontSize: 13, lineHeight: '17px', color: dark ? '#fff' : 'var(--navy)' }}>
          {last ? 'Starts from your base: ' : 'Fresh start: '}
          {meterKeys.map((k) => `${resourceName(k)} ${startMeters[k]}`).join(' · ')}
        </div>
      )}
    </div>
  );
}
