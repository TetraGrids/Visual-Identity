import "../brand/tokens.css"
import "../brand/buttons.css"
import "./tetra-on.css"
import markSvg from "../brand/geometry/icon-mark.svg?raw"
import gMark from "../brand/geometry/tetrahedron-g.svg?raw"
import wordmarkSvg from "../brand/geometry/wordmark.svg?raw"
import platoUrl from "./on/media/plato-courtyard.png"
import templeUrl from "./on/media/delphi-temple-field.png"
import * as copy from "./on/copy.js"
import { solidMarkup } from "./on/solids.js"

const LINEAR = [
  "cold_open",
  "pain_heard",
  "heard_heard",
  "pain_together",
  "together_heard",
  "pain_money",
  "money_heard",
  "pain_seeds",
  "seeds_heard",
  "pain_voice",
  "voice_heard",
  "plan",
  "commit",
  "rating",
  "push",
  "pay_prime",
  "pay_remind",
  "pay_buy",
]

const HEARD_OF = {
  heard: "heard_heard",
  together: "together_heard",
  money: "money_heard",
  seeds: "seeds_heard",
  voice: "voice_heard",
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function pain(id) {
  return copy.pains.find((item) => item.id === id)
}

function parseQuery() {
  const q = new URLSearchParams(location.search)
  return { friend: q.get("friend") || "" }
}

function pairCode() {
  return `ON-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function defaultState() {
  const { friend } = parseQuery()
  return {
    step: "cold_open",
    answers: {},
    commit: "",
    rating: 0,
    push: "",
    plan: "yearly",
    popularOpen: false,
    friend: friend.trim(),
    code: pairCode(),
    circle: `POP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  }
}

function loadState() {
  try {
    const raw = sessionStorage.getItem("tetra-on")
    if (!raw) return defaultState()
    const next = { ...defaultState(), ...JSON.parse(raw) }
    const { friend } = parseQuery()
    if (friend) next.friend = friend
    return next
  } catch {
    return defaultState()
  }
}

let state = loadState()

function save() {
  sessionStorage.setItem("tetra-on", JSON.stringify(state))
}

function stepIndex(id) {
  const linear = id.startsWith("deeper_") ? HEARD_OF[id.replace("deeper_", "")] : id
  const i = LINEAR.indexOf(linear)
  return i < 0 ? LINEAR.length - 1 : i
}

function coveringPlan() {
  if (!state.friend) return null
  return "yearly"
}

function afterPay() {
  if (state.friend) return "covered"
  if (state.plan === "yearly") return "invite_pair"
  if (state.plan === "popular_yearly" || state.plan === "popular_monthly") return "invite_circle"
  return "invite_blocked"
}

function go(step) {
  state.step = step
  save()
  const hash = `#/${step}`
  if (location.hash !== hash) history.pushState({ step }, "", hash)
  render()
}

function prevStep() {
  if (state.step.startsWith("deeper_")) return HEARD_OF[state.step.replace("deeper_", "")]
  if (state.step === "in") {
    if (state.friend) return "covered"
    if (state.plan === "yearly") return "invite_pair"
    if (String(state.plan).startsWith("popular")) return "invite_circle"
    return "invite_blocked"
  }
  if (state.step.startsWith("invite_") || state.step === "covered") return "pay_buy"
  const i = LINEAR.indexOf(state.step)
  return i > 0 ? LINEAR[i - 1] : null
}

function nextStep() {
  const step = state.step
  if (step.startsWith("pain_")) {
    const id = step.replace("pain_", "")
    return state.answers[id] ? HEARD_OF[id] : null
  }
  if (step === "commit" && !state.commit) return null
  if (step === "rating" && !state.rating) return null
  if (step === "in") return null
  if (step === "cold_open") return "pain_heard"
  if (step.startsWith("deeper_")) return HEARD_OF[step.replace("deeper_", "")]
  if (step.endsWith("_heard")) {
    const i = LINEAR.indexOf(step)
    return LINEAR[i + 1] || null
  }
  if (step === "plan") return "commit"
  if (step === "commit") return "rating"
  if (step === "rating") return "push"
  if (step === "push") return "pay_prime"
  if (step === "pay_prime") return "pay_remind"
  if (step === "pay_remind") return "pay_buy"
  if (step === "pay_buy") return afterPay()
  if (step.startsWith("invite_") || step === "covered") return "in"
  const i = LINEAR.indexOf(step)
  return i >= 0 && i < LINEAR.length - 1 ? LINEAR[i + 1] : null
}

function back() {
  const prev = prevStep()
  if (prev) go(prev)
}

function tryNext() {
  const next = nextStep()
  if (next) {
    go(next)
    return
  }
  if (state.step.startsWith("pain_")) toast("Pick one.")
  else if (state.step === "commit") toast("Name the office first.")
  else if (state.step === "rating") toast("Mark the walk.")
}

function progressBar() {
  const here = stepIndex(state.step)
  return `<div class="on-progress" aria-hidden="true">${LINEAR.map((_, i) => {
    const cls = i < here ? "is-done" : i === here ? "is-on" : ""
    return `<span class="${cls}"></span>`
  }).join("")}</div>`
}

const CHEV_L = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 4 7 12 15 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="miter" stroke-linecap="square"/></svg>`
const CHEV_R = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 4 17 12 9 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="miter" stroke-linecap="square"/></svg>`

function chrome(title) {
  const backOff = !prevStep()
  const nextOff = !nextStep()
  return `<div class="on-top">
    <button class="on-arrow" type="button" data-back aria-label="Back"${backOff ? " disabled" : ""}>${CHEV_L}</button>
    <p class="on-kicker">${esc(title)}</p>
    <button class="on-arrow" type="button" data-next aria-label="Next"${nextOff ? " disabled" : ""}>${CHEV_R}</button>
  </div>`
}

function foot(cta, extra = "") {
  return `<div class="on-foot">
    <button class="tetra-btn tetra-btn--primary" type="button" data-cta>${esc(cta)}</button>
    ${extra}
  </div>`
}

function choices(list, selected) {
  return `<div class="on-choices">${list
    .map(
      (label) =>
        `<button class="on-choice${selected === label ? " is-on" : ""}" type="button" data-choice="${esc(label)}">${esc(label)}</button>`,
    )
    .join("")}</div>`
}

function links(items) {
  return `<div class="on-links">${items
    .map((item) => {
      const note = item.note ? `<small>${esc(item.note)}</small>` : ""
      return `<a href="${esc(item.href)}" target="_blank" rel="noreferrer">${esc(item.title)}${note}</a>`
    })
    .join("")}</div>`
}

function screenSplash() {
  const s = copy.splash
  return `<section class="on-screen on-splash">
    <div class="on-splash__hero"></div>
    ${chrome("Tetra On")}
    <div class="on-copy">
      <p class="on-eyebrow">${esc(s.eyebrow)}</p>
      <div class="on-mark on-mark--g">${gMark}</div>
      <div class="on-wordmark">${wordmarkSvg}</div>
      <h1>${esc(s.headline)}</h1>
      <p class="on-lede">${esc(s.lede)}</p>
      <p class="on-body">${esc(s.body)}</p>
      <p class="on-body">${esc(s.close)}</p>
    </div>
    ${foot(s.cta)}
  </section>`
}

function screenPain(id) {
  const p = pain(id)
  const selected = state.answers[id] || ""
  return `<section class="on-screen">
    ${chrome(p.kicker)}
    <div class="on-solid">${solidMarkup(p.solid)}</div>
    <p class="on-body">${esc(p.scenario)}</p>
    <h1>${esc(p.question)}</h1>
    ${choices(p.choices, selected)}
  </section>`
}

function screenHeard(id) {
  const p = pain(id)
  const named = state.answers[id]
  return `<section class="on-screen">
    ${chrome(p.face)}
    <div class="on-solid">${solidMarkup(p.solid)}</div>
    <h1>${esc(p.heardTitle)}</h1>
    ${named ? `<p class="on-echo">You named ${esc(named)}.</p>` : ""}
    <p class="on-belief">${esc(p.belief)}</p>
    ${foot("Continue", `<button class="on-quiet" type="button" data-deeper="${esc(id)}">Dive deeper</button>`)}
  </section>`
}

function screenDeeper(id) {
  const p = pain(id)
  const d = p.deeper
  return `<section class="on-screen">
    ${chrome("Dive deeper")}
    <div class="on-solid">${solidMarkup(p.solid)}</div>
    <h1>${esc(d.headline)}</h1>
    <p class="on-movie">${esc(d.movie)}</p>
    <p class="on-deeper-title">Three related pains</p>
    <ul class="on-list">${d.pains.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
    <p class="on-deeper-title">The destination</p>
    <p class="on-body">${esc(d.destination)}</p>
    <p class="on-deeper-title">How it works</p>
    <p class="on-body">${esc(d.solution)}</p>
    <p class="on-deeper-title">Built</p>
    ${links(d.built)}
    <p class="on-deeper-title">Coming</p>
    ${links(d.coming)}
    ${foot("Return")}
  </section>`
}

function screenPlan() {
  return `<section class="on-screen" data-plan>
    ${chrome(copy.plan.eyebrow)}
    <h1>${esc(copy.plan.headline)}</h1>
    <div class="on-solid on-solid--lg" data-plan-solid>${solidMarkup("tetrahedron")}</div>
    ${copy.plan.lines
      .map((line, i) => {
        const named = state.answers[line.id] || "—"
        return `<div class="on-plan-line${i === 0 ? " is-on" : ""}" data-plan-line="${esc(line.id)}">
          ${solidMarkup(pain(line.id).solid)}
          <span>${esc(line.label)} · ${esc(named)}</span>
        </div>`
      })
      .join("")}
    ${foot(copy.plan.cta)}
  </section>`
}

function screenCommit() {
  return `<section class="on-screen">
    ${chrome(copy.commit.eyebrow)}
    <h1>${esc(copy.commit.headline)}</h1>
    <p class="on-body">${esc(copy.commit.body)}</p>
    <p class="on-lede">${esc(copy.commit.question)}</p>
    ${choices(copy.commit.choices, state.commit)}
    ${state.commit ? foot(copy.commit.cta) : ""}
  </section>`
}

function screenRating() {
  const marks = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<button class="on-star${state.rating >= n ? " is-on" : ""}" type="button" data-rate="${n}" aria-label="${n}">${markSvg}</button>`,
    )
    .join("")
  return `<section class="on-screen">
    ${chrome(copy.rating.eyebrow)}
    <h1>${esc(copy.rating.headline)}</h1>
    <p class="on-body">${esc(copy.rating.body)}</p>
    <div class="on-stars">${marks}</div>
    ${state.rating ? foot(copy.rating.cta) : ""}
  </section>`
}

function screenPush() {
  return `<section class="on-screen">
    ${chrome(copy.push.eyebrow)}
    <h1>${esc(copy.push.headline)}</h1>
    <p class="on-body">${esc(copy.push.body)}</p>
    <div class="on-foot">
      <button class="tetra-btn tetra-btn--primary" type="button" data-push="allow">${esc(copy.push.allow)}</button>
      <button class="on-quiet" type="button" data-push="later">${esc(copy.push.later)}</button>
    </div>
  </section>`
}

function screenPrime() {
  const p = copy.pay.prime
  return `<section class="on-screen">
    ${chrome(p.eyebrow)}
    <h1>${esc(p.headline)}</h1>
    <p class="on-body">${esc(p.body)}</p>
    ${foot(p.cta, legal())}
  </section>`
}

function screenRemind() {
  const p = copy.pay.remind
  return `<section class="on-screen">
    ${chrome(p.eyebrow)}
    <h1>${esc(p.headline)}</h1>
    <div class="on-timeline">${p.yearly
      .map((row) => `<div class="on-time"><strong>${esc(row.when)}</strong><span>${esc(row.what)}</span></div>`)
      .join("")}</div>
    <p class="on-fine">${esc(p.note)}</p>
    ${foot(p.cta)}
  </section>`
}

function planRow(row, { covered = false, selected = false } = {}) {
  const price = covered ? "$0" : row.price
  return `<button class="on-plan${selected ? " is-on" : ""}" type="button" data-plan="${esc(row.id)}">
    <div class="on-plan__row">
      <span class="on-plan__name">${esc(row.name)}</span>
      <span class="on-plan__price">${esc(price)}</span>
    </div>
    <p class="on-plan__badge">${esc(row.badge)}</p>
    <p class="on-plan__fine">${esc(row.fine)}</p>
  </button>`
}

function legal() {
  const p = copy.pay.buy
  return `<div class="on-legal">
    <button type="button" data-restore>${esc(p.restore)}</button>
    <a href="${esc(p.termsHref)}" target="_blank" rel="noreferrer">${esc(p.terms)}</a>
    <a href="${esc(p.privacyHref)}" target="_blank" rel="noreferrer">${esc(p.privacy)}</a>
  </div>`
}

function screenBuy() {
  const p = copy.pay.buy
  const cover = coveringPlan()
  const covered = Boolean(cover)
  const selected = state.plan
  const cta = covered ? p.ctaCovered : selected.startsWith("popular") ? p.cta : p.cta
  const friend = covered
    ? `<p class="on-friend">Friended in by ${esc(state.friend)}</p>`
    : ""
  const popular = state.popularOpen
    ? `${planRow(p.popularYearly, { selected: selected === "popular_yearly" })}
       ${planRow(p.popularMonthly, { selected: selected === "popular_monthly" })}
       <p class="on-fine">${esc(p.popularBlurb)}</p>`
    : `<button class="on-quiet" type="button" data-popular>${esc(p.popularLink)}</button>`

  return `<section class="on-screen">
    ${chrome(p.eyebrow)}
    <h1>${esc(p.headline)}</h1>
    <p class="on-body">${esc(p.body)}</p>
    ${friend}
    <div class="on-plans">
      ${planRow(p.yearly, { covered: cover === "yearly", selected: selected === "yearly" })}
      ${planRow(p.monthly, { covered: cover === "monthly", selected: selected === "monthly" })}
    </div>
    ${popular}
    ${foot(covered && (selected === "yearly" || selected === cover) ? p.ctaFree : cta, legal())}
  </section>`
}

function gates() {
  return `<p class="on-deeper-title">On when membership is active</p>
    <ul class="on-gates">${copy.invite.gates.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>`
}

function screenInvite(kind) {
  const pack = copy.invite[kind]
  const code = kind === "circle" ? state.circle : kind === "pair" ? state.code : ""
  const friend = kind === "covered" ? `<p class="on-echo">Friended in by ${esc(state.friend)}.</p>` : ""
  const codeBox = code
    ? `<p class="on-code" data-code>${esc(code)}</p>
       <button class="on-quiet" type="button" data-copy>${esc(copy.invite.copy)}</button>`
    : ""
  return `<section class="on-screen">
    ${chrome(pack.eyebrow)}
    <h1>${esc(pack.headline)}</h1>
    ${friend}
    <p class="on-body">${esc(pack.body)}</p>
    ${pack.hint ? `<p class="on-fine">${esc(pack.hint)}</p>` : ""}
    ${codeBox}
    ${gates()}
    ${foot(copy.invite.cta)}
  </section>`
}

function screenIn() {
  return `<section class="on-screen">
    ${chrome("Tetra On")}
    <div class="on-solid on-solid--lg">${solidMarkup("tetrahedron")}</div>
    <h1>The courtyard is open</h1>
    <p class="on-body">This preview is the onboarding and the gate. The Grid is the app shell that follows.</p>
    <div class="on-foot">
      <a class="tetra-btn tetra-btn--primary" href="/grid.html">Open The Grid</a>
      <a class="on-quiet" href="/#demos">Back to the site</a>
    </div>
  </section>`
}

function view() {
  const step = state.step
  if (step === "cold_open") return screenSplash()
  if (step.startsWith("pain_")) return screenPain(step.replace("pain_", ""))
  if (step.endsWith("_heard") && !step.startsWith("deeper_")) return screenHeard(step.replace("_heard", ""))
  if (step.startsWith("deeper_")) return screenDeeper(step.replace("deeper_", ""))
  if (step === "plan") return screenPlan()
  if (step === "commit") return screenCommit()
  if (step === "rating") return screenRating()
  if (step === "push") return screenPush()
  if (step === "pay_prime") return screenPrime()
  if (step === "pay_remind") return screenRemind()
  if (step === "pay_buy") return screenBuy()
  if (step === "invite_pair") return screenInvite("pair")
  if (step === "invite_circle") return screenInvite("circle")
  if (step === "invite_blocked") return screenInvite("blocked")
  if (step === "covered") return screenInvite("covered")
  if (step === "in") return screenIn()
  return screenSplash()
}

function shell() {
  return `
    <div class="on-world" data-on style="--on-field: url('${templeUrl}'); --on-plato: url('${platoUrl}')">
      <a class="skip" href="#on-notes">Notes</a>
      <button class="on-notes-btn" id="on-notes" type="button" aria-expanded="false" data-notes-toggle>Notes</button>
      <aside class="on-notes" data-notes-panel hidden>
        <p class="on-kicker">${esc(copy.notes.title)}</p>
        <p>${esc(copy.notes.body)}</p>
        <a class="tetra-btn tetra-btn--primary" href="${esc(copy.notes.backHref)}">${esc(copy.notes.backLabel)}</a>
        <a class="tetra-btn tetra-btn--ghost" href="/">Brand guide</a>
        <a class="tetra-btn tetra-btn--ghost" href="/tetra-on.html?friend=Amina">Friended in by Amina</a>
        <button class="tetra-btn tetra-btn--ghost" type="button" data-reset>Reset walk</button>
      </aside>
      <div class="on-phone" data-phone tabindex="0">
        ${progressBar()}
        ${view()}
        <p class="on-toast" data-toast hidden></p>
      </div>
    </div>
  `
}

let toastTimer = 0
let planTimer = 0
function toast(message) {
  const node = document.querySelector("[data-toast]")
  if (!node) return
  node.textContent = message
  node.hidden = false
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    node.hidden = true
  }, 2200)
}

function animatePlan(root) {
  window.clearInterval(planTimer)
  const lines = [...root.querySelectorAll("[data-plan-line]")]
  const solid = root.querySelector("[data-plan-solid]")
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!lines.length) return
  const ids = copy.plan.lines.map((line) => line.id)
  let i = 0
  const paint = () => {
    lines.forEach((line, index) => line.classList.toggle("is-on", index <= i))
    const id = ids[Math.min(i, ids.length - 1)]
    if (solid) solid.innerHTML = solidMarkup(pain(id).solid)
  }
  paint()
  if (reduce) {
    i = ids.length - 1
    paint()
    return
  }
  planTimer = window.setInterval(() => {
    i += 1
    if (i >= ids.length) {
      window.clearInterval(planTimer)
      return
    }
    paint()
  }, 700)
}

function bind(root) {
  root.querySelector("[data-notes-toggle]")?.addEventListener("click", () => {
    const panel = root.querySelector("[data-notes-panel]")
    const btn = root.querySelector("[data-notes-toggle]")
    const open = panel.hidden
    panel.hidden = !open
    btn.setAttribute("aria-expanded", String(open))
  })

  root.querySelector("[data-reset]")?.addEventListener("click", () => {
    sessionStorage.removeItem("tetra-on")
    state = defaultState()
    go("cold_open")
  })

  const phone = root.querySelector("[data-phone]")
  phone?.addEventListener("click", (event) => {
    if (event.target.closest("[data-back]")) {
      back()
      return
    }
    if (event.target.closest("[data-next]")) {
      tryNext()
      return
    }
    const choice = event.target.closest("[data-choice]")
    if (choice) {
      const label = choice.dataset.choice
      if (state.step.startsWith("pain_")) {
        const id = state.step.replace("pain_", "")
        state.answers[id] = label
        save()
        go(HEARD_OF[id])
        return
      }
      if (state.step === "commit") {
        state.commit = label
        save()
        render()
        return
      }
    }
    const deeper = event.target.closest("[data-deeper]")
    if (deeper) {
      go(`deeper_${deeper.dataset.deeper}`)
      return
    }
    const rate = event.target.closest("[data-rate]")
    if (rate) {
      state.rating = Number(rate.dataset.rate)
      save()
      render()
      return
    }
    const push = event.target.closest("[data-push]")
    if (push) {
      state.push = push.dataset.push
      save()
      go("pay_prime")
      return
    }
    const planBtn = event.target.closest("[data-plan]")
    if (planBtn && state.step === "pay_buy") {
      state.plan = planBtn.dataset.plan
      save()
      render()
      return
    }
    const popular = event.target.closest("[data-popular]")
    if (popular) {
      state.popularOpen = true
      save()
      render()
      return
    }
    const restore = event.target.closest("[data-restore]")
    if (restore) {
      toast(copy.restoreMsg)
      return
    }
    const copyBtn = event.target.closest("[data-copy]")
    if (copyBtn) {
      const code = state.plan.startsWith("popular") ? state.circle : state.code
      navigator.clipboard?.writeText(code).catch(() => {})
      copyBtn.textContent = copy.invite.copied
      return
    }
    const cta = event.target.closest("[data-cta]")
    if (cta) tryNext()
  })

  let swipe = null
  phone?.addEventListener("pointerdown", (event) => {
    if (event.button) return
    swipe = { x: event.clientX, y: event.clientY }
  })
  phone?.addEventListener("pointerup", (event) => {
    if (!swipe) return
    const dx = event.clientX - swipe.x
    const dy = event.clientY - swipe.y
    swipe = null
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.15) return
    if (dx > 0) back()
    else tryNext()
  })
  phone?.addEventListener("pointercancel", () => {
    swipe = null
  })
}

function render() {
  const mount = document.getElementById("on")
  const notesOpen = mount.querySelector("[data-notes-panel]")?.hidden === false
  mount.innerHTML = shell()
  if (notesOpen) {
    const panel = mount.querySelector("[data-notes-panel]")
    const btn = mount.querySelector("[data-notes-toggle]")
    if (panel) panel.hidden = false
    btn?.setAttribute("aria-expanded", "true")
  }
  bind(mount)
  if (state.step === "plan") animatePlan(mount)
  mount.querySelector("[data-phone]")?.focus({ preventScroll: true })
}

function applyHash() {
  const id = location.hash.replace(/^#\/?/, "")
  if (!id) return
  const known =
    LINEAR.includes(id) ||
    id.startsWith("deeper_") ||
    id.startsWith("invite_") ||
    id === "covered" ||
    id === "in"
  if (known) state.step = id
}

applyHash()
if (!location.hash) history.replaceState({ step: state.step }, "", `#/${state.step}`)
render()
window.addEventListener("popstate", () => {
  applyHash()
  render()
})
window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
  if (event.target?.closest?.("input, textarea, [contenteditable='true']")) return
  if (event.key === "ArrowLeft") {
    event.preventDefault()
    back()
  } else if (event.key === "ArrowRight") {
    event.preventDefault()
    tryNext()
  }
})
