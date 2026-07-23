import type { Aula, Contrato } from '../painel-central/types'
import type { EstatisticasContrato, FiltroBancoAulas, StatusCardContrato } from './types'
import { SEM_PROFESSOR } from './types'

/** Extrai a data de uma aula no formato "ddd - dd/mm/yyyy" (mesma técnica usada em formatarDataLembrete). */
export function parseDataAula(data?: string): Date | null {
  if (!data || !data.includes('-')) return null
  const partes = data.split('-')[1]?.trim().split('/')
  if (!partes || partes.length !== 3) return null
  const dia = parseInt(partes[0], 10)
  const mes = parseInt(partes[1], 10) - 1
  const ano = parseInt(partes[2], 10)
  if (Number.isNaN(dia) || Number.isNaN(mes) || Number.isNaN(ano)) return null
  return new Date(ano, mes, dia)
}

/** Agrupa a lista completa de aulas por codigoContratacao (equivalente a AULAS_LISTA_AGRUPADAS). */
export function agruparAulasPorContrato(aulas: Aula[]): Map<string, Aula[]> {
  const grupos = new Map<string, Aula[]>()
  for (const aula of aulas) {
    const chave = aula.codigoContratacao
    if (!chave) continue
    const grupo = grupos.get(chave)
    if (grupo) grupo.push(aula)
    else grupos.set(chave, [aula])
  }
  return grupos
}

export function obterEstatisticasContrato(aulas: Aula[]): EstatisticasContrato {
  return {
    total: aulas.length,
    concluidas: aulas.filter(a => (a.StatusAula || '').toLowerCase() === 'concluída').length,
    comProfessor: aulas.filter(a => !!a.professor?.trim()).length,
  }
}

export function statusCardContrato(stats: EstatisticasContrato): StatusCardContrato {
  if (stats.total === 0 || stats.comProfessor === 0) return 'sem-professor'
  if (stats.concluidas === stats.total) return 'completo'
  return 'parcial'
}

/** "Parcial" usa cinza neutro (não amarelo) — indica ausência de conclusão, não um alerta. */
const STATUS_CARD_COLORS: Record<StatusCardContrato, { bg: string; text: string; dot: string }> = {
  completo: { bg: 'var(--c-badge-success-bg)', text: 'var(--c-badge-success-text)', dot: '#4ade80' },
  parcial: { bg: 'var(--c-badge-white-bg)', text: 'var(--c-badge-white-text)', dot: '#9CA3AF' },
  'sem-professor': { bg: 'var(--c-badge-error-bg)', text: 'var(--c-badge-error-text)', dot: '#f87171' },
}

export function getCoresStatusCard(status: StatusCardContrato) {
  return STATUS_CARD_COLORS[status]
}

const COR_PROGRESSO_CINZA_AUSENCIA = 'rgba(156, 163, 175, 0.35)'

const CORES_PROGRESSO_AULA: Record<string, string> = {
  'concluída': 'var(--c-badge-success-text)',
  reagendada: 'var(--c-badge-blue-text)',
  'reposição': 'var(--c-badge-mint-text)',
  cancelada: 'var(--c-badge-error-text)',
}

/** Cor do segmento de uma aula na barra de progresso do card. Pendente/vazio usa cinza claro (ausência de conclusão), nunca amarelo. */
export function getCorProgressoAula(status?: string): string {
  return CORES_PROGRESSO_AULA[(status || '').toLowerCase()] || COR_PROGRESSO_CINZA_AUSENCIA
}

/** Contrato tem ao menos uma aula na data de hoje. */
function temAulaHoje(aulas: Aula[]): boolean {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  return aulas.some(a => {
    const d = parseDataAula(a.data)
    return d ? d.getTime() === hoje.getTime() : false
  })
}

/** Contrato tem ao menos uma aula entre hoje e os próximos 7 dias. */
function temAulaNaSemana(aulas: Aula[]): boolean {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const limite = new Date(hoje); limite.setDate(hoje.getDate() + 7)
  return aulas.some(a => {
    const d = parseDataAula(a.data)
    return d ? d.getTime() >= hoje.getTime() && d.getTime() <= limite.getTime() : false
  })
}

function statusPendenteOuVazio(status?: string): boolean {
  const s = (status || '').trim().toLowerCase()
  return s === '' || s === 'pendente'
}

/** Filtro combinado — paridade com applyAulasFilters do legado, incluindo a regra de mutual exclusão (ver useFiltroBancoAulas). */
export function filtrarContratos(
  contratos: Contrato[],
  aulasPorContrato: Map<string, Aula[]>,
  filtro: FiltroBancoAulas,
): Contrato[] {
  return contratos.filter(contrato => {
    const aulas = aulasPorContrato.get(contrato.id) || []

    if (filtro.datas === 'hoje' && !temAulaHoje(aulas)) return false
    if (filtro.datas === 'semana' && !temAulaNaSemana(aulas)) return false

    if (filtro.professor === SEM_PROFESSOR) {
      if (aulas.some(a => !!a.professor?.trim())) return false
    } else if (filtro.professor) {
      const alvo = filtro.professor.toLowerCase()
      if (!aulas.some(a => (a.professor || '').toLowerCase().includes(alvo))) return false
    }

    if (filtro.pagamento && contrato.statusPagamento !== filtro.pagamento) return false
    if (filtro.cliente && contrato.cpf !== filtro.cliente) return false
    if (filtro.codigo && !contrato.id.toLowerCase().includes(filtro.codigo.toLowerCase())) return false

    if (filtro.aulas === 'execucao') {
      if (!aulas.some(a => statusPendenteOuVazio(a.StatusAula))) return false
    } else if (filtro.aulas === 'completos') {
      if (aulas.length === 0) return false
      if (!aulas.every(a => ['concluída', 'reposição'].includes((a.StatusAula || '').toLowerCase()))) return false
    }

    return true
  })
}
