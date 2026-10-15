# Summary

Built a static interactive family-tree landing page for Bill Chen’s family site, matching the sample’s circular portraits, blue/pink bloodline borders, dashed spouse borders, and thin connecting lines.

## What you get

- **`index.html`** — “Our Family” header, legend, expand/collapse/zoom toolbar, tree canvas.
- **`styles.css`** — White minimalist layout; spouse dashed rings; SVG connector lines anchored to bloodline members; 3px white gap inside each avatar ring; grid-row expand/collapse animation.
- **`tree.js`** — Reads `window.FAMILY_DATA`, draws couples (male left / female right), 3-line labels (name / English name / birthday, no death dates), initials avatars, accessible +/− toggles (`aria-expanded`, `aria-controls`, keyboard).
- **`family-data.js`** — Four generations matching the sample structure: grandparents 陳清水 & 陳莫泊 → son 陳良財 (+ 簡惠瑛) and daughter 陳彩雲 (+ 溫明達) → grandchildren with spouses, plus two great-grandchildren so a nested branch can collapse.
- **`README.md`** — How to open the page and how to edit data.

Top three generations start expanded so the sample layout is visible. The fourth generation starts collapsed (click **+** under 陳佳沂 / 李進傑).

## Customize

1. Edit `family-data.js` (see field notes in that file and in `README.md`).
2. Refresh `index.html`.
3. Optional photos: set `photoUrl` to a relative path. Missing photos use colored initials.

No backend, no build, no auth. Works offline by opening `index.html`.
