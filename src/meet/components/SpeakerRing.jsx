import React from "react"
import { SemicircleTimer, formatMmSs } from "./SemicircleTimer.jsx"
import { SPEAK_MS, WARN_MS, CUTOFF_MS } from "../state/machine.js"

export function SpeakerRing({ startedAt, now }) {
  if (!startedAt) return null
  const elapsed = now - startedAt
  const remaining = Math.max(0, CUTOFF_MS - elapsed)
  const progress = remaining / CUTOFF_MS
  const warn = elapsed >= WARN_MS
  const cut = elapsed >= CUTOFF_MS
  // Soft target marker: speak window is SPEAK_MS
  const softLeft = Math.max(0, SPEAK_MS - elapsed)

  return (
    <div
      className="meet-ring"
      title={`Soft ${formatMmSs(softLeft)} · hard ${formatMmSs(remaining)}`}
      aria-label={`${formatMmSs(remaining)} remaining`}
    >
      <SemicircleTimer progress={progress} warn={warn} cut={cut} size={116} />
    </div>
  )
}
