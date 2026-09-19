/**
 * Default Grid configuration.
 *
 * A lane is a vertical snap unit. Each lane holds rooms (horizontal snap).
 * A room may declare subsections (nested snap on the same axis as rooms).
 * Add lanes/rooms/kinds without rewriting the shell.
 */

export const GRID_SNAP = {
  threshold: 0.38,
  wrapThreshold: 0.62,
  edgeThreshold: 0.61,
  softThreshold: 0.42,
  gap: 14,
  chasm: 0.61,
  chasmSoft: 0.06,
}

export const defaultGrid = {
  id: "tetra-grid",
  name: "The Grid",
  snap: GRID_SNAP,
  notes: {
    title: "The Grid",
    body: "Full app mockup of the Knowbase. Specimen is Amina Okoye, Lagos, L3 Citizen — Level 4, NGRA, and Recurve votes stay gated. Rooms snap at 38%. Leaving a lane from its first or last room takes a 61% pull across a 61vh gap. After Mission Control, looping back requires 62%.",
    backHref: "/#demos",
    backLabel: "Back to the site",
  },
  lanes: [
    {
      id: "delta",
      name: "Delta",
      icon: "triangle",
      tone: "yellow",
      rooms: [
        {
          id: "scores",
          name: "New Scores",
          kind: "scores",
          subsections: [
            { id: "24h", name: "24h" },
            { id: "7d", name: "7d" },
            { id: "30d", name: "30d" },
            { id: "90d", name: "90d" },
            { id: "1y", name: "1Y" },
            { id: "life", name: "Lifetime" },
          ],
        },
        {
          id: "connections",
          name: "New Connections",
          kind: "connections",
          subsections: [
            { id: "people", name: "People" },
            { id: "regions", name: "Regions" },
          ],
        },
        {
          id: "offers",
          name: "New Offers",
          kind: "new-offers",
          subsections: [
            { id: "incoming", name: "Incoming" },
            { id: "near", name: "Near you" },
          ],
        },
        {
          id: "claim",
          name: "Daily Claim",
          kind: "claim",
          subsections: [
            { id: "unclaimed", name: "Unclaimed" },
            { id: "ledger", name: "Ledger" },
          ],
        },
      ],
    },
    {
      id: "base",
      name: "Base",
      icon: "square",
      tone: "blue",
      rooms: [
        {
          id: "offers",
          name: "Offers",
          kind: "my-offers",
          subsections: [
            { id: "listed", name: "Listed" },
            { id: "pending", name: "Pending verify" },
            { id: "completed", name: "Completed" },
          ],
        },
        {
          id: "content",
          name: "Content",
          kind: "content",
          subsections: [
            { id: "mine", name: "Mine" },
            { id: "ranked", name: "Ranked" },
          ],
        },
        {
          id: "passport",
          name: "Passport",
          kind: "passport",
          subsections: [
            { id: "profile", name: "Profile" },
            { id: "nft", name: "NFT" },
          ],
        },
        {
          id: "badges",
          name: "Badges",
          kind: "badges",
          subsections: [
            { id: "plates", name: "Plates" },
            { id: "gates", name: "Gates" },
          ],
        },
        {
          id: "stamps",
          name: "Stamps",
          kind: "stamps",
          subsections: [
            { id: "home", name: "Home" },
            { id: "abroad", name: "Abroad" },
          ],
        },
      ],
    },
    {
      id: "penta",
      name: "Penta",
      icon: "pentagon",
      tone: "purple",
      rooms: [
        {
          id: "best-offers",
          name: "Best Offers",
          kind: "best-offers",
          subsections: [
            { id: "region", name: "Region" },
            { id: "nation", name: "Nation" },
            { id: "global", name: "Global" },
          ],
        },
        {
          id: "best-content",
          name: "Best Content",
          kind: "best-content",
          subsections: [
            { id: "region", name: "Region" },
            { id: "nation", name: "Nation" },
            { id: "global", name: "Global" },
          ],
        },
        {
          id: "people",
          name: "Best People",
          kind: "people",
          subsections: [
            { id: "all", name: "General" },
            { id: "passport", name: "Passport" },
            { id: "discovery", name: "Discovery" },
            { id: "recurve", name: "Recurve" },
            { id: "localize", name: "Localize" },
          ],
        },
        {
          id: "season",
          name: "Season",
          kind: "season",
          subsections: [
            { id: "race", name: "Race" },
            { id: "carnival", name: "Carnival" },
          ],
        },
        {
          id: "algorithm",
          name: "Algorithm",
          kind: "algorithm",
          subsections: [
            { id: "default", name: "Default" },
            { id: "chief", name: "Chief weights" },
          ],
        },
      ],
    },
    {
      id: "merkaba",
      name: "Merkaba",
      icon: "merkaba",
      tone: "blue-deep",
      rooms: [
        {
          id: "calendar",
          name: "Calendar",
          kind: "calendar",
          subsections: [
            { id: "recurve", name: "Recurve" },
            { id: "hura", name: "HuRA" },
            { id: "carnival", name: "Carnival" },
          ],
        },
        {
          id: "actions",
          name: "Actions",
          kind: "actions",
          subsections: [
            { id: "verify", name: "Verify" },
            { id: "claim", name: "Claim" },
          ],
        },
        {
          id: "room",
          name: "Recurve Room",
          kind: "recurve-room",
          subsections: [
            { id: "agenda", name: "Agenda" },
            { id: "breakouts", name: "Breakouts" },
          ],
        },
      ],
    },
    {
      id: "crystal",
      name: "Crystal",
      icon: "crystal",
      tone: "blue-light",
      rooms: [
        {
          id: "accolades",
          name: "Past Accolades",
          kind: "accolades",
          subsections: [
            { id: "earned", name: "Earned" },
            { id: "locked", name: "Locked" },
          ],
        },
        {
          id: "barons",
          name: "Barons",
          kind: "barons",
          subsections: [
            { id: "boost", name: "Boost" },
            { id: "active", name: "Active" },
          ],
        },
        {
          id: "stewards",
          name: "Stewards",
          kind: "stewards",
          subsections: [
            { id: "company", name: "Company" },
            { id: "revenue", name: "Revenue" },
          ],
        },
        {
          id: "founding",
          name: "Founding",
          kind: "founding",
          subsections: [
            { id: "donate", name: "Donate" },
            { id: "recognition", name: "Recognition" },
          ],
        },
        {
          id: "stake",
          name: "Stake",
          kind: "stake",
          subsections: [
            { id: "position", name: "Position" },
            { id: "crystal", name: "Crystal" },
          ],
        },
      ],
    },
    {
      id: "govern",
      name: "Govern",
      icon: "globe",
      tone: "pink",
      rooms: [
        {
          id: "recurve",
          name: "Map Recurve Sections",
          kind: "recurve",
          subsections: [
            { id: "groups", name: "Groups" },
            { id: "rounds", name: "Rounds" },
          ],
        },
        {
          id: "reps",
          name: "Reps",
          kind: "reps",
          subsections: [
            { id: "rank", name: "Rank" },
            { id: "run", name: "Run" },
          ],
        },
        {
          id: "chiefs",
          name: "Chiefs",
          kind: "chiefs",
          subsections: [
            { id: "four", name: "Four" },
            { id: "council", name: "Council" },
          ],
        },
        {
          id: "projects",
          name: "Projects",
          kind: "projects",
          subsections: [
            { id: "paper", name: "Paper" },
            { id: "score", name: "Score" },
          ],
        },
      ],
    },
    {
      id: "localize",
      name: "Localize",
      icon: "localize",
      tone: "green-deep",
      rooms: [
        {
          id: "activation",
          name: "Activation",
          kind: "activation",
          subsections: [
            { id: "status", name: "Status" },
            { id: "founders", name: "Founders" },
          ],
        },
        {
          id: "rules",
          name: "House Rules",
          kind: "rules",
          subsections: [
            { id: "ratified", name: "Ratified" },
            { id: "drafts", name: "Drafts" },
          ],
        },
        {
          id: "procedures",
          name: "Procedures",
          kind: "procedures",
          subsections: [
            { id: "active", name: "Active" },
            { id: "proposed", name: "Proposed" },
          ],
        },
        {
          id: "roles",
          name: "Roles",
          kind: "roles",
          subsections: [
            { id: "open", name: "Open" },
            { id: "held", name: "Held" },
          ],
        },
        {
          id: "hura",
          name: "HuRA",
          kind: "hura",
          subsections: [
            { id: "next", name: "Next" },
            { id: "past", name: "Past" },
          ],
        },
        {
          id: "venues",
          name: "Venues",
          kind: "venues",
          subsections: [
            { id: "pins", name: "Map pins" },
            { id: "enable", name: "Enable" },
          ],
        },
        {
          id: "metrics",
          name: "Metrics",
          kind: "metrics",
          subsections: [
            { id: "region", name: "Region" },
            { id: "compare", name: "Compare" },
          ],
        },
      ],
    },
    {
      id: "tetra",
      name: "Tetra",
      icon: "tetra",
      tone: "green",
      rooms: [
        {
          id: "level",
          name: "Level",
          kind: "level",
          subsections: [
            { id: "you", name: "You" },
            { id: "ladder", name: "Ladder" },
          ],
        },
        {
          id: "rep",
          name: "Representative",
          kind: "rep",
          subsections: [
            { id: "gate", name: "Gate" },
            { id: "path", name: "Path" },
          ],
        },
        {
          id: "training",
          name: "Training",
          kind: "training",
          subsections: [
            { id: "join", name: "Join" },
            { id: "win", name: "How to win" },
          ],
        },
        {
          id: "social",
          name: "Social",
          kind: "social",
          subsections: [
            { id: "community", name: "Community" },
            { id: "founder", name: "Founder" },
          ],
        },
        {
          id: "verification",
          name: "Verification",
          kind: "verification",
          subsections: [
            { id: "oath", name: "Oath" },
            { id: "witnesses", name: "Witnesses" },
          ],
        },
        {
          id: "faq",
          name: "FAQ",
          kind: "faq",
          subsections: [
            { id: "cost", name: "Cost" },
            { id: "app", name: "App" },
          ],
        },
      ],
    },
    {
      id: "map",
      name: "Map",
      icon: "map",
      tone: "yellow",
      bleed: true,
      rooms: [
        {
          id: "world",
          name: "World",
          kind: "map",
          subsections: [
            { id: "offers", name: "Offers" },
            { id: "cadence", name: "Cadence" },
          ],
        },
        {
          id: "locales",
          name: "Locales",
          kind: "locales",
          subsections: [
            { id: "region", name: "Region" },
            { id: "nation", name: "Nation" },
            { id: "global", name: "Global" },
          ],
        },
      ],
    },
    {
      id: "mission",
      name: "Mission Control",
      icon: "control",
      tone: "red",
      special: "mission",
      rooms: [
        {
          id: "control",
          name: "Control",
          kind: "mission",
          subsections: [
            { id: "operator", name: "Operator" },
            { id: "journey", name: "Journey" },
          ],
        },
        {
          id: "settings",
          name: "Settings",
          kind: "settings",
          subsections: [
            { id: "display", name: "Display" },
            { id: "privacy", name: "Privacy" },
          ],
        },
        {
          id: "wallet",
          name: "Wallet",
          kind: "wallet",
          subsections: [
            { id: "ra", name: "RA" },
            { id: "tetra", name: "TETRA" },
          ],
        },
      ],
    },
  ],
}

export function findLane(config, id) {
  return config.lanes.find((lane) => lane.id === id)
}

export function insertLane(config, lane, beforeId = "map") {
  const next = { ...config, lanes: [...config.lanes] }
  const at = next.lanes.findIndex((item) => item.id === beforeId)
  const index = at < 0 ? next.lanes.length : at
  next.lanes.splice(index, 0, lane)
  return next
}
