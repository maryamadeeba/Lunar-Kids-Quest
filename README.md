# 🌙 Lunar Kids Quest

**Little Astronauts. Big Decisions.**

A Moon-base game where children aged 7–12 become junior astronauts. They share one battery between air, water, food, the radio to Earth and science; hide their crew from a real NASA solar storm; and survive the long, freezing Moon night. Along the way they discover the idea behind every real space mission: **every choice is a trade-off.**

Built for the **NASA International Space Apps Challenge 2026**, challenge *"Build a Junior Astronaut Mission Trainer"*.

▶ **Play it:** ADD-YOUR-VERCEL-LINK-HERE (works in any modern browser, on a phone, tablet, laptop or classroom projector; no sign-up)

---

## How it answers the challenge

| The challenge asks for… | In Lunar Kids Quest |
|---|---|
| Mission scenarios a junior astronaut must manage | Five missions on one Moon base: choosing a home, making air, growing food, a real solar storm and a Moon night, then Mars |
| Trade-offs between life support, communications and science | Every power round shares one battery between life-support machines, a “Radio to Earth” and science equipment. Choose one and you can’t power another |
| Clear consequences of decisions | After each choice, the child sees exactly what went up (green) and what went down (red), then a NASA card explaining how real engineers face the same problem |
| Real NASA data | Live NASA DONKI space-weather check, three real 2024 solar storms, NASA life-support ratios, OSDR RadLab radiation readings, OSDR biology studies and real NASA photos, each with a link to its source |
| Suitable for young learners | Two age levels, read-aloud, tap-to-explain words, picture flashcards, simple word choices and a kind “mission abort” that teaches instead of punishes |

## How to play

Pick a nickname, a suit colour and a level (**Explorer**, ages 7–9, or **Commander**, ages 10–12), meet the crew (Amina the engineer, Bilal the scientist and Zoya the botanist) and Chandu the robot guide, then follow the Moon Map.

1. **Mission 1 · Find Our Moon Home:** walk to a sunny ridge or an icy crater, build the base, then send the rover for ice or carry solar panels. NASA’s real plan (sunny rim plus ice from the crater) earns 3 stars.
2. **Mission 2 · Save Our Oxygen:** make air from water, recycle water and keep the crew fit, all from one battery.
3. **Mission 3 · Grow Food on the Moon:** plant lamps cost water and power today, but the lettuce only arrives a month later.
4. **Final · A Moon Stay:** a sunny work day, a **real NASA solar storm** with a countdown from its real warning time, a long dark spell and sunrise.
5. **Bonus · Mars Mode:** Mission Control is 6 to 44 minutes away, so its help arrives too late. Kids decide alone.

**The base grows with the child:** the site, the Moon-dirt wall, the Oxygen Tank and the Greenhouse built in one mission carry into the next.

**Kids do things, they don’t answer quizzes.** They switch machines on within the battery, walk the commander, move each astronaut to safety in the storm and water thirsty plants one by one. Before a choice, each option says simply what it does (“Adds Air”, “Drains Water”). The numbers and the trade-off appear after the choice, so the result is the lesson.

### Side quests (optional)

Open the **🧭 Side quests** button on the Moon Map to see where each one is. None of them change stars or the saved base.

- ☀️ **Scan the Sun:** tap the telescope to see the real NASA record behind today’s storm, when it was checked, and whether it is recent or archived.
- 🛡️ **Shelter versus science:** before the storm, choose between reinforcing the shelter and powering the science drill.
- 👻 **What if? Try the other choice:** after the storm, see your plan beside the other choice from the same start.
- 🌗 **New mission day:** replay the Final with another real storm and a different darkness.
- ⏪ **Engineer’s rewind:** after a tricky round, go back to the decision, change one thing and see the difference.
- 📒 **My Strategy Collection:** illustrated cards like “I saved power for darkness”, each holding the child’s real before-and-after result.

## Designed for children aged 7–12

- **Two levels:** Explorer gets more time, a battery-counting puzzle and gentle highlights after a mistake. Commander gets less time and no highlights.
- **At most three meters plus a score** per mission, so young players never track too much at once.
- **Read-aloud** on Chandu’s messages, briefings and NASA cards (the device’s own voice: works offline, sends nothing).
- **Tap-to-explain words** such as radiation, solar flare, life support and Moon dirt.
- **Flashcards with a Skip button:** briefings, NASA cards and the Base Report are picture cards that flip for the story. Children can skip any time, and the full written report is available to view or download at the end.
- **Kind failure:** if life support runs out, the crew is safe, the child hears the real Apollo 13 story and can try again.
- **Hints, not answers:** the **?** button asks a guiding question; Mission Control gives the answer (once per mission, after a real radio delay).
- **Accessible:** large text, big buttons, keyboard and screen-reader support, reduced-motion support, checked with automated accessibility tests (axe-core) on every screen.
- **Local touches** for children in Pakistan: storm times shown in Pakistan time, Urdu greetings like “Salam” and “Shabash”.

## Real NASA data

- **Live space weather:** at the start of the Final the game asks NASA’s DONKI service for particle storms in the last 30 days. If NASA recorded one, the child plays that storm. If not, or if the check fails, the game uses its stored storms.
- **Three real 2024 solar storms** from DONKI (9 Feb X3.3, 29 Jan M6.8 and a 12 Feb storm with no flare). The countdown is the real time between NASA’s alert and the storm reaching Earth.
- **Life-support ratios:** a crew member needs about 3 times more drinking water than oxygen each day; ice mining needs more power than the whole habitat.
- **Radiation:** the 4-to-1 cabin-versus-shelter ratio from the Artemis I paper, and a “real radiation ruler” built from NASA OSDR RadLab readings (Space Station, Moon orbit, Orion and Curiosity on Mars).
- **Biology from NASA OSDR:** bone loss in mice on the Space Station (OSD-804) and space-grown lettuce (OSD-267 to 269).
- **Real photos:** Shackleton Crater from NASA’s Lunar Reconnaissance Orbiter and Curiosity’s selfie on Mars.
- **Honest numbers:** game points are simplified sizes. Each one is marked as a NASA ratio or an estimate, and children can open “How we made the numbers” in the game. Every value is listed below.

## Privacy and safety

- No accounts, ads, purchases, chat or leaderboards.
- Only a nickname is saved, in the browser on that device.
- The only network requests go to NASA (the DONKI check, with a date range only, and the NASA photos). Nothing about the child is sent.
- Sounds only play after a tap, with a mute button on the Moon Map.

## For teachers and parents

The **“For grown-ups and teachers”** page (on the Moon Map) explains what each mission teaches, how to use the game in class and three discussion questions. The **“Real NASA data we used”** page lists every dataset with links.

## Credits and AI use

- Game design, writing and development: Maryam.
- NASA data and images: see the sources below. Images are credited to NASA/GSFC/Arizona State University (LROC) and NASA/JPL-Caltech/MSSS (Curiosity).
- The crew and commander character images are AI-generated and carry a visible “AI-generated” label.
- No NASA logo is used. This is a NASA Space Apps Challenge project, not an official NASA product.

## For developers

Built with React 19 and Vite 7. No backend.

```bash
npm install
npm run dev      # play locally at the address it prints
npm test         # science-data checks, side quests, visual learning and game balance
npm run build    # production build in dist/
```

- `src/data/` holds every number, mission and NASA source (`ratios.js` is the single source of game values).
- `src/lib/missionLogic.js` holds the game rules; the side quests only read it.
- `scripts/balance-test.mjs` plays every possible strategy in every mission to check that each one can be won and that the 3-star plans keep the crew safe.
- An optional NASA API key can be set as `VITE_NASA_API_KEY`; without one the game uses NASA’s `DEMO_KEY`.

## Game values: NASA ratios and estimates

Generated from `src/data/ratios.js`. Letters refer to the sources below.

| Game value | Size | Points | Basis | Why |
|---|---|---|---|---|
| Oxygen the crew breathes each day | SMALL | 2 | **NASA ratio** (D1) | About 0.82 kg of oxygen per astronaut per day. Water is about 3 times more, so Water drain is 3 times Oxygen drain. |
| Water the crew drinks each day | HUGE | 6 | **NASA ratio** (D2) | About 2.79 kg of drinking water per astronaut per day: about 3 times the oxygen. |
| Food the crew eats each day | SMALL | 2 | Estimate | Our NASA sources give no food amount per day. Kept small so a garden can keep up with it. |
| Fitness lost each day without exercise | TINY | 1 | Estimate (P) | In weightlessness, astronauts lose about 1 to 1.5% of bone each month (P). Scientists are still studying how much Moon gravity (1/6 of Earth’s) slows this, so the amount is a game value. |
| Ice miner | HUGE | 6 | **NASA ratio** (B) | Ice mining is the biggest power user (60+ kW), more than the whole habitat (20–50 kW). |
| One rover trip | TINY | 1 | **NASA ratio** (B) | A rover uses about 500 W, only 1–2.5% of the habitat’s 20–50 kW. |
| Oxygen maker | MEDIUM | 3 | Estimate (B) | Life support is the top priority load (B), but NASA has not published its share of habitat power. |
| Water recycler | SMALL | 2 | Estimate | Share of habitat power not published. |
| Heater | MEDIUM | 3 | Estimate | Share of habitat power not published. |
| One plant lamp / greenhouse | SMALL | 2 | Estimate (H) | Plant lights need power (H). Exact amount not published. |
| Science lab or drill | MEDIUM | 3 | Estimate | Share of habitat power not published. |
| Exercise bike | SMALL | 2 | Estimate (P) | NASA uses exercise to help keep bones strong in space (P). Power share not published. |
| Radio to Earth | TINY | 1 | Estimate | A Moon base splits power between life support, communications and science. NASA has not published the radio’s share. |
| Reinforcing the storm shelter before a storm | SMALL | 2 | Estimate | Not a NASA number. |
| Repairing the storm shelter | SMALL | 2 | Estimate | Not a NASA number. |
| Building a Moon-dirt wall | MEDIUM | 3 | Estimate (G) | NASA is still testing regolith shelters (G). No power number yet. |
| Charging the night battery | SMALL | 2 | Estimate | Not a NASA number. |
| Extra cells saved for the dark | MEDIUM | 3 | Estimate (B) | Storing daylight power for the dark is a real NASA challenge (B). Amount is a game value. |
| Cells from one extra solar panel | SMALL | 2 | Estimate | Not a NASA number. |
| Extra daily charge from each carried panel | TINY | 1 | Estimate | Not a NASA number. |
| Extra / fewer cells from your site in sunlight | TINY | 1 | Estimate (B) | NASA picks sunny rims for power (B). How much more power was not given. |
| Daily solar charge on the sunny rim | LARGE | 4 | Estimate (B) | Sunny rims get more light (B). Amount not given. |
| Daily solar charge at the shady crater edge | TINY | 1 | Estimate (B) | Shady places get less light (B). Amount not given. |
| Oxygen from the oxygen maker | LARGE | 4 | Estimate | Not a NASA number. |
| Water used to make oxygen | TINY | 1 | Estimate (J1) | The Space Station splits water to make oxygen (J), so it must cost water. The amount is simplified. |
| Water saved by the recycler | HUGE | 6 | Estimate (J2) | The Space Station recycles about 98% of its water (J), so the recycler gives back about what the crew drinks. |
| Water from the ice miner | HUGE | 6 | Estimate (B) | Ice can be turned into water and oxygen (B). Amount not given. |
| Oxygen from the ice miner | SMALL | 2 | Estimate (B) | Ice can be split into hydrogen and oxygen (B). Amount not given. |
| Food from one plant lamp / greenhouse | SMALL | 2 | Estimate | A small garden adds fresh food but does not replace packed food. NASA gives no harvest amount. |
| Water one plant lamp uses | TINY | 1 | Estimate (H) | Plants need water (H). Amount not given. |
| Oxygen plants give back | TINY | 1 | Estimate (H) | Plants make oxygen (H). Amount not given. |
| Science from the lab or drill | MEDIUM | 3 | Estimate | Score only. |
| Fitness from the exercise bike | SMALL | 2 | Estimate (P) | Exercise slows bone loss in space (P). The amount is a game value. |
| Water from one rover ice trip | SMALL | 2 | Estimate | Not a NASA number. |
| Shield lost if the whole crew stays outside in a solar storm | LARGE | 4 | **NASA ratio** (K) | Artemis I paper: for a big solar storm, the peak dose in Orion’s crew cabin was about 4 times the storm shelter’s (414 vs 95 µGy per minute). Worked out with a computer simulation of the huge October 1989 solar storm (not measured during the flight); inside a spacecraft, not on the Moon’s surface. |
| Shield lost if the whole crew is in the shelter | TINY | 1 | **NASA ratio** (K) | The other half of the Artemis I 4-to-1 ratio: the shelter gets about a quarter of the cabin’s dose. |
| Shield lost if the whole crew works behind a Moon-dirt wall | SMALL | 2 | Estimate (G) | NASA is testing regolith walls against radiation (G), but has no dose number yet. Kept between outside and shelter. |
| Science from each astronaut who keeps working OUTSIDE in the storm | SMALL | 2 | Estimate | Score only. Outside is where the samples are, so it gives the most science. If nobody works, science goes down by a TINY amount. |
| Science from each astronaut working behind the Moon-dirt wall | TINY | 1 | Estimate | Score only. Less than outside: the wall keeps the crew close to base, away from the best samples. |
| Shield saved in the storm by a reinforced shelter | TINY | 1 | Estimate (G) | Thicker shelter walls block more radiation (G). The amount is a game value. |
| Shield restored by repairing the shelter | SMALL | 2 | Estimate | Not a NASA number. |
| Stored oxygen used by one Moonwalk | SMALL | 2 | Estimate | Spacesuits carry their own oxygen from the base supply. NASA gives no amount we can use here. |
| Science from one Moonwalk for samples | MEDIUM | 3 | Estimate | Score only. |
| Shield gained from a Moon-dirt wall | MEDIUM | 3 | Estimate (G) | NASA is testing this idea (G). Amount not given. |
| Shield used by one extra trip outside | TINY | 1 | Estimate | Time outside adds radiation. Amount not given. |
| Water for each thirsty plant you water | TINY | 1 | Estimate (H) | Plants need water (H). Amount not given. |
| Extra food from each plant you water | TINY | 1 | Estimate | No NASA harvest amount. |
| Food lost if no plant gets water | TINY | 1 | Estimate | No NASA harvest amount. |
| Oxygen Tank: stored air buffer | SMALL | 2 | Estimate | Not a NASA number. |

**Still needs NASA numbers** (kept as estimates until a source is found):
- human radiation dose on the lunar surface and inside a shelter (the 4-to-1 storm ratio comes from Artemis I *inside Orion*, not the Moon's surface; the RadLab Moon-surface query for 24–28 Feb 2023 returned no rows);
- how much Moon gravity slows bone loss (NASA: unknown);
- Veggie-type harvest per crew member;
- how the habitat's 20–50 kW is split between life support, heaters and plant lamps.

**Known limits:** the full Moon night on the shady Crater Edge has only one 3-star plan (the hardest case, on purpose). RadLab has no readings from the Moon's surface; the ruler uses lunar orbit (LRO CRaTER) instead. CRaTER readings stop from 26 Feb 04:00 to 27 Feb 01:00 UTC 2023, so the storm's true peak may have been higher than 1,453. In Mission 3 the Oxygen Tank buffer means switching the oxygen maker off for one day cannot empty the air. It costs the round star, caps the mission at 2 stars and turns the meter pink instead.

## NASA sources used in the game

- **A.** Artemis III landing regions (13 areas in 2022 → 9 regions in 2024): https://www.nasa.gov/?p=748006
- **B.** NASA Glenn, *Power and Energy for the Lunar Surface* (Csank & Scott, 2022 ARPA-E briefing). Habitat 20–50 kW, ice mining 60+ kW, rovers 500 W, south-pole darkness up to about 100 hours, Shackleton rim/ridge targets, life-support power priority. (Briefing PDF; web link to be added.)
- **C.** Lunar surface technology (Moon days and nights each nearly 15 Earth days): https://www.nasa.gov/lunar-surface-technology/
- **D1.** Oxygen per crew member per day (about 0.82 kg): https://www.nasa.gov/?p=841628
- **D2.** Drinking water per crew member per day (about 2.79 kg, from NASA's Life Support BVAD): https://ntrs.nasa.gov/api/citations/20220002294/downloads/ICES-2022-388%20final%20for%20Strives.pdf
- **E.** Solar storms and flares: https://science.nasa.gov/sun/solar-storms-and-flares/
- **F.** Artemis II crew radiation research: https://www.nasa.gov/general/artemis-ii-crew-both-subjects-and-scientists-in-nasa-deep-space-research/
- **G.** Radiation protection technology (regolith shelters, TRL 4): https://www.nasa.gov/radiation-protection/
- **H.** Space gardens: https://www.nasa.gov/missions/station/iss-research/space-gardens/
- **I.** Seed film lettuce (VEG-03J): https://www.nasa.gov/science-research/seed-film-brings-new-way-to-grow-plants-in-space/
- **J.** Space Station life support and water recovery:
  https://www.nasa.gov/wp-content/uploads/2025/08/g-657270-59-hp-environmental-control-and-life-support-system-eclss.pdf
  and https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/
- **K.** Space radiation measurements during the Artemis I lunar mission (George et al., Nature 2024; NASA, DLR, ESA). Crew cabin vs storm shelter: 414 vs 95 µGy/min peak, worked out with a computer simulation of the huge October 1989 solar storm (not measured during the flight). Accepted manuscript: https://www.osti.gov/pages/servlets/purl/2447574
- **L.** NASA CCMC DONKI, Solar Energetic Particle event of 9 Feb 2024 (linked to an X3.3 flare at 12:53 UTC): https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/SEP/29076/3. Every storm time in `src/data/storms.js` was copied from DONKI API responses (FLR, SEP, CME and notifications, Jan–Feb 2024), and each storm card links to its DONKI pages. Times are UTC. "Near Earth" = GOES >10 MeV threshold.
- **T.** NASA Scientific Visualization Studio: Shackleton's rim through the eyes of LRO/LROC (a real LRO Narrow Angle Camera mosaic of Shackleton Crater; credit NASA/GSFC/Arizona State University): https://svs.gsfc.nasa.gov/3634/
- **W.** NASA OSDR OSD-804 (Rodent Research-1 bone): https://osdr.nasa.gov/bio/repo/data/studies/OSD-804 ; paper: https://doi.org/10.1371/journal.pone.0317307
- **X.** NASA OSDR OSD-267/268/269 (Veggie lettuce): https://osdr.nasa.gov/bio/repo/data/studies/OSD-267 ; NASA article on the OSDR analysis: https://science.nasa.gov/science-research/biological-physical-sciences/lettuce-find-healthy-space-food-citizen-scientists-study-space-salads/
- **U.** NASA Mars facts (a sol is about 24.6 hours): https://science.nasa.gov/mars/facts/
- **V.** NASA/JPL, Mount Sharp 'Photobombs' Curiosity (PIA22207), credit NASA/JPL-Caltech/MSSS: https://www.jpl.nasa.gov/images/pia22207-mount-sharp-photobombs-curiosity/
- **RadLab unit:** absorbed dose rate is in μGy per hour: https://visualization.osdr.nasa.gov/radlab/kb/absorbed_dose_rate
- **M.** NASA OSDR RadLab (Grigorev, "RadLab: A Comprehensive Database and Graphical and Programming Interfaces for Space Radiation Data", GSU SEP Workshop, Oct 2024), slide 13: Feb 24–27 2023 storm in Chang'e 4 LND (Moon surface), LRO CRaTER, BioSentinel and Curiosity RAD data: https://visualization.osdr.nasa.gov/radlab. The game now uses the RadLab API values directly: CRaTER `instrument=CRaTER&timestamp>=2023-02-24&timestamp<2023-03-01&absorbed_dose_rate`, Orion `instrument=M-42&timestamp>=2022-11-16&timestamp<2022-12-12&absorbed_dose_rate`, Mars `MSL-RAD` 24–27 Feb 2023, ISS `DosTel` 1–2 Apr 2022.
- Apollo 13 mission details: https://www.nasa.gov/missions/apollo/apollo-13-mission-details/

- **N.** Canadian Space Agency, distances and communication delay infographic (Moon 2.5 s; Mars 6–44 min): https://asc-csa.gc.ca/eng/multimedia/search/image/17245
- **O.** NASA, *Assessment of the State of Communication Delay Research in Preparation for Missions Beyond Low Earth Orbit* (2025): lunar one-way delays of 3 to 14 s; Mars up to 44 min round trip: https://ntrs.nasa.gov/citations/20250000703
- **P.** NASA, Risk of spaceflight-induced bone changes (1–1.5% bone density lost per month on 4–6 month missions): https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/
- **Q.** Canadian Space Agency, Eating in space (3 meals + 1 snack; 1,900–3,200 calories a day): https://www.asc-csa.gc.ca/eng/astronauts/living-in-space/eating-in-space.asp. CSA food production toolkit: https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/
- **S.** NASA CCMC DONKI (live and archived space weather): https://ccmc.gsfc.nasa.gov/DONKI/. Real storms used: 9 Feb 2024 (alert 14:55, near Earth 15:30; CME 2024-02-09T13:23 missed Earth), 29 Jan 2024 (STEREO-A 05:11, alert 05:20, near Earth 06:15), 12 Feb 2024 (CME only at 06:36, alert 07:46, near Earth 08:05, >100 MeV at 10:15), 31 Dec 2023 flare → near Earth 3 Jan 2024 20:05, X6.3 flare 22 Feb 2024 with no linked storm.
