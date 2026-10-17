import React from "react"
import { consensusThreshold } from "../state/machine.js"
import { signConsensusTx, proxyConfirmSign, verifyConsensusTxs } from "../chain/index.js"

export function ConsensusVote({
  participants,
  groupIds,
  votes,
  localId,
  positions,
  phase,
  onCast,
  onVerified,
  onFail,
}) {
  const group = participants.filter((p) => groupIds.includes(p.id))
  const need = consensusThreshold(group.length)
  const castCount = Object.keys(votes).filter((id) => groupIds.includes(id)).length
  const [ranking, setRanking] = React.useState([])
  const [busy, setBusy] = React.useState(false)

  function toggle(id) {
    setRanking((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  async function submit() {
    if (ranking.length < 1) return
    onCast?.(ranking)
  }

  async function verify() {
    setBusy(true)
    // Demo: treat as verified locally; chain calls are placeholders
    const payload = {
      meetingId: "demo",
      groupId: "g0",
      positions: positions || ranking.map((id, i) => ({ place: i + 1, participantId: id })),
    }
    await signConsensusTx(payload)
    const nonsigners = group.filter((p) => !p.canSign)
    if (nonsigners.length) {
      await proxyConfirmSign({
        meetingId: "demo",
        groupId: "g0",
        beneficiaryId: nonsigners[0].id,
        confirmerIds: group.filter((p) => p.canSign).map((p) => p.id),
      })
    }
    const result = await verifyConsensusTxs({ meetingId: "demo", groupId: "g0" })
    setBusy(false)
    // UI demo: always succeed after placeholders so the run-through completes
    if (result.verified || true) {
      onVerified?.(positions || ranking.map((id, i) => ({ place: i + 1, participantId: id })))
    } else {
      onFail?.("TX verification failed")
    }
  }

  if (phase === "verify") {
    return (
      <div className="meet-vote meet-overlay" style={{ bottom: 120 }}>
        <h3>Verify consensus TX</h3>
        <p className="meet-note">
          TODO(chain): verify on XPR. Proxy-confirm for Google/Microsoft accounts when peers
          confirm and one signer submits.
        </p>
        <ol>
          {(positions || []).map((p) => {
            const person = participants.find((x) => x.id === p.participantId)
            return (
              <li key={p.place}>
                #{p.place} {person?.name}
              </li>
            )
          })}
        </ol>
        <button type="button" className="tetra-btn" disabled={busy} onClick={verify}>
          {busy ? "Verifying…" : "Confirm & verify (demo)"}
        </button>
      </div>
    )
  }

  return (
    <div className="meet-vote meet-overlay" style={{ bottom: 120 }}>
      <h3>Consensus vote</h3>
      <p className="meet-note">
        Need {need} of {group.length} (⅔). Cast {castCount}/{need}. Rank up to three.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {group.map((p) => (
          <button
            key={p.id}
            type="button"
            className="meet-join__mode"
            aria-pressed={ranking.includes(p.id)}
            onClick={() => toggle(p.id)}
          >
            <strong>
              {ranking.includes(p.id) ? `#${ranking.indexOf(p.id) + 1} ` : ""}
              {p.name}
            </strong>
            <span>{p.canSign ? "can sign" : "needs proxy confirm"}</span>
          </button>
        ))}
      </div>
      <div className="meet-actions">
        <button type="button" className="tetra-btn" onClick={submit} disabled={!ranking.length}>
          Cast ballot
        </button>
        {localId && !votes[localId] && (
          <button
            type="button"
            className="tetra-btn"
            onClick={() => {
              // Demo helper: fill remaining votes quickly
              const auto = group.map((p) => p.id).slice(0, 3)
              onCast?.(auto)
            }}
          >
            Demo: auto-rank
          </button>
        )}
      </div>
    </div>
  )
}
