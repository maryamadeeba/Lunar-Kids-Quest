import { useState } from 'react';
import ChanduMascot from '../components/ChanduMascot.jsx';
import Icon from '../components/Icon.jsx';
import { TopRow } from './CommanderSetup.jsx';
import { getCommander } from '../lib/storage.js';
import { go } from '../lib/router.js';
import { playSound } from '../lib/sound.js';

const CREW = [
  { name: 'Amina', role: 'Engineer', icon: 'wrench', img: '/assets/crew-amina.webp', alt: 'Amina in a space suit, holding a wrench', bg: 'var(--yellow)', shadow: 'var(--yellow-dark)', ring: '#FFF4C2', hi: 'Amina: I fix things with my wrench!' },
  { name: 'Bilal', role: 'Scientist', icon: 'atom', img: '/assets/crew-bilal.webp', alt: 'Bilal in a space suit, holding a tablet', bg: 'var(--sky)', shadow: 'var(--sky-dark)', ring: '#D7F0FF', hi: 'Bilal: I look for ice on the Moon!' },
  { name: 'Zoya', role: 'Botanist', icon: 'leaf', img: '/assets/crew-zoya.webp', alt: 'Zoya in a space suit, holding a small plant', bg: 'var(--green)', shadow: 'var(--green-dark)', ring: '#C8F5C2', hi: 'Zoya: I grow plants in space!' },
];

export default function Crew() {
  const { name } = getCommander();
  const [says, setSays] = useState('Tap a friend to say hi!');
  return (
    <div className="screen">
      <div className="pad">
        <TopRow onBack={() => go('commander')} step={2} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ChanduMascot mood="cheer" size={80} animate="a-hop" />
          <div className="speech" aria-live="polite" style={{ flex: 1, padding: '12px 16px' }}>
            <h1 className="display" style={{ fontSize: 22, lineHeight: '26px' }}>{name.trim() ? `Welcome, Commander ${name.trim()}!` : 'Welcome, Commander!'}</h1>
            <div style={{ fontSize: 16, color: '#5B41B8' }}>{says}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CREW.map((p, i) => (
            <button key={p.name} type="button" className="btn a-rise" onClick={() => { playSound('pick'); setSays(p.hi); }}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 26, background: p.bg, boxShadow: `0 6px 0 ${p.shadow}`, justifyContent: 'flex-start', gap: 14, textAlign: 'left', animationDelay: `${i * 0.15}s` }}>
              <span style={{ flex: 'none', width: 84, height: 84, borderRadius: '50%', overflow: 'hidden', background: p.ring, border: '4px solid #fff' }}>
                <img src={p.img} alt={p.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="display" style={{ fontSize: 28, lineHeight: '30px' }}>{p.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 16, fontFamily: 'var(--font-body)' }}>
                  <Icon name={p.icon} size={18} /> {p.role}
                </span>
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-yellow" style={{ marginTop: 'auto', height: 72, fontSize: 26 }} onClick={() => { playSound('click'); go('map'); }}>
          To the Moon Map <Icon name="next" size={28} stroke={3} />
        </button>
      </div>
    </div>
  );
}
