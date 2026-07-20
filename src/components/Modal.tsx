import React from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

const sizeMaxWidth: Record<ModalSize, string> = {
  sm: '400px',
  md: '560px',
  lg: '800px',
  xl: '1100px',
}

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
  size?: ModalSize
  fullscreen?: boolean
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children, footer, maxWidth, size, fullscreen = false }) => {
  const resolvedMaxWidth = maxWidth ?? (size ? sizeMaxWidth[size] : '480px')

  return createPortal(
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: fullscreen ? '16px' : '24px',
      }}
    >
      <div
        className="glass-lg"
        style={{
          width: '100%',
          maxWidth: fullscreen ? '100%' : resolvedMaxWidth,
          height: fullscreen ? '100%' : undefined,
          maxHeight: fullscreen ? '100%' : '85vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', animation: 'fade-scale-in 200ms ease-out',
        }}
      >
        <div style={{ height: '4px', background: 'var(--gradient-accent)', flexShrink: 0 }} />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--c-border)',
        }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--c-text-1)' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-2)', display: 'flex',
              padding: '6px', borderRadius: 'var(--radius-full)', transition: 'background 150ms, color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-btn-ghost-hover)'; e.currentTarget.style.color = 'var(--c-text-1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--c-text-2)' }}
            aria-label="Fechar"
          >
            <FiX size={18} />
          </button>
        </div>
        <div style={{ padding: '20px', overflowY: 'auto', color: 'var(--c-text-1)' }}>{children}</div>
        {footer && (
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: '10px',
            padding: '14px 20px', borderTop: '1px solid var(--c-border)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
