import React, { useState } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { useToast } from '../../lib/ToastContext'
import { excluirSimulacao } from './queries'

interface ConfirmarExclusaoSimulacaoModalProps {
  simulacaoId: string
  titulo: string
  onClose: () => void
  onExcluida: () => void
}

export const ConfirmarExclusaoSimulacaoModal: React.FC<ConfirmarExclusaoSimulacaoModalProps> = ({ simulacaoId, titulo, onClose, onExcluida }) => {
  const [excluindo, setExcluindo] = useState(false)
  const { showToast } = useToast()

  async function handleExcluir() {
    setExcluindo(true)
    try {
      await excluirSimulacao(simulacaoId)
      showToast('Simulação excluída.', 'success')
      onExcluida()
      onClose()
    } catch {
      showToast('Erro ao excluir simulação.', 'error')
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <Modal
      title="Confirmar Exclusão da Simulação"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={excluindo}>Cancelar</Button>
          <Button variant="danger" onClick={handleExcluir} loading={excluindo}>Excluir</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', textAlign: 'center' }}>
        <FiAlertTriangle size={28} style={{ color: 'var(--c-badge-error-text)' }} />
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-1)' }}>
          Excluir a simulação <strong>{simulacaoId}</strong> ({titulo || 'sem título'})?
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--c-text-3)' }}>Esta ação não pode ser desfeita.</p>
      </div>
    </Modal>
  )
}
