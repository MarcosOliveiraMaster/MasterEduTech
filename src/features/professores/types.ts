/**
 * Documento da coleção Firestore `dataBaseProfessores` (cadastro mestre de professores ativos).
 * Campos preservados do legado (SistemaMaster-Central/functions-dashboardProfessor.js).
 */
export interface Professor {
  id: string
  nome?: string
  cpf?: string
  email?: string
  contato?: string
  endereco?: string
  cep?: string
  dataNascimento?: string
  nivel?: string
  curso?: string
  pix?: string
  /** String separada por vírgulas (ex: "Centro, Jatiúca") — mesmo formato salvo pelo formulário legado, não é array. */
  bairros?: string
  /** String separada por vírgulas (ex: "Matemática, Física") — mesmo formato salvo pelo formulário legado, não é array. */
  disciplinas?: string
  expAulas?: boolean
  descricaoExpAulas?: string
  expNeuro?: boolean
  descricaoExpNeuro?: string
  expTdics?: boolean
  descricaoTdics?: string
  segManha?: boolean
  segTarde?: boolean
  terManha?: boolean
  terTarde?: boolean
  quaManha?: boolean
  quaTarde?: boolean
  quiManha?: boolean
  quiTarde?: boolean
  sexManha?: boolean
  sexTarde?: boolean
  sabManha?: boolean
  sabTarde?: boolean
  /** Nome do arquivo em img-professor/ (ou 'icone-padrao') — integração de imagem real fica para depois. */
  fotoPerfil?: string
  status?: string
  uid?: string
}

/** Mesma lista fixa do formulário de cadastro/candidatura do professor (legado). */
export const DISCIPLINAS_PROFESSOR = [
  'Biologia', 'Ciências', 'Física', 'Geografia', 'História', 'Inglês',
  'Literatura', 'Matemática', 'Pedagogia', 'Português', 'Química',
] as const

export type ExperienciaKey = 'expTdics' | 'expAulas' | 'expNeuro'

export const EXPERIENCIA_OPTIONS: { key: ExperienciaKey; label: string }[] = [
  { key: 'expTdics', label: 'Tecnologias educacionais' },
  { key: 'expAulas', label: 'Experiências com aulas particulares' },
  { key: 'expNeuro', label: 'Alunos atípicos' },
]

export type DiaDisponibilidade = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab'

export const DIAS_DISPONIBILIDADE: { key: DiaDisponibilidade; label: string }[] = [
  { key: 'seg', label: 'Segunda' },
  { key: 'ter', label: 'Terça' },
  { key: 'qua', label: 'Quarta' },
  { key: 'qui', label: 'Quinta' },
  { key: 'sex', label: 'Sexta' },
  { key: 'sab', label: 'Sábado' },
]

export const TURNOS_DISPONIBILIDADE = ['Manha', 'Tarde'] as const
export type TurnoDisponibilidade = (typeof TURNOS_DISPONIBILIDADE)[number]

/** Monta a chave exata do campo booleano no Firestore (ex.: "segManha", "sabTarde"). */
export function campoDisponibilidade(dia: DiaDisponibilidade, turno: TurnoDisponibilidade): keyof Professor {
  return `${dia}${turno}` as keyof Professor
}

/** `disciplinas`/`bairros` são strings separadas por vírgula — nunca arrays. */
export function listaSeparadaPorVirgula(valor?: string): string[] {
  return (valor || '').split(',').map(v => v.trim()).filter(Boolean)
}
