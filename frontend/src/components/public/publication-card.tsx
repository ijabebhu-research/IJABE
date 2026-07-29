import { ArrowUpRight, FileDown } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Publication } from '@/lib/public-content'

type PublicationCardProps = {
  publication: Publication
}

export function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{publication.category}</Badge>
          {publication.keywords.slice(0, 2).map((keyword) => (
            <Badge key={keyword} variant="outline">
              {keyword}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-2xl">{publication.title}</CardTitle>
        <CardDescription className="text-sm">
          {publication.authors.join(', ')}
        </CardDescription>
        <NavLink
          className="w-fit text-sm font-medium text-primary underline-offset-4 hover:underline"
          to={`/issues/${publication.issueSlug}`}
        >
          IJABE - {publication.issueTitle ?? 'View issue'}
        </NavLink>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
          {publication.abstract}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="secondary">
            <NavLink to={`/research-repository/${publication.slug}`}>
              Read more
              <ArrowUpRight className="size-4" />
            </NavLink>
          </Button>
          {publication.pdfUrl && (
            <Button asChild>
              <a href={publication.pdfUrl}>
                Download
                <FileDown className="size-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
