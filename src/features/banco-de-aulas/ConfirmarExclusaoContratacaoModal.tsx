import React, { useState } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { useToast } from '../../lib/ToastContext'
import { excluirContratacao } from './queries'

interface ConfirmarExclusaoContratacaoModalProps {
  codigoContratacao: string
  nomeCliente: string
  aulaIds: string[]
  onClose: () => void
  onExcluido: () => void
}

export const ConfirmarExclusaoContratacaoModal: React.FC<ConfirmarExclusaoContratacaoModalProps> = ({
  codigoContratacao, nomeCliente, aulaIds, onClose, onExcluido,
}) => {
  const [excluindo, setExcluindo] = useState(false)
  const { showToast } = useToast()

  async function handleExcluir() {
    setExcluindo(true)
    try {
      await excluirContratacao(codigoContratacao, aulaIds)
      showToast('Contratação excluída.', 'success')
      onExcluido()
      onClose()
    } catch {
      showToast('Erro ao excluir contratação.', 'error')
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <Modal
      title="Confirmar Exclusão da Contratação"
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
          Excluir a contratação <strong>{codigoContratacao}</strong> de <strong>{nomeCliente}</strong>?
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--c-text-3)' }}>
          Todas as {aulaIds.length} aula{aulaIds.length === 1 ? '' : 's'} vinculada{aulaIds.length === 1 ? '' : 's'} serão excluídas permanentemente. Esta ação não pode ser desfeita.
        </p>
      </div>
    </Modal>
  )
}
