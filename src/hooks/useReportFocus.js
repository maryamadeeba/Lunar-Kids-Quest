import { useEffect, useRef } from 'react';

/** Keep keyboard navigation inside a full-screen report and restore its opener. */
export function useReportFocus() {
  const ref = useRef(null);
  useEffect(() => {
    const before = document.activeElement;
    const node = ref.current;
    const controls = () => [...node.querySelectorAll('button:not(:disabled), a[href]')].filter(el => el.getClientRects().length);
    node.focus();
    const trap = e => {
      if (e.key !== 'Tab') return;
      const all = controls(); const first = all[0] || node; const last = all.at(-1) || node;
      if (e.shiftKey && (document.activeElement === first || document.activeElement === node)) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && (document.activeElement === last || document.activeElement === node)) { e.preventDefault(); first.focus(); }
    };
    node.addEventListener('keydown', trap);
    return () => { node.removeEventListener('keydown', trap); if (before?.isConnected) before.focus(); };
  }, []);
  return ref;
}
