import React, { useState } from 'react'
import { Modal } from '../../../../components/Modal'
import { Button } from '../../../../components/Button'
import { Input } from '../../../../components/Input'

interface SimpleInputModalProps {
  title: string
  type?: 'time' | 'text'
  value: string
  onClose: () => void
  onSave: (novoValor: string) => Promise<void>
}

/** Cobre Horário (input nativo type="time") e outros campos de texto livre simples. */
export const SimpleInputModal: React.FC<SimpleInputModalProps> = ({ title, type = 'text', value, onClose, onSave }) => {
  const [valorAtual, setValorAtual] = useState(value)
  const [salvando, setSalvando] = useState(false)

  async function handleSalvar() {
    setSalvando(true)
    try {
      await onSave(valorAtual)
      onClose()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={salvando}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvar} loading={salvando} disabled={!valorAtual}>Salvar</Button>
        </>
      }
    >
      <Input type={type} value={valorAtual} onChange={e => setValorAtual(e.target.value)} />
    </Modal>
  )
}
