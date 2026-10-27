import React from "react"
import { SemicircleTimer, formatMmSs } from "./SemicircleTimer.jsx"
import { SPEAK_MS, WARN_MS, CUTOFF_MS } from "../state/machine.js"

export function SpeakerRing({ startedAt, endsAt, now, size = 56 }) {
  if (!startedAt) return null
  const end = endsAt || startedAt + CUTOFF_MS
  const remaining = Math.max(0, end - now)
  const progress = remaining / Math.max(1, end - startedAt)
  const warn = remaining <= CUTOFF_MS - WARN_MS && remaining > 0
  const cut = remaining <= 0
  const softLeft = Math.max(0, end - (CUTOFF_MS - SPEAK_MS) - now)

  return (
    <div
      className="meet-ring"
      title={`Soft ${formatMmSs(softLeft)} · hard ${formatMmSs(remaining)}`}
      aria-label={`${formatMmSs(remaining)} remaining`}
    >
      <SemicircleTimer progress={progress} warn={warn} cut={cut} size={size} />
    </div>
  )
}
