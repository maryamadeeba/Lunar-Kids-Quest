// Tiny original sound effects made with the Web Audio API (no audio files).
// Sounds only play after a tap, and respect the mute toggle.
import { isSoundOn } from './storage.js';

let ctx = null;

const TUNES = {
  click: [600],
  pick: [880, 1175],
  good: [660, 880, 1320],
  oops: [300],
  low: [392, 294],
  win: [523, 659, 784, 1047, 1319],
};

export function playSound(kind = 'click') {
  if (!isSoundOn()) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = ctx || new AC();
    const notes = TUNES[kind] || TUNES.click;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === 'low' ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.11;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  } catch {
    /* audio is optional */
  }
}
