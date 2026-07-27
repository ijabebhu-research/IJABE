import { NavLink } from 'react-router-dom'

import { usePublicResource } from '@/hooks/use-public-resource'
import { getPublicSiteContent } from '@/lib/api/public-api'
import { publicPages } from '@/lib/navigation'
import { fallbackSiteContent } from '@/lib/public-content'

export function SiteFooter() {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)

  return (
    <footer className="border-t border-border/70 bg-card/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            IJABE
          </p>
          <h2 className="font-serif text-2xl text-foreground">
            International Journal of Accounting, Business Admin, &amp; Entrepreneurship.
          </h2>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {siteContentState.data.contact.officeName}
            {' '}supports open access to scholarly publications, IJABE news, and conference opportunities.
          </p>
          {siteContentState.data.branding.issn && (
            <p className="text-sm font-medium text-foreground">
              ISSN: {siteContentState.data.branding.issn.replace(/^ISSN\s*:?[\s]*/i, '')}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Public pages</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {publicPages
              .filter((page) => !['/editorial-board', '/gallery', '/downloads'].includes(page.path))
              .map((page) => (
              <NavLink
                key={page.path}
                className="transition-colors hover:text-foreground"
                to={page.path}
              >
                {page.label}
              </NavLink>
              ))}
            <NavLink className="transition-colors hover:text-foreground" to="/search">
              Search
            </NavLink>
          </div>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Bingham University</p>
          <p>KM 26 Abuja-Keffi Expressway, Kodope, Karu, Nasarawa State, Nigeria.</p>
          <a className="text-primary hover:underline" href="https://www.binghamuni.edu.ng/" rel="noreferrer" target="_blank">Visit Bingham University</a>
        </div>
      </div>
    </footer>
  )
}
