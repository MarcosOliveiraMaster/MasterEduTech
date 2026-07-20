import React from 'react'
import { createPortal } from 'react-dom'
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi'
import type { ToastVariant } from '../lib/ToastContext'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

const variantIcon: Record<ToastVariant, React.ReactNode> = {
  success: <FiCheckCircle size={18} />,
  error: <FiXCircle size={18} />,
  info: <FiInfo size={18} />,
  warning: <FiAlertTriangle size={18} />,
}

const variantStyle: Record<ToastVariant, React.CSSProperties> = {
  success: { background: 'var(--c-badge-success-bg)', border: '1px solid var(--c-badge-success-border)', color: 'var(--c-badge-success-text)' },
  error: { background: 'var(--c-badge-error-bg)', border: '1px solid var(--c-badge-error-border)', color: 'var(--c-badge-error-text)' },
  info: { background: 'var(--c-badge-blue-bg)', border: '1px solid var(--c-badge-blue-border)', color: 'var(--c-badge-blue-text)' },
  warning: { background: 'var(--c-badge-warning-bg)', border: '1px solid var(--c-badge-warning-border)', color: 'var(--c-badge-warning-text)' },
}

interface ToastHostProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export const ToastHost: React.FC<ToastHostProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null
  return createPortal(
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px',
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--c-shadow-md)', cursor: 'pointer',
            fontSize: '13px', fontWeight: 500, backdropFilter: 'blur(8px)',
            animation: 'fade-scale-in 180ms ease-out',
            ...variantStyle[t.variant],
          }}
        >
          {variantIcon[t.variant]}
          <span style={{ flex: 1 }}>{t.message}</span>
        </div>
      ))}
    </div>,
    document.body,
  )
}
