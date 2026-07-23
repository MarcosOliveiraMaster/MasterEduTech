import React from 'react'
import { FiCheck } from 'react-icons/fi'
import { GlassCard } from '../../components/GlassCard'
import { Input, Select } from '../../components/Input'
import {
  DIAS_DISPONIBILIDADE, DISCIPLINAS_PROFESSOR, EXPERIENCIA_OPTIONS, TURNOS_DISPONIBILIDADE,
  campoDisponibilidade,
  type DiaDisponibilidade, type ExperienciaKey, type TurnoDisponibilidade,
} from './types'

interface FiltroProfessoresPainelProps {
  nome: string
  onNomeChange: (valor: string) => void
  disciplina: string
  onDisciplinaChange: (valor: string) => void
  bairro: string
  onBairroChange: (valor: string) => void
  experiencia: ExperienciaKey | ''
  onExperienciaChange: (valor: ExperienciaKey | '') => void
  turnosSelecionados: Set<string>
  onAlternarTurno: (dia: DiaDisponibilidade, turno: TurnoDisponibilidade) => void
}

/** Painel de filtros (nome, disciplina, bairro, experiência, disponibilidade) — reutilizado por Pesquisa e Tabela de professores. */
export const FiltroProfessoresPainel: React.FC<FiltroProfessoresPainelProps> = ({
  nome, onNomeChange, disciplina, onDisciplinaChange, bairro, onBairroChange,
  experiencia, onExperienciaChange, turnosSelecionados, onAlternarTurno,
}) => {
  return (
    <GlassCard variant="default">
      <div className="pesquisa-painel">
        <div className="pesquisa-terco">
          <Input label="Nome do professor" placeholder="Buscar por nome..." value={nome} onChange={e => onNomeChange(e.target.value)} />
          <Select
            label="Disciplina"
            value={disciplina}
            onChange={e => onDisciplinaChange(e.target.value)}
            placeholder="Todas as disciplinas"
            options={DISCIPLINAS_PROFESSOR.map(d => ({ value: d, label: d }))}
          />
        </div>

        <div className="pesquisa-divider" />

        <div className="pesquisa-terco">
          <Input label="Busca por bairro" placeholder="Ex: Jatiúca, Centro..." value={bairro} onChange={e => onBairroChange(e.target.value)} />
          <Select
            label="Experiência com"
            value={experiencia}
            onChange={e => onExperienciaChange(e.target.value as ExperienciaKey | '')}
            placeholder="Qualquer experiência"
            options={EXPERIENCIA_OPTIONS.map(o => ({ value: o.key, label: o.label }))}
          />
        </div>

        <div className="pesquisa-divider" />

        <div className="pesquisa-terco">
          <span className="disponibilidade-titulo">Disponibilidade</span>
          <div className="disponibilidade-grid">
            <div />
            {DIAS_DISPONIBILIDADE.map(d => (
              <div key={d.key} className="disponibilidade-header">{d.label.slice(0, 3)}</div>
            ))}
            {TURNOS_DISPONIBILIDADE.map(turno => (
              <React.Fragment key={turno}>
                <div className="disponibilidade-rotulo">{turno === 'Manha' ? 'Manhã' : 'Tarde'}</div>
                {DIAS_DISPONIBILIDADE.map(d => {
                  const campo = campoDisponibilidade(d.key, turno) as string
                  const selecionado = turnosSelecionados.has(campo)
                  return (
                    <button
                      key={campo}
                      type="button"
                      className={`disponibilidade-cell${selecionado ? ' selected' : ''}`}
                      title={`${d.label} - ${turno === 'Manha' ? 'Manhã' : 'Tarde'}`}
                      onClick={() => onAlternarTurno(d.key, turno)}
                    >
                      {selecionado && <FiCheck size={16} />}
                    </button>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
