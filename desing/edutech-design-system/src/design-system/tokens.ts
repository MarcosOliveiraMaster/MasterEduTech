export const colors = {
  purple: {
    50: '#f5f0ff',
    100: '#ede0ff',
    200: '#d4b8ff',
    300: '#b48aff',
    400: '#9a5bff',
    500: '#7c3aed',
    600: '#6020cc',
    700: '#4b16a8',
    800: '#22105d',
    900: '#140a3c',
  },
  mint: {
    50: '#edfaf5',
    100: '#c7f4e3',
    200: '#9fecd1',
    300: '#83e6c3',
    400: '#52d4a8',
    500: '#2abd8d',
    600: '#1e9b73',
    700: '#167a5b',
  },
  white: {
    full: '#ffffff',
    90: 'rgba(255,255,255,0.90)',
    80: 'rgba(255,255,255,0.80)',
    55: 'rgba(255,255,255,0.55)',
    30: 'rgba(255,255,255,0.30)',
    15: 'rgba(255,255,255,0.15)',
    10: 'rgba(255,255,255,0.10)',
    8: 'rgba(255,255,255,0.08)',
    4: 'rgba(255,255,255,0.04)',
    glassDefault: 'rgba(255,255,255,0.08)',
    glassSm: 'rgba(255,255,255,0.04)',
    glassLg: 'rgba(255,255,255,0.14)',
    glassMint: 'rgba(131,230,195,0.10)',
  },
  black: {
    full: '#000000',
    60: 'rgba(0,0,0,0.60)',
    40: 'rgba(0,0,0,0.40)',
    25: 'rgba(0,0,0,0.25)',
    12: 'rgba(0,0,0,0.12)',
  },
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#7c3aed',
  },
} as const

export const gradients = {
  heroBackground: 'linear-gradient(135deg, #08051a 0%, #150830 50%, #0c143b 100%)',
  glassPurple: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(96,32,204,0.15) 100%)',
  glassMint: 'linear-gradient(135deg, rgba(131,230,195,0.20) 0%, rgba(82,212,168,0.10) 100%)',
  glassCard: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
  primaryButton: 'linear-gradient(135deg, #7c3aed 0%, #6020cc 100%)',
  primaryButtonHover: 'linear-gradient(135deg, #9a5bff 0%, #7c3aed 100%)',
  mintButton: 'linear-gradient(135deg, #83e6c3 0%, #52d4a8 100%)',
  shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
} as const

export const glass = {
  sm: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.20)',
  },
  default: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
  },
  lg: {
    background: 'rgba(255,255,255,0.14)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.18)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.30)',
  },
  purple: {
    background: 'rgba(124,58,237,0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(124,58,237,0.30)',
    boxShadow: '0 0 28px rgba(124,58,237,0.38), 0 8px 24px rgba(0,0,0,0.30)',
  },
  mint: {
    background: 'rgba(131,230,195,0.10)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(131,230,195,0.25)',
    boxShadow: '0 0 28px rgba(131,230,195,0.28), 0 8px 24px rgba(0,0,0,0.25)',
  },
} as const

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
  fontSize: {
    xs: '11px',
    sm: '13px',
    base: '15px',
    md: '17px',
    lg: '20px',
    xl: '24px',
    '2xl': '30px',
    '3xl': '38px',
    '4xl': '48px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const

export const borderRadius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
} as const

export const animation = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    slower: '600ms',
    slowest: '800ms',
    spinSlow: '2000ms',
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const

export const breakpoints = {
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const
