import "../brand/tokens.css"
import "../brand/buttons.css"
import "./tetra-on.css"
import "./humanity-on.css"
import markSvg from "../brand/geometry/tetrahedron-g.svg?raw"
import templeUrl from "./on/media/delphi-temple-field.png"
import * as copy from "./on/humanity-copy.js"

const BASE = [
  "welcome",
  "system",
  "democracy",
  "americas",
  "humanity",
  "faction",
  "alignment",
  "token",
  "assembly",
  "commitment",
  "rating",
  "reminder",
  "access",
]
const PAY = ["pay_prime", "pay_remind", "pay_buy"]
const OUTCOMES = ["invite_pair", "invite_circle", "invite_blocked"]
const END = ["identity", "complete"]

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function fresh() {
  return {
    step: "welcome",
    answers: {},
    faction: "",
    alignment: [],
    tokenAccepted: false,
    commitment: "",
    rating: 0,
    reminder: "",
    access: "",
    plan: "yearly",
    popularOpen: false,
    auth: "",
    returning: false,
    code: `HUM-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
  }
}

function load() {
  try {
    return { ...fresh(), ...JSON.parse(sessionStorage.getItem("humanity-on") || "{}") }
  } catch {
    return fresh()
  }
}

let state = load()

function save() {
  sessionStorage.setItem("humanity-on", JSON.stringify(state))
}

function journey() {
  if (state.returning) return ["welcome", "identity", "complete"]
  return state.access === "member" ? [...BASE, ...PAY, membershipOutcome(), ...END] : [...BASE, ...END]
}

function membershipOutcome() {
  if (state.plan === "yearly") return "invite_pair"
  if (state.plan.startsWith("popular")) return "invite_circle"
  return "invite_blocked"
}

function previous() {
  if (state.step === "identity") return state.returning ? "welcome" : state.access === "member" ? membershipOutcome() : "access"
  const index = journey().indexOf(state.step)
  return index > 0 ? journey()[index - 1] : null
}

function next() {
  if (copy.confirmations.some(({ id }) => id === state.step)) {
    return state.answers[state.step] ? journey()[journey().indexOf(state.step) + 1] : null
  }
  if (state.step === "faction") return state.faction ? "alignment" : null
  if (state.step === "alignment") return state.alignment.length === copy.alignment.checks.length ? "token" : null
  if (state.step === "token") return state.tokenAccepted ? "assembly" : null
  if (state.step === "commitment") return state.commitment ? "rating" : null
  if (state.step === "rating") return state.rating ? "reminder" : null
  if (state.step === "reminder") return state.reminder ? "access" : null
  if (state.step === "access") return state.access === "member" ? "pay_prime" : state.access === "free" ? "identity" : null
  if (state.step === "identity") return state.auth ? "complete" : null
  const index = journey().indexOf(state.step)
  return index >= 0 && index < journey().length - 1 ? journey()[index + 1] : null
}

function go(step) {
  state.step = step
  save()
  if (location.hash !== `#/${step}`) history.pushState({ step }, "", `#/${step}`)
  render()
}

function progress() {
  const steps = journey()
  const current = Math.max(0, steps.indexOf(state.step))
  return `<div class="on-progress" aria-hidden="true">${steps
    .map((_, index) => `<span class="${index < current ? "is-done" : index === current ? "is-on" : ""}"></span>`)
    .join("")}</div>`
}

const CHEV_L = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 4 7 12 15 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="miter" stroke-linecap="square"/></svg>`
const CHEV_R = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 4 17 12 9 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="miter" stroke-linecap="square"/></svg>`

function chrome(title) {
  return `<div class="on-top">
    <button class="on-arrow" type="button" data-back aria-label="Back"${previous() ? "" : " disabled"}>${CHEV_L}</button>
    <p class="on-kicker">${esc(title)}</p>
    <button class="on-arrow" type="button" data-next aria-label="Next"${next() ? "" : " disabled"}>${CHEV_R}</button>
  </div>`
}

function foot(label, extra = "") {
  return `<div class="on-foot">
    <button class="tetra-btn tetra-btn--primary" type="button" data-cta>${esc(label)}</button>
    ${extra}
  </div>`
}

function choices(items, selected, name) {
  return `<div class="on-choices humanity-choices">${items
    .map(
      (label) =>
        `<button class="on-choice${selected === label ? " is-on" : ""}" type="button" data-${name}="${esc(label)}" aria-pressed="${selected === label}">${esc(label)}</button>`,
    )
    .join("")}</div>`
}

function welcome() {
  return `<section class="on-screen on-splash humanity-splash">
    <div class="on-splash__hero"></div>
    ${chrome(copy.welcome.eyebrow)}
    <div class="on-copy">
      <p class="on-eyebrow">${esc(copy.welcome.eyebrow)}</p>
      <div class="humanity-mark">${markSvg}</div>
      <h1>${esc(copy.welcome.headline)}</h1>
      <p class="on-lede">${esc(copy.welcome.lede)}</p>
      <blockquote class="humanity-quote"><p>“${esc(copy.welcome.quote)}”</p><cite>Solon · Humanity guide</cite></blockquote>
      <p class="on-body">${esc(copy.welcome.body)}</p>
      <details class="humanity-details">
        <summary>More about Solon</summary>
        <h2>${esc(copy.solon.title)}</h2>
        <p>${esc(copy.solon.body)}</p>
      </details>
    </div>
    ${foot(copy.welcome.cta, '<button class="on-quiet" type="button" data-login>Already joined? Log in</button>')}
  </section>`
}

function confirmation(id) {
  const screen = copy.confirmations.find((item) => item.id === id)
  return `<section class="on-screen">
    ${chrome(screen.eyebrow)}
    <div class="humanity-number" aria-hidden="true">${esc(screen.eyebrow.slice(0, 2))}</div>
    <h1>${esc(screen.headline)}</h1>
    <p class="on-body">${esc(screen.body)}</p>
    <p class="on-lede">${esc(screen.question)}</p>
    ${choices(screen.choices, state.answers[id], "answer")}
  </section>`
}

function humanity() {
  return `<section class="on-screen">
    ${chrome(copy.humanity.eyebrow)}
    <h1>${esc(copy.humanity.headline)}</h1>
    <p class="on-body">${esc(copy.humanity.body)}</p>
    <div class="humanity-columns">
      <div>
        <p class="on-deeper-title">Humanity provides</p>
        <ul class="on-list">${copy.humanity.provides.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      </div>
      <div>
        <p class="on-deeper-title">Factions bring</p>
        <ul class="on-list">${copy.humanity.brings.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      </div>
    </div>
    ${foot(copy.humanity.cta)}
  </section>`
}

function faction() {
  return `<section class="on-screen">
    ${chrome(copy.faction.eyebrow)}
    <h1>${esc(copy.faction.headline)}</h1>
    <p class="on-body">${esc(copy.faction.body)}</p>
    <button class="humanity-faction${state.faction === "FALA" ? " is-on" : ""}" type="button" data-faction="FALA" aria-pressed="${state.faction === "FALA"}">
      <span>${esc(copy.faction.status)}</span>
      <strong>${esc(copy.faction.name)}</strong>
      <em>${esc(copy.faction.expansion)}</em>
      <p>${esc(copy.faction.language)}</p>
      <dl>
        <div><dt>Burning desire</dt><dd>${esc(copy.faction.desire)}</dd></div>
        <div><dt>Vision</dt><dd>${esc(copy.faction.vision)}</dd></div>
        <div><dt>Foundation</dt><dd>${esc(copy.faction.foundation)}</dd></div>
      </dl>
    </button>
    <p class="on-fine">FALA is the only faction currently accepting people. New factions will appear after registration and vetting are implemented.</p>
    ${state.faction ? foot(copy.faction.cta) : ""}
  </section>`
}

function alignment() {
  return `<section class="on-screen">
    ${chrome(copy.alignment.eyebrow)}
    <h1>${esc(copy.alignment.headline)}</h1>
    <p class="on-body">${esc(copy.alignment.body)}</p>
    <div class="humanity-checks">${copy.alignment.checks
      .map(
        (label, index) => `<label>
          <input type="checkbox" data-align="${index}"${state.alignment.includes(index) ? " checked" : ""} />
          <span>${esc(label)}</span>
        </label>`,
      )
      .join("")}</div>
    ${state.alignment.length === copy.alignment.checks.length ? foot(copy.alignment.cta) : ""}
  </section>`
}

function token() {
  return `<section class="on-screen">
    ${chrome(copy.token.eyebrow)}
    <h1>${esc(copy.token.headline)}</h1>
    <p class="on-body">${esc(copy.token.body)}</p>
    <p class="humanity-token-rule">${esc(copy.token.rule)}</p>
    <ul class="humanity-token-list">${copy.token.checks.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    <div class="on-foot">
      <button class="tetra-btn tetra-btn--primary" type="button" data-token>${esc(copy.token.cta)}</button>
    </div>
  </section>`
}

function assembly() {
  return `<section class="on-screen">
    ${chrome(copy.assembly.eyebrow)}
    <h1>${esc(copy.assembly.headline)}</h1>
    <div class="humanity-assembly" aria-hidden="true">${markSvg}</div>
    <div class="humanity-path">${copy.assembly.lines
      .map(
        ({ id, label }) => `<p>
          <span>${esc(label)}</span>
          <strong>${esc(id === "faction" ? state.faction : id === "token" ? "One person · one vote" : state.answers[id])}</strong>
        </p>`,
      )
      .join("")}</div>
    ${foot(copy.assembly.cta)}
  </section>`
}

function commitment() {
  return `<section class="on-screen">
    ${chrome(copy.commitment.eyebrow)}
    <h1>${esc(copy.commitment.headline)}</h1>
    <p class="on-body">${esc(copy.commitment.body)}</p>
    ${choices(copy.commitment.choices, state.commitment, "commit")}
    ${state.commitment ? foot(copy.commitment.cta) : ""}
  </section>`
}

function rating() {
  return `<section class="on-screen">
    ${chrome(copy.rating.eyebrow)}
    <h1>${esc(copy.rating.headline)}</h1>
    <p class="on-body">${esc(copy.rating.body)}</p>
    <div class="on-stars">${[1, 2, 3, 4, 5]
      .map(
        (value) =>
          `<button class="on-star${state.rating >= value ? " is-on" : ""}" type="button" data-rate="${value}" aria-label="${value} out of 5" aria-pressed="${state.rating === value}">${markSvg}</button>`,
      )
      .join("")}</div>
    ${state.rating ? foot(copy.rating.cta) : ""}
  </section>`
}

function reminder() {
  return `<section class="on-screen">
    ${chrome(copy.reminder.eyebrow)}
    <h1>${esc(copy.reminder.headline)}</h1>
    <p class="on-body">${esc(copy.reminder.body)}</p>
    <div class="on-foot">
      <button class="tetra-btn tetra-btn--primary" type="button" data-reminder="allow">${esc(copy.reminder.allow)}</button>
      <button class="on-quiet" type="button" data-reminder="later">${esc(copy.reminder.later)}</button>
    </div>
  </section>`
}

function access() {
  return `<section class="on-screen">
    ${chrome(copy.access.eyebrow)}
    <h1>${esc(copy.access.headline)}</h1>
    <p class="on-body">${esc(copy.access.body)}</p>
    <div class="humanity-access">
      ${["free", "member"]
        .map(
          (id) => `<button class="${state.access === id ? "is-on" : ""}" type="button" data-access="${id}" aria-pressed="${state.access === id}">
            <span>${esc(copy.access[id].price)}</span>
            <strong>${esc(copy.access[id].name)}</strong>
            <p>${esc(copy.access[id].detail)}</p>
          </button>`,
        )
        .join("")}
    </div>
    ${state.access ? foot(state.access === "free" ? "Create spectator account" : "See member access") : ""}
  </section>`
}

function prime() {
  return `<section class="on-screen">
    ${chrome(copy.pay.prime.eyebrow)}
    <h1>${esc(copy.pay.prime.headline)}</h1>
    <p class="on-body">${esc(copy.pay.prime.body)}</p>
    ${foot(copy.pay.prime.cta, '<button class="on-quiet" type="button" data-free>Continue as a free spectator</button>')}
  </section>`
}

function remind() {
  return `<section class="on-screen">
    ${chrome(copy.pay.remind.eyebrow)}
    <h1>${esc(copy.pay.remind.headline)}</h1>
    <div class="on-timeline">${copy.pay.remind.timeline
      .map(({ when, what }) => `<div class="on-time"><strong>${esc(when)}</strong><span>${esc(what)}</span></div>`)
      .join("")}</div>
    <p class="on-fine">${esc(copy.pay.remind.note)}</p>
    ${foot(copy.pay.remind.cta)}
  </section>`
}

function plan(plan) {
  return `<button class="on-plan${state.plan === plan.id ? " is-on" : ""}" type="button" data-plan="${esc(plan.id)}" aria-pressed="${state.plan === plan.id}">
    <div class="on-plan__row"><span class="on-plan__name">${esc(plan.name)}</span><span class="on-plan__price">${esc(plan.price)}</span></div>
    <p class="on-plan__badge">${esc(plan.badge)}</p>
    <p class="on-plan__fine">${esc(plan.fine)}</p>
  </button>`
}

function buy() {
  return `<section class="on-screen">
    ${chrome(copy.pay.buy.eyebrow)}
    <h1>${esc(copy.pay.buy.headline)}</h1>
    <p class="on-body">${esc(copy.pay.buy.body)}</p>
    <div class="on-plans">${copy.pay.buy.plans.map(plan).join("")}</div>
    ${
      state.popularOpen
        ? `<div class="on-plans">${copy.pay.buy.popular.map(plan).join("")}</div>`
        : `<button class="on-quiet" type="button" data-popular>${esc(copy.pay.buy.popularLink)}</button>`
    }
    ${foot(copy.pay.buy.cta, '<button class="on-quiet" type="button" data-free>Continue as a free spectator</button>')}
  </section>`
}

function invite(kind) {
  return `<section class="on-screen">
    ${chrome(copy.invite[kind].eyebrow)}
    <h1>${esc(copy.invite[kind].headline)}</h1>
    <p class="on-body">${esc(copy.invite[kind].body)}</p>
    <p class="on-fine">${esc(copy.invite[kind].hint)}</p>
    ${
      kind === "blocked"
        ? ""
        : `<p class="on-code">${esc(state.code)}</p>
           <button class="on-quiet" type="button" data-copy>${esc(copy.invite.copy)}</button>`
    }
    ${foot(copy.invite.cta)}
  </section>`
}

function identity() {
  return `<section class="on-screen">
    ${chrome(copy.identity.eyebrow)}
    <h1>${state.returning ? "Log in to Humanity" : esc(copy.identity.headline)}</h1>
    <p class="on-body">${esc(copy.identity.body)}</p>
    <div class="humanity-auth" role="group" aria-label="Account method">
      ${copy.identity.methods
        .map(
          (method) =>
            `<button class="${state.auth === method ? "is-on" : ""}" type="button" data-auth="${esc(method)}" aria-pressed="${state.auth === method}"><span aria-hidden="true">${esc(method[0])}</span>${esc(method)}</button>`,
        )
        .join("")}
    </div>
    <p class="on-fine">${state.returning ? "Your live account and permissions will be restored after authentication is connected." : state.access === "free" ? "Spectator access only. Participation stays locked until you activate membership." : "Member access will activate after billing and faction eligibility are verified."}</p>
    ${state.auth ? foot(state.returning ? "Log in" : "Create account") : ""}
  </section>`
}

function complete() {
  const member = state.access === "member"
  if (state.returning) {
    return `<section class="on-screen">
      ${chrome("Humanity On")}
      <div class="humanity-mark humanity-mark--complete">${markSvg}</div>
      <p class="on-eyebrow">Humanity account</p>
      <h1>Welcome back</h1>
      <p class="on-body">The ${esc(state.auth)} login path is ready as a UI placeholder. Live authentication will restore the account, faction, and permissions here.</p>
      <p class="on-fine">This preview does not authenticate you or grant meeting permissions.</p>
      <div class="on-foot">
        <a class="tetra-btn tetra-btn--primary" href="/meet.html">Open meeting preview</a>
        <a class="on-quiet" href="/#demos">Return to all previews</a>
      </div>
    </section>`
  }
  return `<section class="on-screen">
    ${chrome("Humanity On")}
    <div class="humanity-mark humanity-mark--complete">${markSvg}</div>
    <p class="on-eyebrow">FALA · ${member ? "Member" : "Spectator"}</p>
    <h1>${member ? "You may enter the game" : "Your seat in the gallery"}</h1>
    <p class="on-body">${
      member
        ? "Your preview member account is ready. Meeting eligibility, billing, identity, and faction rules still require live integrations."
        : "Your preview spectator account is ready. You can watch meetings; speaking, voting, candidacy, proofs, and rewards remain locked."
    }</p>
    <div class="humanity-summary">
      <p><span>Faction</span><strong>FALA</strong></p>
      <p><span>Access</span><strong>${member ? esc(state.plan.replace("_", " ")) : "Free spectator"}</strong></p>
      <p><span>Account</span><strong>${esc(state.auth)}</strong></p>
    </div>
    ${member && (state.plan === "yearly" || state.plan.startsWith("popular")) ? `<p class="on-deeper-title">${state.plan === "yearly" ? "Lifetime pair preview" : "Circle preview"}</p><p class="on-code">${esc(state.code)}</p>` : ""}
    <p class="on-fine">This onboarding preview does not create an account, charge a payment method, sign a transaction, or grant meeting permissions.</p>
    <div class="on-foot">
      <a class="tetra-btn tetra-btn--primary" href="/meet.html">Open meeting preview</a>
      <a class="on-quiet" href="/#demos">Return to all previews</a>
    </div>
  </section>`
}

function view() {
  if (state.step === "welcome") return welcome()
  if (copy.confirmations.some(({ id }) => id === state.step)) return confirmation(state.step)
  if (state.step === "humanity") return humanity()
  if (state.step === "faction") return faction()
  if (state.step === "alignment") return alignment()
  if (state.step === "token") return token()
  if (state.step === "assembly") return assembly()
  if (state.step === "commitment") return commitment()
  if (state.step === "rating") return rating()
  if (state.step === "reminder") return reminder()
  if (state.step === "access") return access()
  if (state.step === "pay_prime") return prime()
  if (state.step === "pay_remind") return remind()
  if (state.step === "pay_buy") return buy()
  if (state.step === "invite_pair") return invite("pair")
  if (state.step === "invite_circle") return invite("circle")
  if (state.step === "invite_blocked") return invite("blocked")
  if (state.step === "identity") return identity()
  if (state.step === "complete") return complete()
  return welcome()
}

function shell() {
  return `<div class="on-world humanity-world" style="--on-field: url('${templeUrl}')">
    <a class="skip" href="#humanity-notes">Skip to preview notes</a>
    <a class="humanity-return" href="/#demos">Return</a>
    <button class="on-notes-btn" id="humanity-notes" type="button" aria-expanded="false" data-notes-toggle>Notes</button>
    <aside class="on-notes" data-notes-panel hidden>
      <p class="on-kicker">Humanity On · Preview</p>
      <p>Onboarding only. Authentication, billing, entitlements, faction registration, meeting permissions, and on-chain actions are integration TODOs.</p>
      <a class="tetra-btn tetra-btn--primary" href="/#demos">Return to previews</a>
      <button class="tetra-btn tetra-btn--ghost" type="button" data-reset>Reset walk</button>
    </aside>
    <main class="on-phone humanity-phone" data-phone tabindex="-1" aria-live="polite">
      ${progress()}
      ${view()}
      <p class="on-toast" data-toast hidden></p>
    </main>
  </div>`
}

let toastTimer = 0

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

function advance() {
  if (next()) go(next())
  else if (copy.confirmations.some(({ id }) => id === state.step)) toast("Choose the path that is true for you.")
  else if (state.step === "alignment") toast("Confirm each FALA alignment.")
  else if (state.step === "token") toast("Confirm how the token is used.")
  else if (state.step === "commitment") toast("Choose your first action.")
  else if (state.step === "rating") toast("Give the path a signal.")
  else if (state.step === "reminder") toast("Choose whether to receive reminders.")
  else if (state.step === "access") toast("Choose spectator or member access.")
  else if (state.step === "identity") toast("Choose an account method.")
}

function bind(root) {
  root.querySelector("[data-notes-toggle]")?.addEventListener("click", () => {
    root.querySelector("[data-notes-panel]").hidden = !root.querySelector("[data-notes-panel]").hidden
    root
      .querySelector("[data-notes-toggle]")
      .setAttribute("aria-expanded", String(!root.querySelector("[data-notes-panel]").hidden))
  })

  root.querySelector("[data-reset]")?.addEventListener("click", () => {
    sessionStorage.removeItem("humanity-on")
    state = fresh()
    go("welcome")
  })

  root.querySelector("[data-phone]")?.addEventListener("change", (event) => {
    if (!event.target.matches("[data-align]")) return
    const index = Number(event.target.dataset.align)
    state.alignment = event.target.checked
      ? [...new Set([...state.alignment, index])].sort()
      : state.alignment.filter((item) => item !== index)
    save()
    render()
  })

  root.querySelector("[data-phone]")?.addEventListener("click", (event) => {
    if (event.target.closest("[data-back]")) {
      if (previous()) go(previous())
      return
    }
    if (event.target.closest("[data-next]") || event.target.closest("[data-cta]")) {
      advance()
      return
    }
    if (event.target.closest("[data-login]")) {
      state.returning = true
      save()
      go("identity")
      return
    }
    if (event.target.closest("[data-token]")) {
      state.tokenAccepted = true
      save()
      go("assembly")
      return
    }
    const answer = event.target.closest("[data-answer]")
    if (answer) {
      state.answers[state.step] = answer.dataset.answer
      save()
      advance()
      return
    }
    if (event.target.closest("[data-faction]")) {
      state.faction = "FALA"
      save()
      render()
      return
    }
    const commitment = event.target.closest("[data-commit]")
    if (commitment) {
      state.commitment = commitment.dataset.commit
      save()
      render()
      return
    }
    const rating = event.target.closest("[data-rate]")
    if (rating) {
      state.rating = Number(rating.dataset.rate)
      save()
      render()
      return
    }
    const reminder = event.target.closest("[data-reminder]")
    if (reminder) {
      state.reminder = reminder.dataset.reminder
      save()
      go("access")
      return
    }
    const access = event.target.closest("[data-access]")
    if (access) {
      state.returning = false
      state.access = access.dataset.access
      save()
      render()
      return
    }
    if (event.target.closest("[data-free]")) {
      state.returning = false
      state.access = "free"
      save()
      go("identity")
      return
    }
    const selectedPlan = event.target.closest("[data-plan]")
    if (selectedPlan) {
      state.plan = selectedPlan.dataset.plan
      save()
      render()
      return
    }
    if (event.target.closest("[data-popular]")) {
      state.popularOpen = true
      save()
      render()
      return
    }
    const copyCode = event.target.closest("[data-copy]")
    if (copyCode) {
      navigator.clipboard?.writeText(state.code).catch(() => {})
      copyCode.textContent = copy.invite.copied
      return
    }
    const auth = event.target.closest("[data-auth]")
    if (auth) {
      // TODO(auth): replace local selection with Google, Microsoft, and Wharfkit/WebAuth XPR sessions.
      state.auth = auth.dataset.auth
      save()
      render()
    }
  })
}

function render() {
  const mount = document.getElementById("humanity-on")
  const notesOpen = mount.querySelector("[data-notes-panel]")?.hidden === false
  mount.innerHTML = shell()
  if (notesOpen) {
    mount.querySelector("[data-notes-panel]").hidden = false
    mount.querySelector("[data-notes-toggle]").setAttribute("aria-expanded", "true")
  }
  bind(mount)
  mount.querySelector("[data-phone]")?.focus({ preventScroll: true })
}

function applyHash() {
  const step = location.hash.replace(/^#\/?/, "")
  if ([...BASE, ...PAY, ...OUTCOMES, ...END].includes(step)) state.step = step
}

// TODO(billing): connect plans to the shared entitlement service before any charge.
// TODO(entitlements): enforce spectator/member permissions server-side before entering a live room.
applyHash()
if (!location.hash) history.replaceState({ step: state.step }, "", `#/${state.step}`)
render()
window.addEventListener("popstate", () => {
  applyHash()
  render()
})
window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
  if (event.target?.closest?.("input, textarea, summary, [contenteditable='true']")) return
  if (event.key === "ArrowLeft" && previous()) {
    event.preventDefault()
    go(previous())
  } else if (event.key === "ArrowRight") {
    event.preventDefault()
    advance()
  }
})
