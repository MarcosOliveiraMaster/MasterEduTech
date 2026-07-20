import React, { useEffect, useMemo, useState } from 'react'
import { FiCheck, FiUser } from 'react-icons/fi'
import { GlassCard } from '../../components/GlassCard'
import { Input, Select } from '../../components/Input'
import { SkeletonPulse } from '../../components/SkeletonPulse'
import { filtrarProfessores } from './helpers'
import { fetchProfessores } from './queries'
import {
  DIAS_DISPONIBILIDADE, DISCIPLINAS_PROFESSOR, EXPERIENCIA_OPTIONS, TURNOS_DISPONIBILIDADE,
  campoDisponibilidade,
  type DiaDisponibilidade, type ExperienciaKey, type Professor, type TurnoDisponibilidade,
} from './types'
import './professores.css'

function toggleNoSet<T>(set: Set<T>, valor: T): Set<T> {
  const novo = new Set(set)
  if (novo.has(valor)) novo.delete(valor)
  else novo.add(valor)
  return novo
}

export const PesquisaProfessoresPage: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)

  const [nome, setNome] = useState('')
  const [disciplina, setDisciplina] = useState('')
  const [bairro, setBairro] = useState('')
  const [experiencia, setExperiencia] = useState<ExperienciaKey | ''>('')
  const [turnosSelecionados, setTurnosSelecionados] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchProfessores().then(setProfessores).finally(() => setLoading(false))
  }, [])

  function alternarTurno(dia: DiaDisponibilidade, turno: TurnoDisponibilidade) {
    setTurnosSelecionados(atual => toggleNoSet(atual, campoDisponibilidade(dia, turno) as string))
  }

  const resultado = useMemo(
    () => filtrarProfessores(professores, { nome, disciplina, bairro, experiencia, turnosSelecionados }),
    [professores, nome, disciplina, bairro, experiencia, turnosSelecionados],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
      <GlassCard variant="default">
        <div className="pesquisa-painel">
          <div className="pesquisa-terco">
            <Input label="Nome do professor" placeholder="Buscar por nome..." value={nome} onChange={e => setNome(e.target.value)} />
            <Select
              label="Disciplina"
              value={disciplina}
              onChange={e => setDisciplina(e.target.value)}
              placeholder="Todas as disciplinas"
              options={DISCIPLINAS_PROFESSOR.map(d => ({ value: d, label: d }))}
            />
          </div>

          <div className="pesquisa-divider" />

          <div className="pesquisa-terco">
            <Input label="Busca por bairro" placeholder="Ex: Jatiúca, Centro..." value={bairro} onChange={e => setBairro(e.target.value)} />
            <Select
              label="Experiência com"
              value={experiencia}
              onChange={e => setExperiencia(e.target.value as ExperienciaKey | '')}
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
                        onClick={() => alternarTurno(d.key, turno)}
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

      <div className="professores-resultado-header professores-grid-wrap">
        <span className="professores-resultado-contagem">
          {loading ? 'Carregando...' : `${resultado.length} professor${resultado.length === 1 ? '' : 'es'} encontrado${resultado.length === 1 ? '' : 's'}`}
        </span>
      </div>

      {loading ? (
        <div className="professores-grid-wrap">
          <div className="professores-grid">
            {Array.from({ length: 5 }, (_, i) => (
              <SkeletonPulse key={i} height="200px" style={{ borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        </div>
      ) : resultado.length === 0 ? (
        <GlassCard variant="default">
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--c-text-3)' }}>
            Nenhum professor encontrado para estes filtros.
          </div>
        </GlassCard>
      ) : (
        <div className="professores-grid-wrap">
          <div className="professores-grid">
            {resultado.map(p => (
              <div key={p.id} className="professor-card">
                <div className="professor-card-foto">
                  <FiUser size={40} />
                </div>
                <div className="professor-card-nome">{p.nome || 'Sem nome'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
