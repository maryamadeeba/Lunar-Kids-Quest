import { ResourceTiles } from './FlashcardDeck.jsx';
import { useState } from 'react';
import { changeClass, LESSONS, resourceIcon, resourceName, transitions, explainTransition, LEARNING_KEY } from '../lib/learning.js';
import { readJSON, writeJSON } from '../lib/storage.js';
import { applyEff, cellsFor } from '../lib/missionLogic.js';
import { BatteryCells } from './PuzzleCard.jsx';
import { MISSION_2 } from '../data/missions.js';
import Sheet from './Sheet.jsx';
import ChanduMascot from './ChanduMascot.jsx';
import SpeakButton from './SpeakButton.jsx';

export function ConsequenceReveal({ before, after, preview = false, cause, cells = 0, total = 0 }) {
  if (!before || !after) return null;
  return <section className="learning-card compact-consequence" aria-label={preview ? 'Plan preview' : 'Actual resource changes'}><div className="learning-eyebrow">{preview ? 'YOUR PLAN' : 'WHAT CHANGED'}</div><ResourceTiles before={before} after={after} cells={cells} total={total} neutral={preview} /><details><summary>Why did supplies change?</summary><p>{cause || explainTransition(before, after, cells)}</p><small>Game units, including crew use, harvests, and meter limits. Not NASA measurements.</small></details></section>;
}

export function LearningReport({ before, after, ids = [], previous, practice = false, onReplay }) {
  const [reflected, setReflected] = useState(false);
  return <section className="learning-card learning-report">
    <div className="learning-eyebrow">JUNIOR MISSION PLANNER {practice ? '· COMPARISON RUN' : ''}</div>
    <h2 className="display">My discoveries</h2>
    <ConsequenceReveal before={before} after={after} cause="Your whole mission: supplies gained and used" />
    {ids.length ? [...new Set(ids)].map(id => LESSONS[id] && <div className="discovery" key={id}><b>✦ {LESSONS[id].title}</b><p>{LESSONS[id].text}</p></div>) : <p>You tested a plan. Which supplies needed the most care?</p>}
    {previous && <div><h3>Compare two plans</h3><p>Same starting supplies and captured environment.</p><div className="comparison-grid"><b>Resource</b><b>First plan</b><b>This plan</b>{Object.keys(after).filter(k => typeof previous[k] === 'number').map(k => <div className="comparison-row" key={k}><span>{resourceIcon(k)} {resourceName(k)}</span><b>{previous[k]}</b><b className={changeClass(after[k] - previous[k])}>{after[k]}</b></div>)}</div><p>Different choices can have different benefits and costs.</p></div>}
    <strong>{LESSONS[ids[0]]?.prompt || 'What would you try differently next time?'}</strong>
    <div className="learning-actions"><button className="btn btn-soft" onClick={() => setReflected(true)}>I spotted a trade-off!</button>{onReplay && <button className="btn btn-soft" onClick={onReplay}>Try another plan</button>}</div>
    {reflected && <p role="status">Engineers learn by testing ideas. Your stars stay the same.</p>}
  </section>;
}

export function PlannerDiscoveries() {
  const data = readJSON(LEARNING_KEY);
  return <section className="learning-card"><div className="learning-eyebrow">JUNIOR MISSION PLANNER</div><h2 className="display">Trade-offs I discovered</h2>{(data.discoveries || []).length ? data.discoveries.map(id => LESSONS[id] && <p key={id}>✦ <b>{LESSONS[id].title}</b> — {LESSONS[id].text}</p>) : <p>Make choices in your missions to discover what they cost.</p>}</section>;
}

export function GuidedTutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const machine = MISSION_2.rounds[0].items.find(it => it.eff?.o > 0 && it.eff?.w < 0);
  const before = { ...MISSION_2.start };
  const after = applyEff(before, machine.eff);
  const cells = cellsFor(MISSION_2.rounds[0], {}, { site: null });
  const message = ['Welcome! Our crew needs air, water, and power.', 'Tap the oxygen maker. Watch water become air!', 'Fresh air used water and battery cells. That’s a trade-off!'][step];
  const finish = () => { writeJSON('lkq-tutorial-v1', { done: true }); onClose(); };
  return <Sheet label="Chandu’s practice base" fixed><div className="learning-eyebrow">PRACTICE BASE · NO MISSION SUPPLIES USED</div><h2 className="display">Let’s make some air!</h2>
    <div className="tutorial-base"><span aria-hidden="true">☀️ 🛰️</span><img src="/assets/crew-full.webp" alt="Amina, Bilal, and Zoya at our practice base" /></div>
    <div className="tutorial-coach"><ChanduMascot size={56} mood={step === 2 ? 'cheer' : 'think'} /><strong>{message}</strong><SpeakButton text={message} /></div>
    <div><strong>🔋 Battery: {step === 2 ? cells - machine.cost : cells} of {cells} cells free</strong><BatteryCells total={cells} used={step === 2 ? machine.cost : 0} /></div>
    {step === 0 && <><p>🫧 Air to breathe · 💧 Water to drink · 🔋 Power for machines</p><button className="btn btn-yellow" onClick={() => setStep(1)}>Meet the oxygen maker</button></>}
    {step === 1 && <><div className="learning-card"><b>Optional guess: what happens to our battery?</b><div className="learning-actions">{['↑ More', '↓ Less', '→ Same'].map(x => <button className="btn btn-soft" key={x} aria-pressed={prediction === x} onClick={() => setPrediction(x)}>{x}</button>)}</div></div><button className="btn btn-yellow" onClick={() => setStep(2)}>🔋 → ⚙ Oxygen maker · {machine.cost} cells</button></>}
    {step === 2 && <><ConsequenceReveal before={before} after={after} cells={machine.cost} cause="Oxygen maker only: no daily crew use in this practice." /><p>Our battery has fewer cells. We can’t use those cells twice.</p><button className="btn btn-yellow" onClick={finish}>Ready for my real mission!</button></>}
    <button className="btn btn-soft" onClick={finish}>Return to game</button>
  </Sheet>;
}

/**
 * Before the real storm warning: a short, neutral "get ready" sheet.
 * Practice is OPTIONAL (open by default only the very first time) and shows
 * all three places with their honest trade-off. It never tells the child
 * which place is right, so the real decision stays theirs.
 */
const PRACTICE_KEY = 'lkq-storm-practice-v1';
const SPOTS = {
  out: { label: 'Outside', icon: '🔬', note: 'the crew keeps working' },
  wall: { label: 'Behind the wall', icon: '🧱', note: 'the crew works behind the Moon-dirt wall' },
  in: { label: 'In the shelter', icon: '🛡', note: 'the crew waits safely inside' },
};
export function StormPractice({ onDone, hasWall = true }) {
  const firstTime = !readJSON(PRACTICE_KEY).done;
  const [open, setOpen] = useState(firstTime);
  const zones = hasWall ? ['out', 'wall', 'in'] : ['out', 'in'];
  const [spot, setSpot] = useState({ Amina: 'out', Bilal: 'out', Zoya: 'out' });
  const start = () => { writeJSON(PRACTICE_KEY, { done: true }); onDone(); };
  const move = name => setSpot(p => ({ ...p, [name]: zones[(zones.indexOf(p[name]) + 1) % zones.length] }));
  return <Sheet label="Storm warning: get ready" fixed>
    <div className="learning-eyebrow">STORM WARNING · CLOCK PAUSED</div>
    <h2 className="display">A real storm is coming</h2>
    <p>You will choose where each astronaut goes. Here is what each place means:</p>
    <div className="spot-legend">{zones.map(z => <span key={z}><b>{SPOTS[z].icon} {SPOTS[z].label}</b><small>{SPOTS[z].note}</small></span>)}</div>
    {open ? <div className="learning-card">
      <div className="learning-eyebrow">OPTIONAL PRACTICE · NO CLOCK · NO SUPPLIES USED</div>
      <p>Tap an astronaut to try each place. Nothing here counts.</p>
      {Object.keys(spot).map(name => <button className="btn btn-soft" key={name} onClick={() => move(name)}>{name}: {SPOTS[spot[name]].icon} {SPOTS[spot[name]].label}</button>)}
    </div> : <button className="btn btn-soft" onClick={() => setOpen(true)}>Practise moving the crew first (optional)</button>}
    <button className="btn btn-yellow" onClick={start}>Start the real warning</button>
    <small>The countdown comes from the real NASA warning time. The crew starts outside, working.</small>
  </Sheet>;
}
