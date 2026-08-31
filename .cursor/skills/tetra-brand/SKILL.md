---
name: tetra-brand
description: >-
  Apply the Tetra.Earth visual identity: Tetrahedron G mark, void/green/violet/orange
  triad, Jost, radius 0, glass chrome, patterns, and build types. Use when designing
  or building Tetra websites, apps, PDFs, landings, or any tetra.earth surface.
---

# Tetra.Earth brand

Read `brand/GUIDE.md` and import the tokens before inventing UI.

## Tokens

```css
@import "../../brand/tokens.css";
```

- Void `#050705`. Ink `#f4f7f4`. Primary green `#22c55e`.
- Violet `#8b5cf6` and orange `#f97316` are **glows only**, never large fills.
- Radius is `0` on every element. No pills, no rounded cards.

## Mark

- Master: `brand/geometry/tetrahedron-g.svg` — nested tetrahedron, top-down.
- UI icon: `brand/geometry/icon-mark.svg` in green, used in the collapsed top triangle.
- Wordmark: `brand/geometry/wordmark.svg` — TETRA in Jost. Do not redraw letters.
- Construction notes and do/don't: `brand/GUIDE.md`

## Type

Jost only. Display and nav: uppercase + tracked. Body: sentence case, high contrast.

## Chrome

If the surface is a website or app, follow [tetra-vite-ui](../tetra-vite-ui/SKILL.md). Glass only on bar, triangles, footer.

## Builds

| Type | Use |
| --- | --- |
| `vite-ui` | Default. Apps. |
| `vite-site` | Landings, docs, brand guide. |
| `vite-pdf` | [tetra-pdf](../tetra-pdf/SKILL.md) |
| `mark` | SVG/PNG only. |

Do not start Tetra UI in WordPress, CRA, or a rounded kit.

## Patterns

Tile `brand/geometry/pattern-field.svg` at low opacity. Print plates in `Backgrounds-and-Patterns/` and `Ready-Images/` are large-format, not UI chrome.
