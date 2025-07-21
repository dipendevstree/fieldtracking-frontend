import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export type ThemeVariant = 'default' | 'vs-code' | 'spotify' | 'ghibli' | 'valorant'

export interface ThemeConfig {
  name: string
  label: string
  isNew?: boolean
  isTrending?: boolean
}

export const THEMES: Record<ThemeVariant, ThemeConfig> = {
  'default': { name: 'Default', label: 'Default' },
  'vs-code': { name: 'VS Code', label: 'VS Code', isNew: true },
  'spotify': { name: 'Spotify', label: 'Spotify' },
  'ghibli': { name: 'Ghibli', label: 'Ghibli Studio', isTrending: true },
  'valorant': { name: 'Valorant', label: 'Valorant' },
}

type ThemeProviderProps = Readonly<{
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}>

type ThemeProviderState = {
  theme: Theme
  themeVariant: ThemeVariant
  setTheme: (theme: Theme) => void
  setThemeVariant: (variant: ThemeVariant) => void
  getThemeConfig: (variant: ThemeVariant) => ThemeConfig
  getCurrentThemeConfig: () => ThemeConfig
}

const initialState: ThemeProviderState = {
  theme: 'system',
  themeVariant: 'default',
  setTheme: () => null,
  setThemeVariant: () => null,
  getThemeConfig: () => THEMES['default'],
  getCurrentThemeConfig: () => THEMES['default'],
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(`${storageKey}-mode`) as Theme) || defaultTheme
  )
  
  const [themeVariant, setThemeVariantState] = useState<ThemeVariant>(
    () => (localStorage.getItem(`${storageKey}-variant`) as ThemeVariant) || 'default'
  )

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (theme: Theme) => {
      root.classList.remove('light', 'dark') // Remove existing theme classes
      const systemTheme = mediaQuery.matches ? 'dark' : 'light'
      const effectiveTheme = theme === 'system' ? systemTheme : theme
      root.classList.add(effectiveTheme) // Add the new theme class
    }

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    applyTheme(theme)

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(`${storageKey}-mode`, newTheme)
    setThemeState(newTheme)
  }, [storageKey])
  
  const setThemeVariant = useCallback((variant: ThemeVariant) => {
    localStorage.setItem(`${storageKey}-variant`, variant)
    setThemeVariantState(variant)
    // Apply theme variant class to root element
    const root = window.document.documentElement
    // Remove all theme variant classes
    Object.keys(THEMES).forEach((key) => {
      root.classList.remove(`theme-${key}`)
    })
    // Add the selected theme variant class (except for default)
    if (variant !== 'default') {
      root.classList.add(`theme-${variant}`)
    }
  }, [storageKey])
  
  // Apply theme variant on initial load and when it changes
  useEffect(() => {
    const root = window.document.documentElement
    // Remove all theme variant classes
    Object.keys(THEMES).forEach((key) => {
      root.classList.remove(`theme-${key}`)
    })
    // Add the selected theme variant class (except for default)
    if (themeVariant !== 'default') {
      root.classList.add(`theme-${themeVariant}`)
    }
  }, [themeVariant])
  
  const getThemeConfig = useCallback((variant: ThemeVariant) => {
    return THEMES[variant] || THEMES['default']
  }, [])
  
  const getCurrentThemeConfig = useCallback(() => {
    return THEMES[themeVariant] || THEMES['default']
  }, [themeVariant])
  
  const value = useMemo(
    () => ({
      theme,
      themeVariant,
      setTheme,
      setThemeVariant,
      getThemeConfig,
      getCurrentThemeConfig,
    }),
    [theme, themeVariant, setTheme, setThemeVariant, getThemeConfig, getCurrentThemeConfig]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
