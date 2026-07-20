import React, { useEffect, useState } from 'react'
import { FiChevronsLeft, FiChevronsRight, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../lib/AuthContext'
import { logout } from '../../lib/auth'
import { Logo } from '../Logo'
import { NAV_ITEMS } from '../../config/navigation'
import { NavList } from './NavList'
import './sidebar.css'

const COLLAPSE_KEY = 'metdc:sidebar-collapsed'
const EXPANDED_WIDTH = '272px'
const COLLAPSED_WIDTH = '76px'

export const Sidebar: React.FC = () => {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1')

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  return (
    <aside className="sidebar" style={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: '20px 16px',
        borderBottom: '1px solid var(--c-border)',
        minHeight: '76px',
        boxSizing: 'border-box',
      }}>
        {!collapsed && <Logo variant="original" size="xs" />}
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            flexShrink: 0,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--c-border)',
            background: 'transparent',
            color: 'var(--c-text-2)',
            cursor: 'pointer',
          }}
        >
          {collapsed ? <FiChevronsRight size={16} /> : <FiChevronsLeft size={16} />}
        </button>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <NavList
          items={NAV_ITEMS}
          depth={0}
          collapsed={collapsed}
          onNavigate={() => {}}
          onExpandRequest={() => setCollapsed(false)}
        />
      </nav>

      <div style={{
        padding: '14px 12px',
        borderTop: '1px solid var(--c-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {!collapsed && user?.email && (
          <span style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--c-text-3)',
            padding: '0 4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {user.email}
          </span>
        )}
        <button
          type="button"
          onClick={() => { void logout() }}
          title={collapsed ? 'Sair' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px' : '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--c-btn-danger-border)',
            background: 'var(--c-btn-danger-bg)',
            color: 'var(--c-btn-danger-text)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <FiLogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  )
}
