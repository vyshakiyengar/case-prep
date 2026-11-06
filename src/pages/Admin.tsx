import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import type { Perk, StudentRecord } from '../lib/types'
import { uid } from '../lib/dates'
import { Button, Field, inputCls, PageHeader, Section } from '../components/ui'
import { Loading } from '../App'
import { useIsAdmin } from '../lib/admin'


const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

function PerkManager() {
  const { backend } = useStore()
  const [perks, setPerks] = useState<Perk[]>([])
  const blank: Perk = { id: '', title: '', description: '', kind: 'download', url: '', code: '', order: 1 }
  const [p, setP] = useState<Perk>(blank)
  const load = () => backend!.listPerks().then((x) => setPerks(x.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))))
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Section title="Perks" aside={<span className="text-[13.5px] text-muted">Only verified students can see these</span>}>
      <ul className="divide-y divide-line">
        {perks.map((x) => (
          <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <span><b className="font-medium text-ink">{x.title}</b> <span className="text-[13px] text-muted">{x.kind}{x.code ? `, code ${x.code}` : ''}</span></span>
            <span className="flex gap-1">
              <Button variant="quiet" onClick={() => setP(x)}>Edit</Button>
              <Button variant="danger" onClick={async () => { if (confirm(`Delete "${x.title}"?`)) { await backend!.deletePerk(x.id); load() } }}>Delete</Button>
            </span>
          </li>
        ))}
      </ul>
      <form className="mt-4 grid gap-3 rounded-lg border border-line p-4 sm:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); await backend!.savePerk({ ...p, id: p.id || uid() }); setP(blank); load() }}>
        <div className="sm:col-span-2 text-[14.5px] font-semibold text-ink">{p.id ? 'Edit perk' : 'Add a perk'}</div>
        <Field label="Title"><input required className={inputCls} value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} /></Field>
        <Field label="Type"><select className={inputCls} value={p.kind} onChange={(e) => setP({ ...p, kind: e.target.value as Perk['kind'] })}><option value="download">Download</option><option value="code">Discount code</option><option value="link">Link</option></select></Field>
        <div className="sm:col-span-2"><Field label="Description"><input className={inputCls} value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} /></Field></div>
        <Field label="Link" hint="Download file, Payhip product page, etc."><input className={inputCls} value={p.url || ''} onChange={(e) => setP({ ...p, url: e.target.value })} placeholder="https://" /></Field>
        <Field label="Discount code" hint="Only for discount perks"><input className={inputCls} value={p.code || ''} onChange={(e) => setP({ ...p, code: e.target.value })} /></Field>
        <Field label="Order"><input type="number" className={inputCls} value={p.order ?? 1} onChange={(e) => setP({ ...p, order: Number(e.target.value) })} /></Field>
        <div className="flex items-end gap-2"><Button type="submit">{p.id ? 'Save perk' : 'Add perk'}</Button>{p.id && <Button type="button" variant="secondary" onClick={() => setP(blank)}>Cancel</Button>}</div>
      </form>
    </Section>
  )
}

export default function Admin() {
  const { backend } = useStore()
  const isAdmin = useIsAdmin()
  const [rows, setRows] = useState<StudentRecord[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState('')
  useEffect(() => { if (isAdmin && backend) backend.listStudents().then(setRows).catch(() => setErr('The database refused access. Check your email is listed as an admin in firestore.rules and in VITE_ADMIN_EMAILS.')) }, [isAdmin, backend])
  const bySchool = useMemo(() => {
    const m = new Map<string, number>(); (rows || []).forEach((r) => m.set(r.school, (m.get(r.school) || 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [rows])
  if (!isAdmin) return <Navigate to="/today" replace />
  if (err) return <p className="text-signal-d">{err}</p>
  if (!rows) return <Loading />
  const shown = rows.filter((r) => !q || `${r.name} ${r.school} ${r.schoolEmail} ${r.program}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.verifiedAt - a.verifiedAt)
  const exportCsv = () => {
    const head = ['Name', 'School email', 'Google email', 'School', 'Known school', 'Programme', 'Graduation year', 'Marketing consent', 'Verified at']
    const lines = rows.map((r) => [r.name, r.schoolEmail, r.googleEmail, r.school, r.knownSchool ? 'yes' : 'no', r.program, r.gradYear, r.marketing ? 'yes' : 'no', new Date(r.verifiedAt).toISOString()].map(csvCell).join(','))
    const blob = new Blob([[head.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `case-prep-os-students-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
  }
  const optIn = rows.filter((r) => r.marketing).length
  return (
    <>
      <PageHeader title="Admin" intro="Verified business school students. Only email people who ticked the marketing box." action={<Button onClick={exportCsv}>Export CSV</Button>} />
      <dl className="mb-6 flex flex-wrap gap-x-10 gap-y-3">
        <div><dt className="text-[13px] text-muted">Verified students</dt><dd className="font-serif text-[30px] font-semibold text-ink">{rows.length}</dd></div>
        <div><dt className="text-[13px] text-muted">Agreed to marketing</dt><dd className="font-serif text-[30px] font-semibold text-ink">{optIn}</dd></div>
        <div><dt className="text-[13px] text-muted">Schools</dt><dd className="font-serif text-[30px] font-semibold text-ink">{bySchool.length}</dd></div>
      </dl>
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <Section title="By school">
          <ul className="space-y-2">{bySchool.map(([s, n]) => (
            <li key={s} className="grid grid-cols-[1fr_auto] items-center gap-3">
              <span className="text-[14px] text-ink">{s}</span><span className="text-[14px] font-semibold tabular-nums">{n}</span>
              <div className="col-span-2 h-1.5 rounded-full bg-canvas"><div className="h-full rounded-full bg-teal" style={{ width: `${(n / bySchool[0][1]) * 100}%` }} /></div>
            </li>))}
          </ul>
        </Section>
        <Section title="Students" aside={<input className={`${inputCls} max-w-56 py-1.5`} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-[14px]">
              <thead><tr className="border-b border-line text-left text-[12.5px] text-muted"><th className="py-2 font-medium">Name</th><th className="font-medium">School</th><th className="font-medium">Programme</th><th className="font-medium">School email</th><th className="font-medium">Marketing</th></tr></thead>
              <tbody>{shown.map((r) => (
                <tr key={r.uid} className="border-b border-line last:border-0">
                  <td className="py-2 text-ink">{r.name}</td><td>{r.school}{!r.knownSchool && <span className="ml-1 text-[12px] text-signal-d">check</span>}</td>
                  <td>{r.program} {r.gradYear}</td><td className="text-muted">{r.schoolEmail}</td><td>{r.marketing ? 'Yes' : 'No'}</td>
                </tr>))}</tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-muted">"Check" marks a domain that isn't on the known business school list. It was verified as a real inbox, but may not be a business school.</p>
        </Section>
      </div>
      <div className="mt-5"><PerkManager /></div>
    </>
  )
}
