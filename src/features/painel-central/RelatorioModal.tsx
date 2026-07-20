import React, { useEffect, useState } from 'react'
import { FiCopy, FiLoader } from 'react-icons/fi'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { Textarea } from '../../components/Input'
import { copyToClipboard } from './helpers'
import { fetchAula, updateRelatorioAula } from './queries'

interface RelatorioModalProps {
  aulaId: string
  onClose: () => void
  onSaved: () => void
}

function limparTitulo(texto: string, titulo: string): string {
  if (!texto) return ''
  const linhas = texto.trim().split('\n')
  if (linhas.length > 0 && linhas[0].trim().toLowerCase().includes(titulo.toLowerCase())) {
    linhas.shift()
  }
  return linhas.join('\n').trim()
}

function saudacaoAtual(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Bom dia'
  if (h >= 12 && h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export const RelatorioModal: React.FC<RelatorioModalProps> = ({ aulaId, onClose, onSaved }) => {
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [descricao, setDescricao] = useState('')
  const [comportamento, setComportamento] = useState('')
  const [recomendacoes, setRecomendacoes] = useState('')
  const [nomeCliente, setNomeCliente] = useState('')
  const [professor, setProfessor] = useState('')
  const [dataAula, setDataAula] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchAula(aulaId).then(aula => {
      if (cancelled || !aula) return
      const texto = aula.RelatorioAula || ''
      const partes = texto.split('---')
      setDescricao(limparTitulo(partes[0] || '', 'Descrição da aula'))
      setComportamento(limparTitulo(partes[1] || '', 'Comportamento do Estudante'))
      setRecomendacoes(limparTitulo(partes[2] || '', 'Recomendações'))
      setNomeCliente(aula.nomeCliente || '')
      setProfessor(aula.professor || '')
      setDataAula(aula.data || '')
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [aulaId])

  function montarTexto(): string {
    return `Descrição da aula\n${descricao}\n---\nComportamento do Estudante\n${comportamento}\n---\nRecomendações\n${recomendacoes}`
  }

  async function handleSalvar() {
    setSalvando(true)
    try {
      await updateRelatorioAula(aulaId, montarTexto())
      onSaved()
      onClose()
    } finally {
      setSalvando(false)
    }
  }

  async function handleCopiar() {
    let dataTexto = dataAula
    try {
      if (dataAula.includes('-')) {
        const partes = dataAula.split('-')[1].trim().split('/')
        const [dia, mes, ano] = partes.map(Number)
        const dataObj = new Date(ano, mes - 1, dia)
        const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
        const amanha = new Date(hoje); amanha.setDate(hoje.getDate() + 1)
        if (dataObj.getTime() === hoje.getTime()) dataTexto = 'hoje'
        else if (dataObj.getTime() === amanha.getTime()) dataTexto = 'amanhã'
      }
    } catch {
      // mantém a data original
    }

    const primeiroDoisNomes = (nome: string) => {
      const partes = nome.trim().split(/\s+/)
      return partes.length <= 2 ? nome : `${partes[0]} ${partes[1]}`
    }

    const mensagem = `${saudacaoAtual()} ${primeiroDoisNomes(nomeCliente)}!
segue o relatório da aula de ${dataTexto} com: ${professor.trim().split(' ')[0] || ''}

Descrição da aula:
${descricao}

Comportamento do aluno:
${comportamento}

Recomendações:
${recomendacoes}`

    await copyToClipboard(mensagem)
    onClose()
  }

  return (
    <Modal
      title="Editar relatório de Aula"
      onClose={onClose}
      maxWidth="560px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="secondary" onClick={handleCopiar} disabled={loading}>
            <FiCopy style={{ marginRight: '6px' }} /> Copiar
          </Button>
          <Button variant="primary" onClick={handleSalvar} loading={salvando} disabled={loading}>
            Salvar Alterações
          </Button>
        </>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <FiLoader style={{ fontSize: '24px', color: 'var(--c-text-blue)', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Textarea label="Descrição da aula" rows={3} value={descricao} onChange={e => setDescricao(e.target.value)} />
          <Textarea label="Comportamento do Estudante" rows={3} value={comportamento} onChange={e => setComportamento(e.target.value)} />
          <Textarea label="Recomendações" rows={3} value={recomendacoes} onChange={e => setRecomendacoes(e.target.value)} />
        </div>
      )}
    </Modal>
  )
}
