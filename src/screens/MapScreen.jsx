import { GuidedTutorial } from '../components/LearningLab.jsx';
import { useState } from 'react';
import MissionMap from '../components/MissionMap.jsx';
import Sheet from '../components/Sheet.jsx';
import Icon, { StarIcon } from '../components/Icon.jsx';
import { MISSION_LIST, suitBust } from '../data/mission1.js';
import BaseStrip from '../components/BaseStrip.jsx';
import { readBase } from '../lib/missionLogic.js';
import { getCommander, getProgress, isSoundOn, setSoundOn } from '../lib/storage.js';
import { go } from '../lib/router.js';
import { playSound } from '../lib/sound.js';
import { SideQuestGuide } from '../components/SideQuests.jsx';

export default function MapScreen() {
  const c = getCommander();
  const p = getProgress();
  const [tutorial, setTutorial] = useState(false);
  const [sheet, setSheet] = useState(null);
  const [quests, setQuests] = useState(false);
  const [sound, setSound] = useState(isSoundOn());
  const [says, setSays] = useState(null);

  const doneN = MISSION_LIST.filter((m) => p[m.key]).length;
  const nowIdx = MISSION_LIST.findIndex((m) => !p[m.key]);
  const states = MISSION_LIST.map((m, i) => (p[m.key] ? 'done' : i === nowIdx ? 'now' : 'locked'));
  const starsBy = MISSION_LIST.map((m) => p[m.key + 'Stars'] || 0);
  const stars = starsBy.reduce((a, b) => a + b, 0);
  const days = Array.isArray(p.days) ? p.days.length : 0;
  const message = says || (doneN === 0 ? 'Tap the yellow button to start!' : doneN === 4 ? 'Shabash! You finished every mission!' : 'Shabash! Your next mission is waiting.');

  const tapMission = (i) => {
    if (states[i] === 'locked') { playSound('oops'); setSays(`Locked! Finish ${MISSION_LIST[nowIdx].title} first.`); return; }
    playSound('pick');
    setSheet(i);
  };
  const toggleSound = () => { const next = !sound; setSoundOn(next); setSound(next); setSays(next ? 'Beep boop! Sound on.' : 'Shh! Quiet mode.'); };
  const sh = sheet !== null ? MISSION_LIST[sheet] : null;

  return (
    <div className="screen screen--moon">
      {tutorial && <GuidedTutorial onClose={() => setTutorial(false)} />}
      <button className="btn btn-soft" onClick={() => setTutorial(true)}>Practice with Chandu</button>
      <div style={{ flex: 'none', padding: '16px 14px', background: 'var(--indigo)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" className="btn" aria-label="Open my Commander Log" onClick={() => go('dashboard')}
          style={{ flex: 'none', width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', padding: 0, background: 'var(--indigo-2)', border: '3px solid var(--yellow)' }}>
          <img src={suitBust(c.suit)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <h1 className="display" style={{ margin: 0, fontSize: 19, lineHeight: '22px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span className="sr-only">Moon Map · Commander </span>{c.name.trim() || 'Commander'}</h1>
          <button type="button" onClick={() => go('dashboard')} style={{ background: 'none', border: 0, padding: 0, color: 'var(--yellow)', fontWeight: 800, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>My badges</button>
        </div>
        <div role="img" aria-label={`${stars} stars`} className="display" style={{ height: 44, padding: '0 12px', background: 'var(--yellow)', color: 'var(--navy)', borderRadius: 22, display: 'flex', alignItems: 'center', gap: 5, fontSize: 20 }}>
          <StarIcon size={20} color="#121B3B" />{stars}
        </div>
        <div role="img" aria-label={`${days} explore days`} className="display" style={{ height: 44, padding: '0 12px', background: 'var(--pink)', color: 'var(--navy)', borderRadius: 22, display: 'flex', alignItems: 'center', gap: 5, fontSize: 20 }}>
          <Icon d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.5 1 2 2 2 0-3 0-5 1-8z" size={20} fill="#121B3B" stroke={0} />{days}
        </div>
        <button type="button" className="btn btn-round" aria-label="Sound" aria-pressed={sound} onClick={toggleSound} style={{ width: 44, height: 44, background: '#fff' }}>
          <Icon name={sound ? 'sound' : 'mute'} size={22} color={sound ? '#1C1F63' : '#6A6F9E'} stroke={2.6} />
        </button>
      </div>

      <MissionMap missions={MISSION_LIST} states={states} starsByMission={starsBy} built={MISSION_LIST.map((m) => !!p[m.key])} chanduSays={message} onTapMission={tapMission} />

      <div style={{ padding: '6px 22px 28px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {p.m1 && <BaseStrip base={readBase(p)} dark />}
        {doneN === 4 ? (
          <button type="button" className="btn btn-yellow" style={{ width: '100%', height: 72, flexDirection: 'column', gap: 0 }} onClick={() => { playSound('click'); go('mars'); }}>
            <span>{p.mars ? 'Play Mars Mode again' : 'Unlocked: Mars Mode!'}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14 }}>Mission Control is 6 to 44 minutes away</span>
          </button>
        ) : (
          <button type="button" className="btn btn-yellow" style={{ width: '100%', height: 72 }} onClick={() => tapMission(nowIdx)}>
            <Icon name="play" size={26} fill="#121B3B" stroke={2} />
            {nowIdx === 0 ? 'Play Mission 1' : nowIdx === 3 ? 'Play the Final Mission' : `Play Mission ${nowIdx + 1}`}
          </button>
        )}
        <button type="button" className="btn btn-soft" onClick={() => { playSound('click'); setQuests(true); }}>🧭 Side quests</button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => go('data')} style={{ background: 'none', border: 0, color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'underline', cursor: 'pointer' }}>Real NASA data we used</button>
          <button type="button" onClick={() => go('grownups')} style={{ background: 'none', border: 0, color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'underline', cursor: 'pointer' }}>For grown-ups and teachers</button>
        </div>
      </div>

      {quests && <SideQuestGuide progress={p} onClose={() => setQuests(false)} onLog={() => go('dashboard')} />}
      {sh && (
        <Sheet label={sh.title} dim={0.8}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div className="kicker" style={{ color: '#5B41B8', fontSize: 14 }}>{sh.kicker}</div>
              <h2 className="display" style={{ fontSize: 29, lineHeight: '33px' }}>{sh.title}</h2>
            </div>
            <button type="button" className="btn btn-round" aria-label="Close" style={{ background: '#EEF0FF' }} onClick={() => setSheet(null)}><Icon name="close" size={24} stroke={2.8} /></button>
          </div>
          <p className="muted" style={{ margin: 0, fontWeight: 800, fontSize: 18, lineHeight: '25px' }}>{sh.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sh.chips.map(([label, bg]) => <span key={label === 'Shield' ? 'Radiation safety' : label} className="pill display" style={{ height: 36, background: bg, fontSize: 17 }}>{label === 'Shield' ? 'Radiation safety' : label}</span>)}
          </div>
          <button type="button" className="btn btn-yellow" style={{ height: 72, fontSize: 26 }} onClick={() => { playSound('click'); go(sh.screen); }}>
            {p[sh.key] ? 'Play again!' : 'Chalo, let’s go!'}
          </button>
        </Sheet>
      )}
    </div>
  );
}
