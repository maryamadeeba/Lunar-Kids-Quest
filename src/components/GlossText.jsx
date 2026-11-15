import { useMemo, useState } from 'react';
import { GLOSS_KEYS } from '../data/glossary.js';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Whole words only ("sol" must not match inside "solar").
const RX = new RegExp(`(?<![A-Za-z])(${GLOSS_KEYS.map((x) => esc(x.k)).join('|')})(?![A-Za-z])`, 'gi');

/**
 * Plain text where science words can be tapped to see a kid-friendly
 * explanation. Only the first time each word appears is tappable.
 */
export default function GlossText({ text, dark = false }) {
  const [open, setOpen] = useState(null);
  const parts = useMemo(() => {
    const seen = new Set();
    return String(text || '').split(RX).map((piece, i) => {
      const hit = GLOSS_KEYS.find((x) => x.k.toLowerCase() === piece.toLowerCase());
      if (!hit || seen.has(hit.g.term)) return piece;
      seen.add(hit.g.term);
      return { piece, g: hit.g, i };
    });
  }, [text]);
  const def = open && parts.find((p) => typeof p === 'object' && p.g.term === open);
  return (
    <>
      {parts.map((p, i) => (typeof p === 'string' ? p : (
        <button key={i} type="button" onClick={(e) => { e.stopPropagation(); setOpen(open === p.g.term ? null : p.g.term); }}
          aria-expanded={open === p.g.term} aria-label={`${p.piece}: tap to see what it means`}
          style={{ font: 'inherit', color: 'inherit', background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(79,195,247,0.22)', border: 0, borderBottom: `2px dotted ${dark ? '#FFD21F' : '#1E88C7'}`, borderRadius: 4, padding: '0 2px', margin: 0, cursor: 'help', display: 'inline' }}>
          {p.piece}
        </button>
      )))}
      {def && (
        <span role="note" style={{ display: 'block', marginTop: 6, padding: '8px 10px', borderRadius: 12, background: dark ? 'var(--indigo-3)' : 'var(--sky-soft)', color: dark ? '#fff' : 'var(--navy)', fontWeight: 700, fontSize: 15, lineHeight: '20px' }}>
          <b>{def.g.term[0].toUpperCase() + def.g.term.slice(1)}:</b> {def.g.says}
        </span>
      )}
    </>
  );
}
