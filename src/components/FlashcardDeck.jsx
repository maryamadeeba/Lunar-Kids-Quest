import EmphasizeNumbers from './EmphasizeNumbers.jsx';
import { useEffect, useRef, useState } from 'react';
import SpeakButton from './SpeakButton.jsx';
import MachineAnimation from './MachineAnimation.jsx';
import { changeClass, resourceIcon, resourceName, transitions, resultWords } from '../lib/learning.js';

export function ResourceTiles({ before = {}, after = {}, cells = 0, total = 0, neutral = false }) {
  const changes = transitions(before, after);
  const tone = (cls) => (neutral ? 'chip-info' : cls);
  return <div className="picture-resources" aria-live="polite" aria-atomic="true">
    {cells > 0 && <BatteryLeft used={cells} total={total} />}
    {changes.map(x => <div className={`picture-meter ${tone(changeClass(x.delta))}`} key={x.key} role="img" aria-label={resultWords(x.key, x.delta)}>
      <span className="pm-icon" aria-hidden="true">{resourceIcon(x.key)}</span>
      <span className="pm-body"><b>{x.delta > 0 ? '▲' : '▼'} {resultWords(x.key, x.delta)}</b>
        <span className="pm-bar" aria-hidden="true"><i style={{ width: `${Math.max(0, Math.min(10, x.to)) * 10}%` }} /></span></span>
    </div>)}
    {!changes.length && <div className="picture-meter tradeoff-neutral"><span className="pm-icon" aria-hidden="true">⚖️</span><span className="pm-body"><b>Supplies stayed steady</b></span></div>}
  </div>;
}

/** The battery as cells: yellow = left, grey = used. */
export function BatteryLeft({ used = 0, total = 0 }) {
  const left = Math.max(0, total - used);
  return <div className="picture-meter battery-left" role="img" aria-label={total ? `${left} battery ${left === 1 ? 'cell' : 'cells'} left` : `${used} battery cells used`}>
    <span className="pm-icon" aria-hidden="true">🔋</span>
    <span className="pm-body"><b>{total ? `${left} battery ${left === 1 ? 'cell' : 'cells'} left` : `Used ${used} battery cells`}</b>
      {total > 0 && <span className="cells-row" aria-hidden="true">{Array.from({ length: total }, (_, i) => <i key={i} className={i < left ? 'left' : ''} />)}</span>}</span>
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
      {back ? <><div className="flash-explanation"><div>{card.backTitle && <strong className="did-notice">{card.backTitle}</strong>}<p><EmphasizeNumbers text={card.back} /></p></div><SpeakButton text={[card.backTitle, card.back].filter(Boolean).join(' ')} label="Read the back of this card aloud" light /></div>{card.backVisual}{card.details && <details className="flash-source"><summary>More for curious explorers & grown-ups</summary>{card.details}</details>}</>
        : <>{card.visual || <MachineAnimation item={card.item} kind={card.kind} running />}{card.caption && <p className="flash-caption"><EmphasizeNumbers text={card.caption} /></p>}</>}
    </div>
    <button className="btn btn-soft flash-flip" aria-pressed={back} onClick={() => setBack(v => !v)}>{back ? '↶ Show picture' : '↻ Flip for the story'}</button>
    <nav className="flash-navigation" aria-label="Flashcard navigation"><button className="btn btn-white" disabled={index === 0} onClick={() => move(index - 1)} aria-label="Previous card">←</button><div className="flash-dots" aria-hidden="true">{cards.map((_, i) => <i className={i === index ? 'current' : ''} key={i} />)}</div><button className="btn btn-yellow" onClick={() => index + 1 < cards.length ? move(index + 1) : onDone()}>{index + 1 < cards.length ? 'Next card →' : doneLabel}</button></nav>
    {index + 1 === cards.length && endExtra}
  </section>;
}
