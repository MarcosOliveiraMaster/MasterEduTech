import React, { useState, useEffect, useRef } from 'react'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import { Input, Textarea, Select, Checkbox, Toggle } from '../components/Input'
import { GlassCard } from '../components/GlassCard'
import { Badge } from '../components/Badge'
import { Avatar, AvatarGroup } from '../components/Avatar'
import { Notification } from '../components/Notification'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, ScatterChart, Scatter,
} from 'recharts'

// ============================================================
// Chart data
// ============================================================

const CHART_COLORS = ['#5291bb', '#83e6c3', '#73acd2', '#f59e0b', '#ef4444', '#8b5cf6']

const MONTHLY_DATA = [
  { mes: 'Jan', React: 145, TypeScript:  89, UXUI:  67 },
  { mes: 'Fev', React: 162, TypeScript:  98, UXUI:  74 },
  { mes: 'Mar', React: 178, TypeScript: 112, UXUI:  82 },
  { mes: 'Abr', React: 195, TypeScript: 128, UXUI:  91 },
  { mes: 'Mai', React: 210, TypeScript: 141, UXUI: 105 },
  { mes: 'Jun', React: 234, TypeScript: 158, UXUI: 118 },
  { mes: 'Jul', React: 218, TypeScript: 165, UXUI: 124 },
  { mes: 'Ago', React: 252, TypeScript: 179, UXUI: 137 },
  { mes: 'Set', React: 268, TypeScript: 192, UXUI: 148 },
  { mes: 'Out', React: 285, TypeScript: 208, UXUI: 162 },
  { mes: 'Nov', React: 298, TypeScript: 221, UXUI: 175 },
  { mes: 'Dez', React: 312, TypeScript: 235, UXUI: 189 },
]

const GROWTH_DATA = [
  { mes: 'Jan', Usuarios: 1200, Receita:  8400 },
  { mes: 'Fev', Usuarios: 1450, Receita: 10150 },
  { mes: 'Mar', Usuarios: 1680, Receita: 11760 },
  { mes: 'Abr', Usuarios: 1920, Receita: 13440 },
  { mes: 'Mai', Usuarios: 2100, Receita: 14700 },
  { mes: 'Jun', Usuarios: 2380, Receita: 16660 },
  { mes: 'Jul', Usuarios: 2650, Receita: 18550 },
  { mes: 'Ago', Usuarios: 2920, Receita: 20440 },
  { mes: 'Set', Usuarios: 3180, Receita: 22260 },
  { mes: 'Out', Usuarios: 3450, Receita: 24150 },
  { mes: 'Nov', Usuarios: 3720, Receita: 26040 },
  { mes: 'Dez', Usuarios: 4100, Receita: 28700 },
]

const RATING_DATA = [
  { curso: 'UX/UI Design',   avaliacao: 4.9 },
  { curso: 'React Avançado', avaliacao: 4.8 },
  { curso: 'TypeScript Pro', avaliacao: 4.7 },
  { curso: 'Data Science',   avaliacao: 4.7 },
  { curso: 'Node.js APIs',   avaliacao: 4.6 },
  { curso: 'DevOps Cloud',   avaliacao: 4.5 },
]

const CATEGORY_DATA = [
  { name: 'Frontend', value: 38 },
  { name: 'Backend',  value: 25 },
  { name: 'UX/UI',    value: 18 },
  { name: 'DevOps',   value: 12 },
  { name: 'Data',     value:  7 },
]

const COMPLETION_DATA = [
  { name: 'Concluído',    value: 62 },
  { name: 'Em Progresso', value: 24 },
  { name: 'Não Iniciado', value: 14 },
]

const SCATTER_DATA = [
  { horas: 1,   nota: 4.2 }, { horas: 1.5, nota: 4.8 },
  { horas: 2,   nota: 5.1 }, { horas: 2.5, nota: 5.5 },
  { horas: 3,   nota: 5.8 }, { horas: 3.5, nota: 6.2 },
  { horas: 4,   nota: 6.5 }, { horas: 4.5, nota: 7.0 },
  { horas: 5,   nota: 7.2 }, { horas: 5.5, nota: 7.5 },
  { horas: 6,   nota: 7.8 }, { horas: 6.5, nota: 8.0 },
  { horas: 7,   nota: 8.1 }, { horas: 7.5, nota: 8.4 },
  { horas: 8,   nota: 8.6 }, { horas: 8.5, nota: 9.1 },
  { horas: 9,   nota: 9.0 }, { horas: 9.5, nota: 9.4 },
  { horas: 10,  nota: 9.3 }, { horas: 11,  nota: 9.7 },
]

const RADAR_LABELS = ['React','TypeScript','Node.js','UX/UI','Git','CSS','APIs','Testes','DevOps','Banco de Dados']
const RADAR_A = [88, 72, 65, 80, 91, 78, 70, 58, 45, 67]
const RADAR_B = [74, 68, 71, 63, 80, 72, 75, 66, 58, 70]

// ============================================================
// Chart helpers
// ============================================================

const ChartTooltip = ({ active, payload, label, theme: t }: any) => {
  if (!active || !payload?.length) return null
  const isDark = t !== 'light'
  const bg          = isDark ? 'rgba(8,5,26,0.94)'          : 'rgba(246,246,248,0.97)'
  const borderColor = isDark ? 'rgba(82,145,187,0.28)'      : 'rgba(82,145,187,0.35)'
  const labelColor  = isDark ? '#73acd2'                    : '#2b6799'
  const nameColor   = isDark ? 'rgba(255,255,255,0.50)'     : 'rgba(12,20,59,0.55)'
  const valueColor  = isDark ? '#fff'                       : '#0c143b'
  return (
    <div style={{
      background: bg, backdropFilter: 'blur(20px)',
      border: `1px solid ${borderColor}`, borderRadius: '10px',
      padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', minWidth: '120px',
    }}>
      {label !== undefined && label !== '' && (
        <div style={{ fontSize: '11px', color: labelColor, marginBottom: '8px', fontWeight: 600 }}>{label}</div>
      )}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < payload.length - 1 ? '4px' : 0 }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: nameColor }}>{p.name}:</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: valueColor }}>
            {typeof p.value === 'number' && p.value > 999 ? p.value.toLocaleString('pt-BR') : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

const ChartLegend = ({ payload }: any) => (
  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', justifyContent: 'center' }}>
    {payload?.map((e: any, i: number) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: e.color }} />
        <span style={{ fontSize: '11px', color: 'var(--c-text-2)' }}>{e.value}</span>
      </div>
    ))}
  </div>
)

const ChartCard: React.FC<{
  title: string; subtitle?: string; extra?: React.ReactNode
  children: React.ReactNode; style?: React.CSSProperties
}> = ({ title, subtitle, extra, children, style }) => (
  <GlassCard style={{ padding: '24px', ...style }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
      <div>
        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--c-text-1)', marginBottom: '2px' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '11px', color: 'var(--c-text-3)' }}>{subtitle}</div>}
      </div>
      {extra}
    </div>
    {children}
  </GlassCard>
)

// ============================================================
// Form Showcase
// ============================================================

const PLANOS = [
  { value: 'basico',     label: 'Básico',     desc: 'Cursos gratuitos',        price: 'Grátis'     },
  { value: 'pro',        label: 'Pro',         desc: 'Todos os cursos + certs', price: 'R$ 49/mês'  },
  { value: 'enterprise', label: 'Enterprise',  desc: 'Equipes + analytics',     price: 'R$ 149/mês' },
]

const SKILLS_OPTIONS = [
  { key: 'react',      label: 'React'        },
  { key: 'typescript', label: 'TypeScript'   },
  { key: 'ux',         label: 'UX/UI Design' },
  { key: 'node',       label: 'Node.js'      },
  { key: 'python',     label: 'Python'       },
]

const maskCep   = (v: string) => { const d = v.replace(/\D/g,'').slice(0,8); return d.length>5 ? `${d.slice(0,5)}-${d.slice(5)}` : d }
const maskPhone = (v: string) => { const d = v.replace(/\D/g,'').slice(0,11); if(d.length<=2) return d; if(d.length<=6) return `(${d.slice(0,2)}) ${d.slice(2)}`; if(d.length<=10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}` }

const FormShowcase: React.FC = () => {
  const [nome,        setNome]        = useState('')
  const [username,    setUsername]    = useState('')
  const [email,       setEmail]       = useState('')
  const [senha,       setSenha]       = useState('')
  const [idade,       setIdade]       = useState('')
  const [cep,         setCep]         = useState('')
  const [telefone,    setTelefone]    = useState('')
  const [pais,        setPais]        = useState('')
  const [estado,      setEstado]      = useState('')
  const [plano,       setPlano]       = useState('pro')
  const [nascimento,  setNascimento]  = useState('')
  const [nivel,       setNivel]       = useState(60)
  const [skills,      setSkills]      = useState<Record<string,boolean>>({ react: true, typescript: false, ux: true, node: false, python: false })
  const [newsletter,    setNewsletter]    = useState(true)
  const [perfilPublico, setPerfilPublico] = useState(false)
  const [notificacoes,  setNotificacoes]  = useState(true)
  const [termos,        setTermos]        = useState(false)

  return (
    <GlassCard style={{ padding: '28px' }}>
      {/* Text / masked / date fields */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <Input label="Nome Completo" placeholder="João Silva" value={nome} onChange={e => setNome(e.target.value)} />
        <Input label="Username" placeholder="joao.silva" value={username} onChange={e => setUsername(e.target.value)}
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 12c0-2.2 2.46-4 5.5-4s5.5 1.8 5.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>} />
        <Input label="Email" type="email" placeholder="joao@exemplo.com" value={email} onChange={e => setEmail(e.target.value)}
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.3"/></svg>} />
        <Input label="Senha" type="password" placeholder="Mínimo 8 caracteres" value={senha} onChange={e => setSenha(e.target.value)} />
        <Input label="Idade" type="number" placeholder="18" value={idade} onChange={e => setIdade(e.target.value)} helper="Entre 13 e 100 anos" />
        <Input label="CEP" placeholder="00000-000" value={cep} onChange={e => setCep(maskCep(e.target.value))} helper="Preencha para buscar endereço" />
        <Input label="Telefone / WhatsApp" placeholder="(00) 00000-0000" value={telefone} onChange={e => setTelefone(maskPhone(e.target.value))} />
        <Input label="Data de Nascimento" type="date" value={nascimento} onChange={e => setNascimento(e.target.value)} />
        <Select label="País" value={pais} onChange={e => setPais(e.target.value)} placeholder="Selecione o país..." options={[
          { value: 'br', label: 'Brasil' }, { value: 'pt', label: 'Portugal' },
          { value: 'ao', label: 'Angola' }, { value: 'us', label: 'Estados Unidos' }, { value: 'ar', label: 'Argentina' },
        ]} />
        <Select label="Estado" value={estado} onChange={e => setEstado(e.target.value)} placeholder="Selecione o estado..." options={[
          { value: 'sp', label: 'São Paulo' }, { value: 'rj', label: 'Rio de Janeiro' },
          { value: 'mg', label: 'Minas Gerais' }, { value: 'rs', label: 'Rio Grande do Sul' },
          { value: 'pr', label: 'Paraná' }, { value: 'ba', label: 'Bahia' },
        ]} />
      </div>

      {/* Radio — Plano */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--c-text-3)', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Plano</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {PLANOS.map(p => (
            <label key={p.value} onClick={() => setPlano(p.value)} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '14px 16px', borderRadius: '10px', flex: '1 1 150px', cursor: 'pointer',
              border: `1px solid ${plano === p.value ? '#5291bb' : 'var(--c-border)'}`,
              background: plano === p.value ? 'rgba(82,145,187,0.10)' : 'var(--c-glass-bg)',
              transition: 'all 180ms ease',
            }}>
              <div style={{ position: 'relative', width: '16px', height: '16px', flexShrink: 0, marginTop: '2px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${plano === p.value ? '#5291bb' : 'rgba(255,255,255,0.20)'}`, transition: 'border-color 180ms' }} />
                {plano === p.value && <div style={{ position: 'absolute', top: '3px', left: '3px', width: '10px', height: '10px', borderRadius: '50%', background: '#5291bb' }} />}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--c-text-1)' }}>{p.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--c-text-3)', marginTop: '2px' }}>{p.desc}</div>
                <div style={{ fontSize: '12px', color: '#83e6c3', fontWeight: 600, marginTop: '4px' }}>{p.price}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Range — Nível */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--c-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nível de Experiência</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#83e6c3' }}>{nivel}%</span>
        </div>
        <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: '6px', borderRadius: '3px', background: 'var(--c-glass-bg)', border: '1px solid var(--c-border)' }}>
            <div style={{ height: '100%', width: `${nivel}%`, borderRadius: '3px', background: 'linear-gradient(90deg,#5291bb,#83e6c3)', transition: 'width 60ms' }} />
          </div>
          <input type="range" min={0} max={100} value={nivel} onChange={e => setNivel(parseInt(e.target.value))} style={{ position: 'absolute', width: '100%', height: '20px', opacity: 0, cursor: 'pointer', margin: 0 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          {['Iniciante','Básico','Intermediário','Avançado','Expert'].map(l => <span key={l} style={{ fontSize: '10px', color: 'var(--c-text-3)' }}>{l}</span>)}
        </div>
      </div>

      {/* Checkboxes — Skills */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--c-text-3)', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Áreas de Interesse</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {SKILLS_OPTIONS.map(s => (
            <Checkbox key={s.key} label={s.label} checked={skills[s.key]} onChange={v => setSkills(prev => ({ ...prev, [s.key]: v }))} />
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div style={{ marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <Toggle label="Newsletter semanal"  checked={newsletter}    onChange={v => setNewsletter(v)} />
        <Toggle label="Perfil público"      checked={perfilPublico} onChange={v => setPerfilPublico(v)} />
        <Toggle label="Notificações push"   checked={notificacoes}  onChange={v => setNotificacoes(v)} />
      </div>

      {/* Termos + submit */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--c-border)' }}>
        <Checkbox label="Aceito os termos de uso e política de privacidade" checked={termos} onChange={v => setTermos(v)} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="primary" disabled={!termos}>Criar Conta</Button>
        </div>
      </div>
    </GlassCard>
  )
}

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
      fontWeight: 600,
      color: 'var(--c-text-blue)',
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
  color = '#5291bb', size = 40,
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
          background: '#5291bb',
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
          background: i % 2 === 0 ? '#5291bb' : '#83e6c3',
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
            background: 'linear-gradient(90deg, #5291bb 0%, #83e6c3 100%)',
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
// Motion: Möbius Loader
// ============================================================

const MobiusLoader: React.FC = () => {
  const [key, setKey] = useState(0)
  const DURATION = 8 // seconds per cycle

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div
        key={key}
        style={{ position: 'relative', width: '100px', height: '100px', perspective: '300px' }}
      >
        {/* Infinity SVG — gira 2x depois dobra como fita de Möbius */}
        <svg
          width="100" height="100" viewBox="0 0 100 100" fill="none"
          style={{
            position: 'absolute', inset: 0,
            animation: `mobius-infinity ${DURATION}s cubic-bezier(0.4,0,0.2,1) forwards`,
            transformOrigin: 'center',
          }}
        >
          <defs>
            <linearGradient id="inf-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#5291bb" />
              <stop offset="100%" stopColor="#83e6c3" />
            </linearGradient>
          </defs>
          {/* Anel de fundo */}
          <circle cx="50" cy="50" r="44" stroke="rgba(82,145,187,0.12)" strokeWidth="1" fill="none" />
          {/* Símbolo ∞ usando dois arcos */}
          <path
            d="M50,50 C50,38 40,28 30,30 C20,32 18,42 18,50 C18,58 20,68 30,70 C40,72 50,62 50,50 C50,38 60,28 70,30 C80,32 82,42 82,50 C82,58 80,68 70,70 C60,72 50,62 50,50 Z"
            stroke="url(#inf-grad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Ponto brilhante que percorre o ∞ */}
          <circle r="4" fill="#83e6c3" fillOpacity="0.9">
            <animateMotion
              dur={`${DURATION * 0.35}s`}
              repeatCount="2"
              path="M50,50 C50,38 40,28 30,30 C20,32 18,42 18,50 C18,58 20,68 30,70 C40,72 50,62 50,50 C50,38 60,28 70,30 C80,32 82,42 82,50 C82,58 80,68 70,70 C60,72 50,62 50,50 Z"
            />
          </circle>
        </svg>

        {/* logo1.png — wrapper cuida do posicionamento, img recebe a animação */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={`${import.meta.env.BASE_URL}logo/logo1.png`}
            alt=""
            style={{
              width: '56px', height: '56px',
              objectFit: 'contain',
              animation: `mobius-logo ${DURATION}s cubic-bezier(0.4,0,0.2,1) forwards`,
              transformOrigin: 'center',
            }}
          />
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={() => setKey(k => k + 1)}>
        Repetir Animação
      </Button>
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
              stroke="rgba(82,145,187,0.25)"
              strokeWidth="1"
              fill="rgba(82,145,187,0.06)"
            />
          </svg>

          {/* Logo central — wrapper cuida do posicionamento, img recebe a animação */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={`${import.meta.env.BASE_URL}logo/logo1.png`}
              alt=""
              style={{
                width: '46px', height: '46px',
                objectFit: 'contain',
                animation: 'logo-reveal 0.5s ease forwards',
                animationDelay: '0.3s',
                opacity: 0,
              }}
            />
          </div>
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
            <span style={{ color: '#5291bb' }}>Tech</span>
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
        background: 'rgba(82,145,187,0.12)',
        border: '1px solid rgba(82,145,187,0.30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <svg
        width="28" height="28" viewBox="0 0 28 28" fill="none"
        style={hovered ? { animation: 'fade-scale-in 300ms var(--ease-spring) forwards' } : {}}
      >
        <circle cx="14" cy="14" r="12" stroke="#73acd2" strokeWidth="1.5" />
        <path d="M14 13v6" stroke="#73acd2" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="10" r="1" fill="#73acd2" />
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
        background: '#5291bb',
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
  const [radarVertices, setRadarVertices] = useState(5)
  const mainRef = useRef<HTMLDivElement>(null)

  const cc = theme === 'light' ? {
    grid:        'rgba(12,20,59,0.08)',
    axisLine:    'rgba(12,20,59,0.12)',
    tick:        'rgba(12,20,59,0.55)',
    tickDense:   'rgba(12,20,59,0.70)',
    tickFaint:   'rgba(12,20,59,0.40)',
    cursor:      'rgba(12,20,59,0.04)',
    cursorDash:  'rgba(12,20,59,0.15)',
    radarGrid:   'rgba(12,20,59,0.12)',
  } : {
    grid:        'rgba(255,255,255,0.05)',
    axisLine:    'rgba(255,255,255,0.08)',
    tick:        'rgba(255,255,255,0.38)',
    tickDense:   'rgba(255,255,255,0.55)',
    tickFaint:   'rgba(255,255,255,0.28)',
    cursor:      'rgba(255,255,255,0.04)',
    cursorDash:  'rgba(255,255,255,0.12)',
    radarGrid:   'rgba(255,255,255,0.10)',
  }

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
    { href: '#logo', label: 'Logo', id: 'logo', emoji: 'L' },
    { href: '#fundamentos', label: 'Fundamentos', id: 'fundamentos', emoji: 'A' },
    { href: '#superficies', label: 'Superficies', id: 'superficies', emoji: 'S' },
    { href: '#componentes', label: 'Componentes', id: 'componentes', emoji: 'C' },
    { href: '#formularios', label: 'Formularios', id: 'formularios', emoji: 'F' },
    { href: '#motion',    label: 'Motion',   id: 'motion',    emoji: 'M' },
    { href: '#graficos',  label: 'Graficos',  id: 'graficos',  emoji: 'G' },
  ]

  const purpleSwatches = [
    { label: '50', hex: '#f6f6f8' }, { label: '100', hex: '#ede0ff' },
    { label: '200', hex: '#d4b8ff' }, { label: '300', hex: '#73acd2' },
    { label: '400', hex: '#73acd2' }, { label: '500', hex: '#5291bb' },
    { label: '600', hex: '#22105d' }, { label: '700', hex: '#4b16a8' },
    { label: '800', hex: '#22105d' }, { label: '900', hex: '#140a3c' },
  ]

  const mintSwatches = [
    { label: '50', hex: '#edfaf5' }, { label: '100', hex: '#c7f4e3' },
    { label: '200', hex: '#9fecd1' }, { label: '300', hex: '#83e6c3' },
    { label: '400', hex: '#52d4a8' }, { label: '500', hex: '#2abd8d' },
    { label: '600', hex: '#1e9b73' }, { label: '700', hex: '#167a5b' },
  ]

  const semanticColors = [
    { label: 'Success', hex: '#83e6c3' },
    { label: 'Warning', hex: '#f59e0b' },
    { label: 'Error', hex: '#ef4444' },
    { label: 'Info', hex: '#5291bb' },
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
            background: 'linear-gradient(135deg, #5291bb 0%, #22105d 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(82,145,187,0.40)',
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
              <span style={{ color: '#73acd2' }}>Tech</span>
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
      <div style=
        {{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '60px',
        }}
      >
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
            <GlassCard variant="blue" style={{ padding: '14px' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--c-text-blue)', fontWeight: 600, marginBottom: '4px' }}>
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
          
          <Section id="logo" title="Logo" subtitle="Três versões da marca para cada aplicação e contexto.">
            <SubSection title="Versão Original — Gradiente">
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{
                  background: '#0c143b',
                  borderRadius: '16px',
                  padding: '32px 48px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <Logo variant="original" size="lg" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  <img src={`${import.meta.env.BASE_URL}logo/logo1.png`} width={72} height={72} style={{ objectFit: 'contain' }} alt="MasterEduTech símbolo" />
                  <span style={{ fontSize: '11px', color: 'var(--c-text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Símbolo</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="Versão Negativo — Branca">
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{
                  background: '#060a18',
                  borderRadius: '16px',
                  padding: '32px 48px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <Logo variant="negativo" size="lg" />
                </div>
                <div style={{
                  background: '#0c143b',
                  borderRadius: '16px',
                  padding: '24px 36px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <Logo variant="negativo" size="md" />
                </div>
              </div>
            </SubSection>

            <SubSection title="Tons de Azul">
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{
                  background: '#f6f6f8',
                  borderRadius: '16px',
                  padding: '32px 48px',
                  border: '1px solid rgba(82,145,187,0.15)',
                }}>
                  <Logo variant="blue" size="lg" />
                </div>
                <div style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '32px 48px',
                  border: '1px solid rgba(12,20,59,0.10)',
                }}>
                  <Logo variant="navy" size="lg" />
                </div>
              </div>
            </SubSection>

            <SubSection title="Escala de Tamanhos">
              <div style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                padding: '24px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => (
                  <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Logo variant="original" size={s} />
                    <span style={{ fontSize: '10px', color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {[
                  { label: 'Original',    bg: '#0c143b', border: 'rgba(255,255,255,0.10)', masterColor: '#83e6c3',  edutechColor: 'rgba(131,230,195,0.75)', img: 'logo1.png',             blend: undefined        },
                  { label: 'Negativo',    bg: '#060a18', border: 'rgba(255,255,255,0.08)', masterColor: '#ffffff',  edutechColor: 'rgba(255,255,255,0.75)', img: 'logo-branca.png',        blend: undefined        },
                  { label: 'Azul Clara',  bg: '#f6f6f8', border: 'rgba(82,145,187,0.15)', masterColor: '#5291bb',  edutechColor: 'rgba(82,145,187,0.80)',  img: 'logo-azulcalara.png',    blend: undefined        },
                  { label: 'Azul Escuro', bg: '#ffffff', border: 'rgba(12,20,59,0.10)',   masterColor: '#0c143b',  edutechColor: 'rgba(12,20,59,0.70)',    img: 'logo-azulescuro.png',    blend: 'multiply' as React.CSSProperties['mixBlendMode'] },
                ].map(v => (
                  <div key={v.label}>
                    <div style={{ fontSize: '11px', color: 'var(--c-text-3)', marginBottom: '12px', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{v.label}</div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                      {[
                        { size: 'xs', square: 72,  logo: 24, masterPx: 7,  edutechPx: 6  },
                        { size: 'sm', square: 90,  logo: 28, masterPx: 10, edutechPx: 8  },
                        { size: 'md', square: 112, logo: 40, masterPx: 11, edutechPx: 9  },
                        { size: 'lg', square: 144, logo: 52, masterPx: 14, edutechPx: 11 },
                        { size: 'xl', square: 180, logo: 66, masterPx: 17, edutechPx: 14 },
                      ].map(s => (
                        <div key={s.size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: `${s.square}px`,
                            height: `${s.square}px`,
                            background: v.bg,
                            border: `1px solid ${v.border}`,
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            justifyContent: 'center',
                            padding: `${Math.round(s.square * 0.1)}px`,
                            boxSizing: 'border-box',
                            rowGap: `${Math.max(3, Math.round(s.square * 0.035))}px`,
                            overflow: 'hidden',
                          }}>
                            <img
                              src={`${import.meta.env.BASE_URL}logo/${v.img}`}
                              alt=""
                              style={{
                                display: 'block',
                                width: '100%',
                                height: `${s.logo}px`,
                                objectFit: 'contain',
                                flexShrink: 0,
                                ...(v.blend ? { mixBlendMode: v.blend } : {}),
                              }}
                            />
                            {v.label === 'Original' ? (
                              <>
                                <span style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: s.masterPx, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, textTransform: 'uppercase', fontFamily: 'var(--font-heading)', background: 'linear-gradient(to right, #5291bb, #83e6c3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MASTER</span>
                                <span style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: s.edutechPx, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1, fontFamily: 'var(--font-sans)', background: 'linear-gradient(to right, #5291bb, #83e6c3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>EduTech</span>
                              </>
                            ) : (
                              <>
                                <span style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: s.masterPx, fontWeight: 700, color: v.masterColor, letterSpacing: '-0.02em', lineHeight: 1, textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>MASTER</span>
                                <span style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: s.edutechPx, fontWeight: 400, color: v.edutechColor, letterSpacing: '-0.01em', lineHeight: 1, fontFamily: 'var(--font-sans)' }}>EduTech</span>
                              </>
                            )}
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

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
                      background: 'linear-gradient(90deg, #5291bb, #83e6c3)',
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
                {(['sm', 'default', 'lg', 'blue', 'mint'] as const).map(variant => (
                  <GlassCard key={variant} variant={variant} hoverable>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--c-text-3)', marginBottom: '8px' }}>
                      .glass{variant !== 'default' ? `-${variant}` : ''}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--c-text-1)', marginBottom: '4px' }}>
                      {variant === 'sm' ? 'Glass SM' : variant === 'default' ? 'Glass' : variant === 'lg' ? 'Glass LG' : variant === 'blue' ? 'Glass Purple' : 'Glass Mint'}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--c-text-3)', lineHeight: 1.5 }}>
                      {variant === 'sm' ? 'blur(8px) · 4%' : variant === 'default' ? 'blur(16px) · 8%' : variant === 'lg' ? 'blur(24px) · 14%' : variant === 'blue' ? 'blur(20px) · purple' : 'blur(20px) · mint'}
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
                <Badge variant="blue">Novo</Badge>
                <Badge variant="mint">Em Destaque</Badge>
                <Badge variant="white">Padrao</Badge>
                <Badge variant="success">Concluido</Badge>
                <Badge variant="warning">Em Progresso</Badge>
                <Badge variant="error">Expirado</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                <Badge variant="blue" dot>Ao Vivo</Badge>
                <Badge variant="mint" dot>Online</Badge>
                <Badge variant="success" dot>Disponivel</Badge>
                <Badge variant="error" dot>Offline</Badge>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Badge variant="blue" size="sm">SM Purple</Badge>
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

                <GlassCard variant="blue" hoverable>
                  <Badge variant="blue" size="sm" style={{ marginBottom: '12px' }}>Destaque</Badge>
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

            <SubSection title="Modelo Completo">
              <FormShowcase />
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <GlassCard variant="blue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Logo + Wordmark</div>
                  <LogoAnimation />
                </GlassCard>
                <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>∞ → Möbius → M</div>
                  <MobiusLoader />
                </GlassCard>
              </div>
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
                          <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--c-text-blue)', fontSize: '12px' }}>{row.name}</td>
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
          
            <SubSection title="Animações de Logo">
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Float',       anim: 'logo-float 3s ease-in-out infinite' },
                  { label: 'Draw',        anim: 'logo-img-reveal 1.4s ease forwards' },
                  { label: 'Glow Pulse',  anim: 'logo-glow-pulse 2.5s ease-in-out infinite' },
                  { label: 'Spin Reveal', anim: 'logo-spin-reveal 1s cubic-bezier(0.34,1.56,0.64,1) forwards' },
                  { label: 'Morph',       anim: 'logo-morph 4s ease-in-out infinite' },
                ].map(({ label, anim }) => {
                  const node = (
                    <img
                      src={`${import.meta.env.BASE_URL}logo/logo1.png`}
                      alt=""
                      style={{ width: '72px', height: '72px', objectFit: 'contain', animation: anim, display: 'block' }}
                    />
                  )
                  return (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '24px',
                      background: 'var(--c-glass-bg)',
                      border: '1px solid var(--c-border)',
                      borderRadius: '16px',
                      minWidth: '140px',
                    }}
                  >
                    {node}
                    <span style={{ fontSize: '11px', color: 'var(--c-text-2)', fontFamily: 'var(--font-mono)' }}>{label}</span>
                  </div>
                )
                })}
              </div>
            </SubSection>

          </Section>

          {/* ===== GRÁFICOS ===== */}
          <Section id="graficos" title="Gráficos" subtitle="Visualizações de dados com a identidade visual MasterEduTech.">

            {/* Colunas */}
            <SubSection title="Colunas — Matrículas por Mês">
              <ChartCard title="Novas Matrículas" subtitle="Evolução mensal por categoria de curso">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="gb1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5291bb"/><stop offset="100%" stopColor="#5291bb" stopOpacity={0.6}/></linearGradient>
                      <linearGradient id="gb2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#83e6c3"/><stop offset="100%" stopColor="#83e6c3" stopOpacity={0.6}/></linearGradient>
                      <linearGradient id="gb3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#73acd2"/><stop offset="100%" stopColor="#73acd2" stopOpacity={0.6}/></linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={cc.grid} />
                    <XAxis dataKey="mes" tick={{ fill: cc.tick, fontSize: 11 }} axisLine={{ stroke: cc.axisLine }} tickLine={false} />
                    <YAxis tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip content={<ChartTooltip theme={theme} />} cursor={{ fill: cc.cursor }} />
                    <Legend content={ChartLegend} />
                    <Bar dataKey="React" fill="url(#gb1)" radius={[4,4,0,0]} />
                    <Bar dataKey="TypeScript" fill="url(#gb2)" radius={[4,4,0,0]} />
                    <Bar dataKey="UXUI" name="UX/UI" fill="url(#gb3)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </SubSection>

            {/* Barras + Linha */}
            <SubSection title="Barras Horizontais & Linha">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                <ChartCard title="Avaliação por Curso" subtitle="Nota média dos alunos (0–5)">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={RATING_DATA} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="gb4" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#5291bb"/><stop offset="100%" stopColor="#83e6c3"/></linearGradient>
                      </defs>
                      <CartesianGrid horizontal={false} stroke={cc.grid} />
                      <XAxis type="number" domain={[4, 5]} tick={{ fill: cc.tick, fontSize: 11 }} axisLine={{ stroke: cc.axisLine }} tickLine={false} tickCount={3} />
                      <YAxis dataKey="curso" type="category" tick={{ fill: cc.tickDense, fontSize: 11 }} axisLine={false} tickLine={false} width={112} />
                      <Tooltip content={<ChartTooltip theme={theme} />} cursor={{ fill: cc.cursor }} />
                      <Bar dataKey="avaliacao" name="Avaliação" fill="url(#gb4)" radius={[0,4,4,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Crescimento de Usuários" subtitle="Novos registros por mês">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={GROWTH_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
                      <XAxis dataKey="mes" tick={{ fill: cc.tick, fontSize: 11 }} axisLine={{ stroke: cc.axisLine }} tickLine={false} />
                      <YAxis tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
                      <Tooltip content={<ChartTooltip theme={theme} />} />
                      <Legend content={ChartLegend} />
                      <Line type="monotone" dataKey="Usuarios" stroke="#5291bb" strokeWidth={2.5} dot={{ fill: '#5291bb', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#83e6c3', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </SubSection>

            {/* Área */}
            <SubSection title="Área — Receita & Usuários">
              <ChartCard title="Crescimento Acumulado" subtitle="Correlação entre base de usuários e receita mensal (R$)">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={GROWTH_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="aBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5291bb" stopOpacity={0.35}/><stop offset="95%" stopColor="#5291bb" stopOpacity={0}/></linearGradient>
                      <linearGradient id="aMint" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#83e6c3" stopOpacity={0.30}/><stop offset="95%" stopColor="#83e6c3" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
                    <XAxis dataKey="mes" tick={{ fill: cc.tick, fontSize: 11 }} axisLine={{ stroke: cc.axisLine }} tickLine={false} />
                    <YAxis tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip content={<ChartTooltip theme={theme} />} />
                    <Legend content={ChartLegend} />
                    <Area type="monotone" dataKey="Receita" stroke="#83e6c3" strokeWidth={2} fill="url(#aMint)" dot={false} activeDot={{ r: 4, fill: '#83e6c3', strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="Usuarios" stroke="#5291bb" strokeWidth={2} fill="url(#aBlue)" dot={false} activeDot={{ r: 4, fill: '#5291bb', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </SubSection>

            {/* Radar + Pizza */}
            <SubSection title="Radar & Pizza">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>

                <ChartCard
                  title="Habilidades"
                  subtitle={`Comparativo em ${radarVertices} eixos`}
                  extra={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--c-text-3)' }}>Eixos</span>
                      <button onClick={() => setRadarVertices(v => Math.max(3, v - 1))} style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--c-glass-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text-2)', cursor: 'pointer', fontSize: '15px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#5291bb', minWidth: '18px', textAlign: 'center' }}>{radarVertices}</span>
                      <button onClick={() => setRadarVertices(v => Math.min(10, v + 1))} style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--c-glass-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text-2)', cursor: 'pointer', fontSize: '15px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                  }
                >
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart
                      data={RADAR_LABELS.slice(0, radarVertices).map((label, i) => ({ eixo: label, Você: RADAR_A[i], Média: RADAR_B[i] }))}
                      margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
                    >
                      <PolarGrid stroke={cc.radarGrid} />
                      <PolarAngleAxis dataKey="eixo" tick={{ fill: cc.tickDense, fontSize: 10 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Você"  dataKey="Você"  stroke="#83e6c3" fill="#83e6c3" fillOpacity={0.20} strokeWidth={2} />
                      <Radar name="Média" dataKey="Média" stroke="#5291bb" fill="#5291bb" fillOpacity={0.12} strokeWidth={1.5} strokeDasharray="4 3" />
                      <Legend content={ChartLegend} />
                      <Tooltip content={<ChartTooltip theme={theme} />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Categorias de Cursos" subtitle="Distribuição por área de conhecimento">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={CATEGORY_DATA} cx="50%" cy="45%" outerRadius={100} dataKey="value" nameKey="name" paddingAngle={3}>
                        {CATEGORY_DATA.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<ChartTooltip theme={theme} />} />
                      <Legend content={ChartLegend} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

              </div>
            </SubSection>

            {/* Rosca + Scatter */}
            <SubSection title="Rosca & Distribuição de Pontos">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                <ChartCard title="Taxa de Conclusão" subtitle="Status dos cursos matriculados">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={COMPLETION_DATA} cx="50%" cy="45%" innerRadius={65} outerRadius={95} dataKey="value" nameKey="name" paddingAngle={4}>
                        {COMPLETION_DATA.map((_, i) => <Cell key={i} fill={['#83e6c3','#5291bb','#73acd2'][i]} fillOpacity={0.85} />)}
                      </Pie>
                      <Tooltip content={<ChartTooltip theme={theme} />} />
                      <Legend content={ChartLegend} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Horas de Estudo × Desempenho" subtitle="Correlação entre dedicação e nota final" style={{ gridColumn: 'span 1' }}>
                  <ResponsiveContainer width="100%" height={260}>
                    <ScatterChart margin={{ top: 4, right: 16, bottom: 24, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
                      <XAxis dataKey="horas" name="Horas/dia" type="number" domain={[0, 12]} tick={{ fill: cc.tick, fontSize: 11 }} axisLine={{ stroke: cc.axisLine }} tickLine={false}
                        label={{ value: 'Horas de estudo / dia', position: 'insideBottom', offset: -14, fill: cc.tickFaint, fontSize: 10 }} />
                      <YAxis dataKey="nota" name="Nota" domain={[3, 10]} tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                      <Tooltip content={<ChartTooltip theme={theme} />} cursor={{ strokeDasharray: '3 3', stroke: cc.cursorDash }} />
                      <Scatter name="Alunos" data={SCATTER_DATA}>
                        {SCATTER_DATA.map((_, i) => (
                          <Cell key={i} fill={['#83e6c3','#5291bb','#73acd2'][i % 3]} fillOpacity={0.80} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartCard>

              </div>
            </SubSection>

          </Section>
        </main>
      </div>
    </div>
  )
}
