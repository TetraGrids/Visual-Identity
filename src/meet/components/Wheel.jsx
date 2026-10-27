import React from "react"
import { SLOT_COUNT, slotAngle } from "../state/machine.js"
import { SpeakerRing } from "./SpeakerRing.jsx"
import { MuteMark, StreamVideo } from "./FocusStage.jsx"

const RX = 36 // % of width — keeps the eight slots apart
const RY = 26 // % of height — spreads the bottom slots clear of the speaker ring

function slotXY(slotIndex) {
  const a = slotAngle(slotIndex)
  return {
    x: 50 + RX * Math.cos(a),
    y: 50 + RY * Math.sin(a),
  }
}

/**
 * Small bottom overlay wheel (max 20% viewport height, min 100px).
 * 8 fixed slots from top-center clockwise — not redistributed when fewer people.
 * Drag local icon: dashed guides appear; drop on slot 0 = claim active/next;
 * drop on another slot = swap; release elsewhere = snap back.
 */
export function Wheel({
  slots = [],
  participants = [],
  speakerId,
  localId,
  localStream,
  muted = false,
  mutedIds = [],
  loud = false,
  speakerStartedAt,
  speakEndsAt,
  now,
  onClaimActive,
  onMoveSlot,
}) {
  const byId = React.useMemo(() => {
    const m = new Map()
    for (const p of participants) m.set(p.id, p)
    return m
  }, [participants])

  const [draggingId, setDraggingId] = React.useState(null)
  const [dragPos, setDragPos] = React.useState(null) // {x%, y%} relative to wheel
  const wheelRef = React.useRef(null)
  const originSlot = React.useRef(-1)

  const filled = slots.map((id, i) => ({ id, i, ...slotXY(i) }))

  function clientToPercent(clientX, clientY) {
    const rect = wheelRef.current.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    }
  }

  function nearestSlot(x, y) {
    let best = -1
    let bestDist = Infinity
    for (let i = 0; i < SLOT_COUNT; i++) {
      const { x: sx, y: sy } = slotXY(i)
      const d = Math.hypot(x - sx, y - sy)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    }
    // accept only if close enough (~18% of overlay)
    return bestDist < 18 ? best : -1
  }

  function onPointerDown(id, slotIndex, e) {
    if (id !== localId) return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    originSlot.current = slotIndex
    setDraggingId(id)
    setDragPos(clientToPercent(e.clientX, e.clientY))
  }

  function onPointerMove(e) {
    if (!draggingId) return
    setDragPos(clientToPercent(e.clientX, e.clientY))
  }

  function onPointerUp(e) {
    if (!draggingId) return
    const pos = clientToPercent(e.clientX, e.clientY)
    const target = nearestSlot(pos.x, pos.y)
    const id = draggingId
    setDraggingId(null)
    setDragPos(null)
    if (target < 0) return // snap back (no state change)
    if (target === 0) {
      onClaimActive?.(id)
      return
    }
    if (target !== originSlot.current) {
      onMoveSlot?.(id, target)
    }
  }

  return (
    <div
      className={`meet-wheel${draggingId ? " is-dragging" : ""}`}
      ref={wheelRef}
      role="list"
      aria-label="Speak order — 8 slots"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Always-reserved 8 slot guides; stronger when dragging */}
      {Array.from({ length: SLOT_COUNT }, (_, i) => {
        const { x, y } = slotXY(i)
        return (
          <div
            key={`guide-${i}`}
            className={`meet-wheel__guide${i === 0 ? " is-active" : ""}${draggingId ? " is-visible" : ""}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-hidden="true"
          />
        )
      })}

      {filled.map(({ id, i, x, y }) => {
        if (!id) return null
        const p = byId.get(id)
        const isSpeaker = id === speakerId || i === 0
        const isDragging = draggingId === id
        const left = isDragging && dragPos ? dragPos.x : x
        const top = isDragging && dragPos ? dragPos.y : y
        return (
          <button
            key={id}
            type="button"
            role="listitem"
            className={[
              "meet-wheel__node",
              isSpeaker ? "is-speaker" : "",
              id === localId ? "is-local" : "",
              isDragging ? "is-dragging" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ left: `${left}%`, top: `${top}%`, zIndex: isDragging ? 5 : isSpeaker ? 3 : 1 }}
            onPointerDown={(e) => onPointerDown(id, i, e)}
            title={
              i === 0
                ? `${p?.name} — active (drag here to go first)`
                : `${p?.name} — slot ${i + 1}`
            }
          >
            {isSpeaker && speakerStartedAt ? (
              <SpeakerRing startedAt={speakerStartedAt} endsAt={speakEndsAt} now={now} />
            ) : null}
            <span className="meet-wheel__face">
              {id === localId && localStream ? (
                <StreamVideo stream={localStream} />
              ) : p?.avatarUrl ? (
                <img src={p.avatarUrl} alt="" draggable={false} />
              ) : (
                p?.letter || ""
              )}
            </span>
            {p?.host ? (
              <span className="meet-host" title="Host">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="8" y="1" width="8" height="12" rx="4" fill="currentColor" />
                  <path d="M9.2 4.2h5.6M9.2 6.8h5.6M9.2 9.4h5.6" stroke="#050705" strokeWidth="1.1" />
                  <path d="M12 13v3.2M8 19.5h8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
            ) : null}
            {(id === localId && muted) || (mutedIds || []).includes(id) ? (
              <MuteMark big={id === localId && loud} />
            ) : null}
            <span className="meet-wheel__label">{p?.name}</span>
          </button>
        )
      })}
    </div>
  )
}
