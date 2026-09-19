import { icon } from "./icons.js"
import {
  profile,
  scoreSets,
  connectionsByType,
  newOffersBySet,
  myOffersBySet,
  myContent,
  rankedContent,
  badges,
  badgeGates,
  stamps,
  claimLedger,
  bestOffersByLocale,
  bestContentByLocale,
  peopleBySection,
  seasonRace,
  carnivalZooms,
  algorithmRows,
  calendarBySet,
  actionsBySet,
  recurveAgenda,
  accoladesBySet,
  recurveTree,
  recurveRounds,
  repsRank,
  chiefsFour,
  councilVotes,
  defaultRoles,
  rolesHeld,
  houseRules,
  procedures,
  huraEvents,
  venues,
  regionMetrics,
  activationFounders,
  training,
  howToWin,
  social,
  faqBySet,
  journey,
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

function page(ctx, { title, kicker, stats, body }) {
  return unit({
    eyebrow: `${ctx.lane.name} · ${ctx.room.name}`,
    title: title || ctx.sub?.name || ctx.room.name,
    kicker,
    stats,
    body,
  })
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

function calList(items) {
  return `<ol class="grid-cal">${items
    .map(
      (item) => `<li>
        <time>${esc(item.when)}</time>
        <div><strong>${esc(item.title)}</strong><span>${esc(item.where)}</span></div>
      </li>`,
    )
    .join("")}</ol>`
}

function cards(items, fn) {
  return `<div class="grid-cards">${items.map(fn).join("")}</div>`
}

function stack(items, fn) {
  return `<div class="grid-stack">${items.map(fn).join("")}</div>`
}

function table(headers, rows) {
  return `<div class="grid-table-wrap"><table class="grid-table">
    <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>${rows
      .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`)
      .join("")}</tbody>
  </table></div>`
}

function identity({ initials, name, meta }) {
  return `<div class="grid-id">
    <span class="grid-av">${esc(initials || name.slice(0, 2).toUpperCase())}</span>
    <span><strong>${esc(name)}</strong><span>${esc(meta || "")}</span></span>
  </div>`
}

function acc(items) {
  return `<div class="grid-acc" data-acc>${items
    .map(
      (item) => `<div class="grid-acc__item">
        <button type="button" aria-expanded="false">${esc(item.q)}</button>
        <p hidden>${esc(item.a)}</p>
      </div>`,
    )
    .join("")}</div>`
}

function empty(copy) {
  return `<p class="lede grid-empty">${esc(copy)}</p>`
}

function metrics(items) {
  return `<div class="grid-metric">${items
    .map((item) => `<div><b>${esc(item.v)}</b><span>${esc(item.k)}</span></div>`)
    .join("")}</div>`
}

function offerCard(item) {
  return `<article class="grid-card">
    <p class="eyebrow">${esc(item.scope || "")}${item.dist ? ` · ${esc(item.dist)}` : ""}</p>
    <h2>${esc(item.title)}</h2>
    ${item.verify ? `<p>${esc(item.verify)}</p>` : ""}
    <p class="grid-pay">${esc(item.pay)}</p>
    <button class="tetra-btn tetra-btn--sm" type="button">Open</button>
  </article>`
}

function personCard(item) {
  return `<article class="grid-card">
    ${identity({ initials: item.initials, name: item.name, meta: item.meta })}
    ${item.strength ? `<p class="eyebrow" style="margin-top:12px">${esc(item.strength)}</p>` : ""}
    ${item.score ? `<p class="grid-pay">${esc(item.score)}</p>` : ""}
  </article>`
}

function panelCard({ eyebrow, title, copy, action, muted, on }) {
  return `<article class="grid-card${muted ? " grid-card--mute" : ""}${on ? " grid-card--on" : ""}">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}
    <h2>${esc(title)}</h2>
    ${copy ? `<p>${esc(copy)}</p>` : ""}
    ${action || ""}
  </article>`
}

registerKind("scores", {
  render(ctx) {
    const set = scoreSets[ctx.sub?.id] || scoreSets["24h"]
    return page(ctx, {
      kicker: "Last window",
      stats: statsBar(set.stats),
      body: feedList(set.feed),
    })
  },
})

registerKind("connections", {
  render(ctx) {
    const id = ctx.sub?.id === "regions" ? "regions" : "people"
    const list = connectionsByType[id]
    return page(ctx, {
      kicker: id === "regions" ? "Tetran ↔ region" : "Tetran ↔ Tetran · 24h",
      body: `${cards(list, personCard)}
        <p class="grid-hint">Connections fade daily. Repeated interaction strengthens them. Displayed, not stored on the NFT.</p>
        <div class="grid-row">
          <button class="tetra-btn tetra-btn--sm" type="button" data-hide-type="${id}">Hide this type</button>
        </div>
        <p class="grid-hint" data-hide-hint></p>`,
    })
  },
  hydrate(root) {
    root.querySelectorAll("[data-hide-type]").forEach((btn) => {
      if (btn.closest("[data-clone]")) return
      btn.addEventListener("click", () => {
        const pane = btn.closest(".grid-pane")
        pane?.querySelector(".grid-cards")?.classList.toggle("is-hidden-type")
        const hint = pane?.querySelector("[data-hide-hint]")
        const hidden = pane?.querySelector(".grid-cards")?.classList.contains("is-hidden-type")
        btn.textContent = hidden ? "Show this type" : "Hide this type"
        if (hint) hint.textContent = hidden ? "Hidden on this Passport view." : ""
      })
    })
  },
})

registerKind("new-offers", {
  render(ctx) {
    const id = ctx.sub?.id === "near" ? "near" : "incoming"
    return page(ctx, {
      kicker: id === "near" ? "Local charts put up blinders" : "Sent to you",
      body: cards(newOffersBySet[id], offerCard),
    })
  },
})

registerKind("claim", {
  render(ctx) {
    if (ctx.sub?.id === "ledger") {
      return page(ctx, {
        kicker: "RA movement",
        body: table(
          ["When", "Amount", "Source"],
          claimLedger.map((row) => [row.when, row.amount, row.source]),
        ),
      })
    }
    return page(ctx, {
      kicker: "Every day",
      stats: statsBar([
        { k: "Level band", v: `${profile.raDay}` },
        { k: "Stake formula", v: `${profile.stakeCap}` },
        { k: "Claimed", v: `${profile.raClaimed}` },
        { k: "Left", v: `${profile.raLeft}` },
      ]),
      body: `<div class="grid-level">
        <p class="grid-level__num">${esc(profile.raDay)}</p>
        <p class="lede">L${esc(profile.level)} ${esc(profile.levelName)} · Overview band 1–6 RA/day. Localize formula is staked TETRA + 12 = ${esc(profile.stakeCap)} (you have ${esc(profile.stakedTetra)} staked). Both are shown. Next claim 00:00 WAT.</p>
        ${metrics([
          { k: "RA / day", v: "1–6" },
          { k: "As a Rep", v: "24" },
          { k: "Staked", v: String(profile.stakedTetra) },
          { k: "NGRA", v: "Locked" },
        ])}
        <div class="grid-row">
          <button class="tetra-btn tetra-btn--primary" type="button" data-claim disabled>Claimed today</button>
          <button class="tetra-btn" type="button">Buy RA boost</button>
          <button class="tetra-btn tetra-btn--ghost" type="button">Stake TETRA</button>
        </div>
      </div>`,
    })
  },
})

registerKind("my-offers", {
  render(ctx) {
    const id = ctx.sub?.id || "listed"
    const list = myOffersBySet[id] || myOffersBySet.listed
    const action = id === "pending" ? "Verify" : "Manage"
    return page(ctx, {
      kicker: "Yours · on-chain",
      body: cards(
        list,
        (item) => `<article class="grid-card">
          <p class="eyebrow">${esc(item.status)}</p>
          <h2>${esc(item.title)}</h2>
          <p>${esc(item.pay)} · ${esc(item.taken)} taken</p>
          <p>${esc(item.scope)}</p>
          <button class="tetra-btn tetra-btn--sm" type="button">${esc(action)}</button>
        </article>`,
      ),
    })
  },
})

registerKind("content", {
  render(ctx) {
    if (ctx.sub?.id === "ranked") {
      return page(ctx, {
        kicker: "RA / eye",
        body: table(
          ["Campaign", "Status", "RA / eye"],
          rankedContent.map((row) => [row.campaign, row.status, row.ra]),
        ),
      })
    }
    return page(ctx, {
      kicker: "On-chain",
      body: cards(
        myContent,
        (item) => `<article class="grid-card">
          <p class="eyebrow">${esc(item.kind)}</p>
          <h2>${esc(item.title)}</h2>
          <p>${esc(item.ups)} Ups · 1 RA each</p>
        </article>`,
      ),
    })
  },
})

registerKind("passport", {
  render(ctx) {
    if (ctx.sub?.id === "nft") {
      return page(ctx, {
        kicker: profile.tokenId,
        body: stack([
          { eyebrow: "Chain", title: "Mutable NFT", copy: "XPR · KYC done · invite redeemed. One passport per human." },
          { eyebrow: "Stored", title: "Profile, offers, stamps, accolades", copy: "Connections are displayed, not stored on the NFT." },
          { eyebrow: "Rules", title: "No illegal global offers", copy: "If it is illegal in one region or nation, it cannot be global. No dogs on the sofa." },
        ], (item) => panelCard(item)),
      })
    }
    return page(ctx, {
      kicker: profile.tokenId,
      body: `<div class="grid-passport" data-passport>
        <div class="grid-passport__mark">${icon("tetra")}</div>
        ${identity({ initials: profile.photo, name: profile.name, meta: `${profile.region} · ${profile.nation}` })}
        <p class="eyebrow">Mutable</p>
        <label class="grid-field"><span>Name</span><input name="name" value="${esc(profile.name)}" disabled /></label>
        <label class="grid-field"><span>Region</span><input name="region" value="${esc(profile.region)}" disabled /></label>
        <label class="grid-field"><span>City</span><input name="city" value="${esc(profile.city)}" disabled /></label>
        <label class="grid-field"><span>Nation</span><input name="nation" value="${esc(profile.nation)}" disabled /></label>
        <label class="grid-field"><span>Statement</span><textarea name="statement" rows="3" disabled>${esc(profile.statement)}</textarea></label>
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
  render(ctx) {
    if (ctx.sub?.id === "gates") {
      return page(ctx, {
        kicker: "Supercharged features",
        body: cards(badgeGates, (item) => panelCard({ eyebrow: "Locked", title: item.name, copy: item.copy, muted: true })),
      })
    }
    return page(ctx, {
      kicker: "Plates",
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

registerKind("stamps", {
  render(ctx) {
    const id = ctx.sub?.id === "abroad" ? "abroad" : "home"
    return page(ctx, {
      kicker: "Well-traveled",
      body: cards(stamps[id], (item) => panelCard({ eyebrow: item.status, title: item.name, copy: item.copy, on: item.status === "Earned" })),
    })
  },
})

registerKind("best-offers", {
  render(ctx) {
    const id = ctx.sub?.id || "region"
    const list = bestOffersByLocale[id] || bestOffersByLocale.region
    const kickers = { region: "Lagos", nation: "Nigeria · NGRA locked", global: "Nation winners bubble up" }
    return page(ctx, {
      kicker: kickers[id] || profile.region,
      body: `${cards(
        list,
        (item) => `<article class="grid-card">
          <p class="eyebrow">Rank ${esc(item.rank)} · ${esc(item.dist)} · ${esc(item.ups)} Ups</p>
          <h2>${esc(item.title)}</h2>
          <p class="grid-pay">${esc(item.pay)}</p>
          <button class="tetra-btn tetra-btn--sm" type="button">Up · 1 RA</button>
        </article>`,
      )}<p class="grid-hint">Default rank = Ups + total RA of offers, same weight. Get people to take the offer instead of buying Ups.</p>`,
    })
  },
})

registerKind("best-content", {
  render(ctx) {
    const id = ctx.sub?.id || "region"
    const list = bestContentByLocale[id] || bestContentByLocale.region
    return page(ctx, {
      kicker: profile.region,
      body: cards(
        list,
        (item) => `<article class="grid-card">
          <p class="eyebrow">${esc(item.by)}</p>
          <h2>${esc(item.title)}</h2>
          <p>${esc(item.ups)} Ups</p>
        </article>`,
      ),
    })
  },
})

registerKind("people", {
  render(ctx) {
    const list = peopleBySection[ctx.sub?.id] || peopleBySection.all
    return page(ctx, {
      kicker: profile.region,
      body: cards(list, (item) => `<article class="grid-card">
        <p class="eyebrow">${esc(item.score)}</p>
        <h2>${esc(item.name)}</h2>
        <p>${esc(item.meta)}</p>
      </article>`),
    })
  },
})

registerKind("season", {
  render(ctx) {
    if (ctx.sub?.id === "carnival") {
      return page(ctx, {
        kicker: "Every three months",
        body: `${cards(carnivalZooms, (item) => panelCard({ eyebrow: "Placeholder", title: item.title, copy: item.copy }))}
          <div class="grid-row"><button class="tetra-btn tetra-btn--primary" type="button" disabled>Enter vote</button></div>
          <p class="grid-hint">Live Know page ends mid-sentence. Three Zoom meetings are reserved, not invented.</p>`,
      })
    }
    return page(ctx, {
      kicker: "Cumulative rank",
      stats: statsBar(seasonRace.stats),
      body: feedList(seasonRace.feed),
    })
  },
})

registerKind("algorithm", {
  render(ctx) {
    const id = ctx.sub?.id === "chief" ? "chief" : "default"
    return page(ctx, {
      kicker: id === "chief" ? "Lagos Chiefs · locked for citizens" : "Ups + offer RA",
      body: table(
        ["Signal", "Weight", "Note"],
        algorithmRows[id].map((row) => [row.signal, row.weight, row.note]),
      ),
    })
  },
})

registerKind("calendar", {
  render(ctx) {
    const id = ctx.sub?.id || "recurve"
    const kickers = { recurve: "Fortnightly · Recurve page", hura: "Full moon", carnival: "Season end" }
    return page(ctx, {
      kicker: kickers[id] || "Upcoming",
      body: calList(calendarBySet[id] || calendarBySet.recurve),
    })
  },
})

registerKind("actions", {
  render(ctx) {
    const id = ctx.sub?.id === "claim" ? "claim" : "verify"
    return page(ctx, {
      kicker: id === "claim" ? "RA" : "Verify",
      body: cards(
        actionsBySet[id],
        (item) => `<article class="grid-card" data-action="${esc(item.id)}">
          <h2>${esc(item.title)}</h2>
          <p>${esc(item.detail)}</p>
          <button class="tetra-btn tetra-btn--primary tetra-btn--sm" type="button" data-complete>Mark completed</button>
        </article>`,
      ),
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

registerKind("recurve-room", {
  render(ctx) {
    if (ctx.sub?.id === "breakouts") {
      return page(ctx, {
        kicker: recurveTree.name,
        body: `<div class="grid-recurve__map">
          ${recurveTree.groups
            .map(
              (group) => `<div class="grid-recurve__cell">
                <span class="eyebrow">${esc(group.name)}</span>
                <strong>${esc(group.seats.length)}</strong>
                <span>${esc(group.seats.join(" · "))}</span>
              </div>`,
            )
            .join("")}
        </div>
        <p class="lede">Groups of four to six. You are L3 watch-only.</p>`,
      })
    }
    return page(ctx, {
      kicker: "Face to face, not a forum",
      body: `<div class="grid-thread">
        ${recurveAgenda
          .map((line) => `<p class="${line.out ? "is-out" : ""}"><strong>${esc(line.who)}</strong> ${esc(line.text)}</p>`)
          .join("")}
      </div>
      <p class="grid-booked">Room booked · Tue 14:00 · vote locked until Social Verification</p>
      <p class="lede">Welcome noobs −30. Landing 10. Presentations 5 min each. Consensus + on-chain. Second round if 4+ Reps continue.</p>`,
    })
  },
})

registerKind("accolades", {
  render(ctx) {
    const id = ctx.sub?.id === "locked" ? "locked" : "earned"
    return page(ctx, {
      kicker: "One per type",
      body: `<div class="grid-accolades">${accoladesBySet[id]
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

registerKind("barons", {
  render(ctx) {
    if (ctx.sub?.id === "active") {
      return page(ctx, {
        kicker: "Cheat Codes",
        body: empty("No Baron on this Passport."),
      })
    }
    return page(ctx, {
      kicker: "Individual sponsorship",
      body: `<div class="grid-level">
        <p class="lede">Boosted profiles and offers for individuals. 50% of Baron USDC goes to current Chiefs.</p>
        ${metrics([
          { k: "Status", v: "None" },
          { k: "Chief split", v: "50%" },
        ])}
        <div class="grid-row"><button class="tetra-btn tetra-btn--primary" type="button">Buy Baron</button></div>
      </div>`,
    })
  },
})

registerKind("stewards", {
  render(ctx) {
    if (ctx.sub?.id === "revenue") {
      return page(ctx, {
        kicker: "Chiefs spend autonomously",
        body: table(
          ["Source", "Share", "Note"],
          [
            ["Barons USDC", "50%", "To current Chiefs"],
            ["Stewards USDC", "50%", "To current Chiefs"],
            ["Reinvest", "Optional", "Regional development"],
          ],
        ),
      })
    }
    return page(ctx, {
      kicker: "Company sponsorship",
      body: panelCard({
        eyebrow: "Localized promotion",
        title: "Stewards",
        copy: "Sponsorship tier for companies. Localized promotion. Not purchased on this specimen.",
      }),
    })
  },
})

registerKind("founding", {
  render(ctx) {
    if (ctx.sub?.id === "recognition") {
      return page(ctx, {
        kicker: "On Passport",
        body: panelCard({
          eyebrow: "Locked for Amina",
          title: "Founding supporter",
          copy: "High-value donors, or their organization or idea, recognized on the Passport.",
          muted: true,
        }),
      })
    }
    return page(ctx, {
      kicker: "Givebutter",
      body: `<p class="lede">Provide the capital to make this real, and provide your region a gift that gives everyday — forever.</p>
        <div class="grid-row"><a class="tetra-btn tetra-btn--primary" href="https://know.tetra.earth/donate" target="_blank" rel="noreferrer">Donate</a></div>
        <p class="grid-hint">Exact Givebutter URL is not in the Know export. This opens the Know donate page.</p>`,
    })
  },
})

registerKind("stake", {
  render(ctx) {
    if (ctx.sub?.id === "crystal") {
      return page(ctx, {
        kicker: "Permanent benefits",
        body: stack(
          [
            { eyebrow: "Locked", title: "Baron / Steward access", copy: "Crystal tier. Stake TETRA." },
            { eyebrow: "Locked", title: "Activate a region", copy: "Four founders. Become a founding Chief." },
          ],
          (item) => panelCard({ ...item, muted: true }),
        ),
      })
    }
    return page(ctx, {
      kicker: "Lagos pool",
      stats: statsBar([
        { k: "You staked", v: String(profile.stakedTetra) },
        { k: "Pool", v: "4,200" },
        { k: "RA / day cap", v: "4,200" },
        { k: "Per token", v: "+1" },
      ]),
      body: `<p class="lede">Each TETRA staked adds 1 RA to daily regional distribution. Total TETRA staked to a locale = daily RA capacity.</p>`,
    })
  },
})

registerKind("recurve", {
  render(ctx) {
    if (ctx.sub?.id === "rounds") {
      return page(ctx, {
        kicker: "Until a winner",
        body: `<ol class="grid-train">${recurveRounds
          .map(
            (item) => `<li>
              <span class="eyebrow">${esc(item.step)}</span>
              <strong>${esc(item.title)}</strong>
              <p>${esc(item.copy)}</p>
            </li>`,
          )
          .join("")}</ol>
          <p class="lede">Global Recurve activates at 12,000 users, then local by region. Recurve is not going to be here for a while — focus on Passport.</p>`,
      })
    }
    return page(ctx, {
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

registerKind("reps", {
  render(ctx) {
    if (ctx.sub?.id === "run") {
      return page(ctx, {
        kicker: "Chief path",
        body: stack(
          [
            { eyebrow: "Rule", title: "Only Reps run for Chief", copy: "Campaign or announce only in the last 6 months before election." },
            { eyebrow: "After a term", title: "Skip the next election", copy: "Eligible for any election after that. All Chiefs are also Reps." },
          ],
          (item) => panelCard(item),
        ),
      })
    }
    return page(ctx, {
      kicker: "Weeks elected · term 2 months, or Role + ≥1 meeting / month",
      body: table(
        ["Rep", "Weeks", "Role"],
        repsRank.map((row) => [row.name, row.weeks, row.role]),
      ),
    })
  },
})

registerKind("chiefs", {
  render(ctx) {
    if (ctx.sub?.id === "council") {
      return page(ctx, {
        kicker: "All 4 must approve",
        body: `${table(
          ["Proposal", "Tally", "Result"],
          councilVotes.map((row) => [row.item, row.tally, row.result]),
        )}<p class="lede">If 3 approve and 1 vetoes, it can pass next session after a new Chief with 3+ approving. Powers: Discovery weights, passport requirements, Recurve meetings, offer types, partnerships, oath, local events. Split 50% Baron + Steward USDC.</p>`,
      })
    }
    return page(ctx, {
      kicker: "Four per region · new Chief every 6 months · term 2 years",
      body: cards(chiefsFour, personCard),
    })
  },
})

registerKind("projects", {
  render(ctx) {
    if (ctx.sub?.id === "score") {
      return page(ctx, {
        kicker: "0–100 · L7+",
        body: `${empty("Seasonal deliverables scored by Project and the Rep. IRL land e.g. Starseed.")}
          <p class="grid-hint">Landing Phase 4 unlocks per-region at 144 representatives.</p>`,
      })
    }
    return page(ctx, {
      kicker: "Locked",
      body: `${panelCard({
        eyebrow: "Phase 3",
        title: "Make a project on paper",
        copy: "Learn how projects work by making a project on paper. Unlocks per-region after Recurve activity. Landing: 618 representatives.",
        muted: true,
      })}`,
    })
  },
})

registerKind("activation", {
  render(ctx) {
    if (ctx.sub?.id === "founders") {
      return page(ctx, {
        kicker: "Same four nominated",
        body: cards(activationFounders, (item) => panelCard({ title: item.name, copy: item.copy })),
      })
    }
    return page(ctx, {
      kicker: "Lagos · active",
      stats: statsBar([
        { k: "Pool", v: "4,200" },
        { k: "Founders", v: "4" },
        { k: "KYC", v: "All" },
        { k: "Status", v: "On" },
      ]),
      body: `<p class="lede">Need population and activity above the current lowest active region. Four founding members stake TETRA above average regional stake. KYC all. Same four as founding Chiefs.</p>`,
    })
  },
})

registerKind("rules", {
  render(ctx) {
    const id = ctx.sub?.id === "drafts" ? "drafts" : "ratified"
    return page(ctx, {
      kicker: "Reps write · Chiefs ratify",
      body: acc(houseRules[id]),
    })
  },
  hydrate(root) {
    bindAcc(root)
  },
})

registerKind("procedures", {
  render(ctx) {
    const id = ctx.sub?.id === "proposed" ? "proposed" : "active"
    return page(ctx, {
      kicker: "Beyond core gameplay",
      body: cards(procedures[id], (item) => panelCard({ title: item.title, copy: item.copy })),
    })
  },
})

registerKind("roles", {
  render(ctx) {
    if (ctx.sub?.id === "held") {
      return page(ctx, {
        kicker: "3/4 Chief approval",
        body: table(
          ["Person", "Role"],
          rolesHeld.map((row) => [row.name, row.role]),
        ),
      })
    }
    return page(ctx, {
      kicker: "Reps apply",
      body: cards(defaultRoles, (name) => panelCard({ eyebrow: "Open", title: name, copy: "Assigned to active representatives." })),
    })
  },
})

registerKind("hura", {
  render(ctx) {
    const id = ctx.sub?.id === "past" ? "past" : "next"
    return page(ctx, {
      kicker: "In person",
      body: `${calList(huraEvents[id])}
        <div class="grid-row">
          <button class="tetra-btn tetra-btn--primary" type="button">Host</button>
          <button class="tetra-btn" type="button">Co-create</button>
          <button class="tetra-btn tetra-btn--ghost" type="button">Join</button>
        </div>`,
    })
  },
})

registerKind("venues", {
  render(ctx) {
    const id = ctx.sub?.id === "enable" ? "enable" : "pins"
    return page(ctx, {
      kicker: "Tetra-enabled",
      body: cards(venues[id], (item) => panelCard({ title: item.title, copy: item.copy })),
    })
  },
})

registerKind("metrics", {
  render(ctx) {
    const id = ctx.sub?.id === "compare" ? "compare" : "region"
    return page(ctx, {
      kicker: id === "compare" ? "Activation gates" : "Lagos",
      stats: statsBar(regionMetrics[id]),
      body: `<p class="lede">${id === "compare" ? "Vs lowest active region, vs Nigeria, vs global Recurve at 12,000." : "Registered users, daily active connections, RA/USDC activity, stake, governance participation."}</p>`,
    })
  },
})

registerKind("level", {
  render(ctx) {
    if (ctx.sub?.id === "ladder") {
      return page(ctx, {
        kicker: "Overview names Regents · Recurve says Reps",
        body: `<ol class="grid-ladder">
          <li class="is-on"><span>1–3</span> Citizen · 1–6 RA/day · Passport, offers, Discovery</li>
          <li><span>4–6</span> Full citizen · 12–48 RA/day · oath, NGRA, Recurve</li>
          <li><span>Rep</span> Elected peer · House Rules · fortnight Zoom 4–6</li>
          <li><span>Chief</span> Four per region · ratify / veto · % of local economy</li>
          <li><span>7–9</span> Projects · IRL land</li>
        </ol>`,
      })
    }
    return page(ctx, {
      kicker: `L${profile.level} ${profile.levelName}`,
      body: `<div class="grid-level">
        <p class="grid-level__num">${esc(profile.level)}</p>
        <p class="lede">${esc(profile.levelName)} · ${esc(profile.raDay)} RA / day. Social verification opens Level 4 and Recurve.</p>
        ${identity({ initials: profile.photo, name: profile.name, meta: `${profile.region} · ${profile.tokenId}` })}
      </div>`,
    })
  },
})

registerKind("rep", {
  render(ctx) {
    if (ctx.sub?.id === "path") {
      return page(ctx, {
        kicker: "Office",
        body: `<p class="lede">Ranked by weeks elected Rep. Term 2 months, or Role + 1 meeting per month. Only Reps run for Chief. All Chiefs are also Reps.</p>`,
      })
    }
    return page(ctx, {
      kicker: "Office",
      body: `<div class="grid-stack">
        <article class="grid-card">
          <p class="eyebrow">Gate</p>
          <h2>Social verification</h2>
          <p>Three already-verified people. Oath on video, on-chain. Unlocks Level 4, national RA, Recurve seats.</p>
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
  render(ctx) {
    if (ctx.sub?.id === "win") {
      return page(ctx, {
        kicker: "Four faces",
        body: cards(howToWin, (item) => panelCard({ title: item.title, copy: item.copy })),
      })
    }
    return page(ctx, {
      kicker: "Join still Pending on redeem / mint",
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
  render(ctx) {
    if (ctx.sub?.id === "founder") {
      return page(ctx, {
        kicker: "Douglas Butner",
        body: panelCard({
          eyebrow: "cXc.world · web4 2020",
          title: "Tetra means four",
          copy: "Nested tetrahedron, top-down. Founder was the 100th member of Fractally. Official community t.me/tetragrids.",
        }),
      })
    }
    return page(ctx, {
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

registerKind("verification", {
  render(ctx) {
    if (ctx.sub?.id === "witnesses") {
      return page(ctx, {
        kicker: "Need 3 already-verified",
        body: `${empty("None booked.")}
          <div class="grid-thread">
            <p>Need three witnesses for the oath Zoom.</p>
            <p class="is-out">Tuesday 2pm works, sending the Zoom now.</p>
          </div>`,
      })
    }
    return page(ctx, {
      kicker: "Locked · L3",
      body: `<article class="grid-mail">
        <small>oath.tetra</small>
        <h2>Rules of engagement</h2>
        <p>The prospect agrees on-video to uphold the rules of engagement. Proof is uploaded on-chain. Unlocks Level 4.</p>
      </article>
      <div class="grid-row" style="margin-top:16px">
        <button class="tetra-btn tetra-btn--primary" type="button" disabled>Start oath</button>
      </div>`,
    })
  },
})

registerKind("faq", {
  render(ctx) {
    const id = ctx.sub?.id === "app" ? "app" : "cost"
    return page(ctx, {
      kicker: "Knowbase",
      body: acc(faqBySet[id]),
    })
  },
  hydrate(root) {
    bindAcc(root)
  },
})

registerKind("map", {
  render({ lane, room, sub }) {
    return unit({
      bleed: true,
      title: room.name,
      body: `<div class="grid-map" data-grid-map data-map-set="${esc(sub?.id || "offers")}">
        <div class="grid-map__canvas" data-map-canvas role="application" aria-label="Tetra map"></div>
        <aside class="grid-map__display" data-map-display hidden></aside>
        <p class="grid-map__label">${esc(lane.name)} · ${esc(sub?.name || room.name)} · click to center</p>
      </div>`,
    })
  },
})

registerKind("locales", {
  render(ctx) {
    const copy = {
      region: {
        title: "Lagos",
        body: "Top-level administrative district. Direct democracy, local charts, HuRA, House Rules.",
      },
      nation: {
        title: "Nigeria",
        body: "Country games and governance. After Level 4: NGRA only usable here. National chart wins bubble to global.",
      },
      global: {
        title: "Worldwide",
        body: "Global community and economy. Global Recurve at 12,000 registered users.",
      },
    }
    const set = copy[ctx.sub?.id] || copy.region
    return page(ctx, {
      kicker: "Three interconnected levels",
      body: panelCard({ eyebrow: ctx.sub?.name || "Locale", title: set.title, copy: set.body, on: true }),
    })
  },
})

registerKind("mission", {
  render(ctx) {
    if (ctx.sub?.id === "journey") {
      return page(ctx, {
        kicker: "User journey",
        body: cards(journey, (item) => panelCard({ eyebrow: item.n, title: item.title, copy: item.copy })),
      })
    }
    return page(ctx, {
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

registerKind("settings", {
  render(ctx) {
    if (ctx.sub?.id === "privacy") {
      return page(ctx, {
        kicker: "Hide connections per type",
        body: `${metrics([
          { k: "People", v: "Shown" },
          { k: "Regions", v: "Shown" },
        ])}<p class="lede">Docs: you can hide your connections per type if you prefer.</p>`,
      })
    }
    return page(ctx, {
      kicker: "Void · Jost · radius 0",
      body: `<p class="lede">Reduce motion follows the OS. Pattern field stays behind content, never on glass chrome.</p>`,
    })
  },
})

registerKind("wallet", {
  render(ctx) {
    if (ctx.sub?.id === "tetra") {
      return page(ctx, {
        kicker: "Stake",
        stats: statsBar([
          { k: "Staked", v: "0" },
          { k: "Crystal", v: "Closed" },
          { k: "Founding", v: "Closed" },
          { k: "Chain", v: "XPR" },
        ]),
        body: `<p class="lede">Stake TETRA for extra RA claim, Baron/Steward crystal, and region activation.</p>`,
      })
    }
    return page(ctx, {
      kicker: "Attention",
      stats: statsBar([
        { k: "RA / day", v: "6" },
        { k: "Unclaimed", v: "0" },
        { k: "NGRA", v: "Locked" },
        { k: "Market", v: "XPR" },
      ]),
      body: `<p class="lede">Tradable for XPR, XUSDC. Market RA comes from earners. Local variants carry 2–4× after Level 4.</p>`,
    })
  },
})

registerKind("fallback", {
  render(ctx) {
    return page(ctx, {
      body: `<p class="lede">Unregistered kind <code>${esc(ctx.room.kind || "unknown")}</code>. Register it with <code>registerKind</code>.</p>`,
    })
  },
})

function bindAcc(root) {
  root.querySelectorAll("[data-acc]").forEach((block) => {
    if (block.closest("[data-clone]") || block.dataset.bound) return
    block.dataset.bound = "1"
    block.querySelectorAll(".grid-acc__item button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true"
        const panel = btn.nextElementSibling
        btn.setAttribute("aria-expanded", String(!open))
        if (panel) panel.hidden = open
      })
    })
  })
}
