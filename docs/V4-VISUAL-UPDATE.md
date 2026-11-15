# Picture-first update: flashcards, machine animations and math

Implemented in the existing Lunar Kids Quest app on 15 November 2026.

## What the child now sees

- Briefings, NASA discoveries, abort explanations and the end-of-mission base report use sequential visual cards. Each has a picture on the front, a Flip button, short child-friendly text on the back, Previous/Next controls, and optional read-aloud.
- Original detailed NASA text, source URLs, photographs and attribution remain accessible under “More for curious explorers & grown-ups” on the back. Original source files and the scientific engines remain unchanged. Actual game results are labeled as simplified game units, separately from the NASA connection.
- The base report presents the outpost, actual before/after resources, individual choices, a same-condition plan comparison when available, and the player’s discoveries. It ends with the existing star/reward flow. The reward screen is compact, with longer source notes collapsed.
- Main game previews use pictures and before/after values. Chandu’s round prompts are shorter. Equipment switches show illustrations, battery costs and resource-symbol contributions.

## Detailed machine illustrations

“Look inside our machines” opens a separate, clock-paused card deck for equipment actually available in that round. Each card uses the equipment’s existing `cost`, `eff` and `laterEff` definitions. Children can replay or pause the illustration and return to controls at any point. Inspecting equipment changes no supplies.

Equipment has distinct drawings and animation: water flowing into an oxygen maker and air bubbles leaving; used water passing through a filter into a clean tank; grow lights, watering and staged plant growth; an ice drill and rover; heat waves; radio signal waves; charging battery cells; a fixed shelter blocking particles; exercise pedaling; and science equipment. The main simulation also shows the selected equipment running.

These are conceptual illustrations, not physical engineering models or measured quantities. Actual resource results still come exclusively from the original game engine. Machine contribution labels are distinct from the net result after crew use and meter caps. Plant growth is explicitly simulated, and food still arrives at the original harvest round. Reduced-motion CSS disables animation. Flipping/advancing a card unmounts its animation, and equipment cards provide a pause control.

## Where the math quizzes went, and the fix

`PuzzleCard.jsx` and the round `math` metadata were present, but no mission screen rendered the puzzle. They were unreachable in the inspected game.

The existing puzzle component is now connected again:

- Mission 1: after choosing machines and its NASA card, count the free battery cells before the day runs.
- Mission 2: subtraction based on that round’s actual battery budget and selected machines.
- Mission 3: add the costs of the selected plant lamps.
- Final/Mars: count remaining cells in each power round using its original math metadata.

Yellow and grey battery pictures support counting. Wrong answers provide a friendly retry. The mission clock pauses during the quiz. Answering does not take supplies, subtract stars or change mission difficulty. The correct answer allows the already-selected plan to run; double execution remains guarded.

## Prepared real-child usability work

The user chose to prepare a playtest for later. No real-child session has taken place, and no educational-effectiveness result is claimed.

Open **For grown-ups and teachers → Prepare a child playtest** (or `#playtest`). The local facilitator tool provides eight tasks, neutral prompts, observation timing, assistance levels, outcomes and anonymous notes. Every task starts as “not observed.” An adult can deliberately save notes on the device or download JSON. Nothing is uploaded. The game can be opened in another tab while the observation page remains open.

Use [CHILD-PLAYTEST.md](CHILD-PLAYTEST.md) as the session protocol. Actual recruitment, parent/guardian permission, a willing child, facilitation and observation remain future work.

## Verification performed

- Production build passed.
- All original balance checks passed, including both Moon darkness variants and Mars.
- All 13 existing learning-regression groups passed, including the SHA-256/source-URL audit and replay protection.
- New visual-learning tests verified math against **725 legal power plans**, both sites and Moon/Mars missions; Mission 1 and zero-spend cases; no mutation while preparing a puzzle; equipment/story selection; and unique usability task definitions.
- Browser: flipped cards by keyboard, accessed original NASA source notes, inspected equipment, paused motion (computed animation became `none`), and completed battery subtraction, zero-free-cell subtraction and plant-lamp addition. During a wrong-answer retry, the clock remained at 2:25 across subsequent checks; correcting the answer ran the plan.
- Browser: Mission 1’s restored quiz showed `11 − 11 = ?`; keyboard completion produced the original daily result (Power 4, Air 4, Water 7, Radiation safety 7 for the selected plan). Greenhouse addition showed `2 + 2 = ?`; food still waited for the later harvest. The greenhouse report advanced through six cards to the compact reward screen.
- Browser: at 360×800, the briefing card’s content and visible height were both 419px, page width was 360px, and Next remained inside the viewport. Tab stayed inside the dialog. The temporary viewport override was reset.
- The inspected browser tab contained no console errors or warnings.
- The facilitator page was checked with all eight tasks unobserved. No fictional child results were entered.

Screenshots: [card front](v4-flashcard-front.jpg), [card back](v4-flashcard-back.jpg), [restored math](v4-restored-math.jpg).

The latest card flow was browser-tested in Missions 1–3; Final/Mars share these components and passed rule/math regression tests, but their entire browser journeys were not repeated during this update. Screen-reader testing, physical-device testing and real-child observation still remain. Optional source notes and the adult facilitator page can scroll; primary picture-card faces and navigation are kept compact.

## Gain/loss color update

Gains and benefits now share bright parrot green (#64F000); losses, costs and resources spent share bright red (#FF3333). This applies to previews, outcome cards, machine effects, delayed benefits, resource-delta badges, site/trip trade-offs, day reports and plan comparisons. Signs, resource names and unchanged/neutral states remain distinct. Build and learning/visual regression checks passed; browser practice confirmed the exact rendered green and red backgrounds. No scientific data or calculations changed.

## Latest presentation adjustment

Choice-result amounts, signed changes and numerical text on result-card backs are now emphasized in bold. Watch again and Pause motion have been removed. Animations play one cycle whenever displayed, including when a card is revisited. Reduced-motion support is retained. Browser inspection confirmed result font weight 900, animation iteration count 1 and no replay/pause controls. This supersedes the earlier replay/pause descriptions in this report.
