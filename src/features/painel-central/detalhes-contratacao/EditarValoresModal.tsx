import React, { useState } from 'react'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { CurrencyInput } from '../../../components/CurrencyInput'
import { useToast } from '../../../lib/ToastContext'
import { updateValoresContratacao } from '../queries'
import { calcularSomaValorAulas, calcularTotalMinutosAulas, formatarSomatorioDuracao } from '../helpers'
import type { Aula, Contrato } from '../types'

interface EditarValoresModalProps {
  contrato: Contrato
  aulas: Aula[]
  onClose: () => void
  onSaved: () => void
}

export const EditarValoresModal: React.FC<EditarValoresModalProps> = ({ contrato, aulas, onClose, onSaved }) => {
  const [horaAulaProfessor, setHoraAulaProfessor] = useState(contrato.horaAulaProfessor || 0)
  const [lucroMaster, setLucroMaster] = useState(contrato.lucroMaster || 0)
  const [salvando, setSalvando] = useState(false)
  const { showToast } = useToast()

  async function handleSalvar() {
    setSalvando(true)
    try {
      const valorEquipeSomado = calcularSomaValorAulas(aulas, horaAulaProfessor)
      const somatorio = formatarSomatorioDuracao(calcularTotalMinutosAulas(aulas))
      await updateValoresContratacao(contrato.id, horaAulaProfessor, lucroMaster, valorEquipeSomado, somatorio)
      showToast('Valores da contratação atualizados.', 'success')
      onSaved()
      onClose()
    } catch {
      showToast('Erro ao salvar valores.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal
      title="Editar Valores da Contratação"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={salvando}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvar} loading={salvando}>Aplicar</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <CurrencyInput label="Valor Hora/Aula" value={horaAulaProfessor} onChange={setHoraAulaProfessor} />
        <CurrencyInput label="Lucro Master" value={lucroMaster} onChange={setLucroMaster} />
      </div>
    </Modal>
  )
}
