import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type PageIntroProps = {
  eyebrow: string
  title: string
  description: string
}

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <Card className="border-primary/10">
      <CardHeader className="space-y-4">
        <Badge className="w-fit">{eyebrow}</Badge>
        <CardTitle className="page-intro-title max-w-4xl text-3xl sm:text-4xl">{title}</CardTitle>
        <CardDescription className="max-w-3xl text-base">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
