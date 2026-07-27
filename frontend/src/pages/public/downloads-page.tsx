import { FileDown } from 'lucide-react'

import { DataStatus } from '@/components/public/data-status'
import { PageIntro } from '@/components/public/page-intro'
import { Button } from '@/components/ui/button'
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

export function DownloadsPage() {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={siteContentState.isFallback}
        isLoading={siteContentState.isLoading}
      />

      <PageIntro
        description="Templates, policies, and supporting journal resources prepared for public access."
        eyebrow="Supporting Material"
        title="Downloads"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {siteContentState.data.downloads.map((download) => (
          <Card key={download.id}>
            <CardHeader>
              <CardDescription>{download.category}</CardDescription>
              <CardTitle className="text-2xl">{download.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-7 text-muted-foreground">
                {download.description}
              </p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  {download.fileSize}
                </span>
                <Button asChild>
                  <a href={download.fileUrl}>
                    Download
                    <FileDown className="size-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
