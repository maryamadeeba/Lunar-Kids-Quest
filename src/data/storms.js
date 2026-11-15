// ============================================================
// Real solar particle storms from NASA's DONKI space weather database.
//
// Every time below is copied from DONKI (times are UTC). "Near Earth"
// means the GOES satellite saw >10 MeV protons go above the storm level.
// The Moon is close to Earth compared with the Sun, so a Moon base would
// get the storm at about the same time.
//
// The game countdown is the real warning time, scaled:
//   1 game second = 3 real minutes, never less than 7 seconds
//   (so a child always has time for 3 taps).
// ============================================================

const DONKI = 'https://ccmc.gsfc.nasa.gov/DONKI/view';
const SCALE_MIN_PER_SEC = 3;
const MIN_COUNTDOWN = 7;

/** A DONKI time (UTC, "HH:MM") shown in Pakistan time (UTC+5), e.g. "7:55 pm". */
export function pkTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const t = (h * 60 + m + 5 * 60) % (24 * 60);
  const H = Math.floor(t / 60); const ap = H >= 12 ? 'pm' : 'am'; const h12 = ((H + 11) % 12) + 1;
  return `${h12}:${String(t % 60).padStart(2, '0')} ${ap}`;
}

/** Minutes between two "HH:MM" times on the same day. */
const minutesBetween = (a, b) => {
  const [ah, am] = a.split(':').map(Number); const [bh, bm] = b.split(':').map(Number);
  return bh * 60 + bm - (ah * 60 + am);
};
export const countdownFor = (warnMin) => Math.max(MIN_COUNTDOWN, Math.round(warnMin / SCALE_MIN_PER_SEC));

const storm = (x) => {
  const warnMin = minutesBetween(x.alert, x.nearEarth);
  return { ...x, warnMin, countdown: countdownFor(warnMin) };
};

/** The storms the Final Mission can play. */
export const STORMS = [
  storm({
    id: '2024-02-09', date: '9 February 2024', name: 'The X3.3 flare storm',
    cause: 'A very big solar flare (size X3.3) went off on the Sun.', flare: '12:53',
    alert: '14:55', nearEarth: '15:30',
    alertText: 'NASA research alert: a particle storm may arrive "within next few hours".',
    lesson: 'The giant cloud from the Sun went the other way and missed Earth. But the fast particles still reached Earth about 2½ hours after the flare. A miss is not always safe!',
    links: [
      { label: 'NASA DONKI: alert 20240209-AL-004 (14:55 UTC)', href: `${DONKI}/Alert/29075/1` },
      { label: 'NASA DONKI: particle storm near Earth, 15:30 UTC', href: `${DONKI}/SEP/29079/-1` },
      { label: 'NASA DONKI: the Sun cloud (CME) that missed Earth', href: `${DONKI}/CME/29066/-1` },
    ],
  }),
  storm({
    id: '2024-01-29', date: '29 January 2024', name: 'The M6.8 flare storm',
    cause: 'A medium-big solar flare (size M6.8) went off on the Sun.', flare: '03:54',
    alert: '05:20', nearEarth: '06:15',
    alertText: 'NASA alert: a particle storm has been seen by the STEREO-A spacecraft.',
    lesson: 'Another spacecraft, STEREO-A, saw the storm first at 05:11. Its alert gave crews near Earth almost an hour to get ready.',
    links: [
      { label: 'NASA DONKI: first detection by STEREO-A, 05:11 UTC', href: `${DONKI}/SEP/28836/-1` },
      { label: 'NASA DONKI: particle storm near Earth, 06:15 UTC', href: `${DONKI}/SEP/28842/-1` },
    ],
  }),
  storm({
    id: '2024-02-12', date: '12 February 2024', name: 'The surprise storm',
    cause: 'There was no flare at all! Only a giant cloud from the Sun.', flare: null,
    alert: '07:46', nearEarth: '08:05',
    alertText: 'NASA alert: a particle storm has been detected. There was no flare to warn anyone!',
    lesson: 'With no flare to see, the first alert only came after another spacecraft felt the storm. Later that morning even faster particles arrived. Be ready, even when the Sun looks calm.',
    links: [
      { label: 'NASA DONKI: first detection, 07:41 UTC', href: `${DONKI}/SEP/29154/-1` },
      { label: 'NASA DONKI: particle storm near Earth, 08:05 UTC', href: `${DONKI}/SEP/29156/-1` },
      { label: 'NASA DONKI: extra-fast particles, 10:15 UTC', href: `${DONKI}/SEP/29158/-1` },
    ],
  }),
];

/** Short real facts used on cards (all from DONKI, see links above). */
export const STORM_FACTS = {
  slow: 'Not every storm is fast. A flare on 31 December 2023 sent particles that only reached Earth on 3 January 2024: about 2 days later.',
  noStorm: 'Big flares do not always send a particle storm. The X6.3 flare on 22 February 2024 was bigger than the X3.3, but DONKI links no particle storm to it.',
};

/** Pick the storm for this run: a different one each time you play. */
export function nextStorm() {
  let i = 0;
  try { i = (Number(localStorage.getItem('lkq-storm')) || 0) % STORMS.length; localStorage.setItem('lkq-storm', String(i + 1)); } catch { /* storage blocked */ }
  return STORMS[i];
}

// ---------- Live data (optional) ----------
// Asks NASA DONKI for particle storms in the last 30 days. If the request
// fails or is slow, the game simply plays an archived storm.
const ymd = (d) => d.toISOString().slice(0, 10);
export async function fetchRecentStorms({ days = 30, timeoutMs = 5000 } = {}) {
  const end = new Date(); const start = new Date(end.getTime() - days * 86400000);
  const key = (import.meta.env && import.meta.env.VITE_NASA_API_KEY) || 'DEMO_KEY';
  const urls = [
    `https://api.nasa.gov/DONKI/SEP?startDate=${ymd(start)}&endDate=${ymd(end)}&api_key=${key}`,
    `https://ccmc.gsfc.nasa.gov/DONKI-API/get/SEP?startDate=${ymd(start)}&endDate=${ymd(end)}`,
  ];
  for (const url of urls) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), timeoutMs);
      const r = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      if (!r.ok) continue;
      const txt = await r.text();
      const list = txt.trim() ? JSON.parse(txt) : [];
      if (!Array.isArray(list)) continue;
      const times = list.map((e) => e.eventTime).filter(Boolean).sort();
      return { ok: true, count: list.length, latest: times.length ? times[times.length - 1] : null, days, storm: liveStorm(list) };
    } catch { /* try the next server */ }
  }
  return { ok: false };
}

/**
 * Turn the most recent live DONKI particle storm into a playable storm.
 * Warning time = first DONKI alert -> first near-Earth (GOES) detection,
 * when DONKI has both and the alert came first. Otherwise the countdown
 * uses the shortest real warning we stored, and says so.
 */
export function liveStorm(list) {
  if (!Array.isArray(list) || !list.length) return null;
  const byDay = {};
  list.forEach((e) => { if (e && e.eventTime) (byDay[e.eventTime.slice(0, 10)] = byDay[e.eventTime.slice(0, 10)] || []).push(e); });
  const day = Object.keys(byDay).sort().pop();
  if (!day) return null;
  const evs = byDay[day].sort((a, b) => a.eventTime.localeCompare(b.eventTime));
  const near = evs.find((e) => (e.instruments || []).some((i) => /GOES/i.test(i.displayName || ''))) || evs[0];
  const alerts = evs.flatMap((e) => (e.sentNotifications || []).map((n) => n.messageIssueTime)).filter(Boolean).sort();
  const t = (iso) => new Date(iso.length === 17 ? `${iso.slice(0, 16)}:00Z` : iso).getTime();
  const warn = alerts.length ? Math.round((t(near.eventTime) - t(alerts[0])) / 60000) : null;
  const known = warn !== null && warn > 0 && warn < 24 * 60;
  const hhmm = (iso) => iso.slice(11, 16);
  const d = new Date(`${day}T00:00:00Z`);
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const ago = Math.max(0, Math.round((Date.now() - d.getTime()) / 86400000));
  const shortest = Math.min(...STORMS.map((x) => x.warnMin));
  const warnMin = known ? warn : shortest;
  return {
    id: `live-${day}`, live: true, date, ago, name: 'This month’s real storm',
    cause: `NASA found this particle storm ${ago === 0 ? 'today' : ago === 1 ? 'yesterday' : `${ago} days ago`} (live from DONKI).`,
    alert: known ? hhmm(alerts[0]) : null, nearEarth: hhmm(near.eventTime), warnMin, countdown: countdownFor(warnMin), warnKnown: known,
    alertText: known ? 'NASA sent an alert before the storm reached Earth.' : 'DONKI does not show an alert before this storm, so the game uses the shortest real warning it knows.',
    lesson: 'This is not a story from the past: it happened this month. A real Moon crew would have needed to take shelter that day.',
    links: [{ label: `NASA DONKI: particle storm of ${date} (live)`, href: near.link || 'https://ccmc.gsfc.nasa.gov/DONKI/' }],
  };
}

/** One sentence about space weather right now, for the storm card. */
export function rightNowLine(live) {
  if (!live || !live.ok) return '';
  if (!live.count) return `Right now: NASA recorded no particle storms in the last ${live.days} days, so a Moon crew could work outside safely this month.`;
  return `Right now: NASA recorded ${live.count} particle storm ${live.count === 1 ? 'record' : 'records'} in the last ${live.days} days. On those days, a Moon crew would have needed the shelter too.`;
}

/** Pick the dark-spell variant for this play (alternates). */
export function nextDarkIndex(n) {
  let i = 0;
  try { i = (Number(localStorage.getItem('lkq-dark')) || 0) % n; localStorage.setItem('lkq-dark', String(i + 1)); } catch { /* storage blocked */ }
  return i;
}

/** One kid-friendly line about the live result (or null if it failed). */
export function liveLine(live) {
  if (!live || !live.ok) return null;
  if (!live.count) return `Live from NASA DONKI: no particle storms in the last ${live.days} days. A quiet Sun! So today you will practise with a real storm from 2024.`;
  const d = new Date(live.latest);
  const when = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return `Live from NASA DONKI: ${live.count} particle storm ${live.count === 1 ? 'record' : 'records'} in the last ${live.days} days. The latest was on ${when}.`;
}
