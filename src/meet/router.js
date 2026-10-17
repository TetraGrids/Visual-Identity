/** Minimal hash router: #/lobby, #/create, #/register/:id, #/join/:id, #/room/:id, #/profile */

export function parseHash(hash = window.location.hash) {
  const raw = (hash || "#/lobby").replace(/^#/, "") || "/lobby"
  const path = raw.startsWith("/") ? raw : `/${raw}`
  const parts = path.split("/").filter(Boolean)
  const name = parts[0] || "lobby"
  const id = parts[1] || null
  return { name, id, path: `/${parts.join("/")}` }
}

export function navigate(to) {
  const next = to.startsWith("#") ? to : `#${to.startsWith("/") ? to : `/${to}`}`
  if (window.location.hash === next) {
    window.dispatchEvent(new HashChangeEvent("hashchange"))
    return
  }
  window.location.hash = next
}

export function useHashRoute(React) {
  const [route, setRoute] = React.useState(() => parseHash())
  React.useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener("hashchange", onHash)
    if (!window.location.hash) navigate("/lobby")
    return () => window.removeEventListener("hashchange", onHash)
  }, [])
  return route
}
