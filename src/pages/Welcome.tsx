import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { addDays, todayIso } from '../lib/dates'
import { Button, Field, inputCls, Logo } from '../components/ui'

export default function Welcome() {
  const { data, user, saveProfile } = useStore()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')
  const [name, setName] = useState((n => n === 'You' ? '' : n)(data?.profile?.name || user?.name || ''))
  const [start, setStart] = useState(data?.profile?.startDate || todayIso())
  const [iv, setIv] = useState(data?.profile?.interviewDate || addDays(todayIso(), 42))
  const [saving, setSaving] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    await saveProfile({ name: name.trim() || 'You', startDate: start, interviewDate: iv || undefined })
    nav(next && next.startsWith('/') ? next : '/home', { replace: true })
  }
  return (
    <div className="graph-paper flex min-h-screen items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-[0_18px_40px_-24px_rgba(20,33,61,.35)]">
        <Logo />
        <h1 className="mt-6 text-[28px] font-semibold">Set up your prep</h1>
        <p className="mt-1 text-muted">Two dates are all it needs. You can change them later in Settings.</p>
        <div className="mt-6 space-y-4">
          <Field label="Your name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required /></Field>
          <Field label="Prep start date" hint="Day 1 of your tracker"><input type="date" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} required /></Field>
          <Field label="Interview date" hint="Leave blank if you don't know yet"><input type="date" className={inputCls} value={iv} onChange={(e) => setIv(e.target.value)} /></Field>
        </div>
        <Button type="submit" className="mt-7 w-full py-3" disabled={saving}>{saving ? 'Saving…' : 'Start my prep'}</Button>
      </form>
    </div>
  )
}
