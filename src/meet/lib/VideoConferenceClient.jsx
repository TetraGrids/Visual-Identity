/**
 * Adapted from livekit-examples/meet app/custom/VideoConferenceClientImpl.tsx
 * and app/rooms/[roomName]/PageClientImpl.tsx — E2EE + DebugMode stripped;
 * settings menu always available; leave navigates via onLeave callback.
 */
import React, { useEffect, useMemo } from "react"
import { formatChatMessageLinks, RoomContext, VideoConference } from "@livekit/components-react"
import { Room, RoomEvent, VideoPresets } from "livekit-client"
import { KeyboardShortcuts } from "./KeyboardShortcuts.jsx"
import { SettingsMenu } from "./SettingsMenu.jsx"

export function VideoConferenceClient({
  liveKitUrl,
  token,
  videoEnabled = true,
  audioEnabled = true,
  onLeave,
  SettingsComponent = SettingsMenu,
}) {
  const roomOptions = useMemo(
    () => ({
      publishDefaults: {
        videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
      },
      adaptiveStream: { pixelDensity: "screen" },
      dynacast: true,
    }),
    [],
  )

  const room = useMemo(() => new Room(roomOptions), [roomOptions])

  useEffect(() => {
    const handleLeave = () => onLeave?.()
    room.on(RoomEvent.Disconnected, handleLeave)

    room
      .connect(liveKitUrl, token, { autoSubscribe: true })
      .then(() => {
        if (videoEnabled) room.localParticipant.setCameraEnabled(true).catch(console.error)
        if (audioEnabled) room.localParticipant.setMicrophoneEnabled(true).catch(console.error)
      })
      .catch((error) => {
        console.error(error)
        alert(`LiveKit connect failed: ${error.message}`)
      })

    return () => {
      room.off(RoomEvent.Disconnected, handleLeave)
      room.disconnect()
    }
  }, [room, liveKitUrl, token, videoEnabled, audioEnabled, onLeave])

  return (
    <div className="lk-room-container">
      <RoomContext.Provider value={room}>
        <KeyboardShortcuts />
        <VideoConference
          chatMessageFormatter={formatChatMessageLinks}
          SettingsComponent={SettingsComponent}
        />
      </RoomContext.Provider>
    </div>
  )
}
