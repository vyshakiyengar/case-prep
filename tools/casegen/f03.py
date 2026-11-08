"""New sites and break-even. Concepts from CaseCraft #011, #012, #014, #015; rewritten with realistic constraints."""
from lib import *
CASES = []

# ---------------------------------------------------------------- Juniper Coffee (easy, peak capacity)
def juniper():
    days, spend = 360, 3.80
    cogs, turnover_rent = 0.30, 0.12
    margin = 1 - cogs - turnover_rent
    peak_demand, peak_hours = 300, 2
    rate = 45                      # drinks per barista per hour
    baristas = 2
    peak_sold = min(peak_demand, baristas * rate * peak_hours)
    offpeak = 90
    daily = peak_sold + offpeak
    rev = daily * spend * days / 1000          # $k
    contrib = rev * margin
    staff, other = 110.0, 15.0
    profit = contrib - staff - other
    fitout = 120.0
    payback = fitout / profit
    be = (staff + other) * 1000 / (spend * margin * days)
    extra_cost = 15.0
    peak3 = min(peak_demand, 3 * rate * peak_hours)
    gain = (peak3 - peak_sold) * spend * margin * days / 1000 - extra_cost
    return C(
        "Juniper Coffee", "Should we open a coffee kiosk at a busy station?",
        "Investment / capacity", "Food service", "United Kingdom", 1,
        """Juniper Coffee runs 12 coffee kiosks in the north of England. It has been offered a kiosk on the main concourse of a busy commuter
        station. The fit-out would cost $120k. The CEO wants to know whether to sign, and what profit to expect.""",
        [("How does the station charge rent?", "A share of sales: 12% of revenue, with no fixed rent."),
         ("When are customers there?", "Mostly commuters: demand is very concentrated between 7am and 9am on weekdays."),
         ("Juniper's usual hurdle?", "Pay back the fit-out within two years."),
         ("Staffing?", "Two baristas during the morning peak, one for the rest of the day.")],
        ("Is the kiosk worth opening?", [
            ("Revenue", ["Customers per day: peak vs rest of day", "Average spend", "Trading days"]),
            ("Costs", ["Coffee and food (30% of sales)", "Station rent (12% of sales)", "Staff and other fixed costs"]),
            ("Capacity", ["Drinks a barista can make per hour", "Queue length at peak"]),
        ]),
        "A station kiosk lives or dies on the morning peak. I'd check whether the kiosk can serve everyone who wants coffee between 7 and 9, not just how many people pass by.",
        [
            Q(f"Juniper estimates {peak_demand} customers would want coffee in the 7-9am peak and about {offpeak} across the rest of the day. A barista makes about {rate} drinks an hour. How many customers can the kiosk actually serve each day?",
              f"""<p>Peak capacity: {baristas} baristas × {rate} drinks × {peak_hours} hours = <b>{baristas*rate*peak_hours}</b> drinks. Demand is {peak_demand}, so
              <b>{peak_demand-peak_sold} customers a day walk away</b> (or never join the queue).</p>
              <p>Daily sales: {peak_sold} + {offpeak} = <b>{daily} customers</b>.</p>
              <p><b>So-what:</b> the kiosk is limited by how fast it can make coffee at peak, not by how many people pass by.</p>"""),
            Q(f"Average spend is ${spend:.2f}; the kiosk trades {days} days a year. Fixed costs are ${staff:.0f}k staff and ${other:.0f}k other. Does it meet the two-year payback?",
              f"""<p>Revenue: {daily} × ${spend:.2f} × {days} = <b>${num(rev)}k</b>.</p>
              <p>Margin after coffee and station rent: 100% − 30% − 12% = {pct(margin)}, so contribution = ${num(contrib)}k.</p>
              <p>Profit: ${num(contrib)}k − ${staff+other:.0f}k = <b>${num(profit)}k</b>. Payback: ${fitout:.0f}k ÷ ${num(profit)}k = <b>{payback:.1f} years</b>. It meets the hurdle.</p>
              <p>Break-even: ${staff+other:.0f}k ÷ (${spend:.2f} × {pct(margin)} × {days}) ≈ <b>{num(be)} customers a day</b>, versus {daily} expected: a comfortable cushion.</p>""",
              WF("Revenue", rev, [("Coffee & food", -rev * cogs), ("Station rent", -rev * turnover_rent), ("Staff", -staff), ("Other", -other)], "Profit",
                 title="Exhibit 1 · Kiosk economics, year one ($k)", ylabel="$k", fmt="{:+,.0f}", base_fmt="{:,.0f}")),
            Q(f"A third barista for the morning peak would cost about ${extra_cost:.0f}k a year. Worth it?",
              f"""<p>Peak capacity rises to 3 × {rate} × 2 = {3*rate*peak_hours}, {'enough to serve all ' + str(peak_demand) if 3*rate*peak_hours >= peak_demand else 'still short of the ' + str(peak_demand) + ' who want coffee'}, but +{peak3-peak_sold} customers a day{'' if 3*rate*peak_hours >= peak_demand else ' (' + str(peak_demand - 3*rate*peak_hours) + ' are still turned away)'}.</p>
              <p>Extra profit: {peak3-peak_sold} × ${spend:.2f} × {pct(margin)} × {days} − ${extra_cost:.0f}k = <b>${num(gain)}k a year</b>.</p>
              <p><b>So-what:</b> yes, clearly. Also add app pre-ordering so regulars skip the queue, and check the kiosk layout can fit a third person and a second machine.</p>"""),
        ],
        f"""Sign the lease. The kiosk should make about ${num(profit)}k a year and pay back the ${fitout:.0f}k fit-out in {payback:.1f} years, with break-even at about {num(be)} customers a day
        versus {daily} expected. But the real constraint is the morning peak: with two baristas, {peak_demand-peak_sold} customers a day can't be served. Adding a third barista at peak adds about
        ${num(gain)}k a year. Risk: commuter numbers fall if hybrid working grows, so negotiate a break clause. Next step: confirm the kiosk can fit a second coffee machine.""",
        ["Checks peak capacity before revenue", "Treats station rent as a share of sales, not a fixed cost",
         "Computes break-even and the safety margin", "Sees that adding peak capacity is the biggest lever"],
        "Capacity at peak · break-even · payback")

CASES.append(juniper())

# ---------------------------------------------------------------- Spoke & Sprocket (easy, seasonality)
def spoke():
    peak_days, off_days = 150, 150
    peak_rep, off_rep = 55, 25
    price, margin = 28.0, 0.70
    repairs = peak_days * peak_rep + off_days * off_rep
    rev = repairs * price / 1000
    contrib = rev * margin
    rent, techs, other = 36.0, 120.0, 15.0
    profit = contrib - rent - techs - other
    invest = 150.0
    cap_per_day = 3 * 20
    idle = 1 - off_rep / cap_per_day
    subs, fee = 800, 9.0
    sub_rev = subs * fee * 12 / 1000
    services = subs * 2
    parts = services * 6 / 1000
    existing_share, rep_per_year = 0.40, 1.5
    lost = subs * existing_share * rep_per_year * price * margin / 1000
    net = sub_rev - parts - lost
    return C(
        "Spoke & Sprocket", "A second bike shop: great summers, empty winters",
        "Investment / capacity", "Consumer services", "Netherlands", 1,
        """Spoke & Sprocket runs a busy bicycle repair shop in Amsterdam. The owners want to open a second shop near the university in Utrecht,
        which would cost $150k to fit out. They want to know if it would pay off, and how to deal with the quiet winter months.""",
        [("How seasonal is demand?", "Very: about 55 repairs a day from April to September, about 25 a day in winter."),
         ("Staffing?", "Three technicians, needed to cope with summer. Each can do about 20 repairs a day."),
         ("Pricing?", "Average repair $28; parts are 30% of that."),
         ("Trading days?", "Assume about 300 a year: 150 from April to September and 150 from October to March."),
         ("Objective?", "Payback within three years.")],
        ("Will the Utrecht shop pay back within three years?", [
            ("Revenue", ["Repairs per day by season", "Average price", "Trading days"]),
            ("Costs", ["Parts", "Technicians (fixed)", "Rent and other"]),
            ("Using winter capacity", ["Idle technician time", "Ways to fill it"]),
        ]),
        "Summer is strong, but the shop pays for three technicians all year. Profit probably depends on filling winter capacity.",
        [
            Q("Estimate annual profit and payback for the new shop.",
              f"""<p>Repairs: {peak_days} days × {peak_rep} + {off_days} days × {off_rep} = <b>{num(repairs)}</b>.</p>
              <p>Revenue: {num(repairs)} × ${price:.0f} = ${num(rev)}k. Contribution after parts (70%): ${num(contrib)}k.</p>
              <p>Profit: ${num(contrib)}k − ${rent+techs+other:.0f}k = <b>${num(profit)}k a year</b>. Payback: ${invest:.0f}k ÷ ${num(profit)}k = <b>{invest/profit:.1f} years</b>.</p>
              <p><b>So-what:</b> it meets the three-year hurdle, but only just.</p>""",
              BAR(["Apr-Sep", "Oct-Mar"], {"Repairs per day": [peak_rep, off_rep], "Capacity (3 technicians)": [cap_per_day, cap_per_day]},
                  title="Exhibit 1 · Expected demand vs capacity", ylabel="Repairs per day", h=2.4),
              note=f"Fixed costs per year: rent ${rent:.0f}k, technicians ${techs:.0f}k, other ${other:.0f}k."),
            Q(f"In winter, how much technician time is idle? The owners are considering a student plan: ${fee:.0f} a month for two services a year. They expect {subs} sign-ups, and each service uses about $6 of parts. What is it worth?",
              f"""<p>Winter idle capacity: 1 − {off_rep} ÷ {cap_per_day} = <b>{pct(idle)}</b>.</p>
              <p>Plan revenue: {subs} × ${fee:.0f} × 12 = ${num(sub_rev, 1)}k. Services: {num(services)} at about $6 of parts each = −${parts:.1f}k (labour is free: it uses idle winter time).</p>
              <p>Cannibalisation: if {pct(existing_share)} of subscribers would have paid for about {rep_per_year} repairs a year anyway: −${lost:.1f}k of lost margin.</p>
              <p>Net: <b>+${net:.1f}k a year</b>, which would cut payback to about {invest/(profit+net):.1f} years.</p>
              <p><b>So-what:</b> worth it, as long as services are booked into winter. Let subscribers book only from October to March.</p>"""),
            Q("What else could fill winter capacity?",
              """<ul><li><b>Fleet contracts</b>: maintain bikes for delivery companies, hotels and bike-share operators</li>
              <li><b>Winter service</b> promotion: lights, brakes and tyres before the dark months</li>
              <li><b>Refurbish and sell used bikes</b> to students in September</li>
              <li><b>Flex staff</b>: a seasonal technician in summer instead of a third full-time one</li></ul>"""),
        ],
        f"""Open the Utrecht shop: it should make about ${num(profit)}k a year and pay back in {invest/profit:.1f} years, inside the three-year hurdle. Its weakness is winter, when
        {pct(idle)} of technician time is idle. A student plan that books services into October to March adds about ${net:.1f}k a year and cuts payback to {invest/(profit+net):.1f} years;
        fleet contracts could add more. Risk: a weak first summer while the shop builds awareness. Next step: talk to two local fleet operators before signing the lease.""",
        ["Builds revenue by season, not with one average", "Measures idle capacity",
         "Counts cannibalisation in the subscription maths", "Uses idle time as a near-free resource"],
        "Seasonality · utilisation · payback")

CASES.append(spoke())

# ---------------------------------------------------------------- Fillhaus Refill (medium, optimistic forecast)
def natura():
    days, basket, margin = 310, 24.0, 0.45
    fc_land, fc_comp = 90, 55
    rent, staff, other = 60.0, 130.0, 20.0
    fixed = rent + staff + other
    invest = 160.0
    def prof(t, b=basket): return t * b * days * margin / 1000 - fixed
    p_land, p_comp = prof(fc_land), prof(fc_comp)
    be_t = fixed * 1000 / (basket * days * margin)
    be_b = fixed * 1000 / (fc_comp * days * margin)
    return C(
        "Fillhaus Refill", "Whose footfall forecast do we believe?",
        "Investment / capacity", "Sustainable retail", "Australia", 2,
        """Fillhaus runs two zero-waste refill shops in Melbourne, where customers bring their own containers for dry food, oils and cleaning products.
        A shopping-centre landlord has offered a site in a new development and says it will bring about 90 customers a day. The fit-out costs $160k.
        Should Fillhaus open?""",
        [("What do Fillhaus's existing shops do?", "Around 55 customers a day each, after two years of trading."),
         ("Basket and margin?", "Average basket $24; gross margin about 45%."),
         ("Costs?", "Rent $60k, two staff $130k, other $20k a year."),
         ("Trading days?", "About 310 a year."),
         ("Hurdle?", "Payback within three years.")],
        ("Should Fillhaus open the new shop?", [
            ("Customers per day", ["Landlord's forecast", "Fillhaus's own shops as a benchmark", "New development still filling up?"]),
            ("Spend per customer", ["Basket size", "Gross margin"]),
            ("Costs", ["Rent, staff, other", "Fit-out"]),
        ]),
        "The landlord has an incentive to be optimistic. I'd test the decision against Fillhaus's own shops: if it only works at 90 customers a day, it's risky.",
        [
            Q("Calculate annual profit using the landlord's forecast and using Fillhaus's own shops as a benchmark.",
              f"""<p>Profit = customers × ${basket:.0f} × {days} days × 45% − ${fixed:.0f}k.</p>
              <ul><li>Landlord, {fc_land} a day: <b>${num(p_land)}k</b>, payback {invest/p_land:.1f} years</li>
              <li>Benchmark, {fc_comp} a day: <b>{signed(p_comp, 0, '$', 'k')}</b>: a loss</li></ul>
              <p>Break-even: ${fixed:.0f}k ÷ (${basket:.0f} × {days} × 45%) = <b>{be_t:.1f} customers a day</b>.</p>
              <p><b>So-what:</b> the decision depends entirely on whose forecast is right. On Fillhaus's own experience, the shop would lose money.</p>""",
              BAR(["Benchmark (55/day)", "Break-even", "Landlord (90/day)"], [fc_comp, be_t, fc_land], title="Exhibit 1 · Customers per day", fmt="{:.0f}", ylabel="Customers per day", h=2.3, highlight=[0])),
            Q(f"At {fc_comp} customers a day, what basket size would Fillhaus need to break even? How could it get there?",
              f"""<p>Basket needed: ${fixed:.0f}k ÷ ({fc_comp} × {days} × 45%) = <b>${be_b:.2f}</b>, {pct(be_b/basket-1)} more than today.</p>
              <ul><li>Bundles of everyday staples (rice, oats, detergent) sold by the kilo</li><li>Click-and-collect refills prepared in advance (also saves staff time)</li>
              <li>Workplace orders: offices refilling cleaning products monthly</li><li>Higher-margin own-brand products</li></ul>"""),
            Q("How would you negotiate with the landlord?",
              """<ul><li><b>Turnover-based or stepped rent</b> for the first two years, so the landlord shares the footfall risk</li>
              <li><b>Fit-out contribution</b>, common for anchor-style tenants in a new development</li>
              <li><b>Break clause</b> after 24 months if footfall targets aren't met</li>
              <li>Ask for <b>footfall data</b> from the landlord's other centres to back up the 90 a day</li></ul>"""),
        ],
        f"""Don't sign on the current terms. The shop works only if the landlord's 90 customers a day is right (${num(p_land)}k profit); at the 55 a day Fillhaus's own shops achieve,
        it loses about ${num(-p_comp)}k a year, with break-even at {be_t:.0f} customers. I recommend negotiating turnover-based rent and a fit-out contribution so the landlord shares
        the risk, and raising the basket towards ${be_b:.0f} through bundles and workplace orders. Risk: a new development can take years to fill. Next step: request the landlord's footfall
        data from comparable centres.""",
        ["Questions the source of the forecast", "Uses the client's own shops as a benchmark",
         "Finds break-even in customers and in basket size", "Turns the analysis into a negotiation"],
        "Break-even · forecast risk · negotiation")

CASES.append(natura())

# ---------------------------------------------------------------- Orbit Climbing (hard, peak crowding caps growth)
def orbit():
    fee, day_pass_rev = 95.0, 0.45     # $ per month; $M from day passes per year
    var = 0.05
    rent, staff, other = 0.38, 0.42, 0.15
    fixed = rent + staff + other
    capex = 2.2
    members = [600, 1000, 1200]
    prof = [(m * fee * 12 / 1e6 + day_pass_rev) * (1 - var) - fixed for m in members]
    cum = 0; pay = None
    for i, p in enumerate(prof):
        if cum + p >= capex and pay is None: pay = i + (capex - cum) / p
        cum += p
    yrs_after = (capex - cum) / prof[-1]
    payback = 3 + yrs_after if pay is None else pay
    visits_wk, peak_share, peak_hours_wk, stay, cap = 2.2, 0.40, 15, 2.0, 120
    def load(m): return m * visits_wk * peak_share / peak_hours_wk * stay
    max_m = cap / load(1)
    prof_cap = (max_m * fee * 12 / 1e6 + day_pass_rev) * (1 - var) - fixed
    return C(
        "Orbit Climbing", "A climbing gym that could become too popular",
        "Investment / capacity", "Leisure", "Canada", 3,
        f"""Orbit wants to open an indoor climbing gym in a converted warehouse in Calgary. The fit-out (walls, flooring, safety systems) costs ${capex}M.
        The plan assumes membership grows to {members[-1]:,} people by year three. The investors' hurdle is a payback within five years. Should they go ahead?""",
        [("Revenue?", f"Memberships at ${fee:.0f} a month, plus day passes worth about ${day_pass_rev}M a year."),
         ("Costs?", f"Rent ${rent}M, staff ${staff}M, other ${other}M a year. Variable costs (card fees, chalk, cleaning) about 5% of revenue."),
         ("Ramp-up?", "Members: 600 in year one, 1,000 in year two, 1,200 in year three."),
         ("Safety?", f"The gym can safely hold {cap} climbers at once.")],
        ("Does the gym pay back within five years?", [
            ("Revenue", ["Members × monthly fee", "Day passes", "Ramp-up over three years"]),
            ("Costs", ["Rent, staff, other (fixed)", "Variable costs"]),
            ("Capacity", ["How many climbers are there at peak?", "Does crowding cap membership?"]),
        ]),
        "Gyms have high fixed costs, so the ramp-up matters. But the bigger risk may be the evening peak: if 1,200 members all want to climb after work, the gym may be too full to sell that many memberships.",
        [
            Q("Calculate operating profit for years one to three and the payback.",
              f"""<p>Profit = (members × ${fee:.0f} × 12 + ${day_pass_rev}M) × 95% − ${fixed:.2f}M.</p>
              <ul>{''.join(f"<li>Year {i+1}: {m:,} members → <b>${p:.2f}M</b></li>" for i, (m, p) in enumerate(zip(members, prof)))}</ul>
              <p>Cumulative after three years: ${sum(prof):.2f}M of the ${capex}M. At year-three profit, the remaining ${capex-sum(prof):.2f}M takes another {yrs_after:.1f} years:
              payback ≈ <b>{payback:.1f} years</b>, inside the five-year hurdle.</p>""",
              BAR(["Year 1", "Year 2", "Year 3"], [p for p in prof], title="Exhibit 1 · Operating profit by year ($M)", fmt="{:.2f}", ylabel="$M", h=2.3)),
            Q(f"Members climb {visits_wk} times a week; {pct(peak_share)} of visits are in the weekday 6-9pm peak (15 hours a week); a session lasts {stay:.0f} hours. How many people are in the gym at peak with {members[-1]:,} members? (Assume day-pass visitors climb mostly at weekends and off-peak, so ignore them for the evening peak.)",
              f"""<p>Peak arrivals per hour: {members[-1]:,} × {visits_wk} × {pct(peak_share)} ÷ {peak_hours_wk} = {members[-1]*visits_wk*peak_share/peak_hours_wk:.1f}.</p>
              <p>Each stays {stay:.0f} hours, so about <b>{load(members[-1]):.0f} people</b> are climbing at once, against a safe limit of {cap}.</p>
              <p>Maximum members before peak overcrowding: {members[-1]:,} × {cap} ÷ {load(members[-1]):.0f} ≈ <b>{num(max_m)}</b>.</p>
              <p><b>So-what:</b> the plan's year-three membership doesn't physically fit. Unless peak demand is shifted, membership caps at about {num(max_m)}.</p>""",
              note="This is the crux of the case. Strong candidates spot the capacity question before being asked."),
            Q(f"What does the cap do to the investment case?",
              f"""<p>At about {num(max_m)} members, steady-state profit is ${prof_cap:.2f}M instead of ${prof[-1]:.2f}M. Payback stretches: after year two the remaining
              ${capex-prof[0]-prof[1]:.2f}M takes {(capex-prof[0]-prof[1])/prof_cap:.1f} more years: about <b>{2+(capex-prof[0]-prof[1])/prof_cap:.1f} years</b>, still inside five, but with little margin.</p>
              <p><b>Fixes:</b> off-peak memberships at a lower price (students, shift workers, parents), corporate memberships used at lunchtime, timed booking at peak,
              and a higher peak-access price.</p>"""),
            Q("What would you recommend to the investors?",
              """<p>Go ahead, but redesign the membership model before opening: an off-peak tier priced ~30% lower, a peak tier priced higher, and pre-sold
              corporate memberships for daytime use. Track peak occupancy from day one.</p>"""),
        ],
        f"""Go ahead, with a different membership model. On the plan's numbers the gym pays back in about {payback:.1f} years, but at {members[-1]:,} members about {load(members[-1]):.0f}
        people would be climbing at peak against a safe limit of {cap}, so membership effectively caps at about {num(max_m)} and payback stretches to about
        {2+(capex-prof[0]-prof[1])/prof_cap:.1f} years. I recommend launching with peak and off-peak tiers and pre-selling daytime corporate memberships to grow beyond the cap.
        Risk: if off-peak demand is weak, payback lands close to the hurdle. Next step: survey local climbers on when they would visit and at what price.""",
        ["Models the ramp-up instead of using steady state from day one", "Checks physical capacity at peak",
         "Converts the capacity limit into a membership cap", "Fixes the problem with pricing tiers, not just 'more marketing'"],
        "Ramp-up · peak capacity · payback", fmt="Candidate-led")

CASES.append(orbit())
