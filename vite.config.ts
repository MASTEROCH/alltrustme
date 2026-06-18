import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base '/alltrustme/' нужен для GitHub Pages (project page);
// в dev оставляем '/' чтобы локальная ссылка была http://localhost:5173/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/alltrustme/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
}))
