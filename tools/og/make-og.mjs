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
@font-face { font-family: Plex; src: url(${font('@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2')}); font-weight: 400; }
@font-face { font-family: Plex; src: url(${font('@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2')}); font-weight: 600; }
* { margin: 0; box-sizing: border-box } body { width: 1200px; height: 630px; overflow: hidden }
.og { width: 1200px; height: 630px; display: grid; grid-template-columns: 1fr 440px; gap: 40px; align-items: center; padding: 64px 72px; background: #F4F6F9;
  background-image: radial-gradient(circle, rgba(15,27,51,.10) 1.4px, transparent 1.6px); background-size: 28px 28px; color: #0F1B33; font-family: Plex, sans-serif; position: relative }
.og::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 12px; background: #0F1B33 }
.l { display: flex; flex-direction: column; height: 100% }
.chips { margin-top: 34px; display: flex; gap: 10px; flex-wrap: wrap }
.chips span { font: 600 21px Plex; padding: 7px 16px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 1.5px #D5DCE6; color: #2B3A55 }
.chips span:first-child { background: #0F1B33; color: #fff; box-shadow: none }
h1 { margin-top: 26px; font-family: News; font-weight: 560; line-height: 1.04; letter-spacing: -0.015em }
p { margin-top: 18px; font-size: 27px; line-height: 1.35; color: #4A5872; max-width: 640px }
.foot { margin-top: auto; font-size: 23px; color: #4A5872 } .foot b { color: #0B6F77; font-weight: 600 }
.r { background: #fff; border-radius: 28px; padding: 28px 24px 18px; box-shadow: 0 30px 60px -30px rgba(15,27,51,.35), inset 0 0 0 1.5px #E1E6ED }
.r svg { width: 100%; height: auto }`
for (const c of cards) writeFileSync(join(out, `${c.name}.html`), `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${c.html}</body></html>`)
console.log(`make-og: ${cards.length} cards`)
