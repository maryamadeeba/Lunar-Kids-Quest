import Sheet from './Sheet.jsx';
import { NewDayChoice } from './SideQuests.jsx';
import { useReportFocus } from '../hooks/useReportFocus.js';
import { StarIcon } from './Icon.jsx';

/** Celebration screen at the end of a mission. */
export default function RewardModal({ commander, stars, badge, unlock, facts = [], onMap, onDashboard, onReplay, onNewDay, note, onNumbers, challenges, onData, notes }) {
  return <Sheet label="Mission rewards" fixed><div className="reward-picture"><Confetti /><img src="/assets/crew-full.webp" alt="Your crew celebrating" /><h2 className="display">Mission complete!</h2><p>Shabash, {commander}!</p><BigStars stars={stars} sizes={[42, 52, 42]} /></div><div className="reward-badges"><span>🏅 {badge}</span><span>🏠 {unlock}</span></div><button className="btn btn-yellow" onClick={onMap}>Back to Moon Map</button>{onNewDay ? <><NewDayChoice onSame={onReplay} onNewDay={onNewDay} /><button className="btn btn-soft" onClick={onDashboard}>My badges</button></> : <div className="learning-actions"><button className="btn btn-soft" onClick={onDashboard}>My badges</button><button className="btn btn-soft" onClick={onReplay}>Play again</button></div>}<details className="flash-source"><summary>Mission notes & NASA sources</summary>{note && <p>{note}</p>}{facts.map(f => <p key={f}>{f}</p>)}{notes}{challenges?.map(c => <p key={c}>☆ {c}</p>)}<NumbersNote onNumbers={onNumbers} />{onData && <button className="btn btn-soft" onClick={onData}>Real NASA data</button>}</details></Sheet>;
}

function Tile({ bg, small, big }) {
  return (
    <div style={{ padding: 8, borderRadius: 18, background: bg, color: 'var(--navy)', textAlign: 'center' }}>
      <div style={{ fontWeight: 800, fontSize: 13, color: small === 'BADGE' ? '#5B41B8' : 'var(--navy)' }}>{small}</div>
      <div className="display" style={{ fontSize: small === 'XP' ? 24 : 15, lineHeight: small === 'XP' ? '26px' : '18px' }}>{big}</div>
    </div>
  );
}

export function BigStars({ stars, sizes = [60, 72, 60] }) {
  return (
    <div role="img" aria-label={`${stars} of 3 stars`} style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
      {sizes.map((s, i) => (
        <StarIcon key={i} className={i === 0 ? 'a-pop' : i === 1 ? 'a-pop-2' : 'a-pop-3'} size={s} color={i < stars ? '#FFD21F' : '#3A3FA6'} stroke="#FFFFFF" style={{ marginTop: i === 1 ? -8 : 0 }} />
      ))}
    </div>
  );
}

export function Confetti() {
  const bits = [
    [20, 0, '#FFD21F'], [70, 0.6, '#FF8FB8'], [120, 1.3, '#43D13A'], [180, 0.3, '#FFFFFF'],
    [230, 1.8, '#FFD21F'], [280, 0.9, '#4FC3F7'], [320, 2.2, '#43D13A'], [150, 2.6, '#FF8FB8'],
  ];
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {bits.map(([left, delay, color], i) => (
        <div key={i} className="a-fall" style={{ position: 'absolute', left: `${(left / 390) * 100}%`, top: 0, width: 10, height: i % 2 ? 10 : 16, borderRadius: i % 2 ? 5 : 3, background: color, animationDelay: `${delay}s` }} />
      ))}
    </div>
  );
}

/** The honest-numbers line, with a button that opens "How we made the numbers". */
export function NumbersNote({ onNumbers }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontWeight: 700, fontSize: 13, lineHeight: '16px', color: '#4A5078' }}>
        Game points are simplified. Some sizes come from NASA numbers (like astronauts needing about 3 times more drinking water than oxygen each day, or ice mining using more power than the whole base). Others are our best estimates where NASA has not shared exact numbers yet.
      </div>
      {onNumbers && <button type="button" onClick={onNumbers} style={{ alignSelf: 'flex-start', background: 'none', border: 0, padding: '4px 0', color: '#3D2A8A', fontWeight: 800, fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }}>How we made the numbers</button>}
    </div>
  );
}
