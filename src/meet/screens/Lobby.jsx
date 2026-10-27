import React from "react"
import { navigate } from "../router.js"
import { loadMeetings, formatUtcBadge } from "../state/store.js"
import { FORMAT_META, canJoinMeeting, canWatchMeeting, canRegister } from "../state/machine.js"
import { hasTokenServer } from "../lib/token.js"
import { PROCEDURE_META, PROCEDURES, procedureFor } from "../state/procedures.js"

export function Lobby() {
  const [meetings, setMeetings] = React.useState(() => loadMeetings())

  React.useEffect(() => {
    setMeetings(loadMeetings())
  }, [])

  const now = Date.now()
  const timing = !hasTokenServer() ? { relaxTiming: true } : undefined
  const live = (m) =>
    canJoinMeeting(m, now, timing) || canWatchMeeting(m, now, timing)
  const active = meetings.filter(live)
  const scheduled = meetings.filter((m) => !live(m)).sort((a, b) => a.startsAt - b.startsAt)

  return (
    <div className="meet-lobby">
      <h1 className="meet-page-title">Meet</h1>
      <p className="meet-lede">
        Consensus meetings, elections, and roundtables. Join live events at the top — register for
        upcoming sessions below. Adapted from{" "}
        <a href="https://github.com/livekit-examples/meet" rel="noopener noreferrer">
          LiveKit Meet
        </a>
        .
      </p>

      <section className="meet-section">
        <div className="meet-section__head">
          <h2>Now</h2>
          <button type="button" className="tetra-btn" onClick={() => navigate("/create")}>
            Create room
          </button>
        </div>
        {active.length === 0 ? (
          <p className="meet-empty">No live meetings. Create one or wait for the next scheduled open.</p>
        ) : (
          <div className="meet-active-strip" role="list">
            {active.map((m) => (
              <button
                key={m.id}
                type="button"
                className="meet-active-card"
                role="listitem"
                aria-label={`Join live: ${m.name}`}
                onClick={() => navigate(`/join/${m.id}`)}
              >
                <div className="meet-active-card__now">
                  {canJoinMeeting(m, now, timing) ? "Now" : "Watch"}
                </div>
                <strong>{m.name}</strong>
                <span>
                  {FORMAT_META[m.format]?.label || m.format}
                  {` · ${PROCEDURE_META[m.procedure || PROCEDURES.CLASSIC_CLUB].label}`}
                  {m.participants ? ` · ${m.participants} in` : ""}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="meet-section">
        <div className="meet-section__head">
          <h2>Register — upcoming</h2>
        </div>
        <div className="meet-list">
          {scheduled.map((m) => {
            const open = canRegister(m, now)
            const early =
              now >= m.startsAt - procedureFor(m.procedure).earlyEntryMs && now < m.startsAt
            return (
              <button
                key={m.id}
                type="button"
                className="meet-list__row"
                onClick={() =>
                  navigate(
                    early || canJoinMeeting(m, now, timing) ? `/join/${m.id}` : `/register/${m.id}`,
                  )
                }
              >
                <span className="meet-list__when">{formatUtcBadge(m.startsAt)}</span>
                <span>
                  <strong>{m.name}</strong>
                  <div className="meet-list__meta">
                    {FORMAT_META[m.format]?.label || m.format}
                    {` · ${PROCEDURE_META[m.procedure || PROCEDURES.CLASSIC_CLUB].label}`}
                    {m.visibility === "private" ? " · private" : ""}
                    {m.recurring ? " · recurring" : ""}
                    {open ? " · registration open" : ""}
                    {early ? " · room opens" : ""}
                  </div>
                </span>
                <span className={`meet-badge${open || early ? " meet-badge--green" : ""}`}>
                  {early ? "Enter" : open ? "Register" : "Soon"}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <p className="meet-note">
        Classic Club: register 24h before · room 15 min early · 10 min landing · 45 min
        presentations · 15 min consensus · 5 min break · 10 min sharing.
      </p>
    </div>
  )
}
