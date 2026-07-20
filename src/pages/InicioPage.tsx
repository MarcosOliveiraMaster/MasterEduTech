import React from 'react'
import { PainelCentralPage } from '../features/painel-central/PainelCentralPage'

export const InicioPage: React.FC = () => {
  return (
    <div style={{ padding: '32px', animation: 'slide-in-up 400ms var(--ease-spring, ease)' }}>
      <PainelCentralPage />
    </div>
  )
}
