import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { mapPlaces } from "./data.js"

const TILE = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

function markIcon() {
  return L.divIcon({
    className: "grid-map-pin",
    html: `<span></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

export function mountGridMap(el) {
  if (!el || el.dataset.mapReady) return
  el.dataset.mapReady = "1"

  const display = el.querySelector("[data-map-display]")
  const map = L.map(el.querySelector("[data-map-canvas]"), {
    zoomControl: false,
    attributionControl: true,
    scrollWheelZoom: false,
  }).setView([6.455, 3.4], 12)

  L.tileLayer(TILE, { attribution: ATTR, maxZoom: 19 }).addTo(map)
  L.control.zoom({ position: "bottomleft" }).addTo(map)

  const show = (place) => {
    if (!display) return
    display.hidden = false
    display.innerHTML = `
      <p class="eyebrow">${place.kind || "Point"}</p>
      <h2>${place.name}</h2>
      <p>${place.copy || `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`}</p>
      <button class="tetra-btn tetra-btn--sm" type="button" data-map-close>Close</button>
    `
    display.querySelector("[data-map-close]")?.addEventListener("click", () => {
      display.hidden = true
    })
  }

  mapPlaces.forEach((place) => {
    const marker = L.marker([place.lat, place.lng], { icon: markIcon() }).addTo(map)
    marker.on("click", () => {
      map.setView([place.lat, place.lng], Math.max(map.getZoom(), 14), { animate: true })
      show(place)
    })
  })

  map.on("click", (event) => {
    const hit = mapPlaces.find((place) => {
      const here = L.latLng(place.lat, place.lng)
      return map.distance(here, event.latlng) < 180
    })
    map.panTo(event.latlng)
    show(
      hit || {
        name: "Focus",
        kind: "Map",
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        copy: "Centered. Markers are specimen offers and Recurve seats.",
      },
    )
  })

  const ro = new ResizeObserver(() => map.invalidateSize())
  ro.observe(el)

  return () => {
    ro.disconnect()
    map.remove()
  }
}
