import { DataStatus } from '@/components/public/data-status'
import { PageIntro } from '@/components/public/page-intro'
import { PublicationCard } from '@/components/public/publication-card'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getCurrentIssue } from '@/lib/api/public-api'
import { fallbackCurrentIssue } from '@/lib/public-content'

export function CurrentIssuePage() {
  const currentIssueState = usePublicResource(getCurrentIssue, fallbackCurrentIssue)

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={currentIssueState.isFallback}
        isLoading={currentIssueState.isLoading}
      />

      <PageIntro
        description={currentIssueState.data.description}
        eyebrow="Latest Publication Cycle"
        title={currentIssueState.data.title}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Published on{' '}
            {new Date(currentIssueState.data.publicationDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-2">
          {currentIssueState.data.publications.map((publication) => (
            <PublicationCard key={publication.slug} publication={publication} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
