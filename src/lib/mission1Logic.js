// Mission 1 rules: every meter follows from the choices made so far.
import { MISSION1 } from '../data/mission1.js';
import { R } from '../data/ratios.js';
import { addEff, clamp } from './missionLogic.js';

export const m1Machine = (id) => MISSION1.machines.find((m) => m.id === id);
export const m1Used = (on) => MISSION1.machines.reduce((a, m) => a + (on[m.id] ? m.cost : 0), 0);
export const m1Recharge = (site, n) => (site === 'ridge' ? R.sunRechargeRidge.points : R.sunRechargeCrater.points + R.panelRecharge.points * n);

/** s = { site, taps (number of trips), on: {machineId: bool}, dayDone } */
export function m1Compute(s) {
  const r = { ...MISSION1.start };
  const n = s.taps || 0;
  if (s.site) { r.p = MISSION1.sites[s.site].p; r.w = MISSION1.sites[s.site].w; }
  if (s.site === 'ridge') { r.w += R.iceTripWater.points * n; r.p -= R.roverTripPower.points * n; }
  if (s.site === 'crater') { r.p += R.panelTripPower.points * n; r.s -= R.outdoorShield.points * n; }
  if (s.dayDone) {
    r.p = r.p - m1Used(s.on) + m1Recharge(s.site, n);
    const eff = addEff({}, MISSION1.daily);
    MISSION1.machines.forEach((m) => { if (s.on[m.id]) addEff(eff, m.eff); });
    ['o', 'w', 's'].forEach((k) => { r[k] += eff[k] || 0; });
  }
  Object.keys(r).forEach((k) => { r[k] = clamp(r[k], 0, k === 'p' ? MISSION1.maxPower : 10); });
  return r;
}
