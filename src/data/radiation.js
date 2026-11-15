// ============================================================
// Real radiation readings for the "Radiation ruler".
// Unit: μGy per hour (micro-grays per hour), RadLab's unit for
// absorbed dose rate: https://visualization.osdr.nasa.gov/radlab/kb/absorbed_dose_rate
// ============================================================
export const RADLAB_UNIT = { label: 'NASA RadLab: absorbed dose rate is in μGy per hour', href: 'https://visualization.osdr.nasa.gov/radlab/kb/absorbed_dose_rate' };

export const READINGS = [
  {
    id: 'mars', place: 'Mars surface, a calm day', who: 'Curiosity rover (RAD)', low: 4.8, high: 6.9, typical: 5.6, color: '#FF9F43',
    note: 'Curiosity’s readings from 24 to 27 February 2023 (RadLab). They stayed steady.',
    link: { label: 'NASA RadLab data portal', href: 'https://visualization.osdr.nasa.gov/radlab' },
  },
  {
    id: 'iss', place: 'Space Station, one orbit', who: 'DosTel detectors', low: 2, high: 12.6, typical: 6.3, color: '#4FC3F7',
    note: 'Readings from 1 to 2 April 2022 (RadLab). They rise and fall as the station circles Earth. (The query only kept readings above 2.)',
    link: { label: 'NASA RadLab data portal', href: 'https://visualization.osdr.nasa.gov/radlab' },
  },
  {
    id: 'moonCalm', place: 'Moon orbit, a calm day', who: 'Lunar Reconnaissance Orbiter (CRaTER)', low: 6.9, high: 7.8, typical: 7.3, color: '#8E95E8',
    note: 'Readings around the Moon on 24 February 2023, before the storm (RadLab).',
    link: { label: 'NASA RadLab data portal', href: 'https://visualization.osdr.nasa.gov/radlab' },
  },
  {
    id: 'orion', place: 'Inside Orion on the real Artemis I flight', who: 'Artemis I (M-42 sensor)', low: 15, high: 23, typical: 17, color: '#43D13A',
    note: 'Measured inside Orion from 16 November to 11 December 2022. No big solar storm happened on this flight. Right after launch, passing the radiation belts around Earth, it briefly reached about 4,100 per hour.',
    link: { label: 'NASA RadLab data portal', href: 'https://visualization.osdr.nasa.gov/radlab' },
  },
  {
    id: 'moonStorm', place: 'Moon orbit, storm peak', who: 'Lunar Reconnaissance Orbiter (CRaTER)', typical: 1453, color: '#FF9F43',
    note: 'The same detector at 8:00 am Pakistan time on 26 February 2023: about 200 times the calm day. Readings then stop for almost a day, so the real top may have been even higher.',
    link: { label: 'NASA RadLab data portal', href: 'https://visualization.osdr.nasa.gov/radlab' },
  },
  {
    id: 'shelter', place: 'Big solar storm, inside Orion’s storm shelter', who: 'Artemis I team (computer simulation of the October 1989 storm)', typical: 95 * 60, color: '#B9A6FF',
    note: 'A computer simulation of the huge October 1989 storm worked out its worst moment: 95 μGy per MINUTE in the shelter (that is 5,700 per hour). Not measured during the flight.',
    link: { label: 'Artemis I radiation measurements (Nature, 2024)', href: 'https://www.osti.gov/pages/servlets/purl/2447574' },
  },
  {
    id: 'cabin', place: 'Big solar storm, in Orion’s crew cabin', who: 'Artemis I team (computer simulation of the October 1989 storm)', typical: 414 * 60, color: '#FF8FB8',
    note: 'The same storm in the open cabin: 414 μGy per MINUTE (24,840 per hour). About 4 times the shelter.',
    link: { label: 'Artemis I radiation measurements (Nature, 2024)', href: 'https://www.osti.gov/pages/servlets/purl/2447574' },
  },
];

