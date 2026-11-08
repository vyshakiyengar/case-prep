"""Public sector and social impact. Concepts from CaseCraft #086-#090; rewritten so each case ranks options on cost per outcome."""
from lib import *
CASES = []

# ---------------------------------------------------------------- Riverside homelessness (medium)
def riverside():
    budget = 10.0                                   # $M
    prev_cost, prev_rate, prev_cap = 2500.0, 0.40, 1500
    rehouse_cost, rehouse_rate = 9000.0, 0.75
    cpo_prev = prev_cost / prev_rate
    cpo_re = rehouse_cost / rehouse_rate
    spend_prev = prev_cap * prev_cost / 1e6
    out_prev = prev_cap * prev_rate
    left = budget - spend_prev
    n_re = left * 1e6 / rehouse_cost
    out_re = n_re * rehouse_rate
    total = out_prev + out_re
    out_alt = budget * 1e6 / rehouse_cost * rehouse_rate
    assert cpo_prev < cpo_re and total > out_alt
    return C(
        "Riverside City", "$10M to reduce homelessness: where should it go?",
        "Public sector", "Local government", "United States", 2,
        """Riverside, a mid-sized US city, has $10M of new funding to reduce homelessness this year. The council is choosing between programmes. Most of the money has traditionally gone to emergency shelters.
        The mayor's office asks you how to get the most people into stable housing.""",
        [("Options?", "(1) Emergency shelter beds. (2) Rapid rehousing: help with a deposit and a year of rent support, about $9,000 per household. (3) Prevention: one-off grants to households about to be evicted, about $2,500 each."),
         ("Results?", "Shelters give a bed but few people move on to stable housing from them alone. 75% of rapid-rehousing households are still housed after a year. Prevention grants keep about 40% of households from becoming homeless who otherwise would have."),
         ("Limits?", "Caseworkers can identify about 1,500 households at real risk of eviction this year."),
         ("Goal?", "Number of households in stable housing a year from now.")],
        ("How should Riverside spend $10M to maximise households in stable housing?", [
            ("Define the outcome", ["Households stably housed after a year"]),
            ("Cost per outcome", ["Prevention", "Rapid rehousing", "Shelter"]),
            ("Limits on each programme", ["How many can be reached"]),
            ("Allocation", ["Cheapest per outcome first, up to its limit"]),
        ]),
        "Prevention is usually cheapest per household kept housed, but only works for people we can find in time. I'd rank programmes on cost per outcome and fill the cheapest first.",
        [
            Q("What is the cost per household stably housed for prevention and rehousing?",
              f"""<p>Prevention: $2,500 ÷ 40% = <b>${num(cpo_prev)}</b> per household kept housed. Rapid rehousing: $9,000 ÷ 75% = <b>${num(cpo_re)}</b>.</p>
              <p>Shelters provide safety tonight but, on their own, produce few stable outcomes, so they are a different goal: keep enough beds for emergencies, but they shouldn't get the new money.</p>""",
              note="The key move: measure cost per outcome, not cost per person served."),
            Q("How would you allocate the $10M?",
              f"""<p>Fund prevention first, up to its limit: 1,500 × $2,500 = ${spend_prev:.2f}M, keeping about {out_prev:.0f} households housed.</p>
              <p>The remaining ${left:.2f}M funds {n_re:.0f} rapid-rehousing places, housing about {out_re:.0f}. <b>Total: about {num(total)} households.</b></p>
              <p>All $10M on rehousing would house about {out_alt:.0f}.</p>""",
              T(["Programme", "Spend ($M)", "Households helped", "Stably housed"], [["Prevention", f"{spend_prev:.2f}", num(prev_cap), f"{out_prev:.0f}"],
                 ["Rapid rehousing", f"{left:.2f}", f"{n_re:.0f}", f"{out_re:.0f}"], ["Total", f"{budget:.2f}", "", f"{total:.0f}"]], title="Exhibit 1 · Proposed allocation", bold_last=True)),
            Q("What might the council push back on, and how would you respond?",
              """<ul><li><b>"People sleeping rough need beds tonight."</b> True: protect existing shelter funding; this new money is for lasting exits.</li>
              <li><b>"How do we know prevention worked?"</b> Track households for 12 months; the 40% figure must be tested locally.</li>
              <li><b>"Will landlords take rehousing tenants?"</b> Build a landlord partnership with guarantees for damage.</li></ul>"""),
        ],
        f"""Put the new $10M into prevention first, then rapid rehousing. Prevention costs about ${num(cpo_prev)} per household kept housed, against ${num(cpo_re)} for rehousing; funding all 1,500 at-risk households
        (${spend_prev:.2f}M) and putting the rest into rehousing would leave about {num(total)} households stably housed, against about {out_alt:.0f} if everything went to rehousing. Keep existing shelter funding for emergencies.
        Risk: the 40% prevention rate is an estimate, so track outcomes for a year. Next step: set up eviction referral links with courts and landlords.""",
        ["Defines a clear outcome", "Compares cost per outcome, not per person served",
         "Funds the cheapest programme up to its limit", "Handles political objections respectfully"],
        "Public sector · cost-effectiveness · budget allocation")

CASES.append(riverside())

# ---------------------------------------------------------------- Diabetes screening (medium)
def screening():
    pop, prev_all = 1.2, 0.06                       # M adults 40+, share with undiagnosed diabetes
    cost = 30.0                                      # $ per test
    risk_share, prev_risk = 0.30, 0.14
    found_all = pop * prev_all
    found_risk = pop * risk_share * prev_risk
    cost_all = pop * cost
    cost_risk = pop * risk_share * cost
    cpc_all = cost_all / found_all
    cpc_risk = cost_risk / found_risk
    uptake = 0.6
    assert cpc_risk < cpc_all and found_risk / found_all > 0.6
    return C(
        "Ministry of Health", "Screen everyone over 40, or only people at high risk?",
        "Public sector", "Public health", "New Zealand", 2,
        """A national health ministry wants to find people with undiagnosed type 2 diabetes earlier, before complications. It has 1.2 million adults over 40.
        One proposal is to offer a blood test to all of them; another is to test only those at high risk, using a short questionnaire at GP visits. You're asked which is better value.""",
        [("Prevalence?", "About 6% of adults over 40 have undiagnosed diabetes. Among the 30% classed as high risk (weight, family history, age), it's about 14%."),
         ("Cost?", "About $30 per test including the nurse's time; the questionnaire is free."),
         ("Uptake?", "About 60% of people invited usually come for a test.")],
        ("Which screening approach gives the best value?", [
            ("Cases found", ["People tested × prevalence"]),
            ("Cost", ["Tests × cost per test"]),
            ("Cost per case found", ["Universal vs targeted"]),
            ("Equity", ["Who gets missed?"]),
        ]),
        "Targeting tests people more likely to have diabetes, so each case found should cost much less. The question is how many cases targeting misses.",
        [
            Q("Compare the two approaches on cases found and cost per case found (ignore uptake for now).",
              f"""<p><b>Everyone:</b> 1.2M × $30 = ${cost_all:.0f}M; cases found 1.2M × 6% = {found_all*1000:.0f}k: <b>${cpc_all:.0f} per case</b>.</p>
              <p><b>High risk only:</b> 360k × $30 = ${cost_risk:.1f}M; cases 360k × 14% = {found_risk*1000:.1f}k: <b>${cpc_risk:.0f} per case</b>.</p>
              <p>Targeting finds {pct(found_risk/found_all)} of the cases for {pct(cost_risk/cost_all)} of the cost.</p>""",
              T(["", "Everyone over 40", "High risk only"], [["People tested", "1,200k", "360k"], ["Cost ($M)", f"{cost_all:.0f}", f"{cost_risk:.1f}"],
                 ["Cases found", f"{found_all*1000:.0f}k", f"{found_risk*1000:.1f}k"], ["Cost per case found ($)", f"{cpc_all:.0f}", f"{cpc_risk:.0f}"]], title="Exhibit 1 · Screening options")),
            Q("Does uptake change the comparison?",
              f"""<p>At 60% uptake both approaches find 60% as many cases at 60% of the cost, so cost per case is unchanged. But targeting through GP visits may get higher uptake,
              because a doctor is recommending it.</p>"""),
            Q("Who would targeting miss, and what would you do about it?",
              f"""<p>About {pct(1-found_risk/found_all)} of cases are in people not classed as high risk, and groups that rarely visit a GP would be missed. Add community testing in areas with high rates of diabetes
              and low GP use, and review the risk questionnaire every year.</p>"""),
        ],
        f"""Test people at high risk first. Targeting finds about {pct(found_risk/found_all)} of undiagnosed cases for {pct(cost_risk/cost_all)} of the cost: about ${cpc_risk:.0f} per case found against ${cpc_all:.0f} for testing everyone over 40.
        Use the money saved for community testing where GP visits are rare, so targeting doesn't miss the groups most at risk of complications. Next step: build the questionnaire into GP systems and pilot in two regions.""",
        ["Computes cost per case found for both options", "Shows how much targeting misses",
         "Checks whether uptake changes the answer", "Addresses equity for people who don't see a GP"],
        "Public health · cost per outcome · targeting vs coverage")

CASES.append(screening())

# ---------------------------------------------------------------- Metro buses (medium-hard): free fares vs frequency
def buses():
    riders, fare_rev = 60.0, 30.0                   # M trips a year, $M fares
    free_up = 0.12
    freq_cost, freq_up = 30.0, 0.18
    new_free = riders * free_up
    new_freq = riders * freq_up
    cpn_free = fare_rev / new_free
    cpn_freq = freq_cost / new_freq
    low_share = 0.35
    assert cpn_freq < cpn_free
    return C(
        "Kestrel Metro", "Free buses, or more buses?",
        "Public sector", "Public transport", "United Kingdom", 2,
        """A city transport authority wants more people to take the bus instead of driving, to cut congestion and emissions. A popular proposal is to make buses free, costing $30M a year in lost fares.
        The authority could instead spend the same $30M running buses more often. You're asked which gets more new riders.""",
        [("Ridership today?", "60 million trips a year; fares bring in $30M."),
         ("Free fares?", "Studies of similar cities suggest about 12% more trips, but much of the increase comes from people who used to walk or cycle, not drive."),
         ("More frequent buses?", "$30M a year would raise frequency on the 20 busiest routes from every 12 minutes to every 6; similar changes elsewhere raised trips across the whole network by about 18%."),
         ("Equity?", "About 35% of riders are on low incomes.")],
        ("Which option attracts more new riders for $30M a year?", [
            ("New trips", ["Free fares", "Higher frequency"]),
            ("Cost per new trip", ["Lost fares vs extra operating cost"]),
            ("Quality of new trips", ["From cars, or from walking and cycling?"]),
            ("Fairness", ["Help for low-income riders"]),
        ]),
        "Free fares spend most of the money on trips people already make. More frequent service attracts people who currently find the bus too slow, often drivers.",
        [
            Q("Compare new trips and cost per new trip.",
              f"""<p><b>Free fares:</b> 60M × 12% = {new_free:.1f}M new trips for $30M: <b>${cpn_free:.2f} per new trip</b>. And the $30M mostly subsidises the 60M trips already made.</p>
              <p><b>More frequent buses:</b> 60M × 18% = {new_freq:.1f}M new trips: <b>${cpn_freq:.2f} per new trip</b>.</p>""",
              BAR(["Free fares", "More frequent buses"], [r(new_free, 1), r(new_freq, 1)], title="Exhibit 1 · New trips a year (millions) for $30M", ylabel="M trips", fmt="{:.1f}", h=2.2, highlight=[1])),
            Q("Does it matter where the new riders come from?",
              """<p>Yes: the goal is fewer car trips. Evidence from cities with free fares is that many new trips replace walking and cycling. Frequency improvements mostly win people who found the bus too slow
              or unreliable, more of whom were driving. So the gap in car trips removed is likely even larger than the gap in new trips.</p>"""),
            Q("Free fares are popular and help low-income riders. How would you address that?",
              f"""<p>Offer free or half-price fares only to low-income riders (about 35%), through existing benefit cards: half-price for them costs about ${30*low_share*0.5:.1f}M plus about $2M to administer, well under $30M.
              Combine that with frequency increases funded by the rest, if the budget allows.</p>"""),
        ],
        f"""Spend the $30M on more frequent buses, not free fares. More frequent service would add about {new_freq:.1f}M trips a year at about ${cpn_freq:.2f} each, against {new_free:.1f}M at ${cpn_free:.2f} for free fares,
        and more of those new riders would otherwise drive. To help low-income riders, offer targeted discounts through benefit cards for a fraction of the cost. Risk: frequency gains take time to show,
        so publicise the new timetable. Next step: model frequency increases route by route.""",
        ["Compares cost per new trip, not total riders", "Asks where new riders come from (the real goal)",
         "Keeps the equity aim with a cheaper targeted option", "Phrases the answer for a political audience"],
        "Public sector · policy options · cost per outcome")

CASES.append(buses())

# ---------------------------------------------------------------- Lakeside schools (hard): tutoring vs smaller classes
def lakeside():
    students = 10000
    below = 0.40
    tut_cost, tut_effect = 1200.0, 0.30             # $ per student tutored, share of tutored students who reach the standard who wouldn't otherwise
    cls_cost_per_student, cls_effect = 700.0, 0.06  # per student in the district
    budget = 4.8                                     # $M
    n_tut = budget * 1e6 / tut_cost
    reach_tut = n_tut * tut_effect
    cls_students = budget * 1e6 / cls_cost_per_student
    reach_cls = cls_students * cls_effect
    cpo_tut = tut_cost / tut_effect
    cpo_cls = cls_cost_per_student / cls_effect
    assert n_tut <= students * below and cpo_tut < cpo_cls
    return C(
        "Lakeside School District", "Tutoring or smaller classes?",
        "Public sector", "Education", "United States", 3,
        """Lakeside school district has 10,000 primary students; 40% are below the reading standard for their age. A $4.8M state grant must be used to raise reading results this year.
        Teachers' representatives want smaller classes. The superintendent has seen research on small-group tutoring. You're asked which plan would bring more students up to standard.""",
        [("Tutoring?", "Three sessions a week in groups of three with trained tutors, for students below standard: about $1,200 per student a year. Local pilots: about 30% of tutored students reached the standard who otherwise wouldn't."),
         ("Smaller classes?", "Cutting class sizes from 28 to 24 costs about $700 per student covered a year (more teachers and rooms). Research suggests about 6% more of the students covered reach the standard."),
         ("Constraints?", "Tutors can be recruited within a term; extra classrooms aren't available in some schools.")],
        ("Which plan brings more students up to the reading standard?", [
            ("Outcome", ["Students reaching standard who otherwise wouldn't"]),
            ("Cost per outcome", ["Tutoring", "Smaller classes"]),
            ("Reach and feasibility", ["Who each plan covers", "Hiring and space"]),
            ("Stakeholders", ["Teachers", "Parents"]),
        ]),
        "Tutoring targets the students who need help, so each dollar should go further. Smaller classes spread money across all students, most of whom are already at standard.",
        [
            Q("Compare cost per extra student reaching the standard.",
              f"""<p><b>Tutoring:</b> $1,200 ÷ 30% = <b>${num(cpo_tut)}</b> per student who reaches the standard.</p>
              <p><b>Smaller classes:</b> $700 ÷ 6% = <b>${num(cpo_cls, -2)}</b>.</p>
              <p>Tutoring is about {cpo_cls/cpo_tut:.1f}× as cost-effective.</p>"""),
            Q("What would $4.8M achieve under each plan?",
              f"""<p><b>Tutoring:</b> $4.8M ÷ $1,200 = {num(n_tut)} students tutored (all of them below standard; there are {num(students*below)}), of whom about <b>{num(reach_tut)}</b> reach the standard.</p>
              <p><b>Smaller classes:</b> $4.8M ÷ $700 = {num(cls_students)} students covered; about <b>{num(reach_cls)}</b> more reach the standard.</p>""",
              BAR(["Tutoring", "Smaller classes"], [round(reach_tut), round(reach_cls)], title="Exhibit 1 · Extra students reaching the reading standard", ylabel="Students", h=2.2, highlight=[0])),
            Q("Teachers argue smaller classes help every child, not just those behind. How do you respond?",
              """<p>They're right that smaller classes have wider benefits, like behaviour and teacher workload, that this measure doesn't capture. But this grant's goal is reading results, and tutoring delivers far more of them.
              Involve teachers: let them choose which students are tutored and align tutoring with classroom lessons. Revisit class sizes if longer-term funding comes.</p>"""),
        ],
        f"""Fund small-group tutoring. It costs about ${num(cpo_tut)} per extra student reaching the reading standard, against about ${num(cpo_cls, -2)} for smaller classes, so the $4.8M would bring about {num(reach_tut)} students up to standard
        rather than about {num(reach_cls)}. Tutoring also targets the students who are behind and can start within a term, while extra classrooms aren't available everywhere. Involve teachers in choosing students and linking tutoring to lessons.
        Risk: tutor quality, so train and monitor them. Next step: recruit tutors and test students at the start and end of the year.""",
        ["Defines the outcome precisely", "Computes cost per outcome for both plans",
         "Notes that one plan targets the students in need", "Engages the teachers' argument rather than dismissing it"],
        "Public sector · cost-effectiveness · stakeholder management", fmt="Candidate-led")

CASES.append(lakeside())
