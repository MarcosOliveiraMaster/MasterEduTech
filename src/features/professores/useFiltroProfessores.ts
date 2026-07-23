import { useState } from 'react'
import { campoDisponibilidade, type DiaDisponibilidade, type ExperienciaKey, type TurnoDisponibilidade } from './types'

function toggleNoSet<T>(set: Set<T>, valor: T): Set<T> {
  const novo = new Set(set)
  if (novo.has(valor)) novo.delete(valor)
  else novo.add(valor)
  return novo
}

/** Estado do painel de filtros — compartilhado entre Pesquisa e Tabela de professores. */
export function useFiltroProfessores() {
  const [nome, setNome] = useState('')
  const [disciplina, setDisciplina] = useState('')
  const [bairro, setBairro] = useState('')
  const [experiencia, setExperiencia] = useState<ExperienciaKey | ''>('')
  const [turnosSelecionados, setTurnosSelecionados] = useState<Set<string>>(new Set())

  function alternarTurno(dia: DiaDisponibilidade, turno: TurnoDisponibilidade) {
    setTurnosSelecionados(atual => toggleNoSet(atual, campoDisponibilidade(dia, turno) as string))
  }

  return {
    nome, setNome,
    disciplina, setDisciplina,
    bairro, setBairro,
    experiencia, setExperiencia,
    turnosSelecionados, alternarTurno,
  }
}
