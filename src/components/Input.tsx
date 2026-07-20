import React, { useState, useId } from 'react'

// ---- Input ----

interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  error?: string
  helper?: string
  disabled?: boolean
  icon?: React.ReactNode
  style?: React.CSSProperties
  autoComplete?: string
  maxLength?: number
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = ({
  label, placeholder, value, onChange, type = 'text',
  error, helper, disabled = false, icon, style, autoComplete, maxLength, onKeyDown,
}) => {
  const [focused, setFocused] = useState(false)
  const id = useId()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label htmlFor={id} style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: 500,
          color: error ? 'var(--color-error)' : 'var(--c-text-2)',
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--c-text-3)', display: 'flex', alignItems: 'center',
          }}>
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            height: '40px',
            padding: icon ? '0 14px 0 38px' : '0 14px',
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
          }}
        />
      </div>
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

// ---- Textarea ----

interface TextareaProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
  error?: string
  helper?: string
  disabled?: boolean
  style?: React.CSSProperties
}

export const Textarea: React.FC<TextareaProps> = ({
  label, placeholder, value, onChange, rows = 4,
  error, helper, disabled = false, style,
}) => {
  const [focused, setFocused] = useState(false)
  const id = useId()

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
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '10px 14px',
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
          resize: 'vertical',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color 200ms, box-shadow 200ms',
          boxSizing: 'border-box',
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

// ---- Select ----

interface SelectOption { value: string; label: string }

interface SelectProps {
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  style?: React.CSSProperties
}

export const Select: React.FC<SelectProps> = ({
  label, value, onChange, options, placeholder, disabled = false, style,
}) => {
  const [focused, setFocused] = useState(false)
  const id = useId()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label htmlFor={id} style={{
          fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--c-text-2)',
        }}>
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          height: '40px',
          padding: '0 14px',
          fontSize: 'var(--font-size-sm)',
          fontFamily: 'var(--font-sans)',
          color: 'var(--c-select-text)',
          background: 'var(--c-select-bg)',
          border: `1px solid ${focused ? 'var(--c-input-border-focus)' : 'var(--c-select-border)'}`,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px var(--c-input-ring)' : 'none',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 200ms, box-shadow 200ms',
          boxSizing: 'border-box',
          appearance: 'none',
        }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

// ---- Checkbox ----

interface CheckboxProps {
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label, checked = false, onChange, disabled = false,
}) => {
  const id = useId()
  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none',
        opacity: disabled ? 0.5 : 1,
        fontSize: 'var(--font-size-sm)',
        color: 'var(--c-text-1)',
      }}
    >
      <input
        id={id} type="checkbox" checked={checked} disabled={disabled}
        onChange={e => onChange?.(e.target.checked)}
        style={{ display: 'none' }}
      />
      <span style={{
        width: '18px', height: '18px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '5px',
        border: `1.5px solid ${checked ? 'transparent' : 'var(--c-checkbox-border)'}`,
        background: checked ? 'linear-gradient(135deg, #5291bb 0%, #22105d 100%)' : 'var(--c-checkbox-bg)',
        transition: 'all 200ms ease',
      }}>
        {checked && (
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path
              d="M1 4L4 7L10 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="14"
              style={{ animation: 'draw-check 250ms ease forwards' }}
            />
          </svg>
        )}
      </span>
      {label}
    </label>
  )
}

// ---- Toggle ----

interface ToggleProps {
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}

export const Toggle: React.FC<ToggleProps> = ({
  label, checked = false, onChange, disabled = false,
}) => {
  const id = useId()
  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none',
        opacity: disabled ? 0.5 : 1,
        fontSize: 'var(--font-size-sm)',
        color: 'var(--c-text-1)',
      }}
    >
      <input
        id={id} type="checkbox" checked={checked} disabled={disabled}
        onChange={e => onChange?.(e.target.checked)}
        style={{ display: 'none' }}
      />
      <span style={{
        position: 'relative', width: '38px', height: '22px', flexShrink: 0,
        borderRadius: '9999px',
        background: checked
          ? 'linear-gradient(135deg, #5291bb 0%, #22105d 100%)'
          : 'var(--c-toggle-bg)',
        transition: 'background 250ms ease',
      }}>
        <span style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '19px' : '3px',
          width: '16px', height: '16px',
          borderRadius: '50%',
          background: 'var(--c-toggle-thumb)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.30)',
          transition: 'left 250ms var(--ease-spring)',
        }} />
      </span>
      {label}
    </label>
  )
}
