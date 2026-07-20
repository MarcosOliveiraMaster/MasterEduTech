import React, { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Modal } from '../../../../components/Modal'
import { Button } from '../../../../components/Button'
import { formatarDataInput, MESES } from '../../helpers'

interface DatePickerModalProps {
  title: string
  /** Formato "ddd - dd/mm/aaaa" (mesmo formato salvo no campo `data` da aula). */
  valorAtual?: string
  onClose: () => void
  onSave: (novaData: string) => Promise<void>
}

function parseDataAtual(valor?: string): Date {
  if (valor && valor.includes('-')) {
    const partes = valor.split('-')[1]?.trim().split('/')
    if (partes?.length === 3) {
      const [dia, mes, ano] = partes.map(Number)
      const d = new Date(ano, mes - 1, dia)
      if (!isNaN(d.getTime())) return d
    }
  }
  return new Date()
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({ title, valorAtual, onClose, onSave }) => {
  const dataInicial = parseDataAtual(valorAtual)
  const [mesExibido, setMesExibido] = useState(dataInicial.getMonth())
  const [anoExibido, setAnoExibido] = useState(dataInicial.getFullYear())
  const [salvando, setSalvando] = useState<string | null>(null)

  async function handleSelecionarDia(dia: number) {
    const data = new Date(anoExibido, mesExibido, dia)
    const formatada = formatarDataInput(data)
    setSalvando(formatada)
    try {
      await onSave(formatada)
      onClose()
    } finally {
      setSalvando(null)
    }
  }

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
  const diaSelecionadoAtual = dataInicial.getMonth() === mesExibido && dataInicial.getFullYear() === anoExibido ? dataInicial.getDate() : null

  return (
    <Modal title={title} onClose={onClose} size="sm" footer={<Button variant="secondary" onClick={onClose} disabled={!!salvando}>Cancelar</Button>}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={() => navegarMes(-1)} style={navBtnStyle}><FiChevronLeft size={14} /></button>
        <span style={{ fontSize: '13px', fontWeight: 700 }}>{MESES[mesExibido]} {anoExibido}</span>
        <button onClick={() => navegarMes(1)} style={navBtnStyle}><FiChevronRight size={14} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--c-text-3)' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {celulas.map((dia, i) => (
          dia === null ? <div key={i} /> : (
            <button
              key={i}
              onClick={() => handleSelecionarDia(dia)}
              disabled={!!salvando}
              style={{
                height: '32px', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: '12px', fontWeight: 600,
                cursor: salvando ? 'wait' : 'pointer',
                background: dia === diaSelecionadoAtual ? 'var(--gradient-btn-primary)' : 'var(--c-glass-bg-sm)',
                color: dia === diaSelecionadoAtual ? '#fff' : 'var(--c-text-1)',
              }}
            >
              {dia}
            </button>
          )
        ))}
      </div>
    </Modal>
  )
}

const navBtnStyle: React.CSSProperties = {
  background: 'var(--c-glass-bg-sm)', border: 'none', borderRadius: '6px',
  width: '28px', height: '28px', cursor: 'pointer', color: 'var(--c-text-2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
