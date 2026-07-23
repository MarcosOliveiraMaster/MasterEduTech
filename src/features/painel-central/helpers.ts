import type { Timestamp } from 'firebase/firestore'
import type { Aula, Cliente, Professor } from './types'

const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

/** Formata uma data no formato usado pela coleção BancoDeAulas-Lista: "ddd - dd/mm/yyyy". */
export function formatarDataInput(date: Date): string {
  const dia = DIAS_SEMANA[date.getDay()]
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dia} - ${dd}/${mm}/${yyyy}`
}

/** Paleta de badge (tokens do design system — se adapta a claro/escuro/fim de tarde/clássico). */
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pendente:   { bg: 'var(--c-badge-warning-bg)', text: 'var(--c-badge-warning-text)' },
  reagendada: { bg: 'var(--c-badge-blue-bg)', text: 'var(--c-badge-blue-text)' },
  concluída:  { bg: 'var(--c-badge-success-bg)', text: 'var(--c-badge-success-text)' },
  reposição:  { bg: 'var(--c-badge-mint-bg)', text: 'var(--c-badge-mint-text)' },
  cancelada:  { bg: 'var(--c-badge-error-bg)', text: 'var(--c-badge-error-text)' },
}

export function getStatusColors(status?: string) {
  return STATUS_COLORS[(status || 'pendente').toLowerCase()] || STATUS_COLORS.pendente
}

function timestampToDate(value: string | Timestamp | Date | undefined): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'object' && 'toDate' in value) return value.toDate()
  if (typeof value === 'string') {
    const partes = value.split('/')
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10)
      const mes = parseInt(partes[1], 10) - 1
      const ano = parseInt(partes[2], 10)
      return new Date(ano, mes, dia)
    }
  }
  return null
}

export { timestampToDate }

/** Formata um timestamp/string de contrato no formato "ddd - dd/mm/yyyy". */
export function formatarDataContrato(value: string | Timestamp | Date | undefined): string {
  const data = timestampToDate(value)
  if (!data) return 'Data inválida'
  const dia = DIAS_SEMANA[data.getDay()]
  const dd = String(data.getDate()).padStart(2, '0')
  const mm = String(data.getMonth() + 1).padStart(2, '0')
  const yyyy = data.getFullYear()
  return `${dia} - ${dd}/${mm}/${yyyy}`
}

export function limparDadosInvalidos(valor?: string): string {
  if (!valor || valor === 'undefined' || valor.includes('NaN') || valor === '--') return '--'
  return valor
}

export function getCorStatusPagamento(status?: string): { bg: string; text: string } {
  const s = (status || '').toLowerCase()
  if (s.includes('completo') || s.includes('pago') || s.includes('efetuado')) return { bg: 'var(--c-badge-success-bg)', text: 'var(--c-badge-success-text)' }
  if (s.includes('pendente') || s.includes('aguardando')) return { bg: 'var(--c-badge-warning-bg)', text: 'var(--c-badge-warning-text)' }
  if (s.includes('cancelado') || s.includes('vencido')) return { bg: 'var(--c-badge-error-bg)', text: 'var(--c-badge-error-text)' }
  if (s.includes('parcial') || s.includes('processando')) return { bg: 'var(--c-badge-blue-bg)', text: 'var(--c-badge-blue-text)' }
  return { bg: 'var(--c-badge-white-bg)', text: 'var(--c-badge-white-text)' }
}

/** Calcula a semana (0-4) do mês em que uma data cai, contando a partir do 1º domingo. */
export function calcularSemanaAtual(data: Date = new Date()): number {
  const ano = data.getFullYear()
  const mes = data.getMonth()
  const primeiroDiaDoMes = new Date(ano, mes, 1)
  const primeiroDias = primeiroDiaDoMes.getDay()
  const primeiroDomingoDoMes = new Date(primeiroDiaDoMes)
  primeiroDomingoDoMes.setDate(1 - primeiroDias)
  const diffMs = data.getTime() - primeiroDomingoDoMes.getTime()
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const semana = Math.floor(diffDias / 7)
  return Math.min(Math.max(semana, 0), 4)
}

function getDoisNomes(nome?: string): string {
  if (!nome) return ''
  const partes = nome.trim().split(/\s+/)
  return partes.length <= 2 ? nome : `${partes[0]} ${partes[1]}`
}

/** Mensagem de lembrete copiada para o professor (sobre um cliente/aula). */
export function montarLembreteProfessor(professor: string | undefined, dataAula: string | undefined, horario: string | undefined): string {
  const { texto, formatada } = formatarDataLembrete(dataAula)
  return `🔔 Mensagem lembrete!\nAtendimento de ${texto}${formatada}.\n\nProf. ${getDoisNomes(professor)} às ${horario}`
}

/** Mensagem de lembrete copiada para o cliente. */
export function montarLembreteCliente(nomeCliente: string | undefined, dataAula: string | undefined, horario: string | undefined): string {
  const { texto, formatada } = formatarDataLembrete(dataAula)
  return `🔔 Mensagem lembrete!\nAtendimento de ${texto}${formatada}.\n\n${getDoisNomes(nomeCliente)} às ${horario}`
}

function formatarDataLembrete(dataAula?: string): { texto: string; formatada: string } {
  let texto = 'Aula do dia: '
  let formatada = dataAula || ''
  try {
    if (dataAula && dataAula.includes('-')) {
      const partes = dataAula.split('-')[1].trim().split('/')
      const dia = parseInt(partes[0], 10)
      const mes = parseInt(partes[1], 10)
      const ano = parseInt(partes[2], 10)
      const dataObj = new Date(ano, mes - 1, dia)
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const amanha = new Date(hoje)
      amanha.setDate(hoje.getDate() + 1)
      const diasSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
      const diaSemana = diasSemana[dataObj.getDay()]
      formatada = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')} - ${diaSemana}`
      if (dataObj.getTime() === hoje.getTime()) texto = 'Hoje, '
      else if (dataObj.getTime() === amanha.getTime()) texto = 'Amanhã, '
    }
  } catch {
    // mantém o valor original em caso de formato inesperado
  }
  return { texto, formatada }
}

/** Converte string de duração ("1h30", "2h00") em horas decimais. Formato confirmado no legado: /(\d+)h(\d+)/. */
export function parseDuracaoParaHoras(duracao?: string): number {
  if (!duracao) return 0
  const m = duracao.match(/(\d+)h(\d+)/)
  if (!m) return 0
  return parseInt(m[1], 10) + parseInt(m[2], 10) / 60
}

/** ValorAula é sempre derivado — nunca digitado pelo usuário (paridade com o legado). */
export function calcularValorAula(duracao: string | undefined, horaAulaProfessor: number): number {
  const horas = parseDuracaoParaHoras(duracao)
  return Number((horas * (horaAulaProfessor || 0)).toFixed(2))
}

/** Soma a duração das aulas em minutos, EXCLUINDO aulas com status "Reagendada" (paridade exata com o legado). */
export function calcularTotalMinutosAulas(aulas: Aula[]): number {
  return aulas.reduce((total, a) => {
    if ((a.StatusAula || 'Pendente') === 'Reagendada') return total
    return total + Math.round(parseDuracaoParaHoras(a.duracao) * 60)
  }, 0)
}

/**
 * Soma o valor de TODAS as aulas (sem excluir "Reagendada" — diferente do total de horas acima,
 * é uma inconsistência real preservada do legado) recalculado com o `horaAulaProfessor` atual.
 */
export function calcularSomaValorAulas(aulas: Aula[], horaAulaProfessor: number): number {
  return Number(aulas.reduce((total, a) => total + calcularValorAula(a.duracao, horaAulaProfessor), 0).toFixed(2))
}

/** Formata o total de minutos como "Xh MM" — mesmo formato salvo em SomatorioDuracaoAulas no legado (sem sufixo "m"). */
export function formatarSomatorioDuracao(totalMinutos: number): string {
  const horas = Math.floor(totalMinutos / 60)
  const minutos = totalMinutos % 60
  return `${horas}h ${String(minutos).padStart(2, '0')}`
}

/**
 * Incrementa o sufixo alfabético de um `id-Aula` (ex.: "0001A" → "0001B", "0001Z" → "0001AA").
 * Algoritmo idêntico ao legado (banco.js: incrementarIdAula) — formato esperado: 4 dígitos + letras.
 */
export function incrementarIdAula(idAulaAtual: string): string {
  const match = idAulaAtual.match(/^(\d{4})([A-Z]+)$/)
  if (!match) throw new Error(`Formato de id-Aula inválido: ${idAulaAtual}`)
  const prefixo = match[1]
  const letras = match[2].split('')
  let i = letras.length - 1
  let carry = true
  while (carry && i >= 0) {
    if (letras[i] === 'Z') { letras[i] = 'A'; i-- }
    else { letras[i] = String.fromCharCode(letras[i].charCodeAt(0) + 1); carry = false }
  }
  if (carry) letras.unshift('A')
  return prefixo + letras.join('')
}

/** Resolve os dados fiscais para NF-e: usa os campos `nf*` só quando `confirmaNF` é true e o campo não está vazio. */
export function resolverDadosFiscais(cliente: Cliente): { nome: string; cpf: string; endereco: string; email: string; cep: string } {
  const usarNf = !!cliente.confirmaNF
  return {
    nome: (usarNf ? (cliente.nfNome || cliente.nome) : cliente.nome) || '',
    cpf: (usarNf ? (cliente.nfCpf || cliente.cpf) : cliente.cpf) || '',
    endereco: (usarNf ? (cliente.nfEndereco || cliente.endereco) : cliente.endereco) || '',
    email: (usarNf ? (cliente.nfEmail || cliente.email) : cliente.email) || '',
    cep: cliente.cep || '',
  }
}

/** Monta a mensagem de NF-e (paridade com o texto usado no legado, mesma estrutura nos dois pontos de uso). */
export function montarMsgNfe(dados: { nome: string; endereco: string; cep: string; cpf: string; email: string; valor?: string }): string {
  return `Nota Fiscal
Nome: ${dados.nome}
Endereço: ${dados.endereco} - CEP: ${dados.cep}
CPF: ${dados.cpf}
Email: ${dados.email}
Valor: ${dados.valor || ''}

Descritivo
A presente nota fiscal refere-se aos serviços contratados de aulas particulares.`
}

/** Formata uma lista de matérias selecionadas como "Mat1, Mat2 e Mat3" (mesmo padrão do legado). */
export function formatarMateriasMultiplas(materias: string[]): string {
  if (materias.length === 0) return 'A definir'
  if (materias.length === 1) return materias[0]
  return `${materias.slice(0, -1).join(', ')} e ${materias[materias.length - 1]}`
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

/** Nomes distintos de professores para popular selects de filtro — a base tem CPFs/docs duplicados com o mesmo nome. */
export function nomesProfessoresUnicos(professores: Professor[]): string[] {
  return Array.from(new Set(professores.map(p => p.nome || '').filter(Boolean))).sort((a, b) => a.localeCompare(b))
}
