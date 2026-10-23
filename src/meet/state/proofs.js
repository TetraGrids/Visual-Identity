/** Shared proofs shape for registration + in-room Proofs panel. */

export const KPI_TYPES = [
  { id: "percent", label: "%" },
  { id: "integer", label: "#" },
  { id: "markdown", label: "Markdown" },
  { id: "link", label: "Link" },
]

export function emptyProofs() {
  return {
    brief: "",
    imageData: "",
    links: [""],
    kpis: [],
  }
}

export function normalizeProofs(raw) {
  const base = emptyProofs()
  if (!raw || typeof raw !== "object") return base
  return {
    brief: raw.brief || "",
    imageData: raw.imageData || "",
    links: Array.isArray(raw.links) && raw.links.length ? raw.links.slice(0, 7) : [""],
    kpis: Array.isArray(raw.kpis) ? raw.kpis.slice(0, 12) : [],
  }
}

export function cleanProofs(proofs) {
  return {
    brief: (proofs.brief || "").trim(),
    imageData: proofs.imageData || "",
    links: (proofs.links || []).map((l) => String(l).trim()).filter(Boolean).slice(0, 7),
    kpis: (proofs.kpis || [])
      .filter((k) => k && String(k.name || "").trim())
      .map((k) => ({
        name: String(k.name).trim(),
        type: k.type || "integer",
        value: String(k.value || "").trim(),
      })),
  }
}

/**
 * Validate thumbnail silently for the user — only return friendly needed messages.
 * Rules: image, ≤1MB, ≥50px wide.
 */
export function readThumbnailFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Choose an image file."))
      return
    }
    if (file.size > 1024 * 1024) {
      reject(new Error("Image must be under 1 MB."))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Could not read that image."))
    reader.onload = () => {
      const dataUrl = String(reader.result)
      const img = new Image()
      img.onerror = () => reject(new Error("Could not read that image."))
      img.onload = () => {
        if (img.naturalWidth < 50) {
          reject(new Error("Image is too small."))
          return
        }
        resolve(dataUrl)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  })
}

export function proofBubbles(proofs) {
  const p = normalizeProofs(proofs)
  const bubbles = []
  if (p.imageData) bubbles.push({ kind: "image", label: "Img" })
  if (p.brief.trim()) bubbles.push({ kind: "markdown", label: "Md" })
  if (p.links.some((l) => l.trim())) bubbles.push({ kind: "links", label: "Links" })
  for (const k of p.kpis) {
    if (!k.name) continue
    bubbles.push({
      kind: "kpi",
      label: k.type === "percent" ? "%" : k.type === "integer" ? "#" : k.type === "link" ? "↗" : "Md",
      kpi: k,
    })
  }
  return bubbles
}
