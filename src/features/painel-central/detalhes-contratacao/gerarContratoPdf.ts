import { jsPDF } from 'jspdf'

/**
 * Porte de `functions-contrato.js` (SistemaMaster-Central) para TypeScript.
 * Diferença: os dados vêm prontos do state React (não são lidos do DOM como no legado).
 */

interface EstiloTitulo { tamanho: number; espacamentoAntes: number; espacamentoDepois: number }

const CONFIG_ABNT = {
  fonte: { nome: 'times', tamanhoBase: 12, linhaAltura: 14 },
  margens: { esquerda: 70.87, direita: 56.70, topo: 56.70, base: 56.70 },
  estilos: {
    h1: { tamanho: 24, espacamentoAntes: 20, espacamentoDepois: 10 } as EstiloTitulo,
    h2: { tamanho: 18, espacamentoAntes: 15, espacamentoDepois: 8 } as EstiloTitulo,
    h3: { tamanho: 14, espacamentoAntes: 12, espacamentoDepois: 6 } as EstiloTitulo,
  },
}

type Elemento =
  | { tipo: 'espaco' }
  | { tipo: 'titulo1' | 'titulo2' | 'titulo3'; conteudo: string; estilo: EstiloTitulo }
  | { tipo: 'centralizado'; conteudo: string }
  | { tipo: 'imagemAssinatura' }
  | { tipo: 'tabelaAulasAgendadas' }
  | { tipo: 'paragrafo'; conteudo: string }

export interface AulaContratoPdf {
  data: string
  hora: string
  duracao: string
  materia: string
  professor: string
  estudante: string
}

export interface DadosContratoPdf {
  nomeCliente: string
  cpfCliente: string
  enderecoCliente: string
  estudantesText: string
  seriesText: string
  totalHorasText: string
  valorPacoteText: string
  tabelaAulas: AulaContratoPdf[]
}

/** Remove os marcadores de ênfase do template (asterisco, hífen, underline) — o legado também não aplica negrito/itálico real a essas tags. */
function limparMarcadoresDeEnfase(texto: string): string {
  return texto
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/-([^-]+)-/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
}

function processarContrato(texto: string): Elemento[] {
  const linhas = texto.split(/\r?\n/)
  const elementos: Elemento[] = []

  for (const linhaRaw of linhas) {
    const linha = linhaRaw.trim()
    if (/^\s*$/.test(linha)) {
      elementos.push({ tipo: 'espaco' })
    } else if (/^###\s+(.+)/.test(linha)) {
      elementos.push({ tipo: 'titulo3', conteudo: linha.match(/^###\s+(.+)/)![1], estilo: CONFIG_ABNT.estilos.h3 })
    } else if (/^##\s+(.+)/.test(linha)) {
      elementos.push({ tipo: 'titulo2', conteudo: linha.match(/^##\s+(.+)/)![1], estilo: CONFIG_ABNT.estilos.h2 })
    } else if (/^#\s+(.+)/.test(linha)) {
      elementos.push({ tipo: 'titulo1', conteudo: linha.match(/^#\s+(.+)/)![1], estilo: CONFIG_ABNT.estilos.h1 })
    } else if (/^-.*-$/.test(linha) && linha.length > 2) {
      elementos.push({ tipo: 'centralizado', conteudo: linha.slice(1, -1).trim() })
    } else if (linha.includes('[imagemAssinatura]')) {
      elementos.push({ tipo: 'imagemAssinatura' })
    } else if (linha.includes('[FotoCronograma]')) {
      elementos.push({ tipo: 'tabelaAulasAgendadas' })
    } else {
      elementos.push({ tipo: 'paragrafo', conteudo: limparMarcadoresDeEnfase(linha) })
    }
  }
  return elementos
}

function renderizarParagrafoJustificado(doc: jsPDF, texto: string, x: number, y: number, larguraMax: number): number {
  const { fonte } = CONFIG_ABNT
  doc.setFont(fonte.nome, 'normal')
  doc.setFontSize(fonte.tamanhoBase)

  const linhas: string[] = []
  let linhaAtual = ''
  texto.split(' ').forEach(palavra => {
    const teste = linhaAtual ? `${linhaAtual} ${palavra}` : palavra
    if (doc.getTextWidth(teste) > larguraMax && linhaAtual) {
      linhas.push(linhaAtual)
      linhaAtual = palavra
    } else {
      linhaAtual = teste
    }
  })
  if (linhaAtual) linhas.push(linhaAtual)

  let yAtual = y
  linhas.forEach((linha, idx) => {
    const palavras = linha.split(' ')
    const numEspacos = palavras.length - 1
    const larguraLinha = doc.getTextWidth(linha)
    const espacoExtra = numEspacos > 0 && idx !== linhas.length - 1 ? (larguraMax - larguraLinha) / numEspacos : 0
    let xLinha = x
    palavras.forEach((palavra, i) => {
      doc.text(palavra, xLinha, yAtual)
      xLinha += doc.getTextWidth(`${palavra} `)
      if (espacoExtra && i < palavras.length - 1) xLinha += espacoExtra
    })
    yAtual += fonte.linhaAltura
  })
  return yAtual
}

function carregarImagem(src: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

async function inserirImagemAssinatura(doc: jsPDF, yAtual: number): Promise<number> {
  const img = await carregarImagem(`${import.meta.env.BASE_URL}contrato/assinatura.png`)
  if (!img) return yAtual + CONFIG_ABNT.fonte.linhaAltura
  const larguraPagina = doc.internal.pageSize.width
  const larguraImg = 180
  const alturaImg = larguraImg * (img.naturalHeight / img.naturalWidth)
  const x = (larguraPagina - larguraImg) / 2
  doc.addImage(img, 'PNG', x, yAtual, larguraImg, alturaImg)
  return yAtual + alturaImg + 5
}

function desenharTabelaAulas(doc: jsPDF, yInicial: number, tabelaAulas: AulaContratoPdf[]): number {
  if (tabelaAulas.length === 0) return yInicial
  let yAtual = yInicial + 30
  const { fonte } = CONFIG_ABNT
  const headers = ['Data da aula', 'Início', 'Duração', 'Matéria', 'Professor', 'Estudante']

  doc.setFontSize(9)
  doc.setFont(fonte.nome, 'normal')
  let materiaWidth = doc.getTextWidth('Matéria') + 12
  let estudanteWidth = doc.getTextWidth('Estudante') + 12
  let inicioWidth = doc.getTextWidth('Início') + 12
  let professorWidth = doc.getTextWidth('Professor') + 12
  tabelaAulas.forEach(row => {
    materiaWidth = Math.max(materiaWidth, doc.getTextWidth(row.materia) + 12)
    estudanteWidth = Math.max(estudanteWidth, doc.getTextWidth(row.estudante) + 12)
    inicioWidth = Math.max(inicioWidth, doc.getTextWidth(row.hora) + 12)
    professorWidth = Math.max(professorWidth, doc.getTextWidth(row.professor) + 12)
  })

  const colWidths = [80, inicioWidth, 60, materiaWidth, professorWidth, estudanteWidth]
  const totalWidth = colWidths.reduce((a, b) => a + b, 0)
  const pageWidth = doc.internal.pageSize.width
  const tableX = (pageWidth - totalWidth) / 2
  yAtual += 16

  const cellHeight = 18
  let x = tableX
  doc.setFontSize(9)
  doc.setFont(fonte.nome, 'bold')
  headers.forEach((h, i) => {
    doc.setFillColor(234, 88, 12)
    doc.setDrawColor(68, 68, 68)
    doc.rect(x, yAtual, colWidths[i], cellHeight, 'FD')
    doc.setTextColor(255, 255, 255)
    doc.text(h, x + 3, yAtual + 12)
    doc.setTextColor(0, 0, 0)
    x += colWidths[i]
  })
  yAtual += cellHeight

  doc.setFont(fonte.nome, 'normal')
  tabelaAulas.forEach(row => {
    let xLinha = tableX
    ;[row.data, row.hora, row.duracao, row.materia, row.professor, row.estudante].forEach((val, i) => {
      doc.setDrawColor(68, 68, 68)
      doc.rect(xLinha, yAtual, colWidths[i], cellHeight, 'D')
      doc.text(val, xLinha + 3, yAtual + 12)
      xLinha += colWidths[i]
    })
    yAtual += cellHeight
  })
  return yAtual
}

export async function gerarContratoPdf(dados: DadosContratoPdf): Promise<void> {
  const response = await fetch(`${import.meta.env.BASE_URL}contrato/baseContrato.txt`)
  if (!response.ok) throw new Error('Arquivo baseContrato.txt não encontrado.')
  let texto = await response.text()

  const hoje = new Date()
  const dataFormatada = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`
  texto = texto.replace(/\[DataHoje\]/g, dataFormatada)
  if (dados.nomeCliente) texto = texto.replace(/\[NomeCliente\]/gi, dados.nomeCliente)
  if (dados.cpfCliente) texto = texto.replace(/\[\s*CPFCliente\s*\]/gi, dados.cpfCliente)
  if (dados.enderecoCliente) texto = texto.replace(/\[\s*EnderecoCliente\s*\]/gi, dados.enderecoCliente)
  if (dados.estudantesText) texto = texto.replace(/\[\s*estudantes\s*\]/gi, dados.estudantesText)
  if (dados.seriesText) texto = texto.replace(/\[\s*series\s*\]/gi, dados.seriesText)
  if (dados.totalHorasText) texto = texto.replace(/\[\s*totalHoras\s*\]/gi, dados.totalHorasText)
  if (dados.valorPacoteText) texto = texto.replace(/\[\s*valorPacote\s*\]/gi, dados.valorPacoteText)

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const { margens, fonte } = CONFIG_ABNT
  const larguraUtil = doc.internal.pageSize.width - margens.esquerda - margens.direita
  let yAtual = margens.topo

  const elementos = processarContrato(texto)

  for (const elemento of elementos) {
    if (yAtual > doc.internal.pageSize.height - margens.base) {
      doc.addPage()
      yAtual = margens.topo
    }

    if (elemento.tipo === 'espaco') {
      yAtual += fonte.linhaAltura
    } else if (elemento.tipo === 'titulo1' || elemento.tipo === 'titulo2' || elemento.tipo === 'titulo3') {
      doc.setFont(fonte.nome, 'bold')
      doc.setFontSize(elemento.estilo.tamanho)
      yAtual += elemento.estilo.espacamentoAntes
      const linhasTitulo = doc.splitTextToSize(elemento.conteudo, larguraUtil)
      doc.text(linhasTitulo, margens.esquerda, yAtual)
      yAtual += linhasTitulo.length * (elemento.estilo.tamanho * 1.2) + elemento.estilo.espacamentoDepois
    } else if (elemento.tipo === 'centralizado') {
      doc.setFont(fonte.nome, 'normal')
      doc.setFontSize(fonte.tamanhoBase)
      doc.text(elemento.conteudo, doc.internal.pageSize.width / 2, yAtual, { align: 'center' })
      yAtual += fonte.linhaAltura
    } else if (elemento.tipo === 'imagemAssinatura') {
      yAtual = await inserirImagemAssinatura(doc, yAtual)
    } else if (elemento.tipo === 'tabelaAulasAgendadas') {
      yAtual = desenharTabelaAulas(doc, yAtual, dados.tabelaAulas)
    } else if (elemento.tipo === 'paragrafo') {
      yAtual = renderizarParagrafoJustificado(doc, elemento.conteudo, margens.esquerda, yAtual, larguraUtil)
      yAtual += 5
    }
  }

  doc.save('Contrato-Final.pdf')
}
