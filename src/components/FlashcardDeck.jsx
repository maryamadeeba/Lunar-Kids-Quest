import EmphasizeNumbers from './EmphasizeNumbers.jsx';
import { useEffect, useRef, useState } from 'react';
import SpeakButton from './SpeakButton.jsx';
import MachineAnimation from './MachineAnimation.jsx';
import { changeClass, resourceIcon, resourceName, transitions } from '../lib/learning.js';

export function ResourceTiles({ before = {}, after = {}, cells = 0, neutral = false }) {
  const tone = (cls) => (neutral ? 'chip-info' : cls);
  const changes = transitions(before, after);
  return <div className="picture-resources" aria-live="polite" aria-atomic="true">
    {cells > 0 && <div className={`picture-resource ${tone('tradeoff-loss')}`}><span aria-hidden="true">🔋</span><b>−{cells}</b><small>cells used</small></div>}
    {changes.map(x => <div className={`picture-resource ${tone(changeClass(x.delta))}`} key={x.key}><span aria-hidden="true">{resourceIcon(x.key)}</span><b>{x.from} → {x.to}</b><small>{resourceName(x.key)} (<strong className="result-number">{x.delta > 0 ? '+' : '−'}{Math.abs(x.delta)}</strong>)</small></div>)}
    {!changes.length && <div className="picture-resource"><span aria-hidden="true">⚖️</span><b>Steady</b><small>Our meters stayed level</small></div>}
  </div>;
}

/** Only the visible face is mounted: hidden text never enters the keyboard path. */
export default function FlashcardDeck({ cards, onDone, endExtra = null, start = 0, doneLabel = 'Back to my mission', label = 'Mission flashcards', kicker = 'LOOK · FLIP · DISCOVER' }) {
  const [index, setIndex] = useState(start);
  const [back, setBack] = useState(false);
  const face = useRef(null);
  const moved = useRef(false);
  const card = cards[Math.min(index, cards.length - 1)];
  useEffect(() => { if (moved.current) face.current?.focus(); moved.current = true; }, [index, back]);
  const move = n => { setBack(false); setIndex(n); };
  return <section className="flash-deck" aria-label={label}>
    <div className="flash-top"><span className="learning-eyebrow">{card.kicker || kicker}</span><span className="flash-top-right"><span className="flash-count" aria-live="polite">{index + 1} / {cards.length}</span>{index + 1 < cards.length && <button type="button" className="flash-skip" onClick={onDone} aria-label={`Skip the cards: ${doneLabel}`}>Skip ⏭</button>}</span></div>
    <div className={`flash-face ${back ? 'flash-back' : 'flash-front'}`} key={`${index}-${back}`} ref={face} tabIndex={-1} role="group" aria-label={`${back ? 'Back' : 'Picture'} of card ${index + 1}: ${card.title}`}>
      <h2 className="display">{card.title}</h2>
      {back ? <><div className="flash-explanation"><p><EmphasizeNumbers text={card.back} /></p><SpeakButton text={card.back} label="Read the back of this card aloud" light /></div>{card.backVisual}{card.details && <details className="flash-source"><summary>More for curious explorers & grown-ups</summary>{card.details}</details>}</>
        : <>{card.visual || <MachineAnimation item={card.item} kind={card.kind} running />}{card.caption && <p className="flash-caption"><EmphasizeNumbers text={card.caption} /></p>}</>}
    </div>
    <button className="btn btn-soft flash-flip" aria-pressed={back} onClick={() => setBack(v => !v)}>{back ? '↶ Show picture' : '↻ Flip for the story'}</button>
    <nav className="flash-navigation" aria-label="Flashcard navigation"><button className="btn btn-white" disabled={index === 0} onClick={() => move(index - 1)} aria-label="Previous card">←</button><div className="flash-dots" aria-hidden="true">{cards.map((_, i) => <i className={i === index ? 'current' : ''} key={i} />)}</div><button className="btn btn-yellow" onClick={() => index + 1 < cards.length ? move(index + 1) : onDone()}>{index + 1 < cards.length ? 'Next card →' : doneLabel}</button></nav>
    {index + 1 === cards.length && endExtra}
  </section>;
}
