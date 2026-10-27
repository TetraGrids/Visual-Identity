/**
 * Modified PreJoin from livekit-examples/meet — watch vs participate,
 * XPR login gate for participate, TokenSource when configured else demo mode.
 */
import React from "react"
import { navigate } from "../router.js"
import { getMeeting, loadProfile, saveSession, loadRegistration } from "../state/store.js"
import { canJoinMeeting, canWatchMeeting, FORMAT_META } from "../state/machine.js"
import { hasTokenServer, fetchRoomConnection } from "../lib/token.js"
import { loadLook, saveLook } from "../lib/look.js"
import { loginXpr } from "../chain/index.js"
import { WaitingPreview } from "../components/FocusStage.jsx"
import { CallSetup } from "../components/CallSetup.jsx"

export function Join({ meetingId }) {
  const meeting = getMeeting(meetingId)
  const profile = loadProfile()
  const [mode, setMode] = React.useState("participate") // watch | participate
  const [xpr, setXpr] = React.useState(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState("")
  const [demoName, setDemoName] = React.useState(profile.name || "You")
  const [look, setLook] = React.useState(loadLook)
  const previewTrack = React.useRef(null)
  React.useEffect(() => () => previewTrack.current?.stop(), [])

  if (!meeting) {
    return (
      <div>
        <h1 className="meet-page-title">Meeting not found</h1>
        <button type="button" className="tetra-btn" onClick={() => navigate("/lobby")}>
          Lobby
        </button>
      </div>
    )
  }

  const demo = !hasTokenServer()
  const timing = demo ? { relaxTiming: true } : undefined
  const participateOpen = canJoinMeeting(meeting, undefined, timing)
  const watchOpen = canWatchMeeting(meeting, undefined, timing)
  const closed = !participateOpen && !watchOpen
  const joining = participateOpen ? mode : "watch"

  async function enter(choices) {
    setError("")
    setBusy(true)
    try {
      if (joining === "participate" && !xpr?.account && !demo) {
        // Still allow demo without chain; production would block
      }
      if (joining === "participate" && !demo && !xpr?.account) {
        setError("Connect XPR wallet to participate.")
        setBusy(false)
        return
      }

      let connection = null
      if (!demo) {
        connection = await fetchRoomConnection({
          roomName: meeting.id,
          participantName: choices?.username || profile.name || "guest",
        })
      }

      const reg = loadRegistration(meeting.id)
      saveSession({
        meetingId: meeting.id,
        mode: joining,
        demo,
        connection,
        userChoices: choices || {
          username: profile.name || "Guest",
          videoEnabled: joining === "participate",
          audioEnabled: joining === "participate",
        },
        xprAccount: xpr?.account || "",
        proofs: reg,
        enteredAt: Date.now(),
      })
      navigate(`/room/${meeting.id}`)
    } catch (err) {
      console.error(err)
      setError(err.message || "Could not join")
    } finally {
      setBusy(false)
    }
  }

  async function onXpr() {
    const actor = await loginXpr()
    if (actor) setXpr(actor)
    else {
      // Placeholder UX until Wharfkit is wired
      setXpr({ account: "demo.xpr", permission: "active", placeholder: true })
    }
  }

  return (
    <div className="meet-join">
      <h1 className="meet-page-title">Join</h1>
      <p className="meet-lede">
        {meeting.name} · {FORMAT_META[meeting.format]?.label}
        {demo ? " · demo mode (set VITE_LK_TOKEN_SERVER_ID for LiveKit Cloud)" : ""}
      </p>

      {closed && (
        <p className="meet-empty" style={{ borderColor: "var(--tetra-orange)", color: "var(--tetra-orange)" }}>
          Entry closed. The meeting has ended.
        </p>
      )}

      {!closed && (
        <div className="meet-join__card">
          <div className="meet-join__modes">
            <button
              type="button"
              className="meet-join__mode"
              aria-pressed={joining === "watch"}
              onClick={() => setMode("watch")}
            >
              <strong>Watch</strong>
              <span>No login. Observe only — no publish.</span>
            </button>
            {participateOpen && (
              <button
                type="button"
                className="meet-join__mode"
                aria-pressed={joining === "participate"}
                onClick={() => setMode("participate")}
              >
                <strong>Participate</strong>
                <span>Requires XPR identity to speak and vote.</span>
              </button>
            )}
          </div>

          {!participateOpen && watchOpen && (
            <p className="meet-note">Members are locked. You can watch, not present.</p>
          )}

          {joining === "participate" && (
            <div className="meet-actions" style={{ marginBottom: 16 }}>
              <button type="button" className="tetra-btn" onClick={onXpr}>
                {xpr?.account ? `XPR: ${xpr.account}` : "Connect XPR (placeholder)"}
              </button>
              {xpr?.placeholder && (
                <span className="meet-note">TODO(chain): real Wharfkit / WebAuth login</span>
              )}
            </div>
          )}

          {joining === "watch" ? (
            <div className="meet-actions">
              <button
                type="button"
                className="tetra-btn"
                disabled={busy}
                onClick={() =>
                  enter({
                    username: profile.name || "Watcher",
                    videoEnabled: false,
                    audioEnabled: false,
                  })
                }
              >
                Enter as watcher
              </button>
            </div>
          ) : (
            <div className="meet-prejoin-host">
              <WaitingPreview
                camera={look.videoEnabled !== false}
                look={look}
                onStream={(track) => {
                  previewTrack.current = track
                }}
              />
              <CallSetup
                look={look}
                onLook={(next) => {
                  saveLook(next)
                  setLook(next)
                }}
              />
              <label className="meet-setup__name">
                Display name
                <input
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  placeholder="Your name"
                />
              </label>
              <button
                type="button"
                className="tetra-btn"
                disabled={busy}
                onClick={() =>
                  enter({
                    username: demoName.trim() || profile.name || "You",
                    videoEnabled: look.videoEnabled !== false,
                    audioEnabled: look.audioEnabled !== false,
                    videoDeviceId: look.videoDeviceId,
                    audioDeviceId: look.audioDeviceId,
                  })
                }
              >
                {busy ? "Joining…" : demo ? "Start (demo)" : "Join meeting"}
              </button>
            </div>
          )}

          {error && <p style={{ color: "var(--tetra-orange)" }}>{error}</p>}
        </div>
      )}

      <button type="button" className="tetra-btn" onClick={() => navigate("/lobby")}>
        Back to lobby
      </button>
    </div>
  )
}
