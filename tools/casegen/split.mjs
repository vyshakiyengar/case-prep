// One small JSON file per case, so a case page downloads only that case (not all 102).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
const cases = JSON.parse(readFileSync('src/content/cases.json', 'utf8'))
rmSync('public/case-data', { recursive: true, force: true }); mkdirSync('public/case-data', { recursive: true })
for (const c of cases) writeFileSync(`public/case-data/${c.slug}.json`, JSON.stringify(c))
console.log(`case-data: wrote ${cases.length} files`)
