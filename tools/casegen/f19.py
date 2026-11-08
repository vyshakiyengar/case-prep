"""Yield and revenue management. Concepts from CaseCraft #091-#095; rewritten, with fixed costs stated consistently in $M."""
from lib import *
import math
CASES = []

# ---------------------------------------------------------------- Harbourview Hotel (easy-medium): RevPAR up, profit down
def harbourview():
    rooms, days = 200, 200
    occ0, rate0, var = 0.55, 160.0, 40.0
    disc, occ1 = 0.20, 0.72
    rate1 = rate0 * (1 - disc)
    nights = rooms * days
    revpar0, revpar1 = occ0 * rate0, occ1 * rate1
    c0 = nights * occ0 * (rate0 - var) / 1e6
    c1 = nights * occ1 * (rate1 - var) / 1e6
    be_occ = occ0 * (rate0 - var) / (rate1 - var)
    fixed = 5.5
    assert revpar1 > revpar0 and c1 < c0 and be_occ > occ1
    return C(
        "Harbourview Hotel", "Revenue per room is up. Profit is down.",
        "Pricing", "Hospitality", "Australia", 1,
        """Harbourview is a 200-room hotel in Hobart. In the 200-day off-season it is 55% full at $160 a night. The revenue manager proposes a 20% off-season discount, expecting occupancy to rise to 72%,
        and points out that revenue per available room (RevPAR, the industry's favourite measure) would go up. The general manager asks whether to do it.""",
        [("Costs per occupied room?", "About $40 a night for cleaning, laundry, amenities and booking fees."),
         ("Fixed costs?", "About $5.5M a year for staff, building and overheads; these don't change with occupancy."),
         ("Peak season?", "Unaffected: the discount applies only off-season.")],
        ("Should Harbourview cut off-season prices by 20%?", [
            ("Revenue", ["Occupancy × rate"]),
            ("Costs that move with occupancy", ["$40 per occupied room"]),
            ("Profit", ["Contribution before and after"]),
            ("Other effects", ["Brand", "Guests who would have paid full price"]),
        ]),
        "RevPAR ignores the cost of each extra occupied room. If the discount fills rooms at a lower margin, profit could fall even as RevPAR rises.",
        [
            Q("Compare RevPAR before and after.",
              f"""<p>Before: 55% × $160 = <b>${revpar0:.2f}</b>. After: 72% × ${rate1:.0f} = <b>${revpar1:.2f}</b>. RevPAR rises {pct(revpar1/revpar0-1, 1)}.</p>"""),
            Q("Now compare off-season contribution (revenue minus the $40 per occupied room).",
              f"""<p>Room-nights available: 200 × 200 = {num(nights)}.</p>
              <p>Before: {num(nights*occ0)} × ($160 − $40) = <b>${c0:.2f}M</b>. After: {num(nights*occ1)} × (${rate1:.0f} − $40) = <b>${c1:.2f}M</b>.</p>
              <p>Profit falls by ${(c0-c1)*1000:.0f}k, even though RevPAR rises. Fixed costs are the same either way, so they don't change the comparison.</p>
              <p>To break even, the discount would need occupancy of <b>{pct(be_occ)}</b>.</p>""",
              T(["", "Today", "20% discount"], [["Occupancy", pct(occ0), pct(occ1)], ["Rate ($)", f"{rate0:.0f}", f"{rate1:.0f}"], ["RevPAR ($)", f"{revpar0:.2f}", f"{revpar1:.2f}"],
                 ["Margin per occupied night ($)", f"{rate0-var:.0f}", f"{rate1-var:.0f}"], ["Off-season contribution ($M)", f"{c0:.2f}", f"{c1:.2f}"]], title="Exhibit 1 · Off-season economics")),
            Q("Is there a better way to fill the off-season?",
              """<ul><li>Discount only on nights forecast to be emptiest, not across the whole season</li><li>Packages (room + dinner, conference rooms) that raise spend rather than cut rate</li>
              <li>Target groups the hotel doesn't currently reach (corporate retreats, events), so discounts don't go to guests who would have paid full price</li></ul>"""),
        ],
        f"""Don't cut off-season prices by 20%. RevPAR would rise from ${revpar0:.0f} to ${revpar1:.2f}, but each extra room costs $40 to service, so off-season contribution would fall from ${c0:.2f}M to ${c1:.2f}M.
        The discount would need occupancy of {pct(be_occ)} to break even. Use targeted discounts on the emptiest nights and packages that raise spend instead. Track profit per available room, not just RevPAR.""",
        ["Computes RevPAR and contribution side by side", "Explains why RevPAR can mislead",
         "Finds the break-even occupancy", "Suggests targeted alternatives"],
        "Yield management · RevPAR vs profit · break-even")

CASES.append(harbourview())

# ---------------------------------------------------------------- Cinder Theatre (medium): price by night
def cinder():
    seats, p0 = 1000, 60.0
    perf = {"Fri/Sat": (2, 1400), "Thu/Sun": (2, 850), "Tue/Wed": (2, 500)}       # shows a week, demand at $60
    e = -0.8
    new_p = {"Fri/Sat": 80.0, "Thu/Sun": 60.0, "Tue/Wed": 45.0}
    best_p = {"Fri/Sat": 80.0, "Thu/Sun": 60.0, "Tue/Wed": 60.0}
    def sold(d, p): return d * (p / p0) ** e
    def week(prices): return sum(n * min(seats, sold(d, prices[k])) * prices[k] for k, (n, d) in perf.items()) / 1000
    rev0 = week({k: p0 for k in perf})
    rev1 = week(new_p)
    rev2 = week(best_p)
    weeks = 45
    mid0, mid1 = 500 * p0 / 1000, sold(500, 45) * 45 / 1000
    sellout = p0 * (1400 / seats) ** (-1 / e)          # highest weekend price that still sells out
    assert rev2 > rev1 > rev0 and mid1 < mid0 and sold(1400, 80) > seats and 88 < sellout < 95
    rows = []
    for k, (n, d) in perf.items():
        s0, s1 = min(seats, d), min(seats, sold(d, new_p[k]))
        rows.append([k, f"{p0:.0f} → {new_p[k]:.0f}", f"{s0:.0f} → {s1:.0f}", f"{s0*p0/1000:.1f} → {s1*new_p[k]/1000:.1f}"])
    return C(
        "Cinder Theatre", "Sold out on Saturdays, half empty on Tuesdays",
        "Pricing", "Live entertainment", "United States", 2,
        """Cinder is a 1,000-seat theatre in Chicago running a hit musical six nights a week, at $60 a ticket for every show. Friday and Saturday sell out weeks ahead; Tuesday and Wednesday are half empty.
        The theatre's fixed costs are about $6M a year. The director asks whether pricing by night would help.""",
        [("Demand?", "At $60, about 1,400 people a night want Friday or Saturday seats, about 850 Thursday or Sunday, and about 500 Tuesday or Wednesday."),
         ("Price sensitivity?", "Past offers suggest each 10% price change moves ticket demand about 8% the other way (treat it as a constant elasticity of −0.8)."),
         ("Season?", "About 45 weeks a year.")],
        ("How should Cinder price its shows?", [
            ("Demand by night", ["Excess demand at weekends", "Empty seats midweek"]),
            ("Price response", ["Price sensitivity"]),
            ("Revenue by night", ["Seats sold × price"]),
            ("Fans and fairness", ["Loyalty", "Accessibility"]),
        ]),
        "At $60 the weekend is underpriced (we turn people away) and midweek may be overpriced. Raising weekend prices should raise revenue; I'd check whether cutting midweek prices does too.",
        [
            Q("What does a week earn today?",
              f"""<p>Fri/Sat: 2 × 1,000 (capped) × $60 = $120k. Thu/Sun: 2 × 850 × $60 = $102k. Tue/Wed: 2 × 500 × $60 = $60k. Total <b>${rev0:.0f}k a week</b>, about ${rev0*weeks/1000:.1f}M a season against $6M of fixed costs.</p>"""),
            Q("Try $80 at weekends and $45 on Tuesday and Wednesday. What happens?",
              f"""<p><b>Fri/Sat at $80</b> (+33%): demand falls about {pct(1-sold(1400, 80)/1400)} to about {num(sold(1400, 80), -1)}, still above 1,000: still sold out, now at $80. Revenue per show: $60k → $80k.</p>
              <p><b>Tue/Wed at $45</b> (−25%): demand rises about {pct(sold(500, 45)/500-1)} to about {sold(500, 45):.0f} a show. But revenue per show <b>falls</b>, from ${mid0:.1f}k to ${mid1:.1f}k: with a sensitivity below 1, a price cut loses more on price than it gains in seats.</p>
              <p>Together: ${rev1:.1f}k a week (+{pct(rev1/rev0-1)}). Raising weekends alone and keeping midweek at $60 does better: <b>${rev2:.0f}k a week</b>, +{pct(rev2/rev0-1)}, about ${(rev2-rev0)*weeks/1000:.1f}M more a season, almost all profit because costs are fixed.</p>
              <p><b>So-what:</b> the gain is all in the weekend. A general midweek discount fills a few more seats but costs about ${2*(mid0-mid1):.1f}k a week.</p>""",
              T(["Nights", "Price ($)", "Seats sold per show", "Revenue per show ($k)"], rows, title="Exhibit 1 · The tested prices by night"),
              note="Uses a constant price sensitivity of −0.8."),
            Q("What would you watch out for, and how would you fill midweek seats?",
              f"""<ul><li>Fans may see higher weekend prices as unfair; keep a block of affordable seats and a lottery for each show</li>
              <li>Weekends would still sell out at up to about ${sellout:.0f}, so $80 is cautious; raise in steps and watch how fast shows sell out</li>
              <li>Fill midweek with targeted offers (student and rush tickets, groups, bar or dinner bundles) rather than a general discount, so full-price buyers don't trade down</li>
              <li>Review prices every month as demand changes</li></ul>"""),
        ],
        f"""Price by night: raise Friday and Saturday to about $80 (they would still sell out) and keep Tuesday and Wednesday at $60, because a general midweek discount would lose revenue at this price sensitivity.
        Weekly revenue rises from ${rev0:.0f}k to about ${rev2:.0f}k, about ${(rev2-rev0)*weeks/1000:.1f}M a season, nearly all profit since costs are fixed. Fill midweek seats with targeted offers such as student and rush tickets, and keep a block of affordable seats at every show for fairness.
        Next step: test new prices on next month's performances.""",
        ["Spots unmet demand at the weekend", "Uses price sensitivity to estimate new demand",
         "Notices the midweek cut loses revenue when demand is not very price-sensitive", "Balances revenue with fairness to fans"],
        "Yield management · price by demand · capacity")

CASES.append(cinder())

# ---------------------------------------------------------------- Gateway Parking (medium): time-based pricing
def gateway():
    spaces, p0 = 800, 20.0
    day_dem, turned = 1000, 200
    eve_use = 150                                        # evening cars today, paying the $20 day rate
    days = 250
    rev0 = (spaces + eve_use) * p0 * days / 1e6
    early_p, early_n = 24.0, 650
    late_p, late_n = 16.0, 300
    eve_p1, eve_n1 = 8.0, 400
    # after 10am cars are short stays; spaces reused: 650 early all-day + 300 late (some spaces turn over) <= capacity check
    assert early_n + late_n * 0.5 <= spaces
    rev1 = (early_n * early_p + late_n * late_p + eve_n1 * eve_p1) * days / 1e6
    return C(
        "Gateway Parking", "A car park that's full by 8:30 and empty by 7pm",
        "Pricing", "Real estate", "Canada", 2,
        """Gateway runs an 800-space car park in downtown Vancouver at a flat $20 a day. On weekdays it's full by 8:30am and turns away about 200 cars; after 6pm it's mostly empty.
        The owner asks how to earn more from the same spaces.""",
        [("Who parks?", "Mostly commuters who stay all day. Shoppers and visitors arrive after 10am and stay 2–4 hours, but find it full."),
         ("Evenings?", "About 150 cars come in the evening for restaurants and events and pay the $20 day rate; that price puts others off."),
         ("Research?", "Commuters would pay up to about $24 to guarantee a space. About 300 late-morning visitors a day would come at $16 for a stay of up to 4 hours. An $8 evening rate would bring about 400 evening cars."),
         ("Turnover?", "Short-stay visitors free their space mid-afternoon, so two short stays can share a space."),
         ("Days?", "Assume about 250 weekdays a year; ignore weekends.")],
        ("How should Gateway price its spaces?", [
            ("Who uses the space when", ["Commuters", "Short-stay visitors", "Evening"]),
            ("Willingness to pay", ["By group"]),
            ("Capacity", ["Spaces × time"]),
        ]),
        "A flat price ignores that the space is scarce in the morning and idle at night. Charging by time of day should raise revenue and serve more people.",
        [
            Q("What does Gateway earn today?",
              f"""<p>(800 daytime + 150 evening cars) × $20 × 250 weekdays = <b>${rev0:.2f}M a year</b>.</p>"""),
            Q("Design a time-based price list and estimate revenue.",
              f"""<p><b>Commuters (before 10am, all day): $24</b>, about 650 spaces.</p>
              <p><b>Short stays (after 10am, up to 4 hours): $16</b>, about 300 cars; two can share a space, so they need about 150 spaces. 650 + 150 = 800.</p>
              <p><b>Evening (after 6pm): $8</b>, about 400 cars.</p>
              <p>Revenue: (650 × $24 + 300 × $16 + 400 × $8) × 250 = <b>${rev1:.1f}M</b>, +{pct(rev1/rev0-1)}.</p>""",
              BAR(["Flat $20", "Time-based"], [r(rev0, 2), r(rev1, 2)], title="Exhibit 1 · Yearly revenue ($M)", ylabel="$M", fmt="{:.2f}", h=2.2, highlight=[1])),
            Q("What could go wrong?",
              """<ul><li>Commuters may resent paying $24; offer monthly passes at a small discount for loyalty</li><li>Need space-availability signs and an app so short-stay visitors know there's room</li>
              <li>Check local rules on evening charges and nearby residents' concerns</li></ul>"""),
        ],
        f"""Charge by time of day: $24 for all-day commuters, $16 for short stays after 10am, and $8 in the evening. Reserving about 150 spaces for short-stay visitors, who can share a space across the day, and filling the empty evenings
        raises revenue from ${rev0:.2f}M to about ${rev1:.1f}M a year (+{pct(rev1/rev0-1)}). Offer monthly passes to keep regular commuters. Risk: commuters switching to rival car parks. Next step: install availability signs and test prices for three months.""",
        ["Sees time as the scarce resource", "Segments users by when and how long they park",
         "Checks the plan fits capacity", "Keeps loyal commuters with passes"],
        "Time-based pricing · capacity · segmentation")

CASES.append(gateway())

# ---------------------------------------------------------------- Alder Grand Hotel (hard): how much to overbook
def alder():
    rooms, show, rate, var, walk = 300, 0.92, 250.0, 45.0, 400.0
    margin = rate - var
    def exp_profit(extra):
        n = rooms + extra
        ep, ew = 0.0, 0.0
        for k in range(n + 1):
            p = math.comb(n, k) * show ** k * (1 - show) ** (n - k)
            ep += p * min(k, rooms)
            ew += p * max(k - rooms, 0)
        return margin * ep - walk * ew, ep, ew
    xs = list(range(0, 41, 2))
    vals = [exp_profit(x) for x in xs]
    best = max(range(0, 41), key=lambda x: exp_profit(x)[0])
    p0, e0, w0 = exp_profit(0)
    pb, eb, wb = exp_profit(best)
    naive = round(rooms / show - rooms)
    pn = exp_profit(naive)
    assert best < naive and pb > p0 and pn[2] > wb and pn[0] < pb
    return C(
        "Alder Grand Hotel", "How many extra bookings should a full hotel take?",
        "Pricing", "Hospitality", "United States", 3,
        """The Alder Grand is a 300-room conference hotel in Washington, DC. On busy weeknights it sells out, but about 8% of guests with bookings don't show up, leaving rooms empty that could have been sold.
        The revenue manager wants to accept extra bookings beyond 300. The general manager worries about turning away guests who do arrive. How many extra bookings should the hotel take?""",
        [("Room economics?", "Rate about $250 a night; about $45 of costs per occupied room."),
         ("No-shows?", "On busy weeknights, about 8% of booked guests don't arrive, independently of each other."),
         ("Walking a guest?", "If more guests arrive than there are rooms, the hotel pays for a room at a nearby hotel plus transport and a goodwill voucher: about $400 per guest, plus reputational damage."),
         ("Cancellation policy?", "No-shows aren't charged on most corporate rates.")],
        ("How many bookings beyond 300 should the Alder Grand accept?", [
            ("Benefit of an extra booking", ["Fills a no-show room: $205 margin"]),
            ("Cost of an extra booking", ["Walking a guest: $400"]),
            ("Probability", ["How many no-shows on a given night"]),
            ("Other factors", ["Reputation", "Who gets walked"]),
        ]),
        "With 8% no-shows, about 24 rooms go empty on a sold-out night, but the number varies. Since walking a guest costs more than a room earns, the hotel should stop a little short of the bookings that would, on average, exactly fill the hotel.",
        [
            Q("A simple answer would be to overbook by the expected number of no-shows. What is that, and what's wrong with it?",
              f"""<p>To expect exactly 300 arrivals, book 300 ÷ 92% ≈ <b>{rooms+naive}</b>, i.e. {naive} extra. But arrivals vary from night to night, so on about half of those nights more than 300 guests would turn up.</p>
              <p>An extra booking that fills an empty room earns $205; one that arrives to a full hotel costs $400. Because the downside is bigger than the upside, the hotel should stop a little short of {naive}.</p>"""),
            Q("Here is expected profit per night for different numbers of extra bookings. What do you recommend?",
              f"""<p>Expected profit peaks at about <b>{best} extra bookings</b>: ${pb:,.0f} a night, against ${p0:,.0f} with no overbooking: about ${pb-p0:,.0f} more a night.</p>
              <p>At {best}, the hotel expects to walk about {wb:.1f} guests a night; at {naive} it would walk about {pn[2]:.1f} and earn less (${pn[0]:,.0f}).</p>""",
              LINE([str(x) for x in xs], {"Expected profit ($k per night)": [r(v[0] / 1000, 2) for v in vals]}, title="Exhibit 1 · Expected profit by extra bookings accepted",
                   ylabel="$k per night", labels=False, fmt="{:.1f}"),
              note="Assumes each booked guest independently has a 92% chance of arriving."),
            Q("How would you make overbooking safer?",
              """<ul><li>Overbook less on nights with many loyalty members or conference speakers, who must not be walked</li><li>Charge no-shows on more rates, which lowers the no-show rate itself</li>
              <li>Agree a standing arrangement with a nearby hotel, and always walk guests to a better hotel with a clear apology</li><li>Update no-show estimates by day, season and booking source</li></ul>"""),
        ],
        f"""Accept about {best} bookings beyond the 300 rooms on busy weeknights. That's a little fewer than the {naive} needed to expect a full house, because walking a guest ($400) costs nearly twice what a room earns ($205).
        It raises expected profit by about ${pb-p0:,.0f} a night, with about {wb:.1f} guests a night walked on average. Protect loyalty members and VIPs from being walked, and keep an agreement with a nearby hotel.
        Next step: estimate no-show rates by booking source and day of week.""",
        ["Explains why the best level is below the bookings that would fill the hotel on average", "Weighs the margin of a filled room against the cost of walking a guest",
         "Reads the expected-profit curve", "Protects the most valuable guests"],
        "Overbooking · expected value · probability", fmt="Candidate-led")

CASES.append(alder())
