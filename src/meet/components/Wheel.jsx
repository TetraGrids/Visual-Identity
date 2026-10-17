import React from "react"

/**
 * Circular heads-up display.
 * Speaker at top (larger). Others around the ring.
 * Drag/click own circle to request next — requesters cluster at next-up slot
 * (first largest, others 61.8%).
 */
export function Wheel({
  participants,
  speakerId,
  queue,
  requests = [],
  localId,
  onRequestNext,
  onPickNext,
  speakerStartedAt,
  now,
  SpeakerRing,
}) {
  const byId = React.useMemo(() => {
    const m = new Map()
    for (const p of participants) m.set(p.id, p)
    return m
  }, [participants])

  const order = React.useMemo(() => {
    const ids = participants.map((p) => p.id)
    if (!speakerId) return ids
    const rest = ids.filter((id) => id !== speakerId)
    const q = queue.filter((id) => rest.includes(id))
    const unqueued = rest.filter((id) => !queue.includes(id))
    return [speakerId, ...q, ...unqueued]
  }, [participants, speakerId, queue])

  const n = Math.max(order.length, 1)

  const nodes = order.map((id, i) => {
    const isSpeaker = id === speakerId
    const reqIndex = requests.indexOf(id)
    const inRequestCluster = !isSpeaker && reqIndex >= 0

    // Speaker sits at top of the ring (larger); others spaced clockwise.
    const ring = 38
    let angle = -Math.PI / 2
    let radius = ring
    let scale = 1

    if (isSpeaker) {
      angle = -Math.PI / 2
      radius = ring
      scale = 1.35
    } else if (inRequestCluster) {
      // next-up slot: to the right of speaker
      const base = -Math.PI / 2 + (2 * Math.PI) / Math.max(n, 2)
      if (reqIndex === 0) {
        angle = base
        radius = ring
        scale = 1
      } else {
        const fan = (reqIndex - 1) * 0.28 - 0.14
        angle = base + fan
        radius = ring - 4
        scale = 0.618
      }
    } else {
      const step = (2 * Math.PI) / n
      angle = -Math.PI / 2 + i * step
      radius = ring
    }

    const x = 50 + radius * Math.cos(angle)
    const y = 50 + radius * Math.sin(angle)
    const p = byId.get(id)
    return { id, p, x, y, isSpeaker, scale, reqIndex, inRequestCluster }
  })

  function onDragEnd(id, ev) {
    if (id !== localId) return
    const rect = ev.currentTarget.parentElement.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height * 0.2
    if (Math.hypot(ev.clientX - cx, ev.clientY - cy) < rect.width * 0.35) {
      onRequestNext?.(id)
    }
  }

  return (
    <div className="meet-wheel" role="list" aria-label="Participants">
      {nodes.map(({ id, p, x, y, isSpeaker, scale, reqIndex, inRequestCluster }) => (
        <button
          key={id}
          type="button"
          role="listitem"
          className={[
            "meet-wheel__node",
            isSpeaker ? "is-speaker" : "",
            inRequestCluster ? "is-queue" : "",
            id === localId ? "is-local" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `scale(${scale})`,
            zIndex: isSpeaker ? 3 : inRequestCluster ? 2 : 1,
          }}
          draggable={id === localId}
          onDragEnd={(e) => onDragEnd(id, e)}
          onClick={() => {
            if (speakerId === localId && inRequestCluster && reqIndex >= 0) {
              onPickNext?.(id)
            } else if (id === localId && !isSpeaker) {
              onRequestNext?.(id)
            }
          }}
          title={
            isSpeaker
              ? `${p?.name} speaking`
              : inRequestCluster
                ? `${p?.name} wants next (#${reqIndex + 1})`
                : p?.name
          }
        >
          {isSpeaker && SpeakerRing ? <SpeakerRing startedAt={speakerStartedAt} now={now} /> : null}
          <span className="meet-wheel__face">
            {p?.avatarUrl ? <img src={p.avatarUrl} alt="" /> : p?.letter || "?"}
          </span>
          <span className="meet-wheel__label">{p?.name}</span>
        </button>
      ))}
    </div>
  )
}
