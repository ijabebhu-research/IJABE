import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAdmin } from '@/components/admin/use-admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthLoading, login, loginError, user } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    '/admin'
  const accountMessage =
    (location.state as { accountMessage?: string } | null)?.accountMessage

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (user && !isAuthLoading) {
    navigate('/admin', { replace: true })
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
      <Card className="border-primary/10 bg-[linear-gradient(135deg,rgba(13,71,161,0.08),rgba(245,248,252,0.98))]">
        <CardHeader className="space-y-4">
          <Badge className="w-fit">Admin Access</Badge>
          <CardTitle className="text-4xl">
            Secure editor access for IJABE content management.
          </CardTitle>
          <CardDescription className="max-w-2xl text-base">
            Sign in to manage publications, news, conferences, images, and contact
            details on the website.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/70 bg-white/75 p-5">
            <LockKeyhole className="size-5 text-primary" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Protected session
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your admin area is protected and available only after sign-in.
            </p>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/75 p-5">
            <ShieldCheck className="size-5 text-primary" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Live content control
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Make changes to the website directly from this admin area.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Administrator sign in</CardTitle>
          <CardDescription>
            Use your administrator account to enter the IJABE admin area.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              aria-label="Email address"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@ijabe.edu"
              type="email"
              value={email}
            />
            <Input
              aria-label="Password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              type="password"
              value={password}
            />
            {loginError && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {loginError}
              </div>
            )}
            {accountMessage && (
              <div className="rounded-2xl border border-[#154734]/20 bg-[#e7f0e8] px-4 py-3 text-sm text-[#154734]">
                {accountMessage}
              </div>
            )}
            <Button className="w-full" disabled={isSubmitting || isAuthLoading} type="submit">
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <Button asChild className="w-full" variant="secondary">
            <NavLink to="/">Return to website</NavLink>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
