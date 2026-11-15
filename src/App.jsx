import Playtest from './screens/Playtest.jsx';
import { useScreen } from './lib/router.js';
import Welcome from './screens/Welcome.jsx';
import CommanderSetup from './screens/CommanderSetup.jsx';
import Crew from './screens/Crew.jsx';
import MapScreen from './screens/MapScreen.jsx';
import Briefing from './screens/Briefing.jsx';
import Mission1Game from './screens/Mission1Game.jsx';
import Mission1Complete from './screens/Mission1Complete.jsx';
import MissionGame from './screens/MissionGame.jsx';
import Dashboard from './screens/Dashboard.jsx';
import DataPage from './screens/DataPage.jsx';
import GrownUps from './screens/GrownUps.jsx';
import { ENGINE_MISSIONS, MARS_MISSION } from './data/missions.js';

export default function App() {
  const screen = useScreen();
  let view;
  switch (screen) {
    case 'commander': view = <CommanderSetup />; break;
    case 'crew': view = <Crew />; break;
    case 'map': view = <MapScreen />; break;
    case 'briefing': view = <Briefing />; break;
    case 'mission1': view = <Mission1Game />; break;
    case 'complete1': view = <Mission1Complete />; break;
    case 'mission2':
    case 'mission3':
    case 'final': view = <MissionGame key={screen} mission={ENGINE_MISSIONS[screen]} />; break;
    case 'mars': view = <MissionGame key="mars" mission={MARS_MISSION} />; break;
    case 'dashboard': view = <Dashboard />; break;
    case 'data': view = <DataPage />; break;
    case 'playtest': view = <Playtest />; break;
    case 'grownups': view = <GrownUps />; break;
    default: view = <Welcome />;
  }
  return <main className="app-shell">{view}</main>;
}
