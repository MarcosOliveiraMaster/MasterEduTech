import React, { useEffect, useMemo, useState } from 'react'
import { GlassCard } from '../../components/GlassCard'
import { ChartCard } from './ChartCard'
import { AulasTable } from './AulasTable'
import { PagamentoCards } from './PagamentoCards'
import { fetchAulasPorData } from './queries'
import { formatarDataInput } from './helpers'
import type { Aula } from './types'

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

interface StatTileProps {
  label: string
  value: number
  color: string
}

const StatTile: React.FC<StatTileProps> = ({ label, value, color }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '120px',
    padding: '10px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--c-glass-bg-sm)', border: '1px solid var(--c-border)',
  }}>
    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--c-text-2)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</span>
    <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, fontFamily: 'var(--font-heading)', color }}>{value}</span>
  </div>
)

export const PainelCentralPage: React.FC = () => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date())
  const [aulas, setAulas] = useState<Aula[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)

  const hoje = new Date()
  const ontem = new Date(); ontem.setDate(hoje.getDate() - 1)
  const amanha = new Date(); amanha.setDate(hoje.getDate() + 1)

  const dataFiltro = formatarDataInput(dataSelecionada)

  function carregarAulas() {
    setLoading(true)
    setErro(false)
    fetchAulasPorData(dataFiltro)
      .then(setAulas)
      .catch(() => setErro(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    carregarAulas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFiltro])

  const stats = useMemo(() => ({
    total: aulas.length,
    reagendadas: aulas.filter(a => (a.StatusAula || '').toLowerCase() === 'reagendada').length,
    concluidas: aulas.filter(a => (a.StatusAula || '').toLowerCase() === 'concluída').length,
    semRelatorio: aulas.filter(a => !a.RelatorioAula?.trim()).length,
  }), [aulas])

  function navegarDia(delta: number) {
    setDataSelecionada(d => {
      const novo = new Date(d)
      novo.setDate(novo.getDate() + delta)
      return novo
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <GlassCard variant="default">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--c-text-1)', marginBottom: '8px' }}>
              Analisar aulas de:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[
                { label: 'Ontem', date: ontem },
                { label: 'Hoje', date: hoje },
                { label: 'Amanhã', date: amanha },
              ].map(opt => {
                const active = isSameDay(opt.date, dataSelecionada)
                return (
                  <button
                    key={opt.label}
                    onClick={() => setDataSelecionada(new Date(opt.date))}
                    style={{
                      padding: '8px 16px', fontSize: '13px', borderRadius: '8px', cursor: 'pointer',
                      border: active ? 'none' : '1px solid var(--c-border-lg)',
                      background: active ? 'var(--gradient-btn-primary)' : 'transparent',
                      color: active ? '#fff' : 'var(--c-text-1)',
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
              <input
                type="date"
                value={dataSelecionada.toISOString().slice(0, 10)}
                onChange={e => {
                  if (e.target.value) setDataSelecionada(new Date(e.target.value + 'T00:00:00'))
                }}
                style={{
                  padding: '8px 12px', fontSize: '13px', borderRadius: '8px',
                  border: '1px solid var(--c-border-lg)', background: 'transparent', color: 'var(--c-text-1)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '16px', flex: 1 }}>
            <StatTile label="Total de aulas" value={stats.total} color="var(--c-text-blue)" />
            <StatTile label="Reagendadas" value={stats.reagendadas} color="var(--c-badge-blue-text)" />
            <StatTile label="Concluídas" value={stats.concluidas} color="var(--c-badge-success-text)" />
            <StatTile label="Sem relatório" value={stats.semRelatorio} color="var(--c-badge-warning-text)" />
          </div>
        </div>
      </GlassCard>

      <ChartCard />

      <AulasTable data={dataSelecionada} aulas={aulas} loading={loading} erro={erro} onNavegar={navegarDia} onRefetch={carregarAulas} />

      <PagamentoCards />
    </div>
  )
}
