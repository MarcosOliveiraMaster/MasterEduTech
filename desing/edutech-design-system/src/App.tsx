import { useState, useEffect } from 'react'
import './design-system/global.css'
import './design-system/responsive.css'
import './App.css'
import { HomePage } from './pages/HomePage'

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div className="app-layout">
      <HomePage theme={theme} onToggleTheme={toggleTheme} />
    </div>
  )
}

export default App
