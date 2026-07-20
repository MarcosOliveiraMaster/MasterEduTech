/**
 * auth.ts — Master Educação
 * ─────────────────────────────────────────────────────────────
 * Portado de ../masteredutech_central/src/lib/auth.ts — mesma lógica
 * de rate limiting, sanitização e mensagens de erro.
 */

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type AuthError,
} from 'firebase/auth'
import { auth, isAuthorizedEmail } from './firebase'

/* ============================================================
   RATE LIMITING
   ============================================================ */
const LOGIN_MAX_ATTEMPTS = 5
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000
const RL_KEY_COUNT = 'auth_attempts'
const RL_KEY_TIMESTAMP = 'auth_first_attempt'

function rlGetCount(): number {
  return parseInt(sessionStorage.getItem(RL_KEY_COUNT) || '0', 10)
}

function rlGetTimestamp(): number {
  return parseInt(sessionStorage.getItem(RL_KEY_TIMESTAMP) || '0', 10)
}

export function rlIsLocked(): boolean {
  const count = rlGetCount()
  if (count < LOGIN_MAX_ATTEMPTS) return false
  const elapsed = Date.now() - rlGetTimestamp()
  if (elapsed > LOGIN_LOCKOUT_MS) {
    sessionStorage.removeItem(RL_KEY_COUNT)
    sessionStorage.removeItem(RL_KEY_TIMESTAMP)
    return false
  }
  return true
}

export function rlRemainingMs(): number {
  return Math.max(0, LOGIN_LOCKOUT_MS - (Date.now() - rlGetTimestamp()))
}

function rlRecordFailure(): void {
  const count = rlGetCount()
  if (count === 0) sessionStorage.setItem(RL_KEY_TIMESTAMP, String(Date.now()))
  sessionStorage.setItem(RL_KEY_COUNT, String(count + 1))
}

function rlReset(): void {
  sessionStorage.removeItem(RL_KEY_COUNT)
  sessionStorage.removeItem(RL_KEY_TIMESTAMP)
}

/* ============================================================
   SANITIZAÇÃO
   ============================================================ */
export function sanitizeText(str: string): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;').trim()
}

export function isValidEmailFormat(email: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email)
}

/* ============================================================
   LOGIN / LOGOUT / RESET
   ============================================================ */
interface AuthResult {
  success: boolean
  error?: string
}

const ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
}

export async function loginWithEmail(rawEmail: string, rawPassword: string): Promise<AuthResult> {
  const email = sanitizeText(rawEmail).toLowerCase()
  const password = rawPassword ? rawPassword.trim() : ''

  if (!isValidEmailFormat(email)) {
    return { success: false, error: 'E-mail inválido.' }
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Senha deve ter pelo menos 6 caracteres.' }
  }

  if (rlIsLocked()) {
    const mins = Math.ceil(rlRemainingMs() / 60000)
    return { success: false, error: `Muitas tentativas incorretas. Aguarde ${mins} minuto(s).` }
  }

  if (!isAuthorizedEmail(email)) {
    rlRecordFailure()
    return { success: false, error: 'Acesso não autorizado para este e-mail.' }
  }

  try {
    await signInWithEmailAndPassword(auth, email, password)
    rlReset()
    return { success: true }
  } catch (err) {
    rlRecordFailure()
    const code = (err as AuthError).code
    return { success: false, error: ERROR_MESSAGES[code] || 'Erro ao fazer login. Tente novamente.' }
  }
}

export async function sendPasswordReset(rawEmail: string): Promise<AuthResult> {
  const email = sanitizeText(rawEmail).toLowerCase()

  if (!isValidEmailFormat(email)) {
    return { success: false, error: 'E-mail inválido.' }
  }

  // Silencioso para e-mails fora da whitelist — não enumerar contas.
  if (!isAuthorizedEmail(email)) {
    return { success: true }
  }

  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch {
    return { success: false, error: 'Erro ao enviar e-mail. Tente novamente.' }
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth)
  } catch {
    // silencioso — mesmo comportamento do Central
  }
}
