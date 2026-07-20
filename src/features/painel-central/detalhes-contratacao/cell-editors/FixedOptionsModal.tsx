import React, { useState } from 'react'
import { FiCheck, FiLoader } from 'react-icons/fi'
import { Modal } from '../../../../components/Modal'
import { Button } from '../../../../components/Button'

interface FixedOptionsModalProps {
  title: string
  options: readonly string[]
  selected: string[]
  multi?: boolean
  maxSelecoes?: number
  onClose: () => void
  onSave: (novaSelecao: string[]) => Promise<void>
}

/** Cobre os editores de opção fixa do legado: Status (single), Duração (single), Matéria (multi, max 5). */
export const FixedOptionsModal: React.FC<FixedOptionsModalProps> = ({
  title, options, selected, multi = false, maxSelecoes, onClose, onSave,
}) => {
  const [selecaoAtual, setSelecaoAtual] = useState<string[]>(selected)
  const [salvando, setSalvando] = useState(false)

  async function handleSalvar(novaSelecao: string[]) {
    setSalvando(true)
    try {
      await onSave(novaSelecao)
      onClose()
    } finally {
      setSalvando(false)
    }
  }

  function handleClickOpcao(opcao: string) {
    if (!multi) {
      handleSalvar([opcao])
      return
    }
    setSelecaoAtual(prev => {
      if (prev.includes(opcao)) return prev.filter(o => o !== opcao)
      if (maxSelecoes && prev.length >= maxSelecoes) return prev
      return [...prev, opcao]
    })
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={multi ? (
        <>
          <Button variant="secondary" onClick={onClose} disabled={salvando}>Cancelar</Button>
          <Button variant="primary" onClick={() => handleSalvar(selecaoAtual)} loading={salvando}>Salvar</Button>
        </>
      ) : (
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
      )}
    >
      {maxSelecoes && (
        <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--c-text-3)' }}>
          Selecione até {maxSelecoes} opções ({selecaoAtual.length}/{maxSelecoes})
        </p>
      )}
      <div style={{
        display: 'grid', gridTemplateColumns: multi ? 'repeat(auto-fill, minmax(140px, 1fr))' : '1fr',
        gap: '8px', maxHeight: '50vh', overflowY: 'auto',
      }}>
        {options.map(opcao => {
          const isSelected = selecaoAtual.includes(opcao)
          const isSaving = salvando && !multi && selecaoAtual[0] === opcao
          return (
            <button
              key={opcao}
              onClick={() => handleClickOpcao(opcao)}
              disabled={salvando || (multi && !isSelected && !!maxSelecoes && selecaoAtual.length >= maxSelecoes)}
              style={{
                padding: '12px 14px', borderRadius: 'var(--radius-md)', textAlign: multi ? 'center' : 'left',
                fontWeight: 600, fontSize: '13px', cursor: salvando ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: multi ? 'center' : 'flex-start', gap: '8px',
                background: isSelected ? 'var(--c-badge-blue-bg)' : 'var(--c-glass-bg-sm)',
                color: isSelected ? 'var(--c-badge-blue-text)' : 'var(--c-text-1)',
                border: `1px solid ${isSelected ? 'var(--c-badge-blue-border)' : 'var(--c-border)'}`,
                opacity: (multi && !isSelected && !!maxSelecoes && selecaoAtual.length >= maxSelecoes) ? 0.4 : 1,
              }}
            >
              {isSelected && <FiCheck />}
              <span>{opcao}</span>
              {isSaving && <FiLoader style={{ animation: 'spin 0.7s linear infinite' }} />}
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
