import React from "react"
import { navigate } from "../router.js"
import { createMeeting, updateMeeting } from "../state/store.js"
import {
  PROCEDURES,
  PROCEDURE_META,
  VOTING_FORMATS,
  VOTING_FORMAT_META,
  compatibleProcedures,
  compatibleVotingFormats,
} from "../state/procedures.js"
import { hasTokenServer } from "../lib/token.js"

export function Create() {
  const [name, setName] = React.useState("")
  const [format, setFormat] = React.useState(VOTING_FORMATS.ELECTION)
  const [procedure, setProcedure] = React.useState(PROCEDURES.CLASSIC_CLUB)
  const [visibility, setVisibility] = React.useState("public")
  const [membersMax, setMembersMax] = React.useState(8)
  const [advanceMode, setAdvanceMode] = React.useState("count")
  const [advanceValue, setAdvanceValue] = React.useState(2)
  const [roles, setRoles] = React.useState([""])
  const [startsAt, setStartsAt] = React.useState(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000)
    d.setMinutes(0, 0, 0)
    return d.toISOString().slice(0, 16)
  })
  const [openNow, setOpenNow] = React.useState(() => !hasTokenServer())
  const [created, setCreated] = React.useState(null)

  const allowedProcedures = compatibleProcedures(format)
  const allowedFormats = compatibleVotingFormats(procedure)

  function chooseFormat(next) {
    setFormat(next)
    const allowed = compatibleProcedures(next)
    if (!allowed.includes(procedure)) setProcedure(allowed[0])
  }

  function chooseProcedure(next) {
    setProcedure(next)
    const allowed = compatibleVotingFormats(next)
    if (!allowed.includes(format)) setFormat(allowed[0])
  }

  function onSubmit(e) {
    e.preventDefault()
    const meeting = createMeeting({
      name: name.trim() || "Untitled Meeting",
      format,
      votingFormat: format,
      procedure,
      visibility,
      membersMax,
      advanceConfig:
        format === VOTING_FORMATS.CREAM_OF_CROP
          ? { mode: advanceMode, value: Number(advanceValue) }
          : null,
      roles:
        format === VOTING_FORMATS.MULTI_ROLE
          ? roles.map((role) => role.trim()).filter(Boolean)
          : [],
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
      <p className="meet-lede">
        Choose how the meeting runs and what the group will decide.
      </p>

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
            Voting format
            <select value={format} onChange={(e) => chooseFormat(e.target.value)}>
              {Object.values(VOTING_FORMATS)
                .filter((f) => allowedFormats.includes(f))
                .map((f) => (
                <option key={f} value={f}>
                  {VOTING_FORMAT_META[f].label} — {VOTING_FORMAT_META[f].blurb}
                </option>
              ))}
            </select>
          </label>
          <label>
            Procedure
            <select value={procedure} onChange={(e) => chooseProcedure(e.target.value)}>
              {Object.values(PROCEDURES)
                .filter((id) => allowedProcedures.includes(id))
                .map((id) => (
                  <option key={id} value={id}>
                    {PROCEDURE_META[id].label} — {PROCEDURE_META[id].blurb}
                  </option>
                ))}
            </select>
          </label>
          {format === VOTING_FORMATS.CREAM_OF_CROP && (
            <div className="meet-form__row">
              <label>
                Advance by
                <select value={advanceMode} onChange={(e) => setAdvanceMode(e.target.value)}>
                  <option value="count">Number per group</option>
                  <option value="ratio">Ratio per group</option>
                </select>
              </label>
              <label>
                {advanceMode === "ratio" ? "Ratio (0–1)" : "People per group"}
                <input
                  type="number"
                  min={advanceMode === "ratio" ? 0.1 : 1}
                  max={advanceMode === "ratio" ? 1 : 8}
                  step={advanceMode === "ratio" ? 0.1 : 1}
                  value={advanceValue}
                  onChange={(e) => setAdvanceValue(e.target.value)}
                />
              </label>
            </div>
          )}
          {format === VOTING_FORMATS.MULTI_ROLE && (
            <div>
              <div className="meet-section__head">
                <h2>Roles</h2>
                <button
                  type="button"
                  className="tetra-btn"
                  onClick={() => setRoles((current) => [...current, ""])}
                >
                  Add role
                </button>
              </div>
              <div className="meet-links">
                {roles.map((role, index) => (
                  <input
                    key={index}
                    value={role}
                    placeholder="Role"
                    onChange={(e) =>
                      setRoles((current) =>
                        current.map((value, i) => (i === index ? e.target.value : value)),
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}
          {format === VOTING_FORMATS.ROLE_ELECTION && (
            <p className="meet-note">
              Candidates must complete their proofs before they can win or advance.
            </p>
          )}
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
              Start (local)
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                disabled={openNow}
              />
            </label>
            <label>
              Selected procedure
              <input readOnly value={PROCEDURE_META[procedure].label} />
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
