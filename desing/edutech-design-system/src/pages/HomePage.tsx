import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../components/Button'
import { Input, Textarea, Select, Checkbox, Toggle } from '../components/Input'
import { GlassCard } from '../components/GlassCard'
import { Badge } from '../components/Badge'
import { Avatar, AvatarGroup } from '../components/Avatar'
import { Notification } from '../components/Notification'

// ============================================================
// Types
// ============================================================

interface HomePageProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

// ============================================================
// Section wrapper
// ============================================================

const Section: React.FC<{ id: string; title: string; subtitle?: string; children: React.ReactNode }> = ({
  id, title, subtitle, children,
}) => (
  <section id={id} style={{ marginBottom: '80px', scrollMarginTop: '80px' }}>
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{
        margin: '0 0 8px',
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 700,
        color: 'var(--c-text-1)',
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ margin: 0, fontSize: 'var(--font-size-base)', color: 'var(--c-text-2)' }}>
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </section>
)

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: '40px' }}>
    <h3 style={{
      margin: '0 0 20px',
      fontSize: 'var(--font-size-md)',
      fontWeight: 600,
      color: 'var(--c-text-purple)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontSize: '11px',
    }}>
      {title}
    </h3>
    {children}
  </div>
)

// ============================================================
// Motion: Ring Spinner
// ============================================================

const RingSpinner: React.FC<{ color?: string; size?: number }> = ({
  color = '#7c3aed', size = 40,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    style={{ animation: 'spin 0.7s linear infinite', display: 'block' }}
  >
    <circle cx="20" cy="20" r="16" stroke={color} strokeOpacity="0.20" strokeWidth="4" />
    <path
      d="M20 4A16 16 0 0 1 36 20"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
)

// ============================================================
// Motion: Bounce Dots
// ============================================================

const BounceDots: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px' }}>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{
          width: '10px', height: '10px',
          borderRadius: '50%',
          background: '#7c3aed',
          animation: `bounce-dot 0.6s ease-in-out ${i * 0.12}s infinite`,
          animationFillMode: 'both',
        }}
      />
    ))}
  </div>
)

// ============================================================
// Motion: Pulse Ring
// ============================================================

const PulseRing: React.FC = () => (
  <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      position: 'absolute',
      width: '40px', height: '40px',
      borderRadius: '50%',
      border: '2px solid #83e6c3',
      animation: 'pulse-ring 1.2s ease-out infinite',
    }} />
    <div style={{
      width: '16px', height: '16px',
      borderRadius: '50%',
      background: '#83e6c3',
    }} />
  </div>
)

// ============================================================
// Motion: Bar Loader
// ============================================================

const BarLoader: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '40px' }}>
    {[0, 1, 2, 3].map(i => (
      <div
        key={i}
        style={{
          width: '8px',
          height: '32px',
          borderRadius: '4px',
          background: i % 2 === 0 ? '#7c3aed' : '#83e6c3',
          transformOrigin: 'bottom',
          animation: `bar-grow 0.6s ease-in-out ${i * 0.1}s infinite`,
          animationFillMode: 'both',
        }}
      />
    ))}
  </div>
)

// ============================================================
// Motion: Skeleton
// ============================================================

const SkeletonPulse: React.FC<{ width?: string; height?: string; style?: React.CSSProperties }> = ({
  width = '100%', height = '16px', style,
}) => (
  <div style={{
    width, height,
    borderRadius: 'var(--radius-sm)',
    background: 'var(--c-glass-bg)',
    overflow: 'hidden',
    position: 'relative',
    ...style,
  }}>
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'var(--gradient-shimmer)',
      animation: 'shimmer 1.6s linear infinite',
    }} />
  </div>
)

const SkeletonCard: React.FC = () => (
  <GlassCard style={{ padding: '20px' }}>
    <SkeletonPulse width="60%" height="12px" style={{ marginBottom: '12px' }} />
    <SkeletonPulse height="120px" style={{ marginBottom: '12px', borderRadius: 'var(--radius-md)' }} />
    <SkeletonPulse height="14px" style={{ marginBottom: '8px' }} />
    <SkeletonPulse width="80%" height="14px" style={{ marginBottom: '16px' }} />
    <div style={{ display: 'flex', gap: '8px' }}>
      <SkeletonPulse width="80px" height="32px" style={{ borderRadius: 'var(--radius-sm)' }} />
      <SkeletonPulse width="60px" height="32px" style={{ borderRadius: 'var(--radius-sm)' }} />
    </div>
  </GlassCard>
)

const SkeletonUserRow: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0' }}>
    <SkeletonPulse width="40px" height="40px" style={{ borderRadius: '50%', flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <SkeletonPulse width="40%" height="13px" style={{ marginBottom: '8px' }} />
      <SkeletonPulse width="60%" height="11px" />
    </div>
    <SkeletonPulse width="64px" height="24px" style={{ borderRadius: 'var(--radius-full)' }} />
  </div>
)

// ============================================================
// Motion: Progress Bar
// ============================================================

const ProgressBar: React.FC = () => {
  const [key, setKey] = useState(0)
  const [progress] = useState(73)

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginBottom: '8px', fontSize: 'var(--font-size-sm)', color: 'var(--c-text-2)',
      }}>
        <span>Progresso do Curso</span>
        <span style={{ color: 'var(--c-text-mint)', fontWeight: 600 }}>{progress}%</span>
      </div>
      <div style={{
        width: '100%', height: '10px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--c-glass-bg)',
        overflow: 'hidden',
      }}>
        <div
          key={key}
          style={{
            height: '100%',
            width: `${progress}%`,
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(90deg, #7c3aed 0%, #83e6c3 100%)',
            animation: `progress-fill 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
            '--progress-target': `${progress}%`,
          } as React.CSSProperties}
        />
      </div>
      <div style={{ marginTop: '12px' }}>
        <Button variant="ghost" size="sm" onClick={() => setKey(k => k + 1)}>
          Reiniciar Animacao
        </Button>
      </div>
    </div>
  )
}

// ============================================================
// Motion: Logo Animation
// ============================================================

const LogoAnimation: React.FC = () => {
  const [animKey, setAnimKey] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <div
        key={animKey}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
      >
        <div style={{ position: 'relative', width: '90px', height: '90px' }}>
          {/* Rotating ring */}
          <svg
            width="90" height="90" viewBox="0 0 90 90"
            style={{
              position: 'absolute', inset: 0,
              animation: 'spin-slow 2s linear infinite',
            }}
          >
            <circle
              cx="45" cy="45" r="40"
              stroke="#83e6c3"
              strokeWidth="2"
              strokeDasharray="16 8"
              fill="none"
              strokeOpacity="0.7"
            />
          </svg>

          {/* Outer glow ring */}
          <svg
            width="90" height="90" viewBox="0 0 90 90"
            style={{ position: 'absolute', inset: 0 }}
          >
            <circle
              cx="45" cy="45" r="36"
              stroke="rgba(124,58,237,0.25)"
              strokeWidth="1"
              fill="rgba(124,58,237,0.06)"
            />
          </svg>

          {/* M glyph */}
          <svg
            width="90" height="90" viewBox="0 0 90 90"
            fill="none"
            style={{ position: 'absolute', inset: 0 }}
          >
            <polyline
              points="25,62 25,30 45,52 65,30 65,62"
              stroke="#7c3aed"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray="120"
              style={{
                animation: 'draw-check 0.8s cubic-bezier(0.4,0,0.2,1) forwards',
                strokeDashoffset: 120,
              }}
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div style={{
          animation: 'logo-reveal 0.4s ease forwards',
          animationDelay: '0.6s',
          opacity: 0,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: 'var(--c-text-1)' }}>Master</span>
            <span style={{ color: '#83e6c3' }}>Edu</span>
            <span style={{ color: '#7c3aed' }}>Tech</span>
          </div>
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--c-text-3)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '4px',
          }}>
            Design System
          </div>
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={() => setAnimKey(k => k + 1)}>
        Repetir Animacao
      </Button>
    </div>
  )
}

// ============================================================
// Motion: Animated Icons
// ============================================================

const AnimatedCheckIcon: React.FC = () => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '64px', height: '64px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(34,197,94,0.12)',
        border: '1px solid rgba(34,197,94,0.30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 200ms',
      }}
    >
      <svg key={hovered ? 'h' : 'n'} width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4" />
        {hovered && (
          <polyline
            points="8,14 12,18 20,10"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="24"
            style={{ animation: 'draw-check 350ms ease forwards', strokeDashoffset: 24 }}
          />
        )}
        {!hovered && (
          <polyline
            points="8,14 12,18 20,10"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="24"
            strokeDashoffset="0"
          />
        )}
      </svg>
    </div>
  )
}

const AnimatedErrorIcon: React.FC = () => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '64px', height: '64px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(239,68,68,0.12)',
        border: '1px solid rgba(239,68,68,0.30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <svg key={hovered ? 'h' : 'n'} width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.4" />
        {hovered ? (
          <>
            <line
              x1="9" y1="9" x2="19" y2="19"
              stroke="#ef4444" strokeWidth="2" strokeLinecap="round"
              strokeDasharray="16"
              style={{ animation: 'draw-check 300ms ease forwards', strokeDashoffset: 16 }}
            />
            <line
              x1="19" y1="9" x2="9" y2="19"
              stroke="#ef4444" strokeWidth="2" strokeLinecap="round"
              strokeDasharray="16"
              style={{ animation: 'draw-check 300ms ease 100ms forwards', strokeDashoffset: 16 }}
            />
          </>
        ) : (
          <>
            <line x1="9" y1="9" x2="19" y2="19" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <line x1="19" y1="9" x2="9" y2="19" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  )
}

const AnimatedInfoIcon: React.FC = () => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '64px', height: '64px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(124,58,237,0.12)',
        border: '1px solid rgba(124,58,237,0.30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <svg
        width="28" height="28" viewBox="0 0 28 28" fill="none"
        style={hovered ? { animation: 'fade-scale-in 300ms var(--ease-spring) forwards' } : {}}
      >
        <circle cx="14" cy="14" r="12" stroke="#9a5bff" strokeWidth="1.5" />
        <path d="M14 13v6" stroke="#9a5bff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="10" r="1" fill="#9a5bff" />
      </svg>
    </div>
  )
}

const AnimatedWarningIcon: React.FC = () => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '64px', height: '64px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(245,158,11,0.12)',
        border: '1px solid rgba(245,158,11,0.30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <svg
        width="28" height="28" viewBox="0 0 28 28" fill="none"
        style={hovered ? { animation: 'warning-pulse 600ms ease infinite' } : {}}
      >
        <path
          d="M14 3L26 24H2L14 3Z"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="rgba(245,158,11,0.10)"
        />
        <path d="M14 11v6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="20" r="1" fill="#f59e0b" />
      </svg>
    </div>
  )
}

// ============================================================
// Color Swatch
// ============================================================

const Swatch: React.FC<{ color: string; label: string; hex: string }> = ({ color, label, hex }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
    <div style={{
      width: '100%',
      height: '56px',
      borderRadius: 'var(--radius-sm)',
      background: color,
      border: '1px solid rgba(255,255,255,0.08)',
    }} />
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--c-text-2)' }}>{label}</div>
      <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--c-text-3)' }}>{hex}</div>
    </div>
  </div>
)

// ============================================================
// Sidebar nav item
// ============================================================

const NavItem: React.FC<{ href: string; label: string; active: boolean; emoji?: string }> = ({
  href, label, active, emoji,
}) => (
  <a
    href={href}
    style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '9px 14px',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: active ? 600 : 400,
      color: active ? 'var(--c-text-1)' : 'var(--c-text-2)',
      background: active ? 'var(--c-glass-bg)' : 'transparent',
      border: active ? '1px solid var(--c-border)' : '1px solid transparent',
      textDecoration: 'none',
      transition: 'all 200ms ease',
    }}
  >
    {emoji && <span style={{ fontSize: '15px' }}>{emoji}</span>}
    {label}
    {active && (
      <span style={{
        marginLeft: 'auto',
        width: '4px', height: '4px',
        borderRadius: '50%',
        background: '#7c3aed',
        flexShrink: 0,
      }} />
    )}
  </a>
)

// ============================================================
// HomePage
// ============================================================

export const HomePage: React.FC<HomePageProps> = ({ theme, onToggleTheme }) => {
  const [activeSection, setActiveSection] = useState('fundamentos')
  const [checkboxState, setCheckboxState] = useState({ a: true, b: false, c: true })
  const [toggleState, setToggleState] = useState({ notifs: true, darkMode: false, emails: false })
  const [inputVal, setInputVal] = useState('')
  const [textVal, setTextVal] = useState('')
  const [selectVal, setSelectVal] = useState('')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const id = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id
          if (id) setActiveSection(id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    )
    const sections = document.querySelectorAll('section[id]')
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const navItems = [
    { href: '#fundamentos', label: 'Fundamentos', id: 'fundamentos', emoji: 'A' },
    { href: '#superficies', label: 'Superficies', id: 'superficies', emoji: 'S' },
    { href: '#componentes', label: 'Componentes', id: 'componentes', emoji: 'C' },
    { href: '#formularios', label: 'Formularios', id: 'formularios', emoji: 'F' },
    { href: '#motion', label: 'Motion', id: 'motion', emoji: 'M' },
  ]

  const purpleSwatches = [
    { label: '50', hex: '#f5f0ff' }, { label: '100', hex: '#ede0ff' },
    { label: '200', hex: '#d4b8ff' }, { label: '300', hex: '#b48aff' },
    { label: '400', hex: '#9a5bff' }, { label: '500', hex: '#7c3aed' },
    { label: '600', hex: '#6020cc' }, { label: '700', hex: '#4b16a8' },
    { label: '800', hex: '#22105d' }, { label: '900', hex: '#140a3c' },
  ]

  const mintSwatches = [
    { label: '50', hex: '#edfaf5' }, { label: '100', hex: '#c7f4e3' },
    { label: '200', hex: '#9fecd1' }, { label: '300', hex: '#83e6c3' },
    { label: '400', hex: '#52d4a8' }, { label: '500', hex: '#2abd8d' },
    { label: '600', hex: '#1e9b73' }, { label: '700', hex: '#167a5b' },
  ]

  const semanticColors = [
    { label: 'Success', hex: '#22c55e' },
    { label: 'Warning', hex: '#f59e0b' },
    { label: 'Error', hex: '#ef4444' },
    { label: 'Info', hex: '#7c3aed' },
  ]

  const typographyScale = [
    { name: 'Display 4xl', size: 'var(--font-size-4xl)', weight: 800, sample: 'Aprender' },
    { name: 'Heading 3xl', size: 'var(--font-size-3xl)', weight: 700, sample: 'Bem-vindo' },
    { name: 'Heading 2xl', size: 'var(--font-size-2xl)', weight: 700, sample: 'Cursos Online' },
    { name: 'Heading xl', size: 'var(--font-size-xl)', weight: 600, sample: 'Certificados' },
    { name: 'Title lg', size: 'var(--font-size-lg)', weight: 500, sample: 'Aprendizado Continuo' },
    { name: 'Body md', size: 'var(--font-size-md)', weight: 400, sample: 'Educacao de qualidade' },
    { name: 'Body base', size: 'var(--font-size-base)', weight: 400, sample: 'Plataforma de ensino premium' },
    { name: 'Body sm', size: 'var(--font-size-sm)', weight: 400, sample: 'Conteudo acessivel para todos os niveis' },
    { name: 'Label xs', size: 'var(--font-size-xs)', weight: 500, sample: 'CATEGORIA - TECNOLOGIA' },
  ]

  const spacingTokens = [
    { name: 'space-1', value: '4px', px: 4 },
    { name: 'space-2', value: '8px', px: 8 },
    { name: 'space-3', value: '12px', px: 12 },
    { name: 'space-4', value: '16px', px: 16 },
    { name: 'space-5', value: '20px', px: 20 },
    { name: 'space-6', value: '24px', px: 24 },
    { name: 'space-8', value: '32px', px: 32 },
    { name: 'space-10', value: '40px', px: 40 },
    { name: 'space-12', value: '48px', px: 48 },
  ]

  const radiusTokens = [
    { name: 'radius-xs', value: '4px', px: 4 },
    { name: 'radius-sm', value: '8px', px: 8 },
    { name: 'radius-md', value: '12px', px: 12 },
    { name: 'radius-lg', value: '16px', px: 16 },
    { name: 'radius-xl', value: '24px', px: 24 },
    { name: 'radius-2xl', value: '32px', px: 32 },
    { name: 'radius-full', value: '9999px', px: 9999 },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ---- Top Nav Bar ---- */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '60px',
        display: 'flex', alignItems: 'center',
        padding: '0 24px',
        background: theme === 'dark'
          ? 'rgba(8,5,26,0.80)'
          : 'rgba(245,240,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--c-border)',
        gap: '16px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: 'auto' }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6020cc 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(124,58,237,0.40)',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <polyline
                points="3,14 3,5 9,11 15,5 15,14"
                stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--c-text-1)', lineHeight: 1 }}>
              <span>Master</span>
              <span style={{ color: '#83e6c3' }}>Edu</span>
              <span style={{ color: '#9a5bff' }}>Tech</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--c-text-3)', marginTop: '2px' }}>Design System</div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav style={{ display: 'flex', gap: '2px', overflowX: 'auto' }}>
          {navItems.map(item => (
            <a
              key={item.id}
              href={item.href}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 500,
                color: activeSection === item.id ? 'var(--c-text-1)' : 'var(--c-text-3)',
                background: activeSection === item.id ? 'var(--c-glass-bg)' : 'transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 200ms',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          style={{
            width: '36px', height: '36px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--c-glass-bg)',
            border: '1px solid var(--c-border)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--c-text-2)',
            animation: 'theme-pop 250ms ease',
            flexShrink: 0,
          }}
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 1v1M8 14v1M1 8h1M14 8h1M3.05 3.05l.7.7M12.24 12.24l.71.71M12.24 3.76l-.71.71M3.75 12.25l-.7.7"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 8.5A5.5 5.5 0 0 1 6 2.5a5.5 5.5 0 1 0 7.5 6Z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </header>

      {/* ---- Main layout ---- */}
      <div style={
        {
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '60px',
        }
      }>
        {/* ---- Sidebar ---- */}
        <aside style={{
          position: 'sticky', top: '60px',
          height: 'calc(100vh - 60px)',
          overflowY: 'auto',
          padding: '32px 16px 32px 24px',
          borderRight: '1px solid var(--c-border)',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          <div style={{
            fontSize: '10px', fontWeight: 600,
            color: 'var(--c-text-3)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            marginBottom: '12px', marginLeft: '14px',
          }}>
            Secoes
          </div>
          {navItems.map(item => (
            <NavItem
              key={item.id}
              href={item.href}
              label={item.label}
              active={activeSection === item.id}
              emoji={item.emoji}
            />
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
            <GlassCard variant="purple" style={{ padding: '14px' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--c-text-purple)', fontWeight: 600, marginBottom: '4px' }}>
                v1.0.0
              </div>
              <div style={{ fontSize: '11px', color: 'var(--c-text-3)', lineHeight: 1.5 }}>
                MasterEduTech Design System
              </div>
            </GlassCard>
          </div>
        </aside>

        {/* ---- Content ---- */}
        <main
          ref={mainRef}
          style={{ padding: '48px 48px 80px', minWidth: 0 }}
        >
          {/* ===== FUNDAMENTOS ===== */}
          <Section id="fundamentos" title="Fundamentos" subtitle="Tokens fundamentais de cor, tipografia, espaco e bordas.">

            <SubSection title="Escala Purple">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
                {purpleSwatches.map(s => (
                  <Swatch key={s.label} color={s.hex} label={s.label} hex={s.hex} />
                ))}
              </div>
            </SubSection>

            <SubSection title="Escala Mint">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
                {mintSwatches.map(s => (
                  <Swatch key={s.label} color={s.hex} label={s.label} hex={s.hex} />
                ))}
              </div>
            </SubSection>

            <SubSection title="Cores Semanticas">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {semanticColors.map(s => (
                  <Swatch key={s.label} color={s.hex} label={s.label} hex={s.hex} />
                ))}
              </div>
            </SubSection>

            <SubSection title="Tipografia">
              <GlassCard>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {typographyScale.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'baseline', gap: '16px',
                        padding: '14px 0',
                        borderBottom: i < typographyScale.length - 1 ? '1px solid var(--c-border-sm)' : 'none',
                      }}
                    >
                      <span style={{
                        width: '90px', flexShrink: 0,
                        fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--c-text-3)',
                      }}>
                        {t.name}
                      </span>
                      <span style={{
                        fontSize: t.size, fontWeight: t.weight,
                        color: 'var(--c-text-1)', lineHeight: 1.2,
                        flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                      }}>
                        {t.sample}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </SubSection>

            <SubSection title="Espacamento (grid 4px)">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {spacingTokens.map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ width: '70px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--c-text-3)' }}>
                      {s.name}
                    </span>
                    <div style={{
                      width: `${Math.min(s.px * 3, 240)}px`, height: '14px',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, #7c3aed, #83e6c3)',
                      opacity: 0.7,
                    }} />
                    <span style={{ fontSize: '11px', color: 'var(--c-text-3)', fontFamily: 'var(--font-mono)' }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Border Radius">
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                {radiusTokens.map(r => (
                  <div key={r.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '52px', height: '52px',
                      background: 'var(--c-glass-bg)',
                      border: '1px solid var(--c-border)',
                      borderRadius: Math.min(r.px, 26),
                    }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--c-text-2)', fontWeight: 500 }}>{r.name.replace('radius-', '')}</div>
                      <div style={{ fontSize: '10px', color: 'var(--c-text-3)', fontFamily: 'var(--font-mono)' }}>{r.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ===== SUPERFICIES ===== */}
          <Section id="superficies" title="Superficies" subtitle="Camadas de vidro (glassmorphism) e escalas de sombra.">

            <SubSection title="Vidro — 5 Niveis">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                {(['sm', 'default', 'lg', 'purple', 'mint'] as const).map(variant => (
                  <GlassCard key={variant} variant={variant} hoverable>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--c-text-3)', marginBottom: '8px' }}>
                      .glass{variant !== 'default' ? `-${variant}` : ''}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--c-text-1)', marginBottom: '4px' }}>
                      {variant === 'sm' ? 'Glass SM' : variant === 'default' ? 'Glass' : variant === 'lg' ? 'Glass LG' : variant === 'purple' ? 'Glass Purple' : 'Glass Mint'}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--c-text-3)', lineHeight: 1.5 }}>
                      {variant === 'sm' ? 'blur(8px) · 4%' : variant === 'default' ? 'blur(16px) · 8%' : variant === 'lg' ? 'blur(24px) · 14%' : variant === 'purple' ? 'blur(20px) · purple' : 'blur(20px) · mint'}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </SubSection>

            <SubSection title="Sombras">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {[
                  { label: 'Shadow SM', shadow: 'var(--c-shadow-sm)', desc: '0 2px 12px · 20% black' },
                  { label: 'Shadow MD', shadow: 'var(--c-shadow-md)', desc: '0 4px 24px · 25% black' },
                  { label: 'Shadow LG', shadow: 'var(--c-shadow-lg)', desc: '0 8px 40px · 30% black' },
                  { label: 'Glow Purple', shadow: 'var(--c-shadow-glow)', desc: '0 0 28px · purple' },
                  { label: 'Glow Mint', shadow: 'var(--c-shadow-mint)', desc: '0 0 28px · mint' },
                ].map(s => (
                  <div
                    key={s.label}
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--c-glass-bg)',
                      border: '1px solid var(--c-border)',
                      boxShadow: s.shadow,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--c-text-1)', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--c-text-3)', fontFamily: 'var(--font-mono)' }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ===== COMPONENTES ===== */}
          <Section id="componentes" title="Componentes" subtitle="Biblioteca de componentes de UI reutilizaveis.">

            <SubSection title="Botoes — Variantes">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="mint">Mint</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                <Button variant="primary" size="sm">Small Primary</Button>
                <Button variant="primary" size="md">Medium Primary</Button>
                <Button variant="primary" size="lg">Large Primary</Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                <Button variant="primary" loading>Carregando...</Button>
                <Button variant="primary" disabled>Desabilitado</Button>
                <Button variant="mint" size="lg">Comecar Agora</Button>
              </div>
            </SubSection>

            <SubSection title="Badges">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                <Badge variant="purple">Novo</Badge>
                <Badge variant="mint">Em Destaque</Badge>
                <Badge variant="white">Padrao</Badge>
                <Badge variant="success">Concluido</Badge>
                <Badge variant="warning">Em Progresso</Badge>
                <Badge variant="error">Expirado</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                <Badge variant="purple" dot>Ao Vivo</Badge>
                <Badge variant="mint" dot>Online</Badge>
                <Badge variant="success" dot>Disponivel</Badge>
                <Badge variant="error" dot>Offline</Badge>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Badge variant="purple" size="sm">SM Purple</Badge>
                <Badge variant="mint" size="sm">SM Mint</Badge>
                <Badge variant="warning" size="sm">SM Warning</Badge>
              </div>
            </SubSection>

            <SubSection title="Avatares">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '16px', marginBottom: '16px' }}>
                {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map(size => (
                  <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Avatar size={size} initials="ME" />
                    <span style={{ fontSize: '10px', color: 'var(--c-text-3)', fontFamily: 'var(--font-mono)' }}>{size}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <Avatar initials="AL" size="md" status="online" />
                <Avatar initials="BR" size="md" status="offline" />
                <Avatar initials="CS" size="md" status="busy" />
                <Avatar initials="ME" size="md" ring />
              </div>
              <AvatarGroup
                size="md"
                avatars={[
                  { initials: 'AL' }, { initials: 'BR' }, { initials: 'CS' },
                  { initials: 'DM' }, { initials: 'EF' }, { initials: 'GH' },
                ]}
                max={4}
              />
            </SubSection>

            <SubSection title="Cards">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <GlassCard hoverable>
                  <Badge variant="mint" size="sm" style={{ marginBottom: '12px' }}>Curso</Badge>
                  <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--c-text-1)', marginBottom: '8px' }}>
                    React Avancado
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--c-text-2)', lineHeight: 1.6, marginBottom: '16px' }}>
                    Hooks, Context, performance e padroes avancados de React.
                  </div>
                  <Button variant="primary" size="sm" fullWidth>Acessar</Button>
                </GlassCard>

                <GlassCard variant="purple" hoverable>
                  <Badge variant="purple" size="sm" style={{ marginBottom: '12px' }}>Destaque</Badge>
                  <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--c-text-1)', marginBottom: '8px' }}>
                    TypeScript Pro
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--c-text-2)', lineHeight: 1.6, marginBottom: '16px' }}>
                    Tipos genericos, utilitarios e boas praticas de TS.
                  </div>
                  <Button variant="mint" size="sm" fullWidth>Comecar</Button>
                </GlassCard>

                <GlassCard variant="mint" hoverable>
                  <Badge variant="success" size="sm" dot style={{ marginBottom: '12px' }}>Ao Vivo</Badge>
                  <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--c-text-1)', marginBottom: '8px' }}>
                    UX/UI Design
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--c-text-2)', lineHeight: 1.6, marginBottom: '16px' }}>
                    Fundamentos de design de interfaces modernas.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AvatarGroup avatars={[{ initials: 'A' }, { initials: 'B' }, { initials: 'C' }]} size="xs" max={3} />
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--c-text-2)' }}>+24 alunos</span>
                  </div>
                </GlassCard>
              </div>
            </SubSection>

            <SubSection title="Notificacoes">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '420px' }}>
                <Notification variant="info" title="Novo conteudo disponivel" message="Uma nova aula foi adicionada ao seu curso de React." />
                <Notification variant="success" title="Certificado gerado!" message="Seu certificado de TypeScript foi emitido com sucesso." />
                <Notification variant="warning" title="Prazo se encerrando" message="Voce tem 2 dias para completar o modulo atual." />
                <Notification variant="error" title="Falha no pagamento" message="Nao foi possivel processar sua assinatura. Verifique o cartao." />
              </div>
            </SubSection>
          </Section>

          {/* ===== FORMULARIOS ===== */}
          <Section id="formularios" title="Formularios" subtitle="Campos de entrada, selects, checkboxes e toggles.">

            <SubSection title="Input">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <Input
                  label="Nome completo"
                  placeholder="Seu nome aqui..."
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.3"/></svg>}
                />
                <Input
                  label="Senha"
                  type="password"
                  placeholder="Minimo 8 caracteres"
                  error="A senha deve ter pelo menos 8 caracteres."
                />
                <Input
                  label="Pesquisar curso"
                  placeholder="React, TypeScript..."
                  helper="Busque em mais de 200 cursos disponíveis"
                />
              </div>
            </SubSection>

            <SubSection title="Textarea">
              <Textarea
                label="Descricao do perfil"
                placeholder="Conte um pouco sobre voce..."
                value={textVal}
                onChange={e => setTextVal(e.target.value)}
                rows={4}
                helper="Maximo de 280 caracteres"
                style={{ maxWidth: '480px' }}
              />
            </SubSection>

            <SubSection title="Select">
              <Select
                label="Area de interesse"
                value={selectVal}
                onChange={e => setSelectVal(e.target.value)}
                placeholder="Selecione uma area..."
                options={[
                  { value: 'frontend', label: 'Frontend Development' },
                  { value: 'backend', label: 'Backend Development' },
                  { value: 'mobile', label: 'Mobile Development' },
                  { value: 'devops', label: 'DevOps & Cloud' },
                  { value: 'ux', label: 'UX/UI Design' },
                  { value: 'data', label: 'Data Science & ML' },
                ]}
                style={{ maxWidth: '320px' }}
              />
            </SubSection>

            <SubSection title="Checkboxes">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Checkbox
                  label="Receber novidades por email"
                  checked={checkboxState.a}
                  onChange={v => setCheckboxState(s => ({ ...s, a: v }))}
                />
                <Checkbox
                  label="Aceitar termos de uso"
                  checked={checkboxState.b}
                  onChange={v => setCheckboxState(s => ({ ...s, b: v }))}
                />
                <Checkbox
                  label="Opcao desabilitada"
                  checked={checkboxState.c}
                  disabled
                />
              </div>
            </SubSection>

            <SubSection title="Toggles">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Toggle
                  label="Ativar notificacoes push"
                  checked={toggleState.notifs}
                  onChange={v => setToggleState(s => ({ ...s, notifs: v }))}
                />
                <Toggle
                  label="Modo escuro por padrao"
                  checked={toggleState.darkMode}
                  onChange={v => setToggleState(s => ({ ...s, darkMode: v }))}
                />
                <Toggle
                  label="Toggle desabilitado"
                  checked={toggleState.emails}
                  disabled
                />
              </div>
            </SubSection>
          </Section>

          {/* ===== MOTION ===== */}
          <Section id="motion" title="Motion" subtitle="Animacoes, estados de carregamento e tokens de movimento.">

            <SubSection title="Loading Spinners">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <GlassCard style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px' }}>
                    <RingSpinner />
                  </GlassCard>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--c-text-3)' }}>Ring Purple</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <GlassCard style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px' }}>
                    <RingSpinner color="#83e6c3" />
                  </GlassCard>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--c-text-3)' }}>Ring Mint</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <GlassCard style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px' }}>
                    <BounceDots />
                  </GlassCard>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--c-text-3)' }}>Bounce Dots</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <GlassCard style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px' }}>
                    <PulseRing />
                  </GlassCard>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--c-text-3)' }}>Pulse Ring</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <GlassCard style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px' }}>
                    <BarLoader />
                  </GlassCard>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--c-text-3)' }}>Bar Loader</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="Skeleton Loaders">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-3)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>Course Card</div>
                  <SkeletonCard />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-3)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>User Rows</div>
                  <GlassCard style={{ padding: '8px 20px' }}>
                    <SkeletonUserRow />
                    <div style={{ height: '1px', background: 'var(--c-border)' }} />
                    <SkeletonUserRow />
                    <div style={{ height: '1px', background: 'var(--c-border)' }} />
                    <SkeletonUserRow />
                  </GlassCard>
                </div>
              </div>
            </SubSection>

            <SubSection title="Progress Bar">
              <GlassCard style={{ maxWidth: '480px' }}>
                <ProgressBar />
              </GlassCard>
            </SubSection>

            <SubSection title="Logo Animation">
              <GlassCard variant="purple" style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                <LogoAnimation />
              </GlassCard>
            </SubSection>

            <SubSection title="Icon Animations (hover para ativar)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <AnimatedCheckIcon />
                  <span style={{ fontSize: '11px', color: 'var(--c-text-3)' }}>Sucesso</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <AnimatedErrorIcon />
                  <span style={{ fontSize: '11px', color: 'var(--c-text-3)' }}>Erro</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <AnimatedInfoIcon />
                  <span style={{ fontSize: '11px', color: 'var(--c-text-3)' }}>Informacao</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <AnimatedWarningIcon />
                  <span style={{ fontSize: '11px', color: 'var(--c-text-3)' }}>Aviso</span>
                </div>
              </div>
            </SubSection>

            {/* Animation reference table */}
            <SubSection title="Referencia de Keyframes">
              <GlassCard>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                        {['Nome', 'Duracao', 'Easing', 'Uso'].map(h => (
                          <th key={h} style={{
                            padding: '10px 14px', textAlign: 'left',
                            fontSize: '11px', fontWeight: 600,
                            color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'spin', dur: '700ms', ease: 'linear', uso: 'Ring spinner' },
                        { name: 'spin-slow', dur: '2000ms', ease: 'linear', uso: 'Logo ring' },
                        { name: 'bounce-dot', dur: '600ms', ease: 'ease-in-out', uso: 'Loading dots' },
                        { name: 'pulse-ring', dur: '1200ms', ease: 'ease-out', uso: 'Pulse indicator' },
                        { name: 'bar-grow', dur: '600ms', ease: 'ease-in-out', uso: 'Bar loader' },
                        { name: 'shimmer', dur: '1600ms', ease: 'linear', uso: 'Skeleton' },
                        { name: 'draw-check', dur: '350ms', ease: 'ease', uso: 'Icon draw' },
                        { name: 'logo-reveal', dur: '400ms', ease: 'ease', uso: 'Logo wordmark' },
                        { name: 'slide-in-right', dur: '300ms', ease: 'ease', uso: 'Notification' },
                        { name: 'slide-in-up', dur: '300ms', ease: 'ease', uso: 'Modal/toast' },
                        { name: 'fade-scale-in', dur: '300ms', ease: 'spring', uso: 'Icon hover' },
                        { name: 'warning-pulse', dur: '600ms', ease: 'ease-in-out', uso: 'Warning icon' },
                        { name: 'progress-fill', dur: '1200ms', ease: 'spring', uso: 'Progress bar' },
                        { name: 'theme-pop', dur: '250ms', ease: 'ease', uso: 'Theme toggle' },
                      ].map((row, i, arr) => (
                        <tr key={row.name} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--c-border-sm)' : 'none' }}>
                          <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--c-text-purple)', fontSize: '12px' }}>{row.name}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--c-text-2)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{row.dur}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--c-text-2)' }}>{row.ease}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--c-text-3)' }}>{row.uso}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </SubSection>
          </Section>
        </main>
      </div>
    </div>
  )
}
