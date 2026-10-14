/* FORM 3: resistance + aerobic programming. Teaching plan, not a diagnosis.
   Legacy exercise data and historical storage are preserved by training.js. */
(function () {
  'use strict';
  const E = window.GYM_DATA.exercises;
  Object.assign(E.row,{seconds:120});
  Object.assign(E.floorpress,{seconds:120});
  Object.assign(E.squat,{seconds:120});
  Object.assign(E.hinge,{seconds:120});
  Object.assign(E.lateral,{seconds:75,cues:['手臂略在身体侧前方，选择无痛范围','允许肩胛自然上旋，不用力压低肩膀','躯干不甩动，颈部不过度紧张']});
  Object.assign(E.calf,{seconds:60,muscle:'小腿跖屈肌群（直膝更偏腓肠肌）'});
  Object.assign(E.punch,{reps:'10–12 次 / 侧',seconds:30});
  Object.assign(E.rotation,{seconds:45});
  Object.assign(E.wallstretch,{reps:'20 秒 / 侧',sets:1});
  E.lunge = {
    title:'哑铃前弓步',en:'Dumbbell forward lunge',group:'臀腿力量',muscle:'股四头肌 / 臀大肌 / 单侧承重控制',
    equipment:'先徒手；稳定后持哑铃',reps:'8–10 次 / 侧',seconds:90,min:6,unilateral:true,photo:'Dumbbell_Lunges',
    intro:'增加单侧承重训练，但不是把脚尖扭正的矫正动作。两脚沿各自的轨道前后移动。',
    steps:['先徒手站稳，向前迈出一脚；左右留出舒适间距，不要走钢丝。','前后膝一起弯曲，前脚全脚掌稳定承重，下降到能控制的深度。','用前腿推地回到站立；先完成控制较差一侧，另一侧匹配次数。','徒手仍摇晃时，改为同一前后站距的原地分腿蹲，可轻扶墙；这一阶段不加哑铃。'],
    cues:['膝盖沿自然脚尖方向移动，不机械禁止膝盖过脚尖','只用稳定、无痛的动作幅度','每组左右两侧都做完，再勾完成'],
    pitfalls:['不要强行把自然外八的脚扭直','不要为了迈远而失去平衡','膝踝刺痛或脚步互相碰撞时停止该动作'],
    note:'照片是向前迈步版，不是反向弓步或后脚抬高版。扶墙原地分腿蹲是文字注明的降阶选择，不声称照片展示了该变式。'
  };
  const stages = {
    return:{name:'重新适应',weeks:'第 1–2 周',rir:'保留 3–4 次余力',run:[15,20],extra:0,description:'主项 2 组，辅助 1 组。先增加规律性，不重拾以前的冲刺强度。'},
    build:{name:'稳定训练',weeks:'第 3–4 周',rir:'保留 2–3 次余力',run:[20,25],extra:0,description:'主项 3 组，辅助 2 组。先把次数练稳，再考虑加重。'},
    develop:{name:'重点发展',weeks:'第 5–7 周',rir:'主项留 2 次；手臂最后一组可留 1–2 次',run:[25,35],extra:15,description:'肩中束和手臂增加少量组数。新增第三跑时，当周不再同时加腿部负重或跑步速度。'},
    deload:{name:'减量巩固',weeks:'第 8 周 / 疲劳时提前',rir:'保留至少 4 次余力',run:[15,20],extra:0,description:'减至发展期约一半组数，取消第三跑。必要时再降低重量。不是测试极限的一周。'}
  };
  // Sets: re-entry, build, develop, deload. A unilateral set includes BOTH sides.
  const item=(id,sets)=>({id,sets});
  const programs={
    U1:{title:'上肢 A · 肩宽与背部',desc:'先做低疲劳肩胛练习，再完成划船、侧平举和推举。肩臂增长与肩胛控制分别安排。',warm:'先轻松活动 3–5 分钟；第一个划船和卧推各用更轻重量试做 1 组，不计入工作组。',items:[item('punch',[1,1,1,1]),item('row',[2,3,3,2]),item('lateral',[1,3,4,2]),item('floorpress',[2,3,3,2]),item('biceps',[1,2,3,1]),item('kickback',[1,2,3,1]),item('rotation',[1,2,2,1])]},
    L1:{title:'下肢 A · 深蹲与单侧承重',desc:'深蹲优先，其次是弓步与轻一些的髋铰链。脚尖采用舒适角度，不靠硬扭来追求对称。',warm:'快走 3–5 分钟；徒手深蹲与髋铰链各 8 次，再用轻重量做深蹲试练。',items:[item('squat',[2,3,3,2]),item('lunge',[1,2,2,1]),item('hinge',[1,2,2,1]),item('calf',[2,3,3,2]),item('deadbug',[1,2,2,1])]},
    U2:{title:'上肢 B · 推举与上臂',desc:'与周一练相同的基础动作，调整顺序以关注推举和上臂。熟悉动作后再加重，不为求变化频繁换动作。',warm:'先轻松活动 3–5 分钟；地板卧推和划船各做 1 组轻重量试练。',items:[item('punch',[1,1,1,1]),item('floorpress',[2,3,3,2]),item('row',[2,3,3,2]),item('lateral',[1,3,4,2]),item('kickback',[1,2,3,1]),item('biceps',[1,2,3,1]),item('rotation',[1,2,2,1])]},
    L2:{title:'下肢 B · 臀腿后侧与稳定',desc:'髋铰链优先，深蹲量稍低。小腿、髋外展与核心补齐下肢训练，不把这些动作当成外八的确定治疗。',warm:'快走 3–5 分钟；徒手髋铰链与深蹲各 8 次，再做 1 组轻重量硬拉。',items:[item('hinge',[2,3,3,2]),item('squat',[1,2,2,1]),item('lunge',[1,2,2,1]),item('calf',[2,3,3,2]),item('hip',[1,2,2,1]),item('deadbug',[1,2,2,1])]}
  };
  const days=[
    {name:'上肢 A',kind:'U1',type:'strength',short:'肩宽背部',note:'发展期可选加 15 分钟轻松跑；默认不启用。合练先力量后有氧，能分开时可隔数小时。'},
    {name:'下肢 A',kind:'L1',type:'strength',short:'深蹲单侧',note:'不额外加冲刺或跳跃。一般腿部酸胀可减量，疼痛或动作改变时停止相关动作。'},
    {name:'轻松跑',kind:'C1',type:'cardio',short:'心肺基础',note:'前一天练腿：若酸痛让跑姿改变，今天改为舒适步行，不用硬凑跑量。'},
    {name:'上肢 B',kind:'U2',type:'strength',short:'推举手臂',note:'与上次上肢相隔约 72 小时。精细练琴、练鼓安排在力量训练前或分开时段。'},
    {name:'下肢 B',kind:'L2',type:'strength',short:'臀腿后侧',note:'与周二下肢相隔约 72 小时。不为了周六跑得更远而缩短今天的休息。'},
    {name:'较长轻松跑',kind:'C2',type:'cardio',short:'耐力积累',note:'较长不等于较快。腿部恢复差就缩短或改走路；不追加 100 米全力测试。'},
    {name:'完整休息',kind:'R',type:'rest',short:'恢复',note:'不安排必须完成的训练。可以舒适散步和照常生活，不补课、不清零进度。'}
  ];
  const stageIds=Object.keys(stages);
  function targets(kind,stage,recovery='normal'){
    if(!programs[kind]||recovery==='stop')return [];
    return programs[kind].items.map(x=>({id:x.id,sets:recovery==='easy'?Math.max(1,Math.ceil(x.sets[stageIds.indexOf(stage)]*.6)):x.sets[stageIds.indexOf(stage)]}));
  }
  function cardio(kind,stage,extra,recovery='normal'){
    if(recovery==='stop')return null;
    let minutes=kind==='C1'?stages[stage].run[0]:kind==='C2'?stages[stage].run[1]:kind==='U1'&&stage==='develop'&&extra?stages[stage].extra:0;
    if(!minutes)return null;
    const walking=recovery==='easy';if(walking)minutes=Math.min(20,minutes);
    return {minutes,warm:5,cool:5,walking,title:walking?'舒适步行（降阶）':kind==='C2'?'较长轻松跑':'轻松跑 / 可跑走交替',intensity:walking?'舒适、自然呼吸':'主观用力约 3–4 / 10，能说完整句子',note:'分钟数是目标，不是必须跑满的测试。说话困难就降速或走一段；不规定配速或用年龄公式强定心率。'};
  }
  function minutes(kind,stage,recovery,extra){
    const list=targets(kind,stage,recovery);let strength=list.length?7:0;
    list.forEach(x=>{const e=E[x.id],reps=parseInt(e.reps,10)||10,work=(e.unilateral?2:1)*reps*4/60;strength+=x.sets*work+Math.max(0,x.sets-1)*e.seconds/60+1;});
    const c=cardio(kind,stage,extra,recovery);const total=strength+(c?c.minutes+c.warm+c.cool:0);return {strength:Math.round(strength),total:Math.round(total),cardio:c};
  }
  window.FORM_PLAN={version:3,stages,stageIds,programs,days,targets,cardio,minutes,sources:[
    ['ACSM 2026：抗阻训练剂量与进阶','https://acsm.org/resistance-training-guidelines-update-2026/'],
    ['CDC：成人有氧与力量活动目标','https://www.cdc.gov/physical-activity-basics/guidelines/adults.html'],
    ['CDC：谈话测试与运动强度','https://www.cdc.gov/physical-activity-basics/measuring/index.html'],
    ['IJSPT：肩胛控制的评估与局限','https://ijspt.scholasticahq.com/article/31727-current-views-of-scapular-dyskinesis-and-its-possible-clinical-relevance'],
    ['并行有氧与力量训练：2022 系统综述','https://pubmed.ncbi.nlm.nih.gov/34757594/'],
    ['AAOS：肩部训练动作参考','https://www.orthoinfo.org/recovery/rotator-cuff-and-shoulder-conditioning-program/']
  ]};
})();
