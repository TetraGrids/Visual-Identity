/**
 * Meeting state machine
 *
 * Timeline (official start = meeting.startsAt):
 * - Registration: opens 24h before start
 * - Room open: 15 min before start
 * - Landing: 10 min from start (NOT part of the hour) — all must be present, then locked
 * - Presentations + Discernment: 60 min session hour (landing excluded)
 * - Presentations may end early → discernment gets the remainder
 * - After votes: return to main group, or stay in breakout and leave individually
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
  [PHASES.FAIL]: "Failed",
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
    rankedConsensus: true,
  },
  [FORMATS.TOP3]: {
    label: "Top 3",
    blurb: "Top three advance per group. Contributors Club share model.",
    advancesPerGroup: 3,
    money: true,
    awardPerLevel: false,
    shareModel: "contributors_club",
    rankedConsensus: true,
  },
  [FORMATS.ROUNDTABLE]: {
    label: "Roundtable",
    blurb: "No money. Anyone can open one.",
    advancesPerGroup: 0,
    money: false,
    awardPerLevel: false,
    rankedConsensus: false,
  },
  [FORMATS.ROUNDTABLE_PAID]: {
    label: "Roundtable + Awards",
    blurb: "Award per level won (as many levels as winners ≥ 2).",
    advancesPerGroup: 0,
    money: true,
    awardPerLevel: true,
    rankedConsensus: true,
  },
}

export const SLOT_COUNT = 8

export const SPEAK_MS = 3.5 * 60 * 1000
export const WARN_MS = 4 * 60 * 1000
export const CUTOFF_MS = 5 * 60 * 1000
export const TRANSITION_MS = 15 * 1000
export const LANDING_MS = 10 * 60 * 1000
export const SESSION_MS = 60 * 60 * 1000 // presentations + discernment (landing excluded)
export const REGISTRATION_OPEN_MS = 24 * 60 * 60 * 1000
export const EARLY_ENTER_MS = 15 * 60 * 1000
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

export function createInitialMeetingState({ format = FORMATS.ELECTION, participants = [], now = Date.now() } = {}) {
  return {
    phase: PHASES.LANDING,
    format,
    startedAt: now,
    landingEndsAt: now + LANDING_MS,
    sessionEndsAt: null, // set when presentations start (= now + SESSION_MS)
    presentationsStartedAt: null,
    discernmentStartedAt: null,
    participants,
    breakouts: null,
    activeGroupIndex: 0,
    speakerId: null,
    speakerStartedAt: null,
    screenShareId: null, // participant id sharing screen (demo toggle)
    /** Speak order mapped onto fixed 8 slots; index 0 = active/top */
    slots: assignSlots(participants.filter((p) => !p.watcher).map((p) => p.id)),
    doneArmed: false,
    transitionEndsAt: null,
    votes: {},
    positions: null,
    failed: false,
    failReason: null,
    notifications: [],
    locked: false,
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
      const t = action.now
      if (state.phase === PHASES.LANDING && t >= state.landingEndsAt) {
        return { ...state, phase: PHASES.LOCKED, locked: true }
      }
      if (state.phase === PHASES.PRESENTATIONS && state.speakerStartedAt != null) {
        const elapsed = t - state.speakerStartedAt
        if (elapsed >= CUTOFF_MS) {
          return passToNext({ ...state, doneArmed: false }, t)
        }
      }
      if (state.phase === PHASES.TRANSITION && state.transitionEndsAt && t >= state.transitionEndsAt) {
        const nextId = nextFromSlots(state)
        return startSpeaker(state, nextId, t)
      }
      if (
        (state.phase === PHASES.PRESENTATIONS ||
          state.phase === PHASES.DISCERNMENT ||
          state.phase === PHASES.TRANSITION ||
          state.phase === PHASES.VERIFY) &&
        state.sessionEndsAt &&
        t >= state.sessionEndsAt
      ) {
        if (state.phase === PHASES.DISCERNMENT || state.phase === PHASES.VERIFY) {
          return failMeeting(state, "Session hour ended without verified consensus")
        }
        // presentations ran to the clock — force discernment with whatever time left (0)
        return beginDiscernment(state, t)
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
  return {
    ...state,
    phase: PHASES.PRESENTATIONS,
    presentationsStartedAt: now,
    sessionEndsAt: state.sessionEndsAt || now + SESSION_MS,
    speakerId,
    speakerStartedAt: now,
    slots,
    doneArmed: false,
    transitionEndsAt: null,
  }
}

function beginDiscernment(state, now) {
  return {
    ...state,
    phase: PHASES.DISCERNMENT,
    discernmentStartedAt: now,
    speakerId: null,
    speakerStartedAt: null,
    doneArmed: false,
    // sessionEndsAt already set — remainder of the hour
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

function passToNext(state, now) {
  const nextId = nextFromSlots(state)
  if (!nextId) {
    return beginDiscernment(state, now)
  }
  // clear current from slot 0 into end, promote next
  const slots = state.slots.slice()
  const finished = slots[0]
  const nextIdx = slots.indexOf(nextId)
  slots[0] = nextId
  slots[nextIdx] = null
  // pack finished to first empty after 0 or drop (already spoke)
  // keep finished visible in ring at first empty
  const empty = slots.findIndex((s, i) => i > 0 && s == null)
  if (empty >= 0 && finished) slots[empty] = finished

  return {
    ...state,
    phase: PHASES.TRANSITION,
    transitionEndsAt: now + TRANSITION_MS,
    speakerId: null,
    speakerStartedAt: null,
    slots,
  }
}

function tryResolveVotes(state) {
  const group = (state.breakouts?.[state.activeGroupIndex] || state.slots.filter(Boolean)).filter(Boolean)
  if (!FORMAT_META[state.format]?.rankedConsensus) return resolveHeadcount(state, group)
  if (!group.length) return state
  const ballots = group.map((id) => state.votes[id]).filter((ranking) => ranking?.length)
  const snap = rankSnapshot(group, ballots)
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
      if (ids.length >= Math.min(3, group.length)) break
      ids.push(r.id)
    }
    return {
      ...state,
      phase: PHASES.VERIFY,
      positions: ids.map((id, i) => ({ place: i + 1, participantId: id })),
    }
  }
  if (held.length >= Math.min(3, group.length)) {
    return {
      ...state,
      phase: PHASES.VERIFY,
      positions: held.map((r) => ({ place: r.place, participantId: r.id })),
    }
  }
  return state
}

function resolveHeadcount(state, group) {
  const need = consensusThreshold(group.length)
  const ballots = Object.entries(state.votes).filter(([id]) => group.includes(id))
  if (ballots.length < need) return state

  const first = {}
  for (const [, ranking] of ballots) {
    const top = ranking?.[0]
    if (top) first[top] = (first[top] || 0) + 1
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
  ].filter(Boolean)

  return { ...state, phase: PHASES.VERIFY, positions }
}

function failMeeting(state, reason) {
  return {
    ...state,
    phase: PHASES.FAIL,
    failed: true,
    failReason: reason,
  }
}

/** Registration opens 24h before start, until start. */
export function canRegister(meeting, now = Date.now()) {
  if (!meeting?.startsAt) return true
  const open = meeting.startsAt - REGISTRATION_OPEN_MS
  return now >= open && now < meeting.startsAt
}

/**
 * Enter room from 15 min before start through end of landing.
 * After landing the meeting is locked (no new entrants).
 */
export function canJoinMeeting(meeting, now = Date.now()) {
  if (!meeting?.startsAt) return true
  if (meeting.status === "active" && meeting.id === "demo-now") return true
  const open = meeting.startsAt - EARLY_ENTER_MS
  const lockAt = meeting.startsAt + LANDING_MS
  return now >= open && now < lockAt
}

/** Stage progress for top-left clock */
export function stageProgress(state, now = Date.now()) {
  const label = STAGE_LABEL[state.phase] || state.phase
  if (state.phase === PHASES.LANDING) {
    const total = LANDING_MS
    const left = Math.max(0, state.landingEndsAt - now)
    return { label, left, total, progress: left / total }
  }
  if (state.phase === PHASES.LOCKED || state.phase === PHASES.BREAKOUT) {
    return { label, left: 0, total: 1, progress: 0 }
  }
  if (
    state.phase === PHASES.PRESENTATIONS ||
    state.phase === PHASES.TRANSITION ||
    state.phase === PHASES.DISCERNMENT ||
    state.phase === PHASES.VERIFY
  ) {
    const ends = state.sessionEndsAt || now + SESSION_MS
    const started = state.presentationsStartedAt || now
    const total = Math.max(1, ends - started)
    const left = Math.max(0, ends - now)
    return { label, left, total, progress: left / total }
  }
  return { label, left: 0, total: 1, progress: 1 }
}
