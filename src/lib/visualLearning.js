import { cellsUsed } from './missionLogic.js';

/** Presentation only: never supplies resource effects or NASA measurements. */
export function machineKind(item = {}) {
  const id = item.id || '';
  if (item.laterEff?.f > 0 || /lamp|^gh$/.test(id)) return 'garden';
  if (item.eff?.o > 0 && item.eff?.w < 0 || id === 'oxy') return 'air';
  if (id === 'rec') return 'recycle';
  if (/miner/.test(id)) return 'ice';
  if (/heat/.test(id)) return 'heat';
  if (/radio/.test(id)) return 'radio';
  if (/charge/.test(id)) return 'battery';
  if (/wall|brace|fix/.test(id)) return 'shelter';
  if (/bike/.test(id)) return 'fitness';
  return 'science';
}

export function scienceStory(text = '') {
  const s = text.toLowerCase();
  if (/lettuce|plants|garden|veggie/.test(s)) return { kind: 'garden', title: 'Grow now. Eat later.', back: 'Plants need light, water, and time. Fresh food comes later.' };
  if (/bone|exercise|fitness/.test(s)) return { kind: 'fitness', title: 'Keep our crew strong', back: 'Exercise helps astronauts stay strong. The bike needs power too.' };
  if (/radiation|storm|particles|shelter/.test(s)) return { kind: 'shelter', title: 'A safer place to wait', back: 'Shelter helps protect our crew. Science may need to wait.' };
  if (/recycl|98%/.test(s)) return { kind: 'recycle', title: 'Use water again', back: 'A recycler cleans used water. It needs power to work.' };
  if (/delay|radio|communication/.test(s)) return { kind: 'radio', title: 'Hello, Earth!', back: 'Radio messages take time to travel. We practise making our own plans.' };
  if (/crater|ridge|landing|shackleton|home/.test(s)) return { kind: 'site', title: 'Sun or nearby ice?', back: 'Sun helps make power. Nearby ice can help supply water. Each place has a trade-off.' };
  if (/ice|mining/.test(s)) return { kind: 'ice', title: 'Bring home some ice', back: 'Getting ice takes power. We must leave power for the crew too.' };
  if (/dark|night|sunlight/.test(s)) return { kind: 'battery', title: 'Save power for the dark', back: 'Solar panels need sunlight. Stored power helps us through darkness.' };
  if (/oxygen|water/.test(s)) return { kind: 'air', title: 'Water can help make air', back: 'Our oxygen maker uses water and power. The crew needs those supplies too.' };
  return { kind: 'science', title: 'Think like a mission planner', back: 'Our supplies are limited. A helpful choice can leave less for something else.' };
}

export function mathPuzzle(round, on, total) {
  if (round.math === 'lamps') {
    const selected = (round.items || []).filter(it => on[it.id] && it.laterEff?.f > 0);
    const answer = selected.reduce((n, it) => n + it.cost, 0);
    return { question: 'How many cells do your plant lamps use?', expression: `${selected.map(it => it.cost).join(' + ') || '0'} = ?`, answer,
      cells: { total: answer, used: 0, label: `${answer} cells used by the selected plant lamps` }, explanation: `Your ${selected.length} plant lamps use ${answer} cells together.` };
  }
  const used = cellsUsed(round, on);
  return { question: 'How many battery cells are still free?', expression: `${total} − ${used} = ?`, answer: total - used,
    cells: { total, used }, explanation: `${total} cells, with ${used} used, leaves ${total - used} free.` };
}

export const PLAYTEST_TASKS = [
  { id: 'first-action', title: 'Make air in practice', prompt: 'Can you help our crew make some air?', observe: 'First useful action within one minute? Did they notice water and battery use?' },
  { id: 'flip', title: 'Explore a flashcard', prompt: 'What can you discover on this card?', observe: 'Can they find Flip, return to the picture, and move to the next card?' },
  { id: 'home', title: 'Choose a Moon home', prompt: 'Where would you build? Show me why.', observe: 'Can they name a benefit and a drawback without an adult telling them?' },
  { id: 'power', title: 'Share the battery', prompt: 'Can all the machines run at once?', observe: 'Do they notice the limit and turn something off? Record their explanation.' },
  { id: 'math', title: 'Count the free cells', prompt: 'Show me how you counted these cells.', observe: 'Can they use the picture? Do wrong answers feel safe? Record assistance.' },
  { id: 'harvest', title: 'Wait for food', prompt: 'When will these lamps help us?', observe: 'Do they distinguish lamp costs now from food later?' },
  { id: 'shelter', title: 'Try the shelter', prompt: 'Show me a safer place for everyone.', observe: 'Can all three move in untimed practice before the real countdown?' },
  { id: 'explain', title: 'Tell the mission story', prompt: 'Why can’t our astronauts do everything they want?', observe: 'Record their own words. Do they connect limited supplies to choices?' },
];
