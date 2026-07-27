import { Mail, Trash2, UserRoundCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteApplicant, getApplicants, updateApplicantStatus, type ConferenceApplicant } from '@/lib/api/admin-api'

export function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState<ConferenceApplicant[]>([])
  const [message, setMessage] = useState('')
  const [pendingDeletion, setPendingDeletion] = useState<string | null>(null)

  async function loadApplicants() {
    try { setApplicants(await getApplicants()) } catch { setMessage('Unable to load applications. Please try again.') }
  }

  useEffect(() => { void loadApplicants() }, [])

  async function reply(applicant: ConferenceApplicant) {
    await updateApplicantStatus(applicant.id, 'RESPONDED')
    window.location.href = `mailto:${applicant.email}?subject=${encodeURIComponent(`IJABE conference application: ${applicant.eventTitle}`)}`
    await loadApplicants()
  }

  async function removeApplicant(id: string) {
    await deleteApplicant(id)
    setPendingDeletion(null)
    await loadApplicants()
  }

  return <div className="space-y-6">
    <Card className="border-[#154734]/15 bg-white text-slate-950 shadow-sm"><CardHeader><Badge className="w-fit bg-[#e7f0e8] text-[#154734]">Conference applications</Badge><CardTitle className="text-3xl">Applicants</CardTitle><CardDescription className="text-slate-700">Review applications, then reply through your email application.</CardDescription></CardHeader></Card>
    {message && <p className="text-sm text-red-600">{message}</p>}
    {applicants.length === 0 ? <Card><CardContent className="py-10 text-slate-700">No conference applications yet.</CardContent></Card> : applicants.map((applicant) => <details key={applicant.id} className="group rounded-3xl border border-[#154734]/15 bg-white text-slate-950 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden"><div><p className="font-semibold">{applicant.fullName}</p><p className="mt-1 text-sm text-slate-600">{applicant.eventTitle} · {new Date(applicant.createdAt).toLocaleDateString()}</p></div><span className="rounded-full bg-[#e7f0e8] px-3 py-1 text-xs font-medium text-[#154734] group-open:hidden">View</span><span className="hidden rounded-full border border-[#154734]/25 px-3 py-1 text-xs font-medium text-[#154734] group-open:inline">Close</span></summary><Card className="rounded-t-none border-x-0 border-b-0 shadow-none">
      <CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-xl">{applicant.fullName}</CardTitle><CardDescription className="text-slate-700">{applicant.institution} · {new Date(applicant.createdAt).toLocaleDateString()}</CardDescription></div><Badge variant="secondary">{applicant.status}</Badge></div></CardHeader>
      <CardContent className="space-y-3 text-sm"><p><strong>Conference:</strong> {applicant.eventTitle}</p><p><strong>Email:</strong> {applicant.email}</p>{applicant.phone && <p><strong>Phone:</strong> {applicant.phone}</p>}{applicant.message && <p><strong>Note:</strong> {applicant.message}</p>}<div className="flex flex-wrap gap-3"><Button onClick={() => void updateApplicantStatus(applicant.id, 'REVIEWED').then(loadApplicants)} type="button" variant="secondary"><UserRoundCheck className="size-4" /> Mark reviewed</Button><Button onClick={() => void reply(applicant)} type="button"><Mail className="size-4" /> Reply by email</Button><Button onClick={() => setPendingDeletion(applicant.id)} type="button" variant="ghost"><Trash2 className="size-4" /> Delete</Button></div>{pendingDeletion === applicant.id && <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4"><p className="font-medium text-destructive">Delete this application?</p><p className="mt-1 text-slate-700">This cannot be undone.</p><div className="mt-3 flex gap-3"><Button onClick={() => void removeApplicant(applicant.id)} type="button">Yes, delete</Button><Button onClick={() => setPendingDeletion(null)} type="button" variant="secondary">Keep application</Button></div></div>}</CardContent>
    </Card></details>)}
  </div>
}
