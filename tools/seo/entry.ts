// Bundled by build-seo.mjs: gathers every public page's meta from the site's own content.
import { PAGES, caseMeta, lessonMeta, SITE } from '../../src/lib/seo'
import { LESSONS } from '../../src/content/course'
import cases from '../../src/content/cases.json'
type C = Parameters<typeof caseMeta>[0]
export const routes = [
  ...Object.entries(PAGES).map(([path, m]) => ({ path, ...m })),
  ...(cases as unknown as C[]).map((c) => ({ path: `/casebook/${c.slug}`, ...caseMeta(c), caseId: c.id })),
  ...LESSONS.map((l, i) => ({ path: `/learn/${l.slug}`, ...lessonMeta(l, i + 1) })),
]
export { SITE }
