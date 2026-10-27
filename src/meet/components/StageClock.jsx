import React from "react"
import { SemicircleTimer, formatMmSs } from "./SemicircleTimer.jsx"
import { PHASES, stageProgress, SLOT_COUNT } from "../state/machine.js"

/** Top-left: current stage name + session/landing progress. Headcount sits beside the time until presentations. */
export function StageClock({ state, now }) {
  const { label, left, progress, ended } = stageProgress(state, now)
  const present = (state.participants || []).filter((p) => !p.watcher).length
  const showCount = state.phase === "landing" || state.phase === "locked"
  const completed = (state.completedGroupIds || []).length
  const groupCount = Math.max(1, state.breakouts?.length || 1)
  const waitingForBreak = state.phase === PHASES.WAITING_BREAK
  const onBreak = state.phase === PHASES.BREAK
  const presentationMinutes = state.timing?.presentationsMs
    ? state.timing.presentationsMs / 60000
    : null
  const consensusMinutes = state.timing?.consensusMs
    ? state.timing.consensusMs / 60000
    : null
  return (
    <div className="meet-stage-clock" aria-live="polite">
      <div className="meet-stage-clock__row">
        {ended ? (
          <span className="meet-stage-clock__party" aria-label="Meeting complete">
            🎉
          </span>
        ) : (
          <SemicircleTimer
            progress={progress}
            label={left == null ? "∞" : formatMmSs(left)}
            size={64}
          />
        )}
        {showCount && (
          <span className="meet-stage-clock__count" aria-label={`${present} of ${SLOT_COUNT} in the meeting`}>
            {present}/{SLOT_COUNT}
          </span>
        )}
        <div className="meet-stage-clock__meta">
          <span className="meet-stage-clock__stage">{label}</span>
          <span className="meet-stage-clock__hint">
            {state.paused
              ? "Paused"
              : state.phase === "landing"
                ? "Not part of the hour"
                : state.phase === PHASES.PRESENTATIONS
                  ? `Round ${state.round}${presentationMinutes ? ` · ${presentationMinutes} min max` : ""}`
                  : state.phase === PHASES.DISCERNMENT || state.phase === PHASES.VERIFY
                    ? consensusMinutes
                      ? `${consensusMinutes} min max`
                      : "Open consensus"
                    : state.phase === PHASES.SHARING
                      ? "Sharing & wrap up"
                      : ended
                        ? "Meeting remains open"
                        : ""}
          </span>
        </div>
      </div>
      {(waitingForBreak || onBreak) && (
        <div className="meet-break-cue">
          <CoffeeIcon />
          <div>
            <strong>{onBreak ? "Break time" : "Break pending"}</strong>
            <span>
              {onBreak
                ? left == null
                  ? ""
                  : formatMmSs(left)
                : `Break will start when all groups have reached consensus · ${completed}/${groupCount}`}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function CoffeeIcon() {
  return (
    <svg className="meet-break-cue__coffee" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 10h17v10a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7V10z" />
      <path d="M23 13h2a4 4 0 0 1 0 8h-3" />
      <path d="M11 7c-2-2 2-3 0-5M17 7c-2-2 2-3 0-5" />
    </svg>
  )
}
