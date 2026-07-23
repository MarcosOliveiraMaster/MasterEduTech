import React, { useState } from 'react'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { CurrencyInput } from '../../components/CurrencyInput'

interface NovoValorModalProps {
  valorHoraProfessorAtual: number
  valorLucroMasterPorHoraAtual: number
  onClose: () => void
  onSalvar: (valorHoraProfessor: number, valorLucroMasterPorHora: number) => void
}

/** Override manual de Valor Hora do Professor e Lucro Master por Hora — precedência aplicada em helpers.calcularValoresSimulacao. */
export const NovoValorModal: React.FC<NovoValorModalProps> = ({ valorHoraProfessorAtual, valorLucroMasterPorHoraAtual, onClose, onSalvar }) => {
  const [valorHoraProfessor, setValorHoraProfessor] = useState(valorHoraProfessorAtual)
  const [valorLucroMasterPorHora, setValorLucroMasterPorHora] = useState(valorLucroMasterPorHoraAtual)

  return (
    <Modal
      title="Aplicar Novos Valores"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={() => { onSalvar(valorHoraProfessor, valorLucroMasterPorHora); onClose() }}>Salvar</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <CurrencyInput label="Valor Hora do Professor" value={valorHoraProfessor} onChange={setValorHoraProfessor} helper="Padrão: R$ 35,00/hora" />
        <CurrencyInput label="Lucro Master por Hora" value={valorLucroMasterPorHora} onChange={setValorLucroMasterPorHora} helper="Padrão: R$ 30,00/hora" />
      </div>
    </Modal>
  )
}
