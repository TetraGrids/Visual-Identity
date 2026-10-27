import React from "react"
import { marked } from "marked"
import { normalizeProofs, proofBubbles } from "../state/proofs.js"

/** Corner bubbles for the active speaker's proof media types. */
export function ProofBubbles({ proofs, speakerName }) {
  const [open, setOpen] = React.useState(false)
  const p = normalizeProofs(proofs)
  const bubbles = proofBubbles(p)
  const mdHtml = React.useMemo(() => {
    try {
      return marked.parse(p.brief || "", { async: false })
    } catch {
      return ""
    }
  }, [p.brief])

  if (!bubbles.length) return null

  return (
    <>
      <div className="meet-proof-bubbles" aria-label={`${speakerName || "Speaker"} proofs`}>
        {bubbles.map((b, i) => (
          <button
            key={`${b.kind}-${i}`}
            type="button"
            className={`meet-proof-bubble meet-proof-bubble--${b.kind}`}
            onClick={() => setOpen(true)}
            title={b.kpi?.name || b.label}
          >
            {b.kind === "image" && p.imageData ? (
              <img src={p.imageData} alt="" />
            ) : (
              <span>{b.label}</span>
            )}
          </button>
        ))}
      </div>

      {open && (
        <div
          className="meet-proof-expand"
          role="dialog"
          aria-label="Proofs"
          onClick={() => setOpen(false)}
        >
          <div className="meet-proof-expand__panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="meet-proof-expand__close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            {p.imageData && <img className="meet-proof-expand__img" src={p.imageData} alt="" />}
            {p.brief.trim() && (
              <div
                className="meet-proof-expand__md"
                dangerouslySetInnerHTML={{ __html: mdHtml }}
              />
            )}
            {p.links.filter(Boolean).length > 0 && (
              <ul className="meet-proof-expand__links">
                {p.links.filter(Boolean).map((href) => (
                  <li key={href}>
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {href}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {p.kpis.length > 0 && (
              <ul className="meet-proof-expand__kpis">
                {p.kpis.map((k, i) => (
                  <li key={i}>
                    <strong>{k.name}</strong>
                    {k.type === "percent" && <span> {k.value}%</span>}
                    {k.type === "integer" && <span> {k.value}</span>}
                    {k.type === "link" && (
                      <a href={k.value} target="_blank" rel="noopener noreferrer">
                        {" "}
                        {k.value}
                      </a>
                    )}
                    {k.type === "markdown" && (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: (() => {
                            try {
                              return marked.parse(k.value || "", { async: false })
                            } catch {
                              return k.value
                            }
                          })(),
                        }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  )
}
