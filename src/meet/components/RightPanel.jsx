import React from "react"
import { loadProfile, saveProfile } from "../state/store.js"
import { updateProfile, loginXpr } from "../chain/index.js"

export function RightPanel({ open, onClose, onChat, chatLog = [] }) {
  const [tab, setTab] = React.useState("chat")
  const [profile, setProfile] = React.useState(() => loadProfile())
  const [msg, setMsg] = React.useState("")

  async function save() {
    saveProfile(profile)
    await updateProfile({
      name: profile.name,
      title: profile.title,
      role: profile.role,
      avatarUrl: profile.avatarUrl,
    })
  }

  return (
    <>
      <button
        type="button"
        className="meet-right-toggle"
        aria-label={open ? "Close panel" : "Open chat and profile"}
        onClick={onClose}
      />
      <aside className={`meet-right${open ? " is-open" : ""}`} aria-hidden={!open}>
        <div className="meet-right__tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "chat"} onClick={() => setTab("chat")}>
            Chat
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "profile"}
            onClick={() => setTab("profile")}
          >
            Profile
          </button>
        </div>
        <div className="meet-right__body">
          {tab === "chat" && (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                {chatLog.length === 0 && <p className="meet-note">No messages yet.</p>}
                {chatLog.map((c) => (
                  <div key={c.id} style={{ fontSize: "0.9rem" }}>
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
          {tab === "profile" && (
            <form
              className="meet-form"
              onSubmit={(e) => {
                e.preventDefault()
                save()
              }}
            >
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
                {profile.xprAccount ? `XPR: ${profile.xprAccount}` : "Update via XPR (TODO)"}
              </button>
              <button type="submit" className="tetra-btn">
                Save
              </button>
            </form>
          )}
        </div>
      </aside>
    </>
  )
}
