import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiSearch } from 'react-icons/fi'
import { GlassCard } from '../../components/GlassCard'
import { SkeletonRow } from '../../components/SkeletonPulse'
import { DetalhesModal } from './detalhes-contratacao/DetalhesModal'
import { fetchTodosContratos } from './queries'
import { formatarDataContrato, getCorStatusPagamento, limparDadosInvalidos, MESES, timestampToDate } from './helpers'
import type { Contrato } from './types'

type Coluna = 'contrato' | 'pagamento'
type OrdenarPor = 'parcela1' | 'parcela2' | 'numero'

const SECOES: { key: Coluna; label: string; accent: string }[] = [
  { key: 'contrato', label: 'Contrato pendente', accent: 'var(--c-badge-blue-text)' },
  { key: 'pagamento', label: 'Pagamento pendente', accent: 'var(--c-badge-warning-text)' },
]

const METODOS: { key: string; label: string }[] = [
  { key: 'todos', label: 'Todos os métodos' },
  { key: 'cartão de crédito', label: 'Cartão de crédito' },
  { key: 'pix completo', label: 'Pix completo' },
  { key: 'pix dividido', label: 'Pix dividido' },
]

const ORDENACOES: { key: OrdenarPor; label: string }[] = [
  { key: 'parcela1', label: '1ª Parcela' },
  { key: 'parcela2', label: '2ª Parcela' },
  { key: 'numero', label: 'Número da contratação' },
]

/** Contrato sem assinatura é o bloqueio mais urgente, por isso tem prioridade sobre pagamento pendente. */
function classificar(c: Contrato): Coluna | null {
  const contratoPendente = (c.statusContrato || '').toLowerCase().includes('pendente de assinatura')
  if (contratoPendente) return 'contrato'
  const s = (c.statusPagamento || '').toLowerCase()
  if (s.includes('aguardando 1º pagamento') || s.includes('aguardando 2º pagamento')) return 'pagamento'
  return null
}

function ordenarContratos(lista: Contrato[], campo: OrdenarPor): Contrato[] {
  const arr = [...lista]
  arr.sort((a, b) => {
    if (campo === 'numero') return a.id.localeCompare(b.id)
    const chave = campo === 'parcela1' ? 'dataPrimeiraParcela' : 'dataSegundaParcela'
    const da = timestampToDate(a[chave])
    const db = timestampToDate(b[chave])
    return (da ? da.getTime() : Infinity) - (db ? db.getTime() : Infinity)
  })
  return arr
}

export const PagamentoCards: React.FC = () => {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [loading, setLoading] = useState(true)
  const [mes, setMes] = useState(new Date().getMonth())
  const [metodo, setMetodo] = useState('todos')
  const [busca, setBusca] = useState('')
  const [ordenarPor, setOrdenarPor] = useState<OrdenarPor>('parcela1')
  const [situacaoAtiva, setSituacaoAtiva] = useState<Record<Coluna, boolean>>({ contrato: true, pagamento: true })
  const [situacaoAberta, setSituacaoAberta] = useState(false)
  const [detalhesModal, setDetalhesModal] = useState<string | null>(null)
  const situacaoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTodosContratos().then(setContratos).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (situacaoRef.current && !situacaoRef.current.contains(e.target as Node)) setSituacaoAberta(false)
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  const doMes = useMemo(() => contratos.filter(c => {
    const data = timestampToDate(c.timestamp)
    return !!data && data.getMonth() === mes && data.getFullYear() === new Date().getFullYear()
  }), [contratos, mes])

  /** Contadores fixos por categoria no mês — não mudam com o filtro de situação/método/busca. */
  const contadores = useMemo(() => {
    const r: Record<Coluna, number> = { contrato: 0, pagamento: 0 }
    doMes.forEach(c => { const col = classificar(c); if (col) r[col]++ })
    return r
  }, [doMes])

  const linhas = useMemo(() => {
    const buscaLower = busca.trim().toLowerCase()
    const filtradas = doMes.filter(c => {
      const col = classificar(c)
      if (!col || !situacaoAtiva[col]) return false
      if (metodo !== 'todos' && (c.modoPagamento || '').toLowerCase().trim() !== metodo) return false
      if (buscaLower && !(c.nome || c.nomeCliente || '').toLowerCase().includes(buscaLower)) return false
      return true
    })
    return ordenarContratos(filtradas, ordenarPor).map(c => ({ contrato: c, categoria: classificar(c)! }))
  }, [doMes, situacaoAtiva, metodo, busca, ordenarPor])

  const qtdSituacaoAtiva = Number(situacaoAtiva.contrato) + Number(situacaoAtiva.pagamento)
  const situacaoLabel = qtdSituacaoAtiva === 2 ? 'Todos' : qtdSituacaoAtiva === 0 ? 'Nenhum' : SECOES.find(s => situacaoAtiva[s.key])?.label

  return (
    <GlassCard variant="default">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Informações de pagamento</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => setMes(m => (m === 0 ? 11 : m - 1))} style={navBtnStyle}><FiChevronLeft size={12} /></button>
          <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '80px', textAlign: 'center' }}>{MESES[mes]}</span>
          <button onClick={() => setMes(m => (m === 11 ? 0 : m + 1))} style={navBtnStyle}><FiChevronRight size={12} /></button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
          <FiSearch size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)' }} />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar cliente..."
            style={{
              width: '100%', padding: '8px 12px 8px 30px', fontSize: '12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--c-border-lg)', background: 'transparent', color: 'var(--c-text-1)', boxSizing: 'border-box',
            }}
          />
        </div>

        <div ref={situacaoRef} style={{ position: 'relative' }}>
          <button onClick={() => setSituacaoAberta(o => !o)} style={dropdownBtnStyle}>
            Situação: {situacaoLabel} <FiChevronDown size={12} />
          </button>
          {situacaoAberta && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 20, minWidth: '240px',
              background: 'var(--c-bg-secondary)', border: '1px solid var(--c-border)', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--c-shadow-md)', padding: '6px',
            }}>
              {SECOES.map(sec => (
                <label key={sec.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={situacaoAtiva[sec.key]}
                      onChange={() => setSituacaoAtiva(s => ({ ...s, [sec.key]: !s[sec.key] }))}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: sec.accent }}>{sec.label}</span>
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: sec.accent, background: 'var(--c-glass-bg-sm)',
                    borderRadius: 'var(--radius-full)', padding: '1px 8px', minWidth: '18px', textAlign: 'center',
                  }}>{contadores[sec.key]}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <select value={metodo} onChange={e => setMetodo(e.target.value)} style={selectStyle}>
          {METODOS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>

        <select value={ordenarPor} onChange={e => setOrdenarPor(e.target.value as OrdenarPor)} style={selectStyle}>
          {ORDENACOES.map(o => <option key={o.key} value={o.key}>Ordenar por: {o.label}</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--c-glass-bg-sm)', borderBottom: '1px solid var(--c-border)' }}>
              {['Cliente', 'Situação', 'Nº Contratação', 'Data', 'Pagamento', 'Contrato', 'Método', '1ª Parcela', '2ª Parcela'].map(h => (
                <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--c-text-1)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: 0 }}><SkeletonRow /><SkeletonRow /></td></tr>
            ) : linhas.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: '24px', textAlign: 'center', color: 'var(--c-text-3)' }}>Nenhum contrato encontrado para estes filtros</td></tr>
            ) : linhas.map(({ contrato: c, categoria }) => {
              const sec = SECOES.find(s => s.key === categoria)!
              const nome = c.nome || c.nomeCliente || 'Cliente não identificado'
              const corPagamento = getCorStatusPagamento(c.statusPagamento)
              const corContrato = getCorStatusPagamento(c.statusContrato)
              return (
                <tr
                  key={c.id}
                  onClick={() => setDetalhesModal(c.id)}
                  title="Ver detalhes da contratação"
                  style={{ borderLeft: `3px solid ${sec.accent}`, borderBottom: '1px solid var(--c-border)', cursor: 'pointer', transition: 'background 120ms' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-glass-bg-sm)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '9px 12px', fontWeight: 500, color: 'var(--c-text-1)', whiteSpace: 'nowrap' }}>{nome}</td>
                  <td style={{ padding: '9px 12px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', color: sec.accent }}>{sec.label}</span>
                  </td>
                  <td style={{ padding: '9px 12px', color: 'var(--c-text-3)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.id}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--c-text-2)', whiteSpace: 'nowrap' }}>{formatarDataContrato(c.timestamp)}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{
                      display: 'inline-block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em',
                      padding: '3px 8px', borderRadius: 'var(--radius-full)', background: corPagamento.bg, color: corPagamento.text, whiteSpace: 'nowrap',
                    }}>
                      {c.statusPagamento || 'Não informado'}
                    </span>
                  </td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{
                      display: 'inline-block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em',
                      padding: '3px 8px', borderRadius: 'var(--radius-full)', background: corContrato.bg, color: corContrato.text, whiteSpace: 'nowrap',
                    }}>
                      {c.statusContrato || 'Não informado'}
                    </span>
                  </td>
                  <td style={{ padding: '9px 12px', color: 'var(--c-text-2)', whiteSpace: 'nowrap' }}>{c.modoPagamento || '--'}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--c-text-2)', whiteSpace: 'nowrap' }}>
                    {limparDadosInvalidos(typeof c.dataPrimeiraParcela === 'string' ? c.dataPrimeiraParcela : undefined)}
                  </td>
                  <td style={{ padding: '9px 12px', color: 'var(--c-text-2)', whiteSpace: 'nowrap' }}>
                    {limparDadosInvalidos(typeof c.dataSegundaParcela === 'string' ? c.dataSegundaParcela : undefined)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {detalhesModal && (
        <DetalhesModal codigoContratacao={detalhesModal} onClose={() => setDetalhesModal(null)} />
      )}
    </GlassCard>
  )
}

const navBtnStyle: React.CSSProperties = {
  background: 'var(--c-glass-bg-sm)', border: 'none', borderRadius: '6px',
  width: '28px', height: '28px', cursor: 'pointer', color: 'var(--c-text-2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const dropdownBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: 500,
  borderRadius: 'var(--radius-sm)', border: '1px solid var(--c-border-lg)', background: 'transparent',
  color: 'var(--c-text-1)', cursor: 'pointer', whiteSpace: 'nowrap',
}

const selectStyle: React.CSSProperties = {
  padding: '8px 12px', fontSize: '12px', borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--c-border-lg)', background: 'transparent', color: 'var(--c-text-1)', cursor: 'pointer',
}
