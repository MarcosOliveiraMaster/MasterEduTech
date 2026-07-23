import type { Professor } from './types'

export type ColunaTipo = 'texto' | 'booleano' | 'whatsapp'

export interface ColunaProfessor {
  key: keyof Professor
  label: string
  tipo: ColunaTipo
}

/** Coluna fixa (congelada) — sempre visível, não faz parte do seletor. */
export const COLUNA_NOME: ColunaProfessor = { key: 'nome', label: 'Nome completo', tipo: 'texto' }

/** Chaves visíveis por padrão ao abrir a Tabela (além do nome, que já é fixo). */
export const CHAVES_COLUNAS_PADRAO: (keyof Professor)[] = ['cpf', 'email', 'contato']

/** Todas as colunas do cadastro de professor que podem ser exibidas na tabela (exceto nome, que é fixo). */
export const COLUNAS_DISPONIVEIS: ColunaProfessor[] = [
  { key: 'cpf', label: 'CPF', tipo: 'texto' },
  { key: 'email', label: 'E-mail', tipo: 'texto' },
  { key: 'contato', label: 'Contato', tipo: 'whatsapp' },
  { key: 'endereco', label: 'Endereço', tipo: 'texto' },
  { key: 'cep', label: 'CEP', tipo: 'texto' },
  { key: 'dataNascimento', label: 'Data de Nascimento', tipo: 'texto' },
  { key: 'nivel', label: 'Nível', tipo: 'texto' },
  { key: 'curso', label: 'Curso', tipo: 'texto' },
  { key: 'pix', label: 'Pix', tipo: 'texto' },
  { key: 'bairros', label: 'Bairros', tipo: 'texto' },
  { key: 'disciplinas', label: 'Disciplinas', tipo: 'texto' },
  { key: 'expAulas', label: 'Exp. Aulas Particulares', tipo: 'booleano' },
  { key: 'descricaoExpAulas', label: 'Descrição - Aulas Particulares', tipo: 'texto' },
  { key: 'expNeuro', label: 'Exp. Alunos Atípicos', tipo: 'booleano' },
  { key: 'descricaoExpNeuro', label: 'Descrição - Alunos Atípicos', tipo: 'texto' },
  { key: 'expTdics', label: 'Exp. Tecnologias Educacionais', tipo: 'booleano' },
  { key: 'descricaoTdics', label: 'Descrição - Tecnologias Educacionais', tipo: 'texto' },
  { key: 'segManha', label: 'Segunda - Manhã', tipo: 'booleano' },
  { key: 'segTarde', label: 'Segunda - Tarde', tipo: 'booleano' },
  { key: 'terManha', label: 'Terça - Manhã', tipo: 'booleano' },
  { key: 'terTarde', label: 'Terça - Tarde', tipo: 'booleano' },
  { key: 'quaManha', label: 'Quarta - Manhã', tipo: 'booleano' },
  { key: 'quaTarde', label: 'Quarta - Tarde', tipo: 'booleano' },
  { key: 'quiManha', label: 'Quinta - Manhã', tipo: 'booleano' },
  { key: 'quiTarde', label: 'Quinta - Tarde', tipo: 'booleano' },
  { key: 'sexManha', label: 'Sexta - Manhã', tipo: 'booleano' },
  { key: 'sexTarde', label: 'Sexta - Tarde', tipo: 'booleano' },
  { key: 'sabManha', label: 'Sábado - Manhã', tipo: 'booleano' },
  { key: 'sabTarde', label: 'Sábado - Tarde', tipo: 'booleano' },
  { key: 'fotoPerfil', label: 'Foto de Perfil', tipo: 'texto' },
  { key: 'status', label: 'Status', tipo: 'texto' },
  { key: 'uid', label: 'UID', tipo: 'texto' },
]
