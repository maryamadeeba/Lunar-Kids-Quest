import { applyEff, roundEffect, cellsUsed, harvestFor, itemsFor, itemBlocked } from './missionLogic.js';
import { readJSON, writeJSON, completeMission, saveBase } from './storage.js';

export const LEARNING_KEY = 'lkq-learning-v1';
export const resourceName = k => ({ o: 'Air', w: 'Water', p: 'Power', f: 'Food', c: 'Science', s: 'Radiation safety', h: 'Fitness', m: 'Fitness' }[k] || k);
export const resourceIcon = k => ({ o: '🫧', w: '💧', p: '🔋', f: '🌱', c: '🔬', s: '🛡', h: '🚲', m: '🚲' }[k] || '✦');
export const childText = text => String(text || '').replace(/\bShield\b/g, 'radiation safety');
export function commitOfficialRun({ practice, key, stars, res, patch = {}, extra = {}, mars = false }) {
  if (practice) return false;
  completeMission(key, stars, extra);
  if (!mars) saveBase(key, res, patch);
  return true;
}
export function transitions(before, after) {
  return Object.keys(before).filter(k => typeof after[k] === 'number' && before[k] !== after[k])
    .map(key => ({ key, from: before[key], to: after[key], delta: after[key] - before[key] }));
}
export function previewRound(rounds, round, before, pick, ons) {
  return applyEff(before, roundEffect(round, pick, harvestFor(rounds, round, ons)));
}
export function explainTransition(before, after, cells = 0) {
  const changes = transitions(before, after);
  const gains = changes.filter(x => x.delta > 0).map(x => resourceName(x.key).toLowerCase());
  const costs = changes.filter(x => x.delta < 0).map(x => resourceName(x.key).toLowerCase());
  if (cells) costs.unshift('battery cells');
  return gains.length ? `We gained ${gains.join(' and ')}.${costs.length ? ` It cost ${costs.join(' and ')}.` : ' Other needs still share our supplies.'}`
    : costs.length ? `We used ${costs.join(' and ')}. What could we save next time?` : 'Our meters stayed steady. Our choices balanced the crew’s needs.';
}
export const LESSONS = {
  air: { title: 'Making air uses supplies', text: 'Fresh air needs power and water.', prompt: 'What else could use that water?' },
  power: { title: 'Power is precious', text: 'One machine leaves fewer cells for another.', prompt: 'Which machine would you power first?' },
  garden: { title: 'Plan food for later', text: 'Plant lights cost supplies before the harvest.', prompt: 'Why do plants need time?' },
  safety: { title: 'Safety before science', text: 'Sheltering everyone pauses science and limits exposure.', prompt: 'What did sheltering the crew give up?' },
  site: { title: 'Sunlight or nearby ice', text: 'Each home has a strength and a cost.', prompt: 'What is harder at your chosen home?' },
  radio: { title: 'A call needs power', text: 'Radio cells cannot power another machine.', prompt: 'Could Chandu help while Earth’s reply travels?' },
};
export function discoveries(round, pick, before, after, available = []) {
  const selected = available.filter(it => pick?.[it.id]);
  const ids = [];
  if (selected.some(it => it.eff?.o > 0 && it.eff?.w < 0) && after.o > before.o) ids.push('air');
  if (round.type === 'power' && cellsUsed(round, pick) > 0 && available.some(it => !pick[it.id] && !itemBlocked(it, round))) ids.push('power');
  if (selected.some(it => it.laterEff?.f > 0)) ids.push('garden');
  if (round.action === 'storm' && pick.out === 0 && pick.wall === 0 && after.s < before.s && after.c < before.c) ids.push('safety');
  if (selected.some(it => it.id === 'radio')) ids.push('radio');
  return ids;
}
export function recordLearning(mission, ids, before, after) {
  const old = readJSON(LEARNING_KEY);
  const found = Array.isArray(old.discoveries) ? old.discoveries : [];
  const next = { version: 1, ...old, discoveries: [...new Set([...found, ...ids.filter(id => LESSONS[id])])], reports: { ...old.reports, [mission]: { before, after, ids } } };
  writeJSON(LEARNING_KEY, next);
  return next;
}
export function contextualHint(round, base, missionKey, on, cells, level) {
  const available = itemsFor(round, base, missionKey);
  const affordable = available.find(it => it.life && !on[it.id] && !itemBlocked(it, round) && cellsUsed(round, on) + it.cost <= cells);
  if (level === 0) return 'What does our crew need most right now?';
  if (level === 1) return round.action === 'storm' ? 'Look at who is still outside.' : 'Look at the air, water, and battery.';
  if (round.action === 'storm') return 'Tap each astronaut to move them into the shelter.';
  if (round.action === 'water') return 'Compare water used with food gained before watering.';
  return affordable ? `Try ${affordable.name}. It fits our free cells.` : 'Try freeing cells by turning off an optional machine.';
}

// Shared presentation semantics for benefits, costs and unchanged values.
export const changeClass = value => value > 0 ? 'tradeoff-gain' : value < 0 ? 'tradeoff-loss' : 'tradeoff-neutral';

/** Choices are described simply: each supply is either added or drained. Numbers appear only in results. */
export function effectWords(eff = {}, keys) {
  return Object.entries(eff).filter(([k, n]) => n !== 0 && (!keys || keys.includes(k)) && resourceName(k) !== k)
    .map(([k, n]) => ({ key: k, icon: resourceIcon(k), text: `${n > 0 ? 'Adds' : 'Drains'} ${resourceName(k)}` }));
}
