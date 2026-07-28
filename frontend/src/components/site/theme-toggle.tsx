import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const label = isDark ? 'Use light mode' : 'Use dark mode'

  return (
    <Button aria-label={label} onClick={toggleTheme} size="sm" title={label} type="button" variant="ghost">
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="hidden md:inline">{isDark ? 'Light' : 'Dark'}</span>
    </Button>
  )
}
