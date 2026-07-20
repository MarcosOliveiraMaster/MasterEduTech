import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Topbar } from '../components/Topbar/Topbar'

export const AppLayout: React.FC = () => (
  <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gradient-hero)' }}>
    <Sidebar />
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
      <Topbar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  </div>
)
