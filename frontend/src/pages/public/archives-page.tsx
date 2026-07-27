import { Archive } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { DataStatus } from '@/components/public/data-status'
import { PageIntro } from '@/components/public/page-intro'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getArchiveIssues } from '@/lib/api/public-api'
import { fallbackArchiveIssues } from '@/lib/public-content'
import { Button } from '@/components/ui/button'

export function ArchivesPage() {
  const archivesState = usePublicResource(getArchiveIssues, fallbackArchiveIssues)

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={archivesState.isFallback}
        isLoading={archivesState.isLoading}
      />

      <PageIntro
        description="Browse previous issues by volume and publication cycle."
        eyebrow="Historical Record"
        title="IJABE Archives"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {archivesState.data.map((issue) => (
          <Card key={issue.slug}>
            <CardHeader>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Archive className="size-5" />
              </div>
              <CardTitle className="text-2xl">{issue.title}</CardTitle>
              <CardDescription>{issue.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Published:{' '}
                {new Date(issue.publicationDate).toLocaleDateString()}
              </p>
              <p>Articles in archive: {issue.publicationCount}</p>
              <Button asChild className="mt-3" variant="secondary">
                <NavLink to={`/issues/${issue.slug}`}>View issue articles</NavLink>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
