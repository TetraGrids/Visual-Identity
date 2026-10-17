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

export function makeDemoParticipants(count = 5, localName = "You") {
  const n = Math.max(1, Math.min(count, NAMES.length + 1))
  const list = [
    {
      id: "local",
      name: localName || "You",
      letter: (localName || "Y").charAt(0).toUpperCase(),
      avatarUrl: "",
      ready: false,
      isLocal: true,
      canSign: true,
      watcher: false,
    },
  ]
  for (let i = 1; i < n; i++) {
    const name = NAMES[i - 1]
    list.push({
      id: `demo-${i}`,
      name,
      letter: name.charAt(0),
      avatarUrl: "",
      ready: false,
      isLocal: false,
      canSign: i % 3 !== 0, // every 3rd is Google/MS style — needs proxy confirm
      watcher: false,
    })
  }
  return list
}

export function makeManyForBreakout(localName = "You") {
  return makeDemoParticipants(12, localName)
}
