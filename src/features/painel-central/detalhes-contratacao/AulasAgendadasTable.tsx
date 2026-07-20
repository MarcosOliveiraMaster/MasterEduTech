import React, { useState } from 'react'
import { FiCalendar, FiPlus, FiTrash2, FiLoader, FiMessageCircle } from 'react-icons/fi'
import { BsChatSquareText, BsChatSquareTextFill } from 'react-icons/bs'
import { GlassCard } from '../../../components/GlassCard'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { Checkbox, Toggle, Textarea } from '../../../components/Input'
import { useToast } from '../../../lib/ToastContext'
import { RelatorioModal } from '../RelatorioModal'
import { FixedOptionsModal } from './cell-editors/FixedOptionsModal'
import { SearchableSelectModal } from './cell-editors/SearchableSelectModal'
import { SimpleInputModal } from './cell-editors/SimpleInputModal'
import { DatePickerModal } from './cell-editors/DatePickerModal'
import { CalendarioVisualModal } from './CalendarioVisualModal'
import { adicionarAula, fetchClientePorCpf, fetchProfessores, removerAulas, updateCampoAula } from '../queries'
import { calcularValorAula, formatarMateriasMultiplas, getStatusColors } from '../helpers'
import { DURACAO_OPTIONS, MATERIA_A_DEFINIR, MATERIA_OPTIONS, MAX_MATERIAS_SELECIONADAS, STATUS_OPTIONS } from '../types'
import type { Aula, Cliente, Contrato, Professor } from '../types'

interface AulasAgendadasTableProps {
  contrato: Contrato
  aulas: Aula[]
  onAulasAtualizadas: () => void
}

type CampoEditor = 'data' | 'horario' | 'duracao' | 'materia' | 'professor' | 'estudante' | 'status'
interface EditorAberto { campo: CampoEditor; aula: Aula }

function parseMateriasAtuais(materia?: string): string[] {
  if (!materia || materia.trim().toLowerCase() === MATERIA_A_DEFINIR.toLowerCase()) return []
  return materia.split(/,\s+|\s+e\s+/).map(m => m.trim()).filter(Boolean)
}

const formatterBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const AulasAgendadasTable: React.FC<AulasAgendadasTableProps> = ({ contrato, aulas, onAulasAtualizadas }) => {
  const [editor, setEditor] = useState<EditorAberto | null>(null)
  const [relatorioAulaId, setRelatorioAulaId] = useState<string | null>(null)
  const [observacaoAula, setObservacaoAula] = useState<Aula | null>(null)
  const [calendarioAberto, setCalendarioAberto] = useState(false)
  const [removerAberto, setRemoverAberto] = useState(false)
  const [adicionando, setAdicionando] = useState(false)
  const [salvandoSwitchId, setSalvandoSwitchId] = useState<string | null>(null)
  const [professores, setProfessores] = useState<Professor[] | null>(null)
  const [clienteContrato, setClienteContrato] = useState<Cliente | null | undefined>(undefined)
  const { showToast } = useToast()

  const horaAulaProfessor = contrato.horaAulaProfessor || 0

  async function garantirProfessores(): Promise<Professor[]> {
    if (professores) return professores
    const lista = await fetchProfessores()
    setProfessores(lista)
    return lista
  }

  async function garantirCliente(): Promise<Cliente | null> {
    if (clienteContrato !== undefined) return clienteContrato
    const c = contrato.cpf ? await fetchClientePorCpf(contrato.cpf) : null
    setClienteContrato(c)
    return c
  }

  async function handleSalvarCampo(aula: Aula, campos: Partial<Aula>) {
    try {
      await updateCampoAula(aula.id, campos)
      onAulasAtualizadas()
    } catch {
      showToast('Erro ao salvar alteração.', 'error')
    }
  }

  async function handleToggleConcluida(aula: Aula) {
    setSalvandoSwitchId(aula.id)
    try {
      await updateCampoAula(aula.id, { ConfirmacaoProfessorAula: !aula.ConfirmacaoProfessorAula })
      onAulasAtualizadas()
    } catch {
      showToast('Erro ao atualizar confirmação.', 'error')
    } finally {
      setSalvandoSwitchId(null)
    }
  }

  async function handleAdicionarAula() {
    setAdicionando(true)
    try {
      await adicionarAula(contrato.id, aulas, horaAulaProfessor)
      showToast('Aula adicionada.', 'success')
      onAulasAtualizadas()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Erro ao adicionar aula.', 'error')
    } finally {
      setAdicionando(false)
    }
  }

  return (
    <GlassCard variant="default" style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: 700 }}>Aulas Agendadas</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" size="sm" onClick={() => setCalendarioAberto(true)}><FiCalendar style={{ marginRight: '6px' }} />Ver calendário</Button>
          <Button variant="secondary" size="sm" onClick={() => setRemoverAberto(true)} disabled={aulas.length === 0}><FiTrash2 style={{ marginRight: '6px' }} />Remover aula</Button>
          <Button variant="primary" size="sm" onClick={handleAdicionarAula} loading={adicionando}><FiPlus style={{ marginRight: '6px' }} />Adicionar aula</Button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: 'var(--c-glass-bg-sm)', borderBottom: '1px solid var(--c-border)' }}>
              {['Data', 'Horário', 'Duração', 'Matéria', 'Professor', 'Valor', 'Estudante', 'Status', 'Concluída', 'Relatório', 'Observações'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {aulas.length === 0 ? (
              <tr><td colSpan={11} style={{ padding: '24px', textAlign: 'center', color: 'var(--c-text-3)' }}>Nenhuma aula agendada.</td></tr>
            ) : aulas.map(aula => {
              const colors = getStatusColors(aula.StatusAula)
              const temRelatorio = !!aula.RelatorioAula?.trim()
              const temObservacao = !!aula.ObservacoesAula?.trim()
              return (
                <tr key={aula.id} style={{ borderBottom: '1px solid var(--c-border)' }}>
                  <td style={celTdStyle}><button style={celBtnStyle} onClick={() => setEditor({ campo: 'data', aula })}>{aula.data || '--'}</button></td>
                  <td style={celTdStyle}><button style={celBtnStyle} onClick={() => setEditor({ campo: 'horario', aula })}>{aula.horario || '--'}</button></td>
                  <td style={celTdStyle}><button style={celBtnStyle} onClick={() => setEditor({ campo: 'duracao', aula })}>{aula.duracao || '--'}</button></td>
                  <td style={celTdStyle}><button style={celBtnStyle} onClick={() => setEditor({ campo: 'materia', aula })}>{aula.materia || MATERIA_A_DEFINIR}</button></td>
                  <td style={celTdStyle}>
                    <button style={celBtnStyle} onClick={async () => { await garantirProfessores(); setEditor({ campo: 'professor', aula }) }}>{aula.professor || 'A definir'}</button>
                  </td>
                  <td style={{ ...celTdStyle, fontWeight: 600 }}>{formatterBRL.format(calcularValorAula(aula.duracao, horaAulaProfessor))}</td>
                  <td style={celTdStyle}>
                    <button style={celBtnStyle} onClick={async () => { await garantirCliente(); setEditor({ campo: 'estudante', aula }) }}>{aula.estudante || '--'}</button>
                  </td>
                  <td style={celTdStyle}>
                    <button
                      onClick={() => setEditor({ campo: 'status', aula })}
                      style={{ ...celBtnStyle, background: colors.bg, color: colors.text, borderRadius: 'var(--radius-full)', padding: '4px 10px', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}
                    >
                      {aula.StatusAula || 'Pendente'}
                    </button>
                  </td>
                  <td style={{ ...celTdStyle, textAlign: 'center' }}>
                    {salvandoSwitchId === aula.id ? <FiLoader style={{ animation: 'spin 0.7s linear infinite' }} /> : (
                      <Toggle checked={!!aula.ConfirmacaoProfessorAula} onChange={() => handleToggleConcluida(aula)} />
                    )}
                  </td>
                  <td style={{ ...celTdStyle, textAlign: 'center' }}>
                    <button onClick={() => setRelatorioAulaId(aula.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: temRelatorio ? '#22c55e' : 'var(--c-text-4)' }}>
                      {temRelatorio ? <BsChatSquareTextFill /> : <BsChatSquareText />}
                    </button>
                  </td>
                  <td style={{ ...celTdStyle, textAlign: 'center' }}>
                    <button onClick={() => setObservacaoAula(aula)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: temObservacao ? '#22c55e' : 'var(--c-text-4)' }}>
                      <FiMessageCircle />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {editor?.campo === 'data' && (
        <DatePickerModal
          title="Alterar Data da Aula"
          valorAtual={editor.aula.data}
          onClose={() => setEditor(null)}
          onSave={async novaData => handleSalvarCampo(editor.aula, { data: novaData })}
        />
      )}
      {editor?.campo === 'horario' && (
        <SimpleInputModal
          title="Alterar Horário"
          type="time"
          value={editor.aula.horario || ''}
          onClose={() => setEditor(null)}
          onSave={async novoValor => handleSalvarCampo(editor.aula, { horario: novoValor })}
        />
      )}
      {editor?.campo === 'duracao' && (
        <FixedOptionsModal
          title="Alterar Duração"
          options={DURACAO_OPTIONS}
          selected={editor.aula.duracao ? [editor.aula.duracao] : []}
          onClose={() => setEditor(null)}
          onSave={async ([novaDuracao]) => handleSalvarCampo(editor.aula, {
            duracao: novaDuracao,
            ValorAula: calcularValorAula(novaDuracao, horaAulaProfessor),
          })}
        />
      )}
      {editor?.campo === 'materia' && (
        <FixedOptionsModal
          title="Alterar Matéria"
          options={[MATERIA_A_DEFINIR, ...MATERIA_OPTIONS]}
          selected={parseMateriasAtuais(editor.aula.materia)}
          multi
          maxSelecoes={MAX_MATERIAS_SELECIONADAS}
          onClose={() => setEditor(null)}
          onSave={async selecao => handleSalvarCampo(editor.aula, { materia: formatarMateriasMultiplas(selecao.filter(s => s !== MATERIA_A_DEFINIR)) })}
        />
      )}
      {editor?.campo === 'professor' && professores && (
        <SearchableSelectModal
          title="Selecionar Professor"
          items={professores}
          getLabel={p => p.nome || '--'}
          getValue={p => ({ valor: p.nome || '', extra: { idProfessor: p.cpf || '', professorUid: p.uid || '' } })}
          currentValue={editor.aula.professor}
          onClose={() => setEditor(null)}
          onSave={async resultado => handleSalvarCampo(editor.aula, {
            professor: resultado.valor,
            idProfessor: resultado.extra?.idProfessor || '',
            professorUid: resultado.extra?.professorUid || '',
          })}
        />
      )}
      {editor?.campo === 'estudante' && clienteContrato !== undefined && (
        <SearchableSelectModal
          title="Selecionar Estudante"
          items={clienteContrato?.estudantes || []}
          getLabel={e => e.nomeEstudante || '--'}
          getValue={e => ({ valor: e.nomeEstudante || '' })}
          currentValue={editor.aula.estudante}
          allowFreeText
          onClose={() => setEditor(null)}
          onSave={async resultado => handleSalvarCampo(editor.aula, { estudante: resultado.valor })}
        />
      )}
      {editor?.campo === 'status' && (
        <FixedOptionsModal
          title="Alterar Status da Aula"
          options={STATUS_OPTIONS}
          selected={editor.aula.StatusAula ? [editor.aula.StatusAula] : []}
          onClose={() => setEditor(null)}
          onSave={async ([novoStatus]) => handleSalvarCampo(editor.aula, { StatusAula: novoStatus })}
        />
      )}

      {relatorioAulaId && (
        <RelatorioModal aulaId={relatorioAulaId} onClose={() => setRelatorioAulaId(null)} onSaved={onAulasAtualizadas} />
      )}
      {observacaoAula && (
        <ObservacaoAulaModal
          aula={observacaoAula}
          onClose={() => setObservacaoAula(null)}
          onSaved={onAulasAtualizadas}
        />
      )}
      {calendarioAberto && (
        <CalendarioVisualModal aulas={aulas} onClose={() => setCalendarioAberto(false)} />
      )}
      {removerAberto && (
        <RemoverAulaModal aulas={aulas} onClose={() => setRemoverAberto(false)} onRemoved={onAulasAtualizadas} />
      )}
    </GlassCard>
  )
}

const celTdStyle: React.CSSProperties = { padding: '6px 10px', whiteSpace: 'nowrap' }
const celBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-1)', fontSize: '12px', fontWeight: 500, padding: '4px 6px', borderRadius: 'var(--radius-sm)' }

interface ObservacaoAulaModalProps { aula: Aula; onClose: () => void; onSaved: () => void }

const ObservacaoAulaModal: React.FC<ObservacaoAulaModalProps> = ({ aula, onClose, onSaved }) => {
  const [texto, setTexto] = useState(aula.ObservacoesAula || '')
  const [salvando, setSalvando] = useState(false)
  const { showToast } = useToast()

  async function handleSalvar() {
    setSalvando(true)
    try {
      await updateCampoAula(aula.id, { ObservacoesAula: texto })
      showToast('Observação salva.', 'success')
      onSaved()
      onClose()
    } catch {
      showToast('Erro ao salvar observação.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal
      title="Observações da Aula"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={salvando}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvar} loading={salvando}>Salvar</Button>
        </>
      }
    >
      <Textarea rows={4} value={texto} onChange={e => setTexto(e.target.value)} placeholder="Sem observações." />
    </Modal>
  )
}

interface RemoverAulaModalProps { aulas: Aula[]; onClose: () => void; onRemoved: () => void }

const RemoverAulaModal: React.FC<RemoverAulaModalProps> = ({ aulas, onClose, onRemoved }) => {
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set())
  const [removendo, setRemovendo] = useState(false)
  const { showToast } = useToast()

  function toggle(id: string) {
    setSelecionadas(prev => {
      const novo = new Set(prev)
      if (novo.has(id)) novo.delete(id)
      else novo.add(id)
      return novo
    })
  }

  async function handleRemover() {
    setRemovendo(true)
    try {
      await removerAulas(Array.from(selecionadas))
      showToast(`${selecionadas.size} aula(s) removida(s).`, 'success')
      onRemoved()
      onClose()
    } catch {
      showToast('Erro ao remover aulas.', 'error')
    } finally {
      setRemovendo(false)
    }
  }

  return (
    <Modal
      title="Remover Aulas"
      onClose={onClose}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={removendo}>Cancelar</Button>
          <Button variant="danger" onClick={handleRemover} loading={removendo} disabled={selecionadas.size === 0}>
            Excluir {selecionadas.size > 0 ? `(${selecionadas.size})` : ''}
          </Button>
        </>
      }
    >
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--c-text-2)' }}>Selecione as aulas a remover permanentemente. Esta ação não pode ser desfeita.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '40vh', overflowY: 'auto' }}>
        {aulas.map(a => (
          <div key={a.id} style={{ padding: '8px 12px', background: 'var(--c-glass-bg-sm)', borderRadius: 'var(--radius-sm)' }}>
            <Checkbox
              checked={selecionadas.has(a.id)}
              onChange={() => toggle(a.id)}
              label={`${a.data || '--'} · ${a.horario || '--'} · ${a.materia || '--'} · ${a.professor || '--'}`}
            />
          </div>
        ))}
      </div>
    </Modal>
  )
}
