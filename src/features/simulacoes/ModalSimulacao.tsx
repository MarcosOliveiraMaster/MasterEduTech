import React, { useEffect, useRef, useState } from 'react'
import { FiCheckCircle, FiEdit2, FiFileText, FiSave, FiSend, FiTrash2, FiUser } from 'react-icons/fi'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { Input, Select, Toggle } from '../../components/Input'
import { useToast } from '../../lib/ToastContext'
import { fetchClientePorCpf } from '../painel-central/queries'
import { SearchableSelectModal } from '../painel-central/detalhes-contratacao/cell-editors/SearchableSelectModal'
import { SolicitacaoAulaModal } from '../painel-central/detalhes-contratacao/SolicitacaoAulaModal'
import type { Aula, Cliente, Contrato, Professor } from '../painel-central/types'
import { AulasSimulacaoTable } from './AulasSimulacaoTable'
import { EnviarSimulacaoModal } from './EnviarSimulacaoModal'
import { NovoValorModal } from './NovoValorModal'
import { ConfirmarExclusaoSimulacaoModal } from './ConfirmarExclusaoSimulacaoModal'
import { calcularValoresSimulacao, formatarTotalHorasSimulacao } from './helpers'
import { aprovarSimulacao, salvarSimulacao } from './queries'
import { METODO_PAGAMENTO_OPTIONS, TIPO_EQUIPE_OPTIONS } from './types'
import type { Simulacao } from './types'

interface ModalSimulacaoProps {
  simulacaoInicial: Simulacao
  isNova: boolean
  clientes: Cliente[]
  professores: Professor[]
  onClose: () => void
  onSalva: () => void
  onAprovada: () => void
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

const seletorBtnStyle: React.CSSProperties = {
  width: '100%', height: '40px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '8px',
  fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-sans)', color: 'var(--c-input-text)',
  background: 'var(--c-input-bg)', border: '1px solid var(--c-input-border)', borderRadius: 'var(--radius-sm)',
  cursor: 'pointer', textAlign: 'left',
}

/** Modal principal — Nova/Editar Simulação. Auto-save (debounced) em toda alteração, paridade com autoSalvarSimulacao do legado. */
export const ModalSimulacao: React.FC<ModalSimulacaoProps> = ({
  simulacaoInicial, isNova, clientes, professores, onClose, onSalva, onAprovada,
}) => {
  const [sim, setSim] = useState<Simulacao>(simulacaoInicial)
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [selecionarClienteAberto, setSelecionarClienteAberto] = useState(false)
  const [novoValorAberto, setNovoValorAberto] = useState(false)
  const [solicitacaoAberto, setSolicitacaoAberto] = useState(false)
  const [enviarAberto, setEnviarAberto] = useState(false)
  const [exclusaoAberta, setExclusaoAberta] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [aprovando, setAprovando] = useState(false)
  const primeiraExec = useRef(true)
  const { showToast } = useToast()

  useEffect(() => {
    let cancelado = false
    if (!sim.cpf) { setClienteSelecionado(null); return }
    fetchClientePorCpf(sim.cpf).then(c => { if (!cancelado) setClienteSelecionado(c) })
    return () => { cancelado = true }
  }, [sim.cpf])

  useEffect(() => {
    if (primeiraExec.current) { primeiraExec.current = false; return }
    const timeout = setTimeout(() => {
      salvarSimulacao(sim).catch(() => showToast('Erro ao salvar automaticamente.', 'error'))
    }, 800)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim])

  const valores = calcularValoresSimulacao(sim.aulas, !!sim.overrideAtivo, sim.valorHoraProfessor, sim.valorLucroMasterPorHora)
  const aprovada = (sim.tituloSimulacao || '').toUpperCase().startsWith('SIMULAÇÃO APROVADA')

  function atualizar(campos: Partial<Simulacao>) {
    setSim(s => ({ ...s, ...campos }))
  }

  async function handleSalvar() {
    setSalvando(true)
    try {
      await salvarSimulacao(sim)
      showToast('Simulação salva.', 'success')
      onSalva()
    } catch {
      showToast('Erro ao salvar simulação.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  async function handleAprovar() {
    if (sim.aulas.length === 0) { showToast('Adicione ao menos uma aula antes de aprovar.', 'warning'); return }
    if (!sim.nomeCliente) { showToast('Defina o cliente antes de aprovar.', 'warning'); return }
    setAprovando(true)
    try {
      const codigo = await aprovarSimulacao(sim)
      showToast(`Simulação aprovada — contratação ${codigo} criada no Banco de Aulas.`, 'success')
      onAprovada()
      onClose()
    } catch {
      showToast('Erro ao aprovar simulação.', 'error')
    } finally {
      setAprovando(false)
    }
  }

  const contratoAdapter: Contrato = { id: sim.id, nome: sim.nomeCliente, cpf: sim.cpf, horaAulaProfessor: valores.taxaProfessorEfetiva }
  const aulasComId: Aula[] = sim.aulas.map((a, i) => ({ id: String(i), ...a }))

  return (
    <Modal
      title={isNova ? 'Nova Simulação' : `Simulação — ${sim.tituloSimulacao || sim.id}`}
      onClose={onClose}
      size="xl"
      footer={
        <>
          {!isNova && (
            <Button variant="danger" onClick={() => setExclusaoAberta(true)}><FiTrash2 style={{ marginRight: '6px' }} />Excluir</Button>
          )}
          <Button variant="secondary" onClick={() => setSolicitacaoAberto(true)} disabled={sim.aulas.length === 0}>
            <FiFileText style={{ marginRight: '6px' }} />Solicitação
          </Button>
          <Button variant="secondary" onClick={() => setEnviarAberto(true)}><FiSend style={{ marginRight: '6px' }} />Enviar ao cliente</Button>
          <Button variant="secondary" onClick={handleSalvar} loading={salvando}><FiSave style={{ marginRight: '6px' }} />Salvar</Button>
          <Button variant="mint" onClick={handleAprovar} loading={aprovando} disabled={aprovada}>
            <FiCheckCircle style={{ marginRight: '6px' }} />{aprovada ? 'Aprovada' : 'Aprovar'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Input label="Título da Simulação *" value={sim.tituloSimulacao || ''} onChange={e => atualizar({ tituloSimulacao: e.target.value })} />

        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--c-text-2)', marginBottom: '6px' }}>
            Nome do Cliente
          </label>
          <button type="button" style={seletorBtnStyle} onClick={() => setSelecionarClienteAberto(true)}>
            <FiUser size={14} style={{ color: 'var(--c-text-3)' }} />
            {sim.nomeCliente || 'Selecionar ou digitar cliente...'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <Select
            label="Método de Pagamento"
            value={sim.metodoPagamento || ''}
            onChange={e => atualizar({ metodoPagamento: e.target.value })}
            options={METODO_PAGAMENTO_OPTIONS.map(o => ({ value: o, label: o }))}
            placeholder="Selecione"
          />
          <Select
            label="Tipo de Equipe"
            value={sim.tipoEquipe || ''}
            onChange={e => atualizar({ tipoEquipe: e.target.value })}
            options={TIPO_EQUIPE_OPTIONS.map(o => ({ value: o, label: o }))}
            placeholder="Selecione"
          />
          <Input label="Data da 1ª Parcela" placeholder="dd/mm/aaaa" value={sim.dataPrimeiraParcela || ''} onChange={e => atualizar({ dataPrimeiraParcela: e.target.value })} />
          <Input label="Data da 2ª Parcela" placeholder="dd/mm/aaaa" value={sim.dataSegundaParcela || ''} onChange={e => atualizar({ dataSegundaParcela: e.target.value })} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
          <Toggle
            label={sim.overrideAtivo ? 'Valores customizados' : 'Valor Padrão (tabela progressiva)'}
            checked={!!sim.overrideAtivo}
            onChange={ativo => atualizar(ativo
              ? { overrideAtivo: true, valorHoraProfessor: sim.valorHoraProfessor || 35, valorLucroMasterPorHora: sim.valorLucroMasterPorHora || 30 }
              : { overrideAtivo: false, valorHoraProfessor: null, valorLucroMasterPorHora: null })}
          />
          {sim.overrideAtivo && (
            <Button variant="ghost" size="sm" onClick={() => setNovoValorAberto(true)}><FiEdit2 style={{ marginRight: '6px' }} />Editar valores</Button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          <Display label="Total de horas" value={formatarTotalHorasSimulacao(valores.horas)} />
          <Display label="Valor Hora/Aula" value={formatterBRL.format(valores.valorHoraAulaDisplay)} />
          <Display label="Valor do Pacote" value={formatterBRL.format(valores.valorPacote)} color="var(--c-badge-warning-text)" />
          <Display label="Valor para Equipe" value={formatterBRL.format(valores.valorEquipe)} />
          <Display label="Lucro Master" value={formatterBRL.format(valores.lucroMaster)} color="var(--c-badge-success-text)" />
        </div>
      </div>

      <AulasSimulacaoTable
        aulas={sim.aulas}
        onChange={novasAulas => atualizar({ aulas: novasAulas })}
        taxaProfessorEfetiva={valores.taxaProfessorEfetiva}
        professores={professores}
        cliente={clienteSelecionado}
      />

      {selecionarClienteAberto && (
        <SearchableSelectModal
          title="Selecionar Cliente"
          items={clientes}
          getLabel={c => c.nome || '--'}
          getValue={c => ({ valor: c.nome || '', extra: { cpf: c.cpf || '' } })}
          currentValue={sim.nomeCliente}
          allowFreeText
          onClose={() => setSelecionarClienteAberto(false)}
          onSave={async resultado => atualizar({ nomeCliente: resultado.valor, cpf: resultado.extra?.cpf || '' })}
        />
      )}

      {novoValorAberto && (
        <NovoValorModal
          valorHoraProfessorAtual={sim.valorHoraProfessor || 35}
          valorLucroMasterPorHoraAtual={sim.valorLucroMasterPorHora || 30}
          onClose={() => setNovoValorAberto(false)}
          onSalvar={(valorHoraProfessor, valorLucroMasterPorHora) => atualizar({ valorHoraProfessor, valorLucroMasterPorHora })}
        />
      )}

      {solicitacaoAberto && (
        <SolicitacaoAulaModal contrato={contratoAdapter} aulas={aulasComId} onClose={() => setSolicitacaoAberto(false)} />
      )}

      {enviarAberto && (
        <EnviarSimulacaoModal simulacao={sim} onClose={() => setEnviarAberto(false)} />
      )}

      {exclusaoAberta && (
        <ConfirmarExclusaoSimulacaoModal
          simulacaoId={sim.id}
          titulo={sim.tituloSimulacao || ''}
          onClose={() => setExclusaoAberta(false)}
          onExcluida={() => { onSalva(); onClose() }}
        />
      )}
    </Modal>
  )
}
