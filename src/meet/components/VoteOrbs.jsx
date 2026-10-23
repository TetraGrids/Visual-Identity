import React from "react"

/** Vertices of the platonic solid that can hold this many people. */
function platonic(count) {
  const phi = (1 + Math.sqrt(5)) / 2
  const tetra = [
    [1, 1, 1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
  ]
  const octa = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ]
  const cube = []
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) cube.push([x, y, z])
    }
  }
  const icosa = []
  for (const s of [-1, 1]) {
    for (const t of [-1, 1]) {
      icosa.push([0, s, t * phi])
      icosa.push([s, t * phi, 0])
      icosa.push([t * phi, 0, s])
    }
  }
  const bank = count <= 4 ? tetra : count <= 6 ? octa : count <= 8 ? cube : icosa
  return bank.slice(0, Math.max(count, 1)).map((v) => {
    const m = Math.hypot(v[0], v[1], v[2]) || 1
    return [v[0] / m, v[1] / m, v[2] / m]
  })
}

/**
 * One orb per candidate. They rest on a platonic solid in rank order.
 * A rank change carries them to the new seat. The cursor bumps them
 * with the same size and mass as the largest orb.
 */
export function VoteOrbs({ orbs }) {
  const field = React.useRef(null)
  const view = React.useRef(orbs)
  view.current = orbs

  React.useEffect(() => {
    const bodies = new Map()
    let frame = 0
    let aimX = 0
    let aimY = 0
    let prevX = 0
    let prevY = 0
    let seen = false
    const move = (e) => {
      const el = field.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      aimX = e.clientX - rect.left
      aimY = e.clientY - rect.top
      if (!seen) {
        prevX = aimX
        prevY = aimY
      }
      seen = true
    }
    window.addEventListener("pointermove", move)
    const step = () => {
      const el = field.current
      const people = view.current || []
      if (!el || !people.length) {
        frame = requestAnimationFrame(step)
        return
      }
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      const verts = platonic(people.length)
      let maxR = 1
      for (const p of people) if (p.r > maxR) maxR = p.r
      const sx = Math.min(w * 0.2, 240)
      const sy = Math.max(18, Math.min(h * 0.46, h / 2 - maxR - 6))
      const cx = w / 2
      const cy = h / 2
      const slots = [...people].sort(
        (a, b) => (a.place || 99) - (b.place || 99) || (b.points || 0) - (a.points || 0),
      )
      const cvx = seen ? aimX - prevX : 0
      const cvy = seen ? aimY - prevY : 0
      prevX = aimX
      prevY = aimY
      const live = new Set(people.map((p) => p.id))
      for (const id of bodies.keys()) {
        if (!live.has(id)) bodies.delete(id)
      }
      people.forEach((p) => {
        const v = verts[slots.findIndex((s) => s.id === p.id)] || [0, 0, 0]
        const pad = p.r + 2
        const x = v[0] * 0.9 + v[2] * 0.42
        const tx = Math.min(w - pad, Math.max(pad, cx + x * sx))
        const ty = Math.min(h - pad, Math.max(pad, cy + v[1] * sy))
        let b = bodies.get(p.id)
        if (!b) {
          b = { x: tx, y: ty, vx: 0, vy: 0, r: p.r, z: v[2] }
          bodies.set(p.id, b)
        }
        b.r = p.r
        b.z = v[2]
        const home = (tx - b.x) * (tx - b.x) + (ty - b.y) * (ty - b.y)
        const reach = b.r + maxR + 4
        const under = seen && (b.x - aimX) * (b.x - aimX) + (b.y - aimY) * (b.y - aimY) < reach * reach
        if (!under) {
          b.vx *= 0.72
          b.vy *= 0.72
          b.x += (tx - b.x) * 0.16 + b.vx
          b.y += (ty - b.y) * 0.16 + b.vy
          if (home < 0.64 && b.vx * b.vx + b.vy * b.vy < 0.16) {
            b.x = tx
            b.y = ty
            b.vx = 0
            b.vy = 0
          }
        } else {
          b.vx *= 0.86
          b.vy *= 0.86
          b.x += b.vx
          b.y += b.vy
        }
      })
      const list = people.map((p) => bodies.get(p.id)).filter(Boolean)
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i]
          const b = list[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d = Math.hypot(dx, dy) || 0.01
          const min = a.r + b.r + 4
          if (d >= min) continue
          const nx = dx / d
          const ny = dy / d
          const overlap = min - d
          const ma = a.r * a.r || 1
          const mb = b.r * b.r || 1
          a.x -= nx * overlap * (mb / (ma + mb))
          a.y -= ny * overlap * (mb / (ma + mb))
          b.x += nx * overlap * (ma / (ma + mb))
          b.y += ny * overlap * (ma / (ma + mb))
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
          if (rel < 0) {
            const j = -(1 + (rel < -0.8 ? 0.35 : 0)) * rel / (1 / ma + 1 / mb)
            a.vx -= (j / ma) * nx
            a.vy -= (j / ma) * ny
            b.vx += (j / mb) * nx
            b.vy += (j / mb) * ny
          }
        }
      }
      if (seen) {
        const mb = maxR * maxR
        for (const a of list) {
          const dx = a.x - aimX
          const dy = a.y - aimY
          const d = Math.hypot(dx, dy) || 0.01
          const reach = a.r + maxR + 4
          if (d >= reach) continue
          const nx = dx / d
          const ny = dy / d
          const overlap = reach - d
          const ma = a.r * a.r || 1
          const share = mb / (ma + mb)
          a.x += nx * overlap * share
          a.y += ny * overlap * share
          const rel = (a.vx - cvx) * nx + (a.vy - cvy) * ny
          if (rel < 0) {
            const j = -(1 + (rel < -0.8 ? 0.35 : 0)) * rel / (1 / ma + 1 / mb)
            a.vx += (j / ma) * nx
            a.vy += (j / ma) * ny
          }
        }
      }
      for (const b of list) {
        const pad = b.r + 2
        if (b.x < pad) {
          b.x = pad
          if (b.vx < 0) b.vx = 0
        } else if (b.x > w - pad) {
          b.x = w - pad
          if (b.vx > 0) b.vx = 0
        }
        if (b.y < pad) {
          b.y = pad
          if (b.vy < 0) b.vy = 0
        } else if (b.y > h - pad) {
          b.y = h - pad
          if (b.vy > 0) b.vy = 0
        }
      }
      for (const node of el.querySelectorAll("[data-id]")) {
        const b = bodies.get(node.getAttribute("data-id"))
        if (!b) continue
        node.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`
        node.style.opacity = "1"
        node.style.zIndex = String(10 + Math.round((b.z + 1) * 10))
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", move)
    }
  }, [])

  return (
    <div className="meet-vote-field" ref={field} aria-hidden="true">
      {orbs.map((o) => (
        <div
          key={o.id}
          data-id={o.id}
          className={[
            "meet-orb",
            o.place ? `meet-orb--${o.place}` : "",
            o.held ? "is-held" : "",
            o.lock > 0 ? "is-lock" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            width: o.r * 2,
            height: o.r * 2,
            "--frac": o.lock,
          }}
        >
          <span className="meet-orb__face" />
          {o.held && <span className="meet-orb__name">{o.name}</span>}
        </div>
      ))}
    </div>
  )
}
