import React from "react"
import {
  backgroundSupported,
  connectGoogle,
  loadWall,
  openMicTrack,
  pinBackground,
} from "../lib/look.js"

const PRESETS = [
  ["none", "None"],
  ["blur", "Blur"],
  ["preset:soft", "Soft"],
  ["preset:dusk", "Dusk"],
]

export function CallSetup({ look, onLook, devices = true }) {
  const [wall, setWall] = React.useState(loadWall)
  const [url, setUrl] = React.useState("")
  const [hint, setHint] = React.useState("")
  const [level, setLevel] = React.useState(0)
  const [inputs, setInputs] = React.useState([])

  React.useEffect(() => {
    let stop = false
    const read = () =>
      navigator.mediaDevices
        ?.enumerateDevices()
        .then((list) => {
          if (!stop) setInputs(list)
        })
        .catch(() => {})
    read()
    const timer = setInterval(read, 1500)
    navigator.mediaDevices?.addEventListener("devicechange", read)
    return () => {
      stop = true
      clearInterval(timer)
      navigator.mediaDevices?.removeEventListener("devicechange", read)
    }
  }, [])

  React.useEffect(() => {
    if (!devices || look.audioEnabled === false) return
    let dead = false
    let mic = null
    let ctx = null
    let frame = 0
    const start = () => openMicTrack(look.audioDeviceId)
      .then((track) => {
        if (dead) {
          track.stop()
          return
        }
        mic = track
        ctx = new AudioContext()
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        ctx.createMediaStreamSource(new MediaStream([track.mediaStreamTrack])).connect(analyser)
        const data = new Uint8Array(analyser.fftSize)
        const tick = () => {
          analyser.getByteTimeDomainData(data)
          let sum = 0
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128
            sum += v * v
          }
          setLevel(Math.min(1, Math.sqrt(sum / data.length) * 4))
          frame = requestAnimationFrame(tick)
        }
        tick()
      })
      .catch(() => {})
    if (navigator.brave && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "microphone" })
        .then((p) => {
          if (!dead && p.state === "granted") start()
        })
        .catch(() => {})
    } else start()
    return () => {
      dead = true
      cancelAnimationFrame(frame)
      mic?.stop()
      ctx?.close()
    }
  }, [devices, look.audioEnabled, look.audioDeviceId])

  function choose(background) {
    if (background !== "none" && !backgroundSupported()) {
      setHint("This browser can't remove the background.")
    } else setHint("")
    onLook({ ...look, background })
  }

  function useUrl() {
    const next = url.trim()
    if (!next.startsWith("https://")) {
      setHint("Use an https image URL.")
      return
    }
    pinBackground(`url:${next}`, next.replace(/^https:\/\//, "").slice(0, 32))
    setWall(loadWall())
    setUrl("")
    setHint("")
    onLook({ ...look, background: `url:${next}` })
  }

  function fromGoogle(kind) {
    setHint(kind === "photos" ? "Choose a photo in the Google window." : "Choose an image in Google Drive.")
    connectGoogle(kind)
      .then((picked) => {
        if (!picked) {
          setHint("")
          return
        }
        pinBackground(picked.background, picked.label)
        setWall(loadWall())
        setHint("")
        onLook({ ...look, background: picked.background })
      })
      .catch((err) => setHint(err?.message || "Google did not connect."))
  }

  const cameras = inputs.filter((d) => d.kind === "videoinput")
  const mics = inputs.filter((d) => d.kind === "audioinput")
  const speakers = inputs.filter((d) => d.kind === "audiooutput")

  return (
    <div className="meet-setup">
      {devices && (
        <div className="meet-setup__devices">
          <label>
            Camera
            <select
              value={look.videoDeviceId || ""}
              onChange={(e) => onLook({ ...look, videoDeviceId: e.target.value, videoEnabled: true })}
            >
              <option value="">Default camera</option>
              {cameras.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || "Camera"}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="tetra-btn meet-btn"
            aria-pressed={look.videoEnabled !== false}
            onClick={() => onLook({ ...look, videoEnabled: look.videoEnabled === false })}
          >
            {look.videoEnabled === false ? "Camera off" : "Camera on"}
          </button>
          <label>
            Microphone
            <select
              value={look.audioDeviceId || ""}
              onChange={(e) => onLook({ ...look, audioDeviceId: e.target.value, audioEnabled: true })}
            >
              <option value="">Default microphone</option>
              {mics.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || "Microphone"}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="tetra-btn meet-btn"
            aria-pressed={look.audioEnabled !== false}
            onClick={() => onLook({ ...look, audioEnabled: look.audioEnabled === false })}
          >
            {look.audioEnabled === false ? "Mic off" : "Mic on"}
          </button>
          <div className="meet-setup__meter" aria-hidden="true">
            <span style={{ transform: `scaleX(${look.audioEnabled === false ? 0 : level})` }} />
          </div>
          <label>
            Speaker
            <select
              value={look.audioOutputId || ""}
              onChange={(e) => {
                const id = e.target.value
                onLook({ ...look, audioOutputId: id })
                const ctx = new AudioContext()
                const beep = () => {
                  const osc = ctx.createOscillator()
                  const gain = ctx.createGain()
                  gain.gain.value = 0.04
                  osc.frequency.value = 440
                  osc.connect(gain).connect(ctx.destination)
                  osc.start()
                  osc.stop(ctx.currentTime + 0.18)
                  osc.onended = () => ctx.close()
                }
                if (id && ctx.setSinkId) ctx.setSinkId(id).then(beep).catch(beep)
                else beep()
              }}
            >
              <option value="">Default speaker</option>
              {speakers.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || "Speaker"}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="meet-setup__chips" role="listbox" aria-label="Background">
        {PRESETS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="meet-setup__chip meet-btn"
            aria-pressed={look.background === id}
            onClick={() => choose(id)}
          >
            {label}
          </button>
        ))}
        {wall.map((item) => (
          <button
            key={item.background}
            type="button"
            className="meet-setup__chip meet-btn"
            aria-pressed={look.background === item.background}
            onClick={() => choose(item.background)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="meet-setup__url">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https:// image URL"
          inputMode="url"
        />
        <button type="button" className="tetra-btn meet-btn" onClick={useUrl}>
          Use URL
        </button>
        <button type="button" className="tetra-btn meet-btn" onClick={() => fromGoogle("drive")}>
          Drive
        </button>
        <button type="button" className="tetra-btn meet-btn" onClick={() => fromGoogle("photos")}>
          Photos
        </button>
      </div>
      {hint && <p className="meet-setup__hint">{hint}</p>}
      {!backgroundSupported() && (
        <p className="meet-setup__hint">This browser can't remove the background.</p>
      )}
    </div>
  )
}
