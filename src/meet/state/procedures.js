/**
 * Procedures define how a meeting runs. Voting formats define what participants
 * decide. Compatibility is explicit so future procedures can opt into only the
 * formats they support.
 */

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

export const PROCEDURES = {
  CLASSIC_CLUB: "classic_club",
  INFINITY: "infinity",
  SUPER_FAST_CLUB: "super_fast_club",
}

export const VOTING_FORMATS = {
  ELECTION: "election",
  TOP3: "top3",
  MULTI_ROLE: "multi_role",
  ROLE_ELECTION: "role_election",
  CREAM_OF_CROP: "cream_of_crop",
  ROUNDTABLE: "roundtable",
  ROUNDTABLE_PAID: "roundtable_paid",
}

export const VOTING_FORMAT_META = {
  [VOTING_FORMATS.ELECTION]: {
    label: "Election",
    blurb: "One person advances from each group.",
    advancesPerGroup: 1,
    rankedConsensus: false,
  },
  [VOTING_FORMATS.TOP3]: {
    label: "Top 3",
    blurb: "Three people advance from each group.",
    advancesPerGroup: 3,
    rankedConsensus: true,
    shareModel: "contributors_club",
  },
  [VOTING_FORMATS.MULTI_ROLE]: {
    label: "Multi-role election",
    blurb: "Choose one person for each role.",
    advancesPerGroup: "roles",
    rankedConsensus: false,
    roleGroups: true,
  },
  [VOTING_FORMATS.ROLE_ELECTION]: {
    label: "Role election",
    blurb: "Choose one eligible person for a role.",
    advancesPerGroup: 1,
    rankedConsensus: false,
    proofsRequired: true,
  },
  [VOTING_FORMATS.CREAM_OF_CROP]: {
    label: "Cream of Crop",
    blurb: "Advance a chosen number or ratio from each group.",
    advancesPerGroup: "configured",
    rankedConsensus: true,
    configurableAdvance: true,
  },
  [VOTING_FORMATS.ROUNDTABLE]: {
    label: "Roundtable",
    blurb: "Open consensus without awards.",
    advancesPerGroup: 0,
    rankedConsensus: false,
  },
  [VOTING_FORMATS.ROUNDTABLE_PAID]: {
    label: "Roundtable + Awards",
    blurb: "Consensus with awards by level.",
    advancesPerGroup: 0,
    rankedConsensus: true,
  },
}

const ALL_VOTING_FORMATS = Object.values(VOTING_FORMATS)
const ROUNDTABLE_FORMATS = [
  VOTING_FORMATS.ROUNDTABLE,
  VOTING_FORMATS.ROUNDTABLE_PAID,
]

export const PROCEDURE_META = {
  [PROCEDURES.CLASSIC_CLUB]: {
    label: "Classic Club",
    blurb: "45 min presentations, 15 min consensus, 5 min break, 10 min sharing.",
    timed: true,
    registrationMs: 24 * HOUR,
    earlyEntryMs: 15 * MINUTE,
    landingMs: 10 * MINUTE,
    presentationsMs: 45 * MINUTE,
    consensusMs: 15 * MINUTE,
    breakMs: 5 * MINUTE,
    sharingMs: 10 * MINUTE,
    compatibleVotingFormats: ALL_VOTING_FORMATS,
  },
  [PROCEDURES.INFINITY]: {
    label: "Infinity",
    blurb: "Open meeting with no end time.",
    timed: false,
    registrationMs: 24 * HOUR,
    earlyEntryMs: 15 * MINUTE,
    landingMs: 10 * MINUTE,
    presentationsMs: null,
    consensusMs: null,
    breakMs: null,
    sharingMs: null,
    compatibleVotingFormats: ROUNDTABLE_FORMATS,
  },
  [PROCEDURES.SUPER_FAST_CLUB]: {
    label: "Super Fast Club",
    blurb: "Classic Club with every time cut in half.",
    timed: true,
    registrationMs: 12 * HOUR,
    earlyEntryMs: 7.5 * MINUTE,
    landingMs: 5 * MINUTE,
    presentationsMs: 22.5 * MINUTE,
    consensusMs: 7.5 * MINUTE,
    breakMs: 2.5 * MINUTE,
    sharingMs: 5 * MINUTE,
    compatibleVotingFormats: ALL_VOTING_FORMATS,
  },
}

export function procedureFor(id) {
  return PROCEDURE_META[id] || PROCEDURE_META[PROCEDURES.CLASSIC_CLUB]
}

export function compatibleProcedures(votingFormat) {
  return Object.entries(PROCEDURE_META)
    .filter(([, procedure]) => procedure.compatibleVotingFormats.includes(votingFormat))
    .map(([id]) => id)
}

export function compatibleVotingFormats(procedureId) {
  return procedureFor(procedureId).compatibleVotingFormats
}

export function isVotingCompatible(procedureId, votingFormat) {
  return compatibleVotingFormats(procedureId).includes(votingFormat)
}

export function hasCompleteProofs(proofs) {
  if (!proofs) return false
  const text = Boolean(String(proofs.brief || "").trim())
  const image = Boolean(proofs.imageData)
  const links = Array.isArray(proofs.links) && proofs.links.some((link) => String(link).trim())
  return text && image && links
}
