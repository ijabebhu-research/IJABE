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

type ContentPageProps = {
  slug: string
}

export function ContentPage({ slug }: ContentPageProps) {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)
  const page =
    siteContentState.data.pages.find((item) => item.slug === slug) ??
    fallbackSiteContent.pages[0]

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={siteContentState.isFallback}
        isLoading={siteContentState.isLoading}
      />

      <PageIntro
        description={page.summary}
        eyebrow={page.eyebrow}
        title={page.title}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Overview</CardTitle>
            <CardDescription>
              This public page now reads from the shared content source used by
              the current public experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {page.sections.map((section) => (
              <div key={section.title} className="rounded-2xl border border-border/70 bg-secondary/50 p-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {section.body}
                </p>
                {section.bulletPoints && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {section.bulletPoints.map((point) => (
                      <span
                        key={point}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reader experience</CardTitle>
            <CardDescription>
              Public users can move from journal information into current issues,
              archives, repository browsing, and downloads without registration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">
              This content stays editable from the admin area without changing
              website code.
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">
              The page design follows the project direction: clean, readable,
              responsive, and easy to extend.
            </div>
          </CardContent>
        </Card>
      </div>

      {slug === 'about-research-unit' && (
        <div className="grid gap-6 md:grid-cols-3">
          {Object.values(siteContentState.data.leadership).map((profile) => (
            <Card key={profile.id} className="p-5 text-center">
              <img
                alt={profile.name}
                className="aspect-[4/3] w-full rounded-2xl object-cover object-top shadow-sm"
                src={profile.imageUrl}
              />
              <CardHeader className="px-0 pb-4 pt-5">
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <CardDescription>{profile.title}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0 text-sm leading-7 text-muted-foreground">
                {profile.summary}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {slug === 'editorial-board' && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {siteContentState.data.editorialBoardMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <img
                  alt={member.name}
                  className="h-56 w-full rounded-3xl object-cover"
                  src={member.imageUrl}
                />
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription>
                  {member.role}
                  {' '}· {member.affiliation}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">
                {member.summary}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
