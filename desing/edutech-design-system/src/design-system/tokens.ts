export const colors = {
  navy: {
    50:  '#f0f1f9',
    100: '#d4d6ed',
    200: '#a9aede',
    300: '#7e85cf',
    400: '#535dbf',
    500: '#3a3493',
    600: '#2d2278',
    700: '#22105d',
    800: '#160c40',
    900: '#0c143b',
  },
  blue: {
    50:  '#eef5fb',
    100: '#cce4f5',
    200: '#99c9eb',
    300: '#66aee1',
    400: '#5291bb',
    500: '#3d7599',
    600: '#2b5977',
    700: '#1a3d55',
  },
  mint: {
    50:  '#edfaf5',
    100: '#c7f4e3',
    200: '#9fecd1',
    300: '#83e6c3',
    400: '#52d4a8',
    500: '#2abd8d',
    600: '#1e9b73',
    700: '#167a5b',
  },
  neutral: {
    50:  '#ffffff',
    100: '#f6f6f8',
    200: '#e8e8ec',
    300: '#d0d0d8',
    400: '#a8a8b6',
    500: '#808090',
    600: '#585868',
    700: '#303040',
  },
  white: {
    full: '#ffffff',
    90: 'rgba(255,255,255,0.90)',
    80: 'rgba(255,255,255,0.80)',
    55: 'rgba(255,255,255,0.55)',
    30: 'rgba(255,255,255,0.30)',
    15: 'rgba(255,255,255,0.15)',
    10: 'rgba(255,255,255,0.10)',
    8:  'rgba(255,255,255,0.08)',
    4:  'rgba(255,255,255,0.04)',
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
    error:   '#ef4444',
    info:    '#5291bb',
  },
} as const

export const gradients = {
  heroBackground:     'linear-gradient(135deg, #060a18 0%, #0c143b 50%, #100e30 100%)',
  glassBlue:          'linear-gradient(135deg, rgba(82,145,187,0.25) 0%, rgba(34,16,93,0.15) 100%)',
  glassMint:          'linear-gradient(135deg, rgba(131,230,195,0.20) 0%, rgba(82,212,168,0.10) 100%)',
  glassCard:          'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
  primaryButton:      'linear-gradient(135deg, #5291bb 0%, #22105d 100%)',
  primaryButtonHover: 'linear-gradient(135deg, #73acd2 0%, #5291bb 100%)',
  mintButton:         'linear-gradient(135deg, #83e6c3 0%, #52d4a8 100%)',
  logoGradient:       'linear-gradient(135deg, #5291bb 0%, #83e6c3 100%)',
  shimmer:            'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
} as const

export const glass = {
  sm: {
    background:     'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(8px)',
    border:         '1px solid rgba(255,255,255,0.08)',
    boxShadow:      '0 2px 12px rgba(0,0,0,0.20)',
  },
  default: {
    background:     'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(16px)',
    border:         '1px solid rgba(255,255,255,0.12)',
    boxShadow:      '0 4px 24px rgba(0,0,0,0.25)',
  },
  lg: {
    background:     'rgba(255,255,255,0.14)',
    backdropFilter: 'blur(24px)',
    border:         '1px solid rgba(255,255,255,0.18)',
    boxShadow:      '0 8px 40px rgba(0,0,0,0.30)',
  },
  blue: {
    background:     'rgba(82,145,187,0.15)',
    backdropFilter: 'blur(20px)',
    border:         '1px solid rgba(82,145,187,0.30)',
    boxShadow:      '0 0 28px rgba(82,145,187,0.40), 0 8px 24px rgba(0,0,0,0.30)',
  },
  mint: {
    background:     'rgba(131,230,195,0.10)',
    backdropFilter: 'blur(20px)',
    border:         '1px solid rgba(131,230,195,0.25)',
    boxShadow:      '0 0 28px rgba(131,230,195,0.28), 0 8px 24px rgba(0,0,0,0.25)',
  },
} as const

export const typography = {
  fontFamily: {
    heading: "'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    sans:    "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono:    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
  fontSize: {
    xs:   '11px',
    sm:   '13px',
    base: '15px',
    md:   '17px',
    lg:   '20px',
    xl:   '24px',
    '2xl': '30px',
    '3xl': '38px',
    '4xl': '48px',
  },
  fontWeight: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },
  lineHeight: {
    tight:   1.2,
    snug:    1.3,
    normal:  1.5,
    relaxed: 1.6,
  },
} as const

export const spacing = {
  1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px',
  6: '24px', 8: '32px', 10: '40px', 12: '48px',
  16: '64px', 20: '80px', 24: '96px',
} as const

export const borderRadius = {
  xs: '4px', sm: '8px', md: '12px', lg: '16px',
  xl: '24px', '2xl': '32px', full: '9999px',
} as const

export const animation = {
  duration: {
    fast:     '150ms',
    normal:   '250ms',
    slow:     '400ms',
    slower:   '600ms',
    slowest:  '800ms',
    spinSlow: '2000ms',
  },
  easing: {
    linear:    'linear',
    ease:      'ease',
    easeIn:    'ease-in',
    easeOut:   'ease-out',
    easeInOut: 'ease-in-out',
    spring:    'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const

export const breakpoints = {
  sm: '480px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1440px',
} as const
