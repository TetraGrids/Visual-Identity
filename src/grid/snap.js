/**
 * Nested snap engine for The Grid.
 *
 * Horizontal rooms (top-level divisions). Vertical subsections, then lanes.
 * Right/left land on the first heading of the next room. Down/up walk a room,
 * then the next row across the 61vh gap. 38% to change unit; 62% to wrap.
 * Inner [data-scroll] panes own the wheel until they hit an edge, then leftover
 * continues with the same snap rules.
 */

const SLOP = 12
const WHEEL_IDLE = 280
const SNAP_MS = 460
const SCROLL_EPS = 2
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)"

const AXIS = {
  x: {
    attr: "[data-snap-x]",
    start: "clientX",
    delta: "deltaX",
    size: (el) => el.clientWidth || el.parentElement?.clientWidth || window.innerWidth,
    scrollPos: (el) => el.scrollLeft,
    scrollMax: (el) => el.scrollWidth - el.clientWidth,
    applyScroll: (el, d) => {
      el.scrollLeft += d
    },
    translate: (n) => `translate3d(${n}px,0,0)`,
  },
  y: {
    attr: "[data-snap-y]",
    start: "clientY",
    delta: "deltaY",
    size: (el) => el.clientHeight || el.parentElement?.clientHeight || window.innerHeight,
    scrollPos: (el) => el.scrollTop,
    scrollMax: (el) => el.scrollHeight - el.clientHeight,
    applyScroll: (el, d) => {
      el.scrollTop += d
    },
    translate: (n) => `translate3d(0,${n}px,0)`,
  },
}

export function itemsOf(track) {
  return [...track.children].filter((node) => node.matches("[data-snap-item]"))
}

function canScroll(el, axis, dir) {
  if (!el) return false
  const spec = AXIS[axis]
  const pos = spec.scrollPos(el)
  const max = spec.scrollMax(el)
  if (max <= SCROLL_EPS) return false
  if (dir > 0) return pos < max - SCROLL_EPS
  return pos > SCROLL_EPS
}

function consumeScroll(el, axis, raw) {
  const spec = AXIS[axis]
  const before = spec.scrollPos(el)
  spec.applyScroll(el, raw)
  return raw - (spec.scrollPos(el) - before)
}

function wheelRaw(event, axis) {
  let raw = axis === "x" ? event.deltaX : event.deltaY
  if (event.deltaMode === 1) raw *= 16
  if (event.deltaMode === 2) raw *= axis === "x" ? window.innerWidth : window.innerHeight
  return raw
}

function canSnap(track, dir, index) {
  const max = itemsOf(track).length - 1
  if (dir > 0) return index < max
  return index > 0
}

function isInteractive(target) {
  return Boolean(
    target.closest?.("button, a, input, textarea, select, option, [data-grid-ignore], .leaflet-container"),
  )
}

function isMap(target) {
  return Boolean(target.closest?.(".leaflet-container"))
}

export function createGridEngine(root, { threshold, wrapThreshold, edgeThreshold = 0.61, softThreshold = 0.42, onIndex, reduceMotion }) {
  const indices = new WeakMap()
  const bases = new WeakMap()
  let gesture = null
  let wheelTimer = 0
  let animating = false

  const duration = () => (reduceMotion ? 1 : SNAP_MS)

  const indexOf = (track) => indices.get(track) ?? 0

  const setIndex = (track, index) => {
    indices.set(track, index)
  }

  const axisOf = (track) => (track.matches("[data-snap-y]") ? "y" : "x")

  const viewSize = (track) => AXIS[axisOf(track)].size(track.parentElement || track)

  const itemSpan = (track, item) => {
    const y = axisOf(track) === "y"
    const style = getComputedStyle(item)
    const margin = y ? parseFloat(style.marginBottom) || 0 : parseFloat(style.marginRight) || 0
    return (y ? item.offsetHeight : item.offsetWidth) + margin
  }

  const paint = (track, px, withTransition) => {
    track.style.transition = withTransition ? `transform ${duration()}ms ${EASE}` : "none"
    track.style.transform = AXIS[axisOf(track)].translate(px)
    bases.set(track, px)
  }

  const restPx = (track, index = indexOf(track)) => {
    const items = itemsOf(track)
    const limit = Math.max(0, Math.min(index, items.length))
    let px = 0
    for (let i = 0; i < limit; i += 1) px += itemSpan(track, items[i])
    return -px
  }

  const snapTo = (track, index, { silent } = {}) => {
    const items = itemsOf(track)
    const from = indexOf(track)
    const next = Math.max(0, Math.min(items.length - 1, index))
    setIndex(track, next)
    paint(track, restPx(track, next), !reduceMotion)
    alignAfter(track, from, next, items)
    if (from !== next) {
      items[next]?.querySelectorAll("[data-scroll]").forEach((el) => {
        el.scrollTop = 0
        el.scrollLeft = 0
      })
    }
    if (!silent) onIndex?.(track, next, items[next])
    return next
  }

  const jumpTo = (track, index) => {
    const items = itemsOf(track)
    const from = indexOf(track)
    const next = Math.max(0, Math.min(items.length - 1, index))
    setIndex(track, next)
    paint(track, restPx(track, next), false)
    alignAfter(track, from, next, items)
    if (from !== next) {
      items[next]?.querySelectorAll("[data-scroll]").forEach((el) => {
        el.scrollTop = 0
        el.scrollLeft = 0
      })
    }
    onIndex?.(track, next, items[next])
    return next
  }

  const roomTrackOf = (lane) => lane?.querySelector(":scope > [data-snap-x]") || null

  const subTrackOf = (room) => room?.querySelector(":scope [data-snap-sub]") || null

  const headingOf = (room) => {
    const sub = subTrackOf(room)
    if (sub && indexOf(sub) !== 0) jumpTo(sub, 0)
  }

  const copyColumn = (fromLane, toLane) => {
    const fromX = roomTrackOf(fromLane)
    const toX = roomTrackOf(toLane)
    if (!toX) return
    const col = fromX ? Math.min(indexOf(fromX), itemsOf(toX).length - 1) : 0
    if (indexOf(toX) !== col) jumpTo(toX, col)
    headingOf(itemsOf(toX)[indexOf(toX)])
  }

  const alignAfter = (track, from, next, items) => {
    if (from === next) return
    if (track.dataset.snapLoop != null) {
      copyColumn(items[from], items[next])
      return
    }
    if (track.matches("[data-snap-x]") && !track.hasAttribute("data-snap-sub")) {
      headingOf(items[next])
    }
  }

  const atLeaveEdge = (track, dir) => {
    if (track.dataset.snapLoop == null) return true
    const lane = itemsOf(track)[indexOf(track)]
    const x = roomTrackOf(lane)
    const room = x ? itemsOf(x)[indexOf(x)] : null
    const sub = subTrackOf(room)
    if (!sub) return true
    const kids = itemsOf(sub)
    if (kids.length <= 1) return true
    const i = indexOf(sub)
    if (dir > 0) return i === kids.length - 1
    return i === 0
  }

  const laneLocked = (track, dir) => track.dataset.snapLoop != null && !atLeaveEdge(track, dir)

  const thresholdFor = (track, from, dir) => {
    if (track.dataset.snapLoop != null) {
      const items = itemsOf(track)
      const realFirst = 1
      const realLast = items.length - 2
      const wrapping = (from === realLast && dir > 0) || (from === realFirst && dir < 0)
      if (wrapping) return wrapThreshold
    }
    if (track.hasAttribute("data-snap-sub")) return threshold
    if (track.dataset.snapLoop != null && atLeaveEdge(track, dir)) return edgeThreshold
    if (track.matches("[data-snap-x]")) return threshold
    return threshold
  }

  const currentPage = () => {
    const y = root.querySelector("[data-snap-loop]")
    if (!y) return null
    const lane = itemsOf(y)[indexOf(y)]
    const x = lane?.querySelector(":scope > [data-snap-x]")
    const room = x ? itemsOf(x)[indexOf(x)] : lane
    const subTrack = room?.querySelector(":scope [data-snap-sub]")
    return subTrack ? itemsOf(subTrack)[indexOf(subTrack)] : room
  }

  const currentPane = (from) => {
    const unit = from?.closest?.(".grid-unit")
    if (unit) return unit.querySelector("[data-scroll]")
    return currentPage()?.querySelector("[data-scroll]") || null
  }

  const chainHandler = (dir, axis = "y") => {
    const y = root.querySelector("[data-snap-loop]")
    if (!y) return null
    const lane = itemsOf(y)[indexOf(y)]
    const x = roomTrackOf(lane)
    const room = x ? itemsOf(x)[indexOf(x)] : null
    const sub = subTrackOf(room)
    if (axis === "x") {
      if (x && canSnap(x, dir, indexOf(x))) return { type: "snap", node: x, dir }
      return null
    }
    if (sub && canSnap(sub, dir, indexOf(sub))) return { type: "snap", node: sub, dir }
    if (canSnap(y, dir, indexOf(y))) return { type: "snap", node: y, dir }
    return null
  }

  const afterLoop = (track) => {
    if (track.dataset.snapLoop == null) return
    const items = itemsOf(track)
    const last = items.length - 1
    const i = indexOf(track)
    if (i === 0) {
      jumpTo(track, last - 1)
      return
    }
    if (i === last) {
      jumpTo(track, 1)
    }
  }

  const settle = (track, deltaPx) => {
    const size = viewSize(track)
    const from = indexOf(track)
    const dir = deltaPx > 0 ? 1 : deltaPx < 0 ? -1 : 0
    if (!dir || size <= 0) {
      snapTo(track, from)
      return
    }
    const locked = laneLocked(track, dir)
    const t = locked ? 2 : thresholdFor(track, from, dir)
    const passed = Math.abs(deltaPx) / size >= t
    const target = passed && canSnap(track, dir, from) ? from + dir : from
    animating = true
    snapTo(track, target)
    window.setTimeout(() => {
      afterLoop(track)
      animating = false
    }, duration() + 16)
  }

  const findHandler = (start, axis, dir, { chain } = {}) => {
    const pane = currentPane(start instanceof Element ? start : start?.parentElement)
    if (pane && (axis === "y" || axis === "x") && canScroll(pane, axis, dir)) {
      return { type: "scroll", node: pane, dir }
    }
    if (chain) return chainHandler(dir, axis)
    let node = start instanceof Element ? start : start.parentElement
    while (node && node !== root.parentElement) {
      if (node.matches?.("[data-scroll]") && canScroll(node, axis, dir)) {
        return { type: "scroll", node, dir }
      }
      if (node.matches?.(axis === "y" ? "[data-snap-y]" : "[data-snap-x]")) {
        const i = indexOf(node)
        if (canSnap(node, dir, i)) return { type: "snap", node, dir }
      }
      node = node.parentElement
    }
    return null
  }

  const fallbackHandler = (axis, dir, { chain } = {}) => {
    if (chain) return chainHandler(dir, axis)
    const y = root.querySelector("[data-snap-loop]")
    if (!y) return null
    if (axis === "y" && canSnap(y, dir, indexOf(y))) return { type: "snap", node: y, dir }
    const lane = itemsOf(y)[indexOf(y)]
    const x = lane?.querySelector(":scope > [data-snap-x]")
    if (axis === "x" && x && canSnap(x, dir, indexOf(x))) return { type: "snap", node: x, dir }
    return null
  }

  const startSnapWheel = (handler, raw) => {
    const track = handler.node
    if (!gesture || gesture.mode !== "wheel" || gesture.handler?.node !== track) {
      if (gesture?.mode === "wheel" && gesture.handler?.type === "snap") {
        settle(gesture.handler.node, -gesture.delta)
      }
      gesture = { mode: "wheel", handler, delta: 0 }
    }
    gesture.delta += -raw
    const leaveDir = gesture.delta < 0 ? 1 : -1
    if (laneLocked(track, leaveDir)) {
      const max = viewSize(track) * 0.08
      gesture.delta = Math.max(-max, Math.min(max, gesture.delta))
    }
    paint(track, restPx(track) + gesture.delta, false)
    window.clearTimeout(wheelTimer)
    wheelTimer = window.setTimeout(() => {
      if (gesture?.mode === "wheel" && gesture.handler?.type === "snap") {
        settle(gesture.handler.node, -gesture.delta)
      }
      gesture = null
    }, WHEEL_IDLE)
  }

  const onPointerDown = (event) => {
    if (event.button != null && event.button !== 0) return
    if (animating) return
    if (isMap(event.target)) return
    gesture = {
      pointerId: event.pointerId,
      x0: event.clientX,
      y0: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      axis: null,
      handler: null,
      delta: 0,
      skip: isInteractive(event.target),
      captured: false,
    }
  }

  const onPointerMove = (event) => {
    if (!gesture || event.pointerId !== gesture.pointerId) return
    const dx = event.clientX - gesture.x0
    const dy = event.clientY - gesture.y0
    if (!gesture.axis) {
      if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return
      if (gesture.skip) {
        gesture = null
        return
      }
      gesture.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
      const dir = gesture.axis === "x" ? (dx > 0 ? -1 : 1) : dy > 0 ? -1 : 1
      gesture.handler = findHandler(event.target, gesture.axis, dir, { chain: true }) || fallbackHandler(gesture.axis, dir, { chain: true })
      if (!gesture.handler) {
        gesture = null
        return
      }
      gesture.captured = true
      root.setPointerCapture?.(event.pointerId)
    }

    const spec = AXIS[gesture.axis]
    const step = event[spec.start] - (gesture.axis === "x" ? gesture.lastX : gesture.lastY)
    gesture.lastX = event.clientX
    gesture.lastY = event.clientY
    event.preventDefault()

    if (gesture.handler.type === "scroll") {
      spec.applyScroll(gesture.handler.node, -step)
      const dir = -step > 0 ? 1 : -1
      if (!canScroll(gesture.handler.node, gesture.axis, dir)) {
        const next =
          findHandler(gesture.handler.node, gesture.axis, dir, { chain: true }) ||
          fallbackHandler(gesture.axis, dir, { chain: true })
        if (next?.type === "snap") {
          gesture.handler = next
          gesture.delta = 0
        }
      }
      return
    }

    const track = gesture.handler.node
    gesture.delta += step
    const dir = gesture.delta < 0 ? 1 : -1
    if (laneLocked(track, dir)) {
      const max = viewSize(track) * 0.08
      gesture.delta = Math.max(-max, Math.min(max, gesture.delta))
    }
    const from = restPx(track)
    paint(track, from + gesture.delta, false)
  }

  const onPointerUp = (event) => {
    if (!gesture || event.pointerId !== gesture.pointerId) return
    if (gesture.captured && gesture.handler?.type === "snap") {
      settle(gesture.handler.node, -gesture.delta)
    }
    gesture = null
  }

  const onWheel = (event) => {
    if (event.ctrlKey || event.metaKey) return
    if (animating) {
      event.preventDefault()
      return
    }
    const absX = Math.abs(event.deltaX)
    const absY = Math.abs(event.deltaY)
    const axis = absX > absY ? "x" : "y"
    const raw = wheelRaw(event, axis)
    if (raw === 0) return
    const dir = raw > 0 ? 1 : -1
    const handler = findHandler(event.target, axis, dir, { chain: true }) || fallbackHandler(axis, dir, { chain: true })

    if (!handler) return

    event.preventDefault()

    if (handler.type === "scroll") {
      if (gesture?.mode === "wheel" && gesture.handler?.type === "snap") {
        settle(gesture.handler.node, -gesture.delta)
        gesture = null
      }
      const leftover = consumeScroll(handler.node, axis, raw)
      if (Math.abs(leftover) <= SCROLL_EPS || canScroll(handler.node, axis, dir)) {
        window.clearTimeout(wheelTimer)
        return
      }
      const next = chainHandler(dir, axis)
      if (!next) return
      startSnapWheel(next, leftover)
      return
    }

    startSnapWheel(handler, raw)
  }

  const onKey = (event) => {
    if (event.target.closest?.("input, textarea, select, [contenteditable='true']")) return
    const y = root.querySelector("[data-snap-loop]")
    if (!y) return
    const lane = itemsOf(y)[indexOf(y)]
    const x = roomTrackOf(lane)

    const go = (track, dir) => {
      if (!track) return
      event.preventDefault()
      const from = indexOf(track)
      if (!canSnap(track, dir, from)) return
      if (laneLocked(track, dir)) return
      animating = true
      snapTo(track, from + dir)
      window.setTimeout(() => {
        afterLoop(track)
        animating = false
      }, duration() + 16)
    }

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      const pane = currentPane(event.target)
      if (pane && canScroll(pane, "y", 1)) {
        event.preventDefault()
        pane.scrollTop += event.key === "PageDown" ? pane.clientHeight * 0.86 : 72
        return
      }
      const next = chainHandler(1, "y")
      if (next?.type === "snap") go(next.node, 1)
      return
    }
    if (event.key === "ArrowUp" || event.key === "PageUp") {
      const pane = currentPane(event.target)
      if (pane && canScroll(pane, "y", -1)) {
        event.preventDefault()
        pane.scrollTop -= event.key === "PageUp" ? pane.clientHeight * 0.86 : 72
        return
      }
      const next = chainHandler(-1, "y")
      if (next?.type === "snap") go(next.node, -1)
      return
    }
    if (event.key === "ArrowRight") go(x, 1)
    if (event.key === "ArrowLeft") go(x, -1)
    if (event.key === "Home") {
      event.preventDefault()
      jumpTo(y, y.dataset.snapLoop != null ? 1 : 0)
    }
    if (event.key === "End") {
      event.preventDefault()
      const items = itemsOf(y)
      jumpTo(y, y.dataset.snapLoop != null ? items.length - 2 : items.length - 1)
    }
  }

  const syncSizes = () => {
    root.querySelectorAll("[data-snap-x], [data-snap-y]").forEach((track) => {
      paint(track, restPx(track), false)
    })
  }

  root.addEventListener("pointerdown", onPointerDown)
  root.addEventListener("pointermove", onPointerMove, { passive: false })
  root.addEventListener("pointerup", onPointerUp)
  root.addEventListener("pointercancel", onPointerUp)
  root.addEventListener("wheel", onWheel, { passive: false })
  root.addEventListener("keydown", onKey)
  window.addEventListener("resize", syncSizes)

  return {
    indexOf,
    snapTo,
    jumpTo,
    restPx,
    paint,
    itemsOf,
    destroy() {
      root.removeEventListener("pointerdown", onPointerDown)
      root.removeEventListener("pointermove", onPointerMove)
      root.removeEventListener("pointerup", onPointerUp)
      root.removeEventListener("pointercancel", onPointerUp)
      root.removeEventListener("wheel", onWheel)
      root.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", syncSizes)
    },
  }
}
