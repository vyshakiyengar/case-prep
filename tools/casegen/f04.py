"""Pricing. Concepts from CaseCraft #016, #017, #018, #020; rewritten from scratch."""
from lib import *
CASES = []

# ---------------------------------------------------------------- Paloma Streaming (easy)
def paloma():
    subs = 180.0          # k
    p0, p1, vc = 6.99, 8.49, 1.50
    loss = 0.10
    m0 = subs * (p0 - vc); m1 = subs * (1 - loss) * (p1 - vc)       # $ k per month
    max_loss = 1 - (p0 - vc) / (p1 - vc)
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
    hist = [150, 152, 147, 141, 140, 143, 146, 149]   # k subscribers around a 2023 rise in March
    return C(
        "Paloma Streaming", "Should a niche streaming service raise its price?",
        "Pricing", "Digital media", "Spain", 1,
        """Paloma is a Spanish streaming service for independent and classic cinema with 180,000 subscribers paying $6.99 a month.
        Content costs are rising and the CEO wants to raise the price to $8.49. She asks whether it's a good idea.""",
        [("Cost per subscriber?", "About $1.50 a month: streaming, payment fees and per-view royalties."),
         ("What happened last time prices rose?", "Paloma raised the price two years ago, by a similar proportion (about 20%). The interviewer has the subscriber data."),
         ("Competitors?", "The big streaming platforms cost more but have little classic or independent film."),
         ("Objective?", "Higher monthly profit, without damaging the brand.")],
        ("Does the price rise increase profit?", [
            ("Margin per subscriber", ["New price minus cost per subscriber"]),
            ("Subscribers", ["How many cancel because of the rise", "Engaged vs casual viewers"]),
            ("Longer-term effects", ["Fewer new sign-ups", "Brand and word of mouth"]),
        ]),
        "Paloma's subscribers are film enthusiasts with few alternatives, so I expect low price sensitivity. The rise likely pays off unless more than about a fifth of subscribers leave.",
        [
            Q("Here is what happened to subscribers after the last price rise, announced in March. What do you take from it?",
              f"""<p>Subscribers fell about {pct(1-min(hist)/hist[1])} over three months, from {hist[1]}k to {min(hist)}k, then recovered most of the loss within five months.</p>
              <p><b>So-what:</b> customers react, but the core audience stays. The real risk is the short-term dip, not a permanent loss.</p>""",
              LINE(months, {"Subscribers (k)": hist}, title="Exhibit 1 · Subscribers around the last price rise (k)", ylabel="k", h=2.3)),
            Q(f"If {pct(loss)} of subscribers cancel, does the rise pay off? How many could cancel before it stops paying?",
              f"""<p>Monthly margin today: 180k × (${p0} − ${vc:.2f}) = <b>${num(m0)}k</b>.</p>
              <p>After: {num(subs*(1-loss))}k × (${p1} − ${vc:.2f}) = <b>${num(m1)}k</b>, +${num(m1-m0)}k a month (about ${num((m1-m0)*12/1000, 1)}M a year).</p>
              <p>Break-even loss: 1 − {p0-vc:.2f} ÷ {p1-vc:.2f} = <b>{pct(max_loss, 1)}</b>. Paloma can lose about 1 in 5 subscribers and still be no worse off.</p>
              <p><b>So-what:</b> with last time's dip of about {pct(1-min(hist)/hist[1])}, there's a wide safety margin.</p>"""),
            Q("How would you roll it out?",
              """<ul><li><b>Explain why</b>: more films, restored classics, better subtitles</li>
              <li><b>Annual plan</b> at a modest discount (e.g. $89 a year, about 13% off 12 × $8.49, and still above today's $83.88) to lock in loyal subscribers</li>
              <li><b>Keep existing subscribers at the old price for three months</b> to soften the dip</li>
              <li><b>Watch new sign-ups</b>, not just cancellations: the higher price may slow growth</li></ul>"""),
        ],
        f"""Raise the price to ${p1}. Even if {pct(loss)} of subscribers cancel, monthly margin rises by about ${num(m1-m0)}k, and the rise only stops paying if more than {pct(max_loss, 1)}
        leave; last time the dip was about {pct(1-min(hist)/hist[1])} and mostly recovered. Pair it with an annual plan and a three-month grace period for existing subscribers.
        Risk: slower sign-ups from new viewers. Next step: track cancellations and sign-ups weekly for three months after launch.""",
        ["Reads the chart for both the dip and the recovery", "Computes break-even churn, not just one scenario",
         "Thinks about sign-ups as well as cancellations", "Proposes a rollout that softens the reaction"],
        "Price elasticity · break-even volume loss")

CASES.append(paloma())

# ---------------------------------------------------------------- Forge Valves (medium, value-based)
def forge():
    vol = 24.0           # k valves
    p, vc0, infl = 1800.0, 740.0, 60.0
    vc = vc0 + infl
    seg = {"Critical service": 0.30, "General service": 0.70}
    base = vol * (p - vc) / 1000             # $ M with inflation absorbed
    before = vol * (p - vc0) / 1000
    # Option A: +11% everywhere, 12% volume loss overall
    pa, la = p * 1.11, 0.12
    A = vol * (1 - la) * (pa - vc) / 1000
    # Option B: critical +15% (2% loss), general + $60 pass-through (3% loss)
    pc, lc = p * 1.15, 0.02
    pg, lg = p + infl, 0.03
    B = (vol * seg["Critical service"] * (1 - lc) * (pc - vc) + vol * seg["General service"] * (1 - lg) * (pg - vc)) / 1000
    downtime = 250000
    return C(
        "Forge Valves", "Material costs are up. How should a valve maker price?",
        "Pricing", "Industrial equipment", "Germany", 2,
        """Forge makes industrial valves for chemical plants and water utilities, selling about 24,000 a year at an average $1,800. Steel and alloy costs
        have risen $60 per valve. The sales director wants an 11% price increase across the board. The CFO asks you to check whether that is the best approach.""",
        [("Customers?", "Two groups: critical-service valves for chemical plants (30% of volume), and general-service valves for utilities and building systems (70%). Both groups average about $1,800 a valve today."),
         ("What does failure cost a chemical plant?", "An unplanned shutdown costs a typical customer about $250,000."),
         ("Competition?", "In general service, several cheaper Asian and Eastern European competitors. In critical service, Forge has a strong reliability record."),
         ("Cost per valve?", "$740 before the increase, $800 now.")],
        ("How should Forge price to protect profit?", [
            ("Cost increase", ["$60 per valve", "Absorb, pass on, or more?"]),
            ("Customer segments", ["Critical service: value of reliability", "General service: price competition"]),
            ("Volume response", ["Expected loss by segment at each price"]),
        ]),
        "A blanket increase treats very different customers the same. Critical-service customers value reliability far above the valve price, so they can take more; general-service customers will switch.",
        [
            Q("What happens to annual contribution if Forge does nothing, and if it applies the 11% increase everywhere (sales expects 12% fewer valves)?",
              f"""<p>Before the cost rise: 24k × ($1,800 − $740) = ${before:.1f}M. Absorbing the $60: 24k × ${p-vc:,.0f} = <b>${base:.1f}M</b> (−${before-base:.2f}M).</p>
              <p>+11% everywhere: price ${pa:,.0f}; {num(vol*(1-la), 2)}k valves × (${pa:,.0f} − $800) = <b>${A:.2f}M</b>.</p>
              <p><b>So-what:</b> the blanket rise beats absorbing the cost, but loses {pct(la)} of volume, most likely in general service, where competitors are cheaper.</p>"""),
            Q("Now consider a segmented approach: +15% on critical service (expected volume loss 2%) and pass through only the $60 on general service (loss 3%).",
              f"""<ul><li>Critical: {num(vol*seg['Critical service']*(1-lc), 2)}k × (${pc:,.0f} − $800) = ${vol*seg['Critical service']*(1-lc)*(pc-vc)/1000:.2f}M</li>
              <li>General: {num(vol*seg['General service']*(1-lg), 2)}k × (${pg:,.0f} − $800) = ${vol*seg['General service']*(1-lg)*(pg-vc)/1000:.2f}M</li></ul>
              <p>Total: <b>${B:.2f}M</b>, versus ${A:.2f}M for the blanket rise: <b>{signed(B-A, 2, '$', 'M')}</b>, while keeping almost all volume.</p>
              <p><b>So-what:</b> price to value where customers value reliability, and pass on cost where they shop on price.</p>""",
              T(["", "Do nothing", "+11% everywhere", "Segmented"], [["Contribution ($M)", f"{base:.2f}", f"{A:.2f}", f"{B:.2f}"],
                 ["Valves sold (k)", f"{vol:.1f}", f"{vol*(1-la):.1f}", f"{vol*(seg['Critical service']*(1-lc)+seg['General service']*(1-lg)):.1f}"]],
                title="Exhibit 1 · Three pricing options", note="Cost per valve $800 in all options.")),
            Q("A critical-service valve now costs $2,070. How would you justify that to a chemical plant buyer?",
              f"""<p>One unplanned shutdown costs about ${num(downtime)}, more than 100 valves. If Forge's reliability avoids even one failure over the life of a plant's valves,
              the price difference pays for itself many times over.</p>
              <ul><li>Show field failure rates versus competitors</li><li>Offer a performance warranty or faster emergency replacement</li><li>Bundle inspection services</li></ul>"""),
        ],
        f"""Don't raise prices 11% across the board. Instead raise critical-service prices 15% and pass through only the $60 cost on general service: contribution of about ${B:.1f}M versus
        ${A:.1f}M for the blanket rise, with far less volume lost. Back the critical-service price with reliability data and a performance warranty.
        Risk: competitors improve reliability over time. Next step: brief the sales team on value-selling to the top 20 chemical-plant accounts.""",
        ["Separates segments with different price sensitivity", "Compares options on contribution, not revenue",
         "Links price to the customer's cost of failure", "Keeps the volume base in competitive segments"],
        "Value-based pricing · segmentation · cost pass-through")

CASES.append(forge())

# ---------------------------------------------------------------- Cobalt Museums (medium, public mission)
def cobalt():
    vis = 900.0                 # k visitors per year
    peak_sh, off_sh = 0.60, 0.40
    p0, vc = 18.0, 3.0
    pp, po = 24.0, 14.0
    dp, do = -0.08, 0.15
    peak0, off0 = vis * peak_sh, vis * off_sh
    peak1, off1 = peak0 * (1 + dp), off0 * (1 + do)
    m0 = vis * (p0 - vc) / 1000
    m1 = (peak1 * (pp - vc) + off1 * (po - vc)) / 1000
    v1 = peak1 + off1
    return C(
        "Cobalt Museums", "Raise income without turning visitors away",
        "Pricing", "Arts and tourism", "Italy", 2,
        """Cobalt manages three city-owned museums in Bologna, with 900,000 paying visitors a year at a single $18 ticket (free first-Sunday visits for residents are extra). The city wants more income to fund
        restoration, but the museums' mission is broad public access, and weekend queues are already long. The director asks you to design a better price structure.""",
        [("When do people visit?", "60% of visits are at peak times (weekends, holidays); 40% off-peak (weekday mornings)."),
         ("Constraints?", "Total visitor numbers must not fall. Free first Sundays for residents must stay."),
         ("Costs per visitor?", "About $3: ticketing, cleaning, guides."),
         ("Proposal?", "Peak tickets at $24, off-peak at $14, booked in time slots.")],
        ("Can a new price structure raise income and keep access?", [
            ("Income", ["Visitors by time slot", "Price by time slot"]),
            ("Visitor response", ["Peak visitors who drop out", "Off-peak visitors gained (shifted or new)"]),
            ("Mission", ["Total visitors", "Access for residents and low-income groups", "Peak crowding"]),
        ]),
        "Peak visitors are mostly tourists with fixed plans, so they're less price-sensitive; cheaper weekday tickets can pull locals and students in. Income could rise and crowding fall at the same time.",
        [
            Q(f"Research suggests peak visits fall {pct(-dp)} at $24 and off-peak visits rise {pct(do)} at $14. Calculate visitors and contribution, before and after.",
              f"""<p>Today: 900k × ($18 − $3) = <b>${m0:.2f}M</b>.</p>
              <p>After: peak {num(peak0)}k → {num(peak1)}k at $21 margin; off-peak {num(off0)}k → {num(off1)}k at $11 margin.</p>
              <p>Contribution: <b>${m1:.2f}M</b> ({signed(m1-m0, 2, '$', 'M')}, {pct(m1/m0-1)}). Visitors: <b>{num(v1)}k</b> ({signed(v1-vis, 0)}k).</p>
              <p><b>So-what:</b> more income, slightly more visitors, and {num(peak0-peak1)}k fewer people in the weekend queues. It meets the city's conditions.</p>""",
              BAR(["Peak", "Off-peak"], {"Today (k visitors)": [peak0, off0], "Proposed (k visitors)": [peak1, off1]},
                  title="Exhibit 1 · Visitors by time slot (k)", ylabel="k visitors", h=2.4)),
            Q("Critics say $24 shuts out families. How would you protect access?",
              """<ul><li>Keep <b>free first Sundays</b> for residents, with timed booking so they don't queue</li>
              <li><b>Under-18s free</b> and student tickets at the off-peak price at any time</li>
              <li>A <b>resident annual pass</b> (e.g. $30) valid at any time</li>
              <li>Publish the income raised and the restorations it pays for</li></ul>"""),
            Q("What would make you less confident in the forecast?",
              """<ul><li>Off-peak growth may come mainly from people switching days, not new visitors: income still rises, but total visits might not</li>
              <li>Tour groups may book elsewhere if they lose flexibility</li><li>Bad weather and events shift demand between slots</li></ul>
              <p>Test it for a summer season before making it permanent.</p>"""),
        ],
        f"""Introduce peak and off-peak pricing: $24 at weekends and holidays, $14 on weekday mornings, in timed slots. On the research estimates, contribution rises from ${m0:.1f}M to ${m1:.1f}M,
        total visitors rise to about {num(v1)}k and weekend crowding falls. Protect access with free first Sundays, free entry for under-18s and a low-cost resident pass.
        Risk: off-peak growth may be smaller if it's mostly people switching days. Next step: pilot for one summer season and measure visits by slot.""",
        ["Respects the public mission as a constraint", "Calculates both income and visitor numbers",
         "Uses price to spread demand, not just raise income", "Builds in protections for access"],
        "Peak pricing · public sector objectives", fmt="Candidate-led")

CASES.append(cobalt())

# ---------------------------------------------------------------- Solstice Ski School (hard, capacity-constrained)
def solstice():
    places = 1280          # lesson places per day (80 instructors × 2 classes × 8)
    peak_days, off_days = 30, 90
    p0, vc = 95.0, 30.0
    peak_d0, off_d0 = 2000, 800
    fixed = 1.2            # $M
    def prof(pp, po, peak_d, off_d):
        return ((pp - vc) * min(peak_d, places) * peak_days + (po - vc) * min(off_d, places) * off_days) / 1e6 - fixed
    base = prof(p0, p0, peak_d0, off_d0)
    blanket = prof(p0 * 1.12, p0 * 1.12, peak_d0 * 0.90, off_d0 * 0.83)
    curve = [(95, 2000), (110, 1750), (120, 1560), (130, 1380), (140, 1200)]
    rows = [[f"${p}", num(d), num(min(d, places)), num((p - vc) * min(d, places))] for p, d in curve]
    best = max(curve, key=lambda x: (x[0] - vc) * min(x[1], places))
    peak_only = prof(best[0], p0, best[1], off_d0)
    peak_gain = (p0 * 1.12 - p0) * places * peak_days / 1e6
    off_change = ((p0 * 1.12 - vc) * off_d0 * 0.83 - (p0 - vc) * off_d0) * off_days / 1e6
    close(peak_gain + off_change, blanket - base)
    assert peak_gain > 0 > off_change
    return C(
        "Solstice Ski School", "Raise lesson prices: everywhere, or only when it's full?",
        "Pricing", "Travel and leisure", "Switzerland", 3,
        """Solstice runs group ski lessons in a large Swiss resort. Over Christmas, New Year and February half-term, every class is full and many families
        are turned away; in other weeks classes are half-empty. Management proposes a 12% increase on all lessons from $95 to about $106. Is that the right move?""",
        [("Capacity?", "80 instructors, each teaching two 8-person classes a day: 1,280 lesson places a day. More instructors can't be hired for the peak."),
         ("Season?", "30 peak days and 90 regular days."),
         ("Costs?", "About $30 per lesson place (instructor pay per class, equipment); $1.2M fixed."),
         ("Demand?", "About 2,000 requests a day at peak and 800 in regular weeks at today's price.")],
        ("How should Solstice change prices?", [
            ("Peak weeks", ["Demand vs capacity", "Effect of a price rise on places sold"]),
            ("Regular weeks", ["Demand well below capacity", "Price sensitivity"]),
            ("Structure", ["One price vs peak pricing", "Customer perception and fairness"]),
        ]),
        "At peak, demand is far above capacity, so a higher price won't reduce lessons sold. In regular weeks it will. I suspect a peak-only increase beats a blanket one.",
        [
            Q("Management expects the 12% rise to cut demand by 10% at peak and 17% in regular weeks. Compare profit with today.",
              f"""<p>Today: peak 1,280 places (capped) × $65 × 30 days + regular 800 × $65 × 90 days − $1.2M = <b>${base:.2f}M</b>.</p>
              <p>Blanket +12% (${p0*1.12:.1f}): peak demand 1,800 is still above capacity, so <b>1,280 places sell as before</b>; regular demand falls to {num(off_d0*0.83)}.</p>
              <p>Profit: <b>${blanket:.2f}M</b> ({signed(blanket-base, 2, '$', 'M')}). That is a gain of ${peak_gain:.2f}M at peak, where no lessons are lost,
              partly offset by {signed(off_change, 2, '$', 'M')} in regular weeks, where families drop out.</p>
              <p><b>So-what:</b> the blanket rise helps, but only because of the peak. In regular weeks it destroys value.</p>"""),
            Q("Here is estimated peak demand at different prices. What peak price maximises profit, with regular weeks left at $95?",
              f"""<p>Profit per peak day = (price − $30) × places sold, where places sold is capped at 1,280:</p>
              <p>At ${best[0]}: {num(min(best[1], places))} places × ${best[0]-vc:.0f} = <b>${num((best[0]-vc)*min(best[1], places))}</b> a day, the highest in the table.</p>
              <p>Season profit with peak at ${best[0]} and regular at $95: <b>${peak_only:.2f}M</b>, versus ${base:.2f}M today and ${blanket:.2f}M for the blanket rise.</p>
              <p><b>So-what:</b> raise peak prices sharply and leave regular weeks alone. Note that at ${best[0]} a few places go unfilled: at that point price, not capacity, limits sales.</p>""",
              T(["Peak price", "Peak demand per day", "Places sold (max 1,280)", "Profit per day ($)"], rows, title="Exhibit 1 · Peak-week demand curve"),
              note="The trap: candidates who ignore the capacity cap overstate the gain at low prices."),
            Q("What about regular weeks? Could a lower price help?",
              """<p>There are 480 empty places a day in regular weeks. Each extra place sold adds $65 at today's price. Options: discounted multi-day packages, school and club groups,
              bundling with lift-pass or hotel partners. Test whether a cut brings genuinely new customers rather than discounting people who'd come anyway.</p>"""),
            Q("Families complain that peak pricing is unfair. How do you handle it?",
              """<ul><li>Early-booking prices for peak weeks, so planners pay less</li><li>Price by week, published in advance (no surge pricing on the day)</li>
              <li>Keep a quota of places for local residents at the regular price</li></ul>"""),
        ],
        f"""Don't raise all prices by 12%: it adds only ${blanket-base:.2f}M, because the gain at peak is partly lost in regular weeks, where families drop out. Instead, raise peak-week lessons
        to about ${best[0]} and keep regular weeks at $95: profit rises from ${base:.2f}M to ${peak_only:.2f}M, selling only {places-best[1]} fewer places a day at peak. Fill regular weeks with packages and group
        deals. Risk: families see peak pricing as unfair, so publish prices early and offer early-booking rates. Next step: launch peak prices for next season's Christmas weeks.""",
        ["Spots that capacity, not demand, limits peak sales", "Applies the cap when reading the demand curve",
         "Separates peak from regular weeks", "Addresses fairness, not just profit"],
        "Capacity-constrained pricing · demand curves · peak pricing")

CASES.append(solstice())
