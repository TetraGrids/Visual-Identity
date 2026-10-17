import React from "react"

export function DoneButton({ armed, onClick, visible }) {
  if (!visible) return null
  return (
    <button type="button" className="tetra-btn" onClick={onClick}>
      {armed ? "Confirm done" : "Done presenting"}
    </button>
  )
}
