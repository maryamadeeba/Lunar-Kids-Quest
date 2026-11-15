// Balance test: plays every possible strategy in every mission using the
// real game data and rules, then checks the design rules. Run: npm run test:balance
import { R, TIERS, CARRY } from '../src/data/ratios.js';
import { MISSION_2, MISSION_3, FINAL_MISSION, MARS_MISSION, DARK_VARIANTS, finalWithDark } from '../src/data/missions.js';
import { MISSION1 } from '../src/data/mission1.js';
import { m1Compute, m1Used } from '../src/lib/mission1Logic.js';
import { startFor, itemsFor, optionsFor, cellsFor, cellsUsed, roundEffect, applyEff, lowMeters, itemBlocked, roundStar, lifeOff, finalStars, actionPicks, goalMet, harvestFor, actionEffect, stormUnsafe, mustRunFail } from '../src/lib/missionLogic.js';
import { STORMS } from '../src/data/storms.js';

let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failures++; };
const subsets = (arr) => arr.reduce((acc, x) => acc.concat(acc.map((s) => [...s, x])), [[]]);

// ---------- NASA ratio rules ----------
const machineCosts = ['oxyMakerPower', 'waterRecyclerPower', 'heaterPower', 'plantLampPower', 'sciencePower', 'bikePower', 'wallPower', 'chargePower'];
check(machineCosts.every((k) => R.iceMinerPower.points > R[k].points), 'Ice miner is the biggest power user (B)');
check(R.waterDrain.points === 3 * R.oxygenDrain.points, `Water drain is 3x oxygen drain (D): ${R.waterDrain.points} vs ${R.oxygenDrain.points}`);
check(R.stormOutside.points > R.stormWall.points && R.stormWall.points > R.stormShelter.points, 'Storm: outside > wall > shelter');
check(R.stormOutside.points === 4 * R.stormShelter.points, 'Storm: whole crew outside = 4x shelter (Artemis I, K)');
check(R.roverTripPower.points === TIERS.TINY, 'Rover trip is TINY (B)');
check(Object.values(R).every((x) => x.points === TIERS[x.tier] && ['nasa', 'estimate'].includes(x.basis)), 'Every ratio has a valid tier and basis');

// ---------- Mission 1 ----------
console.log('\nMission 1');
const m1Results = [];
for (const site of ['ridge', 'crater']) {
  for (let taps = 0; taps <= 3; taps++) {
    const before = m1Compute({ site, taps, on: {} });
    for (const set of subsets(MISSION1.machines.map((m) => m.id))) {
      const on = Object.fromEntries(set.map((id) => [id, true]));
      if (m1Used(on) > before.p) continue;
      const after = m1Compute({ site, taps, on, dayDone: true });
      const dead = MISSION1.essentials.filter((k) => after[k] <= 0);
      const safe = !dead.length && Object.keys(after).every((k) => after[k] > 3) && on.oxy && on.rec;
      const stars = dead.length ? 0 : Math.min(3, (site === 'ridge' ? 1 : 0) + (safe ? 1 : 0) + (goalMet(MISSION1.goal, after) ? 1 : 0));
      m1Results.push({ site, taps, set, after, dead, stars });
    }
  }
}
const m1Three = m1Results.filter((r) => r.stars === 3);
check(m1Three.length >= 2, `${m1Three.length} different 3-star strategies, e.g. ${m1Three.slice(0, 3).map((r) => `${r.site}+${r.taps} trips+[${r.set}]`).join(' | ')}`);
check(m1Three.every((r) => r.site === 'ridge'), 'Only the NASA plan (sunny rim) reaches 3 stars');
check(m1Results.some((r) => r.site === 'crater' && r.stars === 2), 'Crater Edge is still playable (2 stars)');
check(m1Three.some((r) => r.set.includes('wall')), 'Building the Moon-dirt wall can still reach 3 stars');
for (const k of MISSION1.essentials) check(m1Results.some((r) => r.dead.includes(k)), `Skipping ${k} can abort`);

// ---------- Engine missions ----------
function play(C, start, base) {
  // Depth-first over every pick in every round.
  const out = [];
  const step = (ri, res, ons, picks, stars, slip) => {
    if (ri === C.rounds.length) { out.push({ res, start, picks, stars: finalStars(stars + (goalMet(C.goal, res, start) ? 1 : 0), slip, goalMet(C.goal, res, start)), dead: null }); return; }
    const rd = C.rounds[ri];
    const choices = rd.type === 'power'
      ? subsets(itemsFor(rd, base, C.key).filter((it) => !itemBlocked(it, rd)).map((it) => it.id))
        .map((ids) => Object.fromEntries(ids.map((id) => [id, true])))
        .filter((on) => cellsUsed(rd, on) <= cellsFor(rd, ons, base))
      : rd.type === 'action' ? actionPicks(rd, base)
      : optionsFor(rd, base, C.key).map((o) => o.id);
    for (const pick of choices) {
      const after = applyEff(res, roundEffect(rd, pick, harvestFor(C.rounds, rd, ons)));
      const dead = [mustRunFail(rd, pick), ...C.essentials.filter((k) => after[k] <= 0)].filter(Boolean);
      const label = rd.type === 'power' ? Object.keys(pick).join('+') || 'nothing'
        : rd.type === 'action' ? (rd.action === 'water' ? `water${pick.n}` : `out${pick.out}/wall${pick.wall}/in${pick.shelter}`) : pick;
      const p2 = [...picks, label];
      if (dead.length) { out.push({ res: after, picks: p2, stars: 0, dead: dead[0] }); continue; }
      const ons2 = [...ons]; ons2[ri] = rd.type === 'power' ? pick : {};
      step(ri + 1, after, ons2, p2, stars + (roundStar(after, C, rd, pick, base) ? 1 : 0), slip || lifeOff(rd, rd.type === 'power' ? pick : {}, base, C.key).length > 0 || stormUnsafe(rd, pick));
    }
  };
  step(0, start, [], [], 0, false);
  return out;
}

const scenarios = [];
for (const site of ['ridge', 'crater']) {
  for (const level of ['fresh', 'min', 'max']) {
    for (const wall of [false, true]) {
      const val = level === 'min' ? CARRY.min : CARRY.max;
      const after = level === 'fresh' ? {} : { m1: { o: val, w: val, s: val }, m2: { o: val, w: val }, m3: { o: val, w: val, f: val } };
      scenarios.push({ name: `${site}/${level}${wall ? '/wall' : ''}`, base: { site, wall, tank: level !== 'fresh', greenhouse: level !== 'fresh', after } });
    }
  }
}

for (const C of [MISSION_2, MISSION_3, ...DARK_VARIANTS.map(finalWithDark), MARS_MISSION]) {
  console.log(`\n${C.title}${C.darkLabel ? ` (${C.darkLabel})` : ''}`);
  let allFinishable = true;
  const abortsBy = new Set();
  for (const sc of scenarios) {
    const res = play(C, startFor(C, sc.base), sc.base);
    if (!res.some((r) => !r.dead)) { allFinishable = false; console.log(`   impossible in ${sc.name}`); }
    res.forEach((r) => { if (r.dead) abortsBy.add(r.dead); });
    if (['ridge/fresh', 'crater/fresh', 'ridge/max'].includes(sc.name)) {
      const sig = (r) => r.picks.map((p) => p.split('+').map((x) => x.replace(/lamp\d/, 'lamp')).sort().join('+')).join(' > ');
      const three = [...new Map(res.filter((r) => r.stars === 3).map((r) => [sig(r), r])).values()];
      const need = C.darkVariant === 'night' && sc.name === 'crater/fresh' ? 1 : 2; // the full Moon night on the shady site is the hardest case
      check(three.length >= need, `${sc.name}: ${three.length} different 3-star strategies, e.g. ${three.slice(0, 3).map(sig).join('  |  ')}`);
    }
  }
  check(allFinishable, 'Carry-over never makes the mission impossible');
  if (C.rounds.some((x) => x.mustRun)) check(abortsBy.has('h'), 'Leaving the Heater off in the dark aborts (too cold)');
  for (const k of C.essentials) {
    if (abortsBy.has(k)) check(true, `Skipping ${k} can abort`);
    else console.log(`NOTE  Skipping ${k} cannot abort here (stored buffer lasts the mission); it costs the round star and turns the meter pink instead`);
  }
  const lifeOffStars = scenarios.flatMap((sc) => play(C, startFor(C, sc.base), sc.base)).filter((r) => r.stars === 3 && r.picks.some((p, i) => C.rounds[i].type === 'power' && C.rounds[i].items.some((it) => it.life && !it.sunOnly && !p.split('+').includes(it.id) && (it.id !== 'heat' || C.rounds[i].scene.night))));
  check(lifeOffStars.length === 0, 'No 3-star strategy switches life support off');
  const outStars = scenarios.flatMap((sc) => play(C, startFor(C, sc.base), sc.base)).filter((r) => r.stars === 3 && r.picks.some((p) => /^out[1-3]/.test(p)));
  if (C.rounds.some((x) => x.action === 'storm')) check(outStars.length === 0, 'No 3-star strategy leaves crew outside in the storm');
}

// ---------- New rules (this round of fixes) ----------
console.log('\nReal storms, delays and trade-offs');
const stormRd = FINAL_MISSION.rounds.find((x) => x.realStorm);
const sci = (p) => actionEffect(stormRd, p);
const allOut = sci({ out: 3, wall: 0, shelter: 0 }); const allWall = sci({ out: 0, wall: 3, shelter: 0 }); const allIn = sci({ out: 0, wall: 0, shelter: 3 });
check(allOut.c > allWall.c && allWall.c > allIn.c && allOut.s < allWall.s && allWall.s < allIn.s,
  `Storm is a real trade-off: outside ${allOut.c} Science/${allOut.s} Shield, wall ${allWall.c}/${allWall.s}, shelter ${allIn.c}/${allIn.s}`);
check(STORMS.every((x) => x.warnMin > 0 && x.countdown >= 7), `Every real storm has a countdown from its real warning time: ${STORMS.map((x) => `${x.date} ${x.warnMin} min -> ${x.countdown} s`).join(', ')}`);
const m3Lamps = MISSION_3.rounds[0].items.filter((it) => it.laterEff);
check(m3Lamps.length > 0 && m3Lamps.every((it) => !it.eff.f), 'Mission 3: plant lamps give food a month LATER, not today');
check(MISSION_2.rounds.every((rd) => rd.items.some((it) => it.id === 'bike')) && !MISSION_2.rounds.some((rd) => rd.items.some((it) => it.id === 'call')), 'Mission 2: the free video call is replaced by the exercise bike (costs power, protects fitness)');

const m3NoLamp = scenarios.flatMap((sc) => play(MISSION_3, startFor(MISSION_3, sc.base), sc.base).map((r) => ({ ...r, sc: sc.name })))
  .filter((r) => r.stars === 3 && !r.picks[0].includes('lamp'));
check(m3NoLamp.length === 0, `Mission 3: no 3-star strategy skips the plant lamps, even with lots of stored food${m3NoLamp.length ? ` (e.g. ${m3NoLamp[0].sc}: ${m3NoLamp[0].picks.join(' > ')})` : ''}`);

const finalAll = scenarios.flatMap((sc) => DARK_VARIANTS.map(finalWithDark).flatMap((C) => play(C, startFor(C, sc.base), sc.base).map((r) => ({ ...r, C }))));
check(finalAll.filter((r) => r.stars === 3).every((r) => goalMet(r.C.goal, r.res, r.start)), 'Final: every 3-star plan reaches the science goal (no free "hide and do nothing" win)');
const night = finalWithDark(DARK_VARIANTS.find((v) => v.id === 'night'));
const nightNoCharge = scenarios.flatMap((sc) => play(night, startFor(night, sc.base), sc.base)).filter((r) => !r.dead && !r.picks[0].includes('charge'));
check(nightNoCharge.every((r) => r.stars <= 2), 'Full Moon night: skipping the night-battery charge can never win 3 stars (a choice today matters later)');

// Storm: outside with low Shield must abort.
const lowShieldBase = { site: 'crater', wall: false, tank: true, greenhouse: true, after: { m1: { s: CARRY.min }, m3: {} } };
const fs = startFor(FINAL_MISSION, lowShieldBase);
const outsideLow = play(FINAL_MISSION, fs, lowShieldBase).filter((r) => r.picks[1] === 'out3/wall0/in0');
check(outsideLow.length > 0 && outsideLow.every((r) => r.dead === 's'), `Final: working outside in the storm with Shield ${fs.s} always aborts`);

console.log(`\n${failures ? `${failures} check(s) failed` : 'All checks passed'}`);
process.exit(failures ? 1 : 0);
