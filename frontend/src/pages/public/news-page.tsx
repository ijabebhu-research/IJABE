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
import { getPublicSiteContent } from '@/lib/api/public-api'
import { fallbackSiteContent } from '@/lib/public-content'

export function NewsPage() {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={siteContentState.isFallback}
        isLoading={siteContentState.isLoading}
      />

      <PageIntro
        description="Institutional updates, calls for papers, and editorial announcements."
        eyebrow="Announcements"
        title="News"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {siteContentState.data.news.map((item) => (
          <Card key={item.slug}>
            <CardHeader>
              <CardDescription>{item.category}</CardDescription>
              <CardTitle className="text-2xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{item.excerpt}</p>
              <p>{new Date(item.publishedAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
