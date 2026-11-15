// ============================================================
// Side-quest add-ons. They reuse the game's cards, colours and engine:
// Choices are shown in neutral chips; only RESULTS use green = gain, red = loss (changeClass).
// ============================================================
import { useState } from 'react';
import Sheet from './Sheet.jsx';
import SpeakButton from './SpeakButton.jsx';
import { ResourceTiles } from './FlashcardDeck.jsx';
import { MachineDrawing } from './MachineAnimation.jsx';
import { SourceLink } from './NASAFactCard.jsx';
import { changeClass, resourceIcon, resourceName, transitions } from '../lib/learning.js';
import { STRATEGIES, readStrategies, pickWords } from '../lib/sideQuests.js';

export const SideQuestTag = ({ children = 'SIDE QUEST' }) => <span className="side-quest-tag">🧭 {children}</span>;

/** A floating telescope on the scene. */
export function TelescopeButton({ onClick }) {
  return <button type="button" className="telescope-btn" onClick={onClick} aria-label="Side quest: scan the Sun with the telescope">
    <svg aria-hidden="true" viewBox="0 0 40 40" width="30" height="30"><path d="M6 22 L28 10 L32 17 L10 29 Z" fill="#FFD21F" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /><circle cx="31" cy="13" r="4" fill="#4FC3F7" stroke="#fff" strokeWidth="2" /><path d="M16 26 L12 37 M18 25 L22 37" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></svg>
    <span>Scan</span>
  </button>;
}

/** ☀️ Tap-to-scan Sun: a real DONKI record, when it was checked, recent or archived. */
export function SunScan({ card, onClose }) {
  const [revealed, setRevealed] = useState(false);
  if (!card) return null;
  const speech = `${card.badge}. ${card.title}. ${card.date}. ${card.text} ${card.checked}`;
  return <Sheet label="Side quest: scan the Sun" fixed>
    <SideQuestTag>SIDE QUEST · CLOCK PAUSED</SideQuestTag>
    <h2 className="display">Scan the Sun</h2>
    {!revealed ? <>
      <div className="sun-scope" aria-hidden="true"><span className="sun-disc" /><span className="scope-ring" /></div>
      <p>Point NASA’s telescope at the Sun to find the real space weather record behind this mission.</p>
      <button className="btn btn-yellow" onClick={() => setRevealed(true)}>🔭 Tap to scan</button>
    </> : <div className="learning-card sun-card a-rise">
      <div className="sun-card-top"><span className={`data-badge ${card.kind}`}>{card.kind === 'recent' ? '🟢' : '📦'} {card.badge}</span><SpeakButton text={speech} label="Read the Sun card aloud" light /></div>
      <h3 className="display">{card.title}</h3>
      <div className="sun-facts"><span><b>Event date</b>{card.date}</span><span><b>Data checked</b>{card.checked}</span></div>
      <p>{card.text}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}><SourceLink link={card.link} size={13} /><SourceLink link={{ label: 'What is NASA DONKI?', href: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/' }} size={13} /></div>
    </div>}
    <button className="btn btn-soft" onClick={onClose}>Back to my mission</button>
  </Sheet>;
}

/** 🛡️ Shelter versus science: the same two machines, framed as one preparation choice. */
export function StormPrep({ items, on, free, onToggle }) {
  const brace = items.find((it) => it.id === 'brace');
  const drill = items.find((it) => it.id === 'drill');
  if (!brace || !drill) return null;
  const picks = [
    { it: brace, kind: 'shelter', label: 'Reinforce the shelter', gets: '🛡 Adds radiation safety when the storm hits' },
    { it: drill, kind: 'science', label: 'Power the science drill', gets: '🔬 Adds science today' },
  ];
  const chosen = picks.filter((p) => on[p.it.id]);
  return <section className="learning-card storm-prep" aria-label="Side quest: shelter versus science">
    <div className="sun-card-top"><SideQuestTag>STORM PREP</SideQuestTag><span className="muted" style={{ fontWeight: 800, fontSize: 13 }}>{free} cells free</span></div>
    <strong>A storm is coming later. Where will your power go?</strong>
    <div className="prep-grid">
      {picks.map((p) => <button type="button" key={p.it.id} className={`prep-choice ${on[p.it.id] ? 'on' : ''}`} aria-pressed={!!on[p.it.id]} onClick={() => onToggle(p.it)}>
        {on[p.it.id] && <span className="energy-flow" aria-hidden="true"><i /><i /><i /></span>}
        <span className="prep-picture" aria-hidden="true"><MachineDrawing kind={p.kind} running={!!on[p.it.id]} compact /></span>
        <b>{p.label}</b>
        <span className="chip-info"><strong>🔋 {p.it.cost} cells</strong></span>
      </button>)}
    </div>
    <p role="status" className="prep-note">{chosen.length === 0 ? 'Cells you spend here cannot power anything else.'
      : chosen.length === 2 ? `You powered both: ${brace.cost + drill.cost} cells that can’t charge the night battery or run the greenhouse.`
        : `🔋 → ${chosen[0].label.toLowerCase()}. Those ${chosen[0].it.cost} cells can’t power ${chosen[0].it.id === 'brace' ? 'science' : 'the shelter'} now.`}</p>
  </section>;
}

const MINI_CREW = ['amina', 'bilal', 'zoya'];
function MiniBase({ title, pick, before, after, tone }) {
  const zones = [...Array(pick.out || 0).fill('out'), ...Array(pick.wall || 0).fill('wall'), ...Array(pick.shelter || 0).fill('in')];
  const inside = zones.filter((z) => z === 'in').length;
  return <div className={`mini-base ${tone}`}>
    <div className="learning-eyebrow">{title}</div>
    <div className="mini-scene" aria-label={pickWords(pick)} role="img">
      <span className="mini-shelter" aria-hidden="true">🛡{inside > 0 && <b>{inside}</b>}</span><span className="mini-wall" aria-hidden="true">🧱</span>
      {zones.map((z, i) => z !== 'in' && <img key={i} alt="" className={`mini-crew z-${z}`} style={{ '--i': i }} src={`/assets/crew-${MINI_CREW[i]}.webp`} />)}
    </div>
    <small>{pickWords(pick)}</small>
    <ResourceTiles before={before} after={after} />
  </div>;
}

/** 👻 "What if?" ghost replay after a storm: your plan beside the other choice, same start. */
export function GhostReplay({ ghost, before, onClose }) {
  const diffs = transitions(ghost.mine.after, ghost.other.after);
  return <Sheet label="Side quest: what if?" fixed>
    <SideQuestTag>WHAT IF? · YOUR RESULT STAYS THE SAME</SideQuestTag>
    <h2 className="display">Try the other choice</h2>
    <div className="ghost-grid">
      <MiniBase title="YOUR PLAN" pick={ghost.mine.pick} before={before} after={ghost.mine.after} tone="mine" />
      <MiniBase title="👻 THE OTHER CHOICE" pick={ghost.other.pick} before={before} after={ghost.other.after} tone="ghost" />
    </div>
    <div className="learning-card">
      <strong>The other choice, compared with yours:</strong>
      <div className="ghost-diffs">{diffs.length ? diffs.map((x) => <span key={x.key} className={changeClass(x.delta)}>{resourceIcon(x.key)} <strong>{x.delta > 0 ? '+' : '−'}{Math.abs(x.delta)}</strong> {resourceName(x.key)}</span>) : <span className="tradeoff-neutral">Same result</span>}</div>
      <small>Worked out with the same game rules from the same starting supplies. Game units, not NASA measurements.</small>
    </div>
    <button className="btn btn-yellow" onClick={onClose}>Back to my mission</button>
  </Sheet>;
}

/** ⏪ Engineer's rewind result: first try beside the new try, for the same round. */
export function RewindCompare({ first, now }) {
  const keys = Object.keys(now).filter((k) => typeof first[k] === 'number');
  return <section className="learning-card" aria-label="Engineer’s rewind: what changed">
    <SideQuestTag>ENGINEER’S REWIND</SideQuestTag>
    <strong>You changed your plan. Here is the difference:</strong>
    <table className="plan-table"><thead><tr><th>Supply</th><th>First try</th><th>Now</th></tr></thead><tbody>
      {keys.map((k) => <tr key={k}><th>{resourceIcon(k)} {resourceName(k)}</th><td><strong className="result-number">{first[k]}</strong></td><td className={changeClass(now[k] - first[k])}><strong className="result-number">{now[k]}</strong> {now[k] !== first[k] && <small>({now[k] > first[k] ? '+' : '−'}{Math.abs(now[k] - first[k])})</small>}</td></tr>)}
    </tbody></table>
    <small>Failure gives engineers information. Your earned stars and official progress stay safe.</small>
  </section>;
}

/** New strategies collected this round. */
export function StrategyToasts({ ids = [] }) {
  return ids.map((id) => STRATEGIES[id] && <div className="discovery strategy-new" role="status" key={id}>📒 Strategy collected: <b>{STRATEGIES[id].icon} {STRATEGIES[id].title}</b></div>);
}

/** 📒 My Strategy Collection (Commander Log). */
export function StrategyCollection() {
  const found = readStrategies().found;
  const [open, setOpen] = useState(null);
  const ids = Object.keys(STRATEGIES);
  const got = ids.filter((id) => found[id]).length;
  const item = open && found[open];
  return <section className="learning-card">
    <div className="sun-card-top"><SideQuestTag>MY STRATEGY COLLECTION</SideQuestTag><b>{got} / {ids.length}</b></div>
    <p>Collect strategies by trying them. Each card keeps your real before-and-after result.</p>
    <div className="strategy-grid">
      {ids.map((id) => found[id]
        ? <button key={id} type="button" className="strategy-card got" onClick={() => setOpen(id)}><span aria-hidden="true">{STRATEGIES[id].icon}</span><b>{STRATEGIES[id].title}</b></button>
        : <div key={id} className="strategy-card locked"><span aria-hidden="true">❔</span><b>Not found yet</b><small>{STRATEGIES[id].hint}</small></div>)}
    </div>
    {item && <Sheet label={STRATEGIES[open].title} fixed>
      <SideQuestTag>STRATEGY CARD</SideQuestTag>
      <div className="strategy-hero" aria-hidden="true">{STRATEGIES[open].icon}</div>
      <h2 className="display">{STRATEGIES[open].title}</h2>
      <p>{STRATEGIES[open].text}</p>
      {item.where && <small>{item.where} · {item.at}</small>}
      {item.before && item.after ? <><div className="learning-eyebrow">YOUR ACTUAL RESULT · GAME UNITS</div><ResourceTiles before={item.before} after={item.after} /></> : <small>{item.note || 'Collected by exploring.'}</small>}
      <button className="btn btn-yellow" onClick={() => setOpen(null)}>Back to my collection</button>
    </Sheet>}
  </section>;
}

/** 🌗 End-of-mission choice: same challenge again, or a new mission day. */
export function NewDayChoice({ onSame, onNewDay }) {
  return <div className="learning-card new-day">
    <SideQuestTag>NEW MISSION DAY</SideQuestTag>
    <strong>What next, Commander?</strong>
    <div className="learning-actions">
      <button className="btn btn-soft" onClick={onSame}>🔁 Try this challenge again<br /><small>Same storm, same darkness</small></button>
      <button className="btn btn-yellow" onClick={onNewDay}>🌗 Explore a new mission day<br /><small>Another real storm and darkness</small></button>
    </div>
    <small>Both are practice runs: your best stars and base stay safe.</small>
  </div>;
}

/** Moon Map list: where each side quest lives, and whether it is open yet. */
export function SideQuestGuide({ progress = {}, onClose, onLog }) {
  const found = readStrategies().found;
  const finalOpen = !!progress.m3; const marsOpen = !!progress.final;
  const list = [
    { icon: '☀️', title: 'Scan the Sun', where: 'Final Mission and Mars Mode: tap the telescope on the scene.', open: finalOpen, done: found.sunScan },
    { icon: '🛡️', title: 'Shelter versus science', where: 'Final Mission and Mars Mode, first sunny round.', open: finalOpen, done: found.reinforced || found.scienceFirst },
    { icon: '👻', title: 'What if? Try the other choice', where: 'After the storm in the Final Mission and Mars Mode.', open: finalOpen, done: found.ghost },
    { icon: '🌗', title: 'New mission day', where: 'Finish the Final Mission, then pick “Explore a new mission day”.', open: marsOpen, done: found.newDay },
    { icon: '⏪', title: 'Engineer’s rewind', where: 'Missions 2, 3, the Final and Mars: after a round with no smart-choice star.', open: !!progress.m1, done: found.rewind },
    { icon: '📒', title: 'My Strategy Collection', where: 'Commander Log. Strategies collect as you play.', open: true, done: Object.keys(found).length > 0 },
  ];
  return <Sheet label="Side quests" fixed>
    <SideQuestTag>SIDE QUESTS · OPTIONAL</SideQuestTag>
    <h2 className="display">Side quests</h2>
    <p style={{ margin: 0 }}>Extra challenges hidden in your missions. They never change your stars or your base.</p>
    <ul className="quest-list">{list.map((q) => <li key={q.title} className={q.open ? '' : 'locked'}>
      <span aria-hidden="true">{q.open ? q.icon : '🔒'}</span>
      <span><b>{q.title}</b>{q.done && <em> ✓ found</em>}<small>{q.open ? q.where : `Unlocks later. ${q.where}`}</small></span>
    </li>)}</ul>
    <button className="btn btn-soft" onClick={onLog}>📒 Open my Strategy Collection</button>
    <button className="btn btn-yellow" onClick={onClose}>Back to the Moon Map</button>
  </Sheet>;
}
