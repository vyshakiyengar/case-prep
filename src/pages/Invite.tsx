import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import type { Invite as InviteT } from '../lib/types'
import { Button, Logo } from '../components/ui'

export default function Invite() {
  const { code } = useParams()
  const { backend, user, data, saveProfile } = useStore()
  const nav = useNavigate()
  const [inv, setInv] = useState<InviteT | null | undefined>(undefined)
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (backend && code) backend.getInvite(code).then(setInv).catch(() => setInv(null)) }, [backend, code])
  const accept = async () => {
    if (!inv || !user) return
    setBusy(true)
    await backend!.acceptInvite(inv.code, user.uid, data!.profile?.name || user.name)
    const cur = data!.profile?.partners || []
    if (!cur.includes(inv.from)) await saveProfile({ partners: [...cur, inv.from] })
    nav(data!.profile?.startDate ? '/partners' : '/welcome', { replace: true })
  }
  let body: React.ReactNode
  if (inv === undefined) body = <p className="text-muted">Checking your invite…</p>
  else if (inv === null) body = <><h1 className="text-[26px] font-semibold">This invite link doesn't work</h1><p className="mt-1 text-muted">Ask your partner to create a new one from their Partners page.</p></>
  else if (inv.from === user?.uid) body = <><h1 className="text-[26px] font-semibold">This is your own invite</h1><p className="mt-1 text-muted">Send the link to your practice partner. When they accept, they appear on your Partners page.</p></>
  else if (inv.acceptedBy && inv.acceptedBy !== user?.uid) body = <><h1 className="text-[26px] font-semibold">This invite has already been used</h1><p className="mt-1 text-muted">Ask {inv.fromName} for a new link.</p></>
  else body = (
    <>
      <h1 className="text-[26px] font-semibold">Practise with {inv.fromName}?</h1>
      <p className="mt-1 text-muted">You'll see each other's weekly summary: tracker score, cases logged, average score and latest fix. Your full case log stays private.</p>
      <Button className="mt-6 w-full py-3" onClick={accept} disabled={busy}>{busy ? 'Joining…' : `Become ${inv.fromName.split(' ')[0]}'s practice partner`}</Button>
    </>
  )
  return (
    <div className="graph-paper flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-7">
        <Logo />
        <div className="mt-6">{body}</div>
        <Link to="/today" className="mt-6 inline-block text-[14px] text-muted hover:text-ink">Go to my prep</Link>
      </div>
    </div>
  )
}
