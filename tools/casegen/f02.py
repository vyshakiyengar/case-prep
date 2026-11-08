"""Market sizing. Concepts from CaseCraft #006, #007, #009, #010; rewritten from scratch with realistic drivers."""
from lib import *
CASES = []

# ---------------------------------------------------------------- BrightStep Tutoring (easy)
def brightstep():
    pupils = 3.6        # M pupils in years 7-11 (England), interviewer's figure
    quint = [0.06, 0.08, 0.11, 0.15, 0.20]
    share = sum(quint) / 5
    tutored = pupils * share
    sessions, price = 30, 35.0
    market = tutored * sessions * price          # $M
    bs_price, target = 12.0, 10.0                # $ per group session, $M revenue
    students = target / (bs_price * sessions) * 1e6
    return C(
        "BrightStep Tutoring", "How big is the market for paid maths tutoring?",
        "Market sizing", "Education", "United Kingdom", 1,
        """BrightStep is a start-up offering live online maths lessons in small groups for secondary school pupils in England.
        Its investors want to know how big the paid maths tutoring market is, and whether BrightStep's target of $10M revenue in three
        years is realistic.""",
        [("Which pupils?", "Secondary pupils, years 7 to 11 (ages 11 to 16), in England."),
         ("Which spending counts?", "Money families pay for maths tutoring, online or in person. Leave out school-funded tutoring for now."),
         ("BrightStep's price?", "$12 per 60-minute small-group lesson. One-to-one tutors typically charge around $35 an hour."),
         ("Data available?", "Yes: the interviewer has pupil numbers and survey data on who pays for tutoring.")],
        ("Annual spend on paid maths tutoring", [
            ("Who pays", ["Secondary pupils in England", "Share whose families pay for maths tutoring", "Differences by household income"]),
            ("How much they buy", ["Sessions per year (term-time weekly?)", "Price per session"]),
            ("BrightStep's slice", ["Families who'd choose small groups over one-to-one", "Price gap: $12 vs $35"]),
        ]),
        "I'd expect a market in the hundreds of millions of dollars: a few hundred thousand tutored pupils, paying weekly through the school year.",
        [
            Q(f"Here is the interviewer's data. Estimate the annual market.",
              f"""<p>Average share paying for maths tutoring = average of the five income groups = ({' + '.join(pct(x) for x in quint)}) ÷ 5 = <b>{pct(share)}</b>
              (each group is one fifth of pupils).</p>
              <p>Tutored pupils: {pupils}M × {pct(share)} = <b>{num(tutored*1000)}k</b>.</p>
              <p>Spend: {num(tutored*1000)}k × {sessions} sessions × ${price:.0f} = <b>${num(market)}M a year</b>.</p>
              <p><b>So-what:</b> a market of roughly $450M, heavily skewed to higher-income families, who are the most likely to buy one-to-one tutors.</p>""",
              BAR(["Lowest 20%", "Next 20%", "Middle 20%", "Next 20%", "Highest 20%"], [x * 100 for x in quint],
                  title="Exhibit 1 · Share of pupils whose families pay for maths tutoring, by household income (%)", fmt="{:.0f}%", ylabel="%", h=2.4),
              note=f"Pupils in years 7 to 11 in England: about {pupils}M. Tutored pupils have about {sessions} sessions a year at around ${price:.0f}. All figures are case assumptions."),
            Q(f"How many students does BrightStep need to reach ${target:.0f}M, and what share of tutored pupils is that?",
              f"""<p>Revenue per student: {sessions} lessons × ${bs_price:.0f} = ${sessions*bs_price:.0f} a year.</p>
              <p>Students needed: ${target:.0f}M ÷ ${sessions*bs_price:.0f} ≈ <b>{students/1000:.1f}k</b>, which is <b>{pct(students/(tutored*1e6), 1)}</b> of today's {num(tutored*1000)}k tutored pupils.</p>
              <p><b>So-what:</b> ambitious but plausible, and BrightStep's low price could also attract families who don't pay for tutoring today,
              especially in the lower-income groups where only {pct(quint[0])} to {pct(quint[1])} currently pay.</p>"""),
            Q("What would make you more or less confident in the $10M target?",
              """<ul><li><b>More confident:</b> schools buying lessons for whole groups (one sale, many pupils); strong retention from autumn to exam season;
              a low cost to win each family</li>
              <li><b>Less confident:</b> most tutoring is bought just before exams (fewer than 30 sessions); one-to-one tutors cutting prices online;
              families seeing small groups as "not real tutoring"</li>
              <li><b>Test:</b> retention from September to May and the cost of winning each paying family</li></ul>"""),
        ],
        f"""Paid maths tutoring for secondary pupils in England is worth roughly ${num(market)}M a year: about {num(tutored*1000)}k pupils, {sessions} sessions each at around ${price:.0f}.
        BrightStep's ${target:.0f}M target needs about {students/1000:.1f}k students, {pct(students/(tutored*1e6), 1)} of today's tutored pupils, which is achievable if its $12
        price brings in families who can't afford one-to-one tutors. I'd back the plan subject to two checks: retention through the school year, and the cost of acquiring each family.
        Next step: run a term-long pilot with two schools to measure both.""",
        ["Uses the income split to get the average, not a guess", "Keeps units clear: pupils, sessions, price",
         "Compares the target with the size of the market", "Sees the low price could expand the market"],
        "Segmented market sizing · sanity checks", fmt="Candidate-led")

CASES.append(brightstep())

# ---------------------------------------------------------------- Fontaro Filters (easy-medium, Mexico)
def aquasense():
    households = 6.0             # M households in Mexico City metro (case assumption)
    seg = [("Higher income", 0.15, 0.80), ("Middle income", 0.35, 0.60), ("Lower income", 0.50, 0.30)]   # share of households, share able to install (own home or landlord allows)
    eligible = sum(households * s * inst for _, s, inst in seg[:2])        # target: higher + middle
    sub = 15 * 12                # $ per year
    garr_week, garr_price = 3, 2.25
    garr_year = garr_week * garr_price * 52
    take = 0.10
    subs = eligible * take
    revenue = subs * sub          # $M
    return C(
        "Fontaro Filters", "Sizing a water-filter subscription in Mexico City",
        "Market sizing", "Home appliances", "Mexico", 2,
        """Fontaro sells under-sink water filters on a subscription in Monterrey: $15 a month covers the unit, installation and
        replacement cartridges. It wants to launch in Mexico City and asks: how many households could realistically subscribe, and what
        revenue could that bring?""",
        [("Who drinks tap water today?", "Very few. Most households buy 20-litre jugs of purified water (garrafones), delivered or from a shop."),
         ("Who can install a filter?", "Owners, or renters whose landlord allows it. The filter needs mains water pressure and a kitchen sink."),
         ("Which households?", "Start with higher- and middle-income households. Lower-income households are a later, cheaper product."),
         ("Success?", "A market big enough to justify a Mexico City warehouse and installation team.")],
        ("How many Mexico City households could subscribe?", [
            ("Households in target", ["Total households", "Income segment", "Able to install (tenure, plumbing)"]),
            ("Willing to switch", ["Annual spend on jugs today", "Savings vs $15 a month", "Trust in filtered tap water"]),
            ("Revenue", ["Subscribers × $15 × 12", "Churn", "Ramp-up over time"]),
        ]),
        "The pitch is savings versus buying jugs. If a household spends more on jugs than $15 a month, the market could be several hundred thousand households.",
        [
            Q("Here is the interviewer's data on Mexico City households. How many households are in the target market?",
              f"""<p>Target = higher- and middle-income households that can install:</p>
              <ul><li>Higher income: {households}M × {pct(seg[0][1])} × {pct(seg[0][2])} = {num(households*seg[0][1]*seg[0][2]*1000)}k</li>
              <li>Middle income: {households}M × {pct(seg[1][1])} × {pct(seg[1][2])} = {num(households*seg[1][1]*seg[1][2]*1000)}k</li></ul>
              <p>Total: <b>{eligible:.2f}M households</b>, about {pct(eligible/households)} of the metro area.</p>""",
              BAR([s[0] for s in seg], {"Share of households (%)": [s[1] * 100 for s in seg], "Able to install (%)": [s[2] * 100 for s in seg]},
                  title=f"Exhibit 1 · Mexico City metro: {households:.0f}M households", fmt="{:.0f}%", ylabel="%", h=2.5)),
            Q(f"A typical target household buys {garr_week} jugs a week at ${garr_price:.2f}. Is the subscription a good deal for them?",
              f"""<p>Jugs: {garr_week} × ${garr_price:.2f} × 52 = <b>${num(garr_year)} a year</b>. Subscription: $15 × 12 = <b>${num(sub)}</b>.</p>
              <p>The household saves about <b>${num(garr_year-sub)} a year</b> ({pct(1-sub/garr_year)}), and stops carrying heavy jugs.</p>
              <p><b>So-what:</b> a strong value proposition for jug-buying households. The barrier isn't price; it's trust in tap water and the hassle of installation.</p>"""),
            Q(f"If {pct(take)} of target households subscribe within three years, what annual revenue is that? Would you go?",
              f"""<p>Subscribers: {eligible:.2f}M × {pct(take)} = <b>{num(subs*1000)}k</b>. Revenue: {num(subs*1000)}k × ${num(sub)} = <b>${revenue:.0f}M a year</b>.</p>
              <p>Is {pct(take)} reasonable? The savings case is strong, but water quality fears are deep-rooted. I'd want proof from Monterrey: what share of target
              households subscribed after three years there?</p>
              <p><b>Go, in stages:</b> start in neighbourhoods with many owner-occupiers, offer free water-quality testing at installation to build trust, and partner with
              landlords of new apartment buildings.</p>"""),
        ],
        f"""Mexico City has about {eligible:.1f}M higher- and middle-income households that could install a filter. Each would save about ${num(garr_year-sub)} a year
        versus buying jugs, so the offer is strong. At {pct(take)} take-up, Fontaro would have about {num(subs*1000)}k subscribers and ${revenue:.0f}M of annual revenue.
        I recommend launching, starting in owner-occupied neighbourhoods with free water testing to overcome distrust of tap water.
        Risk: take-up could be far lower if trust doesn't shift. Next step: compare with Monterrey's three-year take-up by neighbourhood.""",
        ["Segments by income and ability to install, not just population", "Turns the value proposition into a number (savings per year)",
         "Questions the take-up assumption and looks for evidence", "Identifies trust, not price, as the barrier"],
        "Market sizing · value to customer · adoption", fmt="Candidate-led")

CASES.append(aquasense())

# ---------------------------------------------------------------- CloudPatch Security (hard, US SMB)
def cloudpatch():
    firms = 1.10      # M US employer firms with 10-249 employees (case assumption)
    segs = [("Regulated (health, finance, legal)", 0.30, 0.45), ("Other", 0.70, 0.12)]   # share of firms, share buying monitoring today
    price = 3000      # $ per firm per year
    buyers = [firms * s * b for _, s, b in segs]
    market = sum(buyers) * price / 1000   # $bn
    msp = 0.60
    direct_buyers = sum(buyers) * (1 - msp)
    # channel economics
    cac_direct, cac_msp = 4500, 1200      # $ per firm
    margin_direct, margin_msp = 0.80, 0.55   # gross margin after MSP discount
    life = 4   # years
    v_direct = price * margin_direct * life - cac_direct
    v_msp = price * margin_msp * life - cac_msp
    return C(
        "CloudPatch Security", "Is there room for another SMB security product?",
        "Market sizing", "SMB cybersecurity", "United States", 3,
        """CloudPatch has built a tool that continuously scans a small business's systems for security weaknesses and tells staff what to fix,
        for $250 a month. It wants to raise money to sell across the US. The board asks: how big is the market today, and how should
        CloudPatch reach it?""",
        [("Which customers?", "US businesses with 10 to 249 employees. Smaller ones rarely pay for security tools; larger ones have their own security teams."),
         ("How do small businesses buy IT?", "Many outsource IT to a managed service provider (MSP), which chooses and resells tools to them."),
         ("Competition?", "Several scanning tools exist; some are bundled into broader security packages."),
         ("Objective?", "Size today's market and choose a route to market.")],
        ("How big is the market, and how do we reach it?", [
            ("Firms that could buy", ["US firms with 10 to 249 employees", "Regulated vs other industries"]),
            ("Firms that buy today", ["Share paying for vulnerability monitoring", "Price per firm"]),
            ("Route to market", ["Direct sales", "Through MSPs: cost to acquire, margin, lifetime"]),
        ]),
        "Regulated firms are under pressure to prove they're secure, so I expect most of today's spending is there. And if most small firms buy through MSPs, the channel may matter more than the product.",
        [
            Q("Here is the interviewer's data. Size the market today.",
              f"""<ul><li>Regulated: {firms}M × {pct(segs[0][1])} × {pct(segs[0][2])} = {num(buyers[0]*1000)}k firms</li>
              <li>Other: {firms}M × {pct(segs[1][1])} × {pct(segs[1][2])} = {num(buyers[1]*1000)}k firms</li></ul>
              <p>Buying firms: <b>{num(sum(buyers)*1000)}k</b>. At $3,000 a year: <b>${market:.2f}bn</b>.</p>
              <p>Regulated firms are {pct(segs[0][1])} of firms but <b>{pct(buyers[0]/sum(buyers))}</b> of buyers.</p>
              <p><b>So-what:</b> a market of about ${market:.1f}bn today; the {pct(1-segs[1][2])} of "other" firms that don't buy yet are the bigger long-term opportunity.</p>""",
              T(["Segment", "Share of firms", "Buying monitoring today"], [[s[0], pct(s[1]), pct(s[2])] for s in segs],
                title=f"Exhibit 1 · US firms with 10 to 249 employees: {num(firms*1000)}k", note="Price: about $3,000 per firm per year. Case assumptions.")),
            Q(f"{pct(msp)} of these firms buy security through an MSP. Compare the value of a customer won directly vs through an MSP.",
              f"""<p>Value over a {life}-year life = price × gross margin × {life} − cost to acquire.</p>
              <ul><li>Direct: $3,000 × {pct(margin_direct)} × {life} − ${num(cac_direct)} = <b>${num(v_direct)}</b></li>
              <li>Through MSP: $3,000 × {pct(margin_msp)} × {life} − ${num(cac_msp)} = <b>${num(v_msp)}</b></li></ul>
              <p>Despite the lower margin, an MSP customer is worth <b>${num(v_msp-v_direct)} more</b>, because it costs ${num(cac_direct-cac_msp)} less to win.
              And direct sales can only reach the {pct(1-msp)} of firms ({num(direct_buyers*1000)}k of today's buyers) that don't use an MSP, while each MSP brings dozens of client firms at once.</p>
              <p><b>So-what:</b> MSPs should be the main channel: better value per customer and access to {pct(msp)} of the market.</p>""",
              T(["", "Direct", "Through MSP"], [["Cost to acquire a firm", f"${num(cac_direct)}", f"${num(cac_msp)}"], ["Gross margin (after MSP discount)", pct(margin_direct), pct(margin_msp)],
                 ["Expected customer life", f"{life} years", f"{life} years"]], title="Exhibit 2 · Channel economics")),
            Q("What would make MSPs choose CloudPatch over the tools they already resell?",
              """<ul><li><b>Multi-client dashboard</b>: one screen for all their clients, saving technician time</li>
              <li><b>Compliance reports</b> ready for regulated clients' auditors and insurers</li>
              <li><b>Margin</b> at least as good as competing tools, with volume tiers</li>
              <li><b>Automation</b> that fixes common issues, not just flags them</li></ul>
              <p>Test with 10 MSPs serving healthcare and finance clients before scaling.</p>"""),
            Q("The CEO wants to sell direct to keep margin. How do you respond?",
              f"""<p>The margin is higher direct, but the customer is worth less once acquisition cost is counted (${num(v_direct)} vs ${num(v_msp)}), and direct sales can't
              reach {pct(msp)} of buyers. A hybrid works best: MSPs for reach, and a small direct team only for larger regulated firms that buy security themselves.</p>"""),
        ],
        f"""Today's market is about ${market:.2f}bn: {num(sum(buyers)*1000)}k firms, mostly in regulated industries, paying about $3,000 a year. I recommend selling mainly through MSPs:
        a customer won that way is worth about ${num(v_msp)} versus ${num(v_direct)} direct, and MSPs reach the {pct(msp)} of firms that buy through them.
        Lead with compliance reporting for regulated clients. Risk: MSPs already resell bundled tools, so CloudPatch needs a clear time-saving edge.
        Next step: sign 10 pilot MSPs in healthcare and finance.""",
        ["Segments by regulation, which drives buying", "Values customers by channel instead of comparing margins only",
         "Sees that channel reach outweighs margin", "Handles the CEO's push-back with numbers"],
        "Market sizing · channel economics · B2B buying", fmt="Candidate-led")

CASES.append(cloudpatch())

# ---------------------------------------------------------------- Circlebox Reuse (medium, return-rate economics)
def loopbox():
    people = 12.0          # M people in Paris region (case assumption)
    orders_week = 0.5      # takeaway/delivery orders per person per week
    boxes_per_order = 1.5
    uses = people * orders_week * 52 * boxes_per_order    # M uses/yr
    box_cost, max_uses = 3.00, 100
    fee = 0.25             # $ per use charged to restaurant
    wash = 0.08            # $ per use: collection + washing
    returns = [0.90, 0.95, 0.98]
    def per_use(rr):
        life = min(1 / (1 - rr), max_uses)
        return box_cost / life + wash, life
    rows = []
    for rr in returns:
        c, life = per_use(rr)
        rows.append([pct(rr), num(life), f"${box_cost/life:.3f}", f"${c:.3f}", signed(fee - c, 3, "$")])
    be = 1 - box_cost / ((fee - wash) * 1)   # break-even: box_cost/life = fee - wash → life = box_cost/(fee-wash)
    be_life = box_cost / (fee - wash)
    be_rr = 1 - 1 / be_life
    share = 0.02
    rev = uses * share * fee
    return C(
        "Circlebox Reuse", "Reusable takeaway boxes: big market, but does the model work?",
        "Market sizing", "Circular packaging", "France", 2,
        """Circlebox rents reusable takeaway boxes to restaurants in Paris. Customers return boxes to drop points; Circlebox collects, washes and
        redistributes them, and charges restaurants $0.25 each time a box is used. Investors ask: how big is the opportunity in the Paris region,
        and can Circlebox make money on each box?""",
        [("What do restaurants pay for disposable packaging?", "About $0.12 per container."),
         ("Why would they pay more?", "Customer demand for less waste, and expected regulation on single-use packaging."),
         ("Box economics?", "A box costs $3.00 and lasts about 100 washes. Collection and washing cost $0.08 per use."),
         ("What happens to unreturned boxes?", "They're lost. Today about 90% of boxes come back after each use.")],
        ("Is this a big and profitable opportunity?", [
            ("Market size", ["Takeaway and delivery orders in the region", "Containers per order", "Price per use"]),
            ("Unit economics per use", ["Box cost spread over its life", "Life depends on return rate", "Collection and washing"]),
            ("Adoption", ["Restaurants willing to pay more", "Customer return habits"]),
        ]),
        "The market is probably large, but I'd focus on the return rate: if boxes don't come back, each one is only used a few times and its $3 cost isn't covered.",
        [
            Q(f"Estimate container uses per year in the Paris region. Assume {people:.0f}M people, {orders_week} takeaway or delivery orders per person per week, {boxes_per_order} containers per order.",
              f"""<p>{people:.0f}M × {orders_week} × 52 × {boxes_per_order} = <b>{num(uses)}M container uses a year</b>.</p>
              <p>At $0.25 per use, that's a theoretical market of <b>${uses*fee:.0f}M</b>. At just {pct(share)} share, Circlebox would earn ${rev:.1f}M.</p>
              <p><b>So-what:</b> the market is big enough. The real question is whether each use makes money.</p>"""),
            Q("Here is the cost per use at different return rates. What do you conclude?",
              f"""<p>A box that comes back with probability <i>r</i> is used on average 1 ÷ (1 − <i>r</i>) times before it's lost (capped by its 100-wash life).</p>
              <p>At today's 90% return rate a box is used only 10 times: $3.00 ÷ 10 = $0.30 per use, plus $0.08 washing = $0.38, against a $0.25 fee.
              <b>Circlebox loses about $0.13 on every use.</b></p>
              <p>Break-even: the box must last $3.00 ÷ ($0.25 − $0.08) = {be_life:.1f} uses, which needs a return rate of <b>{pct(be_rr, 1)}</b>.</p>
              <p><b>So-what:</b> growth makes losses bigger at today's return rate. Fix returns before scaling.</p>""",
              T(["Return rate", "Average uses per box", "Box cost per use", "Total cost per use", "Margin per use (fee $0.25)"], rows, title="Exhibit 1 · Cost per use"),
              note="This is the key insight in the case: a small change in return rate changes box life dramatically."),
            Q("How could Circlebox raise the return rate above 95%?",
              """<ul><li><b>Deposit</b> of $2 to $3 refunded on return (the strongest lever)</li>
              <li><b>More drop points</b>: metro stations, offices, partner shops</li>
              <li><b>Delivery riders collect</b> empty boxes on their next order</li>
              <li><b>App reminders</b> and small rewards for quick returns</li>
              <li><b>Charge restaurants</b> for boxes their customers don't return, so they promote returns too</li></ul>"""),
        ],
        f"""The Paris region uses about {num(uses)}M takeaway containers a year, so the market is large. But at today's 90% return rate each box is used only 10 times and Circlebox loses
        about $0.13 per use; it needs a {pct(be_rr, 1)} return rate just to break even. I recommend pausing expansion and introducing a refundable deposit plus more drop points,
        then scaling only once returns pass 96% in pilot areas. Risk: a deposit may put some customers off. Next step: test a $2 deposit in two arrondissements.""",
        ["Sizes the market quickly, then moves to unit economics", "Derives box life from the return rate",
         "Finds the break-even return rate", "Recommends fixing the model before scaling"],
        "Market sizing · unit economics · sensitivity", fmt="Candidate-led")

CASES.append(loopbox())
