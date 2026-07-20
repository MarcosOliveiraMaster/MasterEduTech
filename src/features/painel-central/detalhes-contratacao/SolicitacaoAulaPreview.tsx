import React, { useEffect, useRef, useState } from 'react'
import { FiLoader } from 'react-icons/fi'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { useToast } from '../../../lib/ToastContext'
import { fetchClientePorCpf } from '../queries'
import { calcularValorAula } from '../helpers'
import { gerarSolicitacaoImagemPng } from './gerarSolicitacaoImagem'
import type { Aula, Cliente, Contrato } from '../types'
import type { ColunaKey } from './SolicitacaoAulaModal'

interface SolicitacaoAulaPreviewProps {
  contrato: Contrato
  aulas: Aula[]
  colunasVisiveis: Set<ColunaKey>
  onClose: () => void
  onVoltar: () => void
}

const formatterBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const COLUNA_LABEL: Record<ColunaKey, string> = {
  data: 'Data', horario: 'Horário', duracao: 'Duração', materia: 'Matéria',
  professor: 'Professor', estudante: 'Estudante', status: 'Status', valorAula: 'Valor',
}

function valorColuna(a: Aula, c: ColunaKey, horaAulaProfessor: number): string {
  switch (c) {
    case 'data': return a.data || '--'
    case 'horario': return a.horario || '--'
    case 'duracao': return a.duracao || '--'
    case 'materia': return a.materia || '--'
    case 'professor': return a.professor || '--'
    case 'estudante': return a.estudante || '--'
    case 'status': return a.StatusAula || '--'
    case 'valorAula': return formatterBRL.format(calcularValorAula(a.duracao, horaAulaProfessor))
  }
}

export const SolicitacaoAulaPreview: React.FC<SolicitacaoAulaPreviewProps> = ({ contrato, aulas, colunasVisiveis, onClose, onVoltar }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [imprimindo, setImprimindo] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  useEffect(() => {
    let cancelled = false
    const promessa = contrato.cpf ? fetchClientePorCpf(contrato.cpf) : Promise.resolve(null)
    promessa.then(c => { if (!cancelled) { setCliente(c); setLoading(false) } })
    return () => { cancelled = true }
  }, [contrato.cpf])

  const horaAulaProfessor = contrato.horaAulaProfessor || 0
  const totalReceber = aulas.reduce((total, a) => total + calcularValorAula(a.duracao, horaAulaProfessor), 0)
  const endereco = cliente
    ? ((cliente.mesmoEndereco === false ? cliente.enderecoAulas : cliente.endereco) || '')
    : (contrato.enderecoAulas || contrato.endereco || '')
  const colunas = Array.from(colunasVisiveis)

  async function handleImprimir() {
    if (!previewRef.current) return
    setImprimindo(true)
    try {
      await gerarSolicitacaoImagemPng(previewRef.current, `solicitacao-${contrato.id}.png`)
      showToast('Imagem gerada.', 'success')
    } catch {
      showToast('Erro ao gerar imagem.', 'error')
    } finally {
      setImprimindo(false)
    }
  }

  return (
    <Modal
      title="Preview da Solicitação"
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onVoltar}>Voltar</Button>
          <Button variant="primary" onClick={handleImprimir} loading={imprimindo} disabled={loading}>Imprimir (baixar PNG)</Button>
        </>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <FiLoader size={24} style={{ animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : (
        <div ref={previewRef} style={{ background: '#ffffff', color: '#1a1a1a', padding: '24px', borderRadius: '8px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 700 }}>Solicitação de Aulas</h2>
          <p style={{ margin: '0 0 4px', fontSize: '13px' }}><strong>Cliente:</strong> {contrato.nome || contrato.nomeCliente}</p>
          <p style={{ margin: '0 0 4px', fontSize: '13px' }}><strong>Endereço:</strong> {endereco || '--'}</p>
          <p style={{ margin: '0 0 16px', fontSize: '13px' }}><strong>Total a receber:</strong> {formatterBRL.format(totalReceber)}</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr>
                {colunas.map(c => (
                  <th key={c} style={{ border: '1px solid #ccc', padding: '6px 8px', background: '#f2f2f2', textAlign: 'left' }}>{COLUNA_LABEL[c]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aulas.map(a => (
                <tr key={a.id}>
                  {colunas.map(c => (
                    <td key={c} style={{ border: '1px solid #ccc', padding: '6px 8px' }}>
                      {valorColuna(a, c, horaAulaProfessor)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  )
}
