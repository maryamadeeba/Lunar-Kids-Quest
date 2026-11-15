// ============================================================
// Mission data for Missions 2, 3 and the Final Mission ("A Moon Stay").
//
// A 'power' round: switch machines on within a battery budget.
// A 'choice' round: pick one plan (it can have a short countdown).
// Every round ends with a real NASA card (title, text, source links).
// 'essentials' must never reach 0 or the mission aborts.
// 'carry' meters start from where your base ended the last mission.
//
// No bare numbers for costs or effects: they all come from ratios.js.
// The only numbers here are balance values (battery size, mission clock,
// fresh-start meters), which are not claims about NASA.
// ============================================================
import { R, SOURCES } from './ratios.js';
import { STORM_FACTS } from './storms.js';

export const ICONS = {
  air: 'M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h6',
  filter: 'M4 5h16l-6 7v6l-4 2v-8z',
  lab: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7 15h10',
  call: 'M4 5h16v11H4zM9 20h6M12 16v4',
  plant: 'M12 21v-9M12 12c0-4 3-7 8-7 0 5-3 7-8 7zM12 15c0-3-2.5-5-7-5 0 4 2.5 5 7 5z',
  drop: 'M12 3c3.5 4.5 6 7.5 6 10.5a6 6 0 0 1-12 0C6 10.5 8.5 7.5 12 3z',
  recycle: 'M7 7h8l-2-3M17 17H9l2 3M5 10l-2 4h5M19 14l2-4h-5',
  drill: 'M12 3v12M8 15h8l-4 6zM8 7h8M8 11h8',
  battery: 'M3 8h16v8H3zM21 11v2M7 11v2M11 11v2',
  heat: 'M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.5 1 2 2 2 0-3 0-5 1-8z',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3z',
  shelter: 'M3 20a9 9 0 0 1 18 0zM10 20v-4h4v4',
  wall: 'M3 20h18M4 20v-5h6v5M10 20v-8h6v8M14 12V7h6v13',
  ice: 'M12 2l6 7-6 13-6-13zM6 9h12',
  bike: 'M5 18a3 3 0 1 0 0-.1M19 18a3 3 0 1 0 0-.1M5 18l4-8h6l4 8M9 10l3 8M12 6h3',
  walk: 'M13 4a2 2 0 1 0 0-.1M10 21l2-6 3 3v3M9 12l3-4 4 3 3 1M12 8l-3 9',
  tool: 'M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.5-8.5a4 4 0 0 0-2-2z',
};

/** Source links, shared with ratios.js so the two can never disagree. */
export const NASA_LINKS = {
  artemis: SOURCES.A,
  glenn: SOURCES.B,
  moonTech: SOURCES.C,
  oxygen: SOURCES.D1,
  drink: SOURCES.D2,
  storms: SOURCES.E,
  artemis2: SOURCES.F,
  radiation: SOURCES.G,
  gardens: SOURCES.H,
  seedfilm: SOURCES.I,
  eclss: SOURCES.J1,
  water: SOURCES.J2,
};

/** Real NASA cards. Only sourced facts (A–J in the README) go here. */
export const CARDS = {
  sites: {
    title: 'NASA is choosing too!',
    real: 'In 2022 NASA listed 13 possible landing areas near the Moon’s south pole. In 2024 it narrowed them to 9 regions for Artemis III. Engineers used maps from the Lunar Reconnaissance Orbiter to check the ground, the sunlight and how well astronauts can talk to Earth.',
    links: [NASA_LINKS.artemis],
  },
  rim: {
    title: 'NASA’s plan: sunny rim, icy crater',
    real: 'NASA’s main targets are the sunny rim and ridge of Shackleton Crater near the south pole. The plan is to dig ice in the dark crater, carry it up to the sunny rim, and turn it into water and air.',
    links: [NASA_LINKS.glenn, SOURCES.T],
    photo: true,
  },
  miner: {
    title: 'Digging ice uses more power than the whole habitat!',
    real: 'NASA expects ice mining to need more than 60 kilowatts of power. The whole habitat needs 20 to 50 kilowatts, and a rover only about half a kilowatt. That is why ice mining only runs in strong sunlight.',
    links: [NASA_LINKS.glenn],
  },
  needs: {
    title: 'What a crew needs every day',
    real: 'Each astronaut breathes about 0.82 kg of oxygen and drinks about 2.79 kg of water every day. That is about 3 times more water than oxygen!',
    links: [NASA_LINKS.oxygen, NASA_LINKS.drink],
  },
  wall: {
    title: 'A wall made of Moon dirt',
    real: 'NASA is testing shelters made of packed, strengthened Moon dirt. They could block radiation, heat and space rocks. This idea is still being tested. It is not used on the Moon yet.',
    links: [NASA_LINKS.radiation],
  },
  airFromWater: {
    title: 'Air is made from water!',
    real: 'On the Space Station, the oxygen system uses electricity to split water into hydrogen and oxygen. So making air costs power AND water!',
    links: [NASA_LINKS.eclss],
  },
  priority: {
    title: 'Life support comes first',
    real: 'When astronauts are at a Moon base, NASA gives top priority to the habitat and the power that keeps the crew alive. On the Space Station, about 98% of the water is recycled, so very little is wasted.',
    links: [NASA_LINKS.glenn, NASA_LINKS.water],
  },
  plants: {
    title: 'Plants are part of life support',
    real: 'Plants can make oxygen and take in carbon dioxide. Astronauts have grown lettuce, Chinese cabbage, mustard greens, kale, tomatoes, radishes and chile peppers in space!',
    links: [NASA_LINKS.gardens],
  },
  growTime: {
    title: 'Lettuce takes about a month',
    real: 'On the Space Station, astronaut Michael Hopkins planted red romaine lettuce on 4 January 2021 and picked it on 2 February 2021. That is about one month of care!',
    links: [NASA_LINKS.seedfilm],
  },
  storm: {
    title: 'A storm near the Moon, but not at Mars',
    real: 'In late February 2023, NASA\u2019s Lunar Reconnaissance Orbiter, circling the Moon, measured radiation jump from about 7 to about 1,450 \u03bcGy per hour: about 200 times more! On the same days, the Curiosity rover on Mars measured no jump at all: its readings stayed steady. Space weather is different in different places!',
    links: [SOURCES.M],
  },
  stormFacts: {
    title: 'Storms are hard to predict',
    real: `${STORM_FACTS.slow} ${STORM_FACTS.noStorm} That is why NASA watches the Sun all the time.`,
    links: [SOURCES.S],
  },
  delay: {
    title: 'Calling Earth takes time',
    real: 'Radio signals travel at the speed of light. A message to Earth and back from the Moon takes about 2.5 seconds. With all the computers in between, NASA expects Moon messages to take 3 to 14 seconds each way. From Mars, a reply takes 6 to 44 minutes, so Mars crews must solve problems on their own!',
    links: [SOURCES.N, SOURCES.O],
  },
  marsStorm: {
    title: 'The Sun cloud that went to Mars',
    real: 'On 9 February 2024 a giant cloud from the Sun missed Earth. NASA’s computer models predicted it would reach Mars on 11 or 12 February, about 2 days later. Mars crews will need storm alerts too, but their alerts come from Earth, 6 to 44 minutes late.',
    links: [{ label: 'NASA DONKI: the 9 Feb 2024 Sun cloud and its Mars forecast', href: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/29066/-1' }, SOURCES.N],
  },
  marsRadiation: {
    title: 'Radiation on Mars, measured every day',
    real: 'NASA’s Curiosity rover measures radiation on Mars. On calm days in February 2023 it read about 5 to 7 μGy per hour. In a computer simulation of the huge October 1989 solar storm, the open cabin of Orion was worked out at about 25,000 per hour. Shelters make a huge difference!',
    links: [SOURCES.M, SOURCES.K, SOURCES.V],
    photo: 'mars',
  },
  bones: {
    title: 'Use it or lose it: bones in space',
    real: 'NASA sent mice to the Space Station for 37 days (OSDR study OSD-804). They lost bone in their legs, the bones that carry weight on Earth, but not in their spines. Back on Earth, mice that could climb all day kept their bones strong. Astronauts lose about 1 to 1.5% of their bone each month, so NASA uses exercise to help. Scientists are still studying how much Moon gravity (1/6 of Earth\u2019s) helps protect bones.',
    links: [SOURCES.W, SOURCES.W2, SOURCES.P],
  },
  spaceLettuce: {
    title: 'Space lettuce: safe, but not enough',
    real: 'NASA grew red romaine lettuce in the Veggie garden on the Space Station and tested it (OSDR studies OSD-267 to OSD-269). It was safe to eat. But scientists who studied the data found that lettuce grown in space (on the Space Station and China\u2019s Tiangong II station) had about 30% less calcium and 25% less magnesium than Earth lettuce. So astronauts cannot live on space salad alone!',
    links: [SOURCES.X, SOURCES.X2],
  },
  food: {
    title: 'What astronauts eat',
    real: 'Space Station astronauts eat 3 meals and 1 snack every day: between 1,900 and 3,200 calories, depending on the astronaut. The Canadian Space Agency is learning how to grow healthy food for missions farther from Earth, like the Moon.',
    links: [SOURCES.Q],
  },
  shelter: {
    title: 'Shelters really work',
    real: 'NASA tested Orion\u2019s storm shelter on Artemis I. For a big solar storm, the crew cabin would get about 4 times more radiation than the shelter. Storm particles pass through the body, so real crews take shelter fast.',
    links: [SOURCES.K, NASA_LINKS.storms],
  },
  dark: {
    title: 'How long is a Moon night?',
    real: 'At the Moon’s south pole, darkness can last up to about 100 hours, about 4 Earth days. In other places a Moon night lasts nearly 15 Earth days! NASA plans 30-day stays for a crew of 4 during sunny times.',
    links: [NASA_LINKS.glenn, NASA_LINKS.moonTech],
  },
};

export const METERS = {
  p: { name: 'Power', color: '#FFD21F' },
  o: { name: 'Oxygen', color: '#B3E5FC' },
  w: { name: 'Water', color: '#4FC3F7' },
  f: { name: 'Food', color: '#43D13A' },
  c: { name: 'Science', color: '#FF8FB8' },
  m: { name: 'Fitness', color: '#B9A6FF' },
  s: { name: 'Shield', color: '#B9A6FF' },
  h: { name: 'Warmth', color: '#FF9F43' },
};

const P = (k) => R[k].points;

/** Machines shared by several missions. */
export const MACHINES = {
  oxy: () => ({ id: 'oxy', name: 'Oxygen maker', icon: ICONS.air, color: '#B3E5FC', cost: P('oxyMakerPower'), eff: { o: P('oxyMakerOxygen'), w: -P('oxyMakerWater') }, life: true }),
  rec: () => ({ id: 'rec', name: 'Water recycler', icon: ICONS.recycle, color: '#4FC3F7', cost: P('waterRecyclerPower'), eff: { w: P('waterRecyclerWater') }, life: true }),
  miner: (withOxygen) => ({ id: 'miner', name: 'Ice miner', icon: ICONS.ice, color: '#D7F0FF', cost: P('iceMinerPower'), eff: withOxygen ? { w: P('iceMinerWater'), o: P('iceMinerOxygen') } : { w: P('iceMinerWater') }, sunOnly: true }),
  lab: () => ({ id: 'lab', name: 'Science lab', icon: ICONS.lab, color: '#FF8FB8', cost: P('sciencePower'), eff: { c: P('scienceGain') } }),
  drill: () => ({ id: 'drill', name: 'Science drill', icon: ICONS.drill, color: '#FF8FB8', cost: P('sciencePower'), eff: { c: P('scienceGain') } }),
  bike: () => ({ id: 'bike', name: 'Exercise bike', icon: ICONS.bike, color: '#B9A6FF', cost: P('bikePower'), eff: { m: P('bikeFitness') } }),
  // Lettuce takes about a month (card growTime), so a lamp's food arrives in the NEXT round.
  lamp: (n) => ({ id: `lamp${n}`, name: `Plant lamp ${n}`, icon: ICONS.plant, color: '#43D13A', cost: P('plantLampPower'), eff: { w: -P('plantWater'), o: P('plantOxygen') }, laterEff: { f: P('plantFood') }, note: `+${P('plantFood')} Food in a month` }),
  moonwalk: () => ({ id: 'walk', name: 'Moonwalk for samples', icon: ICONS.walk, color: '#FFD9B8', cost: 0, eff: { c: P('moonwalkScience'), o: -P('moonwalkOxygen'), s: -P('outdoorShield') } }),
  radio: () => ({ id: 'radio', name: 'Radio to Earth', icon: ICONS.call, color: '#D7F0FF', cost: P('radioPower'), eff: {}, note: 'Needed to call Mission Control' }),
  // Reinforce BEFORE the storm: costs cells today, saves Shield when the storm hits (delayed effect).
  shelterBrace: () => ({ id: 'brace', name: 'Reinforce storm shelter', icon: ICONS.shelter, color: '#D7F0FF', cost: P('shelterBracePower'), eff: {}, laterEff: { s: P('shelterBraceShield') }, note: `+${P('shelterBraceShield')} Shield when the storm hits` }),
  shelterFix: () => ({ id: 'fix', name: 'Repair storm shelter', icon: ICONS.shelter, color: '#D7F0FF', cost: P('shelterFixPower'), eff: { s: P('shelterFixShield') } }),
  greenhouse: () => ({ id: 'gh', name: 'Greenhouse', icon: ICONS.plant, color: '#43D13A', cost: P('plantLampPower'), eff: { f: P('plantFood'), o: P('plantOxygen') }, requires: 'greenhouse' }),
  // No Warmth meter: in the dark the Heater simply MUST run, or the crew is too cold (mission abort).
  heater: () => ({ id: 'heat', name: 'Heater', icon: ICONS.heat, color: '#FF9F43', cost: P('heaterPower'), eff: {}, life: true, note: 'Keeps the crew warm. Must be on in the dark!' }),
  charge: () => ({ id: 'charge', name: 'Charge night battery', icon: ICONS.battery, color: '#FFD21F', cost: P('chargePower'), eff: {}, note: `+${P('chargeBonus')} cells in the dark` }),
};

const crewDay = (extra = {}) => ({ o: -P('oxygenDrain'), ...extra });

export const MISSION_2 = {
  key: 'm2', num: 2,
  title: 'Save Our Oxygen!', short: 'Mission 2 · Save Our Oxygen',
  badge: 'Power Planner', unlock: 'Oxygen Tank', unlockModule: 'tank', unlockNote: 'Extra air stored safely for the crew.',
  meters: ['o', 'w', 'c', 'm'], essentials: ['o', 'w'], carry: ['o', 'w'],
  time: { explorer: 160, commander: 120 },
  start: { o: 4, w: 6, c: 3, m: 5 },
  intro: {
    story: 'Making air takes power AND water. The crew also needs exercise to keep their bones strong. Sunny days come first, then a long shadow covers our panels.',
    goal: 'Keep the crew breathing and drinking safely. Use spare power wisely.',
    real: 'Pretend mission. Real NASA problem!',
  },
  goal: { text: 'Finish with Oxygen 8 or more', key: 'o', min: 8 },
  mate: 'amina',
  wrap: 'Life support first, then everything else. That is exactly how NASA plans power for a Moon base!',
  reportNasa: 'priority',
  rounds: [
    {
      type: 'power', title: 'Sunny days', scene: {}, cells: 12, math: 'left',
      msg: 'The Sun is up! Plenty of cells today. The crew breathes and drinks every day.',
      ask: 'Which machines give the crew air and water? Which machine can only work in sunshine?',
      tip: 'Oxygen maker and Water recycler first. The Ice miner only works in sunshine, so today is its chance! Ride the Exercise bike on one of the two days.',
      drift: crewDay({ w: -P('waterDrain'), m: -P('fitnessDrain') }),
      items: [MACHINES.oxy(), MACHINES.rec(), MACHINES.miner(true), MACHINES.lab(), MACHINES.bike(), MACHINES.radio()],
      nasa: CARDS.airFromWater, nasaIf: [{ item: 'miner', card: CARDS.miner }, { item: 'bike', card: CARDS.bones }],
    },
    {
      type: 'power', title: 'Long shadow', scene: { dark: true }, cells: 5, math: 'left',
      msg: 'A long shadow covers our panels. Only 5 cells! The Ice miner cannot work in the dark.',
      ask: 'With only a few cells, what does the crew need most to stay alive?',
      tip: 'Keep the Oxygen maker and Water recycler on. Science and exercise can wait for the Sun.',
      drift: crewDay({ w: -P('waterDrain'), m: -P('fitnessDrain') }),
      items: [MACHINES.oxy(), MACHINES.rec(), MACHINES.miner(true), MACHINES.lab(), MACHINES.bike(), MACHINES.radio()],
      nasa: CARDS.priority, nasaIf: { item: 'bike', card: CARDS.bones },
    },
  ],
};

export const MISSION_3 = {
  key: 'm3', num: 3,
  title: 'Grow Food on the Moon!', short: 'Mission 3 · Grow Food on the Moon',
  badge: 'Space Gardener', unlock: 'Greenhouse Dome', unlockModule: 'greenhouse', unlockNote: 'Fresh food for the whole crew.',
  meters: ['f', 'w', 'o'], essentials: ['o', 'w'], carry: ['f', 'w', 'o'],
  time: { explorer: 160, commander: 120 },
  start: { f: 5, w: 8, o: 5 },
  intro: {
    story: 'Zoya wants to grow fresh lettuce! Plant lamps need power and water TODAY, but the lettuce is only ready in about a month. Will your choice today feed the crew later?',
    goal: 'Grow food without running out of water or air.',
    real: 'Pretend mission. Real NASA problem!',
  },
  goal: { text: 'Grow at least 2 more Food than you started with', key: 'f', min: 2, grow: true },
  mate: 'zoya',
  wrap: 'Plants cost power and water today, but the food only comes a month later. A choice today changes tomorrow!',
  reportNasa: 'food',
  rounds: [
    {
      type: 'power', title: 'Planting day', scene: { plants: true }, cells: 10, math: 'lamps',
      msg: 'Time to plant! Each lamp uses cells and a little water now. Its food comes in about a month.',
      ask: 'How many plant lamps can you light and still keep air and water safe? How much food will the crew need next month?',
      tip: 'Oxygen maker and Water recycler first. Then light 1 or 2 plant lamps, not more.',
      drift: crewDay({ w: -P('waterDrain') }),
      items: [MACHINES.oxy(), MACHINES.rec(), MACHINES.lamp(1), MACHINES.lamp(2), MACHINES.lamp(3), MACHINES.radio()],
      nasa: CARDS.spaceLettuce,
    },
    {
      type: 'action', action: 'water', title: 'A month later', scene: { plants: true },
      msg: 'A month later! Your lamps have grown lettuce, and the crew is eating. But some plants look thirsty! Tap a plant to water it.',
      ask: 'Look at the Water meter. Is there enough water for the crew AND the plants?',
      tip: 'If Water is 5 or less, water only 1 plant. If Water is high, water 2 or 3.',
      harvestFrom: 0,
      drift: { f: -P('foodDrain') },
      nasa: CARDS.growTime,
    },
  ],
};

export const FINAL_MISSION = {
  key: 'final', num: 4,
  title: 'A Moon Stay', short: 'Final · A Moon Stay',
  badge: 'Junior Moon Commander', unlock: 'Complete Moon Base', unlockNote: 'Your crew’s home is finished. Shabash!',
  meters: ['o', 'f', 's', 'c'], essentials: ['o', 'f', 's'], carry: ['o', 'f', 's'],
  time: { explorer: 240, commander: 180 },
  start: { o: 5, f: 6, s: 7, c: 3 },
  intro: {
    story: 'Your graduation! Run your whole base through a Moon stay: sunny work, a REAL solar storm from NASA’s records, a long dark spell, then sunrise.',
    goal: 'Keep Oxygen, Food and Shield above 0, and the Heater on in the dark. Science wins the 3rd star.',
    real: 'Pretend mission. Real NASA problems!',
  },
  goal: { text: 'Finish with Science 6 or more', key: 'c', min: 6 },
  mate: 'bilal',
  wrap: 'You kept air, food and radiation safety in balance, and still did science. That is how real Moon crews will work!',
  reportNasa: 'shelter',
  rounds: [
    {
      type: 'power', title: 'Sunny work', scene: {}, cells: 7, math: 'left',
      msg: 'Good morning! The Sun is up. A long dark spell is coming later.',
      ask: 'What keeps the crew alive today? Is there anything you can save for the dark? A Moonwalk uses stored air: will you need it later?',
      tip: 'Oxygen maker and Greenhouse first. Charging the night battery gives you more cells in the dark.',
      drift: crewDay({ f: -P('foodDrain') }),
      items: [MACHINES.oxy(), MACHINES.greenhouse(), MACHINES.drill(), MACHINES.charge(), MACHINES.moonwalk(), MACHINES.shelterBrace(), MACHINES.radio()],
      nasa: CARDS.priority,
    },
    {
      type: 'action', action: 'storm', title: 'Solar storm!', scene: { storm: true }, countdown: 12,
      msg: 'Solar storm alert! Tap each astronaut to move them.',
      ask: 'Storm particles pass through the body. Where is the crew safest? How much science is worth the radiation?',
      tip: 'Move everyone into the shelter. If you built a Moon-dirt wall, crew behind it can do a little science with less radiation.',
      drift: {},
      // The real storm (title, alert, countdown, NASA card) is picked at play time from storms.js.
      realStorm: true,
      harvestFrom: 0, // a shelter reinforced in round 1 pays off here
      nasa: CARDS.storm, nasaByStorm: { allSafe: CARDS.shelter, usedWall: CARDS.wall },
    },
    {
      type: 'power', title: 'Long dark spell', scene: { night: true }, cellsBase: 6, math: 'left',
      bonus: { round: 0, item: 'charge', add: P('chargeBonus') },
      msg: 'The dark spell is here. It is freezing and there is no sunlight, only the battery.',
      ask: 'In the cold and dark, which machines keep the crew alive? Is food or a repaired shelter more important right now?',
      tip: 'Oxygen maker and Heater first. If you charged the battery, add the Greenhouse, or repair the shelter if the storm hurt your Shield.',
      drift: crewDay({ f: -P('foodDrain') }),
      mustRun: { item: 'heat', reason: 'h' },
      items: [MACHINES.oxy(), MACHINES.heater(), MACHINES.greenhouse(), MACHINES.shelterFix(), { ...MACHINES.lab(), name: 'Night science' }, MACHINES.radio()],
      nasa: CARDS.dark,
    },
    {
      type: 'power', title: 'Sunrise', scene: {}, cells: 7, math: 'left',
      msg: 'Sunrise! Light and warmth are back. One more day before your stay ends.',
      ask: 'The crew still breathes and eats today. What do they need?',
      tip: 'Oxygen maker and Greenhouse, then science with the cells that are left.',
      drift: crewDay({ f: -P('foodDrain') }),
      items: [MACHINES.oxy(), MACHINES.greenhouse(), MACHINES.drill(), MACHINES.radio()],
      nasa: CARDS.stormFacts,
    },
  ],
};

// ---------- Replay variety ----------
// The Final's dark spell changes between plays. Both lengths are real (card `dark`):
// up to about 100 hours at the south pole, or a full Moon night of nearly 15 Earth days.
export const DARK_VARIANTS = [
  { id: 'pole', title: 'Long dark spell', label: 'South-pole dark spell (about 4 Earth days)', cellsBase: 6,
    msg: 'The dark spell is here: about 4 Earth days with no sunlight. Only the battery is left.' },
  { id: 'night', title: 'Long Moon night', label: 'Full Moon night (nearly 15 Earth days)', cellsBase: 5,
    msg: 'A full Moon night: nearly 15 Earth days of dark and cold! Only the battery is left. Did you charge it?' },
];
/** The Final with a chosen dark spell. */
export function finalWithDark(v) {
  const rounds = FINAL_MISSION.rounds.map((rd) => (rd.mustRun ? { ...rd, title: v.title, msg: v.msg, cellsBase: v.cellsBase } : rd));
  return { ...FINAL_MISSION, rounds, darkVariant: v.id, darkLabel: v.label };
}

/** "Try a different way" ideas shown after a 3-star win (replay without punishment). */
MISSION_2.challenges = ['Win 3 stars without the Ice miner', 'Win 3 stars riding the bike on BOTH days'];
MISSION_3.challenges = ['Win 3 stars lighting only ONE plant lamp', 'Win 3 stars watering 2 thirsty plants'];
FINAL_MISSION.challenges = ['Win 3 stars with a Moonwalk', 'Win 3 stars and repair the shelter in the dark', 'Play again for a different real storm and dark spell'];

// ---------- Mars mode (unlocks after the Final) ----------
// Same base skills, but Mission Control is 6 to 44 minutes away (CSA, source N),
// so the radio reply only arrives after the storm is over. Kids decide alone.
export const MARS_MISSION = {
  key: 'mars', num: 5, mars: true,
  title: 'Mars Mode: On Your Own', short: 'Mars Mode · On Your Own',
  badge: 'Mars Ready Commander', unlock: 'Mars Mode badge', unlockNote: 'You can decide without Mission Control.',
  meters: ['o', 'f', 's', 'c'], essentials: ['o', 'f', 's'], carry: [],
  time: { explorer: 200, commander: 150 },
  start: { o: 5, f: 6, s: 7, c: 3 },
  intro: {
    story: 'Your base is on Mars now. A day on Mars is called a sol, and it is a little longer than an Earth day. Radio messages to Earth take 6 to 44 minutes, so Mission Control cannot help you in a hurry. A storm is coming. You decide!',
    goal: 'Keep Oxygen, Food and Shield above 0, and the Heater on at night. Science wins the 3rd star.',
    real: 'Pretend mission. Real NASA delay!',
  },
  goal: { text: 'Finish with Science 6 or more', key: 'c', min: 6 },
  mate: 'bilal',
  wrap: 'On Mars, help from Earth arrives late. Real Mars crews will practise making safe choices on their own, just like you did!',
  reportNasa: 'marsRadiation',
  challenges: ['Win 3 stars without calling Mission Control', 'Win 3 stars with a Marswalk'],
  rounds: [
    {
      type: 'power', title: 'Sol 1: dusty day', scene: {}, cells: 7, math: 'left',
      msg: 'Good morning, Mars! It is Sol 1. The Sun is weaker here, and a storm alert may come later. A cold night is coming too.',
      ask: 'What keeps the crew alive? What should you save for the night?',
      tip: 'Oxygen maker and Greenhouse first. Charging the battery helps at night.',
      drift: crewDay({ f: -P('foodDrain') }),
      items: [MACHINES.oxy(), MACHINES.greenhouse(), MACHINES.drill(), MACHINES.charge(), { ...MACHINES.moonwalk(), name: 'Marswalk for samples' }, MACHINES.shelterBrace(), MACHINES.radio()],
      nasa: CARDS.delay,
    },
    {
      type: 'action', action: 'storm', title: 'Sol 1: storm!', scene: { storm: true }, countdown: 10,
      harvestFrom: 0,
      msg: 'NASA’s model says a giant cloud from the Sun is heading to Mars! Mission Control is too far away to help in time. Move the crew!',
      ask: 'Nobody on Earth can answer fast enough. Where is the crew safest?',
      tip: 'Move everyone into the shelter. Science can wait until the storm passes.',
      drift: {},
      nasa: CARDS.marsStorm, nasaByStorm: { allSafe: CARDS.marsStorm, usedWall: CARDS.marsStorm },
    },
    {
      type: 'power', title: 'Sol 1: freezing night', scene: { night: true }, cellsBase: 6, math: 'left',
      bonus: { round: 0, item: 'charge', add: P('chargeBonus') },
      msg: 'Night on Sol 1 is freezing. No sunlight, only the battery.',
      ask: 'Which machines keep the crew alive tonight?',
      tip: 'Oxygen maker and Heater first. If you charged the battery, add the Greenhouse or repair the shelter.',
      drift: crewDay({ f: -P('foodDrain') }),
      mustRun: { item: 'heat', reason: 'h' },
      items: [MACHINES.oxy(), MACHINES.heater(), MACHINES.greenhouse(), MACHINES.shelterFix(), { ...MACHINES.lab(), name: 'Night science' }, MACHINES.radio()],
      nasa: CARDS.marsRadiation,
    },
  ],
};

export const ENGINE_MISSIONS = { mission2: MISSION_2, mission3: MISSION_3, final: FINAL_MISSION };
