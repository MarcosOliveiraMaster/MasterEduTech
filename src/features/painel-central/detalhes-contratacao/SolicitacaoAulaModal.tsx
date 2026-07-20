import React, { useState } from 'react'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { Checkbox } from '../../../components/Input'
import { SolicitacaoAulaPreview } from './SolicitacaoAulaPreview'
import type { Aula, Contrato } from '../types'

export type ColunaKey = 'data' | 'horario' | 'duracao' | 'materia' | 'professor' | 'estudante' | 'status' | 'valorAula'

const TODAS_COLUNAS: { key: ColunaKey; label: string }[] = [
  { key: 'data', label: 'Data' },
  { key: 'horario', label: 'Horário' },
  { key: 'duracao', label: 'Duração' },
  { key: 'materia', label: 'Matéria' },
  { key: 'professor', label: 'Professor' },
  { key: 'estudante', label: 'Estudante' },
  { key: 'status', label: 'Status' },
  { key: 'valorAula', label: 'Valor' },
]

interface SolicitacaoAulaModalProps {
  contrato: Contrato
  aulas: Aula[]
  onClose: () => void
}

/** Etapa 1 (seleção de aulas/colunas) + delega para a etapa 2 (SolicitacaoAulaPreview). 100% client-side, não grava no Firestore. */
export const SolicitacaoAulaModal: React.FC<SolicitacaoAulaModalProps> = ({ contrato, aulas, onClose }) => {
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set(aulas.map(a => a.id)))
  const [colunas, setColunas] = useState<Set<ColunaKey>>(new Set(TODAS_COLUNAS.map(c => c.key)))
  const [mostrarPreview, setMostrarPreview] = useState(false)

  function toggleAula(id: string) {
    setSelecionadas(prev => {
      const novo = new Set(prev)
      if (novo.has(id)) novo.delete(id)
      else novo.add(id)
      return novo
    })
  }

  function toggleColuna(key: ColunaKey) {
    setColunas(prev => {
      const novo = new Set(prev)
      if (novo.has(key)) novo.delete(key)
      else novo.add(key)
      return novo
    })
  }

  if (mostrarPreview) {
    return (
      <SolicitacaoAulaPreview
        contrato={contrato}
        aulas={aulas.filter(a => selecionadas.has(a.id))}
        colunasVisiveis={colunas}
        onClose={onClose}
        onVoltar={() => setMostrarPreview(false)}
      />
    )
  }

  return (
    <Modal
      title="Gerar Solicitação de Aula"
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={() => setMostrarPreview(true)} disabled={selecionadas.size === 0 || colunas.size === 0}>
            Gerar Solicitação
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: 'var(--c-text-2)' }}>Aulas a incluir</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '35vh', overflowY: 'auto' }}>
            {aulas.map(a => (
              <div key={a.id} style={{ padding: '8px 12px', background: 'var(--c-glass-bg-sm)', borderRadius: 'var(--radius-sm)' }}>
                <Checkbox
                  checked={selecionadas.has(a.id)}
                  onChange={() => toggleAula(a.id)}
                  label={`${a.data || '--'} · ${a.horario || '--'} · ${a.materia || '--'} · ${a.professor || '--'}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: 'var(--c-text-2)' }}>Colunas visíveis</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
            {TODAS_COLUNAS.map(c => (
              <Checkbox key={c.key} checked={colunas.has(c.key)} onChange={() => toggleColuna(c.key)} label={c.label} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
