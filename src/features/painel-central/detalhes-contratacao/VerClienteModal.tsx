import React, { useEffect, useState } from 'react'
import { FiLoader, FiInbox } from 'react-icons/fi'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { fetchClientePorCpf } from '../queries'
import { resolverDadosFiscais } from '../helpers'
import type { Cliente } from '../types'

interface VerClienteModalProps {
  cpf: string
  onClose: () => void
}

const rotuloStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.03em' }
const valorStyle: React.CSSProperties = { fontSize: '13px', color: 'var(--c-text-1)', marginTop: '2px' }

const Campo: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <div style={rotuloStyle}>{label}</div>
    <div style={valorStyle}>{children || '--'}</div>
  </div>
)

export const VerClienteModal: React.FC<VerClienteModalProps> = ({ cpf, onClose }) => {
  const [loading, setLoading] = useState(true)
  const [cliente, setCliente] = useState<Cliente | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchClientePorCpf(cpf).then(c => {
      if (cancelled) return
      setCliente(c)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [cpf])

  return (
    <Modal title="Dados do Cliente" onClose={onClose} size="md" footer={<Button variant="secondary" onClick={onClose}>Fechar</Button>}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <FiLoader size={24} style={{ color: 'var(--c-text-blue)', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : !cliente ? (
        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--c-text-3)' }}>
          <FiInbox size={28} style={{ display: 'block', margin: '0 auto 8px' }} />
          Cliente não encontrado em cadastroClientes.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: 'var(--c-text-2)' }}>Identificação</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <Campo label="Nome">{cliente.nome}</Campo>
              <Campo label="CPF">{cliente.cpf}</Campo>
              <Campo label="Email">{cliente.email}</Campo>
              <Campo label="Contato">{cliente.contato}</Campo>
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: 'var(--c-text-2)' }}>Endereço</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <Campo label="CEP">{cliente.cep}</Campo>
              <Campo label="Cidade/UF">{cliente.cidadeUF}</Campo>
              <Campo label="Endereço">{cliente.endereco}{cliente.complemento ? `, ${cliente.complemento}` : ''}</Campo>
              {cliente.mesmoEndereco === false && (
                <Campo label="Endereço das aulas">{cliente.enderecoAulas} — {cliente.cepAulas}</Campo>
              )}
            </div>
          </div>

          {cliente.estudantes && cliente.estudantes.length > 0 && (
            <div>
              <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: 'var(--c-text-2)' }}>Estudantes</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cliente.estudantes.map((e, i) => (
                  <div key={i} style={{ padding: '8px 12px', background: 'var(--c-glass-bg-sm)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                    <strong>{e.nomeEstudante || 'Sem nome'}</strong> — {e.serieEstudante || '--'} {e.escolaEstudante ? `(${e.escolaEstudante})` : ''}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: 'var(--c-text-2)' }}>Dados fiscais (NF-e)</h4>
            {(() => {
              const fiscal = resolverDadosFiscais(cliente)
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <Campo label="Nome">{fiscal.nome}</Campo>
                  <Campo label="CPF">{fiscal.cpf}</Campo>
                  <Campo label="Endereço">{fiscal.endereco}</Campo>
                  <Campo label="Email">{fiscal.email}</Campo>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </Modal>
  )
}
