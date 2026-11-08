"""Go-to-market and channel choice. Concepts from CaseCraft #046-#050; rewritten so every channel decision has a real winner and a trade-off."""
from lib import *
import math
CASES = []

# ---------------------------------------------------------------- Stonebridge Tiles (easy-medium)
def stonebridge():
    gm, rep = 0.35, 150.0                          # gross margin at list price; rep cost $k a year
    seg = {"Large contractors": (150, 200.0, 25), "Small builders": (1500, 20.0, 30)}   # accounts, $k spend a year, accounts a rep can cover
    dist_m = 0.20                                    # distributor's cut of list price
    win = 0.20
    res = {}
    for k, (n, spend, cover) in seg.items():
        direct = gm * spend - rep / cover
        dist = (gm - dist_m) * spend
        res[k] = (direct, dist)
    L, S = "Large contractors", "Small builders"
    assert res[L][0] > res[L][1] and res[S][1] > res[S][0] and min(min(v) for v in res.values()) > 0
    won = {k: seg[k][0] * win for k in seg}
    total = won[L] * res[L][0] + won[S] * res[S][1]
    all_direct = won[L] * res[L][0] + won[S] * res[S][0]
    all_dist = won[L] * res[L][1] + won[S] * res[S][1]
    reps = won[L] / seg[L][2]
    hired = math.ceil(reps)
    total_real = total - (hired - reps) * rep
    return C(
        "Stonebridge Tiles", "Sell through distributors or build a sales team?",
        "Market entry", "Building materials", "United States", 1,
        """Stonebridge makes ceramic floor tiles and is entering Texas. It can either hire its own sales reps to sell directly to builders, or sign up local building-supply distributors,
        who buy at a discount and resell. The commercial director asks which route to take.""",
        [("Who buys?", "150 large contractors spending about $200k a year on tiles, and 1,500 small builders spending about $20k."),
         ("Margins?", "Stonebridge earns 35% gross margin at list price. Distributors buy at 20% off list."),
         ("Sales reps?", "Each costs $150k a year. A rep can look after 25 large accounts or about 30 small ones."),
         ("Expected share?", "Assume Stonebridge wins about 20% of accounts either way.")],
        ("Which route to market should Stonebridge use in Texas?", [
            ("Profit per account", ["Direct: margin − rep cost", "Distributor: margin after their discount"]),
            ("Reach and speed", ["How many accounts each route covers"]),
            ("Control", ["Pricing, service, customer relationship"]),
        ]),
        "Big accounts can carry the cost of a rep; small ones probably can't. I expect a split: direct for large contractors, distributors for small builders.",
        [
            Q("Work out the yearly profit per account for each route and segment.",
              f"""<p><b>Large:</b> direct 35% × $200k − $150k ÷ 25 = <b>${res[L][0]:.0f}k</b>; distributor (35% − 20%) × $200k = ${res[L][1]:.0f}k.</p>
              <p><b>Small:</b> direct 35% × $20k − $150k ÷ 30 = ${res[S][0]:.1f}k; distributor 15% × $20k = <b>${res[S][1]:.1f}k</b>.</p>
              <p><b>So-what:</b> direct wins for large accounts; distributors win for small ones, where a rep's time costs more than the margin given away.</p>""",
              T(["Profit per account ($k a year)", "Direct", "Distributor"], [[k, f"{v[0]:.1f}", f"{v[1]:.1f}"] for k, v in res.items()], title="Exhibit 1 · Profit per account by route")),
            Q("What is the total profit of each approach, at 20% of accounts won?",
              f"""<p>Accounts won: {won[L]:.0f} large, {won[S]:.0f} small.</p>
              <ul><li>All direct: ${all_direct/1000:.2f}M before rounding reps; it needs {won[L]/seg[L][2]+won[S]/seg[S][2]:.1f} reps' worth of accounts, so {math.ceil(won[L]/seg[L][2]+won[S]/seg[S][2])} reps: about ${(all_direct-(math.ceil(won[L]/seg[L][2]+won[S]/seg[S][2])-(won[L]/seg[L][2]+won[S]/seg[S][2]))*rep)/1000:.2f}M</li><li>All distributor: ${all_dist/1000:.2f}M</li><li><b>Split (direct large, distributor small): ${total/1000:.2f}M</b></li></ul>
              <p>The split needs {reps:.1f} reps' worth of accounts. In practice Stonebridge hires {hired}, which costs ${(hired-reps)*rep:.0f}k more than the per-account figures assume: about <b>${total_real/1000:.2f}M</b>, still the best option.</p>"""),
            Q("What would worry you about the split?",
              """<ul><li><b>Channel conflict:</b> distributors may want the large accounts too; agree clear account lists</li><li><b>Price consistency:</b> a builder could see different prices; set a price list both use</li>
              <li><b>Dependence:</b> pick two distributors, not one</li></ul>"""),
        ],
        f"""Use both routes: a small direct team for the 150 large contractors and distributors for the 1,500 small builders. A large account earns ${res[L][0]:.0f}k a year sold direct
        versus ${res[L][1]:.0f}k through a distributor, while a small account earns more through a distributor because a rep's time costs more than the margin given away. The split earns about
        ${total_real/1000:.2f}M a year at a 20% win rate with two reps, more than either route alone. Risk: channel conflict, so agree account lists with distributors upfront.""",
        ["Computes profit per account, not just revenue", "Includes rep cost per account",
         "Sees the answer differs by segment", "Raises channel conflict"],
        "Channel strategy · unit economics by segment")

CASES.append(stonebridge())

# ---------------------------------------------------------------- Arcline Aligners (medium)
def arcline():
    price, prod, review, cac, refund = 1900.0, 600.0, 250.0, 450.0, 0.15
    dtc = price * (1 - refund) - prod - review - cac
    whole, rep_cost = 1100.0, 100.0
    ortho = whole - prod - rep_cost
    v_dtc, v_ortho = 20.0, 30.0                       # k cases a year
    p_dtc, p_ortho = dtc * v_dtc / 1000, ortho * v_ortho / 1000
    naive_dtc = price - prod - review - cac
    assert naive_dtc > ortho > dtc and p_ortho > p_dtc
    return C(
        "Arcline Aligners", "Direct to patients, or through orthodontists?",
        "Market entry", "Healthcare products", "United States", 2,
        """Arcline makes clear teeth-straightening aligners. Its founders want to sell directly to patients online, at $1,900 a treatment with remote check-ins by contracted dentists.
        A board member argues it should instead sell through orthodontists, who would buy aligners and treat patients in their own clinics. Which route should Arcline launch with?""",
        [("Direct-to-patient costs?", "Aligners cost $600 to make; the remote dentist review costs $250 a patient; marketing costs about $450 per patient won."),
         ("Refunds?", "In direct sales about 15% of patients are found unsuitable or unhappy and get a full refund, but the aligners and review are already paid for."),
         ("Orthodontist route?", "Orthodontists pay $1,100 per treatment; Arcline's sales team costs about $100 per case."),
         ("Volumes?", "About 20,000 patients a year direct; about 30,000 cases a year through orthodontists once 1,500 clinics are signed.")],
        ("Which route gives Arcline the better business?", [
            ("Profit per case", ["Price", "Product and review cost", "Marketing or sales cost", "Refunds"]),
            ("Volume", ["Patients reached", "Speed to scale"]),
            ("Risk", ["Clinical outcomes", "Regulation", "Brand"]),
        ]),
        "Direct looks better per case because Arcline keeps the full price. But refunds and marketing costs eat into it, and orthodontists bring volume and clinical oversight.",
        [
            Q("Compare profit per case for the two routes.",
              f"""<p><b>Direct, as the founders see it:</b> $1,900 − $600 − $250 − $450 = ${naive_dtc:.0f}.</p>
              <p><b>Direct, with refunds:</b> only 85% of patients pay, but every patient costs the aligners, review and marketing: 85% × $1,900 − $1,300 = <b>${dtc:.0f}</b>.</p>
              <p><b>Orthodontists:</b> $1,100 − $600 − $100 = <b>${ortho:.0f}</b>.</p>""",
              T(["Per case ($)", "Direct (no refunds)", "Direct (15% refunded)", "Orthodontists"],
                [["Revenue", f"{price:,.0f}", f"{price*(1-refund):,.0f}", f"{whole:,.0f}"], ["Aligners", f"−{prod:.0f}", f"−{prod:.0f}", f"−{prod:.0f}"],
                 ["Dentist review", f"−{review:.0f}", f"−{review:.0f}", "—"], ["Marketing or sales", f"−{cac:.0f}", f"−{cac:.0f}", f"−{rep_cost:.0f}"],
                 ["Profit per case", f"{naive_dtc:,.0f}", f"{dtc:,.0f}", f"{ortho:,.0f}"]], title="Exhibit 1 · Profit per case", bold_last=True)),
            Q("What about total profit?",
              f"""<p>Direct: {v_dtc:.0f}k × ${dtc:.0f} = <b>${p_dtc:.1f}M</b>. Orthodontists: {v_ortho:.0f}k × ${ortho:.0f} = <b>${p_ortho:.1f}M</b>.</p>
              <p><b>So-what:</b> the orthodontist route wins on both profit per case and volume, once refunds are counted.</p>"""),
            Q("Beyond the numbers, what else favours one route?",
              """<ul><li><b>Clinical risk:</b> remote-only treatment has a higher risk of poor outcomes and complaints; in-clinic care lowers refunds and protects the brand</li>
              <li><b>Regulation:</b> dental boards in several states restrict remote treatment</li>
              <li><b>Direct's advantage:</b> Arcline owns the patient relationship and can sell retainers and whitening later</li></ul>"""),
        ],
        f"""Launch through orthodontists. Once the 15% refund rate is counted, a direct case earns about ${dtc:.0f} against ${ortho:.0f} through an orthodontist, and orthodontists bring more volume:
        about ${p_ortho:.1f}M a year against ${p_dtc:.1f}M. They also lower clinical and regulatory risk. Keep direct sales as a later option for retainers and follow-up products.
        Risk: orthodontists may push their existing brands, so offer training and marketing support. Next step: sign 50 pilot clinics.""",
        ["Includes refunds, where costs are incurred but revenue is lost", "Compares profit per case and total profit",
         "Raises clinical and regulatory risk", "Keeps an option open for the direct route"],
        "Channel choice · unit economics · hidden costs")

CASES.append(arcline())

# ---------------------------------------------------------------- Vivid Career Courses (medium)
def vivid():
    b2c_p, b2c_cac, deliv = 400.0, 220.0, 40.0
    b2c = b2c_p - b2c_cac - deliv
    b2b_p, deal_cost, seats, renew, renew_cost = 250.0, 15000.0, 200, 0.70, 10.0
    b2b1 = b2b_p - deal_cost / seats - deliv
    yr = [b2b1, renew * (b2b_p - deliv - renew_cost), renew ** 2 * (b2b_p - deliv - renew_cost)]
    b2b3 = sum(yr)
    repeat = 0.10
    b2c3 = b2c + repeat * (b2c_p - deliv - 30.0)
    assert abs(b2c - b2b1) < 10 and b2b3 > 2 * b2c3
    return C(
        "Vivid Career Courses", "Sell to learners or sell to employers?",
        "Growth strategy", "Online education", "United Kingdom", 2,
        """Vivid sells online courses in data and digital skills to individual learners for $400 each, mostly through online ads. Growth has stalled as ad costs rise.
        Its head of sales wants to start selling seats to employers for staff training. The CEO asks whether the employer route is worth building.""",
        [("Individual learners?", "Each costs about $220 in ads to win. Delivery (platform, tutors, certificates) costs $40 a learner. About 10% buy a second course later, at a $30 marketing cost."),
         ("Employers?", "Vivid would charge $250 a seat. A typical deal is 200 seats and costs about $15,000 of sales effort."),
         ("Renewals?", "Similar providers see about 70% of employers renew each year, at a small account-management cost of about $10 a seat.")],
        ("Should Vivid build an employer (B2B) business?", [
            ("Profit per seat, year 1", ["Price", "Cost to win", "Delivery"]),
            ("Profit over time", ["Renewals vs repeat purchases"]),
            ("What it takes", ["Sales team", "Content for employers", "Reporting"]),
        ]),
        "Per seat, employer deals look worse because the price is lower. But employers renew, so the cost to win is paid once and the profit repeats. I'd compare over three years.",
        [
            Q("Compare first-year profit per learner or seat.",
              f"""<p>Individual: $400 − $220 − $40 = <b>${b2c:.0f}</b>. Employer seat: $250 − $15,000 ÷ 200 − $40 = <b>${b2b1:.0f}</b>.</p>
              <p>About the same in year 1, despite the lower price, because winning a seat costs far less than winning an individual.</p>"""),
            Q("Now compare over three years.",
              f"""<p>Employer seat: year 1 ${yr[0]:.0f}; year 2: 70% renew × ($250 − $40 − $10) = ${yr[1]:.0f}; year 3: 49% × $200 = ${yr[2]:.0f}. Total <b>${b2b3:.0f}</b>.</p>
              <p>Individual: ${b2c:.0f} + 10% buy again × ($400 − $40 − $30) = <b>${b2c3:.0f}</b>.</p>
              <p><b>So-what:</b> over three years an employer seat earns {b2b3/b2c3:.1f}× as much, because renewals don't need new marketing.</p>""",
              BAR(["Individual learner", "Employer seat"], [r(b2c3, 0), r(b2b3, 0)], title="Exhibit 1 · Three-year profit per learner or seat ($)", ylabel="$", h=2.2, highlight=[1])),
            Q("What would it take to make the employer route work?",
              """<ul><li><b>A small sales team</b> targeting HR and learning heads at mid-sized firms</li><li><b>Employer features:</b> progress reports, cohort scheduling, invoicing</li>
              <li><b>Proof of results:</b> completion rates and skills tests, since employers buy outcomes</li><li>Check the 70% renewal assumption with a pilot of 10 employers</li></ul>"""),
        ],
        f"""Build the employer route. A seat earns about the same as an individual learner in year 1 (${b2b1:.0f} vs ${b2c:.0f}), but because employers renew, a seat earns about ${b2b3:.0f} over three years
        against ${b2c3:.0f} for an individual, {b2b3/b2c3:.1f}× as much. Start with a small sales team and the reporting features employers need, while keeping the individual business.
        Risk: the 70% renewal rate is borrowed from other providers. Next step: pilot with 10 employers and measure completion and renewal intent.""",
        ["Compares profit after the cost to win, not price", "Looks beyond year 1 to renewals",
         "Quantifies the three-year difference", "Lists what the new channel needs to work"],
        "B2C vs B2B · customer lifetime value · renewals")

CASES.append(vivid())

# ---------------------------------------------------------------- Ironvale Plant Hire (hard)
def ironvale():
    order, margin, deliv, cac, orders_per = 380.0, 0.55, 95.0, 60.0, 4
    contrib = order * margin
    fixed = 1200.0                                   # $k a year platform
    new_per = contrib - deliv - cac / orders_per
    cannib = 0.30
    can_per = (contrib - deliv) - contrib            # a depot order moved online loses the delivery cost
    blend = (1 - cannib) * new_per + cannib * can_per
    pilot = 4.0                                       # k orders a year
    be_naive = fixed / new_per
    be = fixed / blend
    builders, rentals, share_need = 9000, 6, None
    market = builders * rentals / 1000                # k rentals a year
    fee = 60.0
    blend_fee = blend + fee
    be_fee = fixed / blend_fee
    loss_now = pilot * blend - fixed
    assert be > 0.5 * market and be_fee < 0.4 * market and loss_now < 0
    return C(
        "Ironvale Plant Hire", "An online rental platform: scale it up or shut it down?",
        "Growth strategy", "Equipment rental", "Australia", 3,
        """Ironvale rents construction equipment to builders from 12 depots around Brisbane. A year ago it launched an online booking platform with delivery to site, aimed at small builders.
        Online orders are growing, but the platform loses money. The board must decide whether to invest more or close it. The CEO asks for your view.""",
        [("Order economics?", "The average online rental is $380 with a 55% contribution margin before delivery. Delivery and collection cost $95 an order, free to the customer."),
         ("Marketing?", "About $60 to win a new online customer, who then places about 4 orders a year."),
         ("Platform costs?", "$1.2M a year for the platform, support and marketing team."),
         ("Who orders online?", "About 30% of online orders come from builders who used to walk into a depot."),
         ("Market?", "About 9,000 small builders in the delivery area, each renting about 6 times a year."),
         ("Current volume?", "About 4,000 online orders a year, from roughly 1,000 online customers.")],
        ("Should Ironvale scale or close the online platform?", [
            ("Profit per online order", ["Margin", "Delivery", "Marketing"]),
            ("Cannibalisation", ["Orders that would have come to a depot anyway"]),
            ("Break-even", ["Orders needed vs the market"]),
            ("Levers", ["Delivery fee", "Fixed cost"]),
        ]),
        "Free delivery takes a big bite out of each order, and some online orders are depot customers switching, which adds nothing. The break-even could be out of reach unless delivery is charged.",
        [
            Q("What does a new online order earn, and how many orders would break even?",
              f"""<p>Contribution: 55% × $380 = ${contrib:.0f}. Less delivery $95 and marketing $60 ÷ 4 orders = $15: <b>${new_per:.0f} per order</b>.</p>
              <p>Break-even: $1,200k ÷ ${new_per:.0f} = <b>{num(be_naive, 1)}k orders a year</b>, against {pilot:.0f}k today.</p>"""),
            Q("Now account for the 30% of orders that come from depot customers.",
              f"""<p>A depot customer moving online already earned ${contrib:.0f} at the depot. Online, Ironvale now also pays $95 delivery: that order is worth <b>−$95</b> extra.</p>
              <p>Blended value per online order: 70% × ${new_per:.0f} + 30% × (−$95) = <b>${blend:.0f}</b>. Break-even: $1,200k ÷ ${blend:.0f} = <b>{num(be, 1)}k orders</b>.</p>
              <p>The whole small-builder market is about {market:.0f}k rentals a year, so break-even needs about <b>{pct(be/market)} of every rental</b> in the area. Not realistic.</p>
              <p>Today, at {pilot:.0f}k orders, the platform loses about ${-loss_now/1000:.2f}M a year.</p>""",
              WF("Contribution per order", r(contrib, 0), [("Delivery", -deliv), ("Marketing", -cac / orders_per), ("Cannibalisation", r(blend - new_per, 0))], "Value per online order",
                 title="Exhibit 1 · What an online order is really worth ($)", fmt="{:+,.0f}", base_fmt="{:,.0f}")),
            Q(f"What if Ironvale charged a ${fee:.0f} delivery fee, as most rivals do?",
              f"""<p>Each order gains $60: ${blend_fee:.0f} per order, before any benefit from click-and-collect. Break-even falls to <b>{num(be_fee, 1)}k orders</b>, about {pct(be_fee/market)} of the market. Ambitious, but possible over a few years.</p>
              <p>Some customers will drop off, and depot customers who don't want delivery should be offered free click-and-collect, which removes the cannibalisation cost.</p>"""),
        ],
        f"""Don't scale the platform in its current form: free delivery and 30% cannibalisation leave each order worth about ${blend:.0f}, so break-even needs about {pct(be/market)} of all small-builder rentals.
        Keep it, but change the model: charge a ${fee:.0f} delivery fee and offer free click-and-collect, which brings break-even to about {num(be_fee, 1)}k orders a year ({pct(be_fee/market)} of the market).
        Set a 12-month target and close the platform if order growth stalls below the break-even path. Risk: the fee may slow growth. Next step: test the fee in two postcodes.""",
        ["Builds profit per order including delivery and marketing", "Accounts for cannibalisation of depot orders",
         "Checks break-even against the size of the market", "Finds a lever that changes the answer and sets a kill date"],
        "Channel economics · cannibalisation · break-even vs market size", fmt="Candidate-led")

CASES.append(ironvale())
