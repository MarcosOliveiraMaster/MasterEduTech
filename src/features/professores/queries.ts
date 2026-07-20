import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Professor } from './types'

/** Carga completa ordenada por nome — mesma abordagem do legado (filtragem 100% client-side, sem paginação). */
export async function fetchProfessores(): Promise<Professor[]> {
  const q = query(collection(db, 'dataBaseProfessores'), orderBy('nome'))
  const snap = await getDocs(q)
  const professores: Professor[] = []
  snap.forEach(d => professores.push({ id: d.id, ...(d.data() as Omit<Professor, 'id'>) }))
  return professores
}
