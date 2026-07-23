import React from 'react'
import { FiFilter, FiPlus, FiRefreshCw, FiX } from 'react-icons/fi'
import { GlassCard } from '../../components/GlassCard'
import { Button } from '../../components/Button'
import { Input, Select } from '../../components/Input'
import { nomesProfessoresUnicos } from '../painel-central/helpers'
import type { Professor } from '../painel-central/types'
import type { FiltroSimulacoes } from './types'

interface FiltroSimulacoesPainelProps {
  rascunho: FiltroSimulacoes
  onChange: (rascunho: FiltroSimulacoes) => void
  onAplicar: () => void
  onLimpar: () => void
  onAtualizar: () => void
  onNovaSimulacao: () => void
  atualizando: boolean
  professores: Professor[]
}

export const FiltroSimulacoesPainel: React.FC<FiltroSimulacoesPainelProps> = ({
  rascunho, onChange, onAplicar, onLimpar, onAtualizar, onNovaSimulacao, atualizando, professores,
}) => {
  return (
    <GlassCard variant="default">
      <div className="simulacoes-filtros-linha">
        <Input
          label="Nome do Cliente"
          value={rascunho.nomeCliente}
          onChange={e => onChange({ ...rascunho, nomeCliente: e.target.value })}
          style={{ flex: '1 1 200px' }}
        />
        <Input
          label="CPF"
          maxLength={14}
          value={rascunho.cpf}
          onChange={e => onChange({ ...rascunho, cpf: e.target.value })}
          style={{ flex: '1 1 160px' }}
        />
        <Select
          label="Professor"
          value={rascunho.professor}
          onChange={e => onChange({ ...rascunho, professor: e.target.value })}
          options={nomesProfessoresUnicos(professores).map(nome => ({ value: nome, label: nome }))}
          placeholder="Todos os professores"
          style={{ flex: '1 1 200px' }}
        />
        <Input
          label="Nome da Simulação"
          value={rascunho.nomeSimulacao}
          onChange={e => onChange({ ...rascunho, nomeSimulacao: e.target.value })}
          style={{ flex: '1 1 200px' }}
        />
      </div>

      <div className="simulacoes-filtros-acoes">
        <Button variant="primary" size="md" onClick={onAplicar}><FiFilter size={14} /> Aplicar Filtros</Button>
        <Button variant="secondary" size="md" onClick={onLimpar}><FiX size={14} /> Limpar Filtros</Button>
        <Button variant="secondary" size="md" onClick={onAtualizar} loading={atualizando}><FiRefreshCw size={14} /> Atualizar</Button>
        <Button variant="mint" size="md" onClick={onNovaSimulacao} style={{ marginLeft: 'auto' }}><FiPlus size={14} /> Nova Simulação</Button>
      </div>
    </GlassCard>
  )
}
