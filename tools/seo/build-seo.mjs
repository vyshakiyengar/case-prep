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
// A plain app shell (no page-specific text) for every address without its own HTML file:
// signed-in pages, invite links and unknown addresses. vercel.json rewrites to /app.
writeFileSync(join(dist, 'app.html'), base.replace('<head>', '<head>\n    <meta name="robots" content="noindex" />'))
const set = (html, re, value) => { if (!re.test(html)) throw new Error(`build-seo: tag not found ${re}`); return html.replace(re, value) }

const PERSON = { '@type': 'Person', '@id': 'https://vyshak.me/#person', name: 'Vyshak K Iyengar', alternateName: 'Vyshak Iyengar', url: `${SITE}/author/vyshak-iyengar`, image: `${SITE}/vyshak.jpg`,
  jobTitle: 'Founder, PrepForCase', worksFor: { '@type': 'Organization', name: 'PrepForCase', url: SITE },
  alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'London Business School' }], sameAs: ['https://vyshak.me', 'https://www.linkedin.com/in/vyshakiyengar/', 'https://x.com/vyshakkiyengar'] }
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
  if (r.blog) {
    // Blog posts: the article itself goes into the page, so it reads without JavaScript
    const post = JSON.parse(readFileSync(join(root, 'public/blog-data', `${r.blog}.json`), 'utf8'))
    const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: r.title.split(' · ')[0], description: r.description, url, image: r.image, datePublished: '2026-11-15',
      isAccessibleForFree: true, inLanguage: 'en-GB', publisher: { '@type': 'Organization', name: 'PrepForCase', url: SITE }, author: PERSON, mainEntityOfPage: url }
    h = h.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`)
    h = set(h, /<div id="root"><\/div>/, `<div id="root"><article style="max-width:44rem;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.6"><p><a href="/blog">PrepForCase blog</a></p><h1>${esc(r.title.split(' · ')[0])}</h1><p>By <a href="/author/vyshak-iyengar">Vyshak K Iyengar</a>, Founder, PrepForCase</p><p>${post.hook}</p>${post.body}<p>${post.outro}</p></article></div>`)
  } else if (r.path === '/author/vyshak-iyengar') {
    const ld = { '@context': 'https://schema.org', '@type': 'ProfilePage', url, name: r.title, mainEntity: PERSON }
    h = h.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`)
    h = set(h, /<div id="root"><\/div>/, `<div id="root"><main style="max-width:44rem;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.6"><h1>Vyshak K Iyengar</h1><p>Founder, PrepForCase. London Business School MBA. Formerly BCG, Accenture Strategy and Meta.</p><p><a href="https://vyshak.me" rel="me">vyshak.me</a> · <a href="https://www.linkedin.com/in/vyshakiyengar/" rel="me">LinkedIn</a> · <a href="/blog">PrepForCase blog</a></p></main></div>`)
  } else if (r.body) {
    h = set(h, /<div id="root"><\/div>/, `<div id="root"><main style="max-width:48rem;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.6">${r.body}</main></div>`)
  }
  if (!r.blog && r.type === 'article') {
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
