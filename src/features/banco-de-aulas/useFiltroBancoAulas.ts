import { useState } from 'react'
import type { FiltroAulas, FiltroBancoAulas, FiltroDatas } from './types'

const FILTRO_INICIAL: FiltroBancoAulas = {
  datas: '',
  professor: '',
  aulas: 'execucao',
  pagamento: '',
  cliente: '',
  codigo: '',
}

/**
 * Estado do painel de filtros do Banco de Aulas. Paridade com o legado: os filtros são
 * mutuamente exclusivos — aplicar um zera os demais (regrasDeFiltro: resetOtherFilters).
 */
export function useFiltroBancoAulas() {
  const [filtro, setFiltro] = useState<FiltroBancoAulas>(FILTRO_INICIAL)

  function setDatas(valor: FiltroDatas) {
    setFiltro({ ...FILTRO_INICIAL, aulas: 'todos', datas: valor })
  }
  function setProfessor(valor: string) {
    setFiltro({ ...FILTRO_INICIAL, aulas: 'todos', professor: valor })
  }
  function setAulas(valor: FiltroAulas) {
    setFiltro({ ...FILTRO_INICIAL, aulas: valor })
  }
  function setPagamento(valor: string) {
    setFiltro({ ...FILTRO_INICIAL, aulas: 'todos', pagamento: valor })
  }
  function setCliente(valor: string) {
    setFiltro({ ...FILTRO_INICIAL, aulas: 'todos', cliente: valor })
  }
  function setCodigo(valor: string) {
    setFiltro({ ...FILTRO_INICIAL, aulas: 'todos', codigo: valor })
  }
  function limparFiltros() {
    setFiltro(FILTRO_INICIAL)
  }

  return { filtro, setDatas, setProfessor, setAulas, setPagamento, setCliente, setCodigo, limparFiltros }
}
