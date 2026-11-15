import ChanduMascot from './ChanduMascot.jsx';
import Icon from './Icon.jsx';
import Stage from './Stage.jsx';
import { Stars } from './MoonParts.jsx';

// Node positions on the 390-wide map (centres).
const POS = [{ x: 110, y: 196 }, { x: 280, y: 340 }, { x: 110, y: 500 }, { x: 280, y: 660 }];

/** One glowing mission node on the winding path. */
export function MissionCard({ mission, index, state, stars, onTap }) {
  const { x, y } = POS[index];
  const now = state === 'now';
  const done = state === 'done';
  const locked = state === 'locked';
  const size = now ? 104 : 90;
  const leftSide = x < 200;
  return (
    <>
      {now && (
        <>
          <div className="a-pulse" aria-hidden="true" style={{ position: 'absolute', left: x - 66, top: y - 66, width: 132, height: 132, borderRadius: '50%', border: '6px solid var(--yellow)' }} />
          <div className="a-bob" aria-hidden="true" style={{ position: 'absolute', left: x - 44, top: y + 56, width: 88, height: 32, background: '#fff', color: 'var(--navy)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17 }}>Tap me!</div>
        </>
      )}
      <button
        type="button"
        className="btn"
        aria-label={`${mission.title}. ${done ? 'Complete. Play again.' : now ? 'Ready to play.' : 'Locked.'}`}
        onClick={onTap}
        style={{
          position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, padding: 0, borderRadius: '50%',
          border: `5px solid ${locked ? '#5A60C8' : '#fff'}`,
          background: done ? 'var(--green)' : now ? 'var(--yellow)' : '#5A60C8',
          boxShadow: `0 7px 0 ${done ? 'var(--green-dark)' : now ? 'var(--yellow-dark)' : 'var(--indigo-2)'}`,
        }}
      >
        {now && <Icon name="play" size={46} fill="#121B3B" stroke={2} />}
        {done && <Icon name="check" size={40} stroke={3} />}
        {locked && <Icon name="lock" size={34} color="#E4E6FF" />}
      </button>
      <div style={{ position: 'absolute', left: leftSide ? x + 66 : x - 270, top: y - 36, width: 204, display: 'flex', flexDirection: 'column', alignItems: leftSide ? 'flex-start' : 'flex-end', gap: 2, textAlign: leftSide ? 'left' : 'right' }}>
        <div className="kicker" style={{ fontSize: 14 }}>{mission.kicker}</div>
        <div className="display" style={{ fontSize: 22, lineHeight: '25px' }}>{mission.title}</div>
        {done && <div className="pill" style={{ background: 'var(--yellow)', height: 26, fontSize: 13 }}>{stars} / 3 stars</div>}
      </div>
    </>
  );
}

/** The winding Moon path with all missions and the growing Moon base. */
export default function MissionMap({ missions, states, starsByMission, built, chanduSays, onTapMission }) {
  return (
    <Stage height={850}>
      <svg aria-hidden="true" viewBox="0 0 390 850" style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 850 }}>
        <path d="M0 0 H390 V58 Q195 108 0 58Z" fill="#1C1F63" />
        <path d="M0 58 Q195 108 390 58" stroke="#9AA0AC" strokeWidth="5" fill="none" />
        <Stars dots={[[34, 26, 2, '#fff', 1], [78, 50, 1.5, '#FFD21F'], [20, 56, 1.5, '#4FC3F7']]} />
        {[[300, 200, 34, 10], [52, 370, 26, 8], [320, 560, 30, 9], [200, 420, 14, 4], [180, 270, 12, 4]].map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#5B606C" />
        ))}
        <path d="M110 196 C110 268 280 268 280 340 S110 428 110 500 S280 588 280 660 S195 720 195 758" stroke="#fff" strokeOpacity="0.8" strokeWidth="9" strokeLinecap="round" strokeDasharray="1 18" fill="none" />
      </svg>
      <div className="speech" aria-live="polite" style={{ position: 'absolute', left: 20, top: 16, width: 262, borderRadius: '22px 22px 4px 22px', fontFamily: 'var(--font-display)', fontSize: 19, lineHeight: '23px', padding: '12px 16px', boxShadow: '0 5px 0 rgba(0,0,0,0.22)' }}>{chanduSays}</div>
      <ChanduMascot mood="happy" size={82} style={{ position: 'absolute', left: 290, top: 10 }} />
      {missions.map((m, i) => (
        <MissionCard key={m.key} mission={m} index={i} state={states[i]} stars={starsByMission[i]} onTap={() => onTapMission(i)} />
      ))}
      <MapBase built={built} />
    </Stage>
  );
}

function MapBase({ built }) {
  return (
    <div role="img" aria-label={`Your Moon base: ${built.filter(Boolean).length} of 4 parts built`} style={{ position: 'absolute', left: 0, top: 730, width: 390, height: 110 }}>
      <svg aria-hidden="true" viewBox="0 0 390 110" style={{ position: 'absolute', inset: 0, width: 390, height: 110 }}>
        <ellipse cx="195" cy="98" rx="150" ry="10" fill="#5B606C" />
        <line x1="195" y1="42" x2="195" y2="24" stroke="#D9CEFF" strokeWidth="3" strokeLinecap="round" />
        <circle cx="195" cy="22" r="4.5" fill="#FFD21F" />
        <path d="M140 96 A55 55 0 0 1 250 96Z" fill="#fff" />
        <rect x="184" y="62" width="22" height="34" rx="11" fill="#7758D9" />
        <circle cx="226" cy="72" r="9" fill="#4FC3F7" stroke="#121B3B" strokeWidth="2.5" />
        <circle cx="164" cy="72" r="9" fill="#4FC3F7" stroke="#121B3B" strokeWidth="2.5" />
      </svg>
      {built[0] && <SolarFarm style={{ left: 44, top: 58 }} />}
      {built[1] && <OxygenTank style={{ left: 258, top: 48 }} />}
      {built[2] && <GreenhouseDome style={{ left: 296, top: 56 }} />}
      {built[3] && <Flag style={{ left: 140, top: 22 }} />}
    </div>
  );
}

export function SolarFarm({ style }) {
  return (
    <svg className="a-pop" aria-hidden="true" viewBox="0 0 90 40" style={{ position: 'absolute', width: 90, height: 40, ...style }}>
      <g stroke="#5B606C" strokeWidth="2.5" strokeLinecap="round"><line x1="15" y1="38" x2="15" y2="20" /><line x1="45" y1="38" x2="45" y2="20" /><line x1="75" y1="38" x2="75" y2="20" /></g>
      <g stroke="#fff" strokeWidth="1.5">
        <rect x="2" y="6" width="26" height="13" rx="2" fill="#2E86DE" transform="rotate(-10 15 12)" />
        <rect x="32" y="6" width="26" height="13" rx="2" fill="#2E86DE" transform="rotate(-10 45 12)" />
        <rect x="62" y="6" width="26" height="13" rx="2" fill="#2E86DE" transform="rotate(-10 75 12)" />
      </g>
    </svg>
  );
}
export function OxygenTank({ style }) {
  return (
    <svg className="a-pop" aria-hidden="true" viewBox="0 0 30 50" style={{ position: 'absolute', width: 30, height: 50, ...style }}>
      <rect x="4" y="6" width="22" height="42" rx="10" fill="#B3E5FC" stroke="#fff" strokeWidth="2" />
      <rect x="11" y="1" width="8" height="7" rx="2" fill="#5B606C" />
      <text x="15" y="32" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="11" fill="#121B3B">O2</text>
    </svg>
  );
}
export function GreenhouseDome({ style }) {
  return (
    <svg className="a-pop" aria-hidden="true" viewBox="0 0 70 44" style={{ position: 'absolute', width: 70, height: 44, ...style }}>
      <path d="M2 43 V22 A33 20 0 0 1 68 22 V43Z" fill="#F3C6FF" stroke="#fff" strokeWidth="2" />
      <path d="M14 43 V30 M14 32 Q8 28 9 22 Q15 24 14 32 M35 43 V28 M35 30 Q41 25 41 19 Q34 21 35 30 M56 43 V30 M56 32 Q50 28 51 22 Q57 24 56 32" stroke="#2E9E27" strokeWidth="2" fill="#43D13A" />
    </svg>
  );
}
export function Flag({ style }) {
  return (
    <svg className="a-pop" aria-hidden="true" viewBox="0 0 30 50" style={{ position: 'absolute', width: 30, height: 50, ...style }}>
      <line x1="4" y1="50" x2="4" y2="4" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M4 4 l22 8 -22 8z" fill="#FFD21F" />
    </svg>
  );
}
