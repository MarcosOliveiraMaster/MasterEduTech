import React, { useEffect, useState } from 'react'

type NotifVariant = 'info' | 'success' | 'warning' | 'error'

interface NotificationProps {
  variant?: NotifVariant
  title?: string
  message: string
  duration?: number
  onClose?: () => void
  visible?: boolean
}

const variantTokens: Record<NotifVariant, {
  bg: string
  border: string
  iconColor: string
  icon: React.ReactNode
}> = {
  info: {
    bg: 'var(--c-notif-info-bg)',
    border: 'var(--c-notif-info-border)',
    iconColor: 'var(--c-notif-info-icon)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="5.5" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
  success: {
    bg: 'var(--c-notif-success-bg)',
    border: 'var(--c-notif-success-border)',
    iconColor: 'var(--c-notif-success-icon)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  warning: {
    bg: 'var(--c-notif-warning-bg)',
    border: 'var(--c-notif-warning-border)',
    iconColor: 'var(--c-notif-warning-icon)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L16.5 15H1.5L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="12.5" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
  error: {
    bg: 'var(--c-notif-error-bg)',
    border: 'var(--c-notif-error-border)',
    iconColor: 'var(--c-notif-error-icon)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
}

export const Notification: React.FC<NotificationProps> = ({
  variant = 'info',
  title,
  message,
  duration,
  onClose,
  visible: controlledVisible,
}) => {
  const [show, setShow] = useState(true)
  const visible = controlledVisible !== undefined ? controlledVisible : show
  const tokens = variantTokens[variant]

  useEffect(() => {
    if (duration && visible) {
      const t = setTimeout(() => {
        setShow(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(t)
    }
  }, [duration, visible, onClose])

  if (!visible) return null

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        background: tokens.bg,
        border: `1px solid ${tokens.border}`,
        boxShadow: 'var(--c-shadow-md)',
        animation: 'slide-in-right 300ms ease forwards',
        maxWidth: '380px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span style={{ color: tokens.iconColor, flexShrink: 0, paddingTop: '1px' }}>
        {tokens.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <p style={{
            margin: '0 0 2px',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--c-text-1)',
          }}>
            {title}
          </p>
        )}
        <p style={{
          margin: 0,
          fontSize: 'var(--font-size-sm)',
          color: 'var(--c-text-2)',
          lineHeight: 1.5,
        }}>
          {message}
        </p>
      </div>
      <button
        onClick={() => { setShow(false); onClose?.() }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          color: 'var(--c-text-3)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          transition: 'color 150ms',
        }}
        aria-label="Fechar"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
