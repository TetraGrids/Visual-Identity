import React from "react"
import { navigate } from "../router.js"
import { createMeeting, updateMeeting } from "../state/store.js"
import { FORMATS, FORMAT_META } from "../state/machine.js"

export function Create() {
  const [name, setName] = React.useState("")
  const [format, setFormat] = React.useState(FORMATS.ELECTION)
  const [visibility, setVisibility] = React.useState("public")
  const [membersMax, setMembersMax] = React.useState(8)
  const [durationMin, setDurationMin] = React.useState(60)
  const [startsAt, setStartsAt] = React.useState(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000)
    d.setMinutes(0, 0, 0)
    return d.toISOString().slice(0, 16)
  })
  const [openNow, setOpenNow] = React.useState(false)
  const [created, setCreated] = React.useState(null)

  function onSubmit(e) {
    e.preventDefault()
    const meeting = createMeeting({
      name: name.trim() || "Untitled Meeting",
      format,
      visibility,
      membersMax,
      durationMin,
      startsAt: openNow ? Date.now() : new Date(startsAt).getTime(),
      status: openNow ? "active" : "scheduled",
    })
    if (openNow) updateMeeting(meeting.id, { status: "active", startsAt: Date.now() })
    setCreated(meeting)
  }

  const link = created ? `${window.location.origin}/meet.html#/join/${created.id}` : ""

  return (
    <div>
      <h1 className="meet-page-title">Create room</h1>
      <p className="meet-lede">Name, members, visibility, duration, schedule, and reward format.</p>

      {created ? (
        <div className="meet-join__card">
          <p>
            Room <strong>{created.name}</strong> is ready.
          </p>
          <label>
            Share link
            <input readOnly value={link} onFocus={(e) => e.target.select()} />
          </label>
          <div className="meet-actions">
            <button type="button" className="tetra-btn" onClick={() => navigate(`/join/${created.id}`)}>
              Enter
            </button>
            <button type="button" className="tetra-btn" onClick={() => navigate("/lobby")}>
              Lobby
            </button>
          </div>
        </div>
      ) : (
        <form className="meet-form" onSubmit={onSubmit}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Room name" required />
          </label>
          <label>
            Format
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              {Object.values(FORMATS).map((f) => (
                <option key={f} value={f}>
                  {FORMAT_META[f].label} — {FORMAT_META[f].blurb}
                </option>
              ))}
            </select>
          </label>
          <div className="meet-form__row">
            <label>
              Visibility
              <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option value="public">Public</option>
                <option value="private">Private (link only)</option>
              </select>
            </label>
            <label>
              Max members
              <input
                type="number"
                min={4}
                max={64}
                value={membersMax}
                onChange={(e) => setMembersMax(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="meet-form__row">
            <label>
              Duration (minutes)
              <input
                type="number"
                min={15}
                max={240}
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value))}
              />
            </label>
            <label>
              Start (local)
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                disabled={openNow}
              />
            </label>
          </div>
          <label style={{ flexDirection: "row", alignItems: "center", gap: 10, textTransform: "none" }}>
            <input type="checkbox" checked={openNow} onChange={(e) => setOpenNow(e.target.checked)} />
            Open now (active strip)
          </label>
          <div className="meet-actions">
            <button type="submit" className="tetra-btn">
              Create
            </button>
            <button type="button" className="tetra-btn" onClick={() => navigate("/lobby")}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
