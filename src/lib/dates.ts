export const iso = (d: Date) => {
  const y = d.getFullYear(), m = `${d.getMonth() + 1}`.padStart(2, '0'), day = `${d.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${day}`
}
export const todayIso = () => iso(new Date())
export const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const addDays = (s: string, n: number) => {
  const d = parse(s); d.setDate(d.getDate() + n); return iso(d)
}
export const diffDays = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000)
export const fmtShort = (s: string) => parse(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
export const fmtDow = (s: string) => parse(s).toLocaleDateString('en-GB', { weekday: 'short' })
export const fmtLong = (s: string) => parse(s).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
export const uid = () => {
  const b = crypto.getRandomValues(new Uint8Array(9))
  return Array.from(b, (x) => (x % 36).toString(36)).join('') + Date.now().toString(36).slice(-4)
}
