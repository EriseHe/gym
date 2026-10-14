# FORM / gym — requirements

- Standalone Chinese workout website, not a trip theme or module. Do not import trip code.
- Current app: site/data.js (legacy exercise media), site/plan.js (v3 programming), site/training.js and site/training.css, site/index.html. Old app.js is no longer loaded.
- Real exercise photographs and real-person video only; no stick figures or generated demonstration photos. Disclose photo/home-variation differences prominently. New lunge is a forward lunge, not a reverse lunge or rear-foot-elevated split squat.
- v3 schedule: four strength days, two easy aerobic days, one rest day; third run is optional in develop phase. Specific stage/sets are a plan, not a clinically validated prescription.
- Stage escalation requires an explicit readiness confirmation; never silently increase load by date. Keep scapular-control exercises low-fatigue. Provide reduction/stopping pathways.
- No claims of a proven shoulder-to-foot diagnostic chain. No forced toe-angle correction. Do not upload private posture photos, videos or medical records.
- Preserve legacy form-gym-v2 localStorage without mutation. v3 has a separate storage key and export includes both. No analytics or remote personal-data writes.
- scripts/vendor_photos.py vendors exact photos from both data.js and plan.js before deployment. Keep source/media attribution.
- Tests: node tests/test_program.js; python tests/test_v3.py (Playwright/Chromium). Default UI test simulates storage offline; GYM_BASE enables real origin testing.
- Hosting currently uses the existing erisehe.github.io workflow, which checks out this independent repository. Verify actual public deployment, not just source commit success. Leave trip untouched.
