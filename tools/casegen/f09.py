"""Subscription and SaaS retention. Concepts from CaseCraft #041-#045; rewritten, and every option is tested on the existing base."""
from lib import *
CASES = []

# ---------------------------------------------------------------- Tessera Analytics (medium)
def tessera():
    seg = [  # name, customers, ARR $M, churn % of ARR
        ("Small business", 1200, 6.0, 0.40), ("Mid-market", 600, 12.0, 0.12), ("Enterprise", 200, 12.0, 0.06)]
    start = sum(a for _, _, a, _ in seg)
    churn = sum(a * c for _, _, a, c in seg)
    contr, expn, new = 0.03 * start, 0.08 * start, 9.0
    end = start - churn - contr + expn + new
    nrr = (start - churn - contr + expn) / start
    g = end / start - 1
    target = start * 1.30
    oA = (0.40 - 0.25) * 6.0; cA = 0.5            # automated onboarding for small business
    oB = (0.12 - 0.07) * 12.0; cB = 1.0           # customer-success managers for mid-market
    oC = 0.8 * 1.5; cC = 1.5                      # more sales spend, $0.80 of new ARR per $1
    end2 = end + oA + oC
    end3 = end2 + oB
    sb_share = seg[0][2] * seg[0][3] / churn
    assert g < 0.30 and end3 < target and oA / cA > oC / cC > oB / cB
    rows = [[n, num(cu), f"{a:.1f}", pct(c), f"{a*c:.2f}"] for n, cu, a, c in seg]
    return C(
        "Tessera Analytics", "Growing 20% a year, but leaking customers",
        "Growth strategy", "B2B software", "United States", 2,
        """Tessera sells analytics software to retailers on annual subscriptions. It has $30M of annual recurring revenue (ARR) and grew about 20% last year.
        The board wants 30% growth next year. The CEO wants to double the sales team. The COO thinks the problem is customers leaving. You have $3M of extra budget to allocate.""",
        [("What does ARR mean here?", "The yearly value of all active subscriptions."),
         ("New sales?", "About $9M of new ARR a year from new customers."),
         ("Existing customers?", "Besides those who leave, existing customers downgrade about 3% of ARR a year and upgrade about 8%."),
         ("Sales efficiency?", "Every extra $1 of sales and marketing brings about $0.80 of new ARR.")],
        ("How can Tessera reach 30% ARR growth?", [
            ("Keep more existing ARR", ["Churn by segment", "Downgrades"]),
            ("Grow existing customers", ["Upgrades, more users"]),
            ("Win new customers", ["Sales capacity", "Sales efficiency"]),
        ]),
        "ARR growth = new ARR − ARR lost + upgrades. If a big share of ARR leaves every year, adding salespeople just refills a leaking bucket. I'd find where churn is concentrated first.",
        [
            Q("Here is churn by segment. Walk me through next year's ARR and the gap to target.",
              f"""<p>Lost to churn: ${churn:.2f}M ({pct(churn/start, 1)} of ARR). Next year: $30M − ${churn:.2f}M − ${contr:.1f}M downgrades + ${expn:.1f}M upgrades + $9M new = <b>${end:.1f}M</b>, {pct(g)} growth.</p>
              <p>Net revenue retention (what existing customers are worth a year later) is <b>{pct(nrr)}</b>. Target: ${target:.1f}M, a gap of ${target-end:.1f}M.</p>
              <p><b>So-what:</b> small businesses are only 20% of ARR but <b>{pct(sb_share)} of the ARR lost</b>.</p>""",
              T(["Segment", "Customers", "ARR ($M)", "Churn (% of ARR)", "ARR lost ($M)"], rows + [["Total", num(sum(s[1] for s in seg)), f"{start:.1f}", pct(churn/start, 1), f"{churn:.2f}"]],
                title="Exhibit 1 · Churn by segment, last year", bold_last=True)),
            Q("Three ideas: (A) automated onboarding for small businesses, $0.5M, cutting their churn from 40% to 25%; (B) customer-success managers for mid-market, $1.0M, cutting churn from 12% to 7%; (C) more sales spend, $1.5M. Compare them.",
              f"""<p>A saves ${oA:.2f}M of ARR: <b>${oA/cA:.1f} per $1</b>. B saves ${oB:.2f}M: ${oB/cB:.1f} per $1. C adds ${oC:.1f}M: ${oC/cC:.1f} per $1.</p>
              <p>Kept ARR is worth as much as new ARR: both recur next year. So <b>A is by far the best use of money</b>, then C, then B.</p>""",
              BAR(["A: onboarding", "B: success managers", "C: more sales"], [r(oA / cA, 2), r(oB / cB, 2), r(oC / cC, 2)], title="Exhibit 2 · ARR gained per $1 spent", ylabel="$ ARR per $1", fmt="{:.1f}", h=2.3, highlight=[0])),
            Q("Can Tessera hit 30% next year?",
              f"""<p>With A and C: ${end2:.1f}M ({pct(end2/start-1)} growth). Adding B too: ${end3:.1f}M ({pct(end3/start-1)}). All three fall short of ${target:.1f}M.</p>
              <p><b>So-what:</b> tell the board 30% is a stretch. To close the last gap, look at upgrades: 8% expansion is low for analytics software; a paid add-on for existing customers could help.</p>"""),
        ],
        f"""Prioritise retention before doubling the sales team. Small businesses make up 20% of ARR but {pct(sb_share)} of the ARR lost, so automated onboarding for them is the best use of money:
        about ${oA/cA:.1f} of ARR kept per $1, against ${oC/cC:.1f} for extra sales spend. Fund onboarding (${cA:.1f}M) and ${cC:.1f}M of extra sales spend; that gets growth to about {pct(end2/start-1)}. Customer-success managers for mid-market (${cB:.1f}M) lift it to about {pct(end3/start-1)}, still short of 30%;
        the rest has to come from selling more to existing customers. Risk: automated onboarding may not cut churn as much as planned, so pilot it on new sign-ups first.""",
        ["Builds next year's ARR from churn, downgrades, upgrades and new sales", "Finds where churn is concentrated in dollars, not customers",
         "Compares options on ARR per dollar", "Tells the board the target is a stretch, with numbers"],
        "SaaS metrics · churn and net revenue retention · prioritisation", fmt="Candidate-led")

CASES.append(tessera())

# ---------------------------------------------------------------- Tallyline Payroll (medium, selection trap)
def tallyline():
    p_m, disc = 100.0, 0.15
    p_a = p_m * (1 - disc)
    churn_new_m, churn_loyal_m, churn_a = 0.03, 0.015, 0.20     # monthly, monthly, yearly at renewal
    life_new = 1 / churn_new_m                                  # months
    life_loyal = 1 / churn_loyal_m
    life_a = 12 / churn_a
    v_new_m, v_loyal_m, v_a = p_m * life_new, p_m * life_loyal, p_a * life_a
    v_loyal_a = p_a * life_loyal                                # loyal customers stay as long either way
    base, switch = 20000, 0.30
    sw = base * switch
    loss = sw * (v_loyal_m - v_loyal_a) / 1e6
    new_y, take = 8000, 0.40
    gain_new = new_y * take * (v_a - v_new_m) / 1e6
    assert v_a > v_new_m and v_loyal_a < v_loyal_m and abs(v_loyal_m - v_loyal_a - disc * v_loyal_m) < 1e-6
    return C(
        "Tallyline Payroll", "A discount that would lose money on its best customers",
        "Pricing", "B2B software", "United States", 2,
        """Tallyline sells payroll software to small businesses for $100 a month, billed monthly. Its 20,000 customers can cancel any month. The marketing team wants to offer a 15% discount
        to anyone who switches to a yearly plan, arguing that yearly customers stay much longer. The CFO asks whether this makes money.""",
        [("How long do customers stay?", "On monthly plans, about 3% cancel each month. Yearly-plan customers at a similar firm renew 80% of the time."),
         ("Who would switch?", "Surveys suggest about 30% of current customers would take the yearly plan. They are mostly long-standing customers, who cancel only about 1.5% a month."),
         ("New customers?", "About 8,000 sign up a year; around 40% would choose a yearly plan if offered.")],
        ("Should Tallyline offer a 15% discount for yearly plans?", [
            ("Existing customers who switch", ["Revenue now vs on a yearly plan", "Who switches"]),
            ("New customers", ["Do yearly plans keep them longer?"]),
            ("Cash and other effects", ["Cash upfront", "Easier forecasting"]),
        ]),
        "Yearly plans do keep customers longer, but the customers who choose them are often the loyal ones who would have stayed anyway. Then the discount is just a price cut.",
        [
            Q("Compare the expected lifetime revenue of a customer on each plan, using the averages marketing quotes.",
              f"""<p>Monthly: at 3% a month, an average customer stays 1 ÷ 3% = {life_new:.1f} months: ${num(v_new_m, -1)}.</p>
              <p>Yearly: $85 a month; at 20% cancelling each year, an average customer stays 1 ÷ 20% = 5 years: 60 × $85 = <b>${num(v_a)}</b>. Yearly plans look {pct(v_a/v_new_m-1)} better.</p>""",
              note="Average lifetime = 1 ÷ churn rate, for a constant churn rate."),
            Q("But the customers who would switch cancel only 1.5% a month. Redo the comparison for them.",
              f"""<p>These customers already stay about 1 ÷ 1.5% = {life_loyal:.1f} months on a monthly plan: ${num(v_loyal_m, -1)}. A yearly plan doesn't make them stay longer; they were staying anyway.</p>
              <p>So for them the discount is simply a 15% price cut: {life_loyal:.1f} months × $85 = ${num(v_loyal_a, -1)}, <b>${num(v_loyal_m-v_loyal_a, -1)} less</b> each.
              For {num(sw)} switchers that is about <b>${loss:.1f}M</b> of lifetime revenue lost.</p>
              <p><b>So-what:</b> the people most likely to take the offer are the ones who need it least. Marketing's comparison mixes up "yearly plans cause loyalty" with "loyal customers choose yearly plans".</p>""",
              T(["Customer", "Monthly plan ($)", "Yearly plan ($)", "Difference ($)"],
                [["Typical new customer (3% a month), if the yearly plan keeps them 5 years", num(v_new_m, -1), num(v_a), signed(round(v_a - v_new_m, -1), 0)], ["Loyal existing customer (1.5% a month)", num(v_loyal_m, -1), num(v_loyal_a, -1), signed(round(v_loyal_a - v_loyal_m, -1), 0)]],
                title="Exhibit 1 · Lifetime revenue per customer")),
            Q("Is there a version of the offer that works?",
              f"""<ul><li><b>Offer it to new customers only</b>, at sign-up. If yearly plans keep them closer to 5 years, each is worth up to ${num(v_a-v_new_m, -1)} more: up to ${gain_new:.1f}M a year for {num(new_y*take)} yearly sign-ups.
              But test it: some will be loyal types who would have stayed anyway.</li>
              <li><b>Smaller discount</b> (for example 1 month free on a yearly plan, about 8% off) only for customers showing signs of leaving.</li>
              <li><b>Don't offer it to the existing base</b>, or only to those whose usage is falling.</li></ul>"""),
        ],
        f"""Don't offer the 15% yearly-plan discount to existing customers: the 30% who would switch are loyal customers who cancel only 1.5% a month, and would stay just as long anyway, so the discount is
        a pure price cut: about ${num(v_loyal_m-v_loyal_a, -1)} less each over their lifetime, around ${loss:.1f}M in total. Offer yearly plans to new customers at sign-up and test whether they really stay longer,
        and use targeted offers for existing customers who look likely to leave. Risk: competitors may push yearly discounts anyway. Next step: run a sign-up test for two months.""",
        ["Uses 1 ÷ churn for average lifetime", "Spots that switchers are the loyal customers",
         "Values the offer separately for existing and new customers", "Redesigns the offer instead of just rejecting it"],
        "Customer lifetime value · selection bias · pricing")

CASES.append(tallyline())

# ---------------------------------------------------------------- Brushline Studio (medium-hard, cohort chart)
def brushline():
    arpu, gm = 12.0, 0.80
    early = {"Organic and referral": [1.0, 0.82, 0.70], "Paid social ads": [1.0, 0.62, 0.45]}
    later = {"Organic and referral": 0.04, "Paid social ads": 0.09}
    cac = {"Organic and referral": 40.0, "Paid social ads": 90.0}
    def curve(k, n=13):
        c = list(early[k])
        while len(c) < n: c.append(c[-1] * (1 - later[k]))
        return c
    def months(k):
        c = list(early[k]); v = sum(c); x = c[-1]
        for _ in range(600): x *= 1 - later[k]; v += x
        return v
    life = {k: months(k) for k in early}
    ltv = {k: life[k] * arpu * gm for k in early}
    ratio = {k: ltv[k] / cac[k] for k in early}
    o, p = "Organic and referral", "Paid social ads"
    assert ratio[o] > 3 and ratio[p] < 1
    m = list(range(1, 13))
    return C(
        "Brushline Studio", "Sign-ups are up 60%. Why isn't revenue?",
        "Growth strategy", "Consumer software", "Canada", 2,
        """Brushline makes a design app for small online sellers, at $12 a month. Last year it started buying ads on social media, and paying sign-ups rose 60%.
        But revenue grew much less than that, and cash is tight. The founder asks what's going on and what to do.""",
        [("How do users arrive?", "Before the ads, almost all came through word of mouth, search and referrals. Now half come from social ads."),
         ("Cost to acquire?", "About $40 per paying user through organic and referral marketing; about $90 through social ads."),
         ("Margins?", "About 80% gross margin.")],
        ("Is Brushline's growth profitable?", [
            ("Which users stay?", ["Retention by acquisition channel"]),
            ("What is a user worth?", ["Months paid × $12 × margin"]),
            ("What does a user cost?", ["Acquisition cost by channel"]),
        ]),
        "Paid ads often bring users who try the app and leave. If they leave fast enough, each one costs more to acquire than they ever pay.",
        [
            Q("Here is retention by channel. What do you see?",
              f"""<p>Ad users drop off fast: only {pct(early[p][2])} are still paying in month 3 against {pct(early[o][2])} for organic users, and they keep cancelling faster after that
              ({pct(later[p])} a month against {pct(later[o])}). By month 12, {pct(curve(o)[11])} of organic users remain vs {pct(curve(p)[11])} of ad users.</p>""",
              LINE([str(x) for x in m], {o: [r(v * 100, 1) for v in curve(o)[:12]], p: [r(v * 100, 1) for v in curve(p)[:12]]},
                   title="Exhibit 1 · % of users still paying, by month since sign-up", ylabel="% still paying", labels=False)),
            Q("Work out a user's lifetime value against the cost to acquire them, for each channel.",
              f"""<p>Expected months paid = the first three months, then each later month at the channel's cancel rate: organic about <b>{life[o]:.1f} months</b>, ads about <b>{life[p]:.1f} months</b>.</p>
              <p>Lifetime gross profit = months × $12 × 80%: organic <b>${ltv[o]:.0f}</b>, ads <b>${ltv[p]:.0f}</b>.</p>
              <p>Against acquisition cost: organic {ratio[o]:.1f}× its $40 cost; ads <b>{ratio[p]:.2f}×</b> its $90. <b>Each ad user loses about ${cac[p]-ltv[p]:.0f}.</b></p>""",
              T(["Channel", "Months paid", "Lifetime gross profit ($)", "Cost to acquire ($)", "Value ÷ cost"],
                [[k, f"{life[k]:.1f}", f"{ltv[k]:.0f}", f"{cac[k]:.0f}", f"{ratio[k]:.2f}"] for k in early], title="Exhibit 2 · Unit economics by channel"),
              note="A common rule of thumb: value should be at least 3× the cost to acquire."),
            Q("What should the founder do?",
              """<ul><li><b>Cut social ad spend</b> sharply; keep only ad sets whose users retain like organic users</li>
              <li><b>Fix the first 3 months</b> for all users: onboarding templates, a first sale tracked in the app</li>
              <li><b>Put money into referrals</b>, the channel that works: a free month for both sides</li>
              <li>Track value ÷ cost by channel every month, not total sign-ups</li></ul>"""),
        ],
        f"""Brushline's ad-driven growth destroys value: ad users stay about {life[p]:.0f} months against {life[o]:.0f} for organic users, so each is worth about ${ltv[p]:.0f} of gross profit
        but costs $90 to acquire. I recommend cutting most social ad spend, investing in referrals ({ratio[o]:.1f}× return), and improving the first three months to lift retention for every channel.
        Risk: sign-up growth will slow, so explain to investors why that is healthy. Next step: report retention and value ÷ cost by channel monthly.""",
        ["Reads cohort retention curves by channel", "Turns retention into lifetime value",
         "Compares lifetime value with acquisition cost", "Recommends cutting a growth channel, with reasons"],
        "Cohort analysis · LTV vs CAC · channel economics")

CASES.append(brushline())

# ---------------------------------------------------------------- Flowkeep (hard, pricing model change on existing base)
def flowkeep():
    seats_price, run_price = 40.0, 0.02
    seg = [("Light", 600, 10, 500), ("Medium", 300, 25, 2000), ("Heavy", 100, 80, 6000)]   # customers, seats, runs per seat per month
    now = {n: s * seats_price for n, _, s, _ in seg}
    use = {n: s * u * run_price for n, _, s, u in seg}
    cnt = {n: c for n, c, _, _ in seg}
    R0 = sum(cnt[n] * now[n] for n in now) / 1000           # $k a month
    R1 = sum(cnt[n] * use[n] for n in use) / 1000
    be = (R1 - R0) / (cnt["Heavy"] * use["Heavy"] / 1000)  # share of heavy customers that can leave
    cap = 6000.0
    R2 = (sum(cnt[n] * use[n] for n in ("Light", "Medium")) + cnt["Heavy"] * min(use["Heavy"], cap)) / 1000
    assert now["Medium"] == use["Medium"] and use["Light"] < now["Light"] and use["Heavy"] > 2.5 * now["Heavy"] and 0.4 < be < 0.6 and R2 > R0
    rows = [[n, num(cnt[n]), f"{now[n]:,.0f}", f"{use[n]:,.0f}", signed(use[n] - now[n], 0)] for n in now]
    return C(
        "Flowkeep", "Switching to usage pricing: who wins and who walks?",
        "Pricing", "B2B software", "United Kingdom", 3,
        """Flowkeep sells workflow-automation software to mid-sized companies at $40 per user (seat) a month. The new head of product wants to switch everyone to usage pricing:
        $0.02 per automation run, because 'heavy users get far more value than they pay for'. The CEO asks you what it would do to revenue.""",
        [("Customer mix?", "1,000 customers: 600 light (10 seats, 500 runs per seat a month), 300 medium (25 seats, 2,000 runs), 100 heavy (80 seats, 6,000 runs)."),
         ("Contracts?", "Monthly, so customers can leave quickly."),
         ("Competitors?", "Two rivals charge per seat; one charges per run."),
         ("Goal?", "Grow revenue without losing the biggest accounts.")],
        ("What happens if Flowkeep switches to usage pricing?", [
            ("Existing customers", ["Bill change by segment", "Who might leave"]),
            ("New customers", ["Easier to start small?"]),
            ("Design", ["Caps, minimums, transition"]),
        ]),
        "Usage pricing moves money from light users to heavy users. Revenue could jump on paper, but heavy users would see their bills rise sharply and might leave. I'd check how many heavy customers we can afford to lose.",
        [
            Q("Calculate each segment's monthly bill now and under usage pricing.",
              f"""<p>Light: ${now['Light']:.0f} → ${use['Light']:.0f}. Medium: ${now['Medium']:,.0f} → ${use['Medium']:,.0f}. Heavy: ${now['Heavy']:,.0f} → <b>${use['Heavy']:,.0f}</b>, {use['Heavy']/now['Heavy']:.0f}× today.</p>
              <p>Total monthly revenue: ${R0:.0f}k → <b>${R1:,.0f}k</b> (+{pct(R1/R0-1)}) if nobody leaves.</p>""",
              T(["Segment", "Customers", "Bill now ($/month)", "Usage bill ($/month)", "Change ($)"], rows, title="Exhibit 1 · Monthly bill per customer")),
            Q("How many heavy customers could leave before Flowkeep is worse off?",
              f"""<p>The gain is ${R1-R0:,.0f}k a month. Each heavy customer who leaves takes ${use['Heavy']:,.0f}. Flowkeep breaks even if {(R1-R0)*1000/use['Heavy']:.0f} of 100 heavy customers leave: <b>{pct(be)}</b>.</p>
              <p><b>So-what:</b> a {use['Heavy']/now['Heavy']:.0f}× price rise on monthly contracts, with seat-priced rivals available, could well push half of them out. The upside is real but fragile.</p>"""),
            Q("Light customers' bills fall by 75%. Is that a problem or an opportunity?",
              f"""<p>It costs ${cnt['Light']*(now['Light']-use['Light'])/1000:.0f}k a month in revenue immediately. But a $100 starting bill makes Flowkeep easier to try, which could bring in more new customers who grow over time.
              That benefit is uncertain and takes time; the revenue loss is certain and immediate.</p>"""),
            Q("Design a better pricing change.",
              f"""<ul><li><b>Platform fee + usage</b>, with a minimum so light customers pay at least close to today</li>
              <li><b>Cap</b> heavy bills (for example ${cap:,.0f} a month): revenue still rises to about ${R2:,.0f}k (+{pct(R2/R0-1)}) if all stay, with much less risk of losing them</li>
              <li><b>New customers first</b>; move existing ones at renewal with 6 to 12 months' notice and annual-contract options</li>
              <li>Talk to the 20 largest heavy customers before announcing anything</li></ul>"""),
        ],
        f"""Don't switch everyone to pure usage pricing. Revenue would rise {pct(R1/R0-1)} on paper, but heavy customers' bills would rise {use['Heavy']/now['Heavy']:.0f}× and Flowkeep is worse off if {pct(be)} of them leave,
        while light customers would immediately pay 75% less. I recommend a platform fee plus usage with a minimum and a cap, applied first to new customers and then to existing ones at renewal.
        With a ${cap:,.0f} cap, revenue still rises about {pct(R2/R0-1)} if customers stay. Next step: test reactions with the 20 largest accounts.""",
        ["Models the bill change for each segment", "Finds the break-even share of heavy customers who can leave",
         "Sees both sides: heavy users pay more, light users pay less", "Designs a transition for the existing base"],
        "Pricing model change · winners and losers · break-even churn", fmt="Candidate-led")

CASES.append(flowkeep())
