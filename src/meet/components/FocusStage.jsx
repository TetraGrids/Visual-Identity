import React from "react"
import { openCameraTrack, paintLook } from "../lib/look.js"

/**
 * Main video plane for the focused speaker.
 * Demo mode: letter/avatar full-bleed. LiveKit video mounts behind when connected.
 * Others crowd as circles bottom-right over the speaker (unless screen share —
 * then the presenter's cam is a top-left PiP circle).
 */
export function StreamVideo({ stream }) {
  const node = React.useRef(null)
  React.useEffect(() => {
    const v = node.current
    if (!v) return
    v.muted = !stream?.getAudioTracks().length
    v.srcObject = stream || null
    if (stream) {
      const playing = v.play()
      if (playing) playing.catch(() => {})
    }
    return () => {
      v.srcObject = null
    }
  }, [stream])
  return <video ref={node} autoPlay playsInline muted={!stream?.getAudioTracks().length} />
}

export function FocusStage({
  speaker,
  others = [],
  screenShare = false,
  preview = false,
  localId,
  localStream,
  shareStream,
  children, // live video layer
}) {
  const self = speaker?.id === localId && localStream
  return (
    <div className="meet-focus">
      <div className="meet-focus__video">
        {children}
        {!children && !preview && (
          <div className="meet-focus__placeholder" aria-hidden={false}>
            {self ? (
              <StreamVideo stream={localStream} />
            ) : speaker?.avatarUrl ? (
              <img src={speaker.avatarUrl} alt="" className="meet-focus__full" />
            ) : (
              <span className="meet-focus__letter">{speaker?.letter || "?"}</span>
            )}
            <span className="meet-focus__name">{speaker?.name || "Waiting"}</span>
          </div>
        )}
        {screenShare && (
          <div className="meet-focus__screenshare" aria-label="Screen share">
            {shareStream ? (
              <StreamVideo stream={shareStream} />
            ) : (
              <div className="meet-focus__screenshare-frame">Screen share</div>
            )}
          </div>
        )}
      </div>

      {screenShare && speaker && (
        <div className="meet-focus__pip" title={speaker.name}>
          <span className="meet-focus__pip-face">
            {self ? (
              <StreamVideo stream={localStream} />
            ) : speaker.avatarUrl ? (
              <img src={speaker.avatarUrl} alt="" />
            ) : (
              speaker.letter || "?"
            )}
          </span>
          <span className="meet-focus__pip-label">{speaker.name}</span>
        </div>
      )}

      {!screenShare && others.length > 0 && (
        <div className="meet-focus__crowd" aria-label="Other participants">
          {others.map((p) => (
            <div key={p.id} className="meet-focus__crowd-node" title={p.name}>
              {p.avatarUrl ? <img src={p.avatarUrl} alt="" /> : p.letter || "?"}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Square self-view. The dashed circle is the crop the round bubble shows. */
export function WaitingPreview({ camera, look, onStream }) {
  const videoRef = React.useRef(null)
  const trackRef = React.useRef(null)
  const req = React.useRef(0)
  const backgroundRef = React.useRef(look?.background || "none")
  backgroundRef.current = look?.background || "none"
  const [kick, setKick] = React.useState(0)
  const [off, setOff] = React.useState(() => typeof navigator !== "undefined" && !!navigator.brave)
  const [hint, setHint] = React.useState("")

  function show(track) {
    const stream = new MediaStream([track.mediaStreamTrack])
    const node = videoRef.current
    if (node) {
      node.muted = true
      node.srcObject = stream
      const playing = node.play()
      if (playing) playing.catch(() => {})
    }
    onStream?.(track)
  }

  React.useEffect(() => {
    if (camera) return
    trackRef.current?.stop()
    trackRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    onStream?.(null)
  }, [camera])

  React.useEffect(() => {
    if (!camera) return
    let dead = false
    const mine = ++req.current
    const watch = setInterval(() => {
      const source = trackRef.current?._mediaStreamTrack
      const out = trackRef.current?.mediaStreamTrack
      if ((source && source.readyState === "ended") || (out && out.readyState === "ended")) setOff(true)
    }, 300)
    const asked = navigator.permissions?.query
      ? navigator.permissions.query({ name: "camera" }).then((p) => p.state).catch(() => "prompt")
      : Promise.resolve("prompt")
    asked.then((state) => {
      if (dead || mine !== req.current) return
      if (navigator.brave && state !== "granted" && kick === 0) {
        setOff(true)
        if (state === "denied") setHint("Allow the camera for this site, then try again.")
        return
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setOff(true)
        setHint("Open this page on localhost to use the camera.")
        return
      }
      const node = videoRef.current
      if (node) {
        node.muted = true
        const playing = node.play()
        if (playing) playing.catch(() => {})
      }
      openCameraTrack(look?.videoDeviceId)
        .then(async (track) => {
          if (dead || mine !== req.current) {
            track.stop()
            return
          }
          track.mediaStreamTrack.onended = () => {
            onStream?.(null)
            setOff(true)
          }
          if (trackRef.current && trackRef.current !== track) trackRef.current.stop()
          trackRef.current = track
          try {
            await paintLook(track, backgroundRef.current)
            if (!dead) setHint("")
          } catch (err) {
            if (!dead) setHint(err?.message || "Background did not apply.")
          }
          if (dead || mine !== req.current) {
            track.stop()
            return
          }
          show(track)
          setOff(false)
        })
        .catch((err) => {
          if (dead || mine !== req.current) return
          setOff(true)
          setHint(
            err?.name === "NotAllowedError"
              ? "Allow the camera for this site, then try again."
              : err?.name === "NotFoundError"
                ? "No camera was found."
                : "Camera did not start.",
          )
        })
    })
    return () => {
      dead = true
      clearInterval(watch)
    }
  }, [camera, look?.videoDeviceId, kick])

  React.useEffect(() => {
    const track = trackRef.current
    if (!camera || !track) return
    let dead = false
    if (look?.background && look.background !== "none") setHint("Applying background…")
    paintLook(track, look?.background || "none")
      .then(() => {
        if (dead) return
        show(track)
        setHint("")
      })
      .catch((err) => {
        if (!dead) setHint(err?.message || "Background did not apply.")
      })
    return () => {
      dead = true
    }
  }, [look?.background])

  return (
    <div className="meet-wait">
      <video ref={videoRef} autoPlay playsInline muted />
      <span className="meet-wait__crop" aria-hidden="true" />
      {camera && off && (
        <div className="meet-wait__reconnect">
          <button type="button" className="tetra-btn" onClick={() => setKick((n) => n + 1)}>
            Reconnect video
          </button>
          {hint && <p className="meet-wait__hint">{hint}</p>}
        </div>
      )}
    </div>
  )
}
