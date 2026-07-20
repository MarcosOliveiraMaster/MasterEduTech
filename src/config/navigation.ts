import type { IconType } from 'react-icons'
import {
  FiActivity,
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiCheckSquare,
  FiCreditCard,
  FiDatabase,
  FiDownload,
  FiFileText,
  FiGitBranch,
  FiHome,
  FiLock,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi'

/** Caminho da área de design dentro do mesmo site publicado (ver vite.config.ts). */
export const DESIGN_AREA_PATH = `${import.meta.env.BASE_URL}design/`

export interface NavLink {
  type: 'link'
  id: string
  label: string
  path: string
  icon: IconType
  /** Navegação fora do react-router (ex: micro-app de design). */
  external?: boolean
}

export interface NavGroup {
  type: 'group'
  id: string
  label: string
  icon: IconType
  children: NavItem[]
}

/** Cabeçalho de seção — apenas rótulo, sem ícone, não navegável. */
export interface NavSection {
  type: 'section'
  id: string
  label: string
}

export type NavItem = NavLink | NavGroup | NavSection

export const NAV_ITEMS: NavItem[] = [
  { type: 'section', id: 'sec-aulas', label: 'Aulas' },
  { type: 'link', id: 'painel-central', label: 'Painel Central', path: '/inicio', icon: FiHome },
  { type: 'link', id: 'banco-de-aulas', label: 'Banco de Aulas', path: '/banco-de-aulas', icon: FiBookOpen },
  { type: 'link', id: 'simulacoes', label: 'Simulações', path: '/simulacoes', icon: FiActivity },

  { type: 'section', id: 'sec-planejamento', label: 'Planejamento' },
  { type: 'link', id: 'calendario-master', label: 'Calendário Master', path: '/calendario-master', icon: FiCalendar },
  { type: 'link', id: 'demandas', label: 'Demandas', path: '/demandas', icon: FiGitBranch },

  { type: 'section', id: 'sec-dashboards', label: 'Dashboards' },
  {
    type: 'group',
    id: 'clientes',
    label: 'Clientes',
    icon: FiUsers,
    children: [
      { type: 'link', id: 'clientes-bd', label: 'Clientes', path: '/dashboard/clientes/clientes', icon: FiDatabase },
      { type: 'link', id: 'analise', label: 'Análise', path: '/dashboard/clientes/analise', icon: FiBarChart2 },
    ],
  },
  {
    type: 'group',
    id: 'professores',
    label: 'Professores',
    icon: FiUserCheck,
    children: [
      { type: 'link', id: 'pesquisa', label: 'Pesquisa', path: '/dashboard/professores/pesquisa', icon: FiSearch },
      { type: 'link', id: 'fichas', label: 'Fichas', path: '/dashboard/professores/fichas', icon: FiFileText },
      { type: 'link', id: 'selecao', label: 'Seleção', path: '/dashboard/professores/selecao', icon: FiCheckSquare },
      { type: 'link', id: 'analise', label: 'Análise', path: '/dashboard/professores/analise', icon: FiBarChart2 },
    ],
  },

  { type: 'section', id: 'sec-financeiro', label: 'Financeiro' },
  { type: 'link', id: 'pagamento-professores', label: 'Pagamento Professores', path: '/pagamento-professores', icon: FiCreditCard },
  { type: 'link', id: 'painel-financeiro', label: 'Painel Financeiro', path: '/painel-financeiro', icon: FiMessageSquare },
  { type: 'link', id: 'cofres-reservas', label: 'Cofres e Reservas', path: '/cofres-reservas', icon: FiLock },
  { type: 'link', id: 'previsao-financeira', label: 'Previsão Financeira', path: '/previsao-financeira', icon: FiTrendingUp },

  { type: 'section', id: 'sec-configuracoes', label: 'Configurações' },
  { type: 'link', id: 'exportar-dados', label: 'Exportar Dados', path: '/exportar-dados', icon: FiDownload },
  { type: 'link', id: 'configuracoes-ui', label: 'Configurações de UI', path: DESIGN_AREA_PATH, icon: FiSettings, external: true },
]
