import RewardModal from '../components/RewardModal.jsx';
import ChanduMascot from '../components/ChanduMascot.jsx';
import Icon from '../components/Icon.jsx';
import { BigStars, Confetti } from '../components/RewardModal.jsx';
import { useState } from 'react';
import NumbersSheet from '../components/NumbersSheet.jsx';
import { NumbersNote } from '../components/RewardModal.jsx';
import { SourceLink } from '../components/NASAFactCard.jsx';
import { getCommander, readJSON, KEYS } from '../lib/storage.js';
import { CARDS } from '../data/missions.js';
import { MISSION1 } from '../data/mission1.js';
import { R } from '../data/ratios.js';
import { go } from '../lib/router.js';

export default function Mission1Complete() {
  const [showNumbers, setShowNumbers] = useState(false);
  const c = getCommander();
  const m = readJSON(KEYS.mission1);
  const site = m.site === 'crater' ? 'crater' : 'ridge';
  const taps = typeof m.taps === 'number' ? m.taps : 1;
  const on = m.on || {};
  const stars = m.stars || 1;
  const siteInfo = site === 'ridge' ? ['Built on Sunny Ridge', 'Lots of sun', 'Ice far away'] : ['Built at Crater Edge', 'Ice close by', 'Little sun'];
  const plan = site === 'ridge'
    ? [taps ? `Sent the rover for ice ${taps} ${taps === 1 ? 'time' : 'times'}` : 'Did not send the rover', `+${R.iceTripWater.points * taps} Water`, `−${R.roverTripPower.points * taps} Power`]
    : [taps ? `Carried ${taps} solar ${taps === 1 ? 'panel' : 'panels'} into the sun` : 'Did not add panels', `+${R.panelTripPower.points * taps} Power`, `−${R.outdoorShield.points * taps} Radiation safety`];
  const machines = MISSION1.machines.filter((x) => on[x.id]).map((x) => x.name).join(', ') || 'nothing';
  const rows = [
    { t: '1. Choosing a home', you: siteInfo[0], nasa: CARDS.sites.real, links: CARDS.sites.links },
    { t: '2. Finding water', you: plan[0], nasa: CARDS.rim.real, links: CARDS.rim.links },
    { t: '3. Running the base', you: `Powered ${machines}`, nasa: `${CARDS.needs.real} On the Space Station, about 98% of the water is recycled.`, links: [...CARDS.needs.links, ...CARDS.priority.links.slice(1)] },
  ];
  const nasaPick = site === 'ridge'
    ? 'You picked the same kind of spot as NASA: a sunny rim, with ice in the dark crater nearby. That is why Sunny Ridge can earn 3 stars.'
    : 'NASA would pick the sunny rim. Sunshine gives power every day, and ice can be carried up from the dark crater. Crater Edge has ice close by, but too little sun, so it can only earn 2 stars.';

  return <div className="screen"><RewardModal commander={c.name || 'Commander'} stars={stars} badge="Moon Explorer" unlock={site === 'ridge' ? 'Solar Farm' : 'Ice Lab'} facts={rows.map(row => row.nasa)} notes={<><p>{nasaPick}</p><p>{siteInfo.join(' · ')}</p><p>{plan.join(' · ')}</p>{rows.map(row => <div key={row.t}><h3>{row.t}</h3><p>{row.you}</p>{row.links.map(link => <SourceLink key={link.label} link={link} />)}</div>)}</>} onMap={() => go('map')} onDashboard={() => go('dashboard')} onReplay={() => go('mission1')} onNumbers={() => setShowNumbers(true)} onData={() => go('data')} />{showNumbers && <NumbersSheet onClose={() => setShowNumbers(false)} />}</div>;
}
