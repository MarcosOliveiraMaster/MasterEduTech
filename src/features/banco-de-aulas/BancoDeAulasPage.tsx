import React, { useEffect, useMemo, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { GlassCard } from '../../components/GlassCard'
import { SkeletonPulse } from '../../components/SkeletonPulse'
import { fetchTodasAulas, fetchTodosContratos, fetchProfessores } from '../painel-central/queries'
import { DetalhesModal } from '../painel-central/detalhes-contratacao/DetalhesModal'
import type { Aula, Contrato, Professor } from '../painel-central/types'
import { AulaContratoCard } from './AulaContratoCard'
import { ConfirmarExclusaoContratacaoModal } from './ConfirmarExclusaoContratacaoModal'
import { FiltroBancoAulasPainel } from './FiltroBancoAulasPainel'
import { agruparAulasPorContrato, filtrarContratos } from './helpers'
import { useFiltroBancoAulas } from './useFiltroBancoAulas'
import './banco-de-aulas.css'

interface ContextMenuState {
  x: number
  y: number
  contrato: Contrato
}

export const BancoDeAulasPage: React.FC = () => {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [aulas, setAulas] = useState<Aula[]>([])
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [atualizando, setAtualizando] = useState(false)
  const [detalhesModal, setDetalhesModal] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [exclusaoModal, setExclusaoModal] = useState<{ codigoContratacao: string; nomeCliente: string; aulaIds: string[] } | null>(null)
  const filtroCtrl = useFiltroBancoAulas()
  const { filtro } = filtroCtrl

  function carregarDados(comSpinner: boolean) {
    if (comSpinner) setAtualizando(true)
    else setLoading(true)
    return Promise.all([fetchTodosContratos(), fetchTodasAulas(), fetchProfessores()])
      .then(([c, a, p]) => {
        setContratos(c)
        setAulas(a)
        setProfessores(p)
      })
      .finally(() => {
        setLoading(false)
        setAtualizando(false)
      })
  }

  useEffect(() => {
    carregarDados(false)
  }, [])

  useEffect(() => {
    function fechar() { setContextMenu(null) }
    if (contextMenu) {
      document.addEventListener('click', fechar)
      document.addEventListener('scroll', fechar, true)
      return () => {
        document.removeEventListener('click', fechar)
        document.removeEventListener('scroll', fechar, true)
      }
    }
  }, [contextMenu])

  const aulasPorContrato = useMemo(() => agruparAulasPorContrato(aulas), [aulas])

  const clientesOpcoes = useMemo(() => {
    const vistos = new Set<string>()
    const lista: { cpf: string; nome: string }[] = []
    for (const c of contratos) {
      if (!c.cpf || vistos.has(c.cpf)) continue
      vistos.add(c.cpf)
      lista.push({ cpf: c.cpf, nome: c.nome || c.nomeCliente || c.cpf })
    }
    return lista.sort((a, b) => a.nome.localeCompare(b.nome))
  }, [contratos])

  const resultado = useMemo(
    () => filtrarContratos(contratos, aulasPorContrato, filtro)
      .sort((a, b) => (a.nome || a.nomeCliente || '').localeCompare(b.nome || b.nomeCliente || '')),
    [contratos, aulasPorContrato, filtro],
  )

  function handleExcluido() {
    if (exclusaoModal && detalhesModal === exclusaoModal.codigoContratacao) setDetalhesModal(null)
    carregarDados(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
      <FiltroBancoAulasPainel
        filtro={filtro}
        onDatasChange={filtroCtrl.setDatas}
        onProfessorChange={filtroCtrl.setProfessor}
        onAulasChange={filtroCtrl.setAulas}
        onPagamentoChange={filtroCtrl.setPagamento}
        onClienteChange={filtroCtrl.setCliente}
        onCodigoChange={filtroCtrl.setCodigo}
        onLimpar={filtroCtrl.limparFiltros}
        onAtualizar={() => carregarDados(true)}
        atualizando={atualizando}
        professores={professores}
        clientes={clientesOpcoes}
      />

      <div className="aulas-grid-wrap">
        <div className="aulas-resultado-header">
          <span className="aulas-resultado-contagem">
            {loading ? 'Carregando...' : `${resultado.length} contrataç${resultado.length === 1 ? 'ão encontrada' : 'ões encontradas'}`}
          </span>
          <div className="aulas-legenda">
            <span className="aulas-legenda-item"><span className="aulas-legenda-dot" style={{ background: '#4ade80' }} />Completo</span>
            <span className="aulas-legenda-item"><span className="aulas-legenda-dot" style={{ background: '#9CA3AF' }} />Parcial</span>
            <span className="aulas-legenda-item"><span className="aulas-legenda-dot" style={{ background: '#f87171' }} />Sem professor</span>
          </div>
        </div>

        {loading ? (
          <div className="aulas-grid">
            {Array.from({ length: 8 }, (_, i) => (
              <SkeletonPulse key={i} height="150px" style={{ borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : resultado.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--c-text-3)' }}>
            Nenhuma contratação encontrada para estes filtros.
          </div>
        ) : (
          <div className="aulas-grid">
            {resultado.map(contrato => (
              <AulaContratoCard
                key={contrato.id}
                contrato={contrato}
                aulas={aulasPorContrato.get(contrato.id) || []}
                onClick={() => setDetalhesModal(contrato.id)}
                onContextMenu={e => {
                  e.preventDefault()
                  setContextMenu({ x: e.clientX, y: e.clientY, contrato })
                }}
              />
            ))}
          </div>
        )}
      </div>

      {contextMenu && (
        <GlassCard
          variant="sm"
          className="context-menu-aula"
          style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9500, padding: '6px' }}
        >
          <button
            type="button"
            className="context-menu-item"
            onClick={() => {
              const c = contextMenu.contrato
              setExclusaoModal({
                codigoContratacao: c.id,
                nomeCliente: c.nome || c.nomeCliente || c.id,
                aulaIds: (aulasPorContrato.get(c.id) || []).map(a => a.id),
              })
              setContextMenu(null)
            }}
          >
            <FiTrash2 size={13} /> Excluir
          </button>
        </GlassCard>
      )}

      {detalhesModal && (
        <DetalhesModal codigoContratacao={detalhesModal} onClose={() => setDetalhesModal(null)} />
      )}

      {exclusaoModal && (
        <ConfirmarExclusaoContratacaoModal
          codigoContratacao={exclusaoModal.codigoContratacao}
          nomeCliente={exclusaoModal.nomeCliente}
          aulaIds={exclusaoModal.aulaIds}
          onClose={() => setExclusaoModal(null)}
          onExcluido={handleExcluido}
        />
      )}
    </div>
  )
}
