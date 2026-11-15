import { useState } from 'react';
import ChanduMascot from '../components/ChanduMascot.jsx';
import Icon from '../components/Icon.jsx';
import { getCommander, saveCommander } from '../lib/storage.js';
import { SUITS, suitBust } from '../data/mission1.js';
import { go } from '../lib/router.js';
import { playSound } from '../lib/sound.js';

const NAME_IDEAS = [['Star', '#FFF4C2'], ['Rocket', '#D7F0FF'], ['Comet', '#FFE0EC'], ['Chand', '#E6E0FF']];

export default function CommanderSetup() {
  const [c, setC] = useState(getCommander());
  const update = (next) => {
    const merged = { ...c, ...next };
    setC(merged);
    saveCommander(merged);
  };
  const ex = c.level === 'explorer';

  return (
    <div className="screen">
      <div className="pad">
        <TopRow onBack={() => go('welcome')} step={1} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ChanduMascot mood="happy" size={76} />
          <h1 className="speech display" style={{ flex: 1, fontSize: 24, lineHeight: '28px', padding: '14px 16px' }}>Hi! What should I call you?</h1>
        </div>

        <div className="card" style={{ padding: 18, borderRadius: 30, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label htmlFor="nick" className="display" style={{ fontSize: 20 }}>Your nickname</label>
            <input
              id="nick"
              type="text"
              maxLength={12}
              autoComplete="off"
              placeholder="Type here…"
              value={c.name}
              onChange={(e) => update({ name: e.target.value.slice(0, 12) })}
              style={{ height: 60, padding: '0 18px', background: '#F3F4FF', color: 'var(--navy)', border: '3px solid var(--purple)', borderRadius: 20, fontWeight: 800, fontSize: 22, fontFamily: 'var(--font-body)' }}
            />
            <div style={{ fontWeight: 800, fontSize: 14 }} className="muted">No real names, please! Or tap one:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
              {NAME_IDEAS.map(([n, bg]) => (
                <button key={n} type="button" className="btn" style={{ height: 46, borderRadius: 23, background: bg, fontSize: 17 }} onClick={() => { playSound('pick'); update({ name: n }); }}>{n}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="display" style={{ fontSize: 20 }}>Pick your suit</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {SUITS.map((s) => (
                <div key={s} style={{ position: 'relative', width: 72, height: 72 }}>
                  <button type="button" className="btn" aria-label={`${s} suit`} aria-pressed={c.suit === s} onClick={() => { playSound('pick'); update({ suit: s }); }}
                    style={{ width: 72, height: 72, padding: 0, borderRadius: '50%', overflow: 'hidden', background: 'var(--indigo-2)', border: `5px solid ${c.suit === s ? 'var(--yellow)' : '#E3E5F6'}` }}>
                    <img src={suitBust(s)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                  {c.suit === s && (
                    <span style={{ position: 'absolute', right: -4, bottom: -4, width: 28, height: 28, borderRadius: '50%', background: 'var(--yellow)', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <Icon name="check" size={18} stroke={3} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="display" style={{ fontSize: 20 }}>How old are you?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              <LevelButton on={ex} big="7–9" small="Explorer" color="var(--sky)" border="var(--sky-dark)" onClick={() => update({ level: 'explorer' })} />
              <LevelButton on={!ex} big="10–12" small="Commander" color="var(--pink)" border="var(--pink-dark)" onClick={() => update({ level: 'commander' })} />
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-yellow" style={{ marginTop: 'auto', height: 72, fontSize: 26 }} onClick={() => { playSound('click'); go('crew'); }}>
          Meet Your Crew <Icon name="next" size={28} stroke={3} />
        </button>
      </div>
    </div>
  );
}

function LevelButton({ on, big, small, color, border, onClick }) {
  return (
    <button type="button" className="btn" aria-pressed={on} onClick={() => { playSound('pick'); onClick(); }}
      style={{ height: 70, borderRadius: 22, background: on ? color : '#fff', border: `3px solid ${on ? border : '#D5D8F0'}`, flexDirection: 'column', gap: 0 }}>
      <span className="display" style={{ fontSize: 26, lineHeight: '28px' }}>{big}</span>
      <span style={{ fontWeight: 800, fontSize: 14, fontFamily: 'var(--font-body)' }}>{small}</span>
    </button>
  );
}

export function TopRow({ onBack, step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button type="button" className="btn btn-back" aria-label="Back" onClick={onBack}><Icon name="back" size={26} color="#1C1F63" stroke={3} /></button>
      <div role="img" aria-label={`Step ${step} of 2`} style={{ display: 'flex', gap: 8 }}>
        <div style={{ width: step === 1 ? 34 : 12, height: 12, borderRadius: 6, background: 'var(--yellow)' }} />
        <div style={{ width: step === 2 ? 34 : 12, height: 12, borderRadius: 6, background: step === 2 ? 'var(--yellow)' : 'var(--indigo-3)' }} />
      </div>
      <div style={{ width: 50 }} />
    </div>
  );
}
