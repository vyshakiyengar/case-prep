import { MODULES, lessonBySlug } from './course'

export type CoursePage = { id: string; label: string; to: string; module?: string }

/** The course as a book: what's inside, the map, one page per lesson, then what to do next. */
export const PAGES: CoursePage[] = [
  { id: 'overview', label: "What's in the course", to: '/learn' },
  { id: 'case-map', label: 'The map of a case', to: '/learn/case-map' },
  ...MODULES.flatMap((m, mi) => m.slugs.map((slug) => {
    const l = lessonBySlug(slug)!
    return { id: slug, label: l.title.split(':')[0], to: `/learn/${slug}`, module: `Module ${mi + 1}: ${m.title}` }
  })),
  { id: 'whats-next', label: 'What to do next', to: '/learn/whats-next' },
]

const FIRST_LESSON = 2
export const pageTitle = (id: string, i = PAGES.findIndex((p) => p.id === id)) =>
  i < FIRST_LESSON || i === PAGES.length - 1 ? PAGES[Math.max(i, 0)].label : `Lesson ${i - FIRST_LESSON + 1}: ${PAGES[i].label}`
