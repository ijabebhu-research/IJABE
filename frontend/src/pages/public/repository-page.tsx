import { DataStatus } from '@/components/public/data-status'
import { PageIntro } from '@/components/public/page-intro'
import { PublicationCard } from '@/components/public/publication-card'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getPublications } from '@/lib/api/public-api'
import { fallbackPublications } from '@/lib/public-content'
import { Button } from '@/components/ui/button'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function RepositoryPage() {
  const publicationsState = usePublicResource(getPublications, fallbackPublications)
  const [page, setPage] = useState(1)
  const articlesPerPage = 12
  const pageCount = Math.max(1, Math.ceil(publicationsState.data.length / articlesPerPage))
  const visiblePublications = publicationsState.data.slice(
    (page - 1) * articlesPerPage,
    page * articlesPerPage,
  )

  useEffect(() => { setPage(1) }, [publicationsState.data.length])

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={publicationsState.isFallback}
        isLoading={publicationsState.isLoading}
      />

      <PageIntro
        description="Browse the latest individual IJABE research articles. Use search to find older articles by title, author, topic, or journal issue."
        eyebrow="Article Discovery"
        title="Research Articles"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {visiblePublications.map((publication) => (
          <PublicationCard key={publication.slug} publication={publication} />
        ))}
      </div>
      {publicationsState.data.length > articlesPerPage && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4"><p className="text-sm text-muted-foreground">Showing {(page - 1) * articlesPerPage + 1}-{Math.min(page * articlesPerPage, publicationsState.data.length)} of {publicationsState.data.length} articles.</p><div className="flex gap-2"><Button disabled={page === 1} onClick={() => setPage((current) => current - 1)} type="button" variant="secondary">Previous</Button><Button disabled={page === pageCount} onClick={() => setPage((current) => current + 1)} type="button" variant="secondary">Next</Button><Button asChild><NavLink to="/search">Search articles</NavLink></Button></div></div>}
    </div>
  )
}
