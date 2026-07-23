export const STATUS_PAGAMENTO_OPTIONS = [
  'Aguardando 1º Pagamento',
  'Aguardando 2º Pagamento',
  'Pagamento completo',
] as const

export type FiltroAulas = 'todos' | 'execucao' | 'completos'
export type FiltroDatas = '' | 'hoje' | 'semana'

export const SEM_PROFESSOR = '__sem-professor__'

export interface FiltroBancoAulas {
  datas: FiltroDatas
  professor: string
  aulas: FiltroAulas
  pagamento: string
  cliente: string
  codigo: string
}

/** Resumo de progresso de uma contratação, derivado das aulas vinculadas. */
export interface EstatisticasContrato {
  total: number
  concluidas: number
  comProfessor: number
}

export type StatusCardContrato = 'completo' | 'parcial' | 'sem-professor'
