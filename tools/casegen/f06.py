"""Product launches and cannibalisation. Concepts from CaseCraft #026-#029; rewritten from scratch."""
from lib import *
CASES = []

# ---------------------------------------------------------------- Elm Home Security (easy)
def elm():
    base, up, new = 160.0, 0.14, 30.0           # k customers
    b_p, b_c, p_p, p_c = 8.0, 2.0, 18.0, 7.0    # $ per month
    upg = base * up
    gain_up = (p_p - p_c) - (b_p - b_c)
    a_up = upg * gain_up * 12 / 1000             # $M
    a_new = new * (p_p - p_c) * 12 / 1000
    fixed, once = 0.94, 1.3
    net = a_up + a_new - fixed
    wrong = upg * (p_p - p_c) * 12 / 1000 + a_new - fixed
    return C(
        "Elm Home Security", "Launching a premium plan: how much is really new money?",
        "Product launch", "Consumer technology", "United Kingdom", 1,
        """Elm sells home security cameras and alarms with a $8-a-month app plan (self-monitoring). It wants to launch a premium plan at $18 a month that includes
        24/7 professional monitoring, with a call-out if an alarm goes off. The marketing team forecasts strong demand. The CFO wants to know the true annual profit impact.""",
        [("Customers today?", "160,000 on the $8 plan, costing about $2 a month each to serve."),
         ("Premium costs?", "About $7 a month per customer in total, including the app, the monitoring centre and call-outs (it replaces the $2 cost of the basic plan)."),
         ("Forecast?", "14% of existing customers upgrade; 30,000 new customers join for the premium plan."),
         ("Launch costs?", "$1.3M one-off; $0.94M a year minimum fee to the monitoring partner.")],
        ("What is the premium plan worth to Elm each year?", [
            ("New customers", ["Number", "Margin per month"]),
            ("Upgrading customers", ["Number", "Extra margin vs the plan they leave"]),
            ("Costs", ["Monitoring partner fee", "One-off launch cost"]),
        ]),
        "The trap is counting upgraders as if they were new revenue. They already pay $8, so only the difference counts.",
        [
            Q("Calculate the annual profit impact of the premium plan.",
              f"""<p><b>Upgraders:</b> {num(upg, 1)}k customers. Each moves from ${b_p-b_c:.0f} to ${p_p-p_c:.0f} margin a month: +${gain_up:.0f}. Annual: {num(upg, 1)}k × ${gain_up:.0f} × 12 = <b>${a_up:.2f}M</b>.</p>
              <p><b>New customers:</b> {new:.0f}k × ${p_p-p_c:.0f} × 12 = <b>${a_new:.2f}M</b>.</p>
              <p>Minus the ${fixed}M monitoring fee: <b>${net:.2f}M a year</b>. The ${once}M launch cost pays back in about {once/net*12:.0f} months.</p>
              <p><b>So-what:</b> new customers drive most of the value. If you'd counted upgraders' full premium margin you'd get ${wrong:.2f}M, overstating by ${wrong-net:.2f}M.</p>""",
              WF("Upgraders", a_up, [("New customers", a_new), ("Monitoring fee", -fixed)], "Annual profit",
                 title="Exhibit 1 · Annual profit impact ($M)", ylabel="$M", fmt="{:+.2f}", base_fmt="{:.2f}")),
            Q("How sensitive is this to the forecast of 30,000 new customers?",
              f"""<p>Each new customer is worth ${(p_p-p_c)*12:.0f} a year. Without any new customers, profit would be ${a_up - fixed:.2f}M a year, and the launch cost would take
              {once/(a_up-fixed):.1f} years to recover.</p>
              <p>New customers needed just to cover the monitoring fee, given the upgrades: {'none: upgrades alone cover it' if a_up >= fixed else f'{(fixed-a_up)*1000/((p_p-p_c)*12):.1f}k'}.</p>
              <p><b>So-what:</b> the plan pays even if new-customer demand disappoints, because upgrades are profitable on their own.</p>"""),
            Q("What could go wrong after launch?",
              """<ul><li><b>False alarms</b> raising monitoring costs above $7 a month</li><li><b>Service quality</b>: slow response would damage the brand</li>
              <li><b>Contract terms</b>: the $0.94M minimum fee is owed even if take-up is low</li><li>Regulatory checks for monitored alarm services</li></ul>"""),
        ],
        f"""Launch the premium plan. It adds about ${net:.2f}M a year: ${a_up:.2f}M from upgraders (counting only their extra margin) and ${a_new:.2f}M from new customers, after the ${fixed}M monitoring fee,
        and repays the ${once}M launch cost in about {once/net*12:.0f} months. It remains profitable even with no new customers. Risk: false alarms push monitoring costs up, so track cost per customer monthly.
        Next step: agree a monitoring contract with a lower minimum fee for the first year.""",
        ["Counts upgraders' extra margin only", "Separates one-off and recurring costs",
         "Tests the most uncertain forecast", "Flags service and cost risks"],
        "Cannibalisation · incremental profit")

CASES.append(elm())

# ---------------------------------------------------------------- Velisse Skin (medium)
def lumiskin():
    custs = 280.0                     # k
    bottle_p, bottle_c = 48.0, 18.0
    refill_p, refill_c = 40.0, 11.0
    ph = 0.35                         # pharmacy keeps 35% of retail
    keep = 1 - ph
    bm, rm = bottle_p * keep - bottle_c, refill_p * keep - refill_c
    adopt, freq0, freq1 = 0.22, 3.0, 3.4
    sw = custs * adopt
    gain = freq1 * rm - freq0 * bm
    a_sw = sw * gain / 1000           # $M
    new, new_bottles, new_refills = 32.0, 1, 2.4
    a_new = new * (new_bottles * bm + new_refills * rm) / 1000
    fixed = 1.35
    net = a_sw + a_new - fixed
    ph_b, ph_r = bottle_p * ph, refill_p * ph
    # matching the pharmacy's bottle earnings on refills
    ph_match = ph_b / refill_p
    rm2 = refill_p * (1 - ph_match) - refill_c
    gain2 = freq1 * rm2 - freq0 * bm
    net2 = sw * gain2 / 1000 + new * (new_bottles * bm + new_refills * rm2) / 1000 - fixed
    assert abs(bm - 13.2) < 1e-9 and abs(rm - 15.0) < 1e-9 and rm > bm
    assert abs(net - 0.93) < 0.005 and 0 < net2 < 0.2
    return C(
        "Velisse Skin", "A refill pouch: greener, but will it eat our bottle sales?",
        "Product launch", "Beauty and personal care", "France", 2,
        """Velisse Skin sells a premium face serum in French pharmacies at $48 a bottle. It plans to launch a refill pouch at $40 that customers pour into their existing bottle.
        The sales team worries that refills will cannibalise bottle sales. The CEO asks for the full economics.""",
        [("Costs?", "A bottle costs $18 to make, including $7 of glass and pump. A refill pouch costs $11."),
         ("Channel?", f"Pharmacies keep about {pct(ph)} of the retail price, on bottles and refills alike."),
         ("Customers?", "280,000 regular customers buying about 3 bottles a year."),
         ("Research?", "22% of customers would switch to refills; they'd buy slightly more often (3.4 times a year) because refills are cheaper. 32,000 new, sustainability-minded customers would join."),
         ("Launch costs?", "$1.35M a year for refill displays and marketing.")],
        ("Is the refill worth launching?", [
            ("Switchers", ["Margin per refill vs per bottle", "Purchase frequency"]),
            ("New customers", ["Number, purchases per year"]),
            ("Channel", ["Pharmacy earnings on refills vs bottles"]),
            ("Costs", ["Displays and marketing"]),
        ]),
        "Refills sell for less but cost much less to make, so Velisse Skin's margin per sale may be similar. If that's true, cannibalisation is not the real risk.",
        [
            Q("Compare Velisse Skin's margin on a bottle and a refill. What happens to a customer who switches?",
              f"""<p>Velisse Skin receives {pct(keep)} of the retail price; the pharmacy keeps {pct(ph)}.</p>
              <p>Bottle: ${bottle_p:.0f} × {pct(keep)} = ${bottle_p*keep:.2f} − ${bottle_c:.0f} = <b>${bm:.2f}</b>. Refill: ${refill_p:.0f} × {pct(keep)} = ${refill_p*keep:.2f} − ${refill_c:.0f} = <b>${rm:.2f}</b>. A refill earns Velisse Skin more than a bottle.</p>
              <p>A switcher's annual margin: {freq1} × ${rm:.2f} = ${freq1*rm:.2f} vs {freq0:.0f} × ${bm:.2f} = ${freq0*bm:.2f} before: <b>{signed(gain, 2, '$')}</b> each.</p>
              <p><b>So-what:</b> cannibalisation doesn't hurt here; switching customers are worth more.</p>""",
              BAR(["Bottle", "Refill"], {"Retail price ($)": [bottle_p, refill_p], "Velisse Skin margin after pharmacy share ($)": [bm, rm]}, title="Exhibit 1 · Retail price and Velisse Skin's margin per unit ($)", fmt="{:.1f}", ylabel="$", h=2.3)),
            Q("Calculate the total annual impact.",
              f"""<p>Switchers: {num(sw, 1)}k × ${gain:.2f} = ${a_sw:.2f}M.</p>
              <p>New customers: {new:.0f}k × (1 bottle × ${bm:.2f} + 2.4 refills × ${rm:.2f}) = ${a_new:.2f}M.</p>
              <p>Minus ${fixed}M of costs: <b>{signed(net, 2, '$', 'M')} a year</b>.</p>
              <p><b>So-what:</b> worthwhile, and most of the value comes from new customers, but the yearly costs eat most of the gross gain.</p>"""),
            Q("How might pharmacies react, and what would you do?",
              f"""<p>A pharmacy earns ${ph_b:.2f} on a bottle but ${ph_r:.2f} on a refill: they lose ${ph_b-ph_r:.2f} each time a customer switches, so they may not stock or promote refills.</p>
              <p>Matching their ${ph_b:.2f} on every refill needs a {pct(ph_match)} share. That cuts Velisse Skin's refill margin to ${rm2:.2f} and the total gain to about {signed(net2, 2, '$', 'M')} a year: almost nothing.</p>
              <ul><li>Raise the pharmacy's share on refills only partly, or tie it to refill volume</li><li>Refill-station displays that also bring traffic into the pharmacy</li>
              <li>Sell refills online too, but avoid undercutting pharmacies on price</li></ul>"""),
        ],
        f"""Launch the refill. After the pharmacy's {pct(ph)} share, Velisse Skin earns more on a refill (${rm:.2f}) than on a bottle (${bm:.2f}), so switching customers are worth more, and new customers add most of the value:
        about {signed(net, 2, '$', 'M')} a year after launch costs. The real risk is pharmacies, which earn ${ph_b-ph_r:.2f} less per refill. Raise their share on refills only partly (matching them fully would cut the gain to about ${net2:.1f}M), or tie it to refill volume.
        Next step: test refill stations in 50 pharmacies for three months.""",
        ["Works out the margin after the channel's share, not on retail price", "Shows cannibalisation is harmless here",
         "Quantifies the new-customer gain", "Spots the channel partner's incentive problem and prices the fix"],
        "Cannibalisation · channel incentives")

CASES.append(lumiskin())

# ---------------------------------------------------------------- Kinloch Workspace (medium-hard)
def kinfield():
    members, fee = 900, 600.0             # $ per month
    light_share, light_days = 0.25, 7    # members who come ≤ 8 days a month
    dp, dp_cost = 45.0, 8.0
    outsiders_day, wdays = 40, 22
    light = members * light_share
    # Option A: open day passes, all light members switch
    out_a = outsiders_day * wdays * (dp - dp_cost)
    cann_a = light * (fee - light_days * dp)          # revenue lost (member variable cost ignored)
    net_a = out_a - cann_a
    # Option B: passes only Mon & Fri at $60, 15% of light members switch
    dp_b, days_b, out_day_b, sw_b = 60.0, 9, 30, 0.15
    out_b = out_day_b * days_b * (dp_b - dp_cost)
    cann_b = light * sw_b * (fee - light_days * dp_b)
    net_b = out_b - cann_b
    assert net_a < 0 < net_b
    return C(
        "Kinloch Workspace", "Day passes could fill empty desks, or empty the membership",
        "Product launch", "Flexible offices", "Singapore", 3,
        """Kinloch runs three coworking spaces in Singapore with 900 monthly members paying $600 for a desk. Desks are often empty on Mondays and Fridays. The team wants to sell
        day passes at $45 to fill them. The CEO asks whether that's a good idea.""",
        [("Who are the members?", "Freelancers and small teams. 25% come in 8 days a month or fewer: about 7 days on average."),
         ("Day-pass demand?", "About 40 passes a day from people who aren't members, on any weekday."),
         ("Cost of a day visitor?", "About $8 (coffee, cleaning, admin)."),
         ("Objective?", "More monthly profit, without weakening the membership base.")],
        ("Will day passes increase profit?", [
            ("New revenue", ["Day passes from non-members", "Margin per pass"]),
            ("Cannibalisation", ["Light members who'd switch to passes", "What they pay now vs with passes"]),
            ("Design", ["Which days", "Price", "Limits"]),
        ]),
        "Day passes look like pure upside, but a member who comes 7 days a month would pay $315 in passes instead of $600. If light members switch, the scheme could lose money.",
        [
            Q("Calculate the monthly impact of open day passes at $45, if all light members switch.",
              f"""<p>New revenue: {outsiders_day} passes × {wdays} days × ($45 − $8) = <b>${num(out_a)}</b> a month.</p>
              <p>Light members: {num(light)}. Each would pay {light_days} × $45 = ${light_days*dp:.0f} instead of $600: ${fee-light_days*dp:.0f} less.
              Loss: {num(light)} × ${fee-light_days*dp:.0f} = <b>${num(cann_a)}</b>.</p>
              <p>Net: <b>{signed(net_a, 0, '$')} a month</b>.</p>
              <p><b>So-what:</b> as designed, day passes lose money. The problem isn't the passes, it's that they're a cheaper substitute for membership.</p>"""),
            Q(f"Alternative: day passes only on Mondays and Fridays (about {days_b} days a month), at $60. Kinloch expects {out_day_b} passes on those days and only {pct(sw_b)} of light members to switch. Recalculate.",
              f"""<p>New revenue: {out_day_b} × {days_b} × ($60 − $8) = ${num(out_b)}.</p>
              <p>Cannibalisation: {light*sw_b:.2f} members (on average) × ($600 − {light_days} × $60) = ${num(cann_b)}.</p>
              <p>Net: <b>{signed(net_b, 0, '$')} a month</b>.</p>
              <p><b>So-what:</b> fencing passes by day and price turns a loss into a gain: members who come midweek can't switch, and $60 makes switching less attractive.</p>""",
              T(["", "Open passes, $45", "Mon/Fri only, $60"], [["Contribution from non-members, after $8 a visit ($/month)", num(out_a), num(out_b)], ["Lost membership revenue ($/month)", num(-cann_a), num(-cann_b)],
                 ["Net impact ($/month)", signed(net_a, 0), signed(net_b, 0)]], title="Exhibit 1 · Day-pass options compared", bold_last=True)),
            Q("What else would protect the membership base?",
              """<ul><li>A <b>part-time membership</b> offered only to light members who try to cancel (e.g. 8 days a month for about $500). Offered to everyone, each light member who downgrades from $600 costs $100 a month</li><li>Members-only perks: meeting-room credits, events, mail handling</li>
              <li>A <b>monthly cap</b> on day passes per person</li><li>Use day passes as a trial: credit the first pass against a membership</li></ul>"""),
        ],
        f"""Don't launch open day passes: they'd lose about ${num(-net_a)} a month because light members would switch from $600 memberships to cheaper passes. Instead, sell passes only on
        Mondays and Fridays at $60, which adds about ${num(net_b)} a month, and offer a part-time membership only to light members who try to cancel, since a general downgrade to a cheaper plan would cost more than the passes earn. Risk: the switching estimate is uncertain, so track
        membership cancellations weekly. Next step: pilot at one site for two months.""",
        ["Sees the substitution risk before calculating", "Calculates the loss per switching member",
         "Designs fences (day, price) to protect the core product", "Offers a product that keeps light users as members"],
        "Cannibalisation · price fences · product design", fmt="Candidate-led")

CASES.append(kinfield())

# ---------------------------------------------------------------- Horizon Language (medium, AI costs)
def horizon():
    base = 500.0                                   # k subscribers
    p0, c0, ai = 10.0, 1.0, 4.5                    # $ per month: price, base cost, AI cost per typical user
    p1 = 20.0
    c1 = c0 + ai
    up, new = 0.17, 90.0
    upg = base * up
    gain = (p1 - c1) - (p0 - c0)
    a_up = upg * gain * 12 / 1000                  # k subs × $/month × 12 → $M
    a_new = new * (p1 - c1) * 12 / 1000
    fixed = 3.0                                    # $M a year (AI team, content)
    net = a_up + a_new - fixed
    heavy, mult = 0.10, 5
    heavy_total = c0 + mult * ai
    assert heavy_total > p1
    true_ai = (1 - heavy) * ai + heavy * mult * ai
    drop = (true_ai - ai) * (upg + new) * 12 / 1000
    assert net - drop > 0 and a_new > a_up
    return C(
        "Horizon Language", "An AI speaking coach: good product, risky costs",
        "Product launch", "Consumer software", "United States", 2,
        f"""Horizon is a language-learning app with 500,000 subscribers paying ${p0:.0f} a month. It wants to launch an AI speaking coach (voice conversations with
        instant feedback) as a new tier at ${p1:.0f} a month. AI costs are high and uncertain. The CEO asks whether the tier will make money.""",
        [("Cost per subscriber?", f"${c0:.2f} a month today. The AI coach adds about ${ai:.2f} of AI processing per user per month, so ${c1:.2f} in total."),
         ("Forecast?", "17% of subscribers upgrade; 90,000 new subscribers join for the AI tier."),
         ("Fixed costs?", f"${fixed:.0f}M a year for the AI team and content."),
         ("Usage?", "Early tests show 10% of users talk to the coach five times as much as the others.")],
        ("Will the AI tier make money?", [
            ("Upgraders", ["Number", "Extra margin per month"]),
            ("New subscribers", ["Number", "Margin per month"]),
            ("AI costs", ["Average cost per user", "Heavy users"]),
            ("Fixed costs", ["AI team, content"]),
        ]),
        "The tier likely pays on average, but AI cost scales with usage. Heavy users on a flat fee could wipe out the margin, so I'd look at the cost distribution, not just the average.",
        [
            Q("Calculate the annual profit impact, using $4.50 of AI cost for every AI user.",
              f"""<p>Upgraders: {num(upg)}k, each gaining (${p1:.2f} − ${c1:.2f}) − (${p0:.2f} − ${c0:.2f}) = ${gain:.2f} a month: {num(upg)}k × ${gain:.2f} × 12 = ${a_up:.2f}M a year.</p>
              <p>New: {new:.0f}k × ${p1-c1:.2f} × 12 = ${a_new:.2f}M.</p>
              <p>Minus ${fixed:.0f}M fixed: <b>${net:.1f}M a year</b>.</p>
              <p><b>So-what:</b> new subscribers drive most of the value; upgraders add less because they already paid ${p0:.0f}.</p>"""),
            Q(f"Now account for heavy users: {pct(heavy)} of AI users use five times the AI processing of the rest. The $4.50 was measured on typical users. What happens?",
              f"""<p>A heavy user's total cost: ${c0:.2f} + 5 × ${ai:.2f} = ${heavy_total:.2f} a month, above the ${p1:.0f} price: <b>each loses ${heavy_total-p1:.2f} a month</b>.</p>
              <p>The ${ai:.2f} was measured on typical users, so the true average AI cost = 90% × ${ai:.2f} + 10% × ${mult*ai:.2f} = <b>${true_ai:.2f}</b>. Across {num(upg+new)}k AI users,
              annual profit falls by about ${drop:.1f}M, to ${net-drop:.1f}M.</p>
              <p><b>So-what:</b> still profitable, but heavy users must be managed.</p>""",
              note=f"A good candidate asks how the ${ai:.2f} average was measured before using it."),
            Q("How would you design the tier to control AI costs?",
              """<ul><li><b>Monthly minute allowance</b> (e.g. 300 minutes), with a top-up pack beyond it</li><li><b>Cheaper AI models</b> for simple drills; the best model for open conversation</li>
              <li><b>Annual plan</b> at a discount to lock in revenue</li><li>Monitor cost per user weekly during the first three months</li></ul>"""),
        ],
        f"""Launch the AI tier with a usage allowance. On average costs it adds about ${net:.1f}M a year, mostly from new subscribers, but a heavy user costs ${heavy_total:.2f} a month against the ${p1:.0f} price, and heavy users cut profit to about ${net-drop:.1f}M.
        I recommend a monthly minute allowance with paid top-ups and cheaper AI models for simple exercises. Risk: AI costs and engagement in the first months differ from tests.
        Next step: launch to 10% of users and measure cost per user weekly.""",
        ["Separates upgraders from new subscribers", "Questions the average AI cost",
         "Spots the flat-fee risk from heavy users", "Designs pricing to cap cost exposure"],
        "Cannibalisation · variable AI costs · pricing design")

CASES.append(horizon())
