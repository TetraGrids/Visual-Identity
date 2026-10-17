import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      input: {
        guide: resolve(root, "index.html"),
        landing: resolve(root, "landing.html"),
        previews: resolve(root, "previews.html"),
        grid: resolve(root, "grid.html"),
        on: resolve(root, "tetra-on.html"),
        meet: resolve(root, "meet.html"),
      },
    },
  },
})
