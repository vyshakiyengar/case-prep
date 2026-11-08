"""Build vs buy, make vs buy, own vs outsource. Concepts from CaseCraft #036-#040; rewritten from scratch."""
from lib import *
CASES = []

# ---------------------------------------------------------------- Heatherfield Hotels (easy)
def thistle():
    rooms, occ, kg = 900, 0.75, 4.0
    vol = rooms * 365 * occ * kg / 1000                  # tonnes = k kg
    out_p, var, fixed, capex = 0.95, 0.48, 250.0, 1800.0  # $/kg, $/kg, $k/yr, $k
    out_cost = vol * out_p
    in_cost = vol * var + fixed
    saving = out_cost - in_cost
    pb = capex / saving
    target = 5.0
    need = (capex / target + fixed) / (out_p - var)       # k kg for a 5-year payback
    rooms2 = 450
    vol2 = (rooms + rooms2) * 365 * occ * kg / 1000
    saving2 = vol2 * (out_p - var) - fixed
    pb2 = capex / saving2
    be = fixed / (out_p - var)
    assert pb > target and pb2 < target and vol < need < vol2
    return C(
        "Heatherfield Hotels", "Should a hotel group run its own laundry?",
        "Investment decision", "Hospitality", "United Kingdom", 1,
        """Heatherfield Hotels owns six hotels in Scotland with 900 rooms between them. All sheets and towels go to an outside laundry. The operations director wants to build a central laundry
        for $1.8M to cut costs. The CEO asks you whether it's worth it.""",
        [("How much laundry?", "About 4 kg per occupied room per night. Occupancy averages 75% all year."),
         ("What does the outside laundry charge?", "$0.95 per kg, including collection and delivery."),
         ("Costs in-house?", "About $0.48 per kg for staff, energy, chemicals and vans, plus $250k a year of fixed costs: a manager, maintenance and insurance."),
         ("Payback target?", "Five years. The equipment lasts about ten.")],
        ("Should Heatherfield build its own laundry?", [
            ("Volume", ["Rooms × occupancy × kg per night"]),
            ("Annual saving", ["Outsourced cost", "In-house variable + fixed cost"]),
            ("Payback", ["$1.8M ÷ yearly saving vs 5-year target"]),
            ("Non-financial", ["Quality and control", "Space and staff", "Risk if the plant breaks down"]),
        ]),
        "In-house laundries pay off at scale. With only six hotels the fixed costs may eat most of the saving, so volume will decide it.",
        [
            Q("How much does Heatherfield spend on laundry today, and what would it cost in-house?",
              f"""<p>Volume: 900 × 365 × 75% × 4 kg = <b>{num(vol)} tonnes</b> a year.</p>
              <p>Outsourced: {num(vol)}k kg × $0.95 = <b>${num(out_cost)}k</b>. In-house: {num(vol)}k × $0.48 + $250k = <b>${num(in_cost)}k</b>.</p>
              <p>Saving: <b>${num(saving)}k a year</b>.</p>"""),
            Q("Does it meet the five-year payback target?",
              f"""<p>Payback = $1,800k ÷ ${num(saving)}k = <b>{pb:.1f} years</b>, well beyond five, though inside the equipment's ten-year life.</p>
              <p>A five-year payback needs a saving of $1,800k ÷ 5 = $360k a year. Adding back the $250k of fixed costs, the margin over outsourcing must reach $610k; at $0.47 a kg that takes <b>{num(need, -1)} tonnes</b> a year, {pct(need/vol-1)} more than today.</p>
              <p><b>So-what:</b> on today's six hotels, no.</p>""",
              note="Each kg saves $0.95 − $0.48 = $0.47 before fixed costs."),
            Q(f"The CEO mentions plans to open three more hotels ({rooms2} rooms) within two years. Does that change your answer?",
              f"""<p>Volume rises to {num(vol2)} tonnes. Saving: {num(vol2)}k × $0.47 − $250k = <b>${num(saving2)}k</b>. Payback: <b>{pb2:.1f} years</b>, within target.</p>
              <p><b>So-what:</b> the decision depends on the expansion. Build only if the new hotels are committed, and size the plant for them. This assumes the $1.8M plant can handle the larger volume and the new hotels are open from the start: if the plant ran on today's volume for two years first, payback would be about {2 + (capex - 2*saving)/saving2:.1f} years, so time the build to the openings.</p>""",
              BAR(["Today (900 rooms)", "With 3 new hotels (1,350)"], [r(pb, 1), r(pb2, 1)], title="Exhibit 1 · Payback in years", ylabel="Years", fmt="{:.1f}", h=2.2, highlight=[1])),
            Q("What else would you check before deciding?",
              """<ul><li><b>Quality and speed:</b> does the outside laundry cause complaints or stock-outs?</li><li><b>Risk:</b> one plant serving all hotels needs a backup contract</li>
              <li><b>Contract:</b> could Heatherfield negotiate a lower outside price with its larger volume, which may beat building?</li><li><b>Site and staff:</b> land, permits, hiring</li></ul>"""),
        ],
        f"""Don't build the laundry on today's six hotels: it saves about ${num(saving)}k a year, a payback of {pb:.1f} years against a five-year target. If the three new hotels are committed,
        the saving rises to about ${num(saving2)}k and payback falls to {pb2:.1f} years, so build when they open (two years at today's volume first would push payback to about {2 + (capex - 2*saving)/saving2:.1f} years), sized for {rooms + rooms2:,} rooms. Meanwhile, use the coming volume to negotiate
        a lower price with the outside laundry. Risk: a single plant is a single point of failure, so keep a backup contract.""",
        ["Computes volume from rooms and occupancy", "Separates variable from fixed costs",
         "Works out the volume needed to hit the target", "Ties the answer to the expansion plan"],
        "Make vs buy · payback · break-even volume")

CASES.append(thistle())

# ---------------------------------------------------------------- Quantum API (medium)
def quantum():
    yrs = [1, 2, 3, 4]
    bill = [14.0 * 1.25 ** (y - 1) for y in yrs]           # $M cloud bill
    steady = 0.60
    cloud_all = sum(bill)
    capA, migA, opexA = 12.0, 2.0, 1.8 + 8 * 0.18          # steady workloads only
    spiky_cloud = sum(b * (1 - steady) for b in bill)
    hybrid = capA + migA + opexA * 4 + spiky_cloud
    capB, migB, opexB = 24.0, 1.0, 1.6 + 4 * 0.18          # extra to also move spiky loads
    full = capA + migA + opexA * 4 + capB + migB + opexB * 4
    sav_h, sav_f = cloud_all - hybrid, cloud_all - full
    spiky_own = capB + migB + opexB * 4
    assert sav_h > sav_f > 0 and spiky_own > spiky_cloud
    rows = [[f"Year {y}", f"{b:.1f}", f"{b*steady:.1f}", f"{b*(1-steady):.1f}"] for y, b in zip(yrs, bill)]
    return C(
        "Quantum API", "Leave the cloud? Only partly.",
        "Cost & operations", "Software", "United States", 2,
        """Quantum runs payment APIs for online shops. Its cloud bill is $14M a year and growing 25% a year with the business. The CTO proposes moving everything onto servers
        Quantum owns, in rented data-centre space, saying it would halve the bill. The CFO asks you to test it over the next four years.""",
        [("What runs on the cloud?", "About 60% is steady traffic that runs all day. 40% is spiky: big sales days and batch jobs, sometimes 5× normal load for a few hours."),
         ("Cost to move steady work?", "$12M of servers, sized for year-4 volume and lasting four years, plus $2M to migrate. Then $1.8M a year for space and power, and 8 engineers at $180k each."),
         ("Cost to move spiky work too?", "Owned servers would have to be sized for year-4 peaks: another $24M of servers, $1M to migrate, $1.6M a year of space and power, 4 more engineers."),
         ("Anything else?", "Ignore resale value of servers after four years.")],
        ("Should Quantum move off the cloud, and how much of it?", [
            ("Workloads", ["Steady vs spiky", "Growth"]),
            ("Cost of each option", ["Cloud bill", "Servers, migration", "Space, power, engineers"]),
            ("Risks", ["Reliability", "Engineering distraction", "Peak capacity"]),
        ]),
        "Owning servers is cheap for steady load but expensive for peaks, because you pay for peak capacity all year. I expect moving only the steady part to win.",
        [
            Q("Here is the projected cloud bill. What would it cost over four years to stay on the cloud?",
              f"""<p>Four-year cloud bill: <b>${cloud_all:.1f}M</b>.</p>""",
              T(["", "Total bill ($M)", "Steady 60%", "Spiky 40%"], rows + [["Total", f"{cloud_all:.1f}", f"{cloud_all*steady:.1f}", f"{spiky_cloud:.1f}"]],
                title="Exhibit 1 · Cloud bill at 25% growth a year", bold_last=True)),
            Q("Compare: move only the steady work (hybrid), or move everything.",
              f"""<p><b>Hybrid:</b> servers $12M + migration $2M + running ${opexA:.2f}M × 4 = ${capA+migA+opexA*4:.1f}M, plus the spiky cloud bill ${spiky_cloud:.1f}M = <b>${hybrid:.1f}M</b>.
              Saving: <b>${sav_h:.1f}M</b>.</p>
              <p><b>Everything:</b> hybrid's own costs plus $24M + $1M + ${opexB:.2f}M × 4 for the spiky part = <b>${full:.1f}M</b>. Saving: ${sav_f:.1f}M.</p>
              <p><b>So-what:</b> moving the spiky work costs ${spiky_own:.1f}M against ${spiky_cloud:.1f}M of cloud bill: it loses money. The cloud is cheapest exactly where load is uneven.</p>""",
              BAR(["Stay on cloud", "Hybrid", "Move everything"], [r(cloud_all, 1), r(hybrid, 1), r(full, 1)], title="Exhibit 2 · Four-year cost ($M)", ylabel="$M", fmt="{:.1f}", h=2.3, highlight=[1])),
            Q("The CTO says the full move 'halves the bill'. Where does that come from, and what is it missing?",
              """<p>It probably compares the yearly running cost of owned servers with the cloud bill, ignoring the upfront servers, migration and, most of all, the extra capacity needed for peaks.
              Other risks: reliability (Quantum now runs its own hardware), hiring 12 specialist engineers, and the team's attention moving away from the product.</p>"""),
        ],
        f"""Move only the steady 60% of workloads onto owned servers and keep the spiky work on the cloud. Over four years that costs about ${hybrid:.1f}M against ${cloud_all:.1f}M for staying on the cloud,
        saving about ${sav_h:.1f}M. Moving everything saves less (${sav_f:.1f}M), because servers sized for rare peaks sit idle most of the time. Risk: reliability and hiring, so migrate in stages
        with a fallback to the cloud. Next step: confirm how steady the 60% really is with three months of usage data.""",
        ["Splits steady from spiky load", "Includes upfront, migration and running costs over the full period",
         "Spots that peak capacity makes owning expensive", "Challenges the 'halves the bill' claim with numbers"],
        "Make vs buy · total cost of ownership · peak vs average load", fmt="Candidate-led")

CASES.append(quantum())

# ---------------------------------------------------------------- Marble Auto Parts (medium-hard)
def marble():
    units = 500.0                                       # k calipers
    mat, lab, voh, foh = 18.0, 9.0, 5.0, 10.0           # $ per unit
    full = mat + lab + voh + foh
    quote = 36.0
    avoid_foh = 0.2
    relevant = mat + lab + voh + foh * avoid_foh
    naive = (full - quote) * units / 1000               # $M
    true_buy = (relevant - quote) * units / 1000        # negative = buying costs more
    b_units, b_buy, b_make = 400.0, 28.0, 21.0
    b_gain = (b_buy - b_make) * b_units / 1000
    tooling = 0.8
    net = true_buy + b_gain
    assert naive > 0 and true_buy < 0 and net > 0
    return C(
        "Marble Auto Parts", "Outsource a part to save money, or to free the factory?",
        "Cost & operations", "Automotive components", "Mexico", 3,
        """Marble makes brake systems in Monterrey for car makers. A supplier has offered to make Marble's caliper housings for $36 each. Marble's cost accounts show they cost $42 to make in-house,
        so the finance team wants to outsource all 500,000 a year. The COO asks whether that's right.""",
        [("What's in the $42?", "Materials $18, direct labour $9, variable overhead $5, and $10 of factory overhead allocated per unit."),
         ("What happens to the overhead if we outsource?", "Only about 20% would go: the rest is rent, depreciation and management, which stay."),
         ("Would the freed machines sit idle?", "Not necessarily. Marble buys 400,000 brackets a year at $28 each; it could make them on the freed line for $21 each in variable cost, after $0.8M of one-off tooling."),
         ("Supplier?", "Reputable, with a two-year price guarantee.")],
        ("Should Marble outsource caliper housings?", [
            ("Relevant cost of making", ["Variable costs", "Overhead that actually goes away"]),
            ("Cost of buying", ["Quote", "Quality, logistics, risk"]),
            ("Use of freed capacity", ["Make something else", "Value of that"]),
            ("Strategic", ["Is this part core?", "Supplier dependence"]),
        ]),
        "The $42 includes allocated overhead that won't disappear, so the real saving may be smaller than it looks. But what the freed capacity can do may matter more.",
        [
            Q("Finance says outsourcing saves $3M a year. Is that right?",
              f"""<p>Finance compares the full cost ($42) with the quote ($36): ($42 − $36) × 500k = ${naive:.1f}M.</p>
              <p>But only 20% of the $10 overhead goes away. Cost that actually disappears: $18 + $9 + $5 + $2 = <b>${relevant:.0f}</b>, which is <b>less than the $36 quote</b>.</p>
              <p>Outsourcing on its own would <b>cost ${-true_buy:.1f}M more a year</b>, not save $3M.</p>""",
              T(["Cost per housing", "$", "Goes away if outsourced?"], [["Materials", f"{mat:.0f}", "Yes"], ["Direct labour", f"{lab:.0f}", "Yes"], ["Variable overhead", f"{voh:.0f}", "Yes"],
                 ["Allocated factory overhead", f"{foh:.0f}", "Only 20%"], ["Full cost", f"{full:.0f}", ""]], title="Exhibit 1 · Caliper housing cost", bold_last=True),
              note="The classic trap: allocated fixed costs are not saved by outsourcing."),
            Q("Now consider the freed line. What is the full picture?",
              f"""<p>Making brackets in-house saves ($28 − $21) × 400k = <b>${b_gain:.1f}M a year</b>.</p>
              <p>Net effect of outsourcing housings and insourcing brackets: −${-true_buy:.1f}M + ${b_gain:.1f}M = <b>+${net:.1f}M a year</b>, after one-off tooling of ${tooling}M (paid back in under a year).</p>
              <p><b>So-what:</b> outsource the housings, but because of what the line can make instead, not because of the accounting cost.</p>"""),
            Q("What would make you hesitate?",
              """<ul><li><b>Safety:</b> brake parts are safety-critical; audit the supplier's quality system and run a dual-source period</li>
              <li><b>Price after two years:</b> negotiate a longer guarantee or an index-linked price</li><li><b>Know-how:</b> is caliper casting a skill Marble wants to keep?</li>
              <li><b>Bracket quality:</b> Marble must prove it can make brackets to spec</li></ul>"""),
        ],
        f"""Outsource the caliper housings and use the freed line to make brackets in-house, which nets about ${net:.1f}M a year. Finance's $3M saving is wrong: most of the $10 overhead stays,
        so outsourcing alone would cost about ${-true_buy:.1f}M more. The gain comes from making brackets for $21 instead of buying at $28. Risk: brake parts are safety-critical, so audit the supplier
        and keep a dual-source period. Next step: trial 10% of housing volume with the supplier while tooling up for brackets.""",
        ["Separates avoidable from allocated costs", "Overturns the finance team's number",
         "Values the freed capacity (opportunity cost)", "Raises safety and supplier risk for a brake part"],
        "Make vs buy · relevant costs · opportunity cost")

CASES.append(marble())

# ---------------------------------------------------------------- BlueTide Seafood (hard, layered)
def bluetide():
    trucks, price, life = 40, 180.0, 6                  # $k each, years
    miles = 4.4                                          # M loaded miles
    tpl = 2.40                                            # $ per loaded mile
    driver, run, admin = 95.0, 0.95, 0.6                  # $k per truck, $/mile, $M
    empty = 0.35
    dep = trucks * price / life / 1000                    # $M
    out = miles * tpl
    own1 = dep + trucks * driver / 1000 + run * miles + admin
    own2 = own1 + run * miles * empty
    back_share, back_rate = 0.5, 1.60
    back_rev = back_share * miles * empty * back_rate
    own3 = own2 - back_rev
    cargo, sp_tpl, sp_own = 150.0, 0.012, 0.005
    sp_save = cargo * (sp_tpl - sp_own)
    gain = out - own3 + sp_save
    capex = trucks * price / 1000
    cash = gain + dep
    assert own1 < out < own2 and own3 < out
    assert own2 > out and gain > 0
    return C(
        "BlueTide Seafood", "Own the trucks, or keep paying a logistics firm?",
        "Investment decision", "Food distribution", "United States", 3,
        """BlueTide distributes frozen seafood to restaurants and grocers along the US East Coast. A logistics company (a 3PL) does all its refrigerated trucking for $2.40 a loaded mile.
        The COO wants to buy BlueTide's own fleet of 40 refrigerated trucks. The CEO asks you whether owning is cheaper, and whether it's the right move.""",
        [("Volume?", "About 4.4 million loaded miles a year."),
         ("Fleet costs?", "Trucks cost $180k each and last six years. Drivers cost $95k per truck a year. Fuel and maintenance $0.95 a mile. Insurance and admin $0.6M a year."),
         ("Return trips?", "Trucks come back mostly empty: empty miles add about 35% to the loaded miles. The 3PL charges only for loaded miles because it fills return trips with other customers' freight."),
         ("Could BlueTide sell its empty return capacity?", "Probably about half of it, to other shippers, at about $1.60 a mile."),
         ("Quality?", "About 1.2% of cargo value spoils in transit with the 3PL, through temperature failures. BlueTide ships $150M of product a year.")],
        ("Should BlueTide run its own fleet?", [
            ("3PL cost", ["Loaded miles × rate"]),
            ("Own-fleet cost", ["Trucks (depreciation)", "Drivers", "Fuel and maintenance, including empty miles", "Insurance and admin"]),
            ("Offsets", ["Selling return capacity", "Less spoilage"]),
            ("Risks", ["Utilisation", "Running a fleet is not our core skill"]),
        ]),
        "On loaded miles alone owning looks cheaper, but empty return trips could wipe that out. Spoilage could be the deciding factor, since seafood is valuable.",
        [
            Q("Compare yearly cost: 3PL vs own fleet, counting only loaded miles.",
              f"""<p>3PL: 4.4M × $2.40 = <b>${out:.2f}M</b>.</p>
              <p>Own fleet: depreciation ${num(trucks*price)}k ÷ 6 = ${dep:.1f}M; drivers 40 × $95k = $3.8M; fuel and maintenance 4.4M × $0.95 = ${run*miles:.2f}M; admin $0.6M. Total <b>${own1:.2f}M</b>.</p>
              <p>Owning looks ${out-own1:.2f}M a year cheaper.</p>"""),
            Q("Now include the empty return miles.",
              f"""<p>Empty miles: 35% × 4.4M = {miles*empty:.2f}M, costing ${run*miles*empty:.2f}M. Own fleet: <b>${own2:.2f}M</b>, now <b>${own2-out:.2f}M more</b> than the 3PL.</p>
              <p>If BlueTide sells half its return capacity to other shippers at $1.60 a mile, it earns ${back_rev:.2f}M: net cost ${own3:.2f}M, {('$' + f'{out-own3:.2f}M cheaper than' if own3 < out else '$' + f'{own3-out:.2f}M more than')} the 3PL.</p>
              <p><b>So-what:</b> on transport cost alone, owning saves only about {pct((out-own3)/out)}, and only if half the return trips are filled. That is a thin, fragile margin.</p>""",
              WF("3PL cost", r(out, 2), [("Saving on loaded miles", r(own1 - out, 2)), ("Empty return miles", r(own2 - own1, 2)), ("Sold return capacity", r(-back_rev, 2))], "Own fleet",
                 title="Exhibit 1 · From 3PL cost to own-fleet cost ($M a year)", fmt="{:+,.2f}", base_fmt="{:,.2f}")),
            Q("BlueTide's own trucks would carry temperature sensors with live alerts, cutting spoilage to about 0.5%. What does that change?",
              f"""<p>Spoilage saving: $150M × (1.2% − 0.5%) = <b>${sp_save:.2f}M a year</b>, more than any difference in transport cost.</p>
              <p>Total yearly gain from owning: <b>${gain:.2f}M</b>. Cash payback on the ${capex:.1f}M fleet: ${capex:.1f}M ÷ (${gain:.2f}M gain + ${dep:.1f}M non-cash depreciation) = <b>{capex/cash:.1f} years</b>.</p>
              <p><b>So-what:</b> the case for owning is about product quality, not trucking cost. That raises a question: could the 3PL fit the same sensors for less?</p>"""),
            Q("What would you recommend, and what would you check first?",
              """<ul><li>Ask the 3PL to commit to sensor monitoring and a spoilage penalty in its contract. If it agrees, most of the gain comes without owning trucks.</li>
              <li>If not, build a fleet for the core, predictable routes and keep the 3PL for peaks and long-haul.</li>
              <li>Check: the 1.2% spoilage figure, how reliably return loads can be sold, and driver availability.</li></ul>"""),
        ],
        f"""On trucking cost alone, owning a fleet saves only about {pct((out-own3)/out)} once empty return trips are counted, and only if BlueTide can sell half its return capacity. The real prize is spoilage:
        better temperature control saves about ${sp_save:.2f}M a year. First, ask the 3PL to fit sensors and accept a spoilage penalty, which captures most of that gain without $7.2M of trucks. If it won't,
        buy a fleet for the core routes and keep the 3PL for peaks (a full 40-truck fleet would gain about ${gain:.2f}M a year, cash payback {capex/cash:.1f} years; a smaller fleet scales this down). Risk: running a fleet is a new skill. Next step: verify spoilage by route.""",
        ["Builds the own-fleet cost line by line", "Catches the empty-return-mile trap",
         "Finds that spoilage outweighs trucking cost", "Looks for a way to get the benefit without the asset"],
        "Make vs buy · utilisation · hidden costs and benefits", fmt="Candidate-led")

CASES.append(bluetide())
