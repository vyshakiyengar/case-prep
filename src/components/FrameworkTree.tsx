import { Link } from 'react-router-dom'
import type { FrameworkTree as FT, TreeNode } from '../content/frameworkTrees'

function Leaf({ n }: { n: TreeNode }) {
  if (typeof n === 'string') return <li className="relative pl-4 text-[13.5px] leading-snug text-ink-2 before:absolute before:top-[0.6em] before:left-0 before:h-px before:w-2.5 before:bg-faint">{n}</li>
  return (
    <li className="relative pl-4 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-teal">
      <span className="text-[13.5px] font-semibold text-ink">{n.t}</span>
      <ul className="mt-1 mb-1.5 ml-1 space-y-1 border-l border-line">{n.c.map((x) => <Leaf key={x} n={x} />)}</ul>
    </li>
  )
}

export function TreeDiagram({ f }: { f: FT }) {
  return (
    <div className="graph-paper overflow-hidden rounded-xl border border-line p-4 sm:p-6">
      <div className="mx-auto w-fit max-w-full rounded-lg bg-ink px-4 py-2.5 text-center text-white">
        <div className="text-[15px] font-semibold">{f.question}</div>
        {f.formula && <div className="mt-0.5 font-serif text-[14px] text-white/80">{f.formula}</div>}
      </div>
      {f.steps && (
        <ol className="mx-auto mt-4 grid max-w-3xl gap-2 sm:grid-cols-3">
          {f.steps.map((s, i) => <li key={s} className="rounded-lg border border-violet/40 bg-white px-3 py-2 text-[13.5px] text-ink"><b className="mr-1 text-violet-d">{i + 1}</b>{s}</li>)}
        </ol>
      )}
      {f.matrix ? (
        <div className="mx-auto mt-5 max-w-3xl">
          <div className="grid grid-cols-[28px_1fr_1fr] gap-2 sm:grid-cols-[36px_1fr_1fr]">
            <div />
            {f.matrix.x.map((x) => <div key={x} className="text-center text-[12.5px] font-semibold text-muted">{x}</div>)}
            {[0, 1].map((r) => (
              <div key={r} className="contents">
                <div className="flex items-center justify-center"><span className="-rotate-90 whitespace-nowrap text-[12.5px] font-semibold text-muted">{f.matrix!.y[r]}</span></div>
                {[0, 1].map((c) => {
                  const cell = f.matrix!.cells[r * 2 + c]
                  const risk = r + c
                  return (
                    <div key={c} className={`rounded-lg border bg-white p-3 ${risk === 0 ? 'border-teal' : risk === 1 ? 'border-violet/50' : 'border-signal/60'}`}>
                      <div className="flex items-baseline gap-2"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white ${risk === 0 ? 'bg-teal' : risk === 1 ? 'bg-violet' : 'bg-signal'}`}>{cell.tag}</span><span className="text-[14px] font-semibold text-ink">{cell.title}</span></div>
                      <ul className="mt-1.5 space-y-0.5 pl-8 text-[13px] text-ink-2">{cell.c.map((x) => <li key={x} className="list-disc">{x}</li>)}</ul>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[13.5px] text-muted">{f.matrix.note}</p>
        </div>
      ) : (
        <>
          <div className="mx-auto h-5 w-px bg-ink/40" />
          <div className="grid gap-3 border-t-2 border-ink/30 pt-0" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))' }}>
            {f.branches.map((b) => (
              <div key={b.head} className="flex flex-col items-center">
                <div className="h-4 w-px bg-ink/30" />
                <div className="w-full overflow-hidden rounded-lg border border-teal bg-white">
                  <div className="bg-teal px-3 py-2 text-[14px] font-semibold text-white">{b.head}</div>
                  <ul className="space-y-1.5 px-3 py-3">{b.c.map((n) => <Leaf key={typeof n === 'string' ? n : n.t} n={n} />)}</ul>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function FrameworkBlock({ f, n }: { f: FT; n: number }) {
  return (
    <section id={f.id} className="scroll-mt-32">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
        <span className="font-serif text-[15px] font-semibold text-teal-d">{String(n).padStart(2, '0')}</span>
        <h2 className="text-[26px] font-semibold">{f.title}</h2>
      </div>
      <p className="mb-3 text-[15px] text-ink-2"><span className="font-medium text-violet-d">Ask first:</span> "{f.ask}"</p>
      <TreeDiagram f={f} />
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <p className="rounded-lg bg-teal-l/60 px-4 py-3 text-[14.5px] text-ink"><b className="font-semibold text-teal-d">Make it yours: </b>{f.tip}</p>
        <p className="rounded-lg bg-signal-l px-4 py-3 text-[14.5px] text-signal-d"><b className="font-semibold">Trap: </b>{f.trap}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14px] font-medium">
        {f.practice.map((p) => <Link key={p.to} to={p.to} className="text-violet-d hover:underline">Practise: {p.label} →</Link>)}
      </div>
    </section>
  )
}
