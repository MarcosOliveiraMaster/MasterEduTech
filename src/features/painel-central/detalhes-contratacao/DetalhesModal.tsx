import React, { useEffect, useState } from 'react'
import { FiLoader, FiInbox } from 'react-icons/fi'
import { Modal } from '../../../components/Modal'
import { fetchContrato, fetchAulasPorContratacao } from '../queries'
import { InformacoesCliente } from './InformacoesCliente'
import { DadosContratacao } from './DadosContratacao'
import { AulasAgendadasTable } from './AulasAgendadasTable'
import type { Aula, Contrato } from '../types'

interface DetalhesModalProps {
  codigoContratacao: string
  onClose: () => void
}

export const DetalhesModal: React.FC<DetalhesModalProps> = ({ codigoContratacao, onClose }) => {
  const [loading, setLoading] = useState(true)
  const [contrato, setContrato] = useState<Contrato | null>(null)
  const [aulas, setAulas] = useState<Aula[]>([])

  function carregar() {
    setLoading(true)
    Promise.all([fetchContrato(codigoContratacao), fetchAulasPorContratacao(codigoContratacao)])
      .then(([c, a]) => {
        setContrato(c)
        setAulas(a)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoContratacao])

  const nomeCliente = contrato?.nome || contrato?.nomeCliente || ''

  return (
    <Modal
      title={loading ? 'Detalhes da Contratação' : `Detalhes da Contratação - ${nomeCliente} (${codigoContratacao})`}
      onClose={onClose}
      size="xl"
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--c-text-blue)' }}>
          <FiLoader size={24} style={{ animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : !contrato ? (
        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--c-text-3)' }}>
          <FiInbox style={{ fontSize: '28px', marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
          Contratação não encontrada.
        </div>
      ) : (
        <>
          <InformacoesCliente contrato={contrato} aulas={aulas} onContratoAtualizado={carregar} />
          <DadosContratacao contrato={contrato} aulas={aulas} onValoresAtualizados={carregar} />
          <AulasAgendadasTable contrato={contrato} aulas={aulas} onAulasAtualizadas={carregar} />
        </>
      )}
    </Modal>
  )
}
