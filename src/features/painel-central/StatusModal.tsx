import React, { useState } from 'react'
import { FiInfo, FiCheckCircle, FiLoader } from 'react-icons/fi'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { STATUS_OPTIONS } from './types'
import { getStatusColors } from './helpers'
import { updateAulaStatus } from './queries'

interface StatusModalProps {
  aulaId: string
  currentStatus: string
  onClose: () => void
  onUpdated: () => void
}

export const StatusModal: React.FC<StatusModalProps> = ({ aulaId, currentStatus, onClose, onUpdated }) => {
  const [salvando, setSalvando] = useState<string | null>(null)

  async function handleSelect(status: string) {
    setSalvando(status)
    try {
      await updateAulaStatus(aulaId, status)
      onUpdated()
      onClose()
    } finally {
      setSalvando(null)
    }
  }

  return (
    <Modal title="Alterar Status da Aula" onClose={onClose} footer={<Button variant="secondary" onClick={onClose}>Cancelar</Button>}>
      <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--c-text-2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <FiInfo style={{ color: 'var(--c-text-blue)' }} />
        Selecione o novo status da aula:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {STATUS_OPTIONS.map(status => {
          const isSelected = status === currentStatus
          const colors = getStatusColors(status)
          return (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              disabled={!!salvando}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', textAlign: 'left',
                fontWeight: 700, letterSpacing: '0.02em', background: colors.bg, color: colors.text, border: 'none',
                cursor: salvando ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: isSelected ? '0 0 0 2px var(--blue-400)' : 'none',
              }}
            >
              <FiCheckCircle />
              <span style={{ flex: 1 }}>{status}</span>
              {salvando === status && <FiLoader style={{ animation: 'spin 0.7s linear infinite' }} />}
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
