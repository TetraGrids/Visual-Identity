import React from "react"
import { navigate } from "../router.js"
import {
  getMeeting,
  loadRegistration,
  saveRegistration,
  loadProfile,
  formatUtcBadge,
} from "../state/store.js"
import { FORMAT_META, canRegister, canJoinMeeting } from "../state/machine.js"
import { ProofsEditor } from "../components/ProofsEditor.jsx"
import { cleanProofs, normalizeProofs, emptyProofs } from "../state/proofs.js"

export function Register({ meetingId }) {
  const meeting = getMeeting(meetingId)
  const profile = loadProfile()
  const existing = meeting ? loadRegistration(meeting.id) : null

  const [proofs, setProofs] = React.useState(() =>
    normalizeProofs(
      existing || {
        ...emptyProofs(),
        brief: profile.notes || "",
        links: profile.links?.length ? profile.links : [""],
      },
    ),
  )
  const [saved, setSaved] = React.useState(false)

  if (!meeting) {
    return (
      <div>
        <h1 className="meet-page-title">Not found</h1>
        <button type="button" className="tetra-btn" onClick={() => navigate("/lobby")}>
          Back to lobby
        </button>
      </div>
    )
  }

  function onSubmit(e) {
    e.preventDefault()
    const cleaned = cleanProofs(proofs)
    saveRegistration(meeting.id, {
      ...cleaned,
      name: profile.name || "Participant",
      at: Date.now(),
    })
    setSaved(true)
  }

  const regOpen = canRegister(meeting)
  const joinOpen = canJoinMeeting(meeting)

  return (
    <div>
      <h1 className="meet-page-title">Register</h1>
      <p className="meet-lede">
        <strong>{meeting.name}</strong> · {FORMAT_META[meeting.format]?.label} ·{" "}
        {formatUtcBadge(meeting.startsAt)}
        {regOpen
          ? " · registration open"
          : joinOpen
            ? " · room open — you can still attach proofs"
            : " · outside registration window"}
      </p>

      <form className="meet-form" onSubmit={onSubmit} style={{ maxWidth: 720 }}>
        <ProofsEditor
          value={proofs}
          onChange={(next) => {
            setProofs(next)
            setSaved(false)
          }}
        />
        <div className="meet-actions">
          <button type="submit" className="tetra-btn">
            {saved ? "Saved" : "Save registration"}
          </button>
          <button type="button" className="tetra-btn" onClick={() => navigate(`/join/${meeting.id}`)}>
            Join when open
          </button>
          <button type="button" className="tetra-btn" onClick={() => navigate("/lobby")}>
            Lobby
          </button>
        </div>
      </form>
    </div>
  )
}
