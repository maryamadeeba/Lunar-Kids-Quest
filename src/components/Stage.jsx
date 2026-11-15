import { useEffect, useRef, useState } from 'react';

/**
 * Game scenes are drawn on a fixed 390-pixel-wide stage (a phone screen).
 * Stage scales that drawing to fit any width, so positions stay correct
 * on small phones, tablets and desktops.
 */
export default function Stage({ width = 390, height, children, style, className = '' }) {
  const box = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const update = () => setScale(el.clientWidth / width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={box} className={className} style={{ position: 'relative', width: '100%', height: height * scale, flex: 'none', overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width, height, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        {children}
      </div>
    </div>
  );
}
