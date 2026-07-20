import React, { useState } from 'react'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { Textarea } from '../../../components/Input'
import { useToast } from '../../../lib/ToastContext'
import { updateObservacaoContratacao } from '../queries'
import type { Contrato } from '../types'

interface ObservacoesContratacaoModalProps {
  contrato: Contrato
  onClose: () => void
  onSaved: () => void
}

export const ObservacoesContratacaoModal: React.FC<ObservacoesContratacaoModalProps> = ({ contrato, onClose, onSaved }) => {
  const [texto, setTexto] = useState(contrato.ObservacaoContratacao || '')
  const [salvando, setSalvando] = useState(false)
  const { showToast } = useToast()

  async function handleSalvar() {
    setSalvando(true)
    try {
      await updateObservacaoContratacao(contrato.id, texto)
      showToast('Observações salvas.', 'success')
      onSaved()
      onClose()
    } catch {
      showToast('Erro ao salvar observações.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal
      title="Observações da Contratação"
      onClose={onClose}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={salvando}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvar} loading={salvando}>Salvar</Button>
        </>
      }
    >
      <Textarea rows={6} value={texto} onChange={e => setTexto(e.target.value)} placeholder="Nenhuma observação registrada." />
    </Modal>
  )
}
