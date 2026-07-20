import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { loginWithEmail, sendPasswordReset, rlIsLocked, rlRemainingMs } from '../lib/auth'

type Panel = 'login' | 'reset'

/**
 * Login — réplica funcional e visual do painel Central
 * (glass card sobre --gradient-hero, painel de reset de senha, rate
 * limiting), usando os componentes do design system do MasterEduTech.
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [panel, setPanel] = useState<Panel>('login')

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [entrando, setEntrando] = useState(false)

  const [resetEmail, setResetEmail] = useState('')
  const [resetMsg, setResetMsg] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
  const [enviandoReset, setEnviandoReset] = useState(false)

  const [lockoutMsg, setLockoutMsg] = useState<string | null>(null)

  // Erro vindo de redirecionamento (ex.: e-mail não autorizado)
  useEffect(() => {
    if (searchParams.get('erro') === 'nao_autorizado') {
      setLoginError('Acesso não autorizado para este e-mail.')
      searchParams.delete('erro')
      setSearchParams(searchParams, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Checar bloqueio por tentativas (a cada 10s)
  useEffect(() => {
    function check() {
      if (rlIsLocked()) {
        const mins = Math.ceil(rlRemainingMs() / 60000)
        setLockoutMsg(`Muitas tentativas incorretas. Aguarde ${mins} minuto(s).`)
      } else {
        setLockoutMsg(null)
      }
    }
    check()
    const id = setInterval(check, 10000)
    return () => clearInterval(id)
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    if (rlIsLocked()) return

    setEntrando(true)
    const result = await loginWithEmail(email, senha)
    setEntrando(false)

    if (result.success) {
      navigate('/inicio')
    } else {
      setLoginError(result.error || 'Erro ao fazer login.')
    }
  }

  function goToReset() {
    setPanel('reset')
    setLoginError('')
    setResetMsg(null)
    setResetEmail(email)
  }

  function goToLogin() {
    setPanel('login')
    setResetMsg(null)
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setResetMsg(null)

    if (!resetEmail.trim()) {
      setResetMsg({ text: 'Informe seu e-mail.', type: 'error' })
      return
    }

    setEnviandoReset(true)
    const result = await sendPasswordReset(resetEmail)
    setEnviandoReset(false)

    if (result.success) {
      setResetMsg({
        text: 'Se este e-mail estiver autorizado, você receberá um link em breve. Verifique também o spam.',
        type: 'success',
      })
    } else {
      setResetMsg({ text: result.error || 'Erro ao enviar e-mail. Tente novamente.', type: 'error' })
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gradient-hero)',
      padding: '20px',
    }}>
      <GlassCard variant="lg" style={{ width: '100%', maxWidth: '420px', animation: 'slide-in-up 400ms var(--ease-spring, ease)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ animation: 'logo-reveal 500ms ease forwards', opacity: 0 }}>
            <Logo variant="original" size="md" />
          </div>
          <p style={{
            margin: '10px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--c-text-3)',
            animation: 'logo-reveal 400ms ease forwards', animationDelay: '150ms', opacity: 0,
          }}>
            Painel Administrativo
          </p>
        </div>

        {lockoutMsg && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--c-notif-warning-bg)', border: '1px solid var(--c-notif-warning-border)',
            color: 'var(--c-notif-warning-icon)', borderRadius: 'var(--radius-sm)',
            padding: '10px 14px', fontSize: 'var(--font-size-sm)', marginBottom: '16px',
          }}>
            {lockoutMsg}
          </div>
        )}

        {panel === 'login' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
            <div>
              <Input
                label="Senha"
                type={showSenha ? 'text' : 'password'}
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                error={loginError || undefined}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowSenha(s => !s)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--c-text-3)', fontSize: 'var(--font-size-xs)',
                  padding: 0, marginTop: '6px',
                }}
              >
                {showSenha ? 'Ocultar senha' : 'Mostrar senha'}
              </button>
            </div>

            <button
              type="button"
              onClick={goToReset}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right',
                color: 'var(--c-text-mint)', fontSize: 'var(--font-size-xs)', padding: 0, marginTop: '-8px',
              }}
            >
              Esqueci minha senha
            </button>

            <Button type="submit" variant="primary" fullWidth loading={entrando} disabled={!!lockoutMsg}>
              Entrar
            </Button>
          </form>
        ) : (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--c-text-2)', lineHeight: 1.5 }}>
              Digite seu e-mail para receber o link de redefinição de senha.
            </p>

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              error={resetMsg?.type === 'error' ? resetMsg.text : undefined}
              helper={resetMsg?.type === 'success' ? resetMsg.text : undefined}
            />

            <Button type="submit" variant="primary" fullWidth loading={enviandoReset}>
              Enviar link de redefinição
            </Button>

            <button
              type="button"
              onClick={goToLogin}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                color: 'var(--c-text-mint)', fontSize: 'var(--font-size-xs)', padding: 0,
              }}
            >
              ← Voltar para o login
            </button>
          </form>
        )}

        <p style={{
          margin: '28px 0 0', textAlign: 'center', fontSize: '11px', color: 'var(--c-text-3)',
        }}>
          © 2025 Master Educação LTDA · CNPJ 48.055.955/0001-72
        </p>
      </GlassCard>
    </div>
  )
}
