"""Private equity. Concepts from CaseCraft #056-#060; rewritten with full returns maths."""
from lib import *
CASES = []

def irr(moic, yrs): return moic ** (1 / yrs) - 1

# ---------------------------------------------------------------- Crescent Dental Labs (medium): buy-and-build
def crescent():
    eb0, m_in, m_out, yrs = 10.0, 8.0, 9.0, 5
    ev0 = eb0 * m_in; debt0 = ev0 * 0.5; eq0 = ev0 - debt0
    eb_org = eb0 * 1.04 ** yrs
    adds, eb_add, m_add = 10, 1.0, 5.0
    add_cost = adds * eb_add * m_add
    paydown = 20.0
    debt_exit = debt0 + add_cost - paydown
    eb_exit = eb_org + adds * eb_add
    eq_exit = eb_exit * m_out - debt_exit
    moic = eq_exit / eq0
    eq_solo = eb_org * m_out - (debt0 - paydown)
    moic_solo = eq_solo / eq0
    eq_flat = eb_exit * m_in - debt_exit
    target = 2.5
    assert moic > target > moic_solo and eq_flat / eq0 > target
    return C(
        "Crescent Dental Labs", "Can a fund triple its money on dental labs?",
        "Private equity", "Healthcare services", "United States", 2,
        """A private equity fund is looking at Crescent, which makes crowns and dentures for dentists across the Midwest. Crescent has $10M of EBITDA and the owners want 8×: $80M.
        The fund needs at least 2.5× its money in five years. The deal partner's plan is to buy small local labs and fold them into Crescent. Does the deal work?""",
        [("Financing?", "Half debt, half fund equity: $40M each."),
         ("Organic growth?", "About 4% a year from more procedures and an ageing population."),
         ("Add-ons?", "There are hundreds of small labs. The fund expects to buy 10 over five years, each with about $1M of EBITDA, at about 5×, funded with extra debt."),
         ("Cash and exit?", "Crescent's cash flow can repay about $20M of debt over five years. Lab groups of Crescent's size or larger sell for about 9× EBITDA.")],
        ("Will the fund make 2.5× in five years?", [
            ("Entry", ["Price, debt and equity"]),
            ("Value creation", ["Organic growth", "Add-on acquisitions", "Debt repayment"]),
            ("Exit", ["EBITDA × exit multiple − debt"]),
            ("Risks", ["Integrating labs", "Exit multiple", "Dentists' consolidation"]),
        ]),
        "Organic growth of 4% alone won't get to 2.5×. The returns probably depend on buying small labs cheaply and selling them as part of a bigger group at a higher multiple.",
        [
            Q("First, what return would Crescent deliver without any add-ons?",
              f"""<p>EBITDA in year 5: $10M × 1.04⁵ = ${eb_org:.1f}M. Exit value at 9×: ${eb_org*m_out:.0f}M. Debt: $40M − $20M = $20M. Equity: <b>${eq_solo:.0f}M</b>.</p>
              <p>Return: ${eq_solo:.0f}M ÷ $40M = <b>{moic_solo:.2f}×</b> (about {pct(irr(moic_solo, yrs))} a year), below the 2.5× target.</p>"""),
            Q("Now add the buy-and-build plan.",
              f"""<p>Ten labs × $1M × 5 = ${add_cost:.0f}M of extra debt. EBITDA in year 5: ${eb_org:.1f}M + $10M = ${eb_exit:.1f}M. Exit value at 9×: ${eb_exit*m_out:.0f}M.</p>
              <p>Debt at exit: $40M + ${add_cost:.0f}M − $20M = ${debt_exit:.0f}M. Equity: <b>${eq_exit:.0f}M</b>. Return: <b>{moic:.1f}×</b> (about {pct(irr(moic, yrs))} a year).</p>
              <p><b>So-what:</b> buying labs at 5× and selling them as part of a group at 9× is what makes the deal work.</p>""",
              WF("Equity in", eq0, [("Organic EBITDA growth", r((eb_org - eb0) * m_in, 1)), ("Add-on labs", r(adds * eb_add * m_in - add_cost, 1)),
                                   ("Higher exit multiple", r(eb_exit * (m_out - m_in), 1)), ("Debt repaid", paydown)], "Equity out",
                 title="Exhibit 1 · Where the fund's return comes from ($M)", fmt="{:+,.1f}", base_fmt="{:,.1f}",),
              note="Each add-on lab is bought for $5M but is worth $9M inside the group at exit."),
            Q("What if exit multiples don't rise and the group still sells at 8×?",
              f"""<p>Exit value: ${eb_exit:.1f}M × 8 = ${eb_exit*m_in:.0f}M; equity ${eq_flat:.0f}M; return <b>{eq_flat/eq0:.1f}×</b>. Still above target.</p>
              <p>The bigger risk is execution: buying and integrating 10 labs in five years, and keeping their dentist customers.</p>"""),
        ],
        f"""Invest, with the buy-and-build plan as the core of the case. On its own, Crescent returns only about {moic_solo:.1f}× in five years. Adding 10 small labs at 5× EBITDA lifts EBITDA to about ${eb_exit:.0f}M
        and the return to about {moic:.1f}× ({pct(irr(moic, yrs))} a year), and still {eq_flat/eq0:.1f}× if the exit multiple stays at 8×. Risks: integrating labs and keeping their dentists, and paying more for add-ons as
        rivals copy the strategy. Next step: build a pipeline of 20 target labs before signing.""",
        ["Computes entry equity, exit equity and the money multiple", "Shows the business alone misses the target",
         "Explains multiple arbitrage in buy-and-build", "Stress-tests the exit multiple"],
        "Private equity returns · buy-and-build · value-creation bridge")

CASES.append(crescent())

# ---------------------------------------------------------------- Beacon Field Services (medium): concentration risk
def beacon():
    eb0, ask, yrs, g = 25.0, 10.0, 5, 0.08
    ev0 = eb0 * ask; debt0 = eb0 * 5; eq0 = ev0 - debt0
    eb5 = eb0 * (1 + g) ** yrs
    debt5 = 75.0
    eq5 = eb5 * ask - debt5
    m_base = eq5 / eq0
    top, p_lose = 0.35, 0.30
    eb5_d = eb5 * (1 - top)
    debt5_d = 105.0
    eq5_d = eb5_d * ask - debt5_d
    m_down = eq5_d / eq0
    exp_eq = (1 - p_lose) * eq5 + p_lose * eq5_d
    m_exp = exp_eq / eq0
    tgt = 2.5
    x = (exp_eq / tgt + debt0) / eb0                  # entry multiple that gives 2.5x expected
    assert m_base < tgt and m_down < 1.5 and 8 < x < ask
    return C(
        "Beacon Field Services", "One customer is a third of the business",
        "Private equity", "Business services", "United States", 2,
        """Beacon maintains heating, air-conditioning and electrical systems in offices and warehouses. A PE fund is considering buying it for 10× its $25M EBITDA: $250M.
        The fund needs 2.5× its money in five years. In due diligence you find that one property group provides 35% of Beacon's revenue, and its contract is up for renewal in year 2.""",
        [("Financing?", "Debt of 5× EBITDA ($125M); the rest is fund equity."),
         ("Growth?", "Market growing about 8% a year; Beacon has kept pace."),
         ("Debt repayment?", "Debt falls to about $75M by year 5 in the base case; to about $105M if the big client leaves, as cash flow drops."),
         ("Chance of losing the client?", "Management says the relationship is strong. Industry data suggests about 30% of contracts this size are re-tendered and lost."),
         ("Exit?", "Assume the exit multiple stays at 10×.")],
        ("Should the fund buy Beacon at $250M?", [
            ("Base case returns", ["Growth", "Debt paydown"]),
            ("Downside", ["Losing the big client"]),
            ("Price and protection", ["What price gives 2.5×?", "Deal terms"]),
        ]),
        "Even the base case may be tight at 10×. The client concentration is the key risk: losing 35% of revenue in a leveraged deal hurts the equity a lot.",
        [
            Q("What is the return in the base case, where the client renews?",
              f"""<p>Equity in: $250M − $125M = ${eq0:.0f}M. Year-5 EBITDA: $25M × 1.08⁵ = ${eb5:.1f}M; exit at 10× = ${eb5*ask:.0f}M; less $75M debt = ${eq5:.0f}M.</p>
              <p>Return: <b>{m_base:.2f}×</b> ({pct(irr(m_base, yrs))} a year). Already below the 2.5× target.</p>"""),
            Q("And if the client leaves in year 2?",
              f"""<p>EBITDA falls by 35% (assuming its margin is average): ${eb5_d:.1f}M in year 5. Exit ${eb5_d*ask:.0f}M less $105M debt = ${eq5_d:.0f}M. Return: <b>{m_down:.1f}×</b>.</p>
              <p>Weighted by a 30% chance: 70% × ${eq5:.0f}M + 30% × ${eq5_d:.0f}M = ${exp_eq:.0f}M expected, <b>{m_exp:.1f}×</b>.</p>""",
              T(["Scenario", "Chance", "Equity at exit ($M)", "Return"], [["Client renews", "70%", num(eq5), f"{m_base:.2f}×"], ["Client leaves", "30%", num(eq5_d), f"{m_down:.2f}×"],
                 ["Expected", "", num(exp_eq), f"{m_exp:.2f}×"]], title="Exhibit 1 · Returns by scenario at a $250M price", bold_last=True)),
            Q("At what price would the fund expect 2.5×?",
              f"""<p>The fund needs equity in of ${exp_eq:.0f}M ÷ 2.5 = ${exp_eq/tgt:.0f}M. With $125M of debt, the price is ${exp_eq/tgt+debt0:.0f}M: about <b>{x:.1f}× EBITDA</b>.</p>
              <p>Other ways to protect the fund: make the deal conditional on the client renewing first, or defer part of the price until it does.</p>"""),
        ],
        f"""Don't pay $250M. Even if the big client renews, the fund makes only about {m_base:.1f}×; if it leaves (about a 30% chance), the return falls to about {m_down:.1f}×, giving an expected {m_exp:.1f}×.
        Offer about {x:.1f}× EBITDA (around ${exp_eq/tgt+debt0:.0f}M), or keep the $250M headline but defer part of it until the contract is renewed. Risk: another bidder may pay more. Next step: meet the client
        and test how likely it is to re-tender.""",
        ["Computes base-case returns before worrying about risk", "Quantifies the downside and the probability-weighted return",
         "Works backwards to the right entry price", "Uses deal structure to protect against a known risk"],
        "Private equity · customer concentration · returns and pricing")

CASES.append(beacon())

# ---------------------------------------------------------------- Banyan Language Schools (medium-hard): operational value creation
def banyan():
    n, cap, util0, fee0, var, fixed = 40, 600, 0.70, 3000.0, 600.0, 700.0       # fixed $k per school
    def school(util, fee): return cap * util * (fee - var) / 1000 - fixed      # $k EBITDA per school
    s0 = school(util0, fee0)
    eb0 = n * s0 / 1000
    s_util = school(0.80, fee0)
    s_both = school(0.80, fee0 * 1.05)
    add_util = n * (s_util - s0) / 1000
    add_price = n * (s_both - s_util) / 1000
    new = 10
    add_new = new * s_both / 1000
    eb5 = eb0 + add_util + add_price + add_new
    m = 9.0
    ev0 = eb0 * m; debt0 = eb0 * 4; eq0 = ev0 - debt0
    debt5 = 30.0
    eq5 = eb5 * m - debt5
    moic = eq5 / eq0
    assert abs(eb5 - (n + new) * s_both / 1000) < 1e-9 and moic > 2.5
    return C(
        "Banyan Language Schools", "Where will the value come from?",
        "Private equity", "Education", "Vietnam", 3,
        """A PE fund is buying Banyan, which runs 40 English-language schools for children in Vietnam. The price is 9× EBITDA, with debt of 4× EBITDA.
        The partner asks you to build the value-creation plan: how much could EBITDA grow in five years, from which levers, and what return would that give?""",
        [("School economics?", "Each school has 600 places and is 70% full. Families pay $3,000 a year. Teaching materials and part-time tutors cost $600 per student; rent and core staff $700k per school a year."),
         ("Levers?", "Management believes better marketing and timetabling can fill schools to 80%, fees can rise 5% with new digital homework tools, and 10 new schools can open in under-served cities."),
         ("New schools?", "Each costs about $2M to open, paid from cash flow, and within three years reaches the same economics as an existing school after the improvements (80% full, fees 5% higher)."),
         ("Debt at exit?", "About $30M.")],
        ("How much value can the fund create at Banyan?", [
            ("Fill existing schools", ["Utilisation 70% → 80%"]),
            ("Charge more", ["Fees +5%"]),
            ("Open new schools", ["10 schools", "Capital needed"]),
            ("Returns", ["Exit value − debt vs equity in"]),
        ]),
        "Schools have high fixed costs, so each extra student is very profitable. I expect filling empty seats to be the biggest lever.",
        [
            Q("What does one school earn today, and what is Banyan's EBITDA?",
              f"""<p>Students: 600 × 70% = 420. Each contributes $3,000 − $600 = $2,400: $1,008k. Less $700k fixed: <b>${s0:.0f}k</b> per school.</p>
              <p>Across 40 schools: <b>${eb0:.1f}M</b> EBITDA.</p>"""),
            Q("Build the EBITDA bridge to year 5.",
              f"""<p><b>Fill to 80%:</b> +60 students × $2,400 = +$144k per school; × 40 = <b>+${add_util:.2f}M</b>.</p>
              <p><b>Fees +5%:</b> $150 more × 480 students = +$72k per school; × 40 = <b>+${add_price:.2f}M</b>.</p>
              <p><b>10 new schools</b> at mature economics (${s_both:.0f}k each): <b>+${add_new:.2f}M</b>, needing $20M of capital.</p>
              <p>Year-5 EBITDA: <b>${eb5:.1f}M</b>, about {eb5/eb0:.1f}× today.</p>""",
              WF("EBITDA today", r(eb0, 2), [("Fill schools to 80%", r(add_util, 2)), ("Fees +5%", r(add_price, 2)), ("10 new schools", r(add_new, 2))], "EBITDA year 5",
                 title="Exhibit 1 · EBITDA bridge ($M)", fmt="{:+,.1f}", base_fmt="{:,.1f}"),
              note="Fixed costs mean a 14% rise in students lifts school profit by 47%."),
            Q("What return would the fund make?",
              f"""<p>Entry: 9 × ${eb0:.1f}M = ${ev0:.0f}M; debt ${debt0:.0f}M; equity <b>${eq0:.0f}M</b>.</p>
              <p>Exit at 9×: ${eb5*m:.0f}M; less $30M debt: ${eq5:.0f}M. Return: <b>{moic:.1f}×</b> (about {pct(irr(moic, 5))} a year).</p>"""),
            Q("Which lever would you trust least, and why?",
              """<p><b>New schools</b>: they take time to fill, need good sites and teachers, and use cash. The plan assumes they're mature by year 5.
              <b>Fees</b> are the easiest to deliver but must be backed by visible quality, or families will switch. <b>Filling schools</b> is the biggest lever and fully in management's control, so start there.</p>"""),
        ],
        f"""Back the deal. Banyan earns ${eb0:.1f}M EBITDA today; filling schools from 70% to 80% adds ${add_util:.1f}M, a 5% fee rise adds ${add_price:.1f}M, and 10 new schools add ${add_new:.1f}M,
        taking EBITDA to about ${eb5:.0f}M in five years and the fund's return to about {moic:.1f}×. Filling existing schools is the biggest and most controllable lever, so put the first 100 days there.
        Risk: new schools may fill more slowly than planned. Next step: rank schools by utilisation and test marketing in the five emptiest.""",
        ["Builds school-level economics before company totals", "Separates the levers in an EBITDA bridge",
         "Explains operating leverage from fixed costs", "Judges which lever is most reliable"],
        "Private equity value creation · operating leverage · EBITDA bridge", fmt="Candidate-led")

CASES.append(banyan())

# ---------------------------------------------------------------- Fjord Chemicals (hard): buying at the peak
def fjord():
    hist = [45, 52, 61, 57, 38, 47, 66, 78, 80]
    yrs = [str(2017 + i) for i in range(len(hist))]
    peak = hist[-1]
    mid = sum(hist) / len(hist)
    trough = min(hist)
    ask_m, lend_m = 8.0, 5.0
    price = peak * ask_m
    debt = peak * lend_m
    eq = price - debt
    exit_m = 7.0
    debt5 = 300.0
    eq5 = mid * exit_m - debt5
    lev_trough = debt / trough
    fair = mid * ask_m
    debt_safe = mid * 3.5
    paydown = debt - debt5
    eq_fair_exit = mid * exit_m - (debt_safe - paydown)
    m_fair = eq_fair_exit / (fair - debt_safe)
    eq_need = eq_fair_exit / 2.5
    max_bid = eq_need + debt_safe
    assert eq5 / eq < 1 and lev_trough > 8 and fair < price and m_fair < 2.5 and max_bid < fair
    return C(
        "Fjord Chemicals", "A record year, a record price: is it a trap?",
        "Private equity", "Chemicals", "Norway", 3,
        """Fjord makes specialty coatings for ships and offshore platforms. It just had its best year ever: $80M of EBITDA. The owners want 8× that, $640M, and banks will lend 5× this year's EBITDA.
        A PE fund asks you whether to bid, needing 2.5× its money in five years.""",
        [("History?", "Demand follows shipbuilding and offshore investment, which move in cycles of roughly 5–7 years."),
         ("Outlook?", "Order books for new ships are falling from their peak."),
         ("Exit?", "Similar businesses sell for about 7× EBITDA mid-cycle."),
         ("Debt paydown?", "About $100M over five years in a normal cycle.")],
        ("Should the fund bid $640M for Fjord?", [
            ("Earnings", ["Peak vs average through the cycle"]),
            ("Returns", ["Entry on peak, exit mid-cycle"]),
            ("Debt risk", ["Leverage at a downturn"]),
            ("Price", ["What to offer"]),
        ]),
        "The price is set on a peak year. If earnings return to their average, the fund pays far too much, and debt set on peak earnings could become dangerous in a downturn.",
        [
            Q("Look at Fjord's EBITDA history. What do you notice?",
              f"""<p>EBITDA swings between ${trough}M and ${peak}M. The nine-year average is about <b>${mid:.1f}M</b>, so this year is about {pct(peak/mid-1)} above average, near the top of the cycle.</p>""",
              LINE(yrs, {"EBITDA ($M)": hist}, title="Exhibit 1 · Fjord EBITDA ($M)", ylabel="$M")),
            Q("If the fund pays $640M and EBITDA returns to its average by exit, what return does it make?",
              f"""<p>Equity in: $640M − $400M debt = ${eq:.0f}M. Exit: ${mid:.1f}M × 7 = ${mid*exit_m:.0f}M; less $300M debt = <b>${eq5:.0f}M</b>.</p>
              <p>Return: <b>{eq5/eq:.2f}×</b>. The fund loses money, even though Fjord stays profitable.</p>"""),
            Q("What happens to the debt in a downturn like the last one?",
              f"""<p>At the last trough EBITDA was ${trough}M. With $400M of debt, leverage would be <b>{lev_trough:.1f}×</b>, far above the 4–6× where lenders usually step in. The fund could lose control of the company.</p>"""),
            Q("What would you bid?",
              f"""<p>Start from mid-cycle earnings and debt the business can survive: about 3.5× ${mid:.1f}M = ${debt_safe:.0f}M.</p>
              <p>Even 8× mid-cycle (${fair:.0f}M) returns only about {m_fair:.1f}× when the exit is at 7×. For 2.5×: exit equity ${mid:.1f}M × 7 − (${debt_safe:.0f}M − ${paydown:.0f}M repaid) = ${eq_fair_exit:.0f}M,
              so equity in can be at most ${eq_need:.0f}M and the price at most <b>about ${max_bid:.0f}M</b> ({max_bid/mid:.1f}× mid-cycle EBITDA).</p>
              <p>Even that debt would be about {debt_safe/min(hist):.1f}× EBITDA at a trough like the last one, at the edge of what lenders accept, so treat ${max_bid:.0f}M as a ceiling, not a target.</p>
              <p>That is half the asking price, so the owners will refuse. Be ready to walk away, or wait and bid in the downturn.</p>"""),
        ],
        f"""Don't bid $640M. This year's $80M of EBITDA is near the top of the cycle; the nine-year average is about ${mid:.1f}M. Paying 8× peak earnings and exiting at average earnings returns about
        {eq5/eq:.2f}× the fund's money, and $400M of debt would reach {lev_trough:.1f}× EBITDA in a downturn like the last one. To reach 2.5× with safe debt, the fund could pay at most about ${max_bid:.0f}M, half the asking price, so walk away now and look again in the downturn.
        Next step: model the next three years from the ship order book.""",
        ["Recognises a cyclical business and normalises earnings", "Shows that buying at the peak destroys returns",
         "Stress-tests leverage at the trough", "Works back to a maximum price and is willing to walk away"],
        "Private equity · cyclical earnings · leverage risk")

CASES.append(fjord())
