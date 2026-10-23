/** Humanity On copy. The Solon voice is narrative; historical context is labeled separately. */

export const welcome = {
  eyebrow: "Humanity On",
  headline: "Humanity: A Game",
  lede: "Money won politics, so we built a game only humanity can win.",
  quote: "Gaia has called me to challenge the hearts and minds of humanity.",
  body: "Solon enters the courtyard as our guide. Small groups meet, choose priorities, and advance people they trust. Factions give those groups a shared desire. Humanity gives them a game board.",
  cta: "Enter the game",
}

export const solon = {
  title: "Solon · the historical person",
  body: "Solon was an Athenian lawgiver, poet, and reformer who lived around 630–560 BCE. He is remembered for easing debt bondage and rewriting parts of Athens’ legal and political order. His reforms widened participation, but Athens was not a modern democracy and excluded most residents. Humanity uses Solon as a dramatic guide—not as a claim that ancient Athens was equal or complete.",
}

export const confirmations = [
  {
    id: "system",
    eyebrow: "01 · Systems",
    headline: "Systems are made of parts",
    body: "People made today’s rules, connections, inputs, and outcomes. People can study them, change them, and test what happens next.",
    question: "Do you want to help create systemic change?",
    choices: ["Yes — I will help", "I want to learn first"],
  },
  {
    id: "democracy",
    eyebrow: "02 · Democracy",
    headline: "Democracy can be practiced",
    body: "Humanity turns representation into a regular human practice: small groups, visible priorities, elected roles, and decisions that can be inspected.",
    question: "Do you want to work on a new form of democracy?",
    choices: ["Yes — build with people", "First — watch it work"],
  },
  {
    id: "americas",
    eyebrow: "03 · The Americas",
    headline: "Many nations. One shared game.",
    body: "FALA’s burning desire is to unite all of the Americas culturally, competitively, and economically—without erasing the nations, regions, or people within them.",
    question: "Will you meet people across borders in pursuit of that future?",
    choices: ["Yes — across the Americas", "I will begin locally"],
  },
]

export const humanity = {
  eyebrow: "The game board",
  headline: "Humanity provides the ground",
  body: "A faction decides what it stands for and how its game is played. Humanity supplies shared infrastructure so many factions can meet, elect, fund, and learn without becoming the same organization.",
  provides: [
    "A token and funding lists for each faction",
    "A game guide factions can build upon",
    "Meeting software for elections",
    "Faction vetting plus Temple and Constitution templates",
  ],
  brings: [
    "A Constitution and Temple",
    "A common burning desire",
    "Clear inclusion and exclusion parameters",
    "A meeting concept and cadence",
  ],
  cta: "Choose a faction",
}

export const faction = {
  eyebrow: "Faction",
  headline: "Choose the desire you will serve",
  body: "Factions maintain their own treasury, rulebook, roles, and boundaries. The first available faction is open to everyone.",
  name: "FALA",
  expansion: "Free At Last America",
  language: "Fala means “speak” in Portuguese.",
  desire: "Unite the Americas for unprecedented prosperity and fun.",
  vision: "People across the Americas giving and receiving what they desire.",
  foundation: "Free will to expand experience.",
  status: "Available · Welcome to all",
  cta: "Choose FALA",
}

export const alignment = {
  eyebrow: "FALA · Alignment",
  headline: "Speak your highest truth",
  body: "FALA asks members to believe in humanity’s future, recognize power in each individual, and put real time and attention toward stewardship.",
  checks: [
    "I believe systems can change when people change their parts.",
    "I will protect free will while working with people unlike me.",
    "I want local leaders to help unite the Americas.",
  ],
  cta: "Confirm alignment",
}

export const access = {
  eyebrow: "Access",
  headline: "Choose how you enter",
  body: "A free account can watch meetings. Participation requires an active membership.",
  free: {
    name: "Spectator",
    price: "Free",
    detail: "Watch public meetings. Upgrade later to speak, vote, stand for a role, submit proofs, or receive rewards.",
  },
  member: {
    name: "Member",
    price: "From $2.49/mo",
    detail: "Participate in meetings when eligible. Speak, vote, stand, publish proofs, and receive faction rewards.",
  },
}

export const pay = {
  prime: {
    eyebrow: "Humanity On",
    headline: "Try full participation for $0",
    body: "The 70-day path opens the complete member experience and a lifetime pair. Authentication and payment are placeholders in this preview.",
    cta: "Try now for $0",
  },
  remind: {
    eyebrow: "Trial",
    headline: "We will remind you before it bills",
    timeline: [
      { when: "Today", what: "Member access opens. $0." },
      { when: "Day 67", what: "Reminder while there is still time." },
      { when: "Day 70", what: "Yearly continues unless you cancel." },
    ],
    note: "Monthly reminds on day 5 and bills on day 7. Popular covers a circle and has no trial.",
    cta: "See membership",
  },
  buy: {
    eyebrow: "Membership",
    headline: "Participation in Humanity",
    body: "Meeting access still follows each faction’s rules. Membership opens the tools; it does not guarantee a title, vote, payout, or election result.",
    plans: [
      {
        id: "yearly",
        name: "Yearly",
        badge: "70-day free trial",
        price: "$2.49/mo",
        fine: "Then $29.88/year. Cancel anytime. Opens a lifetime pair.",
      },
      {
        id: "monthly",
        name: "Monthly",
        badge: "7-day free trial",
        price: "$9.99/mo",
        fine: "No pair code on this path.",
      },
    ],
    popular: [
      {
        id: "popular_yearly",
        name: "Popular yearly",
        badge: "No trial · up to 100",
        price: "$99/mo",
        fine: "Billed $1,188/year. One payer keeps the circle in.",
      },
      {
        id: "popular_monthly",
        name: "Popular monthly",
        badge: "No trial · up to 100",
        price: "$249/mo",
        fine: "One payer keeps the circle in.",
      },
    ],
    popularLink: "Cover a circle",
    cta: "Start membership",
  },
}

export const identity = {
  eyebrow: "Account",
  headline: "Choose a way back in",
  body: "This preview stores only your onboarding choices in this browser. Real Google, Microsoft, and XPR authentication will be connected later.",
  methods: ["Google", "Microsoft", "XPR"],
}
