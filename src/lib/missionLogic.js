// ============================================================
// Pure game rules shared by the mission screens and the balance tests.
// No React and no browser APIs here, so Node can run it too.
// ============================================================
import { R, CARRY } from '../data/ratios.js';

export const ORDER = ['m1', 'm2', 'm3', 'final'];
/** Meters that never count as "low" (science is a score, not a need). */
export const SCORE_ONLY = ['c'];

export const clamp = (v, lo = 0, hi = 10) => Math.max(lo, Math.min(hi, v));

export function applyEff(res, eff) {
  const out = { ...res };
  Object.keys(eff || {}).forEach((k) => { if (k in out) out[k] = clamp(out[k] + eff[k]); });
  return out;
}

export function addEff(total, eff) {
  Object.keys(eff || {}).forEach((k) => { total[k] = (total[k] || 0) + eff[k]; });
  return total;
}

/** The persistent outpost saved between missions. */
export function readBase(progress) {
  const b = (progress && progress.base) || {};
  return {
    site: b.site === 'crater' ? 'crater' : b.site === 'ridge' ? 'ridge' : null,
    wall: !!b.wall,
    tank: !!b.tank,
    greenhouse: !!b.greenhouse,
    after: b.after || {},
  };
}

/** Starting meters for a mission: carried over from earlier missions. */
export function startFor(C, base) {
  const start = { ...C.start };
  const idx = ORDER.indexOf(C.key);
  (C.carry || []).forEach((k) => {
    for (let i = idx - 1; i >= 0; i--) {
      const prev = base.after[ORDER[i]];
      if (prev && typeof prev[k] === 'number') { start[k] = clamp(prev[k], CARRY.min, CARRY.max); break; }
    }
  });
  if (base.tank && idx > ORDER.indexOf('m2') && typeof start.o === 'number') start.o = clamp(start.o + R.tankOxygen.points);
  return start;
}

/** Is this module available in this mission? */
export function hasModule(req, base, missionKey) {
  if (!req) return true;
  const idx = ORDER.indexOf(missionKey);
  if (req === 'wall') return base.wall;
  if (req === 'greenhouse') return base.greenhouse || idx > ORDER.indexOf('m3');
  return true;
}

export const isDark = (round) => !!(round.scene && (round.scene.dark || round.scene.night));

/** Why an item cannot be switched on right now (or null). */
export function itemBlocked(item, round) {
  if (item.sunOnly && isDark(round)) return 'Needs strong sunlight';
  return null;
}

export function itemsFor(round, base, missionKey) {
  return (round.items || []).filter((it) => hasModule(it.requires, base, missionKey));
}
export function optionsFor(round, base, missionKey) {
  return (round.options || []).filter((o) => hasModule(o.requires, base, missionKey));
}

/** Battery cells for a power round. */
export function cellsFor(round, ons, base) {
  let n = typeof round.cells === 'number' ? round.cells : round.cellsBase || 0;
  if (round.bonus && (ons[round.bonus.round] || {})[round.bonus.item]) n += round.bonus.add;
  if (!isDark(round) && base.site) n += base.site === 'ridge' ? R.siteSunBonus.points : -R.siteSunBonus.points;
  return Math.max(1, n);
}

export const cellsUsed = (round, on) => (round.items || []).reduce((a, it) => a + (on[it.id] ? it.cost : 0), 0);

/**
 * Hands-on action rounds.
 *  storm: pick = { out, wall, shelter } = how many of the 3 crew are in each place.
 *    Shield loss follows the Artemis I 4-to-1 cabin-vs-shelter ratio (ratios.js):
 *    all outside = stormOutside, all behind the wall = stormWall, all inside = stormShelter.
 *    Crew outside get the most science, crew behind the wall a little,
 *    and if everyone hides, science goes down a little.
 *  water: pick = { n } = how many of the 3 thirsty plants were watered.
 */
export const CREW = 3;
export function actionEffect(round, pick) {
  if (round.action === 'storm') {
    const out = pick.out || 0; const wall = pick.wall || 0;
    const perOut = (R.stormOutside.points - R.stormShelter.points) / CREW;
    const perWall = (R.stormWall.points - R.stormShelter.points) / CREW;
    const loss = R.stormShelter.points + Math.round(out * perOut + wall * perWall);
    const workers = out + wall;
    const sci = out * R.crewWorkScience.points + wall * R.crewWallScience.points;
    return { s: -loss, c: workers ? sci : -R.crewWallScience.points };
  }
  if (round.action === 'water') {
    const n = pick.n || 0;
    return n ? { f: n * R.plantDrinkFood.points, w: -n * R.plantDrinkWater.points } : { f: -R.plantWiltFood.points };
  }
  return {};
}

/** Every possible pick for an action round (used by the balance test). */
export function actionPicks(round, base) {
  if (round.action === 'water') return [0, 1, 2, 3].map((n) => ({ n }));
  const out = [];
  for (let o = 0; o <= CREW; o++) for (let w = 0; w <= (base.wall ? CREW - o : 0); w++) out.push({ out: o, wall: w, shelter: CREW - o - w });
  return out;
}

/**
 * Delayed results: some machines pay off in a LATER round (lettuce takes
 * about a month). A round with `harvestFrom: i` collects the laterEff of
 * every machine that was on in round i.
 */
export function harvestFor(rounds, round, ons) {
  const eff = {};
  if (typeof round.harvestFrom !== 'number') return eff;
  const src = rounds[round.harvestFrom] || {}; const on = (ons || [])[round.harvestFrom] || {};
  (src.items || []).forEach((it) => { if (on[it.id] && it.laterEff) addEff(eff, it.laterEff); });
  return eff;
}

/** Total change to the meters for one round (plus any delayed harvest). */
export function roundEffect(round, pick, harvest) {
  const eff = { ...(harvest || {}) };
  if (round.type === 'power') (round.items || []).forEach((it) => { if (pick[it.id]) addEff(eff, it.eff); });
  else if (round.type === 'action') addEff(eff, actionEffect(round, pick));
  else { const o = (round.options || []).find((x) => x.id === pick); if (o) addEff(eff, o.eff); }
  addEff(eff, round.drift);
  return eff;
}

/** The mission's bonus goal (a star earned by playing, not by answering). */
// A `grow` goal counts what the child ADDED this mission, so food carried in from earlier missions cannot win it alone.
export const goalMet = (goal, res, start) => {
  if (!goal || typeof res[goal.key] !== 'number') return false;
  if (goal.grow) return res[goal.key] - ((start || {})[goal.key] || 0) >= goal.min;
  return res[goal.key] >= goal.min;
};

/** Meters at 3 or less (science never counts). */
export function lowMeters(res, keys) {
  return keys.filter((k) => !SCORE_ONLY.includes(k) && res[k] <= 3);
}

/** Life-support machines that were left off in a power round. */
export function lifeOff(round, on, base, missionKey) {
  if (round.type !== 'power') return [];
  return itemsFor(round, base, missionKey).filter((it) => it.life && !it.nightOnly && !itemBlocked(it, round) && !on[it.id]);
}

/** Crew left outside during a solar storm: a safety slip, like life support off. */
export const stormUnsafe = (round, pick) => round.type === 'action' && round.action === 'storm' && (pick.out || 0) > 0;

/**
 * A round earns a "smart choice" star when no meter is low AND every
 * life-support machine stayed on (NASA gives life support top priority, source B).
 */
export function roundStar(res, C, round, pick, base) {
  return lowMeters(res, C.meters).length === 0 && lifeOff(round, round.type === 'power' ? pick : {}, base, C.key).length === 0 && !stormUnsafe(round, pick);
}

/**
 * Final star count. The 3rd star needs ALL of: the bonus goal reached,
 * life support on all mission, and nobody left outside in a storm.
 * (So "hide and do nothing" can never earn full marks.)
 */
export const finalStars = (earned, lifeSlip, goalOk = true) => Math.max(1, Math.min(lifeSlip || !goalOk ? 2 : 3, earned));

/** A machine that MUST run in this round (the Heater in the dark). Returns the abort reason, or null. */
export const mustRunFail = (round, pick) => (round.mustRun && round.type === 'power' && !(pick || {})[round.mustRun.item] ? round.mustRun.reason : null);
