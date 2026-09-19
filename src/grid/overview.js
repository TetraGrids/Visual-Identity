/**
 * Live Grid overview: a schematic of every lane, room, and subsection.
 * Mini sits above Delta in the rail. Click expands it to a full-screen outline.
 */

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function layout(config, { cellW, cellH, gap, roomGap, laneGap, labelW, pad }) {
  let y = pad
  let maxX = pad + labelW
  const rows = config.lanes.map((lane) => {
    let x = pad + labelW
    const rooms = lane.rooms.map((room) => {
      const subs = room.subsections?.length
        ? room.subsections
        : [{ id: "", name: room.name, implicit: true }]
      const clusterX = x
      const cells = subs.map((sub, i) => ({
        laneId: lane.id,
        roomId: room.id,
        subId: sub.id || "",
        name: sub.implicit ? room.name : sub.name,
        roomName: room.name,
        kind: room.kind,
        x: clusterX + i * (cellW + gap),
        y,
        w: cellW,
        h: cellH,
      }))
      const width = cells.length * cellW + (cells.length - 1) * gap
      x += width + roomGap
      return { room, x: clusterX, y, w: width, h: cellH, cells }
    })
    maxX = Math.max(maxX, x)
    const row = { lane, x: pad, y, w: x - pad, h: cellH, rooms }
    y += cellH + laneGap
    return row
  })
  return { rows, width: maxX + pad, height: y + pad - laneGap + pad }
}

function here(cell, current) {
  if (!current?.lane) return false
  if (cell.laneId !== current.lane) return false
  if (cell.roomId !== current.room) return false
  const sub = current.sub || ""
  return cell.subId === sub
}

function wire(cell, { tiny }) {
  const { x, y, w, h, kind } = cell
  const s = tiny ? 0.45 : 0.7
  const inset = tiny ? 1.2 : 3
  const ix = x + inset
  const iy = y + inset
  const iw = w - inset * 2
  const ih = h - inset * 2
  const head = ih * 0.2
  const parts = [
    `<rect x="${ix}" y="${iy}" width="${iw}" height="${head}" fill="none" stroke="currentColor" stroke-width="${s}" opacity="0.55"/>`,
  ]
  if (kind === "scores") {
    const stats = ih * 0.28
    const col = iw / 4
    for (let i = 0; i < 4; i += 1) {
      parts.push(
        `<rect x="${ix + col * i}" y="${iy + head + 1}" width="${col - 0.6}" height="${stats}" fill="none" stroke="currentColor" stroke-width="${s}" opacity="0.4"/>`,
      )
    }
    const fy = iy + head + stats + 2
    const fh = ih - head - stats - 3
    for (let i = 0; i < 4; i += 1) {
      parts.push(
        `<line x1="${ix + 1}" y1="${fy + (fh / 4) * i}" x2="${ix + iw - 1}" y2="${fy + (fh / 4) * i}" stroke="currentColor" stroke-width="${s}" opacity="0.35"/>`,
      )
    }
  } else if (kind === "map") {
    parts.push(
      `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="none" stroke="currentColor" stroke-width="${s}" opacity="0.45"/>`,
    )
    parts.push(`<rect x="${ix + iw * 0.3}" y="${iy + ih * 0.4}" width="${tiny ? 1.4 : 3}" height="${tiny ? 1.4 : 3}" fill="currentColor" opacity="0.7"/>`)
    parts.push(`<rect x="${ix + iw * 0.62}" y="${iy + ih * 0.55}" width="${tiny ? 1.4 : 3}" height="${tiny ? 1.4 : 3}" fill="currentColor" opacity="0.7"/>`)
  } else if (kind === "passport") {
    parts.push(
      `<polygon points="${ix + iw * 0.5},${iy + head + 2} ${ix + iw * 0.72},${iy + ih - 2} ${ix + iw * 0.28},${iy + ih - 2}" fill="none" stroke="currentColor" stroke-width="${s}" opacity="0.5"/>`,
    )
  } else if (kind === "badges" || kind === "accolades") {
    const cols = 3
    const rows = 2
    const cw = iw / cols
    const rh = (ih - head - 1) / rows
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        parts.push(
          `<rect x="${ix + c * cw + 0.4}" y="${iy + head + 1 + r * rh}" width="${cw - 0.8}" height="${rh - 0.6}" fill="none" stroke="currentColor" stroke-width="${s}" opacity="0.4"/>`,
        )
      }
    }
  } else if (kind === "recurve") {
    const cw = iw / 2
    const rh = (ih - head - 1) / 2
    for (let r = 0; r < 2; r += 1) {
      for (let c = 0; c < 2; c += 1) {
        parts.push(
          `<rect x="${ix + c * cw + 0.4}" y="${iy + head + 1 + r * rh}" width="${cw - 0.8}" height="${rh - 0.6}" fill="none" stroke="currentColor" stroke-width="${s}" opacity="0.4"/>`,
        )
      }
    }
  } else if (kind === "mission" || kind === "level") {
    parts.push(
      `<rect x="${ix}" y="${iy + head + 2}" width="${iw}" height="${ih * 0.32}" fill="none" stroke="currentColor" stroke-width="${s}" opacity="0.45"/>`,
    )
    parts.push(
      `<rect x="${ix}" y="${iy + ih * 0.62}" width="${iw * 0.4}" height="${ih * 0.22}" fill="none" stroke="currentColor" stroke-width="${s}" opacity="0.4"/>`,
    )
  } else {
    const cols = kind === "calendar" || kind === "training" || kind === "actions" ? 1 : 2
    const rows = cols === 1 ? 3 : 2
    const cw = iw / cols
    const rh = (ih - head - 1) / rows
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        parts.push(
          `<rect x="${ix + c * cw + 0.4}" y="${iy + head + 1 + r * rh}" width="${cw - 0.8}" height="${rh - 0.6}" fill="none" stroke="currentColor" stroke-width="${s}" opacity="0.38"/>`,
        )
      }
    }
  }
  return parts.join("")
}

function paint(config, current, { mode }) {
  const tiny = mode === "mini"
  const spec = tiny
    ? { cellW: 7.2, cellH: 6.2, gap: 1.1, roomGap: 1.8, laneGap: 1.6, labelW: 0, pad: 2 }
    : { cellW: 70, cellH: 54, gap: 5, roomGap: 22, laneGap: 26, labelW: 118, pad: 28 }
  const model = layout(config, spec)
  const vb = `0 0 ${model.width} ${model.height}`
  const first = model.rows[0]
  const last = model.rows[model.rows.length - 1]
  const loop = tiny
    ? `<path d="M ${spec.pad} ${first.y + spec.cellH / 2} L ${spec.pad} ${last.y + spec.cellH / 2}" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.35"/>`
    : `<path d="M ${spec.pad + 10} ${first.y} C ${spec.pad - 16} ${first.y}, ${spec.pad - 16} ${last.y + spec.cellH}, ${spec.pad + 10} ${last.y + spec.cellH}" fill="none" stroke="currentColor" stroke-width="1" opacity="0.28"/>`

  const body = model.rows
    .map((row) => {
      const label = tiny
        ? ""
        : `<text x="${spec.pad + 14}" y="${row.y + spec.cellH / 2 + 4}" fill="currentColor" font-size="11" letter-spacing="0.12em">${esc(row.lane.name.toUpperCase())}</text>`
      const rooms = row.rooms
        .map((cluster) => {
          const caption = tiny
            ? ""
            : `<text x="${cluster.x}" y="${cluster.y - 7}" fill="currentColor" font-size="8" letter-spacing="0.12em" opacity="0.72">${esc(cluster.room.name.toUpperCase())}</text>`
          const cells = cluster.cells
            .map((cell) => {
              const on = here(cell, current)
              const subLabel =
                tiny || cell.subId === ""
                  ? ""
                  : `<text x="${cell.x + 3}" y="${cell.y + cell.h - 5}" fill="currentColor" font-size="8" letter-spacing="0.08em" opacity="0.85">${esc(cell.name.toUpperCase())}</text>`
              return `<g class="grid-ov-cell${on ? " is-here" : ""}" data-ov-lane="${esc(cell.laneId)}" data-ov-room="${esc(cell.roomId)}" data-ov-sub="${esc(cell.subId)}" role="button" tabindex="0">
                <rect class="grid-ov-cell__hit" x="${cell.x}" y="${cell.y}" width="${cell.w}" height="${cell.h}" fill="${on ? "rgba(34,197,94,0.16)" : "transparent"}" stroke="${on ? "#22c55e" : "currentColor"}" stroke-width="${tiny ? 0.7 : 1.15}" />
                ${wire(cell, { tiny })}
                ${subLabel}
              </g>`
            })
            .join("")
          return `${caption}${cells}`
        })
        .join("")
      return `${label}${rooms}`
    })
    .join("")

  return `<svg class="grid-ov-svg grid-ov-svg--${mode}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="${tiny ? "true" : "false"}">${loop}${body}</svg>`
}

export function mountOverview({ root, config, getCurrent, goTo, reduceMotion }) {
  const thumb = root.querySelector("[data-overview-mini]")
  const openBtn = root.querySelector("[data-overview-open]")
  const layer = root.querySelector("[data-overview]")
  const stage = root.querySelector("[data-overview-stage]")
  const full = root.querySelector("[data-overview-full]")
  const closeBtn = root.querySelector("[data-overview-close]")
  let open = false
  let ignoreUntil = 0

  const currentOf = () => {
    const pos = getCurrent()
    return { lane: pos.lane?.id, room: pos.room?.id, sub: pos.sub?.id || "" }
  }

  const sync = () => {
    const current = currentOf()
    thumb.innerHTML = paint(config, current, { mode: "mini" })
    if (open) full.innerHTML = paint(config, current, { mode: "full" })
  }

  const placeFromThumb = () => {
    const box = openBtn.getBoundingClientRect()
    stage.style.transition = "none"
    stage.style.left = `${box.left}px`
    stage.style.top = `${box.top}px`
    stage.style.width = `${box.width}px`
    stage.style.height = `${box.height}px`
  }

  const placeFull = () => {
    stage.style.left = "6vw"
    stage.style.top = "8vh"
    stage.style.width = "88vw"
    stage.style.height = "80vh"
  }

  const show = () => {
    open = true
    ignoreUntil = Date.now() + 520
    openBtn.setAttribute("aria-expanded", "true")
    full.innerHTML = paint(config, currentOf(), { mode: "full" })
    placeFromThumb()
    layer.hidden = false
    void stage.offsetWidth
    root.classList.add("is-overview")
    if (!reduceMotion) {
      stage.style.transition =
        "left 0.55s var(--tetra-ease), top 0.55s var(--tetra-ease), width 0.55s var(--tetra-ease), height 0.55s var(--tetra-ease)"
    }
    placeFull()
    closeBtn?.focus()
  }

  const hide = () => {
    if (!open) return
    openBtn.setAttribute("aria-expanded", "false")
    root.classList.remove("is-overview")
    const finish = () => {
      open = false
      layer.hidden = true
      stage.style.transition = "none"
    }
    if (reduceMotion) {
      finish()
      return
    }
    placeFromThumb()
    stage.style.transition =
      "left 0.45s var(--tetra-ease), top 0.45s var(--tetra-ease), width 0.45s var(--tetra-ease), height 0.45s var(--tetra-ease)"
    window.setTimeout(finish, 460)
  }

  const sameAsCurrent = (cell) => {
    const current = currentOf()
    return (
      cell.dataset.ovLane === current.lane &&
      cell.dataset.ovRoom === current.room &&
      (cell.dataset.ovSub || "") === (current.sub || "")
    )
  }

  const pick = (node) => {
    const cell = node?.closest?.("[data-ov-lane]")
    if (!cell) return
    if (sameAsCurrent(cell)) {
      hide()
      return
    }
    goTo({
      lane: cell.dataset.ovLane,
      room: cell.dataset.ovRoom,
      sub: cell.dataset.ovSub || undefined,
    })
    sync()
  }

  openBtn.addEventListener("pointerdown", (event) => {
    event.stopPropagation()
    event.preventDefault()
    if (open) hide()
    else show()
  })
  closeBtn?.addEventListener("click", hide)
  layer.addEventListener("click", (event) => {
    if (Date.now() < ignoreUntil) return
    if (event.target === layer) hide()
  })
  full.addEventListener("click", (event) => {
    event.stopPropagation()
    pick(event.target)
  })
  full.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      pick(event.target)
    }
  })
  layer.addEventListener("wheel", (event) => event.stopPropagation(), { passive: true })
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) {
      event.preventDefault()
      hide()
    }
  })

  sync()
  return { sync, show, hide }
}
