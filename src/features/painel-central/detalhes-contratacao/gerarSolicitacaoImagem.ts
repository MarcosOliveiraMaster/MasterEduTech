import html2canvas from 'html2canvas'

/**
 * Captura o elemento de preview da "Solicitação" como PNG e dispara o download.
 * Paridade com o legado (functions-banco-de-aulas-Cards.js) — 100% client-side, sem escrita no Firestore.
 */
export async function gerarSolicitacaoImagemPng(previewElement: HTMLElement, filename = 'solicitacao-aula.png'): Promise<void> {
  const canvas = await html2canvas(previewElement, { backgroundColor: '#ffffff', scale: 2 })
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}
