import React, { useEffect, useRef, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { Checkbox } from '../../components/Input'
import { COLUNAS_DISPONIVEIS } from './columns'
import type { Professor } from './types'

interface SeletorColunasProps {
  colunasVisiveis: Set<keyof Professor>
  onAlternar: (chave: keyof Professor) => void
}

/** Dropdown com checkboxes para escolher quais colunas do cadastro de professor aparecem na tabela. */
export const SeletorColunas: React.FC<SeletorColunasProps> = ({ colunasVisiveis, onAlternar }) => {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" className="seletor-colunas-btn" onClick={() => setAberto(a => !a)}>
        Colunas ({colunasVisiveis.size})
        <FiChevronDown size={14} style={{ transform: aberto ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
      </button>
      {aberto && (
        <div className="seletor-colunas-painel glass-lg">
          {COLUNAS_DISPONIVEIS.map(coluna => (
            <div key={String(coluna.key)} className="seletor-colunas-item">
              <Checkbox
                label={coluna.label}
                checked={colunasVisiveis.has(coluna.key)}
                onChange={() => onAlternar(coluna.key)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
