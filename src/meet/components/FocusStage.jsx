import React from "react"
import { openCameraTrack, paintLook } from "../lib/look.js"

/**
 * The presenter picture (camera, or the share while sharing) keeps its own shape
 * and takes the largest rect the well can give it. Everyone else sits in the
 * leftover, at the camera's shape, and that strip scrolls when they do not fit.
 * During a share, the presenter's camera is a circle in the top-right corner.
 */
export function StreamVideo({ stream, onRatio }) {
  const node = React.useRef(null)
  const ratio = React.useRef(onRatio)
  ratio.current = onRatio
  React.useEffect(() => {
    const v = node.current
    if (!v) return
    const read = () => {
      if (v.videoWidth) ratio.current?.(v.videoWidth / v.videoHeight)
    }
    v.muted = !stream?.getAudioTracks().length
    v.srcObject = stream || null
    v.addEventListener("loadedmetadata", read)
    v.addEventListener("resize", read)
    if (stream) {
      const playing = v.play()
      if (playing) playing.catch(() => {})
      read()
    }
    return () => {
      v.removeEventListener("loadedmetadata", read)
      v.removeEventListener("resize", read)
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
  centerMine = false,
  now = 0,
  loud = false,
  children, // live video layer
}) {
  const well = React.useRef(null)
  const ratio = React.useRef(16 / 9)
  const camRatio = React.useRef(16 / 9)
  const [fit, setFit] = React.useState(null)
  const self = speaker?.id === localId && localStream

  function measure() {
    const node = well.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const a = ratio.current || 16 / 9
    const wide = rect.width / Math.max(rect.height, 1) > a
    const mainW = wide ? rect.height * a : rect.width
    const mainH = wide ? rect.height : rect.width / a
    const gap = Math.max(0, wide ? rect.width - mainW : rect.height - mainH)
    const stack = wide ? "x" : "y"
    const n = others.length
    const cam = camRatio.current || 16 / 9
    const boxW = Math.max(0, (stack === "x" ? gap : mainW) - 16)
    const boxH = Math.max(0, (stack === "x" ? mainH : gap) - 16)
    let cols = 1
    let rows = n
    let tileW = 0
    let tileH = 0
    if (!preview && !children && n && boxW >= 56 && boxH >= 40) {
      for (let c = 1; c <= n; c++) {
        const r = Math.ceil(n / c)
        const cw = (boxW - 8 * (c - 1)) / c
        const ch = (boxH - 8 * (r - 1)) / r
        const tw = Math.min(Math.max(cw, 0), Math.max(ch, 0) * cam)
        const th = tw / cam
        if (th >= 36 && tw * th > tileW * tileH) {
          cols = c
          rows = r
          tileW = tw
          tileH = th
        }
      }
      const usedH = rows * tileH + 8 * (rows - 1)
      const usedW = cols * tileW + 8 * (cols - 1)
      if (!tileW || usedH > boxH + 1 || usedW > boxW + 1) {
        tileH = Math.min(boxH, 112)
        tileW = tileH * cam
        if (tileW > boxW) {
          tileW = boxW
          tileH = tileW / cam
        }
        if (stack === "x") {
          cols = 1
          rows = n
        } else {
          rows = 1
          cols = n
        }
      }
    }
    setFit({
      mainW,
      mainH,
      gap,
      stack,
      show: !preview && !children && n > 0 && tileW >= 56 && tileH >= 32,
      cols,
      rows,
      tileW,
      tileH,
    })
  }

  React.useEffect(() => {
    measure()
    const obs = new ResizeObserver(measure)
    if (well.current) obs.observe(well.current)
    return () => obs.disconnect()
  }, [others.length, preview, screenShare, !!children])

  function onRatio(next) {
    if (!next || Math.abs(next - ratio.current) < 0.02) return
    ratio.current = next
    measure()
  }

  function onCam(next) {
    if (!next || Math.abs(next - camRatio.current) < 0.02) return
    camRatio.current = next
    if (!screenShare) ratio.current = next
    measure()
  }

  const open =
    !speaker && !children && !preview && !screenShare && others.length > 0

  if (open) {
    return (
      <div className="meet-focus">
        <CircleField
          people={others}
          localId={localId}
          localStream={localStream}
          centerMine={centerMine}
          now={now}
          loud={loud}
        />
      </div>
    )
  }

  const picture = children ? (
    children
  ) : screenShare && shareStream ? (
    <StreamVideo stream={shareStream} onRatio={onRatio} />
  ) : self ? (
    <StreamVideo stream={localStream} onRatio={onCam} />
  ) : speaker?.avatarUrl ? (
    <img src={speaker.avatarUrl} alt="" className="meet-focus__full" />
  ) : speaker?.letter ? (
    <span className="meet-focus__letter">{speaker.letter}</span>
  ) : null

  return (
    <div className="meet-focus" ref={well}>
      <div
        className={`meet-fit${fit?.show ? " is-split" : ""}`}
        data-stack={fit?.show ? fit.stack : "x"}
      >
        <div
          className="meet-fit__main"
          style={fit ? { width: fit.mainW, height: fit.mainH } : undefined}
        >
          {children && <div className="meet-focus__video">{children}</div>}
          {!children && screenShare && (
            <div className="meet-focus__screenshare">
              {shareStream ? picture : <div className="meet-focus__screenshare-frame">Screen share</div>}
            </div>
          )}
          {!children && !screenShare && !preview && picture && (
            <div className="meet-focus__placeholder">{picture}</div>
          )}
          {!screenShare && !children && !preview && (
            <span className="meet-focus__name">{speaker?.name || "Waiting"}</span>
          )}
          {screenShare && speaker && (
            <div className="meet-focus__pip" title={speaker.name}>
              <span className="meet-focus__pip-face">
                {self ? (
                  <StreamVideo stream={localStream} onRatio={onCam} />
                ) : speaker?.avatarUrl ? (
                  <img src={speaker.avatarUrl} alt="" />
                ) : (
                  speaker?.letter || ""
                )}
              </span>
            </div>
          )}
        </div>
        {fit?.show && (
          <div
            className="meet-fit__rail"
            style={{
              gridTemplateColumns: `repeat(${fit.cols}, ${fit.tileW}px)`,
              gridTemplateRows: `repeat(${fit.rows}, ${fit.tileH}px)`,
              width: fit.stack === "x" ? fit.gap : fit.mainW,
              height: fit.stack === "x" ? fit.mainH : fit.gap,
            }}
            aria-label="Other participants"
          >
            {others.map((p) => (
              <div key={p.id} className={`meet-tile${p.id === localId ? " is-local" : ""}`} title={p.name}>
                {p.id === localId && localStream ? (
                  <StreamVideo stream={localStream} onRatio={onCam} />
                ) : p.avatarUrl ? (
                  <img src={p.avatarUrl} alt="" />
                ) : (
                  <span>{p.letter || ""}</span>
                )}
                <span className="meet-tile__name">{p.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * No speaker: every person is a circle that tiles the stage.
 * A live voice (and, in demo, one person at a time) grows and glows.
 * Centering your display lifts your camera into the middle.
 */
function CircleField({ people, localId, localStream, centerMine, now, loud }) {
  const well = React.useRef(null)
  const [box, setBox] = React.useState({ w: 0, h: 0 })

  React.useEffect(() => {
    const node = well.current
    if (!node) return
    const read = () => {
      const s = getComputedStyle(node)
      const padX = parseFloat(s.paddingLeft) + parseFloat(s.paddingRight)
      const padY = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom)
      setBox({ w: node.clientWidth - padX, h: node.clientHeight - padY })
    }
    read()
    const obs = new ResizeObserver(read)
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  const mine = centerMine ? people.find((p) => p.id === localId) : null
  const ring = mine ? people.filter((p) => p.id !== localId) : people
  const n = ring.length
  const w = box.w || 1
  const h = box.h || 1
  const gap = 18
  let cols = 1
  let cell = 0
  for (let c = 1; c <= Math.max(n, 1); c++) {
    const rows = Math.ceil(Math.max(n, 1) / c)
    const s = Math.min((w - gap * (c - 1)) / c, (h - gap * (rows - 1)) / rows)
    if (s > cell) {
      cols = c
      cell = s
    }
  }
  const voices = people.filter((p) => p.id !== localId)
  const voiceId = voices.length ? voices[Math.floor(now / 2200) % voices.length].id : ""

  function face(p, center) {
    const talk = (loud && p.id === localId) || p.id === voiceId
    const self = p.id === localId && localStream
    return (
      <div
        key={p.id}
        className={`meet-circle${self ? " is-local" : ""}${talk ? " is-talk" : ""}${center ? " is-center" : ""}`}
        style={center ? undefined : { width: cell, height: cell, fontSize: cell * 0.32 }}
        title={p.name}
      >
        {self ? (
          <StreamVideo stream={localStream} />
        ) : p.avatarUrl ? (
          <img src={p.avatarUrl} alt="" />
        ) : (
          <span>{p.letter || (p.name || "").charAt(0)}</span>
        )}
      </div>
    )
  }

  return (
    <div className="meet-circles" ref={well}>
      <div className="meet-circles__grid" style={{ gap, width: cols * cell + gap * (cols - 1) }}>
        {ring.map((p) => face(p, false))}
      </div>
      {mine ? face(mine, true) : null}
    </div>
  )
}

/** Full camera frame at the device's own shape. The dashed circle is the round bubble's crop. */
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
      const frame = () => {
        if (!node.videoWidth || !node.parentElement) return
        const shape = node.videoWidth / node.videoHeight
        node.parentElement.style.aspectRatio = `${node.videoWidth} / ${node.videoHeight}`
        node.parentElement.style.width = `min(100%, calc(42vh * ${shape}))`
        node.parentElement.style.height = "auto"
      }
      node.onloadedmetadata = frame
      frame()
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
