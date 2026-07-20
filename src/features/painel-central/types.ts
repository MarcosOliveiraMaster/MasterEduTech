import type { Timestamp } from 'firebase/firestore'

/** Documento da coleção Firestore `BancoDeAulas-Lista`. */
export interface Aula {
  id: string
  /** Chave lógica do legado, formato "0001A" (prefixo = codigoContratacao + sufixo alfabético). */
  'id-Aula'?: string
  nomeCliente?: string
  estudante?: string
  professor?: string
  materia?: string
  horario?: string
  duracao?: string
  /** Formato "ddd - dd/mm/yyyy", ex.: "seg - 27/05/2026". */
  data?: string
  ConfirmacaoProfessorAula?: boolean
  StatusAula?: string
  RelatorioAula?: string
  /** Observações da aula individual — distinto de `ObservacaoContratacao` (do contrato). */
  ObservacoesAula?: string
  codigoContratacao?: string
  idProfessor?: string
  professorUid?: string
  clienteUid?: string
  clientUid?: string
  cpf?: string
  /** Sempre derivado (duração × horaAulaProfessor) — nunca digitado pelo usuário. */
  ValorAula?: number
  horaAulaProfessor?: number
  cor?: string
}

export const STATUS_OPTIONS = ['Pendente', 'Reagendada', 'Concluída', 'Reposição', 'Cancelada'] as const
export type StatusAulaValue = (typeof STATUS_OPTIONS)[number]

export const DURACAO_OPTIONS = ['1h00', '1h30', '2h00', '2h30', '3h00'] as const
export type DuracaoValue = (typeof DURACAO_OPTIONS)[number]

export const MATERIA_OPTIONS = [
  'Biologia', 'Ciências', 'Filosofia', 'Física', 'Geografia', 'História',
  'Língua Portuguesa', 'Língua Inglesa', 'Matemática', 'Química', 'Redação', 'Sociologia', 'Pedagogia',
] as const
export const MATERIA_A_DEFINIR = 'A definir'
export const MAX_MATERIAS_SELECIONADAS = 5

/** Documento da coleção Firestore `BancoDeAulas` (contratos/contratações). */
export interface Contrato {
  id: string
  nome?: string
  nomeCliente?: string
  cpf?: string
  statusPagamento?: string
  statusContrato?: string
  modoPagamento?: string
  dataPrimeiraParcela?: string | Timestamp
  dataSegundaParcela?: string | Timestamp
  dataAssinaturaContrato?: string | Timestamp
  timestamp?: string | Timestamp | Date
  equipe?: string
  estudante?: string
  serie?: string
  /** Fallback local de endereço, usado só quando a busca em `cadastroClientes` por CPF falha. */
  endereco?: string
  enderecoAulas?: string
  ValorPacote?: number
  ValorEquipe?: number
  lucroMaster?: number
  horaAulaProfessor?: number
  /** String formatada "Xh MM" (ex. "10h 30") — não é number. */
  SomatorioDuracaoAulas?: string
  /** Observação da contratação (singular) — distinto de `ObservacoesAula` (por aula). */
  ObservacaoContratacao?: string
  ultimaAtualizacao?: string | Timestamp
}

export interface EstudanteCliente {
  nomeEstudante?: string
  serieEstudante?: string
  escolaEstudante?: string
}

/** Documento da coleção Firestore `cadastroClientes`. */
export interface Cliente {
  id: string
  nome?: string
  cpf?: string
  email?: string
  contato?: string
  cep?: string
  endereco?: string
  cidadeUF?: string
  complemento?: string
  mesmoEndereco?: boolean
  enderecoAulas?: string
  cepAulas?: string
  cidadeUFAulas?: string
  complementoAulas?: string
  confirmaNF?: boolean
  nfNome?: string
  nfCpf?: string
  nfEndereco?: string
  nfEmail?: string
  estudantes?: EstudanteCliente[]
  status?: string
  dataCadastroLegivel?: string
}

/** Documento da coleção Firestore `dataBaseProfessores`. */
export interface Professor {
  id: string
  nome?: string
  cpf?: string
  uid?: string
}

export type PeriodoGrafico = 'Mensal' | 'Semanal'
