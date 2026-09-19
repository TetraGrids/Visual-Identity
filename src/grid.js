import "../brand/tokens.css"
import "../brand/buttons.css"
import "./grid.css"
import "./grid/kinds.js"
import { defaultGrid } from "./grid/config.js"
import { renderGrid, hydrateKinds } from "./grid/render.js"
import { createGridEngine, itemsOf } from "./grid/snap.js"
import { mountGridMap } from "./grid/map.js"
import { mountOverview } from "./grid/overview.js"

export { defaultGrid, insertLane } from "./grid/config.js"
export { registerKind } from "./grid/kinds.js"

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "")
  if (!raw) return {}
  const [lane, room, sub] = raw.split("/")
  return { lane, room, sub }
}

function writeHash({ lane, room, sub }) {
  const next = `#/${lane}/${room}${sub ? `/${sub}` : ""}`
  if (location.hash !== next) history.replaceState(null, "", next)
}

export function mountTetraGrid(mount, config = defaultGrid) {
  mount.innerHTML = renderGrid(config)
  const root = mount.querySelector("[data-grid]")
  const yTrack = root.querySelector("[data-snap-y]")
  const way = root.querySelector("[data-way]")
  const dots = root.querySelector("[data-dots]")
  const notesBtn = root.querySelector("[data-notes-toggle]")
  const notesPanel = root.querySelector("[data-notes-panel]")
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let overview = null

  hydrateKinds(root)

  const realLane = (section) => {
    if (!section) return null
    if (!section.hasAttribute("data-clone")) return section
    const id = section.dataset.lane
    return root.querySelector(`.grid-lane[data-lane="${id}"]:not([data-clone])`)
  }

  const position = () => {
    const items = itemsOf(yTrack)
    const yIndex = engine.indexOf(yTrack)
    const laneEl = realLane(items[yIndex])
    const lane = config.lanes.find((item) => item.id === laneEl?.dataset.lane)
    const xTrack = laneEl?.querySelector(":scope > [data-snap-x]")
    const rooms = xTrack ? itemsOf(xTrack) : []
    const roomEl = rooms[xTrack ? engine.indexOf(xTrack) : 0]
    const room = lane?.rooms.find((item) => item.id === roomEl?.dataset.room)
    const subTrack = roomEl?.querySelector("[data-snap-sub]")
    const subEl = subTrack ? itemsOf(subTrack)[engine.indexOf(subTrack)] : null
    const sub = room?.subsections?.find((item) => item.id === subEl?.dataset.sub)
    return { laneEl, lane, xTrack, roomEl, room, subTrack, sub }
  }

  const paintChrome = () => {
    const { laneEl, lane, room, sub, xTrack, roomEl } = position()
    if (!lane) return
    way.textContent = [lane.name, room?.name, sub?.name].filter(Boolean).join(" · ")
    root.querySelectorAll(".grid-rail__btn").forEach((btn) => {
      btn.classList.toggle("is-on", btn.dataset.goLane === lane.id)
    })
    const rooms = lane.rooms
    dots.innerHTML = rooms
      .map(
        (item, i) =>
          `<button type="button" class="grid-dot${item.id === room?.id ? " is-on" : ""}" data-go-room="${i}" aria-label="${item.name}"></button>`,
      )
      .join("")
    root.classList.toggle("is-bleed", Boolean(laneEl?.hasAttribute("data-bleed")))
    writeHash({ lane: lane.id, room: room?.id, sub: sub?.id })
    if (lane.id === "map") {
      const mapEl = laneEl.querySelector("[data-grid-map]")
      mountGridMap(mapEl)
    }
    roomEl?.querySelectorAll(".leaflet-container").forEach(() => {})
    overview?.sync()
  }

  const engine = createGridEngine(root, {
    threshold: config.snap.threshold,
    wrapThreshold: config.snap.wrapThreshold,
    reduceMotion,
    onIndex: () => paintChrome(),
  })

  engine.jumpTo(yTrack, 1)

  const goLane = (id, { jump = false } = {}) => {
    const items = itemsOf(yTrack)
    const index = items.findIndex((item) => item.dataset.lane === id && !item.hasAttribute("data-clone"))
    if (index < 0) return
    if (jump) engine.jumpTo(yTrack, index)
    else engine.snapTo(yTrack, index)
  }

  const goRoom = (index) => {
    const { xTrack } = position()
    if (xTrack) engine.snapTo(xTrack, index)
  }

  const applyRoute = ({ lane, room, sub }) => {
    if (lane) goLane(lane, { jump: true })
    const pos = position()
    if (room && pos.xTrack) {
      const rooms = itemsOf(pos.xTrack)
      const ri = rooms.findIndex((item) => item.dataset.room === room)
      if (ri >= 0) engine.jumpTo(pos.xTrack, ri)
    }
    const next = position()
    if (sub && next.subTrack) {
      const subs = itemsOf(next.subTrack)
      const si = subs.findIndex((item) => item.dataset.sub === sub)
      if (si >= 0) engine.jumpTo(next.subTrack, si)
    }
    paintChrome()
  }

  applyRoute(parseHash())
  root.focus({ preventScroll: true })

  const goTo = ({ lane, room, sub }) => {
    applyRoute({ lane, room, sub: sub || undefined })
  }

  overview = mountOverview({
    root,
    config,
    getCurrent: position,
    goTo,
    reduceMotion,
  })

  notesBtn.addEventListener("click", () => {
    const open = notesPanel.hidden
    notesPanel.hidden = !open
    notesBtn.setAttribute("aria-expanded", String(open))
  })

  root.querySelector(".grid-rail").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-go-lane]")
    if (btn) goLane(btn.dataset.goLane)
  })

  dots.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-go-room]")
    if (btn) goRoom(Number(btn.dataset.goRoom))
  })

  window.addEventListener("hashchange", () => applyRoute(parseHash()))

  return {
    root,
    engine,
    config,
    goLane,
    destroy: engine.destroy,
  }
}

mountTetraGrid(document.getElementById("grid"))
