import { DataStatus } from '@/components/public/data-status'
import { PageIntro } from '@/components/public/page-intro'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getPublicSiteContent } from '@/lib/api/public-api'
import { fallbackSiteContent } from '@/lib/public-content'

export function GalleryPage() {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={siteContentState.isFallback}
        isLoading={siteContentState.isLoading}
      />

      <PageIntro
        description="A visual record of editorial meetings, research activities, and institutional engagement."
        eyebrow="Visual Storytelling"
        title="Gallery"
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {siteContentState.data.gallery.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <img
              alt={item.title}
              className="aspect-[16/10] w-full object-cover"
              src={item.imageUrl}
            />
            <CardHeader>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.category}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
