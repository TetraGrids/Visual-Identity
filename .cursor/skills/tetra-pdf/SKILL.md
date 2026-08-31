---
name: tetra-pdf
description: >-
  Produce Tetra.Earth PDFs and print decks from the same brand tokens. Use when
  making PDFs, slide decks, one-pagers, print, or a vite-pdf build.
---

# Tetra PDF (`vite-pdf`)

Same identity as the web system. No glass. No chrome morph.

## Build

1. Vite page using `brand/tokens.css` + `brand/print.css`.
2. Solid void (`#050705`) on screen; `print.css` inverts to paper white for print.
3. Export with browser Print → PDF, or Playwright `page.pdf()`.

```js
import "../../brand/tokens.css"
import "../../brand/print.css"
```

```html
<main class="tetra-pdf">
  <h1>Tetra</h1>
  <div class="rule"></div>
</main>
```

## Rules

- Radius 0. Jost. Tetrahedron G as line mark, not a photo.
- Green may stroke the mark. Violet/orange glows are optional on screen; drop them in print.
- Wordmark from `brand/geometry/wordmark.svg`.
- Do not include `.tetra-top`, `.tetra-dock`, or `.tetra-footer` on a print surface.
- Pattern: `pattern-trim.svg` as a hairline divider. Full print plates only on cover/back.

## Page

Letter, 16mm margin (`@page` in `print.css`). Keep type high-contrast. One idea per spread.
