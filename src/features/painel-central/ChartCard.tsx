import React, { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, type TooltipContentProps } from 'recharts'
import { FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi'
import { GlassCard } from '../../components/GlassCard'
import { fetchTodasAulas } from './queries'
import { calcularSemanaAtual, MESES } from './helpers'
import type { Aula, PeriodoGrafico } from './types'

interface ItemAula {
  cliente: string
  professor: string
  horario: string
}

interface PontoGrafico {
  label: string
  aulas: number
  itens: ItemAula[]
  data: Date
}

function primeiroNome(nome?: string): string {
  return (nome || '--').trim().split(/\s+/)[0] || '--'
}

function isMesmoDia(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function processarDados(aulas: Aula[], periodo: PeriodoGrafico, mes: number, semana: number): PontoGrafico[] {
  const hoje = new Date()
  const labels: string[] = []
  const dados: number[] = []
  const datasPontos: Date[] = []
  const itensPorIndice: ItemAula[][] = []

  function registrarItem(idx: number, aula: Aula) {
    if (!itensPorIndice[idx]) itensPorIndice[idx] = []
    itensPorIndice[idx].push({ cliente: primeiroNome(aula.nomeCliente), professor: primeiroNome(aula.professor), horario: aula.horario || '--' })
  }

  if (periodo === 'Mensal') {
    const ano = hoje.getFullYear()
    const diasNoMes = new Date(ano, mes + 1, 0).getDate()
    const contagem: Record<number, number> = {}
    for (let i = 1; i <= diasNoMes; i++) contagem[i] = 0

    aulas.forEach(aula => {
      if (aula.data?.includes('-')) {
        const partes = aula.data.split('-')[1].trim().split('/')
        if (partes.length === 3) {
          const d = parseInt(partes[0], 10)
          const m = parseInt(partes[1], 10) - 1
          const y = parseInt(partes[2], 10)
          if (m === mes && y === ano && contagem[d] !== undefined) {
            contagem[d]++
            registrarItem(d - 1, aula)
          }
        }
      }
    })

    for (let i = 1; i <= diasNoMes; i++) {
      labels.push(String(i))
      dados.push(contagem[i])
      datasPontos.push(new Date(ano, mes, i))
    }
  } else {
    const ano = hoje.getFullYear()
    const mesAtual = hoje.getMonth()
    const primeiroDiaDoMes = new Date(ano, mesAtual, 1)
    const primeiroDias = primeiroDiaDoMes.getDay()
    const primeiroDomingoDoMes = new Date(primeiroDiaDoMes)
    primeiroDomingoDoMes.setDate(1 - primeiroDias)
    primeiroDomingoDoMes.setHours(0, 0, 0, 0)

    const primeiroDiaSemana = new Date(primeiroDomingoDoMes)
    primeiroDiaSemana.setDate(primeiroDomingoDoMes.getDate() + semana * 7)
    primeiroDiaSemana.setHours(0, 0, 0, 0)

    const ultimoDiaSemana = new Date(primeiroDiaSemana)
    ultimoDiaSemana.setDate(primeiroDiaSemana.getDate() + 6)
    ultimoDiaSemana.setHours(23, 59, 59, 999)

    const diasNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const contagem: number[] = new Array(7).fill(0)

    for (let i = 0; i < 7; i++) {
      const data = new Date(primeiroDiaSemana)
      data.setDate(primeiroDiaSemana.getDate() + i)
      labels.push(`${diasNomes[data.getDay()]} (${String(data.getDate()).padStart(2, '0')})`)
      datasPontos.push(data)
    }

    aulas.forEach(aula => {
      if (aula.data?.includes('-')) {
        const partes = aula.data.split('-')[1].trim().split('/')
        const dia = parseInt(partes[0], 10)
        const mesAula = parseInt(partes[1], 10) - 1
        const anoAula = parseInt(partes[2], 10)
        const dataAula = new Date(anoAula, mesAula, dia)
        if (dataAula >= primeiroDiaSemana && dataAula <= ultimoDiaSemana) {
          const idx = Math.floor((dataAula.getTime() - primeiroDiaSemana.getTime()) / 86400000)
          if (idx >= 0 && idx < 7) {
            contagem[idx]++
            registrarItem(idx, aula)
          }
        }
      }
    })

    dados.push(...contagem)
  }

  return labels.map((label, i) => ({
    label,
    aulas: dados[i],
    itens: (itensPorIndice[i] || []).slice().sort((a, b) => a.horario.localeCompare(b.horario)),
    data: datasPontos[i],
  }))
}

/** Tooltip estilizado, adaptado ao tema ativo (claro/escuro/fim de tarde/clássico). */
function ChartTooltip({ active, payload, label }: TooltipContentProps): React.JSX.Element | null {
  if (!active || !payload?.length) return null
  const ponto = payload[0]?.payload as PontoGrafico | undefined
  const itens = ponto?.itens || []
  return (
    <div style={{
      background: 'var(--c-bg-secondary)', backdropFilter: 'blur(20px)',
      border: '1px solid var(--c-border-blue)', borderRadius: '10px',
      padding: '10px 14px', boxShadow: 'var(--c-shadow-md)', minWidth: '200px', maxWidth: '260px',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--c-text-blue)', marginBottom: '4px', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--c-text-1)', marginBottom: itens.length ? '8px' : 0 }}>
        {ponto?.aulas ?? 0} aula{(ponto?.aulas ?? 0) === 1 ? '' : 's'}
      </div>
      {itens.length > 0 && (
        <div style={{ maxHeight: '160px', overflowY: 'auto', borderTop: '1px solid var(--c-border)', paddingTop: '6px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '4px 8px', fontSize: '10px', fontWeight: 700, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '2px' }}>
            <span>Cliente</span><span>Professor</span><span>Hora</span>
          </div>
          {itens.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '4px 8px', fontSize: '11px', color: 'var(--c-text-2)', padding: '2px 0' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.cliente}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.professor}</span>
              <span style={{ fontWeight: 600, color: 'var(--c-text-1)' }}>{item.horario}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ChartCardProps {
  dataSelecionada: Date
}

export const ChartCard: React.FC<ChartCardProps> = ({ dataSelecionada }) => {
  const [periodo, setPeriodo] = useState<PeriodoGrafico>('Semanal')
  const [mes, setMes] = useState(dataSelecionada.getMonth())
  const [semana, setSemana] = useState(calcularSemanaAtual(dataSelecionada))
  const [aulas, setAulas] = useState<Aula[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodasAulas().then(setAulas).finally(() => setLoading(false))
  }, [])

  /** Ao escolher uma data no seletor do painel, o gráfico acompanha (mês e semana correspondentes). */
  useEffect(() => {
    setMes(dataSelecionada.getMonth())
    setSemana(calcularSemanaAtual(dataSelecionada))
  }, [dataSelecionada])

  const dados = useMemo(() => processarDados(aulas, periodo, mes, semana), [aulas, periodo, mes, semana])

  const pontoHoje = useMemo(() => dados.find(p => isMesmoDia(p.data, new Date())), [dados])

  /** Linhas verticais pontilhadas: um divisor por dia na semana, ou por domingo no mês (marca o início de cada semana). */
  const linhasDivisoras = useMemo(() => {
    const divisores = periodo === 'Semanal' ? dados : dados.filter(p => p.data.getDay() === 0)
    return divisores.filter(p => p !== pontoHoje)
  }, [dados, periodo, pontoHoje])

  function selecionarPeriodo(p: PeriodoGrafico) {
    setPeriodo(p)
    if (p === 'Semanal') setSemana(calcularSemanaAtual(dataSelecionada))
  }

  return (
    <GlassCard variant="default" style={{ position: 'relative', height: '270px' }}>
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
        {periodo === 'Mensal' ? (
          <>
            <button onClick={() => setMes(m => (m === 0 ? 11 : m - 1))} style={navBtnStyle}><FiChevronLeft size={12} /></button>
            <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '80px', textAlign: 'center', color: 'var(--c-text-1)' }}>{MESES[mes]}</span>
            <button onClick={() => setMes(m => (m === 11 ? 0 : m + 1))} style={navBtnStyle}><FiChevronRight size={12} /></button>
          </>
        ) : (
          <>
            <button onClick={() => setSemana(s => Math.max(0, s - 1))} style={navBtnStyle}><FiChevronLeft size={12} /></button>
            <button onClick={() => setSemana(s => Math.min(4, s + 1))} style={navBtnStyle}><FiChevronRight size={12} /></button>
          </>
        )}
      </div>

      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 1, display: 'flex', background: 'var(--c-glass-bg-sm)', borderRadius: '8px', padding: '3px' }}>
        <button onClick={() => selecionarPeriodo('Mensal')} style={toggleBtnStyle(periodo === 'Mensal')}>Mensal</button>
        <button onClick={() => selecionarPeriodo('Semanal')} style={toggleBtnStyle(periodo === 'Semanal')}>Semanal</button>
      </div>

      <div style={{ paddingTop: '48px', height: '100%' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--c-text-3)' }}>
            <FiLoader style={{ animation: 'spin 0.7s linear infinite' }} />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chart-aulas-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5291bb" />
                  <stop offset="100%" stopColor="#83e6c3" />
                </linearGradient>
                <filter id="chart-hoje-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--c-border-blue)" vertical={false} />
              {linhasDivisoras.map(p => (
                <ReferenceLine key={`div-${p.label}`} x={p.label} stroke="var(--c-border-blue)" strokeDasharray="4 4" strokeOpacity={0.7} />
              ))}
              {pontoHoje && (
                <ReferenceLine
                  x={pontoHoje.label}
                  stroke="#83e6c3"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  filter="url(#chart-hoje-glow)"
                />
              )}
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--c-text-3)' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--c-text-3)' }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={ChartTooltip} />
              <Line
                type="monotone" dataKey="aulas" name="Aulas"
                stroke="url(#chart-aulas-grad)" strokeWidth={3}
                dot={{ r: 3, fill: '#5291bb', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#83e6c3' }}
                animationDuration={600} animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  )
}

const navBtnStyle: React.CSSProperties = {
  background: 'var(--c-glass-bg-sm)', border: 'none', borderRadius: '6px',
  width: '26px', height: '26px', cursor: 'pointer', color: 'var(--c-text-2)', fontSize: '12px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const toggleBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '5px 12px', fontSize: '12px', fontWeight: 500, borderRadius: '6px', border: 'none',
  cursor: 'pointer', transition: 'all 150ms',
  background: active ? 'var(--c-bg-secondary)' : 'transparent',
  color: active ? 'var(--c-text-blue)' : 'var(--c-text-2)',
  boxShadow: active ? 'var(--c-shadow-sm)' : 'none',
})
