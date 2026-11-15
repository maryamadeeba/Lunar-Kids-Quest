# Lunar Kids Quest V4 delivery

**Latest update:** [Visual flashcards, restored math, machine animations and the later playtest kit](V4-VISUAL-UPDATE.md). The notes below describe the initial V4 pass; the latest update supersedes the earlier animation and card-layout limitations.

Updated in place on 15 November 2026. Run `npm run dev`; build with `npm run build`; run both suites with `npm test`. No framework migration or new runtime dependency. The existing four Moon missions, crew, Chandu, Mars extension, notebook, badges, stars and NASA integrations remain.

## What is implemented

The shared learning layer calls the existing pure simulation to preview the selected plan, including daily consumption, delayed harvests and clamping. After execution, it compares the actual before/after state, announces changes and shows resource-transfer icons. Machine cards still show their individual costs, so children can distinguish a machine's contribution from the net result of a whole round. Reports now use actual net gains rather than uncapped machine totals.

Chandu connects oxygen production to water and power and responds to low resources. Three progressive local hints are distinct from the original delayed Mission Control call. The original Moon/Mars radio costs and delays are retained. Speech stays optional, cancels overlapping playback, obeys mute and has text alternatives.

Explorer players receive an interactive, isolated practice base before their first mission. It introduces the crew, shows the battery cells, offers an optional prediction, activates the real oxygen-machine effect and displays its real air/water changes. Practice is replayable from the map, without spending mission supplies.

Mission 1 retains both locations, scanning, building, rover trips, solar-panel carrying, power allocation and the daily simulation. It adds a day preview, actual consequences, a conceptual-map label, large trip buttons and learning reports. Existing site advantages, star conditions and resource calculations remain. Rapid repeated movement/day submissions are guarded. Star feedback now appears immediately instead of relying on a delayed bonus animation; the original award conditions and numerical total remain the same.

Mission 2 adds full-round previews and consequence reports to the existing machine control room. Battery cells, original machine icons and remaining capacity make competing needs visible. Over-budget activation is rejected. Net results include breathing, drinking and exercise consumption, rather than promising the sum of machine output alone.

Mission 3 keeps the original later harvest. Selected lamps show a growth timeline; the harvest round shows food earned by the player's earlier lamps. Watering previews include that harvest, crew consumption and meter caps. Plants remain tappable or keyboard-operated.

Mission 4 adds a separate, untimed shelter rehearsal before the storm. Both clocks pause during rehearsal. All crew positions reset when the original warning begins. The existing DONKI event/countdown, shelter and wall effects, darkness variants, heater requirement and final science dilemma remain. Practice does not alter the event or supplies.

The same preview/report/hint/replay layer supports Mars. The Mars environment and communication constraints are retained.

Discoveries are earned from selected equipment and observed outcomes. The Commander Log shows the player's encountered trade-offs. Mission reports include short reflection prompts and an optional acknowledgment, separate from numerical stars. A working “Try another plan” action starts an isolated comparison.

Comparison runs freeze the initial base, mission variant and captured storm. Snapshots persist under separate versioned learning/replay keys. Results are compared using actual meter values. A comparison cannot replace official stars, base modules, carry-over resources or notebook entries. Existing saves remain readable. A legacy completed mission without a snapshot first establishes a fresh comparison baseline; it cannot reconstruct the original historical conditions. Explicit “Start over” also clears the new learning, tutorial and replay records.

## Scientific preservation

See [NASA-PRESERVATION.md](NASA-PRESERVATION.md) for every original R constant, tier, value, rationale and source mapping, plus the exact formula map. [science-baseline.json](science-baseline.json) records SHA-256 hashes and source URLs captured before edits.

All `src/data` files, `missionLogic.js`, `mission1Logic.js`, `radio.js`, the original README and original balance-test script remain byte-identical. Original UI citation URLs are separately checked. NASA DONKI live requests and archived fallback, OSDR findings, Artemis measurements, environmental references and image attribution are retained. No new NASA measurements were introduced and existing URLs were not independently revalidated online.

The presentation calls the internal `s`/Shield meter “Radiation safety” and explains it as an abstract exposure budget. Exposure does not consume the wall or shelter material. Source wording in protected data stays intact. The transparency page distinguishes measurements, NASA-informed relationships, estimated game units and simulated practice/time.

## Verification

- `npm install`: passed; existing React/Vite dependencies retained.
- `npm run build`: passed; production files generated in `dist`.
- `npm run test:balance`: all original checks passed, including both Moon darkness variants and Mars. The original test file was not edited.
- `npm run test:learning`: 13 regression groups passed. These cover file/citation integrity; original oxygen/recycler costs; legal-plan previews across missions/sites and meter caps; harvest timing; storm ratio and event immutability; failure rules; actual consequence extraction; evidence-based discoveries; affordable hints; versioned learning storage; isolated tutorial simulation; and comparison persistence guards.
- Browser: created an Explorer commander, visited crew/map/briefing, used the tutorial and played Mission 1 through its daily result. Played Missions 2, 3 and 4 through reports, including budget rejection, harvesting, watering, storm rehearsal, keyboard crew movement, darkness/heater and sunrise. Opened Mars's briefing. Direct route navigation was used between some mission tests; this was not one uninterrupted, reward-by-reward playthrough. Mars was covered by balance/regression tests, not a complete browser run.
- Browser comparison: the official oxygen plan ended at Air 10, Water 7, Science 3. A second plan from the same Air 4/Water 3 start ended at Air 8, Water 1, Science 6. The comparison showed those results, and the map retained the official three-star score. These are observed game units from the test run, not NASA measurements.
- Browser accessibility: shelter practice and crew movement worked using Enter. Tab wrapped within the practice dialog; focus was contained. Reports/rewards focus their dialog and trap Tab. Shared sheets restore the opener when it still exists. Important controls have focus outlines, meter labels/values and live announcements. Reduced-motion CSS disables animation/transition; this was inspected in code, not tested with a screen reader or changed OS preference. Audio is optional; unsupported speech hides read-aloud controls.
- Browser mobile: at 360×800 the observed page width was 345px, dialog width approximately 345px, and keyboard focus remained inside the dialog. Buttons and transfer rows were visually inspected. A wrapping call-to-action issue was fixed. The temporary viewport was reset.
- Console: an initial existing React key-spread warning was observed and fixed in ResourceBar. No later new application errors were observed in the inspected console log. Some automation waits expired during animation or before the next DOM update; results were re-observed before proceeding.

Screenshot: [mobile practice result](v4-mobile-playtest.jpg).

## A seven-year-old's journey

1. **Meet the crew.** Chandu shows the Moon practice base. The child guesses what will happen to the battery, then starts the oxygen maker. Air rises, water falls and cells become unavailable. The child sees that one useful thing uses other supplies. Practice ends with all mission supplies untouched.
2. **Choose a home.** The child scans Sunny Ridge and Crater Edge, comparing sun and ice. Building changes the actual supplies. Rover trips use power to bring water; panel trips improve power while using radiation safety budget. A day preview lets the child change their machines before committing.
3. **Share the battery.** The child turns on air and water equipment, then tries another machine. When cells run out, Chandu explains why something must stay off. The real result shows what the machines and crew together changed.
4. **Grow for later.** The child spends power and water on lamps while food stays unchanged. A later simulated month brings the harvest. Watering uses water that the crew also needs. The child can try fewer lamps or fewer watered plants and compare.
5. **Protect the crew.** Before the real warning, the child practices shelter controls without a clock. The actual storm then uses its original duration. Sheltering lowers exposure but pauses science. The child must also plan heat and air through darkness and choose how to use the final daylight.
6. **Become a planner.** Reports describe this child's supplies and discoveries. Another plan starts with the same captured conditions. Side-by-side results show that different strategies have different benefits and costs while official progress stays safe.

## Remaining work and practical limits

Implemented features above are working. These items remain for further development/validation:

- No real-child study or measured educational-effectiveness claim. The first-minute/three-minute learning targets still need observation with children aged 7–12.
- Updated: equipment-specific drawings and animations, a replayable machine inspector and visual card decks are now implemented. See V4-VISUAL-UPDATE.md for their scope and test evidence. These remain conceptual illustrations, not physical engineering models.
- Updated: NASA fact cards, briefings, base reports and rewards now use compact picture-first presentation; long original source notes remain optional on the back.
- Reflection uses conversation prompts and optional acknowledgment; it does not score or validate a child's understanding. Prediction currently appears in the tutorial, rather than as a repeated mission interruption.
- No new timing accommodation or alternative difficulty rules were introduced. Rehearsal and instructions pause before the storm; once started, original countdowns remain unchanged.
- Full screen-reader/device-matrix testing, a continuous reward-by-reward browser journey, and a full Mars browser playthrough remain unperformed. Narrow-layout checks do not substitute for testing on physical tablets/phones.
- Comparison snapshots keep the first captured baseline. There is no separate UI yet to replace that baseline with a newly fetched live storm; starting over clears it.
- Browser progress is local to the testing browser/profile. No account sync or server persistence was added.
