// ============================================================
// What a choice did, as a picture: which machines were on or off,
// how much battery was left, where the crew was, which plants got water,
// and the result in plain words (green = gained, red = gave up).
// Numbers stay in the grown-up report.
// ============================================================
import Icon from './Icon.jsx';
import { BatteryLeft } from './FlashcardDeck.jsx';
import { resourceIcon, resultWords } from '../lib/learning.js';

const CREW = [
  { id: 'amina', name: 'Amina' }, { id: 'bilal', name: 'Bilal' }, { id: 'zoya', name: 'Zoya' },
];

export function ResultWords({ deltas = {}, extra = [] }) {
  const list = Object.entries(deltas).filter(([, d]) => d);
  if (!list.length && !extra.length) return null;
  return <div className="result-words">
    {list.map(([k, d]) => <span key={k} className={d > 0 ? 'tradeoff-gain' : 'tradeoff-loss'}>{d > 0 ? '▲' : '▼'} {resourceIcon(k)} {resultWords(k, d)}</span>)}
    {extra.map((x) => <span key={x.text} className={x.good ? 'tradeoff-gain' : 'tradeoff-loss'}>{x.good ? '▲' : '▼'} {x.text}</span>)}
  </div>;
}

export default function TradeoffPicture({ v }) {
  if (!v) return null;
  const extra = [...(v.words || [])];
  if (v.machines?.off?.length) extra.push({ text: `${v.machines.off.length} ${v.machines.off.length === 1 ? 'machine stayed' : 'machines stayed'} off`, good: false });
  return <div className="tradeoff-picture">
    {v.machines && <div className="tp-machines">
      {v.machines.on.map((m) => <span key={m.name} className="tp-machine on"><span className="tp-icon" style={{ background: m.color || '#FFF4C2' }}><Icon d={m.icon} size={22} stroke={2.2} /></span><b>{m.name}</b><small>✅ ON</small></span>)}
      {v.machines.off.map((m) => <span key={m.name} className="tp-machine off"><span className="tp-icon"><Icon d={m.icon} size={22} stroke={2.2} color="#6A6F9E" /></span><b>{m.name}</b><small>💤 OFF</small></span>)}
    </div>}
    {v.cells && <BatteryLeft used={v.cells.used} total={v.cells.total} />}
    {v.crew && <div className="tp-crew" role="img" aria-label={[v.crew.shelter && `${v.crew.shelter} in the shelter`, v.crew.wall && `${v.crew.wall} behind the wall`, v.crew.out && `${v.crew.out} outside`].filter(Boolean).join(', ')}>
      {[['shelter', '🛡 In the shelter'], ['wall', '🧱 Behind the wall'], ['out', '☀️ Outside']].filter(([z]) => v.crew[z]).map(([z, label], zi) => {
        const start = ['shelter', 'wall', 'out'].slice(0, ['shelter', 'wall', 'out'].indexOf(z)).reduce((n, k) => n + (v.crew[k] || 0), 0);
        return <span key={z} className={`tp-zone z-${z}`}><small>{label}</small><span>{Array.from({ length: v.crew[z] }, (_, i) => <img key={i} alt="" src={`/assets/crew-${CREW[(start + i) % 3].id}.webp`} />)}</span></span>;
      })}
    </div>}
    {v.plants && <div className="tp-plants" role="img" aria-label={`${v.plants.n} of ${v.plants.of} plants watered`}>
      {Array.from({ length: v.plants.of }, (_, i) => <span key={i} className={i < v.plants.n ? 'watered' : 'thirsty'}>{i < v.plants.n ? '🌿' : '🥀'}<small>{i < v.plants.n ? 'Watered' : 'Thirsty'}</small></span>)}
    </div>}
    <ResultWords deltas={v.deltas} extra={extra} />
  </div>;
}
