import React from 'react'
import { FiUser } from 'react-icons/fi'
import { calcularValoresSimulacao, formatarTotalHorasSimulacao } from './helpers'
import type { Simulacao } from './types'

interface SimulacaoCardProps {
  simulacao: Simulacao
  onClick: () => void
}

const formatterBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const SimulacaoCard: React.FC<SimulacaoCardProps> = ({ simulacao, onClick }) => {
  const valores = calcularValoresSimulacao(simulacao.aulas, !!simulacao.overrideAtivo, simulacao.valorHoraProfessor, simulacao.valorLucroMasterPorHora)
  const aprovada = (simulacao.tituloSimulacao || '').toUpperCase().startsWith('SIMULAÇÃO APROVADA')

  return (
    <div className={`simulacao-card${aprovada ? ' simulacao-card-especial' : ''}`} onClick={onClick}>
      <div className="simulacao-card-header">
        <span className="simulacao-card-titulo" title={simulacao.tituloSimulacao}>{simulacao.tituloSimulacao || 'Sem título'}</span>
        <span className="simulacao-card-codigo">{simulacao.id}</span>
      </div>

      <div className="simulacao-card-info-row">
        <FiUser size={12} />
        <span>{simulacao.nomeCliente || 'Cliente não definido'}</span>
      </div>

      <div className="simulacao-card-footer">
        <span className="simulacao-card-badge">{simulacao.aulas.length} aula{simulacao.aulas.length === 1 ? '' : 's'}</span>
        <span className="simulacao-card-badge">{formatarTotalHorasSimulacao(valores.horas)}</span>
        <span className="simulacao-card-badge simulacao-card-badge-destaque">{formatterBRL.format(valores.valorPacote)}</span>
      </div>
    </div>
  )
}
