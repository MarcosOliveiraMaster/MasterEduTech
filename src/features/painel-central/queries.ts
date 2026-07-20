import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where, writeBatch } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { incrementarIdAula, calcularValorAula } from './helpers'
import type { Aula, Cliente, Contrato, Professor } from './types'

export async function fetchAulasPorData(dataFiltro: string): Promise<Aula[]> {
  const q = query(collection(db, 'BancoDeAulas-Lista'), where('data', '==', dataFiltro))
  const snap = await getDocs(q)
  const aulas: Aula[] = []
  snap.forEach(d => aulas.push({ id: d.id, ...(d.data() as Omit<Aula, 'id'>) }))
  aulas.sort((a, b) => (a.horario || '').localeCompare(b.horario || ''))
  return aulas
}

/** Busca todas as aulas — usado para agregar os dados do gráfico (mesma abordagem do app original). */
export async function fetchTodasAulas(): Promise<Aula[]> {
  const snap = await getDocs(collection(db, 'BancoDeAulas-Lista'))
  const aulas: Aula[] = []
  snap.forEach(d => aulas.push({ id: d.id, ...(d.data() as Omit<Aula, 'id'>) }))
  return aulas
}

export async function updateAulaStatus(id: string, novoStatus: string): Promise<void> {
  await updateDoc(doc(db, 'BancoDeAulas-Lista', id), {
    StatusAula: novoStatus,
    ultimaAtualizacao: serverTimestamp(),
  })
}

export async function fetchAula(id: string): Promise<Aula | null> {
  const snap = await getDoc(doc(db, 'BancoDeAulas-Lista', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Aula, 'id'>) }
}

export async function updateRelatorioAula(id: string, texto: string): Promise<void> {
  await updateDoc(doc(db, 'BancoDeAulas-Lista', id), { RelatorioAula: texto })
}

export async function fetchTodosContratos(): Promise<Contrato[]> {
  const snap = await getDocs(collection(db, 'BancoDeAulas'))
  const contratos: Contrato[] = []
  snap.forEach(d => contratos.push({ id: d.id, ...(d.data() as Omit<Contrato, 'id'>) }))
  return contratos
}

/** O ID do documento em BancoDeAulas é o próprio código da contratação. */
export async function fetchContrato(codigoContratacao: string): Promise<Contrato | null> {
  const snap = await getDoc(doc(db, 'BancoDeAulas', codigoContratacao))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Contrato, 'id'>) }
}

export async function fetchAulasPorContratacao(codigoContratacao: string): Promise<Aula[]> {
  const q = query(collection(db, 'BancoDeAulas-Lista'), where('codigoContratacao', '==', codigoContratacao))
  const snap = await getDocs(q)
  const aulas: Aula[] = []
  snap.forEach(d => aulas.push({ id: d.id, ...(d.data() as Omit<Aula, 'id'>) }))
  aulas.sort((a, b) => (a.data || '').localeCompare(b.data || '') || (a.horario || '').localeCompare(b.horario || ''))
  return aulas
}

// ---- Superfície 1: edição administrativa da contratação (BancoDeAulas) ----

export interface DadosContratoAdministrativo {
  statusContrato?: string
  dataAssinaturaContrato?: string
  modoPagamento?: string
  statusPagamento?: string
  dataPrimeiraParcela?: string
  dataSegundaParcela?: string
  ObservacaoContratacao?: string
}

export async function updateContratoAdministrativo(codigoContratacao: string, dados: DadosContratoAdministrativo): Promise<void> {
  await updateDoc(doc(db, 'BancoDeAulas', codigoContratacao), {
    ...dados,
    ultimaAtualizacao: serverTimestamp(),
  })
}

// ---- Superfície 2: edição de valores financeiros (BancoDeAulas) ----

/** Recalcula ValorPacote = ValorEquipe(soma das aulas) + lucroMaster e persiste os 4 campos. */
export async function updateValoresContratacao(
  codigoContratacao: string,
  horaAulaProfessor: number,
  lucroMaster: number,
  valorEquipeSomado: number,
  somatorioDuracao: string,
): Promise<void> {
  const valorPacote = Number((valorEquipeSomado + lucroMaster).toFixed(2))
  await updateDoc(doc(db, 'BancoDeAulas', codigoContratacao), {
    horaAulaProfessor,
    lucroMaster,
    ValorEquipe: Number(valorEquipeSomado.toFixed(2)),
    ValorPacote: valorPacote,
    SomatorioDuracaoAulas: somatorioDuracao,
    ultimaAtualizacao: serverTimestamp(),
  })
}

export async function updateObservacaoContratacao(codigoContratacao: string, texto: string): Promise<void> {
  await updateDoc(doc(db, 'BancoDeAulas', codigoContratacao), {
    ObservacaoContratacao: texto,
    ultimaAtualizacao: serverTimestamp(),
  })
}

// ---- Superfície 3: editores de célula da tabela de aulas (BancoDeAulas-Lista) ----

export async function updateCampoAula(id: string, campos: Partial<Aula>): Promise<void> {
  await updateDoc(doc(db, 'BancoDeAulas-Lista', id), campos)
}

/**
 * Cria uma nova aula herdando professor/cliente/estudante/duração da última aula do contrato
 * (ordenada por `id-Aula`), com novo `id-Aula` incrementado. Paridade com `addNovaAulaLista` do legado.
 */
export async function adicionarAula(codigoContratacao: string, aulasAtuais: Aula[], horaAulaProfessor: number): Promise<string> {
  if (aulasAtuais.length === 0) throw new Error('Não é possível adicionar aula sem um cronograma existente.')
  const ordenadas = [...aulasAtuais].sort((a, b) => (a['id-Aula'] || '').localeCompare(b['id-Aula'] || ''))
  const ultima = ordenadas[ordenadas.length - 1]
  const novoIdAula = incrementarIdAula(ultima['id-Aula'] || '')

  const hoje = new Date()
  const diasSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
  const dataAtual = `${diasSemana[hoje.getDay()]} - ${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`

  const novaAula: Omit<Aula, 'id'> = {
    'id-Aula': novoIdAula,
    codigoContratacao,
    nomeCliente: ultima.nomeCliente || '',
    cpf: ultima.cpf || '',
    clienteUid: ultima.clienteUid || '',
    clientUid: ultima.clientUid || '',
    professor: ultima.professor || '',
    idProfessor: ultima.idProfessor || '',
    professorUid: ultima.professorUid || '',
    estudante: ultima.estudante || '',
    duracao: ultima.duracao || '',
    materia: ultima.materia || '',
    data: dataAtual,
    horario: ultima.horario || '',
    StatusAula: 'Pendente',
    ConfirmacaoProfessorAula: false,
    RelatorioAula: '',
    ObservacoesAula: '',
    horaAulaProfessor,
    ValorAula: calcularValorAula(ultima.duracao, horaAulaProfessor),
  }
  const ref = await addDoc(collection(db, 'BancoDeAulas-Lista'), novaAula)
  return ref.id
}

/** Hard delete em lote (paridade com o legado — sem soft-delete). */
export async function removerAulas(docIds: string[]): Promise<void> {
  const TAMANHO_LOTE = 499
  for (let i = 0; i < docIds.length; i += TAMANHO_LOTE) {
    const lote = docIds.slice(i, i + TAMANHO_LOTE)
    const batch = writeBatch(db)
    lote.forEach(id => batch.delete(doc(db, 'BancoDeAulas-Lista', id)))
    await batch.commit()
  }
}

// ---- cadastroClientes ----

export async function fetchClientePorCpf(cpf: string): Promise<Cliente | null> {
  const q = query(collection(db, 'cadastroClientes'), where('cpf', '==', cpf))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...(d.data() as Omit<Cliente, 'id'>) }
}

// ---- dataBaseProfessores ----

export async function fetchProfessores(): Promise<Professor[]> {
  const q = query(collection(db, 'dataBaseProfessores'), orderBy('nome'))
  const snap = await getDocs(q)
  const professores: Professor[] = []
  snap.forEach(d => professores.push({ id: d.id, ...(d.data() as Omit<Professor, 'id'>) }))
  return professores
}
