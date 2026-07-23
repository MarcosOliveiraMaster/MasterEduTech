import React, { useEffect, useMemo, useState } from 'react'
import { SkeletonPulse } from '../../components/SkeletonPulse'
import { fetchProfessores, fetchTodosClientes } from '../painel-central/queries'
import type { Cliente, Professor } from '../painel-central/types'
import { FiltroSimulacoesPainel } from './FiltroSimulacoesPainel'
import { filtrarSimulacoes, gerarProximoIdSimulacao } from './helpers'
import { ModalSimulacao } from './ModalSimulacao'
import { fetchSimulacoes } from './queries'
import { SimulacaoCard } from './SimulacaoCard'
import type { Simulacao } from './types'
import { useFiltroSimulacoes } from './useFiltroSimulacoes'
import './simulacoes.css'

export const SimulacoesPage: React.FC = () => {
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [atualizando, setAtualizando] = useState(false)
  const [modalAberto, setModalAberto] = useState<{ simulacao: Simulacao; isNova: boolean } | null>(null)
  const filtroCtrl = useFiltroSimulacoes()

  function carregarDados(comSpinner: boolean) {
    if (comSpinner) setAtualizando(true)
    else setLoading(true)
    return Promise.all([fetchSimulacoes(), fetchTodosClientes(), fetchProfessores()])
      .then(([s, c, p]) => {
        setSimulacoes(s)
        setClientes(c)
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

  const resultado = useMemo(() => filtrarSimulacoes(simulacoes, filtroCtrl.aplicado), [simulacoes, filtroCtrl.aplicado])

  function handleNovaSimulacao() {
    const novoId = gerarProximoIdSimulacao(simulacoes)
    setModalAberto({
      isNova: true,
      simulacao: { id: novoId, tituloSimulacao: '', nomeCliente: '', cpf: '', aulas: [] },
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
      <FiltroSimulacoesPainel
        rascunho={filtroCtrl.rascunho}
        onChange={filtroCtrl.setRascunho}
        onAplicar={filtroCtrl.aplicarFiltros}
        onLimpar={filtroCtrl.limparFiltros}
        onAtualizar={() => carregarDados(true)}
        onNovaSimulacao={handleNovaSimulacao}
        atualizando={atualizando}
        professores={professores}
      />

      <div className="simulacoes-grid-wrap">
        <div className="simulacoes-resultado-header">
          <span className="simulacoes-resultado-contagem">
            {loading ? 'Carregando...' : `${resultado.length} simulaç${resultado.length === 1 ? 'ão encontrada' : 'ões encontradas'}`}
          </span>
        </div>

        {loading ? (
          <div className="simulacoes-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonPulse key={i} height="130px" style={{ borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : resultado.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--c-text-3)' }}>
            Nenhuma simulação encontrada.
          </div>
        ) : (
          <div className="simulacoes-grid">
            {resultado.map(s => (
              <SimulacaoCard key={s.id} simulacao={s} onClick={() => setModalAberto({ simulacao: s, isNova: false })} />
            ))}
          </div>
        )}
      </div>

      {modalAberto && (
        <ModalSimulacao
          simulacaoInicial={modalAberto.simulacao}
          isNova={modalAberto.isNova}
          clientes={clientes}
          professores={professores}
          onClose={() => setModalAberto(null)}
          onSalva={() => carregarDados(true)}
          onAprovada={() => carregarDados(true)}
        />
      )}
    </div>
  )
}
