// School email domains. Students' addresses often sit on a subdomain
// (e.g. name@mba2027.hbs.edu), so matching is by suffix and the most specific
// domain wins. A university-wide domain is named after the university, not one
// of its schools, because anyone at that university has an address there.
export const SCHOOLS: [string, string][] = [
  ['london.edu', 'London Business School'], ['hbs.edu', 'Harvard Business School'], ['stanford.edu', 'Stanford University'],
  ['wharton.upenn.edu', 'Wharton'], ['upenn.edu', 'University of Pennsylvania'], ['insead.edu', 'INSEAD'], ['kellogg.northwestern.edu', 'Kellogg'],
  ['chicagobooth.edu', 'Chicago Booth'], ['gsb.columbia.edu', 'Columbia Business School'], ['columbia.edu', 'Columbia University'],
  ['sloan.mit.edu', 'MIT Sloan'], ['mit.edu', 'MIT'], ['tuck.dartmouth.edu', 'Tuck'], ['haas.berkeley.edu', 'Berkeley Haas'], ['berkeley.edu', 'UC Berkeley'], ['som.yale.edu', 'Yale SOM'], ['yale.edu', 'Yale University'],
  ['umich.edu', 'University of Michigan'], ['darden.virginia.edu', 'Darden'], ['fuqua.duke.edu', 'Duke Fuqua'], ['duke.edu', 'Duke University'], ['stern.nyu.edu', 'NYU Stern'],
  ['nyu.edu', 'New York University'], ['johnson.cornell.edu', 'Cornell Johnson'], ['cornell.edu', 'Cornell University'], ['anderson.ucla.edu', 'UCLA Anderson'], ['ucla.edu', 'UCLA'],
  ['sbs.ox.ac.uk', 'Oxford Saïd'], ['ox.ac.uk', 'University of Oxford'], ['jbs.cam.ac.uk', 'Cambridge Judge'], ['cam.ac.uk', 'University of Cambridge'],
  ['imperial.ac.uk', 'Imperial College London'], ['lse.ac.uk', 'LSE'], ['wbs.ac.uk', 'Warwick Business School'], ['warwick.ac.uk', 'University of Warwick'],
  ['iese.net', 'IESE'], ['iese.edu', 'IESE'], ['ie.edu', 'IE Business School'], ['hec.edu', 'HEC Paris'], ['esade.edu', 'ESADE'],
  ['unibocconi.it', 'Bocconi University'], ['studbocconi.it', 'Bocconi'], ['essec.edu', 'ESSEC'], ['escp.eu', 'ESCP'], ['unisg.ch', 'University of St. Gallen'],
  ['cbs.dk', 'Copenhagen Business School'], ['rsm.nl', 'Rotterdam School of Management'], ['eur.nl', 'Erasmus University Rotterdam'],
  ['mannheim-business-school.com', 'Mannheim Business School'], ['uni-mannheim.de', 'University of Mannheim'], ['whu.edu', 'WHU'], ['imd.org', 'IMD'],
  ['isb.edu', 'Indian School of Business'], ['iima.ac.in', 'IIM Ahmedabad'], ['iimb.ac.in', 'IIM Bangalore'], ['iimcal.ac.in', 'IIM Calcutta'],
  ['iiml.ac.in', 'IIM Lucknow'], ['iimk.ac.in', 'IIM Kozhikode'], ['xlri.ac.in', 'XLRI'], ['nus.edu.sg', 'NUS Business School'],
  ['ust.hk', 'HKUST'], ['ceibs.edu', 'CEIBS'], ['rotman.utoronto.ca', 'Rotman'], ['utoronto.ca', 'University of Toronto'], ['ivey.ca', 'Ivey'],
  ['mbs.edu', 'Melbourne Business School'], ['agsm.edu.au', 'AGSM'], ['harvard.edu', 'Harvard University'],
]

const PERSONAL = ['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'aol.com']

/** True for domains that look like a university's: .edu, .ac.uk, .edu.au and the like. */
export const isAcademicDomain = (domain: string) =>
  /(^|\.)(edu|ac)(\.[a-z]{2})?$/.test(domain) || SCHOOLS.some(([d]) => domain === d || domain.endsWith(`.${d}`))

export function lookupSchool(email: string): { domain: string; school: string | null; personal: boolean; academic: boolean } {
  const domain = email.trim().toLowerCase().split('@')[1] || ''
  const hit = SCHOOLS.filter(([d]) => domain === d || domain.endsWith(`.${d}`)).sort((a, b) => b[0].length - a[0].length)[0]
  return { domain, school: hit ? hit[1] : null, personal: PERSONAL.includes(domain), academic: isAcademicDomain(domain) }
}

export const PROGRAMS = ['MBA', 'Executive MBA', 'Masters in Management', 'Masters in Finance', 'Other masters', 'PhD', 'Undergraduate', 'Alumni']
