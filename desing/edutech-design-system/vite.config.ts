import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Publicado dentro do site principal do MasterEduTech, na rota /design/
// (ver ../../vite.config.ts). Em dev, o app principal faz proxy dessa
// rota para este servidor — rode com `npm run dev` (porta fixa 5175).
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/design/' : '/MasterEduTech/design/',
  server: {
    port: 5175,
    strictPort: true,
  },
})
