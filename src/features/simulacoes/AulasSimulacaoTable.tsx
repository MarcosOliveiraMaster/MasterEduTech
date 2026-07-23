import React, { useState } from 'react'
import { FiCalendar, FiCopy, FiPlus, FiTrash2 } from 'react-icons/fi'
import { GlassCard } from '../../components/GlassCard'
import { Button } from '../../components/Button'
import { DatePickerModal } from '../painel-central/detalhes-contratacao/cell-editors/DatePickerModal'
import { FixedOptionsModal } from '../painel-central/detalhes-contratacao/cell-editors/FixedOptionsModal'
import { SearchableSelectModal } from '../painel-central/detalhes-contratacao/cell-editors/SearchableSelectModal'
import { SimpleInputModal } from '../painel-central/detalhes-contratacao/cell-editors/SimpleInputModal'
import { CalendarioVisualModal } from '../painel-central/detalhes-contratacao/CalendarioVisualModal'
import { formatarDataInput, formatarMateriasMultiplas } from '../painel-central/helpers'
import { DURACAO_OPTIONS, MATERIA_A_DEFINIR, MATERIA_OPTIONS, MAX_MATERIAS_SELECIONADAS } from '../painel-central/types'
import type { Aula, Cliente, Professor } from '../painel-central/types'
import { calcularValorAulaSimulacao } from './helpers'
import type { AulaSimulacao } from './types'

interface AulasSimulacaoTableProps {
  aulas: AulaSimulacao[]
  onChange: (novasAulas: AulaSimulacao[]) => void
  taxaProfessorEfetiva: number
  professores: Professor[]
  cliente: Cliente | null
}

type CampoEditor = 'data' | 'horario' | 'duracao' | 'materia' | 'professor' | 'estudante'
interface EditorAberto { campo: CampoEditor; index: number }

function parseMateriasAtuais(materia?: string): string[] {
  if (!materia || materia.trim().toLowerCase() === MATERIA_A_DEFINIR.toLowerCase()) return []
  return materia.split(/,\s+|\s+e\s+/).map(m => m.trim()).filter(Boolean)
}

const formatterBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Cronograma de aulas da simulação — array embutido no documento (edição 100% em memória, sem writes por célula). */
export const AulasSimulacaoTable: React.FC<AulasSimulacaoTableProps> = ({ aulas, onChange, taxaProfessorEfetiva, professores, cliente }) => {
  const [editor, setEditor] = useState<EditorAberto | null>(null)
  const [calendarioAberto, setCalendarioAberto] = useState(false)

  function atualizarAula(index: number, campos: Partial<AulaSimulacao>) {
    onChange(aulas.map((a, i) => (i === index ? { ...a, ...campos } : a)))
  }

  function adicionarAula() {
    const ultima = aulas[aulas.length - 1]
    const nova: AulaSimulacao = {
      data: formatarDataInput(new Date()),
      horario: '',
      duracao: ultima?.duracao || '',
      materia: ultima?.materia || '',
      estudante: ultima?.estudante || '',
      professor: ultima?.professor || '',
      idProfessor: ultima?.idProfessor || '',
      professorUid: ultima?.professorUid || '',
    }
    onChange([...aulas, nova])
  }

  function copiarAula(index: number) {
    const copia = { ...aulas[index] }
    onChange([...aulas.slice(0, index + 1), copia, ...aulas.slice(index + 1)])
  }

  function excluirAula(index: number) {
    onChange(aulas.filter((_, i) => i !== index))
  }

  const aulasComId: Aula[] = aulas.map((a, i) => ({ id: String(i), ...a }))

  return (
    <GlassCard variant="default" style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: 700 }}>Cronograma de Aulas</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" size="sm" onClick={() => setCalendarioAberto(true)} disabled={aulas.length === 0}>
            <FiCalendar style={{ marginRight: '6px' }} />Ver calendário
          </Button>
          <Button variant="primary" size="sm" onClick={adicionarAula}><FiPlus style={{ marginRight: '6px' }} />Adicionar aula</Button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: 'var(--c-glass-bg-sm)', borderBottom: '1px solid var(--c-border)' }}>
              {['Data', 'Horário', 'Duração', 'Matéria', 'Estudante', 'Professor', 'Hora/Aula - Professor', 'Ações'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {aulas.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--c-text-3)' }}>Nenhuma aula no cronograma.</td></tr>
            ) : aulas.map((aula, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--c-border)' }}>
                <td style={celTdStyle}><button style={celBtnStyle} onClick={() => setEditor({ campo: 'data', index })}>{aula.data || '--'}</button></td>
                <td style={celTdStyle}><button style={celBtnStyle} onClick={() => setEditor({ campo: 'horario', index })}>{aula.horario || '--'}</button></td>
                <td style={celTdStyle}><button style={celBtnStyle} onClick={() => setEditor({ campo: 'duracao', index })}>{aula.duracao || '--'}</button></td>
                <td style={celTdStyle}><button style={celBtnStyle} onClick={() => setEditor({ campo: 'materia', index })}>{aula.materia || MATERIA_A_DEFINIR}</button></td>
                <td style={celTdStyle}><button style={celBtnStyle} onClick={() => setEditor({ campo: 'estudante', index })}>{aula.estudante || '--'}</button></td>
                <td style={celTdStyle}><button style={celBtnStyle} onClick={() => setEditor({ campo: 'professor', index })}>{aula.professor || 'A definir'}</button></td>
                <td style={{ ...celTdStyle, fontWeight: 600 }}>{formatterBRL.format(calcularValorAulaSimulacao(aula.duracao, taxaProfessorEfetiva))}</td>
                <td style={{ ...celTdStyle, textAlign: 'center' }}>
                  <button onClick={() => copiarAula(index)} title="Copiar aula" style={acaoBtnStyle}><FiCopy /></button>
                  <button onClick={() => excluirAula(index)} title="Excluir aula" style={{ ...acaoBtnStyle, color: 'var(--c-badge-error-text)' }}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editor?.campo === 'data' && (
        <DatePickerModal
          title="Alterar Data da Aula"
          valorAtual={aulas[editor.index].data}
          onClose={() => setEditor(null)}
          onSave={async novaData => atualizarAula(editor.index, { data: novaData })}
        />
      )}
      {editor?.campo === 'horario' && (
        <SimpleInputModal
          title="Alterar Horário"
          type="time"
          value={aulas[editor.index].horario || ''}
          onClose={() => setEditor(null)}
          onSave={async novoValor => atualizarAula(editor.index, { horario: novoValor })}
        />
      )}
      {editor?.campo === 'duracao' && (
        <FixedOptionsModal
          title="Alterar Duração"
          options={DURACAO_OPTIONS}
          selected={aulas[editor.index].duracao ? [aulas[editor.index].duracao!] : []}
          onClose={() => setEditor(null)}
          onSave={async ([novaDuracao]) => atualizarAula(editor.index, { duracao: novaDuracao })}
        />
      )}
      {editor?.campo === 'materia' && (
        <FixedOptionsModal
          title="Alterar Matéria"
          options={[MATERIA_A_DEFINIR, ...MATERIA_OPTIONS]}
          selected={parseMateriasAtuais(aulas[editor.index].materia)}
          multi
          maxSelecoes={MAX_MATERIAS_SELECIONADAS}
          onClose={() => setEditor(null)}
          onSave={async selecao => atualizarAula(editor.index, { materia: formatarMateriasMultiplas(selecao.filter(s => s !== MATERIA_A_DEFINIR)) })}
        />
      )}
      {editor?.campo === 'professor' && (
        <SearchableSelectModal
          title="Selecionar Professor"
          items={professores}
          getLabel={p => p.nome || '--'}
          getValue={p => ({ valor: p.nome || '', extra: { idProfessor: p.cpf || '', professorUid: p.uid || '' } })}
          currentValue={aulas[editor.index].professor}
          onClose={() => setEditor(null)}
          onSave={async resultado => atualizarAula(editor.index, {
            professor: resultado.valor,
            idProfessor: resultado.extra?.idProfessor || '',
            professorUid: resultado.extra?.professorUid || '',
          })}
        />
      )}
      {editor?.campo === 'estudante' && (
        <SearchableSelectModal
          title="Selecionar Estudante"
          items={cliente?.estudantes || []}
          getLabel={e => e.nomeEstudante || '--'}
          getValue={e => ({ valor: e.nomeEstudante || '' })}
          currentValue={aulas[editor.index].estudante}
          allowFreeText
          onClose={() => setEditor(null)}
          onSave={async resultado => atualizarAula(editor.index, { estudante: resultado.valor })}
        />
      )}

      {calendarioAberto && (
        <CalendarioVisualModal aulas={aulasComId} onClose={() => setCalendarioAberto(false)} />
      )}
    </GlassCard>
  )
}

const celTdStyle: React.CSSProperties = { padding: '6px 10px', whiteSpace: 'nowrap' }
const celBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-1)', fontSize: '12px', fontWeight: 500, padding: '4px 6px', borderRadius: 'var(--radius-sm)' }
const acaoBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-2)', padding: '4px 6px', display: 'inline-flex' }
