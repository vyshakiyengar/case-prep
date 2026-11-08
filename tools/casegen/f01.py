"""Profitability diagnostics. Concepts from CaseCraft #001, #002, #003, #005; rewritten from scratch."""
from lib import *
CASES = []

# ---------------------------------------------------------------- Meadowlane Grocers (easy, interviewer-led)
def meadowlane():
    q0, q1 = 2.10, 1.99          # M baskets
    p0, p1 = 22.0, 24.0          # $ per basket
    c0, c1 = 13.0, 15.0          # $ cost of goods per basket
    F0, F1 = 13.5, 15.2          # $M fixed (staff, rent, energy)
    rev0, rev1 = q0 * p0, q1 * p1
    pr0, pr1 = q0 * (p0 - c0) - F0, q1 * (p1 - c1) - F1
    vol = (q1 - q0) * (p0 - c0); price = (p1 - p0) * q1; cost = -(c1 - c0) * q1; fixed = -(F1 - F0)
    close(vol + price + cost + fixed, pr1 - pr0)
    fx = [("Staff wages", 0.95), ("Energy", 0.50), ("Rent and business rates", 0.15), ("Other", 0.10)]
    close(sum(v for _, v in fx), F1 - F0)
    need = (pr0 + F1) / (p1 - c1)
    years = ["Last year", "This year"]
    return C(
        "Meadowlane Grocers", "Sales are up, profit has halved. Why?",
        "Profitability", "Grocery retail", "United Kingdom", 1,
        f"""Meadowlane is a family-owned grocer with three large stores in Yorkshire. Sales rose {pct(rev1/rev0-1)} this year to
        ${rev1:.1f}M, but operating profit fell by half, from ${pr0:.1f}M to ${pr1:.1f}M. The owners want to know what happened
        and what to do about it.""",
        [("What do we mean by profit?", "Operating profit: sales minus cost of goods, minus store costs (staff, rent, energy)."),
         ("Has anything changed in the market?", "A discount supermarket opened two miles from the largest store last spring."),
         ("Have Meadowlane's prices changed?", "Yes. Suppliers raised prices sharply, especially for fresh food, and Meadowlane passed the increases on."),
         ("Objective?", "Get back to last year's profit within two years.")],
        ("Why did profit halve while sales grew?", [
            ("Revenue", ["Number of baskets (shopping trips)", "Average spend per basket", "By store: is it the store near the discounter?"]),
            ("Cost of goods", ["Cost per basket", "Supplier price rises", "Mix of products"]),
            ("Store costs (fixed)", ["Staff wages and hours", "Energy", "Rent and rates"]),
        ]),
        "Sales grew because prices rose, not because more people shopped. I suspect two things: fewer baskets after the discounter opened, and higher store costs such as wages and energy.",
        [
            Q("Here are Meadowlane's numbers for the last two years. Build a profit bridge: how much did each driver add or take away?",
              f"""<p>Profit per basket is spend minus cost of goods: ${num(p0-c0)} last year, ${num(p1-c1)} this year. <b>Unchanged.</b></p>
              <ul><li><b>Price:</b> +$2 × {q1:.2f}M baskets = <b>{signed(price, 2, '$', 'M')}</b></li>
              <li><b>Cost of goods:</b> −$2 × {q1:.2f}M = <b>{signed(cost, 2, '$', 'M')}</b> (the two cancel out: supplier inflation was passed on in full)</li>
              <li><b>Volume:</b> {signed(q1-q0, 2)}M baskets × $9 = <b>{signed(vol, 2, '$', 'M')}</b></li>
              <li><b>Fixed costs:</b> ${F0:.1f}M → ${F1:.1f}M = <b>{signed(fixed, 2, '$', 'M')}</b></li></ul>
              <p>Total: {signed(pr1-pr0, 2, '$', 'M')}, matching the fall from ${pr0:.1f}M to ${pr1:.1f}M.</p>
              <p><b>So-what:</b> the supplier inflation everyone talks about is not the problem; it went straight into prices. Profit fell
              because store costs rose ${F1-F0:.1f}M and Meadowlane lost {num((q0-q1)*1000)}k baskets ({pct((q1-q0)/q0)}).</p>""",
              T(["", *years], [["Baskets (M)", f"{q0:.2f}", f"{q1:.2f}"], ["Average spend per basket ($)", f"{p0:.2f}", f"{p1:.2f}"],
                 ["Cost of goods per basket ($)", f"{c0:.2f}", f"{c1:.2f}"], ["Store costs: staff, rent, energy ($M)", f"{F0:.1f}", f"{F1:.1f}"]],
                title="Exhibit 1 · Meadowlane, all three stores"),
              note="Many candidates stop at 'costs went up'. Push for the bridge: it shows that cost of goods is a red herring."),
            Q("Here is what drove the rise in store costs; the wage rise follows the higher legal minimum wage. Could winning back baskets alone restore last year's profit?",
              f"""<p>Wages ({money(fx[0][1], '$', 2)}) and energy ({money(fx[1][1], '$', 2)}) explain {pct((fx[0][1]+fx[1][1])/(F1-F0))} of the increase.
              The wage rise is driven by the legal minimum wage, so it won't reverse.</p>
              <p>To earn ${pr0:.1f}M again at today's $9 per basket and ${F1:.1f}M of store costs, Meadowlane needs
              (${pr0:.1f}M + ${F1:.1f}M) ÷ $9 = <b>{need:.2f}M baskets</b>, {pct(need/q1-1)} more than today and more than it ever had.</p>
              <p><b>So-what:</b> volume alone won't fix this. Meadowlane needs to win back some baskets <i>and</i> run its stores more efficiently.</p>""",
              BAR([l for l, _ in fx], [v for _, v in fx], title="Exhibit 2 · Increase in store costs this year ($M)", fmt="{:.2f}", ylabel="$M", h=2.3)),
            Q("What would you recommend to the owners?",
              """<p><b>Win back shoppers near the discounter</b></p><ul><li>Price-match 100 everyday staples; keep margin on fresh, local and deli</li>
              <li>A loyalty scheme so Meadowlane knows who has stopped coming</li></ul>
              <p><b>Lower store costs</b></p><ul><li>Self-checkouts and staff rotas matched to footfall by hour</li>
              <li>Energy: LED lighting and doors on fridges (often a 1 to 2 year payback)</li></ul>
              <p><b>Find out first:</b> is the basket loss all at the store near the discounter? If so, it's a local problem, not a brand problem.</p>"""),
        ],
        f"""Profit halved because store costs rose ${F1-F0:.1f}M (mostly wages and energy) and Meadowlane lost {pct((q0-q1)/q0)} of its baskets after a discounter
        opened; supplier inflation was passed on in full, so it isn't the cause. Volume alone can't fix it: getting back to ${pr0:.1f}M would need {pct(need/q1-1)} more baskets.
        I recommend price-matching everyday staples at the affected store, plus self-checkouts, footfall-based rotas and an energy programme.
        Risk: price-matching erodes margin if it spreads beyond staples. Next step: check basket trends store by store.""",
        ["Builds a bridge instead of listing causes", "Notices price and cost of goods cancel out",
         "Turns 'win back volume' into a number and sees it isn't enough", "Asks whether the loss is local to one store"],
        "Profit bridge · price vs volume vs cost")

CASES.append(meadowlane())

# ---------------------------------------------------------------- Selva Ceramics (easy-medium, short runs)
def selva():
    q0, q1 = 8.0, 8.4            # M m²
    price = 7.00                 # $ per m²
    comp0 = {"Clay and glaze": 1.60, "Kiln energy": 1.30, "Packaging": 0.40, "Line labour": 0.80}
    comp1 = {"Clay and glaze": 1.65, "Kiln energy": 1.75, "Packaging": 0.40, "Line labour": 0.80}
    c0, c1 = sum(comp0.values()), sum(comp1.values())
    F0, F1 = 18.0, 18.9
    pr0, pr1 = q0 * (price - c0) - F0, q1 * (price - c1) - F1
    vol = (q1 - q0) * (price - c0); cost = -(c1 - c0) * q1; fixed = -(F1 - F0)
    close(vol + cost + fixed, pr1 - pr0)
    base, change = 1.15, 1800      # $ per m² steady-state, $ per changeover
    run0 = change / (comp0["Kiln energy"] - base); run1 = change / (comp1["Kiln energy"] - base)
    assert round(run0) == 12000 and round(run1) == 3000
    min_run = 6000
    e_new = base + change / min_run
    saving = (comp1["Kiln energy"] - e_new) * q1
    return C(
        "Selva Ceramics", "A busy tile factory with collapsing margins",
        "Profitability", "Building materials", "Spain", 2,
        f"""Selva Ceramics makes porcelain floor and wall tiles in Castellón, Spain. It sold a record {q1:.1f} million m² this year ({q0:.1f}M the year before)
        and the factory has never been busier, yet operating profit fell from ${pr0:.1f}M to ${pr1:.2f}M. The CEO asks you to find out why.""",
        [("Prices?", "Flat at about $7.00 per m² at the factory gate."),
         ("Energy prices?", "The gas price Selva pays fell slightly last year."),
         ("What has changed commercially?", "Selva started accepting small custom orders from architects and designers: special colours and sizes."),
         ("Objective?", "Restore profit to at least $4M without losing the design customers.")],
        ("Why did profit fall when volume grew?", [
            ("Revenue", ["Price per m²", "Volume", "Mix: standard vs custom"]),
            ("Variable cost per m²", ["Materials", "Kiln energy", "Packaging", "Line labour"]),
            ("Fixed costs", ["Plant, maintenance, overheads"]),
        ]),
        "Price is flat and volume is up, so cost per m² must have risen. With gas prices falling, I'd look at how much energy each m² uses, which depends on how the kilns are run.",
        [
            Q("Here is cost per m² by component. Where did profit go?",
              f"""<p>Profit per m² fell from ${price-c0:.2f} to ${price-c1:.2f}. Bridge:</p>
              <ul><li>Volume: +0.4M m² × ${price-c0:.2f} = <b>{signed(vol, 2, '$', 'M')}</b></li>
              <li>Variable cost: −${c1-c0:.2f} × {q1}M = <b>{signed(cost, 2, '$', 'M')}</b></li>
              <li>Fixed costs: <b>{signed(fixed, 2, '$', 'M')}</b></li></ul>
              <p>Kiln energy is +${comp1['Kiln energy']-comp0['Kiln energy']:.2f} of the ${c1-c0:.2f} rise per m², {pct((comp1['Kiln energy']-comp0['Kiln energy'])/(c1-c0))} of it,
              even though gas got cheaper.</p>
              <p><b>So-what:</b> each m² now needs more energy. That points to how the kilns are used, not what energy costs.</p>""",
              BAR(list(comp0), {"Last year": list(comp0.values()), "This year": list(comp1.values())},
                  title="Exhibit 1 · Variable cost per m² ($)", fmt="{:.2f}", ylabel="$ per m²", h=2.5),
              note=f"Volume: {q0:.1f}M m² last year, {q1:.1f}M m² this year. Fixed costs: ${F0:.1f}M last year, ${F1:.1f}M this year."),
            Q(f"Every time a kiln line changes colour or size it burns about $1,800 of gas heating up and running off rejects. Otherwise energy costs ${base:.2f} per m². What does that tell you about average run length?",
              f"""<p>Energy per m² = ${base:.2f} + $1,800 ÷ run length.</p>
              <ul><li>Last year: ${comp0['Kiln energy']:.2f} → $1,800 ÷ run = ${comp0['Kiln energy']-base:.2f} → run ≈ <b>{num(run0)} m²</b></li>
              <li>This year: ${comp1['Kiln energy']:.2f} → $1,800 ÷ run = ${comp1['Kiln energy']-base:.2f} → run ≈ <b>{num(run1)} m²</b></li></ul>
              <p><b>So-what:</b> average runs are four times shorter. The custom orders fill the factory with changeovers: busy, but not productive.</p>"""),
            Q(f"Selva could set a minimum run of {num(min_run)} m² and batch custom orders weekly. What is that worth? How would you keep design customers?",
              f"""<p>New energy per m² = ${base:.2f} + $1,800 ÷ {num(min_run)} = <b>${e_new:.2f}</b>, saving ${comp1['Kiln energy']-e_new:.2f} per m²:
              about <b>${saving:.2f}M a year</b>, before any lost orders. Profit would rise to about ${pr1+saving:.1f}M.</p>
              <p>To keep designers:</p><ul><li><b>Small-run surcharge</b> priced at the changeover cost ($1,800 per run), so small orders pay their way</li>
              <li><b>Weekly custom slot</b>: collect orders and run them together</li><li><b>Stock a curated range</b> of popular "custom" colours</li></ul>""",
              note="Strong candidates price the surcharge from the changeover cost rather than inventing a number."),
        ],
        f"""Profit fell from ${pr0:.1f}M to ${pr1:.2f}M because small custom orders cut average kiln runs from about {num(run0)} to {num(run1)} m², raising energy per m²
        by {pct((comp1['Kiln energy']-comp0['Kiln energy'])/comp0['Kiln energy'])} even as gas got cheaper. I recommend a {num(min_run)} m² minimum run with weekly batching of custom work,
        worth about ${saving:.1f}M a year and lifting profit to about ${pr1+saving:.1f}M, plus a small-run surcharge that covers the changeover cost
        and should close the rest of the gap to the $4M target. Risk: some designers go elsewhere, so offer a stocked
        custom range. Next step: re-plan two months of orders to confirm the run lengths are achievable.""",
        ["Finds that energy use, not energy price, is the issue", "Back-solves run length from the cost formula",
         "Prices the surcharge from the true changeover cost", "Keeps the design customers rather than dropping them"],
        "Complexity cost · changeovers · cost to serve")

CASES.append(selva())

# ---------------------------------------------------------------- Harborline Ferries (medium, route mix)
def harborline():
    F0, F1 = 18.0, 21.5          # $M
    y0 = dict(pax=1.50, fare=40.0, cost=23.0)
    old = dict(pax=1.45, fare=40.0, cost=24.0)
    new = dict(pax=0.12, fare=15.0, cost=38.0)
    pax1 = old['pax'] + new['pax']
    rev1 = old['pax'] * old['fare'] + new['pax'] * new['fare']
    var1 = old['pax'] * old['cost'] + new['pax'] * new['cost']
    fare1, cost1 = rev1 / pax1, var1 / pax1
    pr0 = y0['pax'] * (y0['fare'] - y0['cost']) - F0
    pr1 = rev1 - var1 - F1
    new_fixed = 1.5
    new_route = new['pax'] * (new['fare'] - new['cost']) - new_fixed
    without = pr1 - new_route
    maint = 2.0
    assert abs((F1 - F0) - (new_fixed + maint)) < 1e-9
    return C(
        "Harborline Ferries", "Passengers held up. Profit didn't.",
        "Profitability", "Passenger transport", "Norway", 2,
        f"""Harborline runs passenger and car ferries between islands on Norway's west coast. Passenger numbers rose slightly last year,
        to {pax1:.2f} million, but the company went from an operating profit of ${num(pr0, 1)}M to a loss of ${num(-pr1, 1)}M. The CEO wants to understand why
        before the board meeting next month.""",
        [("Any change to routes?", "Yes. Harborline launched a new commuter route last year to support its bid for a large regional contract next year."),
         ("Fares?", "Fares on the existing routes didn't change. The new route has low commuter fares."),
         ("Costs?", "Fuel prices rose. One older vessel also needed a major refit."),
         ("Objective?", "Back to profit next year, without damaging the contract bid.")],
        ("Why has Harborline gone from profit to loss?", [
            ("Revenue", ["Passengers by route", "Average fare by route", "Mix of routes"]),
            ("Variable cost per passenger", ["Fuel", "Crew", "Port fees"]),
            ("Fixed costs", ["Vessel maintenance and refits", "Terminals", "Overheads"]),
        ]),
        "Passengers are up, so this is about price per passenger and cost. I'd split the existing routes from the new one, which probably carries few passengers at low fares.",
        [
            Q("Here is the company-wide picture. What's happened?",
              f"""<p>Average fare fell from ${y0['fare']:.2f} to ${fare1:.2f} and cost per passenger rose from ${y0['cost']:.2f} to ${cost1:.2f}:
              margin per passenger fell {pct(1-(fare1-cost1)/(y0['fare']-y0['cost']))}, from ${y0['fare']-y0['cost']:.2f} to ${fare1-cost1:.2f}. Fixed costs also rose ${F1-F0:.1f}M.</p>
              <p>Fares didn't change on existing routes, so the lower average must come from the new route's mix.</p>""",
              T(["", "Last year", "This year"], [["Passengers (M)", f"{y0['pax']:.2f}", f"{pax1:.2f}"], ["Average fare ($)", f"{y0['fare']:.2f}", f"{fare1:.2f}"],
                 ["Variable cost per passenger ($)", f"{y0['cost']:.2f}", f"{cost1:.2f}"], ["Fixed costs ($M)", f"{F0:.1f}", f"{F1:.1f}"],
                 ["Operating profit ($M)", f"{num(pr0, 1)}", f"{num(pr1, 1)}"]], title="Exhibit 1 · Harborline company totals")),
            Q(f"Here is this year by route. The new route also added ${new_fixed:.1f}M of terminal and berth costs; the refit added ${maint:.0f}M. Break down the swing.",
              f"""<p><b>New route:</b> {new['pax']:.2f}M × (${new['fare']:.0f} − ${new['cost']:.0f}) − ${new_fixed:.1f}M = <b>{money(new_route, '$', 2)}</b>.
              Each passenger costs ${new['cost']:.0f} to carry and pays ${new['fare']:.0f}: the ferry sails mostly empty outside rush hour.</p>
              <p><b>Without the new route</b> Harborline would still be at ${num(without, 1)}M, versus ${num(pr0, 1)}M last year. The rest of the fall:</p>
              <ul><li>Fuel on existing routes: +$1 × {old['pax']:.2f}M = ${1*old['pax']:.2f}M</li>
              <li>Refit: ${maint:.0f}M (one-off, should not repeat)</li>
              <li>{num((y0['pax']-old['pax'])*1000)}k fewer passengers on existing routes × $17 = ${(y0['pax']-old['pax'])*17:.2f}M</li></ul>
              <p>Check: ${-new_route:.2f}M + {1*old['pax']:.2f}M + {maint:.2f}M + {(y0['pax']-old['pax'])*17:.2f}M = ${-new_route+1*old['pax']+maint+(y0['pax']-old['pax'])*17:.2f}M, the full swing from ${num(pr0, 2)}M to {money(pr1, '$', 2)}.</p>
              <p><b>So-what:</b> the new route is the biggest single problem. Next year, profit recovers about ${maint:.0f}M as the refit drops out, but stays
              well below last year unless the new route's economics change.</p>""",
              T(["Route group", "Passengers (M)", "Average fare ($)", "Cost per passenger ($)"],
                [["Existing routes", f"{old['pax']:.2f}", f"{old['fare']:.0f}", f"{old['cost']:.0f}"], ["New commuter route", f"{new['pax']:.2f}", f"{new['fare']:.0f}", f"{new['cost']:.0f}"]],
                title="Exhibit 2 · This year by route group"),
              note="Check: (1.45 × $40 + 0.12 × $15) ÷ 1.57 ≈ $38.09 average fare."),
            Q("The CEO says the new route is strategic for next year's regional contract. What would you do?",
              """<ul><li><b>Cut sailings to commuter peaks</b> (two each way morning and evening): most of the cost is sailing empty at midday</li>
              <li><b>Use the smallest vessel</b> on the route to lower fuel and crew cost per sailing</li>
              <li><b>Ask the region for a service payment</b> as part of the contract bid: public commuter routes are often subsidised in Norway</li>
              <li><b>Set a decision date</b>: if the contract is lost, close the route</li>
              <li><b>On existing routes</b>: a fuel surcharge, and plan refits for the off-season</li></ul>"""),
        ],
        f"""Harborline swung from ${num(pr0, 1)}M profit to a ${num(-pr1, 1)}M loss mainly because the new commuter route loses ${num(-new_route, 1)}M a year: it carries few
        passengers at low fares. A one-off ${maint:.0f}M refit and higher fuel costs explain most of the rest. I recommend cutting the new route to peak-hour sailings
        on a smaller vessel and making a service payment part of the regional contract bid, with a clear exit if the bid fails; add a fuel surcharge on existing routes.
        Risk: fewer sailings could weaken the bid, so agree the timetable with the region. Next step: model peak-only sailings with the operations team.""",
        ["Notices fares didn't change on existing routes, so the drop must be mix", "Separates one-off costs (refit) from recurring ones",
         "Quantifies the new route on its own", "Respects the strategic reason but sets an exit trigger"],
        "Mix effects · route profitability · one-offs vs recurring", fmt="Candidate-led")

CASES.append(harborline())

# ---------------------------------------------------------------- Northstar Pet Nutrition (hard, test the claim)
def northstar():
    q0, q1 = 4.00, 4.35          # M bags
    price = 18.0                 # $ per bag, same for both recipes
    s0, s1 = 0.20, 0.35          # premium share of bags
    ing = {"Classic": (5.50, 5.80), "Premium": (9.00, 10.20)}   # chosen so every average is a whole number of cents
    ing0 = (1 - s0) * ing["Classic"][0] + s0 * ing["Premium"][0]
    ing1 = (1 - s1) * ing["Classic"][1] + s1 * ing["Premium"][1]
    other0 = {"Packaging": 1.30, "Freight": 1.50, "Trade promotions": 1.00}
    other1 = {"Packaging": 1.40, "Freight": 1.65, "Trade promotions": 1.15}
    c0, c1 = ing0 + sum(other0.values()), ing1 + sum(other1.values())
    F0, F1 = 16.0, 18.5
    pr0, pr1 = q0 * (price - c0) - F0, q1 * (price - c1) - F1
    gap = pr0 - pr1
    freight = (other1["Freight"] - other0["Freight"]) * q1
    ingr = (ing1 - ing0) * q1
    mix = (s1 - s0) * (ing["Premium"][0] - ing["Classic"][0])
    infl = (1 - s1) * (ing["Classic"][1] - ing["Classic"][0]) + s1 * (ing["Premium"][1] - ing["Premium"][0])
    close(mix + infl, ing1 - ing0)
    prem_bags = s1 * q1
    uplift = gap / prem_bags
    rows = [["Ingredients", f"{ing0:.2f}", f"{ing1:.2f}"]] + [[k, f"{other0[k]:.2f}", f"{other1[k]:.2f}"] for k in other0] + [["Total cost per bag", f"{c0:.2f}", f"{c1:.2f}"]]
    return C(
        "Northstar Pet Nutrition", "The CEO blames freight. Is she right?",
        "Profitability", "Pet food manufacturing", "Canada", 3,
        f"""Northstar makes dry dog and cat food sold in Canadian pet stores and supermarkets. Volume grew {pct(q1/q0-1)} last year, but operating profit fell
        from ${pr0:.1f}M to ${pr1:.1f}M. The CEO believes the cause is freight: trucking rates rose sharply. She has asked you to confirm it and recommend a fix.""",
        [("Products?", "Two recipe families: Classic and Premium (grain-free, higher meat content). Both sell at the same shelf price, about $18 a bag."),
         ("Why the same price?", "Premium was launched at the Classic price two years ago to win shelf space quickly."),
         ("Freight?", "Trucking rates rose about 10% last year."),
         ("Objective?", "Recover last year's profit within 18 months.")],
        ("What explains the $" + f"{gap:.1f}" + "M profit fall?", [
            ("Revenue", ["Bags sold", "Price per bag", "Promotions"]),
            ("Variable cost per bag", ["Ingredients (by recipe)", "Packaging", "Freight", "Trade promotions"]),
            ("Mix", ["Classic vs Premium share", "Margin by recipe"]),
            ("Fixed costs", ["Plant, marketing, overheads"]),
        ]),
        "Freight is a real increase, but it's usually a small share of cost per bag. With two recipes at one price, I suspect a mix shift towards Premium, which costs more to make.",
        [
            Q("Here is cost per bag. Test the CEO's freight theory.",
              f"""<p>Cost per bag rose ${c1-c0:.2f}. Freight is only +${other1['Freight']-other0['Freight']:.2f} of that, worth ${freight:.2f}M on {q1}M bags:
              <b>{pct(freight/gap)} of the ${gap:.2f}M gap</b>.</p>
              <p>Ingredients rose ${ing1-ing0:.2f} a bag, worth ${ingr:.2f}M: <b>{pct(ingr/gap)} of the gap</b>.</p>
              <p>Full bridge: more bags {signed((q1-q0)*(price-c0), 2, '$', 'M')}, higher cost per bag {signed(-(c1-c0)*q1, 2, '$', 'M')}, higher fixed costs {signed(-(F1-F0), 2, '$', 'M')}: {signed(pr1-pr0, 2, '$', 'M')} in total. Volume growth roughly offsets the fixed-cost rise, so cost per bag is the story.</p>
              <p><b>So-what:</b> freight is real but minor. Ingredients are the story. Let's see why they rose.</p>""",
              BAR(["Ingredients", "Packaging", "Freight", "Trade promotions"], {"Last year": [ing0, *other0.values()], "This year": [ing1, *other1.values()]},
                  title="Exhibit 1 · Cost per bag ($)", fmt="{:.2f}", ylabel="$ per bag", h=2.5),
              note=f"Both years: price $18 per bag. Bags: {q0:.2f}M → {q1:.2f}M. Fixed costs: ${F0:.1f}M → ${F1:.1f}M."),
            Q("Here is ingredient cost by recipe and the recipe mix. Split the ingredient increase into inflation and mix.",
              f"""<p><b>Mix effect</b> (more Premium at last year's costs): ({pct(s1)} − {pct(s0)}) × (${ing['Premium'][0]:.2f} − {ing['Classic'][0]:.2f}) = <b>${mix:.3f}</b> a bag.</p>
              <p><b>Inflation</b> (each recipe got dearer): {pct(1-s1)} × ${ing['Classic'][1]-ing['Classic'][0]:.2f} + {pct(s1)} × ${ing['Premium'][1]-ing['Premium'][0]:.2f} = <b>${infl:.3f}</b> a bag.</p>
              <p>Total ${mix+infl:.2f} ✓. Mix and inflation are roughly half each.</p>
              <p><b>So-what:</b> Premium is succeeding with shoppers, but it earns ${ing['Premium'][1]-ing['Classic'][1]:.2f} less per bag than Classic because it's sold at the same price.
              Northstar is growing its least profitable product.</p>""",
              T(["", "Classic", "Premium"], [["Ingredient cost per bag, last year ($)", f"{ing['Classic'][0]:.2f}", f"{ing['Premium'][0]:.2f}"],
                 ["Ingredient cost per bag, this year ($)", f"{ing['Classic'][1]:.2f}", f"{ing['Premium'][1]:.2f}"],
                 ["Share of bags, last year", pct(1-s0), pct(s0)], ["Share of bags, this year", pct(1-s1), pct(s1)]],
                title="Exhibit 2 · Ingredients by recipe")),
            Q("If Northstar raised only the Premium price, how much more per bag would it need to recover the full gap? Is that realistic?",
              f"""<p>Premium bags: {pct(s1)} × {q1}M = {prem_bags:.2f}M. Needed: ${gap:.2f}M ÷ {prem_bags:.2f}M = <b>${uplift:.2f} a bag</b>,
              about {pct(uplift/price)} on $18, assuming volume holds.</p>
              <p>Probably too much in one go. Premium recipes usually sell at a clear premium to standard ones, so some increase is justified, but a 23% jump risks losing shelf space.</p>
              <p><b>Better:</b> a $2 to $3 increase on Premium (it's still a better product), plus ingredient sourcing contracts, plus cutting trade promotions that
              rose $0.15 a bag.</p>"""),
            Q("What would you tell the CEO in her board meeting?",
              f"""<p>Answer first: freight explains only about {pct(freight/gap)} of the fall. The real issue is that Premium, now {pct(s1)} of volume, is priced like Classic while
              costing ${ing['Premium'][1]-ing['Classic'][1]:.2f} more in ingredients. Then: the pricing fix, sourcing, and a test of price elasticity in one region.</p>"""),
        ],
        f"""Freight is not the main problem: it explains about {pct(freight/gap)} of the ${gap:.1f}M profit fall. Most of the gap comes from ingredients, split between
        inflation and a shift to Premium, which sells at the Classic price but costs ${ing['Premium'][1]-ing['Classic'][1]:.2f} more a bag to make. I recommend repricing Premium
        by $2 to $3 a bag, locking in ingredient contracts, and trimming trade promotions. Risk: retailers resist a price rise, so lead with the stronger recipe story.
        Next step: test the new Premium price in one province for eight weeks.""",
        ["Tests the client's hypothesis with numbers instead of accepting it", "Splits ingredients into mix and inflation",
         "Spots the pricing decision behind the mix problem", "Sizes the price fix and judges whether it's realistic"],
        "Hypothesis testing · mix vs inflation · pricing")

CASES.append(northstar())
