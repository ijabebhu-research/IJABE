import { FileDown } from 'lucide-react'
import { useMemo } from 'react'
import { NavLink, useParams } from 'react-router-dom'

import { DataStatus } from '@/components/public/data-status'
import { PageIntro } from '@/components/public/page-intro'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getPublicationBySlug } from '@/lib/api/public-api'
import { fallbackPublications } from '@/lib/public-content'

export function PublicationDetailPage() {
  const params = useParams()
  const slug = params.slug ?? fallbackPublications[0].slug

  const loader = useMemo(() => {
    return () => getPublicationBySlug(slug)
  }, [slug])

  const publicationState = usePublicResource(loader, fallbackPublications[0])

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={publicationState.isFallback}
        isLoading={publicationState.isLoading}
      />

      <PageIntro
        description={publicationState.data.abstract}
        eyebrow="Research Article"
        title={publicationState.data.title}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Abstract and keywords</CardTitle>
            <CardDescription>{publicationState.data.authors.join(', ')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-muted-foreground">
              {publicationState.data.abstract}
            </p>
            <div className="flex flex-wrap gap-2">
              {publicationState.data.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Publication metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Category: {publicationState.data.category}</p>
            <p>
              Journal: International Journal of Accounting, Business Administration &amp; Entrepreneurship (IJABE)
            </p>
            <p>
              Issue:{' '}
              <NavLink className="font-medium text-primary underline-offset-4 hover:underline" to={`/issues/${publicationState.data.issueSlug}`}>
                {publicationState.data.issueTitle ?? publicationState.data.issueSlug}
              </NavLink>
            </p>
            <p>
              Published:{' '}
              {new Date(publicationState.data.publishedAt).toLocaleDateString()}
            </p>
            <p>DOI: {publicationState.data.doi}</p>
            {publicationState.data.pdfUrl && (
              <Button asChild>
                <a href={publicationState.data.pdfUrl}>
                  Download article
                  <FileDown className="size-4" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
