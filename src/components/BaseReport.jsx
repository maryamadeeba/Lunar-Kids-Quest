import EmphasizeNumbers from './EmphasizeNumbers.jsx';
import FlashcardDeck, { ResourceTiles } from './FlashcardDeck.jsx';
import Sheet from './Sheet.jsx';
import { MachineDrawing } from './MachineAnimation.jsx';
import { changeClass, LESSONS, resourceIcon } from '../lib/learning.js';
import { scienceStory } from '../lib/visualLearning.js';
import { resourceName } from '../lib/learning.js';
import { LearningReport } from './LearningLab.jsx';
import { useReportFocus } from '../hooks/useReportFocus.js';
import { useEffect, useRef, useState } from 'react';
import Icon, { StarIcon } from './Icon.jsx';
import { SourceLink } from './NASAFactCard.jsx';
import Stage from './Stage.jsx';
import { SolarPanels, Dome, WaterTank, Rover, CommanderFigure } from './MoonParts.jsx';
import { OxygenTank, GreenhouseDome } from './MissionMap.jsx';
import { METERS } from '../data/missions.js';
import { playSound } from '../lib/sound.js';

export const MATES = {
  amina: { name: 'Amina', role: 'ENGINEER', bg: '#FFF4C2', img: '/assets/crew-amina.webp' },
  bilal: { name: 'Bilal', role: 'SCIENTIST', bg: '#D3F7F1', img: '/assets/crew-bilal.webp' },
  zoya: { name: 'Zoya', role: 'BOTANIST', bg: '#FFE0EC', img: '/assets/crew-zoya.webp' },
};

/** The Moon-dirt (regolith) wall, drawn as stacked blocks. */
export function MoonWall({ style }) {
  return (
    <svg role="img" aria-label="Moon-dirt wall" viewBox="0 0 92 30" style={{ position: 'absolute', width: 120, height: 30, ...style }}>
      <g fill="#8E939E" stroke="#6E7380" strokeWidth="1.5">
        {[2, 24, 46, 68].map((x) => <rect key={x} x={x} y="16" width="22" height="12" rx="3" />)}
        {[13, 35, 57].map((x) => <rect key={x} x={x} y="4" width="22" height="12" rx="3" />)}
      </g>
    </svg>
  );
}

/**
 * Base Report: shown after every mission, before the rewards.
 * The base the child built, their crew, the choices they made, and a
 * crewmate who explains each trade-off, one at a time.
 */
const esc = (x) => String(x ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const signed = (n) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0');

/** Save the full report as a small web page the family can open or print. */
function downloadReport({ kicker, stars, dayReport, rows, goal, choices, carryText, wrap, nasa }) {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${esc(kicker)} · Base report</title>
<style>body{font-family:system-ui,sans-serif;max-width:680px;margin:24px auto;padding:0 16px;color:#17234a;line-height:1.5}h1{margin-bottom:0}table{border-collapse:collapse;width:100%}td,th{border-bottom:2px solid #dce5ff;padding:8px;text-align:left}.up{color:#1d7a00;font-weight:800}.down{color:#c40000;font-weight:800}.card{border:2px solid #dce5ff;border-radius:14px;padding:10px 14px;margin:10px 0}small{color:#4A5078}</style></head><body>
<p><small>${esc(kicker)}</small></p><h1>Our base report</h1><p>${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} · ${stars} of 3 stars</p>
${dayReport?.length ? `<h2>Day report</h2><table>${dayReport.map(([t, c]) => `<tr><td>${esc(t)}</td><td class="${c.startsWith('+') ? 'up' : c.startsWith('−') ? 'down' : ''}">${esc(c)}</td></tr>`).join('')}</table>` : ''}
<h2>What changed</h2><table><tr><th>Supply</th><th>Start</th><th>End</th><th>Change</th></tr>${rows.map((r) => `<tr><td>${esc(r.name)}</td><td>${r.from}</td><td>${r.to}</td><td class="${r.to > r.from ? 'up' : r.to < r.from ? 'down' : ''}">${signed(r.to - r.from)}</td></tr>`).join('')}</table>
${goal ? `<p><b>Bonus goal:</b> ${esc(goal.text)} · ${goal.met ? 'reached' : 'not reached this time'}</p>` : ''}
<h2>My choices</h2>${choices.map((c) => `<div class="card"><b>${esc(c.title)}</b><br><span class="up">Got: ${esc(c.got)}</span> · <span class="down">Gave up: ${esc(c.gave)}</span><p>${esc(c.tip)}</p></div>`).join('')}
${carryText ? `<p>${esc(carryText)}</p>` : ''}${wrap ? `<p>${esc(wrap)}</p>` : ''}
${nasa ? `<h2>Real NASA connection</h2><p>${esc(nasa.real)}</p><ul>${(nasa.links || []).map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('')}</ul>` : ''}
<p><small>Lunar Kids Quest · game points are simplified game units, not NASA measurements.</small></p></body></html>`;
  try {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    const a = document.createElement('a'); a.href = url; a.download = 'my-base-report.html';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch { /* downloads blocked: the report is still on screen */ }
}

/** The full written report, shown only when the child asks for it at the end of the cards. */
function FullReport({ kicker, stars, dayReport, rows, goal, choices, carryText, wrap, nasa, onBack, onCollect }) {
  const focus = useRef(null);
  useEffect(() => { focus.current?.focus(); }, []);
  return <Sheet label="Full base report" fixed>
    <div ref={focus} tabIndex={-1} className="full-report">
      <span className="learning-eyebrow">{kicker}</span>
      <h2 className="display">Full base report</h2>
      <div role="img" aria-label={`${stars} of 3 stars`} style={{ display: 'flex', gap: 2 }}>{[0, 1, 2].map((i) => <StarIcon key={i} size={26} color={i < stars ? '#FFD21F' : '#EEF0FF'} stroke="#D19B00" />)}</div>
      {dayReport?.length > 0 && <section className="learning-card"><strong>Day report</strong>{dayReport.map(([text, chip]) => <div key={text} className="report-row"><span>{text}</span><span className={`pill ${chip.startsWith('+') ? 'tradeoff-gain' : chip.startsWith('−') ? 'tradeoff-loss' : 'tradeoff-neutral'}`}><EmphasizeNumbers text={chip} /></span></div>)}</section>}
      <section className="learning-card"><strong>What changed</strong>
        <table className="plan-table"><thead><tr><th>Supply</th><th>Start</th><th>End</th></tr></thead><tbody>
          {rows.map((r) => <tr key={r.key}><th>{resourceIcon(r.key)} {r.name}</th><td><strong className="result-number">{r.from}</strong></td><td className={changeClass(r.to - r.from)}><strong className="result-number">{r.to}</strong> {r.to !== r.from && <small>({signed(r.to - r.from)})</small>}</td></tr>)}
        </tbody></table>
        {goal && <p><b>Bonus goal:</b> {goal.text} · {goal.met ? 'reached ✓' : 'not reached this time'}</p>}
      </section>
      {choices.length > 0 && <section className="learning-card"><strong>My choices</strong>{choices.map((c) => <div key={c.title} className="report-choice"><b>{c.title}</b><div className="choice-picture"><span className="tradeoff-gain">↗ <EmphasizeNumbers text={c.got} /></span><span className="tradeoff-loss">↘ <EmphasizeNumbers text={c.gave} /></span></div><p><EmphasizeNumbers text={c.tip} /></p></div>)}</section>}
      {(carryText || wrap) && <section className="learning-card">{carryText && <p>{carryText}</p>}{wrap && <p>{wrap}</p>}</section>}
      {nasa && <section className="learning-card"><strong>Real NASA connection</strong><p>{nasa.real}</p>{nasa.links.map((l) => <SourceLink key={l.label} link={l} />)}</section>}
    </div>
    <button className="btn btn-soft" onClick={() => { playSound('click'); downloadReport({ kicker, stars, dayReport, rows, goal, choices, carryText, wrap, nasa }); }}>⬇ Download my report</button>
    <div className="report-actions"><button className="btn btn-white" onClick={onBack}>← My cards</button><button className="btn btn-yellow" onClick={onCollect}>Collect my stars</button></div>
  </Sheet>;
}

export default function BaseReport({ kicker, stars, mate = 'amina', site, wall, tank, greenhouse, rover, water = 6, suit = 'blue', choices = [], wrap, meters = [], carryText, nasa, goal, onCollect, onReplay, learning, dayReport }) {
  const [full, setFull] = useState(false);
  const [seen, setSeen] = useState(false);
  const before = learning?.before || Object.fromEntries(meters.map(m => [m.key, m.from]));
  const after = learning?.after || Object.fromEntries(meters.map(m => [m.key, m.to]));
  const ids = [...new Set(learning?.ids || [])];
  const basePicture = (
      <Stage height={250} style={{ background: 'var(--navy)' }}>
        <svg aria-hidden="true" viewBox="0 0 390 250" style={{ position: 'absolute', inset: 0, width: 390, height: 250 }}>
          {[[40, 30, 1.8], [120, 18, 1.3], [214, 40, 1.6], [290, 22, 1.4], [168, 70, 1.2]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill="#fff" />)}
          <circle cx="345" cy="44" r="20" fill="#4FC3F7" />
          <circle cx="38" cy="38" r="15" fill="#FFD21F" /><circle cx="38" cy="38" r="22" fill="#FFD21F" opacity=".22" />
          <path d="M0 250 L0 146 Q70 120 150 138 Q240 156 310 136 Q352 126 390 134 L390 250Z" fill="#B8BCC6" />
          <path d="M0 146 Q70 120 150 138 Q240 156 310 136 Q352 126 390 134" stroke="#E6E8EE" strokeWidth="4" fill="none" />
          <path d="M0 250 L0 208 Q120 226 220 220 Q320 214 390 230 L390 250Z" fill="#A3A8B3" />
        </svg>
        <span className="pill display" style={{ position: 'absolute', left: 12, top: 62, height: 24, fontSize: 13, background: site === 'crater' ? 'var(--sky)' : 'var(--yellow)' }}>{site === 'crater' ? 'Crater Edge' : 'Sunny Ridge'}</span>
        <SolarPanels glow width={86} style={{ left: 14, top: 112 }} />
        <Dome width={80} style={{ left: 102, top: 100 }} />
        <WaterTank level={water} style={{ left: 186, top: 108, width: 20, height: 44 }} />
        {tank && <OxygenTank style={{ left: 210, top: 104, width: 26, height: 44 }} />}
        {greenhouse && <GreenhouseDome style={{ left: 240, top: 110, width: 62, height: 40 }} />}
        {wall && <MoonWall style={{ left: 92, top: 148 }} />}
        {rover && <Rover style={{ left: 318, top: 130 }} />}
        <img className="a-pop" src="/assets/crew-full.webp" alt="Amina, Bilal and Zoya standing at the base" style={{ position: 'absolute', left: 150, top: 164, width: 92 }} />
        <CommanderFigure suit={suit} style={{ left: 268, top: 146 }} />
      </Stage>
  );
  const cards = [
    { title: 'Our base report', visual: basePicture, caption: `${stars} of 3 stars · ${learning?.practice ? 'comparison plan' : 'mission complete'}`, back: 'Look at the home your choices helped build.', details: <p>{carryText}</p> },
    { title: 'What changed?', caption: 'Game units · actual mission result', visual: <ResourceTiles before={before} after={after} />, back: 'Some supplies went up. Others went down. Our crew shared them.', details: <><p>{goal?.text} {goal?.met ? 'Goal reached.' : 'Try another plan next time.'}</p><p>{carryText}</p></> },
    ...choices.map((choice, i) => ({ title: `Your choice ${i + 1}`, visual: <><MachineDrawing kind={scienceStory(choice.title + ' ' + choice.tip).kind} running /><div className="choice-picture"><span className={/^(no net|nothing|no extra)/i.test(choice.got) ? 'tradeoff-neutral' : 'tradeoff-gain'}>↗ <EmphasizeNumbers text={choice.got} /></span><span className="tradeoff-loss">↘ <EmphasizeNumbers text={choice.gave} /></span></div></>, back: `You gained ${choice.got}. You gave up ${choice.gave}.`, details: <><h3>{choice.title}</h3><p><EmphasizeNumbers text={choice.tip} /></p></> })),
    ...(learning?.previous ? [{ title: 'Two plans, different results', visual: <table className="plan-table"><thead><tr><th>Supply</th><th>First</th><th>Now</th></tr></thead><tbody>{Object.keys(after).filter(k => typeof learning.previous[k] === 'number').map(k => <tr key={k}><th>{resourceIcon(k)} {resourceName(k)}</th><td><strong className="result-number">{learning.previous[k]}</strong></td><td className={changeClass(after[k] - learning.previous[k])}><strong className="result-number">{after[k]}</strong> <small>({after[k] > learning.previous[k] ? '+' : after[k] < learning.previous[k] ? '−' : ''}{Math.abs(after[k] - learning.previous[k])})</small></td></tr>)}</tbody></table>, back: 'Same starting supplies. Same conditions. A different choice changed the result.' }] : []),
    { title: 'You are a mission planner!', visual: <><img className="report-crew" src="/assets/crew-full.webp" alt="Your crew celebrates" /><div className="discovery-pictures">{ids.map(id => LESSONS[id] && <span key={id}>✦ {LESSONS[id].title}</span>)}</div></>, back: ids.length ? LESSONS[ids[0]]?.text : 'Engineers test ideas. What would you try differently?', details: <><p>{wrap}</p>{nasa && <><p>{nasa.real}</p>{nasa.links.map(l => <SourceLink key={l.label} link={l} />)}</>}<button className="btn btn-soft" onClick={onReplay}>Try another plan</button></> },
  ];
  const collect = () => { playSound('win'); onCollect(); };
  const rows = Object.keys(after).filter((k) => typeof before[k] === 'number').map((k) => ({ key: k, name: resourceName(k), from: before[k], to: after[k] }));
  if (full) return <FullReport kicker={kicker} stars={stars} dayReport={dayReport} rows={rows} goal={goal} choices={choices} carryText={carryText} wrap={wrap} nasa={nasa} onBack={() => { setSeen(true); setFull(false); }} onCollect={collect} />;
  return <Sheet label="Base report flashcards" fixed><FlashcardDeck cards={cards} kicker={kicker} label="Base report" start={seen ? cards.length - 1 : 0} doneLabel="Collect my stars" onDone={collect}
    endExtra={<button className="btn btn-soft" onClick={() => { playSound('click'); setFull(true); }}>📄 View or download the full report</button>} /></Sheet>;
}
