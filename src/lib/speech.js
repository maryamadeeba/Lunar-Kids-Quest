// ============================================================
// Read-aloud, using the browser's own built-in voice (Web Speech API).
// It works offline on most devices and sends nothing anywhere.
// If a browser has no voice, the read-aloud buttons simply hide.
// ============================================================
import { isSoundOn } from './storage.js';
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

/** Turn game text into something nice to hear (no emoji, symbols spelled out). */
export function forSpeech(text) {
  return String(text || '')
    .replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, '')
    .replace(/μGy/g, 'micro-grays')
    .replace(/−/g, 'minus ')
    .replace(/%/g, ' percent')
    .replace(/↗/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

let current = null;
export function speak(text, { onEnd } = {}) {
  if (!canSpeak() || !isSoundOn()) return false;
  stopSpeaking();
  const u = new window.SpeechSynthesisUtterance(forSpeech(text));
  u.rate = 0.92; u.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices() || [];
  const v = voices.find((x) => /^en(-|_)(IN|PK|GB)/i.test(x.lang)) || voices.find((x) => /^en/i.test(x.lang));
  if (v) u.voice = v;
  u.onend = () => { if (current === u) current = null; if (onEnd) onEnd(); };
  u.onerror = u.onend;
  current = u;
  window.speechSynthesis.speak(u);
  return true;
}
export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
  current = null;
}
