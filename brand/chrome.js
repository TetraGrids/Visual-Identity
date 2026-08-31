const ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.35" stroke-linejoin="miter"><polygon points="16,3 3,27.5 29,27.5"/><polygon points="9.5,15.25 16,27.5 22.5,15.25"/><line x1="16" y1="19.17" x2="16" y2="3"/><line x1="16" y1="19.17" x2="3" y2="27.5"/><line x1="16" y1="19.17" x2="29" y2="27.5"/></g><circle cx="16" cy="19.17" r="1.15" fill="currentColor"/></svg>`

const WORD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 37" fill="currentColor" aria-hidden="true"><polygon points="15.5,8.7 24.7,8.7 24.7,36.6 31.7,36.6 31.7,8.7 40.9,8.7 40.9,2.4 15.5,2.4"/><polygon points="51.7,2.4 47.2,2.4 47.2,36.6 51.7,36.6 53.9,36.6 68.9,36.6 68.9,30.7 53.9,30.7 53.9,21.4 68,21.4 68,15.5 53.9,15.5 53.9,8.3 68.9,8.3 68.9,2.4 53.9,2.4"/><polygon points="75.2,8.7 84.4,8.7 84.4,36.6 91.4,36.6 91.4,8.7 100.6,8.7 100.6,2.4 75.2,2.4"/><path d="M125.3,22.8c1.9-0.9,3.3-2.2,4.3-3.8c1-1.6,1.5-3.5,1.5-5.7c0-2.2-0.5-4.1-1.5-5.7c-1-1.6-2.5-2.9-4.3-3.8c-1.9-0.9-4.2-1.4-6.9-1.4h-4.5h-2.7h-4.3v34.2h7V24.2h3l8,12.4h8.3l-9.3-13.2C124.4,23.2,124.9,23,125.3,22.8z M113.9,8.4h4.1c1.2,0,2.3,0.2,3.2,0.6c0.9,0.4,1.6,1,2.1,1.8c0.5,0.8,0.7,1.7,0.7,2.8c0,1.1-0.2,2-0.7,2.8c-0.5,0.8-1.2,1.4-2.1,1.8c-0.9,0.4-2,0.6-3.2,0.6h-4.1V8.4z"/><path d="M163.6,36.6h7.9L154.1,0.4l-17.4,36.2h7.9l3.6-7.8H160L163.6,36.6z M158.4,23.3h-8.5l4.3-9.8L158.4,23.3z"/></svg>`

function el(html) {
  const t = document.createElement("template")
  t.innerHTML = html.trim()
  return t.content.firstElementChild
}

function atTop() {
  return window.scrollY < 12
}

function atBottom() {
  const slack = 48
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - slack
}

export function mountTetraChrome({
  root = document.body,
  home = "/",
  nav = [],
  footer = [],
  blurb = "Proof of attention",
} = {}) {
  const top = el(`
    <button class="tetra-top" type="button" aria-label="Tetra navigation" aria-expanded="true" data-tetra-top>
      <span class="tetra-top__mark">${ICON}</span>
      <nav class="tetra-top__nav"></nav>
    </button>
  `)
  const navEl = top.querySelector(".tetra-top__nav")
  for (const item of nav) {
    const a = document.createElement("a")
    a.href = item.href
    a.textContent = item.label
    a.addEventListener("click", (e) => e.stopPropagation())
    navEl.append(a)
  }

  const dock = el(`
    <button class="tetra-dock" type="button" aria-label="Open footer" aria-expanded="false" data-tetra-dock>
      <span class="tetra-dock__icon">${ICON}</span>
    </button>
  `)

  const foot = el(`
    <footer class="tetra-footer" data-tetra-footer>
      <div class="tetra-footer__brand">
        <a class="tetra-footer__word" href="${home}" aria-label="Tetra home">${WORD}</a>
        <span>${blurb}</span>
      </div>
      <nav class="tetra-footer__links"></nav>
    </footer>
  `)
  const links = foot.querySelector(".tetra-footer__links")
  for (const item of footer) {
    const a = document.createElement("a")
    a.href = item.href
    a.textContent = item.label
    if (item.href.startsWith("http")) {
      a.target = "_blank"
      a.rel = "noreferrer"
    }
    links.append(a)
  }

  root.prepend(top)
  root.append(dock, foot)

  let pinnedOpen = false
  let footerPinned = false

  const setTop = (expanded) => {
    top.classList.toggle("is-tri", !expanded)
    top.setAttribute("aria-expanded", String(expanded))
    top.setAttribute("aria-label", expanded ? "Tetra navigation" : "Expand navigation")
  }

  const setFooter = (open) => {
    foot.classList.toggle("is-open", open)
    dock.setAttribute("aria-expanded", String(open))
    dock.setAttribute("aria-label", open ? "Close footer" : "Open footer")
  }

  const sync = () => {
    if (atTop()) {
      pinnedOpen = false
      setTop(true)
    } else if (!pinnedOpen) {
      setTop(false)
    }

    if (atBottom()) {
      setFooter(true)
    } else if (!footerPinned) {
      setFooter(false)
    }
  }

  top.addEventListener("click", () => {
    if (top.classList.contains("is-tri")) {
      pinnedOpen = true
      setTop(true)
    } else if (!atTop()) {
      pinnedOpen = false
      setTop(false)
    }
  })

  dock.addEventListener("click", () => {
    if (foot.classList.contains("is-open") && !atBottom()) {
      footerPinned = false
      setFooter(false)
    } else {
      footerPinned = true
      setFooter(true)
    }
  })

  window.addEventListener("scroll", sync, { passive: true })
  window.addEventListener("resize", sync)
  sync()

  return { top, dock, foot, sync }
}
