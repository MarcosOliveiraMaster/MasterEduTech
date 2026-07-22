import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Publicado no GitHub Pages como projeto (https://<user>.github.io/MasterEduTech/)
// e também no Vercel na raiz do domínio (https://masteredutech.vercel.app/).
// A env var VERCEL é definida automaticamente pelo Vercel durante o build.
// A área de design (desing/edutech-design-system) é publicada dentro do mesmo
// site em <base>design/ — o proxy abaixo replica essa estrutura em dev,
// desde que o app de design esteja rodando com `npm run dev` (porta 5175).
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/MasterEduTech/',
  server: {
    proxy: {
      '/MasterEduTech/design': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
