import GlossText from '../components/GlossText.jsx';
import { SourceLink } from '../components/NASAFactCard.jsx';
import { PlannerDiscoveries } from '../components/LearningLab.jsx';
import { StrategyCollection } from '../components/SideQuests.jsx';
import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import Stage from '../components/Stage.jsx';
import { Earth, Stars } from '../components/MoonParts.jsx';
import { SolarFarm, OxygenTank, GreenhouseDome, Flag } from '../components/MissionMap.jsx';
import NumbersSheet from '../components/NumbersSheet.jsx';
import BaseStrip from '../components/BaseStrip.jsx';
import { readBase } from '../lib/missionLogic.js';
import { getCommander, getProgress, readJSON, removeKey, KEYS } from '../lib/storage.js';
import { MISSION_LIST, suitBust } from '../data/mission1.js';
import { go } from '../lib/router.js';

const B = {
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  bolt: 'M13 2.5L5 13.5h6L10 21.5l8-11h-6z',
  drop: 'M12 3c3.5 4.5 6 7.5 6 10.5a6 6 0 0 1-12 0C6 10.5 8.5 7.5 12 3z',
  plant: 'M12 21v-9M12 12c0-4 3-7 8-7 0 5-3 7-8 7zM12 15c0-3-2.5-5-7-5 0 4 2.5 5 7 5z',
  cup: 'M7 4h10v5a5 5 0 0 1-10 0zM7 6H4c0 3 1.5 4.5 3.5 5M17 6h3c0 3-1.5 4.5-3.5 5M12 14v4M8.5 20h7',
};

function streak(days) {
  if (!Array.isArray(days) || !days.length) return 0;
  const set = new Set(days);
  const d = new Date();
  const key = (x) => x.toISOString().slice(0, 10);
  if (!set.has(key(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(key(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export default function Dashboard() {
  const [, refresh] = useState(0);
  const [askReset, setAskReset] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const c = getCommander();
  const p = getProgress();
  const m1 = readJSON(KEYS.mission1);
  const done = MISSION_LIST.filter((m) => p[m.key]);
  const stars = MISSION_LIST.reduce((a, m) => a + (p[m.key + 'Stars'] || 0), 0);
  const xp = done.length * 50 + stars * 10;
  const days = Array.isArray(p.days) ? p.days.length : 0;
  const st = streak(p.days);
  const water = p.waterWizard === true || (m1.res && m1.res.w >= 6);
  const badges = [
    { name: 'Moon Explorer', icon: B.moon, color: '#D9CEFF', got: !!p.m1, how: 'Finish Mission 1' },
    { name: 'Power Planner', icon: B.bolt, color: '#FFD21F', got: !!p.m2, how: 'Finish Mission 2' },
    { name: 'Water Wizard', icon: B.drop, color: '#4FC3F7', got: water, how: 'End a mission with Water 6 or more' },
    { name: 'Space Gardener', icon: B.plant, color: '#43D13A', got: !!p.m3, how: 'Finish Mission 3' },
    { name: 'Junior Moon Commander', icon: B.cup, color: '#FF9F43', got: !!p.final, how: 'Finish the Final Mission' },
  ];
  const built = MISSION_LIST.map((m) => !!p[m.key]);
  const parts = [p.m1 ? (m1.site === 'crater' ? 'Ice Lab' : 'Solar Farm') : 'Solar Farm or Ice Lab', 'Oxygen Tank', 'Greenhouse Dome', 'Flag and crew'];
  const notes = Array.isArray(p.notebook) ? p.notebook.slice().reverse() : [];

  return (
    <div className="screen">
      <div className="pad" style={{ gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" className="btn btn-back" aria-label="Back to the Moon Map" onClick={() => go('map')}><Icon name="back" size={26} color="#1C1F63" stroke={3} /></button>
          <h1 className="display" style={{ fontSize: 28, lineHeight: '30px' }}>My Commander Log</h1>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 'none', width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', background: 'var(--indigo-2)', border: '4px solid var(--yellow)' }}>
              <img src={suitBust(c.suit)} alt="Your commander" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="display" style={{ fontSize: 25, lineHeight: '28px' }}>{c.name.trim() ? `Commander ${c.name.trim()}` : 'Commander'}</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#5B41B8' }}>{c.level === 'commander' ? 'Commander level (ages 10–12)' : 'Explorer level (ages 7–9)'}</div>
              <div><span className="display" style={{ fontSize: 30 }}>{xp}</span> <span style={{ fontWeight: 800 }}>XP</span></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
            <Stat big={`${done.length}/4`} small="Missions" />
            <Stat big={`${stars}/12`} small="Stars" />
            <Stat big={days} small="Explore days" bg="var(--pink-soft)" />
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 16, background: '#EEF0FF', fontWeight: 700, fontSize: 14, lineHeight: '20px' }}>
            {st >= 2 ? `You explored ${st} days in a row. Amazing! Come back whenever you like.` : days ? 'Your base is always here waiting for you. Come back any day you like!' : 'Start your first mission to fill your log!'}
          </div>
        </div>

        <PlannerDiscoveries />
        <StrategyCollection />
        <Section title="My badges">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {badges.map((b) => (
              <div key={b.name} style={{ padding: 12, minHeight: 120, borderRadius: 22, background: b.got ? '#fff' : '#C9CCEB', color: 'var(--navy)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: b.got ? b.color : '#C9CCEB', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={b.icon} size={28} stroke={2.2} /></div>
                <div className="display" style={{ fontSize: 17, lineHeight: '20px' }}>{b.name}</div>
                <div style={{ fontWeight: 800, fontSize: 13, lineHeight: '16px' }}>{b.got ? 'Earned!' : `Next: ${b.how}`}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="My Moon base" right={`${built.filter(Boolean).length} of 4 built`}>
          <div style={{ borderRadius: 24, overflow: 'hidden' }}>
            <Stage width={354} height={200} style={{ background: 'var(--navy)' }}>
              <svg aria-hidden="true" viewBox="0 0 354 200" style={{ position: 'absolute', inset: 0, width: 354, height: 200 }}>
                <Stars dots={[[40, 24, 1.8, '#fff', 1], [120, 40, 1.3, '#fff'], [220, 18, 1.6, '#4FC3F7', 1]]} />
                <Earth cx={316} cy={36} r={20} />
                <path d="M0 200 L0 132 Q90 112 180 130 Q270 146 354 126 L354 200Z" fill="#B8BCC6" />
                <path d="M140 132 A36 36 0 0 1 212 132Z" fill="#fff" stroke="#9298A5" strokeWidth="1.5" />
                <rect x="170" y="112" width="12" height="20" rx="6" fill="#7758D9" />
              </svg>
              {built[0] && <SolarFarm style={{ left: 30, top: 92 }} />}
              {built[1] && <OxygenTank style={{ left: 220, top: 88 }} />}
              {built[2] && <GreenhouseDome style={{ left: 256, top: 98 }} />}
              {built[3] && <><Flag style={{ left: 120, top: 70 }} /><img className="a-pop" src="/assets/crew-full.webp" alt="Your crew at the finished base" style={{ position: 'absolute', left: 200, top: 130, width: 70 }} /></>}
              <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.35)', overflow: 'hidden' }}>
                <div className="bar" style={{ height: 12, width: `${built.filter(Boolean).length * 25}%`, background: 'var(--yellow)' }} />
              </div>
            </Stage>
          </div>
          <BaseStrip base={readBase(p)} dark />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
            {parts.map((n, i) => <div key={n} style={{ padding: '8px 10px', borderRadius: 14, background: built[i] ? 'var(--green-soft)' : '#C9CCEB', color: 'var(--navy)', fontWeight: 800, fontSize: 13 }}>{built[i] ? 'Built: ' : 'Locked: '}{n}</div>)}
          </div>
        </Section>

        <Section title="My mission notebook">
          {notes.length === 0 && <div style={{ padding: 16, borderRadius: 20, background: 'var(--indigo-2)', fontWeight: 700 }}>Play a mission to collect real NASA facts here!</div>}
          {notes.map((n) => (
            <div key={n.id} className="card" style={{ background: 'var(--yellow-soft)' }}>
              <div className="display" style={{ fontSize: 17, lineHeight: '21px', display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--sky)' }} />{n.title}</div>
              <div style={{ fontWeight: 700, fontSize: 15, lineHeight: '21px' }}><GlossText text={n.text} /></div>
              {Array.isArray(n.links) && n.links.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 4 }}>{n.links.map((l) => <SourceLink key={l.label} link={l} size={13} />)}</div>
              )}
            </div>
          ))}
        </Section>

        <button type="button" className="btn btn-white" style={{ height: 56, fontSize: 18 }} onClick={() => setShowNumbers(true)}>How we made the numbers</button>
        <button type="button" className="btn btn-yellow" style={{ marginTop: 'auto', height: 66, fontSize: 24 }} onClick={() => go('map')}>Back to Moon Map</button>
        {askReset ? (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 800 }}>Start over? Your stars, badges and notebook will be cleared.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              <button type="button" className="btn btn-soft" style={{ fontSize: 16, height: 48 }} onClick={() => setAskReset(false)}>Keep my progress</button>
              <button type="button" className="btn" style={{ fontSize: 16, height: 48, borderRadius: 16, background: 'var(--pink)' }} onClick={() => { removeKey(KEYS.progress); removeKey(KEYS.mission1); ['lkq-learning-v1', 'lkq-tutorial-v1', ...['m1', 'm2', 'm3', 'final', 'mars'].map(k => 'lkq-replay-' + k)].forEach(removeKey); setAskReset(false); refresh((x) => x + 1); }}>Yes, start over</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setAskReset(true)} style={{ alignSelf: 'center', height: 44, padding: '0 18px', border: '2px solid #8E95E8', borderRadius: 22, background: 'transparent', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Start over</button>
        )}
      </div>
      {showNumbers && <NumbersSheet onClose={() => setShowNumbers(false)} />}
    </div>
  );
}

function Stat({ big, small, bg = 'var(--yellow-soft)' }) {
  return (
    <div style={{ padding: '10px 6px', borderRadius: 18, background: bg, textAlign: 'center' }}>
      <div className="display" style={{ fontSize: 24, lineHeight: '26px' }}>{big}</div>
      <div style={{ fontWeight: 800, fontSize: 13 }}>{small}</div>
    </div>
  );
}

function Section({ title, right, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="display" style={{ fontSize: 22, lineHeight: '26px' }}>{title}</h2>
        {right && <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--yellow)' }}>{right}</span>}
      </div>
      {children}
    </section>
  );
}
