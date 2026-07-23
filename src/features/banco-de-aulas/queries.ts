import { deleteDoc, doc, writeBatch } from 'firebase/firestore'
import { db } from '../../lib/firebase'

/**
 * Exclui a contratação e todas as aulas vinculadas (hard delete, sem soft-delete — paridade com o legado).
 * O doc de BancoDeAulas é excluído à parte pois writeBatch tem limite de 500 operações por lote.
 */
export async function excluirContratacao(codigoContratacao: string, aulaIds: string[]): Promise<void> {
  const TAMANHO_LOTE = 499
  for (let i = 0; i < aulaIds.length; i += TAMANHO_LOTE) {
    const lote = aulaIds.slice(i, i + TAMANHO_LOTE)
    const batch = writeBatch(db)
    lote.forEach(id => batch.delete(doc(db, 'BancoDeAulas-Lista', id)))
    await batch.commit()
  }
  await deleteDoc(doc(db, 'BancoDeAulas', codigoContratacao))
}
