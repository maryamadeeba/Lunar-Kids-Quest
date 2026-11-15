import { useEffect, useRef, useState } from 'react';

/**
 * Countdown for a mission. The clock only ticks while `running` is true,
 * so it pauses while the child reads NASA cards or watches the base run.
 */
export function useMissionClock(totalSeconds, running, onTimeUp) {
  const [left, setLeft] = useState(totalSeconds);
  const timeUp = useRef(onTimeUp);
  timeUp.current = onTimeUp;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setTimeout(() => timeUp.current && timeUp.current(), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = () => setLeft(totalSeconds);
  return [left, reset];
}

export function formatClock(seconds) {
  const s = Math.max(0, seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
