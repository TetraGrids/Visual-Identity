import {
  PROCEDURES,
  VOTING_FORMATS,
  VOTING_FORMAT_META,
  procedureFor,
  hasCompleteProofs,
} from "./procedures.js"

/**
 * Meeting state machine
 *
 * Timeline (official start = meeting.startsAt):
 * - Registration: opens 24h before start
 * - Room open: 15 min before start
 * - Landing: 10 min from start (NOT part of the hour) — all must be present, then locked
 * - Procedure controls presentation, consensus, break, sharing, and round timing.
 * - Classic Club: 45 presentations → 15 consensus → gated 5 break → 10 sharing.
 */

export const PHASES = {
  LANDING: "landing",
  LOCKED: "locked",
  BREAKOUT: "breakout",
  PRESENTATIONS: "presentations",
  TRANSITION: "transition",
  DISCERNMENT: "discernment",
  VERIFY: "verify",
  RESULTS: "results",
  STAY: "stay",
  MAIN: "main",
  WAITING_BREAK: "waiting_break",
  BREAK: "break",
  SHARING: "sharing",
  ENDED: "ended",
  FAIL: "fail",
}

/** UI-facing stage labels for the top-left clock */
export const STAGE_LABEL = {
  [PHASES.LANDING]: "Landing",
  [PHASES.LOCKED]: "Locked",
  [PHASES.BREAKOUT]: "Breakouts",
  [PHASES.PRESENTATIONS]: "Presentations",
  [PHASES.TRANSITION]: "Transition",
  [PHASES.DISCERNMENT]: "Discernment",
  [PHASES.VERIFY]: "Verify",
  [PHASES.RESULTS]: "Results",
  [PHASES.STAY]: "Stay",
  [PHASES.MAIN]: "Main",
  [PHASES.WAITING_BREAK]: "Consensus complete",
  [PHASES.BREAK]: "Break time",
  [PHASES.SHARING]: "Sharing & wrap up",
  [PHASES.ENDED]: "Complete",
  [PHASES.FAIL]: "Failed",
}

/** Backward-compatible names while storage migrates from "format" to "votingFormat". */
export const FORMATS = VOTING_FORMATS
export const FORMAT_META = Object.fromEntries(
  Object.entries(VOTING_FORMAT_META).map(([id, meta]) => [
    id,
    {
      ...meta,
      money: id !== VOTING_FORMATS.ROUNDTABLE,
      awardPerLevel: id === VOTING_FORMATS.ROUNDTABLE_PAID,
    },
  ]),
)

export const SLOT_COUNT = 8

export const SPEAK_MS = 3.5 * 60 * 1000
export const WARN_MS = 4 * 60 * 1000
export const CUTOFF_MS = 5 * 60 * 1000
export const TRANSITION_MS = 15 * 1000
export const LANDING_MS = procedureFor(PROCEDURES.CLASSIC_CLUB).landingMs
export const SESSION_MS =
  procedureFor(PROCEDURES.CLASSIC_CLUB).presentationsMs +
  procedureFor(PROCEDURES.CLASSIC_CLUB).consensusMs
export const REGISTRATION_OPEN_MS = procedureFor(PROCEDURES.CLASSIC_CLUB).registrationMs
export const EARLY_ENTER_MS = procedureFor(PROCEDURES.CLASSIC_CLUB).earlyEntryMs
export const CHAT_NOTIFY_MS = 5 * 1000

/** Fixed ring angles: slot 0 = top center, then clockwise */
export function slotAngle(slotIndex) {
  return -Math.PI / 2 + (slotIndex * 2 * Math.PI) / SLOT_COUNT
}

export function consensusThreshold(n) {
  if (n < 4) return n
  return Math.round((2 * n) / 3)
}

/**
 * Ranked consensus (election, top 3, paid roundtable).
 * First is 3, second is 2, third is 1.
 * A place is won by floor(2n/3)+1 ballots on that place, or ceil(2/3) of the
 * points that place can hold (3n, 2n, or n).
 */
export function rankSnapshot(candidateIds, ballots) {
  const n = candidateIds.length
  const weight = [3, 2, 1]
  const votesToWin = Math.floor((2 * n) / 3) + 1
  const pointsToWin = weight.map((w) => Math.ceil((2 * w * n) / 3))
  const byId = {}
  for (const id of candidateIds) byId[id] = { id, points: 0, placeVotes: [0, 0, 0], place: 0, held: false }
  let cast = 0
  for (const ranking of ballots) {
    if (!ranking?.length) continue
    cast += 1
    for (let i = 0; i < 3 && i < ranking.length; i++) {
      const row = byId[ranking[i]]
      if (!row) continue
      row.points += weight[i]
      row.placeVotes[i] += 1
    }
  }
  const left = Math.max(0, n - cast)
  const rows = candidateIds.map((id) => byId[id])

  function claim(votes, points) {
    return votes * 100000 + points
  }

  const seated = []
  for (let place = 1; place <= 3; place++) {
    const open = rows.filter(
      (r) =>
        !seated.includes(r.id) &&
        (r.placeVotes[place - 1] >= votesToWin || r.points >= pointsToWin[place - 1]),
    )
    if (!open.length) break
    open.sort(
      (a, b) =>
        claim(b.placeVotes[place - 1], b.points) - claim(a.placeVotes[place - 1], a.points),
    )
    const lead = open[0]
    const now = claim(lead.placeVotes[place - 1], lead.points)
    const safe =
      left === 0 ||
      rows
        .filter((r) => !seated.includes(r.id))
        .every((r) => r.id === lead.id || claim(r.placeVotes[place - 1] + left, r.points + left * 3) < now)
    if (!safe) break
    lead.place = place
    lead.held = true
    seated.push(lead.id)
  }

  const taken = new Set(rows.filter((r) => r.held).map((r) => r.place))
  let g = 1
  for (const r of rows.filter((row) => !row.held && row.points > 0).sort((a, b) => b.points - a.points)) {
    while (taken.has(g)) g += 1
    if (g > 3) break
    r.place = g
    taken.add(g)
    g += 1
  }

  return {
    n,
    left,
    votesToWin,
    pointsToWin,
    rows,
    impossible:
      n > 0 &&
      !rows.some((r) => r.placeVotes[0] + left >= votesToWin || r.points + left * 3 >= pointsToWin[0]),
  }
}

export function needsBreakouts(participantCount) {
  return participantCount > 8
}

export function splitBreakouts(participantIds) {
  const n = participantIds.length
  if (n <= 8) return [participantIds.slice()]

  const groups = []
  let remaining = participantIds.slice()
  while (remaining.length > 0) {
    if (remaining.length <= 8) {
      if (remaining.length < 4 && groups.length > 0) {
        let i = 0
        while (remaining.length) {
          groups[i % groups.length].push(remaining.shift())
          i++
        }
      } else {
        groups.push(remaining.splice(0, remaining.length))
      }
      break
    }
    const take = remaining.length - 6 >= 4 || remaining.length - 6 === 0 ? 6 : 5
    groups.push(remaining.splice(0, take))
  }
  return groups
}

export function createInitialMeetingState({
  format = FORMATS.ELECTION,
  procedure = PROCEDURES.CLASSIC_CLUB,
  participants = [],
  now = Date.now(),
  advanceConfig = null,
  roles = [],
} = {}) {
  const timing = procedureFor(procedure)
  return {
    phase: PHASES.LANDING,
    format,
    votingFormat: format,
    procedure,
    timing,
    advanceConfig,
    roles,
    round: 1,
    startedAt: now,
    landingEndsAt: timing.landingMs != null ? now + timing.landingMs : null,
    sessionEndsAt: null,
    phaseEndsAt: null,
    presentationsStartedAt: null,
    discernmentStartedAt: null,
    participants,
    breakouts: null,
    activeGroupIndex: 0,
    speakerId: null,
    speakerStartedAt: null,
    speakEndsAt: null,
    timeCuts: {},
    timeAdds: {},
    mutedIds: [],
    screenShareId: null, // participant id sharing screen (demo toggle)
    /** Speak order mapped onto fixed 8 slots; index 0 = active/top */
    slots: assignSlots(participants.filter((p) => !p.watcher).map((p) => p.id)),
    spokenIds: [],
    doneArmed: false,
    transitionEndsAt: null,
    votes: {},
    positions: null,
    failed: false,
    failReason: null,
    notifications: [],
    locked: false,
    paused: false,
    pausedAt: null,
    completedGroupIds: [],
    returnedToMainIds: [],
    waitingLocation: "breakout",
  }
}

/** Place ids into first N of 8 slots (not evenly redistributed). */
export function assignSlots(ids) {
  const slots = Array(SLOT_COUNT).fill(null)
  ids.slice(0, SLOT_COUNT).forEach((id, i) => {
    slots[i] = id
  })
  return slots
}

export function reduceMeeting(state, action) {
  switch (action.type) {
    case "TICK": {
      if (state.paused) return state
      const t = action.now
      if (state.phase === PHASES.LANDING && state.landingEndsAt && t >= state.landingEndsAt) {
        return { ...state, phase: PHASES.LOCKED, locked: true }
      }
      if (state.phase === PHASES.PRESENTATIONS && state.speakerStartedAt != null) {
        const end = state.speakEndsAt || state.speakerStartedAt + CUTOFF_MS
        if (t >= end) {
          return passToNext({ ...state, doneArmed: false }, t)
        }
      }
      if (state.phase === PHASES.TRANSITION && state.transitionEndsAt && t >= state.transitionEndsAt) {
        const nextId = nextFromSlots(state)
        return startSpeaker(state, nextId, t)
      }
      if (
        state.phase === PHASES.PRESENTATIONS &&
        state.phaseEndsAt &&
        t >= state.phaseEndsAt
      ) {
        return beginDiscernment(state, t)
      }
      if (
        (state.phase === PHASES.DISCERNMENT || state.phase === PHASES.VERIFY) &&
        state.phaseEndsAt &&
        t >= state.phaseEndsAt
      ) {
        return failMeeting(state, "Consensus time ended without verified consensus")
      }
      if (state.phase === PHASES.BREAK && state.phaseEndsAt && t >= state.phaseEndsAt) {
        return beginSharing(state, t)
      }
      if (state.phase === PHASES.SHARING && state.phaseEndsAt && t >= state.phaseEndsAt) {
        return finishRound(state, t)
      }
      return state
    }
    case "READY": {
      // During landing / locked: mark present. Start presentations only via START_PRESENTATIONS.
      const participants = state.participants.map((p) =>
        p.id === action.participantId ? { ...p, ready: true } : p,
      )
      return { ...state, participants }
    }
    case "START_PRESENTATIONS":
    case "START_ALL_DEMO":
      if (state.paused) return state
      return beginSession(
        {
          ...state,
          participants: state.participants.map((p) =>
            action.type === "START_ALL_DEMO" ? { ...p, ready: true } : p,
          ),
        },
        action.now || Date.now(),
      )
    case "CLAIM_ACTIVE": {
      // Drag own icon onto top active slot (0)
      const id = action.participantId
      if (!id || id === state.speakerId) return state
      const slots = state.slots.slice()
      const from = slots.indexOf(id)
      if (from < 0) return state
      const prevActive = slots[0]
      slots[from] = null
      // shift everyone toward the hole, put claimer in 0
      if (prevActive && prevActive !== id) {
        // insert previous active into first empty after 0, or swap
        slots[0] = id
        const empty = slots.findIndex((s, i) => i > 0 && s == null)
        if (empty >= 0) slots[empty] = prevActive
        else {
          // push prev into from
          slots[from] = prevActive
        }
      } else {
        slots[0] = id
      }
      // If already presenting, claiming active queues as next by rotating speaker
      if (state.phase === PHASES.PRESENTATIONS && state.speakerId) {
        return {
          ...state,
          slots,
          notifications: pushNote(state, `${nameOf(state, id)} claimed next`, action.now),
        }
      }
      return { ...state, slots, speakerId: id }
    }
    case "MOVE_SLOT": {
      const { participantId, toSlot } = action
      if (toSlot < 0 || toSlot >= SLOT_COUNT) return state
      const slots = state.slots.slice()
      const from = slots.indexOf(participantId)
      if (from < 0 || from === toSlot) return state
      const target = slots[toSlot]
      slots[toSlot] = participantId
      slots[from] = target
      return { ...state, slots }
    }
    case "DONE_PRESENTING":
      if (state.speakerId !== action.participantId) return state
      if (!state.doneArmed) return { ...state, doneArmed: true }
      return passToNext({ ...state, doneArmed: false }, action.now || Date.now())
    case "CAST_VOTE": {
      if (state.phase !== PHASES.DISCERNMENT) return state
      if (!action.participantId || !action.ranking?.length) return state
      if (state.votes[action.participantId]) return state
      const votes = { ...state.votes, [action.participantId]: action.ranking }
      return tryResolveVotes({ ...state, votes })
    }
    case "SET_SCREEN_SHARE":
      return { ...state, screenShareId: action.participantId || null }
    case "ADJUST_TIME": {
      if (state.paused) return state
      const t = action.now || Date.now()
      if (state.phase === PHASES.PRESENTATIONS && state.speakerId && state.speakerStartedAt != null) {
        const cuts = state.timeCuts || {}
        const adds = state.timeAdds || {}
        const end = state.speakEndsAt || state.speakerStartedAt + CUTOFF_MS
        if (action.delta < 0) {
          if ((cuts[state.speakerId] || 0) >= 2) return state
          return {
            ...state,
            speakEndsAt: Math.max(t + 1000, end + action.delta),
            timeCuts: { ...cuts, [state.speakerId]: (cuts[state.speakerId] || 0) + 1 },
          }
        }
        if ((adds[state.speakerId] || 0) >= 4) return state
        return {
          ...state,
          speakEndsAt: Math.max(t + 1000, end + action.delta),
          timeAdds: { ...adds, [state.speakerId]: (adds[state.speakerId] || 0) + 1 },
        }
      }
      if (state.phase === PHASES.TRANSITION && state.transitionEndsAt) {
        return { ...state, transitionEndsAt: Math.max(t + 1000, state.transitionEndsAt + action.delta) }
      }
      return state
    }
    case "END_TURN":
      if (state.paused || state.phase !== PHASES.PRESENTATIONS) return state
      return passToNext(state, action.now || Date.now())
    case "TOGGLE_PAUSE": {
      const t = action.now || Date.now()
      if (!state.paused) return { ...state, paused: true, pausedAt: t }
      const shift = (n) => (typeof n === "number" ? n + (t - state.pausedAt) : n)
      return {
        ...state,
        paused: false,
        pausedAt: null,
        landingEndsAt: shift(state.landingEndsAt),
        speakEndsAt: shift(state.speakEndsAt),
        speakerStartedAt: shift(state.speakerStartedAt),
        transitionEndsAt: shift(state.transitionEndsAt),
        sessionEndsAt: shift(state.sessionEndsAt),
        phaseEndsAt: shift(state.phaseEndsAt),
        presentationsStartedAt: shift(state.presentationsStartedAt),
        discernmentStartedAt: shift(state.discernmentStartedAt),
      }
    }
    case "SET_MUTED": {
      const ids = state.mutedIds || []
      const has = ids.includes(action.participantId)
      if (!action.muted && state.paused) {
        const who = state.participants.find((p) => p.id === action.participantId)
        if (!who?.isLocal) return state
      }
      if (action.muted && !has) return { ...state, mutedIds: [...ids, action.participantId] }
      if (!action.muted && has) return { ...state, mutedIds: ids.filter((id) => id !== action.participantId) }
      return state
    }
    case "NOTIFY":
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: action.id || `n-${Date.now()}`,
            text: action.text,
            expiresAt: (action.now || Date.now()) + CHAT_NOTIFY_MS,
          },
        ],
      }
    case "CLEAR_NOTIFY":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.id && n.expiresAt > (action.now || Date.now()),
        ),
      }
    case "FORCE_PHASE": {
      const next = { ...state, phase: action.phase }
      if (action.phase === PHASES.PRESENTATIONS && !next.presentationsStartedAt) {
        return beginPresentations(next, action.now || Date.now())
      }
      if (action.phase === PHASES.DISCERNMENT) {
        return beginDiscernment(next, action.now || Date.now())
      }
      return next
    }
    case "STAY_IN_GROUP":
      return { ...state, phase: PHASES.STAY }
    case "RETURN_TO_MAIN":
      return { ...state, phase: PHASES.MAIN, speakerId: null, speakerStartedAt: null }
    case "WAIT_IN_GROUP":
      return { ...state, waitingLocation: "breakout" }
    case "WAIT_IN_MAIN":
      return { ...state, waitingLocation: "main", speakerId: null, speakerStartedAt: null }
    case "FAIL":
      return failMeeting(state, action.reason || "Consensus not reached")
    case "VERIFY_OK":
      return completeCurrentGroup(
        {
          ...state,
          positions: action.positions || state.positions,
        },
        action.now || Date.now(),
      )
    case "MARK_GROUP_COMPLETE":
      return completeGroup(state, action.groupIndex ?? state.activeGroupIndex, action.now || Date.now())
    case "MARK_ALL_GROUPS_COMPLETE": {
      const count = Math.max(1, state.breakouts?.length || 1)
      const completedGroupIds = Array.from({ length: count }, (_, i) => i)
      return beginBreak({ ...state, completedGroupIds }, action.now || Date.now())
    }
    case "START_BREAK":
      return allGroupsComplete(state)
        ? beginBreak(state, action.now || Date.now())
        : { ...state, phase: PHASES.WAITING_BREAK }
    case "START_SHARING":
      return beginSharing(state, action.now || Date.now())
    case "END_SHARING":
      return finishRound(state, action.now || Date.now())
    case "RESEED":
      return createInitialMeetingState({
        format: action.format || state.format,
        procedure: action.procedure || state.procedure,
        participants: action.participants || state.participants,
        now: action.now || Date.now(),
        advanceConfig: state.advanceConfig,
        roles: state.roles,
      })
    default:
      return state
  }
}

function pushNote(state, text, now) {
  return [
    ...state.notifications,
    { id: `n-${now || Date.now()}`, text, expiresAt: (now || Date.now()) + CHAT_NOTIFY_MS },
  ]
}

function nameOf(state, id) {
  return state.participants.find((p) => p.id === id)?.name || id
}

function beginSession(state, now) {
  const ids = state.participants.filter((p) => !p.watcher).map((p) => p.id)
  const breakouts = needsBreakouts(ids.length) ? splitBreakouts(ids) : [ids]
  const group = breakouts[0] || []
  const slots = assignSlots(group)
  const base = {
    ...state,
    locked: true,
    breakouts,
    activeGroupIndex: 0,
    slots,
    requests: undefined,
    queue: undefined,
  }
  if (needsBreakouts(ids.length)) {
    return { ...base, phase: PHASES.BREAKOUT, speakerId: null, speakerStartedAt: null }
  }
  return beginPresentations(base, now)
}

function beginPresentations(state, now) {
  const group = state.breakouts?.[state.activeGroupIndex] || state.slots.filter(Boolean)
  const slots = state.slots?.some(Boolean) ? state.slots.slice() : assignSlots(group)
  const speakerId = slots[0] || group[0] || null
  const timing = state.timing || procedureFor(state.procedure)
  return {
    ...state,
    phase: PHASES.PRESENTATIONS,
    presentationsStartedAt: now,
    sessionEndsAt:
      timing.timed && timing.presentationsMs != null && timing.consensusMs != null
        ? now + timing.presentationsMs + timing.consensusMs
        : null,
    phaseEndsAt: timing.timed && timing.presentationsMs != null ? now + timing.presentationsMs : null,
    speakerId,
    speakerStartedAt: now,
    speakEndsAt: now + CUTOFF_MS,
    slots,
    doneArmed: false,
    transitionEndsAt: null,
  }
}

function beginDiscernment(state, now) {
  const timing = state.timing || procedureFor(state.procedure)
  return {
    ...state,
    phase: PHASES.DISCERNMENT,
    discernmentStartedAt: now,
    phaseEndsAt: timing.timed && timing.consensusMs != null ? now + timing.consensusMs : null,
    speakerId: null,
    speakerStartedAt: null,
    speakEndsAt: null,
    doneArmed: false,
    transitionEndsAt: null,
  }
}

function startSpeaker(state, speakerId, now) {
  if (!speakerId) return beginDiscernment(state, now)
  const slots = rotateSpeakerToFront(state.slots, speakerId)
  return {
    ...state,
    phase: PHASES.PRESENTATIONS,
    speakerId,
    speakerStartedAt: now,
    speakEndsAt: now + CUTOFF_MS,
    slots,
    doneArmed: false,
    transitionEndsAt: null,
  }
}

function rotateSpeakerToFront(slots, speakerId) {
  const next = slots.slice()
  const idx = next.indexOf(speakerId)
  if (idx <= 0) {
    if (idx < 0) {
      // place in first empty or slot 0
      const empty = next.findIndex((s) => s == null)
      if (empty >= 0) next[empty] = next[0]
      next[0] = speakerId
    }
    return next
  }
  const prev = next[0]
  next[0] = speakerId
  next[idx] = prev
  return next
}

function nextFromSlots(state) {
  // next occupied slot after 0
  for (let i = 1; i < SLOT_COUNT; i++) {
    if (state.slots[i]) return state.slots[i]
  }
  return null
}

function turnSlots(slots) {
  const prev = slots
  return prev.map((_, i) => prev[(i + 1) % prev.length])
}

function passToNext(state, now) {
  const spoken = new Set(state.spokenIds || [])
  if (state.speakerId) spoken.add(state.speakerId)
  const waiting = (state.slots || []).some((id) => id && !spoken.has(id))
  let slots = turnSlots(state.slots)
  if (!waiting) {
    return beginDiscernment({ ...state, slots, spokenIds: [...spoken] }, now)
  }
  let guard = 0
  while (!slots[0] && guard < SLOT_COUNT) {
    slots = turnSlots(slots)
    guard++
  }
  const nextId = slots[0]
  if (!nextId || spoken.has(nextId)) {
    return beginDiscernment({ ...state, slots, spokenIds: [...spoken] }, now)
  }
  return {
    ...state,
    phase: PHASES.PRESENTATIONS,
    speakerId: nextId,
    speakerStartedAt: now,
    speakEndsAt: now + CUTOFF_MS,
    slots,
    spokenIds: [...spoken],
    doneArmed: false,
    transitionEndsAt: null,
  }
}

function tryResolveVotes(state) {
  const group = (state.breakouts?.[state.activeGroupIndex] || state.slots.filter(Boolean)).filter(Boolean)
  const candidates = eligibleCandidateIds(state, group)
  if (!FORMAT_META[state.format]?.rankedConsensus) return resolveHeadcount(state, group, candidates)
  if (!candidates.length) return state
  const ballots = group.map((id) => state.votes[id]).filter((ranking) => ranking?.length)
  const snap = rankSnapshot(candidates, ballots)
  if (snap.impossible) {
    return failMeeting({ ...state, votes: {} }, "Locked ballots cannot reach consensus")
  }
  const held = snap.rows.filter((r) => r.held).sort((a, b) => a.place - b.place)
  if (snap.left === 0) {
    if (!held.some((r) => r.place === 1)) {
      return failMeeting({ ...state, votes: {} }, "Locked ballots cannot reach consensus")
    }
    const ids = held.map((r) => r.id)
    const rest = snap.rows.filter((r) => !ids.includes(r.id)).sort((a, b) => b.points - a.points)
    for (const r of rest) {
      if (ids.length >= Math.min(advanceCount(state, candidates.length), candidates.length)) break
      ids.push(r.id)
    }
    return {
      ...state,
      phase: PHASES.VERIFY,
      positions: ids.map((id, i) => ({ place: i + 1, participantId: id })),
    }
  }
  if (held.length >= Math.min(advanceCount(state, candidates.length), candidates.length)) {
    return {
      ...state,
      phase: PHASES.VERIFY,
      positions: held.map((r) => ({ place: r.place, participantId: r.id })),
    }
  }
  return state
}

function resolveHeadcount(state, group, candidates = group) {
  const need = consensusThreshold(group.length)
  const ballots = Object.entries(state.votes).filter(([id]) => group.includes(id))
  if (ballots.length < need) return state

  const first = {}
  for (const [, ranking] of ballots) {
    const top = ranking?.[0]
    if (top && candidates.includes(top)) first[top] = (first[top] || 0) + 1
  }
  const sorted = Object.entries(first).sort((a, b) => b[1] - a[1])
  if (!sorted.length || sorted[0][1] < need) return state

  const pos1 = sorted[0][0]
  const secondTally = {}
  for (const [, ranking] of ballots) {
    const s = ranking?.[1]
    if (s && s !== pos1) secondTally[s] = (secondTally[s] || 0) + 1
  }
  const pos2 = Object.entries(secondTally).sort((a, b) => b[1] - a[1])[0]?.[0] || null
  const thirdTally = {}
  for (const [, ranking] of ballots) {
    const s = ranking?.[2]
    if (s && s !== pos1 && s !== pos2) thirdTally[s] = (thirdTally[s] || 0) + 1
  }
  const pos3 = Object.entries(thirdTally).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  const positions = [
    { place: 1, participantId: pos1 },
    pos2 && { place: 2, participantId: pos2 },
    pos3 && { place: 3, participantId: pos3 },
  ].filter(Boolean).slice(0, advanceCount(state, candidates.length))

  return { ...state, phase: PHASES.VERIFY, positions }
}

export function eligibleCandidateIds(state, groupIds) {
  if (state.format !== VOTING_FORMATS.ROLE_ELECTION) return groupIds
  return groupIds.filter((id) => {
    const participant = state.participants.find((p) => p.id === id)
    return hasCompleteProofs(participant?.proofs)
  })
}

export function advanceCount(state, groupSize) {
  switch (state.format) {
    case VOTING_FORMATS.TOP3:
      return Math.min(3, groupSize)
    case VOTING_FORMATS.MULTI_ROLE:
      return Math.min(Math.max(1, state.roles?.length || 1), groupSize)
    case VOTING_FORMATS.CREAM_OF_CROP: {
      const config = state.advanceConfig || {}
      if (config.mode === "ratio") {
        return Math.max(1, Math.min(groupSize, Math.ceil(groupSize * Number(config.value || 0.5))))
      }
      return Math.max(1, Math.min(groupSize, Number(config.value || 2)))
    }
    case VOTING_FORMATS.ELECTION:
    case VOTING_FORMATS.ROLE_ELECTION:
      return 1
    default:
      return Math.min(3, groupSize)
  }
}

export function allGroupsComplete(state) {
  const count = Math.max(1, state.breakouts?.length || 1)
  return (state.completedGroupIds || []).length >= count
}

function completeCurrentGroup(state, now) {
  return completeGroup(state, state.activeGroupIndex || 0, now)
}

function completeGroup(state, groupIndex, now) {
  const completedGroupIds = Array.from(
    new Set([...(state.completedGroupIds || []), groupIndex]),
  )
  const next = {
    ...state,
    completedGroupIds,
    phase: PHASES.WAITING_BREAK,
    phaseEndsAt: null,
    speakerId: null,
    speakerStartedAt: null,
  }
  return allGroupsComplete(next) ? beginBreak(next, now) : next
}

function beginBreak(state, now) {
  const timing = state.timing || procedureFor(state.procedure)
  if (!allGroupsComplete(state)) {
    return { ...state, phase: PHASES.WAITING_BREAK, phaseEndsAt: null }
  }
  if (!timing.timed || timing.breakMs == null) {
    return { ...state, phase: PHASES.MAIN, phaseEndsAt: null }
  }
  return {
    ...state,
    phase: PHASES.BREAK,
    phaseEndsAt: now + timing.breakMs,
    returnedToMainIds: state.participants.filter((p) => !p.watcher).map((p) => p.id),
    waitingLocation: "main",
    activeGroupIndex: 0,
    speakerId: null,
    speakerStartedAt: null,
    mutedIds: [],
  }
}

function beginSharing(state, now) {
  const timing = state.timing || procedureFor(state.procedure)
  if (!timing.timed || timing.sharingMs == null) {
    return { ...state, phase: PHASES.MAIN, phaseEndsAt: null }
  }
  return {
    ...state,
    phase: PHASES.SHARING,
    phaseEndsAt: now + timing.sharingMs,
    speakerId: null,
    speakerStartedAt: null,
    mutedIds: [],
  }
}

function finishRound(state, now) {
  const hadMoreThanTwoGroups = (state.breakouts?.length || 1) > 2
  if (state.round === 1 && hadMoreThanTwoGroups) {
    const positionIds = (state.positions || []).map((p) => p.participantId)
    const otherWinners = (state.breakouts || [])
      .filter((_, i) => i !== state.activeGroupIndex)
      .map((group) => group[0])
      .filter(Boolean)
    const selected = Array.from(new Set([...positionIds, ...otherWinners]))
    const fallback = state.participants.filter((p) => !p.watcher).map((p) => p.id)
    const roundIds = selected.length >= 2 ? selected : fallback
    const breakouts = splitBreakouts(roundIds)
    const slots = assignSlots(breakouts[0] || roundIds)
    return beginPresentations(
      {
        ...state,
        round: 2,
        breakouts,
        activeGroupIndex: 0,
        slots,
        spokenIds: [],
        votes: {},
        positions: null,
        completedGroupIds: [],
        returnedToMainIds: [],
        presentationsStartedAt: null,
        discernmentStartedAt: null,
        sessionEndsAt: null,
        notifications: pushNote(state, "Round 2 started", now),
      },
      now,
    )
  }
  return {
    ...state,
    phase: PHASES.ENDED,
    phaseEndsAt: null,
    sessionEndsAt: null,
    speakerId: null,
    speakerStartedAt: null,
    mutedIds: [],
  }
}

function failMeeting(state, reason) {
  return {
    ...state,
    phase: PHASES.FAIL,
    failed: true,
    failReason: reason,
  }
}

/** User-created or live-demo rooms (not seeded recurring templates). */
export function isAdHocMeeting(meeting) {
  return Boolean(meeting && !meeting.recurring)
}

/** Registration opens 24h before start, until start. */
export function canRegister(meeting, now = Date.now()) {
  if (!meeting?.startsAt) return true
  const timing = procedureFor(meeting.procedure)
  const open = meeting.startsAt - timing.registrationMs
  return now >= open && now < meeting.startsAt
}

/**
 * Participate from 15 min before start through the end of the 10-minute landing.
 * After that, members are locked. Watchers can still enter.
 */
export function canJoinMeeting(meeting, now = Date.now(), options = {}) {
  if (!meeting?.startsAt) return true
  if (
    options.relaxTiming &&
    isAdHocMeeting(meeting) &&
    (meeting.status === "active" || meeting.id === "demo-now")
  ) {
    return true
  }
  if (meeting.status === "active" && meeting.id === "demo-now") return true
  const timing = procedureFor(meeting.procedure)
  const open = meeting.startsAt - timing.earlyEntryMs
  const lockAt = meeting.startsAt + timing.landingMs
  return now >= open && now < lockAt
}

/** Watchers may enter through the session, including after members lock. */
export function canWatchMeeting(meeting, now = Date.now(), options = {}) {
  if (!meeting?.startsAt) return true
  if (
    options.relaxTiming &&
    isAdHocMeeting(meeting) &&
    (meeting.status === "active" || meeting.id === "demo-now")
  ) {
    return true
  }
  if (meeting.status === "active" && meeting.id === "demo-now") return true
  const timing = procedureFor(meeting.procedure)
  const open = meeting.startsAt - timing.earlyEntryMs
  if (!timing.timed) return now >= open
  const end =
    meeting.startsAt +
    timing.landingMs +
    timing.presentationsMs +
    timing.consensusMs +
    timing.breakMs +
    timing.sharingMs
  return now >= open && now < end
}

/** Stage progress for top-left clock */
export function stageProgress(state, now = Date.now()) {
  const label = STAGE_LABEL[state.phase] || state.phase
  if (state.phase === PHASES.LANDING) {
    const total = state.timing?.landingMs || LANDING_MS
    const left = state.landingEndsAt ? Math.max(0, state.landingEndsAt - now) : null
    return { label, left, total, progress: left == null ? 1 : left / total }
  }
  if (
    state.phase === PHASES.LOCKED ||
    state.phase === PHASES.BREAKOUT ||
    state.phase === PHASES.WAITING_BREAK ||
    state.phase === PHASES.MAIN
  ) {
    return { label, left: null, total: null, progress: 0 }
  }
  if (state.phase === PHASES.ENDED) {
    return { label, left: null, total: null, progress: 1, ended: true }
  }
  if (state.phaseEndsAt) {
    const durations = {
      [PHASES.PRESENTATIONS]: state.timing?.presentationsMs,
      [PHASES.TRANSITION]: TRANSITION_MS,
      [PHASES.DISCERNMENT]: state.timing?.consensusMs,
      [PHASES.VERIFY]: state.timing?.consensusMs,
      [PHASES.BREAK]: state.timing?.breakMs,
      [PHASES.SHARING]: state.timing?.sharingMs,
    }
    const total = Math.max(1, durations[state.phase] || state.phaseEndsAt - now)
    const left = Math.max(0, state.phaseEndsAt - now)
    return { label, left, total, progress: left / total }
  }
  return { label, left: null, total: null, progress: 1 }
}
