import Icon from '../components/Icon.jsx';
import { go } from '../lib/router.js';

const MISSIONS = [
  ['Mission 1: Find Our Moon Home', 'Choosing a site: sunlight for power vs ice for water. Uses NASA’s real Artemis III landing plan.'],
  ['Mission 2: Save Our Oxygen', 'Making air costs power AND water; exercise costs power but protects bones. A long shadow cuts the power.'],
  ['Mission 3: Grow Food on the Moon', 'Plants cost water and power today; the lettuce only arrives a month later (like on the Space Station).'],
  ['Final: A Moon Stay', 'A real 2024 solar storm with its real warning time. Science vs radiation safety, food vs shelter repairs in the dark.'],
  ['Mars mode (after the Final)', 'The same storm, but Mission Control is 6 to 44 minutes away. Kids must decide on their own.'],
];
const QUESTIONS = [
  'In the storm, was it worth leaving someone outside for more science? What would a real commander choose, and why?',
  'Your plant lamps used water today but gave food a month later. Can you think of a choice in your own life that pays off later?',
  'On Mars, Mission Control answers 6 to 44 minutes later. What jobs should a Mars crew practise doing on their own?',
];

/** For grown-ups and teachers: what kids learn, how to use it in class, privacy. */
export default function GrownUps() {
  return (
    <div className="screen scroll">
      <div className="pad" style={{ gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" className="btn btn-back" aria-label="Back to the Moon Map" onClick={() => go('map')}><Icon name="back" size={26} color="#1C1F63" stroke={3} /></button>
          <h1 className="display" style={{ fontSize: 26, lineHeight: '29px' }}>For grown-ups and teachers</h1>
        </div>
        <button className="btn btn-yellow" onClick={() => go('playtest')}>Prepare a child playtest</button>
        <div className="card" style={{ fontWeight: 700, fontSize: 15, lineHeight: '21px' }}>
          <b>Lunar Kids Quest</b> is a Moon-base trainer for ages 7–12. Every choice is a trade-off, like real mission planning: power vs air vs water, science vs radiation safety, today vs later. The science comes from NASA and the Canadian Space Agency (see <button type="button" onClick={() => go('data')} style={{ font: 'inherit', fontWeight: 800, color: '#3D2A8A', background: 'none', border: 0, padding: 0, textDecoration: 'underline', cursor: 'pointer' }}>Real data we used</button>).
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 className="display" style={{ fontSize: 20 }}>What kids practise</h2>
          {MISSIONS.map(([t, d]) => <div key={t} style={{ fontSize: 15, lineHeight: '21px' }}><b>{t}.</b> {d}</div>)}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15, lineHeight: '21px', fontWeight: 600 }}>
          <h2 className="display" style={{ fontSize: 20 }}>Play it your way</h2>
          <div><b>Younger players (7–9):</b> Explorer level gives more time and shows hints after a mistake. Every message and card has a 🔊 read-aloud button. Tap any underlined word to hear what it means.</div>
          <div><b>Older siblings and parents:</b> Commander level gives less time, a longer radio delay to Mission Control, and no hints. Then try Mars mode.</div>
          <div><b>In class:</b> open the game on a laptop or projector: missions show the Moon base on the left and the controls on the right. Let the class vote on each choice. The clock pauses while a NASA card is open, which is a good moment to discuss.</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 className="display" style={{ fontSize: 20 }}>Questions to talk about</h2>
          {QUESTIONS.map((q, i) => <div key={q} style={{ fontSize: 15, lineHeight: '21px', fontWeight: 600 }}><b>{i + 1}.</b> {q}</div>)}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15, lineHeight: '21px', fontWeight: 600 }}>
          <h2 className="display" style={{ fontSize: 20 }}>Privacy</h2>
          <div>No account, no ads, no purchases, no chat. Progress and a nickname are saved on this device. An adult can optionally save anonymous playtest notes on this device. Read-aloud uses the device’s own voice.</div>
          <div>The game asks NASA’s public DONKI service how many space storms happened in the last 30 days, and may load one NASA photo. Nothing about the child is sent.</div>
          <div>Failing is safe: a mission abort shows the real Apollo 13 story and lets kids try again.</div>
        </div>
        <button type="button" className="btn btn-yellow" style={{ height: 64, fontSize: 22 }} onClick={() => go('map')}>Back to Moon Map</button>
      </div>
    </div>
  );
}
