/** Adapted from livekit-examples/meet lib/MicrophoneSettings.tsx — Krisp optional. */
import React from "react"
import { TrackToggle, MediaDeviceMenu } from "@livekit/components-react"
import { Track } from "livekit-client"

export function MicrophoneSettings() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <section className="lk-button-group">
        <TrackToggle source={Track.Source.Microphone}>Microphone</TrackToggle>
        <div className="lk-button-group-menu">
          <MediaDeviceMenu kind="audioinput" />
        </div>
      </section>
      {/* TODO: Krisp noise filter via @livekit/components-react/krisp */}
    </div>
  )
}
