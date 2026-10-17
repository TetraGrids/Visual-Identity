import React from "react"
import { navigate } from "../router.js"
import {
  loadProfile,
  saveProfile,
  loadHistory,
  formatWhen,
  defaultProfile,
} from "../state/store.js"
import { FORMAT_META } from "../state/machine.js"
import { loginXpr, updateProfile, setPaymentRouting } from "../chain/index.js"

export function Profile() {
  const [profile, setProfile] = React.useState(() => loadProfile())
  const [history] = React.useState(() => loadHistory())
  const [saved, setSaved] = React.useState(false)

  function patch(key, value) {
    setProfile((p) => ({ ...p, [key]: value }))
    setSaved(false)
  }

  function setLink(i, value) {
    const links = [...(profile.links || [""])]
    links[i] = value
    patch("links", links)
  }

  function addLink() {
    if ((profile.links || []).length >= 7) return
    patch("links", [...(profile.links || []), ""])
  }

  function setPayout(i, value) {
    const payoutAccounts = [...(profile.payoutAccounts || [""])]
    payoutAccounts[i] = value
    patch("payoutAccounts", payoutAccounts)
  }

  function addPayout() {
    if ((profile.payoutAccounts || []).length >= 12) return
    patch("payoutAccounts", [...(profile.payoutAccounts || []), ""])
  }

  async function onSave(e) {
    e.preventDefault()
    const cleaned = {
      ...defaultProfile(),
      ...profile,
      links: (profile.links || []).map((l) => l.trim()).filter(Boolean).slice(0, 7),
      payoutAccounts: (profile.payoutAccounts || [])
        .map((a) => a.trim())
        .filter(Boolean)
        .slice(0, 12),
    }
    saveProfile(cleaned)
    setProfile(cleaned)
    await updateProfile({
      name: cleaned.name,
      title: cleaned.title,
      role: cleaned.role,
      avatarUrl: cleaned.avatarUrl,
    })
    await setPaymentRouting({
      destinations: cleaned.payoutAccounts.map((account) => ({ account })),
      memo: cleaned.memo,
    })
    setSaved(true)
  }

  async function onXpr() {
    const actor = await loginXpr()
    if (actor?.account) patch("xprAccount", actor.account)
    else patch("xprAccount", profile.xprAccount || "demo.xpr")
  }

  return (
    <div>
      <h1 className="meet-page-title">Profile</h1>
      <p className="meet-lede">Identity, payout routing, and meeting history with proofs.</p>

      <form className="meet-form" onSubmit={onSave} style={{ maxWidth: 640 }}>
        <div className="meet-form__row">
          <label>
            Name
            <input value={profile.name} onChange={(e) => patch("name", e.target.value)} />
          </label>
          <label>
            Handle
            <input value={profile.handle} onChange={(e) => patch("handle", e.target.value)} placeholder="@" />
          </label>
        </div>
        <div className="meet-form__row">
          <label>
            Title
            <input value={profile.title} onChange={(e) => patch("title", e.target.value)} placeholder="Chief…" />
          </label>
          <label>
            Role
            <input value={profile.role} onChange={(e) => patch("role", e.target.value)} />
          </label>
        </div>
        <label>
          Avatar URL
          <input value={profile.avatarUrl} onChange={(e) => patch("avatarUrl", e.target.value)} />
        </label>
        <div className="meet-actions">
          <button type="button" className="tetra-btn" onClick={onXpr}>
            {profile.xprAccount ? `XPR: ${profile.xprAccount}` : "Connect XPR (placeholder)"}
          </button>
        </div>

        <label>
          Notes (markdown)
          <textarea value={profile.notes} onChange={(e) => patch("notes", e.target.value)} />
        </label>

        <div>
          <div className="meet-section__head">
            <h2>Links</h2>
            <button type="button" className="tetra-btn" onClick={addLink} disabled={(profile.links || []).length >= 7}>
              Add
            </button>
          </div>
          <div className="meet-links">
            {(profile.links || [""]).map((l, i) => (
              <input key={i} value={l} onChange={(e) => setLink(i, e.target.value)} placeholder="https://" />
            ))}
          </div>
        </div>

        <div>
          <div className="meet-section__head">
            <h2>Payout accounts (up to 12)</h2>
            <button
              type="button"
              className="tetra-btn"
              onClick={addPayout}
              disabled={(profile.payoutAccounts || []).length >= 12}
            >
              Add
            </button>
          </div>
          <p className="meet-note">TODO(chain): nested lists of 12 via routing contract</p>
          <div className="meet-links">
            {(profile.payoutAccounts || [""]).map((a, i) => (
              <input
                key={i}
                value={a}
                onChange={(e) => setPayout(i, e.target.value)}
                placeholder="accountname"
              />
            ))}
          </div>
        </div>

        <label>
          Custom memo
          <input value={profile.memo} onChange={(e) => patch("memo", e.target.value)} placeholder="flexforex-style memo" />
        </label>

        <div className="meet-actions">
          <button type="submit" className="tetra-btn">
            {saved ? "Saved" : "Save profile"}
          </button>
          <button type="button" className="tetra-btn" onClick={() => navigate("/lobby")}>
            Lobby
          </button>
        </div>
      </form>

      <section className="meet-section meet-history" style={{ marginTop: 48 }}>
        <div className="meet-section__head">
          <h2>History</h2>
        </div>
        {history.length === 0 ? (
          <p className="meet-empty">No meetings yet.</p>
        ) : (
          <div className="meet-list">
            {history.map((h) => (
              <div key={h.id} className="meet-list__row">
                <span className="meet-list__when">{formatWhen(h.at)}</span>
                <span>
                  <strong>{h.meetingName}</strong>
                  <div className="meet-list__meta">
                    {FORMAT_META[h.format]?.label || h.format}
                    {h.failed ? " · failed — no rewards" : ""}
                    {h.positions?.length
                      ? ` · ${h.positions.map((p) => `#${p.place}`).join(" ")}`
                      : ""}
                    {h.proofs?.links?.length ? ` · ${h.proofs.links.length} links` : ""}
                  </div>
                </span>
                <span className={`meet-badge${h.failed ? "" : " meet-badge--green"}`}>
                  {h.failed ? "Fail" : "Done"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
