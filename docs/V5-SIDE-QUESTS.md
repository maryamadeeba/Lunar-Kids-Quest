# v5 side quests

All six side quests are optional add-ons. They use `src/lib/sideQuests.js` (pure logic) and `src/components/SideQuests.jsx` (UI, built from the existing learning cards, Sheet, ResourceTiles and the green/red trade-off colours). No file in `src/data` and nothing in `src/lib/missionLogic.js` changed for them; `npm test` checks this with the science baseline hashes.

| Side quest | Where | What it uses |
|---|---|---|
| ☀️ Scan the Sun | Telescope on the scene, Final and Mars Mode (not during the storm countdown). Clock pauses. | The storm the mission uses (stored DONKI record, or this month's live one). Badge: "Recent data" only when the storm came from the live 30-day check; otherwise "Archived practice". Mars: the stored 9 Feb 2024 CME forecast (DONKI CME/29066). |
| 🛡️ Shelter versus science | Sunny round of the Final and Mars Mode | The existing `brace` and `drill` items, costs and effects. Same toggle as the machine grid. |
| 👻 What if? | Storm round result | `previewRound` from the same starting supplies and earlier choices. Sheltered crews are compared with working behind the wall (or outside if there is no wall); working crews with everyone sheltered. |
| 🌗 New mission day | End of the Final | `nextStorm()` and the next `DARK_VARIANTS` entry. Always a practice run. |
| ⏪ Engineer's rewind | Round result with no smart-choice star; abort sheet (except "clock ran out") | Restores the checkpoint taken before the round (supplies, stars, choices), keeps the child's choices set, then shows first try vs now. |
| 📒 My Strategy Collection | Commander Log | `lkq-strategies-v1` in browser storage: the strategy id, date, where, and the real before/after supplies. |

Checked with `npm test` (13 learning groups, 5 side-quest groups, visual and balance checks), `vite build`, and a scripted playthrough of the Final at 390, 360 and 1280 px plus Mars Mode, with axe accessibility checks on every new sheet (no violations) and no page errors.

## v5.1 changes
- **Base report = flashcards only.** Mission 1 now opens the Base report flashcards as soon as the day ends (the long Day report screen is gone). Every mission's last card offers "📄 View or download the full report": a written report (day report rows in Mission 1, start/end supplies, bonus goal, each choice with its trade-off, the NASA connection) and a "⬇ Download my report" button that saves `my-base-report.html`. "← My cards" returns to the last card.
- **Equal buttons:** "Play again / Base report" (Mission 1) and "Try again or Engineer's rewind / Next round" (other missions) are now the same size (`.report-actions`).
- **🧭 Side quests button on the Moon Map:** lists all six side quests, where each one is, whether it is unlocked, and ✓ when found.
- **Colour rule:** choices are shown in neutral white chips (machine buttons, plan cards, Mission 1 scan and trip cards, Storm prep, the "Your plan" preview, "Look inside our machines"). Green = gain and red = loss appear only on RESULTS: "What changed", the meters, the NASA card's result, the base report, What if?, rewind and the strategy cards.
- **Simple choices:** before a choice, each machine or plan only says what it does in words ("Adds Air", "Drains Water") plus its battery cells. No + or − numbers and no "Your plan" preview. The numbers and the trade-off appear only in the result after the round.
- **Final check (v5.4):** scripted full playthroughs of Mission 1 (Explorer), Mission 2 (Explorer and Commander), Mission 3 (Commander at 390 px, Explorer at 1280 px), the Final (Explorer 390 px, Commander 360 px) and Mars Mode, plus all side quests and every static page at 360 and 1280 px. Fixed: discovery lines had light text on a light background (contrast); crew buttons' spoken names did not match their visible text; the Mission 1 briefing had no main heading.
- **Skip button (v5.5):** every flashcard deck has a "Skip ⏭" button next to the card count (hidden on the last card). It does the same as the deck's final button: start the mission, close the NASA card, collect stars, try again.
