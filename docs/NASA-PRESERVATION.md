# NASA source and formula audit

Baseline recorded before V4 changes. All src/data files, both pure rule engines, radio timing, original README, and balance tests are protected by SHA-256. UI citations are checked separately. No remote sources were changed or reinterpreted.

## Source-to-gameplay map

ratios.js defines TIERS ({"TINY":1,"SMALL":2,"MEDIUM":3,"LARGE":4,"HUGE":6}) and every R entry below. These are game points, not physical measurements, including entries whose relative size is NASA-informed. missions.js and mission1.js construct costs and effects from R. datasets.js is the dataset catalogue; radiation.js contains measured radiation comparisons; storms.js contains archived DONKI events, live requests and offline fallback. glossary.js preserves educational definitions. Original README contains the research narrative.

## Actual formulas

mission1Logic.m1Compute: start → site power/water → rover or panel trip effects → (on completed day) subtract machine power, add site recharge, daily consumption and machine effects → clamp. Power caps at MISSION1.maxPower; other meters cap at 10.

missionLogic.roundEffect: delayed harvest + selected machine/action/choice effects + daily drift. applyEff clamps each existing meter to 0–10. Battery budget = round cells/base + prior charge bonus ± site sunlight bonus (minimum 1); cellsUsed sums selected costs. harvestFor reads laterEff only at the specified harvestFrom round. Storm safety loss = shelter loss + rounded crew-weighted outside/wall increments; science uses actual work positions. Essential meters at zero and mustRunFail abort. Existing goal, carry-over, low-meter and star rules are unchanged. Storm countdown is supplied by the original DONKI adapter; Moon/Mars radio delays remain in radio.js.

## Radiation wording

The original internal key s / Shield is an abstract radiation safety budget. It is not consumed physical shielding and not a dose in grays. Walls and shelter remain equipment; exposure reduces the abstract budget. Original source text and ratios are retained verbatim in protected files.

## Every constant and its original attribution

- **oxygenDrain**: 2 (SMALL); nasa. About 0.82 kg of oxygen per astronaut per day. Water is about 3 times more, so Water drain is 3 times Oxygen drain. Sources: D1: NASA: Oxygen used by a crew member each day (HIDH table, “Total Per Day” row: 0.82 kg) https://www.nasa.gov/?p=841628
- **waterDrain**: 6 (HUGE); nasa. About 2.79 kg of drinking water per astronaut per day: about 3 times the oxygen. Sources: D2: NASA paper: Drinking water per crew member https://ntrs.nasa.gov/api/citations/20220002294/downloads/ICES-2022-388%20final%20for%20Strives.pdf
- **foodDrain**: 2 (SMALL); estimate. Our NASA sources give no food amount per day. Kept small so a garden can keep up with it. Sources: Game estimate; no measured value claimed.
- **fitnessDrain**: 1 (TINY); estimate. In weightlessness, astronauts lose about 1 to 1.5% of bone each month (P). Scientists are still studying how much Moon gravity (1/6 of Earth’s) slows this, so the amount is a game value. Sources: P: NASA: Risk of spaceflight-induced bone changes https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/
- **iceMinerPower**: 6 (HUGE); nasa. Ice mining is the biggest power user (60+ kW), more than the whole habitat (20–50 kW). Sources: B: NASA Glenn: Power and Energy for the Lunar Surface (2022 briefing) (original source has no URL)
- **roverTripPower**: 1 (TINY); nasa. A rover uses about 500 W, only 1–2.5% of the habitat’s 20–50 kW. Sources: B: NASA Glenn: Power and Energy for the Lunar Surface (2022 briefing) (original source has no URL)
- **oxyMakerPower**: 3 (MEDIUM); estimate. Life support is the top priority load (B), but NASA has not published its share of habitat power. Sources: B: NASA Glenn: Power and Energy for the Lunar Surface (2022 briefing) (original source has no URL)
- **waterRecyclerPower**: 2 (SMALL); estimate. Share of habitat power not published. Sources: Game estimate; no measured value claimed.
- **heaterPower**: 3 (MEDIUM); estimate. Share of habitat power not published. Sources: Game estimate; no measured value claimed.
- **plantLampPower**: 2 (SMALL); estimate. Plant lights need power (H). Exact amount not published. Sources: H: NASA: Space gardens https://www.nasa.gov/missions/station/iss-research/space-gardens/
- **sciencePower**: 3 (MEDIUM); estimate. Share of habitat power not published. Sources: Game estimate; no measured value claimed.
- **bikePower**: 2 (SMALL); estimate. NASA uses exercise to help keep bones strong in space (P). Power share not published. Sources: P: NASA: Risk of spaceflight-induced bone changes https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/
- **radioPower**: 1 (TINY); estimate. A Moon base splits power between life support, communications and science. NASA has not published the radio’s share. Sources: Game estimate; no measured value claimed.
- **shelterBracePower**: 2 (SMALL); estimate. Not a NASA number. Sources: Game estimate; no measured value claimed.
- **shelterFixPower**: 2 (SMALL); estimate. Not a NASA number. Sources: Game estimate; no measured value claimed.
- **wallPower**: 3 (MEDIUM); estimate. NASA is still testing regolith shelters (G). No power number yet. Sources: G: NASA: Radiation protection technology https://www.nasa.gov/radiation-protection/
- **chargePower**: 2 (SMALL); estimate. Not a NASA number. Sources: Game estimate; no measured value claimed.
- **chargeBonus**: 3 (MEDIUM); estimate. Storing daylight power for the dark is a real NASA challenge (B). Amount is a game value. Sources: B: NASA Glenn: Power and Energy for the Lunar Surface (2022 briefing) (original source has no URL)
- **panelTripPower**: 2 (SMALL); estimate. Not a NASA number. Sources: Game estimate; no measured value claimed.
- **panelRecharge**: 1 (TINY); estimate. Not a NASA number. Sources: Game estimate; no measured value claimed.
- **siteSunBonus**: 1 (TINY); estimate. NASA picks sunny rims for power (B). How much more power was not given. Sources: B: NASA Glenn: Power and Energy for the Lunar Surface (2022 briefing) (original source has no URL)
- **sunRechargeRidge**: 4 (LARGE); estimate. Sunny rims get more light (B). Amount not given. Sources: B: NASA Glenn: Power and Energy for the Lunar Surface (2022 briefing) (original source has no URL)
- **sunRechargeCrater**: 1 (TINY); estimate. Shady places get less light (B). Amount not given. Sources: B: NASA Glenn: Power and Energy for the Lunar Surface (2022 briefing) (original source has no URL)
- **oxyMakerOxygen**: 4 (LARGE); estimate. Not a NASA number. Sources: Game estimate; no measured value claimed.
- **oxyMakerWater**: 1 (TINY); estimate. The Space Station splits water to make oxygen (J), so it must cost water. The amount is simplified. Sources: J1: NASA: Life support on the Space Station https://www.nasa.gov/wp-content/uploads/2025/08/g-657270-59-hp-environmental-control-and-life-support-system-eclss.pdf
- **waterRecyclerWater**: 6 (HUGE); estimate. The Space Station recycles about 98% of its water (J), so the recycler gives back about what the crew drinks. Sources: J2: NASA: Recycling water on the Space Station https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/
- **iceMinerWater**: 6 (HUGE); estimate. Ice can be turned into water and oxygen (B). Amount not given. Sources: B: NASA Glenn: Power and Energy for the Lunar Surface (2022 briefing) (original source has no URL)
- **iceMinerOxygen**: 2 (SMALL); estimate. Ice can be split into hydrogen and oxygen (B). Amount not given. Sources: B: NASA Glenn: Power and Energy for the Lunar Surface (2022 briefing) (original source has no URL)
- **plantFood**: 2 (SMALL); estimate. A small garden adds fresh food but does not replace packed food. NASA gives no harvest amount. Sources: Game estimate; no measured value claimed.
- **plantWater**: 1 (TINY); estimate. Plants need water (H). Amount not given. Sources: H: NASA: Space gardens https://www.nasa.gov/missions/station/iss-research/space-gardens/
- **plantOxygen**: 1 (TINY); estimate. Plants make oxygen (H). Amount not given. Sources: H: NASA: Space gardens https://www.nasa.gov/missions/station/iss-research/space-gardens/
- **scienceGain**: 3 (MEDIUM); estimate. Score only. Sources: Game estimate; no measured value claimed.
- **bikeFitness**: 2 (SMALL); estimate. Exercise slows bone loss in space (P). The amount is a game value. Sources: P: NASA: Risk of spaceflight-induced bone changes https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/
- **iceTripWater**: 2 (SMALL); estimate. Not a NASA number. Sources: Game estimate; no measured value claimed.
- **stormOutside**: 4 (LARGE); nasa. Artemis I paper: for a big solar storm, the peak dose in Orion’s crew cabin was about 4 times the storm shelter’s (414 vs 95 µGy per minute). Worked out with a computer simulation of the huge October 1989 solar storm (not measured during the flight); inside a spacecraft, not on the Moon’s surface. Sources: K: NASA/DLR/ESA: Space radiation measurements during Artemis I (Nature, 2024) https://www.osti.gov/pages/servlets/purl/2447574
- **stormShelter**: 1 (TINY); nasa. The other half of the Artemis I 4-to-1 ratio: the shelter gets about a quarter of the cabin’s dose. Sources: K: NASA/DLR/ESA: Space radiation measurements during Artemis I (Nature, 2024) https://www.osti.gov/pages/servlets/purl/2447574
- **stormWall**: 2 (SMALL); estimate. NASA is testing regolith walls against radiation (G), but has no dose number yet. Kept between outside and shelter. Sources: G: NASA: Radiation protection technology https://www.nasa.gov/radiation-protection/
- **crewWorkScience**: 2 (SMALL); estimate. Score only. Outside is where the samples are, so it gives the most science. If nobody works, science goes down by a TINY amount. Sources: Game estimate; no measured value claimed.
- **crewWallScience**: 1 (TINY); estimate. Score only. Less than outside: the wall keeps the crew close to base, away from the best samples. Sources: Game estimate; no measured value claimed.
- **shelterBraceShield**: 1 (TINY); estimate. Thicker shelter walls block more radiation (G). The amount is a game value. Sources: G: NASA: Radiation protection technology https://www.nasa.gov/radiation-protection/
- **shelterFixShield**: 2 (SMALL); estimate. Not a NASA number. Sources: Game estimate; no measured value claimed.
- **moonwalkOxygen**: 2 (SMALL); estimate. Spacesuits carry their own oxygen from the base supply. NASA gives no amount we can use here. Sources: Game estimate; no measured value claimed.
- **moonwalkScience**: 3 (MEDIUM); estimate. Score only. Sources: Game estimate; no measured value claimed.
- **wallShield**: 3 (MEDIUM); estimate. NASA is testing this idea (G). Amount not given. Sources: G: NASA: Radiation protection technology https://www.nasa.gov/radiation-protection/
- **outdoorShield**: 1 (TINY); estimate. Time outside adds radiation. Amount not given. Sources: Game estimate; no measured value claimed.
- **plantDrinkWater**: 1 (TINY); estimate. Plants need water (H). Amount not given. Sources: H: NASA: Space gardens https://www.nasa.gov/missions/station/iss-research/space-gardens/
- **plantDrinkFood**: 1 (TINY); estimate. No NASA harvest amount. Sources: Game estimate; no measured value claimed.
- **plantWiltFood**: 1 (TINY); estimate. No NASA harvest amount. Sources: Game estimate; no measured value claimed.
- **tankOxygen**: 2 (SMALL); estimate. Not a NASA number. Sources: Game estimate; no measured value claimed.