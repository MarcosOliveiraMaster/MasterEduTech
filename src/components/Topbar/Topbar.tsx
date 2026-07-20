import React from 'react'
import { FiMoon, FiSun, FiSunrise, FiSunset } from 'react-icons/fi'
import { useAuth } from '../../lib/AuthContext'
import { useTheme, type ThemeMode } from '../../lib/ThemeContext'
import { getDisplayName, getInitials } from '../../lib/userDisplay'
import './topbar.css'

/** Placeholder até existir um cadastro de perfil (nome/cargo) por usuário. */
const ROLE_PLACEHOLDER = 'Administrador'

const THEME_OPTIONS: { id: ThemeMode; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'light', label: 'Modo claro', icon: FiSun },
  { id: 'classico', label: 'Modo clássico', icon: FiSunrise },
  { id: 'dusk', label: 'Modo fim de tarde', icon: FiSunset },
  { id: 'dark', label: 'Modo escuro', icon: FiMoon },
]

export const Topbar: React.FC = () => {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const name = getDisplayName(user?.email)
  const initials = getInitials(name)

  return (
    <header className="topbar">
      <div className="topbar-profile">
        <div className="topbar-avatar">{initials}</div>
        <div className="topbar-profile-text">
          <span className="topbar-name">{name}</span>
          <span className="topbar-role">{ROLE_PLACEHOLDER}</span>
        </div>
      </div>

      <div className="topbar-theme-switch" role="group" aria-label="Selecionar tema">
        {THEME_OPTIONS.map(opt => {
          const Icon = opt.icon
          const active = theme === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              className={`topbar-theme-btn${active ? ' active' : ''}`}
              onClick={() => setTheme(opt.id)}
              title={opt.label}
              aria-pressed={active}
              aria-label={opt.label}
            >
              <Icon size={16} />
            </button>
          )
        })}
      </div>
    </header>
  )
}
