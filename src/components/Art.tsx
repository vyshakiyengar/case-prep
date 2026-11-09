import { useId } from 'react'
import type { ReactNode } from 'react'

/*
 * Spot illustrations for PrepForCase. One drawing language throughout: navy outlines on white
 * paper shapes, a patch of graph-paper dots behind each scene (case notes are written on squared
 * paper), and the chart palette for accents. Every drawing is 240 x 160 and decorative.
 */
const N = '#0F1B33', T = '#0E8C96', TL = '#D5EEF0', O = '#C2410C', OL = '#FBE4D8', A = '#B7791F', AL = '#F5E8CC'
const BL = '#3B5BDB', BLL = '#E2E8FB', W = '#FFFFFF', G = '#C9D2DE', SERIF = '"Newsreader Variable", Newsreader, Georgia, serif'
const SANS = '"IBM Plex Sans", system-ui, sans-serif'
const S = { stroke: N, strokeWidth: 1.75, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

function Frame({ children, label, className = '' }: { children: ReactNode; label?: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 240 160" className={`block h-auto w-full ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <pattern id={`d${id}`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1" fill={N} opacity=".16" /></pattern>
      </defs>
      <path d="M34 22c30-14 128-16 168-4 22 7 24 30 22 58-2 34-6 58-38 66-40 10-110 10-142 0C18 134 12 108 14 76c2-28 2-46 20-54z" fill={`url(#d${id})`} />
      {children}
    </svg>
  )
}
const Card = ({ x, y, w, h, r = 6, fill = W, rot = 0 }: { x: number; y: number; w: number; h: number; r?: number; fill?: string; rot?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} {...S} transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined} />
)
const Line = ({ x, y, w, c = G, sw = 3 }: { x: number; y: number; w: number; c?: string; sw?: number }) => <path d={`M${x} ${y}h${w}`} stroke={c} strokeWidth={sw} strokeLinecap="round" />
const Shadow = ({ x, y, w, h, r = 6 }: { x: number; y: number; w: number; h: number; r?: number }) => <rect x={x + 4} y={y + 5} width={w} height={h} rx={r} fill={N} opacity=".1" />
const Check = ({ x, y, c = T }: { x: number; y: number; c?: string }) => <path d={`M${x} ${y}l4 4 8-9`} fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
const Pencil = ({ x, y, rot = -35 }: { x: number; y: number; rot?: number }) => (
  <g transform={`rotate(${rot} ${x} ${y})`}>
    <rect x={x} y={y} width="58" height="10" rx="2" fill={A} {...S} />
    <path d={`M${x + 58} ${y}l12 5-12 5z`} fill={AL} {...S} />
    <path d={`M${x} ${y}h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6`} fill={OL} {...S} />
  </g>
)
const Tree = ({ x, y, hi = -1, small = false }: { x: number; y: number; hi?: number; small?: boolean }) => {
  const s = small ? .8 : 1, bw = 34 * s, bh = 14 * s, gap = 44 * s
  const leaves = [0, 1, 2, 3].map((i) => x - gap * 1.5 + i * gap)
  return (
    <g>
      <path d={`M${x} ${y + bh} v${10 * s} M${x - gap} ${y + bh + 10 * s} h${gap * 2} M${x - gap} ${y + bh + 10 * s} v${8 * s} M${x + gap} ${y + bh + 10 * s} v${8 * s}`} {...S} fill="none" />
      <rect x={x - bw * .8} y={y} width={bw * 1.6} height={bh} rx="4" fill={N} />
      <Line x={x - bw * .5} y={y + bh / 2} w={bw} c={W} sw={2.4} />
      {[-1, 1].map((d, i) => (
        <g key={d}>
          <rect x={x + d * gap - bw / 2} y={y + bh + 18 * s} width={bw} height={bh} rx="4" fill={i === 0 ? T : TL} {...S} />
          <path d={`M${x + d * gap} ${y + 2 * bh + 18 * s} v${8 * s} M${leaves[i * 2]} ${y + 2 * bh + 26 * s} h${gap} M${leaves[i * 2]} ${y + 2 * bh + 26 * s} v${6 * s} M${leaves[i * 2 + 1]} ${y + 2 * bh + 26 * s} v${6 * s}`} {...S} fill="none" />
        </g>
      ))}
      {leaves.map((lx, i) => <rect key={i} x={lx - bw / 2.4} y={y + 2 * bh + 32 * s} width={bw / 1.2} height={bh * .85} rx="3" fill={i === hi ? OL : W} stroke={i === hi ? O : N} strokeWidth={1.75} />)}
    </g>
  )
}
const Bars = ({ x, y, vals, hi = -1, w = 14, gap = 8, base = 60 }: { x: number; y: number; vals: number[]; hi?: number; w?: number; gap?: number; base?: number }) => (
  <g>
    {vals.map((v, i) => <rect key={i} x={x + i * (w + gap)} y={y + base - v} width={w} height={v} rx="2" fill={i === hi ? T : i % 2 ? BLL : TL} stroke={N} strokeWidth="1.5" />)}
    <path d={`M${x - 6} ${y + base}h${vals.length * (w + gap) + 4}`} {...S} />
  </g>
)
const Bubble = ({ x, y, w, h, fill = W, tail = 'left' }: { x: number; y: number; w: number; h: number; fill?: string; tail?: 'left' | 'right' }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="10" fill={fill} {...S} />
    <path d={tail === 'left' ? `M${x + 16} ${y + h - 1}l-6 12 16-11` : `M${x + w - 16} ${y + h - 1}l6 12-16-11`} fill={fill} {...S} />
    <path d={tail === 'left' ? `M${x + 12} ${y + h - 1.5}h14` : `M${x + w - 26} ${y + h - 1.5}h14`} stroke={fill} strokeWidth="3" />
  </g>
)
const Head = ({ x, y, c = T, r = 13 }: { x: number; y: number; c?: string; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={c} {...S} />
    <path d={`M${x - r * 1.5} ${y + r * 3}c0-${r * 1.4} ${r * .7}-${r * 1.9} ${r * 1.5}-${r * 1.9}s${r * 1.5} ${r * .5} ${r * 1.5} ${r * 1.9}`} fill={c} {...S} />
  </g>
)

/* ---------------- the set ---------------- */
export const ArtCourse = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={40} y={40} w={160} h={92} />
    <path d="M120 44c-20-8-52-10-78-4v88c26-6 58-4 78 4z" fill={W} {...S} />
    <path d="M120 44c20-8 52-10 78-4v88c-26-6-58-4-78 4z" fill={W} {...S} />
    <path d="M120 44v88" {...S} />
    {[60, 72, 84, 96, 108].map((y, i) => <Line key={y} x={54} y={y} w={i === 4 ? 30 : 52} />)}
    <rect x={132} y={56} width={36} height={11} rx="3" fill={N} />
    <path d="M150 67v7M138 74h24M138 74v5M162 74v5" {...S} fill="none" />
    <rect x={128} y={79} width={20} height={10} rx="3" fill={T} {...S} /><rect x={152} y={79} width={20} height={10} rx="3" fill={TL} {...S} />
    <Line x={132} y={102} w={46} /><Line x={132} y={112} w={34} />
    <path d="M178 38v26l7-5 7 5V36" fill={O} {...S} />
  </Frame>
)
export const ArtMap = (p: { className?: string }) => {
  const pts: [number, number][] = [[36, 112], [70, 70], [110, 96], [146, 56], [182, 86], [208, 44]]
  return (
    <Frame {...p}>
      <path d={`M${pts.map((q) => q.join(' ')).join(' L')}`} fill="none" stroke={N} strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
      <path d={`M${pts.slice(0, 4).map((q) => q.join(' ')).join(' L')}`} fill="none" stroke={T} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="11" fill={i < 3 ? T : i === 3 ? W : W} {...S} />
          {i < 3 ? <Check x={x - 6} y={y} c={W} /> : <text x={x} y={y + 4.5} textAnchor="middle" fontFamily={SANS} fontSize="12" fontWeight="600" fill={N}>{i + 1}</text>}
        </g>
      ))}
      <path d="M208 33V10l18 7-18 7" fill={O} {...S} />
    </Frame>
  )
}
export const ArtFrameworks = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={30} y={26} w={180} h={110} r={10} />
    <rect x={30} y={26} width={180} height={110} rx="10" fill={W} {...S} />
    <Tree x={120} y={40} />
  </Frame>
)
export const ArtCasebook = (p: { className?: string }) => (
  <Frame {...p}>
    <Card x={58} y={34} w={112} h={92} rot={-8} fill={TL} />
    <Card x={66} y={30} w={112} h={92} rot={4} fill={AL} />
    <Shadow x={70} y={28} w={112} h={96} />
    <Card x={70} y={28} w={112} h={96} />
    <circle cx={84} cy={44} r="7" fill={N} /><text x={84} y={47.5} textAnchor="middle" fontFamily={SANS} fontSize="9" fontWeight="600" fill={W}>1</text>
    <Line x={98} y={44} w={56} c={N} sw={3.2} />
    <Line x={84} y={60} w={80} /><Line x={84} y={70} w={64} />
    <rect x={84} y={80} width={30} height={11} rx="5.5" fill={TL} /><circle cx={91} cy={85.5} r="2.5" fill={T} />
    <Bars x={124} y={68} vals={[10, 18, 26]} hi={2} w={9} gap={5} base={40} />
    <rect x={84} y={100} width={36} height={14} rx="4" fill={N} /><Line x={90} y={107} w={24} c={W} sw={2.2} />
    <path d="M196 30a10 10 0 1 1-.1 0zM196 34v6l4 3" fill={W} {...S} />
  </Frame>
)
export const ArtInterviewer = (p: { className?: string }) => (
  <Frame {...p}>
    <Head x={56} y={74} c={T} />
    <Head x={184} y={74} c={AL} />
    <Bubble x={74} y={26} w={84} h={34} fill={N} />
    <Line x={86} y={39} w={58} c={W} sw={2.6} /><Line x={86} y={48} w={38} c={W} sw={2.6} />
    <Bubble x={98} y={74} w={70} h={30} tail="right" />
    <Line x={110} y={86} w={46} /><Line x={110} y={94} w={30} />
    <path d="M30 136h180" {...S} />
  </Frame>
)
export const ArtMaths = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={44} y={24} w={128} h={112} />
    <Card x={44} y={24} w={128} h={112} />
    <path d="M44 42h128" stroke={O} strokeWidth="1.5" opacity=".6" />
    <text x={58} y={66} fontFamily={SERIF} fontSize="18" fill={N}>15% × 240</text>
    <text x={58} y={90} fontFamily={SERIF} fontSize="15" fill={N} opacity=".7">10% = 24</text>
    <text x={58} y={108} fontFamily={SERIF} fontSize="15" fill={N} opacity=".7">5% = 12</text>
    <path d="M120 86l8 7-8 7" fill="none" stroke={T} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x={132} y={84} width={34} height={24} rx="6" fill={TL} stroke={T} strokeWidth="1.75" />
    <text x={149} y={101} textAnchor="middle" fontFamily={SERIF} fontSize="17" fontWeight="600" fill={N}>36</text>
    <Pencil x={168} y={118} rot={-50} />
  </Frame>
)
export const ArtStructure = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={26} y={22} w={188} h={116} r={10} />
    <rect x={26} y={22} width={188} height={116} rx="10" fill={W} {...S} />
    <Tree x={120} y={34} hi={2} />
    <circle cx={183} cy={128} r="10" fill={O} {...S} />
    <path d="M179 124l8 8M187 124l-8 8" stroke={W} strokeWidth="2.4" strokeLinecap="round" />
  </Frame>
)
export const ArtCharts = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={36} y={22} w={168} h={116} r={8} />
    <Card x={36} y={22} w={168} h={116} r={8} />
    <Line x={50} y={38} w={70} c={N} sw={3} />
    <Line x={50} y={48} w={44} />
    <Bars x={62} y={60} vals={[22, 34, 28, 58, 40]} hi={3} w={16} gap={9} base={64} />
    <path d="M138 50c18-10 34-8 44 2" fill="none" {...S} />
    <path d="M178 46l5 6-7 3" fill="none" {...S} />
    <circle cx={190} cy={64} r="13" fill={OL} stroke={O} strokeWidth="1.75" />
    <text x={190} y={69} textAnchor="middle" fontFamily={SERIF} fontSize="14" fontWeight="600" fill={O}>!</text>
  </Frame>
)
export const ArtGraphs = (p: { className?: string }) => (
  <Frame {...p}>
    {[[34, 24], [124, 24], [34, 88], [124, 88]].map(([x, y], i) => (
      <g key={i}>
        <Shadow x={x} y={y} w={82} h={52} />
        <Card x={x} y={y} w={82} h={52} />
        {i === 0 && <Bars x={x + 14} y={y + 8} vals={[12, 22, 30, 18]} hi={2} w={10} gap={5} base={36} />}
        {i === 1 && <><path d={`M${x + 10} ${y + 40} L${x + 26} ${y + 30} L${x + 42} ${y + 34} L${x + 58} ${y + 18} L${x + 72} ${y + 12}`} fill="none" stroke={T} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /><path d={`M${x + 8} ${y + 44}h66`} {...S} /></>}
        {i === 2 && <g>{[[10, 22, T], [32, 12, BL], [44, 18, A]].map(([dx, w, c], k) => <g key={k}><rect x={x + Number(dx)} y={y + 10} width={Number(w)} height={34} fill={TL} stroke={N} strokeWidth="1.4" /><rect x={x + Number(dx)} y={y + 10 + (k + 1) * 6} width={Number(w)} height={34 - (k + 1) * 6} fill={String(c)} stroke={N} strokeWidth="1.4" /></g>)}</g>}
        {i === 3 && <g>{[[10, 34, 0], [24, 22, 12], [38, 26, 8], [52, 12, 22]].map(([dx, h, off], k) => <rect key={k} x={x + Number(dx)} y={y + 10 + Number(off)} width="11" height={Number(h) - Number(off) / 2} fill={k === 0 ? N : k === 3 ? T : OL} stroke={N} strokeWidth="1.4" />)}</g>}
      </g>
    ))}
  </Frame>
)
export const ArtThink = (p: { className?: string }) => (
  <Frame {...p}>
    <path d="M120 30c-24 0-40 18-40 38 0 14 7 22 14 30 4 5 6 10 6 16h40c0-6 2-11 6-16 7-8 14-16 14-30 0-20-16-38-40-38z" fill={AL} {...S} />
    <rect x={102} y={114} width={36} height={10} rx="3" fill={W} {...S} /><rect x={106} y={124} width={28} height={8} rx="3" fill={W} {...S} />
    <path d="M106 98l7-12 7 12 7-12 7 12" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {[[60, 52, 44, 58], [52, 82, 40, 82], [180, 52, 196, 58], [188, 82, 200, 82], [74, 26, 66, 18], [166, 26, 174, 18]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={A} strokeWidth="2.4" strokeLinecap="round" />)}
    <Card x={28} y={98} w={44} h={30} rot={-6} fill={TL} /><Line x={36} y={110} w={26} c={N} sw={2.2} />
    <Card x={168} y={98} w={44} h={30} rot={6} /><text x={190} y={118} textAnchor="middle" fontFamily={SERIF} fontSize="13" fill={N}>×12</text>
  </Frame>
)
export const ArtVoice = (p: { className?: string }) => (
  <Frame {...p}>
    <rect x={58} y={34} width={30} height={52} rx="15" fill={N} />
    <path d="M50 70c0 16 10 26 23 26s23-10 23-26M73 96v18M60 116h26" fill="none" {...S} />
    {[10, 26, 40, 22, 48, 30, 16, 36, 20, 8].map((h, i) => <rect key={i} x={112 + i * 10} y={74 - h / 2} width="6" height={h} rx="3" fill={i > 2 && i < 7 ? T : TL} stroke={N} strokeWidth="1.3" />)}
    <path d="M110 112h104" stroke={G} strokeWidth="3" strokeLinecap="round" />
    <circle cx={150} cy={112} r="6" fill={O} {...S} />
  </Frame>
)
export const ArtBusiness = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={40} y={26} w={150} h={108} />
    <Card x={40} y={26} w={150} h={108} />
    <Line x={54} y={42} w={92} c={N} sw={4} />
    <path d="M54 54h122" stroke={G} strokeWidth="1.5" />
    <rect x={54} y={64} width={56} height={46} rx="3" fill={TL} stroke={N} strokeWidth="1.4" />
    <path d="M58 102l12-10 10 6 14-16 12-6" fill="none" stroke={T} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    {[66, 76, 86, 96, 106].map((y, i) => <Line key={y} x={120} y={y} w={i === 4 ? 30 : 56} />)}
    <rect x={164} y={92} width={56} height={40} rx="8" fill={N} />
    <text x={192} y={110} textAnchor="middle" fontFamily={SERIF} fontSize="12" fill={W}>margin</text>
    <text x={192} y={124} textAnchor="middle" fontFamily={SERIF} fontSize="13" fontWeight="600" fill="#5ED3DC">+4 pts</text>
  </Frame>
)
export const ArtSkills = (p: { className?: string }) => (
  <Frame {...p}>
    <Head x={74} y={66} c={TL} r={18} />
    <Bubble x={108} y={32} w={98} h={40} fill={N} />
    {[8, 16, 24, 14, 20, 10, 6].map((h, i) => <rect key={i} x={122 + i * 10} y={52 - h / 2} width="5" height={h} rx="2.5" fill="#5ED3DC" />)}
    <path d="M110 94h46M110 106h70M110 118h34" stroke={G} strokeWidth="3" strokeLinecap="round" />
    <Check x={186} y={104} />
  </Frame>
)
export const ArtReference = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={28} y={26} w={166} h={100} />
    <Card x={28} y={26} w={166} h={100} />
    <rect x={28} y={26} width={166} height={22} rx="6" fill={N} /><rect x={28} y={40} width={166} height={8} fill={N} />
    <Line x={40} y={37} w={50} c={W} sw={2.6} />
    <text x={40} y={70} fontFamily={SERIF} fontSize="13" fill={N}>Profit = Revenue − Cost</text>
    <text x={40} y={90} fontFamily={SERIF} fontSize="12.5" fill={N}>Margin = Profit ÷ Revenue</text>
    <Line x={40} y={108} w={52} />
    <circle cx={194} cy={116} r="17" fill={TL} fillOpacity=".85" {...S} />
    <path d="M206 128l14 14" stroke={N} strokeWidth="5" strokeLinecap="round" />
  </Frame>
)
export const ArtGlossary = (p: { className?: string }) => (
  <Frame {...p}>
    {['A', 'M', 'Z'].map((l, i) => (
      <g key={l}>
        <Card x={46 + i * 18} y={52 - i * 12} w={120} h={76} fill={[TL, AL, W][i]} />
        <rect x={140 + i * 18} y={44 - i * 12} width={22} height={14} rx="3" fill={[T, A, N][i]} {...S} />
        <text x={151 + i * 18} y={55 - i * 12} textAnchor="middle" fontFamily={SANS} fontSize="9.5" fontWeight="600" fill={W}>{l}</text>
      </g>
    ))}
    <text x={96} y={60} fontFamily={SERIF} fontSize="15" fontWeight="600" fill={N}>Break-even</text>
    <Line x={96} y={74} w={70} /><Line x={96} y={84} w={54} /><Line x={96} y={94} w={62} />
  </Frame>
)
export const ArtTracker = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={42} y={26} w={156} h={108} r={8} />
    <Card x={42} y={26} w={156} h={108} r={8} />
    <Line x={56} y={42} w={52} c={N} sw={3} />
    {Array.from({ length: 28 }, (_, i) => {
      const c = i % 7, r = Math.floor(i / 7), on = [0, 1, 2, 4, 5, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 21, 22].includes(i)
      return <rect key={i} x={56 + c * 19} y={54 + r * 18} width={14} height={13} rx="3" fill={on ? (i > 13 ? T : TL) : W} stroke={on ? T : G} strokeWidth="1.4" />
    })}
    <circle cx={188} cy={40} r="14" fill={O} {...S} />
    <text x={188} y={45} textAnchor="middle" fontFamily={SANS} fontSize="12" fontWeight="600" fill={W}>5</text>
  </Frame>
)
export const ArtDashboard = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={34} y={24} w={172} h={112} r={10} />
    <Card x={34} y={24} w={172} h={112} r={10} />
    <circle cx={84} cy={80} r="30" fill="none" stroke={TL} strokeWidth="10" />
    <path d="M84 50a30 30 0 1 1-28.5 39.3" fill="none" stroke={T} strokeWidth="10" strokeLinecap="round" />
    <text x={84} y={86} textAnchor="middle" fontFamily={SERIF} fontSize="18" fontWeight="600" fill={N}>7.2</text>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <circle cx={136} cy={52 + i * 28} r="8" fill={i < 2 ? T : W} {...S} />
        {i < 2 && <Check x={132} y={52 + i * 28} c={W} />}
        <Line x={150} y={52 + i * 28} w={i === 2 ? 30 : 40} c={i < 2 ? N : G} />
      </g>
    ))}
    <path d="M136 60v12M136 88v12" stroke={T} strokeWidth="2" />
  </Frame>
)
export const ArtCaseLog = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={46} y={22} w={132} h={116} />
    <Card x={46} y={22} w={132} h={116} />
    <rect x={92} y={16} width={40} height={14} rx="4" fill={N} />
    {[0.8, 0.6, 0.9, 0.4, 0.7, 0.75].map((v, i) => (
      <g key={i}>
        <Line x={60} y={46 + i * 15} w={26} />
        <rect x={94} y={41 + i * 15} width={70} height={9} rx="4.5" fill="#EEF1F5" />
        <rect x={94} y={41 + i * 15} width={70 * v} height={9} rx="4.5" fill={i === 3 ? O : T} />
      </g>
    ))}
    <Pencil x={168} y={112} rot={-55} />
  </Frame>
)
export const ArtStories = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={56} y={22} w={124} h={114} />
    <Card x={56} y={22} w={124} h={114} />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={56} cy={36 + i * 22} r="4" fill={W} {...S} />)}
    {['S', 'T', 'A', 'R', 'L'].map((l, i) => (
      <g key={l}>
        <text x={72} y={42 + i * 20} fontFamily={SERIF} fontSize="13" fontWeight="600" fill={i === 2 ? T : N}>{l}</text>
        <Line x={88} y={38 + i * 20} w={[66, 52, 74, 44, 58][i]} c={i === 2 ? TL : G} sw={i === 2 ? 5 : 3} />
      </g>
    ))}
    <path d="M196 40l5 10 11 1.6-8 7.8 2 11-10-5.3-10 5.3 2-11-8-7.8 11-1.6z" fill={A} {...S} />
  </Frame>
)
export const ArtPartners = (p: { className?: string }) => (
  <Frame {...p}>
    <Head x={70} y={62} c={T} r={15} />
    <Head x={170} y={62} c={AL} r={15} />
    <path d="M96 78c14-14 34-14 48 0" fill="none" stroke={N} strokeWidth="1.75" strokeDasharray="2 6" strokeLinecap="round" />
    <circle cx={120} cy={70} r="12" fill={W} {...S} /><Check x={114} y={70} />
    <Card x={86} y={112} w={68} h={26} />
    <Line x={96} y={125} w={30} c={N} /><circle cx={140} cy={125} r="5" fill={T} />
  </Frame>
)
export const ArtPerks = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={60} y={56} w={100} h={74} />
    <Card x={60} y={56} w={100} h={74} fill={TL} />
    <rect x={52} y={44} width={116} height={20} rx="4" fill={T} {...S} />
    <path d="M110 44v86" stroke={N} strokeWidth="1.75" /><rect x={102} y={44} width={16} height={86} fill={O} {...S} />
    <path d="M110 44c-10-18-30-16-26-4 3 8 18 6 26 4zM110 44c10-18 30-16 26-4-3 8-18 6-26 4z" fill={OL} {...S} />
    <path d="M168 40l22-10 22 10-22 10z" fill={N} /><path d="M178 45v12c0 4 24 4 24 0V45" fill={N} /><path d="M210 40v14" {...S} />
  </Frame>
)
export const ArtNotes = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={62} y={24} w={112} h={112} />
    <Card x={62} y={24} w={112} h={112} fill={AL} />
    <path d="M62 44h112" stroke={A} strokeWidth="1.5" />
    {[58, 72, 86, 100, 114].map((y, i) => <Line key={y} x={74} y={y} w={[78, 64, 84, 50, 70][i]} c={i === 1 ? N : '#D9C79F'} />)}
    <Pencil x={150} y={110} rot={-40} />
  </Frame>
)
export const ArtPractise = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={46} y={30} w={116} h={100} />
    <Card x={46} y={30} w={116} h={100} />
    <Line x={60} y={48} w={60} c={N} sw={3.2} />
    <Line x={60} y={62} w={84} /><Line x={60} y={72} w={70} /><Line x={60} y={82} w={78} />
    <rect x={60} y={98} width={40} height={16} rx="4" fill={N} /><Line x={67} y={106} w={26} c={W} sw={2.2} />
    <circle cx={176} cy={58} r="26" fill={W} {...S} />
    <path d="M176 32v-6M170 24h12M196 40l4-4" {...S} />
    <path d="M176 58V42" stroke={O} strokeWidth="2.6" strokeLinecap="round" /><path d="M176 58l10 7" stroke={N} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M176 32a26 26 0 0 1 22 12" fill="none" stroke={T} strokeWidth="4" strokeLinecap="round" />
  </Frame>
)
export const ArtImprove = (p: { className?: string }) => (
  <Frame {...p}>
    <Shadow x={36} y={26} w={168} h={108} r={8} />
    <Card x={36} y={26} w={168} h={108} r={8} />
    <path d="M52 116h140M52 116V40" {...S} />
    {[60, 80, 100, 120, 140].map((x) => <path key={x} d={`M${x + 12} 112v4`} {...S} />)}
    <path d="M60 104 L84 96 L108 100 L132 78 L156 70 L180 48" fill="none" stroke={T} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {[[60, 104], [84, 96], [108, 100], [132, 78], [156, 70], [180, 48]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill={i === 5 ? O : W} {...S} />)}
  </Frame>
)
