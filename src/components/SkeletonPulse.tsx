import React from 'react'

interface SkeletonPulseProps {
  width?: string
  height?: string
  style?: React.CSSProperties
}

/** Shimmer de carregamento — usa o keyframe `shimmer` do design system (global.css). */
export const SkeletonPulse: React.FC<SkeletonPulseProps> = ({ width = '100%', height = '16px', style }) => (
  <div style={{
    width, height, borderRadius: 'var(--radius-sm)',
    background: 'var(--c-glass-bg-sm)', overflow: 'hidden', position: 'relative', ...style,
  }}>
    <div style={{
      position: 'absolute', inset: 0,
      background: 'var(--gradient-shimmer)',
      animation: 'shimmer 1.6s linear infinite',
    }} />
  </div>
)

export const SkeletonRow: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px' }}>
    <SkeletonPulse width="20%" height="12px" />
    <SkeletonPulse width="16%" height="12px" />
    <SkeletonPulse width="14%" height="12px" />
    <SkeletonPulse width="10%" height="12px" />
    <SkeletonPulse width="12%" height="20px" style={{ borderRadius: 'var(--radius-full)' }} />
  </div>
)

export const SkeletonCard: React.FC = () => (
  <div style={{ background: 'var(--c-bg-secondary)', borderRadius: '8px', padding: '14px', border: '1px solid var(--c-border)' }}>
    <SkeletonPulse width="60%" height="13px" style={{ marginBottom: '10px' }} />
    <SkeletonPulse width="100%" height="10px" style={{ marginBottom: '6px' }} />
    <SkeletonPulse width="80%" height="10px" />
  </div>
)
