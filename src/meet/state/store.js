import { generateRoomId } from "../lib/client-utils.js"
import { FORMATS, FORMAT_META } from "./machine.js"

const MEETINGS_KEY = "tetra-meet-meetings"
const PROFILE_KEY = "tetra-meet-profile"
const HISTORY_KEY = "tetra-meet-history"
const SESSION_KEY = "tetra-meet-session"

const DAY = 24 * 60 * 60 * 1000

/** Next occurrence of weekday (0=Sun…6=Sat) at hour UTC */
export function nextUtcWeekday(weekday, hourUtc, from = new Date()) {
  const d = new Date(from)
  d.setUTCHours(hourUtc, 0, 0, 0)
  const delta = (weekday - d.getUTCDay() + 7) % 7
  if (delta === 0 && from.getTime() > d.getTime() + 60 * 60 * 1000) {
    d.setUTCDate(d.getUTCDate() + 7)
  } else {
    d.setUTCDate(d.getUTCDate() + delta)
  }
  return d
}

function seedRecurring() {
  const tue = nextUtcWeekday(2, 17) // Tuesday Contributors Club
  const wed = nextUtcWeekday(3, 17) // Wednesday Antelope Roundtable
  return [
    {
      id: "contrib-club",
      name: "Contributor's Club",
      format: FORMATS.TOP3,
      visibility: "public",
      recurring: "tue-17utc",
      startsAt: tue.getTime(),
      durationMin: 90,
      membersMax: 24,
      status: "scheduled",
      link: "contrib-club",
      rewardPreset: "contributors_club_share",
    },
    {
      id: "antelope-roundtable",
      name: "Longhorn: Antelope Roundtable",
      format: FORMATS.ROUNDTABLE,
      visibility: "public",
      recurring: "wed-17utc",
      startsAt: wed.getTime(),
      durationMin: 90,
      membersMax: 16,
      status: "scheduled",
      link: "antelope-roundtable",
      rewardPreset: "none",
    },
  ]
}

function seedActiveDemo() {
  return {
    id: "demo-now",
    name: "Tetra Wheel — Live Demo",
    format: FORMATS.ELECTION,
    visibility: "public",
    startsAt: Date.now() - 2 * 60 * 1000,
    durationMin: 60,
    membersMax: 8,
    status: "active",
    link: "demo-now",
    rewardPreset: "election",
    participants: 5,
  }
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadMeetings() {
  let list = readJson(MEETINGS_KEY, null)
  if (!list) {
    list = [...seedRecurring(), seedActiveDemo()]
    writeJson(MEETINGS_KEY, list)
  } else {
    // refresh recurring start times if stale (>7d past)
    const now = Date.now()
    list = list.map((m) => {
      if (m.recurring === "tue-17utc" && m.startsAt < now - DAY) {
        return { ...m, startsAt: nextUtcWeekday(2, 17).getTime(), status: "scheduled" }
      }
      if (m.recurring === "wed-17utc" && m.startsAt < now - DAY) {
        return { ...m, startsAt: nextUtcWeekday(3, 17).getTime(), status: "scheduled" }
      }
      // Keep the built-in live demo joinable (refresh start if past late-join window)
      if (m.id === "demo-now" && now - m.startsAt > 9 * 60 * 1000) {
        return { ...m, startsAt: now - 2 * 60 * 1000, status: "active" }
      }
      return m
    })
    if (!list.some((m) => m.id === "demo-now")) {
      list.unshift(seedActiveDemo())
    }
    writeJson(MEETINGS_KEY, list)
  }
  return list
}

export function saveMeetings(list) {
  writeJson(MEETINGS_KEY, list)
}

export function getMeeting(id) {
  return loadMeetings().find((m) => m.id === id || m.link === id) || null
}

export function createMeeting(input) {
  const id = generateRoomId()
  const meeting = {
    id,
    name: input.name || "Untitled Meeting",
    format: input.format || FORMATS.ELECTION,
    visibility: input.visibility || "public",
    startsAt: input.startsAt || Date.now() + 60 * 60 * 1000,
    durationMin: Number(input.durationMin) || 60,
    membersMax: Number(input.membersMax) || 8,
    status: input.status || "scheduled",
    link: id,
    rewardPreset: input.rewardPreset || FORMAT_META[input.format || FORMATS.ELECTION]?.shareModel || "none",
    participants: 0,
  }
  const list = loadMeetings()
  list.unshift(meeting)
  saveMeetings(list)
  return meeting
}

export function updateMeeting(id, patch) {
  const list = loadMeetings().map((m) => (m.id === id ? { ...m, ...patch } : m))
  saveMeetings(list)
  return list.find((m) => m.id === id)
}

export function defaultProfile() {
  return {
    name: "",
    handle: "",
    avatarUrl: "",
    title: "",
    role: "",
    xprAccount: "",
    notes: "",
    links: [""],
    payoutAccounts: [""],
    memo: "",
  }
}

export function loadProfile() {
  return { ...defaultProfile(), ...readJson(PROFILE_KEY, {}) }
}

export function saveProfile(profile) {
  writeJson(PROFILE_KEY, profile)
  return profile
}

export function loadHistory() {
  return readJson(HISTORY_KEY, [])
}

export function pushHistory(entry) {
  const list = loadHistory()
  list.unshift({
    id: entry.id || generateRoomId(),
    meetingId: entry.meetingId,
    meetingName: entry.meetingName,
    format: entry.format,
    at: entry.at || Date.now(),
    positions: entry.positions || null,
    failed: Boolean(entry.failed),
    proofs: entry.proofs || null,
  })
  writeJson(HISTORY_KEY, list.slice(0, 50))
  return list
}

export function loadSession() {
  return readJson(SESSION_KEY, null)
}

export function saveSession(session) {
  writeJson(SESSION_KEY, session)
  return session
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

/** Registration proofs keyed by meetingId */
const REG_KEY = "tetra-meet-registrations"

export function loadRegistration(meetingId) {
  const all = readJson(REG_KEY, {})
  return all[meetingId] || null
}

export function saveRegistration(meetingId, data) {
  const all = readJson(REG_KEY, {})
  all[meetingId] = data
  writeJson(REG_KEY, all)
  return data
}

export function formatWhen(ts) {
  const d = new Date(ts)
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

export function formatUtcBadge(ts) {
  const d = new Date(ts)
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  return `${days[d.getUTCDay()]} ${months[d.getUTCMonth()]} ${d.getUTCDate()} · ${String(d.getUTCHours()).padStart(2, "0")}:00 UTC`
}
