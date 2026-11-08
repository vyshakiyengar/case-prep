"""Logistics and supply chain. Concepts from CaseCraft #081-#085; rewritten from scratch."""
from lib import *
import math
CASES = []

# ---------------------------------------------------------------- CraneParcel (easy-medium): failed deliveries
def craneparcel():
    parcels, fail0, redo = 30.0, 0.12, 6.0                  # M parcels
    cost0 = parcels * fail0 * redo
    fail_w, sms = 0.07, 0.05
    save_w = parcels * (fail0 - fail_w) * redo - parcels * sms
    lockers, l_capex, l_run = 1500, 8.0, 1.2                # $k each
    share, fail_l, cheaper = 0.08, 0.01, 1.2
    save_l = parcels * share * ((fail0 - fail_l) * redo + cheaper) - lockers * l_run / 1000
    capex_l = lockers * l_capex / 1000
    # after windows are live, a locker parcel only avoids failures from 7% down to 1%
    save_l2 = parcels * share * ((fail_w - fail_l) * redo + cheaper) - lockers * l_run / 1000
    assert save_w > 2 * save_l > 0 and 3 < capex_l / save_l < 6 and 1.8 < save_l2 < 2.0
    return C(
        "CraneParcel", "One parcel in eight needs a second trip",
        "Cost & operations", "Parcel delivery", "United States", 1,
        """CraneParcel delivers 30 million parcels a year for online retailers in the Northeast. About 12% of first delivery attempts fail because nobody is home, and each redelivery costs about $6.
        The operations director has two ideas: text customers a one-hour delivery window, or install parcel lockers. Which should come first?""",
        [("Delivery windows?", "Customers get a text with a one-hour window and can redirect the parcel. In a trial, failures fell to 7%. Texts and tracking cost about $0.05 a parcel."),
         ("Lockers?", "1,500 lockers at $8k each to install and $1.2k a year to run. About 8% of parcels would go to lockers. Only 1% of locker deliveries fail, and dropping many parcels at one locker saves about $1.20 a parcel."),
         ("Can both be done?", "Yes; budget is the constraint this year.")],
        ("How should CraneParcel cut failed deliveries?", [
            ("Size of the problem", ["Failures × redelivery cost"]),
            ("Delivery windows", ["Failures avoided", "Cost per parcel"]),
            ("Lockers", ["Failures avoided", "Cheaper drops", "Investment"]),
        ]),
        "Windows apply to every parcel at almost no cost, so they probably save the most quickly. Lockers need investment and only reach a small share of parcels.",
        [
            Q("How much do failed deliveries cost today?",
              f"""<p>30M × 12% = 3.6M redeliveries × $6 = <b>${cost0:.1f}M a year</b>.</p>"""),
            Q("Compare the two ideas.",
              f"""<p><b>Windows:</b> failures fall 5 points: 30M × 5% × $6 = $9.0M, less 30M × $0.05 = $1.5M: <b>${save_w:.1f}M a year</b>, no investment.</p>
              <p><b>Lockers:</b> 8% of parcels = 2.4M; each avoids 11 points of failures (× $6 = $0.66) and saves $1.20 = $1.86 per parcel: $4.46M, less $1.8M running: <b>${save_l:.1f}M a year</b>, for ${capex_l:.0f}M upfront (payback {capex_l/save_l:.1f} years).</p>""",
              BAR(["Delivery windows", "Lockers"], [r(save_w, 1), r(save_l, 1)], title="Exhibit 1 · Yearly saving ($M)", ylabel="$M", fmt="{:.1f}", h=2.2, highlight=[0])),
            Q("What would you do?",
              f"""<p>Launch delivery windows across the network now: bigger saving, no investment. Then add lockers in dense areas with the highest failure rates (apartment blocks, offices),
              where they fill fastest and pay back soonest.</p>
              <p>Careful: the two savings overlap. Once windows have cut failures to 7%, each locker parcel avoids only 6 points of failure, not 11: 2.4M × (6% × $6 + $1.20) − $1.8M ≈ <b>${save_l2:.1f}M a year</b>, a payback of about {capex_l/save_l2:.0f} years. So put lockers only where failure rates stay high after windows.</p>"""),
        ],
        f"""Start with one-hour delivery windows: they cut failures from 12% to about 7% across all 30 million parcels and save about ${save_w:.1f}M a year with no investment. Then roll out lockers in the densest,
        highest-failure areas: once windows are live, 1,500 lockers would save about ${save_l2:.1f}M a year (about ${save_l:.1f}M on their own) for ${capex_l:.0f}M upfront, paying back in about {capex_l/save_l2:.0f} years, so put them first where failures stay highest. Risk: customers ignoring texts. Next step: switch on windows region by region and track failures weekly.""",
        ["Sizes the problem first", "Compares savings and investment for each option",
         "Prioritises the option that reaches every parcel", "Targets lockers where they pay back fastest"],
        "Last-mile economics · option comparison")

CASES.append(craneparcel())

# ---------------------------------------------------------------- Coral Pharmacy (medium): consolidate warehouses
def coral():
    n0, safety0, hold = 4, 20.0, 0.25                 # $M safety stock, holding cost per year
    safety1 = safety0 / math.sqrt(n0)
    s_hold = (safety0 - safety1) * hold
    s_fixed = 3 * 1.5
    transport = 3.0
    net = s_hold + s_fixed - transport
    far = 0.15
    assert abs(safety1 - 10) < 1e-9 and net > 0
    return C(
        "Coral Pharmacy", "Four warehouses into one?",
        "Cost & operations", "Retail pharmacy", "Australia", 2,
        """Coral runs 600 pharmacies across eastern Australia, supplied from four regional warehouses. The supply chain director proposes closing three and serving every store from one large
        warehouse near Sydney. The CFO asks whether it would save money without hurting service.""",
        [("Stock?", "Each warehouse holds safety stock to cover unexpected demand: $20M in total across the four."),
         ("Holding cost?", "About 25% of stock value a year (capital, storage, expiry, insurance)."),
         ("Fixed costs?", "Each warehouse costs about $1.5M a year to run, beyond the work of handling goods."),
         ("Transport?", "Longer journeys from one site would add about $3M a year. About 15% of stores are more than 12 hours' drive from Sydney.")],
        ("Should Coral consolidate to one warehouse?", [
            ("Inventory", ["Safety stock needed in one place vs four"]),
            ("Fixed costs", ["Three warehouses closed"]),
            ("Transport", ["Longer distances"]),
            ("Service", ["Next-day delivery for distant stores"]),
        ]),
        "Pooling stock in one place needs less safety stock, because highs in one region offset lows in another. That saving, plus fewer sites, might outweigh extra transport, but distant stores could suffer.",
        [
            Q("How much safety stock would one warehouse need?",
              f"""<p>A common rule of thumb (the square-root law): if demand in each region is similar and independent, safety stock falls with the square root of the number of sites.
              Four sites into one: $20M ÷ √4 = <b>${safety1:.0f}M</b>.</p>
              <p>Saving: $10M × 25% = <b>${s_hold:.1f}M a year</b>.</p>""",
              note="Demand in different regions partly cancels out when pooled."),
            Q("What is the net saving?",
              f"""<p>Inventory ${s_hold:.1f}M + fixed costs of three warehouses (3 × $1.5M = ${s_fixed:.1f}M) = ${s_hold+s_fixed:.1f}M gross saving, less extra transport $3.0M = <b>${net:.1f}M a year</b>.</p>""",
              WF("Inventory saving", s_hold, [("Warehouses closed", s_fixed), ("Extra transport", -transport)], "Net saving", title="Exhibit 1 · Yearly effect ($M)", fmt="{:+,.1f}", base_fmt="{:,.1f}")),
            Q("What would worry you?",
              f"""<ul><li><b>Service:</b> the {pct(far)} of stores more than 12 hours away would lose next-day delivery; prescriptions can't wait. Keep a small cross-dock or use overnight carriers there.</li>
              <li><b>Resilience:</b> one site means one point of failure (fire, flood, strike)</li><li><b>Transition:</b> moving stock without gaps on shelves</li></ul>"""),
        ],
        f"""Consolidate, but keep a small hub for distant stores. One warehouse needs about half the safety stock (${safety1:.0f}M instead of $20M), saving about ${s_hold:.1f}M a year, and closing three sites saves ${s_fixed:.1f}M;
        after $3M of extra transport, the net saving is about ${net:.1f}M a year. The {pct(far)} of stores more than 12 hours from Sydney would lose next-day delivery, so serve them through a cross-dock or overnight carrier.
        Risk: one site is a single point of failure, so agree a backup site. Next step: model delivery times store by store.""",
        ["Applies risk pooling (square-root law) with its assumptions", "Nets inventory and fixed savings against transport",
         "Protects service for distant stores", "Raises resilience"],
        "Network design · risk pooling · trade-offs")

CASES.append(coral())

# ---------------------------------------------------------------- Vista Fresh (medium): air vs sea by product
def vista():
    price = 6.0                                       # $ per kg wholesale
    prods = {"Avocados": (2.5, 0.03, 0.15, 0.10), "Blueberries": (2.5, 0.03, 0.60, 0.10)}  # buy cost, air spoil, sea spoil, sea markdown
    air, sea = 3.20, 0.60
    res = {}
    for k, (buy, sp_a, sp_s, md) in prods.items():
        m_air = price - (buy + air) / (1 - sp_a)
        m_sea = price * (1 - md) - (buy + sea) / (1 - sp_s)
        res[k] = (m_air, m_sea)
    assert res["Avocados"][1] > res["Avocados"][0] and res["Blueberries"][0] > res["Blueberries"][1]
    rows = [[k, signed(a, 2), signed(s, 2)] for k, (a, s) in res.items()]
    return C(
        "Vista Fresh", "Fly it or ship it?",
        "Cost & operations", "Fresh produce", "United States", 2,
        """Vista imports fresh produce from Peru and sells it to US supermarkets. It flies everything today. Air freight prices have risen, and the CEO wants to switch everything to refrigerated sea containers,
        which are five times cheaper. The head of quality is worried. You're asked to settle it.""",
        [("Prices and costs?", "Vista sells at about $6 a kg and buys at about $2.50. Air freight costs $3.20 a kg; sea $0.60."),
         ("Journey time?", "Air: 2 days. Sea: about 18 days."),
         ("Spoilage?", "By air about 3% is lost. By sea about 15% of avocados (which ripen slowly) but about 60% of blueberries."),
         ("Shelf life?", "Sea-freighted fruit arrives with less shelf life; supermarkets pay about 10% less for it.")],
        ("Should Vista switch from air to sea freight?", [
            ("Cost per kg sold", ["Purchase + freight", "Divided by share that survives"]),
            ("Price received", ["Discount for shorter shelf life"]),
            ("By product", ["Robust vs fragile fruit"]),
        ]),
        "Sea is much cheaper per kg shipped, but what matters is cost per kg sold. For fragile fruit, spoilage could wipe out the saving.",
        [
            Q("Compare margin per kg sold for avocados by air and by sea.",
              f"""<p>Air: cost per kg sold = ($2.50 + $3.20) ÷ 97% = ${(2.5+air)/0.97:.2f}; margin $6.00 − ${(2.5+air)/0.97:.2f} = <b>${res['Avocados'][0]:.2f}</b>.</p>
              <p>Sea: ($2.50 + $0.60) ÷ 85% = ${(2.5+sea)/0.85:.2f}; price $5.40 after the shelf-life discount: margin <b>${res['Avocados'][1]:.2f}</b>.</p>
              <p>Sea is far better for avocados.</p>"""),
            Q("And blueberries?",
              f"""<p>Sea: ($2.50 + $0.60) ÷ 40% = ${(2.5+sea)/0.40:.2f} per kg sold, above the $5.40 price: margin <b>{signed(res['Blueberries'][1], 2, '$')}</b>. By air: <b>${res['Blueberries'][0]:.2f}</b>.</p>
              <p>Air margins are thin, but sea loses money. Blueberries must stay on air, and Vista should review their price.</p>""",
              T(["Margin per kg sold ($)", "Air", "Sea"], rows, title="Exhibit 1 · Margin per kg sold")),
            Q("What would you recommend?",
              """<ul><li><b>Split by product:</b> ship robust fruit (avocados, citrus) by sea; keep fragile fruit (berries) on air</li>
              <li>For berries: renegotiate air rates with volume commitments, or raise prices; margins by air are too thin</li>
              <li>Test controlled-atmosphere containers, which may cut sea spoilage further</li></ul>"""),
        ],
        f"""Don't switch everything to sea. Avocados should move to sea freight: margin rises from about ${res['Avocados'][0]:.2f} to ${res['Avocados'][1]:.2f} a kg. But 60% of blueberries would spoil on an 18-day voyage, making each
        kg sold cost more than it sells for, so they must stay on air, where margins are thin and prices need review. Decide product by product on margin per kg sold, not freight cost per kg shipped.
        Next step: trial two sea containers of avocados and measure spoilage and supermarket feedback.""",
        ["Converts cost per kg shipped into cost per kg sold", "Includes the shelf-life discount",
         "Splits the decision by product", "Flags thin margins on the air product"],
        "Logistics trade-offs · spoilage · segmentation")

CASES.append(vista())

# ---------------------------------------------------------------- Boreal Parts (hard): where to stock spare parts
def boreal():
    down, sites = 20.0, 6                            # $k per hour of a stopped truck; mine sites
    lead_c, lead_d = 36, 4                           # hours from central store vs local depot
    hold = 0.25
    classes = [  # name, value $k, failures a year per site
        ("A: cheap, fails often (sensors, hoses)", 2.0, 4.0),
        ("B: mid-price, fails sometimes (pumps)", 40.0, 0.5),
        ("C: expensive, rarely fails (gearboxes)", 600.0, 0.20)]
    res = []
    for nm, val, f in classes:
        benefit = f * sites * (lead_c - lead_d) * down / 1000       # $M a year of downtime avoided
        cost = sites * val * hold / 1000                             # $M a year to hold one at each site
        res.append((nm, benefit, cost, benefit - cost))
    assert res[0][3] > 0 and res[1][3] > 0 and res[2][3] < 0
    # for C: shared stock at one regional depot serving all sites, 10 hours away
    c_nm, c_val, c_f = classes[2]
    reg_benefit = c_f * sites * (lead_c - 10) * down / 1000
    reg_cost = c_val * hold / 1000
    assert reg_benefit > 3 * reg_cost
    def m(x): return f"${x*1000:.0f}k" if x < 0.1 else f"${x:.2f}M"
    rows = [[n, f"{b:.2f}", f"{c:.2f}", signed(d, 2)] for n, b, c, d in res]
    return C(
        "Boreal Parts", "A broken truck costs $20k an hour. Which parts should sit next to it?",
        "Cost & operations", "Mining services", "Canada", 3,
        """Boreal provides maintenance for haul trucks at six mines in northern Canada. When a truck breaks down, the mine loses about $20k an hour of output. Parts come from a central store
        36 hours away. The client asks Boreal to stock parts at every mine to cut that to 4 hours. Stocking everything everywhere would be very expensive. Which parts should be stocked where?""",
        [("Parts?", "Three groups: cheap parts that fail often (about $2k each, 4 failures a year per site), mid-price pumps ($40k, 0.5 failures), and expensive gearboxes ($600k, about one failure every five years per site)."),
         ("Holding cost?", "About 25% of a part's value a year."),
         ("Regional option?", "A regional depot could serve all six mines within about 10 hours.")],
        ("Which spare parts should be stocked at each mine?", [
            ("Benefit of local stock", ["Failures × hours saved × cost per hour"]),
            ("Cost of local stock", ["Value × holding cost × number of sites"]),
            ("By part group", ["Cheap and frequent", "Mid-price", "Expensive and rare"]),
            ("Middle options", ["Regional depot", "Shared spares"]),
        ]),
        "Cheap parts that fail often are an easy yes. Expensive parts that rarely fail probably don't justify a copy at every mine, but a shared regional spare might.",
        [
            Q("For each part group, compare the yearly benefit of stocking at all six mines with the cost.",
              f"""<p>Benefit = failures × 6 sites × 32 hours saved × $20k. Cost = 6 × part value × 25%.</p>
              <ul><li><b>A:</b> benefit {m(res[0][1])} vs cost {m(res[0][2])}</li><li><b>B:</b> benefit {m(res[1][1])} vs cost {m(res[1][2])}</li>
              <li><b>C:</b> benefit {m(res[2][1])} vs cost {m(res[2][2])}: <b>not worth it</b></li></ul>""",
              T(["Part group", "Downtime avoided ($M/yr)", "Holding cost ($M/yr)", "Net ($M/yr)"], rows, title="Exhibit 1 · Stocking at all six mines")),
            Q("What about one shared gearbox at a regional depot?",
              f"""<p>Lead time falls from 36 to 10 hours: 0.2 × 6 × 26 hours × $20k = <b>{m(reg_benefit)} a year</b>, against {m(reg_cost)} to hold one gearbox: clearly worth it.</p>
              <p><b>So-what:</b> match stocking to how critical and how expensive a part is: local for cheap and frequent, regional for expensive and rare.</p>"""),
            Q("What else could reduce downtime?",
              """<ul><li>Monitor gearbox condition to predict failures and order ahead</li><li>Agree with the manufacturer to hold consigned stock (paid for only when used)</li>
              <li>Share expensive spares with other operators in the region</li></ul>"""),
        ],
        f"""Don't stock everything at every mine. Cheap, frequently failing parts and mid-price pumps should be held at each mine: they save far more downtime than they cost to hold. Gearboxes should not:
        a copy at each mine costs about {m(res[2][2])} a year to save about {m(res[2][1])} of downtime. Instead keep one at a regional depot within 10 hours, which pays for itself, and add condition monitoring.
        Next step: classify all parts by cost of downtime and holding cost.""",
        ["Values downtime avoided against holding cost", "Splits parts by criticality and value",
         "Finds a middle option (regional pooling)", "Suggests ways to cut lead time without stock"],
        "Inventory placement · service level vs cost · risk pooling", fmt="Candidate-led")

CASES.append(boreal())
