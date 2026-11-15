// ============================================================
// Radio delay to Earth (the Mission Control lifeline).
//
// Explorer: 2.5 s there and back, light-speed only (CSA, source N).
// Commander: 6 s there and back, using the low end of NASA's expected
//   Moon delay of 3 to 14 s each way with all the relays (source O).
// The game clock keeps running while you wait, just like a real crew.
// ============================================================
import { CARDS } from '../data/missions.js';
import { addNotebookFact } from './storage.js';

export const radioDelayMs = (level) => (level === 'commander' ? 6000 : 2500);
export const radioSeconds = (level) => radioDelayMs(level) / 1000;

export const callingText = (level) =>
  `📡 Calling Earth… Your message is flying 384,400 km at the speed of light. Reply in about ${radioSeconds(level)} seconds. The clock keeps ticking!`;

export const replyText = (tip, level) => (level === 'mars'
  ? `Mission Control’s reply finally arrived: “${tip}” (Real Mars wait: 6 to 44 minutes.)`
  : `Mission Control (${radioSeconds(level)} s later): “${tip}” On Mars you would wait 6 to 44 minutes for this answer!`);

/** Mars: the real delay is 6 to 44 minutes. In the game the reply arrives after 25 s, after any storm is over. */
export const MARS_GAME_DELAY_MS = 25000;
export const marsCallingText = () => '📡 Calling Earth from Mars… A message and its reply take 6 to 44 minutes. The answer will come too late for this choice. You decide, Commander!';

export const saveDelayFact = () => addNotebookFact('radio-delay', CARDS.delay.title, CARDS.delay.real, CARDS.delay.links);
