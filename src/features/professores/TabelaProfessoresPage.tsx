import React, { useEffect, useMemo, useState } from 'react'
import { SkeletonPulse } from '../../components/SkeletonPulse'
import { FiltroProfessoresPainel } from './FiltroProfessoresPainel'
import { SeletorColunas } from './SeletorColunas'
import { useFiltroProfessores } from './useFiltroProfessores'
import { filtrarProfessores, linkWhatsapp } from './helpers'
import { fetchProfessores } from './queries'
import { CHAVES_COLUNAS_PADRAO, COLUNAS_DISPONIVEIS, type ColunaProfessor } from './columns'
import type { Professor } from './types'
import './professores.css'

function renderizarValor(professor: Professor, coluna: ColunaProfessor): React.ReactNode {
  const valor = professor[coluna.key]

  if (coluna.tipo === 'booleano') return valor ? 'Sim' : 'Não'

  if (coluna.tipo === 'whatsapp') {
    const texto = (valor as string) || ''
    const link = linkWhatsapp(texto)
    if (!link) return '--'
    return (
      <a href={link} target="_blank" rel="noreferrer" className="tabela-link-whatsapp" onClick={e => e.stopPropagation()}>
        {texto}
      </a>
    )
  }

  return (valor as string) || '--'
}

export const TabelaProfessoresPage: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const filtro = useFiltroProfessores()
  const [colunasVisiveis, setColunasVisiveis] = useState<Set<keyof Professor>>(new Set(CHAVES_COLUNAS_PADRAO))

  useEffect(() => {
    fetchProfessores().then(setProfessores).finally(() => setLoading(false))
  }, [])

  const resultado = useMemo(
    () => filtrarProfessores(professores, filtro),
    [professores, filtro.nome, filtro.disciplina, filtro.bairro, filtro.experiencia, filtro.turnosSelecionados],
  )

  function alternarColuna(chave: keyof Professor) {
    setColunasVisiveis(atual => {
      const novo = new Set(atual)
      if (novo.has(chave)) novo.delete(chave)
      else novo.add(chave)
      return novo
    })
  }

  const colunas = COLUNAS_DISPONIVEIS.filter(c => colunasVisiveis.has(c.key))

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
        <SeletorColunas colunasVisiveis={colunasVisiveis} onAlternar={alternarColuna} />
      </div>

      <div className="professores-tabela-wrap">
        {loading ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonPulse key={i} height="32px" />
            ))}
          </div>
        ) : resultado.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--c-text-3)' }}>
            Nenhum professor encontrado para estes filtros.
          </div>
        ) : (
          <div className="professores-tabela-scroll">
            <table className="professores-tabela">
              <thead>
                <tr>
                  <th className="coluna-congelada">Nome completo</th>
                  {colunas.map(c => (
                    <th key={String(c.key)}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultado.map(p => (
                  <tr key={p.id}>
                    <td className="coluna-congelada">{p.nome || 'Sem nome'}</td>
                    {colunas.map(c => (
                      <td key={String(c.key)}>{renderizarValor(p, c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
