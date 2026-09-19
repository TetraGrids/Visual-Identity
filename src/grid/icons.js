/** Geometric lane marks. Stroke-only, radius 0, currentColor. */

const svg = (body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">${body}</svg>`

const stroke = `stroke="currentColor" stroke-width="1.35" stroke-linejoin="miter" stroke-linecap="square"`

export const icons = {
  triangle: svg(
    `<polygon ${stroke} points="16,4 28.5,26.5 3.5,26.5"/>`,
    "Delta",
  ),
  square: svg(`<rect ${stroke} x="6" y="6" width="20" height="20"/>`, "Base"),
  pentagon: svg(
    `<polygon ${stroke} points="16,3.5 28.4,12.6 23.6,27.5 8.4,27.5 3.6,12.6"/>`,
    "Penta",
  ),
  merkaba: svg(
    `<g ${stroke}>
      <polygon points="16,3.2 28.2,25.8 3.8,25.8"/>
      <polygon points="16,28.8 3.8,6.2 28.2,6.2"/>
    </g>`,
    "Merkaba",
  ),
  crystal: svg(
    `<g ${stroke}>
      <polygon points="16,2.5 23.5,9.5 23.5,22.5 16,29.5 8.5,22.5 8.5,9.5"/>
      <polyline points="16,2.5 16,29.5"/>
      <polyline points="8.5,9.5 23.5,9.5"/>
      <polyline points="10.8,22.5 21.2,22.5"/>
    </g>`,
    "Crystal",
  ),
  globe: svg(
    `<g ${stroke}>
      <circle cx="16" cy="16" r="11.2"/>
      <polygon points="16,6.2 24.6,24.4 7.4,24.4"/>
      <line x1="16" y1="16.4" x2="16" y2="6.2"/>
      <line x1="16" y1="16.4" x2="7.4" y2="24.4"/>
      <line x1="16" y1="16.4" x2="24.6" y2="24.4"/>
    </g>`,
    "Govern",
  ),
  tetra: svg(
    `<g ${stroke}>
      <polygon points="16,3 3,27.5 29,27.5"/>
      <polygon points="9.5,15.25 16,27.5 22.5,15.25"/>
      <line x1="16" y1="19.17" x2="16" y2="3"/>
      <line x1="16" y1="19.17" x2="3" y2="27.5"/>
      <line x1="16" y1="19.17" x2="29" y2="27.5"/>
    </g>
    <circle cx="16" cy="19.17" r="1.15" fill="currentColor"/>`,
    "Tetra",
  ),
  map: svg(
    `<g ${stroke}>
      <polygon points="4.5,7 12.5,4.5 19.5,8 27.5,5.5 27.5,24.5 19.5,27 12.5,23.5 4.5,26"/>
      <line x1="12.5" y1="4.5" x2="12.5" y2="23.5"/>
      <line x1="19.5" y1="8" x2="19.5" y2="27"/>
    </g>`,
    "Map",
  ),
  control: svg(
    `<g ${stroke}>
      <rect x="4" y="18" width="6" height="10"/>
      <rect x="13" y="6" width="6" height="22"/>
      <rect x="22" y="12" width="6" height="16"/>
    </g>`,
    "Mission Control",
  ),
}

export function icon(name) {
  return icons[name] || icons.tetra
}
