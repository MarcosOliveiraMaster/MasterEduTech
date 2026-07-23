import { parseDuracaoParaHoras, formatarSomatorioDuracao } from '../painel-central/helpers'
import type { AulaSimulacao, FiltroSimulacoes, Simulacao } from './types'

const TAXA_PROFESSOR_PADRAO = 35
const LUCRO_POR_HORA_PADRAO = 30

/** Tabela progressiva de valor/hora do pacote — paridade com calcularValoresSimulacao do legado. */
const TABELA_PROGRESSIVA = [
  { max: 4, valorHora: 65 },
  { max: 9, valorHora: 63.5 },
  { max: 14, valorHora: 62 },
  { max: 19, valorHora: 61.5 },
  { max: Infinity, valorHora: 60.5 },
]

export function calcularHorasTotais(aulas: AulaSimulacao[]): number {
  return aulas.reduce((total, a) => total + parseDuracaoParaHoras(a.duracao), 0)
}

export interface ValoresSimulacao {
  horas: number
  valorEquipe: number
  valorPacote: number
  lucroMaster: number
  /** Taxa/hora efetiva do professor (35 padrão, ou override) — usada no ValorAula de cada linha do cronograma. */
  taxaProfessorEfetiva: number
  /** Valor/hora do pacote (blended) — usado apenas para exibição na box de valores. */
  valorHoraAulaDisplay: number
}

/**
 * Motor de cálculo — paridade com a precedência do legado (regraNovoValorOverride):
 * sem override → tabela progressiva; com override → ValorEquipe pela taxa efetiva (35 padrão)
 * e ValorPacote = ValorEquipe + lucro/hora (customizado ou R$30 padrão).
 */
export function calcularValoresSimulacao(
  aulas: AulaSimulacao[],
  overrideAtivo: boolean,
  valorHoraProfessor?: number | null,
  valorLucroMasterPorHora?: number | null,
): ValoresSimulacao {
  const horas = calcularHorasTotais(aulas)

  if (!overrideAtivo) {
    const tabela = TABELA_PROGRESSIVA.find(t => horas <= t.max) || TABELA_PROGRESSIVA[TABELA_PROGRESSIVA.length - 1]
    const valorEquipe = Number((horas * TAXA_PROFESSOR_PADRAO).toFixed(2))
    const valorPacote = Number((horas * tabela.valorHora).toFixed(2))
    return {
      horas, valorEquipe, valorPacote,
      lucroMaster: Number((valorPacote - valorEquipe).toFixed(2)),
      taxaProfessorEfetiva: TAXA_PROFESSOR_PADRAO,
      valorHoraAulaDisplay: tabela.valorHora,
    }
  }

  const taxaEfetiva = valorHoraProfessor && valorHoraProfessor > 0 ? valorHoraProfessor : TAXA_PROFESSOR_PADRAO
  const valorEquipe = Number((horas * taxaEfetiva).toFixed(2))
  const lucroPorHora = valorLucroMasterPorHora && valorLucroMasterPorHora > 0 ? valorLucroMasterPorHora : LUCRO_POR_HORA_PADRAO
  const valorPacote = Number((valorEquipe + lucroPorHora * horas).toFixed(2))
  return {
    horas, valorEquipe, valorPacote,
    lucroMaster: Number((valorPacote - valorEquipe).toFixed(2)),
    taxaProfessorEfetiva: taxaEfetiva,
    valorHoraAulaDisplay: horas > 0 ? Number((valorPacote / horas).toFixed(2)) : taxaEfetiva + lucroPorHora,
  }
}

export function calcularValorAulaSimulacao(duracao: string | undefined, taxaProfessorEfetiva: number): number {
  return Number((parseDuracaoParaHoras(duracao) * taxaProfessorEfetiva).toFixed(2))
}

export function formatarTotalHorasSimulacao(horas: number): string {
  return formatarSomatorioDuracao(Math.round(horas * 60))
}

/** Sufixo alfabético estilo planilha: 0→A, 1→B, ..., 25→Z, 26→AA, ... */
export function letraSufixo(index: number): string {
  let n = index
  let letras = ''
  do {
    letras = String.fromCharCode(65 + (n % 26)) + letras
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return letras
}

/** Incrementa um id de simulação base-26 de 3 letras: 'AAA' → 'AAB' → ... → 'AZZ' → 'BAA' → ... */
export function incrementarIdSimulacao(atual: string): string {
  const letras = atual.padEnd(3, 'A').split('')
  let i = letras.length - 1
  let carry = true
  while (carry && i >= 0) {
    if (letras[i] === 'Z') { letras[i] = 'A'; i-- }
    else { letras[i] = String.fromCharCode(letras[i].charCodeAt(0) + 1); carry = false }
  }
  return letras.join('')
}

/** Próximo idSimulacao a partir da lista já carregada (evita uma query extra — reaproveita os dados do grid). */
export function gerarProximoIdSimulacao(simulacoes: Simulacao[]): string {
  if (simulacoes.length === 0) return 'AAA'
  const maiorId = simulacoes.map(s => s.id).sort().at(-1)!
  return incrementarIdSimulacao(maiorId)
}

/** Próximo codigoContratacao (BancoDeAulas) a partir da lista de contratos já carregada — numérico, padStart(4,'0'). */
export function gerarProximoCodigoContratacao(codigosExistentes: string[]): string {
  const maior = codigosExistentes.reduce((max, id) => {
    const n = parseInt(id, 10)
    return !isNaN(n) && n > max ? n : max
  }, 0)
  return String(maior + 1).padStart(4, '0')
}

/** Paridade com applySimulacoesFilters do legado — AND entre os 4 campos, todos opcionais. */
export function filtrarSimulacoes(simulacoes: Simulacao[], filtro: FiltroSimulacoes): Simulacao[] {
  const nomeCliente = filtro.nomeCliente.trim().toLowerCase()
  const cpf = filtro.cpf.trim()
  const professor = filtro.professor.trim().toLowerCase()
  const nomeSimulacao = filtro.nomeSimulacao.trim().toLowerCase()

  return simulacoes.filter(s => {
    if (nomeCliente && !(s.nomeCliente || '').toLowerCase().includes(nomeCliente)) return false
    if (cpf && s.cpf !== cpf) return false
    if (nomeSimulacao && !(s.tituloSimulacao || '').toLowerCase().includes(nomeSimulacao)) return false
    if (professor && !s.aulas.some(a => (a.professor || '').toLowerCase().includes(professor))) return false
    return true
  })
}

/** 'Sim' se alguma aula do cronograma cai em hoje ou amanhã — gravado apenas na aprovação. */
export function verificarAulaEmergencial(aulas: AulaSimulacao[]): 'Sim' | 'Não' {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const amanha = new Date(hoje); amanha.setDate(hoje.getDate() + 1)
  return aulas.some(a => {
    if (!a.data || !a.data.includes('-')) return false
    const partes = a.data.split('-')[1]?.trim().split('/')
    if (partes?.length !== 3) return false
    const [dia, mes, ano] = partes.map(Number)
    const d = new Date(ano, mes - 1, dia)
    return d.getTime() === hoje.getTime() || d.getTime() === amanha.getTime()
  }) ? 'Sim' : 'Não'
}
