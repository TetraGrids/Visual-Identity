/** Specimen data for the default Grid. Replace in a live Tetra app. */

export const profile = {
  name: "Amina Okoye",
  handle: "amina",
  region: "Lagos",
  city: "Lagos Island",
  nation: "Nigeria",
  statement: "I connect makers in Lagos with work that pays in RA and stays on-chain.",
  tokenId: "TETRA-1042",
  level: 3,
  levelName: "Citizen",
  raDay: 6,
  raClaimed: 6,
  raLeft: 0,
  stakedTetra: 0,
  stakeCap: 12,
  photo: "AO",
  kyc: true,
  invite: true,
  verified: false,
  ngra: false,
  links: [
    { label: "Know", href: "https://know.tetra.earth" },
    { label: "Telegram", href: "https://t.me/tetragrids" },
  ],
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
      { t: "7h", title: "New offer in region", meta: "Best Offers · 1.2 km" },
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
      { t: "Wk 3", title: "First Recurve vote watched", meta: "Rep path open at L4" },
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

export const connectionsByType = {
  people: [
    { name: "Kofi Mensah", meta: "Accra · offer complete", strength: "Strong", initials: "KM" },
    { name: "Mara Chen", meta: "Recurve voter · Lagos", strength: "Rising", initials: "MC" },
    { name: "Luis Navarro", meta: "Content Up · House Rules", strength: "Fade 2d", initials: "LN" },
    { name: "Noor Haddad", meta: "National chart", strength: "Rising", initials: "NH" },
    { name: "Elena Voss", meta: "Training cohort", strength: "New", initials: "EV" },
    { name: "Leo Andes", meta: "Discovery · Andes", strength: "Rising", initials: "LE" },
  ],
  regions: [
    { name: "Region · Lagos", meta: "Home locale · Tetran ↔ region", strength: "Bound", initials: "LA" },
    { name: "Region · Accra", meta: "Stamp · well-traveled", strength: "Earned", initials: "AC" },
    { name: "Nation · Nigeria", meta: "NGRA locked until Level 4", strength: "Watch", initials: "NG" },
    { name: "Global", meta: "Recurve gate · 12,000 users", strength: "Open", initials: "GL" },
  ],
}

export const connections = connectionsByType.people

export const newOffersBySet = {
  incoming: [
    {
      title: "Harbor walk, Lagos Island",
      pay: "4 RA",
      scope: "Regional",
      dist: "1.2 km",
      verify: "Visit site + geo photo",
    },
    {
      title: "Stamp a Recurve seat",
      pay: "12 RA",
      scope: "Regional",
      dist: "Online",
      verify: "Sit Zoom 4–6, on-chain sign",
    },
    {
      title: "Photograph the Marina at dusk",
      pay: "8 USDC",
      scope: "Regional",
      dist: "3.4 km",
      verify: "Upload dusk still",
    },
    {
      title: "Review House Rules draft",
      pay: "2 RA",
      scope: "National",
      dist: "Doc",
      verify: "Comment + verify",
    },
    {
      title: "Host a fortnight Zoom",
      pay: "20 RA",
      scope: "Regional",
      dist: "Calendar",
      verify: "Level 4 gate · locked for you",
    },
  ],
  near: [
    { title: "Night market circuit", pay: "10 RA", scope: "Regional", dist: "800 m", verify: "Walk three stalls" },
    { title: "Map a HuRA venue", pay: "7 RA", scope: "Regional", dist: "2.1 km", verify: "Pin + photo" },
    { title: "Translate House Rules", pay: "5 RA", scope: "National", dist: "Doc", verify: "Pull request" },
    { title: "Follow Lagos Recurve Telegram", pay: "Free", scope: "Regional", dist: "t.me/tetragrids", verify: "Join shown" },
  ],
}

export const newOffers = newOffersBySet.incoming

export const myOffersBySet = {
  listed: [
    { title: "Walk the Marina", status: "Open", pay: "4 RA", taken: 2, scope: "Regional · geo photo" },
    { title: "Intro to Passport mutable data", status: "Open", pay: "Free", taken: 6, scope: "Global · view page" },
  ],
  pending: [
    {
      title: "Teach a Recurve seat",
      status: "Pending verify",
      pay: "12 RA",
      taken: 1,
      scope: "Kofi submitted Zoom proof",
    },
  ],
  completed: [
    {
      title: "Harbor walk (as offerer)",
      status: "Verified",
      pay: "4 RA",
      taken: 1,
      scope: "Accra guest stamped Lagos",
    },
  ],
}

export const myOffers = [...myOffersBySet.listed, ...myOffersBySet.pending]

export const myContent = [
  { title: "House Rules, in plain Jost", kind: "Note", ups: 18 },
  { title: "Why 1 RA / day is a door", kind: "Clip", ups: 41 },
  { title: "Lagos chart, week 12", kind: "Chart", ups: 9 },
]

export const rankedContent = [
  { campaign: "Local citizens", status: "Scaling", ra: "1.69" },
  { campaign: "Regional charts", status: "Scaling", ra: "1.87" },
  { campaign: "Weekly rooms", status: "Working", ra: "2.02" },
  { campaign: "Venue landing", status: "Paused", ra: "5.80" },
]

export const badges = [
  { name: "Passport", icon: "tetra", copy: "Minted · mutable" },
  { name: "Stamp", icon: "square", copy: "Lagos complete" },
  { name: "Discovery", icon: "triangle", copy: "Chart presence" },
  { name: "Recurve", icon: "merkaba", copy: "Seated once · watch" },
  { name: "Localize", icon: "globe", copy: "Region bound" },
  { name: "Crystal", icon: "crystal", copy: "Accolade slot" },
]

export const badgeGates = [
  { name: "L4 Social verification", copy: "Locked · three witnesses + oath video" },
  { name: "NGRA national RA", copy: "Locked · 2–4× vs generic RA" },
  { name: "Recurve vote", copy: "Locked · Level 4" },
  { name: "Baron / Steward crystal", copy: "Locked · stake TETRA" },
  { name: "Founding supporter", copy: "Locked · Givebutter path" },
]

export const stamps = {
  home: [{ name: "Lagos", copy: "Complete · Harbor walk. You live here — not a travel stamp.", status: "Home" }],
  abroad: [{ name: "Accra", copy: "Well-traveled · offer completed off-home region. On Passport.", status: "Earned" }],
}

export const claimLedger = [
  { when: "Today", amount: "+6 RA", source: "Daily claim L3" },
  { when: "Yesterday", amount: "+6 RA", source: "Daily claim" },
  { when: "Fri", amount: "−1 RA", source: "Up · Harbor walk" },
  { when: "Thu", amount: "−4 RA", source: "Paid offer · Marina walk · secret link" },
  { when: "Wed", amount: "+12 RA", source: "Offer completed · Teach a Recurve seat" },
]

export const bestOffersByLocale = {
  region: [
    { title: "Night market circuit", pay: "10 RA", dist: "800 m", rank: 1, ups: 88 },
    { title: "Verify a Chief oath clip", pay: "16 RA", dist: "Online", rank: 2, ups: 61 },
    { title: "Map a HuRA venue", pay: "7 RA", dist: "2.1 km", rank: 3, ups: 44 },
    { title: "Translate House Rules", pay: "5 RA", dist: "Doc", rank: 4, ups: 29 },
  ],
  nation: [
    { title: "Night market circuit", pay: "10 RA", dist: "Lagos bubbles", rank: 1, ups: 88 },
    { title: "Oath language, regional", pay: "6 RA", dist: "Nigeria", rank: 2, ups: 52 },
    { title: "NGRA booster (gated)", pay: "—", dist: "L4 only", rank: 3, ups: 0 },
  ],
  global: [
    { title: "Andes chart climb", pay: "9 RA", dist: "Nation winner", rank: 1, ups: 210 },
    { title: "Night market circuit", pay: "10 RA", dist: "Lagos → globe", rank: 12, ups: 88 },
    { title: "Global Recurve", pay: "—", dist: "12,000 user gate", rank: "—", ups: 0 },
  ],
}

export const bestOffers = bestOffersByLocale.region

export const bestContentByLocale = {
  region: [
    { title: "Fractal Zoom, explained", by: "Mara Chen", ups: 88 },
    { title: "Marina at 6 RA", by: "Kofi Mensah", ups: 61 },
    { title: "Oath language, regional", by: "Noor Haddad", ups: 44 },
  ],
  nation: [
    { title: "Fractal Zoom, explained", by: "Mara Chen", ups: 88 },
    { title: "House Rules, Yoruba cut", by: "Adebola Ibe", ups: 57 },
  ],
  global: [
    { title: "Proof of attention, Andes", by: "Leo Andes", ups: 312 },
    { title: "Fractal Zoom, explained", by: "Mara Chen", ups: 88 },
  ],
}

export const bestContent = bestContentByLocale.region

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

export const seasonRace = {
  stats: [
    { k: "Season", v: "S1" },
    { k: "To accolade", v: "40%" },
    { k: "Window", v: "3 mo" },
    { k: "Mark", v: "On-chain" },
  ],
  feed: [
    { t: "Now", title: "Hold rank through Carnival", meta: "“The people love me” on Passport" },
    { t: "Lagos", title: "Regional cumulative", meta: "Charts reset daily · season does not" },
    { t: "Nigeria", title: "National bubble", meta: "NGRA votes locked for L3" },
  ],
}

export const carnivalZooms = [
  { title: "Zoom 1", copy: "Three-day vote at season end. Live Know page truncates here." },
  { title: "Zoom 2", copy: "Copy TBD · docs incomplete." },
  { title: "Zoom 3", copy: "Placeholder until Carnival text ships." },
]

export const algorithmRows = {
  default: [
    { signal: "Ups", weight: "1.0", note: "1 RA each" },
    { signal: "Offer RA", weight: "1.0", note: "Same weight as Ups" },
  ],
  chief: [
    { signal: "Local RA ups", weight: "Default", note: "Chiefs may raise" },
    { signal: "Local offers", weight: "Default", note: "Chiefs may raise" },
    { signal: "Regional connections", weight: "Default", note: "Display reweight" },
  ],
}

export const calendarBySet = {
  recurve: [
    { when: "Fri 19:00", title: "Recurve Zoom · Lagos group", where: "Merkaba · 5 seats · fortnightly" },
    { when: "−30 min", title: "Chiefs / Reps welcome newcomers", where: "Show early with questions" },
    { when: "10 min", title: "Landing", where: "Main event start" },
    { when: "50 min", title: "Consensus", where: "30 present · 20 vote on-chain" },
    { when: "20 min", title: "Regroup / share", where: "Reps 3 min each" },
    { when: "Fortnight", title: "Rep election window", where: "Govern · ~1.5h or ~3h if second round" },
  ],
  hura: [
    { when: "Full moon", title: "HuRA Lagos", where: "Host / co-create / join · region activated" },
    { when: "Win", title: "Hold a badass HuRa IRL", where: "Localize" },
  ],
  carnival: [
    { when: "Season end", title: "Three-day vote", where: "Discovery accolade" },
    { when: "TBD", title: "Three Carnival Zooms", where: "Know page incomplete" },
  ],
}

export const events = calendarBySet.recurve

export const actionsBySet = {
  verify: [
    {
      title: "Mark “Teach a Recurve seat” completed",
      detail: "Kofi submitted proof. Verify to release 12 RA.",
      id: "order-12",
    },
    {
      title: "Confirm Harbor walk stamp",
      detail: "Geo check + photo. One tap to close.",
      id: "order-4",
    },
  ],
  claim: [
    {
      title: "Claim remaining daily RA",
      detail: "0 of 6 left if you already claimed.",
      id: "claim",
    },
    {
      title: "Buy RA boost",
      detail: "Market RA comes from earners.",
      id: "boost",
    },
    {
      title: "Stake TETRA",
      detail: "Extra max claim + crystal access.",
      id: "stake",
    },
  ],
}

export const actions = [...actionsBySet.verify, ...actionsBySet.claim]

export const recurveAgenda = [
  { who: "Room", text: "How do these hold up in a room of 6?" },
  { who: "Rep", text: "Interesting, can you do Tuesday 2pm?" },
  { who: "You", text: "Tuesday 2pm works, sending the Zoom now.", out: true },
]

export const accoladesBySet = {
  earned: [
    {
      type: "Well-traveled",
      status: "Earned",
      copy: "Stamp from Accra. Offers completed off-home region.",
    },
  ],
  locked: [
    {
      type: "Discovery season",
      status: "Racing",
      copy: "Hold rank through Carnival for the on-chain “people love me” mark.",
    },
    { type: "Chief", status: "Locked", copy: "Elected after Recurve. Changes a region." },
    { type: "Founding supporter", status: "Locked", copy: "Credit path. Recognized on the Passport." },
    { type: "Carnival", status: "Open", copy: "Three-day vote at season end." },
    { type: "Project", status: "Locked", copy: "Level 7+ Reps direct RA to IRL work." },
  ],
}

export const accolades = [...accoladesBySet.earned, ...accoladesBySet.locked]

export const recurveTree = {
  name: "Lagos",
  groups: [
    { id: "g1", name: "Island 1", seats: ["Mara", "You", "Kofi", "Noor", "Luis"] },
    { id: "g2", name: "Island 2", seats: ["Elena", "Adebola", "Tunde", "Chioma"] },
    { id: "g3", name: "Mainland A", seats: ["Ife", "Sam", "Ruth", "Paul", "Zara", "Ngozi"] },
    { id: "g4", name: "Mainland B", seats: ["Omar", "Bea", "Ken"] },
  ],
}

export const recurveRounds = [
  { step: "1", title: "Share last 2 weeks", copy: "What you did / who benefitted." },
  { step: "2", title: "Consensus", copy: "Group picks who did the most." },
  { step: "3", title: "On-chain sign", copy: "You cannot sign. Level 4 required." },
  { step: "4", title: "Elect upward", copy: "Reps regroup until a Chief path winner." },
]

export const repsRank = [
  { name: "Noor Haddad", weeks: "6", role: "Connector" },
  { name: "Mara Chen", weeks: "4", role: "Educator" },
  { name: "Kofi Mensah", weeks: "2", role: "—" },
  { name: "You", weeks: "0", role: "Watch" },
]

export const chiefsFour = [
  { name: "Kai Hokkaido", meta: "Founding · until first election", initials: "KA" },
  { name: "Adebola Ibe", meta: "Least-staked · exits first", initials: "AI" },
  { name: "Noor Haddad", meta: "Also a Rep", initials: "NH" },
  { name: "Mara Chen", meta: "Staggered 2-year term", initials: "MC" },
]

export const councilVotes = [
  { item: "Discovery weight · local offers", tally: "4 / 4", result: "Approve" },
  { item: "Ban global offer type X", tally: "3 / 1 veto", result: "Hold for next Chief" },
  { item: "Marina venue partnership", tally: "Pending", result: "—" },
]

export const defaultRoles = [
  "Content Creator",
  "Educator",
  "Recruiter",
  "Connector",
  "Event Planner",
  "Master of Coin",
  "Developer",
]

export const rolesHeld = [
  { name: "Noor Haddad", role: "Connector" },
  { name: "Mara Chen", role: "Educator" },
  { name: "You", role: "None · not a Rep" },
]

export const houseRules = {
  ratified: [
    { q: "Local charts first (blinders)", a: "Locals find work first, then ride to national / global." },
    { q: "Offer types allowed in Lagos", a: "Written by Reps, ratified by Chiefs, inside system parameters." },
    { q: "No dogs on the sofa.", a: "Unexplained in the docs. Kept as a live rule chip." },
  ],
  drafts: [
    { q: "Discovery weight proposal", a: "Chief customize. Pending Council." },
  ],
}

export const procedures = {
  active: [
    { title: "Official channel", copy: "t.me/tetragrids" },
    { title: "Recurring HuRA", copy: "Full moon · Chiefs and Reps organize" },
    { title: "Local RA extras", copy: "Beyond core gameplay" },
  ],
  proposed: [
    { title: "Venue partnership", copy: "Marina dusk fulfill site" },
  ],
}

export const huraEvents = {
  next: [
    { when: "Full moon", title: "HuRA Lagos", where: "Host / co-create / join · activated region" },
  ],
  past: [
    { when: "Last moon", title: "Marina", where: "86 attended · badge of their area" },
  ],
}

export const venues = {
  pins: [
    { title: "Harbor walk", copy: "Offer fulfill · Lagos Island" },
    { title: "Marina dusk", copy: "Offer fulfill" },
    { title: "HuRA room", copy: "Meetup + RA redeem" },
  ],
  enable: [
    { title: "RA redemption", copy: "Physical places in-app" },
    { title: "Meetups", copy: "Mapped and discoverable" },
    { title: "Offer fulfillment", copy: "Geo + proof" },
  ],
}

export const regionMetrics = {
  region: [
    { k: "Users", v: "1,842" },
    { k: "Daily connections", v: "310" },
    { k: "RA / day cap", v: "4.2k" },
    { k: "Gov turnout", v: "18%" },
  ],
  compare: [
    { k: "Vs lowest active", v: "Above" },
    { k: "Vs Nigeria", v: "Lead" },
    { k: "Vs 12k Recurve", v: "Short" },
    { k: "Stake pool", v: "4,200" },
  ],
}

export const activationFounders = [
  { name: "Kai Hokkaido", copy: "Nominated founding Chief. No per-person minimum." },
  { name: "Adebola Ibe", copy: "Least-staked · transitions first after election." },
  { name: "Noor Haddad", copy: "KYC complete." },
  { name: "Mara Chen", copy: "One member may supply the whole stake." },
]

export const training = [
  { step: "01", title: "Wallet", copy: "webauth.com on XPR. Biometrics preferred. No gas. No initial crypto." },
  { step: "02", title: "Invite", copy: "Redeem from Telegram. One Passport per human. Status: Opening / Pending." },
  { step: "03", title: "Mint", copy: "KYC, then the mutable NFT. Join page still marks this Pending." },
  { step: "04", title: "Offer", copy: "What, where, when. RA, USDC, or free. How to verify." },
  { step: "05", title: "Claim", copy: "Daily RA by level. Attention is the scarce unit." },
  { step: "06", title: "Win", copy: "Charts, stamps, Recurve, House Rules." },
]

export const howToWin = [
  { title: "Passport", copy: "Compelling narrative around platforms and offers. Stamps from other regions." },
  { title: "Discovery", copy: "Top of region, nation, or world for a day or longer. Blow up offers." },
  { title: "Recurve", copy: "Be a Rep who takes a Role. Be a Chief who changes a region." },
  { title: "Localize", copy: "Hold a Role. Throw HuRA IRL." },
]

export const social = [
  { label: "Know", href: "https://know.tetra.earth" },
  { label: "Tetra", href: "https://tetra.earth" },
  { label: "Telegram", href: "https://t.me/tetragrids" },
  { label: "cXc.world", href: "https://cxc.world" },
]

export const faqBySet = {
  cost: [
    {
      q: "Does Tetra cost anything?",
      a: "Without payment you get a daily share of RA. Earn when you pay attention, not dollars. You can buy RA for a boost and stake TETRA. Market RA comes from earners.",
    },
    {
      q: "Do I need a crypto wallet?",
      a: "Yes. webauth.com on XPR. Works best on mobiles with biometrics.",
    },
    {
      q: "What about gas fees?",
      a: "You don’t need any crypto for gas. Transact and complete KYC free.",
    },
    {
      q: "Can I earn on Tetra?",
      a: "Offers can earn XUSDC and RA if you charge, or you put up USDC/RA to incentivize. Connections can also feed existing platforms.",
    },
  ],
  app: [
    {
      q: "What does Tetra mean?",
      a: "Four. Nested tetrahedron, top-down. Numerology throughout.",
    },
    {
      q: "Who is the founder?",
      a: "Douglas Butner. Web4 manifesto 2020. cXc.world 2018–present. 100th member of Fractally.",
    },
    {
      q: "What is the app like?",
      a: "UI unreleased. Some views will be map-based. This Grid is the specimen.",
    },
  ],
}

export const journey = [
  { n: "01", title: "Create your Passport", copy: "Profile + offer → daily RA." },
  { n: "02", title: "Explore your region", copy: "Discovery + Recurve (fortnight)." },
  { n: "03", title: "Build influence", copy: "RA → connections → social verification after L3." },
  { n: "04", title: "Engage in governance", copy: "Elections, rules, regional projects." },
]

export const mapPlaces = [
  {
    name: "Harbor walk",
    kind: "Offer",
    set: "offers",
    lat: 6.4541,
    lng: 3.3947,
    copy: "Lagos Island · 4 RA · open",
  },
  {
    name: "Marina dusk",
    kind: "Offer",
    set: "offers",
    lat: 6.436,
    lng: 3.415,
    copy: "Photograph · 8 USDC",
  },
  {
    name: "Recurve Zoom",
    kind: "Event",
    set: "cadence",
    lat: 6.5244,
    lng: 3.3792,
    copy: "Fri 19:00 · five seats",
  },
  {
    name: "HuRA venue",
    kind: "Localize",
    set: "cadence",
    lat: 6.465,
    lng: 3.406,
    copy: "Map this room for House Rules",
  },
]
