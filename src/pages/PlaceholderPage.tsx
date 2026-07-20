import React from 'react'
import { GlassCard } from '../components/GlassCard'

export const PlaceholderPage: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div style={{ padding: '32px', maxWidth: '860px' }}>
    <GlassCard variant="default" style={{ animation: 'slide-in-up 400ms var(--ease-spring, ease)' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 'var(--font-size-xl)' }}>{title}</h1>
      <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--c-text-2)' }}>
        {description ?? 'Conteúdo em desenvolvimento.'}
      </p>
    </GlassCard>
  </div>
)
