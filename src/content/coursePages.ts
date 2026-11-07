import { MODULES, lessonBySlug } from './course'

export type CoursePage = { id: string; label: string; to: string; module?: string }

/** The course as a book: the map, one page per lesson, then what to do next. */
export const PAGES: CoursePage[] = [
  { id: 'case-map', label: 'The map of a case', to: '/learn' },
  ...MODULES.flatMap((m, mi) => m.slugs.map((slug) => {
    const l = lessonBySlug(slug)!
    return { id: slug, label: l.title.split(':')[0], to: `/learn/${slug}`, module: `Module ${mi + 1}: ${m.title}` }
  })),
  { id: 'whats-next', label: 'What to do next', to: '/learn/whats-next' },
]

export const pageTitle = (id: string, i = PAGES.findIndex((p) => p.id === id)) =>
  i <= 0 || i === PAGES.length - 1 ? PAGES[Math.max(i, 0)].label : `Lesson ${i}: ${PAGES[i].label}`
