"""Operations and capacity. Concepts from CaseCraft #031, #032, #034, #035; rewritten from scratch."""
from lib import *
CASES = []

def system(rates, hours):
    cap = {k: v * hours for k, v in rates.items()}
    b = min(cap, key=cap.get)
    return cap, b, cap[b]

# ---------------------------------------------------------------- Riverbend Bottling (easy)
def riverbend():
    rates = {"Rinse": 130, "Fill": 100, "Label": 115, "Pack": 110}     # cases per hour
    hours, yld, demand, contrib = 3800, 0.97, 400.0, 4.0                 # k cases, $ per case
    cap, b, c = system(rates, hours)
    sold0 = min(demand, c / 1000 * yld)
    r2 = dict(rates, Fill=rates["Fill"] * 1.17)
    cap2, b2, c2 = system(r2, hours)
    sold1 = min(demand, c2 / 1000 * yld)
    gain = (sold1 - sold0) * contrib                                   # $k
    capex = 230.0
    assert b == "Fill" and b2 == "Pack"
    return C(
        "Riverbend Bottling", "Which machine is holding the line back?",
        "Cost & operations", "Beverage production", "United States", 1,
        """Riverbend bottles sparkling water in Ohio for supermarket private labels. Customers want 400,000 cases a year but Riverbend can't keep up, and it's losing orders.
        The plant manager has proposed a $230k upgrade to the filling machine. The owner asks you to check whether that's the right investment.""",
        [("How does the line work?", "Four stations in sequence: rinse bottles, fill and cap, label, pack into cases."),
         ("Operating time?", "Two shifts, about 3,800 hours a year."),
         ("Quality?", "97% of cases pass final inspection."),
         ("Economics?", "Each extra case sold earns about $4 of contribution.")],
        ("Will the filler upgrade let Riverbend meet demand?", [
            ("Capacity", ["Rate of each station", "Which is slowest (the bottleneck)", "Hours run"]),
            ("Output", ["Cases passing inspection", "Demand cap"]),
            ("Economics", ["Extra cases × contribution", "Payback on $230k"]),
        ]),
        "A line runs at the speed of its slowest station. I'd check that the filler really is the bottleneck, and what becomes the bottleneck after the upgrade.",
        [
            Q("Here are the station speeds. How many good cases can the line produce today, and how many orders is Riverbend losing?",
              f"""<p>The filler is slowest at {rates['Fill']} cases an hour: {rates['Fill']} × {num(hours)} = {num(c/1000, 0)}k cases a year. After 97% yield: <b>{num(sold0, 1)}k</b>.</p>
              <p>Demand is {demand:.0f}k, so Riverbend loses about <b>{num(demand-sold0, 1)}k cases</b> a year: ${num((demand-sold0)*contrib)}k of contribution.</p>""",
              BAR(list(rates), list(rates.values()), title="Exhibit 1 · Station speed (cases per hour)", ylabel="Cases per hour", h=2.3, highlight=[1])),
            Q("The upgrade makes the filler 17% faster. What happens?",
              f"""<p>Filler: {rates['Fill']} × 1.17 = {r2['Fill']:.0f} an hour. Now the <b>packer ({rates['Pack']}/hour) is the bottleneck</b>: {rates['Pack']} × {num(hours)} × 97% = {num(c2/1000*yld, 1)}k good cases,
              more than demand, so Riverbend can supply all {demand:.0f}k.</p>
              <p>Extra cases: {num(sold1-sold0, 1)}k × ${contrib:.0f} = <b>${num(gain)}k a year</b>. Payback: ${capex:.0f}k ÷ ${num(gain)}k = <b>{capex/gain:.1f} years</b>.</p>
              <p><b>So-what:</b> a good investment, and the new bottleneck still leaves headroom above demand.</p>"""),
            Q("Is there a cheaper way to get the same output?",
              """<ul><li><b>Run the filler through breaks</b> with a relief operator: a few more hours a day on the bottleneck only</li>
              <li><b>Cut changeover time</b> between bottle sizes on the filler</li><li><b>Weekend shift</b> for the filler with a small buffer of filled bottles</li></ul>
              <p>These could close part of the gap within weeks; the upgrade is the durable fix.</p>"""),
        ],
        f"""Approve the filler upgrade. The filler is the bottleneck today, limiting output to about {num(sold0, 1)}k good cases against {demand:.0f}k demand. Making it 17% faster moves the bottleneck to the packer,
        which still has enough capacity to meet demand, adding about ${num(gain)}k of contribution a year and paying back in {capex/gain:.1f} years. Meanwhile, run the filler through breaks to recover some volume now.
        Risk: faster filling could raise reject rates. Next step: trial the upgrade's speed on one product before committing.""",
        ["Finds the bottleneck from station speeds", "Checks what becomes the bottleneck after the upgrade",
         "Caps output at demand", "Suggests quick wins on the bottleneck itself"],
        "Bottleneck analysis · payback")

CASES.append(riverbend())

# ---------------------------------------------------------------- Cascade Furniture (easy-medium, sequencing)
def cascade():
    rates = {"Cutting": 58, "Assembly": 66, "Finishing": 49}            # units per hour
    hours, yld, demand, contrib = 1820, 0.95, 105.0, 24.0             # k units, $ per unit
    cap, b, c = system(rates, hours)
    s0 = min(demand, c / 1000 * yld)
    rA = dict(rates, Finishing=rates["Finishing"] * 1.22)
    capA, bA, cA = system(rA, hours)
    sA = min(demand, cA / 1000 * yld)
    rB = dict(rA, Cutting=rates["Cutting"] * 1.10)
    capB, bB, cB = system(rB, hours)
    sB = min(demand, cB / 1000 * yld)
    gA, gB = (sA - s0) * contrib, (sB - sA) * contrib                    # $k
    cA_cost, cB_cost = 450.0, 150.0
    assert b == "Finishing" and bA == "Cutting" and bB == "Finishing"
    return C(
        "Cascade Furniture", "Late deliveries at a furniture plant: fix one machine or two?",
        "Cost & operations", "Furniture manufacturing", "Denmark", 1,
        """Cascade makes flat-pack modular shelving in Denmark and sells it across Europe. Customers want about 105,000 units a year, but shipments run late
        because work piles up in the lacquer finishing area. The COO wants to add a second lacquer booth for $450k. She asks whether that solves the problem.""",
        [("Process?", "Three steps: cutting panels, assembly, lacquer finishing."),
         ("Hours?", "One shift: about 1,820 hours a year."),
         ("Quality?", "95% of units pass inspection."),
         ("Economics?", "Each extra unit sold earns $24 of contribution.")],
        ("How should Cascade raise output to meet demand?", [
            ("Capacity by step", ["Units per hour", "Bottleneck today", "Bottleneck after each change"]),
            ("Output", ["Good units vs demand"]),
            ("Investment", ["Cost of each option", "Payback"]),
        ]),
        "Finishing is where work piles up, so it's probably the bottleneck. But speeding up finishing may just move the bottleneck to the next-slowest step.",
        [
            Q("How many good units can Cascade ship today?",
              f"""<p>Finishing is slowest: {rates['Finishing']} × {num(hours)} = {num(c/1000, 1)}k units; after 95% yield, <b>{num(s0, 1)}k</b>, against demand of {demand:.0f}k.</p>""",
              BAR(list(rates), list(rates.values()), title="Exhibit 1 · Units per hour by step", ylabel="Units per hour", h=2.3, highlight=[2])),
            Q("A second lacquer booth raises finishing speed by 22% for $450k. What does it deliver?",
              f"""<p>Finishing: {rA['Finishing']:.1f}/hour, but cutting ({rates['Cutting']}/hour) is now the bottleneck: {num(cA/1000, 1)}k units, <b>{num(sA, 1)}k good units</b>.</p>
              <p>Extra: {num(sA-s0, 1)}k × ${contrib:.0f} = ${num(gA)}k a year; payback {cA_cost/gA:.1f} years. Still {num(demand-sA, 1)}k short of demand.</p>"""),
            Q("Cutting could be made 10% faster for $150k (a faster saw and better panel loading). What if Cascade does both?",
              f"""<p>Cutting: {rB['Cutting']:.1f}/hour; finishing at {rA['Finishing']:.1f} is the bottleneck again: {num(cB/1000, 1)}k units, <b>{num(sB, 1)}k good</b>, {('just above' if sB >= demand else 'just below')} demand.</p>
              <p>The cutting upgrade adds a further {num(sB-sA, 1)}k units: ${num(gB)}k a year for ${cB_cost:.0f}k, a payback of <b>{cB_cost/gB:.1f} years</b>.</p>
              <p><b>So-what:</b> the two changes work as a pair. On its own, the booth leaves Cascade short; together they nearly close the gap for $600k, paying back in {(cA_cost+cB_cost)/(gA+gB):.1f} years.</p>""",
              T(["", "Today", "+ lacquer booth", "+ booth and faster saw"], [["Bottleneck", b, bA, bB], ["Good units (k)", f"{s0:.1f}", f"{sA:.1f}", f"{sB:.1f}"],
                 ["Extra contribution vs today ($k)", "—", num(gA), num(gA + gB)]], title="Exhibit 2 · Options compared")),
        ],
        f"""Do both: add the second lacquer booth and speed up cutting. The booth alone moves the bottleneck to cutting and leaves Cascade about {num(demand-sA, 1)}k units short; with a 10% faster saw,
        output reaches about {num(sB, 1)}k good units against demand of {demand:.0f}k, adding about ${num(gA+gB)}k a year and paying back the $600k in {(cA_cost+cB_cost)/(gA+gB):.1f} years.
        Risk: both projects must land together, so plan the installs in the same summer shutdown. Next step: get firm quotes and installation dates.""",
        ["Checks the bottleneck after each change", "Sequences investments by where capacity is limited",
         "Compares output with demand at each step", "Recommends the combination, with a payback"],
        "Bottleneck shifts · sequencing investments")

CASES.append(cascade())

# ---------------------------------------------------------------- Glacier Meals (medium, wrong fix proposed)
def glacier():
    rates = {"Prep": 130, "Cook": 118, "Blast freeze": 124, "Pack": 145}   # trays per hour
    hours, yld, demand, contrib = 3200, 0.96, 440.0, 4.0                  # k trays, $ per tray
    cap, b, c = system(rates, hours)
    s0 = min(demand, c / 1000 * yld)
    rP = dict(rates, Pack=rates["Pack"] * 1.25)
    _, bP, cP = system(rP, hours); sP = min(demand, cP / 1000 * yld)
    rC = dict(rates, Cook=rates["Cook"] * 1.18)
    _, bC, cC = system(rC, hours); sC = min(demand, cC / 1000 * yld)
    rF = dict(rC, **{"Blast freeze": rates["Blast freeze"] * 1.15})
    _, bF, cF = system(rF, hours); sF = min(demand, cF / 1000 * yld)
    assert b == "Cook" and bP == "Cook" and bC == "Blast freeze" and bF == "Prep" and sP == s0 and sF < demand
    gC, gF = (sC - s0) * contrib, (sF - s0) * contrib
    rX = dict(rF, Prep=150.0)
    _, bX, cX = system(rX, hours); sX = min(demand, cX / 1000 * yld)
    ot = (demand - sX) * 1000 / (rX[bX] * yld)
    assert bX == "Cook" and sX < demand
    cost_pack, cost_cook, cost_freeze = 600.0, 180.0, 220.0
    return C(
        "Glacier Meals", "The packing robot that wouldn't add a single meal",
        "Cost & operations", "Food manufacturing", "Canada", 2,
        """Glacier makes frozen ready meals in Ontario for Canadian grocers. Demand is 440,000 trays a year and growing, and Glacier is turning down orders.
        The operations director proposes a $600k automated packing line, because packing is the most labour-intensive step. The CEO asks you to evaluate it.""",
        [("Process?", "Prep ingredients, cook, blast-freeze, pack. Trays move in sequence."),
         ("Hours?", "Two shifts, 3,200 hours a year."),
         ("Quality?", "96% of trays pass inspection."),
         ("Economics?", "Each extra tray sold earns about $4 of contribution.")],
        ("How should Glacier increase output?", [
            ("Capacity", ["Trays per hour at each step", "Bottleneck", "What shifts after each upgrade"]),
            ("Options", ["Packing robot", "Faster cooking", "More blast-freezer capacity"]),
            ("Economics", ["Extra trays × $4", "Payback"]),
        ]),
        "Labour-intensive doesn't mean bottleneck. If packing is already faster than cooking, a robot will save labour but won't add any meals.",
        [
            Q("Here are the step speeds. What would the packing robot (+25% packing speed) do to output?",
              f"""<p>Cooking is the bottleneck at {rates['Cook']} trays an hour: {num(c/1000, 1)}k trays, <b>{num(s0, 1)}k good</b>, against demand of {demand:.0f}k.</p>
              <p>Packing is already the fastest step ({rates['Pack']}/hour). Making it faster changes nothing: output stays at {num(sP, 1)}k. <b>Zero extra meals.</b></p>
              <p><b>So-what:</b> the robot can only be justified on labour savings, not on growth.</p>""",
              BAR(list(rates), list(rates.values()), title="Exhibit 1 · Trays per hour by step", ylabel="Trays per hour", h=2.3, highlight=[1])),
            Q(f"Alternatives: an extra kettle to make cooking 18% faster (${cost_cook:.0f}k), and a second blast-freezer to add 15% freezing capacity (${cost_freeze:.0f}k). Evaluate.",
              f"""<p><b>Cooking only:</b> {rC['Cook']:.0f}/hour, but the blast freezer ({rates['Blast freeze']}/hour) becomes the bottleneck: {num(sC, 1)}k good trays, +{num(sC-s0, 1)}k, ${num(gC)}k a year, payback {cost_cook/gC:.1f} years.</p>
              <p><b>Cooking and freezer:</b> both are now above {rates['Prep']}/hour, so <b>prep becomes the bottleneck</b>: {num(sF, 1)}k good trays, +{num(sF-s0, 1)}k,
              ${num(gF)}k a year for ${cost_cook+cost_freeze:.0f}k: payback <b>{(cost_cook+cost_freeze)/gF:.1f} years</b>.</p>
              <p><b>So-what:</b> this line is nearly balanced, so each fix only moves the limit to the next step. Even with both, Glacier is {num(demand-sF, 1)}k trays short.
              Prep is manual, so the cheap next step is an extra prep worker per shift (to 150/hour). Cooking is then the limit again at about {num(sX, 1)}k good trays;
              the last {num(demand-sX, 1)}k need around {num(ot, -1)} hours of weekend overtime a year.</p>""",
              T(["Option", "Cost ($k)", "Bottleneck after", "Good trays (k)", "Extra contribution ($k/yr)"],
                [["Packing robot", num(cost_pack), bP, f"{sP:.1f}", "0"], ["Faster cooking", num(cost_cook), bC, f"{sC:.1f}", num(gC)],
                 ["Faster cooking + second freezer", num(cost_cook + cost_freeze), bF, f"{sF:.1f}", num(gF)]], title="Exhibit 2 · Options compared")),
            Q("The operations director says the robot also saves four packers' wages. How do you handle that?",
              """<p>Fair point: it's a cost-saving project, not a growth project, and should be judged on its own payback (four packers' wages vs $600k).
              It may still be worth doing later. But growth depends on cooking, freezing and prep, so those come first.</p>"""),
        ],
        f"""Don't buy the packing robot to grow: packing isn't the bottleneck, so it adds no meals. Instead add a kettle and a second blast-freezer: output rises from {num(s0, 1)}k to {num(sF, 1)}k good trays,
        adding about ${num(gF)}k a year and paying back in {(cost_cook+cost_freeze)/gF:.1f} years. Prep then becomes the limit: an extra prep worker per shift takes output to about {num(sX, 1)}k,
        and weekend overtime covers the rest. Evaluate the robot separately as a labour-saving project.
        Risk: freezer temperature compliance can't be compromised for speed. Next step: confirm the freezer supplier's lead time.""",
        ["Rejects the proposal with numbers, not opinion", "Sees the line is nearly balanced: each fix moves the bottleneck to the next step",
         "Separates growth projects from cost projects", "Handles the director's objection respectfully"],
        "Bottlenecks · wrong-fix trap", fmt="Candidate-led")

CASES.append(glacier())

# ---------------------------------------------------------------- Axion Electronics (hard, test + rework)
def axion():
    hours, demand, contrib = 1920, 320.0, 42.0          # k boards, $ per board
    place, test = 180, 175
    fpy0, recover = 0.91, 0.60
    def out(place_rate, test_rate, fpy):
        tests_per = 1 + (1 - fpy)                        # each failed board is retested once
        test_starts = test_rate / tests_per               # boards started per hour the tester can handle
        starts = min(place_rate, test_starts)
        good_per = fpy + (1 - fpy) * recover
        bott = "Test" if test_starts < place_rate else "Pick-and-place"
        return min(demand, starts * hours * good_per / 1000), bott, test_starts, good_per
    o0, b0, ts0, g0 = out(place, test, fpy0)
    oA, bA, *_ = out(place * 1.27, test, fpy0)
    oB, bB, tsB, gB = out(place, test, 0.96)
    oC, bC, *_ = out(place, test * 2, fpy0)
    assert b0 == "Test" and abs(oA - o0) < 1e-9
    gainB, gainC = (oB - o0) * contrib, (oC - o0) * contrib     # $k
    costA, costB, costC = 950.0, 400.0, 600.0
    assert costB < costA / 2 and oB < demand and oC == demand
    return C(
        "Axion Electronics", "Shortages at a circuit-board plant: the hidden bottleneck",
        "Cost & operations", "Electronics manufacturing", "Malaysia", 3,
        """Axion assembles circuit boards in Penang for industrial customers. It can't meet demand of 320,000 boards a year, and customers are threatening to dual-source.
        Engineering wants a $950k upgrade to make the pick-and-place machine 27% faster. The plant director asks you to test the proposal.""",
        [("Process?", "Print solder paste, pick-and-place components, reflow oven, automated test."),
         ("Speeds?", "Pick-and-place 180 boards/hour; tester 175 tests/hour. Printing and reflow are faster than both."),
         ("Quality?", "91% of boards pass test first time. Failed boards are reworked and retested once; 60% of those then pass."),
         ("Economics?", "Hours: 1,920 a year. Each extra good board earns $42.")],
        ("How can Axion meet demand?", [
            ("Capacity", ["Machine speeds", "Retests use tester time", "True bottleneck"]),
            ("Quality", ["First-pass yield", "Rework recovery"]),
            ("Options", ["Faster pick-and-place", "Better first-pass yield", "Second tester"]),
        ]),
        "The tester is nominally only a little slower than pick-and-place, but every failed board is tested twice. With 9% failing, the tester is probably the real bottleneck, so a faster pick-and-place wouldn't help.",
        [
            Q("How many boards per hour can the line actually start, and how many good boards a year does it produce?",
              f"""<p>Each started board uses 1 + 9% = 1.09 tests. The tester can handle {test} ÷ 1.09 = <b>{ts0:.1f} boards started per hour</b>, below pick-and-place's {place}.
              <b>The tester is the bottleneck.</b></p>
              <p>Good boards per board started: 91% + 9% × 60% = {pct(g0, 1)}.</p>
              <p>Annual output: {ts0:.1f} × {num(hours)} × {pct(g0, 1)} = <b>{num(o0, 1)}k good boards</b>, against demand of {demand:.0f}k.</p>""",
              note="This is the crux. Retests silently eat tester capacity."),
            Q("What would engineering's $950k pick-and-place upgrade deliver?",
              f"""<p>Nothing: the tester still limits the line to {ts0:.1f} starts an hour. Output stays at {num(oA, 1)}k. <b>$950k for zero extra boards.</b></p>"""),
            Q("Two alternatives: solder-paste inspection that raises first-pass yield to 96% ($400k), or a second tester ($600k). Compare them.",
              f"""<p><b>Better yield:</b> tests per board 1.04, so the tester handles {tsB:.1f} starts an hour; good per start {pct(gB, 1)}: output <b>{num(oB, 1)}k</b>
              (+{num(oB-o0, 1)}k), worth ${num(gainB)}k a year: payback {costB/gainB:.1f} years.</p>
              <p><b>Second tester:</b> pick-and-place becomes the bottleneck at {place}/hour: output {num(oC, 1)}k{' (capped at demand)' if oC == demand else ''} (+{num(oC-o0, 1)}k),
              worth ${num(gainC)}k a year: payback {costC/gainC:.1f} years.</p>
              <p><b>So-what:</b> the second tester meets demand; better yield gets most of the way for less and also cuts rework labour.</p>""",
              T(["Option", "Cost ($k)", "Bottleneck", "Good boards (k)", "Payback (years)"],
                [["Faster pick-and-place", num(costA), bA, f"{oA:.1f}", "never"], ["Solder-paste inspection", num(costB), bB, f"{oB:.1f}", f"{costB/gainB:.1f}"],
                 ["Second tester", num(costC), bC, f"{oC:.1f}", f"{costC/gainC:.1f}"]], title="Exhibit 1 · Options compared")),
            Q("Which would you recommend, and why?",
              f"""<p>Start with solder-paste inspection: for ${num(costB)}k, less than half of engineering's proposal, it lifts output to {num(oB, 1)}k ({pct(oB/demand)} of demand),
              cuts rework labour and improves quality for customers. Cover the last {num(demand-oB, 1)}k boards with tester overtime.</p>
              <p>Buy the second tester (${num(costC)}k) when demand grows beyond today's {demand:.0f}k, or sooner if a tester breakdown would put key customers at risk.</p>"""),
        ],
        f"""Don't approve the $950k pick-and-place upgrade: the real bottleneck is the tester, because every failed board is tested twice, so faster placement adds no output. Today the line makes about
        {num(o0, 1)}k good boards against {demand:.0f}k demand. I recommend solder-paste inspection to raise first-pass yield to 96% (about {num(oB, 1)}k boards, payback {costB/gainB:.1f} years), with tester overtime for the remaining
        {num(demand-oB, 1)}k; add a second tester once demand grows. Risk: yield gains take time to stabilise. Next step: install inspection on one line and measure first-pass yield for a month.""",
        ["Accounts for retests when computing tester capacity", "Proves the proposed upgrade adds nothing",
         "Compares a quality fix with a capacity fix", "Recommends the cheaper fix first, and the capacity fix when demand needs it"],
        "Hidden bottlenecks · yield and rework · capacity", fmt="Candidate-led")

CASES.append(axion())
