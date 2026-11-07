#!/usr/bin/env python3
"""Safely integrate the Case Prep OS learning additions into the original Vite repo.
Run from the repository root: python3 scripts/apply_learning_upgrade.py
Idempotent: running twice will not add duplicate components or links.
"""
from pathlib import Path
import sys

ROOT = Path.cwd()
if not (ROOT/'src/App.tsx').exists() or not (ROOT/'src/components/AppShell.tsx').exists():
    raise SystemExit('Run this in the original case-prep repository root.')

def replace_exact(text, old, new, path):
    if new in text: return text
    n=text.count(old)
    if n!=1: raise ValueError(f'{path}: expected one anchor, found {n}: {old[:85]!r}')
    return text.replace(old,new,1)

changes={}
def transform(path, func):
    full=ROOT/path
    original=full.read_text(encoding='utf8')
    newer=func(original,path)
    changes[path]=newer


def app(s,p):
    s=replace_exact(s,"const Drills = lazy(() => import('./pages/Drills'))", "const Drills = lazy(() => import('./pages/Drills'))\nconst Graphs = lazy(() => import('./pages/Graphs'))\nconst InterviewSkills = lazy(() => import('./pages/InterviewSkills'))",p)
    s=replace_exact(s,'          <Route path="/frameworks/:slug" element={<Framework />} />', '          <Route path="/frameworks/:slug" element={<Framework />} />\n          <Route path="/graphs" element={<Graphs />} />\n          <Route path="/interview-skills" element={<InterviewSkills />} />',p)
    return s
transform('src/App.tsx',app)


MOBILE_HEADER = '''      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to={user ? '/today' : '/'}><Logo /></Link>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileOpen((o) => !o)} aria-expanded={mobileOpen} aria-controls="mobile-sections"
            className="rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] font-medium text-ink hover:border-violet">{mobileOpen ? 'Close' : 'Menu'}</button>
          {user ? <NavLink to="/settings" aria-label="Settings"><Avatar name={name} photo={user.photoURL} /></NavLink> : <SignInLink />}
        </div>
        {mobileOpen && <nav id="mobile-sections" aria-label="Browse all sections" className="absolute left-3 right-3 top-full z-30 max-h-[min(75vh,620px)] overflow-y-auto rounded-b-xl border border-line bg-white p-4 shadow-xl">
          <p className="px-2 pb-1 text-[12px] font-semibold uppercase tracking-wide text-teal-d">Start here</p>
          <div className="grid grid-cols-2 gap-1">
            {LEARN.filter((n) => n.to === '/learn').map((n) => <NavLink key={n.to} to={n.to} onClick={() => setMobileOpen(false)} className="rounded-lg bg-teal-l px-3 py-2.5 text-[14px] font-medium text-teal-d">{n.label}</NavLink>)}
          </div>
          <p className="mt-4 px-2 pb-1 text-[12px] font-semibold uppercase tracking-wide text-teal-d">Pillar 1 · Case mechanics</p>
          <div className="grid grid-cols-2 gap-1">
            {LEARN.filter((n) => !['/learn', '/interview-skills'].includes(n.to)).map((n) => <NavLink key={n.to} to={n.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2.5 text-[14px] font-medium ${isActive ? 'bg-teal-l text-teal-d' : 'text-ink hover:bg-canvas'}`}>{n.label}</NavLink>)}
          </div>
          <p className="mt-4 px-2 pb-1 text-[12px] font-semibold uppercase tracking-wide text-violet-d">Pillar 2 · Interview skills</p>
          <div className="grid grid-cols-2 gap-1">
            {LEARN.filter((n) => n.to === '/interview-skills').map((n) => <NavLink key={n.to} to={n.to} onClick={() => setMobileOpen(false)} className="rounded-lg bg-violet-l px-3 py-2.5 text-[14px] font-medium text-violet-d">{n.label}</NavLink>)}
          </div>
          {user && <><p className="mt-4 px-2 pb-1 text-[12px] font-semibold uppercase tracking-wide text-violet-d">My prep and progress</p>
          <div className="grid grid-cols-2 gap-1">
            {PREP.map((n) => <NavLink key={n.to} to={n.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2.5 text-[14px] font-medium ${isActive ? 'bg-violet-l text-violet-d' : 'text-ink hover:bg-canvas'}`}>{n.label}</NavLink>)}
          </div></>}
        </nav>}
      </header>'''
def shell(s,p):
    s=replace_exact(s,"import { useEffect } from 'react'", "import { useEffect, useState } from 'react'",p)
    anchor="  { to: '/frameworks', label: 'Frameworks', icon: 'M12 4v5M5 9h14M5 9v4M12 9v4M19 9v4M3 13h4v6H3zM10 13h4v6h-4zM17 13h4v6h-4z' },"
    addition=anchor+"\n  { to: '/graphs', label: 'Graph library', icon: 'M4 20V4M4 20h16M7 16l4-6 3 3 5-8' },\n  { to: '/interview-skills', label: 'Interview skills', icon: 'M8 8a4 4 0 0 1 8 0c0 3-4 4-4 7M12 19h.01M4 21h16' },"
    s=replace_exact(s,anchor,addition,p)
    s=replace_exact(s,"{ to: '/learn', label: 'Course', icon:", "{ to: '/learn', label: 'Start here', icon:",p)
    s=replace_exact(s,'''          <NavGroup title="Learn and practise" items={LEARN} />
          <NavGroup title="My prep" items={PREP} />''', '''          <NavGroup title="Start here" items={LEARN.filter((n) => n.to === '/learn')} />
          <NavGroup title="Pillar 1 · Case mechanics" items={LEARN.filter((n) => !['/learn', '/interview-skills'].includes(n.to))} />
          <NavGroup title="Pillar 2 · Interview skills" items={LEARN.filter((n) => n.to === '/interview-skills')} />
          <NavGroup title="My prep" items={PREP} />''',p)
    s=replace_exact(s,"  const loc = useLocation()\n  useEffect(() => { if (!loc.hash) window.scrollTo(0, 0) }, [loc.pathname, loc.hash])", "  const loc = useLocation()\n  const [mobileOpen, setMobileOpen] = useState(false)\n  useEffect(() => { if (!loc.hash) window.scrollTo(0, 0); setMobileOpen(false) }, [loc.pathname, loc.hash])",p)
    original='''      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to={user ? '/today' : '/'}><Logo /></Link>
        {user ? <NavLink to="/settings" aria-label="Settings"><Avatar name={name} photo={user.photoURL} /></NavLink> : <SignInLink />}
      </header>'''
    s=replace_exact(s,original,MOBILE_HEADER,p)
    s=replace_exact(s,'<Icon d={n.icon} /><span className="truncate">{n.label}</span>', '<Icon d={n.icon} /><span className="truncate">{n.label === "Perfect casing" ? "Case steps" : n.label}</span>',p)
    mobile_old="LEARN.filter((n) => n.to !== '/frameworks')"
    mobile_new="LEARN.filter((n) => ['/learn', '/perfect-casing', '/casebook', '/drills'].includes(n.to))"
    if mobile_old in s: s=replace_exact(s,mobile_old,mobile_new,p)
    return s
transform('src/components/AppShell.tsx',shell)

PILLARS="""      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-violet-d">The method behind this website</p>
          <h2 className="mt-2 text-[32px] font-semibold">Case preparation is two different jobs.</h2>
          <p className="mt-2 max-w-3xl text-[16px] text-muted">First, learn how to solve business cases. Second, build the thinking, communication and business judgement that help you perform well in the interview. You need both. This programme gives you a way to practise each one.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-line border-t-4 border-t-teal bg-white p-6">
              <span className="text-[13px] font-semibold text-teal-d">PILLAR 1</span>
              <h3 className="mt-2 text-[24px] font-semibold">Master case mechanics</h3>
              <p className="mt-2 text-[15px] text-muted">Learn how to open a case, ask good questions, build a tailored structure, read graphs, calculate quickly and make a recommendation. Then practise full cases and learn from every mistake.</p>
              <div className="mt-4 flex flex-wrap gap-3 text-[14px] font-medium text-violet-d"><Link to="/perfect-casing" className="hover:underline">Perfect casing →</Link><Link to="/frameworks" className="hover:underline">Frameworks →</Link><Link to="/graphs" className="hover:underline">64 graph exercises →</Link></div>
            </div>
            <div className="rounded-xl border border-line border-t-4 border-t-violet bg-white p-6">
              <span className="text-[13px] font-semibold text-violet-d">PILLAR 2</span>
              <h3 className="mt-2 text-[24px] font-semibold">Master interview skills</h3>
              <p className="mt-2 text-[15px] text-muted">Improve your ability to recall information, speak clearly and think commercially. Use practical exercises, SpeechOn, optional brain games, CEO interviews, Shark Tank and business books to prepare.</p>
              <Link to="/interview-skills" className="mt-4 inline-block text-[14px] font-medium text-violet-d hover:underline">See the complete daily routine →</Link>
            </div>
          </div>
        </div>
      </section>
"""
def landing(s,p):
    if PILLARS not in s:
        s=s.replace('      <section className="border-t border-line bg-canvas">',PILLARS+'\n      <section className="border-t border-line bg-canvas">',1)
    s=replace_exact(s,'16 frameworks, 15 original cases with model answers, and timed drills.', '16 visual frameworks, 15 original cases, 64 graph-reading exercises, timed drills, and daily habits for clearer thinking and communication.',p)
    s=replace_exact(s,'<Link to="/learn" className="hidden hover:text-ink sm:inline">Course</Link>', '<Link to="/learn" className="hidden hover:text-ink sm:inline">Start here</Link>',p)
    return s
transform('src/pages/Landing.tsx',landing)

LEARN="""      <section className="mb-8 grid gap-4 md:grid-cols-2" aria-label="The two parts of case preparation">
        <div className="rounded-xl border border-line border-t-4 border-t-teal bg-white p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-teal-d">Pillar 1 · Solve the case</p>
          <h2 className="mt-2 text-[21px] font-semibold">Case mechanics</h2>
          <p className="mt-2 text-[14.5px] text-muted">Start with the lessons below. Then study the 10-stage perfect-casing guide, learn to make your own framework, practise 64 original charts, and solve full cases out loud.</p>
          <div className="mt-3 flex flex-wrap gap-3 text-[13.5px] font-medium text-violet-d"><Link to="/perfect-casing">Perfect casing →</Link><Link to="/frameworks">Frameworks →</Link><Link to="/graphs">Graph library →</Link></div>
        </div>
        <div className="rounded-xl border border-line border-t-4 border-t-violet bg-white p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-violet-d">Pillar 2 · Perform well</p>
          <h2 className="mt-2 text-[21px] font-semibold">Interview skills</h2>
          <p className="mt-2 text-[14.5px] text-muted">Practise mental maths and recall, warm up your speech, learn business language and rehearse your stories. Learn exactly how Elevate, Peak, SpeechOn, Shark Tank and business books fit into a sensible routine.</p>
          <Link to="/interview-skills" className="mt-3 inline-block text-[13.5px] font-medium text-violet-d hover:underline">Read the interview skills guide →</Link>
        </div>
      </section>
"""
START = '''      <section className="mb-6 rounded-xl border border-line bg-white p-5">
        <h2 className="text-[20px] font-semibold">Not sure where to start? Follow this path.</h2>
        <p className="mt-1 text-[14.5px] text-muted">You do not have to read every resource on day one. Use the lessons to understand the process, then do a little practice and record what needs improving.</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['1. Learn', 'Read one course lesson and say the example answer aloud.', '/learn/how-case-interviews-work', 'Start lesson 1'],
            ['2. See it', 'Study a visual framework and understand why each branch matters.', '/frameworks', 'Explore frameworks'],
            ['3. Practise', 'Try a timed graph, structure or calculation and explain the insight.', '/graphs', 'Try graph exercises'],
            ['4. Improve', 'Log a practice case. Name one mistake and what you will do differently.', '/signin?next=/cases', 'Start a case log'],
          ].map(([title, detail, url, cta]) => <li key={title} className="rounded-lg bg-canvas p-4"><h3 className="font-sans text-[15px] font-semibold text-ink">{title}</h3><p className="mt-1 text-[13.5px] text-muted">{detail}</p><Link to={url} className="mt-3 inline-block text-[13px] font-medium text-violet-d hover:underline">{cta} →</Link></li>)}
        </ol>
      </section>'''
def learn(s,p):
    s=replace_exact(s,'      <div className="space-y-8">',START+'\n'+LEARN+'\n      <div className="space-y-8">',p)
    return s
transform('src/pages/Learn.tsx',learn)

FRAMEWORK_GUIDE="""      <section className="mb-6 rounded-xl border border-line bg-white p-5">
        <h2 className="text-[20px] font-semibold">How to learn a framework without memorising a script</h2>
        <p className="mt-1 text-[14.5px] text-muted">A framework is a starting point, not the final answer. Your job is to create a structure that fits the client and the exact question.</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['1. Read the question', 'What is the client trying to decide or fix? Is this a diagnosis or a decision?'],
            ['2. Study the visual tree', 'See how a big question breaks into smaller questions that can be tested with evidence.'],
            ['3. Make it specific', 'Rename each branch with the client, product, customer and geography in mind.'],
            ['4. State a hypothesis', 'Explain which branch you would test first, why it matters and what data you need.'],
          ].map(([title,detail]) => <li key={title} className="rounded-lg bg-canvas p-3"><h3 className="font-sans text-[14px] font-semibold text-ink">{title}</h3><p className="mt-1 text-[13.5px] text-muted">{detail}</p></li>)}
        </ol>
        <p className="mt-4 text-[14px] text-ink-2">Example: if a coffee chain's profit fell after adding delivery, don't simply list “revenue and cost.” Ask whether delivery orders are replacing profitable store sales, how commissions change profit per order and whether delivery attracts new customers. <Link to="/drills?tab=structure" className="font-medium text-violet-d hover:underline">Try a two-minute structure drill →</Link></p>
      </section>
"""
def frameworks(s,p):
    s=replace_exact(s,'      <Tabs value={tab} onChange={(v) => setParams({ tab: v })}',FRAMEWORK_GUIDE+'      <Tabs value={tab} onChange={(v) => setParams({ tab: v })}',p)
    return s
transform('src/pages/Frameworks.tsx',frameworks)

TRACKER_GUIDE="""      <section className="mb-5 rounded-xl border border-line bg-white p-5">
        <h2 className="text-[20px] font-semibold">Why you are tracking two kinds of practice</h2>
        <p className="mt-1 text-[14.5px] text-muted">A strong interview needs two things. First, you must know how to solve a case. Second, you must be able to think, speak and make business decisions clearly while someone is watching. Your tracker keeps both visible.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-teal-l/60 p-4"><h3 className="font-sans font-semibold text-teal-d">Case mechanics (first 4 columns)</h3><p className="mt-1 text-[14px] text-ink-2">Live case: practise with another person. Self case: solve one alone, out loud. Drill: focus on structures, graphs or maths. Review: read the mistake you want to fix before your next case.</p><Link to="/graphs" className="mt-2 inline-block text-[13.5px] font-medium text-violet-d hover:underline">Practise graph interpretation →</Link></div>
          <div className="rounded-lg bg-violet-l/60 p-4"><h3 className="font-sans font-semibold text-violet-d">Interview skills (last 4 columns)</h3><p className="mt-1 text-[14px] text-ink-2">Mind: practise recall or mental maths, optionally with Elevate or Peak. Voice: warm up with SpeechOn and speak a conclusion aloud. Reading: learn business ideas from books, Shark Tank or CEO interviews. FIT: practise personal stories.</p><Link to="/interview-skills" className="mt-2 inline-block text-[13.5px] font-medium text-violet-d hover:underline">Read the full routine →</Link></div>
        </div>
        <p className="mt-3 text-[13.5px] text-muted">Start with a realistic routine. It is better to complete a few habits consistently and reflect on mistakes than to tick every box without learning.</p>
      </section>
"""
def tracker(s,p):
    s=replace_exact(s,'      <div className="overflow-x-auto rounded-xl border border-line bg-white">',TRACKER_GUIDE+'      <div className="overflow-x-auto rounded-xl border border-line bg-white">',p)
    if "import { Link } from 'react-router-dom'" not in s:
        s="import { Link } from 'react-router-dom'\n"+s
    return s
transform('src/pages/Tracker.tsx',tracker)

DRILLS="""      <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">
        <div><h2 className="font-sans text-[16px] font-semibold text-ink">Unfamiliar graphs make you nervous?</h2><p className="mt-1 text-[14px] text-muted">Start with our separate 64-exercise chart library. Familiarise yourself with eight formats and practise saying the business insight out loud before using timed case exhibits.</p></div>
        <Link to="/graphs" className="rounded-lg border border-line px-4 py-2 text-[14px] font-medium text-violet-d hover:border-violet">Open the graph library →</Link>
      </section>
"""
def drills(s,p):
    s=replace_exact(s,'      <dl className="mb-6 grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:flex-wrap">',DRILLS+'      <dl className="mb-6 grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:flex-wrap">',p)
    return s
transform('src/pages/Drills.tsx',drills)

# Update SEO description without modifying the existing visual design.
def meta(s,p):
    s=replace_exact(s,'Case interview prep that trains both halves of the interview: solving the case and coming across well. Track your habits, log every case, practise with 15 original cases and timed drills.', 'A clear two-pillar case interview prep course: learn frameworks and perfect casing, practise 64 original chart exhibits, build interview skills and track progress.',p)
    return s
transform('index.html',meta)

# Apply only after every marker has been validated. No half-applied patches.
for rel,content in changes.items():
    f=ROOT/rel
    if f.read_text(encoding='utf8') != content:
        f.write_text(content,encoding='utf8')
        print('Updated',rel)
    else:print('Already current',rel)
print('Learning update integrated. Next: npm install && npm run build')
