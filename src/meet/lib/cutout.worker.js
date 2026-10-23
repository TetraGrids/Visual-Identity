/**
 * Same tiny selfie model the meeting already used, on a worker so the camera
 * thread never waits on it. Landscape input matches a 16:9 frame, so the
 * person is not stretched. The confidence mask is feathered across frames
 * so the outline does not sparkle.
 */
import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision"

// MediaPipe's wasm loader calls importScripts. Module workers have that
// function, but calling it throws. Load the same script synchronously.
let scriptBase = ""
self.importScripts = (url) => {
  const abs = new URL(url, scriptBase || self.location.href).href
  scriptBase = abs
  const xhr = new XMLHttpRequest()
  xhr.open("GET", abs, false)
  xhr.send()
  if (xhr.status !== 200) throw new Error("Background model did not load.")
  ;(0, eval)(`${xhr.responseText}\n//# sourceURL=${abs}`)
}

let segmenter
let personAt = 1
let hold
let cur
let grown
let tmp

function feather(prob, width, height) {
  const n = width * height
  if (!cur || cur.length !== n) {
    cur = new Float32Array(n)
    grown = new Float32Array(n)
    tmp = new Float32Array(n)
    hold = null
  }
  if (!hold) hold = new Float32Array(prob)
  for (let i = 0; i < n; i++) {
    const p = prob[i] < 0 ? 0 : prob[i] > 1 ? 1 : prob[i]
    let v = p * 0.6 + hold[i] * 0.4
    if (hold[i] > 0.75 && p > 0.25 && v < hold[i] - 0.18) v = hold[i] - 0.18
    cur[i] = v
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let m = 0
      for (let ky = -1; ky <= 1; ky++) {
        const yy = y + ky
        if (yy < 0 || yy >= height) continue
        const row = yy * width
        for (let kx = -1; kx <= 1; kx++) {
          const xx = x + kx
          if (xx < 0 || xx >= width) continue
          if (cur[row + xx] > m) m = cur[row + xx]
        }
      }
      grown[y * width + x] = m
    }
  }
  const div = 5
  for (let y = 0; y < height; y++) {
    const row = y * width
    for (let x = 0; x < width; x++) {
      let s = 0
      for (let k = -2; k <= 2; k++) {
        const xx = x + k
        s += grown[row + (xx < 0 ? 0 : xx >= width ? width - 1 : xx)]
      }
      tmp[row + x] = s / div
    }
  }
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let s = 0
      for (let k = -2; k <= 2; k++) {
        const yy = y + k
        s += tmp[(yy < 0 ? 0 : yy >= height ? height - 1 : yy) * width + x]
      }
      hold[y * width + x] = s / div
    }
  }
  const rgba = new Uint8ClampedArray(n * 4)
  for (let i = 0; i < n; i++) {
    const t = (hold[i] - 0.32) / 0.34
    const u = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t)
    rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 255
    rgba[i * 4 + 3] = u * 255
  }
  return rgba
}

try {
  const fileset = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
  )
  segmenter = await ImageSegmenter.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/latest/selfie_segmenter_landscape.tflite",
      delegate: "CPU",
    },
    runningMode: "VIDEO",
    outputCategoryMask: false,
    outputConfidenceMasks: true,
  })
  const labels = segmenter.getLabels()
  const found = labels.findIndex((label) => /person/i.test(label))
  personAt = found >= 0 ? found : labels.length > 1 ? 1 : 0
  postMessage({ ready: true })
} catch (err) {
  postMessage({ failed: err?.message || "Background model did not load." })
}

onmessage = (e) => {
  if (e.data.reset) {
    hold = null
    return
  }
  if (e.data.close) {
    segmenter?.close()
    close()
    return
  }
  const bitmap = e.data.bitmap
  if (!bitmap || !segmenter) return
  try {
    let rgba
    let width
    let height
    segmenter.segmentForVideo(bitmap, e.data.t, (result) => {
      const masks = result.confidenceMasks || []
      if (!masks.length) throw new Error("Background frame failed.")
      const mask = masks[Math.min(personAt, masks.length - 1)]
      width = mask.width
      height = mask.height
      rgba = feather(mask.getAsFloat32Array(), width, height)
    })
    bitmap.close()
    postMessage({ rgba, width, height, x: e.data.x, y: e.data.y, w: e.data.w, h: e.data.h }, [rgba.buffer])
  } catch (err) {
    bitmap.close()
    postMessage({ failed: err?.message || "Background frame failed." })
  }
}
