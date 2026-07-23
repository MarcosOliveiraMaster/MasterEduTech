import { useState } from 'react'
import type { FiltroSimulacoes } from './types'

const FILTRO_VAZIO: FiltroSimulacoes = { nomeCliente: '', cpf: '', professor: '', nomeSimulacao: '' }

/**
 * Estado do painel de filtros de Simulações. Diferente do Banco de Aulas: os filtros são aplicados
 * por botão (rascunho local até "Aplicar Filtros"), não em tempo real — paridade com o legado.
 */
export function useFiltroSimulacoes() {
  const [rascunho, setRascunho] = useState<FiltroSimulacoes>(FILTRO_VAZIO)
  const [aplicado, setAplicado] = useState<FiltroSimulacoes>(FILTRO_VAZIO)

  function aplicarFiltros() {
    setAplicado(rascunho)
  }

  function limparFiltros() {
    setRascunho(FILTRO_VAZIO)
    setAplicado(FILTRO_VAZIO)
  }

  return { rascunho, setRascunho, aplicado, aplicarFiltros, limparFiltros }
}
