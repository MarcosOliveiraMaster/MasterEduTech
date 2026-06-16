import React, { useState } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'mint'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  style?: React.CSSProperties
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    height: '32px',
    padding: '0 12px',
    fontSize: '12px',
    borderRadius: '8px',
    gap: '6px',
  },
  md: {
    height: '40px',
    padding: '0 18px',
    fontSize: '14px',
    borderRadius: '10px',
    gap: '8px',
  },
  lg: {
    height: '48px',
    padding: '0 24px',
    fontSize: '15px',
    borderRadius: '12px',
    gap: '10px',
  },
}

const variantBase: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #7c3aed 0%, #6020cc 100%)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 0 16px rgba(124, 58, 237, 0.35)',
  },
  secondary: {
    background: 'var(--c-btn-secondary-bg)',
    color: 'var(--c-text-1)',
    border: '1px solid var(--c-btn-secondary-border)',
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--c-text-2)',
    border: '1px solid transparent',
    boxShadow: 'none',
  },
  danger: {
    background: 'var(--c-btn-danger-bg)',
    color: 'var(--c-btn-danger-text)',
    border: '1px solid var(--c-btn-danger-border)',
    boxShadow: 'none',
  },
  success: {
    background: 'var(--c-btn-success-bg)',
    color: 'var(--c-btn-success-text)',
    border: '1px solid var(--c-btn-success-border)',
    boxShadow: 'none',
  },
  mint: {
    background: 'linear-gradient(135deg, #83e6c3 0%, #52d4a8 100%)',
    color: '#08051a',
    border: 'none',
    boxShadow: '0 0 16px rgba(131, 230, 195, 0.30)',
  },
}

const variantHover: Record<ButtonVariant, Partial<React.CSSProperties>> = {
  primary: {
    background: 'linear-gradient(135deg, #9a5bff 0%, #7c3aed 100%)',
    boxShadow: '0 0 24px rgba(124, 58, 237, 0.55)',
    transform: 'translateY(-1px)',
  },
  secondary: {
    background: 'var(--c-btn-secondary-hover)',
  },
  ghost: {
    background: 'var(--c-btn-ghost-hover)',
    color: 'var(--c-text-1)',
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.25)',
  },
  success: {
    background: 'rgba(34, 197, 94, 0.22)',
  },
  mint: {
    background: 'linear-gradient(135deg, #9fecd1 0%, #83e6c3 100%)',
    boxShadow: '0 0 24px rgba(131, 230, 195, 0.50)',
    transform: 'translateY(-1px)',
  },
}

const Spinner: React.FC<{ color?: string }> = ({ color = '#ffffff' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }}
  >
    <circle cx="7" cy="7" r="5.5" stroke={color} strokeOpacity="0.3" strokeWidth="2" />
    <path
      d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  fullWidth = false,
  style,
}) => {
  const [hovered, setHovered] = useState(false)

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'all 200ms ease',
    outline: 'none',
    userSelect: 'none',
    width: fullWidth ? '100%' : undefined,
    ...sizeStyles[size],
    ...variantBase[variant],
    ...(hovered && !disabled && !loading ? variantHover[variant] : {}),
    ...style,
  }

  const spinnerColor = variant === 'mint' ? '#08051a' : variant === 'primary' ? '#ffffff' : 'currentColor'

  return (
    <button
      type={type}
      style={baseStyle}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {loading && <Spinner color={spinnerColor} />}
      {children}
    </button>
  )
}
