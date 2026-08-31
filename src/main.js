import "../brand/tokens.css"
import "../brand/chrome.css"
import "./guide.css"
import { mountTetraChrome } from "../brand/chrome.js"
import gMark from "../brand/geometry/tetrahedron-g.svg?raw"
import hexMark from "../brand/geometry/tetrahedron-hex.svg?raw"
import tess from "../brand/geometry/pattern-tessellate.svg?raw"
import gridsLogo from "../Logos/Tetra-Grids-Logo-2.1.png"
import fancyPrint from "../Backgrounds-and-Patterns/Fancy-Print-Tetra-Logo[SMALL][1920].png"

mountTetraChrome({
  home: "#top",
  blurb: "Tetrahedron G · Visual identity",
  nav: [
    { href: "#mark", label: "Mark" },
    { href: "#color", label: "Triad" },
    { href: "#chrome", label: "Chrome" },
    { href: "#builds", label: "Builds" },
  ],
  footer: [
    { href: "#mark", label: "Mark" },
    { href: "#pattern", label: "Pattern" },
    { href: "#builds", label: "Builds" },
    { href: "https://tetra.earth", label: "tetra.earth" },
    { href: "https://know.tetra.earth", label: "Know" },
    { href: "#use", label: "Use" },
  ],
})

const hero = document.querySelector("[data-g]")
if (hero) hero.innerHTML = gMark

document.querySelectorAll("[data-g-mini]").forEach((node) => {
  node.innerHTML = node.dataset.gMini === "hex" ? hexMark : gMark
})

const pattern = document.querySelector("[data-pattern]")
if (pattern) pattern.innerHTML = tess

const plates = document.querySelectorAll(".plates-row img")
if (plates[0]) plates[0].src = gridsLogo
if (plates[1]) plates[1].src = fancyPrint
