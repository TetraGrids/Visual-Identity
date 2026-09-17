export function bindUi(root = document) {
  root.querySelectorAll("[data-acc]").forEach((acc) => {
    acc.querySelectorAll(":scope > .acc__item > button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.parentElement
        const open = item.classList.contains("is-open")
        acc.querySelectorAll(":scope > .acc__item").forEach((node) => {
          node.classList.remove("is-open")
          node.querySelector("button")?.setAttribute("aria-expanded", "false")
        })
        if (!open) {
          item.classList.add("is-open")
          btn.setAttribute("aria-expanded", "true")
        }
      })
    })
  })

  root.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = [...tabs.querySelectorAll(":scope > button")]
    const panels = [...tabs.parentElement.querySelectorAll(":scope > [data-tab]")]
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((node) => {
          node.classList.toggle("is-on", node === btn)
          node.setAttribute("aria-selected", node === btn ? "true" : "false")
        })
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.tab !== btn.dataset.tab
        })
      })
    })
  })

  root.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => openDialog(btn.dataset.open, btn))
  })

  root.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => btn.closest("dialog")?.close())
  })

  root.querySelectorAll("dialog.modal").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close()
    })
  })

  root.querySelectorAll("[data-local-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault()
      const next = form.dataset.open
      if (next) {
        openDialog(next, form)
        return
      }
      const done = form.querySelector("[data-done]")
      if (done) done.hidden = false
    })
  })

  root.querySelectorAll("[data-pipe]").forEach((pipe) => {
    const buttons = [...pipe.querySelectorAll("[data-step]")]
    const panels = [...pipe.querySelectorAll("[data-panel]")]
    const show = (id) => {
      buttons.forEach((btn) => {
        const on = btn.dataset.step === id
        btn.classList.toggle("is-on", on)
        btn.setAttribute("aria-selected", on ? "true" : "false")
      })
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== id
      })
    }
    let index = 0
    buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        index = i
        show(btn.dataset.step)
      })
    })
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduce && buttons.length > 1) {
      const timer = window.setInterval(() => {
        if (pipe.matches(":hover") || pipe.contains(document.activeElement)) return
        index = (index + 1) % buttons.length
        show(buttons[index].dataset.step)
      }, 4200)
      pipe.dataset.timer = String(timer)
    }
  })

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']")
    if (!link) return
    const id = link.getAttribute("href").slice(1)
    const dialog = document.getElementById(id)
    if (!dialog || dialog.tagName !== "DIALOG") return
    event.preventDefault()
    dialog.showModal()
  })
}

function openDialog(id, source) {
  const dialog = document.getElementById(id)
  if (!dialog) return
  const email = source?.querySelector?.("input[type='email']")?.value
  const target = dialog.querySelector("input[type='email']")
  if (email && target) target.value = email
  if (source?.dataset?.tab) {
    const tab = dialog.querySelector(`[data-tabs] [data-tab='${source.dataset.tab}']`)
    tab?.click()
  }
  dialog.showModal()
}

export function mountClock(node) {
  if (!node) return
  const start = Date.now()
  const tick = () => {
    const elapsed = Math.floor((Date.now() - start) / 1000)
    const m = String(Math.floor(elapsed / 60)).padStart(2, "0")
    const s = String(elapsed % 60).padStart(2, "0")
    node.textContent = `${m}:${s}`
  }
  tick()
  window.setInterval(tick, 1000)
}

export function mountSpots(node, start = 9) {
  if (!node) return
  let n = start
  const paint = () => {
    node.textContent = String(n)
  }
  paint()
  window.setInterval(() => {
    if (n > 3) n -= 1
    paint()
  }, 8000)
}
