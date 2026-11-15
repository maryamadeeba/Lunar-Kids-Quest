// ============================================================
// Every real dataset the game uses, what it is used for, and how
// (live, stored, or turned into a size ratio). Shown on the in-game
// "Real data we used" page and copied into the judges' sheet.
// ============================================================
import { SOURCES } from './ratios.js';

export const DATASETS = [
  {
    name: 'NASA DONKI (space weather database)', how: 'Live + stored',
    what: 'Three real solar particle storms from 2024. Their real alert and arrival times set the storm countdown in the Final. At the start of the Final, the game also asks DONKI live how many storms happened in the last 30 days.',
    where: 'Final Mission storm, Mars mode',
    links: [SOURCES.S, SOURCES.L],
  },
  {
    name: 'NASA OSDR RadLab (radiation readings)', how: 'Stored real readings',
    what: 'Real radiation readings in μGy per hour: the Space Station (April 2022), Curiosity on Mars (February 2023), NASA’s Lunar Reconnaissance Orbiter around the Moon before and during the February 2023 storm (about 7, then about 1,450), and inside Orion on the real Artemis I flight (about 17).',
    where: 'Radiation ruler, storm card, Mars mode',
    links: [SOURCES.M],
  },
  {
    name: 'Artemis I radiation measurements (NASA, DLR, ESA; Nature 2024)', how: 'NASA ratio',
    what: 'In a computer simulation of the huge October 1989 solar storm, Orion’s open cabin gets about 4 times the radiation of its storm shelter (414 vs 95 μGy per minute). This 4-to-1 ratio sets how much Shield is lost outside vs in the shelter.',
    where: 'Final storm, radiation ruler',
    links: [SOURCES.K],
  },
  {
    name: 'NASA Glenn: Power and Energy for the Lunar Surface', how: 'NASA ratio',
    what: 'Ice mining needs more power (60+ kilowatts) than the whole habitat (20–50 kilowatts); a rover only about half a kilowatt. Sunny crater rims are picked for power. Darkness at the pole can last about 100 hours.',
    where: 'Ice miner, rover, sites, dark spell',
    links: [SOURCES.B],
  },
  {
    name: 'NASA crew needs', how: 'NASA ratio',
    what: 'Each astronaut breathes about 0.82 kg of oxygen and drinks about 2.79 kg of water a day, so water drain is 3 times oxygen drain.',
    where: 'Every mission',
    links: [SOURCES.D1, SOURCES.D2],
  },
  {
    name: 'Space Station life support and water recycling', how: 'Fact card',
    what: 'Oxygen is made by splitting water, and about 98% of water is recycled.',
    where: 'Missions 1 and 2',
    links: [SOURCES.J1, SOURCES.J2],
  },
  {
    name: 'Artemis III landing regions + LRO photo of Shackleton Crater', how: 'Fact card + real photo',
    what: '9 candidate landing regions near the south pole; a real Lunar Reconnaissance Orbiter photo of Shackleton Crater, NASA’s target area.',
    where: 'Mission 1',
    links: [SOURCES.A, SOURCES.T],
  },
  {
    name: 'Space Station lettuce (Veggie seed film)', how: 'Fact + delayed harvest',
    what: 'Lettuce planted 4 January 2021 was picked 2 February 2021: about a month. So in the game, plant lamps give food a month later.',
    where: 'Mission 3',
    links: [SOURCES.I, SOURCES.H],
  },
  {
    name: 'NASA OSDR biology studies', how: 'Real findings',
    what: 'OSD-804: mice on the Space Station for 37 days lost bone in their weight-bearing legs, not their spines; mice that could climb on Earth kept their bone. OSD-267 to 269: Space Station lettuce was safe to eat, and an OSDR data analysis found it had about 30% less calcium and 25% less magnesium than Earth lettuce.',
    where: 'Mission 2 exercise bike, Mission 3 lettuce',
    links: [SOURCES.W, SOURCES.W2, SOURCES.X, SOURCES.X2],
  },
  {
    name: 'NASA bone loss research', how: 'Fact + estimate',
    what: 'In weightlessness, bones lose about 1 to 1.5% a month, and NASA uses exercise to help. Scientists are still studying how much Moon gravity helps, so the game’s Fitness numbers are estimates.',
    where: 'Mission 2 exercise bike',
    links: [SOURCES.P],
  },
  {
    name: 'Mars: Curiosity photo and the sol', how: 'Real photo + fact',
    what: 'A real Curiosity selfie from Gale Crater (January 2018). Mars Mode counts days in sols: a Mars day of about 24.6 hours.',
    where: 'Mars Mode',
    links: [SOURCES.V, SOURCES.U],
  },
  {
    name: 'Communication delay (CSA + NASA)', how: 'Real delay in the game',
    what: 'A Moon message and reply take about 2.5 seconds (3 to 14 seconds each way with relays). From Mars: 6 to 44 minutes. Mission Control’s answer really waits this long.',
    where: 'Mission Control button, Mars mode',
    links: [SOURCES.N, SOURCES.O],
  },
  {
    name: 'Canadian Space Agency: Eating in space', how: 'Fact card',
    what: '3 meals and 1 snack a day, 1,900 to 3,200 calories.',
    where: 'Mission 3',
    links: [SOURCES.Q],
  },
  {
    name: 'NASA radiation protection (Moon-dirt shelters)', how: 'Fact + estimate',
    what: 'Shelters of packed Moon dirt are still being tested, so the wall’s numbers are estimates.',
    where: 'Mission 1 wall, Final storm',
    links: [SOURCES.G],
  },
];
