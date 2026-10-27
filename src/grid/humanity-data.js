/** Humanity specimen content. Live services replace every preview status. */

export const humanityOperator = {
  name: "Ari Rivera",
  initials: "AR",
  faction: "FALA",
  region: "Texas",
  nation: "United States",
  access: "Member preview",
  account: "ari.xpr",
}

export const humanityBriefing = {
  stats: [
    { k: "Faction", v: "FALA" },
    { k: "Next room", v: "Tue" },
    { k: "Open actions", v: "3" },
    { k: "Access", v: "Member" },
  ],
  feed: [
    { t: "Now", title: "Registration opens 24 hours before each meeting", meta: "Add one image, markdown, and up to seven links" },
    { t: "Tue", title: "Contributor’s Club · 17:00 UTC", meta: "Roundtable · registration pending" },
    { t: "Wed", title: "Longhorn: Antelope Roundtable · 17:00 UTC", meta: "Roundtable · registration pending" },
    { t: "TBA", title: "FALA Chief Gameday", meta: "Election · first Gameday moves the faction from pregnancy to birth" },
  ],
  actions: [
    { eyebrow: "Profile", title: "Add your first proof", copy: "One image, markdown, links, or a KPI. Stored locally in this preview." },
    { eyebrow: "FALA", title: "Read the Temple", copy: "Know the shared desire before entering a decision room." },
    { eyebrow: "Meeting", title: "Choose a roundtable", copy: "Spectators watch. Active members may register to participate." },
  ],
}

export const humanityEvents = [
  {
    id: "contributors",
    when: "Tue · 17:00 UTC",
    title: "Contributor’s Club",
    where: "Roundtable · recurring",
    status: "Registration opens 24h before",
  },
  {
    id: "longhorn",
    when: "Wed · 17:00 UTC",
    title: "Longhorn: Antelope Roundtable",
    where: "Roundtable · recurring",
    status: "Registration opens 24h before",
  },
  {
    id: "gameday",
    when: "TBA",
    title: "FALA Chief Gameday",
    where: "Election · live fractal rounds",
    status: "Preview only",
  },
]

export const meetingFormats = {
  election: {
    title: "Election",
    kicker: "One final winner",
    copy: "Any eligible voter may run. Each breakout advances its chosen candidate until one Chief remains.",
  },
  top3: {
    title: "Top 3",
    kicker: "Three advance per group",
    copy: "Groups rank positions one, two, and three. The top three advance into the next level.",
  },
  roundtable: {
    title: "Roundtable",
    kicker: "No money required",
    copy: "A discussion and consensus format anyone may open when faction permissions allow.",
  },
}

export const meetingTimeline = [
  { when: "−24h", title: "Registration", where: "Add proofs and links" },
  { when: "−15m", title: "Room opens", where: "Camera, audio, and identity check" },
  { when: "0–10m", title: "Landing", where: "Everyone must arrive; room then locks" },
  { when: "Hour", title: "Presentations", where: "3:30 target · warning at 4:00 · cut at 5:00" },
  { when: "Remainder", title: "Discernment", where: "Rank, confirm, and verify consensus" },
  { when: "Complete", title: "Regroup", where: "Return to main room or remain together" },
]

export const consensusRules = [
  { eyebrow: "Minimum", title: "Four people", copy: "More than eight participants split into two or more breakout rooms." },
  { eyebrow: "Current examples", title: "Four → three · five → three", copy: "The faction’s approved rule controls the exact threshold." },
  { eyebrow: "Failure", title: "No consensus, no advance", copy: "No candidate advances and no group reward is released." },
  { eyebrow: "Verification", title: "Transactions close the round", copy: "Proxy confirmation for non-wallet accounts is an explicit future chain integration." },
]

export const falaTemple = {
  vision: {
    title: "The people across the Americas giving and receiving what they desire",
    copy: "Democracy directed by local leaders, connected through small groups that weave into larger shared experiences.",
  },
  mission: [
    "Make America free for the first time.",
    "Connect all nations of the Americas culturally, competitively, and economically.",
    "Heal avoidable tension caused by military action, political alienation, sanctions, tariffs, and cultural ignorance.",
  ],
  foundation: {
    title: "Free will to expand experience",
    copy: "FALA seeks unprecedented prosperity and fun without erasing the nations, regions, or people within the Americas.",
  },
}

export const falaConstitution = {
  boundaries: [
    { q: "Who may join?", a: "FALA is currently welcome to all. Meeting and reward eligibility may still require published faction rules." },
    { q: "What stays separate?", a: "FALA maintains its own treasury, Constitution, Temple, roles, and Chief Stewardship List." },
    { q: "What cannot tokens buy?", a: "A larger vote, a title, or a meeting result." },
  ],
  roles: [
    { name: "Chief", copy: "Elected leader who earns the privilege of signing new budgets into effect." },
    { name: "Noble", copy: "Responsible for process: meetings, public voice, channels, and key accounts." },
    { name: "Steward", copy: "Responsible for resources and the lists that direct funds." },
    { name: "Regent", copy: "Responsible for a domain, often a nation or physical region." },
  ],
  cycle: [
    { k: "Chief election", v: "6 mo" },
    { k: "Chief term", v: "2 yr" },
    { k: "Minimum Chiefs", v: "4" },
    { k: "Vacancy meeting", v: "1–2 wk" },
  ],
}

export const falaAlignment = {
  checks: [
    "Humanity has a future worth working for.",
    "The power seen in another individual also exists in you.",
    "Technology can support human freedom when people remain in control.",
    "Abundance grows when resources and decisions become visible.",
  ],
  unbreakables: [
    "Know what FALA means: Free At Last America—and fala means speak.",
    "Speak your highest truth without taking another person’s free will.",
    "Be living FALA: turn stated desire into visible action.",
  ],
}

export const humanityCandidates = [
  { name: "Maya Torres", initials: "MT", meta: "Candidate · Speaker · Mexico" },
  { name: "João Costa", initials: "JC", meta: "Candidate · Host · Brazil" },
  { name: "Ari Rivera", initials: "AR", meta: "You · Stewardship · United States" },
  { name: "Sofía Rojas", initials: "SR", meta: "Candidate · Regent · Colombia" },
]

export const candidateProofs = [
  { eyebrow: "Maya", title: "Cross-border youth assembly", copy: "Markdown brief · image · 4 links · KPI: 218 attendees" },
  { eyebrow: "João", title: "Portuguese meeting guide", copy: "Markdown brief · 2 links · KPI: 7 translated sections" },
  { eyebrow: "Sofía", title: "Regional petition map", copy: "Image · 5 links · KPI: 12 active regions" },
]

export const rolesByType = {
  noble: [
    { title: "Speaker", copy: "Represents the faction in public." },
    { title: "Host", copy: "Responsible for all aspects of a meeting." },
    { title: "Keyholder", copy: "Maintains accounts outside the main system." },
  ],
  steward: [
    { title: "Chief Steward", copy: "Maintains the list of where faction funds go." },
    { title: "Regional Steward", copy: "Directs an assigned part of the budget within a region." },
  ],
  regent: [
    { title: "National Regent", copy: "Responsible for one nation-level domain." },
    { title: "Regional Regent", copy: "Responsible for a top-level administrative division or other defined domain." },
  ],
}

export const meetingHistory = [
  ["Contributor’s Club", "Watched", "No proofs", "Oct 20"],
  ["FALA Temple Review", "Participated", "2 links", "Oct 14"],
  ["Americas Roundtable", "Participated", "Image + KPI", "Oct 07"],
]

export const stewardshipList = [
  { position: "1", account: "americas.games", weight: "30", purpose: "Bi-annual arts and sports games" },
  { position: "2", account: "petition.fund", weight: "25", purpose: "Ballot-access research and petitions" },
  { position: "3", account: "local.meets", weight: "25", purpose: "Regional meeting operations" },
  { position: "4", account: "chiefs.pay", weight: "20", purpose: "Published Chief compensation" },
]

export const proposals = {
  planned: [
    { eyebrow: "Listed", title: "FATA research", copy: "Research a Free Americas Trade Agreement framework." },
    { eyebrow: "Listed", title: "America Games pilot", copy: "A rotating online arts competition across the Americas." },
    { eyebrow: "Listed", title: "Humanity Party petitions", copy: "State-by-state ballot-access research and volunteer operations." },
  ],
  funded: [
    { eyebrow: "Preview", title: "No verified funded proposals", copy: "On-chain list routing is not connected in this specimen." },
  ],
}

export const falaToken = {
  resource: [
    { k: "Votes purchased", v: "0" },
    { k: "Chief List", v: "100%" },
    { k: "Chain", v: "XPR" },
    { k: "Status", v: "Preview" },
  ],
  rules: [
    "FALA is intended to use a Flex token for yield and project funding.",
    "After the first Chief Gameday, project funds route to the Chief Stewardship List.",
    "Token holdings do not multiply a person’s vote or grant a title.",
  ],
}

export const gamedayRounds = [
  { step: "01", title: "Stand", copy: "Any eligible voter may become a candidate." },
  { step: "02", title: "Present", copy: "Each person receives protected speaking time." },
  { step: "03", title: "Discern", copy: "The breakout chooses positions through its approved consensus rule." },
  { step: "04", title: "Advance", copy: "Winners regroup until the final Chief result." },
  { step: "05", title: "Verify", copy: "Transactions and proxy confirmations close the result." },
]

export const humanityChiefs = [
  { name: "Douglas Butner", initials: "DB", meta: "Founding Chief · FALA starter" },
  { name: "Maya Torres", initials: "MT", meta: "Founding Chief · process" },
  { name: "João Costa", initials: "JC", meta: "Founding Chief · resources" },
  { name: "Sofía Rojas", initials: "SR", meta: "Founding Chief · regions" },
]

export const democracyRules = {
  titles: [
    { title: "Titles have no inherent power", copy: "A title records an election or appointment. Published responsibilities belong to roles." },
    { title: "People may hold more than one title", copy: "Eligibility and conflicts must be defined in the faction Constitution." },
  ],
  change: [
    { title: "Constitution", copy: "Defines behavior, boundaries, scope, and domain." },
    { title: "Temple", copy: "Defines vision, mission, pillars, and foundation." },
    { title: "Game Guide", copy: "Defines meeting formats, cadence, advancement, and rewards." },
  ],
}

export const humanityFactions = [
  { eyebrow: "Available · welcome to all", title: "FALA", copy: "Free At Last America. Burning desire: unite all of the Americas." },
  { eyebrow: "Reserved", title: "Future factions", copy: "Register a Constitution, Temple, four Chiefs, one Noble, one Steward, and a Flex token." },
]

export const humanityGuide = {
  core: [
    "Small groups meet on a regular cadence to improve their world.",
    "Factions define a shared burning desire and how their game is played.",
    "Gameday elects Chiefs through live fractal rounds.",
    "Stewardship Lists make the destination of funds visible.",
  ],
  maintain: [
    "Chief elections every six months.",
    "A published Chief Stewardship List.",
    "A Flex token whose project funds route to that list after the first Chief Gameday.",
  ],
}

export const humanityAbout = {
  why: [
    "Shared attention increases what a group can manifest.",
    "People discover their potential when peers call it forward.",
    "Visible actions, proofs, and votes reward work other people validate.",
  ],
  history: [
    { eyebrow: "2014 / 2018", title: "cXc.world", copy: "Linked time and geopolitical boundaries in a financial and attention game." },
    { eyebrow: "2023", title: "Tetra", copy: "Developed the wider system of identity, discovery, governance, and place." },
    { eyebrow: "Now", title: "Humanity: A Game", copy: "A reduced, playable form centered on factions, meetings, elections, and lists." },
  ],
}

export const accessModes = {
  spectator: {
    title: "Free spectator",
    copy: "Watch public meetings. Speaking, voting, candidacy, proofs, and rewards remain locked.",
    status: "Current preview option",
  },
  member: {
    title: "Active member",
    copy: "Register for meetings when eligible, speak, vote, stand, publish proofs, and receive rewards.",
    status: "Requires active membership",
  },
}

export const humanityPlaces = [
  { name: "FALA · Texas", kind: "Chapter", set: "chapters", lat: 30.2672, lng: -97.7431, copy: "Top division · initial specimen" },
  { name: "FALA · Mexico City", kind: "Chapter", set: "chapters", lat: 19.4326, lng: -99.1332, copy: "Nation and city coordination" },
  { name: "FALA · Bogotá", kind: "Chapter", set: "chapters", lat: 4.711, lng: -74.0721, copy: "Andean coordination" },
  { name: "FALA · São Paulo", kind: "Chapter", set: "chapters", lat: -23.5505, lng: -46.6333, copy: "Portuguese-speaking coordination" },
  { name: "Contributor’s Club", kind: "Meeting", set: "meetings", lat: 30.2672, lng: -97.7431, copy: "Tuesday · 17:00 UTC · online" },
  { name: "Longhorn Roundtable", kind: "Meeting", set: "meetings", lat: 29.7604, lng: -95.3698, copy: "Wednesday · 17:00 UTC · online" },
]
