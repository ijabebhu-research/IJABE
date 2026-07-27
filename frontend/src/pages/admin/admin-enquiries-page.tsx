import { Mail, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteEnquiry, getEnquiries, type ContactInquiry } from '@/lib/api/admin-api'

export function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ContactInquiry[]>([])
  const [message, setMessage] = useState('')
  const [pendingDeletion, setPendingDeletion] = useState<string | null>(null)

  async function loadEnquiries() {
    try { setEnquiries(await getEnquiries()) } catch { setMessage('Unable to load enquiries. Please try again.') }
  }

  useEffect(() => { void loadEnquiries() }, [])

  async function removeEnquiry(id: string) {
    await deleteEnquiry(id)
    setPendingDeletion(null)
    await loadEnquiries()
  }

  return <div className="space-y-6">
    <Card className="border-[#154734]/15 bg-white text-slate-950 shadow-sm"><CardHeader><Badge className="w-fit bg-[#e7f0e8] text-[#154734]">Public contact form</Badge><CardTitle className="text-3xl">Enquiries</CardTitle><CardDescription className="text-slate-700">Read and reply to messages sent from the public contact page.</CardDescription></CardHeader></Card>
    {message && <p className="text-sm text-red-600">{message}</p>}
    {enquiries.length === 0 ? <Card><CardContent className="py-10 text-slate-700">No enquiries yet.</CardContent></Card> : enquiries.map((enquiry) => <details key={enquiry.id} className="group rounded-3xl border border-[#154734]/15 bg-white text-slate-950 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden"><div><p className="font-semibold">{enquiry.subject}</p><p className="mt-1 text-sm text-slate-600">{enquiry.name} · {new Date(enquiry.createdAt).toLocaleDateString()}</p></div><span className="rounded-full bg-[#e7f0e8] px-3 py-1 text-xs font-medium text-[#154734] group-open:hidden">View</span><span className="hidden rounded-full border border-[#154734]/25 px-3 py-1 text-xs font-medium text-[#154734] group-open:inline">Close</span></summary><Card className="rounded-t-none border-x-0 border-b-0 shadow-none">
      <CardHeader><CardTitle className="text-xl">{enquiry.subject}</CardTitle><CardDescription>{enquiry.name} · {enquiry.email} · {new Date(enquiry.createdAt).toLocaleDateString()}</CardDescription></CardHeader>
      <CardContent className="space-y-4"><p className="whitespace-pre-wrap text-sm leading-6">{enquiry.message}</p><div className="flex flex-wrap gap-3"><Button asChild><a href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${enquiry.subject}`)}`}><Mail className="size-4" /> Reply by email</a></Button><Button onClick={() => setPendingDeletion(enquiry.id)} type="button" variant="ghost"><Trash2 className="size-4" /> Delete</Button></div>{pendingDeletion === enquiry.id && <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4"><p className="font-medium text-destructive">Delete this enquiry?</p><div className="mt-3 flex gap-3"><Button onClick={() => void removeEnquiry(enquiry.id)} type="button">Yes, delete</Button><Button onClick={() => setPendingDeletion(null)} type="button" variant="secondary">Keep enquiry</Button></div></div>}</CardContent>
    </Card></details>)}
  </div>
}
