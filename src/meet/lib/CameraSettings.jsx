/** Adapted from livekit-examples/meet lib/CameraSettings.tsx */
import React from "react"
import {
  MediaDeviceMenu,
  TrackToggle,
  useLocalParticipant,
  VideoTrack,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import { CallSetup } from "../components/CallSetup.jsx"
import { loadLook, paintLook, saveLook } from "./look.js"

export function CameraSettings() {
  const { cameraTrack, localParticipant } = useLocalParticipant()
  const [look, setLook] = React.useState(loadLook)

  const camTrackRef = React.useMemo(() => {
    return cameraTrack
      ? { participant: localParticipant, publication: cameraTrack, source: Track.Source.Camera }
      : undefined
  }, [localParticipant, cameraTrack])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {camTrackRef && (
        <VideoTrack
          style={{
            maxHeight: "280px",
            objectFit: "contain",
            objectPosition: "right",
            transform: "scaleX(-1)",
          }}
          trackRef={camTrackRef}
        />
      )}
      <section className="lk-button-group">
        <TrackToggle source={Track.Source.Camera}>Camera</TrackToggle>
        <div className="lk-button-group-menu">
          <MediaDeviceMenu kind="videoinput" />
        </div>
      </section>
      <CallSetup
        devices={false}
        look={look}
        onLook={(next) => {
          saveLook(next)
          setLook(next)
          const track = cameraTrack?.track
          if (track) paintLook(track, next.background).catch(() => {})
        }}
      />
    </div>
  )
}
