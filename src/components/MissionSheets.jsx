import FlashcardDeck from './FlashcardDeck.jsx';
import { MachineDrawing } from './MachineAnimation.jsx';
import { scienceStory } from '../lib/visualLearning.js';
import Sheet from './Sheet.jsx';
import SpeakButton from './SpeakButton.jsx';
import GlossText from './GlossText.jsx';
import { StarIcon } from './Icon.jsx';
import { APOLLO13 } from '../data/mission1.js';
import { formatClock } from '../hooks/useMissionClock.js';

/** Rules screen shown before the mission clock starts. */
export function ReadySheet({ kicker, title, realLine, story, goal, clockSeconds, lifeText, steps = [], onStart, startLabel = 'Start the clock!', base }) {
  const primary = scienceStory(title);
  const theme = primary.kind === 'science' ? scienceStory(story) : primary;
  const cards = [
    { title: title, visual: <div className="briefing-picture"><MachineDrawing kind={theme.kind} running /><img src="/assets/crew-full.webp" alt="Amina, Bilal, and Zoya" /></div>, back: 'Our crew needs your help. Choose a plan and watch what happens.', details: <><p>{story}</p>{realLine && <p>{realLine}</p>}{base}</> },
    { title: 'Keep our crew safe', visual: <><div className="crew-needs"><span>🫧</span><span>💧</span><span>🔋</span><span>🛡️</span></div><strong className="flash-caption">{lifeText}</strong></>, back: 'Keep these crew supplies above zero. Every machine shares the battery.', details: goal && <p>{goal}</p> },
    { title: 'Ready to try?', visual: <div className="ready-picture"><span>👆</span><span>⚙️</span><span>🌙</span></div>, back: 'Pick a plan. Count the cells. Watch our base run!', caption: `${formatClock(clockSeconds)} · mission clock`, details: <><p>The clock pauses for flashcards and math. Chandu’s ? gives a hint. The headset calls Earth, with the original communication delay.</p>{steps.map(step => <p key={step}>{step}</p>)}</> },
  ];
  return <Sheet label="Mission briefing flashcards" fixed><FlashcardDeck cards={cards} kicker={kicker} onDone={onStart} doneLabel={startLabel} /></Sheet>;
}

function RuleTile({ big, small, bg, bigSize = 20 }) {
  return (
    <div style={{ padding: '8px 6px', borderRadius: 16, background: bg, textAlign: 'center' }}>
      <div className="display" style={{ fontSize: bigSize, lineHeight: '22px' }}>{big}</div>
      <div style={{ fontWeight: 800, fontSize: 13, lineHeight: '16px' }}>{small}</div>
    </div>
  );
}

/** "Think like an engineer": the child names what they gave up. */
export function ReflectSheet({ question, options, right, picked, ok, onPick, onDone, doneLabel }) {
  const feedback = ok
    ? 'Yes! You gave up one thing to protect another. That is a trade-off, and NASA engineers make them every day.'
    : picked ? 'Good try! Think back: what went down when you made your choice?' : 'Tap your answer.';
  return (
    <Sheet label="Think like an engineer">
      <div className="pill" style={{ alignSelf: 'flex-start', background: 'var(--green)', letterSpacing: 1, fontSize: 13 }}>THINK LIKE AN ENGINEER</div>
      <h2 className="display" style={{ fontSize: 23, lineHeight: '28px' }}>{question}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((label) => {
          const isPicked = picked === label;
          const good = isPicked && label === right;
          const bad = isPicked && label !== right;
          return (
            <button key={label} type="button" className={`btn ${bad ? 'a-shake' : ''}`} onClick={() => onPick(label)}
              style={{ height: 56, borderRadius: 20, fontSize: 19, background: good ? 'var(--green-soft)' : bad ? 'var(--pink-soft)' : '#EEF0FF', border: `3px solid ${good ? 'var(--green)' : bad ? '#FF6FA5' : '#EEF0FF'}` }}>
              {label}
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="muted" style={{ minHeight: 22, fontWeight: 700, fontSize: 15, lineHeight: '21px' }}>{feedback}</div>
      {ok && <button type="button" className="btn btn-yellow a-pop" style={{ height: 62, fontSize: 22 }} onClick={onDone}>{doneLabel}</button>}
    </Sheet>
  );
}

/** Kind, non-shaming abort screen with a real NASA story. */
export function AbortSheet({ reason, onRetry, onRewind, onMap }) {
  const titles = { time: 'The mission clock ran out!', o: 'Oxygen ran out!', w: 'Water ran out!', p: 'Power ran out!', h: 'The crew got too cold!', f: 'Food ran out!', s: 'Crew got too much radiation' };
  const texts = {
    time: 'Mission Control called the crew back to safety. Try to decide a little faster next time. You can do it!',
    o: 'The crew needs air all day long. The Oxygen maker is life support, so it must stay on.',
    w: 'The crew drinks water every day. Water is for the crew first, then for plants and machines.',
    p: 'Without power, nothing works. Keep some battery cells for the base.',
    h: 'Moon darkness is freezing. The Heater is life support in the dark.',
    f: 'The crew eats every day. Packed food runs out, so the Greenhouse matters on a long stay.',
    s: 'Solar storm particles pass through the body. When a storm comes, real crews take shelter.',
  };
  const kind = reason === 's' ? 'shelter' : reason === 'f' ? 'garden' : reason === 'h' ? 'heat' : reason === 'w' ? 'recycle' : reason === 'o' ? 'air' : 'battery';
  const cards = [
    { title: 'Our crew is safe', kind, back: texts[reason] || 'A crew supply ran out. We can try a different plan.', caption: titles[reason] || 'This plan needs a change.' },
    { title: 'Engineers try again', visual: <img className="report-crew" src="/assets/crew-full.webp" alt="The crew is safe and ready to try again" />, back: 'That plan didn’t work this time. Testing ideas helps us learn.', details: <><p>{APOLLO13.text}</p><a href={APOLLO13.link.href} target="_blank" rel="noreferrer">{APOLLO13.link.label} ↗</a></> },
  ];
  return <Sheet label="Mission abort flashcards" fixed><FlashcardDeck cards={cards} kicker="SAFE TO TRY AGAIN" onDone={onRetry} doneLabel="Try the mission again" />{onRewind && <button className="btn btn-soft" onClick={onRewind}>⏪ Engineer’s rewind: change one thing</button>}<button className="btn btn-soft" onClick={onMap}>Back to Moon Map</button></Sheet>;
}

/** Small "+1 star" pop-up. */
export function StarToast({ text, top = 96 }) {
  if (!text) return null;
  return (
    <div className="a-pop" role="status" style={{ position: 'absolute', left: 50, right: 50, top, height: 40, borderRadius: 20, background: 'var(--yellow)', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, whiteSpace: 'nowrap', boxShadow: '0 5px 0 var(--yellow-dark)', zIndex: 70 }}>
      <StarIcon size={22} color="#121B3B" />
      {text}
    </div>
  );
}
