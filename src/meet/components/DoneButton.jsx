import React from "react"

export function DoneButton({ armed, onClick, visible }) {
  if (!visible) return null
  return (
    <button type="button" className="tetra-btn meet-btn" aria-pressed={armed} onClick={onClick}>
      {armed ? "Confirm done" : "Done presenting"}
    </button>
  )
}
