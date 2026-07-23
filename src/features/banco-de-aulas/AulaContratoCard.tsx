import React from 'react'
import { FiUser } from 'react-icons/fi'
import { getCorStatusPagamento } from '../painel-central/helpers'
import type { Aula, Contrato } from '../painel-central/types'
import { getCorProgressoAula, getCoresStatusCard, obterEstatisticasContrato, statusCardContrato } from './helpers'

interface AulaContratoCardProps {
  contrato: Contrato
  aulas: Aula[]
  onClick: () => void
  onContextMenu: (e: React.MouseEvent) => void
}

export const AulaContratoCard: React.FC<AulaContratoCardProps> = ({ contrato, aulas, onClick, onContextMenu }) => {
  const stats = obterEstatisticasContrato(aulas)
  const status = statusCardContrato(stats)
  const cores = getCoresStatusCard(status)
  const corPagamento = getCorStatusPagamento(contrato.statusPagamento)
  const nomeCliente = contrato.nome || contrato.nomeCliente || 'Sem nome'

  return (
    <div className="aula-card-compact" onClick={onClick} onContextMenu={onContextMenu}>
      <div className="aula-card-header">
        <span className="aula-card-titulo" title={nomeCliente}>{nomeCliente}</span>
        <span className="aula-card-codigo">{contrato.id}</span>
      </div>

      <div className="aula-card-info-row">
        <FiUser size={12} />
        <span>{contrato.estudante || 'Estudante não informado'}</span>
      </div>

      <div className="aula-card-progresso" title={`${stats.concluidas} de ${stats.total} aulas concluídas`}>
        {aulas.length === 0
          ? <div className="aula-card-progresso-vazio" />
          : aulas.map(a => (
            <div key={a.id} className="aula-card-progresso-seg" style={{ background: getCorProgressoAula(a.StatusAula) }} />
          ))}
      </div>

      <div className="aula-card-footer">
        <span className="aula-card-badge" style={{ background: cores.bg, color: cores.text }}>
          {stats.concluidas}/{stats.total} concluídas
        </span>
        <span className="aula-card-badge" style={{ background: corPagamento.bg, color: corPagamento.text }}>
          {contrato.statusPagamento || 'Pagamento --'}
        </span>
      </div>
    </div>
  )
}
