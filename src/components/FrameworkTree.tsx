import { Link } from 'react-router-dom'
import type { CNode, CoreFramework, OtherFramework } from '../content/frameworkTrees'
import { DRIVERS } from '../content/frameworkTrees'

const BOX = ['bg-ink text-white font-semibold', 'bg-teal text-white font-semibold', 'bg-white text-ink border border-teal', 'bg-white text-ink border border-line']

function Box({ text, level, note, below }: { text: string; level: number; note?: string; below?: boolean }) {
  return (
    <div className={`flex gap-2 ${below ? 'w-44 flex-col items-start' : 'items-center'}`}>
      <div className={`rounded-md px-3 py-2 text-[13.5px] leading-snug shadow-[0_1px_0_rgba(20,33,61,.08)] ${BOX[Math.min(level, 3)]} ${level === 0 ? 'w-36' : level === 1 ? 'w-44' : 'w-40'}`}>{text}</div>
      {note && <div className="max-w-44 rounded-md bg-marker-l px-2.5 py-1.5 text-[12.5px] leading-snug text-ink-2">{note}</div>}
    </div>
  )
}

function HNode({ n, level, depth }: { n: CNode; level: number; depth: number }) {
  const kids = level < depth ? n.c : undefined
  return (
    <div className="htree-node">
      <Box text={n.t} level={level} note={level <= depth ? n.note : undefined} below={!!(kids && kids.length)} />
      {kids && kids.length > 0 && (
        <div className="htree-kids">{kids.map((k) => <div key={k.t} className="htree-kid"><HNode n={k} level={level + 1} depth={depth} /></div>)}</div>
      )}
    </div>
  )
}

function Outline({ n, level, depth }: { n: CNode; level: number; depth: number }) {
  return (
    <li>
      <div className={`inline-block rounded-md px-2.5 py-1.5 text-[14px] ${BOX[Math.min(level, 3)]}`}>{n.t}</div>
      {n.note && <div className="mt-0.5 text-[12.5px] text-muted">{n.note}</div>}
      {level < depth && n.c && <ul className="mt-1.5 ml-3 space-y-1.5 border-l-[1.5px] border-[#9AA6B8] pl-3">{n.c.map((k) => <Outline key={k.t} n={k} level={level + 1} depth={depth} />)}</ul>}
    </li>
  )
}

/** The tree, left to right on wide screens and as an indented outline on phones. depth 1 shows the first level only. */
export function IssueTree({ f, depth = 9 }: { f: CoreFramework; depth?: number }) {
  const root: CNode = { t: f.title, c: f.branches }
  return (
    <div className="graph-paper rounded-xl border border-line p-4 sm:p-5">
      {f.example && depth > 1 && <p className="mb-2 text-[12.5px] font-medium text-muted">{f.example}</p>}
      <div className="hidden overflow-x-auto md:block"><div className="w-max py-1"><HNode n={root} level={0} depth={depth} /></div></div>
      <ul className="md:hidden"><Outline n={root} level={0} depth={depth} /></ul>
    </div>
  )
}

export function CoreBlock({ f, n }: { f: CoreFramework; n: number }) {
  return (
    <section id={f.id} className="scroll-mt-32">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3">
        <span className="font-serif text-[15px] font-semibold text-teal-d">{String(n).padStart(2, '0')}</span>
        <h3 className="text-[24px] font-semibold">{f.title}</h3>
      </div>
      <p className="mb-3 text-[15px] text-ink-2"><span className="text-muted">Use it when:</span> {f.when} <span className="font-medium text-violet-d">Ask first:</span> "{f.ask}"</p>
      <IssueTree f={f} />
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-3xl flex-1 rounded-lg bg-teal-l/60 px-4 py-2.5 text-[14.5px] text-ink"><b className="font-semibold text-teal-d">Make it yours: </b>{f.tip}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[14px] font-medium">
          {f.practice.map((p) => <Link key={p.to} to={p.to} className="text-violet-d hover:underline">Practise: {p.label}</Link>)}
        </div>
      </div>
    </section>
  )
}

export function DriversGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {DRIVERS.map((d) => (
        <div key={d.head} className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="bg-ink px-3 py-1.5 text-[14px] font-semibold text-white">{d.head}</div>
          <ul className="space-y-0.5 px-3 py-2 text-[14px] text-ink-2">{d.c.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  )
}

export function OtherCard({ f }: { f: OtherFramework }) {
  return (
    <section id={f.id} className="min-w-0 scroll-mt-32 rounded-xl border border-line bg-white p-5">
      <h3 className="text-[19px] font-semibold">{f.title}</h3>
      <p className="mt-0.5 mb-3 text-[14px] text-muted">{f.when}</p>
      {f.kind === 'groups' && (
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {f.groups.map((g) => (
            <div key={g.head} className="rounded-lg border border-teal/50 bg-teal-l/30 px-3 py-2">
              <div className="text-[14px] font-semibold text-ink">{g.head}</div>
              <ul className="mt-0.5 space-y-0.5 text-[13.5px] text-ink-2">{g.c.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      )}
      {f.kind === 'chips' && <ul className="flex flex-wrap gap-2">{f.c.map((s) => <li key={s} className="rounded-full border border-teal bg-white px-3 py-1.5 text-[14px] text-ink">{s}</li>)}</ul>}
      {f.kind === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-[14px]">
            <thead><tr className="border-b border-line text-[12.5px] text-muted">{f.cols.map((c) => <th key={c} className="py-1.5 pr-3 font-medium">{c}</th>)}</tr></thead>
            <tbody>{f.rows.map((r) => <tr key={r[0]} className="border-b border-line last:border-0">{r.map((c, i) => <td key={i} className={`py-2 pr-3 ${i === 0 ? 'font-semibold text-ink' : 'text-ink-2'}`}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      {f.kind === 'matrix' && (
        <div className="max-w-2xl">
          <div className="grid grid-cols-[22px_minmax(0,1fr)_minmax(0,1fr)] gap-2">
            <div />
            {f.x.map((x) => <div key={x} className="text-center text-[12.5px] font-semibold text-muted">{x}</div>)}
            {[0, 1].map((r) => (
              <div key={r} className="contents">
                <div className="flex items-center justify-center"><span className="-rotate-90 whitespace-nowrap text-[12.5px] font-semibold text-muted">{f.y[r]}</span></div>
                {[0, 1].map((c) => {
                  const cell = f.cells[r * 2 + c], risk = r + c
                  return (
                    <div key={c} className={`rounded-lg border p-3 ${risk === 0 ? 'border-teal' : risk === 1 ? 'border-violet/50' : 'border-signal/60'}`}>
                      <div className="flex items-baseline gap-2"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white ${risk === 0 ? 'bg-teal' : risk === 1 ? 'bg-violet' : 'bg-signal'}`}>{cell.tag}</span><span className="text-[14px] font-semibold text-ink">{cell.title}</span></div>
                      <p className="mt-1 pl-8 text-[13px] text-ink-2">{cell.c.join('; ')}</p>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[13.5px] text-muted">{f.note}</p>
        </div>
      )}
    </section>
  )
}

/** Compact first-level view of all core frameworks, for the structuring lesson. */
export function CoreFrameworksMini({ items }: { items: CoreFramework[] }) {
  return (
    <ol className="grid gap-3 lg:grid-cols-2">
      {items.map((f, i) => (
        <li key={f.id} className="rounded-xl border border-line bg-white p-3">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-[14px] font-semibold text-ink"><span className="mr-1.5 text-teal-d">{i + 1}</span>{f.title}</span>
            <Link to={`/frameworks#${f.id}`} className="shrink-0 text-[13px] font-medium text-violet-d hover:underline">Full tree</Link>
          </div>
          <ul className="space-y-1 pl-1">
            {f.branches.map((b) => (
              <li key={b.t} className="text-[13.5px] text-ink-2">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-sm bg-teal align-middle" />{b.t}
                {b.c && <span className="text-muted">: {b.c.map((c) => c.t).join(', ')}</span>}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
