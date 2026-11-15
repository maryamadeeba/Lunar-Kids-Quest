// Side quests must only READ the game engine: same rules, same numbers, no change to official progress.
import assert from 'node:assert/strict';
const store = new Map();
globalThis.window = { localStorage: { getItem: k => store.get(k) || null, setItem: (k, v) => store.set(k, v), removeItem: k => store.delete(k) } };
const { FINAL_MISSION, MARS_MISSION, finalWithDark, DARK_VARIANTS } = await import('../src/data/missions.js');
const { applyEff, roundEffect, harvestFor, startFor, readBase, itemsFor } = await import('../src/lib/missionLogic.js');
const { getProgress } = await import('../src/lib/storage.js');
const SQ = await import('../src/lib/sideQuests.js');
let n = 0; const check = (label, fn) => { fn(); n++; console.log('PASS ' + label); };

const C = finalWithDark(DARK_VARIANTS[0]);
const base = readBase(getProgress());
const start = startFor(C, base);
const prep = C.rounds[0], storm = C.rounds.find(r => r.action === 'storm');
const progressBefore = JSON.stringify(getProgress());

check('Ghost replay uses the original engine for both plans, from the same start', () => {
  const ons = [{ oxy: true, brace: true }];
  const mine = { out: 0, wall: 0, shelter: 3 };
  const g = SQ.ghostReplay(C.rounds, storm, start, mine, ons, true);
  const by = p => applyEff(start, roundEffect(storm, p, harvestFor(C.rounds, storm, ons)));
  assert.deepEqual(g.mine.after, by(mine));
  assert.deepEqual(g.other.pick, { out: 0, wall: 3, shelter: 0 });
  assert.deepEqual(g.other.after, by(g.other.pick));
  assert.ok(g.other.after.c > g.mine.after.c, 'working gives more science');
  assert.ok(g.other.after.s < g.mine.after.s, 'working costs radiation safety');
  assert.deepEqual(SQ.otherStormPick({ out: 0, wall: 0, shelter: 3 }, false), { out: 3, wall: 0, shelter: 0 });
  assert.deepEqual(SQ.otherStormPick({ out: 1, wall: 2, shelter: 0 }, true), { out: 0, wall: 0, shelter: 3 });
});
check('Strategies come only from what the child actually picked', () => {
  const items = itemsFor(prep, base, C.key);
  assert.deepEqual(SQ.strategiesFor(prep, { oxy: true, drill: true }, items), ['scienceFirst']);
  assert.ok(SQ.strategiesFor(prep, { brace: true, charge: true }, items).includes('reinforced'));
  assert.ok(SQ.strategiesFor(prep, { brace: true, charge: true }, items).includes('savedPower'));
  assert.deepEqual(SQ.strategiesFor(storm, { out: 0, wall: 0, shelter: 3 }, []), ['shelteredAll']);
  assert.deepEqual(SQ.strategiesFor(storm, { out: 0, wall: 2, shelter: 1 }, []), ['wallWork']);
  assert.deepEqual(SQ.strategiesFor(storm, { out: 2, wall: 0, shelter: 1 }, []), []);
});
check('Strategy collection stores the real before/after and never touches official progress', () => {
  assert.equal(SQ.recordStrategy('ghost', { before: { c: 1 }, after: { c: 3 } }), true);
  assert.equal(SQ.recordStrategy('ghost', { before: { c: 1 }, after: { c: 4 } }), false);
  assert.equal(SQ.recordStrategy('notAStrategy', {}), false);
  assert.deepEqual(SQ.readStrategies().found.ghost.after, { c: 4 });
  assert.equal(JSON.stringify(getProgress()), progressBefore);
  for (const s of Object.values(SQ.STRATEGIES)) assert.ok(s.icon && s.title && s.hint && s.text);
});
check('Sun scan labels recent versus archived data honestly', () => {
  const archived = { name: 'Stored storm', date: '9 February 2024', cause: 'A solar flare sent particles.', warnMin: 12, links: [{ label: 'DONKI', href: 'https://ccmc.gsfc.nasa.gov/DONKI/' }] };
  const a = SQ.sunScanCard({ storm: archived, live: null, checkedAt: null });
  assert.equal(a.kind, 'archived'); assert.equal(a.badge, 'Archived practice'); assert.match(a.checked, /live check was not available/);
  const r = SQ.sunScanCard({ storm: { ...archived, live: true }, live: { ok: true, count: 1 }, checkedAt: new Date('2026-11-15T10:00:00Z') });
  assert.equal(r.kind, 'recent'); assert.equal(r.badge, 'Recent data'); assert.match(r.checked, /Checked live with NASA DONKI/);
  const quiet = SQ.sunScanCard({ storm: archived, live: { ok: true, count: 0 }, checkedAt: new Date() });
  assert.equal(quiet.kind, 'archived'); assert.match(quiet.checked, /no particle storms in the last 30 days/);
  const m = SQ.sunScanCard({ mars: true });
  assert.equal(m.kind, 'archived'); assert.match(m.link.href, /CME\/29066/);
  assert.equal(SQ.sunScanCard({ storm: null }), null);
});
check('New mission day draws only from existing darkness variants', () => {
  for (const v of DARK_VARIANTS) {
    const d = finalWithDark(v);
    assert.equal(d.rounds.length, FINAL_MISSION.rounds.length);
    assert.equal(d.rounds.find(r => r.mustRun).cellsBase, v.cellsBase);
  }
  assert.ok(MARS_MISSION.rounds.some(r => r.action === 'storm'));
});
console.log(`\n${n} side-quest groups passed.`);
