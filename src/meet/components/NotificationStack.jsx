import React from "react"

export function NotificationStack({ items, onExpire }) {
  React.useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now()
      for (const n of items) {
        if (n.expiresAt <= now) onExpire?.(n.id)
      }
    }, 250)
    return () => clearInterval(t)
  }, [items, onExpire])

  if (!items?.length) return null

  return (
    <div className="meet-notify" aria-live="polite">
      {items.map((n) => (
        <div key={n.id} className="meet-notify__item">
          {n.text}
        </div>
      ))}
    </div>
  )
}
