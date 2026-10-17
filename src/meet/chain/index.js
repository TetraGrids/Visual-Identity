/**
 * Antelope / XPR network placeholders.
 * All on-chain work lives here so UI can call these without caring about wiring yet.
 *
 * Target: XPR Network first (Proton). Routing contract similar to effective-collective
 * with custom memos (from flexforex patterns). Payment destinations: up to 12 accounts
 * (or nested lists of 12).
 */

/** @typedef {{ account: string, permission?: string }} ChainActor */
/** @typedef {{ name: string, title?: string, role?: string, avatarUrl?: string }} ProfilePatch */
/** @typedef {{ positions: Array<{ place: 1|2|3, participantId: string }>, meetingId: string, groupId: string }} ConsensusPayload */
/** @typedef {{ account: string, weight?: number }[]} PayoutList */

export const CHAIN_NETWORK = "xpr" // TODO(chain): mainnet vs testnet switch

/**
 * TODO(chain): Wharfkit / WebAuth login on XPR Network.
 * @returns {Promise<ChainActor|null>}
 */
export async function loginXpr() {
  console.warn("[TODO(chain)] loginXpr — wire Wharfkit SessionKit / WebAuth")
  return null
}

/**
 * TODO(chain): Push profile fields (name, title, role, avatar) on-chain.
 * @param {ProfilePatch} _patch
 */
export async function updateProfile(_patch) {
  console.warn("[TODO(chain)] updateProfile — push profile via XPR contract")
  return { ok: false, reason: "not_implemented" }
}

/**
 * TODO(chain): Sign + broadcast consensus TX ranking positions 1–3.
 * Verified when enough group members have signed (see consensusThreshold).
 * @param {ConsensusPayload} _payload
 */
export async function signConsensusTx(_payload) {
  console.warn("[TODO(chain)] signConsensusTx — group consensus TX")
  return { ok: false, txId: null, reason: "not_implemented" }
}

/**
 * TODO(chain): Proxy confirm for participants who cannot sign (Google / Microsoft accounts).
 * Valid when peers confirm AND one signer submits a special proxy-confirm TX.
 * @param {{ meetingId: string, groupId: string, beneficiaryId: string, confirmerIds: string[] }} _args
 */
export async function proxyConfirmSign(_args) {
  console.warn("[TODO(chain)] proxyConfirmSign — one signer confirms for non-wallet users")
  return { ok: false, txId: null, reason: "not_implemented" }
}

/**
 * TODO(chain): Verify that consensus TXs for a group are on-chain and valid.
 * @param {{ meetingId: string, groupId: string }} _args
 */
export async function verifyConsensusTxs(_args) {
  console.warn("[TODO(chain)] verifyConsensusTxs")
  return { verified: false, reason: "not_implemented" }
}

/**
 * TODO(chain): Set / update payout routing — up to 12 accounts (or lists of 12).
 * Custom memos borrowed from flexforex contract patterns.
 * @param {{ destinations: PayoutList, memo?: string }} _args
 */
export async function setPaymentRouting(_args) {
  console.warn("[TODO(chain)] setPaymentRouting — single routing contract")
  return { ok: false, reason: "not_implemented" }
}

/**
 * TODO(chain): Distribute rewards per format preset (election / top3 share / award-per-level).
 * No payment if consensus failed.
 */
export async function distributeRewards(_args) {
  console.warn("[TODO(chain)] distributeRewards")
  return { ok: false, reason: "not_implemented" }
}
