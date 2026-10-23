/**
 * Virtual background that keeps the camera at full frame rate.
 * The mask is computed on a worker from a 256×144 frame; this file only
 * composites the newest camera frame with the latest feathered mask.
 */
const MODEL_W = 256
const MODEL_H = 144

export function cutoutProcessor(initial) {
  let mode = "disabled"
  let blurRadius = 10
  let bg = null
  let bgTicket = 0
  let worker = null
  let live = false
  let booting = null
  let era = 0
  let pending = false
  let lastAsk = 0
  let askEra = 0
  let stamp = 0
  let dead = false
  let maskReady = false
  let crop = { x: 0, y: 0, w: MODEL_W, h: MODEL_H }
  let reader = null
  let writer = null
  let latest = null
  let serial = 0
  let drawn = 0
  let clock = 0
  let writing = false
  let video = null
  const canvas = document.createElement("canvas")
  canvas.width = 1280
  canvas.height = 720
  const small = document.createElement("canvas")
  small.width = MODEL_W
  small.height = MODEL_H
  const maskCanvas = document.createElement("canvas")
  const plate = document.createElement("canvas")
  const api = {
    name: "tetra-cutout",
    processedTrack: undefined,
    init,
    restart,
    destroy,
    switchTo,
  }

  function boot() {
    if (worker) return Promise.resolve()
    if (!booting) {
      booting = new Promise((resolve, reject) => {
        worker = new Worker(new URL("./cutout.worker.js", import.meta.url), { type: "module" })
        worker.onmessage = (e) => {
          if (e.data.ready) {
            live = true
            resolve()
            return
          }
          if (e.data.failed) {
            pending = false
            if (!live) reject(new Error(e.data.failed))
            return
          }
          if (!e.data.rgba) {
            pending = false
            return
          }
          pending = false
          const width = e.data.width
          const height = e.data.height
          if (maskCanvas.width !== width || maskCanvas.height !== height) {
            maskCanvas.width = width
            maskCanvas.height = height
          }
          maskCanvas.getContext("2d").putImageData(new ImageData(e.data.rgba, width, height), 0, 0)
          crop = {
            x: e.data.x * (width / MODEL_W),
            y: e.data.y * (height / MODEL_H),
            w: e.data.w * (width / MODEL_W),
            h: e.data.h * (height / MODEL_H),
          }
          maskReady = true
        }
        worker.onerror = () => {
          pending = false
          if (!live) reject(new Error("Background model did not load."))
        }
      })
    }
    return booting
  }

  function draw(ctx, source, w, h) {
    ctx.globalCompositeOperation = "source-over"
    if (mode === "disabled" || !maskReady) {
      ctx.drawImage(source, 0, 0, w, h)
      return
    }
    ctx.drawImage(source, 0, 0, w, h)
    ctx.globalCompositeOperation = "destination-in"
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(maskCanvas, crop.x, crop.y, crop.w, crop.h, 0, 0, w, h)
    ctx.globalCompositeOperation = "destination-over"
    if (mode === "background-blur") {
      const bw = Math.max(2, w >> 2)
      const bh = Math.max(2, h >> 2)
      if (plate.width !== bw || plate.height !== bh) {
        plate.width = bw
        plate.height = bh
      }
      const pctx = plate.getContext("2d")
      pctx.filter = `blur(${Math.max(2, Math.round(blurRadius / 2))}px)`
      pctx.drawImage(source, 0, 0, bw, bh)
      pctx.filter = "none"
      ctx.drawImage(plate, 0, 0, w, h)
    } else if (bg) {
      const scale = Math.max(w / bg.width, h / bg.height)
      const dw = bg.width * scale
      const dh = bg.height * scale
      ctx.drawImage(bg, (w - dw) / 2, (h - dh) / 2, dw, dh)
    } else {
      ctx.fillStyle = "#050705"
      ctx.fillRect(0, 0, w, h)
    }
    ctx.globalCompositeOperation = "source-over"
  }

  function ask(source, w, h) {
    if (!live || mode === "disabled" || pending) return
    const now = performance.now()
    if (now - lastAsk < 50) return
    lastAsk = now
    pending = true
    const scale = Math.min(MODEL_W / w, MODEL_H / h)
    const dw = Math.max(1, Math.round(w * scale))
    const dh = Math.max(1, Math.round(h * scale))
    const dx = (MODEL_W - dw) >> 1
    const dy = (MODEL_H - dh) >> 1
    const sctx = small.getContext("2d")
    sctx.fillStyle = "#000"
    sctx.fillRect(0, 0, MODEL_W, MODEL_H)
    sctx.drawImage(source, dx, dy, dw, dh)
    const mine = askEra
    createImageBitmap(small)
      .then((bitmap) => {
        if (mine !== askEra || !worker || mode === "disabled") {
          bitmap.close()
          if (mine === askEra) pending = false
          return
        }
        stamp += 33
        worker.postMessage({ bitmap, t: stamp, x: dx, y: dy, w: dw, h: dh }, [bitmap])
      })
      .catch(() => {
        pending = false
      })
  }

  function paint(source, w, h) {
    if (!w || !h) return false
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    draw(canvas.getContext("2d"), source, w, h)
    ask(source, w, h)
    if (!writer) return true
    if (writing) return true
    writing = true
    const t = source.timestamp || 0
    if (t > clock) clock = t
    else clock += 33333
    const out = new VideoFrame(canvas, { timestamp: clock })
    writer.write(out).catch(() => out.close()).finally(() => {
      writing = false
    })
    return true
  }

  let videoTime = -1

  function watch(mine) {
    if (mine !== era) return
    try {
      if (latest && serial !== drawn) {
        const frame = latest
        const id = serial
        if (paint(frame, frame.displayWidth, frame.displayHeight)) drawn = id
      } else if (!reader && video?.videoWidth && video.currentTime !== videoTime) {
        videoTime = video.currentTime
        paint(video, video.videoWidth, video.videoHeight)
      }
    } catch {
      /* frame closed while the camera restarted */
    }
    if (mine !== era) return
    if (!reader && video?.requestVideoFrameCallback && video.videoWidth) {
      video.requestVideoFrameCallback(() => watch(mine))
    } else {
      requestAnimationFrame(() => watch(mine))
    }
  }

  async function pull(mine, reading) {
    try {
      while (mine === era) {
        const next = await reading.read()
        if (next.done || mine !== era) {
          next.value?.close()
          return
        }
        latest?.close()
        latest = next.value
        serial++
      }
    } catch {
      /* reader cancelled */
    }
  }

  function start(opts) {
    const mine = era
    video = opts.element
    serial = 0
    drawn = 0
    clock = 0
    latest?.close()
    latest = null
    if (typeof MediaStreamTrackProcessor === "function" && typeof MediaStreamTrackGenerator === "function") {
      const stream = new MediaStreamTrackProcessor({ track: opts.track })
      let generator
      try {
        generator = new MediaStreamTrackGenerator({ kind: "video", signalTarget: opts.track })
      } catch {
        generator = new MediaStreamTrackGenerator({ kind: "video" })
      }
      reader = stream.readable.getReader()
      writer = generator.writable.getWriter()
      api.processedTrack = generator
      pull(mine, reader)
    } else {
      canvas.style.display = "none"
      if (!canvas.isConnected) document.body.appendChild(canvas)
      reader = null
      writer = null
      api.processedTrack = canvas.captureStream(0).getVideoTracks()[0]
    }
    watch(mine)
  }

  function stop() {
    era++
    askEra++
    pending = false
    videoTime = -1
    writing = false
    const reading = reader
    const writing = writer
    reader = null
    writer = null
    latest?.close()
    latest = null
    reading?.cancel().catch(() => {})
    writing?.close().catch(() => {})
    try {
      api.processedTrack?.stop()
    } catch {
      /* already stopped */
    }
    api.processedTrack = undefined
  }

  function loadImage(path) {
    const mine = ++bgTicket
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error("Background image did not load."))
      img.src = path
    })
      .then((img) => createImageBitmap(img))
      .then((bitmap) => {
        if (mine !== bgTicket || dead) {
          bitmap.close()
          return
        }
        bg?.close()
        bg = bitmap
      })
  }

  function switchTo(opts) {
    mode = opts.mode
    if (opts.mode === "disabled") {
      pending = false
      return Promise.resolve()
    }
    if (opts.mode === "background-blur") {
      blurRadius = opts.blurRadius ?? 10
      return Promise.resolve()
    }
    return loadImage(opts.imagePath)
  }

  async function init(opts) {
    await boot()
    if (initial?.mode && initial.mode !== "disabled") await switchTo(initial)
    start(opts)
  }

  async function restart(opts) {
    stop()
    worker?.postMessage({ reset: true })
    start(opts)
  }

  async function destroy() {
    dead = true
    stop()
    worker?.postMessage({ close: true })
    worker?.terminate()
    worker = null
    live = false
    booting = null
    bg?.close()
    bg = null
    if (canvas.isConnected) canvas.remove()
  }

  return api
}
