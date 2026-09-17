# Tetra Knowbase — organized reading

Source: [know.tetra.earth](https://know.tetra.earth) (GitBook “Tetra Knowbase”), captured 17 Sep 2026 from `llms.txt`, `sitemap.md`, each page’s `.md` export, and `llms-full.txt`.

This file does two jobs:

1. **System map** — every named element, how it relates, and what the docs actually say.
2. **Page archive** — full text of every published page, in site order.

Carnival on *Life as a Tetran* is truncated on the live site (ends mid-sentence). A few pages still use GitBook `{% hint %}` / `{% content-ref %}` tags; those are preserved in the archive.

---

## Site map (13 pages)

| Page | URL | One-line |
| --- | --- | --- |
| Tetra Overview | [/](https://know.tetra.earth/) · [/overview](https://know.tetra.earth/overview) | Grid of human-to-human offers; products, levels, tokens, roadmap |
| What is a Tetran? | [/go](https://know.tetra.earth/go) | Citizen of tetra.earth; digital + IRL |
| Why should I be a Tetran? | [/why-should-i-be-a-tetran](https://know.tetra.earth/why-should-i-be-a-tetran) | For creators and for local learners/leaders |
| How to become a Tetran | [/join](https://know.tetra.earth/join) | Wallet → invite → mint Passport → Level 1 |
| Life as a Tetran | [/life-as-a-tetran](https://know.tetra.earth/life-as-a-tetran) | Daily / full-moon / carnival cadence |
| How to Win | [/how-to-win](https://know.tetra.earth/how-to-win) | Win conditions on Passport, Discovery, Recurve, Localize |
| Passport | [/passport](https://know.tetra.earth/passport) | NFT identity: profile, offers, connections, stamps, accolades |
| Discovery | [/discovery](https://know.tetra.earth/discovery) | Daily charts; Ups; RA ranking |
| Recurve | [/recurve](https://know.tetra.earth/recurve) | Fractal Zoom elections for Reps and Chiefs |
| Localize | [/localize](https://know.tetra.earth/localize) | Region activation, House Rules, Procedures, Roles, HuRA |
| Telegram | [/telegram](https://know.tetra.earth/telegram) | `t.me/tetragrids` |
| FAQs | [/faqs](https://know.tetra.earth/faqs) | Cost, wallet, gas, earning, name, founder, UI |
| Donate | [/donate](https://know.tetra.earth/donate) | Givebutter |

Official community: [t.me/tetragrids](https://t.me/tetragrids). Donate via Givebutter (linked from Donate; exact URL not in the markdown export).

---

## How the system fits together

```
Invite + KYC (XPR) + mint Passport NFT
        ↓
Tetran (Level 1) posts Offers, claims daily RA
        ↓
Offers + Ups + votes form Connections (person↔person, person↔region)
        ↓
Discovery charts (region → nation → globe), daily reset
        ↓
Level 4 Social Verification (oath on video, on-chain)
        ↓
Recurve elections (Zoom, groups of 4–6) → Reps → Chiefs
        ↓
Localize: four founders stake TETRA, activate a Region
        ↓
House Rules / Procedures / Roles + HuRA IRL + venues
```

**Thesis from Overview:** Tetra is a global grid of human-to-human offers. You record what you offer, where, and when; Tetra is the interface to monetize it. Completing offers turns you into a node in a network. Attention is the scarce resource (daily competitions). Inclusion is open; outcomes are unequal (“few will gain the most”).

---

## Element glossary

### Identity and people

| Element | What it is |
| --- | --- |
| **Tetra** | The platform / economy. Name means four. Mark: tetrahedron in a larger tetrahedron, top-down. Founder: Douglas Butner (web4 manifesto 2020; [cXc.world](https://cxc.world) 2018–present). UI unreleased; some views will be map-based. |
| **Tetran** | A citizen of Tetra: anyone with a Tetra Passport. Lives in the real world, “eats from the digital one.” |
| **Passport** | Mutable NFT after KYC on XPR. Holds profile, offers, stamps, accolades. Connections are *displayed* but *not stored on the NFT*. One passport per human. Invite required to activate. Starts at 1 RA/day. |
| **Invite** | Redeem to activate Passport. Codes from Telegram. Overview roadmap: invite system “Opening” 2024; Join page still marks redeem/mint as Pending. |
| **KYC** | On XPR. Free, no gas / no initial crypto. Required to mint Passport and for founding chiefs. |
| **Wallet** | XPR network wallet at [webauth.com](https://webauth.com) (mobile + biometrics preferred). |
| **Profile** | Required region; optional city; connection statement (region + worldwide); photo; optional contact/social links. |
| **Stamps** | On Passport for completing offers in *other* regions (“well-traveled”). |
| **Accolades** | Stronger than stamps. Examples: topping Discovery for a season; becoming Chief. Gate supercharged features. Stored on-chain for seasonal Discovery ranks. |

### Offers (the atomic unit)

An offer has:

- Description of what it takes to complete
- Acceptance criteria / how to verify
- Cost or payment in **RA**, **USDC**, or any token (or free)

Flow: describe action → someone does it → you verify → RA is released. If you cannot pay, it comes out of your daily RA share until paid off. Charging RA can reveal a secret link.

Scope: regional, national, or global. **Rule:** if it is illegal in one region or nation, it cannot be a global offer. Informal rule: “No dogs on the sofa.”

Examples: visit a site, download a song, follow/subscribe, visit a shop, attend a meetup.

Tracked: views, clicks, conversions → Discovery rank. Completing an offer raises status and reach.

### Connections (the grid)

| Type | How they form |
| --- | --- |
| Tetran ↔ Tetran | Complete an offer (you ↔ offerer); elect a Rep/Chief (voter ↔ candidate); upvote (you ↔ creator) |
| Tetran ↔ Region | Completing an offer also connects you to the region the offer is published in |
| Tetran ↔ offer / creation | Completing or upvoting |

Connections fade daily; repeated interaction strengthens them. Can be hidden per type. Discovery/recommendation: content, offers, and Passports with similar connections. Chiefs can reweight Discovery toward regional connections.

### Geography (locales)

| Level | Meaning |
| --- | --- |
| **Global** | Worldwide community and economy. Global Recurve at 12,000 registered users. |
| **National** | Country games and governance. After Level 4: national RA (USARA, COLRA, …) only usable in that nation. National chart wins bubble to global. |
| **Regional** | Top-level administrative district of a country. Direct democracy, local charts, HuRA, House Rules. |

Local charts “put up blinders” so locals find work first, then ride together to national/global.

### Tokens and money

| Element | Role |
| --- | --- |
| **RA** | Daily attention currency. Earn by level. Spend to facilitate offers and **Ups**. Tradable for XPR, XUSDC, etc.; market RA comes from earners. Can buy RA for a boost. |
| **Daily claim** | Increases with level. Localize formula: `User's Staked TETRA + 12 = Maximum Daily RA Claim`. Overview also says TETRA staking raises max claimable RA. |
| **Local / national RA** | After Level 4. 2–4× influence vs generic RA (Overview). Only useful in that nation (Discovery). |
| **Regional RA pool** | Total TETRA staked to a locale = daily RA distribution capacity. Each TETRA staked adds 1 RA to daily distribution. |
| **TETRA** | Stake for permanent benefits: extra RA claim, Baron/Steward access (“crystal”), activate a region + founding Chief. |
| **USDC / XUSDC** | Offer payments; Baron/Steward revenue. 50% of USDC from Barons + Stewards goes to current Chiefs. |
| **XPR** | Chain for KYC, Passport NFT, free gas. |

**Default Discovery rank:** sum of all Ups + total RA of all offers (same weight). Strategy: get people to take the offer instead of buying Ups; or Ups to get an unseen offer seen; charging RA earns RA *and* chart exposure.

**Up / Upvote:** costs 1 RA each.

### Products (four pillars)

| Product | Job |
| --- | --- |
| **Passport** | Identity, offers, social graph surface |
| **Discovery** | Daily ranked charts: Passports, Offers, Content × region, country, global. Historic day/week/month/season. Seasonal (3-month) cumulative rank → on-chain Passport accolade (“the people love me”). |
| **Recurve** | Fractal governance game (based on **Fractally**; founder was the 100th member). Face-to-face Zoom. Groups of 4–6. Elect Reps and Chiefs. |
| **Localize** | Activate and customize a region: House Rules, Procedures, Roles, HuRA, venues |

**Premium (“Cheat Codes”):**

- **Barons** — paid sponsorship; boosted profiles/offers for individuals
- **Stewards** — company sponsorship; localized promotion
- **Founding Supporters** — credit card / PayPal donations; high-value donors (or their org/idea) recognized

### Levels and offices

Docs mix “Citizen / Full Citizen / Regent / Chief” (Overview) with Recurve “Reps / Chiefs” and Projects at Level 7+. Combined as stated:

| Band | Who | Daily RA (Overview) | Access |
| --- | --- | --- | --- |
| **1–3 Citizens** | After mint | 1–6 | Passport, offers, Discovery |
| **4–6 Full Citizens** | After **Social Verification** | 12–48 | Governance; can be Regents; national RA; Recurve elections require Level 4 |
| **Regents** | Elected (Overview) | Earn by regional roles | Propose House Rules/Procedures; take a Role. Recurve page calls the elected peer **Reps** (Level 6 mentioned for fortnightly meetings) |
| **Chiefs** | Elected | % of local economy | Ratify/veto rules; highest regional office |
| **7–9 Pending** | Projects (video) | — | IRL land partnerships (e.g. Starseed). Recurve: Reps Level 7+ direct RA to **Projects** |

**Social Verification:** three already-verified people meet the prospect. On-video **Oath** to rules of engagement. Proof on-chain. Unlocks Level 4.

**Reps (Representatives):**

- Elected every **fortnight** (2 weeks) in Zoom breakouts of 4–6
- Ranked by weeks elected Rep
- Term: **2 months**, or while holding a Role + ≥1 meeting/month
- Propose House Rules and Procedures
- Encouraged to take a Role
- Only Reps can run for Chief
- All Chiefs are also Reps

**Chiefs:**

- **Four** per region
- New Chief every **6 months**, term **2 years** (staggered)
- Campaign/announce only in the last 6 months before election
- After a term: skip the next election, eligible after that
- Ratify or veto House Rules and Procedures
- Split **50%** of regional Baron + Steward revenue; autonomous spend
- Can customize Discovery (weight local RA ups, local offers, or regional connections)
- Leader powers (via House Rules / Procedures): passport requirements, Recurve meetings, ban/allow offer types, partnerships, modify citizen oath, local events
- **Council of Chiefs:** all 4 must approve a House Rule/Procedure change. If 3 approve and 1 vetoes, it can pass next session (after a new Chief) with 3+ approving

**Founding Chiefs** (Localize activation): four nominated founders until first election. No per-person stake minimum (one member can supply the whole stake). Least-staked Founding Chief transitions out first.

### Recurve meeting (as specified)

- ~1.5 hours, or ~3 hours if a second round
- **−30 min:** Chiefs/Reps welcome newcomers
- Landing 10 min
- Main consensus 50 min: presentations 30 min (5 min each), consensus + on-chain votes 20 min
- Regroup/share 20 min (Reps 3 min each)
- Second round if 4+ representatives want to continue
- Process: share last 2 weeks’ contributions → group consensus on who did the most → on-chain sign → elected Reps regroup and elect upward until a winner (Chief path)

**Activation gates:** Global Recurve at 12,000 users → then local Recurve by region/country. Docs say Recurve is “not going to be here for a while”; focus on Passport.

**Projects:** per-region after Recurve activity threshold. Seasonal deliverables scored 0–100 by Project and the Rep. “Learn how projects work by making a project on paper.”

### Localize (region operating system)

**Activation requirements:**

- Population higher than current lowest active region
- Activity higher than current lowest active region
- Four founding members stake TETRA (collective stake must exceed average regional stake)
- KYC for all founding members/chiefs
- Same four nominated as founding chiefs

**House Rules:** gameplay customizations (Discovery, connections, regional priorities) written by Reps, ratified by Chiefs, must stay inside system parameters.

**Procedures:** how events, channels, initiatives, standards, local RA rewards run — beyond core gameplay.

**Default Roles** (Reps; **3/4 Chief** approval): Content Creator, Educator, Recruiter, Connector, Event Planner, Master of Coin, Developer.

**HuRA:** in-person gatherings (full moon / regional party). Host, co-create, or join. Region must be activated. Organized by Chiefs and Reps. Win condition: “holding a badass HuRa celebration IRL.”

**Tetra-enabled venues:** physical places in-app: RA redemption, meetups, offer fulfillment.

**Metrics:** registered users, daily active connections, RA/USDC activity, stake distribution, governance participation.

**Planned tech (named, not specified):** APIs for activation status, proposals, roles, stats; contracts for stake, rules, revenue, role verification. Future: venues, more roles, analytics, cross-region tools, better proposals/voting/rules.

### Cadence and “win”

| Rhythm | What happens |
| --- | --- |
| **Daily** | Claim RA; compete on Discovery; take/give offers |
| **Fortnight** | Recurve Rep elections |
| **Full moon** | HuRA (if region activated) |
| **3 months (Carnival / season)** | Discovery season accolades. Carnival: three-day voting at end; three Zoom meetings — **page text incomplete** |
| **6 months** | New Chief elected |
| **2 years** | Chief term |

**How to Win** (site’s own framing):

- Passport: narrative around platforms/offers; stamps from other regions
- Discovery: top of region / nation / world for a day or longer; blow up offers
- Recurve: be a Rep who takes a Role; be a Chief who changes a region
- Localize: hold a Role; throw HuRA IRL

### Value claims (Overview)

Open Space; Power in Numbers (daily RA); A chance (Discovery + leveling); Leadership (face-to-face micro-democracy); Badge of their area (geo gov, carnivals, charts); Truth in Numbers (on-chain).

Governance adjectives: Personal (Zoom, real time), Micro (groups of 4–6), Meaningful (change algorithms and policy).

### User journey (Overview)

1. Create Passport → profile + offer → daily RA  
2. Explore region → Discovery + weekly Recurve (Overview says weekly; Recurve page says fortnightly)  
3. Influence with RA → connections → social verification after level 3  
4. Governance: elections, rules, regional projects  

### Roadmap (as written; dates may be stale)

- Invite system (2024)
- Passport Launch (2025 Q1)
- Discovery Launch (2025 Q2)
- Opening regional activation
- Governance
- Carnival, competitions each three months

Join page still marks invite redeem and Passport mint as **Pending**. FAQ: UI not released.

### FAQs (compressed)

- Free daily RA; pay attention not dollars; can buy RA / stake TETRA  
- Wallet required (WebAuth)  
- No gas fees  
- Earn XUSDC/RA on offers, or pay to incentivize; also funnel to existing platforms  
- Tetra = four; nested tetrahedron logo  
- Founder Douglas Butner  
- Map-like UI TBD; predecessor demo mentioned but not linked in markdown  

---

## Tensions / incomplete spots in the source

These are in the live docs, not resolved here:

- Recurve meeting frequency: Overview “weekly”; Recurve “fortnightly.”
- Office names: Overview “Regents”; Recurve/Localize “Reps.”
- RA formula: Overview level bands (1–6, 12–48) vs Localize `staked TETRA + 12`.
- Carnival section is unfinished.
- Join mint/invite still Pending vs Overview 2024–2025 launches.
- “No dogs on the sofa” unexplained.
- Givebutter and predecessor-demo URLs not in the `.md` exports.

---

## Page archive

### 1. Tetra Overview

**https://know.tetra.earth/** · **https://know.tetra.earth/overview**

Tetra helps for you share your value with the world.

#### What is Tetra?

Tetra is a global grid of human-to-human offers.

#### How do offers work?

Record what you offer, where and when. We provide the interface to monetize it.

An offer has:

- A description of what is takes to complete
- Acceptance criteria
- A cost, or a payment in RA or USDC (any token)

#### What do you mean a "grid" of offers?

As you connect with offers, you build connections, and become a node in a global grid (network) of human-human connection.

**Radical Inclusion.** We've invited everyone else to share their value and grow their network. Laws of nature apply. Few will gain the most. Some will win.

**A human time economy.** We hold daily competitions, activating the Attention Economy. Discernment and attention are valuable.

#### Value we Provide

- Open Space - Open participation, for one, for all
- Power in Numbers - Daily attention tokens (RA) and rewards for engagement
- A chance - Anyone can blow up through Discovery, and level up in governance and financials
- Leadership Opportunity - Talking it out in face-to-face micro-democracy. Elected leaders can tweak algorithms and overwrite rules.
- Badge of their area - Geographic-based gov, connections, carnivals and discovery charts.
- Truth in Numbers - Value and meaningful connection recorded in chain.

#### Core Concepts

**Attention Token (RA)**

- Users earn and spend attention tokens (RA ) to facilitate offers and boost visibility of content and connections
- Daily token distributions, amount by user's level
- Local variants of RA tokens provide 2-4 times the influence
- TETRA tokens can be staked for permanent platform benefits, like max claimable RA

**Locales** — three interconnected levels:

- Global - Worldwide community and economy
- National - Country-specific games and governance
- Regional - Local communities and direct democracy (Top-level administrative district of a country)

**Governance** — take responsibility for your region and country through elections.

- Personal - All elections take place on Zoom, in real time, face to face.
- Micro - Big decisions are made by successive small groups of four to six people
- Meaningful - Leaders are able to change local algorithms and introduce policy.

#### Main Products

- Passport: User profiles and social connectivity hub, enhanced with NFTs and offerings.
- Discovery: A competitive chart system where RA tokens can boost visibility, with achievements stored on-chain.
- Recurve: A decentralized governance mechanism enabling citizen-driven elections and community rules.
- Localize: Tools for activating regions, with features like House Rules and procedures tailored to specific locations.

#### User Levels

1. Citizens (Level 1-3) earn 1-6 RA daily. Basic platform access via Passport. Daily RA earnings. Offers and Discovery charts.
2. Full Citizens (Level 4-6) earn 12-48 RA daily. Social verification complete. Governance participation. Can be Regents.
3. Regents (Elected) Earns by completing regional roles. Propose House Rules and Procedures. Take a regional Role.
4. Chiefs (Elected) Earns a % of local economy. Highest governance role. Rule ratification powers. Regional leadership duties.
5. Levels 7-9 (Pending) Projects (video). Lead partnerships with IRL land projects like Starseed.

#### Premium Products

Cheat Codes

1. Barons: Boosted profiles and offers for individuals via paid sponsorships.
2. Stewards: Sponsorship tier for companies with localized promotion.

Donate Now to Founding Journey

1. Founding Supporters: Support us in a few clicks with credit card or paypal. Tetra recognizes high-value donors and / or their organization or idea.

#### User Journey

1. Create Your Passport. Sign up for a Tetra account. Complete basic profile information and post an offer. Begin earning daily RA tokens and activating offers.
2. Explore Your Region. Find local content and connections. Engage to win the top of Discovery charts. Attend weekly Recurve meetings.
3. Build Influence. Use RA tokens strategically. Connect with other citizens. After level 3, complete social verification to unlock governance.
4. Engage in Governance. Join weekly representative elections. Participate in rule-making. Contribute to regional projects.

#### Economic Model

**TETRA Token** — Stakeable for permanent benefits. Claim more than one day's worth of RA. Crystal access to Baron or Stewardship. Activate a region + become a founding Chief.

**RA Token** — Daily-distributed attention currency that controls Discovery charts. Used for content promotion, incentivizing and completing offers. Regional variants for local influence (USARA).

#### Future Development

- Opening the Invite system (2024)
- Passport Launch (2025 Q1)
- Discovery Launch (2025 Q2)
- Opening regional activation
- Governance
- Carnival, competetions each three months

Tetra is more than a platform; it’s a dynamic ecosystem where users engage in an attention-based economy, gain influence through RA tokens, and participate in governance. Tetra offers users a unique opportunity to shape online experience into a global network of value.

---

### 2. What is a Tetran?

**https://know.tetra.earth/go**

Tetrans live in the real world, and eat from the digital one.

Eacch user of tetra.earth, known as Tetrans, connect through custom relationships (offers) digital products and services, and real-world businesses.

Organic, tokengagement is charted regionally, opening a daily game of discovery of where activating an offer pulses local citizens up to national and global recognition.

Win eternal glory by shining brightest in your region for a shorter time span.

Click the arrow at the bottom to Learn about Tetra.

---

### 3. Why should I be a Tetran?

**https://know.tetra.earth/why-should-i-be-a-tetran**

Connect with your land and your people.

A Tetran is a citizen of Tetra, someone who has a Tetra Passport.

Tetra will help your value be discovered across the world if you:

1. Have something of value to offer
2. Want more people to understand what you do and how to engage with you
3. Strive to live a purpose-driven life, want to spend time on that, not promotion

If you aren't a creator, you will find purpose in Tetra if you:

1. Want to learn what people are creating near you
2. Want to be a leader in your region
3. Love new experiences

---

### 4. How to become a Tetran

**https://know.tetra.earth/join**

Be one of the first on Tetra

#### Get a Wallet

1. Create an XPR network wallet at webauth.com

#### Get an Invite

1. Get your invite code in Telegram
2. Redeem it (Pending)

#### Mint your Passport

1. Mint your passport to become an official Tetran (Pending)

🍄 You're now at Level 1 🫶

---

### 5. Life as a Tetran

**https://know.tetra.earth/life-as-a-tetran**

You deserve the best.

#### Landing in Tetra

Own your experience: get all set up.

1. Set up a passport
2. Make an irresistible offer
3. Receive an offer

#### Every Day

1. Claim your daily share of RA. Earn more as you advance levels
2. Be Discovered. Win the top of the daily charts for your region
3. Discover something new. Accept a free offer. Get paid RA to take an offer. Pay RA to take an exclusive offer

#### Every Full Moon

1. Party. Get together for a tegion HuRA. Host, cocreate, or join a HuRA. Requires your region has been activated

#### 3 Month Carnival Season

##### Carnival — Every Three Months

Three day voting period at the end

Three zoom meetings where people

*(live page ends here)*

---

### 6. How to Win

**https://know.tetra.earth/how-to-win**

How top Tetrans glow.

**Passport.** Win by creating a compelling narrative around your platforms and offers. Win with a tatted Passport with stamps by from other regions.

**Discovery.** Win by getting to the top of your region your nation and even the world for a day or longer. Win attention for your offers, blow up your platforms and beyond.

**Recurve.** Win by being a Rep that takes a Role. Win by being a Chief that changes a region.

**Localize.** Play a Role in your Region. Win by holding a badass HuRa celebration IRL.

Keep reading to learn about Passport, Discovery, Recurve, and Localize.

---

### 7. Passport

**https://know.tetra.earth/passport**

Enter Tetra with your Passport. Show off where you're from and what you do.

#### How it Works

After KYC on XPR you earn the right to mint a mutable Passport NFT and start earning 1 RA per day.

You must redeem an invite to activate your passport.

Your daily allowance increases as you grow levels based on participation.

#### What is on a Passport?

Passport holds your profile, offers, connection, stamps and accolades.

Passport isn't just an ID, it's how you connect to others, what you want to show the world, and where you want to go.

Connections are displayed, but not stored on the NFT.

#### Profile

Transparency is vulnerability that builds trust

- Your local region (required) and city (optional)
- A statement on how you desire to connect to others. In your region. Worldwide
- A pretty picture of your beautiful self
- Links to contact, social handles (optional)

#### Offers

Offers connect Tetrans, electrifying a network of value.

Offers allow you to share your content, projects, or activities for Tetrans to engage by performing a specific action.

What kind of Offers can I make?

- Visit my project's website
- Download my Most Freshest song
- Follow me on TikTok, subscribe on YouTube, Substack etc.
- Visit my local shop
- Attend my meetup

Offers Flow

- You describe an action you want someone to complete. Make it free, cost them RA, or pay them RA to complete it. Make it regional, national, or global. Tell then how to verify they completed
- Someone completes the action
- You verify the action is complete
- RA is released. If you don't have enough RA to pay, it will come out of your daily share until paid off.

When charging RA, you can reveal a secret link.

Tetra tracks your offers' views, clicks, and conversions to rank on Discovery.

Each completed offer elevates your status and reach.

#### Connections

As you explore through Offers, elect leaders in Recurve, and Upvote you build connections.

These connections help Tetrans navigate.

Connections fade in strength per day, and strengthen greatly with continual interactions.

Types of Connections

- Tetran to Tetran
- Tetran to Region

You can hide your connections per type if you prefer.

Connections form when:

- Completing an offer. Connects you to the offerer + offer. Connects you to the region the offer is published in
- Electing a Representative or Chief. Connects the voter + candidate
- Upvoting. Connects you to the creator + creation

Tetra shows you content, offers and Passports that have similar connections to you.

#### Passport Stamps: Be well-traveled

Complete offers in other regions to get a stamp from that region.

#### Accolades

Even better than a stamp, Accolades celebrate achievements, including topping a Discovery chart, becoming a Chief, and more. Accolade operate as gatekeepers to supercharged features and locked opportunities.

Learn more about specific accolades in Discovery, Recurve, and Localize.

#### Rules to the Game

Only one passport per human.

No illegal offers, if it's illegal in one region or nation you can't make it a global offer

No dogs on the sofa.

---

### 8. Discovery

**https://know.tetra.earth/discovery**

Feel the heat of the spotlight on regional, national, and global Discovery charts

Discovery is a daily competition to rank content, offers, and Passports to the top of charts. Every day presents a fresh opportunity to climb the ranks, with each upvote and completed offer increasing reach and influence.

#### What is Discovery?

- Ranked charts
- Charts for each regions, countries, and
- Charts for Passports, Offers, and Content
- Charts resets daily
- Historic charts for any day, week, month, season

#### Why Discovery matters

Discovery gets you discovered. It stirs the attention economy, and lets offers be seen.

Local charts put up blinders so locals can find your work first, and come together to be with you to the national and global level.

#### Ups by RA

Upvotes, or Ups, cost 1 RA each.

**Local RA.** After level 4, you start earning a National version of RA (like COLRA, USARA) only useful in that Nation.

Votes on local charts bubble up to higher charts, so topping a national chart gets you discovered at a global level.

#### Ranking Algorithm

The default ranking algorithm is to add all Ups and the total of all offers in RA.

#### Strategy

Because offers and upvotes are the same weight, instead of spending RA on Ups to boost your content, you can convince people to take your offer.

If your offer isn't being seen, you can boost it with Ups to get it seen. If your offer charges RA, you are earning RA plus the extra exposure from climbing the charts.

#### Curveball: Chiefs

Chiefs, elected by Recurve, have the ability to customize Discovery algorithms regionally. They can choose to place more weight on local RA ups or local offers, or change the default display to weight connections from their region.

#### Accolades

Achieving a cumulative ranked position for a season (three months) earns you special recognition on your Passport, forever stored on-chain. This is your regional, national, or global stamp of "the people love me".

---

### 9. Recurve

**https://know.tetra.earth/recurve**

Recurve is a fractal governance game to elect Regional and National leaders

#### Calling all Leaders

Once a region is activated through Localize, Reps and Chiefs take over administration of the region.

Each leader is elected and serves a term alongside other leaders.

#### What can leaders do?

- Implement House Rules. Change Discovery algorithms. Change passport requirements. Change Recurve meetings. Ban / allow types of offers
- Implement Procedures. Arrange partnerships. Modify oath to become a citizen
- Hold local events

(Powers in detail: Localize)

#### Leader Types — Reps

Short for representative and capitalized for style, Reps are elected by peers at fortnightly (every two weeks) meetings (Level 6) and play a role in governance (House Rules and Procedures). Reps within a region are ranked by the amount of weeks they were elected Rep.

Responsibilities: Continue contributions. Encouraged to join a role, listed in Localize.

Benefits: Can propose changes to House Rules or Procedures.

Reps are elected every fortnight, and serve for 2 months, or if they pick a role they continue with Rep benefits as long as they continue the role and show up for 1+ meeting per month.

#### Chiefs

Elected at bi-annual Recurve elections and responsible for ratifying House Rules and Procedures. All Chiefs are also Reps, and only Reps are able to run for Chief. Chiefs may not begin campaigning, or even announce their candidacy at a meeting until six months before the election. Once a chief has served their term, they are not eligible for the next election, but are eligible for any elections after that.

Responsibilities: Ratify or veto changes to House Rules and Procedures.

Benefits: Split 50% of the total revenue from regional Barons + Stewards.

A new Chief is elected each 6 months, and serves for 2 years.

#### Election Process Overview

1. All participants join a biweekly Zoom meeting
2. Breakout groups of 4-6 people. Each person shares contributions they did / others benefitted from in past 2 weeks. Group picks the person they think did the most to represent them. Group comes to consensus for who did the most + sign on-on-chain
3. Reps hold title and privileges for 2 months

Recurve's process is based on Fractally, a decentralized democracy system used to build consensus.

Those elected then group together again to elect from the Reps, and rounds continue until a winner is chosen.

Governance of the region is through the Localize system.

#### Overview of Meeting format

Full event will be ~1.5 hours, or ~3 hours for winners (if there's 2 rounds, requiring.)

Welcome Noobs

- 30 minutes Prior: Chiefs and Reps welcome new members, who are encouraged to show up early with questions to not disrupt main event.

Start of Main Event

- Landing (10 minutes)
- Main consensus voting (50 Minutes). Presentations (30 min, 5 minutes each candidate). Consensus + recording votes (20 minutes)
- Regrouping / share (20 minutes). All breakout rooms share and reps get 3 mins each to speak
- Second Round (if total of 4+ representatives who want to continue)

#### Recurve Continued

1. Global recurve will be activated at 12,000 registered users
2. Then local Recurve must be activated by region or country
3. Each member must be Level 4 (Socially Verified) to take part in elections
4. After we have enough global activity, Projects launch, which have deliverables and ways to create.

You now see that Recurve isn't going to be here for a while, so for now focus on setting up your Passport

#### Social Verification

A ritual where three already-verified people meet with someone who wants to get to Level 4. The prospect agrees on-video to uphold the rules of engagement (an Oath), and proof is uploaded on-chain.

#### Projects

Representatives (Level 7+) direct RA to projects. Projects produce deliverables. Deliverables are seasonal and rated by Project and the rep from 0-100. Learn how projects work by making a project on paper.

Projects are activated per-region after Recurve reaches a certain activity level there.

#### Council of Chiefs

Chiefs choose how they meet and what they do.

All 4 Chiefs must vote to approve something a proposal to change House Rules or Procedures. If a proposal is vetoed by one Chief with three Chiefs approving, it can pass in the next session (after a new Chief is elected) if it 3 or more chiefs approving.

Chiefs can use their official title to lead and influence in any way they see fit, and are encouraged to open partnerships with local businesses and communities.

Fun Fact: Tetra's founder was the 100th member of the original fractal governance called Fractally

---

### 10. Localize

**https://know.tetra.earth/localize**

Tetra's Regional Governance System

#### Overview

Localize transforms Tetra from a global platform into unique regional experiences through structured governance and customization.. Localize empowers leaders elected by Recurve to rule their region through House Rules, Procedures, and Roles.

#### Core Concepts

**Activation** — launching Tetra in a new region:

- Requires four founding members
- Members collectively stake TETRA tokens
- Activation unlocks regional features and governance
- Creates founding chiefs who serve until first election

**House Rules** — Regional customizations to Tetra's basic mechanics:

- Modify discovery algorithms
- Adjust interaction dynamics
- Set regional priorities
- Must work within system parameters

**Procedures** — Structured processes for community organization:

- Define how events are run
- Establish communication channels
- Create regional initiatives
- Set community standards

**Roles** — Designated positions for community building:

- Assigned to active representatives
- Require chief approval (3/4 votes)
- Include positions like Content Creator, Educator, Event Planner
- Create accountability for specific tasks

**Leadership Structure**

Chiefs

- Four elected leaders per region
- Ratify House Rules and Procedures
- Approve roles for representatives
- Serve 2-year terms (staggered elections every 6 months)

Representatives

- Elected in biweekly meetings
- Can propose House Rules + procedures
- Eligible to apply for roles, which require 3/4 Chief's approval
- Serve 2-month terms (or as long as a role is held)

#### 1. Regional Activation

Activation Requirements

- Higher population than the current lowest active region
- More activity than the current lowest active region
- Four founding members willing to stake TETRA tokens
- Completed KYC verification for all founding members

Activation Process

1. A group of four members comes together to activate a region
2. The group must collectively stake TETRA (amount must exceed average regional stake)
3. Members nominate the same group of four founding chiefs
4. Complete KYC verification for all founding chiefs

#### 2. Economic Structure

Token Distribution

- Total TETRA staked to a locale = Daily RA distribution capacity
- Individual RA claiming formula: `User's Staked TETRA + 12 = Maximum Daily RA Claim`
- 50% of USDC revenue from Barons and Stewards is distributed to current Chiefs

Regional Development

- TETRA can be staked to increase local RA distribution
- Each TETRA token staked adds 1 RA to daily distribution

#### 3. Governance Structure

Roles System — Chiefs can approve roles for Representatives (requires 3/4 chief approval).

Default Roles:

- Content Creator
- Educator
- Recruiter
- Connector
- Event Planner
- Master of Coin
- Developer

House Rules — Region-specific adaptations to customize Tetra gameplay. Written by Representatives. Ratified by Chiefs. Affects discovery algorithms and connection mechanics. Must operate within system parameters.

Procedures — Structured processes extending beyond core gameplay. Creates unique regional engagement opportunities. Examples: Official communication channels. Recurring events. Local RA reward systems. Community guidelines.

#### 4. Physical Integration (Landing)

HuRA Events — In-person gatherings. Organized by Chiefs and Representatives. Facilitates community building.

Tetra-Enabled Venues — Physical locations integrated with the app. Features: RA redemption capabilities. Meetup spaces. Offer fulfillment locations. Mapped and discoverable in-app.

#### 5. Statistics and Tracking

Key Metrics:

- Total registered users
- Daily active connections
- Economic activity (RA and USDC)
- Stake distribution
- Governance participation

#### Administrative Notes

Founding Chiefs

- No minimum individual stake requirement
- Single member can provide entire stake
- Transition process begins with first election
- Least-staked Founding Chief transitions first

Economic Distribution

- Revenue sharing model for chiefs (50% of Baron/Steward revenue)
- Autonomous spending authority for distributed funds
- Optional reinvestment in regional development

#### Best Practices

1. Regional Activation. Ensure strong community support before activation. Develop clear regional objectives. Plan initial governance structure
2. House Rules Development. Focus on cultural alignment. Consider long-term implications. Maintain balance with global system
3. Community Engagement. Regular HuRA events. Active venue partnerships. Clear communication channels
4. Governance. Regular chief meetings. Transparent decision-making. Active role distribution

#### Technical Integration

API Endpoints: Regional activation status. Governance proposals. Role management. Statistics tracking.

Smart Contract Interaction: Stake management. Rule enforcement. Revenue distribution. Role verification.

#### Future Development

Planned Features: Enhanced venue integration. Expanded role system. Advanced analytics. Cross-region collaboration tools.

Governance Evolution: Improved proposal systems. Enhanced voting mechanisms. Advanced rule customization.

---

### 11. Telegram

**https://know.tetra.earth/telegram**

Join in 👋

Official Telegram: ⟁ [t.me/tetragrids](https://t.me/tetragrids)

---

### 12. FAQs

**https://know.tetra.earth/faqs**

#### Does Tetra cost anything?

Without any payment, you'll get a daily share of RA.

You'll earn when you pay attention, not dollars, but always can buy RA for a boost, and stake TETRA for wide benefits. RA is tradable on the open market for XPR, XUSDC, etc. RA sold on the market comes from those who earn it.

#### Do I need a crypto wallet?

Really!! Get your wallet on webauth.com (works best on mobiles with biometrics)

#### What about Gas fees?

You don't need any crypto for gas. You can transact, and complete KYC absolutely free, without needing any initial crypto.

#### Can I earn on Tetra?

Your offers can earn you XUSDC and RA if you decide to charge, or you put up your USDC or RA to incentivive offers.

Beyond Tetra, these connections can lead to newly-paying customers for your existing platforms. We want to connect and help your existing offers shine.

#### What does Tetra mean?

Tetra means four. You'll see this numerology throughout the project. Our logo features a tetrahedron in a lager tetrahedron from a top-down view.

#### Who is the founder

Tetra was created by Douglas Butner, a developer new economies. Douglas sprouted ideas for Tetra in his web4 manifesto (2020). Before Tetra, Douglas built cXc.world (2018-present) a map of web3 music.

#### What is the app like?

Tetra's UI hasn't been released. We can say some displays will be map-based. While the UI is still a secret, you can get an idea of the feel of a crypto map in this demo of Tetra's predecessor.

---

### 13. Donate

**https://know.tetra.earth/donate**

Provide the capital to make this real, and provide your region a gift that gives everyday - forever.

🧈 Donate - With Givebutter
