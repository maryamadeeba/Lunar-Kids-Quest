import { useState } from 'react';

/**
 * A real NASA photo with its credit. Tries a copy in /public/assets first
 * (works offline), then NASA's own server. If neither loads, it hides.
 */
export const SHACKLETON = {
  local: '/assets/nasa-shackleton-lroc.jpg',
  remote: 'https://svs.gsfc.nasa.gov/vis/a000000/a003600/a003634/LROC_v03.1000.jpg',
  alt: 'Real photo of Shackleton Crater at the Moon’s south pole, taken by NASA’s Lunar Reconnaissance Orbiter camera',
  caption: 'Real photo: Shackleton Crater at the Moon’s south pole, taken from orbit by NASA’s Lunar Reconnaissance Orbiter. Its rim gets lots of sunlight; inside is always dark.',
  credit: 'NASA/GSFC/Arizona State University',
  href: 'https://svs.gsfc.nasa.gov/3634/',
};

export const CURIOSITY = {
  local: '/assets/nasa-curiosity-pia22207.jpg',
  remote: 'https://photojournal.jpl.nasa.gov/jpeg/PIA22207.jpg',
  alt: 'Real photo: NASA’s Curiosity rover on Mars, with Mount Sharp behind it',
  caption: 'Real photo: NASA’s Curiosity rover took this selfie on Mars in January 2018, inside Gale Crater. Curiosity also measures radiation on Mars every day.',
  credit: 'NASA/JPL-Caltech/MSSS',
  href: 'https://www.jpl.nasa.gov/images/pia22207-mount-sharp-photobombs-curiosity/',
};

export default function NasaPhoto({ photo = SHACKLETON, height = 170 }) {
  const [src, setSrc] = useState(photo.local);
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <img src={src} alt={photo.alt} loading="lazy" onError={() => (src === photo.local ? setSrc(photo.remote) : setGone(true))}
        style={{ width: '100%', height, objectFit: 'cover', borderRadius: 16, background: '#0B1030' }} />
      <figcaption style={{ fontWeight: 700, fontSize: 13, lineHeight: '17px', color: 'inherit' }}>
        {photo.caption} Credit: <a href={photo.href} target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: 800 }}>{photo.credit} ↗</a>
      </figcaption>
    </figure>
  );
}
