import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { AuthError, resetDemo } from '../lib/backend'
import { Button, Field, inputCls, PageHeader, Section } from '../components/ui'
import { useIsAdmin } from '../lib/admin'

export default function Settings() {
  const { data, user, saveProfile, signOut, backend } = useStore()
  const [delMsg, setDelMsg] = useState('')
  const [deleting, setDeleting] = useState(false)
  const p = data!.profile!
  const [name, setName] = useState(p.name)
  const [start, setStart] = useState(p.startDate || '')
  const [iv, setIv] = useState(p.interviewDate || '')
  const [saved, setSaved] = useState(false)
  const isAdmin = useIsAdmin()
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); await saveProfile({ name, startDate: start, interviewDate: iv || undefined }); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }
  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'prepforcase-my-data.json'; a.click()
  }
  const deleteAccount = async () => {
    if (!backend || !confirm('Delete your account and everything you have saved? This cannot be undone.')) return
    setDeleting(true); setDelMsg('')
    try { await backend.deleteAccount(); location.href = '/' }
    catch (e) { setDelMsg(e instanceof AuthError ? e.message : "Couldn't delete everything. Check your connection and try again.") }
    finally { setDeleting(false) }
  }
  const how = user?.provider === 'password' ? 'with your school email' : user?.provider === 'google' ? 'with Google' : ''
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Section title="Your prep">
          <form onSubmit={save} className="space-y-4">
            <Field label="Name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Prep start date"><input type="date" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} required /></Field>
            <Field label="Interview date"><input type="date" className={inputCls} value={iv} onChange={(e) => setIv(e.target.value)} /></Field>
            <Button type="submit">{saved ? 'Saved' : 'Save changes'}</Button>
          </form>
        </Section>
        <div className="space-y-5">
          <Section title="Account">
            <p className="text-ink-2">{backend?.mode === 'demo' ? 'Your progress is saved in this browser on this device.' : `Signed in as ${user?.email || user?.name} ${how}.`}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={download}>Download my data</Button>
              <Button variant="secondary" onClick={signOut}>Sign out</Button>
              {backend?.mode === 'demo' && <Button variant="danger" onClick={() => { if (confirm('Delete all progress saved in this browser?')) { resetDemo(); location.href = '/' } }}>Clear my progress</Button>}
            </div>
            {backend?.mode === 'firebase' && (
              <div className="mt-5 border-t border-line pt-4">
                <button onClick={deleteAccount} disabled={deleting} className="text-[14px] font-medium text-signal-d hover:underline disabled:opacity-50">{deleting ? 'Deleting…' : 'Delete my account and data'}</button>
                {delMsg && <p role="alert" className="mt-2 text-[13.5px] text-signal-d">{delMsg}</p>}
              </div>
            )}
          </Section>
          <Section title="More">
            <ul className="space-y-2 text-[14.5px]">
              <li><Link className="font-medium text-violet-d hover:underline" to="/perks">Student perks</Link> <span className="text-muted">Verify your business school email</span></li>
              <li><Link className="font-medium text-violet-d hover:underline" to="/partners">Practice partners</Link></li>
              <li><Link className="font-medium text-violet-d hover:underline" to="/stories">Fit stories</Link></li>
              <li><Link className="font-medium text-violet-d hover:underline" to="/privacy">Privacy notice</Link></li>
              {isAdmin && <li><Link className="font-medium text-signal-d hover:underline" to="/admin">Admin: students and perks</Link></li>}
            </ul>
          </Section>
        </div>
      </div>
    </>
  )
}
