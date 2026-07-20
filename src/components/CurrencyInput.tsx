import React, { useState, useId } from 'react'

interface CurrencyInputProps {
  label?: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  error?: string
  helper?: string
  style?: React.CSSProperties
}

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Máscara de moeda BRL: trata os dígitos digitados como centavos, reformatando a cada tecla. */
export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label, value, onChange, disabled = false, error, helper, style,
}) => {
  const [focused, setFocused] = useState(false)
  const id = useId()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, '')
    const cents = digits === '' ? 0 : parseInt(digits, 10)
    onChange(cents / 100)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label htmlFor={id} style={{
          fontSize: 'var(--font-size-sm)', fontWeight: 500,
          color: error ? 'var(--color-error)' : 'var(--c-text-2)',
        }}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={formatter.format(value || 0)}
        onChange={handleChange}
        disabled={disabled}
        onFocus={e => { setFocused(true); e.target.select() }}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          height: '40px',
          padding: '0 14px',
          fontSize: 'var(--font-size-sm)',
          fontFamily: 'var(--font-sans)',
          color: 'var(--c-input-text)',
          background: 'var(--c-input-bg)',
          border: `1px solid ${
            error ? 'var(--color-error)'
            : focused ? 'var(--c-input-border-focus)'
            : 'var(--c-input-border)'
          }`,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          boxShadow: focused && !error ? '0 0 0 3px var(--c-input-ring)' : 'none',
          caretColor: '#83e6c3',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color 200ms, box-shadow 200ms',
          boxSizing: 'border-box',
          textAlign: 'right',
        }}
      />
      {(error || helper) && (
        <span style={{
          fontSize: 'var(--font-size-xs)',
          color: error ? 'var(--color-error)' : 'var(--c-text-3)',
        }}>
          {error || helper}
        </span>
      )}
    </div>
  )
}
