import { useEffect, useState } from 'react';
import { PLAYTEST_TASKS } from '../lib/visualLearning.js';
import { readJSON, writeJSON } from '../lib/storage.js';
import { go } from '../lib/router.js';

const KEY = 'lkq-playtest-v1';
export default function Playtest() {
  const [session, setSession] = useState(() => ({ version: 1, ageBand: '7–9', device: 'Tablet', observations: {}, ...readJSON(KEY) }));
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [saved, setSaved] = useState(false);
  const task = PLAYTEST_TASKS[index];
  const row = session.observations[task.id] || {};
  useEffect(() => { if (!row.startedAt || row.seconds !== undefined) return; const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, [row.startedAt, row.seconds]);
  const change = (key, value) => { setSaved(false); setSession(old => ({ ...old, [key]: value })); };
  const observe = patch => { setSaved(false); setSession(old => ({ ...old, observations: { ...old.observations, [task.id]: { ...old.observations[task.id], ...patch } } })); };
  const save = () => { writeJSON(KEY, session); setSaved(true); };
  const exportNotes = () => {
    const blob = new Blob([JSON.stringify({ ...session, exportedAt: new Date().toISOString(), note: 'Facilitator observations; not automatically verified learning outcomes.' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'lunar-kids-anonymous-playtest.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const seconds = row.seconds ?? (row.startedAt ? Math.max(0, Math.floor((now - row.startedAt) / 1000)) : null);
  return <div className="screen scroll"><div className="pad playtest-page"><button className="btn btn-soft" onClick={() => go('grownups')}>← For grown-ups</button><span className="learning-eyebrow">FACILITATOR TOOL · PREPARED FOR LATER</span><h1 className="display">Watch a child play</h1>
    <section className="learning-card"><h2>Before you start</h2><p>Use with a parent or guardian’s permission and a willing child. They can stop whenever they want. Say: “We’re testing the game, not you.”</p><p>Let the child try first. Use the same prompt for each child. Record help honestly. Do not enter names, contact details, photos, or recordings.</p><p>Keep this page open while the child plays in a second tab. Start the first observation when the child begins.</p><a className="btn btn-soft" href="#map" target="_blank" rel="noreferrer">Open the game in another tab</a><p>No study has been run by this tool. Empty tasks mean “not observed.” Notes save only when you press Save on this device; nothing is uploaded.</p><label>Age band <select value={session.ageBand} onChange={e => change('ageBand', e.target.value)}><option>7–9</option><option>10–12</option></select></label><label>Device <select value={session.device} onChange={e => change('device', e.target.value)}><option>Tablet</option><option>Phone</option><option>Computer</option></select></label></section>
    <section className="learning-card"><div className="flash-top"><b>Observation {index + 1} / {PLAYTEST_TASKS.length}</b><span aria-live="polite">{seconds === null ? 'Not timed' : `${seconds}s`}</span></div><h2>{task.title}</h2><blockquote>Ask: “{task.prompt}”</blockquote><p><b>Watch for:</b> {task.observe}</p><div className="learning-actions"><button className="btn btn-soft" disabled={!!row.startedAt} onClick={() => { setNow(Date.now()); observe({ startedAt: Date.now() }); }}>Start observation</button><button className="btn btn-soft" disabled={!row.startedAt || row.seconds !== undefined} onClick={() => observe({ seconds: Math.max(0, Math.floor((Date.now() - row.startedAt) / 1000)) })}>Stop timing</button></div>
      <label>What happened?<select value={row.outcome || 'not-observed'} onChange={e => observe({ outcome: e.target.value })}><option value="not-observed">Not observed</option><option value="independent">Completed independently</option><option value="help">Completed with help</option><option value="stopped">Stopped or could not complete</option></select></label>
      <label>Adult help<select value={row.help || 'not-recorded'} onChange={e => observe({ help: e.target.value })}><option value="not-recorded">Not recorded</option><option value="none">None</option><option value="prompt">Repeated the prompt</option><option value="hint">Gave a hint</option><option value="direct">Showed how / took over</option></select></label>
      <label>Anonymous notes / the child’s own words<textarea rows={4} value={row.notes || ''} onChange={e => observe({ notes: e.target.value })} placeholder="What did they notice? Where did they hesitate?" /></label>
      <div className="flash-navigation"><button className="btn btn-soft" disabled={index === 0} onClick={() => setIndex(n => n - 1)}>Previous task</button><button className="btn btn-yellow" disabled={index === PLAYTEST_TASKS.length - 1} onClick={() => setIndex(n => n + 1)}>Next task</button></div>
    </section>
    <section className="learning-card"><h2>Observation checklist</h2>{PLAYTEST_TASKS.map(t => <p key={t.id}>{session.observations[t.id]?.outcome && session.observations[t.id].outcome !== 'not-observed' ? '✓' : '○'} {t.title}: {session.observations[t.id]?.outcome?.replaceAll('-', ' ') || 'not observed'}</p>)}<p>Look for patterns across sessions. Success in one session is not proof of educational effectiveness.</p><button className="btn btn-yellow" onClick={save}>Save notes on this device</button><button className="btn btn-soft" onClick={exportNotes}>Download anonymous notes</button><p>Download your notes before preparing another session. A new draft replaces saved notes only when you press Save.</p><button className="btn btn-soft" onClick={() => { setSession({ version: 1, ageBand: session.ageBand, device: session.device, observations: {} }); setIndex(0); setSaved(false); }}>New blank session</button>{saved && <p role="status">Notes saved on this device.</p>}</section>
  </div></div>;
}
