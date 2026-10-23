/**
 * Camera look for the pre-join screen and the room.
 * Backgrounds use a small MediaPipe mask on a worker (see cutout.js).
 * We store URLs and Drive file ids only — image bytes stay with the user or Google.
 */
import { createLocalAudioTrack, createLocalVideoTrack } from "livekit-client"
import { cutoutProcessor } from "./cutout.js"

const LOOK_KEY = "tetra-meet-look"
const WALL_KEY = "tetra-meet-wall"
const TOKEN_KEY = "tetra-meet-google-token"
const frames = new Map()

export function loadLook() {
  const blank = {
    videoEnabled: true,
    audioEnabled: true,
    videoDeviceId: "",
    audioDeviceId: "",
    audioOutputId: "",
    background: "none",
  }
  try {
    return { ...blank, ...JSON.parse(localStorage.getItem(LOOK_KEY) || "{}") }
  } catch {
    return blank
  }
}

export function saveLook(look) {
  localStorage.setItem(LOOK_KEY, JSON.stringify(look))
}

export function loadWall() {
  try {
    const list = JSON.parse(localStorage.getItem(WALL_KEY) || "[]")
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function pinBackground(background, label) {
  const list = loadWall().filter((item) => item.background !== background)
  list.unshift({ background, label: label || "Image" })
  localStorage.setItem(WALL_KEY, JSON.stringify(list.slice(0, 12)))
}

export function openCameraTrack(deviceId) {
  return createLocalVideoTrack(deviceId ? { deviceId } : undefined)
}

export function openMicTrack(deviceId) {
  return createLocalAudioTrack(deviceId ? { deviceId } : undefined)
}

export function backgroundSupported() {
  return (
    typeof OffscreenCanvas !== "undefined" &&
    typeof VideoFrame !== "undefined" &&
    typeof createImageBitmap === "function" &&
    !!document.createElement("canvas").getContext("webgl2")
  )
}

function presetPath(id) {
  if (frames.has(id)) return Promise.resolve(frames.get(id))
  const canvas = document.createElement("canvas")
  canvas.width = 1280
  canvas.height = 720
  const g = canvas.getContext("2d")
  g.fillStyle = "#050705"
  g.fillRect(0, 0, 1280, 720)
  const glow = g.createRadialGradient(
    id === "preset:dusk" ? 980 : 420,
    id === "preset:dusk" ? 80 : 720,
    20,
    id === "preset:dusk" ? 980 : 420,
    id === "preset:dusk" ? 80 : 720,
    620,
  )
  glow.addColorStop(0, id === "preset:dusk" ? "rgba(139, 92, 246, 0.9)" : "rgba(34, 197, 94, 0.85)")
  glow.addColorStop(1, "rgba(5, 7, 5, 0)")
  g.fillStyle = glow
  g.fillRect(0, 0, 1280, 720)
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      frames.set(id, url)
      resolve(url)
    }, "image/jpeg", 0.86)
  })
}

async function drivePath(id) {
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (!token) throw new Error("Connect Google again to use this Drive image.")
  if (frames.has(id)) return frames.get(id)
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("That Drive image could not be loaded.")
  const url = URL.createObjectURL(await res.blob())
  frames.set(id, url)
  return url
}

async function imagePath(background) {
  if (background.startsWith("preset:")) return presetPath(background)
  if (background.startsWith("drive:")) return drivePath(background.slice(6))
  const url = background.startsWith("photos:")
    ? background.slice(7)
    : background.startsWith("url:")
      ? background.slice(4)
      : ""
  if (!url.startsWith("https://")) throw new Error("Use an https image URL.")
  if (frames.has(url)) return frames.get(url)
  try {
    const res = await fetch(url, { mode: "cors" })
    if (!res.ok) throw new Error("bad")
    const blobUrl = URL.createObjectURL(await res.blob())
    frames.set(url, blobUrl)
    return blobUrl
  } catch {
    return url
  }
}

export async function paintLook(track, background) {
  if (!track) return
  const processor = track.getProcessor?.()
  if (!background || background === "none" || !backgroundSupported()) {
    if (processor?.switchTo) await processor.switchTo({ mode: "disabled" })
    return
  }
  const next =
    background === "blur"
      ? { mode: "background-blur", blurRadius: 10 }
      : { mode: "virtual-background", imagePath: await imagePath(background) }
  if (processor?.name === "tetra-cutout") await processor.switchTo(next)
  else {
    if (processor && track.stopProcessor) await track.stopProcessor()
    await track.setProcessor(cutoutProcessor(next))
  }
}

function script(src) {
  return new Promise((resolve, reject) => {
    const found = document.querySelector(`script[src="${src}"]`)
    if (found?.dataset.ready) {
      resolve()
      return
    }
    const node = found || document.createElement("script")
    node.src = src
    node.onload = () => {
      node.dataset.ready = "1"
      resolve()
    }
    node.onerror = () => reject(new Error("Google's script did not load."))
    if (!found) document.head.appendChild(node)
  })
}

function googleToken() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
  if (!clientId || !apiKey) {
    return Promise.reject(
      new Error("Add VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY to connect Google."),
    )
  }
  return script("https://accounts.google.com/gsi/client")
    .then(() => script("https://apis.google.com/js/api.js"))
    .then(
      () =>
        new Promise((resolve, reject) => {
          const client = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope:
              "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/photospicker.mediaitems.readonly",
            callback: (resp) => {
              if (resp.error) reject(new Error("Google did not connect."))
              else {
                sessionStorage.setItem(TOKEN_KEY, resp.access_token)
                resolve(resp.access_token)
              }
            },
          })
          client.requestAccessToken()
        }),
    )
    .then((token) => ({ token, apiKey }))
}

export function connectGoogle(kind) {
  return googleToken().then(({ token, apiKey }) => {
    if (kind === "photos") {
      return fetch("https://photospicker.googleapis.com/v1/sessions", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: "{}",
      })
        .then(async (created) => {
          if (!created.ok) throw new Error("Google Photos did not open.")
          const session = await created.json()
          window.open(session.pickerUri, "tetra-photos", "popup,width=960,height=720")
          let ready = session
          for (let i = 0; i < 30 && !ready.mediaItemsSet; i++) {
            await new Promise((r) => setTimeout(r, 2000))
            const polled = await fetch(`https://photospicker.googleapis.com/v1/sessions/${session.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (!polled.ok) throw new Error("Google Photos did not finish.")
            ready = await polled.json()
          }
          if (!ready.mediaItemsSet) throw new Error("No photo was picked.")
          const listed = await fetch(
            `https://photospicker.googleapis.com/v1/mediaItems?sessionId=${encodeURIComponent(session.id)}`,
            { headers: { Authorization: `Bearer ${token}` } },
          )
          if (!listed.ok) throw new Error("That photo could not be read.")
          const base = (await listed.json()).mediaItems?.[0]?.mediaFile?.baseUrl
          if (!base) throw new Error("That photo could not be read.")
          return { background: `photos:${base}=w1600`, label: "Google Photo" }
        })
    }
    return new Promise((resolve, reject) => {
      gapi.load("picker", () => {
        const view = new google.picker.DocsView(google.picker.ViewId.DOCS_IMAGES)
          .setMimeTypes("image/png,image/jpeg,image/webp,image/gif")
          .setIncludeFolders(false)
        const picker = new google.picker.PickerBuilder()
          .setOAuthToken(token)
          .setDeveloperKey(apiKey)
          .setTitle("Choose a background")
          .setOrigin(window.location.origin)
          .addView(view)
          .setCallback((data) => {
            if (data.action === google.picker.Action.PICKED) {
              const doc = data.docs?.[0]
              if (!doc?.id) reject(new Error("No image was picked."))
              else resolve({ background: `drive:${doc.id}`, label: doc.name || "Drive image" })
            } else if (data.action === google.picker.Action.CANCEL) resolve(null)
          })
          .build()
        picker.setVisible(true)
      })
    })
  })
}
