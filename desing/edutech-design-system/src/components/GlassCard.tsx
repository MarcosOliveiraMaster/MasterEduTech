import React from 'react'

type CardVariant = 'sm' | 'default' | 'lg' | 'purple' | 'mint'

interface GlassCardProps {
  variant?: CardVariant
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  hoverable?: boolean
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  children,
  className,
  style,
  onClick,
  hoverable = false,
}) => {
  const variantClass: Record<CardVariant, string> = {
    sm: 'glass-sm',
    default: 'glass',
    lg: 'glass-lg',
    purple: 'glass-purple',
    mint: 'glass-mint',
  }

  const paddingMap: Record<CardVariant, string> = {
    sm: '1rem',
    default: '1.5rem',
    lg: '2.5rem',
    purple: '1.5rem',
    mint: '1.5rem',
  }

  return (
    <div
      className={[variantClass[variant], className].filter(Boolean).join(' ')}
      onClick={onClick}
      style={{
        padding: paddingMap[variant],
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 250ms ease, box-shadow 250ms ease',
        ...style,
      }}
      onMouseEnter={hoverable ? e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-4px) scale(1.01)'
      } : undefined}
      onMouseLeave={hoverable ? e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = ''
      } : undefined}
    >
      {children}
    </div>
  )
}
