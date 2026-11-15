// Writes tools/og/out/*.html, one per link-preview image. Then run tools/og/shoot.py to turn them
// into public/og/*.jpg. Only needed when cases, lessons or page titles change.
import { createServer } from 'vite'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } })
const { cards } = await vite.ssrLoadModule('/tools/og/cards.tsx')
await vite.close()
const out = join(root, 'tools/og/out'); rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true })
const font = (p) => `file://${join(root, 'node_modules', p)}`
const css = `
@font-face { font-family: News; src: url(${font('@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2')}); font-weight: 200 800; }
@font-face { font-family: Franklin; src: url(${font('@fontsource-variable/libre-franklin/files/libre-franklin-latin-wght-normal.woff2')}); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box } body { width: 1200px; height: 630px; overflow: hidden }
.og { width: 1200px; height: 630px; display: grid; grid-template-columns: 1fr 440px; gap: 40px; align-items: center; padding: 64px 72px; background: #F7F7F5;
  background-image: radial-gradient(circle, rgba(18,18,18,.10) 1.4px, transparent 1.6px); background-size: 28px 28px; color: #121212; font-family: Franklin, sans-serif; position: relative }
.og::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 12px; background: #121212 }
.l { display: flex; flex-direction: column; height: 100% }
.chips { margin-top: 34px; display: flex; gap: 10px; flex-wrap: wrap }
.chips span { font: 600 21px Franklin; padding: 7px 16px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 1.5px #D9D9D9; color: #333333 }
.chips span:first-child { background: #121212; color: #fff; box-shadow: none }
h1 { margin-top: 26px; font-family: News; font-weight: 700; line-height: 1.04; letter-spacing: -0.015em }
p { margin-top: 18px; font-size: 27px; line-height: 1.35; color: #555555; max-width: 640px }
.foot { margin-top: auto; font-size: 23px; color: #555555 } .foot b { color: #0B6F77; font-weight: 600 }
.r { background: #fff; border-radius: 28px; padding: 28px 24px 18px; box-shadow: 0 30px 60px -30px rgba(18,18,18,.35), inset 0 0 0 1.5px #E2E2E2 }
.r svg { width: 100%; height: auto }`
for (const c of cards) writeFileSync(join(out, `${c.name}.html`), `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${c.html}</body></html>`)
console.log(`make-og: ${cards.length} cards`)
