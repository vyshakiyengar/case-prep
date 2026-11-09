import { ArtCaseLog } from '../components/Art'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import type { CaseEntry } from '../lib/types'
import { CASE_TYPES, STAGES } from '../lib/types'
import { fmtShort, todayIso, uid } from '../lib/dates'
import { byDate, caseOverall } from '../lib/stats'
import { Button, Empty, Field, inputCls, PageHeader, ScoreChip, ScorePicker } from '../components/ui'

const SHORT_STAGE: Record<string, string> = { clarify: 'Clarify', structure: 'Structure', maths: 'Maths', leadership: 'Leading', reco: 'Reco', comms: 'Comms' }

export function CaseForm({ initial, onDone }: { initial?: Partial<CaseEntry>; onDone: () => void }) {
  const { saveCase, deleteCase, data } = useStore()
  const [c, setC] = useState<CaseEntry>({
    id: uid(), date: todayIso(), name: '', source: '', type: 'Profitability', with: 'Partner', scores: {}, mistake: '', fix: '', fixed: '', createdAt: Date.now(),
    ...initial,
  } as CaseEntry)
  const set = <K extends keyof CaseEntry>(k: K, v: CaseEntry[K]) => setC((x) => ({ ...x, [k]: v }))
  // The fix from the most recent earlier case, so the student can say whether it stuck
  const previousFix = byDate((data?.cases ?? []).filter((x) => x.id !== c.id && x.fix.trim() && (x.date < c.date || (x.date === c.date && x.createdAt < c.createdAt)))).pop()?.fix
  const missing = STAGES.filter((s) => !c.scores[s.key]).length
  const submit = async (e: React.FormEvent) => { e.preventDefault(); await saveCase(c); onDone() }
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Case name"><input className={inputCls} value={c.name} onChange={(e) => set('name', e.target.value)} required placeholder="e.g. Coastal Brew" /></Field>
        <Field label="Date"><input type="date" className={inputCls} value={c.date} onChange={(e) => set('date', e.target.value)} required /></Field>
        <Field label="Case type">
          <select className={inputCls} value={c.type} onChange={(e) => set('type', e.target.value)}>{CASE_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
        <Field label="Done with">
          <div className="inline-flex overflow-hidden rounded-lg border border-line">
            {(['Self', 'Partner', 'Expert'] as const).map((w) => (
              <button type="button" key={w} onClick={() => set('with', w)} aria-pressed={c.with === w}
                className={`border-r border-line px-4 py-2 text-[14px] last:border-r-0 ${c.with === w ? 'bg-ink font-medium text-white' : 'bg-white text-muted hover:bg-canvas'}`}>{w}</button>
            ))}
          </div>
        </Field>
        <Field label="Source" hint="Optional: casebook, firm, or interviewer"><input className={inputCls} value={c.source} onChange={(e) => set('source', e.target.value)} placeholder="e.g. Casebook #1" /></Field>
      </div>

      <fieldset>
        <legend className="text-[14.5px] font-semibold text-ink">Score each stage</legend>
        <p className="text-[13px] text-muted">1 = lost, 3 = solid, 5 = offer-level. Be strict with yourself: a generous log teaches you nothing.</p>
        <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
          {STAGES.map((s) => (
            <li key={s.key} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 sm:flex-nowrap">
              <div className="min-w-0 max-w-md">
                <div className="text-[14.5px] font-medium text-ink">{s.label}</div>
                <div className="text-[12.5px] text-muted">{s.great}</div>
              </div>
              <ScorePicker label={s.label} value={c.scores[s.key]} onChange={(v) => set('scores', { ...c.scores, [s.key]: v })} />
            </li>
          ))}
        </ul>
      </fieldset>

      <Field label="Biggest mistake" hint="What actually happened? Be specific.">
        <textarea className={inputCls} rows={2} value={c.mistake} onChange={(e) => set('mistake', e.target.value)} placeholder="e.g. Did the maths silently, so the interviewer couldn't follow" />
      </Field>
      <Field label="The one fix for your next case" hint="One change you will make. Just one.">
        <input className={`${inputCls} bg-marker-l`} value={c.fix} onChange={(e) => set('fix', e.target.value)} placeholder="e.g. Talk every calculation out loud" />
      </Field>
      {previousFix && (
        <Field label="Did the fix from your last case stick?" hint={`Last fix: ${previousFix}`}>
          <select className={inputCls} value={c.fixed || ''} onChange={(e) => set('fixed', e.target.value as CaseEntry['fixed'])}>
            <option value="">Not rated yet</option><option>Yes</option><option>Partly</option><option>No</option>
          </select>
        </Field>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <Button type="submit">{initial?.id ? 'Save changes' : 'Save case'}</Button>
        <Button type="button" variant="secondary" onClick={onDone}>Cancel</Button>
        {missing > 0 && <span className="text-[13px] text-muted">{missing} stage{missing === 1 ? '' : 's'} not scored yet</span>}
        {initial?.id && <Button type="button" variant="danger" className="ml-auto" onClick={async () => { if (confirm('Delete this case from your log?')) { await deleteCase(c.id); onDone() } }}>Delete case</Button>}
      </div>
    </form>
  )
}

export function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', k); ref.current?.focus()
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/30" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="h-full w-full max-w-2xl overflow-y-auto bg-white p-5 shadow-2xl outline-none sm:p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[21px] font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-muted hover:bg-canvas">
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function CaseLog() {
  const { data } = useStore()
  const [params, setParams] = useSearchParams()
  const [editing, setEditing] = useState<CaseEntry | 'new' | null>(params.get('new') ? 'new' : null)
  const close = () => { setEditing(null); if (params.get('new')) setParams({}, { replace: true }) }
  const cases = byDate(data!.cases).reverse()
  return (
    <>
      <PageHeader title="Case log" art={<ArtCaseLog />} intro="One entry per case, written straight after it ends. Before your next case, read your last five fixes."
        action={<Button onClick={() => setEditing('new')}>Log a case</Button>} />
      {cases.length === 0 ? (
        <Empty title="No cases logged yet" action={<Button onClick={() => setEditing('new')}>Log your first case</Button>}>
          After every case, score the six stages and write the one thing you'll change next time. That's where the improvement comes from.
        </Empty>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[900px] border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-line text-left text-[12.5px] text-muted">
                <th className="px-4 py-2.5 font-medium">Case</th>
                {STAGES.map((s) => <th key={s.key} className="px-1 py-2.5 text-center font-medium" title={s.label}>{SHORT_STAGE[s.key] ?? s.label.split(' ')[0]}</th>)}
                <th className="px-2 py-2.5 text-center font-medium">Overall</th>
                <th className="px-4 py-2.5 font-medium">The one fix</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} onClick={() => setEditing(c)} className="cursor-pointer border-b border-line last:border-0 hover:bg-canvas/60">
                  <td className="px-4 py-3">
                    <button className="text-left font-medium text-ink hover:underline" onClick={(e) => { e.stopPropagation(); setEditing(c) }}>{c.name}</button>
                    <div className="text-[12.5px] text-muted">{fmtShort(c.date)}, {c.type}, with {c.with.toLowerCase()}</div>
                  </td>
                  {STAGES.map((s) => <td key={s.key} className="px-1 py-3 text-center"><ScoreChip v={c.scores[s.key]} /></td>)}
                  <td className="px-2 py-3 text-center font-serif text-[16px] font-semibold text-ink">{caseOverall(c)?.toFixed(1) ?? '–'}</td>
                  <td className="max-w-[260px] px-4 py-3">
                    {c.fix && <span className="rounded bg-marker-l px-1.5 py-0.5 text-[13.5px] text-ink">{c.fix}</span>}
                    {c.fixed && <div className="mt-1 text-[12px] text-muted">Stuck next time: {c.fixed.toLowerCase()}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <Drawer title={editing === 'new' ? 'Log a case' : 'Edit case'} onClose={close}>
          <CaseForm initial={editing === 'new' ? undefined : editing} onDone={close} />
        </Drawer>
      )}
    </>
  )
}
