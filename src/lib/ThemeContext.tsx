import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dusk' | 'dark' | 'classico'

const THEME_KEY = 'metdc:theme'

interface ThemeContextValue {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark', setTheme: () => {} })

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dusk' || value === 'dark' || value === 'classico'
}

function getInitialTheme(): ThemeMode {
  const fromDom = document.documentElement.getAttribute('data-theme')
  if (isThemeMode(fromDom)) return fromDom
  const stored = localStorage.getItem(THEME_KEY)
  return isThemeMode(stored) ? stored : 'dark'
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
