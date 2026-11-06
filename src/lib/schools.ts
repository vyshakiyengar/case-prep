// Business school email domains. Students' addresses often sit on a subdomain
// (e.g. name@mba2027.hbs.edu), so matching is by suffix. Add schools as you grow.
export const SCHOOLS: [string, string][] = [
  ['london.edu', 'London Business School'], ['hbs.edu', 'Harvard Business School'], ['stanford.edu', 'Stanford GSB'],
  ['wharton.upenn.edu', 'Wharton'], ['upenn.edu', 'Wharton (UPenn)'], ['insead.edu', 'INSEAD'], ['kellogg.northwestern.edu', 'Kellogg'],
  ['chicagobooth.edu', 'Chicago Booth'], ['gsb.columbia.edu', 'Columbia Business School'], ['columbia.edu', 'Columbia Business School'],
  ['mit.edu', 'MIT Sloan'], ['tuck.dartmouth.edu', 'Tuck'], ['berkeley.edu', 'Berkeley Haas'], ['yale.edu', 'Yale SOM'],
  ['umich.edu', 'Michigan Ross'], ['darden.virginia.edu', 'Darden'], ['duke.edu', 'Duke Fuqua'], ['stern.nyu.edu', 'NYU Stern'],
  ['nyu.edu', 'NYU Stern'], ['cornell.edu', 'Cornell Johnson'], ['anderson.ucla.edu', 'UCLA Anderson'], ['ucla.edu', 'UCLA Anderson'],
  ['sbs.ox.ac.uk', 'Oxford Saïd'], ['ox.ac.uk', 'Oxford Saïd'], ['jbs.cam.ac.uk', 'Cambridge Judge'], ['cam.ac.uk', 'Cambridge Judge'],
  ['imperial.ac.uk', 'Imperial College Business School'], ['lse.ac.uk', 'LSE'], ['warwick.ac.uk', 'Warwick Business School'],
  ['iese.net', 'IESE'], ['iese.edu', 'IESE'], ['ie.edu', 'IE Business School'], ['hec.edu', 'HEC Paris'], ['esade.edu', 'ESADE'],
  ['unibocconi.it', 'SDA Bocconi'], ['studbocconi.it', 'Bocconi'], ['essec.edu', 'ESSEC'], ['escp.eu', 'ESCP'], ['unisg.ch', 'University of St. Gallen'],
  ['cbs.dk', 'Copenhagen Business School'], ['rsm.nl', 'Rotterdam School of Management'], ['eur.nl', 'Rotterdam School of Management'],
  ['uni-mannheim.de', 'Mannheim Business School'], ['whu.edu', 'WHU'], ['imd.org', 'IMD'],
  ['isb.edu', 'Indian School of Business'], ['iima.ac.in', 'IIM Ahmedabad'], ['iimb.ac.in', 'IIM Bangalore'], ['iimcal.ac.in', 'IIM Calcutta'],
  ['iiml.ac.in', 'IIM Lucknow'], ['iimk.ac.in', 'IIM Kozhikode'], ['xlri.ac.in', 'XLRI'], ['nus.edu.sg', 'NUS Business School'],
  ['ust.hk', 'HKUST'], ['ceibs.edu', 'CEIBS'], ['rotman.utoronto.ca', 'Rotman'], ['utoronto.ca', 'Rotman'], ['ivey.ca', 'Ivey'],
  ['mbs.edu', 'Melbourne Business School'], ['agsm.edu.au', 'AGSM'],
]

const PERSONAL = ['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'aol.com']

export function lookupSchool(email: string): { domain: string; school: string | null; personal: boolean } {
  const domain = email.trim().toLowerCase().split('@')[1] || ''
  const hit = SCHOOLS.find(([d]) => domain === d || domain.endsWith(`.${d}`))
  return { domain, school: hit ? hit[1] : null, personal: PERSONAL.includes(domain) }
}

export const PROGRAMS = ['MBA', 'Executive MBA', 'Masters in Management', 'Masters in Finance', 'Other masters', 'PhD', 'Undergraduate', 'Alumni']
