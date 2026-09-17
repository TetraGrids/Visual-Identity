import "../brand/tokens.css"
import "../brand/chrome.css"
import "../brand/buttons.css"
import "./guide.css"
import { mountTetraChrome } from "../brand/chrome.js"
import gMark from "../brand/geometry/tetrahedron-g.svg?raw"
import hexMark from "../brand/geometry/tetrahedron-hex.svg?raw"
import tess from "../brand/geometry/pattern-tessellate.svg?raw"
import gridsLogo from "../Logos/Tetra-Grids-Logo-2.1.png"
import fancyPrint from "../Backgrounds-and-Patterns/Fancy-Print-Tetra-Logo[SMALL][1920].png"

mountTetraChrome({
  home: "/",
  blurb: "Tetrahedron G · Visual identity",
  nav: [
    { href: "/#demos", label: "Demos" },
    { href: "/landing.html", label: "Landing" },
    { href: "/previews.html", label: "Previews" },
    { href: "#mark", label: "Mark" },
    { href: "#chrome", label: "Chrome" },
    { href: "#controls", label: "Controls" },
  ],
  footer: [
    { href: "/#demos", label: "Demos" },
    { href: "/landing.html", label: "Landing UI" },
    { href: "/previews.html", label: "Previews" },
    { href: "#mark", label: "Mark" },
    { href: "https://tetra.earth", label: "tetra.earth" },
    { href: "https://know.tetra.earth", label: "Know" },
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
