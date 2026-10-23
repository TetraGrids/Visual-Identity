import React from "react"
import { navigate } from "../router.js"
import { loadMeetings, formatUtcBadge } from "../state/store.js"
import { FORMAT_META, canJoinMeeting, canRegister } from "../state/machine.js"

export function Lobby() {
  const [meetings, setMeetings] = React.useState(() => loadMeetings())

  React.useEffect(() => {
    setMeetings(loadMeetings())
  }, [])

  const now = Date.now()
  const active = meetings.filter((m) => canJoinMeeting(m, now))
  const scheduled = meetings
    .filter((m) => !canJoinMeeting(m, now))
    .sort((a, b) => a.startsAt - b.startsAt)

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
                <div className="meet-active-card__now">Now</div>
                <strong>{m.name}</strong>
                <span>
                  {FORMAT_META[m.format]?.label || m.format}
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
              now >= m.startsAt - 15 * 60 * 1000 && now < m.startsAt
            return (
              <button
                key={m.id}
                type="button"
                className="meet-list__row"
                onClick={() =>
                  navigate(early || canJoinMeeting(m, now) ? `/join/${m.id}` : `/register/${m.id}`)
                }
              >
                <span className="meet-list__when">{formatUtcBadge(m.startsAt)}</span>
                <span>
                  <strong>{m.name}</strong>
                  <div className="meet-list__meta">
                    {FORMAT_META[m.format]?.label || m.format}
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
        Registration opens 24h before · Room 15 min early · 10 min landing (not in the hour) · then
        locked. Contributor&apos;s Club Tue 17:00 UTC · Antelope Roundtable Wed 17:00 UTC.
      </p>
    </div>
  )
}
