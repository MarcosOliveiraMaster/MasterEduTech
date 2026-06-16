import React from 'react'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type AvatarStatus = 'online' | 'offline' | 'busy' | 'none'

interface AvatarProps {
  src?: string
  initials?: string
  alt?: string
  size?: AvatarSize
  status?: AvatarStatus
  ring?: boolean
  style?: React.CSSProperties
}

const sizePx: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
}

const fontSizeMap: Record<AvatarSize, string> = {
  xs: '9px',
  sm: '11px',
  md: '14px',
  lg: '17px',
  xl: '22px',
  '2xl': '28px',
}

const statusDotSize: Record<AvatarSize, number> = {
  xs: 6, sm: 8, md: 10, lg: 12, xl: 14, '2xl': 16,
}

const statusColor: Record<AvatarStatus, string> = {
  online: '#22c55e',
  offline: 'rgba(255,255,255,0.30)',
  busy: '#f59e0b',
  none: 'transparent',
}

export const Avatar: React.FC<AvatarProps> = ({
  src, initials, alt = '', size = 'md', status = 'none', ring = false, style,
}) => {
  const px = sizePx[size]
  const dotPx = statusDotSize[size]

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, ...style }}>
      <div style={{
        width: px, height: px,
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'var(--c-avatar-bg)',
        border: ring
          ? '2px solid var(--c-avatar-ring)'
          : '1.5px solid var(--c-avatar-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: ring ? 'var(--c-shadow-glow)' : undefined,
      }}>
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{
            fontSize: fontSizeMap[size],
            fontWeight: 700,
            color: 'var(--c-avatar-text)',
            letterSpacing: '0.03em',
            userSelect: 'none',
          }}>
            {initials ?? (alt ? alt.slice(0, 2).toUpperCase() : '?')}
          </span>
        )}
      </div>

      {status !== 'none' && (
        <span style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: dotPx,
          height: dotPx,
          borderRadius: '50%',
          background: statusColor[status],
          border: '2px solid var(--c-bg)',
        }} />
      )}
    </div>
  )
}

// ---- AvatarGroup ----

interface AvatarGroupProps {
  avatars: Array<{ src?: string; initials?: string; alt?: string }>
  max?: number
  size?: AvatarSize
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars, max = 4, size = 'md',
}) => {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max
  const px = sizePx[size]
  const overlapOffset = Math.round(px * 0.35)

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {visible.map((av, i) => (
        <div
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : -overlapOffset,
            zIndex: visible.length - i,
            position: 'relative',
          }}
        >
          <Avatar src={av.src} initials={av.initials} alt={av.alt} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          style={{
            marginLeft: -overlapOffset,
            width: px, height: px,
            borderRadius: '50%',
            background: 'var(--c-glass-bg)',
            border: '1.5px solid var(--c-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: fontSizeMap[size],
            fontWeight: 600,
            color: 'var(--c-text-2)',
            zIndex: 0,
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}

const fontSizeMap: Record<AvatarSize, string> = {
  xs: '9px',
  sm: '11px',
  md: '14px',
  lg: '17px',
  xl: '22px',
  '2xl': '28px',
}
