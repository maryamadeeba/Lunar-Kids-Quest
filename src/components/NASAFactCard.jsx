import FlashcardDeck, { ResourceTiles } from './FlashcardDeck.jsx';
import MachineAnimation, { MachineDrawing } from './MachineAnimation.jsx';
import { machineKind } from '../lib/visualLearning.js';
import { scienceStory } from '../lib/visualLearning.js';
import Sheet from './Sheet.jsx';
import Icon from './Icon.jsx';
import SpeakButton from './SpeakButton.jsx';
import GlossText from './GlossText.jsx';
import NasaPhoto, { SHACKLETON, CURIOSITY } from './NasaPhoto.jsx';

/** Split long text into a short part (about `words` words, whole sentences) and the rest. */
export function splitShort(text, words = 40) {
  const sentences = String(text || '').match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) || [];
  let short = ''; let n = 0; let i = 0;
  for (; i < sentences.length; i++) {
    const w = sentences[i].trim().split(/\s+/).length;
    if (short && n + w > words) break;
    short += sentences[i]; n += w;
  }
  return { short: short.trim(), more: sentences.slice(i).join('').trim() };
}

/**
 * "Real NASA Mission" card shown right after a choice.
 * It puts the child's game choice next to the real NASA version.
 * Long text shows a short version first, with "Read more".
 */
export default function NASAFactCard({ title, you, real, more = '', links = [], photo = false, onClose, closeLabel = 'Back to my mission', kicker = 'REAL NASA MISSION', before, after, item }) {
  const primary = scienceStory(title);
  const story = primary.kind === 'science' ? scienceStory(real) : primary;
  const notes = <><h3>{title}</h3>{you && <p><b>Your choice:</b> {you}</p>}<p><GlossText text={real} /></p>{more && <p><GlossText text={more} /></p>}<div className="source-links">{links.map(l => <SourceLink key={l.label} link={l} />)}</div></>;
  const cards = [
    ...(before && after ? [{ title: 'Your plan changed our supplies', kicker: 'YOUR GAME · SIMPLIFIED UNITS', visual: <><ResourceTiles before={before} after={after} /><MachineDrawing kind={item ? machineKind(item) : story.kind} running /></>, back: 'Look at what went up and down. Machines and crew share our supplies.', details: you && <p>{you}</p> }] : []),
    { title: story.title, kind: story.kind, back: story.back, details: notes },
    ...(photo ? [{ title: 'A real NASA photograph', visual: <NasaPhoto height={210} photo={photo === 'mars' ? CURIOSITY : SHACKLETON} />, back: 'This photograph comes from NASA. Our game drawings are simplified.', details: notes }] : []),
  ];
  return <Sheet label="NASA discovery flashcards" fixed><FlashcardDeck key={title} cards={cards} kicker={kicker} onDone={onClose} doneLabel={closeLabel} /></Sheet>;
}

/** A source link. Sources without a web address (like a NASA briefing PDF) show as plain text. */
export function SourceLink({ link, size = 14 }) {
  if (!link.href) return <span style={{ fontWeight: 800, fontSize: Math.max(13, size), color: '#3D2A8A' }}>Source: {link.label}</span>;
  return <a href={link.href} target="_blank" rel="noreferrer" style={{ fontWeight: 800, fontSize: Math.max(13, size), color: '#3D2A8A' }}>{link.label} ↗</a>;
}
