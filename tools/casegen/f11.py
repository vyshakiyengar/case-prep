"""Mergers and acquisitions. Concepts from CaseCraft #051-#055; rewritten with deliberately different outcomes."""
from lib import *
CASES = []

# ---------------------------------------------------------------- Tidewell Foods (medium): yes, but not at that price
def tidewell():
    ebitda, mult, ask = 8.0, 10.0, 110.0
    standalone = ebitda * mult
    cost_syn = 2.0
    rev_add, rev_m, prob = 15.0, 0.25, 0.5
    rev_syn = rev_add * rev_m
    integ = 6.0
    v_cost, v_rev = cost_syn * mult, rev_syn * prob * mult
    value = standalone + v_cost + v_rev - integ
    walk = standalone + v_cost - integ                 # price that pays only for synergies we control
    assert ask < value and walk < ask and value - ask < 5
    return C(
        "Tidewell Foods", "A healthy-snack brand: worth $110M to us?",
        "M&A", "Packaged food", "United States", 2,
        """Tidewell is a large US snack maker whose sales of crisps and crackers are flat. It wants to buy Greenleaf, a fast-growing healthy-snack brand, and the founders are asking $110M.
        Tidewell's CEO asks: should we buy, and is $110M the right price?""",
        [("Greenleaf's numbers?", "EBITDA (operating profit before depreciation) of $8M. Similar snack brands sell for about 10× EBITDA."),
         ("Cost savings?", "Tidewell could buy ingredients and packaging for Greenleaf more cheaply and share warehouses: about $2M a year."),
         ("Sales upside?", "Putting Greenleaf into Tidewell's 30,000 stores could add $15M of sales a year at a 25% margin. The sales team thinks it's a coin flip whether it fully happens."),
         ("Integration?", "About $6M one-off to combine systems and supply chains.")],
        ("Should Tidewell buy Greenleaf at $110M?", [
            ("Value on its own", ["EBITDA × market multiple"]),
            ("Value of synergies", ["Cost savings (more certain)", "Extra sales (less certain)", "Minus integration costs"]),
            ("Price", ["Max we should pay", "Deal structure"]),
            ("Fit and risk", ["Brand and culture", "Founders staying"]),
        ]),
        "Greenleaf on its own is probably worth less than $110M, so the price depends on synergies. Cost savings are fairly certain; extra sales much less so.",
        [
            Q("What is Greenleaf worth on its own, and what are the synergies worth?",
              f"""<p>Standalone: $8M × 10 = <b>${standalone:.0f}M</b>.</p>
              <p>Cost synergies: $2M × 10 = ${v_cost:.0f}M. Revenue synergies: $15M × 25% = ${rev_syn:.2f}M a year; at a 50% chance, ${rev_syn*prob:.3f}M × 10 = ${v_rev:.1f}M. Integration: −$6M.</p>
              <p>Value to Tidewell: <b>${value:.1f}M</b>, just above the $110M asking price.</p>""",
              WF("Greenleaf standalone", standalone, [("Cost synergies", v_cost), ("Sales synergies (50% likely)", r(v_rev, 1)), ("Integration", -integ)], "Value to Tidewell",
                 title="Exhibit 1 · What Greenleaf is worth to Tidewell ($M)", fmt="{:+,.1f}", base_fmt="{:,.1f}")),
            Q("So should Tidewell pay $110M?",
              f"""<p>At $110M Tidewell keeps only ${value-ask:.1f}M of the value it creates, and that depends on the uncertain sales synergies. If they don't happen, the deal is worth ${walk:.0f}M: <b>Tidewell overpays by ${ask-walk:.0f}M</b>.</p>
              <p><b>So-what:</b> buy, but pay up front only for what Tidewell controls (about ${walk:.0f}M), and pay for the sales upside only if it arrives.</p>"""),
            Q("How would you structure the offer?",
              f"""<ul><li><b>Up front: about ${walk:.0f}M</b>, the standalone value plus cost savings less integration (${standalone:.0f}M + ${v_cost:.0f}M − ${integ:.0f}M); open lower, around ${walk-6:.0f}M, to leave room to negotiate</li>
              <li><b>Earn-out:</b> up to ${ask-walk:.0f}M more over three years if Greenleaf's sales through Tidewell's stores reach agreed targets. The sellers reach their $110M only if the sales synergy arrives</li>
              <li><b>Keep the founders</b> for two years, with part of the earn-out tied to their staying; the brand's appeal is in its founder story</li></ul>"""),
        ],
        f"""Buy Greenleaf, but not for $110M up front. On its own it is worth about ${standalone:.0f}M; certain cost savings add ${v_cost:.0f}M and integration costs ${integ:.0f}M, so Tidewell should pay
        about ${walk:.0f}M up front. The extra-sales synergy is worth about ${v_rev:.0f}M but is a coin flip, so pay for it through an earn-out tied to sales targets. Total value to Tidewell is about ${value:.0f}M,
        so offering $110M up front would hand almost all of it to the sellers. Risk: losing the founders, so tie part of the earn-out to their staying.""",
        ["Values the target on its own first", "Separates certain cost synergies from uncertain revenue synergies",
         "Sets a walk-away price", "Uses deal structure (earn-out) to share risk"],
        "M&A valuation · synergies · deal structure")

CASES.append(tidewell())

# ---------------------------------------------------------------- Lattice Payments (medium): no at this price
def lattice():
    ebitda, mult, price = 6.0, 15.0, 180.0
    standalone = ebitda * mult
    premium = price - standalone
    sme, adopt, profit_u = 2.0e6, 0.03, 100.0
    cross = sme * adopt * profit_u / 1e6
    cost = 1.0
    syn = cross + cost
    v_syn = syn * 10
    integ = 10.0
    max_price = standalone + v_syn - integ
    partner_share = 0.7
    assert v_syn < premium and max_price < price
    return C(
        "Lattice Payments", "A bank wants a fintech. Is it worth the premium?",
        "M&A", "Banking", "United Kingdom", 2,
        """A large UK bank wants to offer its small-business customers a modern payments app. Lattice, a fast-growing fintech, has agreed in principle to sell for $180M.
        The bank's strategy head asks you whether the price makes sense.""",
        [("Lattice's numbers?", "EBITDA of $6M, growing fast. Similar fintechs trade at about 15× EBITDA."),
         ("The bank's plan?", "Offer the app to its 2 million small-business customers. Pilots suggest about 3% would adopt, each earning about $100 of profit a year."),
         ("Cost savings?", "About $1M a year from shared compliance and hosting."),
         ("Integration?", "About $10M one-off. Lattice's founders have said they may leave after a year."),
         ("How to value synergies?", "Use 10× the yearly synergy, a little below Lattice's multiple because they are less certain.")],
        ("Should the bank buy Lattice for $180M?", [
            ("Standalone value", ["EBITDA × multiple"]),
            ("Premium paid", ["Price − standalone value"]),
            ("Synergies", ["Cross-selling to the bank's customers", "Cost savings", "Minus integration"]),
            ("Alternatives", ["Partner or white-label", "Build"]),
        ]),
        "Paying $180M for a company worth about $90M on its own means paying a $90M premium for synergies. I'd check whether the cross-selling can realistically earn that back.",
        [
            Q("What is the bank paying for, beyond Lattice itself?",
              f"""<p>Standalone value: $6M × 15 = <b>${standalone:.0f}M</b>. The premium for synergies is <b>${premium:.0f}M</b>.</p>
              <p>To justify it at 10×, the bank needs about <b>${premium/10:.0f}M a year</b> of synergies, plus enough to cover $10M of integration.</p>"""),
            Q("Can the synergies deliver that?",
              f"""<p>Cross-selling: 2 million × 3% = {sme*adopt/1000:.0f}k users × $100 = <b>${cross:.0f}M a year</b>. Cost savings: $1M. Total ${syn:.0f}M a year, worth ${v_syn:.0f}M.</p>
              <p>Maximum sensible price: ${standalone:.0f}M + ${v_syn:.0f}M − $10M = <b>${max_price:.0f}M</b>, ${price-max_price:.0f}M below the agreed price.</p>
              <p><b>So-what:</b> at $180M the bank would pay away more than all the value it creates, even if the 3% adoption is achieved.</p>""",
              BAR(["Standalone value", "Synergies (net)", "Max sensible price", "Agreed price"], [standalone, v_syn - integ, max_price, price], title="Exhibit 1 · Price vs value ($M)",
                  ylabel="$M", h=2.3, highlight=[3])),
            Q("What alternatives would you put to the bank?",
              f"""<ul><li><b>Partner (white-label):</b> offer Lattice's app under the bank's brand and share revenue. If the bank keeps about 70% of the cross-sell profit, it earns ~${cross*partner_share:.1f}M a year with no premium and no integration</li>
              <li><b>Renegotiate:</b> offer up to ~${max_price:.0f}M, with part paid only if adoption passes 3%</li>
              <li><b>Build:</b> slower and risky for a bank; only if the app is truly strategic</li></ul>"""),
        ],
        f"""Don't buy Lattice at $180M. Lattice is worth about ${standalone:.0f}M on its own, and realistic synergies (about ${syn:.0f}M a year from cross-selling and cost savings) justify at most about ${max_price:.0f}M.
        I recommend a white-label partnership, which gives the bank's customers the app and earns most of the cross-sell profit without paying a premium; or a revised offer of up to ${max_price:.0f}M with an earn-out.
        Risk: a rival bank may buy Lattice instead. Next step: test adoption with 20,000 customers through a partnership pilot.""",
        ["Calculates the premium paid for synergies", "Turns the premium into the synergies needed per year",
         "Shows the deal destroys value even if the plan works", "Offers partnership and renegotiation as alternatives"],
        "M&A · premium vs synergies · build, partner or buy", fmt="Candidate-led")

CASES.append(lattice())

# ---------------------------------------------------------------- Corvane Medical (hard): yes, with a remedy and financing plan
def corvane():
    eb_c, eb_t, mult, price = 240.0, 60.0, 14.0, 1000.0
    standalone = eb_t * mult
    cost_syn, rev_syn, prob, integ = 45.0, 10.0, 0.5, 90.0
    value = standalone + cost_syn * mult + rev_syn * prob * mult - integ
    knee_eb, knee_px, knee_syn = 20.0, 12.0, 12.0
    v_remedy = value - knee_eb * mult + knee_eb * knee_px - knee_syn * mult
    debt0, cap = 300.0, 3.5
    debt1 = debt0 + price
    lev = debt1 / (eb_c + eb_t)
    gap = debt1 - cap * (eb_c + eb_t)
    proceeds = knee_eb * knee_px
    eb_after = eb_c + eb_t - knee_eb
    lev2 = (debt1 - proceeds) / eb_after
    gap2 = (debt1 - proceeds) - cap * eb_after
    assert value > price and v_remedy > price and lev > cap and gap > 0 and gap2 > 0
    return C(
        "Corvane Medical", "A big orthopaedics deal, a competition regulator, and a debt limit",
        "M&A", "Medical devices", "Germany", 3,
        """Corvane makes hip and knee implants and has EBITDA of $240M. It wants to buy its rival Halden Ortho (EBITDA $60M) for $1.0B, paid with debt.
        The board asks you three things: is it worth it, will the competition regulator allow it, and can Corvane afford it?""",
        [("Valuation?", "Orthopaedic companies trade at about 14× EBITDA."),
         ("Synergies?", "$45M a year of cost savings (closing two plants, shared overheads). About $10M a year of profit from cross-selling, judged 50% likely. $90M one-off integration."),
         ("Competition?", "In knee implants the combined company would hold about 55% of the market. Halden's knee business earns $20M EBITDA, and $12M of the plant savings depend on it."),
         ("Debt?", "Corvane has $300M of net debt today. Its lenders cap net debt at 3.5× EBITDA.")],
        ("Should Corvane buy Halden for $1.0B?", [
            ("Value", ["Halden standalone", "Synergies, risk-weighted", "Integration"]),
            ("Regulation", ["Market share by product", "Likely remedies"]),
            ("Financing", ["Debt / EBITDA after the deal", "How to stay within limits"]),
        ]),
        "The synergies look large, so the deal is probably worth it on paper. The real questions are whether regulators force Corvane to sell the knee business, and whether the debt fits.",
        [
            Q("What is Halden worth to Corvane?",
              f"""<p>Standalone: $60M × 14 = ${standalone:.0f}M. Cost synergies: $45M × 14 = ${cost_syn*mult:.0f}M. Revenue synergies: 50% × $10M × 14 = ${rev_syn*prob*mult:.0f}M. Integration −$90M.</p>
              <p>Total: <b>${value:,.0f}M</b> against a $1,000M price. Strongly positive.</p>"""),
            Q("At 55% of knee implants, the regulator will likely make Corvane sell Halden's knee business, probably at about 12× EBITDA. What is the deal worth then?",
              f"""<p>Lose the knee business's value ($20M × 14 = ${knee_eb*mult:.0f}M), gain sale proceeds ($20M × 12 = ${proceeds:.0f}M), and lose $12M of plant savings (× 14 = ${knee_syn*mult:.0f}M).</p>
              <p>Value: ${value:,.0f}M − ${knee_eb*mult:.0f}M + ${proceeds:.0f}M − ${knee_syn*mult:.0f}M = <b>${v_remedy:,.0f}M</b>, still well above $1.0B.</p>
              <p><b>So-what:</b> the deal survives the likely remedy, so Corvane can offer it to the regulator up front and speed approval.</p>"""),
            Q("Can Corvane fund it with debt?",
              f"""<p>Debt after the deal: $300M + $1,000M = ${debt1:,.0f}M. EBITDA: $240M + $60M = $300M (before synergies). Leverage <b>{lev:.1f}×</b>, above the 3.5× limit by ${gap:.0f}M of debt.</p>
              <p>Using the ${proceeds:.0f}M from selling the knee business: (${debt1:,.0f}M − ${proceeds:.0f}M) ÷ ${eb_after:.0f}M = <b>{lev2:.1f}×</b>, still slightly above the limit before synergies arrive.</p>
              <p>The remaining gap is (${debt1-proceeds:,.0f}M − 3.5 × ${eb_after:.0f}M) = <b>${gap2:.0f}M</b>. Options: pay about ${gap2:.0f}M of the price in Corvane shares, a small equity raise, or a temporary higher limit with lenders until synergies arrive in year 2.</p>""",
              T(["", "Debt ($M)", "EBITDA ($M)", "Debt ÷ EBITDA"], [["Today", num(debt0), num(eb_c), f"{debt0/eb_c:.1f}×"], ["After deal", num(debt1), num(eb_c + eb_t), f"{lev:.1f}×"],
                 ["After knee sale", num(debt1 - proceeds), num(eb_after), f"{lev2:.1f}×"], ["Lender limit", "", "", f"{cap:.1f}×"]], title="Exhibit 1 · Leverage")),
        ],
        f"""Buy Halden. It is worth about ${value:,.0f}M to Corvane against a $1.0B price, and still about ${v_remedy:,.0f}M after the likely forced sale of Halden's knee business, so offer that sale to the regulator up front.
        Debt would reach {lev:.1f}× EBITDA against a 3.5× limit; use the knee-sale proceeds and pay about ${gap2:.0f}M of the price in shares to stay within it.
        Risks: plant closures could disrupt supply to hospitals, and the regulator may ask for more. Next step: early talks with the regulator and lenders.""",
        ["Values the deal with risk-weighted synergies", "Checks the competition-law remedy and re-values the deal",
         "Tests whether the financing fits the lenders' limit", "Uses the remedy proceeds to solve the financing gap"],
        "M&A · antitrust remedies · leverage", fmt="Candidate-led")

CASES.append(corvane())

# ---------------------------------------------------------------- Haulmark (medium-hard): partner instead
def haulmark():
    rev, mult_r, price = 30.0, 4.0, 150.0
    standalone = rev * mult_r
    back, mult_s = 8.0, 8.0
    v_syn = back * mult_s
    rival, leave = 0.60, 0.50
    lost = rival * leave
    standalone2 = standalone * (1 - lost)
    v1, v2 = standalone + v_syn, standalone2 + v_syn
    partner = 0.75 * back
    assert v1 > price > v2
    return C(
        "Haulmark", "A trucking company wants to buy a freight app its rivals use",
        "M&A", "Logistics", "United States", 3,
        """Redline is a large US trucking company. Its trucks often drive back empty. It wants to buy Haulmark, an app that matches shippers' loads with trucking firms, for $150M,
        to fill its empty return trips. The CEO asks whether the deal makes sense.""",
        [("Haulmark's numbers?", "Revenue of $30M a year from fees on loads matched. Freight apps like it sell for about 4× revenue."),
         ("Benefit to Redline?", "Priority access to loads on its return routes: about $8M a year of extra profit, which Redline values at 8×."),
         ("Who uses Haulmark?", "About 60% of Haulmark's fees come from trucking firms that compete with Redline."),
         ("Their reaction?", "In interviews, about half of those rivals say they would move to another app if Redline owned Haulmark.")],
        ("Should Redline buy Haulmark for $150M?", [
            ("Haulmark on its own", ["Revenue × multiple"]),
            ("Value to Redline", ["Filling empty return trips"]),
            ("What changes after the deal", ["Do rival carriers stay?"]),
            ("Alternatives", ["Commercial partnership"]),
        ]),
        "Haulmark is valuable because it is neutral. If Redline owns it, Redline's rivals may leave, and the app could lose much of its value.",
        [
            Q("What is Haulmark worth to Redline, assuming nothing else changes?",
              f"""<p>Standalone: $30M × 4 = ${standalone:.0f}M. Benefit to Redline: $8M × 8 = ${v_syn:.0f}M. Total <b>${v1:.0f}M</b>, above the $150M price.</p>"""),
            Q("Now factor in rival carriers leaving.",
              f"""<p>60% of fees come from rivals and half of them leave: Haulmark loses {pct(lost)} of its revenue. Standalone value falls to ${standalone2:.0f}M.</p>
              <p>Total value: ${standalone2:.0f}M + ${v_syn:.0f}M = <b>${v2:.0f}M</b>, below the $150M price. With fewer carriers, the app may also attract fewer shippers, so it could fall further.</p>
              <p><b>So-what:</b> buying Haulmark damages the very thing that makes it valuable: its neutrality.</p>""",
              BAR(["Value if rivals stay", "Value if half of rivals leave", "Price"], [r(v1, 0), r(v2, 0), price], title="Exhibit 1 · Value to Redline vs price ($M)", ylabel="$M", h=2.3, highlight=[1])),
            Q("How else could Redline fill its empty return trips?",
              f"""<ul><li><b>Commercial partnership</b> with Haulmark: guaranteed volume on Redline's routes in return for first look at return loads. If it captures 75% of the benefit, that's ~${partner:.0f}M a year, worth about ${partner*mult_s:.0f}M at 8×, for no money up front. Buying is worth about {signed(v2-price, 0, '$', 'M')} after the price</li>
              <li>Use several freight apps at once</li><li>Sign direct contracts with shippers on its main return lanes</li></ul>"""),
        ],
        f"""Don't buy Haulmark. On paper it is worth ${v1:.0f}M to Redline, but about 60% of its fees come from Redline's rivals, and if half of them leave, the value falls to about ${v2:.0f}M, below the $150M price.
        Instead, agree a partnership that gives Redline first access to return loads on its routes, which captures most of the ~$8M a year benefit without the purchase. Risk: a rival could buy Haulmark,
        so include a right to bid in the partnership. Next step: approach Haulmark with a volume-for-priority proposal.""",
        ["Values the deal before and after customer reactions", "Spots that neutrality is the asset",
         "Shows the deal flips from positive to negative", "Finds a way to get the benefit without buying"],
        "M&A · channel conflict · partner vs buy")

CASES.append(haulmark())
