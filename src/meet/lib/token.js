/**
 * LiveKit connection via development token server.
 * Docs: https://docs.livekit.io/frontends/build/authentication/development-token-server/
 *
 * When VITE_LK_TOKEN_SERVER_ID is unset, callers should fall back to demo mode.
 */

export function hasTokenServer() {
  return Boolean(import.meta.env.VITE_LK_TOKEN_SERVER_ID)
}

export async function fetchRoomConnection({ roomName, participantName }) {
  const id = import.meta.env.VITE_LK_TOKEN_SERVER_ID
  if (!id) {
    throw new Error("VITE_LK_TOKEN_SERVER_ID is not set — use demo mode")
  }

  // Dynamic import so demo mode works without LiveKit Cloud config
  const { TokenSource } = await import("livekit-client")
  const tokenSource = TokenSource.developmentTokenServer(id)
  const { serverUrl, participantToken } = await tokenSource.fetch({
    roomName,
    participantName: participantName || "guest",
  })

  return {
    serverUrl,
    roomName,
    participantName: participantName || "guest",
    participantToken,
  }
}
