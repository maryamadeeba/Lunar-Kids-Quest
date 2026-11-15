import { useEffect, useState } from 'react';
import { canSpeak, speak, stopSpeaking } from '../lib/speech.js';

/** A round "read it to me" button. Tap again to stop. */
export default function SpeakButton({ text, size = 46, label = 'Read this aloud', light = false }) {
  const [on, setOn] = useState(false);
  useEffect(() => () => { if (on) stopSpeaking(); }, [on]);
  useEffect(() => { setOn(false); }, [text]);
  if (!canSpeak()) return null;
  const click = () => {
    if (on) { stopSpeaking(); setOn(false); return; }
    if (speak(text, { onEnd: () => setOn(false) })) setOn(true);
  };
  return (
    <button type="button" className="btn btn-round" onClick={click} aria-pressed={on} aria-label={on ? 'Stop reading' : label}
      style={{ width: size, height: size, background: on ? 'var(--yellow)' : light ? '#EEF0FF' : 'var(--green)', boxShadow: `0 4px 0 ${on ? 'var(--yellow-dark)' : light ? '#A9AEE0' : 'var(--green-dark)'}` }}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width={size * 0.52} height={size * 0.52} fill="none" stroke="#121B3B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9v6h4l5 4V5L8 9z" fill="#121B3B" />
        {on ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
      </svg>
    </button>
  );
}
