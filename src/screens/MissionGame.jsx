import EquipmentCards from '../components/EquipmentCards.jsx';
import MissionMath from '../components/MissionMath.jsx';
import { MachineTheatre, MachineDrawing } from '../components/MachineAnimation.jsx';
import { changeClass, resourceIcon, effectWords } from '../lib/learning.js';
import { machineKind } from '../lib/visualLearning.js';
import { resourceName } from '../lib/learning.js';
// ============================================================
// The shared mission engine used by Mission 2, Mission 3 and the Final Mission.
// It reads a mission from src/data/missions.js and plays its rounds:
//   power round  -> switch machines on within the battery
//   action round -> do something with your hands (move the crew to safety,
//                   water thirsty plants), sometimes against a countdown
//   -> watch the base run -> real NASA card -> next round
//   -> Base Report (a crewmate explains each trade-off) -> rewards.
// Life support meters at 0, or the clock running out, abort the mission.
// Meters start from the child's own base (carried over from earlier missions).
// All costs and effects come from src/data/ratios.js via missions.js.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import ProgressHeader from '../components/ProgressHeader.jsx';
import ResourceBar from '../components/ResourceMeter.jsx';
import MissionDialogue from '../components/MissionDialogue.jsx';
import ChoiceCard from '../components/ChoiceCard.jsx';
import { BatteryCells } from '../components/PuzzleCard.jsx';
import NASAFactCard from '../components/NASAFactCard.jsx';
import RewardModal from '../components/RewardModal.jsx';
import BaseReport, { MoonWall } from '../components/BaseReport.jsx';
import Stage from '../components/Stage.jsx';
import Icon from '../components/Icon.jsx';
import { ReadySheet, AbortSheet, StarToast } from '../components/MissionSheets.jsx';
import { Stars, Earth, Sun, SolarPanels, Dome, WaterTank, Greenhouse, Bubbles, CommanderFigure } from '../components/MoonParts.jsx';
import BaseStrip from '../components/BaseStrip.jsx';
import NumbersSheet from '../components/NumbersSheet.jsx';
import { METERS, CARDS, ICONS, MISSION_2, MISSION_3, FINAL_MISSION, DARK_VARIANTS, finalWithDark } from '../data/missions.js';
import { useMissionClock } from '../hooks/useMissionClock.js';
import { getCommander, getProgress, readJSON, writeJSON, addNotebookFact, completeMission, saveBase } from '../lib/storage.js';
import {
  applyEff, readBase, startFor, itemsFor, optionsFor, itemBlocked, cellsFor, cellsUsed,
  roundEffect, actionEffect, lowMeters, lifeOff, roundStar, finalStars, goalMet, harvestFor, stormUnsafe, mustRunFail,
} from '../lib/missionLogic.js';
import { nextStorm, fetchRecentStorms, liveLine, pkTime, rightNowLine, nextDarkIndex } from '../data/storms.js';
import { radioDelayMs, callingText, replyText, saveDelayFact, marsCallingText, MARS_GAME_DELAY_MS } from '../lib/radio.js';
import RadiationRuler from '../components/RadiationRuler.jsx';
import Sheet from '../components/Sheet.jsx';
import { playSound } from '../lib/sound.js';
import { ConsequenceReveal, StormPractice } from '../components/LearningLab.jsx';
import TradeoffPicture from '../components/TradeoffPicture.jsx';
import { TelescopeButton, SunScan, StormPrep, GhostReplay, RewindCompare, StrategyToasts } from '../components/SideQuests.jsx';
import { recordStrategy, strategiesFor, ghostReplay, sunScanCard } from '../lib/sideQuests.js';
import { LESSONS, childText, commitOfficialRun, previewRound, explainTransition, discoveries, recordLearning, contextualHint } from '../lib/learning.js';
import { go } from '../lib/router.js';

export const cellWord = (n) => `${n} ${n === 1 ? 'cell' : 'cells'}`;
export const listWords = (a) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);
const diff = (a, b) => {
  const d = {};
  Object.keys(a).forEach((k) => { if (b[k] !== a[k]) d[k] = b[k] - a[k]; });
  return d;
};
export const chips = (eff, keys) => {
  const gain = []; const cost = [];
  Object.keys(eff || {}).forEach((k) => {
    if (!METERS[k] || (keys && !keys.includes(k))) return;
    if (eff[k] > 0) gain.push(`+${eff[k]} ${resourceName(k)}`);
    if (eff[k] < 0) cost.push(`−${Math.abs(eff[k])} ${resourceName(k)}`);
  });
  return { gain: gain.join(', '), cost: cost.join(', ') };
};
/** The same effects in words, for choices: "Adds Air", "Drains Water". */
export const wordChips = (eff, keys) => {
  const w = effectWords(eff, keys);
  return { gain: w.filter((x) => x.text.startsWith('Adds')).map((x) => x.text).join(', '), cost: w.filter((x) => x.text.startsWith('Drains')).map((x) => x.text).join(', ') };
};

const CREW = [
  { id: 'amina', name: 'Amina', img: '/assets/crew-amina.webp' },
  { id: 'bilal', name: 'Bilal', img: '/assets/crew-bilal.webp' },
  { id: 'zoya', name: 'Zoya', img: '/assets/crew-zoya.webp' },
];
const ZONE_NAME = { out: 'outside', wall: 'behind the wall', in: 'in the shelter' };
const ORDER = [MISSION_2, MISSION_3, FINAL_MISSION];

/** What a crew placement or watering means as a pick for the game rules. */
function actionPick(rd, s) {
  if (rd.action === 'storm') {
    const z = Object.values(s.crew);
    return { out: z.filter((x) => x === 'out').length, wall: z.filter((x) => x === 'wall').length, shelter: z.filter((x) => x === 'in').length };
  }
  return { n: s.watered.filter(Boolean).length };
}

/** One line of the Base Report: what the child did, what they got, what they gave up. */
function logEntry(C, rd, pick, cells, items, harvest = {}) {
  const keys = C.meters;
  if (rd.type === 'power') {
    const on = items.filter((it) => pick[it.id]);
    const off = items.filter((it) => !pick[it.id] && !itemBlocked(it, rd));
    const gain = {}; const side = {};
    on.forEach((it) => Object.keys(it.eff).forEach((k) => {
      if (!keys.includes(k)) return;
      if (it.eff[k] > 0) gain[k] = (gain[k] || 0) + it.eff[k]; else side[k] = (side[k] || 0) + it.eff[k];
    }));
    const got = chips(gain, keys).gain || 'nothing extra';
    const used = cellsUsed(rd, pick);
    const offNames = listWords(off.map((x) => x.name));
    const sideTxt = chips(side, keys).cost;
    const shortOff = off.length > 2 ? `${off.slice(0, 2).map((x) => x.name).join(', ')} and ${off.length - 2} more` : offNames;
    const more = listWords(Object.keys(gain).map((k) => resourceName(k)));
    let tip = on.length ? `You powered the ${listWords(on.map((x) => x.name))}${more ? ` and got more ${more}` : ''}.` : 'You kept every machine off to save the battery.';
    tip += off.length ? ` They used ${used} of ${cells} battery cells, so ${off.length === 1 ? `the ${offNames} had` : `${off.length} other machines had`} to wait.` : ` They used ${used} of ${cells} battery cells.`;
    tip += ' A cell spent on one machine can’t run another!';
    const first = on[0] || items[0];
    return {
      icon: first.icon, iconBg: first.color, title: `${rd.title}: ${on.length ? on.map((x) => x.name).join(', ') : 'nothing on'}`,
      got, gave: [`${used} of ${cells} cells`, off.length ? `${off.length} ${off.length === 1 ? 'machine' : 'machines'} off` : ''].filter(Boolean).join(' · '), tip,
      visual: { machines: { on: on.map((x) => ({ name: x.name, icon: x.icon, color: x.color })), off: off.map((x) => ({ name: x.name, icon: x.icon })) }, cells: { used, total: cells } },
    };
  }
  const eff = actionEffect(rd, pick);
  if (rd.action === 'storm') {
    const workers = pick.out + pick.wall;
    const where = [pick.shelter && `${pick.shelter} in the shelter`, pick.wall && `${pick.wall} behind the wall`, pick.out && `${pick.out} outside`].filter(Boolean);
    let tip;
    if (!workers) tip = `When the storm came, you moved everyone into the shelter. We only lost ${-eff.s} Radiation safety, but science stopped while we waited. Safety first!`;
    else if (!pick.out) tip = `You kept ${pick.wall} working behind your Moon-dirt wall. We got ${eff.c} Science and lost ${-eff.s} Radiation safety. The trade-off: less science than outside, but much less radiation. The wall you built in Mission 1 paid off!`;
    else tip = `You left ${pick.out} working outside in the storm. We got the most Science (${eff.c}), but we took ${-eff.s} Radiation safety of radiation. Real crews take shelter fast, because storm particles pass through the body.`;
    if (harvest.s) tip += ` Because you reinforced the shelter earlier, it blocked more: we kept ${harvest.s} extra Radiation safety.`;
    return {
      icon: ICONS.shelter, iconBg: '#D7F0FF', title: `Solar storm: ${listWords(where)}`,
      got: workers ? `+${eff.c} Science` : 'crew kept safe', gave: workers ? `${-eff.s} Radiation safety` : `${-eff.s} Radiation safety and science time`, tip,
      visual: { crew: { shelter: pick.shelter, wall: pick.wall, out: pick.out }, words: workers ? [] : [{ text: 'Crew stayed safe', good: true }, { text: 'Science stopped while they waited', good: false }] },
    };
  }
  const n = pick.n;
  const crop = harvest.f || 0;
  const cropTxt = crop ? `First, the lamps you lit a month ago gave us ${crop} Food. ` : 'No lamps were lit a month ago, so there was no lettuce to pick. ';
  return {
    icon: ICONS.plant, iconBg: '#C8F5C2', title: `Watered ${n} of 3 thirsty plants`, visual: { plants: { n, of: 3 } },
    got: n ? `+${eff.f} Food` : 'water saved for the crew', gave: n ? `${-eff.w} Water` : `${-eff.f} Food (plants wilted)`,
    tip: cropTxt + (n ? `You watered ${n} thirsty ${n === 1 ? 'plant' : 'plants'}. They grew ${eff.f} more Food, but drank ${-eff.w} Water that the crew could have used.`
      : `You saved all the water for the crew. The crew stayed safe, but the thirsty plants wilted and we lost ${-eff.f} Food.`),
  };
}

export default function MissionGame({ mission }) {
  const [runId, setRunId] = useState(0);
  const [wasComplete] = useState(() => !!getProgress()[mission.key]);
  const [savedRun] = useState(() => readJSON('lkq-replay-' + mission.key));
  const [variant, setVariant] = useState(() => savedRun.mission || (mission.key === 'final' ? finalWithDark(DARK_VARIANTS[nextDarkIndex(DARK_VARIANTS.length)]) : mission));
  const [initialBase] = useState(() => savedRun.base || readBase(getProgress()));
  const [firstResult, setFirstResult] = useState(() => savedRun.result || null);
  const capturedStorm = useRef(savedRun.storm || null);
  const [explore, setExplore] = useState(false);
  const replay = () => setRunId(n => n + 1);
  // 🌗 New Mission Day: another real stored storm and another darkness variant, as a practice run.
  const newDay = mission.key === 'final' ? () => {
    const dark = DARK_VARIANTS[nextDarkIndex(DARK_VARIANTS.length)];
    setVariant(finalWithDark(dark));
    capturedStorm.current = nextStorm();
    recordStrategy('newDay', { where: `New mission day: ${dark.label || 'new darkness'} · ${capturedStorm.current.date}`, note: `Darkness: ${dark.label || 'new'}. Storm: ${capturedStorm.current.name} (${capturedStorm.current.date}).` });
    setExplore(true);
    setRunId(n => n + 1);
  } : null;
  return <MissionRun key={runId} mission={variant} onReplay={replay} onNewDay={newDay} initialBase={initialBase}
    practice={explore || !!savedRun.result || wasComplete || runId > 0 && !!firstResult} previous={explore ? null : savedRun.result || (runId > 0 ? firstResult : null)} capturedStorm={capturedStorm}
    onFinish={result => { if (!firstResult) { writeJSON('lkq-replay-' + mission.key, { mission: variant, base: initialBase, storm: capturedStorm.current, result }); setFirstResult(result); } }} />;
}

function MissionRun({ mission: C, onReplay, onNewDay, initialBase, practice, previous, capturedStorm, onFinish }) {
  const commander = getCommander();
  const [inspect, setInspect] = useState(false);
  const time = (C.time || {})[commander.level] || 150;
  const timers = useRef([]);
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const [base] = useState(() => initialBase);
  // Final Mission: a real DONKI storm, different each time you play.
  const [storm, setStorm] = useState(() => (C.rounds.some((x) => x.realStorm) ? capturedStorm.current || nextStorm() : null));
  const [live, setLive] = useState(null);
  const [showRuler, setShowRuler] = useState(false);
  const rNow = useRef(0);
  const committed = useRef(false);
  const checkpoint = useRef(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [stormReady, setStormReady] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [ghost, setGhost] = useState(null);
  const [checkedAt, setCheckedAt] = useState(null);
  useEffect(() => {
    if (!storm || practice || capturedStorm.current) return undefined;
    let alive = true;
    fetchRecentStorms().then((r) => {
      if (!alive) return;
      setLive(r); setCheckedAt(new Date());
      // A real storm from THIS month replaces the archived one, if the storm round has not started yet.
      if (r && r.storm && rNow.current < C.rounds.findIndex((x) => x.realStorm)) setStorm(r.storm);
    });
    return () => { alive = false; };
  }, [storm]);
  const [startRes] = useState(() => startFor(C, base));
  const fresh = { toast: null, on: {}, sel: null, cd: null, warned: false, lastD: {}, crew: { amina: 'out', bilal: 'out', zoya: 'out' }, watered: [false, false, false] };
  const [s, setS] = useState({
    ...fresh, phase: 'intro', r: 0, res: { ...startRes }, before: null, mistake: false, lifeSlip: false, log: [], card: null, showNumbers: false,
    nasaOpen: false, picks: [], ons: [], earned: 0, toast: null, failWhy: null, houstonUsed: false,
    mood: 'think', msg: 'Read the mission, then press Start!',
  });
  const set = (patch) => setS((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  rNow.current = s.r;

  const fail = (why) => {
    playSound('low');
    timers.current.forEach(clearTimeout);
    set({ phase: 'failed', failWhy: why, nasaOpen: false, toast: null, cd: null, mood: 'worry', msg: 'Mission abort. The crew is safe. Let us try again!' });
  };
  const clockRunning = ['play', 'result'].includes(s.phase) && !s.nasaOpen && !mathOpen && !inspect && !scanOpen && !ghost && !(C.rounds[s.r].action === 'storm' && !stormReady);
  const [timeLeft] = useMissionClock(time, clockRunning, () => fail('time'));
  const warned30 = useRef(false);
  useEffect(() => {
    if (timeLeft === 30 && clockRunning && !warned30.current) {
      warned30.current = true;
      playSound('low');
      set({ mood: 'worry', msg: 'Only 30 seconds left, Commander! Hurry!' });
    }
  }, [timeLeft, clockRunning]);

  const award = (text) => {
    playSound('good');
    set((prev) => (prev.earned >= 3 ? {} : { earned: prev.earned + 1, toast: text }));
    later(() => set({ toast: null }), 2200);
  };

  const rd0 = C.rounds[s.r];
  const rd = rd0.realStorm && storm ? { ...rd0, countdown: storm.countdown } : rd0;
  const roundMsg = (i) => {
    const x = C.rounds[i];
    if (x.action === 'storm') return 'Storm warning! Move our crew into the shelter.';
    if (typeof x.harvestFrom === 'number') {
      const crop = harvestFor(C.rounds, x, s.ons).f || 0;
      return crop ? `Harvest time! ${crop} Food is ready from our lamps.` : 'No lamps last month. No lettuce harvest this time.';
    }
    if (x.scene?.night) return 'Darkness! Keep the heater on. Share our battery carefully.';
    if (x.scene?.dark) return 'Less sunlight! Which machines need our few cells most?';
    if (x.scene?.plants) return 'Plant today. Food comes later. Which lamps will you power?';
    return 'The Sun is up. Which machines will you power?';
  };
  const items = itemsFor(rd, base, C.key);
  const options = optionsFor(rd, base, C.key);
  const cells = rd.type === 'power' ? cellsFor(rd, s.ons, base) : 0;
  const usedN = rd.type === 'power' ? cellsUsed(rd, s.on) : 0;
  const commanderMode = commander.level === 'commander';

  // ---------- actions ----------
  const start = () => { playSound('click'); set({ phase: 'play', mood: 'think', msg: roundMsg(0) }); };

  const toggle = (it) => {
    const blocked = itemBlocked(it, rd);
    if (blocked) { playSound('oops'); set({ mood: 'worry', msg: `${it.name}: ${blocked}. It cannot work in the dark.` }); return; }
    const on = { ...s.on };
    if (!on[it.id] && cellsUsed(rd, on) + it.cost > cells) { playSound('oops'); set({ mood: 'worry', msg: 'Not enough cells! Turn something off first.' }); return; }
    on[it.id] = !on[it.id];
    playSound(on[it.id] ? 'pick' : 'click');
    set({ on, warned: false, mood: 'happy', msg: on[it.id] ? `${it.name} is on! ${cellWord(cells - cellsUsed(rd, on))} left.` : `${it.name} is off.` });
  };

  const powerGo = () => {
    const missing = lifeOff(rd, s.on, base, C.key);
    if (missing.length && !s.warned) {
      playSound('oops');
      set({ warned: true, mistake: true, mood: 'worry', msg: `Are you sure? ${listWords(missing.map((m) => m.name))} keeps the crew alive and is off. Press Power on again to go anyway.` });
      return;
    }
    if (rd.math && !commanderMode) setMathOpen(true); else runRound();
  };

  // Move one astronaut to the next place: Outside -> (Wall) -> Shelter -> Outside.
  const moveCrew = (id) => {
    const zones = base.wall ? ['out', 'wall', 'in'] : ['out', 'in'];
    const next = zones[(zones.indexOf(s.crew[id]) + 1) % zones.length];
    playSound(next === 'in' ? 'good' : 'pick');
    const name = CREW.find((c) => c.id === id).name;
    set({ crew: { ...s.crew, [id]: next }, mood: 'think', msg: next === 'in' ? `${name} is safe in the shelter!` : next === 'wall' ? `${name} is working behind the Moon-dirt wall.` : `${name} is back outside, working.` });
  };
  const waterPlant = (i) => {
    const watered = s.watered.slice(); watered[i] = !watered[i];
    playSound(watered[i] ? 'pick' : 'click');
    set({ watered, mood: 'think', msg: watered[i] ? `Plant ${i + 1} got a drink. That water came from the crew’s tank.` : `Plant ${i + 1} gets no water.` });
  };

  const runRound = (override) => {
    if (committed.current || s.phase !== 'play' || (rd.action === 'storm' && !stormReady)) return;
    committed.current = true;
    checkpoint.current = { ...s };
    if (rd.realStorm) capturedStorm.current = storm;
    const pick = rd.type === 'power' ? s.on : rd.type === 'action' ? (override || actionPick(rd, s)) : (override || s.sel);
    const harvest = harvestFor(C.rounds, rd, s.ons);
    const after = applyEff(s.res, roundEffect(rd, pick, harvest));
    const ons = s.ons.slice(); ons[s.r] = rd.type === 'power' ? { ...s.on } : {};
    const picks = s.picks.slice(); picks[s.r] = pick;
    const log = s.log.slice();
    const entry = logEntry(C, rd, pick, cells, items, harvest);
    const actual = chips(diff(s.res, after), C.meters);
    log[s.r] = { ...entry, story: entry.tip, visual: { ...(entry.visual || {}), deltas: diff(s.res, after) }, got: actual.gain || 'no net meter gain',
      tip: `${entry.title}. ${explainTransition(s.res, after, rd.type === 'power' ? cellsUsed(rd, pick) : 0)} ${entry.gave ? 'We gave up: ' + entry.gave + '.' : ''} Includes crew use, any harvest, and meter limits.` };
    const offNow = lifeOff(rd, rd.type === 'power' ? s.on : {}, base, C.key);
    playSound('click');
    set({ phase: 'run', before: s.res, lastD: {}, cd: null, mood: 'happy', msg: override ? 'Time’s up! Anyone still outside is caught in the storm…' : 'Running the base… watch!' });
    later(() => {
      const dead = (C.essentials || []).filter((k) => after[k] <= 0);
      const cold = mustRunFail(rd, pick);
      if (cold) { set({ res: after, lastD: diff(s.res, after) }); fail(cold); return; }
      if (dead.length) { set({ res: after, lastD: diff(s.res, after) }); fail(dead[0]); return; }
      const low = lowMeters(after, C.meters);
      const smart = roundStar(after, C, rd, pick, base);
      let card = rd.nasa;
      const ifs = rd.nasaIf ? [].concat(rd.nasaIf) : [];
      const hit = ifs.find((x) => s.on[x.item]);
      if (hit) card = hit.card;
      if (rd.nasaByStorm) card = pick.out + pick.wall === 0 ? rd.nasaByStorm.allSafe : pick.wall && !pick.out ? rd.nasaByStorm.usedWall : rd.nasa;
      if (rd.realStorm && storm) {
        // The real DONKI event comes first, then the lesson for what the child did.
        const times = storm.alert
          ? `${storm.date}: ${storm.cause} NASA’s alert went out at ${pkTime(storm.alert)} Pakistan time. The particle storm reached Earth, close to the Moon, ${storm.warnMin} minutes later.`
          : `${storm.date}: ${storm.cause} It reached Earth, close to the Moon, at ${pkTime(storm.nearEarth)} Pakistan time.`;
        card = { title: `Real storm: ${storm.date}`, real: times, more: [storm.alertText, storm.lesson, card.real, rightNowLine(live)].filter(Boolean).join(' '), links: [...storm.links, ...card.links] };
      }
      playSound(smart ? 'good' : 'low');
      let msg = explainTransition(s.res, after, rd.type === 'power' ? cellsUsed(rd, pick) : 0);
      if (items.some(it => pick?.[it.id] && it.eff?.o > 0 && it.eff?.w < 0)) msg = 'Making air used water and power. Look at our tanks!';
      if (offNow.length) msg = `${offNow[0].name} stayed off. Life support needs power first.`;
      else if (low.length) msg = `${resourceName(low[0])} is low. What could help next time?`;
      const found = discoveries(rd, pick, s.res, after, items);
      if (!practice) recordLearning(C.key, found, startRes, after);
      const where = `${C.short} · ${rd.title}`;
      const collected = strategiesFor(rd, pick, items).filter((id) => recordStrategy(id, { before: s.res, after, where }));
      if (s.rewindFrom) recordStrategy('rewind', { before: s.rewindFrom, after, where: `${where} · first try → new try` });
      set((prev) => ({
        newStrategies: collected, lastSmart: !!smart,
        newDiscoveries: found.filter(id => !(prev.discoveries || []).includes(id)),
        discoveries: [...new Set([...(prev.discoveries || []), ...found])],
        phase: 'result', res: after, lastD: diff(s.res, after), ons, picks, log, nasaOpen: true, card,
        mistake: prev.mistake || !smart, lifeSlip: prev.lifeSlip || offNow.length > 0 || stormUnsafe(rd, pick),
        mood: smart ? 'cheer' : 'worry', msg,
      }));
      if (smart) award('Smart choice! +1 star');
      if (!practice) addNotebookFact(`${C.key}-${s.r}-${card.title}`, card.title, [card.real, card.more].filter(Boolean).join(' '), card.links);
    }, 2200);
  };

  // Countdown for action rounds (the storm): a short warning, like the real one.
  useEffect(() => {
    if (s.phase !== 'play' || !rd.countdown || s.nasaOpen || !stormReady) return undefined;
    if (s.cd === null) { set({ cd: rd.countdown }); return undefined; }
    if (s.cd <= 0) { runRound(actionPick(rd, s)); return undefined; }
    const t = setTimeout(() => set((prev) => ({ cd: prev.cd === null ? null : prev.cd - 1 })), 1000);
    return () => clearTimeout(t);
  }, [s.phase, s.cd, s.r, s.nasaOpen, stormReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // ⏪ Engineer's rewind: back to this decision with the same choices still set, so one thing can change.
  const rewind = () => {
    const cp = checkpoint.current || {};
    committed.current = false; playSound('click');
    set({ ...fresh, on: { ...(cp.on || {}) }, crew: { ...(cp.crew || fresh.crew) }, watered: (cp.watered || fresh.watered).slice(), sel: cp.sel || null,
      r: cp.r ?? s.r, earned: cp.earned ?? s.earned, mistake: cp.mistake ?? s.mistake, lifeSlip: cp.lifeSlip ?? s.lifeSlip, picks: cp.picks || s.picks, ons: cp.ons || s.ons, log: cp.log || s.log,
      phase: 'play', res: cp.res || s.before || s.res, rewindFrom: { ...s.res }, nasaOpen: false, failWhy: null,
      mood: 'think', msg: `Engineer’s rewind! Your choices are still set. Change one thing. Tip: ${rd.tip}` });
  };
  const retryRound = () => { committed.current = false; playSound('click'); set({ ...(checkpoint.current || {}), ...fresh, rewindFrom: null, phase: 'play', res: s.before || s.res, mood: 'think', msg: `Let’s try a different plan! Tip: ${rd.tip}` }); };
  const goalOk = goalMet(C.goal, s.res, startRes);
  const stars = finalStars(s.earned + (goalOk ? 1 : 0), s.lifeSlip, goalOk);
  const nextRound = () => {
    if (s.phase !== 'result') return;
    committed.current = false; setHintLevel(0);
    playSound('click');
    if (s.r + 1 < C.rounds.length) {
      set({ ...fresh, rewindFrom: null, newStrategies: [], r: s.r + 1, phase: 'play', mood: 'think', msg: roundMsg(s.r + 1) });
      return;
    }
    // Mission over: save the base now, then show the Base Report.
    onFinish({ ...s.res });
    commitOfficialRun({ practice, key: C.key, stars, res: s.res, mars: C.mars, extra: (s.res.w || 0) >= 6 ? { waterWizard: true } : {}, patch: C.unlockModule ? { [C.unlockModule]: true } : {} });
    set({ phase: 'report', mood: 'cheer' });
  };

  const callHouston = () => {
    if (s.houstonUsed) { playSound('oops'); set({ mood: 'happy', msg: 'You already called Mission Control. You can do this one, Commander!' }); return; }
    if (s.phase !== 'play') { set({ mood: 'happy', msg: 'Save your Mission Control call for a tricky choice!' }); return; }
    // Communications use power: no radio, no call.
    const hasRadio = C.rounds.some((x) => (x.items || []).some((it) => it.id === 'radio'));
    if (hasRadio) {
      const radioOn = rd.type === 'power' ? !!s.on.radio : !!(s.ons[s.r - 1] || {}).radio;
      if (!radioOn) {
        playSound('oops');
        set({ mood: 'worry', msg: rd.type === 'power'
          ? '📡 The radio is off! Switch on Radio to Earth first (it uses a battery cell), then call Mission Control.'
          : '📡 The radio was off last round, so nobody can reach Earth now. Next time, save a cell for the radio!' });
        return;
      }
    }
    playSound('pick');
    // The answer has to travel to Earth and back. The clock (and a storm countdown) keeps running.
    const r = s.r;
    if (C.mars) {
      // Mars: the reply takes 6 to 44 minutes, so it only arrives after this round is over.
      set({ houstonUsed: true, mood: 'worry', msg: marsCallingText() });
      saveDelayFact();
      later(() => set((prev) => (prev.r === r && prev.phase === 'play' ? { mood: 'happy', msg: replyText(rd.tip, 'mars') } : { toast: null })), MARS_GAME_DELAY_MS);
      return;
    }
    set({ houstonUsed: true, mistake: true, mood: 'think', msg: callingText(commander.level) });
    saveDelayFact();
    later(() => set((prev) => (prev.r === r && prev.phase === 'play' ? { mood: 'happy', msg: replyText(rd.tip, commander.level) } : {})), radioDelayMs(commander.level));
  };
  // The ? button asks a guiding question. It never gives the answer.
  const askHint = () => {
    set({ mood: 'happy', msg: s.phase === 'result' ? 'Which supplies went up? Which went down?' : contextualHint(rd, base, C.key, s.on, cells, Math.min(hintLevel, 2)) });
    setHintLevel(n => n + 1);
  };

  // ---------- derived view data ----------
  const ess = C.essentials || [];
  const meters = C.meters.map((k) => ({ key: k, name: resourceName(k), color: METERS[k].color, value: s.res[k], delta: s.lastD[k] || 0, essential: ess.includes(k), score: k === 'c' }));
  const steps = C.rounds.map((_, i) => (i < s.r || ['report', 'done'].includes(s.phase) || (i === s.r && s.phase === 'result') ? 'done' : i === s.r ? 'now' : 'todo'));
  const sc = rd.scene || {};
  const running = s.phase === 'run';
  const oxyOn = rd.type === 'power' && items.some((it) => s.on[it.id] && it.eff && it.eff.o > 0);
  const sciOn = rd.type === 'power' && items.some((it) => s.on[it.id] && it.eff && it.eff.c > 0);
  const food = typeof s.res.f === 'number' ? s.res.f : 5;
  const lit = items.filter((it) => (it.id.startsWith('lamp') || it.id === 'gh') && s.on[it.id]).length;
  const plantScales = [0, 1, 2].map((p) => {
    if (rd.action === 'water') return s.watered[p] ? 1.2 : 0.6;
    return Math.min(1.4, sc.plants ? (p < lit || s.phase === 'result' ? 0.5 + food / 10 : 0.45) : 0.4 + food / 16);
  });
  const lows = lowMeters(s.res, C.meters).map((k) => resourceName(k));
  const youText = rd.type === 'power'
    ? `You switched on: ${items.filter((it) => (s.ons[s.r] || s.on)[it.id]).map((it) => it.name).join(', ') || 'nothing'}.`
    : `You did: ${((s.log[s.r] || {}).title || '').replace(/^Solar storm: /, '')}.`;
  const highlight = !commanderMode && s.mistake;
  const showScene = s.phase !== 'intro';
  const preview = rd.type === 'action' ? chips(diff(s.res, previewRound(C.rounds, rd, s.res, actionPick(rd, s), s.ons)), C.meters) : null;
  const inShelter = Object.values(s.crew).filter((z) => z === 'in').length;

  // Base Report: what the base keeps for the next mission
  const next = C.mars ? null : ORDER[ORDER.findIndex((x) => x.key === C.key) + 1];
  let carryText = 'Your Moon base is complete: every part you built is still standing. Shabash!';
  if (next) {
    const nb = { ...base, after: { ...base.after, [C.key]: s.res }, ...(C.unlockModule ? { [C.unlockModule]: true } : {}) };
    const ns = startFor(next, nb);
    carryText = `New ${C.unlock}! ${next.title.replace(/!$/, '')} starts with ${listWords((next.carry || []).map((k) => `${resourceName(k)} ${ns[k]}`))} from your base.`;
  }

  return (
    <div className="screen screen--navy screen--game">
      <ProgressHeader title={C.short} steps={steps} onBack={() => go('map')} backLabel="Back to the Moon Map" clock={{ seconds: timeLeft, active: clockRunning }} stars={s.earned} />
      <ResourceBar meters={meters} />

      <Stage height={290} style={{ background: 'var(--navy)' }}>
        <svg aria-hidden="true" viewBox="0 0 390 290" style={{ position: 'absolute', inset: 0, width: 390, height: 290 }}>
          <Stars />
          {!C.mars && <Earth />}
          <path d="M0 290 L0 180 Q60 150 140 172 Q220 192 300 176 Q350 166 390 172 L390 290Z" fill={C.mars ? '#C8734F' : '#B8BCC6'} />
          <path d="M0 180 Q60 150 140 172 Q220 192 300 176 Q350 166 390 172" stroke={C.mars ? '#E3A07C' : '#E6E8EE'} strokeWidth="4" fill="none" />
          <path d="M0 290 L0 228 Q120 250 220 244 Q320 238 390 252 L390 290Z" fill={C.mars ? '#A9563A' : '#A3A8B3'} />
          <ellipse cx="60" cy="210" rx="22" ry="6" fill={C.mars ? '#9C4E35' : '#9298A5'} /><ellipse cx="330" cy="214" rx="28" ry="7" fill={C.mars ? '#9C4E35' : '#9298A5'} /><ellipse cx="200" cy="262" rx="20" ry="5" fill={C.mars ? '#93472F' : '#8E939E'} />
        </svg>
        <Sun className="fade" style={{ left: 22, top: 14, opacity: sc.night ? 0 : sc.dark ? 0.35 : 1 }} />
        <div role="img" aria-label={C.mars ? 'Your Mars base' : 'Your Moon base'} style={{ position: 'absolute', left: 70, top: 116, width: 200, height: 70 }}>
          <SolarPanels glow={running && !sc.night && !sc.dark} style={{ left: 0, top: 30 }} />
          <Dome style={{ left: 56, top: 22 }} windowColor={sc.night ? '#FFD21F' : '#4FC3F7'} antenna="#FF8FB8" antennaClass={running && sciOn ? 'a-blink' : ''} />
          <WaterTank level={s.res.w !== undefined ? s.res.w : 6} style={{ left: 124, top: 32, width: 16, height: 38 }} />
          <Greenhouse scales={plantScales} glass={sc.plants ? '#F3C6FF' : '#DFF7FF'} width={52} style={{ left: 144, top: 38 }} />
          {running && oxyOn && <Bubbles left={76} top={12} />}
        </div>
        {base.wall && <MoonWall style={{ left: 54, top: 186 }} />}
        <div className="fade" aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#050A24', opacity: sc.night ? 0.62 : sc.dark ? 0.42 : 0, pointerEvents: 'none' }} />
        {showScene && sc.night && <span className="pill" style={{ position: 'absolute', left: 12, top: 12, background: '#fff', fontSize: 13, height: 26 }}>Dark spell: freezing, no sunlight</span>}
        {showScene && sc.dark && <span className="pill" style={{ position: 'absolute', left: 12, top: 12, background: '#fff', fontSize: 13, height: 26 }}>Long shadow: panels get less sun</span>}
        {showScene && sc.storm && (
          <>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(255,130,40,0.2)', pointerEvents: 'none' }} />
            {[[330, 0, 0], [380, 30, 0.3], [280, -10, 0.6], [360, 70, 0.9], [240, 10, 1.1]].map(([l, t, d], i) => (
              <div key={i} className="a-storm" aria-hidden="true" style={{ position: 'absolute', left: l, top: t, width: 6, height: 6, borderRadius: '50%', background: '#FFB347', animationDelay: `${d}s` }} />
            ))}
            <span className="pill a-blink" style={{ position: 'absolute', left: 74, top: 14, background: 'var(--orange)' }}>{storm ? `Real storm · ${storm.date}` : 'Solar storm alert!'}</span>
            {/* The crew in the scene: outside on the right, behind the wall, or hidden in the shelter */}
            {CREW.map((c, i) => {
              const z = s.crew[c.id];
              if (z === 'in') return null;
              const pos = z === 'wall' ? { left: 62 + i * 36, top: 160 } : { left: 282 + i * 32, top: 196 - (i % 2) * 10 };
              return <img key={c.id} className="move" src={c.img} alt={`${c.name} ${ZONE_NAME[z]}`} style={{ position: 'absolute', width: 38, height: 38, borderRadius: '50%', border: `3px solid ${z === 'wall' ? '#B9A6FF' : '#FF9F43'}`, background: '#fff', objectFit: 'cover', ...pos }} />;
            })}
            {inShelter > 0 && <span className="pill a-pop" style={{ position: 'absolute', left: 120, top: 96, background: 'var(--sky)', fontSize: 13, height: 26 }}>{inShelter} safe in the shelter</span>}
          </>
        )}
        {!sc.storm && <CommanderFigure suit={commander.suit} className="" style={{ left: 286, top: 98 }} />}
        {s.phase === 'play' && rd.countdown && s.cd !== null && !s.nasaOpen && (
          <div role="timer" aria-label={`${s.cd} seconds left`} className="display a-pop" style={{ position: 'absolute', right: 12, top: 10, width: 58, height: 58, borderRadius: '50%', background: s.cd <= 3 ? 'var(--pink)' : 'var(--yellow)', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, border: '3px solid #fff' }}>{s.cd}</div>
        )}
        {s.phase === 'result' && lows.length === 0 && !sc.storm && <img className="a-pop" src="/assets/crew-full.webp" alt="Amina, Bilal and Zoya celebrating" style={{ position: 'absolute', left: 150, top: 192, width: 84 }} />}
        {(storm || C.mars) && ['play', 'result'].includes(s.phase) && rd.action !== 'storm' && !s.nasaOpen
          && <TelescopeButton onClick={() => { playSound('click'); setScanOpen(true); recordStrategy('sunScan', { where: `${C.short} · ${rd.title}`, note: C.mars ? 'You scanned the 9 February 2024 Sun cloud heading for Mars.' : `You scanned ${storm ? `${storm.name} (${storm.date})` : 'the Sun'}.` }); }} />}
        <StarToast text={s.toast} />
      </Stage>

      <div style={{ flex: 1, minHeight: 0, padding: '12px 14px 16px', background: 'var(--indigo)', borderRadius: '26px 26px 0 0', marginTop: -18, position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MissionDialogue mood={s.mood} message={s.msg} onHint={askHint} onHouston={callHouston} houstonUsed={s.houstonUsed} />

        {practice && <div className="pill" style={{ background: '#e9f5ff', height: 'auto', padding: 10 }}>🧪 Another plan · official progress is safe</div>}
        {s.phase === 'result' && (s.newDiscoveries || []).map(id => <div className="discovery" role="status" key={id}>✦ New discovery: <b>{LESSONS[id].title}</b></div>)}
        {s.phase === 'result' && <StrategyToasts ids={s.newStrategies} />}
        {s.phase === 'result' && rd.type === 'action' && <section className="learning-card"><div className="learning-eyebrow">WHAT YOU DID</div><TradeoffPicture v={{ ...(s.log[s.r]?.visual || {}), deltas: {} }} /></section>}
        {s.phase === 'result' && <ConsequenceReveal before={s.before} after={s.res} cells={rd.type === 'power' ? usedN : 0} total={rd.type === 'power' ? cells : 0} />}
        {s.phase === 'result' && s.rewindFrom && <RewindCompare first={s.rewindFrom} now={s.res} />}
        {typeof rd.harvestFrom === 'number' && <div className="growth-timeline">🌱 Planted → 🌿 A simulated month later → 🥬 Harvest<br /><strong>{harvestFor(C.rounds, rd, s.ons).f || 0} Food from your earlier lamps</strong><br /><small>Included in this round’s preview and result.</small></div>}
        {items.some(it => it.laterEff?.f && s.on[it.id]) && <div className="growth-timeline" aria-label="Simulated plant growth">🌱 Seed → 🌿 Growing → 🥬 Harvest in a later round<br /><small>Simulated time; food is added only at the mission’s harvest.</small></div>}
        {s.phase === 'play' && rd.type === 'power' && (
          <div className="a-rise" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="display" style={{ fontSize: 17 }}>Battery</span>
                <span className="muted" style={{ fontWeight: 800, fontSize: 14 }}>{cells - usedN} of {cells} cells free</span>
              </div>
              <BatteryCells total={cells} used={usedN} />
            </div>
            <button className="btn btn-soft" onClick={() => setInspect(true)}>🔎 Look inside our machines</button>
            <StormPrep items={items} on={s.on} free={cells - usedN} onToggle={toggle} />
            <MissionButtonGrid items={items} on={s.on} flagLife={highlight} keys={C.meters} onToggle={toggle} blockedFor={(it) => itemBlocked(it, rd)} />
            {rd.math && commanderMode && <button type="button" className="btn btn-soft" onClick={() => setMathOpen('optional')}>🧮 Check my battery math (optional)</button>}
            <button type="button" className="btn btn-yellow" style={{ marginTop: 'auto', height: 58, fontSize: 22 }} onClick={powerGo}>Power on!</button>
          </div>
        )}

        {s.phase === 'play' && rd.action === 'storm' && (
          <div className="a-rise" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CREW.map((c) => {
              const z = s.crew[c.id];
              const tone = z === 'in' ? ['var(--sky-soft)', 'var(--sky)'] : z === 'wall' ? ['#E6E0FF', '#B9A6FF'] : ['#FFE3CC', 'var(--orange)'];
              return (
                <button key={c.id} type="button" className="btn" onClick={() => moveCrew(c.id)}
                  style={{ height: 54, padding: '4px 10px', borderRadius: 18, background: tone[0], border: `4px solid ${tone[1]}`, justifyContent: 'flex-start', gap: 10, fontFamily: 'var(--font-body)' }}>
                  <img src={c.img} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', background: '#fff' }} />
                  <span style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <span className="display" style={{ fontSize: 17, lineHeight: '19px' }}>{c.name}</span>
                    <span style={{ fontWeight: 800, fontSize: 13 }}>{z === 'in' ? 'Safe in the shelter' : z === 'wall' ? 'Working behind the wall' : 'Working outside!'}</span>
                  </span>
                  <span className="pill" style={{ height: 30, background: '#fff', fontSize: 13 }}>Move <Icon name="next" size={14} stroke={3} /></span>
                </button>
              );
            })}
            <button type="button" className="btn btn-yellow" style={{ marginTop: 'auto', height: 'auto', minHeight: 60, padding: '6px 12px', flexDirection: 'column', gap: 2 }} onClick={() => runRound()}>
              <span style={{ fontSize: 20, lineHeight: '24px' }}>Ready for the storm!</span>
            </button>
          </div>
        )}

        {s.phase === 'play' && rd.action === 'water' && (
          <div className="a-rise" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              {s.watered.map((w, i) => (
                <button key={i} type="button" className="btn" aria-pressed={w} onClick={() => waterPlant(i)} aria-label={`Plant ${i + 1}: ${w ? 'watered' : 'thirsty'}. Tap to ${w ? 'skip it' : 'water it'}.`}
                  style={{ height: 112, borderRadius: 20, background: w ? 'var(--green-soft)' : '#fff', border: `4px solid ${w ? 'var(--green)' : '#D5D8F0'}`, flexDirection: 'column', gap: 4, fontFamily: 'var(--font-body)' }}>
                  <svg aria-hidden="true" viewBox="0 0 40 44" width="46" height="50">
                    {w
                      ? <path d="M20 40 V20 M20 24 Q8 18 6 8 Q18 12 20 24 M20 20 Q32 14 34 4 Q22 8 20 20" stroke="#2E9E27" strokeWidth="2.5" fill="#43D13A" />
                      : <path d="M20 40 V24 M20 30 Q12 30 8 38 Q16 36 20 30 M20 26 Q28 28 32 36 Q24 34 20 26" stroke="#7C8B5E" strokeWidth="2.5" fill="#B7C9A0" />}
                    <rect x="10" y="38" width="20" height="6" rx="2" fill="#B07A4C" />
                    {w && <path d="M34 2c3 4 4 6 4 8a4 4 0 0 1-8 0c0-2 1-4 4-8z" fill="#4FC3F7" />}
                  </svg>
                  <span style={{ fontWeight: 800, fontSize: 13 }}>{w ? 'Watered!' : 'Thirsty'}</span>
                </button>
              ))}
            </div>

            <button type="button" className="btn btn-yellow" style={{ marginTop: 'auto', height: 58, fontSize: 22 }} onClick={() => runRound()}>Done watering</button>
          </div>
        )}

        {s.phase === 'play' && rd.type === 'choice' && (
          <div className="a-rise" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.map((o) => {
              return <ChoiceCard key={o.id} title={o.title} desc={o.desc} icon={o.icon} iconBg={o.color} selected={s.sel === o.id} compact={options.length > 2}
                onClick={() => { playSound('pick'); set({ sel: o.id, mood: 'think', msg: `${o.title}? Tap Do it! to see what happens.` }); }} />;
            })}
            <button type="button" className="btn btn-yellow" style={{ marginTop: 'auto', height: 58, fontSize: 22 }}
              onClick={() => { if (!s.sel) { playSound('oops'); set({ mood: 'happy', msg: 'Tap a plan first!' }); return; } runRound(); }}>Do it!</button>
          </div>
        )}

        {s.phase === 'run' && <MachineTheatre items={items} on={s.on} running />}

        {s.phase === 'result' && (
          <div className="a-rise" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lows.length > 0 && <div className="pill" style={{ background: '#ffe0ec' }}>Needs care: {lows.join(', ')}</div>}
            {rd.action === 'storm' && <button className="btn btn-soft" onClick={() => setShowRuler(true)}>Real radiation numbers</button>}
            {rd.action === 'storm' && <button className="btn btn-soft" onClick={() => { playSound('click'); const g = ghostReplay(C.rounds, rd, s.before, s.picks[s.r], s.ons, !!base.wall); setGhost(g); recordStrategy('ghost', { before: g.mine.after, after: g.other.after, where: `${C.short} · your plan → the other choice` }); }}>👻 What if? Try the other choice</button>}
            <div className="report-actions" style={{ marginTop: 'auto' }}>
              {s.lastSmart
                ? <button type="button" className="btn btn-white" onClick={retryRound}>Try again</button>
                : <button type="button" className="btn btn-white" onClick={rewind}>⏪ Engineer’s rewind</button>}
              <button type="button" className="btn btn-yellow" onClick={nextRound}>{s.r + 1 < C.rounds.length ? 'Next round' : 'Base report'}</button>
            </div>
          </div>
        )}
      </div>

      {inspect && <EquipmentCards items={items} round={rd} onClose={() => setInspect(false)} />}
      {mathOpen && <MissionMath round={rd} on={s.on} total={cells} optional={mathOpen === 'optional'} onDone={() => { const run = mathOpen !== 'optional'; setMathOpen(false); if (run) runRound(); }} />}
      {s.phase === 'intro' && (
        <ReadySheet kicker={C.mars ? 'BONUS · MARS MODE' : C.key === 'final' ? 'FINAL MISSION' : `MISSION ${C.num} OF 4`} title={C.title} realLine={C.intro.real}
          story={[C.intro.story, C.darkLabel && `Tonight: ${C.darkLabel}.`, storm && `Today’s storm: ${storm.name} (${storm.date}).`, storm && liveLine(live)].filter(Boolean).join(' ')}
          goal={`${childText(C.intro.goal)} Bonus star: ${C.goal.text.toLowerCase()}.`}
          clockSeconds={time} lifeText={ess.map((k) => resourceName(k)).join(' + ')} steps={C.rounds.map((x, i) => `${i + 1}. ${x.title}`)} onStart={start} startLabel="Start Mission!"
          base={<BaseStrip base={base} startMeters={startRes} meterKeys={C.carry || []} />} />
      )}
      {s.phase === 'result' && s.nasaOpen && (
        <NASAFactCard title={(s.card || rd.nasa).title} iconPath={rd.type === 'power' ? (items[0] || {}).icon : rd.action === 'water' ? ICONS.plant : ICONS.shelter} you={youText} before={s.before} after={s.res} item={items.find(it => s.on[it.id])}
          real={(s.card || rd.nasa).real} more={(s.card || rd.nasa).more} links={(s.card || rd.nasa).links} photo={(s.card || rd.nasa).photo} onClose={() => { playSound('click'); set({ nasaOpen: false }); }} />
      )}
      {s.phase === 'failed' && <AbortSheet reason={s.failWhy} onRetry={onReplay} onRewind={s.failWhy !== 'time' && checkpoint.current ? rewind : null} onMap={() => go('map')} />}
      {s.phase === 'report' && (
        <BaseReport kicker={`${C.key === 'final' ? 'FINAL' : `MISSION ${C.num}`} · ${C.title.replace(/!$/, '').toUpperCase()}`} stars={stars} mate={C.mate}
          site={base.site || 'ridge'} wall={base.wall} tank={base.tank || C.unlockModule === 'tank'} greenhouse={base.greenhouse || C.unlockModule === 'greenhouse'}
          water={typeof s.res.w === 'number' ? s.res.w : 6} suit={commander.suit}
          choices={s.log.filter(Boolean)} wrap={C.wrap} meters={C.meters.map((k) => ({ key: k, from: startRes[k], to: s.res[k] }))}
          carryText={practice ? "Practice result only. Your official base, unlocks, and best stars are unchanged." : carryText} nasa={CARDS[C.reportNasa]} goal={{ text: C.goal.text, met: goalOk }}
          learning={{ before: startRes, after: s.res, ids: s.discoveries || [], previous, practice }}
          onCollect={() => set({ phase: 'done' })} onReplay={onReplay} />
      )}
      {s.phase === 'done' && (
        <RewardModal commander={commander.name.trim() ? `Commander ${commander.name.trim()}` : 'Commander'} stars={stars} badge={C.badge} unlock={C.unlock}
          facts={C.rounds.map((x) => `${x.nasa.title}: ${x.nasa.real.split('. ')[0]}.`)} onMap={() => go('map')} onDashboard={() => go('dashboard')} onReplay={onReplay} onNewDay={onNewDay}
          note={s.lifeSlip ? 'Life support was switched off, or crew stayed outside in the storm, so the most you can get is 2 stars. NASA keeps the crew safe first!' : null}
          onNumbers={() => set({ showNumbers: true })} challenges={stars === 3 ? C.challenges : null} onData={() => go('data')} />
      )}
      {s.phase === 'play' && rd.action === 'storm' && !stormReady && <StormPractice hasWall={!!base.wall} onDone={() => { capturedStorm.current = storm; setStormReady(true); set({ crew: { amina: 'out', bilal: 'out', zoya: 'out' }, cd: null }); }} />}
      {scanOpen && <SunScan card={sunScanCard({ storm, live, checkedAt, mars: !!C.mars })} onClose={() => setScanOpen(false)} />}
      {ghost && <GhostReplay ghost={ghost} before={s.before} onClose={() => setGhost(null)} />}
      {s.showNumbers && <NumbersSheet onClose={() => set({ showNumbers: false })} />}
      {showRuler && (
        <Sheet label="Real radiation ruler">
          <h2 className="display" style={{ fontSize: 24 }}>Real radiation ruler</h2>
          <RadiationRuler />
          <button type="button" className="btn btn-yellow" style={{ height: 58, fontSize: 22 }} onClick={() => setShowRuler(false)}>Got it!</button>
        </Sheet>
      )}
    </div>
  );
}

/** One machine switch: name, battery cost, and what it does to the meters. */
export function MachineButton({ item: it, on, blocked, flag, keys, onClick }) {
  return (
    <button type="button" className="btn machine-switch" aria-pressed={on} aria-disabled={!!blocked} onClick={onClick}
      style={{ minHeight: 70, height: 'auto', padding: '6px 8px', borderRadius: 18, border: `4px solid ${on ? 'var(--yellow)' : flag ? 'var(--pink)' : '#D5D8F0'}`, background: blocked ? '#E3E5EE' : on ? 'var(--yellow-soft)' : '#fff', opacity: blocked ? 0.75 : 1, textAlign: 'left', fontFamily: 'var(--font-body)' }}>
      <span className="machine-top">
        <span className="machine-mini" aria-hidden="true"><MachineDrawing kind={machineKind(it)} running={false} compact /></span>
        <span className="machine-text">
          <span className="machine-name">{it.name}</span>
          <span className="machine-status"><span className="chip-info">🔋 {cellWord(it.cost)}</span> {blocked ? 'NEEDS SUN' : on ? 'ON' : 'OFF'}{flag ? ' · LIFE SUPPORT' : ''}</span>
        </span>
      </span>
    </button>
  );
}

/** A 2-column grid of machine switches (shared with Mission 1). */
export function MissionButtonGrid({ items, on, flagLife, keys, onToggle, blockedFor }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
      {items.map((it) => (
        <MachineButton key={it.id} item={it} on={!!on[it.id]} blocked={blockedFor ? blockedFor(it) : null} flag={flagLife && it.life} keys={keys} onClick={() => onToggle(it)} />
      ))}
    </div>
  );
}
