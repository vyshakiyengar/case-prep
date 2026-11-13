// Runs after `vite build`. Writes a copy of index.html for every public page with its own
// <title>, description, canonical URL, link-preview tags and structured data, plus sitemap.xml.
// The app itself is unchanged: each copy loads the same scripts.
import { createServer } from 'vite'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const dist = join(root, 'dist')
// Load the site's own TypeScript content through Vite (no extra dependencies)
const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } })
const { routes, SITE, indexInSync } = await vite.ssrLoadModule('/tools/seo/entry.ts')
if (!indexInSync) throw new Error('build-seo: src/content/caseIndex.json is out of date. Run python3 tools/casegen/index.py')
await vite.close()

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const base = readFileSync(join(dist, 'index.html'), 'utf8')
const set = (html, re, value) => { if (!re.test(html)) throw new Error(`build-seo: tag not found ${re}`); return html.replace(re, value) }

let n = 0
for (const r of routes) {
  const url = `${SITE}${r.path === '/' ? '/' : r.path}`
  let h = base
  h = set(h, /<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`)
  h = set(h, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(r.description)}" />`)
  h = set(h, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`)
  h = set(h, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(r.title)}" />`)
  h = set(h, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(r.description)}" />`)
  h = set(h, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`)
  h = set(h, /<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${r.type || 'website'}" />`)
  h = set(h, /<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${r.image}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:title" content="${esc(r.title)}" />\n    <meta name="twitter:description" content="${esc(r.description)}" />\n    <meta name="twitter:image" content="${r.image}" />`)
  if (r.type === 'article') {
    const ld = { '@context': 'https://schema.org', '@type': 'LearningResource', name: r.title.split(' · ')[0], description: r.description, url, image: r.image,
      learningResourceType: r.path.startsWith('/casebook/') ? 'Practice case' : 'Lesson', educationalLevel: 'Professional', isAccessibleForFree: true,
      inLanguage: 'en-GB', provider: { '@type': 'Organization', name: 'PrepForCase', url: SITE }, author: { '@id': 'https://vyshak.me/#person' } }
    h = h.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`)
  }
  // /casebook/x is served from casebook/x.html (vercel.json has cleanUrls on)
  const out = r.path === '/' ? join(dist, 'index.html') : join(dist, `${r.path}.html`)
  mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, h); n++
}
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .filter((r) => r.path !== '/home')
  .map((r) => `  <url><loc>${SITE}${r.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)
console.log(`build-seo: wrote ${n} page heads and sitemap.xml (${routes.length - 1} URLs)`)
