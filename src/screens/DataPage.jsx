import Icon from '../components/Icon.jsx';
import { SourceLink } from '../components/NASAFactCard.jsx';
import RadiationRuler from '../components/RadiationRuler.jsx';
import NasaPhoto, { CURIOSITY } from '../components/NasaPhoto.jsx';
import SpeakButton from '../components/SpeakButton.jsx';
import { DATASETS } from '../data/datasets.js';
import { STORMS, pkTime } from '../data/storms.js';
import { go } from '../lib/router.js';

const HOW_COLORS = { 'Live + stored': 'var(--green-soft)', 'NASA ratio': 'var(--sky-soft)', 'Stored real readings': 'var(--yellow-soft)' };

/** "Real data we used": every NASA dataset, how the game uses it, and links. */
export default function DataPage() {
  const back = () => go(window.history.length > 1 ? 'map' : 'welcome');
  return (
    <div className="screen scroll">
      <div className="pad" style={{ gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" className="btn btn-back" aria-label="Back to the Moon Map" onClick={back}><Icon name="back" size={26} color="#1C1F63" stroke={3} /></button>
          <h1 className="display" style={{ fontSize: 28, lineHeight: '30px', flex: 1 }}>Real data we used</h1>
          <SpeakButton text="Real data we used. This game uses real NASA science. Some numbers come straight from NASA. Some are sizes we worked out from NASA facts. Others are our best guesses, and we always say which is which." />
        </div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, lineHeight: '22px' }}>
          This game uses real NASA science. <b>Live</b> means the game asks NASA right now. <b>Stored</b> means real NASA data saved inside the game, so it works offline. Every other number is a size we worked out from NASA facts, or our best guess, and the game always says which (Commander Log → How we made the numbers).
        </p>

        <section className="learning-card"><h2 className="display">What kind of number is this?</h2><p>📏 <b>Measured:</b> archived NASA radiation readings and DONKI event dates.</p><p>🔗 <b>NASA-informed:</b> relationships such as water use and shelter protection.</p><p>🎮 <b>Game units:</b> meter points and battery cells. Estimates keep the game playable; they are not kilograms or radiation doses.</p><p>🛡 <b>Radiation safety:</b> an abstract exposure budget. Radiation does not eat the wall or shelter.</p><p>🌱 <b>Simulated time:</b> a later round can represent a month of plant growth. Practice uses separate supplies.</p></section>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 className="display" style={{ fontSize: 21 }}>Real radiation ruler</h2>
          <RadiationRuler />
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 className="display" style={{ fontSize: 21 }}>The real storms in the game</h2>
          {STORMS.map((st) => (
            <div key={st.id} style={{ padding: '8px 10px', borderRadius: 14, background: '#EEF0FF', fontWeight: 700, fontSize: 14, lineHeight: '19px' }}>
              <b>{st.date}: {st.name}.</b> Alert at {pkTime(st.alert)} Pakistan time, storm near Earth {st.warnMin} minutes later → {st.countdown}-second countdown in the game.
            </div>
          ))}
          <div className="muted" style={{ fontWeight: 700, fontSize: 13 }}>Countdown = real warning minutes ÷ 3 (never less than 7 seconds).</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 className="display" style={{ fontSize: 21 }}>Real NASA photos</h2>
          <NasaPhoto />
          <NasaPhoto photo={CURIOSITY} />
        </div>

        <h2 className="display" style={{ fontSize: 22 }}>Every dataset</h2>
        {DATASETS.map((d) => (
          <div key={d.name} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
              <div className="display" style={{ fontSize: 17, lineHeight: '21px' }}>{d.name}</div>
              <span className="pill" style={{ flex: 'none', height: 'auto', padding: '3px 10px', fontSize: 13, background: HOW_COLORS[d.how] || '#EEF0FF' }}>{d.how}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, lineHeight: '21px' }}>{d.what}</div>
            <div className="muted" style={{ fontWeight: 800, fontSize: 13 }}>Used in: {d.where}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>{d.links.map((l) => <SourceLink key={l.label} link={l} size={13} />)}</div>
          </div>
        ))}
        <button type="button" className="btn btn-yellow" style={{ height: 64, fontSize: 22 }} onClick={() => go('map')}>Back to Moon Map</button>
      </div>
    </div>
  );
}
