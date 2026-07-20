import React, { useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiClock } from 'react-icons/fi'
import { BsChatSquareText, BsChatSquareTextFill } from 'react-icons/bs'
import { FaGraduationCap, FaHandshake } from 'react-icons/fa6'
import { GlassCard } from '../../components/GlassCard'
import { SkeletonRow } from '../../components/SkeletonPulse'
import { getStatusColors, montarLembreteCliente, montarLembreteProfessor, copyToClipboard } from './helpers'
import { StatusModal } from './StatusModal'
import { RelatorioModal } from './RelatorioModal'
import { DetalhesModal } from './detalhes-contratacao/DetalhesModal'
import type { Aula } from './types'

interface AulasTableProps {
  data: Date
  aulas: Aula[]
  loading: boolean
  erro: boolean
  onNavegar: (delta: number) => void
  onRefetch: () => void
}

export const AulasTable: React.FC<AulasTableProps> = ({ data, aulas, loading, erro, onNavegar, onRefetch }) => {
  const [statusModal, setStatusModal] = useState<{ id: string; status: string } | null>(null)
  const [relatorioModal, setRelatorioModal] = useState<string | null>(null)
  const [detalhesModal, setDetalhesModal] = useState<string | null>(null)

  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const diaAtual = new Date(data); diaAtual.setHours(0, 0, 0, 0)
  const isHoje = diaAtual.getTime() === hoje.getTime()
  const diasNomes = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const labelData = `${diasNomes[diaAtual.getDay()]} ${String(diaAtual.getDate()).padStart(2, '0')}/${String(diaAtual.getMonth() + 1).padStart(2, '0')}`

  return (
    <GlassCard variant="default">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Consulta de Aulas do dia</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => onNavegar(-1)} style={navBtnStyle}><FiChevronLeft size={14} /></button>
          {!isHoje && <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '100px', textAlign: 'center' }}>{labelData}</span>}
          <button onClick={() => onNavegar(1)} style={navBtnStyle}><FiChevronRight size={14} /></button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--c-glass-bg-sm)', borderBottom: '1px solid var(--c-border)' }}>
              {['Cliente', 'Professor', 'Disciplina', 'Horário', 'Duração', 'Concluída', 'Status', 'Relatório', 'Lembretes'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--c-text-1)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: 0 }}>
                <SkeletonRow /><SkeletonRow /><SkeletonRow />
              </td></tr>
            ) : erro ? (
              <tr><td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: '#ef4444' }}>Erro ao carregar aulas. Tente novamente.</td></tr>
            ) : aulas.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--c-text-3)' }}>Nenhuma aula encontrada para esta data.</td></tr>
            ) : aulas.map(aula => {
              const colors = getStatusColors(aula.StatusAula)
              const temRelatorio = !!aula.RelatorioAula?.trim()
              const podeAbrirDetalhes = !!aula.codigoContratacao
              return (
                <tr
                  key={aula.id}
                  onClick={() => podeAbrirDetalhes && setDetalhesModal(aula.codigoContratacao!)}
                  title={podeAbrirDetalhes ? 'Ver detalhes da contratação' : undefined}
                  style={{ borderBottom: '1px solid var(--c-border)', cursor: podeAbrirDetalhes ? 'pointer' : 'default', transition: 'background 120ms' }}
                  onMouseEnter={e => { if (podeAbrirDetalhes) e.currentTarget.style.background = 'var(--c-glass-bg-sm)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--c-text-1)' }}>{aula.nomeCliente || '--'}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--c-text-2)' }}>{aula.professor || '--'}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--c-text-2)' }}>{aula.materia || '--'}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--c-text-1)' }}>{aula.horario || '--'}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--c-text-2)' }}>{aula.duracao || '--'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {aula.ConfirmacaoProfessorAula
                      ? <FiCheckCircle style={{ color: '#22c55e' }} title="Concluída" />
                      : <FiClock style={{ color: '#f59e0b' }} title="Pendente" />}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setStatusModal({ id: aula.id, status: aula.StatusAula || 'Pendente' }) }}
                      style={{
                        width: '100%', background: colors.bg, color: colors.text, border: 'none',
                        borderRadius: 'var(--radius-full)', padding: '6px 10px', fontSize: '11px', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.03em', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                      }}
                    >
                      {aula.StatusAula || 'Pendente'}
                    </button>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setRelatorioModal(aula.id) }}
                      title={temRelatorio ? 'Ver/Editar Relatório' : 'Adicionar Relatório'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: temRelatorio ? '#22c55e' : 'var(--c-text-4)', display: 'inline-flex' }}
                    >
                      {temRelatorio ? <BsChatSquareTextFill /> : <BsChatSquareText />}
                    </button>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={e => { e.stopPropagation(); copyToClipboard(montarLembreteProfessor(aula.professor, aula.data, aula.horario)) }}
                      title="Copiar lembrete para o professor"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-blue)', marginRight: '6px', display: 'inline-flex' }}
                    >
                      <FaGraduationCap />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); copyToClipboard(montarLembreteCliente(aula.nomeCliente, aula.data, aula.horario)) }}
                      title="Copiar lembrete para o cliente"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', display: 'inline-flex' }}
                    >
                      <FaHandshake />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {statusModal && (
        <StatusModal
          aulaId={statusModal.id}
          currentStatus={statusModal.status}
          onClose={() => setStatusModal(null)}
          onUpdated={onRefetch}
        />
      )}
      {relatorioModal && (
        <RelatorioModal aulaId={relatorioModal} onClose={() => setRelatorioModal(null)} onSaved={onRefetch} />
      )}
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
