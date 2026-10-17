import React from "react"
import { createRoot } from "react-dom/client"
import "@livekit/components-styles"
import "./meet.css"
import { App } from "./App.jsx"
import { mountTetraChrome } from "../../brand/chrome.js"

const root = document.getElementById("meet-root")
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Lobby / create / profile use Tetra chrome; room shell hides it via body class.
mountTetraChrome({
  home: "/",
  blurb: "Consensus meetings",
  nav: [
    { href: "#/lobby", label: "Lobby" },
    { href: "#/create", label: "Create" },
    { href: "#/profile", label: "Profile" },
    { href: "/grid.html", label: "Grid" },
  ],
  footer: [
    { href: "https://know.tetra.earth", label: "Know" },
    { href: "/#demos", label: "Demos" },
  ],
})
