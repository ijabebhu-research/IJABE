import { Menu, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getPublicSiteContent } from '@/lib/api/public-api'
import { cn } from '@/lib/utils'
import { primaryNavItems } from '@/lib/navigation'
import { fallbackSiteContent } from '@/lib/public-content'

export function SiteHeader() {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <NavLink className="flex items-center gap-3" to="/">
          <img
            alt="Bingham University logo"
            className="h-12 w-12 rounded-2xl object-cover"
            src={siteContentState.data.branding.universityLogoUrl}
          />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              IJABE
            </p>
            <p className="text-sm text-muted-foreground">
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

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="secondary">
            <NavLink to="/search">
              <Search className="size-4" />
              Search
            </NavLink>
          </Button>
          <Button className="lg:hidden" size="sm" variant="ghost">
            <Menu className="size-4" />
            Menu
          </Button>
        </div>
      </div>
    </header>
  )
}
