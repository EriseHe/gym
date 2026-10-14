from playwright.sync_api import sync_playwright
from pathlib import Path
import json
PROJECT=Path(__file__).resolve().parent.parent
SITE=PROJECT/'site'
issues=[]
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
  for width,height,label in [(1390,900,'desktop'),(390,844,'mobile')]:
    context=browser.new_context(viewport={'width':width,'height':height}, device_scale_factor=1)
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.set_content((SITE/'index.html').read_text(), wait_until='domcontentloaded')
    page.add_style_tag(content=(SITE/'styles.css').read_text())
    page.add_script_tag(content=(SITE/'data.js').read_text())
    page.add_script_tag(content=(SITE/'app.js').read_text())
    page.wait_for_timeout(300)
    assert page.locator('.day-chip').count()==7,'7 day tabs'
    assert page.locator('.exercise-row').count() >= 6,'today exercise rows'
    page.locator('.day-chip').nth(0).click()
    assert page.locator('.exercise-row').count()==8,'monday upper workout count'
    assert page.locator('.exercise-row img').count() >= 7, 'real photo image links in cards'
    before=page.locator('#session-progress').inner_text()
    page.locator('.set-btn').first.click()
    after=page.locator('#session-progress').inner_text()
    assert before!=after,f'set progress from {before} -> {after}'
    assert page.locator('#rest-timer').is_visible(), 'rest timer after set'
    page.locator('#timer-cancel').click()
    page.locator('.guide-open').first.click()
    assert page.locator('#exercise-drawer').is_visible(),'detail visible'
    assert page.locator('#drawer-content video').count()==1,'first warmup is real video'
    page.locator('#close-drawer').click()
    page.locator('.guide-open').nth(3).click()
    assert page.locator('#drawer-content .detail-photo img').count()==2, 'two real instructional photos'
    assert page.locator('#drawer-content .step-list li').count()==3,'three Chinese steps'
    page.locator('#detail-weight').fill('2')
    page.locator('#save-weight').click()
    page.locator('#close-drawer').click()
    nav=page.locator('[data-page="library"]')
    nav.last.click() if label=='mobile' else nav.first.click()
    assert page.locator('.library-card').count()==13, '13 gallery exercises'
    page.locator('#library-search').fill('侧平举')
    assert page.locator('.library-card').count()==1, 'search filter'
    nav=page.locator('[data-page="history"]')
    nav.last.click() if label=='mobile' else nav.first.click()
    assert page.locator('.history-summary').is_visible(), 'history screen'
    nav=page.locator('[data-page="guide"]')
    nav.last.click() if label=='mobile' else nav.first.click()
    assert page.locator('#guide-title').is_visible(), 'guide screen'
    nav=page.locator('[data-page="today"]')
    nav.last.click() if label=='mobile' else nav.first.click()
    page.locator('#phase-button').click()
    assert page.locator('#phase-dialog').is_visible(),'phase dialog'
    page.get_by_label('标准期', exact=False).first.check()
    page.locator('#phase-save').click()
    assert '标准期' in page.locator('#phase-name').inner_text(), 'phase changed'
    size=page.evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})')
    issues+=errors
    # Screenshots can be enabled during visual QA if needed
    print(label,json.dumps({'progress_before':before,'progress_after':after,'screen':size,'errors':errors},ensure_ascii=False))
    if size['scroll']>size['client']+1:issues.append(label+' horizontal overflow')
    context.close()
  browser.close()
assert not issues,issues
print('ALL TESTS PASSED')
