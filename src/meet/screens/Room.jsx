/**
 * Room shell — LiveKit video (or demo focus plane) with small bottom wheel overlay.
 * Top-left stage clock. Bottom-left triangle toggles control bar.
 */
import React from "react"
import { createLocalScreenTracks } from "livekit-client"
import { navigate } from "../router.js"
import { getMeeting, loadSession, loadProfile, pushHistory, clearSession } from "../state/store.js"
import {
  PHASES,
  FORMAT_META,
  createInitialMeetingState,
  reduceMeeting,
  eligibleCandidateIds,
  advanceCount,
} from "../state/machine.js"
import { makeDemoParticipants, makeManyForBreakout } from "../state/demoParticipants.js"
import { hasTokenServer } from "../lib/token.js"
import { VideoConferenceClient } from "../lib/VideoConferenceClient.jsx"
import { Wheel } from "../components/Wheel.jsx"
import { FocusStage, WaitingPreview } from "../components/FocusStage.jsx"
import { CallSetup } from "../components/CallSetup.jsx"
import { loadLook, saveLook, openCameraTrack, openMicTrack, paintLook } from "../lib/look.js"
import { StageClock } from "../components/StageClock.jsx"
import { DoneButton } from "../components/DoneButton.jsx"
import { TransitionClock } from "../components/TransitionClock.jsx"
import { NotificationStack } from "../components/NotificationStack.jsx"
import { RightPanel } from "../components/RightPanel.jsx"
import { ConsensusVote } from "../components/ConsensusVote.jsx"
import { ProofBubbles } from "../components/ProofBubbles.jsx"
import { normalizeProofs } from "../state/proofs.js"

export function Room({ meetingId }) {
  const meeting = getMeeting(meetingId)
  const session = loadSession()
  const profile = loadProfile()
  const [barHidden, setBarHidden] = React.useState(false)
  /** null | 'chat' | 'candidates' | 'proofs' | 'account' */
  const [panelTab, setPanelTab] = React.useState(null)
  const [chatLog, setChatLog] = React.useState([])
  const [now, setNow] = React.useState(Date.now())
  const [localProofs, setLocalProofs] = React.useState(() =>
    normalizeProofs(session?.proofs || null),
  )
  const demo = session?.demo ?? !hasTokenServer()
  const localName = session?.userChoices?.username || profile.name || "You"

  function togglePanel(tab) {
    setPanelTab((prev) => (prev === tab ? null : tab))
  }

  function closePanel() {
    setPanelTab(null)
  }

  const [state, dispatch] = React.useReducer(reduceMeeting, null, () => {
    const participants = makeDemoParticipants(5, localName, session?.proofs || null)
    if (session?.mode === "watch") {
      participants.forEach((p) => {
        if (p.isLocal) p.watcher = true
      })
    }
    return createInitialMeetingState({
      format: meeting?.format || "election",
      procedure: meeting?.procedure,
      advanceConfig: meeting?.advanceConfig,
      roles: meeting?.roles,
      participants,
      now: Date.now(),
    })
  })

  React.useEffect(() => {
    if (state.phase !== PHASES.TRANSITION) setCenterMine(false)
  }, [state.phase])

  const localBallotKey = (() => {
    const me = state.participants.find((p) => p.isLocal)
    return me && state.votes[me.id] ? `${me.id}:${state.votes[me.id].join("\0")}` : ""
  })()

  React.useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      dispatch({ type: "TICK", now: t })
    }, 200)
    return () => clearInterval(id)
  }, [])

  React.useEffect(() => {
    if (state.phase !== PHASES.DISCERNMENT) return
    if (!demo || !FORMAT_META[state.format]?.rankedConsensus || !localBallotKey) return
    const me = state.participants.find((p) => p.isLocal)
    const ballot = state.votes[me.id]
    const ids = (state.breakouts?.[state.activeGroupIndex] || state.slots.filter(Boolean)).filter(Boolean)
    const pending = ids.filter((id) => id !== me.id && !state.votes[id])
    const timers = pending.map((id, i) =>
      setTimeout(() => {
        const rest = ids.filter((x) => x !== ballot[0])
        const a = rest[i % rest.length]
        const b = rest[(i + 1) % rest.length]
        const dissent = [a, b, ballot[0]].filter((x, idx, arr) => x && arr.indexOf(x) === idx).slice(0, 3)
        dispatch({
          type: "CAST_VOTE",
          participantId: id,
          ranking: i % 4 === 3 && dissent.length ? dissent : ballot.slice(0, 3),
        })
      }, 900 * (i + 1)),
    )
    return () => timers.forEach(clearTimeout)
  }, [demo, state.phase, state.format, localBallotKey])

  const camTrackRef = React.useRef(null)
  const [localStream, setLocalStream] = React.useState(null)
  const [look, setLook] = React.useState(loadLook)
  const [effects, setEffects] = React.useState(false)
  const [centerMine, setCenterMine] = React.useState(false)
  const [loud, setLoud] = React.useState(false)
  const shareRef = React.useRef(null)
  const [shareStream, setShareStream] = React.useState(null)
  const deviceRef = React.useRef(`${look.videoEnabled}:${look.videoDeviceId || ""}`)
  function keepCam(track) {
    if (camTrackRef.current && camTrackRef.current !== track) camTrackRef.current.stop()
    camTrackRef.current = track
    setLocalStream(track ? new MediaStream([track.mediaStreamTrack]) : null)
  }
  function onLook(next) {
    saveLook(next)
    setLook(next)
  }
  function stopShare() {
    if (!shareRef.current) return
    shareRef.current.forEach((t) => {
      t.mediaStreamTrack.onended = null
      t.stop()
    })
    shareRef.current = null
    setShareStream(null)
    dispatch({ type: "SET_SCREEN_SHARE", participantId: null })
  }
  function shareScreen() {
    if (shareRef.current) {
      stopShare()
      return
    }
    createLocalScreenTracks({
      audio: true,
      systemAudio: "include",
      selfBrowserSurface: "include",
      surfaceSwitching: "include",
    })
      .catch((err) => {
        if (err?.name !== "NotSupportedError") throw err
        return createLocalScreenTracks({ audio: true })
      })
      .then((tracks) => {
        shareRef.current = tracks
        setShareStream(new MediaStream(tracks.map((t) => t.mediaStreamTrack)))
        dispatch({
          type: "SET_SCREEN_SHARE",
          participantId: state.participants.find((p) => p.isLocal)?.id || null,
        })
        tracks[0].mediaStreamTrack.onended = () => stopShare()
      })
      .catch((err) => {
        if (err?.name === "NotAllowedError" || err?.name === "AbortError") return
        dispatch({ type: "NOTIFY", text: "Screen share did not start.", now: Date.now() })
      })
  }
  React.useEffect(() => {
    if (state.phase === PHASES.PRESENTATIONS || state.phase === PHASES.TRANSITION) return
    stopShare()
  }, [state.phase])
  React.useEffect(() => {
    const waiting = state.phase === PHASES.LANDING || state.phase === PHASES.LOCKED
    if (waiting) return
    let dead = false
    let mic = null
    let ctx = null
    let frame = 0
    let on = false
    let quietSince = 0
    openMicTrack(look.audioDeviceId)
      .then((track) => {
        if (dead) {
          track.stop()
          return
        }
        mic = track
        ctx = new AudioContext()
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        ctx.createMediaStreamSource(new MediaStream([track.mediaStreamTrack])).connect(analyser)
        const data = new Uint8Array(analyser.fftSize)
        const tick = () => {
          analyser.getByteTimeDomainData(data)
          let sum = 0
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128
            sum += v * v
          }
          const level = Math.sqrt(sum / data.length)
          const t = performance.now()
          if (!on && level > 0.12) {
            on = true
            quietSince = 0
            setLoud(true)
          } else if (on && level < 0.06) {
            if (!quietSince) quietSince = t
            if (t - quietSince > 280) {
              on = false
              setLoud(false)
            }
          } else if (on) quietSince = 0
          frame = requestAnimationFrame(tick)
        }
        tick()
      })
      .catch(() => {})
    return () => {
      dead = true
      cancelAnimationFrame(frame)
      mic?.stop()
      ctx?.close()
      setLoud(false)
    }
  }, [state.phase === PHASES.LANDING || state.phase === PHASES.LOCKED, look.audioDeviceId])
  React.useEffect(() => {
    if (state.phase === PHASES.LANDING || state.phase === PHASES.LOCKED) {
      deviceRef.current = `${look.videoEnabled}:${look.videoDeviceId || ""}`
      return
    }
    const key = `${look.videoEnabled}:${look.videoDeviceId || ""}`
    if (deviceRef.current === key) return
    deviceRef.current = key
    if (look.videoEnabled === false) {
      keepCam(null)
      return
    }
    let dead = false
    openCameraTrack(look.videoDeviceId)
      .then(async (track) => {
        if (dead) {
          track.stop()
          return
        }
        try {
          await paintLook(track, look.background)
        } catch (err) {
          dispatch({ type: "NOTIFY", text: err.message || "Background did not apply.", now: Date.now() })
        }
        if (dead) {
          track.stop()
          return
        }
        keepCam(track)
      })
      .catch(() => {})
    return () => {
      dead = true
    }
  }, [look.videoEnabled, look.videoDeviceId, state.phase])
  React.useEffect(() => {
    if (state.phase === PHASES.LANDING || state.phase === PHASES.LOCKED) return
    const track = camTrackRef.current
    if (!track) return
    if ((!look.background || look.background === "none") && !track.getProcessor?.()) return
    let dead = false
    paintLook(track, look.background)
      .then(() => {
        if (!dead && camTrackRef.current === track) {
          setLocalStream(new MediaStream([track.mediaStreamTrack]))
        }
      })
      .catch((err) => {
        if (!dead) dispatch({ type: "NOTIFY", text: err.message || "Background did not apply.", now: Date.now() })
      })
    return () => {
      dead = true
    }
  }, [look.background, state.phase])
  React.useEffect(
    () => () => {
      camTrackRef.current?.stop()
      shareRef.current?.forEach((t) => t.stop())
    },
    [],
  )

  React.useEffect(() => {
    if (!session || session.meetingId !== meetingId) {
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
  const groupIds =
    state.breakouts?.[state.activeGroupIndex] ||
    state.slots.filter(Boolean) ||
    state.participants.map((p) => p.id)
  const groupParticipants = state.participants.filter((p) => groupIds.includes(p.id))
  const speaker = state.participants.find((p) => p.id === state.speakerId)
  const others = groupParticipants.filter((p) => p.id !== state.speakerId)
  const screenShare = Boolean(state.screenShareId)

  const showPresentations =
    state.phase === PHASES.PRESENTATIONS || state.phase === PHASES.TRANSITION
  const showDiscernment =
    state.phase === PHASES.DISCERNMENT || state.phase === PHASES.VERIFY

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

  const clock = state.paused && state.pausedAt ? state.pausedAt : now
  const showLiveKit =
    !demo && session?.connection?.serverUrl && session?.connection?.participantToken

  const speakerProofs =
    speaker?.isLocal ? localProofs : normalizeProofs(speaker?.proofs || null)

  const candidatesForPanel = groupParticipants.map((p) =>
    p.isLocal ? { ...p, proofs: localProofs } : p,
  )

  return (
    <div className="meet-room" data-bar-hidden={barHidden ? "true" : "false"}>
      <div className="meet-room__stage" onClick={closePanel}>
        <div className="meet-room__picture">
        <FocusStage
          speaker={speaker}
          others={showPresentations ? others : []}
          screenShare={screenShare}
          localId={local?.id}
          localStream={localStream}
          shareStream={shareStream}
          centerMine={centerMine}
          now={clock}
          loud={loud}
          muted={look.audioEnabled === false}
          mutedIds={state.mutedIds || []}
          preview={
            (state.phase === PHASES.LANDING || state.phase === PHASES.LOCKED) && !showLiveKit
              ? { watch: Boolean(local?.watcher) }
              : false
          }
        >
          {showLiveKit ? (
            <VideoConferenceClient
              liveKitUrl={session.connection.serverUrl}
              token={session.connection.participantToken}
              videoEnabled={session.userChoices?.videoEnabled !== false && session.mode !== "watch"}
              audioEnabled={session.userChoices?.audioEnabled !== false && session.mode !== "watch"}
              onLeave={leave}
            />
          ) : null}
        </FocusStage>

        <div className="meet-room__hud" onClick={(e) => e.stopPropagation()}>
          <StageClock state={state} now={clock} />

          <NotificationStack
            items={state.notifications}
            onExpire={(id) => dispatch({ type: "CLEAR_NOTIFY", id, now: Date.now() })}
          />

          {showPresentations && speaker && (
            <ProofBubbles proofs={speakerProofs} speakerName={speaker.name} />
          )}

          {(state.phase === PHASES.LANDING || state.phase === PHASES.LOCKED) && (
            <div className="meet-overlay meet-landing">
              {!showLiveKit && !local?.watcher && (
                <WaitingPreview
                  camera={look.videoEnabled !== false}
                  look={look}
                  onStream={keepCam}
                />
              )}
              <h2>{meeting.name}</h2>
              <p>
                {state.phase === PHASES.LANDING
                  ? "Landing — 10 minutes. Members lock when it ends. Watchers can still join."
                  : "Members are locked for the vote. Others may watch, not present."}
              </p>
              <p className="meet-note">{FORMAT_META[state.format]?.label}</p>
              <div className="meet-actions">
                {state.phase === PHASES.LANDING && (
                  <button
                    type="button"
                    className="tetra-btn"
                    onClick={() =>
                      dispatch({ type: "READY", participantId: local?.id, now: Date.now() })
                    }
                    disabled={local?.ready || local?.watcher}
                  >
                    {local?.ready ? "Present" : "I'm here"}
                  </button>
                )}
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() =>
                    dispatch({ type: "START_PRESENTATIONS", now: Date.now() })
                  }
                  disabled={(state.phase === PHASES.LANDING && !demo) || state.paused}
                >
                  Start presentations
                </button>
                <button type="button" className="tetra-btn" onClick={() => setEffects((open) => !open)}>
                  {effects ? "Hide effects" : "Effects & devices"}
                </button>
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => dispatch({ type: "START_ALL_DEMO", now: Date.now() })}
                >
                  Demo: start now
                </button>
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => {
                    dispatch({
                      type: "RESEED",
                      participants: makeManyForBreakout(localName),
                      format: meeting?.format || "election",
                      procedure: meeting?.procedure,
                      now: Date.now(),
                    })
                    dispatch({
                      type: "NOTIFY",
                      text: "Reseeded with 12 — start to split breakouts",
                      now: Date.now(),
                    })
                  }}
                >
                  Demo: 12 people
                </button>
              </div>
            </div>
          )}

          {state.phase === PHASES.BREAKOUT && (
            <div className="meet-overlay meet-landing">
              <h2>Breakouts</h2>
              <p>
                {state.breakouts?.length} groups · group {state.activeGroupIndex + 1} (
                {groupIds.length})
              </p>
              <p className="meet-note">
                {state.timing?.timed
                  ? `${state.timing.presentationsMs / 60000} min presentations · ${state.timing.consensusMs / 60000} min consensus`
                  : "Open procedure · no end time"}
              </p>
              <button
                type="button"
                className="tetra-btn"
                onClick={() =>
                  dispatch({ type: "FORCE_PHASE", phase: PHASES.PRESENTATIONS, now: Date.now() })
                }
              >
                Start presentations
              </button>
            </div>
          )}

          {showPresentations && <TransitionClock endsAt={state.transitionEndsAt} now={clock} />}

          {showDiscernment && (
            <ConsensusVote
              participants={state.participants}
              groupIds={groupIds}
              votes={state.votes}
              localId={local?.id}
              positions={state.positions}
              phase={state.phase === PHASES.VERIFY ? "verify" : "vote"}
              ranked={Boolean(FORMAT_META[state.format]?.rankedConsensus)}
              candidateIds={eligibleCandidateIds(state, groupIds)}
              maxChoices={advanceCount(state, eligibleCandidateIds(state, groupIds).length)}
              onCast={(ranking) => {
                dispatch({ type: "CAST_VOTE", participantId: local?.id, ranking })
                if (FORMAT_META[state.format]?.rankedConsensus) return
                const othersIds = groupIds.filter((id) => id !== local?.id && !state.votes[id])
                const need = Math.round((2 * groupIds.length) / 3)
                let cast = Object.keys(state.votes).length + 1
                for (const id of othersIds) {
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
            <div className="meet-results meet-overlay" style={{ bottom: "auto", top: "28%" }}>
              <h2>Consensus reached</h2>
              {(state.positions || []).map((p) => (
                <div key={p.place} className="meet-results__place">
                  <span className="meet-results__trophy">#{p.place}</span>
                  {byName(state, p.participantId)}
                </div>
              ))}
              <p className="meet-note">
                Return to the main group, or stay here until you leave.
              </p>
              <div className="meet-actions">
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => dispatch({ type: "RETURN_TO_MAIN" })}
                >
                  Return to main
                </button>
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => dispatch({ type: "STAY_IN_GROUP" })}
                >
                  Stay in group
                </button>
              </div>
            </div>
          )}

          {state.phase === PHASES.WAITING_BREAK && (
            <div className="meet-results meet-overlay" style={{ bottom: "auto", top: "28%" }}>
              <h2>Consensus reached</h2>
              {(state.positions || []).map((p) => (
                <div key={p.place} className="meet-results__place">
                  <span className="meet-results__trophy">#{p.place}</span>
                  {byName(state, p.participantId)}
                </div>
              ))}
              <p className="meet-note">
                Break starts after every breakout room has reached consensus.
              </p>
              <div className="meet-actions">
                <button
                  type="button"
                  className="tetra-btn"
                  aria-pressed={state.waitingLocation === "main"}
                  onClick={() => dispatch({ type: "WAIT_IN_MAIN" })}
                >
                  Return to main
                </button>
                <button
                  type="button"
                  className="tetra-btn"
                  aria-pressed={state.waitingLocation === "breakout"}
                  onClick={() => dispatch({ type: "WAIT_IN_GROUP" })}
                >
                  Stay in group
                </button>
                {demo && (
                  <button
                    type="button"
                    className="tetra-btn"
                    onClick={() =>
                      dispatch({ type: "MARK_ALL_GROUPS_COMPLETE", now: Date.now() })
                    }
                  >
                    Demo: all groups complete
                  </button>
                )}
              </div>
            </div>
          )}

          {state.phase === PHASES.BREAK && (
            <div className="meet-overlay meet-landing">
              <h2>Break time</h2>
              <p>Everyone is back in the main room. Talk, reset, and refill.</p>
              {demo && (
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => dispatch({ type: "START_SHARING", now: Date.now() })}
                >
                  Demo: start sharing
                </button>
              )}
            </div>
          )}

          {state.phase === PHASES.SHARING && (
            <div className="meet-overlay meet-landing">
              <h2>Sharing &amp; wrap up</h2>
              <p>
                {state.timing?.sharingMs
                  ? `${state.timing.sharingMs / 60000} minutes together in the main room.`
                  : "Together in the main room."}
              </p>
              {demo && (
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => dispatch({ type: "END_SHARING", now: Date.now() })}
                >
                  Demo: finish sharing
                </button>
              )}
            </div>
          )}

          {state.phase === PHASES.ENDED && (
            <div className="meet-overlay meet-landing">
              <h2>Meeting complete</h2>
              <p>The timed procedure is over. The room remains open.</p>
              <button type="button" className="tetra-btn" onClick={leave}>
                Leave meeting
              </button>
            </div>
          )}

          {state.phase === PHASES.STAY && (
            <div className="meet-overlay meet-landing">
              <h2>Staying in breakout</h2>
              <p className="meet-note">Leave to main whenever you are ready.</p>
              <button
                type="button"
                className="tetra-btn"
                onClick={() => dispatch({ type: "RETURN_TO_MAIN" })}
              >
                Leave to main group
              </button>
            </div>
          )}

          {state.phase === PHASES.MAIN && (
            <div className="meet-overlay meet-landing">
              <h2>Main group</h2>
              <p className="meet-note">Back from breakout. Waiting for other groups or closing.</p>
              <button type="button" className="tetra-btn" onClick={leave}>
                Leave meeting
              </button>
            </div>
          )}

          {state.phase === PHASES.FAIL && (
            <div className="meet-fail meet-overlay" style={{ bottom: "auto", top: "28%" }}>
              <h2>No consensus</h2>
              <p>{state.failReason}</p>
              <p>No payment. No candidates advance.</p>
              <div className="meet-actions">
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => dispatch({ type: "RETURN_TO_MAIN" })}
                >
                  Return to main
                </button>
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
            </div>
          )}

          {effects && !showLiveKit && (
            <div className="meet-overlay meet-effects">
              <CallSetup look={look} onLook={onLook} />
            </div>
          )}
        </div>
        </div>
        {showPresentations && (
          <div className="meet-wheel-dock">
            <Wheel
              slots={state.slots}
              participants={groupParticipants}
              speakerId={state.speakerId}
              localId={local?.id}
              localStream={localStream}
              muted={look.audioEnabled === false}
              mutedIds={state.mutedIds || []}
              loud={loud}
              speakerStartedAt={state.speakerStartedAt}
              speakEndsAt={state.speakEndsAt}
              now={clock}
              onClaimActive={(id) => {
                dispatch({ type: "CLAIM_ACTIVE", participantId: id, now: Date.now() })
                dispatch({
                  type: "NOTIFY",
                  text: `${byName(state, id)} → active`,
                  now: Date.now(),
                })
              }}
              onMoveSlot={(id, toSlot) =>
                dispatch({ type: "MOVE_SLOT", participantId: id, toSlot })
              }
            />
          </div>
        )}
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
        tab={panelTab}
        onClose={closePanel}
        onChat={onChat}
        chatLog={chatLog}
        candidates={candidatesForPanel}
        meetingId={meeting.id}
        localProofs={localProofs}
        onProofsChange={(next) => {
          setLocalProofs(next)
          // keep local participant proofs in sync for candidates / bubbles
          dispatch({
            type: "NOTIFY",
            text: "Proofs saved",
            now: Date.now(),
          })
        }}
      />

      {!barHidden && (
        <div className="meet-demo-bar" onClick={(e) => e.stopPropagation()}>
          <div className="meet-bar-left">
            <button
              type="button"
              className="meet-icon-btn"
              aria-label={
                look.audioEnabled === false || (state.paused && (state.mutedIds || []).includes(local?.id))
                  ? "Unmute"
                  : "Mute"
              }
              aria-pressed={look.audioEnabled === false}
              title={
                look.audioEnabled === false || (state.paused && (state.mutedIds || []).includes(local?.id))
                  ? "Unmute"
                  : "Mute"
              }
              onClick={() => {
                const held = !!(local && (state.mutedIds || []).includes(local.id))
                if (state.paused && held) {
                  dispatch({ type: "SET_MUTED", participantId: local.id, muted: false })
                  if (look.audioEnabled === false) onLook({ ...look, audioEnabled: true })
                  return
                }
                onLook({ ...look, audioEnabled: look.audioEnabled === false })
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zM6 11a6 6 0 0 0 12 0M12 17v3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                {(look.audioEnabled === false ||
                  (state.paused && (state.mutedIds || []).includes(local?.id))) && (
                  <path d="M5 5l14 14" fill="none" stroke="currentColor" strokeWidth="1.6" />
                )}
              </svg>
            </button>
            <button
              type="button"
              className="meet-icon-btn"
              aria-label={look.videoEnabled === false ? "Show camera" : "Hide camera"}
              aria-pressed={look.videoEnabled === false}
              title={look.videoEnabled === false ? "Show" : "Hide"}
              onClick={() => onLook({ ...look, videoEnabled: look.videoEnabled === false })}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 8h11v9H3zM14 11l6-3v9l-6-3z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                {look.videoEnabled === false && (
                  <path d="M5 5l14 14" fill="none" stroke="currentColor" strokeWidth="1.6" />
                )}
              </svg>
            </button>
            <button
              type="button"
              className={`meet-user-btn${panelTab === "account" ? " is-active" : ""}`}
              aria-label="Account"
              aria-pressed={panelTab === "account"}
              onClick={() => togglePanel("account")}
              title={profile.name || localName || "Account"}
            >
              {profile.avatarUrl || localProofs.imageData ? (
                <img src={profile.avatarUrl || localProofs.imageData} alt="" />
              ) : (
                <span>{(localName || "U").charAt(0).toUpperCase()}</span>
              )}
            </button>
          </div>
          {local?.host && (
            <button
              type="button"
              className="tetra-btn meet-btn"
              aria-pressed={!!state.paused}
              onClick={() => dispatch({ type: "TOGGLE_PAUSE", now: Date.now() })}
            >
              Pause for Discussion
            </button>
          )}
          {local?.host && (state.phase === PHASES.PRESENTATIONS || state.phase === PHASES.TRANSITION) && (
            <>
              <button
                type="button"
                className="tetra-btn meet-btn"
                disabled={
                  state.paused ||
                  (state.phase === PHASES.PRESENTATIONS && (state.timeCuts?.[state.speakerId] || 0) >= 2)
                }
                onClick={() => dispatch({ type: "ADJUST_TIME", delta: -15000, now: Date.now() })}
              >
                −15s
              </button>
              <button
                type="button"
                className="tetra-btn meet-btn"
                disabled={
                  state.paused ||
                  (state.phase === PHASES.PRESENTATIONS && (state.timeAdds?.[state.speakerId] || 0) >= 4)
                }
                onClick={() => dispatch({ type: "ADJUST_TIME", delta: 15000, now: Date.now() })}
              >
                +15s
              </button>
              {state.phase === PHASES.PRESENTATIONS && (
                <button
                  type="button"
                  className="tetra-btn meet-btn"
                  disabled={state.paused}
                  onClick={() => dispatch({ type: "END_TURN", now: Date.now() })}
                >
                  End turn
                </button>
              )}
            </>
          )}
          {local?.host && state.phase !== PHASES.LANDING && state.phase !== PHASES.LOCKED &&
            groupParticipants
              .filter((p) => p.id !== local.id)
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="meet-icon-btn"
                  aria-label={
                    (state.mutedIds || []).includes(p.id)
                      ? state.paused
                        ? `${p.name} muted`
                        : `Unmute ${p.name}`
                      : `Mute ${p.name}`
                  }
                  aria-pressed={(state.mutedIds || []).includes(p.id)}
                  title={p.name}
                  onClick={() =>
                    dispatch({
                      type: "SET_MUTED",
                      participantId: p.id,
                      muted: state.paused ? true : !(state.mutedIds || []).includes(p.id),
                    })
                  }
                >
                  {(state.mutedIds || []).includes(p.id) ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zM6 11a6 6 0 0 0 12 0M12 17v3M5 5l14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  ) : (
                    <span>{p.letter}</span>
                  )}
                </button>
              ))}
          {showPresentations && (
            <>
              <DoneButton
                visible={state.speakerId === local?.id && state.phase === PHASES.PRESENTATIONS}
                armed={state.doneArmed}
                onClick={() =>
                  dispatch({
                    type: "DONE_PRESENTING",
                    participantId: local?.id,
                    now: Date.now(),
                  })
                }
              />
              <button
                type="button"
                className="tetra-btn meet-btn"
                aria-pressed={screenShare}
                onClick={shareScreen}
              >
                {screenShare ? "Stop sharing" : "Share screen"}
              </button>
              <button
                type="button"
                className="tetra-btn meet-btn"
                aria-pressed={effects}
                onClick={() => setEffects((open) => !open)}
              >
                {effects ? "Hide effects" : "Effects"}
              </button>
              <button
                type="button"
                className="tetra-btn meet-btn"
                onClick={() =>
                  dispatch({ type: "FORCE_PHASE", phase: PHASES.DISCERNMENT, now: Date.now() })
                }
              >
                Skip to vote
              </button>
              {state.phase === PHASES.TRANSITION && (
                <button
                  type="button"
                  className="tetra-btn meet-btn"
                  aria-pressed={centerMine}
                  onClick={() => setCenterMine((on) => !on)}
                >
                  {centerMine ? "Hide my display" : "Center my display"}
                </button>
              )}
            </>
          )}
          <button
            type="button"
            className={`tetra-btn meet-btn${panelTab === "chat" ? " is-dock-active" : ""}`}
            aria-pressed={panelTab === "chat"}
            onClick={() => togglePanel("chat")}
          >
            Chat
          </button>
          <button
            type="button"
            className={`tetra-btn meet-btn${panelTab === "candidates" ? " is-dock-active" : ""}`}
            aria-pressed={panelTab === "candidates"}
            onClick={() => togglePanel("candidates")}
          >
            Candidates
          </button>
          <button
            type="button"
            className={`tetra-btn meet-btn${panelTab === "proofs" ? " is-dock-active" : ""}`}
            aria-pressed={panelTab === "proofs"}
            onClick={() => togglePanel("proofs")}
          >
            Proofs
          </button>
          <button type="button" className="tetra-btn meet-btn" onClick={leave}>
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
