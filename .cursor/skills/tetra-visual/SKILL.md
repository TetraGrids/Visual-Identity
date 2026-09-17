---
name: tetra-visual
description: >-
  Tetra.Earth visual identity for any project on this machine: Tetrahedron G, void
  #050705, radius 0, Jost, green #22c55e primary, violet/orange glows, Vite chrome
  (bar smokes out then corner appears, bottom-right dock, sliding footer), gold
  button sweep with no corner triangle. Use when designing or building Tetra
  websites, apps, PDFs, landings, or any tetra.earth surface.
---

# Tetra visual identity

Applies on this computer and as a portable copy in the Visual-Identity repo. Keep both files **byte-identical**:

- Global: `~/.cursor/skills/tetra-visual/SKILL.md`
- Portable: `Visual-Identity/.cursor/skills/tetra-visual/SKILL.md`

If you edit one, write the same file to the other immediately.

Canonical geometry, tokens, and chrome live in the Visual-Identity repo (`brand/`). Copy or import from there. Do not invent a second system.

## Tokens

- Void `#050705`. Ink `#f4f7f4`. Primary green `#22c55e`.
- Violet `#8b5cf6` and orange `#f97316` are **glows only**, never large fills.
- Gold `#ffe566` is an interaction line only, not a triad fill.
- Radius is `0` everywhere. No pills, no rounded cards.
- Type: Jost. Display and nav uppercase + tracked. Body sentence case, high contrast.

## Mark

Tetrahedron G: a tetrahedron inside a larger tetrahedron, seen from above. Nested corner tetras. Use `brand/geometry/tetrahedron-g.svg`. UI icon: `icon-mark.svg` in green. Wordmark: `wordmark.svg` — do not redraw TETRA.

## Chrome (vite-ui / vite-site)

Glass only on bar, late corner, dock, footer. Content is solid void. Vite only.

- Page top: sharp full-width glass nav bar. No triangle at rest.
- On scroll: bar **smokes out** — width collapses left, opacity + blur to zero (`--tetra-smoke` 0.72s).
- Top-left glass triangle **appears at the exact instant the bar is fully gone**. Not a morph of the same element. Click it: triangle hides immediately, bar smokes in.
- Bottom-right: always-visible smaller glass triangle  
  `clip-path: polygon(100% 100%, 0 100%, 100% 0)`.
- Click it, or reach page bottom: sharp footer slides up with links.
- Top bar mark is a link to `home`. Dock click always toggles the footer (user choice wins until you leave the bottom).

Implement with `brand/chrome.css` + `brand/chrome.js`. Do not add a second nav. Do not morph bar into triangle.

## Buttons

Import `brand/buttons.css`. Class `tetra-btn`. Radius 0.

Hover: a 45° gold sheen (`transform` of a static gradient) from off the bottom-right **all the way off** the top-left at 80%. No park, no corner triangle. Glow is instant `drop-shadow` outside the button. Mouse out: the glow snaps off.

## Builds

| Type | Use |
| --- | --- |
| `vite-ui` | Default. Apps. |
| `vite-site` | Landings, docs, brand guide. |
| `vite-pdf` | Print. `brand/print.css`. No glass. |
| `mark` | SVG/PNG only. |

## Patterns

Tile `brand/geometry/pattern-field.svg` at low opacity. Print plates in `Backgrounds-and-Patterns/` and `Ready-Images/` are large-format, not UI chrome.
