/** Simulated participants for demo mode (no LiveKit token server). */

const NAMES = [
  "Ava",
  "Ben",
  "Cora",
  "Diego",
  "Elena",
  "Finn",
  "Gita",
  "Hiro",
  "Imani",
  "Jules",
  "Kai",
  "Lina",
]

const DEMO_PROOFS = [
  {
    brief: "Building **open commons** tooling for Antelope.",
    imageData: "",
    links: ["https://know.tetra.earth"],
    kpis: [{ name: "Retention", type: "percent", value: "42" }],
  },
  {
    brief: "Ship weekly. Measure what matters.",
    imageData: "",
    links: ["https://github.com"],
    kpis: [{ name: "PRs", type: "integer", value: "18" }],
  },
  {
    brief: "Roundtable facilitator.",
    imageData: "",
    links: [],
    kpis: [],
  },
  {
    brief: "Docs + education.",
    imageData: "",
    links: ["https://docs.example"],
    kpis: [{ name: "Guide", type: "link", value: "https://know.tetra.earth" }],
  },
]

export function makeDemoParticipants(count = 5, localName = "You", localProofs = null) {
  const n = Math.max(1, Math.min(count, NAMES.length + 1))
  const list = [
    {
      id: "local",
      name: localName || "You",
      letter: (localName || "Y").charAt(0).toUpperCase(),
      avatarUrl: localProofs?.imageData || "",
      ready: false,
      isLocal: true,
      canSign: true,
      watcher: false,
      proofs: localProofs || {
        brief: "",
        imageData: "",
        links: [],
        kpis: [],
      },
    },
  ]
  for (let i = 1; i < n; i++) {
    const name = NAMES[i - 1]
    const proofs = DEMO_PROOFS[(i - 1) % DEMO_PROOFS.length]
    list.push({
      id: `demo-${i}`,
      name,
      letter: name.charAt(0),
      avatarUrl: "",
      ready: false,
      isLocal: false,
      canSign: i % 3 !== 0,
      watcher: false,
      proofs,
    })
  }
  return list
}

export function makeManyForBreakout(localName = "You", localProofs = null) {
  return makeDemoParticipants(12, localName, localProofs)
}
