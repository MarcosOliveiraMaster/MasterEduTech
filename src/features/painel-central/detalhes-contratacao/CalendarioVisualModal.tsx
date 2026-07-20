import React, { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Modal } from '../../../components/Modal'
import { getStatusColors, MESES } from '../helpers'
import type { Aula } from '../types'

interface CalendarioVisualModalProps {
  aulas: Aula[]
  onClose: () => void
}

function parseDataAula(data?: string): Date | null {
  if (!data || !data.includes('-')) return null
  const partes = data.split('-')[1]?.trim().split('/')
  if (partes?.length !== 3) return null
  const [dia, mes, ano] = partes.map(Number)
  const d = new Date(ano, mes - 1, dia)
  return isNaN(d.getTime()) ? null : d
}

/** Grade mensal somente leitura — sem drag-and-drop (decisão de escopo validada com o usuário). */
export const CalendarioVisualModal: React.FC<CalendarioVisualModalProps> = ({ aulas, onClose }) => {
  const datasAulas = aulas.map(a => ({ aula: a, data: parseDataAula(a.data) })).filter(x => x.data)
  const primeiraData = datasAulas.length > 0 ? datasAulas[0].data! : new Date()

  const [mesExibido, setMesExibido] = useState(primeiraData.getMonth())
  const [anoExibido, setAnoExibido] = useState(primeiraData.getFullYear())

  function navegarMes(delta: number) {
    let novoMes = mesExibido + delta
    let novoAno = anoExibido
    if (novoMes < 0) { novoMes = 11; novoAno-- }
    else if (novoMes > 11) { novoMes = 0; novoAno++ }
    setMesExibido(novoMes)
    setAnoExibido(novoAno)
  }

  const aulasPorDia = new Map<number, Aula[]>()
  datasAulas.forEach(({ aula, data }) => {
    if (data!.getMonth() === mesExibido && data!.getFullYear() === anoExibido) {
      const dia = data!.getDate()
      if (!aulasPorDia.has(dia)) aulasPorDia.set(dia, [])
      aulasPorDia.get(dia)!.push(aula)
    }
  })

  const primeiroDia = new Date(anoExibido, mesExibido, 1).getDay()
  const totalDias = new Date(anoExibido, mesExibido + 1, 0).getDate()
  const celulas: (number | null)[] = [...Array(primeiroDia).fill(null), ...Array.from({ length: totalDias }, (_, i) => i + 1)]

  return (
    <Modal title="Visualização em Calendário" onClose={onClose} size="lg">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <button onClick={() => navegarMes(-1)} style={navBtnStyle}><FiChevronLeft size={14} /></button>
        <span style={{ fontSize: '14px', fontWeight: 700 }}>{MESES[mesExibido]} {anoExibido}</span>
        <button onClick={() => navegarMes(1)} style={navBtnStyle}><FiChevronRight size={14} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '6px' }}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--c-text-3)' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {celulas.map((dia, i) => {
          const aulasDoDia = dia ? aulasPorDia.get(dia) || [] : []
          return (
            <div key={i} style={{
              minHeight: '80px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--c-border)',
              padding: '6px', display: 'flex', flexDirection: 'column', gap: '3px',
              background: dia ? 'var(--c-glass-bg-sm)' : 'transparent',
            }}>
              {dia && <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-text-3)' }}>{dia}</span>}
              {aulasDoDia.map(a => {
                const colors = getStatusColors(a.StatusAula)
                return (
                  <div key={a.id} title={`${a.horario || ''} ${a.professor || ''}`} style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 5px', borderRadius: '4px',
                    background: colors.bg, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {a.horario} {a.professor || 'A definir'}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

const navBtnStyle: React.CSSProperties = {
  background: 'var(--c-glass-bg-sm)', border: 'none', borderRadius: '6px',
  width: '28px', height: '28px', cursor: 'pointer', color: 'var(--c-text-2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
