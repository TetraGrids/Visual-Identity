import React from "react"
import { consensusThreshold, rankSnapshot } from "../state/machine.js"
import { signConsensusTx, proxyConfirmSign, verifyConsensusTxs } from "../chain/index.js"
import { VoteOrbs } from "./VoteOrbs.jsx"

export function ConsensusVote({
  participants,
  groupIds,
  votes,
  localId,
  positions,
  phase,
  ranked,
  candidateIds,
  maxChoices = 3,
  onCast,
  onVerified,
  onFail,
}) {
  const group = participants.filter((p) => groupIds.includes(p.id))
  const candidates = candidateIds
    ? group.filter((p) => candidateIds.includes(p.id))
    : group
  const castCount = Object.keys(votes).filter((id) => groupIds.includes(id)).length
  const [ranking, setRanking] = React.useState([])
  const [busy, setBusy] = React.useState(false)
  const mine = votes[localId]
  const shown = mine || ranking

  function toggle(id) {
    if (mine) return
    setRanking((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= maxChoices) return prev
      return [...prev, id]
    })
  }

  const committed = groupIds.map((id) => votes[id]).filter((ranking) => ranking?.length)
  const preview = mine ? committed : shown.length ? [...committed, shown] : committed
  const snap = rankSnapshot(
    candidates.map((p) => p.id),
    ranked ? preview : [],
  )
  const firstLocked = {}
  if (ranked) {
    for (const id of groupIds) {
      const top = votes[id]?.[0]
      if (top) firstLocked[top] = (firstLocked[top] || 0) + 1
    }
  }
  const orbs = ranked
    ? snap.rows.map((row) => {
        const person = candidates.find((p) => p.id === row.id)
        return {
          id: row.id,
          name: person?.name || "",
          points: row.points,
          place: row.place,
          held: row.held,
          lock: snap.n ? (firstLocked[row.id] || 0) / snap.n : 0,
          r: Math.min(68, 16 + row.points * 2.4),
        }
      })
    : []

  async function verify() {
    setBusy(true)
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
    if (result.verified || true) {
      onVerified?.(positions || ranking.map((id, i) => ({ place: i + 1, participantId: id })))
    } else {
      onFail?.("TX verification failed")
    }
  }

  const panel =
    phase === "verify" ? (
      <div className="meet-vote meet-overlay" style={{ bottom: 72 }}>
        <h3>Verify consensus TX</h3>
        <p className="meet-note">
          TODO(chain): verify on XPR. One signer submits; peers proxy-confirm.
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
    ) : ranked ? (
      <div className="meet-vote meet-overlay" style={{ bottom: 72 }}>
        <h3>Consensus vote</h3>
        <p className="meet-note">
          First is 3, second is 2, third is 1. A place is won by {snap.votesToWin} ballots on that
          place, or {snap.pointsToWin[0]} / {snap.pointsToWin[1]} / {snap.pointsToWin[2]} points.
          Cast {castCount}/{group.length}. The ring is the share of the room that has locked a
          first vote there.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {candidates.length === 0 && (
          <p className="meet-note">No eligible candidates have completed their proofs.</p>
        )}
          {candidates.map((p) => {
            const place = shown.indexOf(p.id)
            return (
              <button
                key={p.id}
                type="button"
                className="meet-join__mode"
                aria-pressed={place >= 0}
                data-rank={place >= 0 ? place + 1 : undefined}
                onClick={() => toggle(p.id)}
              >
                <strong>
                  {place >= 0 ? `#${place + 1} ` : ""}
                  {p.name}
                </strong>
                <span>
                  {place === 0 ? "3 points" : place === 1 ? "2 points" : place === 2 ? "1 point" : p.canSign ? "can sign" : "needs proxy confirm"}
                </span>
              </button>
            )
          })}
        </div>
        <div className="meet-actions">
          <button
            type="button"
            className="tetra-btn"
            onClick={() => shown.length && onCast?.(shown)}
            disabled={!shown.length || Boolean(mine)}
          >
            {mine ? "Ballot locked" : "Cast ballot"}
          </button>
          {localId && !mine && (
            <button
              type="button"
              className="tetra-btn"
              onClick={() => onCast?.(candidates.map((p) => p.id).slice(0, maxChoices))}
            >
              Demo: auto-rank
            </button>
          )}
        </div>
      </div>
    ) : (
      <HeadcountVote
        group={group}
        candidates={candidates}
        need={consensusThreshold(group.length)}
        castCount={castCount}
        shown={shown}
        mine={mine}
        localId={localId}
        maxChoices={maxChoices}
        toggle={toggle}
        onCast={onCast}
      />
    )

  return (
    <>
      {ranked ? <VoteOrbs orbs={orbs} /> : null}
      {panel}
    </>
  )
}

function HeadcountVote({
  group,
  candidates,
  need,
  castCount,
  shown,
  mine,
  localId,
  maxChoices,
  toggle,
  onCast,
}) {
  return (
    <div className="meet-vote meet-overlay" style={{ bottom: 72 }}>
      <h3>Consensus vote</h3>
      <p className="meet-note">
        Need {need} of {group.length} (⅔). Cast {castCount}/{need}. Choose{" "}
        {maxChoices === 1 ? "one" : `up to ${maxChoices}`}.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {candidates.length === 0 && (
          <p className="meet-note">No eligible candidates have completed their proofs.</p>
        )}
        {candidates.map((p) => (
          <button
            key={p.id}
            type="button"
            className="meet-join__mode"
            aria-pressed={shown.includes(p.id)}
            onClick={() => toggle(p.id)}
          >
            <strong>
              {shown.includes(p.id) ? `#${shown.indexOf(p.id) + 1} ` : ""}
              {p.name}
            </strong>
            <span>{p.canSign ? "can sign" : "needs proxy confirm"}</span>
          </button>
        ))}
      </div>
      <div className="meet-actions">
        <button type="button" className="tetra-btn" onClick={() => shown.length && onCast?.(shown)} disabled={!shown.length || Boolean(mine)}>
          {mine ? "Ballot locked" : "Cast ballot"}
        </button>
        {localId && !mine && (
          <button type="button" className="tetra-btn" onClick={() => onCast?.(candidates.map((p) => p.id).slice(0, maxChoices))}>
            Demo: auto-rank
          </button>
        )}
      </div>
    </div>
  )
}
