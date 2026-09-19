/** Specimen data for the default Grid. Replace in a live Tetra app. */

export const profile = {
  name: "Amina Okoye",
  handle: "amina",
  region: "Lagos",
  nation: "Nigeria",
  statement: "I connect makers in Lagos with work that pays in RA and stays on-chain.",
  tokenId: "TETRA-1042",
  level: 3,
  levelName: "Citizen",
  raDay: 6,
  photo: "AO",
}

export const scoreSets = {
  "24h": {
    stats: [
      { k: "Ups", v: "12" },
      { k: "Connections", v: "4" },
      { k: "Offers", v: "8" },
      { k: "RA claimed", v: "6" },
    ],
    feed: [
      { t: "14m", title: "Up on “Harbor walk, Lagos Island”", meta: "Discovery · +1 RA" },
      { t: "32m", title: "Offer completed · Stamp Lagos", meta: "Passport · You ↔ Kofi" },
      { t: "1h", title: "New connection · Mara Chen", meta: "Recurve voter" },
      { t: "2h", title: "Offer viewed 40 times", meta: "“Teach a Recurve seat”" },
      { t: "3h", title: "Daily RA claimed", meta: "6 RA · Level 3" },
      { t: "5h", title: "Badge unlocked · First stamp", meta: "Crystal" },
      { t: "7h", title: "New offer in region", meta: "Best Offers · 2.4 km" },
      { t: "9h", title: "Content Up · “House Rules draft”", meta: "Localize" },
      { t: "11h", title: "Calendar · Recurve Zoom in 2 days", meta: "Merkaba" },
      { t: "18h", title: "Passport photo updated", meta: "Mutable data" },
      { t: "21h", title: "Offer listed · “Walk the Marina”", meta: "Base · Offers" },
      { t: "23h", title: "Loop back · yesterday’s close", meta: "24h window" },
    ],
  },
  "7d": {
    stats: [
      { k: "Ups", v: "64" },
      { k: "Connections", v: "18" },
      { k: "Offers", v: "21" },
      { k: "RA", v: "42" },
    ],
    feed: [
      { t: "Mon", title: "Season chart +3", meta: "Discovery · regional" },
      { t: "Tue", title: "Two offers completed", meta: "You verified both" },
      { t: "Wed", title: "Recurve group formed", meta: "5 seats · Lagos" },
      { t: "Thu", title: "Content streak · 4 days", meta: "House Rules notes" },
      { t: "Fri", title: "Badge · Well-traveled", meta: "Stamp: Accra" },
      { t: "Sat", title: "Invite accepted", meta: "+1 Tetran in region" },
      { t: "Sun", title: "Weekly RA total", meta: "42 claimed" },
    ],
  },
  "30d": {
    stats: [
      { k: "Ups", v: "210" },
      { k: "Connections", v: "47" },
      { k: "Offers", v: "36" },
      { k: "RA", v: "180" },
    ],
    feed: [
      { t: "Wk 1", title: "Passport complete", meta: "6 RA median claim" },
      { t: "Wk 2", title: "Regional chart top 20", meta: "Offers · Lagos" },
      { t: "Wk 3", title: "First Recurve vote", meta: "Rep path open at L4" },
      { t: "Wk 4", title: "Accolade progress 40%", meta: "Discovery season" },
    ],
  },
  "90d": {
    stats: [
      { k: "Ups", v: "640" },
      { k: "Connections", v: "112" },
      { k: "Offers", v: "58" },
      { k: "RA", v: "540" },
    ],
    feed: [
      { t: "S1", title: "Carnival window opened", meta: "Three-day vote" },
      { t: "S1", title: "Season accolade race", meta: "On-chain if you hold" },
      { t: "S1", title: "National chart bubble", meta: "Lagos → Nigeria" },
    ],
  },
  "1y": {
    stats: [
      { k: "Ups", v: "2.1k" },
      { k: "Connections", v: "380" },
      { k: "Offers", v: "124" },
      { k: "RA", v: "2.0k" },
    ],
    feed: [
      { t: "Q1", title: "Minted Passport", meta: "Level 1" },
      { t: "Q2", title: "Social verification queued", meta: "Level 4 gate" },
      { t: "Q3", title: "Chief race watched", meta: "Govern" },
      { t: "Q4", title: "Year of attention", meta: "Proof, not seats" },
    ],
  },
  life: {
    stats: [
      { k: "Ups", v: "2.1k" },
      { k: "Connections", v: "380" },
      { k: "Offers", v: "124" },
      { k: "RA", v: "2.0k" },
    ],
    feed: [
      { t: "Mint", title: "Passport TETRA-1042", meta: "XPR · one human" },
      { t: "L1", title: "First offer listed", meta: "Harbor walk" },
      { t: "L3", title: "You are here", meta: "Citizen · 6 RA / day" },
    ],
  },
}

export const connections = [
  { name: "Kofi Mensah", meta: "Accra · offer complete", strength: "Strong" },
  { name: "Mara Chen", meta: "Recurve voter · Lagos", strength: "Rising" },
  { name: "Luis Navarro", meta: "Content Up · House Rules", strength: "Fade 2d" },
  { name: "Noor Haddad", meta: "National chart", strength: "Rising" },
  { name: "Elena Voss", meta: "Training cohort", strength: "New" },
  { name: "Region · Lagos", meta: "Tetran ↔ locale", strength: "Bound" },
]

export const newOffers = [
  { title: "Harbor walk, Lagos Island", pay: "4 RA", scope: "Regional", dist: "1.2 km" },
  { title: "Stamp a Recurve seat", pay: "12 RA", scope: "Regional", dist: "Online" },
  { title: "Photograph the Marina at dusk", pay: "8 USDC", scope: "Regional", dist: "3.4 km" },
  { title: "Review House Rules draft", pay: "2 RA", scope: "National", dist: "Doc" },
  { title: "Host a fortnight Zoom", pay: "20 RA", scope: "Regional", dist: "Calendar" },
]

export const myOffers = [
  { title: "Walk the Marina", status: "Open", pay: "4 RA", taken: 2 },
  { title: "Teach a Recurve seat", status: "Pending verify", pay: "12 RA", taken: 1 },
  { title: "Intro to Passport mutable data", status: "Open", pay: "Free", taken: 6 },
]

export const myContent = [
  { title: "House Rules, in plain Jost", kind: "Note", ups: 18 },
  { title: "Why 1 RA / day is a door", kind: "Clip", ups: 41 },
  { title: "Lagos chart, week 12", kind: "Chart", ups: 9 },
]

export const badges = [
  { name: "Passport", icon: "tetra", copy: "Minted · mutable" },
  { name: "Stamp", icon: "square", copy: "Lagos complete" },
  { name: "Discovery", icon: "triangle", copy: "Chart presence" },
  { name: "Recurve", icon: "merkaba", copy: "Seated once" },
  { name: "Localize", icon: "globe", copy: "Region bound" },
  { name: "Crystal", icon: "crystal", copy: "Accolade slot" },
]

export const bestOffers = [
  { title: "Night market circuit", pay: "10 RA", dist: "800 m", rank: 1 },
  { title: "Verify a Chief oath clip", pay: "16 RA", dist: "Online", rank: 2 },
  { title: "Map a HuRA venue", pay: "7 RA", dist: "2.1 km", rank: 3 },
  { title: "Translate House Rules", pay: "5 RA", dist: "Doc", rank: 4 },
]

export const bestContent = [
  { title: "Fractal Zoom, explained", by: "Mara Chen", ups: 88 },
  { title: "Marina at 6 RA", by: "Kofi Mensah", ups: 61 },
  { title: "Oath language, regional", by: "Noor Haddad", ups: 44 },
]

export const peopleBySection = {
  all: [
    { name: "Mara Chen", meta: "Lagos · L4 path", score: "88" },
    { name: "Kofi Mensah", meta: "Accra · stamps", score: "76" },
    { name: "Luis Navarro", meta: "Content", score: "61" },
    { name: "Noor Haddad", meta: "Govern watch", score: "54" },
  ],
  passport: [
    { name: "Elena Voss", meta: "Complete profile", score: "94" },
    { name: "Amina Okoye", meta: "You", score: "90" },
  ],
  discovery: [
    { name: "Mara Chen", meta: "Season race", score: "88" },
    { name: "Luis Navarro", meta: "Ups", score: "71" },
  ],
  recurve: [
    { name: "Noor Haddad", meta: "Rep candidate", score: "80" },
    { name: "Kofi Mensah", meta: "Seat held", score: "66" },
  ],
  localize: [
    { name: "Adebola Ibe", meta: "House Rules", score: "77" },
    { name: "Amina Okoye", meta: "You · Lagos", score: "70" },
  ],
}

export const events = [
  { when: "Fri 19:00", title: "Recurve Zoom · Lagos group", where: "Merkaba" },
  { when: "Sat 10:00", title: "Harbor walk offer window", where: "Marina" },
  { when: "Sun 16:00", title: "Training · How to win", where: "Tetra" },
  { when: "Mon 12:00", title: "Daily Discovery reset", where: "Charts" },
  { when: "Fortnight", title: "Rep election window", where: "Govern" },
]

export const actions = [
  { title: "Mark “Teach a Recurve seat” completed", detail: "Kofi submitted proof. Verify to release 12 RA.", id: "order-12" },
  { title: "Confirm Harbor walk stamp", detail: "Geo check + photo. One tap to close.", id: "order-4" },
  { title: "Claim remaining daily RA", detail: "0 of 6 left if you already claimed.", id: "claim" },
]

export const accolades = [
  { type: "Discovery season", status: "Racing", copy: "Hold rank through Carnival for the on-chain “people love me” mark." },
  { type: "Chief", status: "Locked", copy: "Elected after Recurve. Changes a region." },
  { type: "Well-traveled", status: "Earned", copy: "Stamp from Accra. Offers completed off-home region." },
  { type: "Founding supporter", status: "Locked", copy: "Credit path. Recognized on the Passport." },
  { type: "Carnival", status: "Open", copy: "Three-day vote at season end." },
  { type: "Project", status: "Locked", copy: "Level 7+ Reps direct RA to IRL work." },
]

export const recurveTree = {
  name: "Lagos",
  groups: [
    { id: "g1", name: "Island 1", seats: ["Mara", "You", "Kofi", "Noor", "Luis"] },
    { id: "g2", name: "Island 2", seats: ["Elena", "Adebola", "Tunde", "Chioma"] },
    { id: "g3", name: "Mainland A", seats: ["Ife", "Sam", "Ruth", "Paul", "Zara", "Ngozi"] },
    { id: "g4", name: "Mainland B", seats: ["Omar", "Bea", "Ken"] },
  ],
}

export const training = [
  { step: "01", title: "Wallet", copy: "webauth.com on XPR. Biometrics preferred." },
  { step: "02", title: "Invite", copy: "Redeem from Telegram. One Passport per human." },
  { step: "03", title: "Mint", copy: "KYC, then the mutable NFT." },
  { step: "04", title: "Offer", copy: "What, where, when. RA, USDC, or free." },
  { step: "05", title: "Claim", copy: "Daily RA by level. Attention is the scarce unit." },
  { step: "06", title: "Win", copy: "Charts, stamps, Recurve, House Rules." },
]

export const social = [
  { label: "Know", href: "https://know.tetra.earth" },
  { label: "Tetra", href: "https://tetra.earth" },
  { label: "Telegram", href: "https://t.me/tetragrids" },
  { label: "cXc.world", href: "https://cxc.world" },
]

export const mapPlaces = [
  { name: "Harbor walk", kind: "Offer", lat: 6.4541, lng: 3.3947, copy: "Lagos Island · 4 RA · open" },
  { name: "Marina dusk", kind: "Offer", lat: 6.436, lng: 3.415, copy: "Photograph · 8 USDC" },
  { name: "Recurve Zoom", kind: "Event", lat: 6.5244, lng: 3.3792, copy: "Fri 19:00 · five seats" },
  { name: "HuRA venue", kind: "Localize", lat: 6.465, lng: 3.406, copy: "Map this room for House Rules" },
]
