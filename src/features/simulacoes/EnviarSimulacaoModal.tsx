import React, { useRef, useState } from 'react'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { useToast } from '../../lib/ToastContext'
import { gerarSolicitacaoImagemPng } from '../painel-central/detalhes-contratacao/gerarSolicitacaoImagem'
import { calcularValoresSimulacao, formatarTotalHorasSimulacao } from './helpers'
import type { Simulacao } from './types'

interface EnviarSimulacaoModalProps {
  simulacao: Simulacao
  onClose: () => void
}

const formatterBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Resumo client-facing, exportado como PNG (html2canvas) — 100% client-side, sem escrita no Firestore. */
export const EnviarSimulacaoModal: React.FC<EnviarSimulacaoModalProps> = ({ simulacao, onClose }) => {
  const [imprimindo, setImprimindo] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  const valores = calcularValoresSimulacao(simulacao.aulas, !!simulacao.overrideAtivo, simulacao.valorHoraProfessor, simulacao.valorLucroMasterPorHora)

  async function handleImprimir() {
    if (!previewRef.current) return
    setImprimindo(true)
    try {
      await gerarSolicitacaoImagemPng(previewRef.current, `simulacao-${simulacao.id}.png`)
      showToast('Imagem gerada.', 'success')
    } catch {
      showToast('Erro ao gerar imagem.', 'error')
    } finally {
      setImprimindo(false)
    }
  }

  return (
    <Modal
      title="Enviar Simulação ao Cliente"
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Fechar</Button>
          <Button variant="primary" onClick={handleImprimir} loading={imprimindo}>Imprimir (baixar PNG)</Button>
        </>
      }
    >
      <div ref={previewRef} style={{ background: '#ffffff', color: '#1a1a1a', padding: '24px', borderRadius: '8px' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 700 }}>{simulacao.tituloSimulacao || 'Simulação'}</h2>
        <p style={{ margin: '0 0 4px', fontSize: '13px' }}><strong>Cliente:</strong> {simulacao.nomeCliente || '--'}</p>
        <p style={{ margin: '0 0 4px', fontSize: '13px' }}><strong>Total de horas:</strong> {formatarTotalHorasSimulacao(valores.horas)}</p>
        <p style={{ margin: '0 0 4px', fontSize: '13px' }}><strong>Valor do Pacote:</strong> {formatterBRL.format(valores.valorPacote)}</p>
        {simulacao.dataPrimeiraParcela && (
          <p style={{ margin: '0 0 4px', fontSize: '13px' }}><strong>1ª parcela:</strong> {simulacao.dataPrimeiraParcela}</p>
        )}
        {simulacao.dataSegundaParcela && (
          <p style={{ margin: '0 0 16px', fontSize: '13px' }}><strong>2ª parcela:</strong> {simulacao.dataSegundaParcela}</p>
        )}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '12px' }}>
          <thead>
            <tr>
              {['Data', 'Horário', 'Duração', 'Matéria', 'Estudante', 'Professor'].map(h => (
                <th key={h} style={{ border: '1px solid #ccc', padding: '6px 8px', background: '#f2f2f2', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {simulacao.aulas.map((a, i) => (
              <tr key={i}>
                <td style={tdStyle}>{a.data || '--'}</td>
                <td style={tdStyle}>{a.horario || '--'}</td>
                <td style={tdStyle}>{a.duracao || '--'}</td>
                <td style={tdStyle}>{a.materia || '--'}</td>
                <td style={tdStyle}>{a.estudante || '--'}</td>
                <td style={tdStyle}>{a.professor || 'A definir'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}

const tdStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '6px 8px' }
