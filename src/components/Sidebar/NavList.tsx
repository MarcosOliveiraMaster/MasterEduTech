import React, { useState } from 'react'
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import type { NavGroup, NavItem, NavLink } from '../../config/navigation'

function containsActivePath(item: NavItem, pathname: string): boolean {
  if (item.type === 'section') return false
  if (item.type === 'link') return !item.external && pathname.startsWith(item.path)
  return item.children.some(child => containsActivePath(child, pathname))
}

function itemButtonStyle(depth: number, active: boolean, collapsed: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    boxSizing: 'border-box',
    padding: collapsed ? '10px' : `10px 14px 10px ${14 + depth * 16}px`,
    justifyContent: collapsed ? 'center' : 'flex-start',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-sans)',
    fontWeight: active ? 600 : 500,
    color: active ? '#ffffff' : 'var(--c-text-2)',
    background: active ? 'var(--gradient-accent)' : 'transparent',
    boxShadow: active ? 'var(--c-shadow-accent)' : 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 180ms ease, color 180ms ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }
}

const NavLinkItem: React.FC<{
  item: NavLink
  depth: number
  collapsed: boolean
  onNavigate: () => void
}> = ({ item, depth, collapsed, onNavigate }) => {
  const Icon = item.icon

  if (item.external) {
    return (
      <button
        type="button"
        className="sidebar-link"
        onClick={() => { window.location.href = item.path }}
        title={collapsed ? item.label : undefined}
        style={itemButtonStyle(depth, false, collapsed)}
      >
        <Icon size={18} style={{ flexShrink: 0 }} />
        {!collapsed && <span>{item.label}</span>}
      </button>
    )
  }

  return (
    <RouterNavLink
      to={item.path}
      onClick={onNavigate}
      className="sidebar-link"
      title={collapsed ? item.label : undefined}
      style={({ isActive }) => itemButtonStyle(depth, isActive, collapsed)}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      {!collapsed && <span>{item.label}</span>}
    </RouterNavLink>
  )
}

/** Cabeçalho de seção — apenas rótulo, sem ícone, não navegável. */
const NavSectionHeader: React.FC<{ label: string; collapsed: boolean; first: boolean }> = ({ label, collapsed, first }) => {
  if (collapsed) {
    return <div style={{ height: '1px', background: 'var(--c-border)', margin: '10px 10px' }} />
  }
  return (
    <div style={{
      margin: first ? '4px 14px 6px' : '18px 14px 6px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--c-text-3)',
    }}>
      {label}
    </div>
  )
}

/** Renderiza um item do tipo grupo (accordion): apenas um filho-grupo desta lista fica aberto por vez. */
const NavGroupItem: React.FC<{
  group: NavGroup
  depth: number
  collapsed: boolean
  open: boolean
  onToggle: () => void
  onNavigate: () => void
  onExpandRequest: () => void
}> = ({ group, depth, collapsed, open, onToggle, onNavigate, onExpandRequest }) => {
  const location = useLocation()
  const Icon = group.icon
  const active = containsActivePath(group, location.pathname)
  const isOpen = collapsed ? true : open

  return (
    <div>
      <button
        type="button"
        className="sidebar-group-toggle"
        onClick={onToggle}
        title={collapsed ? group.label : undefined}
        style={{ ...itemButtonStyle(depth, false, collapsed), color: active ? 'var(--c-text-mint)' : 'var(--c-text-2)' }}
      >
        <Icon size={18} style={{ flexShrink: 0 }} />
        {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{group.label}</span>}
        {!collapsed && (
          <FiChevronRight
            size={14}
            style={{ flexShrink: 0, transition: 'transform 200ms ease', transform: isOpen ? 'rotate(90deg)' : 'none' }}
          />
        )}
      </button>
      {isOpen && !collapsed && (
        <NavList items={group.children} depth={depth + 1} collapsed={collapsed} onNavigate={onNavigate} onExpandRequest={onExpandRequest} />
      )}
    </div>
  )
}

export const NavList: React.FC<{
  items: NavItem[]
  depth: number
  collapsed: boolean
  onNavigate: () => void
  onExpandRequest: () => void
}> = ({ items, depth, collapsed, onNavigate, onExpandRequest }) => {
  const location = useLocation()
  const [openGroupId, setOpenGroupId] = useState<string | null>(() => {
    const activeGroup = items.find(item => item.type === 'group' && containsActivePath(item, location.pathname))
    return activeGroup ? activeGroup.id : null
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {items.map((item, index) => {
        if (item.type === 'section') {
          return <NavSectionHeader key={item.id} label={item.label} collapsed={collapsed} first={index === 0} />
        }

        if (item.type === 'link') {
          return <NavLinkItem key={item.id} item={item} depth={depth} collapsed={collapsed} onNavigate={onNavigate} />
        }

        const handleToggle = () => {
          if (collapsed) {
            onExpandRequest()
            setOpenGroupId(item.id)
            return
          }
          setOpenGroupId(id => (id === item.id ? null : item.id))
        }

        return (
          <NavGroupItem
            key={item.id}
            group={item}
            depth={depth}
            collapsed={collapsed}
            open={openGroupId === item.id}
            onToggle={handleToggle}
            onNavigate={onNavigate}
            onExpandRequest={onExpandRequest}
          />
        )
      })}
    </div>
  )
}
