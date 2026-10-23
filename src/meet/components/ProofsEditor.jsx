import React from "react"
import { marked } from "marked"
import { KPI_TYPES, normalizeProofs, readThumbnailFile } from "../state/proofs.js"

export function ProofsEditor({ value, onChange, showPreview = true }) {
  const proofs = normalizeProofs(value)
  const [error, setError] = React.useState("")

  function patch(partial) {
    onChange?.({ ...proofs, ...partial })
    setError("")
  }

  async function onImage(e) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    try {
      const imageData = await readThumbnailFile(file)
      patch({ imageData })
    } catch (err) {
      setError(err.message || "Could not use that image.")
    }
  }

  function setLink(i, v) {
    const links = proofs.links.slice()
    links[i] = v
    patch({ links })
  }

  function addLink() {
    if (proofs.links.length >= 7) return
    patch({ links: [...proofs.links, ""] })
  }

  function addKpi() {
    patch({
      kpis: [...proofs.kpis, { name: "", type: "integer", value: "" }],
    })
  }

  function setKpi(i, partial) {
    const kpis = proofs.kpis.map((k, idx) => (idx === i ? { ...k, ...partial } : k))
    patch({ kpis })
  }

  function removeKpi(i) {
    patch({ kpis: proofs.kpis.filter((_, idx) => idx !== i) })
  }

  const preview = React.useMemo(() => {
    try {
      return marked.parse(proofs.brief || "", { async: false })
    } catch {
      return ""
    }
  }, [proofs.brief])

  return (
    <div className="meet-proofs-editor">
      <label>
        Thumbnail
        <input type="file" accept="image/*" onChange={onImage} />
      </label>
      {proofs.imageData ? (
        <div className="meet-proofs-editor__thumb-row">
          <img className="meet-thumb" src={proofs.imageData} alt="" />
          <button type="button" className="tetra-btn" onClick={() => patch({ imageData: "" })}>
            Remove
          </button>
        </div>
      ) : (
        <div className="meet-thumb meet-thumb--empty" aria-hidden="true">
          +
        </div>
      )}
      {error && <p className="meet-proofs-editor__err">{error}</p>}

      <label>
        Notes
        <textarea
          value={proofs.brief}
          onChange={(e) => patch({ brief: e.target.value })}
          placeholder="Write in markdown…"
          rows={5}
        />
      </label>
      {showPreview && proofs.brief && (
        <div className="meet-preview" dangerouslySetInnerHTML={{ __html: preview }} />
      )}

      <div>
        <div className="meet-section__head">
          <h2>Links</h2>
          <button
            type="button"
            className="tetra-btn"
            onClick={addLink}
            disabled={proofs.links.length >= 7}
          >
            Add
          </button>
        </div>
        <div className="meet-links">
          {proofs.links.map((l, i) => (
            <input
              key={i}
              type="url"
              placeholder="https://"
              value={l}
              onChange={(e) => setLink(i, e.target.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="meet-section__head">
          <h2>KPI</h2>
          <button type="button" className="tetra-btn" onClick={addKpi}>
            Add
          </button>
        </div>
        <div className="meet-kpi-list">
          {proofs.kpis.length === 0 && <p className="meet-note">None yet.</p>}
          {proofs.kpis.map((k, i) => (
            <div key={i} className="meet-kpi-row">
              <input
                placeholder="Name"
                value={k.name}
                onChange={(e) => setKpi(i, { name: e.target.value })}
              />
              <select value={k.type} onChange={(e) => setKpi(i, { type: e.target.value })}>
                {KPI_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                placeholder={
                  k.type === "percent"
                    ? "0–100"
                    : k.type === "link"
                      ? "https://"
                      : k.type === "markdown"
                        ? "Markdown…"
                        : "0"
                }
                value={k.value}
                onChange={(e) => setKpi(i, { value: e.target.value })}
              />
              <button type="button" className="tetra-btn" onClick={() => removeKpi(i)}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
