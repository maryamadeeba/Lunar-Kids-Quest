import assert from 'node:assert/strict';
import { mathPuzzle, machineKind, scienceStory, PLAYTEST_TASKS } from '../src/lib/visualLearning.js';
import { cellsFor, cellsUsed, itemsFor, itemBlocked } from '../src/lib/missionLogic.js';
import { MISSION1 } from '../src/data/mission1.js';
import { MISSION_2, MISSION_3, FINAL_MISSION, MARS_MISSION } from '../src/data/missions.js';
let plans = 0;
for (const C of [MISSION_2, MISSION_3, FINAL_MISSION, MARS_MISSION]) {
  for (const site of ['ridge', 'crater']) {
    const base = { site, wall: true, greenhouse: true, after: {} };
    for (const rd of C.rounds.filter(rd => rd.type === 'power')) {
      const available = itemsFor(rd, base, C.key);
      const total = cellsFor(rd, [], base);
      for (let mask = 0; mask < 2 ** available.length; mask++) {
        const on = Object.fromEntries(available.map((it, i) => [it.id, !!(mask & (1 << i))]));
        if (cellsUsed(rd, on) > total || available.some(it => on[it.id] && itemBlocked(it, rd))) continue;
        const saved = JSON.stringify({ rd, on });
        const puzzle = mathPuzzle(rd, on, total);
        const expected = rd.math === 'lamps' ? available.filter(it => on[it.id] && it.laterEff?.f > 0).reduce((sum, it) => sum + it.cost, 0) : total - cellsUsed(rd, on);
        assert.equal(puzzle.answer, expected);
        assert.ok(puzzle.answer >= 0);
        assert.equal(JSON.stringify({ rd, on }), saved, 'Preparing quiz must not change gameplay');
        plans++;
      }
    }
  }
}
assert.equal(mathPuzzle({ items: MISSION1.machines, math: 'left' }, { oxy: true, rec: true }, 9).answer, 4);
assert.equal(mathPuzzle(MISSION_2.rounds[0], {}, 13).answer, 13);
const oxy = MISSION_2.rounds[0].items.find(it => it.id === 'oxy');
const recycler = MISSION_2.rounds[0].items.find(it => it.id === 'rec');
assert.equal(machineKind(oxy), 'air');
assert.equal(machineKind(recycler), 'recycle');
assert.equal(machineKind(MISSION_3.rounds[0].items.find(it => it.laterEff?.f)), 'garden');
assert.equal(scienceStory('NASA recorded a solar particle storm').kind, 'shelter');
assert.equal(scienceStory('Ice mining uses power and sunlight').kind, 'ice');
assert.equal(scienceStory('Find our Moon home').kind, 'site');
assert.equal(scienceStory('Lettuce takes about a month').kind, 'garden');
assert.equal(scienceStory('Recycling 98% of water').kind, 'recycle');
assert.equal(new Set(PLAYTEST_TASKS.map(t => t.id)).size, PLAYTEST_TASKS.length);
assert.ok(PLAYTEST_TASKS.every(t => t.prompt && t.observe));
console.log(`PASS: Quiz answers match ${plans} legal power plans across Moon/Mars and both sites.`);
console.log('PASS: Mission 1 and zero-spend math; no mutation; equipment illustrations; story selection; usability task definitions.');
