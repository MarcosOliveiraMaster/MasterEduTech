# MasterEduTech Design System

> A comprehensive UI design system for the MasterEduTech educational platform — trustworthy, vibrant, and built for learning.

---

## 1. Brand Philosophy

MasterEduTech is an educational technology platform that puts **learning at the center**. The design system reflects three core values:

- **Trustworthy**: Deep navy-purple backgrounds and structured layouts convey authority and reliability.
- **Vibrant**: Mint/teal accents (#83E6C3) energize the interface and celebrate progress.
- **Focused**: Glass surfaces, clear hierarchy, and generous whitespace keep learners in flow.

The brand draws from two anchoring colors extracted from the official visual identity:
- **Brand Purple** `#7C3AED` — interactive primary, CTAs, and focus states.
- **Brand Dark** `#22105D` — deep purple used in hero backgrounds and emphasis.
- **Accent Mint** `#83E6C3` — headings, highlights, positive feedback, and motion accents.

---

## 2. Color System

### Purple Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `--purple-50` | `#f5f0ff` | Light mode background tint |
| `--purple-100` | `#ede0ff` | Hover states on light |
| `--purple-200` | `#d4b8ff` | Disabled states |
| `--purple-300` | `#b48aff` | Muted interactive |
| `--purple-400` | `#9a5bff` | Hover primary |
| `--purple-500` | `#7c3aed` | **Primary interactive** |
| `--purple-600` | `#6020cc` | Active/pressed state |
| `--purple-700` | `#4b16a8` | Emphasis |
| `--purple-800` | `#22105d` | **Brand dark** |
| `--purple-900` | `#140a3c` | Deepest dark |

### Mint Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `--mint-50` | `#edfaf5` | Light background tint |
| `--mint-100` | `#c7f4e3` | Light hover |
| `--mint-200` | `#9fecd1` | Muted accent |
| `--mint-300` | `#83e6c3` | **Accent highlight** |
| `--mint-400` | `#52d4a8` | Hover accent |
| `--mint-500` | `#2abd8d` | Active accent |
| `--mint-600` | `#1e9b73` | Emphasis accent |
| `--mint-700` | `#167a5b` | Deepest accent |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#22c55e` | Completion, correct answers |
| `--color-warning` | `#f59e0b` | Caution, deadlines |
| `--color-error` | `#ef4444` | Errors, wrong answers |
| `--color-info` | `#7c3aed` | Informational (maps to primary) |

---

## 3. Typography

**Fonts**: `Inter` (UI text), `JetBrains Mono` (code, IDs)

| Scale | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--font-size-xs` | 11px | 1.4 | 400 | Labels, captions |
| `--font-size-sm` | 13px | 1.5 | 400 | Body small, helper |
| `--font-size-base` | 15px | 1.6 | 400 | Body default |
| `--font-size-md` | 17px | 1.5 | 500 | Body emphasis |
| `--font-size-lg` | 20px | 1.4 | 500 | Section labels |
| `--font-size-xl` | 24px | 1.3 | 600 | Card headings |
| `--font-size-2xl` | 30px | 1.25 | 700 | Page titles |
| `--font-size-3xl` | 38px | 1.2 | 700 | Hero headings |
| `--font-size-4xl` | 48px | 1.15 | 800 | Display |

---

## 4. Spacing (4px Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Micro gap |
| `--space-2` | 8px | Icon padding |
| `--space-3` | 12px | Compact padding |
| `--space-4` | 16px | Default gap |
| `--space-5` | 20px | Section padding |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Large gap |
| `--space-10` | 40px | Section gap |
| `--space-12` | 48px | Large section |
| `--space-16` | 64px | Page section |
| `--space-20` | 80px | Hero spacing |
| `--space-24` | 96px | Max spacing |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 4px | Tags, small chips |
| `--radius-sm` | 8px | Buttons, inputs |
| `--radius-md` | 12px | Cards, modals |
| `--radius-lg` | 16px | Large cards |
| `--radius-xl` | 24px | Hero sections |
| `--radius-2xl` | 32px | Full containers |
| `--radius-full` | 9999px | Pills, avatars |

---

## 6. Glass Surfaces

The system uses four glass surface levels built on `backdrop-filter: blur()`:

| Class | Blur | Opacity | Usage |
|-------|------|---------|-------|
| `.glass-sm` | 8px | 4% white | Subtle overlays, tooltips |
| `.glass` | 16px | 8% white | Default cards, modals |
| `.glass-lg` | 24px | 14% white | Hero cards, featured panels |
| `.glass-purple` | 20px | 15% purple | Interactive cards, CTAs |
| `.glass-mint` | 20px | 10% mint | Success states, highlights |

All glass surfaces include:
- Semi-transparent background
- `1px solid` border at 10–30% opacity
- Layered box-shadow for depth
- Smooth `backdrop-filter` for the frosted effect

---

## 7. Components

### Button
Variants: `primary` (purple gradient), `secondary` (glass), `ghost` (transparent), `danger`, `success`, `mint`
Sizes: `sm` (32px height), `md` (40px), `lg` (48px)
States: default, hover, active, disabled, loading (with spinner)

### Input
Types: `Input`, `Textarea`, `Select`, `Checkbox`, `Toggle`
Focus state uses purple ring. Caret color is mint. Error state uses `--color-error`. Helper text with semantic color support.

### GlassCard
Variants: `sm`, `default`, `lg`, `purple`, `mint`
Supports `hoverable` prop for lift animation (`translateY(-4px) scale(1.01)`).

### Badge
Variants: `purple`, `mint`, `white`, `success`, `warning`, `error`, `outline`
Sizes: `sm`, `md`
Optional animated pulsing `dot` indicator.

### Avatar
Sizes: `xs` (24px), `sm` (32px), `md` (40px), `lg` (48px), `xl` (64px), `2xl` (80px)
Supports image, initials fallback, status indicators (online/offline/busy), and purple ring border.
`AvatarGroup` stacks up to N avatars with a count overflow badge.

### Notification
Variants: `info` (purple), `success` (green), `warning` (amber), `error` (red)
Slides in from right with `slide-in-right` animation.
Auto-dismiss with configurable duration.

---

## 8. Motion

The Motion section of the design system documents and showcases all animation primitives.

### Loading Animations

| Name | Keyframe | Duration | Usage |
|------|----------|----------|-------|
| Ring Spinner | `spin` | 700ms linear | Async loading |
| Bounce Dots | `bounce-dot` | 600ms staggered | Content loading |
| Pulse Ring | `pulse-ring` | 1.2s ease-out | Progress, heartbeat |
| Bar Loader | `scale-y` | 600ms staggered | Upload/progress |

### Skeleton Loaders
Use the `shimmer` keyframe (`translateX(-100%)` → `translateX(100%)`) on a `::after` pseudo-element over a muted glass background. Shapes mirror real content (course card, user row).

### Progress Bar
Fills horizontally using `--gradient-btn-primary`. Animated via CSS width transition. Interactive replay via React state reset.

### Logo Animation
The MasterEduTech SVG logo animates in three phases:
1. **Ring** — mint circle rotates slowly with `spin-slow` (2s linear infinite)
2. **M glyph** — stroke is drawn with `draw-check` (stroke-dashoffset 100 → 0, 800ms)
3. **Wordmark** — "MasterEduTech" fades up with `logo-reveal` (400ms, delay 600ms)

Triggers on mount, with a replay button to restart all phases.

### Icon Animations (hover-triggered)

| Icon | Animation | Color |
|------|-----------|-------|
| Checkmark | `draw-check` stroke draw | `--color-success` |
| Error X | `draw-check` stroke draw | `--color-error` |
| Info circle | Scale + fade in | `--purple-400` |
| Warning triangle | `pulse-glow` amber | `--color-warning` |

---

## Usage

```bash
cd desing/edutech-design-system
npm install
npm run dev
```

Open `http://localhost:5173` to view the interactive design system showcase.
