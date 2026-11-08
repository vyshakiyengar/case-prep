from lib import *

CASES = []

# ------------------------------------------------------------------ Northline Air
def northline():
    seats = 180
    routes = [  # name, flights/yr, load factor, avg fare ($), cost per flight ($k)
        ("Oslo–Bergen", 4200, 0.82, 110, 13.5),
        ("Oslo–Trondheim", 3800, 0.80, 115, 14.0),
        ("Oslo–Stavanger", 3000, 0.78, 105, 13.0),
        ("Bergen–Tromsø (new)", 1400, 0.52, 140, 21.0),
        ("Stavanger–Bodø (new)", 1300, 0.48, 130, 20.0),
    ]
    overheads = 8.0
    rows, core, newp = [], 0, 0
    for nm, f, lf, fare, cost in routes:
        rev = f * seats * lf * fare / 1e6
        c = f * cost / 1e3
        prof = round(rev - c, 1)          # shown to one decimal; totals add up from the shown rows
        if "new" in nm: newp += prof
        else: core += prof
        rows.append([nm, num(f), pct(lf), f"{fare:,}", num(rev, 1), num(c, 1), signed(prof, 1)])
    total = core + newp - overheads
    assert core > overheads and total < 0 and core + newp > 0
    old_cost = sum(f * c for _, f, _, _, c in routes[:3]) / sum(f for _, f, _, _, c in routes[:3])
    new_cost = sum(f * c for _, f, _, _, c in routes[3:]) / sum(f for _, f, _, _, c in routes[3:])
    f, lf, fare, cost = 1400, 0.52, 140, 21.0
    be = cost * 1000 / (seats * fare)
    pax_now, pax_be = seats * lf, seats * be
    assert be < 1
    return C(
        "Northline Air", "Why did a profitable regional airline start losing money?",
        "Profitability", "Airlines", "Norway", 2,
        """Our client, Northline Air, is a regional airline flying 180-seat jets between Norwegian cities. Two years ago it made
        a healthy profit. Last year it lost money for the first time, even though passenger numbers rose. The CEO wants to know
        why, and what to do.""",
        [("What changed in the network?", "Eighteen months ago Northline opened two new routes in the north: Bergen–Tromsø and Stavanger–Bodø."),
         ("Fleet?", "One aircraft type, 180 seats, all leased. No new aircraft were added; the new routes use spare capacity."),
         ("Competitors?", "A larger rival also flies Bergen–Tromsø, three times a day. Competitors' margins on the old routes are stable."),
         ("Objective?", "Return to profit next year.")],
        ("Why has Northline gone from profit to loss?", [
            ("Revenue by route", ["Passengers = flights × seats × load factor", "Average fare by route", "Old routes vs new routes"]),
            ("Cost by route", ["Cost per flight: fuel, crew, airport fees, leasing", "Longer northern sectors cost more per flight", "Shared overheads"]),
            ("Market", ["Competition on new routes", "Demand on northern routes (seasonal?)", "Fuel price changes"]),
        ]),
        "Passenger numbers grew, so volume isn't the problem. I suspect the two new routes: they're longer (higher cost per flight) and face a strong competitor, so they may be flying half empty.",
        [
            Q("Here is profit by route last year. What's going on?",
              f"""<p>The three original routes earn <b>${num(core, 1)}M</b> together, comfortably covering the ${overheads:.0f}M of overheads.
              The two new routes lose <b>${num(-newp, 1)}M</b>, which turns the airline into a loss of ${num(-total, 1)}M.</p>
              <p>The cause is the <b>load factor</b>: about 50% on the new routes against ~80% on the old ones, while each new
              flight costs about {pct(new_cost/old_cost-1)} more (longer sectors). Higher fares don't make up for it.</p>
              <p><b>So-what:</b> the core business is healthy. This is a new-route problem, so the next question is whether
              those routes can ever break even.</p>""",
              T(["Route", "Flights/yr", "Load factor", "Avg fare ($)", "Revenue ($M)", "Cost ($M)", "Profit ($M)"],
                rows + [["Shared overheads", "", "", "", "", num(overheads, 1), signed(-overheads, 1)], ["Total", "", "", "", "", "", signed(total, 1)]],
                title="Exhibit 1 · Profit by route, last year", bold_last=True,
                note="All aircraft have 180 seats. Revenue = flights × 180 × load factor × fare."),
              note="Strong candidates check one revenue figure: 4,200 × 180 × 82% × $110 ≈ $68M."),
            Q("What load factor would Bergen–Tromsø need to break even at today's fare and cost?",
              f"""<p>Break-even passengers per flight = cost per flight ÷ fare = $21,000 ÷ $140 = <b>{num(pax_be)}</b> passengers.</p>
              <p>Out of 180 seats that is a load factor of <b>{pct(be)}</b>. Today it flies about {num(pax_now)} passengers ({pct(lf)}).</p>
              <p><b>So-what:</b> the route needs ~{num(pax_be - pax_now)} more passengers on every flight, a {pct(pax_be/pax_now-1)} increase in
              demand. With a rival flying the same route three times a day, that is very unlikely through marketing alone.</p>
              <p>Careful: this is the full-cost break-even. To decide whether to close the route, compare revenue per flight (about ${num(pax_now*fare)}) with the costs that would disappear
              (fuel, crew, airport fees), not the aircraft leases, which Northline pays anyway unless the aircraft can be used or sub-leased elsewhere.</p>"""),
            Q("What options does Northline have for the two new routes?",
              """<p><b>Fix the economics</b></p><ul><li>Cut frequency (e.g. from about two return flights a day to one) so each flight fills up</li>
              <li>Raise fares only if demand is business-heavy and price-insensitive (unlikely against a rival)</li>
              <li>Codeshare with the rival to share passengers</li></ul>
              <p><b>Redeploy the aircraft</b></p><ul><li>Add frequencies on the profitable core routes if they are full at peak times</li>
              <li>Charter or lease out the spare aircraft in the summer</li></ul>
              <p><b>Exit</b></p><ul><li>Close a route only if its revenue doesn't cover the costs that would disappear, or its aircraft can earn more elsewhere; check first whether the government subsidises any northern routes</li></ul>"""),
        ],
        f"""Northline is losing money because its two new northern routes fly about half empty while costing ~{pct(new_cost/old_cost-1)} more per flight;
        they lose ${num(-newp, 1)}M, turning a healthy core network into a ${num(-total, 1)}M loss. Bergen–Tromsø would need to fill {pct(be)} of its seats to
        break even, against {pct(lf)} today. I recommend cutting frequency on both routes now, exploring a codeshare or a route subsidy, and closing any route that still doesn't cover
        its avoidable costs (fuel, crew, airport fees) after one season, unless its aircraft can be sub-leased or redeployed more profitably. Move the spare aircraft to peak times on the core routes.
        Risk: leaving the north may weaken the brand there. Next step: check peak-hour demand on the core routes.""",
        ["Splits the network into old vs new routes straight away", "Turns break-even into a load factor, not just a number of passengers",
         "Sees that a rival flying three times a day makes this demand jump unrealistic", "Recommends frequency cuts before full exit"],
        "Route economics · load factor · break-even")

CASES.append(northline())

# ------------------------------------------------------------------ Kettle & Crumb
def kettle():
    # bakery waste: SKUs grew; waste rises
    yrs = ["2023", "2024", "2025"]
    skus = [40, 65, 90]
    rev = [62.0, 64.0, 65.0]
    waste_pct = [0.06, 0.09, 0.13]
    food_cost_pct = 0.30
    waste = [r_ * w for r_, w in zip(rev, waste_pct)]
    ebit = [7.4, 6.0, 3.9]
    # waste in $M is cost of goods thrown away at cost: assume waste% is of revenue at retail value; cost = 30% of that? keep simple: waste cost = waste% × revenue × food cost%
    waste_cost = [r_ * w * food_cost_pct for r_, w in zip(rev, waste_pct)]
    # SKU tail analysis
    tiers = [("Top 30 products", 30, 0.78, 0.10), ("Middle 30", 30, 0.17, 0.20), ("Bottom 30", 30, 0.05, 0.42)]
    rev25 = rev[2]
    tier_rows = []
    for nm, n_, share, wr in tiers:
        tr = rev25 * share
        tier_rows.append([nm, n_, pct(share), money(tr, dp=2), pct(wr), money(tr * wr, dp=2)])
    bottom_rev = rev25 * 0.05
    bottom_waste_retail = bottom_rev * 0.42
    total_waste_retail = sum(rev25 * s * w for _, _, s, w in tiers)
    assert round(total_waste_retail / rev25 * 100) == 13, total_waste_retail / rev25
    # cut bottom 30: assume 60% of their sales move to other products
    keep = 0.8
    lost_rev = bottom_rev * (1 - keep)
    gm = 1 - food_cost_pct
    lost_margin = lost_rev * gm
    waste_saved_cost = bottom_waste_retail * food_cost_pct   # waste valued at cost
    net = waste_saved_cost - lost_margin
    cafes, days, wage, hours = 140, 360, 13, 1.0
    labour = cafes * days * wage * hours / 1e6
    total_gain = net + labour
    return C(
        "Kettle & Crumb", "A bakery chain added products and lost profit",
        "Profitability", "Food retail", "United Kingdom", 1,
        """Kettle & Crumb runs 140 bakery cafés across England. Over two years sales grew a little, but operating profit almost halved,
        from $7.4M to $3.9M. The founder wants to understand why and fix it.""",
        [("What has the company changed?", "It more than doubled its range, from 40 products to 90, to give customers more choice."),
         ("How does baking work?", "Everything is baked fresh each morning in the café. Unsold items are thrown away at closing."),
         ("Prices or wages?", "Prices rose in line with inflation, and so did wages. Neither explains the drop."),
         ("Target?", "Back to at least $6M operating profit next year.")],
        ("Why has profit fallen by $3.5M?", [
            ("Revenue", ["Sales per café", "Average basket", "Product mix"]),
            ("Costs of goods", ["Ingredient cost per item", "Waste (baked but unsold)", "Complexity: more products, smaller batches"]),
            ("Operating costs", ["Staff hours (baking more products)", "Rent and overheads"]),
        ]),
        "The range more than doubled while sales barely moved. More products with the same demand means smaller, less predictable batches, so I expect waste is rising.",
        [
            Q("Here is the trend. What stands out?",
              f"""<p>Sales are up only {pct(rev[2]/rev[0]-1)} while the range is up 125%. Waste has gone from {pct(waste_pct[0])} to
              {pct(waste_pct[2])} of sales. At ingredient cost (30% of sales value), the cost of waste rose from {money(waste_cost[0], dp=2)}
              to {money(waste_cost[2], dp=2)}: about <b>{money(waste_cost[2]-waste_cost[0], dp=2)}</b> of the $3.5M fall.</p>
              <p>The rest probably comes from the same cause: more staff hours to bake 90 products in small batches.</p>
              <p><b>So-what:</b> the extra products add cost but not sales. Let's see which products are wasted most.</p>""",
              T(["", *yrs], [["Products in range", *[str(x) for x in skus]], ["Revenue ($M)", *[f"{x:.1f}" for x in rev]],
                 ["Waste (% of sales value)", *[pct(w) for w in waste_pct]], ["Operating profit ($M)", *[f"{x:.1f}" for x in ebit]]],
                title="Exhibit 1 · Kettle & Crumb, three-year view", note="Ingredients cost about 30% of the sales value of a product.")),
            Q("Here is the 2025 range split into three tiers. Bakers spend about one hour a day per café on the bottom 30 products (staff cost $13 an hour, 140 cafés, open 360 days a year). What happens if we remove the bottom 30?",
              f"""<p>The bottom 30 products bring only {money(bottom_rev, dp=2)} of sales (5%) but waste worth 42% of their sales (about 30% of what's baked is thrown away).</p>
              <p>Assume 80% of their customers buy another product instead:</p>
              <ul><li>Lost sales: 20% × {money(bottom_rev, dp=2)} = {money(lost_rev, dp=2)}, losing 70% gross margin = <b>−{money(lost_margin, dp=2)}</b></li>
              <li>Waste saved: 42% × {money(bottom_rev, dp=2)} = {money(bottom_waste_retail, dp=2)} of sales value, which costs 30% to make = <b>+{money(waste_saved_cost, dp=2)}</b></li>
              <li>Baking time saved: 140 × 360 × $13 × 1 hour = <b>+{money(labour, dp=2)}</b></li></ul>
              <p>Net: about <b>{signed(total_gain, 2, '$', 'M')}</b> a year. On ingredients alone it's roughly neutral ({signed(net, 2, '$', 'M')}); the gain is in labour.</p>
              <p><b>So-what:</b> the range cut is worth doing, but mainly because it simplifies the morning bake, not because of waste.
              The 80% switching assumption matters a lot: test it.</p>""",
              T(["Tier", "Products", "Share of sales", "Sales ($M)", "Waste (% of sales)", "Waste at sales value ($M)"], tier_rows,
                title="Exhibit 2 · Range by tier, 2025", note="Overall waste: about 13% of sales value."),
              note="The trap is to count the full sales of the bottom 30 as profit saved, or to forget that most of their customers will buy something else."),
            Q("What else would you do besides cutting the range?",
              """<ul><li><b>Bake to demand:</b> use till data to set batch sizes per café and day of week</li>
              <li><b>Bake twice a day</b> for best-sellers, so the morning batch can be smaller</li>
              <li><b>Sell before waste:</b> half-price after 4pm or an app for surplus food</li>
              <li><b>Rotate seasonal products</b> instead of keeping all of them all year</li>
              <li><b>Check labour:</b> staff hours per café before and after the range grew</li></ul>"""),
        ],
        f"""Kettle & Crumb's profit fell because the range grew from 40 to 90 products without adding sales, pushing waste from 6% to 13% of
        sales and adding baking hours. I recommend cutting the bottom 30 products, which make 5% of sales but waste product worth 42% of their sales value, worth about {money(total_gain, dp=1)} a year mostly
        through baking time saved, and baking to demand using till data.
        Risk: some loyal customers lose a favourite, so keep a short seasonal slot. The range cut closes only part of the $2.1M gap to the $6M target; bringing waste back towards its old 6% would add about {money((waste_pct[2]-waste_pct[0])*rev[2]*food_cost_pct, dp=1)} at ingredient cost, so baking to demand is the bigger lever. Next step: pilot the shorter range in 15 cafés for six weeks.""",
        ["Links the range growth to waste before seeing the data", "Values waste at ingredient cost, not sales value",
         "Accounts for customers who switch to another product", "Points to labour as the bigger hidden cost"],
        "Complexity cost · waste · product rationalisation")

CASES.append(kettle())

# ------------------------------------------------------------------ PrintWell
def printwell():
    # printers sold at a loss, ink makes money; third-party cartridges taking share
    printers = 2.0   # M units/yr
    printer_margin = -15  # $ per printer
    carts_per_printer_yr = 4  # cartridges bought per printer in use per year
    installed = 10.0  # M printers in use
    own_share = [0.80, 0.55]
    cart_margin = 18  # $ per cartridge
    prof = []
    for s in own_share:
        ink = installed * carts_per_printer_yr * s * cart_margin  # $M
        hw = printers * printer_margin
        prof.append((ink, hw, ink + hw))
    drop = prof[0][2] - prof[1][2]
    # lifetime value of a printer customer: 4 yrs life
    life = 5
    assert installed == printers * life   # 2M sold a year × 5-year life ≈ 10M in use
    ltv_then = printer_margin + life * carts_per_printer_yr * own_share[0] * cart_margin
    ltv_now = printer_margin + life * carts_per_printer_yr * own_share[1] * cart_margin
    # subscription: $4/month, cost per cartridge to company $7 (cart revenue 25, margin 18), 4 carts/yr → cost 28/yr; revenue 48/yr → margin 20/yr; retention keeps share 100% of subscribers
    sub_rev, sub_cost = 6 * 12, 4 * 7
    sub_margin = sub_rev - sub_cost
    retail_margin_now = carts_per_printer_yr * own_share[1] * cart_margin
    return C(
        "PrintWell", "A printer maker's ink profits are disappearing",
        "Profitability", "Consumer electronics", "Germany", 2,
        f"""PrintWell makes home printers sold across Europe. Its operating profit has fallen from ${num(prof[0][2])}M to ${num(prof[1][2])}M in three years even though
        it sells as many printers as before. The CEO wants to know why and how to stop the decline.""",
        [("Business model?", "Printers are sold below cost. Profit comes from ink cartridges, which customers buy over the life of the printer."),
         ("What changed?", "Cheaper third-party cartridges that fit PrintWell printers are now sold widely online."),
         ("Printers in use?", "About 10 million PrintWell printers are in use; each lasts about five years."),
         ("Objective?", "Stop the decline and find a model that holds up against third-party ink.")],
        ("Why is profit falling while printer sales are flat?", [
            ("Printer hardware", ["Units sold", "Loss per printer", "Mix of models"]),
            ("Ink (aftermarket)", ["Printers in use", "Cartridges per printer per year", "PrintWell's share of those cartridges", "Margin per cartridge"]),
            ("Market", ["Third-party ink: price, quality, availability", "Customers printing less"]),
        ]),
        "Profit lives in ink. If printer sales are flat, the likely cause is PrintWell selling fewer cartridges per printer: third-party ink taking share.",
        [
            Q("Use this data to explain the profit fall.",
              f"""<p>Ink profit = printers in use × cartridges per printer × PrintWell's share × margin.</p>
              <ul><li>Then: 10M × 4 × 80% × $18 = <b>${num(prof[0][0])}M</b></li>
              <li>Now: 10M × 4 × 55% × $18 = <b>${num(prof[1][0])}M</b></li></ul>
              <p>Hardware loses the same ${num(-prof[0][1])}M a year in both periods. So profit fell from ${num(prof[0][2])}M to ${num(prof[1][2])}M,
              a drop of <b>${num(drop)}M</b>, all from share of cartridges.</p>
              <p><b>So-what:</b> the business model depends on owning the ink. It has lost 25 percentage points of cartridge share (80% → 55%), almost a third of its share, to cheaper copies.</p>""",
              T(["", "Three years ago", "Today"], [["Printers sold per year (M)", "2.0", "2.0"], ["Profit per printer sold ($)", "−15", "−15"],
                 ["Printers in use (M)", "10", "10"], ["Cartridges per printer per year", "4", "4"],
                 ["PrintWell's share of cartridges", "80%", "55%"], ["Margin per PrintWell cartridge ($)", "18", "18"]],
                title="Exhibit 1 · Printer and ink economics")),
            Q("What is a customer worth over the life of a printer, then and now?",
              f"""<p>Lifetime value = −$15 on the printer + 5 years × 4 cartridges × share × $18.</p>
              <ul><li>Then: −15 + 20 × 80% × 18 = <b>${num(ltv_then)}</b></li><li>Now: −15 + 20 × 55% × 18 = <b>${num(ltv_now)}</b></li></ul>
              <p><b>So-what:</b> each customer is worth about a third less. The printer is still worth subsidising, but the
              ink needs protecting.</p>"""),
            Q("PrintWell is considering an ink subscription: $6 a month, cartridges delivered automatically. Each cartridge costs PrintWell $7 to make and ship. A typical home uses 4 a year. Is it attractive?",
              f"""<p>Per subscriber per year: revenue $72, cost 4 × $7 = $28, so margin <b>${num(sub_margin)}</b>.</p>
              <p>A typical non-subscriber today gives PrintWell 4 × 55% × $18 = <b>${num(retail_margin_now, 1)}</b> a year.</p>
              <p>So a subscriber is worth about ${num(sub_margin - retail_margin_now, 1)} more a year than the average customer today, even though PrintWell
              earns less per cartridge, because a subscriber buys all of their ink from PrintWell, not 55% of it.</p>
              <p>But the average hides a split. A home that already buys only PrintWell ink earns it 4 × $18 = ${carts_per_printer_yr*cart_margin} a year, and would be worth ${carts_per_printer_yr*cart_margin - sub_margin} less on the subscription.
              The subscription only adds value for homes buying less than ${num(sub_margin)} ÷ ${carts_per_printer_yr*cart_margin} ≈ {pct(sub_margin/(carts_per_printer_yr*cart_margin))} of their ink from PrintWell.</p>
              <p><b>So-what:</b> worth launching, but aimed at new printer buyers and customers who have drifted to third-party ink, not loyal buyers. Track take-up by segment,
              and use page limits per plan so heavy users don't make the flat fee unprofitable.</p>"""),
        ],
        f"""PrintWell's profit fell ${num(drop)}M because its share of ink cartridges dropped from 80% to 55% as third-party ink spread;
        printers still sell, but each customer is now worth about ${num(ltv_now)} instead of ${num(ltv_then)}. I recommend launching an ink subscription
        with page-based plans, which earns ~${num(sub_margin)} a year per home (vs ${num(retail_margin_now, 1)} for the average customer today) and locks in the ink. Bundle it with new printers and target homes that have drifted to third-party ink: it only adds value for homes buying less than about {pct(sub_margin/(carts_per_printer_yr*cart_margin))} of their ink from PrintWell.
        Risk: heavy users could make a flat fee unprofitable, so tie plans to pages printed. Next step: pilot in one country with new printer buyers.""",
        ["Writes ink profit as a formula before calculating", "Sees the printer loss as an investment in a customer",
         "Spots that loyal buyers would be worth less on the subscription", "Flags heavy users as the risk in a flat fee"],
        "Razor-and-blade model · lifetime value · subscription maths")

CASES.append(printwell())

# ------------------------------------------------------------------ Sunrise Mobile (Kenya)
def sunrise():
    subs = [12.0, 12.4, 12.6]          # M subscribers
    arpu = [4.20, 3.80, 3.40]          # $ per month
    years = ["2023", "2024", "2025"]
    rev = [s * a * 12 for s, a in zip(subs, arpu)]   # $M
    voice = [2.10, 1.70, 1.30]; data = [1.50, 1.60, 1.65]; other = [0.60, 0.50, 0.45]
    for a, v, d, o in zip(arpu, voice, data, other): assert abs(a - (v + d + o)) < 1e-9
    # bundle option
    base_users = 12.6
    target_share = 0.25
    uplift = 1.20  # $ a month extra from bundle buyers (net of cannibalisation)
    cost_per = 0.30
    gain = base_users * target_share * (uplift - cost_per) * 12  # $M
    return C(
        "Sunrise Mobile", "More subscribers, less money: a mobile operator's shrinking revenue",
        "Profitability", "Telecoms", "Kenya", 2,
        """Sunrise Mobile is Kenya's third-largest mobile network. It added subscribers every year, yet revenue has fallen two years in a row.
        The board wants to know why and how to grow revenue again.""",
        [("Customer base?", "Mostly prepaid customers who top up small amounts. 12.6 million subscribers today."),
         ("Prices?", "Sunrise matched a rival's price cut on calls two years ago. Data prices are unchanged."),
         ("Market trend?", "Across Kenya, people are switching from calls to messaging and video calls on apps, which use data."),
         ("Objective?", "Grow revenue by at least 5% a year.")],
        ("Why is revenue falling while subscribers grow?", [
            ("Subscribers", ["New customers", "Churn", "Mix (high- vs low-spend)"]),
            ("Revenue per subscriber (ARPU)", ["Voice", "Data", "Other (SMS, mobile money fees)"]),
            ("Market", ["Price war on calls", "Shift from calls to apps (over data)", "Rival bundles"]),
        ]),
        "Subscribers are up, so revenue per subscriber must be falling. With calls moving to apps and a price cut on calls, voice ARPU is my first suspect.",
        [
            Q("Here is revenue per subscriber per month (ARPU) broken down. What's happening?",
              f"""<p>Total revenue = subscribers × ARPU × 12: ${rev[0]:.0f}M → ${rev[2]:.0f}M, down {pct(1 - rev[2]/rev[0])}.</p>
              <p>ARPU fell $0.80 a month. Voice fell $0.80, other fell $0.15, and data grew only $0.15. Customers are moving calls onto apps, and the price
              cut made the remaining calls cheaper.</p>
              <p><b>So-what:</b> data is where usage is going, but Sunrise isn't capturing it: data ARPU grew just 10% while voice shrank 38%.</p>""",
              T(["$ per subscriber per month", *years], [["Voice", *[f"{x:.2f}" for x in voice]], ["Data", *[f"{x:.2f}" for x in data]], ["Other", *[f"{x:.2f}" for x in other]],
                 ["Total ARPU", *[f"{x:.2f}" for x in arpu]], ["Subscribers (M)", *[f"{x:.1f}" for x in subs]]], title="Exhibit 1 · ARPU breakdown", bold_last=False)),
            Q("Why might data revenue be growing so slowly when data usage is rising fast?",
              """<ul><li><b>Price per GB falling</b> as customers buy larger, cheaper bundles</li>
              <li><b>Free Wi-Fi</b> at home, work and malls handles much of the app traffic</li>
              <li><b>Network quality</b>: if Sunrise's 4G is weaker than rivals', heavy data users keep a second SIM for data</li>
              <li><b>No bundles</b>: rivals sell daily bundles of calls, data and social media; Sunrise sells them separately</li></ul>
              <p>Good next question: what share of Sunrise customers carry a rival's SIM for data?</p>"""),
            Q(f"Sunrise could launch a daily bundle. Research suggests 25% of subscribers would take it, adding $1.20 a month each after cannibalisation, at a cost of $0.30 a month each. What's the annual impact?",
              f"""<p>Buyers: 25% × 12.6M = {num(base_users*target_share, 2)}M. Net gain each: $1.20 − $0.30 = $0.90 a month.</p>
              <p>Annual: 3.15M × $0.90 × 12 = <b>${gain:.0f}M</b>, about {pct(gain/rev[2], 1)} of today's revenue.</p>
              <p><b>So-what:</b> it adds {pct(gain/rev[2], 1)} of today's revenue, but revenue is falling about {pct(1-rev[2]/rev[1])} a year (${rev[1]:.0f}M → ${rev[2]:.0f}M), so the bundle alone would slow the decline rather than deliver 5% growth. To reach +5%, Sunrise also has to stop the voice decline and win back data-SIM users through network investment.</p>"""),
        ],
        f"""Sunrise's revenue is falling because voice revenue per customer dropped 38% as calls moved to apps and prices were cut, while data
        revenue barely grew. I recommend launching daily bundles of data and social media, worth about ${gain:.0f}M a year ({pct(gain/rev[2], 1)} of revenue, not enough on its own to offset the ~{pct(1-rev[2]/rev[1])} yearly decline),
        and investing in 4G where customers carry a rival's SIM for data. Stop competing on voice price. Risk: rivals cut bundle prices in response.
        Next step: test bundle prices in two regions.""",
        ["Recognises ARPU, not subscribers, as the driver", "Separates voice, data and other",
         "Explains why data revenue lags data usage", "Sizes the bundle and compares it with the target"],
        "ARPU · revenue mix · bundling")

CASES.append(sunrise())

# ------------------------------------------------------------------ Maple Cinemas
def maple():
    screens = 300
    # per-visitor economics
    ticket = 13.0; ticket_share_to_studio = 0.55
    conc_spend = [6.5, 5.0]   # per visitor before / after
    conc_margin = 0.80
    visitors = [16.0, 13.0]   # M
    fixed = [148.0, 152.0]     # $M
    res = []
    for v, c_, f in zip(visitors, conc_spend, fixed):
        tick_net = v * ticket * (1 - ticket_share_to_studio)
        conc = v * c_ * conc_margin
        res.append((tick_net, conc, tick_net + conc - f))
    # premium screen conversion: convert 40 screens, +$6 ticket premium, +15% attendance on those
    conv = 40
    base_vis_per_screen = visitors[1] * 1e6 / screens
    extra_vis = conv * base_vis_per_screen * 0.15
    prem_rev = (conv * base_vis_per_screen + extra_vis) * 6 * (1 - 0.0)  # premium fee kept in full
    extra_ticket_net = extra_vis * ticket * (1 - ticket_share_to_studio)
    extra_conc = extra_vis * conc_spend[1] * conc_margin
    annual = (prem_rev + extra_ticket_net + extra_conc) / 1e6
    capex = conv * 1.2   # $M
    payback = capex / annual
    return C(
        "Maple Cinemas", "Fewer visitors and smaller snack spend at a cinema chain",
        "Profitability", "Leisure & entertainment", "Canada", 2,
        f"""Maple Cinemas runs 300 screens across Canada. Two years ago it made ${num(res[0][2])}M of operating profit; this year it expects
        a loss of about ${num(-res[1][2])}M. The CEO wants to understand what happened and how to get back to profit.""",
        [("Business model?", "Ticket revenue is shared with film studios (Maple keeps 45%). Food and drink (concessions) have an 80% margin and Maple keeps all of it."),
         ("Prices?", "Ticket prices are flat at about $13. Snack prices rose slightly."),
         ("Industry?", "Cinema attendance across Canada is down ~15%. Streaming windows are shorter."),
         ("Objective?", "Return to at least $20M operating profit.")],
        (f"Why has profit gone from ${num(res[0][2])}M to a loss?", [
            ("Visitors", ["Market attendance", "Maple's share", "Visits per screen"]),
            ("Revenue per visitor", ["Ticket price and studio share", "Concession spend per head", "Premium formats"]),
            ("Costs", ["Fixed: rent, staff, utilities", "Variable: concession cost of goods"]),
        ]),
        "A cinema is mostly fixed cost, so a fall in visitors hits profit hard. Concessions carry a far higher margin rate than tickets, so I'd also check spend per visitor.",
        [
            Q("Calculate operating profit two years ago and today.",
              f"""<p>Profit = visitors × (ticket × 45% + snack spend × 80%) − fixed costs.</p>
              <ul><li>Two years ago: 16M × (13 × 0.45 + 6.5 × 0.8) − 148 = 16 × (5.85 + 5.20) − 148 = <b>${num(res[0][2])}M</b></li>
              <li>Today: 13M × (5.85 + 4.00) − 152 = <b>{money(res[1][2], '$', 0)}</b></li></ul>
              <p>Two things: 3M fewer visitors (−19%), and each visitor spends $1.50 less on snacks, which cuts margin per head by $1.20.</p>
              <p><b>So-what:</b> lost visitors cost about $33M (3M × $11.05 of margin each), lower snack spend about $16M (13M × $1.20), and fixed costs rose $4M: about $53M of swing in total. Concessions carry a much higher margin rate (80% vs 45%), so each dollar of snack spend lost hurts profit almost twice as much as a dollar of ticket revenue. Spend per head dropped 23%, and that is partly within Maple's control.</p>""",
              T(["", "Two years ago", "Today"], [["Visitors (M)", "16.0", "13.0"], ["Average ticket ($)", "13.00", "13.00"],
                 ["Maple's share of ticket", "45%", "45%"], ["Concession spend per visitor ($)", "6.50", "5.00"],
                 ["Concession margin", "80%", "80%"], ["Fixed costs ($M)", "148", "152"]], title="Exhibit 1 · Cinema economics")),
            Q("Why might snack spend per visitor have fallen?",
              """<ul><li>Price rises pushed customers past a threshold ($10 for a popcorn and drink)</li>
              <li>Long queues at peak times, so people skip the counter</li>
              <li>Mix shift: fewer family films and more adult dramas</li>
              <li>Customers bringing their own snacks</li></ul>
              <p>Quick fixes: order-ahead in the app, combo pricing below a round number, self-service drinks.</p>"""),
            Q("Maple could convert 40 screens to premium (reclining seats, better sound) for $1.2M each. Premium tickets cost $6 more, Maple keeps all of the premium, and attendance on those screens rises 15%. How long is the payback?",
              f"""<p>Visitors per screen today: 13M ÷ 300 ≈ {num(base_vis_per_screen)}. On 40 screens: {num(conv*base_vis_per_screen)} visitors, plus 15% = {num(extra_vis)} extra.</p>
              <ul><li>Premium fee: {num(conv*base_vis_per_screen+extra_vis)} × $6 = ${prem_rev/1e6:.2f}M</li>
              <li>Extra visitors' tickets: {num(extra_vis)} × 13 × 45% = ${extra_ticket_net/1e6:.2f}M</li>
              <li>Extra visitors' snacks: {num(extra_vis)} × 5 × 80% = ${extra_conc/1e6:.2f}M</li></ul>
              <p>Total: <b>${annual:.1f}M a year</b> on a ${capex:.0f}M investment: payback in <b>{payback:.1f} years</b>.</p>
              <p><b>So-what:</b> attractive. Premium screens also cut seats, so check they don't sell out on weekends. And check how much of the extra 15% comes from Maple's own standard screens: if all of it did, the gain would be the premium fee alone (about $12.0M) and payback about 4.0 years.</p>"""),
        ],
        f"""Maple slipped to a loss because visitors fell 19% with the market and snack spend per visitor fell 23%, and with mostly fixed costs that
        wiped out profit. I recommend (1) fixing concessions with app ordering and combo pricing, and (2) converting 40 screens to premium, which pays
        back in about {payback:.1f} years and adds ${annual:.1f}M a year. Risk: premium screens have fewer seats, so blockbuster weekends could sell out.
        Next step: pilot premium in five busy sites.""",
        ["Builds profit per visitor before totals", "Spots that concessions earn a far higher margin per dollar than tickets",
         "Counts extra visitors' snack spend in the premium payback", "Flags lost seats on premium screens"],
        "Fixed-cost leverage · per-visitor economics · payback")

CASES.append(maple())

# ------------------------------------------------------------------ Brookhollow Water
def aquapure():
    # route density
    cases_ = [40.0, 41.0]   # M cases per year
    stores = [9000, 15000]
    cases_per_store = [c * 1e6 / s for c, s in zip(cases_, stores)]
    # route cost: truck day $300; truck visits per day
    truck_day = 300
    stops_per_day = [25, 22]
    drop_cases = [c * 1e6 / s / 52 for c, s in zip(cases_, stores)]   # cases per store per week (1 visit/week)
    cost_per_drop = [truck_day / s for s in stops_per_day]
    cost_case = [cd / dc for cd, dc in zip(cost_per_drop, drop_cases)]
    # tail stores
    tail_stores = 6000; tail_cases_week = 8
    tail_cost_case = (truck_day / 20) / tail_cases_week
    price_margin_case = 0.70  # $ gross margin per case before distribution
    return C(
        "Brookhollow Water", "A bottled-water company sells more but earns less",
        "Profitability", "Beverages", "Mexico", 2,
        """Brookhollow Water sells bottled water in Mexico through small corner shops (tienditas). Over two years it grew from 9,000 to 15,000 shops,
        but sales volume barely moved and profit fell. The CEO asks why.""",
        [("How does Brookhollow Water deliver?", "Its own trucks visit each shop once a week. A truck and crew cost about $300 a day."),
         ("Why add shops?", "The sales team is paid a bonus for each new shop signed."),
         ("Prices?", "Unchanged. Gross margin before delivery is about $0.70 a case."),
         ("Objective?", "Restore profit without losing volume.")],
        ("Why is profit falling as distribution grows?", [
            ("Revenue", ["Cases sold", "Price and mix"]),
            ("Product cost", ["Bottles, water, labelling"]),
            ("Distribution cost", ["Cost per truck day", "Stops per day", "Cases per stop (drop size)"]),
        ]),
        "Volume is flat but there are two-thirds more shops, so each delivery must be much smaller. Delivery cost per case is probably the problem.",
        [
            Q("Use this data to compare delivery cost per case two years ago and now.",
              f"""<p>Cases per shop per week: then 40M ÷ 9,000 ÷ 52 ≈ <b>{drop_cases[0]:.1f}</b>; now 41M ÷ 15,000 ÷ 52 ≈ <b>{drop_cases[1]:.1f}</b>.</p>
              <p>Cost per stop: then $300 ÷ 25 = ${cost_per_drop[0]:.2f}; now $300 ÷ 22 ≈ ${cost_per_drop[1]:.2f} (shops are more spread out).</p>
              <p>Cost per case: then ${cost_per_drop[0]:.2f} ÷ {drop_cases[0]:.1f} ≈ <b>${cost_case[0]:.2f}</b>; now ${cost_per_drop[1]:.2f} ÷ {drop_cases[1]:.1f} ≈ <b>${cost_case[1]:.2f}</b>.</p>
              <p><b>So-what:</b> delivery cost per case is up {pct(cost_case[1]/cost_case[0]-1)}. The new shops each buy very little, so every truck stop moves fewer cases.</p>""",
              T(["", "Two years ago", "Today"], [["Shops served", "9,000", "15,000"], ["Cases sold per year (M)", "40", "41"],
                 ["Stops per truck per day", "25", "22"], ["Truck and crew cost per day ($)", "300", "300"], ["Visits per shop", "Weekly", "Weekly"]],
                title="Exhibit 1 · Distribution data")),
            Q("Analysis shows about 6,000 of the shops buy only 8 cases a week, and a truck can only reach 20 of them a day. Are they profitable?",
              f"""<p>Cost per stop: $300 ÷ 20 = $15. Per case: $15 ÷ 8 = <b>${tail_cost_case:.2f}</b>.</p>
              <p>Gross margin before delivery is $0.70 a case, so each case to these shops <b>loses ${tail_cost_case-price_margin_case:.2f}</b>.</p>
              <p><b>So-what:</b> the sales bonus rewards adding shops that cost more to serve than they earn.</p>"""),
            Q("What should Brookhollow Water do?",
              """<ul><li><b>Visit small shops every two weeks</b> with bigger drops (check they have storage space)</li>
              <li><b>Use distributors</b> or shared delivery for low-volume areas</li>
              <li><b>Minimum order</b> per delivery, or a delivery fee below it</li>
              <li><b>Change the sales bonus</b> from shops signed to profitable volume</li>
              <li><b>Re-plan routes</b> to cluster stops</li></ul>"""),
        ],
        f"""Brookhollow Water's profit fell because it spread the same volume across two-thirds more shops: delivery cost per case rose {pct(cost_case[1]/cost_case[0]-1)},
        and 6,000 small shops lose about ${tail_cost_case-price_margin_case:.2f} on every case. I recommend moving those shops to fortnightly delivery or a distributor,
        setting a minimum order, and paying the sales team on profitable volume rather than new shops. Risk: some small shops switch to a rival brand.
        Next step: re-route one region with fortnightly visits for two months.""",
        ["Converts the data to cases per stop", "Finds that the new shops lose money on every case",
         "Links the problem to the sales incentive", "Proposes cheaper service, not just dropping shops"],
        "Route economics · cost to serve · incentives")

CASES.append(aquapure())

# ------------------------------------------------------------------ Lumen Bank
def lumen():
    cac = [60, 140]   # $ per new customer
    customers_new = [200, 320]  # k per year
    margin_per_yr = 45   # $ net margin per active customer per year
    churn = [0.15, 0.29]   # last year: the channel mix below implies 28.6%
    life = [1 / c for c in churn]
    ltv = [margin_per_yr * l for l in life]
    # break-even CAC, with discounting ignored
    marketing = [c * n / 1000 for c, n in zip(cac, customers_new)]  # $M
    # source mix: switching bonus customers
    seg = [("Organic & referral", 120, 40, 0.12), ("Comparison sites", 110, 160, 0.25), ("$100 switching bonus", 90, 250, 0.55)]
    seg_rows = []
    for nm, k, c_, ch in seg:
        l_ = margin_per_yr / ch
        seg_rows.append([nm, num(k), f"${c_}", pct(ch), f"${num(l_)}", f"{l_/c_:.2f}×" if l_ / c_ < 1 else f"{l_/c_:.1f}×"])
    tot_k = sum(s[1] for s in seg); assert tot_k == customers_new[1]
    blended = sum(s[1] * s[2] for s in seg) / tot_k
    close(round(blended), cac[1])
    return C(
        "Lumen Bank", "A digital bank grows fast but its losses grow faster",
        "Profitability", "Financial services", "United Kingdom", 3,
        """Lumen is a UK app-only bank. It signed up 320,000 new customers last year, 60% more than the year before, but its losses
        doubled. Investors want a path to profit within two years.""",
        [("How does Lumen make money?", "Interest margin on deposits plus card fees: about $45 a year from an average active customer."),
         ("Cost of winning customers?", "Advertising, comparison-site fees, and recently a $100 bonus for switching your salary account."),
         ("Customer loss?", "Customers who stop using the account, measured as annual churn."),
         ("Operating costs?", "Mostly fixed (technology, compliance). Assume flat.")],
        ("Why are losses growing as Lumen grows?", [
            ("Value per customer", ["Annual margin per active customer", "How long customers stay (churn)"]),
            ("Cost to acquire", ["Cost per new customer by channel", "Mix of channels"]),
            ("Fixed costs", ["Technology, compliance, staff"]),
        ]),
        "If fixed costs are flat, losses grow only if each new customer costs more than they're worth. I'd compare acquisition cost with lifetime value by channel.",
        [
            Q("Compare last year with the year before. What's happening to customer economics?",
              f"""<p>Lifetime value ≈ annual margin ÷ churn (ignoring discounting).</p>
              <ul><li>Year before: $45 ÷ 15% = <b>${num(ltv[0])}</b> vs acquisition cost $60: ratio {ltv[0]/cac[0]:.1f}×</li>
              <li>Last year: $45 ÷ 29% = <b>${num(ltv[1])}</b> vs acquisition cost $140: ratio {ltv[1]/cac[1]:.1f}×</li></ul>
              <p>Marketing spend rose from {money(marketing[0])} to {money(marketing[1])}.</p>
              <p><b>So-what:</b> new customers now cost about as much as they will ever earn. Growth is no longer creating value.</p>""",
              T(["", "Year before", "Last year"], [["New customers (k)", "200", "320"], ["Cost per new customer ($)", "60", "140"],
                 ["Annual churn of new customers", "15%", "29%"], ["Margin per active customer per year ($)", "45", "45"]],
                title="Exhibit 1 · Customer acquisition")),
            Q("Here is last year's split by channel. What do you see?",
              f"""<p>Lifetime value ÷ acquisition cost by channel:</p>
              <ul><li>Organic & referral: ${num(45/0.12)} on $40: <b>{45/0.12/40:.1f}×</b></li>
              <li>Comparison sites: ${num(45/0.25)} on $160: <b>{45/0.25/160:.1f}×</b></li>
              <li>Switching bonus: ${num(45/0.55)} on $250: <b>{45/0.55/250:.2f}×</b>, losing money on every customer</li></ul>
              <p>The switching bonus attracts people who take the $100 and leave: 55% churn.</p>
              <p><b>So-what:</b> one channel drives most of the loss. Cut it and lean on referrals.</p>""",
              T(["Channel", "New customers (k)", "Cost per customer", "Annual churn", "Lifetime value", "Value ÷ cost"], seg_rows,
                title="Exhibit 2 · Acquisition by channel, last year", note="Lifetime value = $45 ÷ churn."),
              note="Blended cost per customer checks out: (120×40 + 110×160 + 90×250) ÷ 320 ≈ $140."),
            Q("How could Lumen lower churn, so each customer is worth more?",
              """<ul><li><b>Pay the bonus in stages</b>: $25 a month for four months while the salary keeps arriving</li>
              <li><b>Make it the main account</b>: bill-splitting, savings pots, salary-day features</li>
              <li><b>Onboarding nudges</b> in the first 30 days, when most churn happens</li>
              <li><b>Referral rewards</b> for both sides (the cheapest, stickiest channel)</li></ul>"""),
        ],
        f"""Lumen's losses doubled because it bought growth with a $100 switching bonus that brings customers worth about ${num(45/0.55)} for $250 each;
        overall, a new customer now costs about what they earn over their life. I recommend stopping the upfront bonus (pay it in instalments tied to salary
        deposits), doubling down on referrals, and capping comparison-site spend at a 2× value-to-cost ratio. Growth will slow, but every customer added will make money.
        Risk: slower growth may disappoint investors. Next step: test the staged bonus on half of new sign-ups.""",
        ["Uses lifetime value vs acquisition cost, not just totals", "Breaks results down by channel",
         "Explains why the bonus brings high churn", "Accepts slower growth in exchange for profitable growth"],
        "Lifetime value · acquisition cost · churn")

CASES.append(lumen())
