import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiRefreshCw, FiRotateCcw } from 'react-icons/fi'
import { GlassCard } from '../../components/GlassCard'
import { Button } from '../../components/Button'
import { Input, Select } from '../../components/Input'
import { nomesProfessoresUnicos } from '../painel-central/helpers'
import type { Professor } from '../painel-central/types'
import { STATUS_PAGAMENTO_OPTIONS, SEM_PROFESSOR, type FiltroAulas, type FiltroBancoAulas, type FiltroDatas } from './types'

interface ClienteOpcao { cpf: string; nome: string }

interface FiltroBancoAulasPainelProps {
  filtro: FiltroBancoAulas
  onDatasChange: (v: FiltroDatas) => void
  onProfessorChange: (v: string) => void
  onAulasChange: (v: FiltroAulas) => void
  onPagamentoChange: (v: string) => void
  onClienteChange: (v: string) => void
  onCodigoChange: (v: string) => void
  onLimpar: () => void
  onAtualizar: () => void
  atualizando: boolean
  professores: Professor[]
  clientes: ClienteOpcao[]
}

export const FiltroBancoAulasPainel: React.FC<FiltroBancoAulasPainelProps> = ({
  filtro, onDatasChange, onProfessorChange, onAulasChange, onPagamentoChange, onClienteChange, onCodigoChange,
  onLimpar, onAtualizar, atualizando, professores, clientes,
}) => {
  const [maisFiltrosAberto, setMaisFiltrosAberto] = useState(false)

  return (
    <GlassCard variant="default">
      <div className="banco-aulas-filtros-linha">
        <Select
          label="Filtros de Datas"
          value={filtro.datas}
          onChange={e => onDatasChange(e.target.value as FiltroDatas)}
          options={[{ value: 'hoje', label: 'Aulas de Hoje' }, { value: 'semana', label: 'Aulas para Semana' }]}
          placeholder="Todas as datas"
          style={{ flex: '1 1 200px' }}
        />
        <Select
          label="Filtro Professores"
          value={filtro.professor}
          onChange={e => onProfessorChange(e.target.value)}
          options={[
            { value: SEM_PROFESSOR, label: 'Sem professor' },
            ...nomesProfessoresUnicos(professores).map(nome => ({ value: nome, label: nome })),
          ]}
          placeholder="Todos os professores"
          style={{ flex: '1 1 200px' }}
        />
        <Select
          label="Filtro Aulas"
          value={filtro.aulas}
          onChange={e => onAulasChange(e.target.value as FiltroAulas)}
          options={[
            { value: 'todos', label: 'Todos' },
            { value: 'execucao', label: 'Em execução' },
            { value: 'completos', label: 'Completos' },
          ]}
          style={{ flex: '1 1 200px' }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          <Button variant="secondary" size="md" onClick={onAtualizar} loading={atualizando}>
            <FiRefreshCw size={14} /> Atualizar
          </Button>
          <Button variant="ghost" size="md" onClick={onLimpar}>
            <FiRotateCcw size={14} /> Limpar
          </Button>
          <Button variant="ghost" size="md" onClick={() => setMaisFiltrosAberto(o => !o)}>
            {maisFiltrosAberto ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />} Mais filtros
          </Button>
        </div>
      </div>

      {maisFiltrosAberto && (
        <div className="banco-aulas-filtros-linha banco-aulas-filtros-extras">
          <Select
            label="Filtro Pagamento"
            value={filtro.pagamento}
            onChange={e => onPagamentoChange(e.target.value)}
            options={STATUS_PAGAMENTO_OPTIONS.map(s => ({ value: s, label: s }))}
            placeholder="Todos"
            style={{ flex: '1 1 220px' }}
          />
          <Select
            label="Cliente"
            value={filtro.cliente}
            onChange={e => onClienteChange(e.target.value)}
            options={clientes.map(c => ({ value: c.cpf, label: c.nome || c.cpf }))}
            placeholder="Todos os clientes"
            style={{ flex: '1 1 220px' }}
          />
          <Input
            label="Código"
            placeholder="Código da contratação"
            value={filtro.codigo}
            onChange={e => onCodigoChange(e.target.value)}
            maxLength={10}
            style={{ flex: '1 1 200px' }}
          />
        </div>
      )}
    </GlassCard>
  )
}
