import FlashcardDeck from '../components/FlashcardDeck.jsx';
import { MachineDrawing } from '../components/MachineAnimation.jsx';
import { go } from '../lib/router.js';

export default function Briefing() {
  const cards = [
    { title: 'Where should we build?', kind: 'site', back: 'A sunny ridge gives power. A shadowed crater keeps ice cold. Visit both!', caption: 'Two places. Two different strengths.' },
    { title: 'You choose our Moon home', visual: <><MachineDrawing kind="site" running /><img className="briefing-crew" src="/assets/crew-full.webp" alt="Amina, Bilal and Zoya need a safe Moon home" /></>, back: 'Choose a home. Help the lowest tank. Power the base.', caption: 'Pretend mission · real NASA problem' },
  ];
  return <div className="screen flash-screen"><h1 className="sr-only">Mission 1 briefing</h1><button className="btn btn-back" aria-label="Back to the Moon Map" onClick={() => go('map')}>←</button><FlashcardDeck cards={cards} kicker="MISSION 1 OF 4" onDone={() => go('mission1')} doneLabel="Start Mission!" /></div>;
}
