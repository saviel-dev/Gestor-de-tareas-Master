
import { createContext, useContext, useEffect, useState } from "react"

type ThemeMode = "light" | "dark" | "system"
type ThemeColor = "default" | "purple" | "blue"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultMode?: ThemeMode
  defaultColor?: ThemeColor
  storageKey?: string
}

type ThemeProviderState = {
  mode: ThemeMode
  color: ThemeColor
  setMode: (mode: ThemeMode) => void
  setColor: (color: ThemeColor) => void
}

const initialState: ThemeProviderState = {
  mode: "system",
  color: "default",
  setMode: () => null,
  setColor: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultColor = "default",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem(`${storageKey}-mode`) as ThemeMode) || defaultMode
  )
  const [color, setColor] = useState<ThemeColor>(
    () => (localStorage.getItem(`${storageKey}-color`) as ThemeColor) || defaultColor
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    root.classList.remove("light", "dark", "light-purple", "dark-purple", "light-blue", "dark-blue")

    let actualMode = mode
    if (mode === "system") {
      actualMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }

    // Apply theme class based on mode and color
    if (color === "default") {
      root.classList.add(actualMode)
    } else {
      root.classList.add(`${actualMode}-${color}`)
    }
  }, [mode, color])

  const value = {
    mode,
    color,
    setMode: (mode: ThemeMode) => {
      localStorage.setItem(`${storageKey}-mode`, mode)
      setMode(mode)
    },
    setColor: (color: ThemeColor) => {
      localStorage.setItem(`${storageKey}-color`, color)
      setColor(color)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
