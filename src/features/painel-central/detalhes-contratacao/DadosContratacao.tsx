import React, { useState } from 'react'
import { GlassCard } from '../../../components/GlassCard'
import { Button } from '../../../components/Button'
import { EditarValoresModal } from './EditarValoresModal'
import { calcularSomaValorAulas, calcularTotalMinutosAulas, formatarSomatorioDuracao } from '../helpers'
import type { Aula, Contrato } from '../types'

interface DadosContratacaoProps {
  contrato: Contrato
  aulas: Aula[]
  onValoresAtualizados: () => void
}

const formatterBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const Display: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', gap: '2px', padding: '10px 14px',
    background: 'var(--c-glass-bg-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--c-border)',
  }}>
    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</span>
    <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 800, color: color || 'var(--c-text-1)' }}>{value}</span>
  </div>
)

export const DadosContratacao: React.FC<DadosContratacaoProps> = ({ contrato, aulas, onValoresAtualizados }) => {
  const [editarValoresAberto, setEditarValoresAberto] = useState(false)

  const horaAulaProfessor = contrato.horaAulaProfessor || 0
  const lucroMaster = contrato.lucroMaster || 0
  const valorEquipe = calcularSomaValorAulas(aulas, horaAulaProfessor)
  const valorPacote = Number((valorEquipe + lucroMaster).toFixed(2))
  const totalHoras = formatarSomatorioDuracao(calcularTotalMinutosAulas(aulas))

  return (
    <GlassCard variant="default" style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: 700 }}>Dados da Contratação</h3>
        <Button variant="secondary" size="sm" onClick={() => setEditarValoresAberto(true)}>Editar valores</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        <Display label="Total de horas" value={totalHoras} />
        <Display label="Valor do Pacote" value={formatterBRL.format(valorPacote)} color="var(--c-badge-warning-text)" />
        <Display label="Valor para Equipe" value={formatterBRL.format(valorEquipe)} />
        <Display label="Lucro Master" value={formatterBRL.format(lucroMaster)} color="var(--c-badge-success-text)" />
        <Display label="Valor Hora/Aula" value={formatterBRL.format(horaAulaProfessor)} />
      </div>

      {editarValoresAberto && (
        <EditarValoresModal
          contrato={contrato}
          aulas={aulas}
          onClose={() => setEditarValoresAberto(false)}
          onSaved={onValoresAtualizados}
        />
      )}
    </GlassCard>
  )
}
