import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { ThemeProvider } from './lib/ThemeContext'
import { ToastProvider } from './lib/ToastContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { InicioPage } from './pages/InicioPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { PesquisaProfessoresPage } from './features/professores/PesquisaProfessoresPage'
import { TabelaProfessoresPage } from './features/professores/TabelaProfessoresPage'
import { BancoDeAulasPage } from './features/banco-de-aulas/BancoDeAulasPage'
import { SimulacoesPage } from './features/simulacoes/SimulacoesPage'

const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter basename={ROUTER_BASENAME}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/inicio" element={<InicioPage />} />
                <Route path="/banco-de-aulas" element={<BancoDeAulasPage />} />
                <Route path="/simulacoes" element={<SimulacoesPage />} />
                <Route path="/calendario-master" element={<PlaceholderPage title="Calendário Master" />} />
                <Route path="/demandas" element={<PlaceholderPage title="Demandas" description="Fluxo de processos." />} />

                <Route path="/dashboard" element={<Navigate to="/dashboard/clientes/clientes" replace />} />
                <Route path="/dashboard/clientes/clientes" element={<PlaceholderPage title="Clientes" />} />
                <Route path="/dashboard/clientes/analise" element={<PlaceholderPage title="Análise" />} />
                <Route path="/dashboard/professores/pesquisa" element={<PesquisaProfessoresPage />} />
                <Route path="/dashboard/professores/fichas" element={<TabelaProfessoresPage />} />
                <Route path="/dashboard/professores/selecao" element={<PlaceholderPage title="Seleção" />} />
                <Route path="/dashboard/professores/analise" element={<PlaceholderPage title="Análise" />} />

                <Route path="/pagamento-professores" element={<PlaceholderPage title="Pagamento Professores" />} />
                <Route path="/painel-financeiro" element={<PlaceholderPage title="Painel Financeiro" />} />
                <Route path="/cofres-reservas" element={<PlaceholderPage title="Cofres e Reservas" />} />
                <Route path="/previsao-financeira" element={<PlaceholderPage title="Previsão Financeira" />} />
                <Route path="/exportar-dados" element={<PlaceholderPage title="Exportar Dados" />} />
              </Route>

              <Route path="/" element={<Navigate to="/inicio" replace />} />
              <Route path="*" element={<Navigate to="/inicio" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
