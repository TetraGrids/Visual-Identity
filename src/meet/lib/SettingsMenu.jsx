/** Adapted from livekit-examples/meet lib/SettingsMenu.tsx — recording deferred. */
import React from "react"
import {
  useMaybeLayoutContext,
  MediaDeviceMenu,
} from "@livekit/components-react"
import { CameraSettings } from "./CameraSettings.jsx"
import { MicrophoneSettings } from "./MicrophoneSettings.jsx"

export function SettingsMenu(props) {
  const layoutContext = useMaybeLayoutContext()
  const [activeTab, setActiveTab] = React.useState("media")

  return (
    <div className="settings-menu meet-settings" style={{ width: "100%", position: "relative" }} {...props}>
      <div className="meet-settings__tabs">
        <button
          className="lk-button"
          onClick={() => setActiveTab("media")}
          aria-pressed={activeTab === "media"}
        >
          Media Devices
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "media" && (
          <>
            <h3>Camera</h3>
            <section>
              <CameraSettings />
            </section>
            <h3>Microphone</h3>
            <section>
              <MicrophoneSettings />
            </section>
            <h3>Speaker &amp; Headphones</h3>
            <section className="lk-button-group">
              <span className="lk-button">Audio Output</span>
              <div className="lk-button-group-menu">
                <MediaDeviceMenu kind="audiooutput" />
              </div>
            </section>
          </>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <button
          className="lk-button"
          onClick={() => layoutContext?.widget.dispatch?.({ msg: "toggle_settings" })}
        >
          Close
        </button>
      </div>
      {/* TODO: recording via LiveKit egress endpoint */}
    </div>
  )
}
