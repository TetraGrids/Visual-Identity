import React from "react"
import { useHashRoute } from "./router.js"
import { Lobby } from "./screens/Lobby.jsx"
import { Create } from "./screens/Create.jsx"
import { Register } from "./screens/Register.jsx"
import { Join } from "./screens/Join.jsx"
import { Room } from "./screens/Room.jsx"
import { Profile } from "./screens/Profile.jsx"

export function App() {
  const route = useHashRoute(React)

  React.useEffect(() => {
    const inRoom = route.name === "room"
    document.body.classList.toggle("meet-in-room", inRoom)
  }, [route.name])

  let screen = null
  switch (route.name) {
    case "create":
      screen = <Create />
      break
    case "register":
      screen = <Register meetingId={route.id} />
      break
    case "join":
      screen = <Join meetingId={route.id} />
      break
    case "room":
      screen = <Room meetingId={route.id} />
      break
    case "profile":
      screen = <Profile />
      break
    case "lobby":
    default:
      screen = <Lobby />
  }

  return (
    <div className={`meet-app${route.name === "room" ? " meet-app--room" : ""}`}>
      {route.name !== "room" ? (
        <main className="tetra-main meet-main">{screen}</main>
      ) : (
        screen
      )}
    </div>
  )
}
