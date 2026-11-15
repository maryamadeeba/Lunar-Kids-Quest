// ============================================================
// Every game number lives here.
//
// Each value is a SIZE TIER (how big it is compared with the others),
// not a real measurement. Each one says where its size comes from:
//   basis: 'nasa'     -> the size (or the ratio between two sizes)
//                         comes from a NASA source (see `src`)
//   basis: 'estimate' -> NASA has not published this number yet,
//                         so we picked a sensible relative size
//
// To use a real NASA number later: change the tier, set basis to 'nasa'
// and add the source. Missions read values as R.name.points.
// ============================================================

export const TIERS = { TINY: 1, SMALL: 2, MEDIUM: 3, LARGE: 4, HUGE: 6 };

export const SOURCES = {
  A: { label: 'NASA: Artemis III landing regions', href: 'https://www.nasa.gov/?p=748006' },
  B: { label: 'NASA Glenn: Power and Energy for the Lunar Surface (2022 briefing)', href: null },
  C: { label: 'NASA: Lunar surface technology', href: 'https://www.nasa.gov/lunar-surface-technology/' },
  D1: { label: 'NASA: Oxygen used by a crew member each day (HIDH table, “Total Per Day” row: 0.82 kg)', href: 'https://www.nasa.gov/?p=841628' },
  D2: { label: 'NASA paper: Drinking water per crew member', href: 'https://ntrs.nasa.gov/api/citations/20220002294/downloads/ICES-2022-388%20final%20for%20Strives.pdf' },
  E: { label: 'NASA: Solar storms and flares', href: 'https://science.nasa.gov/sun/solar-storms-and-flares/' },
  F: { label: 'NASA: Artemis II crew radiation research', href: 'https://www.nasa.gov/general/artemis-ii-crew-both-subjects-and-scientists-in-nasa-deep-space-research/' },
  G: { label: 'NASA: Radiation protection technology', href: 'https://www.nasa.gov/radiation-protection/' },
  H: { label: 'NASA: Space gardens', href: 'https://www.nasa.gov/missions/station/iss-research/space-gardens/' },
  I: { label: 'NASA: Seed film lettuce on the Space Station', href: 'https://www.nasa.gov/science-research/seed-film-brings-new-way-to-grow-plants-in-space/' },
  J1: { label: 'NASA: Life support on the Space Station', href: 'https://www.nasa.gov/wp-content/uploads/2025/08/g-657270-59-hp-environmental-control-and-life-support-system-eclss.pdf' },
  J2: { label: 'NASA: Recycling water on the Space Station', href: 'https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/' },
  K: { label: 'NASA/DLR/ESA: Space radiation measurements during Artemis I (Nature, 2024)', href: 'https://www.osti.gov/pages/servlets/purl/2447574' },
  L: { label: 'NASA DONKI: Solar particle event, 9 Feb 2024', href: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/SEP/29076/3' },
  M: { label: 'NASA OSDR RadLab: space radiation data', href: 'https://visualization.osdr.nasa.gov/radlab' },
  N: { label: 'Canadian Space Agency: distances and radio delay to the Moon and Mars', href: 'https://asc-csa.gc.ca/eng/multimedia/search/image/17245' },
  O: { label: 'NASA: Communication delay research for missions beyond low Earth orbit (2025)', href: 'https://ntrs.nasa.gov/citations/20250000703' },
  P: { label: 'NASA: Risk of spaceflight-induced bone changes', href: 'https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/' },
  Q: { label: 'Canadian Space Agency: Eating in space', href: 'https://www.asc-csa.gc.ca/eng/astronauts/living-in-space/eating-in-space.asp' },
  S: { label: 'NASA DONKI: space weather alerts and particle storms (live)', href: 'https://ccmc.gsfc.nasa.gov/DONKI/' },
  T: { label: 'NASA SVS: Shackleton Crater photographed by LRO’s camera (LROC)', href: 'https://svs.gsfc.nasa.gov/3634/' },
  W: { label: 'NASA OSDR study OSD-804: bone loss in mice after 37 days on the Space Station (Rodent Research-1)', href: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-804' },
  W2: { label: 'Paper: Cahill et al., PLOS ONE 2025 (uses OSD-804)', href: 'https://doi.org/10.1371/journal.pone.0317307' },
  X: { label: 'NASA OSDR studies OSD-267, 268, 269: lettuce grown in Veggie on the Space Station', href: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-267' },
  X2: { label: 'NASA: Citizen scientists study space salads (OSDR analysis)', href: 'https://science.nasa.gov/science-research/biological-physical-sciences/lettuce-find-healthy-space-food-citizen-scientists-study-space-salads/' },
  U: { label: 'NASA: Mars facts (a sol is about 24.6 hours)', href: 'https://science.nasa.gov/mars/facts/' },
  V: { label: 'NASA/JPL: Mount Sharp “photobombs” Curiosity (PIA22207)', href: 'https://www.jpl.nasa.gov/images/pia22207-mount-sharp-photobombs-curiosity/' },
};

const v = (group, label, tier, basis, why, src = []) => ({ group, label, tier, points: TIERS[tier], basis, why, src });

export const R = {
  // ---------- What the crew uses every day ----------
  oxygenDrain: v('Crew needs', 'Oxygen the crew breathes each day', 'SMALL', 'nasa',
    'About 0.82 kg of oxygen per astronaut per day. Water is about 3 times more, so Water drain is 3 times Oxygen drain.', ['D1']),
  waterDrain: v('Crew needs', 'Water the crew drinks each day', 'HUGE', 'nasa',
    'About 2.79 kg of drinking water per astronaut per day: about 3 times the oxygen.', ['D2']),
  foodDrain: v('Crew needs', 'Food the crew eats each day', 'SMALL', 'estimate',
    'Our NASA sources give no food amount per day. Kept small so a garden can keep up with it.'),
  fitnessDrain: v('Crew needs', 'Fitness lost each day without exercise', 'TINY', 'estimate',
    'In weightlessness, astronauts lose about 1 to 1.5% of bone each month (P). Scientists are still studying how much Moon gravity (1/6 of Earth\u2019s) slows this, so the amount is a game value.', ['P']),

  // ---------- Power (battery cells a machine uses) ----------
  iceMinerPower: v('Power', 'Ice miner', 'HUGE', 'nasa',
    'Ice mining is the biggest power user (60+ kW), more than the whole habitat (20–50 kW).', ['B']),
  roverTripPower: v('Power', 'One rover trip', 'TINY', 'nasa',
    'A rover uses about 500 W, only 1–2.5% of the habitat’s 20–50 kW.', ['B']),
  oxyMakerPower: v('Power', 'Oxygen maker', 'MEDIUM', 'estimate',
    'Life support is the top priority load (B), but NASA has not published its share of habitat power.', ['B']),
  waterRecyclerPower: v('Power', 'Water recycler', 'SMALL', 'estimate', 'Share of habitat power not published.'),
  heaterPower: v('Power', 'Heater', 'MEDIUM', 'estimate', 'Share of habitat power not published.'),
  plantLampPower: v('Power', 'One plant lamp / greenhouse', 'SMALL', 'estimate', 'Plant lights need power (H). Exact amount not published.', ['H']),
  sciencePower: v('Power', 'Science lab or drill', 'MEDIUM', 'estimate', 'Share of habitat power not published.'),
  bikePower: v('Power', 'Exercise bike', 'SMALL', 'estimate', 'NASA uses exercise to help keep bones strong in space (P). Power share not published.', ['P']),
  radioPower: v('Power', 'Radio to Earth', 'TINY', 'estimate', 'A Moon base splits power between life support, communications and science. NASA has not published the radio\u2019s share.'),
  shelterBracePower: v('Power', 'Reinforcing the storm shelter before a storm', 'SMALL', 'estimate', 'Not a NASA number.'),
  shelterFixPower: v('Power', 'Repairing the storm shelter', 'SMALL', 'estimate', 'Not a NASA number.'),
  wallPower: v('Power', 'Building a Moon-dirt wall', 'MEDIUM', 'estimate', 'NASA is still testing regolith shelters (G). No power number yet.', ['G']),
  chargePower: v('Power', 'Charging the night battery', 'SMALL', 'estimate', 'Not a NASA number.'),
  chargeBonus: v('Power', 'Extra cells saved for the dark', 'MEDIUM', 'estimate', 'Storing daylight power for the dark is a real NASA challenge (B). Amount is a game value.', ['B']),
  panelTripPower: v('Power', 'Cells from one extra solar panel', 'SMALL', 'estimate', 'Not a NASA number.'),
  panelRecharge: v('Power', 'Extra daily charge from each carried panel', 'TINY', 'estimate', 'Not a NASA number.'),
  siteSunBonus: v('Power', 'Extra / fewer cells from your site in sunlight', 'TINY', 'estimate',
    'NASA picks sunny rims for power (B). How much more power was not given.', ['B']),
  sunRechargeRidge: v('Power', 'Daily solar charge on the sunny rim', 'LARGE', 'estimate', 'Sunny rims get more light (B). Amount not given.', ['B']),
  sunRechargeCrater: v('Power', 'Daily solar charge at the shady crater edge', 'TINY', 'estimate', 'Shady places get less light (B). Amount not given.', ['B']),

  // ---------- What machines make ----------
  oxyMakerOxygen: v('Machines make', 'Oxygen from the oxygen maker', 'LARGE', 'estimate', 'Not a NASA number.'),
  oxyMakerWater: v('Machines make', 'Water used to make oxygen', 'TINY', 'estimate',
    'The Space Station splits water to make oxygen (J), so it must cost water. The amount is simplified.', ['J1']),
  waterRecyclerWater: v('Machines make', 'Water saved by the recycler', 'HUGE', 'estimate',
    'The Space Station recycles about 98% of its water (J), so the recycler gives back about what the crew drinks.', ['J2']),
  iceMinerWater: v('Machines make', 'Water from the ice miner', 'HUGE', 'estimate', 'Ice can be turned into water and oxygen (B). Amount not given.', ['B']),
  iceMinerOxygen: v('Machines make', 'Oxygen from the ice miner', 'SMALL', 'estimate', 'Ice can be split into hydrogen and oxygen (B). Amount not given.', ['B']),
  plantFood: v('Machines make', 'Food from one plant lamp / greenhouse', 'SMALL', 'estimate',
    'A small garden adds fresh food but does not replace packed food. NASA gives no harvest amount.'),
  plantWater: v('Machines make', 'Water one plant lamp uses', 'TINY', 'estimate', 'Plants need water (H). Amount not given.', ['H']),
  plantOxygen: v('Machines make', 'Oxygen plants give back', 'TINY', 'estimate', 'Plants make oxygen (H). Amount not given.', ['H']),
  scienceGain: v('Machines make', 'Science from the lab or drill', 'MEDIUM', 'estimate', 'Score only.'),
  bikeFitness: v('Machines make', 'Fitness from the exercise bike', 'SMALL', 'estimate', 'Exercise slows bone loss in space (P). The amount is a game value.', ['P']),
  iceTripWater: v('Machines make', 'Water from one rover ice trip', 'SMALL', 'estimate', 'Not a NASA number.'),

  // ---------- Radiation ----------
  stormOutside: v('Radiation', 'Shield lost if the whole crew stays outside in a solar storm', 'LARGE', 'nasa',
    'Artemis I paper: for a big solar storm, the peak dose in Orion\u2019s crew cabin was about 4 times the storm shelter\u2019s (414 vs 95 \u00b5Gy per minute). Worked out with a computer simulation of the huge October 1989 solar storm (not measured during the flight); inside a spacecraft, not on the Moon\u2019s surface.', ['K']),
  stormShelter: v('Radiation', 'Shield lost if the whole crew is in the shelter', 'TINY', 'nasa',
    'The other half of the Artemis I 4-to-1 ratio: the shelter gets about a quarter of the cabin\u2019s dose.', ['K']),
  stormWall: v('Radiation', 'Shield lost if the whole crew works behind a Moon-dirt wall', 'SMALL', 'estimate',
    'NASA is testing regolith walls against radiation (G), but has no dose number yet. Kept between outside and shelter.', ['G']),
  crewWorkScience: v('Choices', 'Science from each astronaut who keeps working OUTSIDE in the storm', 'SMALL', 'estimate', 'Score only. Outside is where the samples are, so it gives the most science. If nobody works, science goes down by a TINY amount.'),
  crewWallScience: v('Choices', 'Science from each astronaut working behind the Moon-dirt wall', 'TINY', 'estimate', 'Score only. Less than outside: the wall keeps the crew close to base, away from the best samples.'),
  shelterBraceShield: v('Radiation', 'Shield saved in the storm by a reinforced shelter', 'TINY', 'estimate', 'Thicker shelter walls block more radiation (G). The amount is a game value.', ['G']),
  shelterFixShield: v('Radiation', 'Shield restored by repairing the shelter', 'SMALL', 'estimate', 'Not a NASA number.'),
  moonwalkOxygen: v('Choices', 'Stored oxygen used by one Moonwalk', 'SMALL', 'estimate', 'Spacesuits carry their own oxygen from the base supply. NASA gives no amount we can use here.'),
  moonwalkScience: v('Choices', 'Science from one Moonwalk for samples', 'MEDIUM', 'estimate', 'Score only.'),
  wallShield: v('Radiation', 'Shield gained from a Moon-dirt wall', 'MEDIUM', 'estimate', 'NASA is testing this idea (G). Amount not given.', ['G']),
  outdoorShield: v('Radiation', 'Shield used by one extra trip outside', 'TINY', 'estimate', 'Time outside adds radiation. Amount not given.'),

  // ---------- Choices ----------
  plantDrinkWater: v('Choices', 'Water for each thirsty plant you water', 'TINY', 'estimate', 'Plants need water (H). Amount not given.', ['H']),
  plantDrinkFood: v('Choices', 'Extra food from each plant you water', 'TINY', 'estimate', 'No NASA harvest amount.'),
  plantWiltFood: v('Choices', 'Food lost if no plant gets water', 'TINY', 'estimate', 'No NASA harvest amount.'),

  // ---------- Base upgrades ----------
  tankOxygen: v('Base upgrades', 'Oxygen Tank: stored air buffer', 'SMALL', 'estimate', 'Not a NASA number.'),
};

/**
 * How far a meter can carry over between missions. These are balance limits,
 * not NASA values: they stop a mission from starting impossible or too easy.
 */
export const CARRY = { min: 3, max: 8 };
