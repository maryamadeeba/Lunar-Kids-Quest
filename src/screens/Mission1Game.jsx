import EmphasizeNumbers from '../components/EmphasizeNumbers.jsx';
import EquipmentCards from '../components/EquipmentCards.jsx';
import MissionMath from '../components/MissionMath.jsx';
import { MachineTheatre } from '../components/MachineAnimation.jsx';
import { resourceName } from '../lib/learning.js';
// ============================================================
// Mission 1: Find Our Moon Home.
// The commander walks around the Moon, scans two sites, builds a base,
// fixes the weak meter (rover ice trips or carrying solar panels),
// powers the machines, solves a battery puzzle, then runs the base for a day.
// Rules live in src/lib/mission1Logic.js; numbers come from src/data/ratios.js.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { GuidedTutorial, ConsequenceReveal } from '../components/LearningLab.jsx';
import { childText, recordLearning, explainTransition } from '../lib/learning.js';
import { readJSON } from '../lib/storage.js';
import ProgressHeader from '../components/ProgressHeader.jsx';
import ResourceBar from '../components/ResourceMeter.jsx';
import MissionDialogue from '../components/MissionDialogue.jsx';
import { BatteryCells } from '../components/PuzzleCard.jsx';
import BaseReport from '../components/BaseReport.jsx';
import NASAFactCard from '../components/NASAFactCard.jsx';
import Stage from '../components/Stage.jsx';
import Icon, { StarIcon } from '../components/Icon.jsx';
import { ReadySheet, AbortSheet, StarToast } from '../components/MissionSheets.jsx';
import { Stars, Earth, Sun, SolarPanels, OnePanel, Dome, WaterTank, Greenhouse, Bubbles, Rover, CommanderFigure } from '../components/MoonParts.jsx';
import { MissionButtonGrid, cellWord, listWords, chips } from './MissionGame.jsx';
import { MISSION1 } from '../data/mission1.js';
import { ICONS, CARDS, METERS, MISSION_2 } from '../data/missions.js';
import { R } from '../data/ratios.js';
import { m1Compute, m1Used, m1Recharge } from '../lib/mission1Logic.js';
import { goalMet, startFor, readBase } from '../lib/missionLogic.js';
import { useMissionClock } from '../hooks/useMissionClock.js';
import { getCommander, getProgress, writeJSON, KEYS, addNotebookFact, completeMission, saveBase } from '../lib/storage.js';
import { playSound } from '../lib/sound.js';
import { go } from '../lib/router.js';
import { radioDelayMs, callingText, replyText, saveDelayFact } from '../lib/radio.js';

const SPOTS = {
  start: { x: 168, y: 104 }, ridge: { x: 96, y: 20 }, crater: { x: 226, y: 104 },
  crystals: [{ x: 258, y: 224 }, { x: 308, y: 232 }, { x: 358, y: 222 }],
  panels: [{ x: 54, y: 104 }, { x: 104, y: 104 }, { x: 154, y: 106 }],
};
const METER_META = [
  { key: 'o', name: 'Oxygen', color: '#B3E5FC' },
  { key: 'w', name: 'Water', color: '#4FC3F7' }, { key: 's', name: 'Radiation safety', color: '#B9A6FF' },
];
const LIFE = MISSION1.machines.filter((m) => m.life);
const compute = (s) => m1Compute({ site: s.site, taps: s.taps.length, on: s.on, dayDone: s.dayDone });
const diff = (a, b) => { const d = {}; Object.keys(a).forEach((k) => { if (b[k] !== a[k]) d[k] = b[k] - a[k]; }); return d; };

export default function Mission1Game() {
  const [runId, setRunId] = useState(0);
  const [wasComplete] = useState(() => !!getProgress().m1);
  const [firstResult, setFirstResult] = useState(() => readJSON('lkq-replay-m1').result || (wasComplete ? getProgress().base?.after?.m1 : null));
  return <Mission1Run key={runId} practice={wasComplete || runId > 0 && !!firstResult} previous={wasComplete || runId > 0 ? firstResult : null} onFinish={r => { if (!firstResult) { writeJSON('lkq-replay-m1', { result: r }); setFirstResult(r); } }} onReplay={() => setRunId((n) => n + 1)} />;
}

function Mission1Run({ onReplay, practice, previous, onFinish }) {
  const commander = getCommander();
  const [inspect, setInspect] = useState(false);
  const time = MISSION1.time[commander.level];
  const [tutorial, setTutorial] = useState(() => commander.level === 'explorer' && !readJSON('lkq-tutorial-v1').done);
  const busy = useRef(false);
  const moving = useRef(false);
  const [hintLevel, setHintLevel] = useState(0);
  const timers = useRef([]);
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const [s, setS] = useState({
    stage: 'scout', at: 'start', walking: false, site: null, taps: [], on: {}, mistake: false,
    dayRunning: false, dayDone: false, before: null, lastD: {}, rover: null,
    nasa: null, report: false, started: false, earned: 0, toast: null, failed: null,
    houstonUsed: false, warned: false, mood: 'think', msg: 'Salam, Commander! Tap a glowing spot to walk there.',
  });
  const set = (patch) => setS((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));

  const fail = (why) => {
    playSound('low');
    timers.current.forEach(clearTimeout);
    set({ failed: why, walking: false, dayRunning: false, nasa: null, toast: null, mood: 'worry', msg: 'Mission abort. The crew is safe. Let us try again!' });
  };
  const clockRunning = !tutorial && !inspect && s.stage !== 'math' && s.started && !s.nasa && !s.dayRunning && s.stage !== 'dayDone' && !s.failed;
  const [timeLeft] = useMissionClock(time, clockRunning, () => fail('time'));
  const warned30 = useRef(false);
  useEffect(() => {
    if (timeLeft === 30 && clockRunning && !warned30.current) { warned30.current = true; playSound('low'); set({ mood: 'worry', msg: 'Only 30 seconds left, Commander! Hurry!' }); }
  }, [timeLeft, clockRunning]);

  const award = (text) => {
    playSound('good');
    set((prev) => (prev.earned >= 3 ? {} : { earned: prev.earned + 1, toast: text }));
    later(() => set({ toast: null }), 2200);
  };

  const r = compute(s);
  const site = s.site;

  // ---------- actions ----------
  const scout = (where) => {
    if (s.walking || moving.current) return;
    playSound('click');
    moving.current = true;
    set({ at: where, walking: true, msg: 'Walking…', mood: 'happy' });
    later(() => {
      playSound('pick');
      moving.current = false;
      set({ walking: false, stage: 'scan', mood: 'think', msg: where === 'ridge' ? 'Wow, so much sunlight here! But the ice is far away.' : 'Brrr, it is shady here. I can see ice in the crater!' });
    }, 1250);
  };
  const build = () => {
    const before = compute(s);
    const after = compute({ ...s, site: s.at });
    playSound('low');
    if (s.at === 'ridge') award('NASA’s kind of spot! +1 star');
    set({
      stage: 'fix', nasa: 'site', site: s.at, lastD: diff(before, after), rover: s.at === 'ridge' ? { x: 120, y: 90 } : null, mood: 'worry',
      msg: `Base built! Uh-oh, ${s.at === 'ridge' ? 'Water' : 'Power'} is low. ${s.at === 'ridge' ? 'Tap the ice to send our rover!' : 'Tap the glowing spots to carry panels into the sun!'}`,
    });
  };
  const tapTarget = (i) => {
    if (s.walking || moving.current || s.taps.includes(i)) return;
    moving.current = true;
    const before = compute(s);
    const taps = [...s.taps, i];
    const after = compute({ ...s, taps });
    playSound('click');
    if (site === 'ridge') {
      const c = SPOTS.crystals[i];
      set({ walking: true, rover: { x: c.x - 23, y: c.y - 30 } });
      later(() => { moving.current = false; playSound('good'); set({ walking: false, taps, lastD: diff(before, after), mood: 'cheer', msg: `Got the ice! ${MISSION1.trip.ridge.gain}. The rover used ${R.roverTripPower.points} Power.` }); }, 1250);
    } else {
      set({ walking: true, at: `panel${i}` });
      later(() => { moving.current = false; playSound('good'); set({ walking: false, taps, lastD: diff(before, after), mood: 'cheer', msg: `Panel placed! ${MISSION1.trip.crater.gain}. Being outside used ${R.outdoorShield.points} Radiation safety.` }); }, 1250);
    }
  };
  const fixDone = () => {
    if (s.walking || moving.current) return;
    playSound('click');
    set({ stage: 'power', nasa: 'fix', at: site, lastD: {}, mood: 'think', msg: 'Tap machines to turn them on. The crew breathes, drinks and eats every day!' });
  };
  const toggle = (m) => {
    const on = { ...s.on };
    if (!on[m.id] && m1Used(on) + m.cost > r.p) { playSound('oops'); set({ mood: 'worry', msg: 'Not enough battery cells! Turn something off first.' }); return; }
    on[m.id] = !on[m.id];
    playSound(on[m.id] ? 'pick' : 'click');
    set({ on, warned: false, mood: 'happy', msg: on[m.id] ? `${m.name} on! ${cellWord(r.p - m1Used(on))} still yellow.` : `${m.name} off.` });
  };
  const powerNext = () => {
    const missing = LIFE.filter((m) => !s.on[m.id]);
    if (missing.length && !s.warned) { playSound('oops'); set({ warned: true, mistake: true, mood: 'worry', msg: `Are you sure? ${missing.map((m) => m.name).join(' and ')} keeps the crew alive and is off. Press Power on again to go anyway.` }); return; }
    playSound('click');
    set({ stage: 'math', nasa: 'power', at: site, mood: 'happy', msg: 'Let’s count our free battery cells before we run.' });
  };
  const runDay = () => {
    if (busy.current || s.dayDone) return;
    busy.current = true;
    const before = compute(s);
    playSound('click');
    set({ stage: 'dayRun', dayRunning: true, mood: 'happy', msg: 'Here comes the Sun! Watch the base.', before });
    later(() => {
      const after = compute({ ...s, dayDone: true });
      const dead = MISSION1.essentials.filter((k) => after[k] <= 0);
      if (dead.length) { set({ dayDone: true, lastD: diff(before, after) }); fail(dead[0]); return; }
      const low = Object.keys(after).filter((k) => after[k] <= 3);
      const lifeOk = LIFE.every((m) => s.on[m.id]);
      if (!low.length && lifeOk) award('Safe day at the base! +1 star');
      const goalOk = goalMet(MISSION1.goal, after);
      if (goalOk) award('Bonus goal reached! +1 star');
      playSound('win');
      onFinish(after);
      if (!practice) recordLearning('m1', ['site', ...(s.on.oxy && after.o > before.o ? ['air'] : []), ...(m1Used(s.on) > 0 ? ['power'] : [])], MISSION1.start, after);
      if (!practice) saveBase('m1', { o: after.o, w: after.w, s: after.s }, { site: s.site, wall: !!s.on.wall });
      const stars = Math.max(1, Math.min(3, s.earned + (!low.length && lifeOk ? 1 : 0) + (goalOk ? 1 : 0)));
      if (!practice) {
        writeJSON(KEYS.mission1, { site: s.site, taps: s.taps.length, on: s.on, res: after, stars });
        completeMission('m1', stars);
      }
      setS((prev) => {
        const msg = !lifeOk ? 'Life support stayed off. Try sharing power another way.'
          : low.length ? 'A tank is low. What could we save next time?' : explainTransition(before, after, m1Used(s.on));
        return {
          ...prev, stage: 'dayDone', nasa: null, dayRunning: false, dayDone: true, lastD: diff(before, after), report: true,
          mistake: prev.mistake || !lifeOk || low.length > 0, mood: low.length || !lifeOk ? 'happy' : 'cheer', msg,
        };
      });
    }, 3300);
  };
  const closeNasa = (card) => {
    playSound('click');
    if (card && !practice) addNotebookFact(`m1-${s.nasa}-${site || ''}`, card.title, card.real, card.links);
    set({ nasa: null });
  };
  const tipKey = s.stage === 'fix' ? `fix${site}` : s.stage;
  const callHouston = () => {
    if (s.houstonUsed) { playSound('oops'); set({ mood: 'happy', msg: 'You already called Mission Control. You can do this one, Commander!' }); return; }
    const tip = MISSION1.tips[tipKey];
    if (!tip) { set({ mood: 'happy', msg: 'Save your Mission Control call for a tricky choice!' }); return; }
    playSound('pick');
    const stage = s.stage;
    set({ houstonUsed: true, mistake: true, mood: 'think', msg: callingText(commander.level) });
    saveDelayFact();
    later(() => set((prev) => (prev.stage === stage ? { mood: 'happy', msg: replyText(tip, commander.level) } : {})), radioDelayMs(commander.level));
  };
  // The ? button asks a guiding question. Mission Control gives the answer.
  const askHint = () => { const machine = MISSION1.machines.find(it => it.life && !s.on[it.id] && it.cost <= r.p - m1Used(s.on)); set({ mood: 'happy', msg: hintLevel % 3 === 0 ? 'What does our crew need most right now?' : hintLevel % 3 === 1 ? childText(MISSION1.ask[s.stage] || MISSION1.ask.scout) : s.stage === 'power' ? machine ? `Try ${machine.name}. It fits our free cells.` : 'Try turning off an optional machine to free cells.' : s.stage === 'fix' ? 'Use a trip to help the lowest meter.' : 'Compare the sun and ice at both homes.' }); setHintLevel(n => n + 1); };

  // ---------- view data ----------
  const meters = METER_META.map((m) => ({ ...m, value: r[m.key], delta: s.lastD[m.key] || 0, essential: MISSION1.essentials.includes(m.key) }));
  const stepIdx = ['scout', 'scan'].includes(s.stage) ? 0 : s.stage === 'fix' ? 1 : s.stage === 'power' ? 2 : 3;
  const titles = ['Step 1: Explore', 'Step 2: Fix the low meter', 'Step 3: Power the base', 'Step 4: Run the base'];
  let pos = SPOTS.start;
  if (s.at === 'ridge') pos = SPOTS.ridge;
  if (s.at === 'crater') pos = SPOTS.crater;
  if (s.at.startsWith('panel')) { const p = SPOTS.panels[Number(s.at.slice(5))]; pos = { x: p.x - 10, y: p.y - 70 }; }
  const daylight = s.dayRunning || s.dayDone;
  const plantScale = 0.7;
  const showMarks = ['scout', 'scan'].includes(s.stage) && !s.walking && s.started;
  const scanSite = s.at === 'crater' ? 'crater' : 'ridge';
  const scan = MISSION1.sites[scanSite];
  const usedN = m1Used(s.on);
  const left = r.p - usedN;
  const commanderMode = commander.level === 'commander';
  const n = s.taps.length;
  const trip = site ? MISSION1.trip[site] : null;
  const powerCard = s.on.miner ? MISSION1.nasa.miner : s.on.wall ? MISSION1.nasa.wall : MISSION1.nasa.power;
  const nasaCard = s.nasa === 'site' ? MISSION1.nasa.site : s.nasa === 'fix' ? MISSION1.nasa.fix : s.nasa === 'power' ? powerCard : null;
  const nasaYou = s.nasa === 'site'
    ? (site === 'ridge' ? 'You picked Sunny Ridge: lots of power, but the water is far away.' : 'You picked Crater Edge: water is close, but there is less sunlight.')
    : s.nasa === 'fix'
      ? (site === 'ridge' ? (n ? `You sent the rover to collect ice ${n} ${n === 1 ? 'time' : 'times'}.` : 'You decided not to collect ice.') : (n ? `You carried ${n} solar ${n === 1 ? 'panel' : 'panels'} into the sun.` : 'You decided not to add panels.'))
      : `You switched on: ${MISSION1.machines.filter((m) => s.on[m.id]).map((m) => m.name).join(', ') || 'nothing'}.`;
  const nasaIcon = s.nasa === 'site' ? ICONS.drill : s.nasa === 'fix' ? ICONS.ice : s.on.wall && !s.on.miner ? ICONS.wall : ICONS.drop;
  const sign = (x) => (x > 0 ? `+${x}` : x < 0 ? `−${Math.abs(x)}` : '0');
  const dd = s.lastD;
  const report = s.dayDone ? [
    ['#FFD21F', `The Sun charged the battery (+${m1Recharge(site, n)})`, `${sign(dd.p || 0)} Power`, 'var(--yellow-soft)'],
    ['#B3E5FC', s.on.oxy ? 'The crew breathed; the Oxygen maker made more air' : 'The crew breathed; the Oxygen maker was off', `${sign(dd.o || 0)} Oxygen`, '#DDF3FF'],
    ['#4FC3F7', s.on.rec ? 'The crew drank lots of water; the recycler saved most of it' : 'The crew drank lots of water; nothing was recycled', `${sign(dd.w || 0)} Water`, 'var(--sky-soft)'],
    ...(s.on.wall ? [['#B9A6FF', 'The Moon-dirt wall now blocks some radiation', `${sign(dd.s || 0)} Radiation safety`, '#E6E0FF']] : []),
  ] : [];
  const highlight = !commanderMode && s.mistake;
  // Commander level skips the counting quiz (it stays on Explorer for ages 7–9).
  useEffect(() => { if (commanderMode && s.stage === 'math' && !s.nasa) runDay(); }, [commanderMode, s.stage, s.nasa]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="screen screen--navy screen--game">
      <ProgressHeader title={titles[stepIdx]} steps={[0, 1, 2, 3].map((i) => (i < stepIdx || (i === 3 && s.dayDone) ? 'done' : i === stepIdx ? 'now' : 'todo'))}
        onBack={() => go('briefing')} backLabel="Back to the briefing" clock={{ seconds: timeLeft, active: clockRunning }} stars={s.earned} />
      {/* 3 meters + the battery, like every other mission (Power is the battery, not a 4th meter). */}
      <div>
        <ResourceBar meters={meters} />
        <div role="img" aria-label={`Battery: ${r.p} of ${MISSION1.maxPower} cells charged`} style={{ margin: '0 10px 8px', padding: '5px 10px', borderRadius: 14, background: r.p <= 3 ? 'var(--pink-soft)' : 'var(--indigo-2)', color: r.p <= 3 ? 'var(--navy)' : '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 13, flex: 'none' }}>Battery {r.p}/{MISSION1.maxPower}</span>
          <span aria-hidden="true" style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${MISSION1.maxPower}, minmax(0, 1fr))`, gap: 3 }}>
            {Array.from({ length: MISSION1.maxPower }, (_, i) => <span key={i} style={{ height: 10, borderRadius: 3, background: i < r.p ? 'var(--yellow)' : 'rgba(255,255,255,0.22)' }} />)}
          </span>
          {(s.lastD.p || 0) !== 0 && <span className="a-pop" style={{ flex: 'none', padding: '0 6px', borderRadius: 10, background: s.lastD.p > 0 ? 'var(--gain-color)' : 'var(--loss-color)', color: 'var(--navy)', fontWeight: 800, fontSize: 13 }}>{s.lastD.p > 0 ? `+${s.lastD.p}` : `−${Math.abs(s.lastD.p)}`}</span>}
        </div>
      </div>

      <Stage height={300} style={{ background: 'var(--navy)' }}>
        <svg aria-hidden="true" viewBox="0 0 390 300" style={{ position: 'absolute', inset: 0, width: 390, height: 300 }}>
          <Stars dots={[[150, 22, 1.8, '#fff', 1], [214, 48, 1.4, '#fff'], [190, 86, 1.3, '#fff'], [260, 20, 1.6, '#4FC3F7', 1], [110, 34, 1.3, '#fff'], [290, 96, 1.4, '#fff']]} />
          <Earth />
          <path d="M0 300 L0 150 Q20 112 70 110 L130 112 Q150 114 160 150 Q166 192 190 196 L390 194 L390 300Z" fill="#B8BCC6" />
          <path d="M0 150 Q20 112 70 110 L130 112 Q150 114 160 150" stroke="#E6E8EE" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M0 300 L0 210 Q100 236 200 232 Q300 228 390 244 L390 300Z" fill="#A3A8B3" />
          <ellipse cx="90" cy="262" rx="26" ry="7" fill="#8E939E" /><ellipse cx="250" cy="270" rx="18" ry="5" fill="#8E939E" /><ellipse cx="220" cy="214" rx="14" ry="4" fill="#9298A5" />
          <ellipse cx="334" cy="226" rx="52" ry="18" fill="#6E7380" /><ellipse cx="334" cy="230" rx="44" ry="13" fill="#5B606C" />
          <path d="M282 226 A52 18 0 0 1 386 226" stroke="#D3D6DD" strokeWidth="3" fill="none" />
        </svg>
        <Sun className={s.dayRunning ? 'a-sunarc' : ''} style={{ left: 26, top: 16 }} />
        <span className="pill display" style={{ position: 'absolute', left: 8, top: 120, height: 24, fontSize: 13, background: 'var(--yellow)' }}>Sunny Ridge</span>
        <span className="pill display" style={{ position: 'absolute', right: 8, top: 252, height: 24, fontSize: 13, background: 'var(--sky)' }}>Crater Edge</span>

        {SPOTS.crystals.map((c, i) => (!(site === 'ridge' && s.taps.includes(i)) && (
          <svg key={i} aria-hidden="true" viewBox="0 0 22 22" style={{ position: 'absolute', left: c.x - 11, top: c.y - 11, width: 22, height: 22 }}>
            <path d="M11 1 L17 8 L11 21 L5 8Z" fill="#4FC3F7" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /><path d="M5 8 H17" stroke="#fff" strokeWidth="1.2" />
          </svg>
        )))}
        {site === 'crater' && s.taps.map((i) => <OnePanel key={i} glow={daylight} style={{ left: SPOTS.panels[i].x - 15, top: SPOTS.panels[i].y - 18 }} />)}

        {site && (
          <div role="img" aria-label={`Your base at ${MISSION1.sites[site].title} with solar panels, a water tank and a greenhouse`} style={{ position: 'absolute', left: site === 'ridge' ? 4 : 150, top: site === 'ridge' ? 52 : 136, width: 128, height: 60 }}>
            <SolarPanels className="a-pop" glow={daylight} width={34} style={{ left: 0, top: 22 }} />
            <Dome className="a-pop-2" width={50} style={{ left: 34, top: 22 }} />
            <WaterTank className="a-pop-3" level={r.w} style={{ left: 86, top: 28 }} />
            <Greenhouse className="a-pop-4" scales={[plantScale, plantScale, plantScale]} width={28} style={{ left: 102, top: 36 }} />
            {daylight && s.on.oxy && <Bubbles left={50} top={12} />}
          </div>
        )}
        {site === 'ridge' && s.rover && <Rover style={{ left: s.rover.x, top: s.rover.y }} />}
        {s.dayDone && <img className="a-pop" src="/assets/crew-full.webp" alt="Amina, Bilal and Zoya celebrating" style={{ position: 'absolute', left: site === 'ridge' ? 150 : 60, top: site === 'ridge' ? 60 : 130, width: 84 }} />}
        <CommanderFigure suit={commander.suit} walking={s.walking && !(site === 'ridge' && s.stage === 'fix')} style={{ left: pos.x, top: pos.y }} />

        {showMarks && (
          <>
            <MapMarker x={80} y={78} color="var(--yellow)" shadow="var(--yellow-dark)" label="Walk to Sunny Ridge" onClick={() => scout('ridge')} />
            <MapMarker x={334} y={196} color="var(--sky)" shadow="var(--sky-dark)" label="Walk to Crater Edge" onClick={() => scout('crater')} />
          </>
        )}
        {s.stage === 'fix' && !s.walking && !s.nasa && (site === 'ridge' ? SPOTS.crystals : SPOTS.panels).map((c, i) => (!s.taps.includes(i) && (
          <MapMarker key={i} x={c.x} y={c.y} color={site === 'ridge' ? 'var(--sky)' : 'var(--yellow)'} label={site === 'ridge' ? `Collect ice crystal ${i + 1}` : `Place solar panel ${i + 1}`} plus onClick={() => tapTarget(i)} />
        )))}
        <StarToast text={s.toast} top={190} />
      </Stage>

      <div style={{ flex: 1, minHeight: 0, padding: '12px 14px 16px', background: 'var(--indigo)', borderRadius: '26px 26px 0 0', marginTop: -18, position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MissionDialogue mood={s.mood} message={s.msg} onHint={askHint} onHouston={callHouston} houstonUsed={s.houstonUsed} />

        {s.stage === 'scan' && <small style={{ color: '#fff' }}>Concept map: sunlight and ice symbols are simplified, not a survey map.</small>}
        {s.dayDone && <ConsequenceReveal before={s.before} after={r} cause={explainTransition(s.before || MISSION1.start, r, usedN)} />}
        {s.stage === 'scout' && !s.walking && (
          <div className="a-rise" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            <BigChoice bg="var(--yellow)" shadow="var(--yellow-dark)" icon="sun" label="Walk to Sunny Ridge" onClick={() => scout('ridge')} />
            <BigChoice bg="var(--sky)" shadow="var(--sky-dark)" icon="ice" label="Walk to Crater Edge" onClick={() => scout('crater')} />
          </div>
        )}

        {s.stage === 'scan' && !s.walking && (
          <div className="a-rise" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="display" style={{ fontSize: 19 }}>{scan.title} scan</div>
              <ScanRow label="Sunlight" n={scan.sun} color="#FFD21F" border="var(--yellow-dark)" />
              <ScanRow label="Ice" n={scan.ice} color="#4FC3F7" border="var(--sky-dark)" diamond />
              <div style={{ display: 'flex', gap: 6 }}><span className="pill chip-info">{scan.gain}</span><span className="pill chip-info">{scan.cost}</span></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 10 }}>
              <button type="button" className="btn btn-white" style={{ height: 60, fontSize: 16 }} onClick={() => scout(s.at === 'ridge' ? 'crater' : 'ridge')}>Check other spot</button>
              <button type="button" className="btn btn-yellow" style={{ height: 60, fontSize: 22, borderRadius: 20 }} onClick={build}>Build here!</button>
            </div>
          </div>
        )}

        {s.stage === 'fix' && trip && (
          <div className="a-rise" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="display" style={{ fontSize: 19, lineHeight: '23px' }}>{trip.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 14 }}>Each trip:</span>
                <span className="pill chip-info">{site === 'ridge' ? '🚙 Rover drives to the ice' : '☀️ Carry a panel into the sun'}</span>
              </div>
              <div role="img" aria-label={`${n} of 3 trips`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {[0, 1, 2].map((k) => <span key={k} style={{ width: 30, height: 30, borderRadius: '50%', background: k < n ? (site === 'ridge' ? 'var(--sky)' : 'var(--yellow)') : '#EEF0FF', border: `3px solid ${k < n ? 'var(--navy)' : '#C9CCEB'}` }} />)}
                <span className="muted" style={{ fontWeight: 800, fontSize: 14 }}>{n} of 3 trips</span>
              </div>
              <div className="learning-actions">
                {[0, 1, 2].map(i => <button className="btn btn-soft" key={i} disabled={s.walking || s.taps.includes(i)} onClick={() => tapTarget(i)}>{site === 'ridge' ? 'Ice trip' : 'Carry panel'} {i + 1}{s.taps.includes(i) ? ' ✓' : ''}</button>)}
              </div>
            </div>
            <button type="button" className="btn btn-yellow" style={{ marginTop: 'auto', height: 62, fontSize: 22, borderRadius: 22 }} onClick={fixDone}>{n === 0 ? 'Skip this' : n === 3 ? 'All done!' : 'I’m done'}</button>
          </div>
        )}

        {s.stage === 'power' && <button className="btn btn-soft" onClick={() => setInspect(true)}>🔎 Look inside our machines</button>}
        {s.stage === 'power' && (
          <div className="a-rise" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="display" style={{ fontSize: 18 }}>Battery</span><span className="muted" style={{ fontWeight: 800, fontSize: 14 }}>{left} of {r.p} cells free</span></div>
              <BatteryCells total={r.p} used={usedN} />
            </div>
            <MissionButtonGrid items={MISSION1.machines} on={s.on} flagLife={highlight} keys={['p', 'o', 'w', 's']} onToggle={toggle} />
            <button type="button" className="btn btn-yellow" style={{ marginTop: 'auto', height: 60, fontSize: 22, borderRadius: 22 }} onClick={powerNext}>Power on!</button>
          </div>
        )}

        {s.stage === 'dayStart' && (
          <div className="a-rise" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card" style={{ fontWeight: 800, fontSize: 16, lineHeight: '22px' }}>Your base is ready. Let’s see what happens in one day at your base!</div>
            <button type="button" className="btn btn-yellow" style={{ marginTop: 'auto', height: 68 }} onClick={runDay}><Icon name="sun" size={26} /> Start the day!</button>
          </div>
        )}

        {s.stage === 'dayRun' && <MachineTheatre items={MISSION1.machines} on={s.on} running />}

        {s.stage === 'dayDone' && !s.failed && (
          <div className="a-rise report-actions" style={{ marginTop: 'auto' }}>
            <button type="button" className="btn btn-white" onClick={onReplay}>Play again</button>
            <button type="button" className="btn btn-yellow" onClick={() => { playSound('click'); set({ report: true }); }}>Base report</button>
          </div>
        )}
      </div>

      {inspect && <EquipmentCards items={MISSION1.machines} round={{}} onClose={() => setInspect(false)} />}
      {s.stage === 'math' && !s.nasa && !commanderMode && <MissionMath round={{ type: 'power', math: 'left', items: MISSION1.machines }} on={s.on} total={r.p} onDone={runDay} />}
      {tutorial && <GuidedTutorial onClose={() => setTutorial(false)} />}
      {!s.started && !tutorial && (
        <ReadySheet kicker="MISSION 1 OF 4" title="Find our Moon home" clockSeconds={time} lifeText="Air + Water"
          story="NASA plans Moon stays of 30 days or more for a crew of 4, during sunny times. Your first job: choose a home and keep the crew safe for one day. Plan fast, but plan smart!"
          onStart={() => { playSound('click'); set({ started: true }); }} />
      )}
      {nasaCard && !s.walking && (
        <NASAFactCard title={nasaCard.title} iconPath={nasaIcon} you={nasaYou} before={s.nasa === 'power' ? undefined : s.before} after={r} item={s.nasa === 'power' ? MISSION1.machines.find(it => s.on[it.id]) : undefined} real={nasaCard.real} links={nasaCard.links} photo={!!nasaCard.photo} onClose={() => closeNasa(nasaCard)} />
      )}
      {s.report && (() => {
        const rpt = m1Report(s, r);
        return (
          <BaseReport kicker="MISSION 1 · FIND OUR MOON HOME" stars={s.earned} mate={MISSION1.mate} site={site} wall={!!s.on.wall} rover={site === 'ridge' && n > 0}
            water={r.w} suit={commander.suit} choices={rpt.choices} wrap={MISSION1.wrap} meters={rpt.meters} carryText={practice ? "Practice result only. Your official base and best stars are unchanged." : rpt.carry}
            nasa={CARDS.rim} goal={{ text: MISSION1.goal.text, met: goalMet(MISSION1.goal, r) }}
            dayReport={report.map(([, text, chip]) => [text, chip])}
            learning={{ before: MISSION1.start, after: r, ids: ['site', ...(s.on.oxy && r.o > MISSION1.start.o ? ['air'] : []), ...(usedN ? ['power'] : [])], previous, practice }}
            onCollect={() => go('complete1')} onReplay={onReplay} />
        );
      })()}
      {s.failed && <AbortSheet reason={s.failed} onRetry={onReplay} onMap={() => go('map')} />}
    </div>
  );
}

/** Mission 1's Base Report: the site, the trips and the machines, each with its trade-off. */
function m1Report(s, end) {
  const site = s.site; const n = s.taps.length; const keys = ['p', 'o', 'w', 's'];
  const choices = [];
  choices.push(site === 'ridge'
    ? { icon: ICONS.battery, iconBg: '#FFF4C2', title: 'Built on Sunny Ridge', got: 'lots of sun for power', gave: 'easy water (the ice is far)',
      tip: 'Commander, we built on Sunny Ridge, just like NASA plans to! We got lots of sunshine for power. But we gave up easy water, because the ice was far away.' }
    : { icon: ICONS.ice, iconBg: '#D7F0FF', title: 'Built at Crater Edge', got: 'ice close by', gave: 'sunshine for power',
      tip: 'We built at Crater Edge, right next to the ice, so water was easy. But we gave up sunshine, so our battery charged slowly. NASA picks the sunny rim instead.' });
  if (site === 'ridge') {
    choices.push(n
      ? { icon: ICONS.drop, iconBg: '#D7F0FF', title: `Sent the rover for ice ${n} ${n === 1 ? 'time' : 'times'}`, got: `+${R.iceTripWater.points * n} Water`, gave: `${R.roverTripPower.points * n} Power`,
        tip: `So our rover drove to the crater ${n} ${n === 1 ? 'time' : 'times'}. It brought back ${R.iceTripWater.points * n} Water, but the trips used ${R.roverTripPower.points * n} Power. Getting one thing cost us another!` }
      : { icon: ICONS.drop, iconBg: '#D7F0FF', title: 'Kept the rover parked', got: 'saved Power', gave: 'Water stayed low', tip: 'You kept the rover parked. That saved Power, but our Water stayed low.' });
  } else {
    choices.push(n
      ? { icon: ICONS.battery, iconBg: '#FFF4C2', title: `Carried ${n} solar ${n === 1 ? 'panel' : 'panels'} into the sun`, got: `+${R.panelTripPower.points * n} Power`, gave: `${R.outdoorShield.points * n} Radiation safety`,
        tip: `You carried ${n} solar ${n === 1 ? 'panel' : 'panels'} into the sun. We got ${R.panelTripPower.points * n} more Power, but working outside used ${R.outdoorShield.points * n} Radiation safety of radiation protection.` }
      : { icon: ICONS.battery, iconBg: '#FFF4C2', title: 'Carried no extra panels', got: 'saved Radiation safety', gave: 'Power stayed low', tip: 'You stayed inside and carried no panels. That saved our Radiation safety, but Power stayed low.' });
  }
  const on = MISSION1.machines.filter((m) => s.on[m.id]);
  const off = MISSION1.machines.filter((m) => !s.on[m.id]);
  const gain = {}; const side = {};
  on.forEach((m) => Object.keys(m.eff).forEach((k) => { if (m.eff[k] > 0) gain[k] = (gain[k] || 0) + m.eff[k]; else side[k] = (side[k] || 0) + m.eff[k]; }));
  const cells = m1Compute({ site, taps: n, on: {} }).p;
  const used = m1Used(s.on);
  const got = chips(gain, keys).gain || 'nothing extra';
  let tip = `You switched on ${on.length ? listWords(on.map((m) => m.name)) : 'nothing'}. We got ${got}.`;
  if (off.length) tip += ` The trade-off: that used ${used} of our ${cells} cells, so ${listWords(off.map((m) => m.name))} stayed off.`;
  if (s.on.wall) tip += ' The Moon-dirt wall will protect us from a solar storm later!';
  choices.push({ icon: (on[0] || MISSION1.machines[0]).icon, iconBg: (on[0] || MISSION1.machines[0]).color, title: `Powered: ${on.map((m) => m.name).join(', ') || 'nothing'}`, got, gave: `${used} of ${cells} cells${off.length ? `, ${listWords(off.map((m) => m.name))} off` : ''}`, tip });
  const meters = keys.map((k) => ({ key: k, from: MISSION1.start[k], to: end[k] }));
  const ns = startFor(MISSION_2, readBase(getProgress()));
  const carry = `${site === 'ridge' ? 'Sunny Ridge' : 'Crater Edge'} home${s.on.wall ? ' and a Moon-dirt wall' : ''}. Mission 2 starts with ${listWords(MISSION_2.carry.map((k) => `${resourceName(k)} ${ns[k]}`))} from your base.`;
  return { choices, meters, carry };
}

function MapMarker({ x, y, color, shadow, label, plus, onClick }) {
  return (
    <>
      <div className="a-pulse" aria-hidden="true" style={{ position: 'absolute', left: x - 28, top: y - 28, width: 56, height: 56, borderRadius: '50%', border: `4px solid ${color}` }} />
      <button type="button" className="btn" aria-label={label} onClick={onClick}
        style={{ position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, padding: 0, borderRadius: '50%', border: '3px solid #fff', background: color, boxShadow: shadow ? `0 4px 0 ${shadow}` : 'none', fontSize: 22 }}>
        {plus ? '+' : <Icon name="pin" size={22} stroke={2.6} />}
      </button>
    </>
  );
}

function BigChoice({ bg, shadow, icon, label, onClick }) {
  return (
    <button type="button" className="btn" onClick={onClick} style={{ height: 96, borderRadius: 22, background: bg, boxShadow: `0 6px 0 ${shadow}`, flexDirection: 'column', gap: 4, fontSize: 18, lineHeight: '21px' }}>
      <Icon name={icon} size={32} stroke={2.2} />
      {label}
    </button>
  );
}

function ScanRow({ label, n, color, border, diamond }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 74, fontWeight: 800, fontSize: 14 }}>{label}</span>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ width: 22, height: 22, borderRadius: diamond ? 6 : '50%', background: i < n ? color : '#EEF0FF', border: `2px solid ${border}`, transform: diamond ? 'rotate(45deg) scale(.8)' : 'none' }} />
      ))}
    </div>
  );
}

