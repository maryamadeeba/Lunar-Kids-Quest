// ============================================================
// Tap-to-explain words. Each one is explained in plain words for
// ages 7–12, the first time it appears in a message or card.
// Match is case-insensitive; longer phrases are matched first.
// ============================================================
export const GLOSSARY = [
  { term: 'radiation dose', also: ['dose'], says: 'How much radiation a body soaks up. Less is safer.' },
  { term: 'radiation', says: 'Invisible energy from the Sun and from deep space. Too much can hurt the body. Thick walls and shelters block a lot of it.' },
  { term: 'particle storm', also: ['solar storm', 'storm particles', 'fast particles'], says: 'When the Sun throws out a burst of tiny, super-fast bits of matter. They can fly through walls and bodies, so crews hide in a shelter.' },
  { term: 'solar flare', also: ['solar flares', 'flares', 'flare'], says: 'A sudden, giant flash of light and energy on the Sun. Scientists name flares by size: X flares are the biggest, M flares are 10 times smaller.' },
  { term: 'cloud from the Sun', also: ['CME'], says: 'A huge cloud of gas the Sun sometimes throws into space. Scientists call it a CME (coronal mass ejection).' },
  { term: 'weightlessness', also: ['microgravity'], says: 'Floating, like on the Space Station. Bones and muscles get less work, so they get weaker.' },
  { term: 'sol', also: ['sols'], says: 'A day on Mars. It lasts about 24 hours and 40 minutes, a little longer than a day on Earth.' },
  { term: 'gravity', says: 'The pull that keeps your feet on the ground. The Moon’s pull is about 1/6 of Earth’s, so you would feel much lighter.' },
  { term: 'speed of light', says: 'The fastest speed there is: about 300,000 km every second. Radio messages travel this fast.' },
  { term: 'life support', says: 'The machines that keep the crew alive: making air, cleaning water and keeping them warm.' },
  { term: 'Moon dirt', also: ['regolith'], says: 'The grey dust and broken rock that covers the Moon. Scientists call it regolith.' },
  { term: 'calories', says: 'A way to count how much energy food gives your body.' },
  { term: 'kilowatts', also: ['kilowatt'], says: 'A way to measure power. A kettle uses about 2 kilowatts.' },
  { term: 'μGy', also: ['micro-gray'], says: 'Micro-gray: a tiny unit scientists use to measure a radiation dose.' },
  { term: 'Mission Control', says: 'The team on Earth that helps astronauts. They talk by radio.' },
];

/** All spellings, longest first, for matching. */
export const GLOSS_KEYS = GLOSSARY.flatMap((g) => [g.term, ...(g.also || [])].map((k) => ({ k, g })))
  .sort((a, b) => b.k.length - a.k.length);
