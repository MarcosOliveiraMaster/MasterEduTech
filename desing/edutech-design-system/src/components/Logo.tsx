import React from 'react'

// ─── Shared path data ─────────────────────────────────────────
const LEFT_LOOP   = 'M52,30 C46,20 18,18 10,38 C2,58 12,78 28,80 C42,82 52,70 52,50'
const RIGHT_LOOP  = 'M52,30 C58,20 84,22 86,44 C88,64 76,80 60,80 C46,80 44,68 52,50'
const ARROW_SHAFT = 'M74,26 L92,8'
const ARROW_HEAD  = 'M92,8 L84,16 M92,8 L80,18'

const S = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: 8,
  fill: 'none',
}

interface MarkProps {
  size?: number
  style?: React.CSSProperties
  className?: string
}

// ─── 1. Original — gradient mint→blue ─────────────────────────
export const LogoMarkOriginal: React.FC<MarkProps> = ({ size = 48, style, className }) => (
  <svg viewBox="0 0 106 95" width={size} height={size} fill="none" style={style} className={className}>
    <defs>
      <linearGradient id="logo-grad-orig" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#5291bb" />
        <stop offset="100%" stopColor="#83e6c3" />
      </linearGradient>
    </defs>
    <path d={LEFT_LOOP}   stroke="url(#logo-grad-orig)" {...S} />
    <path d={RIGHT_LOOP}  stroke="url(#logo-grad-orig)" {...S} />
    <path d={ARROW_SHAFT} stroke="url(#logo-grad-orig)" {...S} />
    <path d={ARROW_HEAD}  stroke="url(#logo-grad-orig)" {...S} />
  </svg>
)

// ─── 2. Negativo — white ──────────────────────────────────────
export const LogoMarkNegativo: React.FC<MarkProps> = ({ size = 48, style, className }) => (
  <svg viewBox="0 0 106 95" width={size} height={size} fill="none" style={style} className={className}>
    <path d={LEFT_LOOP}   stroke="#ffffff" {...S} />
    <path d={RIGHT_LOOP}  stroke="#ffffff" {...S} />
    <path d={ARROW_SHAFT} stroke="#ffffff" {...S} />
    <path d={ARROW_HEAD}  stroke="#ffffff" {...S} />
  </svg>
)

// ─── 3. Tons de azul — steel blue ─────────────────────────────
export const LogoMarkBlue: React.FC<MarkProps> = ({ size = 48, style, className }) => (
  <svg viewBox="0 0 106 95" width={size} height={size} fill="none" style={style} className={className}>
    <path d={LEFT_LOOP}   stroke="#5291bb" {...S} />
    <path d={RIGHT_LOOP}  stroke="#5291bb" {...S} />
    <path d={ARROW_SHAFT} stroke="#5291bb" {...S} />
    <path d={ARROW_HEAD}  stroke="#5291bb" {...S} />
  </svg>
)

// ─── 4. Navy — dark ──────────────────────────────────────────
export const LogoMarkNavy: React.FC<MarkProps> = ({ size = 48, style, className }) => (
  <svg viewBox="0 0 106 95" width={size} height={size} fill="none" style={style} className={className}>
    <path d={LEFT_LOOP}   stroke="#0c143b" {...S} />
    <path d={RIGHT_LOOP}  stroke="#0c143b" {...S} />
    <path d={ARROW_SHAFT} stroke="#0c143b" {...S} />
    <path d={ARROW_HEAD}  stroke="#0c143b" {...S} />
  </svg>
)

// ─── Full Logo (mark + wordmark) ──────────────────────────────
export type LogoVariant = 'original' | 'negativo' | 'blue' | 'navy'
export type LogoSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  style?: React.CSSProperties
}

const SIZE_MAP: Record<LogoSize, { mark: number; master: string; edutech: string; gap: string }> = {
  xs: { mark: 28, master: '16px', edutech: '14px', gap: '8px'  },
  sm: { mark: 36, master: '20px', edutech: '18px', gap: '10px' },
  md: { mark: 48, master: '26px', edutech: '24px', gap: '12px' },
  lg: { mark: 64, master: '34px', edutech: '30px', gap: '14px' },
  xl: { mark: 80, master: '42px', edutech: '38px', gap: '16px' },
}

const TEXT_COLORS: Record<LogoVariant, { master: string; edutech: string }> = {
  original: { master: '#83e6c3', edutech: 'rgba(131,230,195,0.75)' },
  negativo: { master: '#ffffff', edutech: 'rgba(255,255,255,0.75)' },
  blue:     { master: '#5291bb', edutech: 'rgba(82,145,187,0.80)'  },
  navy:     { master: '#0c143b', edutech: 'rgba(12,20,59,0.70)'    },
}

const MARK_MAP: Record<LogoVariant, React.FC<MarkProps>> = {
  original: LogoMarkOriginal,
  negativo: LogoMarkNegativo,
  blue:     LogoMarkBlue,
  navy:     LogoMarkNavy,
}

export const Logo: React.FC<LogoProps> = ({ variant = 'original', size = 'md', style }) => {
  const { mark: markSize, master, edutech, gap } = SIZE_MAP[size]
  const { master: masterColor, edutech: edutechColor } = TEXT_COLORS[variant]
  const Mark = MARK_MAP[variant]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, ...style }}>
      {variant === 'original'
        ? <img src={`${import.meta.env.BASE_URL}logo/logo1.png`} width={markSize} height={markSize} style={{ objectFit: 'contain' }} alt="MasterEduTech logo" />
        : variant === 'negativo'
        ? <img src={`${import.meta.env.BASE_URL}logo/logo-branca.png`} width={markSize} height={markSize} style={{ objectFit: 'contain' }} alt="MasterEduTech logo branca" />
        : variant === 'blue'
        ? <img src={`${import.meta.env.BASE_URL}logo/logo-azulcalara.png`} width={markSize} height={markSize} style={{ objectFit: 'contain' }} alt="MasterEduTech logo azul clara" />
        : variant === 'navy'
        ? <img src={`${import.meta.env.BASE_URL}logo/logo-azulescuro.png`} width={markSize} height={markSize} style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} alt="MasterEduTech logo azul escuro" />
        : <Mark size={markSize} />
      }
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
        {variant === 'original' ? (
          <span style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '3px',
            background: 'linear-gradient(to right, #5291bb 0%, #83e6c3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: master,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}>MASTER</span>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 400,
              fontSize: edutech,
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>Edutech</span>
          </span>
        ) : (
          <>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: master,
              color: masterColor,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}>MASTER</span>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 400,
              fontSize: edutech,
              color: edutechColor,
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>Edutech</span>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Animated Variants ────────────────────────────────────────

export const LogoAnimatedFloat: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg viewBox="0 0 106 95" width={size} height={size} fill="none"
    style={{ animation: 'logo-float 3s ease-in-out infinite' }}>
    <defs>
      <linearGradient id="logo-grad-float" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#5291bb" />
        <stop offset="100%" stopColor="#83e6c3" />
      </linearGradient>
    </defs>
    <path d={LEFT_LOOP}   stroke="url(#logo-grad-float)" {...S} />
    <path d={RIGHT_LOOP}  stroke="url(#logo-grad-float)" {...S} />
    <path d={ARROW_SHAFT} stroke="#83e6c3" {...S} />
    <path d={ARROW_HEAD}  stroke="#83e6c3" {...S} />
  </svg>
)

export const LogoAnimatedDraw: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg viewBox="0 0 106 95" width={size} height={size} fill="none">
    <defs>
      <linearGradient id="logo-grad-draw" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#5291bb" />
        <stop offset="100%" stopColor="#83e6c3" />
      </linearGradient>
    </defs>
    <path d={LEFT_LOOP}  stroke="url(#logo-grad-draw)" {...S}
      strokeDasharray="300"
      style={{ animation: 'logo-draw 1.4s ease forwards', animationDelay: '0s' }} />
    <path d={RIGHT_LOOP} stroke="url(#logo-grad-draw)" {...S}
      strokeDasharray="300"
      style={{ animation: 'logo-draw 1.4s ease forwards', animationDelay: '0.3s', opacity: 0 }} />
    <path d={ARROW_SHAFT} stroke="#83e6c3" {...S}
      strokeDasharray="100"
      style={{ animation: 'logo-draw 0.6s ease forwards', animationDelay: '0.9s', opacity: 0 }} />
    <path d={ARROW_HEAD}  stroke="#83e6c3" {...S}
      strokeDasharray="60"
      style={{ animation: 'logo-draw 0.4s ease forwards', animationDelay: '1.2s', opacity: 0 }} />
  </svg>
)

export const LogoAnimatedGlow: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg viewBox="0 0 106 95" width={size} height={size} fill="none"
    style={{ animation: 'logo-glow-pulse 2.5s ease-in-out infinite' }}>
    <defs>
      <linearGradient id="logo-grad-glow" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#5291bb" />
        <stop offset="100%" stopColor="#83e6c3" />
      </linearGradient>
    </defs>
    <path d={LEFT_LOOP}   stroke="url(#logo-grad-glow)" {...S} />
    <path d={RIGHT_LOOP}  stroke="url(#logo-grad-glow)" {...S} />
    <path d={ARROW_SHAFT} stroke="#83e6c3" {...S} />
    <path d={ARROW_HEAD}  stroke="#83e6c3" {...S} />
  </svg>
)

export const LogoAnimatedSpinReveal: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg viewBox="0 0 106 95" width={size} height={size} fill="none"
    style={{ animation: 'logo-spin-reveal 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
    <defs>
      <linearGradient id="logo-grad-spin" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#5291bb" />
        <stop offset="100%" stopColor="#83e6c3" />
      </linearGradient>
    </defs>
    <path d={LEFT_LOOP}   stroke="url(#logo-grad-spin)" {...S} />
    <path d={RIGHT_LOOP}  stroke="url(#logo-grad-spin)" {...S} />
    <path d={ARROW_SHAFT} stroke="#83e6c3" {...S} />
    <path d={ARROW_HEAD}  stroke="#83e6c3" {...S} />
  </svg>
)

export const LogoAnimatedMorph: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg viewBox="0 0 106 95" width={size} height={size} fill="none"
    style={{ animation: 'logo-morph 4s ease-in-out infinite', transformOrigin: 'center' }}>
    <defs>
      <linearGradient id="logo-grad-morph" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#5291bb" />
        <stop offset="100%" stopColor="#83e6c3" />
      </linearGradient>
    </defs>
    <path d={LEFT_LOOP}   stroke="url(#logo-grad-morph)" {...S} />
    <path d={RIGHT_LOOP}  stroke="url(#logo-grad-morph)" {...S} />
    <path d={ARROW_SHAFT} stroke="#83e6c3" {...S} />
    <path d={ARROW_HEAD}  stroke="#83e6c3" {...S} />
  </svg>
)
