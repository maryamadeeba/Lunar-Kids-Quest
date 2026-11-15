// ============================================================
// Side quests: optional add-ons around the main missions.
// Everything here READS the original game engine (missionLogic.js);
// nothing changes a rule, a number, official stars or the saved base.
// ============================================================
import { previewRound } from './learning.js';
import { readJSON, writeJSON } from './storage.js';

export const STRATEGY_KEY = 'lkq-strategies-v1';

/** The illustrated strategy cards a child can collect. */
export const STRATEGIES = {
  savedPower: { icon: '🔋', title: 'I saved power for darkness', hint: 'Charge the night battery on a sunny day.', text: 'Cells saved in sunshine became extra cells in the dark.' },
  reinforced: { icon: '🛡', title: 'I protected the shelter early', hint: 'Reinforce the shelter before a storm.', text: 'Protection cost power before the storm, and saved radiation safety during it.' },
  scienceFirst: { icon: '🔬', title: 'I chose science before the storm', hint: 'Power science instead of the shelter before a storm.', text: 'Science grew, but the shelter got no extra protection.' },
  shelteredAll: { icon: '🏠', title: 'I sheltered the whole crew', hint: 'Move everyone into the shelter during a storm.', text: 'The crew took the least radiation, and science paused.' },
  wallWork: { icon: '🧱', title: 'I worked safely behind the wall', hint: 'Keep working behind the Moon-dirt wall in a storm.', text: 'Some science continued with less radiation than outside.' },
  radioOn: { icon: '📡', title: 'I kept the radio on', hint: 'Power the Radio to Earth.', text: 'Talking to Earth used a cell that could have powered another machine.' },
  plantedLater: { icon: '🌱', title: 'I planted food for later', hint: 'Light plant lamps.', text: 'Water and power today became food a month later.' },
  bikeBones: { icon: '🚲', title: 'I exercised to keep bones strong', hint: 'Ride the exercise bike.', text: 'Exercise used power, and kept the crew fit.' },
  sunScan: { icon: '🔭', title: 'I checked the real Sun', hint: 'Tap the telescope during the Final or Mars Mode.', text: 'You looked at a real NASA space weather record.' },
  ghost: { icon: '👻', title: 'I compared two storm choices', hint: 'After a storm, tap “Try the other choice”.', text: 'The same start, two choices, two different results.' },
  rewind: { icon: '⏪', title: 'I learned from a plan that did not work', hint: 'Use the Engineer’s rewind after a tricky round.', text: 'You changed one thing and saw the difference.' },
  newDay: { icon: '🌗', title: 'I explored a new mission day', hint: 'Finish the Final, then explore a new mission day.', text: 'New conditions can need a new strategy.' },
};

export function readStrategies() {
  const d = readJSON(STRATEGY_KEY);
  return d && typeof d.found === 'object' && d.found ? d : { version: 1, found: {} };
}

/** Save (or refresh) a strategy with the child's actual before/after result. Returns true if it is new. */
export function recordStrategy(id, detail = {}) {
  if (!STRATEGIES[id]) return false;
  const d = readStrategies();
  const isNew = !d.found[id];
  d.found[id] = { ...detail, at: new Date().toISOString().slice(0, 10) };
  writeJSON(STRATEGY_KEY, { version: 1, found: d.found });
  return isNew;
}

/** Which strategies a finished round shows, from what the child actually picked. */
export function strategiesFor(round, pick = {}, items = []) {
  const ids = [];
  const has = (id) => items.some((it) => it.id === id) && !!pick[id];
  if (round.type === 'power') {
    if (has('charge')) ids.push('savedPower');
    if (has('brace')) ids.push('reinforced');
    if (items.some((it) => it.id === 'brace') && has('drill') && !pick.brace) ids.push('scienceFirst');
    if (has('radio')) ids.push('radioOn');
    if (items.some((it) => it.laterEff?.f > 0 && pick[it.id])) ids.push('plantedLater');
    if (has('bike')) ids.push('bikeBones');
  }
  if (round.action === 'storm') {
    if (!pick.out && !pick.wall) ids.push('shelteredAll');
    else if (!pick.out && pick.wall) ids.push('wallWork');
  }
  return ids;
}

/** "What if?": the other storm choice, worked out by the same rules from the same start. */
export function otherStormPick(pick, hasWall) {
  const sheltered = !pick.out && !pick.wall;
  if (!sheltered) return { out: 0, wall: 0, shelter: 3 };
  return hasWall ? { out: 0, wall: 3, shelter: 0 } : { out: 3, wall: 0, shelter: 0 };
}
export function ghostReplay(rounds, round, before, pick, ons, hasWall) {
  const other = otherStormPick(pick, hasWall);
  return {
    mine: { pick, after: previewRound(rounds, round, before, pick, ons) },
    other: { pick: other, after: previewRound(rounds, round, before, other, ons) },
  };
}
export const pickWords = (p) => [p.out && `${p.out} outside`, p.wall && `${p.wall} behind the wall`, p.shelter && `${p.shelter} in the shelter`].filter(Boolean).join(', ');

/** The telescope card: which real record, when it was checked, recent or archived. */
export function sunScanCard({ storm, live, checkedAt, mars = false }) {
  if (mars) {
    return {
      kind: 'archived', badge: 'Archived practice', date: '9 February 2024',
      title: 'A real Sun cloud heading for Mars',
      checked: 'Stored in the game from NASA DONKI (copied November 2026).',
      text: 'NASA’s computer models predicted that a giant cloud from the Sun, launched on 9 February 2024, would reach Mars about 2 days later.',
      link: { label: 'NASA DONKI: the 9 Feb 2024 Sun cloud', href: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/29066/-1' },
    };
  }
  if (!storm) return null;
  const recent = !!storm.live;
  const when = checkedAt ? checkedAt.toLocaleString('en-GB', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : null;
  const checked = live && live.ok && when
    ? `Checked live with NASA DONKI at ${when}.${!recent ? (live.count ? ' Today’s mission uses a stored storm.' : ' NASA found no particle storms in the last 30 days, so today you practise with a stored storm.') : ''}`
    : 'Stored in the game from NASA DONKI (copied November 2026). The live check was not available.';
  return {
    kind: recent ? 'recent' : 'archived', badge: recent ? 'Recent data' : 'Archived practice', date: storm.date,
    title: recent ? 'A storm NASA recorded this month' : storm.name,
    checked, text: `${storm.cause} The storm reached Earth, close to the Moon, ${storm.warnMin} minutes after the alert.`,
    link: (storm.links || [])[0] || { label: 'NASA DONKI', href: 'https://ccmc.gsfc.nasa.gov/DONKI/' },
  };
}
