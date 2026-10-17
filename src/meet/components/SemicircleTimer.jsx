import React from "react"

/** Semicircle (top arc) progress timer — used for global clock and rings. */
export function SemicircleTimer({
  progress, // 0..1 remaining fraction
  label,
  warn = false,
  cut = false,
  size = 64,
  className = "",
}) {
  const r = 22
  const c = 2 * Math.PI * r
  // semicircle = half circumference
  const semi = c / 2
  const clamped = Math.max(0, Math.min(1, progress))
  const offset = semi * (1 - clamped)
  const cls = cut ? "is-cut" : warn ? "is-warn" : ""

  return (
    <div className={`meet-semi ${className}`} style={{ width: size, height: size }} aria-label={label}>
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle className="meet-semi__track" cx="28" cy="28" r={r} strokeDasharray={`${semi} ${c}`} />
        <circle
          className={`meet-semi__prog ${cls}`}
          cx="28"
          cy="28"
          r={r}
          strokeDasharray={`${semi} ${c}`}
          strokeDashoffset={offset}
        />
      </svg>
      {label != null && <div className="meet-semi__text">{label}</div>}
    </div>
  )
}

export function formatMmSs(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, "0")}`
}
