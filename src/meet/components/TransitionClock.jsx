import React from "react"

export function TransitionClock({ endsAt, now }) {
  if (!endsAt) return null
  const left = Math.max(0, Math.ceil((endsAt - now) / 1000))
  return (
    <div className="meet-overlay" aria-live="polite">
      <div className="meet-transition">{left}</div>
      <p className="meet-note">All unmuted · next speaker</p>
    </div>
  )
}
