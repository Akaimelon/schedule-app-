import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // /api/* へのリクエストを PHP サーバー(localhost:8000)へ中継する（CORS回避）
    proxy: {
      '/api': 'http://localhost:8000',
    },
    watch: {
      ignored: ["**/data/**"],
    },
  },
})
