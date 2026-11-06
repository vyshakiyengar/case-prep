import type { CaseDef, Exhibit } from '../content'

export function ExhibitView({ ex }: { ex: Exhibit }) {
  return (
    <figure className="my-4 rounded-lg border border-line bg-white p-4">
      {ex.title && <figcaption className="mb-2 font-serif text-[16px] font-semibold text-ink">{ex.title}</figcaption>}
      {ex.kind === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[14px] tabular-nums">
            <thead>
              <tr className="bg-ink text-white">
                {ex.headers.map((h, i) => <th key={i} className={`px-3 py-2 font-medium ${ex.align[i] === 'r' ? 'text-right' : 'text-left'}`}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {ex.rows.map((r, ri) => (
                <tr key={ri} className={`border-b border-line ${ex.boldLast && ri === ex.rows.length - 1 ? 'bg-canvas font-semibold text-ink' : ''}`}>
                  {r.map((c, ci) => <td key={ci} className={`px-3 py-2 ${ex.align[ci] === 'r' ? 'text-right' : ''}`}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart mx-auto max-w-2xl" dangerouslySetInnerHTML={{ __html: ex.svg }} />
      )}
      {ex.note && <p className="mt-2 text-[13px] text-muted italic">{ex.note}</p>}
    </figure>
  )
}

export function StructureTree({ s }: { s: CaseDef['structure'] }) {
  return (
    <div className="graph-paper rounded-xl border border-line p-4 sm:p-5">
      <div className="mx-auto w-fit max-w-full rounded-lg bg-ink px-4 py-2 text-center text-[14.5px] font-semibold text-white">{s.root}</div>
      <div className="mx-auto h-4 w-px bg-faint" />
      <div className="grid gap-3 border-t-2 border-faint pt-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(170px, 1fr))` }}>
        {s.branches.map((b) => (
          <div key={b.head} className="overflow-hidden rounded-lg border border-teal bg-white">
            <div className="bg-teal px-3 py-1.5 text-[14px] font-semibold text-white">{b.head}</div>
            <ul className="list-disc px-3 py-2 pl-7 text-[13.5px] text-ink-2">{b.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Rich({ html }: { html: string }) {
  return <div className="rich text-[15px]" dangerouslySetInnerHTML={{ __html: html }} />
}
