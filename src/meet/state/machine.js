/**
 * Meeting state machine — landing → ready → (breakouts) → wheel → vote → results|fail
 *
 * Timing (wall-clock in production; demo can accelerate via opts.demoSpeed):
 * - Landing: 10 minutes
 * - Speak: 3:30 soft, warn at 4:00, hard cut at 5:00
 * - Transition: 15 seconds all unmuted
 * - Group consensus window: 60 minutes
 * - Late join cutoff: 10 minutes after start
 *
 * Consensus threshold: ceil(2n/3) — 4→3, 5→4→ wait plan said round(2n/3): 4→3, 5→3.
 * Using Math.ceil(2n/3) which gives 4→3, 5→4, 6→4, 7→5, 8→6.
 * Plan examples: "four is the minimum and consensus would be three", "group of five would require three".
 * That is Math.round(2n/3) with .5 rounding... round(10/3)=3 for n=5. Yes Math.round(2*n/3).
 * For n=4: round(8/3)=round(2.666)=3. Good.
 */

export const PHASES = {
  LANDING: "landing",
  READY: "ready",
  BREAKOUT: "breakout",
  WHEEL: "wheel",
  TRANSITION: "transition",
  VOTE: "vote",
  VERIFY: "verify",
  RESULTS: "results",
  FAIL: "fail",
}

export const FORMATS = {
  ELECTION: "election",
  TOP3: "top3",
  ROUNDTABLE: "roundtable",
  ROUNDTABLE_PAID: "roundtable_paid",
}

export const FORMAT_META = {
  [FORMATS.ELECTION]: {
    label: "Election",
    blurb: "One winner of the final. Candidates advance per group Top 3.",
    advancesPerGroup: 3,
    money: true,
    awardPerLevel: false,
  },
  [FORMATS.TOP3]: {
    label: "Top 3",
    blurb: "Top three advance per group. Contributors Club share model.",
    advancesPerGroup: 3,
    money: true,
    awardPerLevel: false,
    shareModel: "contributors_club", // TODO(chain): share payout wiring
  },
  [FORMATS.ROUNDTABLE]: {
    label: "Roundtable",
    blurb: "No money. Anyone can open one.",
    advancesPerGroup: 0,
    money: false,
    awardPerLevel: false,
  },
  [FORMATS.ROUNDTABLE_PAID]: {
    label: "Roundtable + Awards",
    blurb: "Award per level won (as many levels as winners ≥ 2).",
    advancesPerGroup: 0,
    money: true,
    awardPerLevel: true,
  },
}

/** Soft speak target, warn, hard cut — milliseconds */
export const SPEAK_MS = 3.5 * 60 * 1000
export const WARN_MS = 4 * 60 * 1000
export const CUTOFF_MS = 5 * 60 * 1000
export const TRANSITION_MS = 15 * 1000
export const LANDING_MS = 10 * 60 * 1000
export const GROUP_LIMIT_MS = 60 * 60 * 1000
export const LATE_JOIN_MS = 10 * 60 * 1000
export const CHAT_NOTIFY_MS = 5 * 1000

export function consensusThreshold(n) {
  if (n < 4) return n // below minimum group size; still require all present
  return Math.round((2 * n) / 3)
}

export function needsBreakouts(participantCount) {
  return participantCount > 8
}

/** Split into groups of 4–8. Prefer ~6 when possible. */
export function splitBreakouts(participantIds) {
  const n = participantIds.length
  if (n <= 8) return [participantIds.slice()]

  const groups = []
  let remaining = participantIds.slice()
  while (remaining.length > 0) {
    if (remaining.length <= 8) {
      if (remaining.length < 4 && groups.length > 0) {
        // fold remainder into last groups evenly
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
    // take 6, leave enough for valid groups
    const take = remaining.length - 6 >= 4 || remaining.length - 6 === 0 ? 6 : 5
    groups.push(remaining.splice(0, take))
  }
  return groups
}

export function createInitialMeetingState({ format = FORMATS.ELECTION, participants = [], now = Date.now() } = {}) {
  return {
    phase: PHASES.LANDING,
    format,
    startedAt: now,
    landingEndsAt: now + LANDING_MS,
    groupLimitEndsAt: null,
    participants, // { id, name, avatarUrl?, letter, ready, isLocal, canSign }
    breakouts: null, // string[][] of ids
    activeGroupIndex: 0,
    speakerId: null,
    speakerStartedAt: null,
    queue: [], // remaining speak order (clockwise)
    requests: [], // drag-to-front requesters; first = largest in radial cluster
    doneArmed: false,
    transitionEndsAt: null,
    votes: {}, // participantId -> ranked [id,id,id]
    positions: null, // [{ place, participantId }]
    failed: false,
    failReason: null,
    notifications: [],
  }
}

export function reduceMeeting(state, action) {
  switch (action.type) {
    case "TICK": {
      const t = action.now
      if (state.phase === PHASES.LANDING && t >= state.landingEndsAt) {
        return { ...state, phase: PHASES.READY }
      }
      if (state.phase === PHASES.WHEEL && state.speakerStartedAt != null) {
        const elapsed = t - state.speakerStartedAt
        if (elapsed >= CUTOFF_MS) {
          return passToNext({ ...state, doneArmed: false }, t)
        }
      }
      if (state.phase === PHASES.TRANSITION && state.transitionEndsAt && t >= state.transitionEndsAt) {
        return startSpeaker(state, state.requests[0] || state.queue[0] || nextClockwise(state), t)
      }
      if (
        (state.phase === PHASES.WHEEL || state.phase === PHASES.VOTE || state.phase === PHASES.TRANSITION) &&
        state.groupLimitEndsAt &&
        t >= state.groupLimitEndsAt
      ) {
        return failMeeting(state, "Group hour elapsed without verified consensus")
      }
      return state
    }
    case "READY": {
      const participants = state.participants.map((p) =>
        p.id === action.participantId ? { ...p, ready: true } : p,
      )
      const next = { ...state, participants }
      if (participants.filter((p) => !p.watcher).every((p) => p.ready)) {
        return beginSession(next, action.now || Date.now())
      }
      return next
    }
    case "START_ALL_DEMO":
      return beginSession(
        {
          ...state,
          participants: state.participants.map((p) => ({ ...p, ready: true })),
        },
        action.now || Date.now(),
      )
    case "REQUEST_NEXT": {
      if (state.requests.includes(action.participantId)) return state
      if (action.participantId === state.speakerId) return state
      return { ...state, requests: [...state.requests, action.participantId] }
    }
    case "PICK_NEXT": {
      // speaker picks among requesters — winner moves to front of speak queue
      if (state.speakerId !== action.byId) return state
      if (!state.requests.includes(action.participantId)) return state
      return {
        ...state,
        requests: [action.participantId],
        queue: [action.participantId, ...state.queue.filter((id) => id !== action.participantId)],
      }
    }
    case "DONE_PRESENTING":
      if (state.speakerId !== action.participantId) return state
      if (!state.doneArmed) return { ...state, doneArmed: true }
      return passToNext({ ...state, doneArmed: false }, action.now || Date.now())
    case "CAST_VOTE": {
      const votes = { ...state.votes, [action.participantId]: action.ranking }
      const next = { ...state, votes, phase: PHASES.VOTE }
      return tryResolveVotes(next)
    }
    case "NOTIFY":
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { id: action.id || `n-${Date.now()}`, text: action.text, expiresAt: (action.now || Date.now()) + CHAT_NOTIFY_MS },
        ],
      }
    case "CLEAR_NOTIFY":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id && n.expiresAt > (action.now || Date.now())),
      }
    case "FORCE_PHASE": {
      const next = { ...state, phase: action.phase }
      if (action.phase === PHASES.WHEEL && !next.speakerStartedAt) {
        const group = next.breakouts?.[next.activeGroupIndex] || next.participants.map((p) => p.id)
        const speakerId = next.speakerId || group[0] || null
        return {
          ...next,
          speakerId,
          speakerStartedAt: action.now || Date.now(),
          queue: group.filter((id) => id !== speakerId),
          requests: [],
          doneArmed: false,
        }
      }
      return next
    }
    case "FAIL":
      return failMeeting(state, action.reason || "Consensus not reached")
    case "VERIFY_OK":
      return {
        ...state,
        phase: PHASES.RESULTS,
        positions: action.positions || state.positions,
      }
    case "RESEED":
      return createInitialMeetingState({
        format: action.format || state.format,
        participants: action.participants || state.participants,
        now: action.now || Date.now(),
      })
    default:
      return state
  }
}

function beginSession(state, now) {
  const ids = state.participants.filter((p) => !p.watcher).map((p) => p.id)
  const breakouts = needsBreakouts(ids.length) ? splitBreakouts(ids) : [ids]
  const group = breakouts[0] || []
  const speakerId = group[0] || null
  return {
    ...state,
    phase: needsBreakouts(ids.length) ? PHASES.BREAKOUT : PHASES.WHEEL,
    breakouts,
    activeGroupIndex: 0,
    groupLimitEndsAt: now + GROUP_LIMIT_MS,
    speakerId,
    speakerStartedAt: needsBreakouts(ids.length) ? null : now,
    queue: group.slice(1),
    requests: [],
  }
}

function startSpeaker(state, speakerId, now) {
  const group = (state.breakouts?.[state.activeGroupIndex] || []).filter(Boolean)
  const rest = group.filter((id) => id !== speakerId)
  return {
    ...state,
    phase: PHASES.WHEEL,
    speakerId,
    speakerStartedAt: now,
    queue: rest,
    requests: [],
    doneArmed: false,
    transitionEndsAt: null,
  }
}

function passToNext(state, now) {
  const nextId = state.requests[0] || state.queue[0] || nextClockwise(state)
  if (!nextId || nextId === state.speakerId) {
    // everyone spoke — move to vote
    return {
      ...state,
      phase: PHASES.VOTE,
      speakerId: null,
      speakerStartedAt: null,
      doneArmed: false,
      requests: [],
    }
  }
  return {
    ...state,
    phase: PHASES.TRANSITION,
    transitionEndsAt: now + TRANSITION_MS,
    speakerId: null,
    speakerStartedAt: null,
    requests: [],
    queue: [nextId, ...state.queue.filter((id) => id !== nextId)],
  }
}

function nextClockwise(state) {
  const group = state.breakouts?.[state.activeGroupIndex] || []
  if (!group.length) return null
  const idx = group.indexOf(state.speakerId)
  return group[(idx + 1) % group.length]
}

function tryResolveVotes(state) {
  const group = state.breakouts?.[state.activeGroupIndex] || []
  const need = consensusThreshold(group.length)
  const ballots = Object.entries(state.votes).filter(([id]) => group.includes(id))
  if (ballots.length < need) return state

  // tallies first-place votes; require agreement on top-3 ranking among ≥ threshold
  const first = {}
  for (const [, ranking] of ballots) {
    const top = ranking?.[0]
    if (top) first[top] = (first[top] || 0) + 1
  }
  const sorted = Object.entries(first).sort((a, b) => b[1] - a[1])
  if (!sorted.length || sorted[0][1] < need) return state

  // Build positions from plurality of rankings (simplified demo consensus)
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
  ].filter(Boolean)

  // Election / Top3: advance; Roundtable: just record
  return {
    ...state,
    phase: PHASES.VERIFY,
    positions,
  }
}

function failMeeting(state, reason) {
  return {
    ...state,
    phase: PHASES.FAIL,
    failed: true,
    failReason: reason,
    // no rewards, no candidates advance
  }
}

export function canJoinMeeting(meeting, now = Date.now()) {
  if (!meeting?.startsAt) return true
  if (now < meeting.startsAt) return meeting.status === "active" // early join only if already open
  return now - meeting.startsAt <= LATE_JOIN_MS
}
