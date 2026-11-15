// A bottom sheet that slides up over the screen (briefings, NASA cards, results).
// `fixed` pins it to the viewport, for long pages that scroll.
import { useEffect, useRef } from 'react';

export default function Sheet({ label, children, dim = 0.64, fixed = false }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const node = dialog.current;
    const controls = () => [...node.querySelectorAll('button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]')].filter(el => el.getClientRects().length);
    (controls()[0] || node).focus();
    const trap = event => {
      if (event.key !== 'Tab') return;
      const list = controls();
      const first = list[0] || node; const last = list.at(-1) || node;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === node)) { event.preventDefault(); first.focus(); }
    };
    const keepFocus = () => {
      if (document.querySelectorAll('[aria-modal="true"]').item(document.querySelectorAll('[aria-modal="true"]').length - 1) !== node) return;
      if (!node.contains(document.activeElement)) (controls()[0] || node).focus();
    };
    const observer = new MutationObserver(keepFocus);
    observer.observe(node, { childList: true, subtree: true });
    document.addEventListener('focusin', keepFocus);
    node.addEventListener('keydown', trap);
    return () => { observer.disconnect(); document.removeEventListener('focusin', keepFocus); node.removeEventListener('keydown', trap); if (previous?.isConnected) previous.focus(); };
  }, []);
  return (
    <div className="backdrop" style={{ background: `rgba(10,14,40,${dim})`, ...(fixed ? { position: 'fixed', justifyContent: 'center' } : {}) }}>
      <div ref={dialog} tabIndex={-1} className="sheet" role="dialog" aria-modal="true" aria-label={label} style={fixed ? { maxWidth: 430, maxHeight: '88vh' } : undefined}>
        {children}
      </div>
    </div>
  );
}
