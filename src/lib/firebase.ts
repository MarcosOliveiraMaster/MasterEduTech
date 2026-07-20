/**
 * firebase.ts — Master Educação
 * ─────────────────────────────────────────────────────────────
 * Mesma configuração e whitelist do painel Central
 * (../masteredutech_central/src/lib/firebase.ts) — login único entre
 * os dois sistemas.
 *
 * NOTA DE SEGURANÇA: API keys do Firebase são intencionalmente públicas.
 * A proteção real vem das Firestore Security Rules + App Check.
 */

import { initializeApp } from 'firebase/app'
import { getAuth, browserSessionPersistence, setPersistence } from 'firebase/auth'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyDPPbSA8SB-L_giAhWIqGbPGSMRBDTPi40',
  authDomain:        'master-ecossistemaprofessor.firebaseapp.com',
  databaseURL:       'https://master-ecossistemaprofessor-default-rtdb.firebaseio.com',
  projectId:         'master-ecossistemaprofessor',
  storageBucket:     'master-ecossistemaprofessor.firebasestorage.app',
  messagingSenderId: '532224860209',
  appId:             '1:532224860209:web:686657b6fae13b937cf510',
  measurementId:     'G-B0KMX4E67D',
}

/** Whitelist de e-mails autorizados — mesma do painel Central */
export const AUTHORIZED_EMAILS = Object.freeze([
  'mastereducacaoadm@gmail.com',
  'marcos.lucas.ti@gmail.com',
])

/** Chave pública do reCAPTCHA v3 para Firebase App Check */
export const RECAPTCHA_SITE_KEY = '6LdOBZssAAAAAHvUBWf0JpJZEntddWNmGq3H4Awx'

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Sessão apenas na aba atual (mesmo comportamento do Central)
setPersistence(auth, browserSessionPersistence).catch(() => {})

// ── App Check (reCAPTCHA v3) ──────────────────────────────────
const isLocalhost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname)

if (isLocalhost) {
  // Em localhost: ativa o debug provider para gerar um token de debug.
  // Na primeira execução, o token aparece no console — registre-o em
  // Firebase Console → App Check → Debug tokens.
  ;(self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = true
}

try {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  })
  if (isLocalhost) {
    console.info('[firebase] App Check em modo DEBUG (localhost). Registre o token do console no Firebase Console.')
  }
} catch (err) {
  console.warn('[firebase] App Check não ativado:', err)
}

export function isAuthorizedEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const e = email.toLowerCase().trim()
  return AUTHORIZED_EMAILS.some(a => a.toLowerCase() === e)
}
