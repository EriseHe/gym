(function(){
  'use strict';
  const D=window.GYM_DATA;
  if(!D)throw new Error('Workout data was not loaded.');
  const $=id=>document.getElementById(id);
  const STORE='form-gym-v2';
  const today=new Date();today.setHours(12,0,0,0);
  function key(d){return[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
  function dateFromKey(s){const parts=s.split('-').map(Number);return new Date(parts[0],parts[1]-1,parts[2],12);}
  function monday(d){const x=new Date(d);x.setDate(x.getDate()-((x.getDay()+6)%7));x.setHours(12,0,0,0);return x;}
  function datePlus(d,add){const x=new Date(d);x.setDate(x.getDate()+add);return x;}
  function dateLabel(d){return `${d.getMonth()+1}月${d.getDate()}日`;}
  function safe(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function read(){try{const raw=localStorage.getItem(STORE);const obj=JSON.parse(raw||'{}');return obj&&typeof obj==='object'?obj:{};}catch(_){return {};}}
  let toastTimeout=0;
  let state=read();
  if(!state.start){state.start=key(monday(today));}
  if(!state.logs||typeof state.logs!=='object')state.logs={};
  if(!state.weights||typeof state.weights!=='object')state.weights={};
  if(!state.phase)state.phase='auto';
  function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch(_){toast('当前浏览器无法保存训练记录');}}
  save();
  const WEEK_TYPES={intro:{label:'适应期',desc:'每项 1 组，建立动作控制',sets:1},base:{label:'标准期',desc:'每项 2 组，温和增加训练量',sets:2},progress:{label:'进阶期',desc:'主要动作 3 组，肩袖与活动练习维持轻负荷',sets:3}};
  let page='today',weekShift=0,selected=key(today),activeExercise=null,restDeadline=0,restSeconds=0,restPaused=false,restInterval=null,lastFocus=null,libraryFilter='全部';
  const lbox=$('drawer-scrim'),drawer=$('exercise-drawer');
  const muscleTypes=['全部','肩部增肌','上臂增肌','肩胛控制','背部力量','臀腿力量','核心稳定'];
  function currentWeekStart(){return datePlus(monday(today),weekShift*7);}
  function dayIndex(d){return(d.getDay()+6)%7;}
  function planFor(date){const weekday=dayIndex(date);return {day:D.weekdays[weekday],program:D.program[D.weekdays[weekday].kind]||null,index:weekday};}
  function weekNumber(date=dateFromKey(selected)){const a=monday(dateFromKey(state.start)),b=monday(date),weeks=Math.round((b-a)/(7*864e5));return Math.max(1,weeks+1);}
  function phaseCode(date=dateFromKey(selected)){if(state.phase!=='auto')return state.phase;return weekNumber(date)<=2?'intro':weekNumber(date)<=6?'base':'progress';}
  function phase(){return WEEK_TYPES[phaseCode()];}
  function setsFor(id,kind,date=dateFromKey(selected)){if(kind==='M')return 1;const ex=D.exercises[id];if(!ex)return 0;if(kind==='B'&&id==='punch')return 1;
    const code=phaseCode(date);if(code==='intro')return 1;if(code==='base')return ex.group==='活动度'?1:2;
    return ['肩部增肌','上臂增肌','背部力量','推举力量','臀腿力量'].includes(ex.group)?3:2;
  }
  function exercisesFor(date){const {program}=planFor(date);return program?program.segments.flatMap(s=>s.ids):[];}
  function logFor(k){if(!state.logs[k])state.logs[k]={sets:{},completed:false};if(!state.logs[k].sets)state.logs[k].sets={};return state.logs[k];}
  function isSetDone(log,id,i){return (log.sets[id]||[]).includes(i);}
  function statsFor(date){const {day}=planFor(date);const ids=exercisesFor(date),log=state.logs[key(date)]||{sets:{}};let total=0,done=0;
    for(const id of ids){const n=(log.targets&&log.targets[id])||setsFor(id,day.kind,date);total+=n;for(let i=0;i<n;i++){if(isSetDone(log,id,i))done++;}}
    return {total,done,percent:total?Math.round(done/total*100):0,completed:total?done===total:!!log.completed};
  }
  function estMinutes(date){const {day}=planFor(date),ids=exercisesFor(date);if(!ids.length)return day.kind==='W'?'15–30':'0';let t=0;for(const id of ids){const ex=D.exercises[id],n=setsFor(id,day.kind);t+=Math.max(1.5,(ex.min-1.5)/2*n+1.5)+Math.max(0,n-1)*ex.seconds/60;}
    const low=Math.max(5,Math.round(t-2));const high=Math.round(t+4);return `${low}–${high}`;
  }
  function photoURL(ex,i){return `${D.photoBase}${ex.photo}/${i}.jpg`;}
  function photoHTML(ex,i,css=''){
    if(!ex.photo)return `<div class="photo-fallback">本动作提供真人视频演示</div>`;
    return `<img src="${photoURL(ex,i)}" loading="lazy" class="${css}" alt="${safe(ex.title)}：${i===0?'起始位置':'动作结束位置'}的真人照片" data-fallback="1">`;
  }
  function tile(ex){return `<div class="photo-tile">${ex.photo?photoHTML(ex,0):`<video muted playsinline loop preload="metadata" aria-label="真人前锯肌推拳演示"><source src="${safe(ex.demo.src)}" type="video/webm"></video>`}<span class="media-badge">${ex.photo?'真人摄影':'真人视频'}</span><div class="fallback">照片暂时无法加载<br>请点击查看动作来源</div></div>`;}
  function sessionProgressText(st){return `${st.done}/${st.total} 组`;}
  function renderDates(){const mondayDate=currentWeekStart(),end=datePlus(mondayDate,6);
    $('week-range').textContent=`${mondayDate.getFullYear()} · ${dateLabel(mondayDate)} — ${dateLabel(end)}`;
    $('day-grid').innerHTML=D.weekdays.map((d,i)=>{
      const date=datePlus(mondayDate,i),k=key(date),stats=statsFor(date),selectedHere=selected===k;
      const label=d.kind==='A'?'上肢':d.kind==='B'?'下肢':d.kind==='M'?'轻练':d.kind==='W'?'散步':'休息';
      return `<button type="button" class="day-chip ${d.type==='strength'?'is-training':''} ${stats.completed?'is-completed':''}" role="tab" aria-selected="${selectedHere}" data-date="${k}" aria-controls="workout" title="${d.long} ${d.name}"><span class="dow">${d.long}</span><strong class="dom">${date.getDate()}</strong><span class="dtype">${label}</span><span class="dot"></span></button>`;
    }).join('');
    let doneDays=0;for(let i of [0,2,4])if(statsFor(datePlus(mondayDate,i)).completed)doneDays++;
    $('weekly-done').textContent=String(doneDays).padStart(2,'0');
  }
  function renderPhase(){const week=weekNumber(),p=phase();$('phase-name').textContent=`第 ${String(week).padStart(2,'0')} 周 · ${p.label}`;$('phase-hint').textContent=p.desc;$('sidebar-week').innerHTML=`${String(Math.min(week,8)).padStart(2,'0')}<span>/ 08</span>`;}
  function renderCards(ids,kind){const log=logFor(selected);return `<div class="exercise-list">${ids.map(id=>{
    const ex=D.exercises[id],count=(log.targets&&log.targets[id])||setsFor(id,kind),done=Array.from({length:count},(_,i)=>i).every(i=>isSetDone(log,id,i));
    return `<article class="exercise-row ${done?'complete':''}" id="ex-${id}" data-exercise="${id}">${tile(ex)}<div class="exercise-copy"><span class="exercise-eyebrow">${safe(ex.group)}</span><h4>${safe(ex.title)}</h4><div class="exercise-english">${safe(ex.en)}</div><div class="exercise-quick"><span><strong>${count} 组</strong></span><span>${safe(ex.reps)}</span><span>休息 ${ex.seconds} 秒</span></div></div><div class="exercise-controls"><div class="set-row"><span>完成组</span>${Array.from({length:count},(_,i)=>`<button type="button" data-set="${id}" data-num="${i}" class="set-btn ${isSetDone(log,id,i)?'is-done':''}" aria-pressed="${isSetDone(log,id,i)}" aria-label="${ex.title}第 ${i+1} 组${isSetDone(log,id,i)?'已完成':'未完成'}">${isSetDone(log,id,i)?'✓':i+1}</button>`).join('')}</div><div class="row-actions"><button class="timer-open" type="button" data-rest="${ex.seconds}" aria-label="${ex.title}休息计时">◷ 休息</button><button class="guide-open" type="button" data-open="${id}">照片教学 ↗</button></div></div></article>`;
  }).join('')}</div>`;}
  function renderSession(){const date=dateFromKey(selected),{day,program}=planFor(date),stats=statsFor(date);
    $('session-date').textContent=`${date.getFullYear()} / ${dateLabel(date)} · ${day.long} · ${day.name}`;
    $('session-title').textContent=program?program.header:day.name;
    $('session-description').textContent=program?program.desc:day.kind==='W'?'散步 15–30 分钟（可选），保持自然步宽和舒适脚尖角度。不要刻意扭正右脚；若反复脚跟碰踝，建议线下做步态评估。':'完全休息，不需要补练或整天用力夹紧肩胛。适当活动、保证睡眠。';
    $('session-length').textContent=stats.total?`${estMinutes(date)} min`:day.kind==='W'?'可选':'休息';
    $('session-progress').textContent=stats.total?`${stats.percent}%`:'—';$('progress-fill').style.width=`${stats.percent}%`;
    $('safety-inline').textContent=day.kind==='B'?'注意：脚部外旋与身体不对称的原因尚未确认。采用舒适的脚尖角度，出现扭转痛立即停止。':'注意：肩胛骨不对称不代表某一侧所有肌肉都弱。两侧均衡练，动作无痛且可控。';
    if(!program){$('day-workout-content').innerHTML=`<div class="rest-panel"><div class="rest-circle">${day.kind==='W'?'↗':'☼'}</div><h3>${day.kind==='W'?'恢复日，走一走':'今天不需要力量训练'}</h3><p>${safe($('session-description').textContent)}</p></div>`;}
    else{$('day-workout-content').innerHTML=program.segments.map((g,i)=>`<div class="segment-heading"><h3>${g.name}</h3><p>${g.note}</p></div>${renderCards(g.ids,day.kind)}`).join('');}
    $('finish-row').hidden=!(stats.total && stats.done===stats.total);
    const mark=$('finish-session'),log=state.logs[selected]||{};
    mark.textContent=log.completed?'已保存完成记录 ✓':'标记今日完成 ↗';mark.disabled=!!log.completed;
  }
  function renderToday(){renderPhase();renderDates();renderSession();}
  function toast(text){const el=$('toast');el.textContent=text;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),2600);}
  function chooseDate(k){selected=k;renderToday();}
  function toggleSet(exId,index){const log=logFor(selected);if(!log.targets){const date=dateFromKey(selected),{day}=planFor(date);log.targets={};for(const id of exercisesFor(date))log.targets[id]=setsFor(id,day.kind,date);}
    const list=new Set(log.sets[exId]||[]),wasDone=list.has(index);
    if(wasDone)list.delete(index);else list.add(index);
    log.sets[exId]=[...list].sort((a,b)=>a-b);log.completed=false;save();renderToday();
    if(wasDone)toast(`已取消 ${D.exercises[exId].title} 第 ${index+1} 组`);
    else{toast(`第 ${index+1} 组已记录。记得休息。`);const s=statsFor(dateFromKey(selected));if(s.done<s.total)beginRest(D.exercises[exId].seconds);}
  }
  function showPage(next){page=next;document.querySelectorAll('.screen').forEach(e=>e.hidden=e.id!==`screen-${next}`);document.querySelectorAll('[data-page]').forEach(el=>{el.classList.toggle('is-active',el.dataset.page===next);if(el.dataset.page===next)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
    if(next==='library')renderLibrary();if(next==='history')renderHistory();if(next==='today')renderToday();window.scrollTo({top:0,behavior:'instant'});
  }
  function renderLibrary(){const filters=$('library-filters');filters.innerHTML=muscleTypes.map(x=>`<button type="button" data-filter="${x}" class="${x===libraryFilter?'is-active':''}">${x}</button>`).join('');const term=$('library-search').value.trim().toLowerCase();const list=Object.entries(D.exercises).filter(([,ex])=>{
    const group=ex.group,match=libraryFilter==='全部'||(libraryFilter==='上臂增肌'&&(group==='上臂增肌'||group==='推举力量'))||(libraryFilter==='核心稳定'&&(group==='核心稳定'||group==='髋部稳定'||group==='踝部力量'))||(libraryFilter==='臀腿力量'&&(group==='臀腿力量'||group==='髋部稳定'||group==='踝部力量'))||(libraryFilter==='肩胛控制'&&(group==='肩胛控制'||group==='肩袖稳定'||group==='活动度'))||libraryFilter===group;
    return match&&`${ex.title} ${ex.en} ${ex.muscle} ${group}`.toLowerCase().includes(term);
  });$('library-count').textContent=`共 ${list.length} 个动作 · 点击照片查看两个姿势和中文步骤`;
    $('library-grid').innerHTML=list.length?list.map(([id,ex])=>`<button class="library-card" type="button" data-open="${id}"><div class="library-cover">${ex.photo?photoHTML(ex,0):`<video muted playsinline preload="metadata"><source src="${safe(ex.demo.src)}" type="video/webm"></video>`}<span class="cover-label">${ex.photo?'REAL PHOTO':'REAL VIDEO'}</span></div><div class="library-card-body"><strong>${safe(ex.title)}</strong><small>${safe(ex.en)}</small><p>${safe(ex.intro)}</p><span class="open-hint">打开动作指导 →</span></div></button>`).join(''):'<div class="empty-history">没有匹配的动作，请尝试其他关键词。</div>';
  }
  function renderHistory(){const logs=Object.entries(state.logs).filter(([k,l])=>k&&l&&typeof l==='object').sort((a,b)=>b[0].localeCompare(a[0]));let sessions=0,totalSets=0;
    logs.forEach(([k,l])=>{const st=statsFor(dateFromKey(k));totalSets+=Object.values(l.sets||{}).reduce((acc,x)=>acc+(Array.isArray(x)?x.length:0),0);if(l.completed&&st.total)sessions++;});
    $('history-summary').innerHTML=`<div><strong>${sessions}</strong><span>已完成力量 / 轻量训练日</span></div><div><strong>${totalSets}</strong><span>累计打勾组数</span></div><div><strong>${Object.keys(state.weights).length}</strong><span>已记录重量的动作</span></div>`;
    const relevant=logs.filter(([k,l])=>Object.keys(l.sets||{}).length||l.completed).slice(0,40);
    $('history-list').innerHTML=relevant.length?relevant.map(([k,l])=>{const date=dateFromKey(k),{day}=planFor(date),st=statsFor(date);return `<div class="history-item"><div><h3>${dateLabel(date)} · ${day.name}</h3><p>${l.completed?'已完成':`${st.done} / ${st.total} 组`} · ${day.long}</p></div><div class="history-percent">${st.percent}%</div></div>`;}).join(''):'<div class="empty-history">还没有训练记录。<br>打开「我的训练」，完成第一组动作后就会显示在这里。</div>';
  }
  function detailMedia(ex){
    if(ex.demo){return `<div class="media-stage-label">真人演示视频 / REAL MOVEMENT VIDEO</div><video controls playsinline preload="metadata" class="media-video"><source src="${safe(ex.demo.src)}" type="video/webm">你的浏览器可能不支持 WebM，请点击下方视频来源链接观看。</video><p class="media-note">真人视频 © Buidhe，<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a> · <a href="${safe(ex.demo.source)}" target="_blank" rel="noopener noreferrer">在 Wikimedia Commons 打开原视频 ↗</a></p>`;}
    return `<div class="media-stage-label">真人摄影 / START → FINISH</div><div class="detail-photos"><div class="detail-photo">${photoHTML(ex,0)}<span>01 · 起始位置</span></div><div class="detail-photo">${photoHTML(ex,1)}<span>02 · 动作结束</span></div></div><p class="media-note">真人照片来自 <a href="${D.sourceRepo}" target="_blank" rel="noopener noreferrer">Free Exercise DB</a> (Unlicense) · 若照片无法加载，请 <a href="${D.sourceRepo}/tree/main/exercises/${encodeURIComponent(ex.photo)}" target="_blank" rel="noopener noreferrer">在图库中查看 ↗</a></p>`;
  }
  function openDetail(id){const ex=D.exercises[id];if(!ex)return;activeExercise=id;lastFocus=document.activeElement;
    const weight=Number(state.weights[id]??0);$('drawer-content').innerHTML=`<p class="detail-category">${safe(ex.group)} / ${safe(ex.muscle)}</p><h2 class="detail-title" id="drawer-title">${safe(ex.title)}</h2><p class="detail-en">${safe(ex.en)}</p><p class="detail-intro">${safe(ex.intro)}</p><div class="detail-chips"><span class="detail-chip">${safe(ex.equipment)}</span><span class="detail-chip">${safe(ex.reps)}</span><span class="detail-chip">组间休息 ${ex.seconds}s</span></div><div class="media-stage">${detailMedia(ex)}</div><section class="detail-section"><h3>一步一步跟着做</h3><ol class="step-list">${ex.steps.map(x=>`<li>${safe(x)}</li>`).join('')}</ol></section><section class="detail-section"><h3>动作要点和常见错误</h3><div class="cue-columns"><div class="cue-box"><strong>✓ 保持这些要点</strong><ul>${ex.cues.map(x=>`<li>${safe(x)}</li>`).join('')}</ul></div><div class="cue-box bad"><strong>! 避免这些动作</strong><ul>${ex.pitfalls.map(x=>`<li>${safe(x)}</li>`).join('')}</ul></div></div></section>${ex.note?`<p class="exercise-note"><strong>版本提醒：</strong>${safe(ex.note)}</p>`:''}<div class="detail-bottom"><label for="detail-weight">记录每只哑铃重量（kg）<br><span>没有使用哑铃就留空</span></label><input type="number" id="detail-weight" min="0" max="100" step="0.5" value="${weight||''}" placeholder="选填"><button type="button" id="save-weight">保存重量</button></div>`;
    lbox.hidden=false;drawer.hidden=false;document.body.classList.add('body-locked');$('close-drawer').focus();
  }
  function closeDetail(){if(drawer.hidden)return;drawer.hidden=true;lbox.hidden=true;document.body.classList.remove('body-locked');activeExercise=null;if(lastFocus&&lastFocus.focus)lastFocus.focus();}
  function beginRest(s){restSeconds=s;restPaused=false;restDeadline=Date.now()+s*1000;$('rest-timer').hidden=false;clearInterval(restInterval);restInterval=setInterval(tickRest,250);tickRest();}
  function tickRest(){if(!restPaused)restSeconds=Math.max(0,Math.ceil((restDeadline-Date.now())/1000));$('timer-time').textContent=`${String(Math.floor(restSeconds/60)).padStart(2,'0')}:${String(restSeconds%60).padStart(2,'0')}`;$('timer-pause').textContent=restPaused?'▶':'Ⅱ';if(restSeconds<=0){clearInterval(restInterval);restInterval=null;toast('休息结束。准备下一组。');}}
  function cancelRest(){clearInterval(restInterval);restInterval=null;$('rest-timer').hidden=true;restSeconds=0;}
  function downloadLog(){const payload={exportedAt:new Date().toISOString(),start:state.start,phase:state.phase,logs:state.logs,weights:state.weights};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='form-training-log.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);}
  function openPhaseDialog(){const dlg=$('phase-dialog');$('phase-options').innerHTML=[['auto','自动按周推进','第 1–2 周 1 组；第 3–6 周 2 组；第 7–8 周主要动作 3 组'],['intro','适应期','每项 1 组 · 先学动作'],['base','标准期','多数动作 2 组 · 稳定增加训练量'],['progress','进阶期','主要增肌动作 3 组 · 肩部小肌群继续轻量']].map(([id,label,desc])=>`<label class="phase-option"><input type="radio" name="training-phase" value="${id}" ${id===state.phase?'checked':''}><div><strong>${label}</strong><small>${desc}</small></div></label>`).join('');dlg.showModal();}
  document.addEventListener('click',event=>{
    const e=event.target;
    const pg=e.closest('[data-page]');if(pg){showPage(pg.dataset.page);return;}
    const dt=e.closest('[data-date]');if(dt){chooseDate(dt.dataset.date);return;}
    const cb=e.closest('[data-set]');if(cb){toggleSet(cb.dataset.set,Number(cb.dataset.num));return;}
    const open=e.closest('[data-open]');if(open){openDetail(open.dataset.open);return;}
    const rt=e.closest('[data-rest]');if(rt){beginRest(Number(rt.dataset.rest));return;}
    const filter=e.closest('[data-filter]');if(filter){libraryFilter=filter.dataset.filter;renderLibrary();return;}
  });
  $('library-search').addEventListener('input',renderLibrary);
  $('prev-week').addEventListener('click',()=>{weekShift--;selected=key(currentWeekStart());renderToday();});
  $('next-week').addEventListener('click',()=>{weekShift++;selected=key(currentWeekStart());renderToday();});
  $('current-week').addEventListener('click',()=>{weekShift=0;selected=key(today);renderToday();});
  $('finish-session').addEventListener('click',()=>{const l=logFor(selected),st=statsFor(dateFromKey(selected));if(!st.total||st.done!==st.total)return;l.completed=true;save();renderToday();toast('已保存今日完成记录');});
  $('close-drawer').addEventListener('click',closeDetail);
  lbox.addEventListener('click',closeDetail);
  drawer.addEventListener('click',e=>{if(e.target.id==='save-weight'){const value=$('detail-weight').value;if(value.trim()===''){delete state.weights[activeExercise];save();toast('已清除重量记录');return;}const n=Number(value);if(!Number.isFinite(n)||n<0||n>100){toast('请填写 0–100 kg 的合理数值');return;}state.weights[activeExercise]=n;save();toast('已保存重量');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)closeDetail();});
  $('timer-pause').addEventListener('click',()=>{if(!restSeconds){beginRest(60);return;}restPaused=!restPaused;if(!restPaused)restDeadline=Date.now()+restSeconds*1000;tickRest();});
  $('timer-cancel').addEventListener('click',cancelRest);
  $('export-log').addEventListener('click',downloadLog);
  $('phase-button').addEventListener('click',openPhaseDialog);
  $('phase-close').addEventListener('click',()=>$('phase-dialog').close());
  $('phase-save').addEventListener('click',()=>{const checked=document.querySelector('input[name=training-phase]:checked');if(!checked)return;state.phase=checked.value;save();$('phase-dialog').close();renderToday();toast('训练阶段已更新');});
  document.addEventListener('error',e=>{const img=e.target;if(!(img instanceof HTMLImageElement))return;const original=img.getAttribute('src')||'';if(!img.dataset.remoteTried&&original.startsWith('./photos/')){img.dataset.remoteTried='true';img.src='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'+original.slice('./photos/'.length);return;}if(img.hasAttribute('data-fallback')){img.style.display='none';const parent=img.closest('.photo-tile,.detail-photo,.library-cover');if(parent){parent.classList.add('is-missing');if(!parent.querySelector('.photo-fallback')){const div=document.createElement('div');div.className='photo-fallback';div.textContent='图片暂时无法加载，可在动作来源页面查看。';parent.appendChild(div);}}}},true);
  $('topbar-date').textContent=new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(today);
  renderToday();
})();
