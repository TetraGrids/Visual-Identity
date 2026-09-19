import "../brand/tokens.css"
import "../brand/chrome.css"
import "../brand/buttons.css"
import "./ui.css"
import "./previews.css"
import { mountTetraChrome } from "../brand/chrome.js"
import { bindUi, mountClock, mountSpots } from "./ui.js"

mountTetraChrome({
  home: "/",
  blurb: "UI shapes · demo",
  nav: [
    { href: "/#demos", label: "Demos" },
    { href: "/grid.html", label: "Grid" },
    { href: "#controls", label: "Controls" },
    { href: "#fields", label: "Fields" },
    { href: "#overlays", label: "Overlays" },
    { href: "/landing.html", label: "Landing" },
  ],
  footer: [
    { href: "/#demos", label: "Demos" },
    { href: "/landing.html", label: "Landing UI" },
    { href: "/", label: "Guide" },
    { href: "/grid.html", label: "The Grid" },
    { href: "https://know.tetra.earth", label: "Know" },
    { href: "https://tetra.earth", label: "tetra.earth" },
  ],
})

bindUi()
document.querySelectorAll("[data-clock]").forEach((node) => mountClock(node))
document.querySelectorAll("[data-spots]").forEach((node) => mountSpots(node, 9))
