/** Wire Platonic solids. Geometry as language, not decoration. */

function wrap(inner, label) {
  return `<svg class="on-solid" viewBox="0 0 100 100" fill="none" role="img" aria-label="${label}">
    <g stroke="currentColor" stroke-width="1.35" stroke-linejoin="miter" stroke-linecap="square">
      ${inner}
    </g>
  </svg>`
}

export const solids = {
  tetrahedron: wrap(
    `<polygon points="50,8 12,88 88,88"/>
     <polygon points="50,8 50,62 12,88" opacity="0.85"/>
     <polygon points="50,8 50,62 88,88" opacity="0.7"/>
     <line x1="50" y1="62" x2="50" y2="8"/>
     <circle cx="50" cy="58" r="1.6" fill="currentColor" stroke="none"/>`,
    "Tetrahedron",
  ),
  cube: wrap(
    `<path d="M28 30 L50 18 L72 30 L72 62 L50 74 L28 62 Z"/>
     <polyline points="28,30 50,42 72,30"/>
     <line x1="50" y1="42" x2="50" y2="74"/>`,
    "Cube",
  ),
  octahedron: wrap(
    `<polygon points="50,8 88,50 50,92 12,50"/>
     <polyline points="12,50 50,38 88,50"/>
     <line x1="50" y1="8" x2="50" y2="92"/>
     <line x1="50" y1="38" x2="50" y2="92" opacity="0.45"/>`,
    "Octahedron",
  ),
  dodecahedron: wrap(
    `<polygon points="50,8 78,22 88,50 78,78 50,92 22,78 12,50 22,22"/>
     <polygon points="50,22 70,32 76,50 70,68 50,78 30,68 24,50 30,32"/>
     <line x1="50" y1="8" x2="50" y2="22"/>
     <line x1="78" y1="22" x2="70" y2="32"/>
     <line x1="88" y1="50" x2="76" y2="50"/>
     <line x1="78" y1="78" x2="70" y2="68"/>
     <line x1="50" y1="92" x2="50" y2="78"/>
     <line x1="22" y1="78" x2="30" y2="68"/>
     <line x1="12" y1="50" x2="24" y2="50"/>
     <line x1="22" y1="22" x2="30" y2="32"/>`,
    "Dodecahedron",
  ),
  icosahedron: wrap(
    `<polygon points="50,8 86,32 86,68 50,92 14,68 14,32"/>
     <polygon points="50,8 68,40 32,40"/>
     <polygon points="50,92 68,60 32,60"/>
     <line x1="14" y1="32" x2="32" y2="40"/>
     <line x1="86" y1="32" x2="68" y2="40"/>
     <line x1="14" y1="68" x2="32" y2="60"/>
     <line x1="86" y1="68" x2="68" y2="60"/>
     <line x1="32" y1="40" x2="32" y2="60"/>
     <line x1="68" y1="40" x2="68" y2="60"/>
     <line x1="50" y1="8" x2="50" y2="92" opacity="0.35"/>`,
    "Icosahedron",
  ),
}

export function solidMarkup(name) {
  return solids[name] || solids.tetrahedron
}
