# Lunar Kids Quest

**Little Astronauts. Big Decisions.**

A Moon mission game for children aged 7–12, built for the NASA International Space Apps Challenge 2026 challenge "Build a Junior Astronaut Mission Trainer".

Children run one Moon outpost across four missions and learn the core idea behind real space missions: **every choice is a trade-off.** Life support, radiation shielding, power and food production all compete for the same battery, and the base the child builds in one mission carries into the next. After each choice, a "Real NASA Mission" card shows how NASA engineers face the same problem, with a link to the NASA source.

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

To check the game balance (plays every possible strategy in every mission):

```bash
npm run test:balance
```

To check the production build:

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel detects **Vite** automatically. Keep the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Press **Deploy**.

No extra Vercel settings are needed: screens use hash links (for example `/#map`), so every page works without server rewrites.

## How the project is organised

```
src/
  App.jsx                 picks which screen to show
  main.jsx                starts React
  styles.css              colours, buttons, cards, animations
  data/
    ratios.js             EVERY game number: size tier, NASA ratio or estimate, and why
    missions.js           Missions 2, 3 and Final: rounds, machines, choices, NASA cards
    mission1.js           Mission 1 sites, machines, questions, tips, the map list
  screens/
    Welcome.jsx           start screen
    CommanderSetup.jsx    nickname, suit colour, age level
    Crew.jsx              meet Amina, Bilal and Zoya
    MapScreen.jsx         the Moon Map with the four missions
    Briefing.jsx          Mission 1 briefing
    Mission1Game.jsx      Mission 1: walk, scan, build, fix, power, run the base for a day
    Mission1Complete.jsx  Mission 1 reward and "Your choices vs. NASA's"
    MissionGame.jsx       shared engine for Missions 2, 3 and the Final
    Dashboard.jsx         XP, badges, Moon base, mission notebook
  components/
    ChanduMascot.jsx      the robot mascot with five moods
    ResourceMeter.jsx     the 0–10 meters (hearts mark life support)
    ProgressHeader.jsx    back button, steps, mission clock, stars
    MissionDialogue.jsx   Chandu's speech, hint button, Mission Control call
    ChoiceCard.jsx        a choice with its gain and cost shown up front
    PuzzleCard.jsx        maths puzzle and battery cells
    NASAFactCard.jsx      "Real NASA Mission" card
    MissionSheets.jsx     ready screen, engineer question, mission abort, star pop-up
    RewardModal.jsx       mission complete screen
    BaseReport.jsx        Base Report: base, crew, choices, trade-offs, crewmate explanations
    BaseStrip.jsx         "Your base": site, modules and the meters carried forward
    NumbersSheet.jsx      "How we made the numbers", built from ratios.js
    MissionMap.jsx        map path, mission nodes (MissionCard) and base parts
    MoonParts.jsx         stars, Earth, sun, panels, dome, tank, greenhouse, rover, commander
    Stage.jsx             scales the 390-px game drawings to any screen width
    Sheet.jsx, Icon.jsx   small building blocks
  hooks/useMissionClock.js  the countdown that pauses while reading
  lib/
    missionLogic.js       pure game rules (carry-over, cells, effects, stars)
    mission1Logic.js      pure Mission 1 rules
    storage.js, sound.js, router.js
scripts/balance-test.mjs  plays every strategy and checks the design rules
public/assets/            character images
```

### Changing a mission

- **Numbers:** change them in `src/data/ratios.js` only. Each value has a size tier (Tiny 1, Small 2, Medium 3, Large 4, Huge 6), a basis (`nasa` or `estimate`) and a reason. When you find a real NASA number, change the tier, set `basis: 'nasa'` and add the source; the "How we made the numbers" sheet updates by itself.
- **Rounds and text:** `src/data/missions.js` lists each round's battery cells, machines, choices, guiding question (`ask`), Mission Control answer (`tip`) and NASA card. `essentials` must never reach 0. `carry` lists the meters that start from the child's base.
- After a change, run `npm run test:balance`.

## Game rules in short

- **Mission clock** (Explorer gets more time than Commander). It pauses while reading NASA cards.
- **At most 3 meters plus a score per mission,** so young players are never tracking 5 or 6 things at once.
- **Life support** meters have a heart. If one reaches 0, the mission aborts kindly, with the real Apollo 13 story.
- **One outpost.** The site chosen in Mission 1, the Moon-dirt wall, the Oxygen Tank (after Mission 2) and the Greenhouse (after Mission 3) carry forward. Each mission starts from the meters the base ended with (kept between 3 and 8 so no mission starts impossible).
- **Kids do things, they don't answer quizzes.** They switch machines on within a battery, walk the commander, send the rover, move each astronaut to safety during a real solar storm (countdown from the storm's real warning time), and water thirsty plants one by one. Every action shows its gain and cost before they confirm.
- **Base Report** after every mission: the base they built, the crew, each choice with "Got" and "Gave up", how every meter changed, what carries forward, and a crewmate (Amina, Zoya or Bilal) who explains each trade-off in their own words.
- **Stars** come from smart rounds (no low meter, life support on, nobody left outside in a storm) and a bonus goal the child reaches by playing (for example "finish with Oxygen 8 or more"). **3 stars only if life support stayed on and nobody was left outside in the storm**, following NASA's rule that keeping the crew alive comes first. In Mission 1, only the NASA plan (sunny rim + ice from the crater) can reach 3 stars; Crater Edge still works for 2.
- **Kids make the decisions.** The ? button asks a guiding question. The answer only appears after a mistake or when the child calls Mission Control (once per mission). Explorer level may highlight life support after a mistake; Commander level never does.
- **Radio delay:** Mission Control's answer has to travel to Earth and back. It arrives after 2.5 s (Explorer: light-speed only, CSA) or 6 s (Commander: the low end of NASA's expected 3–14 s each way with relays). The mission clock and any storm countdown keep running while the child waits. The reply also says a Mars crew would wait 6 to 44 minutes.
- **Solar storm (real DONKI events):** each play of the Final uses one of three real 2024 storms in turn (9 Feb X3.3, 29 Jan M6.8, 12 Feb no-flare surprise). The countdown is the real time from NASA's alert to the storm reaching Earth, scaled at 1 game second = 3 real minutes (never under 7 s): 35 min → 12 s, 55 min → 18 s, 19 min → 7 s. When the clock runs out, anyone still outside is caught in the storm. Shield loss follows the Artemis I ratio: the whole crew outside loses 4 times as much as the whole crew in the shelter. Outside gives the most science, behind the wall a little, the shelter none: a real trade-off, but leaving anyone outside caps the mission at 2 stars.
- **Delayed results:** plant lamps cost water and power now, but their food arrives a month later (lettuce takes about a month, source I). Moonwalks and the night battery also trade today against later.
- Maths mistakes never fail a mission.

## Privacy and safety

- No accounts, no ads, no purchases, no leaderboards.
- Only a nickname is stored, in the browser's own storage on that device.
- Sounds are made in the browser and only play after a tap. There is a mute button on the Moon Map.
- **Two kinds of network request, both to NASA, neither carrying anything about the child:** at the start of the Final the game asks NASA's public DONKI service for particle storms in the last 30 days (a date range only). If it fails or is slow (5 s), the game carries on with its stored storms. To use your own NASA key instead of `DEMO_KEY`, set `VITE_NASA_API_KEY` in Vercel. The two NASA photos load from `public/assets/` if you add them, otherwise from NASA's servers; if neither loads, they are simply hidden. To bundle them: save https://svs.gsfc.nasa.gov/3634/ → `LROC_v03.1000.jpg` as `public/assets/nasa-shackleton-lroc.jpg`, and https://www.jpl.nasa.gov/images/pia22207-mount-sharp-photobombs-curiosity/ → Download JPG as `public/assets/nasa-curiosity-pia22207.jpg`.
- Read-aloud uses the device's own speech voice and sends nothing.
- Animations turn off when the device asks for reduced motion.

## Notes for the Space Apps submission

- The character images in `public/assets` are AI-generated and now carry a visible "AI-generated" watermark. The submission guide also asks you to name the AI tools in your project description.
- All game points are simplified sizes. The game explains which come from NASA ratios and which are estimates (reward screens and the Commander Log → "How we made the numbers").
- Do not use the NASA logo. Use the NASA Space Apps Challenge branding instead.

## What changed in this version

**v5: side quests and pre-deployment fixes**
- **Fixes:** storm practice is now optional, shown only the first time, and neutral (it describes each spot without nudging toward the shelter). The battery-math quiz is for Explorer level only; Commanders get an optional "Check my battery math" button. Wording fixes: the Artemis I 414/95 numbers are now called a computer simulation of the October 1989 storm, the bone card says scientists are still studying Moon gravity, the lettuce card names China's Tiangong II, and the oxygen value names the HIDH "Total Per Day" row. The Moon Map now has a main heading for screen readers.
- **Six optional side quests** (they read the same game engine and never change a rule, a number, official stars or the saved base):
  - ☀️ **Scan the Sun** (Final and Mars Mode): tap the telescope to see the real NASA DONKI record behind the mission, with its event date, when the data was checked, and a "Recent data" or "Archived practice" badge. The mission clock pauses.
  - 🛡️ **Shelter versus science** (sunny round of the Final and Mars Mode): one panel for the same two machines, with energy flowing into the one you power and the cells it costs.
  - 👻 **What if? Try the other choice** (after the storm): your plan beside the other choice, worked out from the same start with the same rules, with bold green gains and red losses.
  - 🌗 **New mission day** (end of the Final): "Try this challenge again" or "Explore a new mission day", which uses another stored DONKI storm and the other darkness variant as a practice run.
  - ⏪ **Engineer's rewind** (after a round with no smart-choice star, or after an abort that wasn't the clock): back to the same decision with your choices still set, then a first-try / now table.
  - 📒 **My Strategy Collection** (Commander Log): 12 illustrated strategy cards; each opens the child's actual before-and-after result.
- New browser storage key: `lkq-strategies-v1` (strategy cards only). `npm test` now also runs `scripts/side-quest-test.mjs`.

**Latest update (pre-deployment check against the full challenge text):**
- **OSDR biology findings:** Mission 2's bone card now uses OSDR study OSD-804 (mice on the Space Station for 37 days lost bone in weight-bearing legs but not spines; ground mice that could climb kept bone; Cahill et al., PLOS ONE 2025). Mission 3's first card uses the Veggie lettuce studies OSD-267 to 269 (safe to eat) and NASA's OSDR analysis (about 30% less calcium and 25% less magnesium than Earth lettuce).
- **Mission 1: 3 meters + battery.** Power is now a battery bar under the meters (like the battery card in every other mission), so Mission 1 shows Oxygen, Water and Shield as meters.
- **NASA photos bundled:** `public/assets/nasa-shackleton-lroc.jpg` and `public/assets/nasa-curiosity-pia22207.jpg` (resized to 1200 px), so both photos work offline.
- **Communications use power:** a "Radio to Earth" switch (1 cell) in every power round of Missions 2, 3, the Final and Mars Mode. Mission Control can only be called when the radio is on (in an action round: when it was on the round before). Power is now split between life support, communications and science, as the challenge describes.
- **Reinforce the shelter BEFORE the storm:** "Reinforce storm shelter" (2 cells) in the sunny round of the Final and Mars Mode. It costs cells you might want for the dark, and gives +1 Shield back when the storm hits.
- **Real Mars photo:** Curiosity's "Mount Sharp photobombs Curiosity" selfie (PIA22207, NASA/JPL-Caltech/MSSS) on the Mars radiation card and the data page.
- **Sol:** Mars Mode rounds are "Sol 1: dusty day / storm / freezing night", and "sol" is a tap-to-explain word (about 24.6 hours, NASA Mars facts). Mars Mode now has red ground and no Earth in the sky.
- **AI watermark:** every AI-generated crew image (12 files in `public/assets`) now carries a visible "AI-generated" (or "AI" on the small walking sprites) label burned into the picture. Unmarked originals are not in this zip.
- **Tap-to-explain fix:** words only match whole words (so "sol" never lights up inside "solar").

**Previous update (final evaluation: accessibility, real data, pitfalls, stand-out):**
- **No free safe win:** in every mission the 3rd star needs the bonus goal. In the Final, hiding all mission and doing no science now gets at most 2 stars (the balance test checks every plan).
- **Fewer things to track:** each mission shows at most 3 meters plus a score (Mission 1: Power, Oxygen, Water, Shield; Final and Mars: Oxygen, Food, Shield + Science). Warmth is gone: the Heater is a life-support switch that must run in the dark, or the crew gets too cold (mission abort). Food starts in Mission 3.
- **Read-aloud** on every Chandu message, briefing and NASA card (the browser's own voice: offline, sends nothing).
- **Tap-to-explain words:** radiation, radiation dose, particle storm, solar flare, cloud from the Sun (CME), weightlessness, gravity, speed of light, life support, Moon dirt, calories, kilowatts, μGy, Mission Control.
- **Plain language:** no "MeV"; flare sizes explained; storm times in Pakistan time (UTC+5); long NASA cards show about 40 words first, with "Read more".
- **Bigger text** (nothing under 13 px) and a main heading on every mission screen. Automated accessibility checks (axe-core) find no issues on 8 screens.
- **Big-screen layout:** on a laptop or projector, missions show the Moon scene on the left and the controls on the right.
- **"Real data we used"** page (from the Welcome screen and the Moon Map): every dataset, live vs stored vs ratio vs estimate, with links.
- **"For grown-ups and teachers"** page: what each mission teaches, levels for older siblings and parents, classroom use, 3 discussion questions, privacy.
- **Real radiation ruler (all μGy per hour, from RadLab unless noted):** Space Station 2–12.6; Curiosity on Mars 4.8–6.9; Moon orbit calm 6.9–7.8 and storm peak 1,453 (LRO CRaTER, 24–26 Feb 2023: about 200 times calm); inside Orion on the real Artemis I flight about 17 (15–23; 4,122 for a few minutes crossing Earth's radiation belts after launch); NASA's big-storm calculation for Orion (shelter 5,700, open cabin 24,840). Opens from the storm result and the data page.
- **Storm card corrected:** the February 2023 storm is now shown with real lunar-orbit readings (about 7 → about 1,450 μGy per hour) instead of a value read off a chart. RadLab has no Moon-surface instrument, so the Chang'e 4 lander is no longer mentioned.
- **Real NASA photo:** Shackleton Crater from the Lunar Reconnaissance Orbiter camera on the Mission 1 card and the data page (credit NASA/GSFC/Arizona State University).
- **Live data changes the game:** if DONKI has a particle storm from the last 30 days, the Final plays that storm ("NASA found this storm 12 days ago"). The storm card ends with "Right now: …" from the live check.
- **Notebook keeps source links** for every saved fact.
- **Mars Mode** (unlocks after the Final): Mission Control's reply takes 6 to 44 minutes, so it arrives after the storm. Kids decide alone. Uses DONKI's forecast that the 9 Feb 2024 Sun cloud would reach Mars, and Curiosity's radiation readings.
- **Replay variety:** the Final alternates between a south-pole dark spell (about 4 days) and a full Moon night (nearly 15 days, battery charge needed), plus the rotating real storms. After 3 stars, "Can you win a different way?" challenges.

**Previous update (real NASA data, radio delay, trade-offs):**
- **Communication delay:** Mission Control replies after a real Moon radio delay while the clock runs (sources N, O); new "Calling Earth takes time" card with the Mars comparison.
- **Real DONKI storms:** three verified 2024 storms with their real alert and arrival times drive the storm countdown; each storm's NASA card links to the DONKI alert and event pages. Lessons from DONKI: a CME that missed Earth still sent particles; a storm with no flare at all; a storm that took 2 days; a big X6.3 flare with no storm.
- **Live DONKI check (optional):** the Final shows how many particle storms NASA recorded in the last 30 days, with a stored fallback. (On 15 Nov 2026 the answer was none, "a quiet Sun".)
- **Video call → Exercise bike** (Mission 2): the free mood boost is replaced by exercise that costs power and protects Fitness, based on NASA's 1–1.5% bone loss per month in weightlessness (source P; NASA does not know yet how much Moon gravity helps, so the amount is an estimate).
- **Storm is a real trade-off:** outside gives more science than behind the wall, so the wall is no longer a free win. Leaving crew outside caps the mission at 2 stars.
- **New trade-offs in the Final:** a Moonwalk for samples (science for stored oxygen and a little Shield) and Repair storm shelter in the dark (Shield vs food vs warmth).
- **Delayed consequence (Mission 3):** plant lamps' food arrives a month later; the Base Report says what last month's choice grew.
- **Mission 3 bonus goal counts food you GROW:** "Grow at least 2 more Food than you started with" (it used to be "finish with Food 6 or more", which a base carrying in lots of food could win without lighting a single lamp). Fresh-start water is 8 so a new player can still light lamps and water plants safely. The balance test now checks that no 3-star plan skips the lamps.
- **Food card** (CSA, source Q): 3 meals + 1 snack, 1,900–3,200 calories a day.
- **Fixed:** the RadLab card now says the >10× jump was at the Moon's surface (Chang'e 4) and adds that Curiosity on Mars saw no jump on the same days (checked against RadLab MSL-RAD data for 24–27 Feb 2023: steady, 4.8–6.9). Mission 3 no longer shows a Happy meter that never changed.

**Previous update (hands-on play and real storm data):**
- **Solar storm is now an action:** tap each astronaut to move them into the shelter or behind the Moon-dirt wall before the countdown ends.
- **Thirsty plants is now an action:** tap a watering can on each plant.
- **No more quiz steps:** the maths question and the end-of-mission question are gone. They are replaced by the Base Report (from the design canvas) and a bonus-goal star.
- **NASA ratio:** the outside-vs-shelter storm ratio is now 4 to 1, from Artemis I measurements (NASA/DLR/ESA, Nature 2024).
- **New "A real storm" card:** it uses a DONKI event (X3.3 flare on 9 Feb 2024 at 12:53 UTC, particle storm detected at 15:09) and NASA OSDR RadLab data (Feb 2023 storm: radiation at the Moon's surface jumped more than 10 times above normal for about a day).
- **New "Shelters really work" card,** from Artemis I.

**Earlier update:**

- **One persistent outpost:** each mission starts from the base the child built; the site, wall, tank and greenhouse carry forward and show in a "Your base" strip.
- **Mission 1 matches NASA:**
  - 9 Artemis III landing regions (not 13);
  - the sunny-rim-plus-icy-crater plan is the 3-star strategy;
  - new Ice miner and Moon-dirt wall;
  - the completion screen says which home NASA would pick and why.
- **Ice miner** (Missions 1 and 2): the biggest power user, sunlight only.
- **Radiation matters:** Shield is life support in the Final. The storm has a countdown and three choices (shelter, Moon-dirt wall, outside), and too much radiation aborts the mission.
- **Food matters:** the crew eats every day, food is life support in the Final, and plants give back a little oxygen.
- **"A Moon Stay"** replaces "One Day on the Moon". It has 4 rounds (sunny work, solar storm, long dark spell, sunrise) with Oxygen, Food, Shield and Warmth all at stake together.
- **Every number** comes from `ratios.js`, marked NASA ratio or estimate.
- **Guiding questions** replace answer-giving hints, and the pink "required" outlines are gone.
- **NASA cards** were rewritten to use only the sourced facts below.

## Game values: NASA ratios and estimates

Generated from `src/data/ratios.js`. Letters refer to the sources below.

| Game value | Size | Points | Basis | Why |
|---|---|---|---|---|
| Oxygen the crew breathes each day | SMALL | 2 | **NASA ratio** (D1) | About 0.82 kg of oxygen per astronaut per day. Water is about 3 times more, so Water drain is 3 times Oxygen drain. |
| Water the crew drinks each day | HUGE | 6 | **NASA ratio** (D2) | About 2.79 kg of drinking water per astronaut per day: about 3 times the oxygen. |
| Food the crew eats each day | SMALL | 2 | Estimate | Our NASA sources give no food amount per day. Kept small so a garden can keep up with it. |
| Fitness lost each day without exercise | TINY | 1 | Estimate (P) | In weightlessness, astronauts lose about 1 to 1.5% of bone each month (P). NASA does not know yet how much Moon gravity (1/6 of Earth’s) slows this, so the amount is a game value. |
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
| Shield lost if the whole crew stays outside in a solar storm | LARGE | 4 | **NASA ratio** (K) | Artemis I: for a big solar storm, the peak dose in Orion’s crew cabin was about 4 times the storm shelter’s (414 vs 95 µGy per minute). Measured inside a spacecraft, not on the Moon’s surface. |
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
- **K.** Space radiation measurements during the Artemis I lunar mission (George et al., Nature 2024; NASA, DLR, ESA). Crew cabin vs storm shelter: 414 vs 95 µGy/min peak for a modelled large solar storm. Accepted manuscript: https://www.osti.gov/pages/servlets/purl/2447574
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
