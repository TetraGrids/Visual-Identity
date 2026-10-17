/**
 * Room shell — starts from LiveKit VideoConference wiring when connected;
 * custom Wheel HUD for speaker order, timers, consensus.
 * Bottom-left triangle toggles the LiveKit control bar.
 */
import React from "react"
import { navigate } from "../router.js"
import { getMeeting, loadSession, loadProfile, pushHistory, clearSession } from "../state/store.js"
import {
  PHASES,
  FORMAT_META,
  createInitialMeetingState,
  reduceMeeting,
  CUTOFF_MS,
  WARN_MS,
} from "../state/machine.js"
import { makeDemoParticipants, makeManyForBreakout } from "../state/demoParticipants.js"
import { hasTokenServer } from "../lib/token.js"
import { VideoConferenceClient } from "../lib/VideoConferenceClient.jsx"
import { Wheel } from "../components/Wheel.jsx"
import { SpeakerRing } from "../components/SpeakerRing.jsx"
import { SemicircleTimer, formatMmSs } from "../components/SemicircleTimer.jsx"
import { DoneButton } from "../components/DoneButton.jsx"
import { TransitionClock } from "../components/TransitionClock.jsx"
import { NotificationStack } from "../components/NotificationStack.jsx"
import { RightPanel } from "../components/RightPanel.jsx"
import { ConsensusVote } from "../components/ConsensusVote.jsx"

export function Room({ meetingId }) {
  const meeting = getMeeting(meetingId)
  const session = loadSession()
  const profile = loadProfile()
  const [barHidden, setBarHidden] = React.useState(false)
  const [panelOpen, setPanelOpen] = React.useState(false)
  const [chatLog, setChatLog] = React.useState([])
  const [now, setNow] = React.useState(Date.now())
  const demo = session?.demo ?? !hasTokenServer()
  const localName = session?.userChoices?.username || profile.name || "You"

  const [state, dispatch] = React.useReducer(reduceMeeting, null, () => {
    const participants = makeDemoParticipants(5, localName)
    if (session?.proofs?.imageData) {
      const localP = participants.find((p) => p.isLocal)
      if (localP) {
        localP.avatarUrl = session.proofs.imageData
        localP.letter = localName.charAt(0).toUpperCase()
      }
    }
    if (session?.mode === "watch") {
      participants.forEach((p) => {
        if (p.isLocal) p.watcher = true
      })
    }
    return createInitialMeetingState({
      format: meeting?.format || "election",
      participants,
      now: Date.now(),
    })
  })

  // Demo: shorten landing to 8s so the run-through is usable
  React.useEffect(() => {
    if (state.phase === PHASES.LANDING) {
      dispatch({
        type: "FORCE_PHASE",
        phase: PHASES.LANDING,
      })
    }
  }, [])

  React.useEffect(() => {
    // Accelerate landing for demo UX
    if (demo && state.phase === PHASES.LANDING) {
      const t = setTimeout(() => dispatch({ type: "FORCE_PHASE", phase: PHASES.READY }), 8000)
      return () => clearTimeout(t)
    }
  }, [demo, state.phase])

  React.useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      dispatch({ type: "TICK", now: t })
    }, 200)
    return () => clearInterval(id)
  }, [])

  React.useEffect(() => {
    if (!session || session.meetingId !== meetingId) {
      // allow demo entry without session from lobby active card
      if (!meeting) navigate("/lobby")
    }
  }, [session, meetingId, meeting])

  if (!meeting) {
    return (
      <div className="meet-room">
        <p style={{ padding: 24 }}>Meeting missing.</p>
      </div>
    )
  }

  const local = state.participants.find((p) => p.isLocal)
  const groupIds = state.breakouts?.[state.activeGroupIndex] || state.participants.map((p) => p.id)
  const groupParticipants = state.participants.filter((p) => groupIds.includes(p.id))

  const speakElapsed = state.speakerStartedAt ? now - state.speakerStartedAt : 0
  const speakLeft = Math.max(0, CUTOFF_MS - speakElapsed)
  const speakProgress = speakLeft / CUTOFF_MS
  const speakWarn = speakElapsed >= WARN_MS

  function leave() {
    clearSession()
    navigate("/lobby")
  }

  function finishHistory(failed, positions) {
    pushHistory({
      meetingId: meeting.id,
      meetingName: meeting.name,
      format: meeting.format,
      failed,
      positions,
      proofs: session?.proofs || null,
    })
  }

  function onChat(text) {
    const id = `c-${Date.now()}`
    setChatLog((prev) => [...prev, { id, from: localName, text }])
    dispatch({ type: "NOTIFY", id, text: `${localName}: ${text}`, now: Date.now() })
  }

  const showLiveKit =
    !demo && session?.connection?.serverUrl && session?.connection?.participantToken

  return (
    <div className="meet-room" data-bar-hidden={barHidden ? "true" : "false"}>
      <div className="meet-room__stage">
        {showLiveKit ? (
          <div style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }}>
            <VideoConferenceClient
              liveKitUrl={session.connection.serverUrl}
              token={session.connection.participantToken}
              videoEnabled={session.userChoices?.videoEnabled !== false && session.mode !== "watch"}
              audioEnabled={session.userChoices?.audioEnabled !== false && session.mode !== "watch"}
              onLeave={leave}
            />
          </div>
        ) : null}

        <div className="meet-room__hud">
          <div className="meet-timer-tr">
            {state.phase === PHASES.WHEEL && state.speakerStartedAt ? (
              <SemicircleTimer
                progress={speakProgress}
                warn={speakWarn}
                label={formatMmSs(speakLeft)}
                size={72}
              />
            ) : (
              <SemicircleTimer progress={1} label={FORMAT_META[state.format]?.label || "Meet"} size={72} />
            )}
          </div>

          <NotificationStack
            items={state.notifications}
            onExpire={(id) => dispatch({ type: "CLEAR_NOTIFY", id, now: Date.now() })}
          />

          {(state.phase === PHASES.LANDING || state.phase === PHASES.READY) && (
            <div className="meet-overlay meet-landing">
              <h2>{meeting.name}</h2>
              <p>
                {state.phase === PHASES.LANDING
                  ? demo
                    ? "Landing (demo: 8s) — then everyone starts"
                    : "Landing — 10 minutes before breakouts"
                  : "Everyone click Start when ready"}
              </p>
              <p className="meet-note">
                {state.participants.filter((p) => p.ready && !p.watcher).length}/
                {state.participants.filter((p) => !p.watcher).length} ready · format{" "}
                {FORMAT_META[state.format]?.label}
              </p>
              <div className="meet-actions">
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => dispatch({ type: "READY", participantId: local?.id, now: Date.now() })}
                  disabled={local?.ready || local?.watcher}
                >
                  {local?.ready ? "Waiting…" : "Start"}
                </button>
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => dispatch({ type: "START_ALL_DEMO", now: Date.now() })}
                >
                  Demo: all start
                </button>
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => {
                    const participants = makeManyForBreakout(localName)
                    dispatch({
                      type: "RESEED",
                      participants,
                      format: meeting?.format || "election",
                      now: Date.now(),
                    })
                    dispatch({
                      type: "NOTIFY",
                      text: `Reseeded with ${participants.length} — Start to split breakouts`,
                      now: Date.now(),
                    })
                  }}
                >
                  Demo: 12 people (breakouts)
                </button>
              </div>
            </div>
          )}

          {state.phase === PHASES.BREAKOUT && (
            <div className="meet-overlay meet-landing">
              <h2>Breakouts</h2>
              <p>
                {state.breakouts?.length} groups · you are in group {state.activeGroupIndex + 1} (
                {groupIds.length} people)
              </p>
              <p className="meet-note">⅔ consensus required · 60 minute limit</p>
              <button
                type="button"
                className="tetra-btn"
                onClick={() =>
                  dispatch({
                    type: "FORCE_PHASE",
                    phase: PHASES.WHEEL,
                    now: Date.now(),
                  })
                }
              >
                Enter wheel
              </button>
            </div>
          )}

          {(state.phase === PHASES.WHEEL || state.phase === PHASES.TRANSITION) && (
            <>
              <Wheel
                participants={groupParticipants}
                speakerId={state.speakerId}
                queue={state.queue}
                requests={state.requests || []}
                localId={local?.id}
                speakerStartedAt={state.speakerStartedAt}
                now={now}
                SpeakerRing={SpeakerRing}
                onRequestNext={(id) => {
                  dispatch({ type: "REQUEST_NEXT", participantId: id })
                  dispatch({ type: "NOTIFY", text: `${byName(state, id)} wants next`, now: Date.now() })
                }}
                onPickNext={(id) => {
                  dispatch({ type: "PICK_NEXT", participantId: id, byId: local?.id })
                  dispatch({ type: "NOTIFY", text: `Speaker picked ${byName(state, id)}`, now: Date.now() })
                }}
              />
              <div className="meet-overlay">
                <DoneButton
                  visible={state.speakerId === local?.id && state.phase === PHASES.WHEEL}
                  armed={state.doneArmed}
                  onClick={() =>
                    dispatch({ type: "DONE_PRESENTING", participantId: local?.id, now: Date.now() })
                  }
                />
                {state.phase === PHASES.WHEEL && (
                  <button
                    type="button"
                    className="tetra-btn"
                    onClick={() => dispatch({ type: "FORCE_PHASE", phase: PHASES.VOTE })}
                  >
                    Demo: skip to vote
                  </button>
                )}
              </div>
              <TransitionClock endsAt={state.transitionEndsAt} now={now} />
            </>
          )}

          {(state.phase === PHASES.VOTE || state.phase === PHASES.VERIFY) && (
            <ConsensusVote
              participants={state.participants}
              groupIds={groupIds}
              votes={state.votes}
              localId={local?.id}
              positions={state.positions}
              phase={state.phase}
              onCast={(ranking) => {
                dispatch({ type: "CAST_VOTE", participantId: local?.id, ranking })
                // Demo: auto-cast enough ballots from others to reach threshold
                const others = groupIds.filter((id) => id !== local?.id && !state.votes[id])
                const need = Math.round((2 * groupIds.length) / 3)
                let cast = Object.keys(state.votes).length + 1
                for (const id of others) {
                  if (cast >= need) break
                  dispatch({ type: "CAST_VOTE", participantId: id, ranking })
                  cast++
                }
              }}
              onVerified={(positions) => {
                dispatch({ type: "VERIFY_OK", positions })
                finishHistory(false, positions)
              }}
              onFail={(reason) => {
                dispatch({ type: "FAIL", reason })
                finishHistory(true, null)
              }}
            />
          )}

          {state.phase === PHASES.RESULTS && (
            <div className="meet-results meet-overlay" style={{ bottom: "auto", top: "30%" }}>
              <h2>Consensus reached</h2>
              {(state.positions || []).map((p) => (
                <div key={p.place} className="meet-results__place">
                  <span className="meet-results__trophy">#{p.place}</span>
                  {byName(state, p.participantId)}
                </div>
              ))}
              <p className="meet-note">
                {FORMAT_META[state.format]?.money
                  ? "TODO(chain): distribute rewards / advance candidates"
                  : "Roundtable — no payment"}
              </p>
              <button type="button" className="tetra-btn" onClick={leave}>
                Leave
              </button>
            </div>
          )}

          {state.phase === PHASES.FAIL && (
            <div className="meet-fail meet-overlay" style={{ bottom: "auto", top: "30%" }}>
              <h2>No consensus</h2>
              <p>{state.failReason}</p>
              <p>No payment to the group. No candidates advance.</p>
              <button
                type="button"
                className="tetra-btn"
                onClick={() => {
                  finishHistory(true, null)
                  leave()
                }}
              >
                Leave
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="meet-bar-toggle"
        aria-label={barHidden ? "Show controls" : "Hide controls"}
        onClick={() => setBarHidden((v) => !v)}
      >
        <span className="meet-bar-toggle__mark" />
      </button>

      <RightPanel
        open={panelOpen}
        onClose={() => setPanelOpen((v) => !v)}
        onChat={onChat}
        chatLog={chatLog}
      />

      {/* Demo control strip when LiveKit bar absent */}
      {demo && !barHidden && (
        <div
          className="lk-control-bar"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            gap: 8,
            justifyContent: "center",
            padding: 12,
            background: "var(--tetra-void-panel)",
            borderTop: "1px solid var(--tetra-glass-border)",
            zIndex: 10,
          }}
        >
          <button type="button" className="tetra-btn" onClick={() => setPanelOpen(true)}>
            Chat / Profile
          </button>
          <button type="button" className="tetra-btn" onClick={leave}>
            Leave
          </button>
        </div>
      )}
    </div>
  )
}

function byName(state, id) {
  return state.participants.find((p) => p.id === id)?.name || id
}
