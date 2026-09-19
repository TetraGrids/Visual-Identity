import { icon } from "./icons.js"
import { getKind } from "./kinds.js"

function roomInner(lane, room, sub) {
  return getKind(room.kind).render({ lane, room, sub })
}

function renderRoom(lane, room) {
  const subs = room.subsections
  if (subs?.length) {
    return `<article class="grid-room" data-snap-item data-room="${room.id}" data-kind="${room.kind}">
      <div class="grid-sub" data-snap-x data-snap-sub>
        ${subs
          .map(
            (sub) => `<div class="grid-sub__page" data-snap-item data-sub="${sub.id}">
              ${roomInner(lane, room, sub)}
            </div>`,
          )
          .join("")}
      </div>
    </article>`
  }
  return `<article class="grid-room" data-snap-item data-room="${room.id}" data-kind="${room.kind}">
    ${roomInner(lane, room)}
  </article>`
}

function renderLane(lane, { clone } = {}) {
  const bleed = lane.bleed ? " data-bleed" : ""
  const special = lane.special ? ` data-special="${lane.special}"` : ""
  const cloned = clone ? " data-clone" : ""
  const tone = lane.tone ? ` data-tone="${lane.tone}"` : ""
  const chasm = (lane.rooms?.length || 0) > 1 ? "strong" : "soft"
  return `<section class="grid-lane" data-snap-item data-lane="${lane.id}" data-chasm="${chasm}"${tone}${bleed}${special}${cloned} aria-label="${lane.name}" ${clone ? "aria-hidden=\"true\" inert" : ""}>
    <div class="grid-lane__x" data-snap-x>
      ${lane.rooms.map((room) => renderRoom(lane, room)).join("")}
    </div>
  </section>`
}

export function renderGrid(config) {
  const { notes, lanes } = config
  const first = lanes[0]
  const last = lanes[lanes.length - 1]
  const rail = lanes
    .map(
      (lane) => `<button type="button" class="grid-rail__btn" data-go-lane="${lane.id}" data-tone="${lane.tone || ""}" aria-label="${lane.name}" title="${lane.name}">
        ${icon(lane.icon)}
      </button>`,
    )
    .join("")

  return `
    <div class="grid-shell" data-grid tabindex="0">
      <a class="skip" href="#grid-notes">Notes</a>
      <button class="grid-notes-btn" id="grid-notes" type="button" aria-expanded="false" data-notes-toggle>Notes</button>
      <aside class="grid-notes" data-notes-panel data-grid-ignore hidden>
        <p class="eyebrow">${notes.title}</p>
        <p>${notes.body}</p>
        <a class="tetra-btn tetra-btn--primary" href="${notes.backHref}">${notes.backLabel}</a>
        <a class="tetra-btn tetra-btn--ghost" href="/">Brand guide</a>
      </aside>
      <nav class="grid-rail" aria-label="Lanes">
        <button type="button" class="grid-overview-btn" data-overview-open data-grid-ignore aria-label="Overview" aria-expanded="false" title="Overview">
          <span class="grid-overview-btn__mark" data-overview-mini></span>
        </button>
        ${rail}
      </nav>
      <p class="grid-way" data-way></p>
      <div class="grid-dots" data-dots></div>
      <div class="grid-overview" data-overview data-grid-ignore hidden>
        <button class="tetra-btn tetra-btn--ghost grid-overview__close" type="button" data-overview-close>Close</button>
        <p class="eyebrow grid-overview__kicker">Overview · every lane</p>
        <p class="grid-overview__hint">Click a cell to go there. Click the active cell again to close.</p>
        <div class="grid-overview__stage" data-overview-stage>
          <div class="grid-overview__full" data-overview-full></div>
        </div>
      </div>
      <div class="grid-stage">
        <div class="grid-y" data-snap-y data-snap-loop>
          ${renderLane(last, { clone: true })}
          ${lanes.map((lane) => renderLane(lane)).join("")}
          ${renderLane(first, { clone: true })}
        </div>
      </div>
    </div>
  `
}

export function hydrateKinds(root) {
  const done = new Set()
  root.querySelectorAll("[data-kind]").forEach((node) => {
    if (node.closest("[data-clone]")) return
    const impl = getKind(node.dataset.kind)
    if (!impl?.hydrate || done.has(impl)) return
    done.add(impl)
    impl.hydrate(root)
  })
}
