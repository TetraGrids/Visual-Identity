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
  gap: 14,
}

export const defaultGrid = {
  id: "tetra-grid",
  name: "The Grid",
  snap: GRID_SNAP,
  notes: {
    title: "The Grid",
    body: "App shell for Tetra. Discrete vertical lanes, horizontal rooms, nested subsections. Snap at 38%. After Mission Control, looping back requires 62% so the wrap is deliberate.",
    backHref: "/#demos",
    backLabel: "Back to the site",
  },
  lanes: [
    {
      id: "delta",
      name: "Delta",
      icon: "triangle",
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
        { id: "connections", name: "New Connections", kind: "connections" },
        { id: "offers", name: "New Offers", kind: "new-offers" },
      ],
    },
    {
      id: "base",
      name: "Base",
      icon: "square",
      rooms: [
        { id: "offers", name: "Offers", kind: "my-offers" },
        { id: "content", name: "Content", kind: "content" },
        { id: "passport", name: "Passport", kind: "passport" },
        { id: "badges", name: "Badges", kind: "badges" },
      ],
    },
    {
      id: "penta",
      name: "Penta",
      icon: "pentagon",
      rooms: [
        { id: "best-offers", name: "Best Offers", kind: "best-offers" },
        { id: "best-content", name: "Best Content", kind: "best-content" },
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
      ],
    },
    {
      id: "merkaba",
      name: "Merkaba",
      icon: "merkaba",
      rooms: [
        { id: "calendar", name: "Calendar", kind: "calendar" },
        { id: "actions", name: "Actions", kind: "actions" },
      ],
    },
    {
      id: "crystal",
      name: "Crystal",
      icon: "crystal",
      rooms: [{ id: "accolades", name: "Past Accolades", kind: "accolades" }],
    },
    {
      id: "govern",
      name: "Govern",
      icon: "globe",
      rooms: [{ id: "recurve", name: "Map Recurve Sections", kind: "recurve" }],
    },
    {
      id: "tetra",
      name: "Tetra",
      icon: "tetra",
      rooms: [
        { id: "level", name: "Level", kind: "level" },
        { id: "rep", name: "Representative", kind: "rep" },
        { id: "training", name: "Training", kind: "training" },
        { id: "social", name: "Social", kind: "social" },
      ],
    },
    {
      id: "map",
      name: "Map",
      icon: "map",
      bleed: true,
      rooms: [{ id: "world", name: "World", kind: "map" }],
    },
    {
      id: "mission",
      name: "Mission Control",
      icon: "control",
      special: "mission",
      rooms: [{ id: "control", name: "Control", kind: "mission" }],
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
