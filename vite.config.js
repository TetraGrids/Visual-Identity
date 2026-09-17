import { defineConfig } from "vite"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  server: { port: 5173 },
  build: {
    rollupOptions: {
      input: {
        guide: resolve(root, "index.html"),
        landing: resolve(root, "landing.html"),
        previews: resolve(root, "previews.html"),
      },
    },
  },
})
