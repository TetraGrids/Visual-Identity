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
 * One orb per candidate. Loose gravity toward a slowly revolving platonic solid.
 * They collide, bounce, and stay in the cluster at the top of the room.
 */
export function VoteOrbs({ orbs }) {
  const field = React.useRef(null)
  const view = React.useRef(orbs)
  view.current = orbs

  React.useEffect(() => {
    const bodies = new Map()
    let frame = 0
    const step = (t) => {
      const el = field.current
      const people = view.current || []
      if (!el || !people.length) {
        frame = requestAnimationFrame(step)
        return
      }
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      const angle = t * 0.00018
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const verts = platonic(people.length)
      const spread = Math.min(w * 0.2, h * 0.36)
      const cx = w / 2
      const cy = h * 0.52
      const live = new Set(people.map((p) => p.id))
      for (const id of bodies.keys()) {
        if (!live.has(id)) bodies.delete(id)
      }
      people.forEach((p, i) => {
        const v = verts[i] || [0, 0, 0]
        const x = v[0] * cos + v[2] * sin
        const z = -v[0] * sin + v[2] * cos
        const tx = cx + x * spread
        const ty = cy + v[1] * spread * 0.42
        let b = bodies.get(p.id)
        if (!b) {
          b = { x: tx, y: ty, vx: (i - people.length / 2) * 0.4, vy: 0, r: p.r, z }
          bodies.set(p.id, b)
        }
        b.r = p.r
        b.z = z
        b.vx = (b.vx + (tx - b.x) * 0.012) * 0.992
        b.vy = (b.vy + (ty - b.y) * 0.012) * 0.992
        b.x += b.vx
        b.y += b.vy
      })
      const list = people.map((p) => bodies.get(p.id)).filter(Boolean)
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i]
          const b = list[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d = Math.hypot(dx, dy) || 0.01
          const min = a.r + b.r + 6
          if (d >= min) continue
          const nx = dx / d
          const ny = dy / d
          const overlap = min - d
          a.x -= nx * overlap * 0.5
          a.y -= ny * overlap * 0.5
          b.x += nx * overlap * 0.5
          b.y += ny * overlap * 0.5
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
          if (rel < 0) {
            const push = rel * 0.82
            a.vx += push * nx
            a.vy += push * ny
            b.vx -= push * nx
            b.vy -= push * ny
          }
        }
      }
      for (const b of list) {
        const pad = b.r + 2
        if (b.x < pad) {
          b.x = pad
          b.vx = Math.abs(b.vx) * 0.7
        } else if (b.x > w - pad) {
          b.x = w - pad
          b.vx = -Math.abs(b.vx) * 0.7
        }
        if (b.y < pad) {
          b.y = pad
          b.vy = Math.abs(b.vy) * 0.7
        } else if (b.y > h - pad) {
          b.y = h - pad
          b.vy = -Math.abs(b.vy) * 0.7
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
    return () => cancelAnimationFrame(frame)
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
