import { READINGS, RADLAB_UNIT } from '../data/radiation.js';
import { SourceLink } from './NASAFactCard.jsx';
import GlossText from './GlossText.jsx';

const fmt = (n) => (n >= 100 ? Math.round(n).toLocaleString('en-US') : String(Math.round(n * 10) / 10));

/**
 * Real radiation numbers side by side. Bars use a "times 10" scale
 * (each step is 10 times more), because the numbers are SO different.
 */
export default function RadiationRuler({ compact = false }) {
  const rows = [...READINGS].sort((a, b) => a.typical - b.typical);
  const max = Math.log10(30000);
  const calm = READINGS.find((r) => r.id === 'moonCalm').typical; const peak = READINGS.find((r) => r.id === 'moonStorm').typical;
  const cabin = READINGS.find((r) => r.id === 'cabin').typical;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontWeight: 700, fontSize: 16, lineHeight: '22px' }}>
        <GlossText text={`Real radiation readings, in μGy per hour. Near the Moon on a calm day: about ${Math.round(calm)}. In the February 2023 solar storm it jumped to about ${fmt(Math.round(peak / 10) * 10)}: about ${Math.round(peak / calm / 10) * 10} times more! In a computer simulation of the huge 1989 storm, NASA scientists worked out about ${fmt(Math.round(cabin / 1000) * 1000)} in Orion’s open cabin. That is why crews hide in a shelter.`} />
      </div>
      {rows.map((r) => {
        const w = Math.max(4, (Math.log10(Math.max(1, r.typical)) / max) * 100);
        return (
          <div key={r.id} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontWeight: 800, fontSize: 14 }}>
              <span>{r.place}</span>
              <span style={{ whiteSpace: 'nowrap' }}>{r.low != null ? `${fmt(r.low)}–${fmt(r.high)}` : fmt(r.typical)}</span>
            </div>
            <div role="img" aria-label={`${r.place}: about ${fmt(r.typical)} micro-grays per hour`} style={{ height: 14, borderRadius: 7, background: '#E7E9F6', overflow: 'hidden' }}>
              <div style={{ width: `${w}%`, height: 14, borderRadius: 7, background: r.color }} />
            </div>
            {!compact && <div className="muted" style={{ fontWeight: 700, fontSize: 13, lineHeight: '17px' }}>{r.who}. {r.note}</div>}
          </div>
        );
      })}
      <div className="muted" style={{ fontWeight: 700, fontSize: 13, lineHeight: '17px' }}>Each bar step is 10 times bigger than the one before, so huge and tiny numbers fit on one ruler.</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
        {[RADLAB_UNIT, READINGS.find((r) => r.id === 'cabin').link].map((l) => <SourceLink key={l.label} link={l} size={13} />)}
      </div>
    </div>
  );
}
