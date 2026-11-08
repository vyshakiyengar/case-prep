"""Market entry. Concepts from CaseCraft #021, #022, #024, #025; rewritten from scratch."""
from lib import *
CASES = []

# ---------------------------------------------------------------- HelioVet (easy-medium, direct vs distributor)
def heliovet():
    clinics, digital = 4800, 0.35
    addressable = clinics * digital
    fee, support = 150, 30                       # $ per clinic per month
    unit = (fee - support) * 12 / 1000           # $k per clinic per year
    invest = 400.0
    direct = dict(ramp=[80, 200, 320, 420], fixed=350.0, share=0.0)
    dist = dict(ramp=[150, 300, 420, 500], fixed=150.0, share=0.25)
    def profits(o):
        return [n * (fee * (1 - o['share']) - support) * 12 / 1000 - o['fixed'] for n in o['ramp']]
    pd, pp = profits(direct), profits(dist)
    cd, cp = sum(pd) - invest, sum(pp) - invest
    assert cp > cd
    return C(
        "HelioVet", "Entering Poland: go direct or use a distributor?",
        "Market entry", "Veterinary software", "Poland", 2,
        """HelioVet, a German company, sells software that stores and analyses X-ray images for veterinary clinics, at $150 per clinic per month.
        After success at home it wants to enter Poland. Localisation and certification would cost $400k up front. The CEO asks: is Poland worth entering,
        and should HelioVet build its own sales team or work through a distributor?""",
        [("Which clinics can use it?", "Only clinics with digital X-ray: about 35% of Poland's 4,800 clinics today, and rising."),
         ("Distribution?", "Two specialist distributors sell equipment to most Polish clinics. One has offered to resell HelioVet for 25% of revenue."),
         ("Costs?", "Support costs about $30 per clinic per month. A direct team (sales, support, Polish-speaking staff) would cost $350k a year; with the distributor, $150k."),
         ("Objective?", "Recover the entry investment within four years.")],
        ("Should HelioVet enter Poland, and how?", [
            ("Market", ["Clinics with digital X-ray", "Growth in digital adoption", "Competing software"]),
            ("Economics per clinic", ["Price, support cost", "Distributor's share"]),
            ("Entry mode", ["Direct: cost and speed of ramp-up", "Distributor: margin given up vs reach"]),
        ]),
        "The market is small, so speed of adoption matters more than margin. A distributor that already visits most clinics could win customers much faster.",
        [
            Q("How big is the addressable market today?",
              f"""<p>Addressable: 4,800 × {pct(digital)} = <b>{num(addressable)} clinics</b>.</p>
              <p><b>So-what:</b> a small market, so any plan will need a large share of it, and the speed of winning clinics will matter.</p>"""),
            Q("Here are the two ramp-up plans. Compare cumulative profit over four years, after the $400k investment.",
              f"""<p>By year four the direct plan reaches {direct['ramp'][-1]} clinics ({pct(direct['ramp'][-1]/addressable)} of today's addressable market); the distributor plan {dist['ramp'][-1]} ({pct(dist['ramp'][-1]/addressable)}).</p>
              <p>Profit per clinic per year: direct ($150 − $30) × 12 = ${(fee-support)*12:,}; distributor ($150 × 75% − $30) × 12 = ${num((fee*0.75-support)*12)}.</p>
              <ul><li>Direct: {', '.join(signed(x, 0, '$', 'k') for x in pd)} → after investment <b>{signed(cd, 0, '$', 'k')}</b></li>
              <li>Distributor: {', '.join(signed(x, 0, '$', 'k') for x in pp)} → after investment <b>{signed(cp, 0, '$', 'k')}</b></li></ul>
              <p><b>So-what:</b> the distributor gives up a quarter of revenue but wins clinics faster with a much lower fixed cost; it recovers the investment within four years. Going direct doesn't.</p>
              <p>(Simplification: clinics count for the full year in which they're signed. Counting them only from mid-year, the distributor still ends positive and direct further behind.)</p>""",
              BAR(["Year 1", "Year 2", "Year 3", "Year 4"], {"Direct": direct['ramp'], "Distributor": dist['ramp']}, title="Exhibit 1 · Clinics signed (cumulative)", ylabel="Clinics", h=2.4)),
            Q("What would you put in the distributor contract?",
              """<ul><li><b>Minimum clinic targets</b> each year, with HelioVet's right to go direct if they're missed</li>
              <li><b>Customer data and contracts</b> owned by HelioVet, so it keeps the relationships</li>
              <li><b>Training and first-line support</b> by the distributor; HelioVet handles software issues</li>
              <li><b>Time limit</b> (e.g. 3 to 5 years) on exclusivity</li></ul>"""),
        ],
        f"""Enter Poland through the distributor. Poland has about {num(addressable)} clinics able to use HelioVet today; the distributor reaches them faster at a far lower fixed cost,
        delivering {signed(cp, 0, '$', 'k')} cumulative after the $400k investment over four years versus {signed(cd, 0, '$', 'k')} going direct. Protect the long term with minimum targets,
        HelioVet-owned customer contracts and time-limited exclusivity. Risk: dependence on one partner. Next step: negotiate terms with the distributor and pilot in Warsaw.""",
        ["Sizes the addressable market from digital adoption", "Compares entry modes over time, not at steady state",
         "Sees that speed and fixed cost outweigh the margin given up", "Protects the client in the partner contract"],
        "Entry mode · ramp-up · partner economics")

CASES.append(heliovet())

# ---------------------------------------------------------------- Rill Snacks (easy-medium, price waterfall)
def rill():
    shelf = 4.0
    vat = 0.05
    ex_vat = shelf / (1 + vat)
    retailer = 0.30
    after_ret = ex_vat * (1 - retailer)
    distributor = 0.15
    net = after_ret * (1 - distributor)
    cogs = 1.12
    unit = net - cogs
    stores = 120
    fixed1, fixed2 = 0.27, 0.11                   # $M: listing + sampling
    be1 = fixed1 * 1e6 / unit / stores / 52
    be2 = fixed2 * 1e6 / unit / stores / 52
    bench = 20
    p1 = (bench * stores * 52 * unit) / 1e6 - fixed1
    p2 = (bench * stores * 52 * unit) / 1e6 - fixed2
    assert be1 > bench > be2
    years_back = -p1 / p2
    assert 3 < years_back < 4
    return C(
        "Rill Snacks", "Launching an organic snack brand in UAE supermarkets",
        "Market entry", "Consumer packaged goods", "United Arab Emirates", 2,
        """Rill makes organic baked lentil snacks in Jordan. A UAE distributor can place it in 120 premium supermarkets in Dubai and Abu Dhabi, at a shelf price of $4.00 a pack.
        The founder wants to know how much Rill would actually earn per pack, and whether the launch can make money.""",
        [("Who takes a cut?", "VAT is 5% (included in the shelf price). The retailer keeps 30% of the price before VAT; the distributor keeps 15% of what's left."),
         ("Rill's costs?", "$1.12 per pack including production, freight and import duty."),
         ("Launch costs?", "About $270k in year one (listing fees and in-store sampling), then about $110k a year."),
         ("Benchmark?", "Similar premium snacks sell about 20 packs per store per week.")],
        ("Can Rill make money in the UAE?", [
            ("Price waterfall", ["Shelf price", "VAT", "Retailer margin", "Distributor margin", "Rill's net price"]),
            ("Unit economics", ["Net price minus cost per pack"]),
            ("Volume", ["Packs per store per week", "Number of stores"]),
            ("Launch costs", ["Listing fees", "Sampling and marketing"]),
        ]),
        "A lot of the $4.00 goes to VAT, the retailer and the distributor; I'd expect Rill to keep about half. Whether that's enough depends on how fast packs sell in each store.",
        [
            Q("Walk down from the $4.00 shelf price to what Rill receives per pack, and its margin.",
              f"""<ul><li>Remove VAT: $4.00 ÷ 1.05 = ${ex_vat:.2f}</li><li>Retailer keeps 30%: ${after_ret:.2f} left</li>
              <li>Distributor keeps 15%: <b>${net:.2f}</b> to Rill ({pct(net/shelf)} of the shelf price)</li>
              <li>Minus ${cogs:.2f} cost: <b>${unit:.2f} contribution per pack</b></li></ul>""",
              WF("Shelf price", shelf, [("VAT", -(shelf - ex_vat)), ("Retailer", -(ex_vat - after_ret)), ("Distributor", -(after_ret - net)), ("Product & freight", -cogs)], "Rill's margin",
                 title="Exhibit 1 · Where the $4.00 goes ($ per pack)", ylabel="$", fmt="{:+.2f}", base_fmt="{:.2f}")),
            Q(f"How many packs per store per week does Rill need to break even in year one and from year two? Compare with the benchmark of {bench}.",
              f"""<p>Year one: $270k ÷ ${unit:.2f} ÷ {stores} stores ÷ 52 = <b>{be1:.1f} packs per store per week</b>.</p>
              <p>From year two: $110k ÷ ${unit:.2f} ÷ {stores} ÷ 52 = <b>{be2:.1f}</b>.</p>
              <p>At the benchmark of {bench}: year one {signed(p1, 2, '$', 'M')}, year two {signed(p2, 2, '$', 'M')}.</p>
              <p><b>So-what:</b> expect a loss in year one, then a modest profit if Rill sells like its peers. The year-one loss takes about four more years of benchmark sales to earn back (cumulative break-even in year five), so Rill needs to beat the benchmark.</p>"""),
            Q("How would you make the launch work?",
              """<ul><li><b>Start with fewer stores</b> (the 40 best) to cut listing fees and focus sampling</li>
              <li><b>Negotiate listing fees</b> against volume, or pay them in instalments</li>
              <li><b>Sampling and eye-level shelf space</b> in the first three months: trial drives repeat</li>
              <li><b>Track packs per store per week</b> monthly; agree with the distributor what happens below 10</li></ul>"""),
        ],
        f"""Launch, but plan for a year-one loss. Rill keeps ${net:.2f} of the $4.00 shelf price and earns ${unit:.2f} per pack; it needs about {be1:.0f} packs per store per week to break even in year one
        but only about {be2:.0f} after that, against a benchmark of {bench}. At the benchmark, it loses about ${-p1*1000:.0f}k in year one and earns about ${p2*1000:.0f}k a year after.
        I recommend starting in the best 40 stores, focusing sampling there, and expanding once sales pass the benchmark. Risk: slow sales in year one lead retailers to delist. Next step: agree store-level targets with the distributor.""",
        ["Walks the price waterfall step by step, including VAT", "Converts break-even into packs per store per week",
         "Separates one-off launch costs from ongoing ones", "Recommends a staged launch"],
        "Price waterfall · retail economics · break-even velocity")

CASES.append(rill())

# ---------------------------------------------------------------- Ferrow Pay (hard, remittance unit economics)
def mintpay():
    amount, fee, fx = 400.0, 3.0, 0.008
    rev = fee + amount * fx
    payout = {"Cash pickup": 1.50, "Mobile wallet or bank": 0.40}
    other = 0.50 + 0.60          # compliance checks + card processing
    contrib = {k: rev - v - other for k, v in payout.items()}
    mix_now = 0.70
    blend_now = mix_now * contrib["Cash pickup"] + (1 - mix_now) * contrib["Mobile wallet or bank"]
    mix_new = 0.40
    blend_new = mix_new * contrib["Cash pickup"] + (1 - mix_new) * contrib["Mobile wallet or bank"]
    fixed = 2.4   # $M
    tx_per_cust = 10
    cust_now = fixed * 1e6 / (blend_now * tx_per_cust)
    cust_new = fixed * 1e6 / (blend_new * tx_per_cust)
    cac, life = 25.0, 2.5
    ltv = blend_now * tx_per_cust * life
    return C(
        "Ferrow Pay", "Can a remittance app win the UAE–Philippines corridor?",
        "Market entry", "Financial technology", "Philippines", 3,
        """Ferrow Pay is a money-transfer app. It wants to launch on the corridor from the United Arab Emirates to the Philippines, used by hundreds of thousands of Filipino workers
        who send money home each month. The board asks whether Ferrow Pay can build a profitable business on this corridor, and what it would take.""",
        [("Pricing?", "A flat $3 fee plus a 0.8% margin on the exchange rate. The average transfer is $400."),
         ("How do families receive money?", "Today about 70% collect it as cash from agent shops; the other 30%, a growing share, receive it in a mobile wallet or bank account."),
         ("Costs per transfer?", "Payout partner: $1.50 for cash pickup, $0.40 to a wallet or bank. Compliance checks $0.50; card processing $0.60."),
         ("Fixed costs?", "Licences, compliance team and operations: about $2.4M a year.")],
        ("Can Ferrow Pay be profitable on this corridor?", [
            ("Revenue per transfer", ["Flat fee", "FX margin × amount"]),
            ("Cost per transfer", ["Payout method: cash vs digital", "Compliance, processing"]),
            ("Customers needed", ["Transfers per customer per year", "Fixed costs to cover"]),
            ("Acquisition", ["Cost to win a sender", "How long they stay"]),
        ]),
        "Remittance margins are thin, so the payout method may decide the case: cash pickup is expensive. If Ferrow Pay can move families onto mobile wallets, the economics improve sharply.",
        [
            Q("Calculate contribution per transfer for each payout method.",
              f"""<p>Revenue: $3 + 0.8% × $400 = <b>${rev:.2f}</b>.</p>
              <ul><li>Cash pickup: ${rev:.2f} − $1.50 − $1.10 = <b>${contrib['Cash pickup']:.2f}</b></li>
              <li>Wallet or bank: ${rev:.2f} − $0.40 − $1.10 = <b>${contrib['Mobile wallet or bank']:.2f}</b></li></ul>
              <p>With {pct(mix_now)} cash pickup, the blended contribution is <b>${blend_now:.2f}</b>.</p>
              <p><b>So-what:</b> a digital payout earns {pct(contrib['Mobile wallet or bank']/contrib['Cash pickup']-1)} more per transfer.</p>""",
              T(["Per transfer", "Cash pickup", "Wallet or bank"], [["Revenue", f"${rev:.2f}", f"${rev:.2f}"], ["Payout partner", "−$1.50", "−$0.40"],
                 ["Compliance and processing", "−$1.10", "−$1.10"], ["Contribution", f"${contrib['Cash pickup']:.2f}", f"${contrib['Mobile wallet or bank']:.2f}"]], title="Exhibit 1 · Unit economics", bold_last=True)),
            Q(f"Each customer sends {tx_per_cust} transfers a year. How many active customers does Ferrow Pay need to cover its $2.4M fixed costs today, and if cash pickup fell to {pct(mix_new)}?",
              f"""<p>Today: $2.4M ÷ (${blend_now:.2f} × {tx_per_cust}) = <b>{num(cust_now)} customers</b>.</p>
              <p>At {pct(mix_new)} cash: blended ${blend_new:.2f}, so <b>{num(cust_new)} customers</b>, {pct(1-cust_new/cust_now)} fewer.</p>
              <p><b>So-what:</b> shifting payouts to wallets is worth as much as winning thousands of extra customers.</p>"""),
            Q(f"It costs about ${cac:.0f} to win a customer, who stays about {life} years. Is acquisition affordable?",
              f"""<p>Lifetime contribution: ${blend_now:.2f} × {tx_per_cust} × {life} = <b>${ltv:.0f}</b> versus ${cac:.0f}: about {ltv/cac:.1f}× the acquisition cost.</p>
              <p><b>So-what:</b> affordable, with room to spend more on acquisition if it brings loyal senders.</p>"""),
            Q("How would you win customers and move them to digital payouts?",
              """<ul><li><b>Employer partnerships</b>: sign up workers through companies that employ many Filipino staff</li>
              <li><b>Cheaper fee for wallet payouts</b> (e.g. $2 instead of $3): it still earns more than cash pickup</li>
              <li><b>Community channels</b>: churches, Filipino associations, word of mouth with referral bonuses</li>
              <li><b>Speed and trust</b>: instant delivery and clear exchange rates, since senders compare apps closely</li></ul>
              <p>Licensing and anti-money-laundering controls must be in place before launch: they're non-negotiable.</p>"""),
        ],
        f"""Ferrow Pay can build a profitable corridor if it moves families to digital payouts. Each transfer earns ${rev:.2f}; contribution is ${contrib['Cash pickup']:.2f} on cash pickup but
        ${contrib['Mobile wallet or bank']:.2f} to a wallet. At today's {pct(mix_now)} cash mix it needs about {num(cust_now, -2)} active senders to cover fixed costs; at {pct(mix_new)} cash, about {num(cust_new, -2)}.
        Customers are worth about {ltv/cac:.0f}× their acquisition cost. I recommend launching with a lower fee for wallet payouts and employer partnerships to acquire senders.
        Risk: incumbents cut fees. Next step: secure licences and agree wallet payout partners in the Philippines.""",
        ["Builds revenue from the fee and the FX margin", "Compares payout methods per transfer",
         "Turns the payout mix into a customers-needed number", "Uses pricing to steer customers to the cheaper channel"],
        "Unit economics · channel mix · break-even customers")

CASES.append(mintpay())

# ---------------------------------------------------------------- Northcairn Recycling (medium, feedstock utilisation)
def borealis():
    cap = 20.0                 # kt per year
    margin = 1800.0            # $ per tonne: metal value + gate fee − variable processing
    fixed = 21.0               # $ M per year
    capex = 90.0
    utils = [0.50, 0.75, 0.90]
    prof = [cap * u * margin / 1000 - fixed for u in utils]
    be = fixed / (cap * margin / 1000)
    contracted = 0.45
    hurdle = 8
    u_hurdle = (capex / hurdle + fixed) / (cap * margin / 1000)
    assert capex / prof[1] > hurdle > capex / prof[2]
    return C(
        "Northcairn Recycling", "A battery recycling plant: is the market enough?",
        "Market entry", "Industrial recycling", "Sweden", 2,
        f"""Northcairn wants to build a lithium-ion battery recycling plant in northern Sweden that would recover lithium, nickel and cobalt from used batteries
        and factory scrap. The plant would cost ${capex:.0f}M and process up to {cap:.0f},000 tonnes a year. The board asks: should Northcairn build it?""",
        [("Where does feedstock come from?", "Scrap from nearby battery factories today; end-of-life electric-car batteries later in the decade."),
         ("Economics?", f"After variable processing costs, each tonne earns about ${num(margin)} from recovered metals and gate fees. Fixed costs are ${fixed:.0f}M a year."),
         ("Contracts?", f"Signed supply agreements cover {pct(contracted)} of capacity."),
         ("Hurdle?", "Payback within eight years.")],
        ("Should Northcairn build the plant?", [
            ("Feedstock", ["Contracted vs uncontracted tonnes", "Factory scrap now, car batteries later", "Competing recyclers"]),
            ("Economics per tonne", ["Metal prices", "Gate fees", "Processing cost"]),
            ("Plant", ["Utilisation needed to break even", "Payback at different utilisation"]),
        ]),
        "Recycling plants have high fixed costs, so profit depends on running near capacity. Generic market growth doesn't matter if Northcairn can't secure the batteries.",
        [
            Q("Calculate annual operating profit at 50%, 75% and 90% utilisation, and the break-even utilisation.",
              f"""<p>Profit = {cap:.0f}kt × utilisation × ${num(margin)} − ${fixed:.0f}M.</p>
              <ul>{''.join(f"<li>{pct(u)}: <b>{signed(p, 1, '$', 'M')}</b>, payback {'—' if p <= 0 else f'{capex/p:.1f} years'}</li>" for u, p in zip(utils, prof))}</ul>
              <p>Break-even utilisation: ${fixed:.0f}M ÷ ({cap:.0f}kt × ${num(margin)}) = <b>{pct(be)}</b>.</p>
              <p>To pay back in eight years the plant must earn ${capex/hurdle:.2f}M a year, which needs <b>{pct(u_hurdle)} utilisation</b>.</p>
              <p><b>So-what:</b> only near-full running meets the hurdle; at 75% payback takes {capex/prof[1]:.0f} years, and at 50% the plant loses money.</p>""",
              BAR([pct(u) for u in utils], [p for p in prof], title="Exhibit 1 · Annual operating profit by utilisation ($M)", fmt="{:+.1f}", ylabel="$M", h=2.3, highlight=[0])),
            Q(f"Only {pct(contracted)} of capacity is contracted. What does that tell you, and what would you do?",
              f"""<p>Contracted volume alone ({pct(contracted)}) is below the {pct(be)} break-even: the plant would lose money on signed contracts only.</p>
              <ul><li>Sign more <b>long-term supply contracts</b> with battery factories and carmakers before committing the full ${capex:.0f}M</li>
              <li><b>Build in phases</b>: a first line sized to contracted volume, then expand</li>
              <li><b>Offer gate-fee discounts</b> for multi-year commitments</li>
              <li><b>Hedge metal prices</b> partly, since lithium and nickel prices swing sharply</li></ul>"""),
            Q("What risks would you raise with the board?",
              """<ul><li>Metal prices: a fall in lithium or nickel cuts the $1,800 margin per tonne</li><li>Battery chemistry: newer batteries use less cobalt and nickel, so they're worth less to recycle</li>
              <li>Timing: car batteries reach end of life slowly, so the plant depends on factory scrap for years</li><li>Competition for scrap from other European recyclers</li></ul>"""),
        ],
        f"""Don't build the full plant yet. It needs {pct(be)} utilisation to break even and about {pct(u_hurdle)} to pay back within eight years, yet only {pct(contracted)} of capacity is under contract;
        at 75% it would take {capex/prof[1]:.0f} years to pay back. I recommend building in phases sized to contracted volume and signing long-term supply deals before adding capacity.
        Risk: metal price swings change the margin per tonne. Next step: approach the three largest battery factories in the Nordics for multi-year supply agreements.""",
        ["Recognises utilisation drives profit in a fixed-cost plant", "Compares contracted volume with break-even",
         "Proposes phasing to reduce risk", "Raises metal-price and chemistry risks"],
        "Utilisation · break-even · supply contracts")

CASES.append(borealis())
