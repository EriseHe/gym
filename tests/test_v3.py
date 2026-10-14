"""UI regression: offline DOM/storage simulation by default, actual URL via GYM_BASE."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json, os, re, base64
BASE = os.environ.get('GYM_BASE')
SITE = Path(__file__).resolve().parents[1] / 'site'
OUT = Path(os.environ.get('GYM_QA_OUT', '/tmp/form-gym-qa'))
OUT.mkdir(exist_ok=True, parents=True)
legacy = {'start':'2026-10-01','phase':'progress','weights':{'row':3},'logs':{'2026-10-12':{'sets':{'row':[0]},'completed':False,'targets':{'row':1}}}}
with sync_playwright() as p:
 browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'), headless=True, args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height,label in [(1440,1000,'desktop'),(390,844,'mobile'),(320,740,'small')]:
  ctx=browser.new_context(viewport={'width':width,'height':height})
  ctx.add_init_script('if(!localStorage.getItem("seeded")){localStorage.setItem("form-gym-v2",'+json.dumps(json.dumps(legacy))+');localStorage.setItem("seeded","1");}')
  errors=[]
  def boot(memory=None):
   q=ctx.new_page();q.on('pageerror',lambda x:errors.append(str(x)))
   if BASE:q.goto(BASE,wait_until='domcontentloaded')
   else:
    html=re.sub(r'<script[^>]*>.*?</script>','',(SITE/'index.html').read_text(),flags=re.S)
    q.set_content(html)
    q.evaluate('(mem)=>{const s={...mem};Object.defineProperty(window,"localStorage",{value:{getItem:k=>s[k]??null,setItem:(k,v)=>s[k]=String(v),removeItem:k=>delete s[k]}});window.__memory=s;}',memory or {'form-gym-v2':json.dumps(legacy)})
    for f in ['styles.css','training.css']:q.add_style_tag(content=(SITE/f).read_text())
    for f in ['data.js','plan.js','training.js']:q.add_script_tag(content=(SITE/f).read_text())
   q.wait_for_timeout(100);return q
  page=boot()
  assert page.locator('.day-chip').count()==7
  page.locator('.day-chip').nth(0).click();assert page.locator('.exercise-row').count()==7
  page.locator('[data-open="lateral"]').click();assert page.locator('.detail-photo img').count()==2
  assert page.locator('.step-list li').count()==3
  page.locator('#detail-weight').fill('2');page.locator('#save-weight').click();page.locator('#close-drawer').click()
  page.locator('#phase-button').click();page.locator('input[name="phase"][value="build"]').check();page.locator('#phase-save').click()
  assert page.locator('#phase-dialog').is_visible()
  page.locator('#readiness-confirm').check();page.locator('#phase-save').click()
  assert '稳定训练' in page.locator('#phase-name').inner_text()
  assert page.locator('#ex-row .set-btn').count()==3
  page.locator('#ex-row .set-btn').first.click();assert page.locator('#rest-timer').is_visible();page.locator('#timer-cancel').click()
  assert page.locator('#session-progress').inner_text()!='0%'
  memory=page.evaluate('window.__memory') if not BASE else None
  page.close();page=boot(memory);page.locator('.day-chip').nth(0).click();assert page.locator('#ex-row .is-done').count()==1
  page.locator('#phase-button').click();page.locator('input[name="phase"][value="deload"]').check();page.locator('#phase-save').click()
  assert page.locator('#ex-row .set-btn').count()==3
  assert json.loads(page.evaluate('localStorage.getItem("form-gym-v2")'))==legacy
  page.locator('.day-chip').nth(2).click();assert page.locator('.cardio-panel').count()==1
  page.locator('#save-run').click();assert '请填实际' in page.locator('#toast').inner_text()
  page.locator('.run-steps button').nth(1).click();assert page.locator('#rest-timer').is_visible();page.locator('#timer-cancel').click()
  page.locator('#run-minutes').fill('17');page.locator('#run-effort').fill('4');page.locator('#save-run').click()
  assert '100%' in page.locator('#session-progress').inner_text();assert page.locator('#aerobic-done').inner_text()=='17'
  page.locator('.day-chip').nth(4).click();page.locator('#readiness').select_option('stop');assert page.locator('.exercise-row').count()==0;assert page.locator('.stop-panel').count()==1
  page.locator('.day-chip').nth(6).click();assert page.locator('.exercise-row').count()==0;assert page.locator('.cardio-panel').count()==0
  nav=lambda name:page.locator(f'[data-page="{name}"]').last if label!='desktop' else page.locator(f'[data-page="{name}"]').first
  nav('history').click();assert '旧版训练记录' in page.locator('#history-list').inner_text();assert '17 分钟' in page.locator('#history-list').inner_text()
  nav('guide').click();assert page.locator('.stage-grid article').count()==4;assert page.locator('.source-panel a').count()>=6
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1')
  nav('library').click();assert page.locator('.library-card').count()==14
  page.locator('#library-search').fill('弓步');assert page.locator('.library-card').count()==1
  nav('today').click();page.locator('.day-chip').nth(0).click()
  if not BASE:
   data={str(f.relative_to(SITE)):'data:image/jpeg;base64,'+base64.b64encode(f.read_bytes()).decode() for f in (SITE/'photos').rglob('*.jpg')}
   page.evaluate('(data)=>{for(const img of document.images){const name=img.dataset.photo ? "photos/"+img.dataset.photo : img.getAttribute("src").replace("./","");if(data[name])img.src=data[name];}}',data)
   page.wait_for_timeout(100)
  page.screenshot(path=str(OUT/(label+'.png')),full_page=True)
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1')
  assert not errors,errors
  print(label,'PASS: navigation, steps, stage gate, storage, fixed targets, cardio, history, stop, rest, layout')
  ctx.close()
 browser.close()
