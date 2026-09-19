import "../brand/tokens.css"
import "../brand/chrome.css"
import "../brand/buttons.css"
import "./ui.css"
import "./landing.css"
import { mountTetraChrome } from "../brand/chrome.js"
import { bindUi, mountClock, mountSpots } from "./ui.js"
import gMark from "../brand/geometry/tetrahedron-g.svg?raw"

mountTetraChrome({
  home: "/",
  blurb: "Landing UI · demo",
  nav: [
    { href: "/#demos", label: "Demos" },
    { href: "/grid.html", label: "Grid" },
    { href: "#outcomes", label: "Outcomes" },
    { href: "#voices", label: "Voices" },
    { href: "#pipeline", label: "Pipeline" },
    { href: "#faq", label: "FAQ" },
  ],
  footer: [
    { href: "/#demos", label: "Demos" },
    { href: "/", label: "Guide" },
    { href: "/previews.html", label: "Previews" },
    { href: "/grid.html", label: "The Grid" },
    { href: "#invite", label: "Request invite" },
    { href: "https://tetra.earth", label: "tetra.earth" },
    { href: "https://know.tetra.earth", label: "Know" },
  ],
})

const mark = document.querySelector("[data-g]")
if (mark) mark.innerHTML = gMark

bindUi()
document.querySelectorAll("[data-clock]").forEach((node) => mountClock(node))
document.querySelectorAll("[data-spots]").forEach((node) => mountSpots(node, 9))
