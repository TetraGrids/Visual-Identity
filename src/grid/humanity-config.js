import { GRID_SNAP } from "./config.js"

/** Humanity is the first operating system mounted inside The Grid. */
export const humanityGrid = {
  id: "humanity-grid",
  name: "Humanity",
  snap: GRID_SNAP,
  notes: {
    title: "Humanity · The Grid",
    body: "Humanity is the first live use of The Grid. This specimen centers FALA, meetings, Gameday, people, stewardship, and the Americas. Authentication, billing, meeting permissions, smart contracts, and election verification remain clearly marked preview integrations.",
    backHref: "/#demos",
    backLabel: "Return to previews",
  },
  lanes: [
    {
      id: "now",
      name: "Now",
      icon: "triangle",
      tone: "green",
      rooms: [
        {
          id: "briefing",
          name: "Briefing",
          kind: "humanity-home",
          subsections: [
            { id: "today", name: "Today" },
            { id: "actions", name: "Actions" },
          ],
        },
        {
          id: "upcoming",
          name: "Upcoming",
          kind: "humanity-meetings",
          subsections: [
            { id: "live", name: "Live" },
            { id: "upcoming", name: "Upcoming" },
            { id: "registered", name: "Registered" },
          ],
        },
      ],
    },
    {
      id: "meet",
      name: "Meet",
      icon: "merkaba",
      tone: "blue-deep",
      rooms: [
        {
          id: "formats",
          name: "Formats",
          kind: "humanity-meetings",
          subsections: [
            { id: "election", name: "Election" },
            { id: "top3", name: "Top 3" },
            { id: "roundtable", name: "Roundtable" },
          ],
        },
        {
          id: "room",
          name: "Room",
          kind: "humanity-meetings",
          subsections: [
            { id: "timeline", name: "Timeline" },
            { id: "consensus", name: "Consensus" },
            { id: "entry", name: "Entry" },
          ],
        },
      ],
    },
    {
      id: "fala",
      name: "FALA",
      icon: "tetra",
      tone: "green-deep",
      rooms: [
        {
          id: "temple",
          name: "Temple",
          kind: "humanity-faction",
          subsections: [
            { id: "vision", name: "Vision" },
            { id: "mission", name: "Mission" },
            { id: "foundation", name: "Foundation" },
          ],
        },
        {
          id: "constitution",
          name: "Constitution",
          kind: "humanity-faction",
          subsections: [
            { id: "boundaries", name: "Boundaries" },
            { id: "roles", name: "Roles" },
            { id: "cycle", name: "Election cycle" },
          ],
        },
        {
          id: "alignment",
          name: "Alignment",
          kind: "humanity-faction",
          subsections: [
            { id: "checks", name: "Checks" },
            { id: "unbreakables", name: "Unbreakables" },
          ],
        },
      ],
    },
    {
      id: "people",
      name: "People",
      icon: "square",
      tone: "blue",
      rooms: [
        {
          id: "candidates",
          name: "Candidates",
          kind: "humanity-people",
          subsections: [
            { id: "standing", name: "Standing" },
            { id: "proofs", name: "Proofs" },
          ],
        },
        {
          id: "roles",
          name: "Roles",
          kind: "humanity-people",
          subsections: [
            { id: "noble", name: "Nobles" },
            { id: "steward", name: "Stewards" },
            { id: "regent", name: "Regents" },
          ],
        },
        {
          id: "profile",
          name: "Profile",
          kind: "humanity-people",
          subsections: [
            { id: "account", name: "Account" },
            { id: "history", name: "History" },
          ],
        },
      ],
    },
    {
      id: "stewardship",
      name: "Stewardship",
      icon: "crystal",
      tone: "yellow",
      rooms: [
        {
          id: "chief-list",
          name: "Chief List",
          kind: "humanity-stewardship",
          subsections: [
            { id: "current", name: "Current" },
            { id: "routing", name: "Routing" },
          ],
        },
        {
          id: "proposals",
          name: "Proposals",
          kind: "humanity-stewardship",
          subsections: [
            { id: "planned", name: "Planned" },
            { id: "funded", name: "Funded" },
          ],
        },
        {
          id: "token",
          name: "FALA Token",
          kind: "humanity-stewardship",
          subsections: [
            { id: "resource", name: "Resource layer" },
            { id: "chain", name: "Chain status" },
          ],
        },
      ],
    },
    {
      id: "democracy",
      name: "Democracy",
      icon: "globe",
      tone: "pink",
      rooms: [
        {
          id: "gameday",
          name: "Gameday",
          kind: "humanity-democracy",
          subsections: [
            { id: "election", name: "Election" },
            { id: "rounds", name: "Rounds" },
          ],
        },
        {
          id: "chiefs",
          name: "Chiefs",
          kind: "humanity-democracy",
          subsections: [
            { id: "current", name: "Current" },
            { id: "terms", name: "Terms" },
          ],
        },
        {
          id: "rules",
          name: "Rules",
          kind: "humanity-democracy",
          subsections: [
            { id: "titles", name: "Titles" },
            { id: "change", name: "Change" },
          ],
        },
      ],
    },
    {
      id: "americas",
      name: "Americas",
      icon: "map",
      tone: "yellow",
      bleed: true,
      rooms: [
        {
          id: "map",
          name: "Map",
          kind: "map",
          subsections: [
            { id: "chapters", name: "Chapters" },
            { id: "meetings", name: "Meetings" },
          ],
        },
        {
          id: "levels",
          name: "Levels",
          kind: "humanity-locales",
          subsections: [
            { id: "globe", name: "Globe" },
            { id: "nation", name: "Nation" },
            { id: "division", name: "Top division" },
          ],
        },
      ],
    },
    {
      id: "humanity",
      name: "Humanity",
      icon: "tetra",
      tone: "purple",
      rooms: [
        {
          id: "factions",
          name: "Factions",
          kind: "humanity-system",
          subsections: [
            { id: "available", name: "Available" },
            { id: "register", name: "Register" },
          ],
        },
        {
          id: "guide",
          name: "Game Guide",
          kind: "humanity-system",
          subsections: [
            { id: "core", name: "Core" },
            { id: "maintain", name: "Maintain" },
          ],
        },
        {
          id: "about",
          name: "About",
          kind: "humanity-system",
          subsections: [
            { id: "why", name: "Why" },
            { id: "history", name: "History" },
          ],
        },
      ],
    },
    {
      id: "control",
      name: "Mission Control",
      icon: "control",
      tone: "red",
      special: "mission",
      rooms: [
        {
          id: "access",
          name: "Access",
          kind: "humanity-control",
          subsections: [
            { id: "spectator", name: "Spectator" },
            { id: "member", name: "Member" },
          ],
        },
        {
          id: "account",
          name: "Account",
          kind: "humanity-control",
          subsections: [
            { id: "auth", name: "Authentication" },
            { id: "permissions", name: "Permissions" },
          ],
        },
        {
          id: "settings",
          name: "Settings",
          kind: "humanity-control",
          subsections: [
            { id: "display", name: "Display" },
            { id: "privacy", name: "Privacy" },
          ],
        },
      ],
    },
  ],
}
