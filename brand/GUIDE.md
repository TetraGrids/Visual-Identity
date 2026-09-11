# Tetra.Earth Brand Guide

Public visual system for websites, PDFs, and apps. Geometry first. Vite first.

Read this file, then open the live guide (`npm run dev`) and import `brand/tokens.css` + `brand/chrome.css` + `brand/chrome.js`.

## Mark: Tetrahedron G

Tetra means four. The mark is a **tetrahedron inside a larger tetrahedron**, seen from above.

1. Draw an equilateral triangle — the outer tetra, looking down at a vertex.
2. Connect the three side midpoints — the inverted medial face.
3. From the centroid, draw to every vertex and every midpoint — the four faces, unfolded in place.
4. Repeat the same construction in each corner triangle — the inner tetra.

That nested figure is **Tetrahedron G**. Use `brand/geometry/tetrahedron-g.svg` as the master. Use `icon-mark.svg` at 24–32px. Use `tetrahedron-hex.svg` when you need the hex construction (v0).

Wordmark is **TETRA** in Jost, all caps, from `brand/geometry/wordmark.svg`. Do not restyle the letterforms.

Source plates live in `Logos/`, `Backgrounds-and-Patterns/`, and `Ready-Images/`.

## Color

| Token | Hex | Role |
| --- | --- | --- |
| Void | `#050705` | Page, panels, solid content |
| Ink | `#f4f7f4` | Primary text |
| Green | `#22c55e` | Primary. Icons, links, selection |
| Violet | `#8b5cf6` | Glow only |
| Orange | `#f97316` | Glow only |

Violet and orange are not fills for UI chrome. They ride the mark and glass as bloom.

## Type

**Jost** for everything. Display and nav: uppercase, tracked. Body: sentence case, high contrast on void. No rounded UI type.

## Shape

**Radius 0 everywhere.** Right triangles for chrome. Equilateral triangles for the mark. No pills, no chips with curves, no circular buttons except the geometric centroid dot inside the mark.

## Chrome (vite-ui / vite-site)

Glass exists only on the top bar, the top-left corner (after the bar is gone), the dock triangle, and the footer. Content is solid void.

Top chrome is **two layers**, not a morph:

- Page top: sharp full-width glass nav bar. No triangle.
- On scroll: the bar **smokes out** — width collapses left, opacity and blur drop first (`--tetra-smoke`).
- The top-left glass triangle **crossfades underneath** as the bar goes ghostly, solid as the bar finishes. Not a morph. Click it to bring the bar back; the triangle hides while the bar smokes in.

Bottom-right: always-visible smaller glass triangle  
`clip-path: polygon(100% 100%, 0 100%, 100% 0)` with a clear hypotenuse.

Click it, or reach page bottom: sharp footer slides up from the bottom with links.

## Patterns

| File | Use |
| --- | --- |
| `geometry/pattern-field.svg` | Tiled page field, green wire on void |
| `geometry/pattern-tessellate.svg` | CurrentColor tessellation |
| `geometry/pattern-trim.svg` | Horizontal trim / divider |
| `Backgrounds-and-Patterns/` | Print plates, large fields, not UI fills |
| `Ready-Images/` | Hero plates, login, Metatron prints |

Keep pattern opacity low on screens. Prints may go full density.

## Buttons

Use class `tetra-btn` from `brand/buttons.css`. Radius stays 0. Gold is an interaction accent, not a triad fill.

- Hover / focus: a **45° gold line** starts immediately from the bottom-right (transform sweep, not an animated gradient), 80% opacity in flight, **pauses** in the last pixel at the top-left at **60%**. The button **glows** (opacity on a static radial, not animated box-shadow). **No corner triangle.**
- Mouse out: the line eases back out the same diagonal (`cubic-bezier(0.7, 0, 0.3, 1)`).

Do not invent a second hover sheen. Do not round the control.

## Build types

| Type | When | How |
| --- | --- | --- |
| `vite-ui` | Apps, dashboards, future Tetra clients | Vite. Import tokens + chrome + buttons. Solid content. |
| `vite-site` | Marketing, docs, this guide, landings | Vite static. Same chrome. |
| `vite-pdf` | Decks, one-pagers, print | Vite page + `print.css`. No glass. Browser print or Playwright PDF. |
| `mark` | Logos, social, favicons | SVG from `brand/geometry/`. PNG masters in `Logos/`. |

Default is **vite-ui**. Do not start a new Tetra surface in WordPress, Create React App, or a rounded component kit.

## Do / don't

- Do put the green icon in the collapsed top triangle.
- Do keep the dock hypotenuse visible.
- Do use glass only on bar / triangles / footer.
- Do use `.tetra-btn` for the gold sweep (line pauses; no corner triangle).
- Don't round corners.
- Don't use violet or orange as large solid fills.
- Don't put the mark on a light field unless printing invert (`print.css`).
- Don't invent a second nav.
