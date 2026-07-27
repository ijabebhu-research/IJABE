import { ArrowRight, BookOpenText, CalendarDays, Newspaper } from 'lucide-react'
import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'

import { DataStatus } from '@/components/public/data-status'
import { PublicationCard } from '@/components/public/publication-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getPublicSiteContent, getPublications } from '@/lib/api/public-api'
import { fallbackPublications, fallbackSiteContent } from '@/lib/public-content'

export function HomePage() {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)
  const publicationsState = usePublicResource(getPublications, fallbackPublications)
  const publications = useMemo(() => publicationsState.data.slice(0, 2), [publicationsState.data])
  const news = useMemo(() => siteContentState.data.news.slice(0, 2), [siteContentState.data.news])

  return (
    <div className="space-y-14 pb-6">
      <DataStatus isFallback={siteContentState.isFallback || publicationsState.isFallback} isLoading={siteContentState.isLoading || publicationsState.isLoading} />

      <section className="space-y-5">
        <div className="max-w-3xl space-y-3">
          <Badge>International Journal of Accounting, Business Admin, &amp; Entrepreneurship</Badge>
          <h1 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">Knowledge that serves scholarship, enterprise, and society.</h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">IJABE is a Bingham University, Karu publication platform for accessible research, trusted news, and academic opportunities.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(siteContentState.data.leadership).map((leader) => (
            <Card key={leader.id} className="border-primary/10 p-5 text-center shadow-sm">
              <img
                alt={leader.name}
                className="aspect-[4/3] w-full rounded-2xl object-cover object-top shadow-sm"
                src={leader.imageUrl}
              />
              <CardHeader className="px-0 pb-0 pt-5">
                <CardTitle className="text-xl">{leader.name}</CardTitle>
                <CardDescription className="leading-6">{leader.title}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[28px] bg-[#f2f6f2] p-6 md:grid-cols-[1.2fr_0.8fr] md:p-9">
        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">About IJABE</p><h2 className="mt-3 font-serif text-3xl">A simple home for scholarly work.</h2><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Read research online, download publications, follow IJABE and Bingham University updates, and apply when a conference is open.</p></div>
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1"><Button asChild variant="secondary"><NavLink to="/research-repository"><BookOpenText className="size-4" /> Publications</NavLink></Button><Button asChild variant="secondary"><NavLink to="/news"><Newspaper className="size-4" /> Latest news</NavLink></Button><Button asChild variant="secondary"><NavLink to="/events"><CalendarDays className="size-4" /> Conferences</NavLink></Button></div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Publications</p><h2 className="font-serif text-3xl">Recent research</h2></div><Button asChild variant="ghost"><NavLink to="/research-repository">View all <ArrowRight className="size-4" /></NavLink></Button></div><div className="grid gap-5">{publications.map((publication) => <PublicationCard key={publication.slug} publication={publication} />)}</div></div>
        <div className="space-y-5"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">News</p><h2 className="font-serif text-3xl">Latest updates</h2></div>{news.map((item) => <Card key={item.slug}><CardHeader><Badge className="w-fit" variant="secondary">{item.category}</Badge><CardTitle className="text-xl">{item.title}</CardTitle><CardDescription>{item.excerpt}</CardDescription></CardHeader></Card>)}<Button asChild variant="ghost"><NavLink to="/news">All news <ArrowRight className="size-4" /></NavLink></Button></div>
      </section>
    </div>
  )
}
