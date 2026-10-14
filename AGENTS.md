# FORM / gym — Project requirements for Codex or Work

## Product intent
- Build a polished, independently designed, mobile-first Chinese dumbbell training website for the `EriseHe/gym` **standalone** repository.
- Deploy it to `https://erisehe.github.io/gym/` using this repository's GitHub Actions workflow.
- The existing `EriseHe/trip` project is relevant **only** as the deployment URL pattern. Do not import its code, CSS, modules or visual style.
- User explicitly rejects line-drawn stick figures and abstract exercise diagrams. Exercise tutorials must use photographs of real people or clearly identified real-person videos.

## Source media
- 12 exercises map to genuine two-frame photographs in yuhonas/free-exercise-db, Unlicense. Do not substitute photographs of the wrong exercise.
- Serratus punch links to real-person Wikimedia Commons footage by Buidhe under CC BY-SA 4.0; maintain attribution.
- Some photo sets use a bench or platform whereas the at-home instructions adapt to floor/wall-only; preserve clearly marked variation notes and do not silently claim exact equivalence.
- The GitHub Pages workflow runs `scripts/vendor_photos.py` to vendor the public-domain photos into `site/photos/` before deployment. The ZIP stays small without bundled binaries.

## Safety/privacy
- Plan is an educational, conservative strength and movement program, not a diagnosed treatment for shoulder or foot alignment.
- Use low starting loads; avoid claims that the user's shoulder-blade asymmetry and outward foot progression have a proven single root cause.
- Do NOT commit private posture videos, personal images, medical records or identifiable user information to the public repository.
- Client-only progress tracking is localStorage. No analytics or external account data.

## Engineering
- Static HTML, CSS and vanilla JavaScript in `site/`, no build tools required.
- Full mobile and desktop layouts; keyboard navigation and accessible controls.
- Smoke test: `python tests/test_ui.py` with Playwright/Chromium installed.
- `.github/workflows/pages.yml` uploads only `site/` to Pages.
- Keep public URL `https://erisehe.github.io/gym/` independent of other repositories; the previous `erisehe.github.io/public/gym/` site should only be retired after this site's deployment is verified.
