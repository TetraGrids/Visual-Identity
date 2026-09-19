/**
 * Nested snap engine for The Grid.
 *
 * Vertical lanes, horizontal rooms, optional nested subsection tracks.
 * One step per gesture. 38% to change unit; 62% to wrap after Mission Control.
 * Inner [data-scroll] panes consume the gesture until they hit an edge.
 */

const SLOP = 12
const WHEEL_IDLE = 96
const SNAP_MS = 460
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
  const spec = AXIS[axis]
  const pos = spec.scrollPos(el)
  const max = spec.scrollMax(el)
  if (max <= 1) return false
  if (dir > 0) return pos < max - 1
  return pos > 1
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

export function createGridEngine(root, { threshold, wrapThreshold, onIndex, reduceMotion }) {
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

  const sizeOf = (track) => {
    const axis = track.matches("[data-snap-y]") ? "y" : "x"
    return AXIS[axis].size(track.parentElement || track)
  }

  const paint = (track, px, withTransition) => {
    const axis = track.matches("[data-snap-y]") ? "y" : "x"
    track.style.transition = withTransition ? `transform ${duration()}ms ${EASE}` : "none"
    track.style.transform = AXIS[axis].translate(px)
    bases.set(track, px)
  }

  const restPx = (track, index = indexOf(track)) => -index * sizeOf(track)

  const snapTo = (track, index, { silent } = {}) => {
    const items = itemsOf(track)
    const next = Math.max(0, Math.min(items.length - 1, index))
    setIndex(track, next)
    paint(track, restPx(track, next), !reduceMotion)
    if (!silent) onIndex?.(track, next, items[next])
    return next
  }

  const jumpTo = (track, index) => {
    const items = itemsOf(track)
    const next = Math.max(0, Math.min(items.length - 1, index))
    setIndex(track, next)
    paint(track, restPx(track, next), false)
    onIndex?.(track, next, items[next])
    return next
  }

  const thresholdFor = (track, from, dir) => {
    if (track.dataset.snapLoop == null) return threshold
    const items = itemsOf(track)
    const realFirst = 1
    const realLast = items.length - 2
    const wrapping = (from === realLast && dir > 0) || (from === realFirst && dir < 0)
    return wrapping ? wrapThreshold : threshold
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
    const axis = track.matches("[data-snap-y]") ? "y" : "x"
    const size = AXIS[axis].size(track.parentElement || track)
    const from = indexOf(track)
    const dir = deltaPx > 0 ? 1 : deltaPx < 0 ? -1 : 0
    if (!dir || size <= 0) {
      snapTo(track, from)
      return
    }
    const t = thresholdFor(track, from, dir)
    const passed = Math.abs(deltaPx) / size >= t
    const target = passed && canSnap(track, dir, from) ? from + dir : from
    animating = true
    snapTo(track, target)
    window.setTimeout(() => {
      afterLoop(track)
      animating = false
    }, duration() + 16)
  }

  const findHandler = (start, axis, dir) => {
    let node = start instanceof Element ? start : start.parentElement
    while (node && node !== root.parentElement) {
      if (node.matches?.("[data-scroll]") && canScroll(node, axis, dir)) {
        return { type: "scroll", node }
      }
      if (node.matches?.(axis === "y" ? "[data-snap-y]" : "[data-snap-x]")) {
        const i = indexOf(node)
        if (canSnap(node, dir, i)) return { type: "snap", node }
      }
      node = node.parentElement
    }
    return null
  }

  const fallbackHandler = (axis, dir) => {
    const y = root.querySelector("[data-snap-loop]")
    if (!y) return null
    if (axis === "y" && canSnap(y, dir, indexOf(y))) return { type: "snap", node: y }
    const lane = itemsOf(y)[indexOf(y)]
    const x = lane?.querySelector(":scope > [data-snap-x]")
    if (axis === "x" && x && canSnap(x, dir, indexOf(x))) return { type: "snap", node: x }
    return null
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
      gesture.handler = findHandler(event.target, gesture.axis, dir) || fallbackHandler(gesture.axis, dir)
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
      return
    }

    const track = gesture.handler.node
    gesture.delta += step
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
    if (animating) {
      event.preventDefault()
      return
    }
    const absX = Math.abs(event.deltaX)
    const absY = Math.abs(event.deltaY)
    const axis = absX > absY ? "x" : "y"
    const raw = axis === "x" ? event.deltaX : event.deltaY
    if (raw === 0) return
    const dir = raw > 0 ? 1 : -1
    const handler = findHandler(event.target, axis, dir) || fallbackHandler(axis, dir)

    if (!handler) return
    if (handler.type === "scroll") {
      return
    }

    event.preventDefault()
    const track = handler.node
    if (!gesture || gesture.mode !== "wheel" || gesture.handler?.node !== track) {
      if (gesture?.mode === "wheel" && gesture.handler?.type === "snap") {
        settle(gesture.handler.node, -gesture.delta)
      }
      gesture = { mode: "wheel", axis, handler, delta: 0 }
    }
    gesture.delta += -raw
    paint(track, restPx(track) + gesture.delta, false)
    window.clearTimeout(wheelTimer)
    wheelTimer = window.setTimeout(() => {
      if (gesture?.mode === "wheel" && gesture.handler?.type === "snap") {
        settle(gesture.handler.node, -gesture.delta)
      }
      gesture = null
    }, WHEEL_IDLE)
  }

  const onKey = (event) => {
    if (event.target.closest?.("input, textarea, select, [contenteditable='true']")) return
    const y = root.querySelector("[data-snap-loop]")
    if (!y) return
    const lane = itemsOf(y)[indexOf(y)]
    const x = lane?.querySelector(":scope [data-snap-x]")
    const room = x ? itemsOf(x)[indexOf(x)] : null
    const sub = room?.querySelector(":scope [data-snap-x][data-snap-sub]")

    const go = (track, dir) => {
      if (!track) return
      event.preventDefault()
      const from = indexOf(track)
      if (!canSnap(track, dir, from)) return
      animating = true
      snapTo(track, from + dir)
      window.setTimeout(() => {
        afterLoop(track)
        animating = false
      }, duration() + 16)
    }

    if (event.key === "ArrowDown" || event.key === "PageDown") go(y, 1)
    if (event.key === "ArrowUp" || event.key === "PageUp") go(y, -1)
    if (event.key === "ArrowRight") go(sub && canSnap(sub, 1, indexOf(sub)) ? sub : x, 1)
    if (event.key === "ArrowLeft") go(sub && canSnap(sub, -1, indexOf(sub)) ? sub : x, -1)
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
