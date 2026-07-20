import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { GlassCard } from '../../components/GlassCard'
import { ChartCard } from './ChartCard'
import { AulasTable } from './AulasTable'
import { PagamentoCards } from './PagamentoCards'
import { fetchAulasPorData } from './queries'
import { formatarDataInput, MESES } from './helpers'
import type { Aula } from './types'
import './painel-central.css'

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

interface StatTileProps {
  label: string
  value: number
  color: string
}

const StatTile: React.FC<StatTileProps> = ({ label, value, color }) => (
  <div className="stat-tile">
    <span className="stat-tile-label">{label}</span>
    <span className="stat-tile-value" style={{ color }}>{value}</span>
  </div>
)

const DIAS_SEMANA_INICIAIS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

interface CalendarioDropdownProps {
  dataSelecionada: Date
  onSelecionar: (data: Date) => void
}

/** Calendário em dropdown ancorado — mesma linguagem visual dos calendários em modal (grid 7 colunas, navegação por mês). */
const CalendarioDropdown: React.FC<CalendarioDropdownProps> = ({ dataSelecionada, onSelecionar }) => {
  const [mesExibido, setMesExibido] = useState(dataSelecionada.getMonth())
  const [anoExibido, setAnoExibido] = useState(dataSelecionada.getFullYear())

  function navegarMes(delta: number) {
    let novoMes = mesExibido + delta
    let novoAno = anoExibido
    if (novoMes < 0) { novoMes = 11; novoAno-- }
    else if (novoMes > 11) { novoMes = 0; novoAno++ }
    setMesExibido(novoMes)
    setAnoExibido(novoAno)
  }

  const primeiroDia = new Date(anoExibido, mesExibido, 1).getDay()
  const totalDias = new Date(anoExibido, mesExibido + 1, 0).getDate()
  const celulas: (number | null)[] = [...Array(primeiroDia).fill(null), ...Array.from({ length: totalDias }, (_, i) => i + 1)]
  const hoje = new Date()

  return (
    <div className="date-calendar-dropdown">
      <div className="date-calendar-header">
        <button type="button" onClick={() => navegarMes(-1)} className="date-calendar-nav"><FiChevronLeft size={14} /></button>
        <span className="date-calendar-title">{MESES[mesExibido]} {anoExibido}</span>
        <button type="button" onClick={() => navegarMes(1)} className="date-calendar-nav"><FiChevronRight size={14} /></button>
      </div>
      <div className="date-calendar-weekdays">
        {DIAS_SEMANA_INICIAIS.map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="date-calendar-grid">
        {celulas.map((dia, i) => {
          if (dia === null) return <span key={i} />
          const dataCel = new Date(anoExibido, mesExibido, dia)
          const selecionado = isSameDay(dataCel, dataSelecionada)
          const ehHoje = isSameDay(dataCel, hoje)
          return (
            <button
              key={i}
              type="button"
              className={`date-calendar-day${selecionado ? ' selected' : ''}${ehHoje && !selecionado ? ' today' : ''}`}
              onClick={() => onSelecionar(dataCel)}
            >
              {dia}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const PainelCentralPage: React.FC = () => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date())
  const [aulas, setAulas] = useState<Aula[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)
  const [calendarioAberto, setCalendarioAberto] = useState(false)
  const datePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) setCalendarioAberto(false)
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

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
    reposicoes: aulas.filter(a => (a.StatusAula || '').toLowerCase() === 'reposição').length,
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
      <GlassCard variant="default" style={{ position: 'relative', zIndex: 5 }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--c-text-1)', marginBottom: '10px' }}>
          Analisar aulas de:
        </label>
        <div className="painel-toolbar">
          <div className="date-controls">
            <div className="date-quick-picks">
              {[
                { label: 'Ontem', date: ontem },
                { label: 'Hoje', date: hoje },
                { label: 'Amanhã', date: amanha },
              ].map(opt => {
                const active = isSameDay(opt.date, dataSelecionada)
                return (
                  <button
                    key={opt.label}
                    className={`date-quick-btn${active ? ' active' : ''}`}
                    onClick={() => setDataSelecionada(new Date(opt.date))}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            <div className="date-picker-wrapper" ref={datePickerRef}>
              <button type="button" className="date-picker" onClick={() => setCalendarioAberto(o => !o)}>
                <FiCalendar size={15} className="date-picker-icon" />
                <span className="date-picker-text">
                  {String(dataSelecionada.getDate()).padStart(2, '0')}/{String(dataSelecionada.getMonth() + 1).padStart(2, '0')}/{dataSelecionada.getFullYear()}
                </span>
              </button>
              {calendarioAberto && (
                <CalendarioDropdown
                  dataSelecionada={dataSelecionada}
                  onSelecionar={data => { setDataSelecionada(data); setCalendarioAberto(false) }}
                />
              )}
            </div>
          </div>

          <div className="stats-row">
            <StatTile label="Total de aulas" value={stats.total} color="var(--c-text-blue)" />
            <div className="stats-divider" />
            <StatTile label="Concluídas" value={stats.concluidas} color="var(--c-badge-success-text)" />
            <StatTile label="Reagendadas" value={stats.reagendadas} color="var(--c-badge-blue-text)" />
            <StatTile label="Reposições" value={stats.reposicoes} color="var(--c-badge-mint-text)" />
            <div className="stats-divider" />
            <StatTile label="Sem relatório" value={stats.semRelatorio} color="var(--c-badge-warning-text)" />
          </div>
        </div>
      </GlassCard>

      <ChartCard dataSelecionada={dataSelecionada} />

      <AulasTable data={dataSelecionada} aulas={aulas} loading={loading} erro={erro} onNavegar={navegarDia} onRefetch={carregarAulas} />

      <PagamentoCards />
    </div>
  )
}
