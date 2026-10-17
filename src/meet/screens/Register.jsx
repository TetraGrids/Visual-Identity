import React from "react"
import { marked } from "marked"
import { navigate } from "../router.js"
import { getMeeting, loadRegistration, saveRegistration, loadProfile, formatUtcBadge } from "../state/store.js"
import { FORMAT_META } from "../state/machine.js"

export function Register({ meetingId }) {
  const meeting = getMeeting(meetingId)
  const profile = loadProfile()
  const existing = meeting ? loadRegistration(meeting.id) : null

  const [brief, setBrief] = React.useState(existing?.brief || profile.notes || "")
  const [links, setLinks] = React.useState(existing?.links?.length ? existing.links : [""])
  const [imageData, setImageData] = React.useState(existing?.imageData || "")
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

  function onImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("One image only (png/jpg/webp).")
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImageData(String(reader.result))
    reader.readAsDataURL(file)
  }

  function setLink(i, value) {
    setLinks((prev) => prev.map((l, idx) => (idx === i ? value : l)))
  }

  function addLink() {
    if (links.length >= 7) return
    setLinks((prev) => [...prev, ""])
  }

  function onSubmit(e) {
    e.preventDefault()
    saveRegistration(meeting.id, {
      brief,
      links: links.map((l) => l.trim()).filter(Boolean).slice(0, 7),
      imageData,
      name: profile.name || "Participant",
      at: Date.now(),
    })
    setSaved(true)
  }

  const preview = React.useMemo(() => {
    try {
      return marked.parse(brief || "", { async: false })
    } catch {
      return ""
    }
  }, [brief])

  return (
    <div>
      <h1 className="meet-page-title">Register</h1>
      <p className="meet-lede">
        <strong>{meeting.name}</strong> · {FORMAT_META[meeting.format]?.label} ·{" "}
        {formatUtcBadge(meeting.startsAt)}
      </p>

      <form className="meet-form" onSubmit={onSubmit} style={{ maxWidth: 720 }}>
        <label>
          Thumbnail (one image)
          <input type="file" accept="image/*" onChange={onImage} />
        </label>
        {imageData ? (
          <img className="meet-thumb" src={imageData} alt="Registration thumbnail" />
        ) : (
          <div className="meet-thumb meet-thumb--empty" aria-hidden="true">
            +
          </div>
        )}

        <label>
          Brief (markdown)
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Short proof / bio in markdown…"
          />
        </label>
        {brief && (
          <div className="meet-preview" dangerouslySetInnerHTML={{ __html: preview }} />
        )}

        <div>
          <div className="meet-section__head">
            <h2>Links (up to 7)</h2>
            <button type="button" className="tetra-btn" onClick={addLink} disabled={links.length >= 7}>
              Add link
            </button>
          </div>
          <div className="meet-links">
            {links.map((l, i) => (
              <input
                key={i}
                type="url"
                placeholder="https://"
                value={l}
                onChange={(e) => setLink(i, e.target.value)}
              />
            ))}
          </div>
        </div>

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
