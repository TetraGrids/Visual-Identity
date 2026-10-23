import React from "react"
import { marked } from "marked"
import {
  loadProfile,
  saveProfile,
  loadRegistration,
  saveRegistration,
} from "../state/store.js"
import { updateProfile, loginXpr } from "../chain/index.js"
import { ProofsEditor } from "./ProofsEditor.jsx"
import { cleanProofs, normalizeProofs, emptyProofs } from "../state/proofs.js"

/**
 * Right sidebar: Chat | Candidates | Proofs | Account (via tab prop).
 * Closes when parent sets tab to null (same button again, or click main stage).
 */
export function RightPanel({
  tab, // null | 'chat' | 'candidates' | 'proofs' | 'account'
  onClose,
  onChat,
  chatLog = [],
  candidates = [],
  meetingId,
  localProofs,
  onProofsChange,
}) {
  const open = Boolean(tab)
  const [profile, setProfile] = React.useState(() => loadProfile())
  const [msg, setMsg] = React.useState("")
  const [proofs, setProofs] = React.useState(() =>
    normalizeProofs(localProofs || (meetingId ? loadRegistration(meetingId) : null) || emptyProofs()),
  )
  const [proofSaved, setProofSaved] = React.useState(false)

  React.useEffect(() => {
    if (localProofs) setProofs(normalizeProofs(localProofs))
  }, [localProofs])

  async function saveAccount(e) {
    e.preventDefault()
    saveProfile(profile)
    await updateProfile({
      name: profile.name,
      title: profile.title,
      role: profile.role,
      avatarUrl: profile.avatarUrl,
    })
  }

  function saveProofs(e) {
    e.preventDefault()
    const cleaned = cleanProofs(proofs)
    if (meetingId) {
      saveRegistration(meetingId, {
        ...cleaned,
        name: profile.name || "Participant",
        at: Date.now(),
      })
    }
    onProofsChange?.(cleaned)
    setProofs(normalizeProofs(cleaned))
    setProofSaved(true)
  }

  return (
    <aside
      className={`meet-right${open ? " is-open" : ""}`}
      aria-hidden={!open}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="meet-right__head">
        <span className="meet-right__title">
          {tab === "chat" && "Chat"}
          {tab === "candidates" && "Candidates"}
          {tab === "proofs" && "Proofs"}
          {tab === "account" && "Account"}
        </span>
        <button type="button" className="meet-right__x" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div className="meet-right__body">
        {tab === "chat" && (
          <div className="meet-right__chat">
            <div className="meet-right__chat-log">
              {chatLog.length === 0 && <p className="meet-note">No messages yet.</p>}
              {chatLog.map((c) => (
                <div key={c.id} className="meet-right__chat-line">
                  <strong>{c.from}</strong>: {c.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!msg.trim()) return
                onChat?.(msg.trim())
                setMsg("")
              }}
              className="meet-form"
            >
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Message…"
                aria-label="Chat message"
              />
              <button type="submit" className="tetra-btn">
                Send
              </button>
            </form>
          </div>
        )}

        {tab === "candidates" && (
          <div className="meet-candidates">
            {candidates.length === 0 && <p className="meet-note">No candidates yet.</p>}
            {candidates.map((c) => (
              <CandidateCard key={c.id} candidate={c} />
            ))}
          </div>
        )}

        {tab === "proofs" && (
          <form className="meet-form" onSubmit={saveProofs}>
            <ProofsEditor
              value={proofs}
              onChange={(next) => {
                setProofs(next)
                setProofSaved(false)
              }}
            />
            <button type="submit" className="tetra-btn">
              {proofSaved ? "Saved" : "Save proofs"}
            </button>
          </form>
        )}

        {tab === "account" && (
          <form className="meet-form" onSubmit={saveAccount}>
            <label>
              Name
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </label>
            <label>
              Title
              <input
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              />
            </label>
            <label>
              Role
              <input
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              />
            </label>
            <button
              type="button"
              className="tetra-btn"
              onClick={async () => {
                const a = await loginXpr()
                setProfile({
                  ...profile,
                  xprAccount: a?.account || profile.xprAccount || "demo.xpr",
                })
              }}
            >
              {profile.xprAccount ? `XPR: ${profile.xprAccount}` : "Connect XPR"}
            </button>
            <button type="submit" className="tetra-btn">
              Save
            </button>
          </form>
        )}
      </div>
    </aside>
  )
}

function CandidateCard({ candidate }) {
  const proofs = normalizeProofs(candidate.proofs)
  const preview = React.useMemo(() => {
    try {
      return marked.parse((proofs.brief || "").slice(0, 280), { async: false })
    } catch {
      return ""
    }
  }, [proofs.brief])

  return (
    <article className="meet-candidate">
      <div className="meet-candidate__top">
        {proofs.imageData ? (
          <img src={proofs.imageData} alt="" className="meet-candidate__thumb" />
        ) : (
          <span className="meet-candidate__letter">{candidate.letter || "?"}</span>
        )}
        <div>
          <strong>{candidate.name}</strong>
          {candidate.isLocal && <span className="meet-note"> · you</span>}
        </div>
      </div>
      {proofs.brief && (
        <div className="meet-candidate__md" dangerouslySetInnerHTML={{ __html: preview }} />
      )}
      {proofs.links.filter(Boolean).length > 0 && (
        <ul className="meet-candidate__links">
          {proofs.links.filter(Boolean).slice(0, 3).map((href) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {href.replace(/^https?:\/\//, "").slice(0, 32)}
              </a>
            </li>
          ))}
        </ul>
      )}
      {proofs.kpis.length > 0 && (
        <div className="meet-candidate__kpis">
          {proofs.kpis.slice(0, 4).map((k, i) => (
            <span key={i} className="meet-badge">
              {k.name}
              {k.type === "percent" ? ` ${k.value}%` : k.type === "integer" ? ` ${k.value}` : ""}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
