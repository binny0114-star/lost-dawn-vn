# Lost Dawn development guide

This repository contains a dependency-light Korean visual novel built with HTML, CSS, Canvas 2D, and vanilla JavaScript.

## Commands

- Install: `npm ci`
- Run locally: `npm run serve`
- Full browser tests: `npm test`
- Desktop-only tests: `npm run test:desktop`
- Mobile-only tests: `npm run test:mobile`

## Constraints

- Keep the game runnable by opening `index.html` directly; do not introduce runtime package or CDN dependencies.
- Preserve localStorage compatibility for saves, settings, and ending unlocks.
- Keep all text and controls usable on desktop and mobile layouts.
- Run the Playwright suite after changing story flow, UI, storage, character rendering, or controls.
- Character sprites under `assets/characters/yoonseo/` are attributed to Xiael under CC BY. Preserve the in-game credit and `LICENSE.txt`.
- The phone preview is intentionally noindex. Preserve the robots meta tag and `robots.txt`.
