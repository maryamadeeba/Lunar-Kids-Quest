// A tiny hash router: each screen has a name like #map or #mission2.
// Hash URLs work on Vercel with no extra server setup.
import { useEffect, useState } from 'react';

export const SCREENS = [
  'welcome', 'commander', 'crew', 'map', 'briefing', 'mission1', 'complete1',
  'mission2', 'mission3', 'final', 'dashboard', 'data', 'grownups', 'mars', 'playtest',
];

function current() {
  const h = window.location.hash.replace('#', '');
  return SCREENS.includes(h) ? h : 'welcome';
}

export function go(screen) {
  window.location.hash = screen;
  window.scrollTo(0, 0);
}

export function useScreen() {
  const [screen, setScreen] = useState(current());
  useEffect(() => {
    const onChange = () => setScreen(current());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return screen;
}
