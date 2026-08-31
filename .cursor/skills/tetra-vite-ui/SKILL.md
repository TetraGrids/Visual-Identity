---
name: tetra-vite-ui
description: >-
  Scaffold and style Tetra.Earth Vite UIs: near-black void, radius 0, glass nav that
  morphs into a top-left triangle, bottom-right dock triangle, sliding footer.
  Use when building tetra websites, landings, apps, or any vite-ui / vite-site build.
---

# Tetra Vite UI

Default build type is **vite-ui** (apps) or **vite-site** (marketing). Vite only.

## Stack

```js
import "../../brand/tokens.css"
import "../../brand/chrome.css"
import { mountTetraChrome } from "../../brand/chrome.js"

mountTetraChrome({
  home: "/",
  blurb: "Proof of attention",
  nav: [{ href: "#faces", label: "Faces" }],
  footer: [{ href: "https://know.tetra.earth", label: "Know" }],
})
```

Wrap page content in `<main class="tetra-main">`. Content is **solid** void. Glass lives only on chrome.

## Top chrome is one element

- Page top: sharp full-width glass nav bar. No triangle.
- On scroll: that bar morphs into a top-left glass right-triangle  
  `clip-path: polygon(0 0, 100% 0, 0 100%)`, ~120px, green icon in the corner.
- Click the triangle to expand the bar again.

Do not add a second header, hamburger, or floating circular menu.

## Dock + footer

- Bottom-right: always-visible smaller glass triangle  
  `clip-path: polygon(100% 100%, 0 100%, 100% 0)` with a **clear hypotenuse**.
- Click it, or reach page bottom: sharp footer slides up with links.

`brand/chrome.js` already implements scroll morph, click-to-expand, dock toggle, and bottom detection.

## Visual rules

- Near-black `#050705`. Radius 0 everywhere.
- Triad: green `#22c55e` primary, violet `#8b5cf6` + orange `#f97316` as glows.
- High-contrast text. Jost. Uppercase nav.
- Pattern fields stay behind content, never on the glass.

## Checklist

- [ ] Vite project, not another bundler
- [ ] tokens + chrome imported
- [ ] One top element, dock triangle, sliding footer
- [ ] No border-radius
- [ ] No glass on content cards
- [ ] Green mark in the collapsed triangle
