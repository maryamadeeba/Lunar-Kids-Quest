// Small, safe wrappers around localStorage. Progress lives only in the
// child's own browser: no accounts, no server, no personal data.

export const KEYS = {
  commander: 'lkq-commander',
  progress: 'lkq-progress',
  mission1: 'lkq-m1',
  sound: 'lkq-sound',
};

export function readJSON(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || '{}') || {};
  } catch {
    return {};
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage can be blocked (private mode); the game still works */
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function getCommander() {
  const c = readJSON(KEYS.commander);
  return {
    name: typeof c.name === 'string' ? c.name : '',
    suit: c.suit || 'blue',
    level: c.level === 'commander' ? 'commander' : 'explorer',
  };
}

export function saveCommander(next) {
  writeJSON(KEYS.commander, { ...getCommander(), ...next });
}

export function getProgress() {
  return readJSON(KEYS.progress);
}

/** Update progress with a function, and record today as a play day. */
export function updateProgress(fn) {
  const p = getProgress();
  fn(p);
  const today = new Date().toISOString().slice(0, 10);
  p.days = Array.isArray(p.days) ? p.days : [];
  if (!p.days.includes(today)) p.days.push(today);
  writeJSON(KEYS.progress, p);
  return p;
}

/** Add a real NASA fact to the mission notebook (once). */
export function addNotebookFact(id, title, text, links = []) {
  updateProgress((p) => {
    const nb = Array.isArray(p.notebook) ? p.notebook : [];
    const keep = (links || []).filter((l) => l && l.label).map((l) => ({ label: l.label, href: l.href || null }));
    if (!nb.some((f) => f.id === id)) nb.push({ id, title, text, links: keep });
    p.notebook = nb;
  });
}

/** Mark a mission done and keep the best star score. */
export function completeMission(key, stars, extra = {}) {
  updateProgress((p) => {
    p[key] = true;
    p[key + 'Stars'] = Math.max(p[key + 'Stars'] || 0, stars);
    Object.assign(p, extra);
  });
}

export function isSoundOn() {
  try {
    return window.localStorage.getItem(KEYS.sound) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundOn(on) {
  if (!on && typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
  try {
    window.localStorage.setItem(KEYS.sound, on ? 'on' : 'off');
  } catch {
    /* ignore */
  }
}

/**
 * Save the persistent Moon base after a mission: the meters it ended with,
 * plus any site / module choices (site, wall, tank, greenhouse).
 */
export function saveBase(missionKey, endMeters, patch = {}) {
  updateProgress((p) => {
    const b = p.base && typeof p.base === 'object' ? p.base : {};
    b.after = b.after || {};
    b.after[missionKey] = { ...endMeters };
    Object.assign(b, patch);
    p.base = b;
  });
}
