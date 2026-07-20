import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Publicado no GitHub Pages como projeto (https://<user>.github.io/MasterEduTech/).
// A área de design (desing/edutech-design-system) é publicada dentro do mesmo
// site em /MasterEduTech/design/ — o proxy abaixo replica essa estrutura em dev,
// desde que o app de design esteja rodando com `npm run dev` (porta 5175).
export default defineConfig({
  plugins: [react()],
  base: '/MasterEduTech/',
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
