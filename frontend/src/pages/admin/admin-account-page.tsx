import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, ShieldCheck, UserRound } from 'lucide-react'

import { useAdmin } from '@/components/admin/use-admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function AdminAccountPage() {
  const { updateAccount, user } = useAdmin()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setEmail(user.email)
    }
  }, [user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (newPassword && newPassword !== confirmPassword) {
      setError('The new password and confirmation do not match.')
      return
    }

    setIsSaving(true)
    try {
      const { signedOut } = await updateAccount({
        firstName,
        lastName,
        email,
        currentPassword,
        ...(newPassword ? { newPassword } : {}),
      })

      if (signedOut) {
        navigate('/admin/login', {
          replace: true,
          state: { accountMessage: 'Your sign-in details changed. Please sign in with the new details.' },
        })
        return
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess('Administrator details updated successfully.')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to update administrator details.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#154734]">Account security</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Administrator account</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Use this page when an administrator changes, or whenever sign-in details need to be updated.</p>
      </div>

      <Card className="max-w-3xl border-[#154734]/15">
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#e7f0e8] text-[#154734]"><UserRound className="size-5" /></div>
          <CardTitle className="mt-4">Update sign-in details</CardTitle>
          <CardDescription>Confirm the current password to save any change. Changing the email or password signs out every existing session.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-800">First name<Input required value={firstName} onChange={(event) => setFirstName(event.target.value)} /></label>
              <label className="space-y-2 text-sm font-medium text-slate-800">Last name<Input required value={lastName} onChange={(event) => setLastName(event.target.value)} /></label>
            </div>
            <label className="block space-y-2 text-sm font-medium text-slate-800">Sign-in email<Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <div className="rounded-2xl border border-[#154734]/10 bg-[#f7f5ef] p-4">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#154734]" /><p className="text-sm leading-6 text-slate-700">For a handover, enter the new administrator's name and email, then set a new password. The previous sign-in details will stop working.</p></div>
            </div>
            <label className="block space-y-2 text-sm font-medium text-slate-800">Current password<Input required minLength={8} type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-800">New password <span className="font-normal text-slate-500">(optional)</span><Input minLength={8} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
              <label className="space-y-2 text-sm font-medium text-slate-800">Confirm new password<Input minLength={8} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
            </div>
            {error && <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
            {success && <p className="rounded-2xl border border-[#154734]/20 bg-[#e7f0e8] px-4 py-3 text-sm text-[#154734]">{success}</p>}
            <Button disabled={isSaving} type="submit"><KeyRound className="size-4" />{isSaving ? 'Saving...' : 'Save administrator details'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
