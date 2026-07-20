import React, { useState } from 'react'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { Input, Select, Textarea } from '../../../components/Input'
import { useToast } from '../../../lib/ToastContext'
import { updateContratoAdministrativo } from '../queries'
import type { Contrato } from '../types'

interface EditarContratacaoModalProps {
  contrato: Contrato
  onClose: () => void
  onSaved: () => void
}

const STATUS_CONTRATO_OPTIONS = [
  { value: 'Pendente de assinatura', label: 'Pendente de assinatura' },
  { value: 'Contrato assinado', label: 'Contrato assinado' },
]

const MODO_PAGAMENTO_OPTIONS = [
  { value: 'Cartão de crédito', label: 'Cartão de crédito' },
  { value: 'Pix completo', label: 'Pix completo' },
  { value: 'Pix dividido', label: 'Pix dividido' },
]

const STATUS_PAGAMENTO_OPTIONS = [
  { value: 'Aguardando 1º Pagamento', label: 'Aguardando 1º Pagamento' },
  { value: 'Aguardando 2º Pagamento', label: 'Aguardando 2º Pagamento' },
  { value: 'Pagamento completo', label: 'Pagamento completo' },
]

function extrairString(valor: unknown): string {
  return typeof valor === 'string' ? valor : ''
}

export const EditarContratacaoModal: React.FC<EditarContratacaoModalProps> = ({ contrato, onClose, onSaved }) => {
  const [statusContrato, setStatusContrato] = useState(contrato.statusContrato || 'Pendente de assinatura')
  const [dataAssinaturaContrato, setDataAssinaturaContrato] = useState(extrairString(contrato.dataAssinaturaContrato))
  const [modoPagamento, setModoPagamento] = useState(contrato.modoPagamento || 'Cartão de crédito')
  const [statusPagamento, setStatusPagamento] = useState(contrato.statusPagamento || 'Pagamento completo')
  const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState(extrairString(contrato.dataPrimeiraParcela))
  const [dataSegundaParcela, setDataSegundaParcela] = useState(extrairString(contrato.dataSegundaParcela))
  const [observacao, setObservacao] = useState(contrato.ObservacaoContratacao || '')
  const [salvando, setSalvando] = useState(false)
  const { showToast } = useToast()

  const pagamentoDividido = modoPagamento === 'Pix dividido'

  function handleModoPagamentoChange(novoModo: string) {
    setModoPagamento(novoModo)
    if (novoModo !== 'Pix dividido') setStatusPagamento('Pagamento completo')
  }

  async function handleSalvar() {
    setSalvando(true)
    try {
      await updateContratoAdministrativo(contrato.id, {
        statusContrato,
        dataAssinaturaContrato,
        modoPagamento,
        statusPagamento,
        dataPrimeiraParcela,
        dataSegundaParcela,
        ObservacaoContratacao: observacao,
      })
      showToast('Contratação atualizada.', 'success')
      onSaved()
      onClose()
    } catch {
      showToast('Erro ao salvar contratação.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal
      title="Editar Contratação"
      onClose={onClose}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={salvando}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvar} loading={salvando}>Salvar Alterações</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Select label="Status do Contrato" value={statusContrato} onChange={e => setStatusContrato(e.target.value)} options={STATUS_CONTRATO_OPTIONS} />
        <Input label="Data de Assinatura do Contrato" placeholder="dd/mm/aaaa" value={dataAssinaturaContrato} onChange={e => setDataAssinaturaContrato(e.target.value)} />
        <Select label="Método de Pagamento" value={modoPagamento} onChange={e => handleModoPagamentoChange(e.target.value)} options={MODO_PAGAMENTO_OPTIONS} />
        {pagamentoDividido ? (
          <Select label="Status do Pagamento" value={statusPagamento} onChange={e => setStatusPagamento(e.target.value)} options={STATUS_PAGAMENTO_OPTIONS} />
        ) : (
          <Input label="Status do Pagamento" value="Pagamento completo" disabled onChange={() => {}} />
        )}
        <Input label="Data da 1ª Parcela" placeholder="dd/mm/aaaa" value={dataPrimeiraParcela} onChange={e => setDataPrimeiraParcela(e.target.value)} />
        <Input label="Data da 2ª Parcela" placeholder="dd/mm/aaaa" value={dataSegundaParcela} onChange={e => setDataSegundaParcela(e.target.value)} />
        <Textarea label="Observações da Contratação" rows={3} value={observacao} onChange={e => setObservacao(e.target.value)} />
      </div>
    </Modal>
  )
}
