import { icon } from "./icons.js"
import {
  profile,
  scoreSets,
  connections,
  newOffers,
  myOffers,
  myContent,
  badges,
  bestOffers,
  bestContent,
  peopleBySection,
  events,
  actions,
  accolades,
  recurveTree,
  training,
  social,
} from "./data.js"

const kinds = new Map()

export function registerKind(name, impl) {
  kinds.set(name, impl)
}

export function getKind(name) {
  return kinds.get(name) || kinds.get("fallback")
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function unit({ eyebrow, title, kicker, stats, body, bleed }) {
  return `
    <div class="grid-unit${bleed ? " grid-unit--bleed" : ""}">
      ${
        bleed
          ? body
          : `
      <header class="grid-head">
        <div>
          <p class="eyebrow">${esc(eyebrow)}</p>
          <h1>${esc(title)}</h1>
        </div>
        ${kicker ? `<p class="grid-kicker">${esc(kicker)}</p>` : ""}
      </header>
      ${stats || ""}
      <div class="grid-pane" data-scroll>
        ${body}
        <div class="grid-snap-pad" aria-hidden="true"></div>
      </div>`
      }
    </div>`
}

function statsBar(items) {
  return `<div class="grid-stats">${items
    .map(
      (item) => `<article><strong>${esc(item.v)}</strong><span>${esc(item.k)}</span></article>`,
    )
    .join("")}</div>`
}

function feedList(items) {
  return `<ol class="grid-feed">${items
    .map(
      (item) => `<li>
        <time>${esc(item.t)}</time>
        <div><strong>${esc(item.title)}</strong><span>${esc(item.meta)}</span></div>
      </li>`,
    )
    .join("")}</ol>`
}

function cards(items, fn) {
  return `<div class="grid-cards">${items.map(fn).join("")}</div>`
}

registerKind("scores", {
  render({ lane, room, sub }) {
    const set = scoreSets[sub?.id] || scoreSets["24h"]
    return unit({
      eyebrow: `${lane.name} · ${room.name}`,
      title: sub?.name || room.name,
      kicker: "Last window",
      stats: statsBar(set.stats),
      body: feedList(set.feed),
    })
  },
})

registerKind("connections", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · ${room.name}`,
      title: room.name,
      kicker: "24h",
      body: cards(connections, (item) => `<article class="grid-card">
        <p class="eyebrow">${esc(item.strength)}</p>
        <h2>${esc(item.name)}</h2>
        <p>${esc(item.meta)}</p>
      </article>`),
    })
  },
})

registerKind("new-offers", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · ${room.name}`,
      title: room.name,
      kicker: "Near you",
      body: cards(newOffers, (item) => `<article class="grid-card">
        <p class="eyebrow">${esc(item.scope)} · ${esc(item.dist)}</p>
        <h2>${esc(item.title)}</h2>
        <p class="grid-pay">${esc(item.pay)}</p>
        <button class="tetra-btn tetra-btn--sm" type="button">Open</button>
      </article>`),
    })
  },
})

registerKind("my-offers", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · on-chain`,
      title: room.name,
      kicker: "Yours",
      body: cards(myOffers, (item) => `<article class="grid-card">
        <p class="eyebrow">${esc(item.status)}</p>
        <h2>${esc(item.title)}</h2>
        <p>${esc(item.pay)} · ${esc(item.taken)} taken</p>
        <button class="tetra-btn tetra-btn--sm" type="button">Manage</button>
      </article>`),
    })
  },
})

registerKind("content", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · on-chain`,
      title: room.name,
      body: cards(myContent, (item) => `<article class="grid-card">
        <p class="eyebrow">${esc(item.kind)}</p>
        <h2>${esc(item.title)}</h2>
        <p>${esc(item.ups)} Ups</p>
      </article>`),
    })
  },
})

registerKind("passport", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · NFT`,
      title: room.name,
      kicker: profile.tokenId,
      body: `<div class="grid-passport" data-passport>
        <div class="grid-passport__mark">${icon("tetra")}</div>
        <p class="eyebrow">Mutable</p>
        <label class="grid-field">
          <span>Name</span>
          <input name="name" value="${esc(profile.name)}" disabled />
        </label>
        <label class="grid-field">
          <span>Region</span>
          <input name="region" value="${esc(profile.region)}" disabled />
        </label>
        <label class="grid-field">
          <span>Nation</span>
          <input name="nation" value="${esc(profile.nation)}" disabled />
        </label>
        <label class="grid-field">
          <span>Statement</span>
          <textarea name="statement" rows="3" disabled>${esc(profile.statement)}</textarea>
        </label>
        <div class="grid-row">
          <button class="tetra-btn tetra-btn--primary" type="button" data-passport-edit>Edit mutable data</button>
          <button class="tetra-btn" type="button" data-passport-save hidden>Save</button>
        </div>
        <p class="grid-hint" data-passport-hint>Specimen. Writes stay on this page.</p>
      </div>`,
    })
  },
  hydrate(root) {
    root.querySelectorAll("[data-passport]").forEach((form) => {
      if (form.closest("[data-clone]")) return
      const edit = form.querySelector("[data-passport-edit]")
      const save = form.querySelector("[data-passport-save]")
      const hint = form.querySelector("[data-passport-hint]")
      const fields = [...form.querySelectorAll("input, textarea")]
      edit?.addEventListener("click", () => {
        fields.forEach((field) => {
          field.disabled = false
        })
        save.hidden = false
        edit.hidden = true
        fields[0]?.focus()
      })
      save?.addEventListener("click", () => {
        fields.forEach((field) => {
          field.disabled = true
        })
        save.hidden = true
        edit.hidden = false
        if (hint) hint.textContent = "Saved locally · NFT write would land on XPR."
      })
    })
  },
})

registerKind("badges", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · plates`,
      title: room.name,
      body: `<div class="grid-badges">${badges
        .map(
          (item) => `<article class="grid-badge">
            <span class="grid-badge__icon">${icon(item.icon)}</span>
            <h2>${esc(item.name)}</h2>
            <p>${esc(item.copy)}</p>
          </article>`,
        )
        .join("")}</div>`,
    })
  },
})

registerKind("best-offers", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · area`,
      title: room.name,
      kicker: profile.region,
      body: cards(bestOffers, (item) => `<article class="grid-card">
        <p class="eyebrow">Rank ${esc(item.rank)} · ${esc(item.dist)}</p>
        <h2>${esc(item.title)}</h2>
        <p class="grid-pay">${esc(item.pay)}</p>
      </article>`),
    })
  },
})

registerKind("best-content", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · area`,
      title: room.name,
      kicker: profile.region,
      body: cards(bestContent, (item) => `<article class="grid-card">
        <p class="eyebrow">${esc(item.by)}</p>
        <h2>${esc(item.title)}</h2>
        <p>${esc(item.ups)} Ups</p>
      </article>`),
    })
  },
})

registerKind("people", {
  render({ lane, room, sub }) {
    const list = peopleBySection[sub?.id] || peopleBySection.all
    return unit({
      eyebrow: `${lane.name} · ${sub?.name || "General"}`,
      title: room.name,
      kicker: profile.region,
      body: cards(list, (item) => `<article class="grid-card">
        <p class="eyebrow">${esc(item.score)}</p>
        <h2>${esc(item.name)}</h2>
        <p>${esc(item.meta)}</p>
      </article>`),
    })
  },
})

registerKind("calendar", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name}`,
      title: room.name,
      kicker: "Upcoming",
      body: `<ol class="grid-cal">${events
        .map(
          (item) => `<li>
            <time>${esc(item.when)}</time>
            <div><strong>${esc(item.title)}</strong><span>${esc(item.where)}</span></div>
          </li>`,
        )
        .join("")}</ol>`,
    })
  },
})

registerKind("actions", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name}`,
      title: room.name,
      kicker: "Verify",
      body: cards(actions, (item) => `<article class="grid-card" data-action="${esc(item.id)}">
        <h2>${esc(item.title)}</h2>
        <p>${esc(item.detail)}</p>
        <button class="tetra-btn tetra-btn--primary tetra-btn--sm" type="button" data-complete>Mark completed</button>
      </article>`),
    })
  },
  hydrate(root) {
    root.querySelectorAll("[data-complete]").forEach((btn) => {
      if (btn.closest("[data-clone]")) return
      btn.addEventListener("click", () => {
        const card = btn.closest("[data-action]")
        btn.disabled = true
        btn.textContent = "Completed"
        card?.classList.add("is-done")
      })
    })
  },
})

registerKind("accolades", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · one per type`,
      title: room.name,
      body: `<div class="grid-accolades">${accolades
        .map(
          (item) => `<article class="grid-card grid-card--${item.status === "Earned" ? "on" : "mute"}">
            <p class="eyebrow">${esc(item.status)}</p>
            <h2>${esc(item.type)}</h2>
            <p>${esc(item.copy)}</p>
          </article>`,
        )
        .join("")}</div>`,
    })
  },
})

registerKind("recurve", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · fractal`,
      title: room.name,
      kicker: recurveTree.name,
      body: `<div class="grid-recurve" data-recurve>
        <p class="lede">Click a section to sit in a Recurve group of four to six. Same snap shell, nested map.</p>
        <div class="grid-recurve__map">
          ${recurveTree.groups
            .map(
              (group) => `<button class="grid-recurve__cell" type="button" data-group="${esc(group.id)}">
                <span class="eyebrow">${esc(group.name)}</span>
                <strong>${esc(group.seats.length)}</strong>
                <span>seats</span>
              </button>`,
            )
            .join("")}
        </div>
        <div class="grid-recurve__zoom" data-recurve-zoom hidden></div>
      </div>`,
    })
  },
  hydrate(root) {
    root.querySelectorAll("[data-recurve]").forEach((block) => {
      if (block.closest("[data-clone]")) return
      const zoom = block.querySelector("[data-recurve-zoom]")
      block.querySelectorAll("[data-group]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const group = recurveTree.groups.find((item) => item.id === btn.dataset.group)
          if (!group || !zoom) return
          zoom.hidden = false
          zoom.innerHTML = `
            <p class="eyebrow">${esc(group.name)}</p>
            <h2>Seats</h2>
            <ol>${group.seats.map((seat) => `<li>${esc(seat)}</li>`).join("")}</ol>
            <button class="tetra-btn tetra-btn--sm" type="button" data-recurve-back>Back to map</button>
          `
          zoom.querySelector("[data-recurve-back]")?.addEventListener("click", () => {
            zoom.hidden = true
          })
          zoom.scrollIntoView({ block: "nearest" })
        })
      })
    })
  },
})

registerKind("level", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · you`,
      title: room.name,
      kicker: `L${profile.level} ${profile.levelName}`,
      body: `<div class="grid-level">
        <p class="grid-level__num">${esc(profile.level)}</p>
        <p class="lede">${esc(profile.levelName)} · ${esc(profile.raDay)} RA / day. Social verification opens Level 4 and Recurve.</p>
        <ol class="grid-ladder">
          <li class="is-on"><span>1–3</span> Citizen · Passport, offers, Discovery</li>
          <li><span>4–6</span> Full citizen · oath, national RA, Rep path</li>
          <li><span>Regent</span> Elected peer · House Rules</li>
          <li><span>Chief</span> Region · Recurve winner</li>
          <li><span>7–9</span> Projects · IRL land</li>
        </ol>
      </div>`,
    })
  },
})

registerKind("rep", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name} · office`,
      title: room.name,
      body: `<div class="grid-stack">
        <article class="grid-card">
          <p class="eyebrow">Gate</p>
          <h2>Social verification</h2>
          <p>Oath on video, on-chain. Unlocks Level 4, national RA, Recurve seats.</p>
          <button class="tetra-btn tetra-btn--primary" type="button">Start oath</button>
        </article>
        <article class="grid-card">
          <p class="eyebrow">Recurve</p>
          <h2>Sit a Zoom of 4–6</h2>
          <p>Elect a Rep. Fortnightly. Face to face, not a forum.</p>
          <button class="tetra-btn" type="button">Find a group</button>
        </article>
        <article class="grid-card">
          <p class="eyebrow">Role</p>
          <h2>Take a House Rule</h2>
          <p>Reps who hold a Role earn in the region they serve.</p>
          <button class="tetra-btn" type="button">Read roles</button>
        </article>
      </div>`,
    })
  },
})

registerKind("training", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name}`,
      title: room.name,
      body: `<ol class="grid-train">${training
        .map(
          (item) => `<li>
            <span class="eyebrow">${esc(item.step)}</span>
            <strong>${esc(item.title)}</strong>
            <p>${esc(item.copy)}</p>
          </li>`,
        )
        .join("")}</ol>`,
    })
  },
})

registerKind("social", {
  render({ lane, room }) {
    return unit({
      eyebrow: `${lane.name}`,
      title: "Tetra social",
      body: `<div class="grid-stack">${social
        .map(
          (item) => `<a class="grid-card grid-card--link" href="${esc(item.href)}" target="_blank" rel="noreferrer">
            <h2>${esc(item.label)}</h2>
            <p>${esc(item.href.replace("https://", ""))}</p>
          </a>`,
        )
        .join("")}</div>`,
    })
  },
})

registerKind("map", {
  render({ lane, room }) {
    return unit({
      bleed: true,
      title: room.name,
      body: `<div class="grid-map" data-grid-map>
        <div class="grid-map__canvas" data-map-canvas role="application" aria-label="Tetra map"></div>
        <aside class="grid-map__display" data-map-display hidden></aside>
        <p class="grid-map__label">${esc(lane.name)} · click to center</p>
      </div>`,
    })
  },
})

registerKind("mission", {
  render({ lane }) {
    return unit({
      eyebrow: lane.name,
      title: "Mission Control",
      kicker: "Loop",
      body: `<div class="grid-mission">
        <section>
          <p class="eyebrow">Operator</p>
          <h2>${esc(profile.name)}</h2>
          <p>${esc(profile.region)} · ${esc(profile.tokenId)} · L${esc(profile.level)}</p>
        </section>
        <div class="grid-stats">
          <article><strong>${esc(profile.raDay)}</strong><span>RA / day</span></article>
          <article><strong>On</strong><span>Grid loop</span></article>
          <article><strong>62%</strong><span>Wrap threshold</span></article>
          <article><strong>Void</strong><span>Display</span></article>
        </div>
        <div class="grid-row">
          <button class="tetra-btn tetra-btn--primary" type="button">Claim RA</button>
          <button class="tetra-btn" type="button">Settings</button>
          <button class="tetra-btn tetra-btn--ghost" type="button">Sign out</button>
        </div>
        <p class="lede">Scroll past this unit with intent. The first lane returns. Pull less than 62% and you snap back here.</p>
      </div>`,
    })
  },
})

registerKind("fallback", {
  render({ lane, room }) {
    return unit({
      eyebrow: lane.name,
      title: room.name,
      body: `<p class="lede">Unregistered kind <code>${esc(room.kind || "unknown")}</code>. Register it with <code>registerKind</code>.</p>`,
    })
  },
})
