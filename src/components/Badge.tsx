import React from 'react'

export type BadgeVariant = 'blue' | 'mint' | 'white' | 'success' | 'warning' | 'error' | 'outline'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children?: React.ReactNode
  dot?: boolean
  style?: React.CSSProperties
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  blue: {
    background: 'var(--c-badge-blue-bg)',
    border: '1px solid var(--c-badge-blue-border)',
    color: 'var(--c-badge-blue-text)',
  },
  mint: {
    background: 'var(--c-badge-mint-bg)',
    border: '1px solid var(--c-badge-mint-border)',
    color: 'var(--c-badge-mint-text)',
  },
  white: {
    background: 'var(--c-badge-white-bg)',
    border: '1px solid var(--c-badge-white-border)',
    color: 'var(--c-badge-white-text)',
  },
  success: {
    background: 'var(--c-badge-success-bg)',
    border: '1px solid var(--c-badge-success-border)',
    color: 'var(--c-badge-success-text)',
  },
  warning: {
    background: 'var(--c-badge-warning-bg)',
    border: '1px solid var(--c-badge-warning-border)',
    color: 'var(--c-badge-warning-text)',
  },
  error: {
    background: 'var(--c-badge-error-bg)',
    border: '1px solid var(--c-badge-error-border)',
    color: 'var(--c-badge-error-text)',
  },
  outline: {
    background: 'var(--c-badge-outline-bg)',
    border: '1px solid var(--c-badge-outline-border)',
    color: 'var(--c-badge-outline-text)',
  },
}

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: { fontSize: '10px', padding: '2px 8px', height: '20px', gap: '4px' },
  md: { fontSize: '12px', padding: '4px 10px', height: '24px', gap: '5px' },
}

const dotColor: Record<BadgeVariant, string> = {
  blue: '#5291bb',
  mint: '#52d4a8',
  white: 'rgba(255,255,255,0.70)',
  success: '#4ade80',
  warning: '#fbbf24',
  error: '#f87171',
  outline: 'rgba(255,255,255,0.50)',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'blue', size = 'md', children, dot = false, style,
}) => {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      letterSpacing: '0.02em',
      userSelect: 'none',
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    }}>
      {dot && (
        <span style={{
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: dotColor[variant],
          flexShrink: 0,
          animation: 'pulse-glow 1.4s ease-in-out infinite',
        }} />
      )}
      {children}
    </span>
  )
}
