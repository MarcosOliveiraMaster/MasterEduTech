import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { fetchTodosContratos } from '../painel-central/queries'
import { formatarSomatorioDuracao } from '../painel-central/helpers'
import { calcularHorasTotais, calcularValoresSimulacao, calcularValorAulaSimulacao, gerarProximoCodigoContratacao, letraSufixo, verificarAulaEmergencial } from './helpers'
import type { Simulacao } from './types'

export async function fetchSimulacoes(): Promise<Simulacao[]> {
  const snap = await getDocs(collection(db, 'simulacoes'))
  const simulacoes: Simulacao[] = []
  snap.forEach(d => {
    const dados = d.data() as Omit<Simulacao, 'id'>
    simulacoes.push({ id: d.id, ...dados, aulas: dados.aulas || [] })
  })
  simulacoes.sort((a, b) => {
    const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : (a.timestamp?.toDate?.().getTime() ?? 0)
    const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : (b.timestamp?.toDate?.().getTime() ?? 0)
    return tb - ta
  })
  return simulacoes
}

/** Upsert completo — paridade com autoSalvarSimulacao/salvarSimulacao do legado (.set() idempotente). */
export async function salvarSimulacao(simulacao: Simulacao): Promise<void> {
  const { id, ...dados } = simulacao
  await setDoc(doc(db, 'simulacoes', id), { ...dados, timestamp: serverTimestamp() }, { merge: true })
}

export async function excluirSimulacao(id: string): Promise<void> {
  await deleteDoc(doc(db, 'simulacoes', id))
}

/**
 * Converte a simulação em uma contratação real: cria o doc em BancoDeAulas, um doc por aula em
 * BancoDeAulas-Lista, e marca a simulação como aprovada. Único ponto de integração Simulações → Banco de Aulas.
 */
export async function aprovarSimulacao(simulacao: Simulacao): Promise<string> {
  const contratosExistentes = await fetchTodosContratos()
  const novoCodigoContratacao = gerarProximoCodigoContratacao(contratosExistentes.map(c => c.id))

  const valores = calcularValoresSimulacao(simulacao.aulas, !!simulacao.overrideAtivo, simulacao.valorHoraProfessor, simulacao.valorLucroMasterPorHora)
  const horas = calcularHorasTotais(simulacao.aulas)

  const batch = writeBatch(db)

  batch.set(doc(db, 'BancoDeAulas', novoCodigoContratacao), {
    nome: simulacao.nomeCliente || '',
    nomeCliente: simulacao.nomeCliente || '',
    cpf: simulacao.cpf || '',
    statusContrato: '',
    dataAssinaturaContrato: '',
    modoPagamento: simulacao.metodoPagamento || '',
    statusPagamento: '',
    dataPrimeiraParcela: simulacao.dataPrimeiraParcela || '',
    dataSegundaParcela: simulacao.dataSegundaParcela || '',
    equipe: simulacao.tipoEquipe || '',
    ValorEquipe: valores.valorEquipe,
    ValorPacote: valores.valorPacote,
    lucroMaster: valores.lucroMaster,
    horaAulaProfessor: valores.taxaProfessorEfetiva,
    SomatorioDuracaoAulas: formatarSomatorioDuracao(Math.round(horas * 60)),
    ObservacaoContratacao: '',
    aulaEmergencial: verificarAulaEmergencial(simulacao.aulas),
    timestamp: serverTimestamp(),
  })

  simulacao.aulas.forEach((aula, index) => {
    const ref = doc(collection(db, 'BancoDeAulas-Lista'))
    batch.set(ref, {
      'id-Aula': novoCodigoContratacao + letraSufixo(index),
      codigoContratacao: novoCodigoContratacao,
      nomeCliente: simulacao.nomeCliente || '',
      cpf: simulacao.cpf || '',
      data: aula.data || '',
      horario: aula.horario || '',
      duracao: aula.duracao || '',
      materia: aula.materia || '',
      estudante: aula.estudante || '',
      professor: aula.professor || '',
      idProfessor: aula.idProfessor || '',
      professorUid: aula.professorUid || '',
      cor: aula.cor || '',
      StatusAula: 'Pendente',
      ConfirmacaoProfessorAula: false,
      RelatorioAula: '',
      ObservacoesAula: '',
      horaAulaProfessor: valores.taxaProfessorEfetiva,
      ValorAula: calcularValorAulaSimulacao(aula.duracao, valores.taxaProfessorEfetiva),
      timestamp: serverTimestamp(),
    })
  })

  batch.update(doc(db, 'simulacoes', simulacao.id), {
    tituloSimulacao: `SIMULAÇÃO APROVADA - ${simulacao.tituloSimulacao || ''}`,
  })

  await batch.commit()
  return novoCodigoContratacao
}
