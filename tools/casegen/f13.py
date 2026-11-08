"""Marketplaces and platforms. Concepts from CaseCraft #061-#065; rewritten from scratch."""
from lib import *
import math
CASES = []

# ---------------------------------------------------------------- Patchwork (medium): raise the take rate?
def patchwork():
    gmv, t0, t1 = 200.0, 0.10, 0.15
    rev0 = gmv * t0
    be = 1 - t0 / t1
    drops = [0.10, 0.20, 0.30, 0.40]
    rows = [[pct(d), f"{gmv*(1-d):.0f}", f"{gmv*(1-d)*t1:.1f}", signed(gmv * (1 - d) * t1 - rev0, 1)] for d in drops]
    rep = 0.60
    tier_new, tier_rep = 0.15, 0.10
    rev_tier = gmv * ((1 - rep) * tier_new + rep * tier_rep)
    assert abs(be - 1 / 3) < 1e-9 and rev_tier > rev0
    return C(
        "Patchwork", "Charge freelancers more, or lose them?",
        "Pricing", "Online marketplace", "United Kingdom", 2,
        """Patchwork is a marketplace that connects small businesses with freelance designers and developers. It takes 10% of every job paid through the platform: $20M of revenue on $200M of jobs a year.
        The CFO wants to raise the fee to 15%. The head of community says freelancers will leave. The CEO asks you to settle it.""",
        [("Who pays the fee?", "Freelancers: it's deducted from what the client pays them."),
         ("Repeat work?", "About 60% of the value of jobs comes from clients rehiring a freelancer they met on Patchwork."),
         ("Competitors?", "Two large platforms charge 10–20%; many freelancers use several."),
         ("Off-platform risk?", "Once a client and freelancer know each other, they can easily agree to work directly.")],
        ("Should Patchwork raise its fee to 15%?", [
            ("Revenue maths", ["Fee × value of jobs", "How much job value can we lose?"]),
            ("Who would leave?", ["Freelancers switching platforms", "Repeat pairs going direct"]),
            ("Better designs", ["Different fees by type of job", "Add services worth paying for"]),
        ]),
        "A higher fee only works if the value of jobs doesn't fall by a third. The risk is concentrated in repeat work, which is easy to take off the platform.",
        [
            Q("How much job value could Patchwork lose before the fee rise stops paying?",
              f"""<p>Revenue stays at $20M if 15% × job value = $20M: job value of $133M, a fall of <b>{pct(be)}</b>.</p>""",
              T(["Fall in job value", "Job value ($M)", "Revenue at 15% ($M)", "Change vs today ($M)"], rows, title="Exhibit 1 · Revenue at a 15% fee")),
            Q("Where would the losses come from?",
              f"""<p>Repeat work is {pct(rep)} of job value. A freelancer and client who already know each other save 15% by working directly; for a $10,000 project that's $1,500, a strong reason to leave.
              New matches are safer: the client needs Patchwork to find someone.</p>
              <p><b>So-what:</b> the fee rise hits hardest exactly where Patchwork adds least value.</p>"""),
            Q("Design a better fee structure.",
              f"""<p><b>15% on new matches, 10% on repeat work:</b> revenue = {pct(1-rep)} × $200M × 15% + {pct(rep)} × $200M × 10% = <b>${rev_tier:.0f}M</b>: up to +${rev_tier-rev0:.0f}M if new-match volume holds, while protecting repeat pairs. New-match revenue rises from ${(1-rep)*200*0.10:.0f}M to ${(1-rep)*200*0.15:.0f}M, so the change still breaks even if new-match job value falls by a third.</p>
              <ul><li>Add value for repeat work: payment protection, invoicing, tax forms, so staying on the platform is worth the fee</li>
              <li>Charge clients a small fee too, rather than only freelancers</li></ul>"""),
        ],
        f"""Don't raise the fee to 15% across the board. It needs job value to fall less than a third to pay off, and most risk sits in repeat work ({pct(rep)} of job value), where pairs can easily go direct.
        Instead charge 15% on new matches and keep 10% on repeat work, which adds up to about ${rev_tier-rev0:.0f}M a year, and add invoicing and payment protection to make repeat work worth keeping on the platform.
        Risk: freelancers may still see it as a price rise. Next step: test the new fees in one category.""",
        ["Calculates the break-even fall in volume", "Spots the risk of repeat pairs going direct",
         "Designs fees by type of job", "Adds value to justify the fee"],
        "Marketplace take rate · break-even · disintermediation")

CASES.append(patchwork())

# ---------------------------------------------------------------- LeafCart (medium): order economics
def leafcart():
    basket, comm, fee = 45.0, 0.18, 3.99
    courier, pay, support, promo = 7.50, 0.025, 0.60, 2.00
    def card(b): return math.floor(b * pay * 100 + 0.5) / 100     # card fee, rounded to the cent
    def contrib(b=basket, cour=courier, pr=promo):
        return round(b * comm + fee - cour - card(b) - support - pr, 2)
    c0 = contrib()
    c_batch = contrib(cour=courier * 0.7)
    c_basket = contrib(b=55.0, cour=courier * 0.7)
    c_promo = contrib(b=55.0, cour=courier * 0.7, pr=0.80)
    orders = 1.2                                     # M a year
    fixed = 6.0                                      # $M a year
    assert abs(c0 - 0.86) < 1e-9 and c_promo * orders > fixed > c0 * orders
    steps = [("Batch orders (−30% courier cost)", c_batch - c0), ("Basket $45 → $55", c_basket - c_batch), ("Promotions $2.00 → $0.80", c_promo - c_basket)]
    return C(
        "LeafCart", "Every grocery order earns 86 cents",
        "Profitability", "Online marketplace", "Canada", 2,
        """LeafCart delivers groceries from local supermarkets in Toronto in under an hour. It handles 1.2 million orders a year but loses money overall. Investors ask whether it can ever be profitable,
        and what it would take.""",
        [("How does LeafCart earn money?", "18% commission from the supermarket on each basket, plus a $3.99 delivery fee from the customer."),
         ("Average basket?", "$45."),
         ("Costs per order?", "Courier pay $7.50, card fees 2.5% of the basket, customer support $0.60, and promotions (discount codes) averaging $2.00."),
         ("Fixed costs?", "About $6M a year for technology, marketing staff and the office.")],
        ("How can LeafCart become profitable?", [
            ("Revenue per order", ["Basket size", "Commission", "Delivery fee"]),
            ("Cost per order", ["Courier", "Card fees", "Support", "Promotions"]),
            ("Volume vs fixed costs", ["Orders needed to break even"]),
        ]),
        "Per order, the margin is tiny, so more volume alone won't fix this. Courier cost is the biggest item, so batching orders and bigger baskets are likely the main levers.",
        [
            Q("What does LeafCart earn on an average order?",
              f"""<p>Revenue: 18% × $45 = $8.10 + $3.99 fee = $12.09. Costs: $7.50 + $1.13 + $0.60 + $2.00 = $11.23. Contribution: <b>${c0:.2f} an order</b>.</p>
              <p>On 1.2M orders that is ${c0*orders:.1f}M, far below $6M of fixed costs. Break-even would need {fixed/c0:.1f}M orders, about {fixed/c0/orders:.1f}× today.</p>"""),
            Q("Management has three ideas. Size each.",
              f"""<ul><li><b>Batch orders</b> (two orders per courier trip, cutting courier cost 30%): +${c_batch-c0:.2f} → ${c_batch:.2f}</li>
              <li><b>Bigger baskets</b> ($45 → $55 via a minimum order and suggestions): +${c_basket-c_batch:.2f} → ${c_basket:.2f}</li>
              <li><b>Cut promotions</b> to $0.80 by targeting them at new customers only: +${c_promo-c_basket:.2f} → <b>${c_promo:.2f}</b></li></ul>
              <p>With all three: ${c_promo:.2f} × 1.2M = <b>${c_promo*orders:.1f}M</b>, above the $6M of fixed costs.</p>""",
              WF("Today", r(c0, 2), [(a, r(b, 2)) for a, b in steps], "After changes", title="Exhibit 1 · Contribution per order ($)", fmt="{:+,.2f}", base_fmt="{:,.2f}")),
            Q("What could stop this working?",
              """<ul><li>Batching may slow deliveries, LeafCart's main selling point; offer a cheaper 'within 2 hours' option</li>
              <li>A minimum basket may push away small top-up orders</li><li>Cutting promotions could slow growth; measure repeat rates by cohort</li></ul>"""),
        ],
        f"""LeafCart can become profitable, but not through volume: it earns only ${c0:.2f} an order, so it would need about {fixed/c0/orders:.1f}× today's orders to cover fixed costs.
        Batching deliveries, raising the average basket to $55 and targeting promotions at new customers would lift contribution to about ${c_promo:.2f} an order, about ${c_promo*orders:.1f}M a year against $6M of fixed costs.
        Risk: slower or less convenient delivery. Next step: trial batching and a minimum basket in two neighbourhoods.""",
        ["Builds contribution per order line by line", "Shows that volume alone can't fix it",
         "Sizes each lever in dollars per order", "Checks the result against fixed costs"],
        "Unit economics · marketplace levers · break-even")

CASES.append(leafcart())

# ---------------------------------------------------------------- Palletpoint (hard): which side to subsidise
def palletpoint():
    shippers0, loads_per, take = 400, 5, 60.0
    def run(months, fill, churn, cost_per_filled, new_ship=20):
        s, rev, cost = shippers0, 0.0, 0.0
        for _ in range(months):
            filled = s * loads_per * fill
            rev += filled * take
            cost += filled * cost_per_filled
            s = s * (1 - churn) + new_ship
        return rev / 1000, cost / 1000, s
    base = run(12, 0.55, 0.25, 0.0)
    carr = run(12, 0.80, 0.05, 40.0)
    ship = run(12, 0.50, 0.28, 30.0, new_ship=30)
    net = {k: v[0] - v[1] for k, v in {"Do nothing": base, "Pay carriers $40 a load": carr, "Discount shippers $30 a load": ship}.items()}
    assert net["Pay carriers $40 a load"] > net["Do nothing"] > net["Discount shippers $30 a load"]
    run_c = carr[2] * loads_per * 0.80 * take / 1000
    run_b = base[2] * loads_per * 0.55 * take / 1000
    assert run_c > 5 * run_b
    rows = [["Do nothing", "55%", "25%", f"{base[2]:.0f}", num(base[0]), "0", num(net['Do nothing'])],
            ["Pay carriers $40 a load", "80%", "5%", f"{carr[2]:.0f}", num(carr[0]), num(carr[1]), num(net['Pay carriers $40 a load'])],
            ["Discount shippers $30 a load", "50%", "28%", f"{ship[2]:.0f}", num(ship[0]), num(ship[1]), num(net['Discount shippers $30 a load'])]]
    return C(
        "Palletpoint", "A freight marketplace in a new region: which side do we pay?",
        "Growth strategy", "Logistics marketplace", "United States", 3,
        """Palletpoint is an online marketplace where shippers post loads and independent truckers bid to carry them. It earns $60 on each load moved. It launched in the Southeast six months ago,
        and it is struggling: only 55% of posted loads find a carrier, against 85% in its mature regions. The regional head has $1M to spend and asks whether to subsidise carriers or shippers.""",
        [("Shippers?", "400 active shippers, each posting about 5 loads a month. About 20 new shippers join a month."),
         ("Churn?", "When fewer than 70% of their loads are filled, about 25% of shippers stop using Palletpoint each month. In regions with 80% fill, it's about 5%."),
         ("Option A?", "Pay carriers a $40 bonus per load moved in the region for a year. Pilots suggest this lifts fill to about 80%."),
         ("Option B?", "Give shippers $30 off each load moved. More shippers would join (about 30 a month), but with the same carriers, fill would slip to about 50% and churn rise to about 28%.")],
        ("Which side of the marketplace should Palletpoint subsidise?", [
            ("What's broken", ["Fill rate", "Which side is scarce?"]),
            ("Option A: carriers", ["Cost", "Fill and churn"]),
            ("Option B: shippers", ["Cost", "Fill and churn"]),
            ("Over 12 months", ["Revenue minus subsidy"]),
        ]),
        "The problem is on the carrier side: shippers post loads that nobody picks up, so they leave. Subsidising shippers would add loads to a market that can't fill the ones it has.",
        [
            Q("Diagnose the problem. Which side is scarce?",
              """<p>Shippers are posting loads, but 45% go unfilled, so <b>carriers are scarce</b>. Unfilled loads make shippers leave: at 25% a month, the region loses most of its shippers within a few months,
              faster than 20 new ones a month can replace them.</p>"""),
            Q("Model both options over 12 months. Use revenue minus subsidy.",
              f"""<p>Each month: loads filled = shippers × 5 × fill rate; revenue $60 a load; shippers next month = shippers × (1 − churn) + new shippers.</p>
              <p><b>Do nothing:</b> shippers fall to {base[2]:.0f}; 12-month revenue ${base[0]:.0f}k.</p>
              <p><b>Pay carriers:</b> shippers hold at about {carr[2]:.0f}; revenue ${num(carr[0])}k, subsidy ${carr[1]:.0f}k, net <b>${net['Pay carriers $40 a load']:.0f}k</b>.</p>
              <p><b>Discount shippers:</b> shippers fall to {ship[2]:.0f}; revenue ${ship[0]:.0f}k, discount ${ship[1]:.0f}k, net ${net['Discount shippers $30 a load']:.0f}k, worse than doing nothing.</p>
              <p><b>So-what:</b> over the 12 months the carrier bonus only just beats doing nothing, but it leaves a region earning about ${run_c:.0f}k a month instead of ${run_b:.0f}k. The value is in the base it builds.</p>""",
              T(["Option", "Fill rate", "Monthly churn", "Shippers after 12 months", "Revenue ($k)", "Subsidy ($k)", "Net ($k)"], rows, title="Exhibit 1 · 12 months in the Southeast"),
              note="Candidates can approximate; the interviewer wants the direction and rough size, not exact compounding."),
            Q("What happens after the carrier subsidy ends?",
              f"""<p>The subsidy keeps a base of about {carr[2]:.0f} shippers, posting about {num(carr[2]*loads_per)} loads a month. That steady flow of loads is what keeps carriers in the region once the bonus stops.
              Taper it over months 9–12, and track fill weekly; reintroduce a smaller bonus on lanes where fill drops below 75%.</p>"""),
        ],
        f"""Subsidise carriers, not shippers. The Southeast's problem is too few carriers: 45% of loads go unfilled, so shippers leave at 25% a month. A $40-a-load carrier bonus lifts fill to about 80%,
        keeps the shipper base at about {carr[2]:.0f} instead of shrinking to {base[2]:.0f}, pays for itself within the year, and leaves the region earning about ${run_c:.0f}k a month against ${run_b:.0f}k if Palletpoint does nothing. Discounting shippers adds more loads that can't be filled and does worse
        than nothing. Taper the bonus once load volume can keep carriers busy. Risk: carriers may leave when it ends. Next step: launch on the 10 busiest lanes first.""",
        ["Identifies the scarce side of the marketplace", "Links fill rate to churn on the other side",
         "Models both options month by month", "Plans how to remove the subsidy"],
        "Two-sided markets · liquidity · subsidy design", fmt="Candidate-led")

CASES.append(palletpoint())

# ---------------------------------------------------------------- Hearthstay (hard): which city next?
def hearthstay():
    take, nights_per_host, fixed = 0.15, 12, 150.0          # fixed $k launch cost per city
    cities = [  # name, demand nights a month, share we can win, average nightly rate $, host acquisition cost $, guest marketing % of bookings
        ("Lisbon", 18000, 0.12, 120.0, 600.0, 0.08),
        ("Porto", 8000, 0.35, 95.0, 250.0, 0.04),
        ("Seville", 12000, 0.20, 110.0, 350.0, 0.05)]
    res = []
    for nm, d, sh, rate, hc, gm in cities:
        nights = d * sh
        hosts = nights / nights_per_host
        contrib = nights * rate * (take - gm) / 1000          # $k a month
        cost = hosts * hc / 1000 + fixed
        res.append((nm, nights, hosts, contrib, cost, cost / contrib))
    best = min(res, key=lambda x: x[5])
    big = max(res, key=lambda x: cities[[c[0] for c in cities].index(x[0])][1])
    assert best[0] == "Porto" and big[0] == "Lisbon" and big[5] > 1.8 * best[5] and sorted(x[5] for x in res)[1] > best[5] + 1
    rows = [[nm, num(n), num(h), f"{c:.1f}", f"{k:.0f}", f"{p:.1f}"] for nm, n, h, c, k, p in res]
    return C(
        "Hearthstay", "Biggest city or best city? Choosing the next launch",
        "Market entry", "Travel marketplace", "Portugal", 3,
        """Hearthstay is a holiday-rental marketplace with a strong position in northern Spain. It wants to launch one new city next year and is choosing between Lisbon, Porto and Seville.
        The CEO's instinct is Lisbon, the biggest tourist market. The board wants the city that pays back fastest.""",
        [("Hearthstay's model?", "It takes 15% of each booking. It must recruit hosts (property owners) before guests can book."),
         ("Host economics?", "An active host is booked about 12 nights a month on average."),
         ("Launch costs?", "About $150k per city for a local team and legal set-up, plus the cost of recruiting each host."),
         ("Competition?", "Strong in Lisbon (two big platforms), weaker in Porto and Seville."),
         ("City data?", "; ".join(f"{nm}: {num(d)} guest-nights a month, we could win {pct(sh)}, ${rate:.0f} a night, guest marketing {pct(gm)} of bookings, ${hc:.0f} to recruit each host" for nm, d, sh, rate, hc, gm in cities) + ".")],
        ("Which city should Hearthstay launch next?", [
            ("Size of the prize", ["Demand", "Share we can win", "Nightly rate"]),
            ("Cost to build supply", ["Hosts needed", "Cost per host"]),
            ("Cost to win guests", ["Marketing as % of bookings"]),
            ("Payback", ["Launch cost ÷ monthly contribution"]),
        ]),
        "Lisbon is biggest, but with strong competitors Hearthstay would win a small share at a high cost. A smaller city with weak competition may pay back faster.",
        [
            Q("For each city, work out nights booked, hosts needed and monthly contribution.",
              """<p>Nights = demand × share we can win. Hosts needed = nights ÷ 12. Contribution = nights × nightly rate × (15% take − guest marketing %).</p>""",
              T(["City", "Nights a month", "Hosts needed", "Contribution ($k/month)", "Launch cost ($k)", "Payback (months)"], rows, title="Exhibit 1 · City comparison"),
              note="Launch cost = hosts × cost per host + $150k."),
            Q("Which city would you choose, and why not Lisbon?",
              f"""<p><b>{best[0]}</b> pays back in about {best[5]:.0f} months: weaker competition means a large share, hosts are cheap to recruit, and guest marketing is low.</p>
              <p>Lisbon has the most demand, but Hearthstay would win only 12%, hosts cost $600 each to win from rivals, and 8% of each booking goes on marketing,
              leaving 7% of the booking as contribution. Payback: about {big[5]:.0f} months.</p>
              <p><b>So-what:</b> in marketplaces, the best city is where you can become the leader, not the biggest market.</p>""",
              BAR([x[0] for x in res], [r(x[5], 1) for x in res], title="Exhibit 2 · Payback (months)", ylabel="Months", fmt="{:.0f}", h=2.3,
                  highlight=[[x[0] for x in res].index(best[0])])),
            Q("What would you check before committing to Porto?",
              """<ul><li><b>Seasonality:</b> is demand spread through the year, or concentrated in summer?</li><li><b>Regulation:</b> local short-let licence rules and caps</li>
              <li><b>Network effect:</b> guests from Spain may book Porto, so cross-promotion could lower guest marketing further</li><li>Whether Lisbon could follow once Porto proves the model</li></ul>"""),
        ],
        f"""Launch in {best[0]} first. It pays back in about {best[5]:.0f} months, against about {big[5]:.0f} for Lisbon, because weak competition lets Hearthstay win a large share with cheap hosts and little guest marketing.
        Lisbon is the biggest market, but strong rivals would keep Hearthstay's share small and its costs high. Risks: seasonality and short-let licensing in {best[0]}. Next step: recruit 50 hosts as a pilot
        before full launch, then reconsider Lisbon once the region is established.""",
        ["Builds supply needs from demand (hosts per night booked)", "Compares payback, not market size",
         "Explains why share matters more than size in marketplaces", "Checks seasonality and regulation"],
        "Marketplace expansion · supply acquisition · payback", fmt="Candidate-led")

CASES.append(hearthstay())
