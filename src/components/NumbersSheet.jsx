import { childText } from '../lib/learning.js';
import Sheet from './Sheet.jsx';
import Icon from './Icon.jsx';
import { SourceLink } from './NASAFactCard.jsx';
import { R, SOURCES, TIERS } from '../data/ratios.js';

const TIER_WORD = { TINY: 'Tiny', SMALL: 'Small', MEDIUM: 'Medium', LARGE: 'Large', HUGE: 'Huge' };

/**
 * "How we made the numbers": every game value, built straight from ratios.js,
 * with a green "NASA ratio" badge (and its source) or a grey "Estimate" badge.
 */
export default function NumbersSheet({ onClose }) {
  const groups = [...new Set(Object.values(R).map((x) => x.group))];
  const nasaN = Object.values(R).filter((x) => x.basis === 'nasa').length;
  return (
    <Sheet label="How we made the numbers" dim={0.8} fixed>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <h2 className="display" style={{ fontSize: 26, lineHeight: '29px' }}>How we made the numbers</h2>
        <button type="button" className="btn btn-round" aria-label="Close" style={{ flex: 'none', background: '#EEF0FF' }} onClick={onClose}><Icon name="close" size={24} stroke={2.8} /></button>
      </div>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, lineHeight: '21px' }}>
        Game points are simplified. Some sizes come from NASA numbers (like astronauts needing about 3 times more drinking water than oxygen each day, or ice mining using more power than the whole base). Others are our best estimates where NASA has not shared exact numbers yet.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {Object.entries(TIERS).map(([t, n]) => <span key={t} className="pill" style={{ height: 26, fontSize: 13, background: '#EEF0FF' }}>{TIER_WORD[t]} = {n}</span>)}
      </div>
      <div className="muted" style={{ fontWeight: 800, fontSize: 13 }}>{nasaN} sizes come from NASA · {Object.keys(R).length - nasaN} are estimates</div>
      {groups.map((g) => (
        <section key={g} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h3 className="display" style={{ fontSize: 18, lineHeight: '22px' }}>{g}</h3>
          {Object.entries(R).filter(([, x]) => x.group === g).map(([key, x]) => (
            <div key={key} style={{ padding: '8px 10px', borderRadius: 14, background: x.basis === 'nasa' ? 'var(--green-soft)' : '#F1F2F7', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: 14, flex: '1 1 auto' }}>{childText(x.label)}</span>
                <span className="pill" style={{ height: 22, fontSize: 13, background: '#fff' }}>{TIER_WORD[x.tier]} · {x.points}</span>
                <span className="pill" style={{ height: 22, fontSize: 13, background: x.basis === 'nasa' ? 'var(--green)' : '#C9CCD6' }}>{x.basis === 'nasa' ? 'NASA ratio' : 'Estimate'}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, lineHeight: '17px' }}>{childText(x.why)}</div>
              {x.src.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 12px' }}>{x.src.map((s) => <SourceLink key={s} link={SOURCES[s]} size={12} />)}</div>}
            </div>
          ))}
        </section>
      ))}
      <button type="button" className="btn btn-yellow" style={{ height: 58, fontSize: 22, flex: 'none' }} onClick={onClose}>Got it!</button>
    </Sheet>
  );
}
