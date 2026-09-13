---
name: tetra-vite-ui
description: >-
  Scaffold and style Tetra.Earth Vite UIs: near-black void, radius 0, glass nav that
  smokes out then a top-left corner appears, bottom-right dock, sliding footer.
  Use when building tetra websites, landings, apps, or any vite-ui / vite-site build.
---

# Tetra Vite UI

Default build type is **vite-ui** (apps) or **vite-site** (marketing). Vite only.

## Stack

```js
import "../../brand/tokens.css"
import "../../brand/chrome.css"
import "../../brand/buttons.css"
import { mountTetraChrome } from "../../brand/chrome.js"

mountTetraChrome({
  home: "/",
  blurb: "Proof of attention",
  nav: [{ href: "#faces", label: "Faces" }],
  footer: [{ href: "https://know.tetra.earth", label: "Know" }],
})
```

Wrap page content in `<main class="tetra-main">`. Content is **solid** void. Glass lives only on chrome.

## Top chrome is two layers

- Page top: sharp full-width glass nav bar. No triangle.
- On scroll: bar smokes out (width + opacity + blur, `--tetra-smoke`).
- Top-left triangle appears **only when the bar is fully gone**. Click it to smoke the bar back in.
- Do not morph one element from bar to triangle.

Do not add a second header, hamburger, or floating circular menu.

## Dock + footer

- Bottom-right: always-visible smaller glass triangle  
  `clip-path: polygon(100% 100%, 0 100%, 100% 0)` with a **clear hypotenuse**.
- Click it, or reach page bottom: sharp footer slides up with links.

`brand/chrome.js` already implements smoke collapse, delayed corner, click-to-expand, dock toggle, and bottom detection.

## Visual rules

- Near-black `#050705`. Radius 0 everywhere.
- Triad: green `#22c55e` primary, violet `#8b5cf6` + orange `#f97316` as glows.
- High-contrast text. Jost. Uppercase nav.
- Pattern fields stay behind content, never on the glass.
- Buttons: `.tetra-btn`. Transform sheen BR→off TL at 80%. Instant outside drop-shadow. Reverse on leave.

## Checklist

- [ ] Vite project, not another bundler
- [ ] tokens + chrome + buttons imported
- [ ] Buttons use `.tetra-btn` (full-pass transform sheen, instant outside glow)
- [ ] Bar smokes out; corner appears only when bar is gone
- [ ] Dock triangle, sliding footer
- [ ] No border-radius
- [ ] No glass on content cards
- [ ] Green mark in the collapsed triangle
