import { useState } from 'react';
import { machineKind } from '../lib/visualLearning.js';
import { changeClass, resourceIcon, resourceName, effectWords } from '../lib/learning.js';

const COLOR = { air: '#7cdeff', recycle: '#5fe0c3', garden: '#98dc73', ice: '#a4dfff', heat: '#ffba68', radio: '#baa3ff', battery: '#ffdb53', shelter: '#baa3ff', science: '#eeb7ff', fitness: '#ff9eb5', site: '#ffdb53' };
const Drop = ({ x, y, dirty = false, className = '' }) => <path className={className} d={`M${x} ${y - 8}q-12 16 0 19q12-3 0-19Z`} fill={dirty ? '#b7a17c' : '#61cfff'} stroke="#e0faff" strokeWidth="1.5" />;
const Plant = ({ x, y, className = '' }) => <g className={className} style={{ transformOrigin: `${x}px ${y}px` }}><path d={`M${x} ${y}v-42m0 21q-30 0-25-22q25 0 25 22m0-9q28-2 25-23q-25 0-25 23`} stroke="#4dbe67" strokeWidth="4" fill="#92e46b" /><rect x={x - 18} y={y} width="36" height="15" rx="5" fill="#bf835e" /></g>;

/** Equipment-specific drawings. Motion is decorative; labels come only from supplied rules. */
export function MachineDrawing({ kind = 'science', running = false, compact = false }) {
  return <svg className={`machine-drawing machine-${kind} ${running ? 'machine-running' : ''}`} viewBox="0 0 360 210" role="img" aria-label={`${kind === 'air' ? 'Water entering an oxygen maker, with air bubbles leaving' : kind === 'recycle' ? 'Used water passing through a filter and returning to a tank' : kind === 'garden' ? 'Grow lights above plants, with a later harvest' : kind === 'shelter' ? 'Storm particles outside a solid shelter protecting the crew' : kind === 'site' ? 'Sunny ridge beside a shadowed icy crater' : kind + ' equipment'}${running ? '. Animated illustration' : '. Illustration'}`}>
    <rect width="360" height="210" rx="24" fill="#14234a" />
    {[18, 60, 116, 242, 294, 335].map((x, i) => <circle key={x} cx={x} cy={18 + i % 3 * 17} r="2" fill="#d8eaff" />)}
    <path d="M0 184q80-15 170 0t190-4v30H0Z" fill="#26395f" />
    {kind !== 'site' && kind !== 'shelter' && <g className="machine-battery"><rect x="18" y="85" width="42" height="63" rx="8" fill="#ffdb53" stroke="#fff1a5" strokeWidth="3" /><rect x="31" y="79" width="16" height="6" rx="2" fill="#fff1a5" /><path d="m43 94-14 25h13l-8 20 18-28H39Z" fill="#6b5610" /><path className="energy-wire" d="M60 117h47" stroke="#ffe16c" strokeWidth="6" strokeDasharray="9 8" /></g>}
    {kind === 'air' && <>
      <rect x="105" y="70" width="55" height="103" rx="13" fill="#27476b" stroke="#83dfff" strokeWidth="3" /><path className="water-level" d="M110 116h45v43q0 9-10 9h-25q-10 0-10-9Z" fill="#4fb6ef" />
      <path d="M159 136h31V99h24" stroke="#7fbdde" strokeWidth="10" fill="none" /><Drop x={177} y={132} className="water-travel" />
      <rect x="210" y="66" width="68" height="106" rx="17" fill="#e4f4ff" /><rect x="222" y="82" width="44" height="63" rx="9" fill="#83dfff" />
      <path d="M244 91v47m-12-36v25m24-25v25" stroke="#2573a2" strokeWidth="4" />
      {[0, 1, 2, 3].map(i => <circle key={i} className="air-rise" style={{ animationDelay: `${i * .25}s` }} cx={298 + i % 2 * 18} cy={150 - i * 20} r={7 + i % 2 * 3} fill="#9ceaff" stroke="#ecfbff" strokeWidth="2" />)}
    </>}
    {kind === 'recycle' && <>
      <rect x="103" y="89" width="50" height="83" rx="10" fill="#a29077" stroke="#e2dac7" strokeWidth="3" />
      <path d="M153 117h30m63 0h35" stroke="#71bdd4" strokeWidth="10" />
      <path d="M179 74h73l-14 76h-45Z" fill="#d5f8eb" stroke="#85e2c4" strokeWidth="3" />
      {[94, 108, 122, 136].map(y => <path key={y} d={`M190 ${y}h49`} stroke="#5fa6aa" strokeWidth="3" strokeDasharray="3 5" />)}
      <Drop x={165} y={111} dirty className="filter-in" /><Drop x={264} y={111} className="filter-out" />
      <rect x="282" y="89" width="51" height="83" rx="10" fill="#235b82" stroke="#a0e4ff" strokeWidth="3" /><path className="clean-level" d="M287 130h41v32q0 6-8 6h-25q-8 0-8-6Z" fill="#61cfff" />
      <path d="M309 178q-87 28-166 0" fill="none" stroke="#7ee0c2" strokeWidth="3" strokeDasharray="7 6" />
    </>}
    {kind === 'garden' && <>
      <path d="M107 171V92q0-53 106-53t111 53v79Z" fill="#375a65" stroke="#9de4c8" strokeWidth="3" />
      {[145, 213, 281].map(x => <g key={x}><rect x={x - 20} y="54" width="40" height="13" rx="6" fill="#ffdb53" /><path className="lamp-beam" d={`m${x - 14} 69-16 73h60l-16-73Z`} fill="#ffe68a" opacity=".18" /><Plant x={x} y={158} className="plant-grow" /></g>)}
      <path d="M120 93h180" stroke="#85c8eb" strokeWidth="4" />{[155, 225, 290].map(x => <Drop key={x} x={x} y={98} className="plant-drop" />)}
    </>}
    {kind === 'site' && <><circle cx="63" cy="61" r="25" fill="#ffdb53" /><path d="M0 183q56-114 125-56l49 57" fill="#acb7cd" /><path d="m52 118 6-16h61l8 16" fill="#78cfff" stroke="#fff" strokeWidth="2" /><path d="M174 183q90-76 186-2" fill="#79869e" /><ellipse cx="276" cy="164" rx="57" ry="18" fill="#293b5d" />{[249, 278, 302].map(x => <path key={x} d={`m${x} 151 9 10-9 11-9-11Z`} fill="#86e7ff" />)}<path className="sun-ray" d="m71 86 13 25m2-31 19 24" stroke="#ffdb53" strokeWidth="4" /></>}
    {kind === 'shelter' && <><path d="M137 173V92q0-46 79-46t82 46v81Z" fill="#76859f" stroke="#cbd8e9" strokeWidth="8" /><path d="M169 173v-60q0-35 47-35t49 35v60Z" fill="#223b61" />{[185, 217, 249].map(x => <g key={x} className="crew-sheltered"><circle cx={x} cy="123" r="12" fill="#b2e9ff" stroke="#fff" strokeWidth="4" /><rect x={x - 10} y="138" width="20" height="31" rx="7" fill="#e8f4ff" /></g>)}{[0, 1, 2, 3].map(i => <path className="storm-deflect" style={{ animationDelay: `${i * .35}s` }} key={i} d={`m${30 + i * 27} 30 28 26-13-1 23 28`} stroke="#ffbc6b" strokeWidth="4" fill="none" />)}</>}
    {kind === 'ice' && <><path d="m252 150 19-44 30 3 22 48-37 18Z" fill="#90deff" stroke="#def6ff" strokeWidth="3" /><rect x="123" y="122" width="96" height="35" rx="12" fill="#e9edff" /><circle cx="145" cy="166" r="15" fill="#51668f" /><circle cx="199" cy="166" r="15" fill="#51668f" /><path className="drill-arm" d="M180 122V69h67v48" fill="none" stroke="#d7dcff" strokeWidth="10" /><path d="m233 118 14 17 14-17" fill="#ffdb53" /><path className="ice-carry" d="m263 144 10-11 11 11-11 12Z" fill="#adf0ff" /></>}
    {kind === 'heat' && <><rect x="134" y="87" width="150" height="86" rx="20" fill="#e4edff" />{[153, 182, 211, 240, 266].map(x => <path key={x} d={`M${x} 107v45`} stroke="#f29155" strokeWidth="9" strokeLinecap="round" />)}{[164, 211, 258].map(x => <path className="heat-rise" key={x} d={`M${x} 76q-12-12 0-24t0-24`} stroke="#ffb668" strokeWidth="4" fill="none" />)}</>}
    {kind === 'radio' && <><path d="M153 164h89l-45-65Z" fill="#7e92bc" /><path d="M160 59q-27 88 61 88Z" fill="#e4edff" stroke="#a6c8ff" strokeWidth="3" /><path d="m182 109 37-38" stroke="#ffdb53" strokeWidth="6" /><circle cx="222" cy="68" r="7" fill="#ffdb53" />{[26, 43, 60].map(r => <path className="radio-wave" key={r} d={`M${234 + r / 2} ${72 - r}q${r} ${r / 3} ${r / 2} ${r}`} fill="none" stroke="#bbaaef" strokeWidth="3" />)}<circle cx="307" cy="37" r="19" fill="#70bff4" /><path d="m296 24 17 4-7 12 13 5-11 7-14-12Z" fill="#83d785" /></>}
    {kind === 'battery' && <><rect x="151" y="61" width="123" height="112" rx="17" fill="#263d66" stroke="#bcd8fc" strokeWidth="5" /><rect x="190" y="51" width="44" height="10" rx="4" fill="#bcd8fc" />{[0, 1, 2].map(i => <rect className="battery-charge" key={i} style={{ animationDelay: `${i * .3}s` }} x="166" y={142 - i * 29} width="93" height="20" rx="4" fill="#ffdb53" />)}</>}
    {kind === 'fitness' && <><circle cx="156" cy="151" r="29" fill="none" stroke="#a9bbdf" strokeWidth="7" /><circle cx="261" cy="151" r="29" fill="none" stroke="#a9bbdf" strokeWidth="7" /><path d="m156 151 38-43 23 43h44l-28-58m-39 15 23 43h-61" stroke="#ff9eb5" strokeWidth="6" fill="none" /><circle cx="203" cy="62" r="16" fill="#bdeaff" stroke="#fff" strokeWidth="5" /><path className="bike-pedal" d="m204 83-19 27 32 17-10 24m-3-68 29 9" stroke="#f4f8ff" strokeWidth="10" fill="none" strokeLinecap="round" /></>}
    {kind === 'science' && <><path d="M172 58h58m-45 0v44l-40 57q-5 14 12 14h83q17 0 9-15l-35-56V58" fill="#dce8ff" stroke="#b9d0f7" strokeWidth="4" /><path d="m166 140-13 22h88l-12-22Z" fill="#c3a5ef" />{[184, 208, 224].map((x, i) => <circle className="air-rise" key={x} cx={x} cy={130 - i * 14} r="5" fill="#bc9fe9" />)}<path d="m290 86 7 13 15 2-11 11 2 15-13-7-13 7 2-15-11-11 15-2Z" fill="#ffdb53" /></>}
    {!compact && <rect x="123" y="190" width="110" height="5" rx="2" fill={COLOR[kind] || '#fff'} opacity=".65" />}
  </svg>;
}

export default function MachineAnimation({ item, kind, running = false, showEffects = true }) {
  const type = kind || machineKind(item);
  return <div className="equipment-story">
    <MachineDrawing key={type} kind={type} running={running} />
    {type === 'garden' && <small className="flash-caption">Simulated stages · food comes at the mission’s harvest</small>}
    {item && showEffects && <div className="machine-effects" aria-label="What this machine does">
      {item.cost > 0 && <span className="chip-info">🔋 Uses {item.cost} {item.cost === 1 ? 'cell' : 'cells'}</span>}
    </div>}
    {showEffects && item && <small className="equipment-units">You will see the real changes after the round.</small>}

  </div>;
}

export function MachineTheatre({ items = [], on = {}, running = false }) {
  const [index, setIndex] = useState(0);
  const selected = items.filter(it => on[it.id]);
  if (!selected.length) return <div className="machine-idle"><MachineDrawing kind="battery" /><strong>Machines are off. The crew still uses supplies.</strong></div>;
  const item = selected[index % selected.length];
  return <section className="machine-theatre" aria-label="Your selected machines"><strong>{item.name}</strong><MachineAnimation key={item.id} item={item} running={running} /><div className="learning-actions">{selected.map((it, i) => <button className="btn btn-soft" aria-pressed={it.id === item.id} key={it.id} onClick={() => setIndex(i)}>{it.name}</button>)}</div></section>;
}
