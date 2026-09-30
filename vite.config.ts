import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base '/alltrustme/' нужен для GitHub Pages (project page);
// на Vercel (env VERCEL=1) и в dev — корень '/', чтобы приложение жило на своём домене.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VERCEL')
  const onVercel = Boolean(env.VERCEL)
  return {
    base: command === 'build' && !onVercel ? '/alltrustme/' : '/',
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
    },
  }
})
