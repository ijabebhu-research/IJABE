import { Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getPublicSiteContent } from '@/lib/api/public-api'
import { cn } from '@/lib/utils'
import { primaryNavItems } from '@/lib/navigation'
import { fallbackSiteContent } from '@/lib/public-content'

export function SiteHeader() {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="relative z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <NavLink className="flex min-w-0 items-center gap-2 sm:gap-3" to="/" onClick={() => setIsMobileMenuOpen(false)}>
          <img
            alt="Bingham University logo"
            className="h-10 w-10 shrink-0 rounded-xl object-cover sm:h-12 sm:w-12 sm:rounded-2xl"
            src={siteContentState.data.branding.universityLogoUrl}
          />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              IJABE
            </p>
            <p className="hidden text-sm text-muted-foreground sm:block">
              International Journal of Accounting, Business Admin, &amp; Entrepreneurship
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {primaryNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary',
                  isActive && 'bg-secondary text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button asChild className="px-2 sm:px-3" size="sm" variant="secondary">
            <NavLink to="/search">
              <Search className="size-4" />
              <span className="hidden sm:inline">Search</span>
            </NavLink>
          </Button>
          <Button
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="px-2 sm:px-3 lg:hidden"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            size="sm"
            variant="ghost"
          >
            {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            <span className="hidden sm:inline">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="border-t border-border/70 bg-background px-6 py-4 shadow-lg lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {primaryNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary',
                    isActive && 'bg-secondary text-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
