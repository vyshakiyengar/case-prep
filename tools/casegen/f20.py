"""Capital allocation. Concepts from CaseCraft #096-#100; rewritten from scratch."""
from lib import *
from itertools import combinations
CASES = []

def af(rate, n): return (1 - (1 + rate) ** -n) / rate

# ---------------------------------------------------------------- Granite Holdings (medium): capital rationing
def granite():
    budget = 50.0
    proj = {"A: new plant": (30, 12.0), "B: automation": (15, 9.0), "C: new product line": (10, 5.0), "D: warehouse": (20, 8.0), "E: IT upgrade": (5, 1.5)}
    names = list(proj)
    def total(sel): return sum(proj[n][1] for n in sel), sum(proj[n][0] for n in sel)
    # greedy by NPV
    by_npv, spent = [], 0
    for n in sorted(names, key=lambda n: -proj[n][1]):
        if spent + proj[n][0] <= budget: by_npv.append(n); spent += proj[n][0]
    by_pi, spent = [], 0
    for n in sorted(names, key=lambda n: -proj[n][1] / proj[n][0]):
        if spent + proj[n][0] <= budget: by_pi.append(n); spent += proj[n][0]
    best = max((c for k in range(1, 6) for c in combinations(names, k) if total(c)[1] <= budget), key=lambda c: total(c)[0])
    assert total(by_pi)[0] == total(best)[0] > total(by_npv)[0]
    rows = [[n, f"{c:.0f}", f"{v:.1f}", f"{v/c:.2f}"] for n, (c, v) in proj.items()]
    short = lambda sel: ", ".join(x.split(":")[0] for x in sel)
    return C(
        "Granite Holdings", "$50M to spend, $80M of good projects",
        "Investment decision", "Industrial manufacturing", "United States", 2,
        """Granite is an industrial manufacturer. Its divisions have proposed five projects needing $80M in total, all with a positive NPV. The board has capped next year's investment at $50M.
        The CFO asks which projects to fund.""",
        [("Can projects be scaled down?", "No: each is all-or-nothing."),
         ("Are NPVs comparable?", "Yes: all use the same 9% discount rate and have been reviewed by finance."),
         ("Dependencies?", "None; projects are independent."),
         ("Can unused budget roll over?", "No.")],
        ("Which projects should Granite fund within $50M?", [
            ("Value created", ["NPV of each project"]),
            ("Capital used", ["Investment needed"]),
            ("Value per dollar", ["NPV ÷ investment"]),
            ("Beyond the numbers", ["Strategic fit", "Risk"]),
        ]),
        "With limited capital, the best set isn't the projects with the biggest NPVs but those that create the most value per dollar invested.",
        [
            Q("Here are the projects. If you fund the biggest NPVs first, what do you get?",
              f"""<p>A ($12M) then B ($9M): $45M used. D and C don't fit; E does. Set {short(by_npv)}: NPV <b>${total(by_npv)[0]:.1f}M</b>.</p>""",
              T(["Project", "Investment ($M)", "NPV ($M)", "NPV per $1 invested"], rows, title="Exhibit 1 · Proposed projects")),
            Q("Now rank by NPV per dollar invested. Which set is better?",
              f"""<p>Ranking by NPV ÷ investment: B (0.60), C (0.50), A and D (0.40), E (0.30). Funding in that order: B, C, then A doesn't fit, D does, then E: {short(by_pi)}, using ${total(by_pi)[1]:.0f}M.</p>
              <p>NPV: <b>${total(by_pi)[0]:.1f}M</b>, ${total(by_pi)[0]-total(by_npv)[0]:.1f}M more than funding the biggest projects first. Checking every combination confirms it is the best set.</p>
              <p><b>So-what:</b> when capital is the constraint, rank by value per dollar.</p>"""),
            Q("Is there anything that would make you fund A anyway?",
              """<p>Yes, if the plant is strategically necessary (for example, existing capacity runs out next year), if its NPV is more certain than the others', or if delaying it loses the opportunity.
              Also ask whether the $50M cap is truly fixed: if projects return well above the cost of capital, borrowing to fund A may create value.</p>"""),
        ],
        f"""Fund B, C, D and E (${total(by_pi)[1]:.0f}M), which together create about ${total(by_pi)[0]:.1f}M of NPV, more than the ${total(by_npv)[0]:.1f}M from funding the biggest project, A, first.
        With capital capped, rank projects by NPV per dollar invested. Revisit A next year, or challenge the $50M cap if all projects are as solid as they look.""",
        ["Ranks by NPV per dollar under a capital limit", "Shows why ranking by NPV fails",
         "Checks the full combination", "Questions whether the cap itself is right"],
        "Capital rationing · profitability index · NPV")

CASES.append(granite())

# ---------------------------------------------------------------- Copperleaf Retail (medium): invest, acquire or return cash
def copperleaf():
    wacc = 0.10
    opts = {"Refit 60 existing stores": (80.0, 0.16), "Open 25 new stores": (100.0, 0.11), "Buy a rival chain": (150.0, 0.08)}
    cash = 200.0
    ep = {k: c * (r_ - wacc) for k, (c, r_) in opts.items()}
    invest = [k for k in opts if opts[k][1] > wacc]
    used = sum(opts[k][0] for k in invest)
    back = cash - used
    assert ep["Buy a rival chain"] < 0 and used < cash
    rows = [[k, f"{c:.0f}", pct(r_), signed(ep[k], 1)] for k, (c, r_) in opts.items()]
    return C(
        "Copperleaf Retail", "$200M of cash: grow, buy, or give it back?",
        "Investment decision", "Retail", "United Kingdom", 2,
        """Copperleaf is a profitable home-goods retailer with $200M of spare cash. Management has three ideas, and some shareholders want a share buyback. The board asks how to use the money.
        Copperleaf's cost of capital is 10%.""",
        [("Refit existing stores?", "$80M to refit 60 stores; expected return about 16% a year on the money invested."),
         ("New stores?", "$100M for 25 stores in new towns; expected return about 11%."),
         ("Acquisition?", "Buy a smaller rival for $150M; expected return about 8%, including savings."),
         ("Buyback?", "Returns cash to shareholders, who can invest it elsewhere at about the cost of capital.")],
        ("How should Copperleaf use $200M?", [
            ("Return vs cost of capital", ["Each option's return", "Value created per year"]),
            ("Risk", ["How certain each return is"]),
            ("What's left", ["Return surplus cash"]),
        ]),
        "Only projects returning more than the 10% cost of capital create value. Anything below that is better returned to shareholders.",
        [
            Q("Which options create value, and how much?",
              f"""<p>Value created a year = money invested × (return − 10%).</p>
              <ul><li>Refit: $80M × 6% = <b>+${ep['Refit 60 existing stores']:.1f}M</b> a year</li><li>New stores: $100M × 1% = +${ep['Open 25 new stores']:.1f}M</li>
              <li>Acquisition: $150M × −2% = <b>{signed(ep['Buy a rival chain'], 1, '$', 'M')}</b>: destroys value</li></ul>""",
              T(["Option", "Investment ($M)", "Expected return", "Value created a year ($M)"], rows, title="Exhibit 1 · Options vs 10% cost of capital")),
            Q("New stores return only 1% above the cost of capital. Would you do them?",
              """<p>Barely. A 1-point margin can vanish if a few stores underperform. I'd open them in stages, starting with the towns most like Copperleaf's best stores, and stop if early stores miss target.</p>"""),
            Q("What's your recommendation for the $200M?",
              f"""<p>Refit stores ($80M), open new stores in stages (up to $100M), skip the acquisition, and return the remaining ${back:.0f}M, plus any new-store money not used, through a buyback.</p>"""),
        ],
        f"""Refit the existing stores first: $80M at about 16% creates about ${ep['Refit 60 existing stores']:.1f}M of value a year. Open new stores in stages, because their 11% return is only just above the 10% cost of capital.
        Don't buy the rival: an 8% return destroys about ${-ep['Buy a rival chain']:.0f}M of value a year. Return the remaining ${back:.0f}M, and any unused new-store money, to shareholders through a buyback.""",
        ["Compares each return with the cost of capital", "Computes value created, not just return",
         "Treats a thin margin with caution", "Returns cash that can't earn its cost"],
        "Capital allocation · return vs cost of capital · buybacks")

CASES.append(copperleaf())

# ---------------------------------------------------------------- Osprey Group (medium-hard): portfolio of business units
def osprey():
    wacc = 0.09
    bu = {"Packaging": (400.0, 0.15, 0.06), "Specialty films": (150.0, 0.22, 0.12), "Industrial labels": (300.0, 0.08, 0.01), "Paper mills": (500.0, 0.04, -0.02)}
    ep = {k: c * (r_ - wacc) for k, (c, r_, g) in bu.items()}
    offer = 420.0
    mills_val = 500.0 * 0.04 / 0.09                    # value if held: earnings ÷ cost of capital (no growth)
    mills_earn = 500.0 * 0.04
    assert ep["Paper mills"] < 0 and ep["Specialty films"] > 0 and offer > mills_val
    rows = [[k, f"{c:.0f}", pct(r_), signed(g * 100, 0) + "%", signed(ep[k], 1)] for k, (c, r_, g) in bu.items()]
    return C(
        "Osprey Group", "Four businesses, one budget: which to grow, fix or sell?",
        "Growth strategy", "Packaging and paper", "Sweden", 3,
        """Osprey is a listed group with four businesses. Each asks for more capital every year, and the CEO tends to share it out evenly. A new CFO asks you to recommend a portfolio strategy.
        Osprey's cost of capital is 9%.""",
        [("Capital and returns?", "Packaging: $400M invested, 15% return, market growing 6%. Specialty films: $150M, 22%, growing 12%. Industrial labels: $300M, 8%, growing 1%. Paper mills: $500M, 4%, shrinking 2% a year."),
         ("Buyer interest?", "A paper company has offered $420M for the mills."),
         ("Synergies?", "Little sharing between the businesses apart from head office.")],
        ("Where should Osprey invest, and what should it sell?", [
            ("Value created by each business", ["(Return − cost of capital) × capital"]),
            ("Growth", ["Market growth", "Room to invest"]),
            ("Options", ["Grow", "Fix", "Sell"]),
        ]),
        "Sharing capital evenly feeds businesses that destroy value. Specialty films should get more; paper mills look like a candidate to sell.",
        [
            Q("Which businesses create value, and which destroy it?",
              f"""<p>Value created a year = capital × (return − 9%).</p>
              <p>Films {signed(ep['Specialty films'], 1, '$', 'M')}, packaging {signed(ep['Packaging'], 1, '$', 'M')}, labels {signed(ep['Industrial labels'], 1, '$', 'M')}, mills <b>{signed(ep['Paper mills'], 1, '$', 'M')}</b>.</p>""",
              T(["Business", "Capital ($M)", "Return", "Market growth", "Value created a year ($M)"], rows, title="Exhibit 1 · Osprey's businesses")),
            Q("Should Osprey accept $420M for the paper mills?",
              f"""<p>The mills earn about 4% on $500M = ${mills_earn:.0f}M a year, in a shrinking market. Valued at the 9% cost of capital with no growth: ${mills_earn:.0f}M ÷ 9% = <b>about ${mills_val:.0f}M</b>, and less if earnings keep falling.</p>
              <p>An offer of <b>$420M</b> is worth more to Osprey than keeping them. The buyer may value them more because it can combine mills and cut costs.</p>"""),
            Q("Lay out the portfolio strategy.",
              """<ul><li><b>Grow specialty films:</b> highest return in the fastest-growing market; give it first claim on capital</li>
              <li><b>Maintain packaging:</b> solid returns; invest where returns stay above 9%</li>
              <li><b>Fix or exit labels:</b> just below the cost of capital in a flat market; set a two-year target to reach 10%+, or sell</li>
              <li><b>Sell the mills</b> and use part of the $420M to fund films and part to reduce debt or return cash</li></ul>"""),
        ],
        f"""Stop sharing capital evenly. Specialty films earns 22% in a market growing 12% and should get first claim on capital; packaging should be maintained; labels needs a turnaround plan to beat the 9% cost of capital within two years or be sold.
        Sell the paper mills: they destroy about ${-ep['Paper mills']:.0f}M of value a year, are worth only about ${mills_val:.0f}M to Osprey, and a buyer is offering $420M. Risk: losing scale in purchasing and head-office costs. Next step: test the films growth plan.""",
        ["Computes value created by each business", "Values the business to sell against the offer",
         "Assigns a clear role to each business", "Links the sale proceeds to where capital goes"],
        "Portfolio strategy · economic profit · divestment", fmt="Candidate-led")

CASES.append(osprey())

# ---------------------------------------------------------------- Saltire Telecom (hard): fibre rollout by region
def saltire():
    arpu, margin, life, rate, connect = 50.0, 0.60, 15, 0.08, 300.0
    pv_cust = arpu * 12 * margin * af(rate, life)
    reg = {"Urban": (400.0, 0.40, 300, 0.0), "Suburban": (700.0, 0.35, 500, 0.0), "Rural": (1800.0, 0.30, 400, 1000.0)}   # cost per home passed, take-up, k homes, subsidy per home
    res = {}
    for k, (cost, take, homes, sub) in reg.items():
        npv_home = take * (pv_cust - connect) - cost + sub
        net_cost = cost - sub
        res[k] = (npv_home, net_cost, homes, npv_home / net_cost)
    budget = 600.0
    order = sorted(res, key=lambda k: -res[k][3])
    spend, plan = 0.0, []
    for k in order:
        npv_h, nc, homes, pi = res[k]
        if pi < 0.10: continue                     # too thin a margin to fund from a capped budget
        need = homes * nc / 1000
        take_m = min(need, budget - spend)
        plan.append((k, take_m, take_m * 1000 / nc, take_m * 1000 / nc * npv_h / 1000)); spend += take_m
    held = budget - spend
    rival_take = 0.25
    urban_rival = rival_take * (pv_cust - connect) - reg["Urban"][0]
    assert res["Rural"][0] > 0 and res["Rural"][0] < 0.1 * res["Urban"][0] and urban_rival > 0 and order[0] == "Urban" and all(p[0] != "Rural" for p in plan) and held > 0
    rows = [[k, f"{reg[k][0]:,.0f}", pct(reg[k][1]), f"{reg[k][3]:,.0f}", signed(res[k][0], 0)] for k in reg]
    return C(
        "Saltire Telecom", "Where should $600M of fibre go first?",
        "Investment decision", "Telecoms", "United Kingdom", 3,
        """Saltire is building a fibre broadband network in Scotland and has $600M for the next three years. The board wants to know which areas to build in, in what order.
        A rival has just announced fibre plans for the main cities.""",
        [("Customers?", "Each customer pays about $50 a month at a 60% margin, and stays for 15 years on average. Discount rate 8%. Connecting a customer's home costs about $300, paid from the operating budget, not the $600M build budget."),
         ("Cost to pass a home with fibre?", "Urban about $400; suburban about $700; rural about $1,800."),
         ("Take-up?", "Expected share of homes passed that sign up: urban 40%, suburban 35%, rural 30%. Homes: 300k urban, 500k suburban, 400k rural."),
         ("Subsidy?", "The government pays $1,000 per rural home passed."),
         ("Rival?", "If the rival builds in a city first, Saltire's urban take-up could fall to about 25%.")],
        ("How should Saltire allocate $600M across regions?", [
            ("Value of a customer", ["Margin × years, discounted", "Connection cost"]),
            ("Value per home passed", ["Take-up × customer value − build cost + subsidy"]),
            ("Value per dollar", ["Rank regions"]),
            ("Timing and competition", ["Rival in cities"]),
        ]),
        "Urban areas are cheapest to build and have the highest take-up, so they come first, especially with a rival coming. Rural only works with the subsidy.",
        [
            Q("What is a customer worth today?",
              f"""<p>$50 × 12 × 60% = $360 a year for 15 years at 8% (factor {af(rate, life):.2f}): <b>${pv_cust:,.0f}</b>. Less $300 to connect: ${pv_cust-connect:,.0f}.</p>"""),
            Q("What is each home passed worth in each region?",
              f"""<p>Urban: 40% × ${pv_cust-connect:,.0f} − $400 = <b>{signed(res['Urban'][0], 0, '$')}</b>. Suburban: 35% × ${pv_cust-connect:,.0f} − $700 = <b>{signed(res['Suburban'][0], 0, '$')}</b>.
              Rural: 30% × ${pv_cust-connect:,.0f} − $1,800 + $1,000 subsidy = <b>{signed(res['Rural'][0], 0, '$')}</b>, only just positive.</p>
              <p>Value per dollar spent: urban {res['Urban'][3]:.2f}, suburban {res['Suburban'][3]:.2f}, rural {res['Rural'][3]:.2f} (per dollar of Saltire's own money after the $1,000 subsidy; about {res['Rural'][0]/1800:.2f} on the full $1,800).</p>""",
              T(["Region", "Cost per home ($)", "Take-up", "Subsidy ($)", "Value per home passed ($)"], rows, title="Exhibit 1 · Value per home passed")),
            Q("How would you spend the $600M, and in what order?",
              "".join(f"<p><b>{k}:</b> ${m:.0f}M, about {num(h)}k homes, value about ${v:.0f}M.</p>" for k, m, h, v in plan) +
              f"""<p>That uses ${spend:.0f}M. Rural adds only about {res['Rural'][3]*100:.0f} cents of value per dollar, too thin to fund from a capped budget, so hold the remaining ${held:.0f}M back for cost overruns and to speed up the urban build.</p>
              <p>Build urban first and fast: the rival's plans make it urgent. Even if the rival arrives and take-up falls to 25%, an urban home is still worth {signed(urban_rival, 0, '$')}.</p>"""),
            Q("Should Saltire build rural areas at all?",
              f"""<p>With the subsidy each rural home is worth only about {signed(res['Rural'][0], 0, '$')}: a small cost overrun or lower take-up would make it negative. Build rural only with a bigger subsidy,
              cheaper methods (using existing poles), or partners to share costs. Not from this budget.</p>"""),
        ],
        f"""Spend about ${spend:.0f}M on urban areas first, then suburban, and hold ${held:.0f}M back. An urban home passed is worth about {signed(res['Urban'][0], 0, '$')}, a suburban one about {signed(res['Suburban'][0], 0, '$')}, and a rural one only about {signed(res['Rural'][0], 0, '$')}
        even with the $1,000 subsidy. Build cities first and quickly to get there before the rival; even at 25% take-up they stay valuable. Leave rural out of this budget unless subsidies rise or costs fall.
        Risk: build costs and take-up are estimates, so release funding in stages. Next step: start the two largest cities this quarter.""",
        ["Values a customer over their lifetime", "Converts customer value into value per home passed",
         "Ranks regions by value per dollar and allocates the budget", "Weighs timing and competition"],
        "Capital allocation · customer lifetime value · infrastructure rollout", fmt="Candidate-led")

CASES.append(saltire())
