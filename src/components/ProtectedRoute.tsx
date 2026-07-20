import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { logout } from '../lib/auth'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, authorized } = useAuth()

  const unauthorizedButLoggedIn = !loading && !!user && !authorized

  useEffect(() => {
    if (unauthorizedButLoggedIn) {
      logout()
    }
  }, [unauthorizedButLoggedIn])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid var(--c-border)', borderTopColor: 'var(--blue-400)',
          animation: 'spin 0.7s linear infinite',
        }} />
      </div>
    )
  }

  if (unauthorizedButLoggedIn) {
    return <Navigate to="/login?erro=nao_autorizado" replace />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
