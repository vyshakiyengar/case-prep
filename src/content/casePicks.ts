// One case from each industry, for the industry cards on the landing and home pages.
// Kept here (not read from cases.json) so those pages don't download the whole casebook.
export interface CasePick { slug: string; title: string; sub: string; industry: string; label: string; diff: 1 | 2 | 3 }
export const CASE_PICKS: CasePick[] = [
  { slug: 'coastal-brew', title: 'Coastal Brew', sub: 'Why is a growing coffee chain making less money?', industry: 'Food & beverage retail', label: 'Food & drink', diff: 1 },
  { slug: 'cloudledger', title: 'CloudLedger', sub: 'How should a software company price its new AI add-on?', industry: 'Software (B2B SaaS)', label: 'Software', diff: 2 },
  { slug: 'meridian-hospitals', title: 'Meridian Hospitals', sub: 'How can a hospital chain double its revenue in five years?', industry: 'Healthcare', label: 'Healthcare', diff: 2 },
  { slug: 'skyline-mro', title: 'SkyLine MRO', sub: 'Why do aircraft spend so long in maintenance?', industry: 'Aviation', label: 'Transport', diff: 2 },
  { slug: 'lumen-bank', title: 'Lumen Bank', sub: 'A digital bank grows fast but its losses grow faster', industry: 'Financial services', label: 'Banking', diff: 3 },
  { slug: 'fithub-gyms', title: 'FitHub Gyms', sub: 'Should a private equity fund buy a budget gym chain?', industry: 'Leisure / fitness', label: 'Leisure', diff: 3 },
  { slug: 'vertex-mobile', title: 'Vertex Mobile', sub: "Why is a telecom operator's revenue falling?", industry: 'Telecoms', label: 'Telecoms', diff: 2 },
  { slug: 'nordwind-e-bikes', title: 'Nordwind E-Bikes', sub: 'Should a Danish premium e-bike maker enter the US?', industry: 'Manufacturing', label: 'Manufacturing', diff: 2 },
  { slug: 'plugged-in', title: 'Plugged In', sub: 'How big is the UK market for home EV chargers?', industry: 'Energy / automotive', label: 'Energy', diff: 1 },
  { slug: 'snackco-protein-bar', title: 'SnackCo Protein Bar', sub: 'Should a snack maker launch a protein bar?', industry: 'Consumer packaged goods', label: 'Consumer goods', diff: 1 },
  { slug: 'brightstep-tutoring', title: 'BrightStep Tutoring', sub: 'How big is the market for paid maths tutoring?', industry: 'Education', label: 'Education', diff: 1 },
  { slug: 'riverside-city', title: 'Riverside City', sub: '$10M to reduce homelessness: where should it go?', industry: 'Local government', label: 'Public sector', diff: 2 },
]
export const DIFF_WORD = { 1: 'Easy', 2: 'Medium', 3: 'Hard' } as const
