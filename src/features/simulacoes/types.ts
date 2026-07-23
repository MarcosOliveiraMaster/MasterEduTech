import type { Timestamp } from 'firebase/firestore'

/** Uma aula dentro do cronograma da simulação — embutida no documento, não é um doc separado (diferente de BancoDeAulas-Lista). */
export interface AulaSimulacao {
  data?: string
  horario?: string
  duracao?: string
  materia?: string
  estudante?: string
  professor?: string
  idProfessor?: string
  professorUid?: string
  cor?: string
}

/** Documento da coleção Firestore `simulacoes` — proposta de contratação, ainda não convertida em contrato real. */
export interface Simulacao {
  id: string
  tituloSimulacao?: string
  nomeCliente?: string
  cpf?: string
  metodoPagamento?: string
  dataPrimeiraParcela?: string
  dataSegundaParcela?: string
  tipoEquipe?: string
  aulas: AulaSimulacao[]
  /** true quando o usuário aplicou valores customizados (modal "Novo Valor") em vez da tabela progressiva padrão. */
  overrideAtivo?: boolean
  valorHoraProfessor?: number | null
  valorLucroMasterPorHora?: number | null
  timestamp?: Timestamp | Date
}

export const METODO_PAGAMENTO_OPTIONS = ['Pix completo', 'Pix parcelado', 'Cartão de crédito'] as const
export const TIPO_EQUIPE_OPTIONS = ['Manter Equipe', 'Sem preferência de Equipe'] as const

export interface FiltroSimulacoes {
  nomeCliente: string
  cpf: string
  professor: string
  nomeSimulacao: string
}
