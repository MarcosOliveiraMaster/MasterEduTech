import React, { useState, useCallback } from 'react'
import { GlassCard } from './GlassCard'
import { Select, Checkbox } from './Input'
import { Button } from './Button'

// ─── Types ───────────────────────────────────────────────────

type Variant = 'original' | 'negativo' | 'blue' | 'navy'
type Ratio   = '1:1' | '3:4' | '4:3' | '16:9' | '9:16'
type Layout  = 'linha' | 'square'
type BgKey   = 'transparent' | 'white' | 'black' | 'blue-light' | 'blue-dark'
type Format  = 'png' | 'svg'

// ─── Config tables ────────────────────────────────────────────

const RATIO_DIMS: Record<Ratio, [number, number]> = {
  '1:1':  [2000, 2000],
  '3:4':  [1500, 2000],
  '4:3':  [2000, 1500],
  '16:9': [2000, 1125],
  '9:16': [1125, 2000],
}

const PREVIEW_W = 280

function previewDims(ratio: Ratio): [number, number] {
  const [rw, rh] = RATIO_DIMS[ratio]
  if (rw >= rh) return [PREVIEW_W, Math.round((rh / rw) * PREVIEW_W)]
  const ph = PREVIEW_W
  return [Math.round((rw / rh) * ph), ph]
}

const BG_HEX: Record<BgKey, string | null> = {
  transparent:  null,
  white:        '#ffffff',
  black:        '#000000',
  'blue-light': '#f6f6f8',
  'blue-dark':  '#0c143b',
}

// SVG fill values (supports url(#grad) refs)
const TEXT_COLOR: Record<Variant, { master: string; edutech: string }> = {
  original: { master: 'url(#textGrad)',              edutech: 'url(#textGrad)' },
  negativo: { master: '#ffffff',                     edutech: 'rgba(255,255,255,0.75)' },
  blue:     { master: '#5291bb',                     edutech: 'rgba(82,145,187,0.80)' },
  navy:     { master: '#0c143b',                     edutech: 'rgba(12,20,59,0.70)' },
}

// Canvas solid fills (gradient handled dynamically)
const CANVAS_TC: Record<Variant, { master: string; edutech: string }> = {
  original: { master: '#5291bb',  edutech: '#83e6c3' },
  negativo: { master: '#ffffff',  edutech: 'rgba(255,255,255,0.75)' },
  blue:     { master: '#5291bb',  edutech: 'rgba(82,145,187,0.80)' },
  navy:     { master: '#0c143b',  edutech: 'rgba(12,20,59,0.70)' },
}

const PREVIEW_TEXT_CSS: Record<Variant, {
  master: React.CSSProperties
  edutech: React.CSSProperties
}> = {
  original: {
    master:  { background: 'linear-gradient(to right,#5291bb,#83e6c3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
    edutech: { background: 'linear-gradient(to right,#5291bb,#83e6c3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  },
  negativo: { master: { color: '#ffffff' },  edutech: { color: 'rgba(255,255,255,0.75)' } },
  blue:     { master: { color: '#5291bb' },  edutech: { color: 'rgba(82,145,187,0.80)' } },
  navy:     { master: { color: '#0c143b' },  edutech: { color: 'rgba(12,20,59,0.70)' } },
}

const LOGO_FILES: Record<Variant, string> = {
  original: 'logo1.png',
  negativo: 'logo-branca.png',
  blue:     'logo-azulcalara.png',
  navy:     'logo-azulescuro.png',
}

// ─── Zoom helper ──────────────────────────────────────────────

function computeZoom(layout: Layout, w: number, h: number, logoSize: number): number {
  const sm = Math.min(w, h)
  const baseMarkH = sm * 0.28
  const totalHFactor = 1.975
  // mark bounding box is square (1.0), not 106/95 — matches preview objectFit:contain
  const totalWFactor = 2.893
  const maxZoom = layout === 'square'
    ? (h * 0.90) / (baseMarkH * totalHFactor)
    : (w * 0.90) / (baseMarkH * totalWFactor)
  return 1 + (logoSize / 100) * Math.max(0, maxZoom - 1)
}

// ─── Centralised dimension calculator ────────────────────────
// Single source of truth for every size used in preview, SVG and PNG.
// Applies a uniform scale-down if the group would exceed the canvas bounds
// (prevents clipping when logoMark / spacing sliders are pushed to extremes).

interface LogoDims {
  markH: number; masterSz: number; edutechSz: number
  gap: number;   innerGap: number
}

function computeDims(
  layout: Layout, w: number, h: number,
  logoSize: number, logoMark: number, spacing: number,
  showText: boolean,
): LogoDims {
  const sm    = Math.min(w, h)
  const zoom  = computeZoom(layout, w, h, logoSize)
  const baseH = sm * 0.28 * zoom

  let mH  = baseH * (1 + logoMark / 100)   // mark bounding box (square)
  let mSz = baseH * 0.43                     // MASTER font-size
  let eSz = baseH * 0.35                     // EduTech font-size
  let g   = baseH * 0.13 * (spacing / 50)   // outer gap (mark ↔ text block)
  let ig  = g * 0.3                          // inner gap (MASTER ↔ EduTech)

  // Pre-rounding group bounds — check both axes with conservative text width (4.5em)
  // 4.5 instead of 4.1 guards against wide font fallbacks (Arial Black) in SVG viewers
  // Linha: width-constrained (text flows right); height = mark (text block always < markH)
  // Square: height-constrained (text stacks below) AND width = max(mark, text width)
  const TEXT_W_FACTOR = 4.5
  const gW = layout === 'linha'
    ? mH + (showText ? g + mSz * TEXT_W_FACTOR : 0)
    : showText ? Math.max(mH, mSz * TEXT_W_FACTOR) : mH
  const gH = layout === 'square'
    ? mH + (showText ? g + mSz + ig + eSz : 0)
    : mH

  const MARGIN = 0.92  // 92% of canvas — 4% breathing room each side
  const fitW = gW > w * MARGIN ? (w * MARGIN) / gW : 1
  const fitH = gH > h * MARGIN ? (h * MARGIN) / gH : 1
  const fs   = Math.min(fitW, fitH)

  if (fs < 1) { mH *= fs; mSz *= fs; eSz *= fs; g *= fs; ig *= fs }

  return {
    markH:     Math.round(mH),
    masterSz:  Math.round(mSz),
    edutechSz: Math.round(eSz),
    gap:       Math.round(g),
    innerGap:  Math.round(ig),
  }
}

// ─── Async image helpers ──────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function fetchAsBase64(url: string): Promise<string> {
  const resp = await fetch(url)
  const blob = await resp.blob()
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

// ─── Canvas text helper ───────────────────────────────────────

function drawCanvasText(
  ctx: CanvasRenderingContext2D,
  v: Variant,
  text: string,
  x: number,
  y: number,
  sz: number,
  weight: string,
  family: string,
) {
  ctx.font = `${weight} ${sz}px ${family}`
  if (v === 'original') {
    const measured = ctx.measureText(text).width
    const isCenter = ctx.textAlign === 'center'
    const x0 = isCenter ? x - measured / 2 : x
    const gr = ctx.createLinearGradient(x0, 0, x0 + measured, 0)
    gr.addColorStop(0, '#5291bb')
    gr.addColorStop(1, '#83e6c3')
    ctx.fillStyle = gr
  } else {
    ctx.fillStyle = text === 'MASTER' ? CANVAS_TC[v].master : CANVAS_TC[v].edutech
  }
  ctx.fillText(text, x, y)
}

// ─── SVG builder (async — embeds real PNG as base64) ──────────

async function buildSVG(
  v: Variant, ratio: Ratio, layout: Layout, bgKey: BgKey,
  useGrad: boolean, logoSize: number, logoMark: number, spacing: number,
  showText: boolean,
): Promise<string> {
  const [w, h] = RATIO_DIMS[ratio]
  const { markH, masterSz, edutechSz, gap, innerGap } = computeDims(
    layout, w, h, logoSize, logoMark, spacing, showText,
  )

  const bgHex     = BG_HEX[bgKey]
  const tc        = TEXT_COLOR[v]
  const isNavy    = v === 'navy'
  const blendAttr = isNavy ? ' style="mix-blend-mode: multiply"' : ''

  const logoDataUrl = await fetchAsBase64(
    `${import.meta.env.BASE_URL}logo/${LOGO_FILES[v]}`,
  )

  let logoEl  = ''
  let textEls = ''

  // Alphabetic baseline (universal, no dominant-baseline needed) + ascent offset ≈ 0.79
  // text-before-edge is SVG 1.1 only — not in Chrome/Firefox CSS baseline; falls back to alphabetic
  const ASCENT = 0.79

  if (layout === 'linha') {
    // Center text block vertically against the mark box
    const textBlockH  = masterSz + innerGap + edutechSz
    const approxTW    = showText ? Math.round(masterSz * 4.1) : 0
    const totalW      = markH + (showText ? gap + approxTW : 0)
    const markX       = Math.round((w - totalW) / 2)
    const markY       = Math.round((h - markH) / 2)
    const textX       = markX + markH + gap
    const masterTop   = markY + Math.round((markH - textBlockH) / 2)
    const edutechTop  = masterTop + masterSz + innerGap
    // Y = top of visual box + ascent → alphabetic baseline position
    const masterY     = masterTop  + Math.round(masterSz  * ASCENT)
    const edutechY    = edutechTop + Math.round(edutechSz * ASCENT)

    logoEl = `  <image x="${markX}" y="${markY}" width="${markH}" height="${markH}" href="${logoDataUrl}" preserveAspectRatio="xMidYMid meet"${blendAttr}/>`

    if (showText) textEls = `
  <text x="${textX}" y="${masterY}" font-family="'Montserrat','Arial Black',Arial,sans-serif" font-weight="700" font-size="${masterSz}" fill="${tc.master}" style="letter-spacing:-0.02em">MASTER</text>
  <text x="${textX}" y="${edutechY}" font-family="'Inter',Helvetica,Arial,sans-serif" font-weight="400" font-size="${edutechSz}" fill="${tc.edutech}" style="letter-spacing:-0.01em">EduTech</text>`
  } else {
    const textH  = showText ? masterSz + innerGap + edutechSz : 0
    const totalH = markH + (showText ? gap + textH : 0)
    const markY  = Math.round((h - totalH) / 2)
    const markX  = Math.round((w - markH) / 2)
    const cx     = Math.round(w / 2)
    const masterTop  = markY + markH + gap
    const edutechTop = masterTop + masterSz + innerGap
    const masterY    = masterTop  + Math.round(masterSz  * ASCENT)
    const edutechY   = edutechTop + Math.round(edutechSz * ASCENT)

    logoEl = `  <image x="${markX}" y="${markY}" width="${markH}" height="${markH}" href="${logoDataUrl}" preserveAspectRatio="xMidYMid meet"${blendAttr}/>`

    if (showText) textEls = `
  <text x="${cx}" y="${masterY}" text-anchor="middle" font-family="'Montserrat','Arial Black',Arial,sans-serif" font-weight="700" font-size="${masterSz}" fill="${tc.master}" style="letter-spacing:-0.02em">MASTER</text>
  <text x="${cx}" y="${edutechY}" text-anchor="middle" font-family="'Inter',Helvetica,Arial,sans-serif" font-weight="400" font-size="${edutechSz}" fill="${tc.edutech}" style="letter-spacing:-0.01em">EduTech</text>`
  }

  const defs = `<defs>
    ${v === 'original' ? `<linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#5291bb"/><stop offset="100%" stop-color="#83e6c3"/></linearGradient>` : ''}
    ${useGrad && bgHex ? `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/><stop offset="100%" stop-color="#000000" stop-opacity="0.35"/></linearGradient>` : ''}
  </defs>`

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`,
    defs,
    bgHex ? `  <rect width="${w}" height="${h}" fill="${bgHex}"/>` : '',
    useGrad && bgHex ? `  <rect width="${w}" height="${h}" fill="url(#bgGrad)"/>` : '',
    logoEl,
    textEls,
    '</svg>',
  ].join('\n')
}

// ─── PNG export (canvas-based — draws real PNG directly) ──────

async function exportPNG(
  v: Variant, ratio: Ratio, layout: Layout, bgKey: BgKey,
  useGrad: boolean, logoSize: number, logoMark: number, spacing: number,
  showText: boolean, fileName: string,
) {
  const [w, h] = RATIO_DIMS[ratio]
  const { markH, masterSz, edutechSz, gap, innerGap } = computeDims(
    layout, w, h, logoSize, logoMark, spacing, showText,
  )
  const bgHex = BG_HEX[bgKey]

  const canvas = document.createElement('canvas')
  canvas.width  = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  // 1 — Background
  if (bgHex) {
    ctx.fillStyle = bgHex
    ctx.fillRect(0, 0, w, h)
    if (useGrad) {
      const gr = ctx.createLinearGradient(0, 0, w, h)
      gr.addColorStop(0, 'rgba(255,255,255,0.16)')
      gr.addColorStop(1, 'rgba(0,0,0,0.36)')
      ctx.fillStyle = gr
      ctx.fillRect(0, 0, w, h)
    }
  }

  // 2 — Logo mark (real PNG from /public/logo)
  const logoImg = await loadImage(`${import.meta.env.BASE_URL}logo/${LOGO_FILES[v]}`)

  // objectFit:contain — scale image to fit markH×markH, preserve its aspect ratio
  function drawContained(bx: number, by: number) {
    const nr = logoImg.naturalWidth / logoImg.naturalHeight
    let dw: number, dh: number, dx: number, dy: number
    if (nr >= 1) {
      dw = markH; dh = Math.round(markH / nr)
      dx = bx;    dy = by + Math.round((markH - dh) / 2)
    } else {
      dh = markH; dw = Math.round(markH * nr)
      dy = by;    dx = bx + Math.round((markH - dw) / 2)
    }
    if (v === 'navy') ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(logoImg, dx, dy, dw, dh)
    ctx.globalCompositeOperation = 'source-over'
  }

  // Same ASCENT factor as buildSVG — both use alphabetic baseline for consistency
  const ASCENT = 0.79

  if (layout === 'linha') {
    // Center text block vertically against the mark box (mirrors CSS alignItems:center)
    const textBlockH  = masterSz + innerGap + edutechSz
    const approxTW    = showText ? Math.round(masterSz * 4.1) : 0
    const totalW      = markH + (showText ? gap + approxTW : 0)
    const markX       = Math.round((w - totalW) / 2)
    const markY       = Math.round((h - markH) / 2)
    const textX       = markX + markH + gap
    const masterTop   = markY + Math.round((markH - textBlockH) / 2)
    const edutechTop  = masterTop + masterSz + innerGap
    const masterY     = masterTop  + Math.round(masterSz  * ASCENT)
    const edutechY    = edutechTop + Math.round(edutechSz * ASCENT)

    drawContained(markX, markY)

    if (showText) {
      ctx.textBaseline = 'alphabetic'
      ctx.textAlign    = 'left'
      drawCanvasText(ctx, v, 'MASTER',  textX, masterY,  masterSz,  '700', 'Montserrat,"Arial Black",Arial,sans-serif')
      drawCanvasText(ctx, v, 'EduTech', textX, edutechY, edutechSz, '400', 'Inter,Helvetica,Arial,sans-serif')
    }
  } else {
    const textH  = showText ? masterSz + innerGap + edutechSz : 0
    const totalH = markH + (showText ? gap + textH : 0)
    const markY  = Math.round((h - totalH) / 2)
    const markX  = Math.round((w - markH) / 2)
    const cx     = Math.round(w / 2)
    const masterTop  = markY + markH + gap
    const edutechTop = masterTop + masterSz + innerGap
    const masterY    = masterTop  + Math.round(masterSz  * ASCENT)
    const edutechY   = edutechTop + Math.round(edutechSz * ASCENT)

    drawContained(markX, markY)

    if (showText) {
      ctx.textBaseline = 'alphabetic'
      ctx.textAlign    = 'center'
      drawCanvasText(ctx, v, 'MASTER',  cx, masterY,  masterSz,  '700', 'Montserrat,"Arial Black",Arial,sans-serif')
      drawCanvasText(ctx, v, 'EduTech', cx, edutechY, edutechSz, '400', 'Inter,Helvetica,Arial,sans-serif')
    }
  }

  triggerDownload(canvas.toDataURL('image/png'), fileName)
}

// ─── Download helpers ─────────────────────────────────────────

function triggerDownload(href: string, name: string) {
  const a = Object.assign(document.createElement('a'), { href, download: name })
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function downloadSVG(svgStr: string, name: string) {
  const blob = new Blob([svgStr], { type: 'image/svg+xml' })
  const url  = URL.createObjectURL(blob)
  triggerDownload(url, name)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ─── Preview ─────────────────────────────────────────────────

const CHECKERBOARD: React.CSSProperties = {
  backgroundImage: [
    'linear-gradient(45deg, rgba(128,128,128,0.18) 25%, transparent 25%, transparent 75%, rgba(128,128,128,0.18) 75%)',
    'linear-gradient(45deg, rgba(128,128,128,0.18) 25%, transparent 25%, transparent 75%, rgba(128,128,128,0.18) 75%)',
  ].join(','),
  backgroundSize: '12px 12px',
  backgroundPosition: '0 0, 6px 6px',
}

const LogoPreview: React.FC<{
  variant:  Variant
  layout:   Layout
  logoSize: number
  logoMark: number
  spacing:  number
  showText: boolean
  pw: number
  ph: number
}> = ({ variant, layout, logoSize, logoMark, spacing, showText, pw, ph }) => {
  const { markH: markSize, masterSz, edutechSz, gap, innerGap } = computeDims(
    layout, pw, ph, logoSize, logoMark, spacing, showText,
  )
  const tc = PREVIEW_TEXT_CSS[variant]

  const imgStyle: React.CSSProperties = {
    width:          markSize,
    height:         markSize,
    objectFit:      'contain',
    display:        'block',
    flexShrink:     0,
    transform:      'translateZ(0)',
    willChange:     'transform',
    imageRendering: 'auto',
    ...(variant === 'navy'
      ? { mixBlendMode: 'multiply' as React.CSSProperties['mixBlendMode'] }
      : {}),
  }

  const LogoImg = (
    <img
      src={`${import.meta.env.BASE_URL}logo/${LOGO_FILES[variant]}`}
      alt=""
      style={imgStyle}
    />
  )

  const TextBlock = (align: 'flex-start' | 'center') => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align, gap: innerGap }}>
      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: masterSz,  letterSpacing: '-0.02em', lineHeight: 1, textTransform: 'uppercase', ...tc.master  }}>MASTER</span>
      <span style={{ fontFamily: 'var(--font-sans)',    fontWeight: 400, fontSize: edutechSz, letterSpacing: '-0.01em', lineHeight: 1,                              ...tc.edutech }}>EduTech</span>
    </div>
  )

  if (layout === 'linha') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap }}>
        {LogoImg}
        {showText && TextBlock('flex-start')}
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap }}>
      {LogoImg}
      {showText && TextBlock('center')}
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--c-text-3)',
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: '8px',
}

const ControlRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <div style={LABEL_STYLE}>{label}</div>
    {children}
  </div>
)

const SegmentedControl: React.FC<{
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}> = ({ options, value, onChange }) => (
  <div style={{ display: 'flex', background: 'var(--c-glass-bg)', border: '1px solid var(--c-border)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
    {options.map(o => (
      <button key={o.value} onClick={() => onChange(o.value)} style={{
        flex: 1, padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
        fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-sans)', transition: 'all 160ms ease',
        background: value === o.value ? 'var(--c-accent, #5291bb)' : 'transparent',
        color:      value === o.value ? '#ffffff' : 'var(--c-text-2)',
      }}>
        {o.label}
      </button>
    ))}
  </div>
)

export const ImageGenerator: React.FC = () => {
  const [variant,  setVariant]  = useState<Variant>('original')
  const [ratio,    setRatio]    = useState<Ratio>('1:1')
  const [layout,   setLayout]   = useState<Layout>('linha')
  const [bgKey,    setBgKey]    = useState<BgKey>('blue-dark')
  const [useGrad,  setUseGrad]  = useState(false)
  const [format,   setFormat]   = useState<Format>('png')
  const [logoSize, setLogoSize] = useState(0)
  const [logoMark, setLogoMark] = useState(0)
  const [spacing,  setSpacing]  = useState(50)
  const [showText, setShowText] = useState(true)
  const [loading,  setLoading]  = useState(false)

  const [pw, ph] = previewDims(ratio)
  const bgHex = BG_HEX[bgKey]

  const previewStyle: React.CSSProperties = bgKey === 'transparent'
    ? CHECKERBOARD
    : {
        backgroundColor: bgHex!,
        backgroundImage: useGrad
          ? 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(0,0,0,0.36) 100%)'
          : 'none',
      }

  const handleGenerate = useCallback(async () => {
    setLoading(true)
    try {
      const name = `masteredutech-${variant}-${ratio.replace(':', 'x')}`
      if (format === 'svg') {
        const svgStr = await buildSVG(variant, ratio, layout, bgKey, useGrad, logoSize, logoMark, spacing, showText)
        downloadSVG(svgStr, `${name}.svg`)
      } else {
        await exportPNG(variant, ratio, layout, bgKey, useGrad, logoSize, logoMark, spacing, showText, `${name}.png`)
      }
    } finally {
      setLoading(false)
    }
  }, [variant, ratio, layout, bgKey, useGrad, format, logoSize, logoMark, spacing, showText])

  return (
    <GlassCard style={{ padding: '28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'start' }}>

        {/* ── Preview ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={LABEL_STYLE}>Preview — {ratio}</div>
          <div style={{
            width: pw, height: ph,
            ...previewStyle,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '12px',
            border: '1px solid var(--c-border)',
            overflow: 'hidden',
            flexShrink: 0,
            transition: 'all 280ms ease',
          }}>
            <LogoPreview
              variant={variant} layout={layout}
              logoSize={logoSize} logoMark={logoMark} spacing={spacing}
              showText={showText} pw={pw} ph={ph}
            />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--c-text-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
            {RATIO_DIMS[ratio][0]} × {RATIO_DIMS[ratio][1]} px
          </div>
        </div>

        {/* ── Controls ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Select
              label="Variante"
              value={variant}
              onChange={e => setVariant(e.target.value as Variant)}
              options={[
                { value: 'original', label: 'Original' },
                { value: 'negativo', label: 'Branco / Negativo' },
                { value: 'blue',     label: 'Azul claro' },
                { value: 'navy',     label: 'Azul escuro' },
              ]}
            />
            <Select
              label="Proporção"
              value={ratio}
              onChange={e => setRatio(e.target.value as Ratio)}
              options={[
                { value: '1:1',  label: '1:1  (quadrado)' },
                { value: '3:4',  label: '3:4  (retrato)' },
                { value: '4:3',  label: '4:3  (paisagem)' },
                { value: '16:9', label: '16:9 (wide)' },
                { value: '9:16', label: '9:16 (story)' },
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <ControlRow label="Layout">
              <SegmentedControl
                options={[{ value: 'linha', label: 'Linha' }, { value: 'square', label: 'Square' }]}
                value={layout}
                onChange={v => setLayout(v as Layout)}
              />
            </ControlRow>
            <ControlRow label="Formato">
              <SegmentedControl
                options={[{ value: 'png', label: 'PNG' }, { value: 'svg', label: 'SVG' }]}
                value={format}
                onChange={v => setFormat(v as Format)}
              />
            </ControlRow>
          </div>

          <Select
            label="Cor de fundo"
            value={bgKey}
            onChange={e => setBgKey(e.target.value as BgKey)}
            options={[
              { value: 'transparent', label: 'Sem fundo (transparente)' },
              { value: 'white',       label: 'Branco' },
              { value: 'black',       label: 'Preto' },
              { value: 'blue-light',  label: 'Azul claro (#f6f6f8)' },
              { value: 'blue-dark',   label: 'Azul escuro (#0c143b)' },
            ]}
          />

          <ControlRow label="Tamanho">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="range" min={0} max={100} value={logoSize}
                onChange={e => setLogoSize(Number(e.target.value))}
                style={{ '--range-pct': `${logoSize}%` } as React.CSSProperties}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--c-text-2)', fontFamily: 'var(--font-mono)', minWidth: '36px', textAlign: 'right' }}>
                {logoSize}%
              </span>
            </div>
          </ControlRow>

          <ControlRow label="Símbolo">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="range" min={0} max={100} value={logoMark}
                onChange={e => setLogoMark(Number(e.target.value))}
                style={{ '--range-pct': `${logoMark}%` } as React.CSSProperties}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--c-text-2)', fontFamily: 'var(--font-mono)', minWidth: '36px', textAlign: 'right' }}>
                {logoMark > 0 ? `+${logoMark}%` : '0%'}
              </span>
            </div>
          </ControlRow>

          <ControlRow label="Distanciamento">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="range" min={0} max={100} value={spacing}
                onChange={e => setSpacing(Number(e.target.value))}
                style={{ '--range-pct': `${spacing}%` } as React.CSSProperties}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--c-text-2)', fontFamily: 'var(--font-mono)', minWidth: '36px', textAlign: 'right' }}>
                {spacing}%
              </span>
            </div>
          </ControlRow>

          <Checkbox
            label="Exibir MasterEducação (nome)"
            checked={showText}
            onChange={checked => setShowText(checked)}
          />

          <Checkbox
            label="Aplicar degradê no fundo (45°, claro no topo → escuro na base)"
            checked={useGrad}
            onChange={checked => setUseGrad(checked)}
            disabled={bgKey === 'transparent'}
          />

          <Button
            variant="primary"
            onClick={() => { handleGenerate() }}
            disabled={loading}
            style={{ alignSelf: 'flex-start', minWidth: '160px' }}
          >
            {loading ? 'Gerando…' : `Gerar ${format.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
