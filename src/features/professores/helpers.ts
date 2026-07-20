import { listaSeparadaPorVirgula, type ExperienciaKey, type Professor } from './types'

export interface FiltrosProfessor {
  nome: string
  disciplina: string
  bairro: string
  experiencia: ExperienciaKey | ''
  turnosSelecionados: Set<string>
}

/**
 * Todos os filtros combinam em sequência (E lógico): nome E disciplina E bairro E experiência E disponibilidade.
 * Dentro da disponibilidade, múltiplas células selecionadas combinam em OU (professor disponível em pelo menos uma).
 */
export function filtrarProfessores(professores: Professor[], filtros: FiltrosProfessor): Professor[] {
  const nomeFiltro = filtros.nome.trim().toLowerCase()
  const bairroFiltro = filtros.bairro.trim().toLowerCase()

  return professores.filter(p => {
    if ((p.status || 'Ativo') !== 'Ativo') return false
    if (nomeFiltro && !(p.nome || '').toLowerCase().includes(nomeFiltro)) return false
    if (filtros.disciplina && !listaSeparadaPorVirgula(p.disciplinas).includes(filtros.disciplina)) return false
    if (bairroFiltro && !(p.bairros || '').toLowerCase().includes(bairroFiltro)) return false
    if (filtros.experiencia && !p[filtros.experiencia]) return false
    if (filtros.turnosSelecionados.size > 0) {
      const atendeAlgumSelecionado = [...filtros.turnosSelecionados].some(campo => !!p[campo as keyof Professor])
      if (!atendeAlgumSelecionado) return false
    }
    return true
  })
}
