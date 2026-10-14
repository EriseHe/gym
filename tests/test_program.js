const assert=require('node:assert/strict');global.window={};require('../site/data.js');require('../site/plan.js');
const P=window.FORM_PLAN,E=window.GYM_DATA.exercises;
assert.equal(P.days.filter(x=>x.type==='strength').length,4);assert.equal(P.days.filter(x=>x.type==='cardio').length,2);assert.equal(P.days[6].kind,'R');
for(const phase of P.stageIds)for(const d of P.days){const t=P.targets(d.kind,phase);assert(t.every(x=>E[x.id]&&x.sets>=1));assert.equal(new Set(t.map(x=>x.id)).size,t.length);assert.equal(P.targets(d.kind,phase,'stop').length,0);assert.equal(P.cardio(d.kind,phase,true,'stop'),null);assert(P.minutes(d.kind,phase,'normal',false).total>=0);}
assert.equal(P.cardio('U1','return',true),null);assert.equal(P.cardio('U1','build',true),null);assert.equal(P.cardio('U1','deload',true),null);assert.equal(P.cardio('U1','develop',true).minutes,15);assert.equal(P.cardio('U1','develop',false),null);
assert(P.targets('U1','develop').find(x=>x.id==='punch').sets===1);assert(P.targets('U1','develop').find(x=>x.id==='lateral').sets===4);assert(P.cardio('C2','develop',true,'easy').walking);
console.log('PASS: weekly split, stage-specific sets, cardio, stopping, reductions and unilateral exercise availability.');
