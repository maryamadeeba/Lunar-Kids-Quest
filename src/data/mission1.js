// ============================================================
// Mission 1: Find Our Moon Home. The walk-around Moon base game.
// Costs and effects come from ratios.js. The only numbers here are
// balance values (site battery sizes, fresh-start meters, clock).
// ============================================================
import { R } from './ratios.js';
import { CARDS, MACHINES, ICONS } from './missions.js';

const P = (k) => R[k].points;

export const MISSION1 = {
  time: { explorer: 240, commander: 180 },
  essentials: ['o', 'w'],
  goal: { text: 'Finish the day with Water 5 or more', key: 'w', min: 5 },
  mate: 'amina',
  wrap: 'Every choice gave us something AND cost us something. That is called a trade-off. NASA engineers make them every day!',
  // Fresh start. Air tanks from Earth are nearly empty after landing;
  // Food is not tracked until Mission 3 (fewer meters for young players).
  start: { p: 5, o: 2, w: 5, s: 7 },
  maxPower: 12,
  sites: {
    ridge: { title: 'Sunny Ridge', p: 11, w: 2, sun: 5, ice: 1, gain: 'Lots of sun', cost: 'Ice is far away' },
    crater: { title: 'Crater Edge', p: 3, w: 8, sun: 2, ice: 5, gain: 'Ice close by', cost: 'Little sun' },
  },
  trip: {
    ridge: { title: 'Tap the blue ice to send the rover!', gain: `+${P('iceTripWater')} Water`, cost: `−${P('roverTripPower')} Power` },
    crater: { title: 'Tap the glowing spots to carry panels into the sun!', gain: `+${P('panelTripPower')} Power`, cost: `−${P('outdoorShield')} Shield` },
  },
  machines: [
    MACHINES.oxy(),
    MACHINES.rec(),
    MACHINES.miner(false),
    { id: 'wall', name: 'Build Moon-dirt wall', icon: ICONS.wall, color: '#E6E0FF', cost: P('wallPower'), eff: { s: P('wallShield') } },
  ],
  daily: { o: -P('oxygenDrain'), w: -P('waterDrain') },
  // Guiding questions (the ? button). The answers are in `tips` (Mission Control).
  ask: {
    scout: 'What does a Moon base need most: sunlight, ice, or both?',
    scan: 'This spot is strong at one thing. What is it missing?',
    fix: 'Which meter is low? What could you bring to fix it?',
    power: 'Which machines keep the crew alive? What fits in your battery?',
    math: 'Count only the yellow cells. Grey ones are being used.',
    dayStart: 'Ready? Press Start the day and watch what your choices do!',
    dayRun: 'Watch the base!',
    dayDone: 'Want 3 stars? Build where NASA would, keep every meter at 4 or more, and finish with Water 5 or more.',
  },
  tips: {
    scout: 'Visit both spots and compare the scans before you build!',
    scan: 'NASA picks sunny rims next to icy craters. Sunny Ridge + rover ice trips is the NASA plan.',
    fixridge: 'Send the rover for ice at least 2 times. The crew drinks lots of water every day!',
    fixcrater: 'Carry at least 2 panels into the sun so you have enough power.',
    power: 'Oxygen maker and Water recycler first. Then add the Ice miner or a Moon-dirt wall if they fit.',
    math: 'Count the yellow cells that are still free.',
    dayStart: 'You are ready. Start the day!',
  },
  nasa: {
    site: CARDS.sites,
    fix: CARDS.rim,
    power: CARDS.needs,
    miner: CARDS.miner,
    wall: CARDS.wall,
  },
};

export const APOLLO13 = {
  text: 'In 1970, an oxygen tank on Apollo 13 exploded on the way to the Moon. The crew had to skip their landing, and NASA brought all three astronauts home safely. NASA calls it a “successful failure” because of everything engineers learned.',
  link: { label: 'NASA: Apollo 13 mission details', href: 'https://www.nasa.gov/missions/apollo/apollo-13-mission-details/' },
};

// The four missions shown on the Moon Map, in order.
export const MISSION_LIST = [
  { key: 'm1', screen: 'briefing', kicker: 'MISSION 1', title: 'Find Our Moon Home', desc: 'Choose where to build. Sunny spots give power. Shady craters hide ice.', chips: [['Power', '#FFF4C2'], ['Water', '#D7F0FF'], ['Shield', '#E6E0FF']] },
  { key: 'm2', screen: 'mission2', kicker: 'MISSION 2', title: 'Save Our Oxygen', desc: 'Making air takes power and water. A long shadow is coming. What stays on?', chips: [['Oxygen', '#DDF3FF'], ['Power', '#FFF4C2'], ['Water', '#D7F0FF']] },
  { key: 'm3', screen: 'mission3', kicker: 'MISSION 3', title: 'Grow Food on the Moon', desc: 'Plant lamps need power. Plants need water. The crew eats every day.', chips: [['Food', '#C8F5C2'], ['Power', '#FFF4C2'], ['Water', '#D7F0FF']] },
  { key: 'final', screen: 'final', kicker: 'FINAL MISSION', title: 'A Moon Stay', desc: 'Run your whole base: sunny work, a solar storm, a long dark spell and sunrise.', chips: [['Oxygen', '#DDF3FF'], ['Food', '#C8F5C2'], ['Shield', '#E6E0FF']] },
];

export const SUITS = ['blue', 'purple', 'teal', 'coral'];
export const suitBust = (suit) => `/assets/cmd-${suit}.webp`;
export const suitWalk = (suit) => `/assets/walk-${suit}.webp`;
