# Our Family — Chen family tree

A static, offline family-tree landing page. No build step, no server, no account.

## Open the page

1. Open `index.html` in a browser (double-click it, or drag it onto a browser window).
2. That’s it. Everything runs from local files (`file://`).

Optional local server (if your browser restricts `file://` scripts):

```bash
cd family-tree
python3 -m http.server 8080
```

Then visit `http://localhost:8080/`.

## How to use the tree

- **+/−** on a couple (or parent) shows or hides that person’s descendants.
- Buttons are keyboard-accessible (Tab, then Enter or Space) and expose `aria-expanded`.
- **Expand all** / **Collapse all** and zoom controls sit under the legend.
- On a small screen, swipe sideways to pan; use the zoom buttons if the tree is tight.

Border colors:

| Who | Border |
| --- | --- |
| Bloodline male | Solid light blue |
| Bloodline female | Solid light pink |
| Spouse (married-in), any gender | Light gray dashed |

## Edit family data

All people live in **`family-data.js`**. Change it, save, then refresh the page.

Set `rootId` to the id of the person at the top of the tree.

Each person:

```js
"son-liangcai": {
  id: "son-liangcai",          // unique string; must match this key
  name: "陳良財",               // line 1: primary (Chinese) name
  englishName: "Liangcai Chen", // line 2: optional; "" or omit to hide the line
  gender: "male",              // "male" | "female"
  role: "bloodline",           // "bloodline" | "spouse"
  birthDate: "1950-03-10",     // line 3: "YYYY-MM-DD" (or "YYYY" / "YYYY-MM")
  deathDate: null,             // optional record only; never shown on the page
  photoUrl: null,              // optional path/URL; default anime avatar (avatars/default-male.jpg / default-female.jpg by gender) if missing
  spouseId: "sp-huiying",      // optional; set on both partners
  childrenIds: ["gc-jiayi", "gc-shaoyi"]
}
```

Tips:

- List children on the **bloodline** parent. The renderer also unions `childrenIds` from a spouse if you put them there.
- Point `spouseId` both ways (A → B and B → A).
- Put photos next to `index.html` (for example `photos/liangcai.jpg`) and set `photoUrl: "photos/liangcai.jpg"`.
- Each person shows exactly three lines: **name**, **English name** (skipped if empty), and **birthday** as `YYYY • MM • DD`. Death dates are never displayed, even if `deathDate` is filled in.
- Connector lines always attach to the **bloodline** member: the line to the children drops from the bloodline parent’s avatar (the +/− sits on it), and each child’s line comes up into that child’s avatar. Each bloodline member is centered over their children, and the sibling rail is centered under the parent's drop. A spouse only gets a short horizontal line to their partner.
- Avatars have a colored outline, then a ~3px white gap, then the photo (or the gender default avatar in `avatars/`). Replace those two files to change the defaults. Adjust `--ring-w` and `--ring-gap` in `styles.css` to change them.
- New people need a unique `id`, an entry in `people`, and a reference from a parent’s `childrenIds` (or a partner’s `spouseId`).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Landing page |
| `styles.css` | Layout, colors, expand/collapse animation |
| `tree.js` | Draws the tree and handles toggles |
| `family-data.js` | Editable family records |
| `sample-style.png` | Visual style reference |

Vanilla HTML, CSS, and JavaScript only.

## Names
`englishName` is optional and shown as a 3rd line only when set. Use it ONLY for English names Bill provides himself — never romanize Chinese names. Currently none are set.

## Age-group avatars
Without `photoUrl`, the avatar is `avatars/<gender>-<group>.jpg` from age (today, or at death): baby, 1-5, 5-10, 10-20 … 80-90, 90-100. If that file is missing or age is unknown, falls back to `default-<gender>.jpg`.
