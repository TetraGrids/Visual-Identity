import React from "react"
import { SemicircleTimer, formatMmSs } from "./SemicircleTimer.jsx"
import { stageProgress } from "../state/machine.js"

/** Top-left: current stage name + session/landing progress. */
export function StageClock({ state, now }) {
  const { label, left, progress } = stageProgress(state, now)
  return (
    <div className="meet-stage-clock" aria-live="polite">
      <SemicircleTimer progress={progress} label={formatMmSs(left)} size={64} />
      <div className="meet-stage-clock__meta">
        <span className="meet-stage-clock__stage">{label}</span>
        <span className="meet-stage-clock__hint">
          {state.phase === "landing"
            ? "Not part of the hour"
            : state.sessionEndsAt
              ? "Session hour"
              : ""}
        </span>
      </div>
    </div>
  )
}
