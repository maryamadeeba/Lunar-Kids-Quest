import { useState } from 'react';
import ChanduMascot from '../components/ChanduMascot.jsx';
import Icon from '../components/Icon.jsx';
import Stage from '../components/Stage.jsx';
import Sheet from '../components/Sheet.jsx';
import { Earth, Stars } from '../components/MoonParts.jsx';
import { go } from '../lib/router.js';
import { playSound } from '../lib/sound.js';

export default function Welcome() {
  const [help, setHelp] = useState(false);
  return (
    <div className="screen">
      <Stage height={470}>
        <svg aria-hidden="true" viewBox="0 0 390 470" style={{ position: 'absolute', inset: 0, width: 390, height: 470 }}>
          <Stars dots={[[28, 40, 2.2, '#fff', 1], [72, 128, 1.6, '#fff'], [118, 22, 2, '#FFD21F', 1], [24, 236, 1.8, '#fff'], [352, 42, 2.4, '#fff', 1], [300, 96, 1.5, '#fff'], [366, 262, 2.4, '#43D13A', 1], [250, 136, 1.6, '#fff'], [92, 258, 2.2, '#FF8FB8', 1], [196, 140, 1.8, '#fff', 1]]} />
          <Earth cx={345} cy={168} r={52} />
          <path d="M0 440 Q195 390 390 440 L390 470 L0 470Z" fill="#6B7080" />
          <path d="M0 440 Q195 390 390 440" stroke="#9AA0AC" strokeWidth="5" fill="none" />
          <line x1="56" y1="420" x2="56" y2="404" stroke="#D9CEFF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="56" cy="403" r="3.5" fill="#FFD21F" />
          <path d="M14 458 A42 42 0 0 1 98 458Z" fill="#fff" />
          <rect x="46" y="432" width="18" height="26" rx="9" fill="#7758D9" />
          <circle cx="82" cy="442" r="7" fill="#4FC3F7" stroke="#121B3B" strokeWidth="2.5" />
          <circle cx="30" cy="442" r="7" fill="#4FC3F7" stroke="#121B3B" strokeWidth="2.5" />
          <line x1="296" y1="430" x2="296" y2="408" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M296 408 l16 6 -16 6z" fill="#FFD21F" />
          <path d="M326 428 q2 -18 18 -18 q14 0 16 18z" fill="#43D13A" />
          <rect x="286" y="426" width="84" height="26" rx="11" fill="#FF6FA5" />
          <rect x="286" y="440" width="84" height="6" fill="#FFD21F" />
          <path d="M300 429 l5 5 -5 5 -5 -5z M316 429 l5 5 -5 5 -5 -5z" fill="#4FC3F7" />
          <circle cx="300" cy="456" r="9" fill="#121B3B" stroke="#4FC3F7" strokeWidth="3" />
          <circle cx="328" cy="457" r="9" fill="#121B3B" stroke="#4FC3F7" strokeWidth="3" />
          <circle cx="356" cy="456" r="9" fill="#121B3B" stroke="#4FC3F7" strokeWidth="3" />
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 30, width: 390, display: 'flex', justifyContent: 'center' }}>
          <Logo />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 134, width: 390, display: 'flex', justifyContent: 'center' }}>
          <div className="display" style={{ background: '#fff', color: 'var(--navy)', borderRadius: 22, padding: '10px 18px', fontSize: 20, lineHeight: '24px', boxShadow: '0 5px 0 rgba(0,0,0,0.22)' }}>Salam! Ready to fly?</div>
        </div>
        <ChanduMascot mood="happy" size={180} style={{ position: 'absolute', left: 105, top: 196 }} />
      </Stage>

      <div className="pad" style={{ background: 'var(--moon-dark)', paddingTop: 6 }}>
        <h1 className="display" style={{ fontSize: 36, lineHeight: '38px', textAlign: 'center' }}>Your Moon Adventure <span style={{ color: 'var(--yellow)' }}>Starts Here!</span></h1>
        <p style={{ margin: 0, fontWeight: 800, fontSize: 18, lineHeight: '24px', textAlign: 'center' }}>Explore. Solve. Lead your crew!</p>
        <button type="button" className="btn btn-yellow a-glowbtn" style={{ height: 74, fontSize: 28 }} onClick={() => { playSound('click'); go('commander'); }}>
          <Icon name="rocket" size={30} stroke={2.3} />
          Let’s Launch!
        </button>
        <button type="button" className="btn btn-white" style={{ fontSize: 20 }} onClick={() => setHelp(true)}>
          <span aria-hidden="true" style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>?</span>
          How to Play
        </button>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 13, lineHeight: '17px', textAlign: 'center' }}>A made-up mission built on real NASA science. The crew pictures are AI-generated and marked “AI-generated”.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => go('data')} style={{ background: 'none', border: 0, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }}>Real NASA data we used</button>
          <button type="button" onClick={() => go('grownups')} style={{ background: 'none', border: 0, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }}>For grown-ups and teachers</button>
        </div>
      </div>

      {help && (
        <Sheet label="How to play">
          <h2 className="display" style={{ fontSize: 32, lineHeight: '36px', textAlign: 'center' }}>How to Play</h2>
          <HelpRow bg="var(--yellow-soft)" dot="var(--yellow)" icon="person" text="Meet your crew" />
          <HelpRow bg="var(--sky-soft)" dot="var(--sky)" label="1+2" text="Solve Moon puzzles" />
          <HelpRow bg="var(--pink-soft)" dot="var(--pink)" icon="scale" text="Make smart choices" />
          <button type="button" className="btn btn-yellow" style={{ height: 68, fontSize: 26 }} onClick={() => setHelp(false)}>Got it!</button>
        </Sheet>
      )}
    </div>
  );
}

function HelpRow({ bg, dot, icon, label, text }) {
  return (
    <div style={{ padding: '12px 16px', background: bg, borderRadius: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div className="display" style={{ flex: 'none', width: 54, height: 54, borderRadius: '50%', background: dot, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
        {icon ? <Icon name={icon} size={30} stroke={2.3} /> : label}
      </div>
      <div className="display" style={{ fontSize: 22, lineHeight: '26px' }}>{text}</div>
    </div>
  );
}

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg aria-hidden="true" viewBox="0 0 40 40" style={{ width: 44, height: 44 }}>
        <circle cx="20" cy="20" r="18" fill="#FFD21F" />
        <circle cx="27" cy="15" r="15" fill="#1C1F63" />
        <path d="M30 22 l1.6 3.6 3.6 1.6 -3.6 1.6 -1.6 3.6 -1.6 -3.6 -3.6 -1.6 3.6 -1.6z" fill="#43D13A" />
      </svg>
      <div>
        <div className="display" style={{ fontSize: 15, letterSpacing: 6, lineHeight: '16px', color: 'var(--sky)' }}>LUNAR</div>
        <div className="display" style={{ fontSize: 32, lineHeight: '32px' }}>Kids Quest</div>
      </div>
    </div>
  );
}
