import FlashcardDeck from './FlashcardDeck.jsx';
import MachineAnimation from './MachineAnimation.jsx';
import Sheet from './Sheet.jsx';
import { machineKind } from '../lib/visualLearning.js';
import { itemBlocked } from '../lib/missionLogic.js';
import { childText } from '../lib/learning.js';

const STORIES = {
  air: 'Power and water go in. Fresh air comes out.',
  recycle: 'A powered filter cleans used water. We can use it again!',
  garden: 'Plants need light and care. Look at when this machine gives food.',
  ice: 'Getting ice takes power. Ice can help supply water.',
  heat: 'The heater uses power to keep our crew warm.',
  radio: 'The radio uses power. Earth’s reply takes time to travel.',
  battery: 'Save some power now. It can help during darkness.',
  shelter: 'Use power to improve protection. Radiation does not eat the walls.',
  science: 'Science makes discoveries. Its power cannot run another machine.',
  fitness: 'Our crew needs exercise. The bike needs power too.',
};
export default function EquipmentCards({ items, round, onClose }) {
  const cards = items.map(item => ({ title: item.name, visual: <MachineAnimation item={item} running />, back: STORIES[machineKind(item)], caption: itemBlocked(item, round) || undefined, details: item.note && <p>{childText(item.note)}</p> }));
  return <Sheet label="Inside our machines" fixed><button className="btn btn-soft" onClick={onClose}>× Back to controls</button><FlashcardDeck cards={cards} kicker="LOOK INSIDE · CLOCK PAUSED" onDone={onClose} doneLabel="Back to controls" /></Sheet>;
}
