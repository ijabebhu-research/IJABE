import { BookOpenText } from 'lucide-react'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { DataStatus } from '@/components/public/data-status'
import { PageIntro } from '@/components/public/page-intro'
import { PublicationCard } from '@/components/public/publication-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getIssueBySlug } from '@/lib/api/public-api'
import { fallbackCurrentIssue } from '@/lib/public-content'

export function IssueDetailPage() {
  const slug = useParams().slug ?? fallbackCurrentIssue.slug
  const loader = useMemo(() => () => getIssueBySlug(slug), [slug])
  const issueState = usePublicResource(loader, fallbackCurrentIssue)
  const issue = issueState.data

  return (
    <div className="space-y-6">
      <DataStatus isFallback={issueState.isFallback} isLoading={issueState.isLoading} />
      <PageIntro
        description={issue.description}
        eyebrow="International Journal of Accounting, Business Administration & Entrepreneurship"
        title={issue.title}
      />
      <Card>
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpenText className="size-5" /></div>
          <CardTitle className="mt-4 text-2xl">Articles in this issue</CardTitle>
        </CardHeader>
        <CardContent>
          {issue.publications.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {issue.publications.map((publication) => <PublicationCard key={publication.slug} publication={publication} />)}
            </div>
          ) : (
            <p className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">No articles have been published for this issue yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
