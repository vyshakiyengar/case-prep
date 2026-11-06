import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import type { Summary } from '../lib/types'
import { caseOverall, last7, weakestStage } from '../lib/stats'
import { Avatar, Button, Empty, PageHeader, Section } from '../components/ui'

function PartnerCard({ s, you = false, onRemove }: { s: Summary; you?: boolean; onRemove?: () => void }) {
  return (
    <div className={`rounded-xl border bg-white p-5 ${you ? 'border-ink' : 'border-line'}`}>
      <div className="flex items-center gap-3">
        <Avatar name={s.name} photo={s.photoURL} size={40} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-serif text-[19px] font-semibold text-ink">{s.name}{you && <span className="ml-2 font-sans text-[13px] font-normal text-muted">you</span>}</div>
          <div className="text-[12.5px] text-muted">Updated {new Date(s.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
        </div>
        {onRemove && <button onClick={onRemove} className="text-[13px] text-muted hover:text-signal-d">Remove</button>}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3">
        <div><dt className="text-[12.5px] text-muted">Last 7 days</dt><dd className="font-serif text-[24px] font-semibold text-ink">{s.weekScore}</dd></div>
        <div><dt className="text-[12.5px] text-muted">Prep days 5+</dt><dd className="font-serif text-[24px] font-semibold text-ink">{s.realPrepDays7}/7</dd></div>
        <div><dt className="text-[12.5px] text-muted">Avg case</dt><dd className="font-serif text-[24px] font-semibold text-ink">{s.avgScore?.toFixed(1) ?? '–'}</dd></div>
      </dl>
      <p className="mt-3 text-[14px] text-ink-2"><span className="text-muted">Cases logged:</span> {s.casesLogged}{s.weakestStage && <>. <span className="text-muted">Working on:</span> {s.weakestStage.toLowerCase()}</>}</p>
      {s.lastFix && <p className="mt-2 rounded bg-marker-l px-2 py-1 text-[13.5px] text-ink">Latest fix: {s.lastFix}</p>}
    </div>
  )
}

export default function Partners() {
  const { backend, user, data, saveProfile } = useStore()
  const [partners, setPartners] = useState<(Summary | { uid: string; pending: true })[] | null>(null)
  const [link, setLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const partnerIds = data!.profile?.partners || []

  useEffect(() => {
    if (!backend || !user) return
    let live = true
    ;(async () => {
      // pick up anyone who accepted one of my invites
      const accepted = await backend.acceptedInvites(user.uid).catch(() => [])
      const ids = new Set(partnerIds)
      const fresh = accepted.map((i) => i.acceptedBy!).filter((id) => id && id !== user.uid && !ids.has(id))
      if (fresh.length) { await saveProfile({ partners: [...partnerIds, ...fresh] }); return }
      const sums = await Promise.all(partnerIds.map(async (id) => (await backend.getSummary(id)) || { uid: id, pending: true as const }))
      if (live) setPartners(sums)
    })()
    return () => { live = false }
  }, [backend, user, partnerIds.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  if (backend?.mode === 'demo') return (
    <>
      <PageHeader title="Practice partners" />
      <div className="max-w-xl rounded-xl border border-line bg-white p-6">
        <h2 className="text-[20px] font-semibold">Coming with Google sign-in</h2>
        <p className="mt-1 text-ink-2">Inviting a partner needs an account in the cloud, so it switches on together with Google sign-in. Everything else works now, and your progress is saved in this browser.</p>
      </div>
    </>
  )
  const invite = async () => {
    const code = await backend!.createInvite(user!.uid, data!.profile?.name || user!.name)
    setLink(`${window.location.origin}/invite/${code}`)
  }
  const copy = async () => { try { await navigator.clipboard.writeText(link!); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* ignore */ } }
  const remove = (id: string) => { if (confirm('Remove this partner? They will no longer see your weekly summary.')) saveProfile({ partners: partnerIds.filter((p) => p !== id) }) }

  const overall = data!.cases.map(caseOverall).filter((x): x is number => x !== null)
  const l7 = last7(data!.days)
  const me: Summary = {
    uid: user!.uid, name: data!.profile?.name || user!.name, photoURL: user!.photoURL, partners: partnerIds, casesLogged: data!.cases.length,
    avgScore: overall.length ? overall.reduce((a, b) => a + b, 0) / overall.length : null, weakestStage: weakestStage(data!.cases)?.label || null,
    weekScore: l7.total, realPrepDays7: l7.realDays, lastFix: [...data!.cases].sort((a, b) => b.createdAt - a.createdAt)[0]?.fix || null, updatedAt: Date.now(),
  }

  return (
    <>
      <PageHeader title="Practice partners" intro="Prep is easier when someone can see whether you showed up. Partners see each other's weekly summary: scores, cases logged and latest fix. Never the details of your case log."
        action={<Button onClick={invite}>Invite a partner</Button>} />
      {link && (
        <Section title="Send this link to your partner" className="mb-5">
          <div className="flex flex-wrap gap-2">
            <input readOnly value={link} className="min-w-0 flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-[14px]" onFocus={(e) => e.target.select()} />
            <Button variant="secondary" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</Button>
            <a className="inline-flex items-center rounded-lg border border-line bg-white px-4 py-2 text-[14px] font-medium text-ink hover:border-faint"
              href={`https://wa.me/?text=${encodeURIComponent(`Let's keep each other honest on case prep: ${link}`)}`} target="_blank" rel="noreferrer">Share on WhatsApp</a>
          </div>
          <p className="mt-2 text-[13.5px] text-muted">When they sign in and accept, you'll see each other here.</p>
        </Section>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <PartnerCard s={me} you />
        {partners === null ? null : partners.map((p) => 'pending' in p
          ? <div key={p.uid} className="rounded-xl border border-dashed border-line bg-white p-5 text-muted">A partner has joined. Their summary appears after they next open the app.</div>
          : <PartnerCard key={p.uid} s={p} onRemove={() => remove(p.uid)} />)}
      </div>
      {partners !== null && partners.length === 0 && (
        <div className="mt-5"><Empty title="No partners yet" action={<Button onClick={invite}>Create an invite link</Button>}>
          Invite one person you'll practise with this week. Swap interviewer and candidate, and check each other's scores every Sunday.
        </Empty></div>
      )}
    </>
  )
}
