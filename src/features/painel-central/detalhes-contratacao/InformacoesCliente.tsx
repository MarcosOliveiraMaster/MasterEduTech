import React, { useState } from 'react'
import { FiEdit2, FiFileText, FiSend, FiMessageSquare, FiUser, FiClipboard } from 'react-icons/fi'
import { GlassCard } from '../../../components/GlassCard'
import { Button } from '../../../components/Button'
import { Badge } from '../../../components/Badge'
import { useToast } from '../../../lib/ToastContext'
import { fetchClientePorCpf } from '../queries'
import { formatarDataContrato, getCorStatusPagamento, calcularSomaValorAulas, calcularTotalMinutosAulas, formatarSomatorioDuracao, resolverDadosFiscais, montarMsgNfe, copyToClipboard } from '../helpers'
import { gerarContratoPdf } from './gerarContratoPdf'
import { EditarContratacaoModal } from './EditarContratacaoModal'
import { ObservacoesContratacaoModal } from './ObservacoesContratacaoModal'
import { VerClienteModal } from './VerClienteModal'
import { SolicitacaoAulaModal } from './SolicitacaoAulaModal'
import type { Aula, Contrato } from '../types'

interface InformacoesClienteProps {
  contrato: Contrato
  aulas: Aula[]
  onContratoAtualizado: () => void
}

const formatterBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

type ModalAtivo = 'editar' | 'observacoes' | 'verCliente' | 'solicitacao' | null

export const InformacoesCliente: React.FC<InformacoesClienteProps> = ({ contrato, aulas, onContratoAtualizado }) => {
  const [modalAtivo, setModalAtivo] = useState<ModalAtivo>(null)
  const [gerandoContrato, setGerandoContrato] = useState(false)
  const [gerandoNfe, setGerandoNfe] = useState(false)
  const { showToast } = useToast()

  const nomeCliente = contrato.nome || contrato.nomeCliente || 'Cliente não identificado'

  async function handleGerarContrato() {
    setGerandoContrato(true)
    try {
      const cliente = contrato.cpf ? await fetchClientePorCpf(contrato.cpf) : null
      const endereco = cliente
        ? ((cliente.mesmoEndereco === false ? cliente.enderecoAulas : cliente.endereco) || '')
        : (contrato.enderecoAulas || contrato.endereco || '')
      const estudantesText = cliente?.estudantes?.length
        ? cliente.estudantes.map(e => e.nomeEstudante).filter(Boolean).join(', ')
        : (contrato.estudante || '')
      const seriesText = cliente?.estudantes?.length
        ? cliente.estudantes.map(e => e.serieEstudante).filter(Boolean).join(', ')
        : (contrato.serie || '')

      const horaAulaProfessor = contrato.horaAulaProfessor || 0
      const valorEquipe = calcularSomaValorAulas(aulas, horaAulaProfessor)
      const valorPacote = Number((valorEquipe + (contrato.lucroMaster || 0)).toFixed(2))
      const totalHorasText = formatarSomatorioDuracao(calcularTotalMinutosAulas(aulas))

      await gerarContratoPdf({
        nomeCliente,
        cpfCliente: contrato.cpf || '',
        enderecoCliente: endereco,
        estudantesText,
        seriesText,
        totalHorasText,
        valorPacoteText: formatterBRL.format(valorPacote),
        tabelaAulas: aulas.map(a => ({
          data: a.data || '', hora: a.horario || '', duracao: a.duracao || '',
          materia: a.materia || '', professor: a.professor || '', estudante: a.estudante || '',
        })),
      })
      showToast('Contrato gerado.', 'success')
    } catch {
      showToast('Erro ao gerar contrato.', 'error')
    } finally {
      setGerandoContrato(false)
    }
  }

  async function handleGerarNfe() {
    if (!contrato.cpf) { showToast('Cliente sem CPF cadastrado.', 'error'); return }
    setGerandoNfe(true)
    try {
      const cliente = await fetchClientePorCpf(contrato.cpf)
      if (!cliente) { showToast('Cliente não encontrado em cadastroClientes.', 'error'); return }
      const fiscal = resolverDadosFiscais(cliente)
      const horaAulaProfessor = contrato.horaAulaProfessor || 0
      const valorEquipe = calcularSomaValorAulas(aulas, horaAulaProfessor)
      const valorPacote = Number((valorEquipe + (contrato.lucroMaster || 0)).toFixed(2))
      await copyToClipboard(montarMsgNfe({ ...fiscal, valor: formatterBRL.format(valorPacote) }))
      showToast('Mensagem de NF-e copiada.', 'success')
    } catch {
      showToast('Erro ao gerar mensagem de NF-e.', 'error')
    } finally {
      setGerandoNfe(false)
    }
  }

  return (
    <GlassCard variant="default">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: '20px', alignItems: 'start' }}>
        <div>
          <div style={rotuloStyle}>Nome do Cliente</div>
          <div style={valorStyle}>{nomeCliente}</div>
          <div style={{ ...rotuloStyle, marginTop: '10px' }}>CPF</div>
          <div style={valorStyle}>{contrato.cpf || '--'}</div>
        </div>

        <div>
          <div style={rotuloStyle}>Status do Contrato</div>
          <Badge variant="outline" style={{ marginTop: '4px', background: getCorStatusPagamento(contrato.statusContrato).bg, color: getCorStatusPagamento(contrato.statusContrato).text, border: 'none' }}>{contrato.statusContrato || '--'}</Badge>
          <div style={{ ...rotuloStyle, marginTop: '10px' }}>Assinatura do Contrato</div>
          <div style={valorStyle}>{contrato.dataAssinaturaContrato ? formatarDataContrato(contrato.dataAssinaturaContrato) : '--'}</div>
          <div style={{ ...rotuloStyle, marginTop: '10px' }}>Método de pagamento</div>
          <div style={valorStyle}>{contrato.modoPagamento || '--'}</div>
          <div style={{ ...rotuloStyle, marginTop: '10px' }}>Código da Contratação</div>
          <div style={{ ...valorStyle, fontFamily: 'monospace' }}>{contrato.id}</div>
        </div>

        <div>
          <div style={rotuloStyle}>Status do Pagamento</div>
          <Badge variant="outline" style={{ marginTop: '4px', background: getCorStatusPagamento(contrato.statusPagamento).bg, color: getCorStatusPagamento(contrato.statusPagamento).text, border: 'none' }}>{contrato.statusPagamento || '--'}</Badge>
          <div style={{ ...rotuloStyle, marginTop: '10px' }}>Data da 1ª parcela</div>
          <div style={valorStyle}>{contrato.dataPrimeiraParcela ? formatarDataContrato(contrato.dataPrimeiraParcela) : '--'}</div>
          <div style={{ ...rotuloStyle, marginTop: '10px' }}>Data da 2ª parcela</div>
          <div style={valorStyle}>{contrato.dataSegundaParcela ? formatarDataContrato(contrato.dataSegundaParcela) : '--'}</div>
          <div style={{ ...rotuloStyle, marginTop: '10px' }}>Tipo de Equipe</div>
          <div style={valorStyle}>{contrato.equipe || '--'}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
          <Button variant="secondary" size="sm" onClick={() => setModalAtivo('editar')}><FiEdit2 style={{ marginRight: '6px' }} />Editar</Button>
          <Button variant="secondary" size="sm" onClick={handleGerarContrato} loading={gerandoContrato}><FiFileText style={{ marginRight: '6px' }} />Contrato</Button>
          <Button variant="secondary" size="sm" onClick={() => setModalAtivo('solicitacao')}><FiSend style={{ marginRight: '6px' }} />Solicitação</Button>
          <Button variant="secondary" size="sm" onClick={() => setModalAtivo('observacoes')}><FiMessageSquare style={{ marginRight: '6px' }} />Observações</Button>
          <Button variant="secondary" size="sm" onClick={() => setModalAtivo('verCliente')} disabled={!contrato.cpf}><FiUser style={{ marginRight: '6px' }} />Ver cliente</Button>
          <Button variant="secondary" size="sm" onClick={handleGerarNfe} loading={gerandoNfe}><FiClipboard style={{ marginRight: '6px' }} />Gerar msg NF-e</Button>
        </div>
      </div>

      {modalAtivo === 'editar' && (
        <EditarContratacaoModal contrato={contrato} onClose={() => setModalAtivo(null)} onSaved={onContratoAtualizado} />
      )}
      {modalAtivo === 'observacoes' && (
        <ObservacoesContratacaoModal contrato={contrato} onClose={() => setModalAtivo(null)} onSaved={onContratoAtualizado} />
      )}
      {modalAtivo === 'verCliente' && contrato.cpf && (
        <VerClienteModal cpf={contrato.cpf} onClose={() => setModalAtivo(null)} />
      )}
      {modalAtivo === 'solicitacao' && (
        <SolicitacaoAulaModal contrato={contrato} aulas={aulas} onClose={() => setModalAtivo(null)} />
      )}
    </GlassCard>
  )
}

const rotuloStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.03em' }
const valorStyle: React.CSSProperties = { fontSize: '13px', color: 'var(--c-text-1)', marginTop: '2px', fontWeight: 500 }
