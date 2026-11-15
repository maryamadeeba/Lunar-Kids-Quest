import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { R } from '../src/data/ratios.js';
import { MISSION_2, MISSION_3, FINAL_MISSION, MARS_MISSION } from '../src/data/missions.js';
import { MISSION1 } from '../src/data/mission1.js';
import { applyEff, roundEffect, harvestFor, actionPicks, cellsFor, cellsUsed, itemsFor, itemBlocked, readBase, startFor, actionEffect, mustRunFail } from '../src/lib/missionLogic.js';
import { m1Compute, m1Used } from '../src/lib/mission1Logic.js';
import { commitOfficialRun, previewRound, transitions, discoveries, contextualHint, recordLearning, explainTransition } from '../src/lib/learning.js';
import { completeMission, saveBase, getProgress } from '../src/lib/storage.js';
const store = new Map();
globalThis.window = { localStorage: { getItem:k => store.get(k)||null, setItem:(k,v)=>store.set(k,v), removeItem:k=>store.delete(k) } };
let checks=0;
function check(label, fn) { fn(); checks++; console.log('PASS '+label); }
check('All protected scientific files and original balance tests are byte-identical', () => {
 const baseline=JSON.parse(readFileSync('docs/science-baseline.json','utf8'));
 for (const [p,v] of Object.entries(baseline.files)) assert.equal(createHash('sha256').update(readFileSync(p)).digest('hex'),v.sha256,p);
 for (const [p,urls] of Object.entries(baseline.citationFiles)) for (const url of urls) assert.ok(readFileSync(p,'utf8').includes(url),p+': '+url);
});
check('Oxygen production still consumes original water and cells', () => {
 const oxy=MISSION_2.rounds[0].items.find(it=>it.id==='oxy');
 assert.equal(oxy.cost,R.oxyMakerPower.points); assert.equal(oxy.eff.w,-R.oxyMakerWater.points); assert.equal(oxy.eff.o,R.oxyMakerOxygen.points);
});
check('Recycler uses original power and recovered water',()=>{
 const rec=MISSION_2.rounds[0].items.find(it=>it.id==='rec');
 assert.equal(rec.cost,R.waterRecyclerPower.points); assert.equal(rec.eff.w,R.waterRecyclerWater.points);
});
check('Every legal power plan and action preview equals actual engine result, including clamping and harvest',()=>{
 for(const C of [MISSION_2,MISSION_3,FINAL_MISSION,MARS_MISSION]) for(const site of ['ridge','crater']) {
  const base={site,wall:true,tank:true,greenhouse:true,after:{}};
  const ons=[];
  for (const rd of C.rounds) {
   const available=itemsFor(rd,base,C.key);
   const picks=rd.type==='power'? Array.from({length:2**available.length},(_,mask)=>Object.fromEntries(available.map((it,i)=>[it.id,!!(mask&(1<<i))]))).filter(p=>cellsUsed(rd,p)<=cellsFor(rd,ons,base)&&available.every(it=>!p[it.id]||!itemBlocked(it,rd))) : rd.type==='action'?actionPicks(rd,base):(rd.options||[]).map(o=>o.id);
   for(const before of [startFor(C,base),Object.fromEntries(C.meters.map(k=>[k,9]))]) for(const pick of picks) {
    assert.deepEqual(previewRound(C.rounds,rd,before,pick,ons),applyEff(before,roundEffect(rd,pick,harvestFor(C.rounds,rd,ons))));
   }
   ons.push(Object.fromEntries(available.map(it=>[it.id,true])));
  }
 }
});
check('Harvest appears only in the original later round',()=>{
 const plant=MISSION_3.rounds[0]; const lamp=plant.items.find(it=>it.laterEff?.f);
 const ons=[{[lamp.id]:true}]; assert.deepEqual(harvestFor(MISSION_3.rounds,plant,ons),{});
 const later=MISSION_3.rounds.find(rd=>rd.harvestFrom===0);assert.equal(harvestFor(MISSION_3.rounds,later,ons).f,lamp.laterEff.f);
});
check('Shelter preserves original loss ratio and science cost; practice pick does not mutate event',()=>{
 const rd=FINAL_MISSION.rounds.find(rd=>rd.action==='storm'); const frozen=JSON.stringify(rd);
 assert.equal(-actionEffect(rd,{out:3,wall:0,shelter:0}).s,4*-actionEffect(rd,{out:0,wall:0,shelter:3}).s);
 assert.ok(actionEffect(rd,{out:0,wall:0,shelter:3}).c<0);assert.equal(JSON.stringify(rd),frozen);
});
check('Original life support and required heater failure rules remain',()=>{
 const rd=FINAL_MISSION.rounds.find(rd=>rd.mustRun); assert.ok(mustRunFail(rd,{}));
 const after=m1Compute({site:'ridge',taps:0,on:{},dayDone:true});assert.ok(MISSION1.essentials.some(k=>after[k]===0));
});
check('Consequences report actual clamped gain and cost',()=>{
 assert.deepEqual(transitions({o:9,w:5},applyEff({o:9,w:5},{o:4,w:-1})),[{key:'o',from:9,to:10,delta:1},{key:'w',from:5,to:4,delta:-1}]);
 assert.match(explainTransition({o:5,w:5},{o:9,w:4},3),/air.*cost battery cells and water/);
});
check('Discoveries require observed matching action and result',()=>{
 const rd=MISSION_2.rounds[0]; const oxy=rd.items.find(it=>it.id==='oxy');
 assert.ok(discoveries(rd,{oxy:true},{o:5,w:5},{o:9,w:4},[oxy]).includes('air'));
 assert.ok(!discoveries(rd,{oxy:false},{o:5,w:5},{o:9,w:4},[oxy]).includes('air'));
 assert.ok(!discoveries(rd,{oxy:true},{o:10,w:5},{o:10,w:4},[oxy]).includes('air'));
});
check('Practical hints do not suggest an unaffordable life-support machine',()=>{
 const rd=MISSION_2.rounds[0];const hint=contextualHint(rd,{wall:false},'m2',{},0,2); assert.match(hint,/freeing cells/);
});
check('Learning storage versions and deduplicates without touching old progress',()=>{
 completeMission('m1',3);saveBase('m1',{o:5,w:6,s:7},{site:'ridge',wall:true});const before=JSON.stringify(getProgress());
 recordLearning('m2',['air','air','bogus'],{o:5},{o:9});recordLearning('m2',['power'],{o:5},{o:9});
 const learning=JSON.parse(store.get('lkq-learning-v1'));assert.equal(learning.version,1);assert.deepEqual(learning.discoveries,['air','power']);assert.equal(JSON.stringify(getProgress()),before);
});
check('Tutorial machine simulation is isolated and uses the original engine',()=>{
 const before=structuredClone(MISSION_2.start);const snapshot=JSON.stringify(MISSION_2.start);const oxy=MISSION_2.rounds[0].items.find(it=>it.id==='oxy');applyEff(before,oxy.eff);assert.equal(JSON.stringify(MISSION_2.start),snapshot);assert.deepEqual(before,MISSION_2.start);
});
check('Comparison runs cannot overwrite official stars, base or unlocks',()=>{
 const before=JSON.stringify(getProgress());
 assert.equal(commitOfficialRun({practice:true,key:'m1',stars:1,res:{o:1,w:1,s:1},patch:{site:'crater',wall:false},extra:{waterWizard:false}}),false);
 assert.equal(JSON.stringify(getProgress()),before);
 commitOfficialRun({practice:false,key:'m2',stars:2,res:{o:8,w:7},patch:{tank:true}});
 assert.equal(getProgress().m2Stars,2);assert.equal(getProgress().base.tank,true);
});
console.log(`\n${checks} regression groups passed.`);
