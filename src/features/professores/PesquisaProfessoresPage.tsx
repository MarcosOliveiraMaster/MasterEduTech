import React, { useEffect, useMemo, useState } from 'react'
import { FiUser } from 'react-icons/fi'
import { SkeletonPulse } from '../../components/SkeletonPulse'
import { FiltroProfessoresPainel } from './FiltroProfessoresPainel'
import { useFiltroProfessores } from './useFiltroProfessores'
import { GlassCard } from '../../components/GlassCard'
import { filtrarProfessores } from './helpers'
import { fetchProfessores } from './queries'
import type { Professor } from './types'
import './professores.css'

export const PesquisaProfessoresPage: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const filtro = useFiltroProfessores()

  useEffect(() => {
    fetchProfessores().then(setProfessores).finally(() => setLoading(false))
  }, [])

  const resultado = useMemo(
    () => filtrarProfessores(professores, filtro),
    [professores, filtro.nome, filtro.disciplina, filtro.bairro, filtro.experiencia, filtro.turnosSelecionados],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
      <FiltroProfessoresPainel
        nome={filtro.nome} onNomeChange={filtro.setNome}
        disciplina={filtro.disciplina} onDisciplinaChange={filtro.setDisciplina}
        bairro={filtro.bairro} onBairroChange={filtro.setBairro}
        experiencia={filtro.experiencia} onExperienciaChange={filtro.setExperiencia}
        turnosSelecionados={filtro.turnosSelecionados} onAlternarTurno={filtro.alternarTurno}
      />

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
