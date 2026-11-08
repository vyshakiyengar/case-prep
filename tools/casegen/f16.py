"""Energy investments and NPV. Concepts from CaseCraft #076-#080; rewritten with explicit discounting."""
from lib import *
CASES = []

def af(rate, n): return (1 - (1 + rate) ** -n) / rate     # present value of $1 a year for n years

# ---------------------------------------------------------------- Vega Logistics rooftop solar (medium): own it or sign a PPA?
def vega():
    mwh, self_use, grid, export, om = 1800.0, 0.70, 120.0, 40.0, 20.0
    capex, life, rate = 1500.0, 25, 0.08
    A = af(rate, life)
    benefit = mwh * (self_use * grid + (1 - self_use) * export) / 1000 - om     # $k a year
    npv_own = -capex + benefit * A
    pb = capex / benefit
    self2 = 0.85
    benefit2 = mwh * (self2 * grid + (1 - self2) * export) / 1000 - om
    npv_own2 = -capex + benefit2 * A
    ppa = 90.0
    ppa_save = mwh * self_use * (grid - ppa) / 1000
    npv_ppa = ppa_save * A
    assert 0 < npv_own < npv_ppa and npv_own2 < npv_ppa
    return C(
        "Vega Logistics", "Solar on the warehouse roof: buy the panels or buy the power?",
        "Investment decision", "Energy", "United States", 2,
        """Vega runs a large distribution warehouse in Arizona. It can put solar panels on the roof for $1.5M, or let a solar developer install them for free and buy the power under a 25-year
        contract (a power purchase agreement, PPA). The CFO asks which is better, using Vega's 8% cost of capital.""",
        [("Output?", "About 1,800 MWh a year for 25 years."),
         ("How much would Vega use itself?", "About 70%; the rest would be exported to the grid when the warehouse is quiet."),
         ("Prices?", "Vega pays $120 per MWh for grid power. Exported power earns $40 per MWh. Maintenance costs about $20k a year if Vega owns the panels."),
         ("PPA?", "The developer would sell Vega the power it uses at $90 per MWh, and keep any exports.")],
        ("Should Vega own the panels or sign a PPA?", [
            ("Owning", ["Upfront cost", "Yearly savings and export income", "Maintenance", "NPV over 25 years"]),
            ("PPA", ["Saving vs grid price", "No upfront cost"]),
            ("Other factors", ["Use of capital", "Risk of the roof or the business changing"]),
        ]),
        "Owning gives the full saving but ties up capital; a PPA gives a smaller saving with no investment. At an 8% cost of capital, the PPA could well win.",
        [
            Q("What is owning worth, in NPV and payback?",
              f"""<p>Yearly benefit: 1,800 × (70% × $120 + 30% × $40) − $20k = <b>${benefit:.1f}k</b>.</p>
              <p>25 years at 8% discount factor: {A:.2f}. NPV = −$1,500k + ${benefit:.1f}k × {A:.2f} = <b>${npv_own:.0f}k</b>. Payback: {pb:.1f} years.</p>""",
              note="Present value of $1 a year for 25 years at 8% = 10.67."),
            Q("What is the PPA worth?",
              f"""<p>Vega saves $120 − $90 = $30 on each MWh it uses: 1,800 × 70% × $30 = ${ppa_save:.1f}k a year, with no investment.</p>
              <p>NPV: ${ppa_save:.1f}k × {A:.2f} = <b>${npv_ppa:.0f}k</b>, about {npv_ppa/npv_own:.0f}× the NPV of owning.</p>""",
              BAR(["Own the panels", "Own, using 85% on site", "PPA"], [r(npv_own, 0), r(npv_own2, 0), r(npv_ppa, 0)], title="Exhibit 1 · NPV at 8% ($k)", ylabel="$k", h=2.3, highlight=[2])),
            Q("Owning only just pays. Why, and what could change that?",
              f"""<p>Thirty percent of the power is exported at $40, a third of the grid price, and Vega's 8% cost of capital is high for a 25-year asset.
              If Vega charged its electric forklifts in daytime and used 85% on site, owning would be worth ${npv_own2:.0f}k, still below the PPA.</p>
              <p>The developer can own panels more cheaply because its cost of capital is lower. Vega's capital is better spent on its core business.</p>"""),
        ],
        f"""Sign the PPA. Owning the panels has an NPV of only about ${npv_own:.0f}k at Vega's 8% cost of capital, because 30% of the power is exported cheaply, while the PPA saves about ${ppa_save:.0f}k a year with no investment,
        an NPV of about ${npv_ppa:.0f}k. Even using 85% of the power on site, owning stays behind. Negotiate the PPA price, a price-escalation cap and what happens if Vega leaves the building.
        Next step: get two more developer quotes.""",
        ["Values both options with the same discount rate and life", "Values export and self-used power differently",
         "Sees how cost of capital favours the PPA", "Checks whether more self-use changes the answer"],
        "NPV · own vs lease · energy economics")

CASES.append(vega())

# ---------------------------------------------------------------- Northwind Hotels heat pumps (medium): marginal decision, grant swings it
def northwind():
    hp, boiler = 400.0, 120.0                       # $k per hotel
    inc = hp - boiler
    gas, carbon, elec = 60.0, 8.0, 38.0             # $k a year per hotel
    life, rate = 15, 0.07
    A = af(rate, life)
    save = gas + carbon - elec
    npv = -inc + save * A
    grant = 0.20 * hp
    npv_g = npv + grant
    carbon2 = 16.0
    npv_c2 = -inc + (gas + carbon2 - elec) * A
    hotels = 20
    assert -30 < npv < 0 and npv_g > 0 and npv_c2 > 0
    return C(
        "Northwind Hotels", "Replace the old boilers with heat pumps?",
        "Investment decision", "Hospitality", "Canada", 2,
        """Northwind owns 20 mid-size hotels in Ontario. Their gas boilers are reaching the end of their lives. The sustainability lead wants to replace them with electric heat pumps instead of new boilers.
        The CFO asks whether the extra cost pays off, using a 7% discount rate over a 15-year life.""",
        [("Costs per hotel?", "Heat pump system: $400k. A new gas boiler system: $120k."),
         ("Running costs per hotel?", "Gas: about $60k a year, plus about $8k of carbon charges. A heat pump would use about $38k of electricity a year. Maintenance is similar."),
         ("Support?", "A provincial programme may cover 20% of heat-pump costs; the application takes three months."),
         ("Carbon charges?", "About $8k a year today. They could double to about $16k a year from next year, but that isn't certain.")],
        ("Should Northwind install heat pumps instead of new boilers?", [
            ("Extra upfront cost", ["Heat pump vs boiler"]),
            ("Yearly savings", ["Gas", "Carbon charges", "Minus electricity"]),
            ("NPV", ["15 years at 7%"]),
            ("What changes the answer", ["Grant", "Carbon price", "Energy prices"]),
        ]),
        "The right comparison is heat pump vs new boiler, since the boilers must be replaced anyway. The savings look close to the extra cost, so the grant and carbon charges may decide it.",
        [
            Q("Compare the heat pump with a new boiler for one hotel.",
              f"""<p>Extra cost: $400k − $120k = <b>${inc:.0f}k</b>. Yearly saving: $60k + $8k − $38k = <b>${save:.0f}k</b>.</p>
              <p>Discount factor for 15 years at 7%: {A:.2f}. NPV = −${inc:.0f}k + ${save:.0f}k × {A:.2f} = <b>{signed(npv, 0, '$', 'k')}</b>. Roughly break-even.</p>""",
              note="Comparing with 'do nothing' would be wrong: the boilers must be replaced anyway."),
            Q("How do the grant and higher carbon charges change it?",
              f"""<p><b>Grant</b> (20% of $400k = ${grant:.0f}k): NPV <b>{signed(npv_g, 0, '$', 'k')}</b> per hotel.</p>
              <p><b>Carbon charges doubling</b> to $16k from next year (no grant): NPV {signed(npv_c2, 0, '$', 'k')}.</p>
              <p>Across 20 hotels with the grant: about {signed(npv_g*hotels/1000, 1, '$', 'M')}.</p>""",
              T(["Scenario (per hotel)", "NPV ($k)"], [["Base case", signed(npv, 0)], ["With 20% grant", signed(npv_g, 0)], ["Carbon charges double to $16k from next year, no grant", signed(npv_c2, 0)]],
                title="Exhibit 1 · NPV of heat pump vs new boiler")),
            Q("What would you recommend, and what are the risks?",
              """<ul><li>Apply for the grant now and replace boilers hotel by hotel as they fail, starting with the oldest</li>
              <li>Keep gas back-up in the coldest hotels for extreme cold snaps</li><li>Risks: electricity prices rising faster than gas; installation disruption to guests (do it off-season)</li></ul>"""),
        ],
        f"""Install heat pumps, with the provincial grant. Compared with new gas boilers, a heat pump costs ${inc:.0f}k more per hotel and saves about ${save:.0f}k a year, which is roughly break-even over 15 years at 7% ({signed(npv, 0, '$', 'k')}).
        The 20% grant makes it clearly positive (about {signed(npv_g, 0, '$', 'k')} per hotel, {signed(npv_g*hotels/1000, 1, '$', 'M')} across 20), and rising carbon charges would add more. Replace boilers as they reach end of life,
        oldest first, and install in the off-season. Risk: electricity prices. Next step: submit the grant application.""",
        ["Compares against the real alternative (new boiler), not doing nothing", "Discounts savings over the asset's life",
         "Tests the grant and carbon price", "Phases the rollout with the replacement cycle"],
        "NPV · incremental analysis · sensitivity")

CASES.append(northwind())

# ---------------------------------------------------------------- Fenland Biogas (medium-hard): feedstock risk
def fenland():
    capex, life, rate = 15.0, 20, 0.08            # $M
    A = af(rate, life)
    elec, gate, digest, opex = 1.6, 1.2, 0.2, 1.3  # $M a year
    cf = elec + gate + digest - opex
    npv = -capex + cf * A
    cf_low = cf - gate * 0.5
    npv_low = -capex + cf_low * A
    be_gate = (capex / A - (elec + digest - opex)) / gate
    assert npv > 0 and npv_low < 0 and 0.5 < be_gate < 1 and abs(gate / (elec + gate + digest) - 0.4) < 1e-9
    return C(
        "Fenland Biogas", "A digester that runs on other people's waste",
        "Investment decision", "Energy", "United Kingdom", 2,
        """A farming co-operative in eastern England wants to build a $15M anaerobic digester, which turns food waste and manure into biogas for electricity. It would earn money from three sources:
        selling electricity, charging food companies to take their waste (gate fees), and selling the leftover material as fertiliser. The co-op's chair asks whether it's a sound investment.""",
        [("Yearly income?", "Electricity about $1.6M; gate fees about $1.2M; fertiliser about $0.2M."),
         ("Running costs?", "About $1.3M a year for staff, maintenance and transport."),
         ("Life and discount rate?", "20 years; the co-op's lender uses 8%."),
         ("Gate fees?", "Three new digesters are planned within 30 miles. Gate fees elsewhere fell by about half when new digesters opened nearby. No long-term waste contracts are signed yet.")],
        ("Should the co-op build the digester?", [
            ("Income", ["Electricity", "Gate fees", "Fertiliser"]),
            ("Costs", ["Build", "Running"]),
            ("NPV and risk", ["Base case", "If gate fees fall"]),
            ("Protection", ["Long-term waste contracts"]),
        ]),
        "Gate fees are a large share of income and could fall as competitors open. I'd test the NPV if they halve.",
        [
            Q("What is the NPV in the base case?",
              f"""<p>Yearly cash flow: $1.6M + $1.2M + $0.2M − $1.3M = <b>${cf:.1f}M</b>. Discount factor (20 years, 8%): {A:.2f}.</p>
              <p>NPV = −$15M + ${cf:.1f}M × {A:.2f} = <b>{signed(npv, 1, '$', 'M')}</b>.</p>"""),
            Q("What if gate fees halve as new digesters open?",
              f"""<p>Cash flow falls to ${cf_low:.1f}M a year. NPV = −$15M + ${cf_low:.1f}M × {A:.2f} = <b>{signed(npv_low, 1, '$', 'M')}</b>.</p>
              <p>Break-even: gate fees can fall to about {pct(be_gate)} of today's level before the project stops paying.</p>
              <p><b>So-what:</b> the project's value depends on gate fees, which are not contracted and face new competition.</p>""",
              BAR(["Base case", "Gate fees halve"], [r(npv, 1), r(npv_low, 1)], title="Exhibit 1 · NPV ($M)", ylabel="$M", fmt="{:.1f}", h=2.2, highlight=[1])),
            Q("What would you need before saying yes?",
              f"""<ul><li><b>Long-term waste contracts</b> (10+ years) for most of the gate-fee income, at fees above {pct(be_gate)} of today's</li>
              <li>Use more of the co-op's own manure and crop waste, so less depends on outside food waste</li>
              <li>A fixed electricity price contract if available</li></ul>"""),
        ],
        f"""Build the digester only once most of its waste is under long-term contract. The base case NPV is about {signed(npv, 1, '$', 'M')}, but gate fees are 40% of income, uncontracted, and likely to fall as three new
        digesters open nearby; if they halve, the NPV becomes {signed(npv_low, 1, '$', 'M')}. The project breaks even if gate fees stay above about {pct(be_gate)} of today's level. Sign 10-year waste contracts and
        use more of the co-op's own manure before committing. Next step: approach the three largest food processors.""",
        ["Computes NPV with the lender's rate", "Identifies the riskiest income stream",
         "Finds the break-even gate fee", "Makes the decision conditional on contracts"],
        "NPV · sensitivity · revenue risk")

CASES.append(fenland())

# ---------------------------------------------------------------- Arbor Wind (hard): merchant vs PPA
def arbor():
    mw, cf_, hours = 100.0, 0.35, 8760
    mwh = mw * cf_ * hours / 1e6                      # TWh -> use M MWh
    capex, opex = 110.0, 4.0                          # $M, net of federal tax credits
    life = 25
    merch_p, ppa_p = 55.0, 48.0
    r_m, r_p = 0.09, 0.065
    A_m, A_p = af(r_m, life), af(r_p, life)
    cf_m = mwh * merch_p - opex
    cf_p = mwh * ppa_p - opex
    npv_m = -capex + cf_m * A_m
    npv_p = -capex + cf_p * A_p
    low = 40.0
    npv_m_low = -capex + (mwh * low - opex) * A_m
    assert npv_p > npv_m and npv_m_low < 0 < npv_p
    return C(
        "Arbor Wind", "Sell the power at market prices, or lock in a lower price?",
        "Investment decision", "Energy", "United States", 3,
        """Arbor is developing a 100 MW wind farm in Texas, costing about $110M after federal tax credits. It can sell its power on the wholesale market at whatever the price is, or sign a 25-year power purchase agreement (PPA)
        with a technology company at a fixed $48 per MWh. Market forecasts average about $55. The investment committee asks which route to take.""",
        [("Output?", "Wind farms here run at about 35% of full capacity over a year (capacity factor)."),
         ("Costs?", "About $4M a year to operate and maintain."),
         ("Discount rates?", "Investors want about 9% for projects selling at market prices, and about 6.5% for projects with a fixed-price contract, because the income is more certain."),
         ("Market risk?", "In a scenario with lots of new solar, average prices could fall to about $40."),
         ("Project life?", "About 25 years, the same as the PPA term.")],
        ("Should Arbor sign the PPA or sell at market prices?", [
            ("Output", ["MW × capacity factor × hours"]),
            ("Merchant route", ["Expected price", "Higher risk, higher discount rate"]),
            ("PPA route", ["Fixed price", "Lower risk, lower discount rate"]),
            ("Downside", ["Market prices fall"]),
        ]),
        "The market route earns more per MWh on average, but the income is riskier, so investors discount it more. The fixed price may be worth more once risk is priced in.",
        [
            Q("How much power will the farm produce a year?",
              f"""<p>100 MW × 35% × 8,760 hours = <b>{mwh*1e6:,.0f} MWh</b> ({mwh:.3f}M MWh).</p>"""),
            Q("Compare the NPV of the two routes.",
              f"""<p><b>Market:</b> {mwh:.3f}M MWh × $55 − $4M = ${cf_m:.1f}M a year; 25 years at 9% (factor {A_m:.2f}): NPV = −$110M + ${cf_m:.1f}M × {A_m:.2f} = <b>{signed(npv_m, 1, '$', 'M')}</b>.</p>
              <p><b>PPA:</b> {mwh:.3f}M × $48 − $4M = ${cf_p:.1f}M a year; at 6.5% (factor {A_p:.2f}): NPV = <b>{signed(npv_p, 1, '$', 'M')}</b>.</p>
              <p><b>So-what:</b> the PPA earns less each year but is worth more, because certain income is discounted less.</p>""",
              T(["", "Market prices", "PPA"], [["Price ($/MWh)", f"{merch_p:.0f}", f"{ppa_p:.0f}"], ["Yearly cash flow ($M)", f"{cf_m:.1f}", f"{cf_p:.1f}"],
                 ["Discount rate", pct(r_m, 1), pct(r_p, 1)], ["NPV ($M)", signed(npv_m, 1), signed(npv_p, 1)]], title="Exhibit 1 · Two routes to market")),
            Q("What happens to the market route if prices average $40?",
              f"""<p>Cash flow: {mwh:.3f}M × $40 − $4M = ${mwh*low-opex:.1f}M; NPV = <b>{signed(npv_m_low, 1, '$', 'M')}</b>. The project would lose money. The PPA is unaffected.</p>"""),
            Q("Any reason to keep some market exposure?",
              """<p>Yes: a PPA for most of the output (say 70–80%) secures financing, while selling the rest at market prices keeps some upside if prices rise. Also check the buyer's credit quality,
              since a 25-year PPA is only as good as the company paying it.</p>"""),
        ],
        f"""Sign the PPA, at least for most of the output. Although $48 is below the expected $55 market price, the fixed price makes the income far more certain: its NPV is about {signed(npv_p, 1, '$', 'M')} at 6.5%,
        against {signed(npv_m, 1, '$', 'M')} for selling at market prices at 9%, and the market route loses money if prices average $40. Consider keeping 20–30% of output on the market for upside.
        Risk: the buyer's credit over 25 years. Next step: credit check on the buyer and negotiate an inflation clause.""",
        ["Computes output from capacity and capacity factor", "Uses different discount rates for different risks",
         "Shows a lower price can be worth more", "Stress-tests the market route"],
        "NPV · risk and discount rates · contracting")

CASES.append(arbor())
