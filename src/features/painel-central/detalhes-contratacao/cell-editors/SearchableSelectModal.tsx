import { useMemo, useState } from 'react'
import { FiSearch, FiLoader } from 'react-icons/fi'
import { Modal } from '../../../../components/Modal'
import { Button } from '../../../../components/Button'
import { Input } from '../../../../components/Input'

export interface SearchableSelectResultado {
  valor: string
  extra?: Record<string, string>
}

interface SearchableSelectModalProps<T> {
  title: string
  items: T[]
  getLabel: (item: T) => string
  getValue: (item: T) => SearchableSelectResultado
  currentValue?: string
  allowFreeText?: boolean
  onClose: () => void
  onSave: (resultado: SearchableSelectResultado) => Promise<void>
}

/** Cobre Professor (busca em dataBaseProfessores) e Estudante (busca em cadastroClientes, com fallback livre). */
export function SearchableSelectModal<T>({
  title, items, getLabel, getValue, currentValue, allowFreeText = false, onClose, onSave,
}: SearchableSelectModalProps<T>) {
  const [busca, setBusca] = useState('')
  const [textoLivre, setTextoLivre] = useState('')
  const [salvando, setSalvando] = useState<string | null>(null)

  const itensFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return items
    return items.filter(item => getLabel(item).toLowerCase().includes(termo))
  }, [items, busca, getLabel])

  async function handleSelecionar(resultado: SearchableSelectResultado) {
    setSalvando(resultado.valor)
    try {
      await onSave(resultado)
      onClose()
    } finally {
      setSalvando(null)
    }
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      size="md"
      footer={<Button variant="secondary" onClick={onClose} disabled={!!salvando}>Cancelar</Button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Input
          placeholder="Buscar..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          icon={<FiSearch size={14} />}
        />
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '40vh', overflowY: 'auto',
          border: '1px solid var(--c-border)', borderRadius: 'var(--radius-md)', padding: '6px',
        }}>
          {itensFiltrados.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--c-text-3)' }}>
              Nenhum resultado encontrado.
            </div>
          ) : itensFiltrados.map((item, i) => {
            const resultado = getValue(item)
            const isCurrent = resultado.valor === currentValue
            const isSaving = salvando === resultado.valor
            return (
              <button
                key={i}
                onClick={() => handleSelecionar(resultado)}
                disabled={!!salvando}
                style={{
                  padding: '10px 12px', borderRadius: 'var(--radius-sm)', textAlign: 'left',
                  fontSize: '13px', fontWeight: isCurrent ? 700 : 500, cursor: salvando ? 'wait' : 'pointer',
                  background: isCurrent ? 'var(--c-badge-blue-bg)' : 'transparent',
                  color: isCurrent ? 'var(--c-badge-blue-text)' : 'var(--c-text-1)',
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                }}
              >
                <span>{getLabel(item)}</span>
                {isSaving && <FiLoader style={{ animation: 'spin 0.7s linear infinite' }} />}
              </button>
            )
          })}
        </div>

        {allowFreeText && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', borderTop: '1px solid var(--c-border)', paddingTop: '12px' }}>
            <Input
              label="Ou digite um novo valor"
              value={textoLivre}
              onChange={e => setTextoLivre(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button
              variant="secondary"
              disabled={!textoLivre.trim() || !!salvando}
              loading={salvando === textoLivre.trim()}
              onClick={() => handleSelecionar({ valor: textoLivre.trim() })}
            >
              Usar
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
