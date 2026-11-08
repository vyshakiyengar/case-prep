"""AI return on investment. Concepts from CaseCraft #066-#070; rewritten so each case tests a common overclaim."""
from lib import *
CASES = []

# ---------------------------------------------------------------- Cedarline Home (easy-medium): chatbot containment vs resolution
def cedarline():
    contacts, agent_cost = 2.0, 6.0                  # M contacts, $ per agent contact
    contain, back = 0.35, 0.20
    bot_cost, platform = 0.40, 0.5
    claimed = contacts * contain * agent_cost
    run = contacts * bot_cost + platform
    net_claim = claimed - run
    real = contacts * contain * (1 - back) * agent_cost
    net_real = real - run
    assert net_real > 0 and net_real < 0.75 * net_claim
    return C(
        "Cedarline Home", "The chatbot says it handles 35% of customers. Does it?",
        "Cost & operations", "Retail", "United States", 1,
        """Cedarline is a home-furnishings retailer whose service centre handles 2 million customer contacts a year. A vendor proposes an AI chatbot and claims it would save about $3M a year.
        The head of customer service asks you to check the claim before signing.""",
        [("Cost of a contact today?", "About $6 for an agent to handle a call or chat."),
         ("The vendor's claim?", "The chatbot fully handles 35% of conversations without passing them to an agent."),
         ("Chatbot costs?", "$0.40 per conversation (every contact would start with the bot) plus $500k a year for the platform."),
         ("Pilot data?", "In a one-month pilot, 20% of customers the bot 'handled' contacted Cedarline again within a week about the same issue.")],
        ("Will the chatbot save Cedarline money, and how much?", [
            ("Contacts avoided", ["Handled by the bot", "Come back later"]),
            ("Cost of the bot", ["Per conversation", "Platform"]),
            ("Customer experience", ["Satisfaction", "Which issues suit a bot"]),
        ]),
        "'Handled by the bot' isn't the same as 'resolved'. If some customers come back, the saving is smaller than the vendor says.",
        [
            Q("Recreate the vendor's $3M estimate.",
              f"""<p>2M × 35% = 700k contacts avoided × $6 = ${claimed:.1f}M. Less bot costs: 2M × $0.40 + $0.5M = ${run:.1f}M. Net: <b>${net_claim:.1f}M</b>.</p>"""),
            Q("Now use the pilot data on customers who come back.",
              f"""<p>Only 80% of 'handled' contacts are truly resolved: 2M × 35% × 80% = {contacts*contain*(1-back)*1000:.0f}k × $6 = ${real:.2f}M. Net: <b>${net_real:.2f}M</b>, about {pct(1-net_real/net_claim)} below the vendor's figure.</p>
              <p><b>So-what:</b> still worth doing, but judge the vendor on resolution (no repeat contact), not containment.</p>""",
              BAR(["Vendor's claim", "With repeat contacts"], [r(net_claim, 2), r(net_real, 2)], title="Exhibit 1 · Net yearly saving ($M)", ylabel="$M", fmt="{:.1f}", h=2.2, highlight=[1])),
            Q("How would you roll it out?",
              """<ul><li>Start with simple, high-volume questions: order tracking, delivery slots, returns policy</li><li>Hand over to an agent quickly for damaged goods and complaints, with the chat history</li>
              <li>Pay the vendor partly on resolution rate, measured as no repeat contact within 7 days</li><li>Track customer satisfaction for bot and agent contacts separately</li></ul>"""),
        ],
        f"""Go ahead, but expect about ${net_real:.1f}M a year of savings, not $3M. The vendor counts every conversation the bot doesn't pass on as a saving, but 20% of those customers come back,
        so the real saving is about {pct(1-net_real/net_claim)} lower. Start with simple order and delivery questions, hand complaints to agents quickly, and tie the vendor's fees to resolution rather than containment.
        Risk: customer frustration if the bot blocks access to an agent.""",
        ["Rebuilds the vendor's number", "Distinguishes containment from resolution",
         "Revises the saving with pilot data", "Designs the rollout around simple contacts"],
        "AI business case · containment vs resolution · cost per contact")

CASES.append(cedarline())

# ---------------------------------------------------------------- Northpeak Insurance (medium): claims triage
def northpeak():
    claims, handle = 120.0, 180.0                    # k claims, $ per claim
    auto, auto_cost = 0.30, 20.0
    paid = 900.0                                     # $M claims paid
    fraud, catch = 0.03, 0.10
    build, runc = 4.0, 1.0
    s_handle = claims * auto * (handle - auto_cost) / 1000
    s_fraud = paid * fraud * catch
    fp, fp_cost = 0.02, 150.0
    c_fp = claims * fp * fp_cost / 1000
    net = s_handle + s_fraud - runc - c_fp
    pb = build / net
    assert 0.5 < pb < 1.5 and s_handle > s_fraud and build / (s_handle - runc - c_fp) < 1
    return C(
        "Northpeak Insurance", "AI for claims: faster payouts and less fraud?",
        "Cost & operations", "Insurance", "Canada", 2,
        """Northpeak is a home and car insurer handling 120,000 claims a year. It's considering an AI system that would automatically approve simple claims and flag suspected fraud.
        Build cost: $4M; running cost: $1M a year. The COO asks whether it pays off, and what could go wrong.""",
        [("Handling cost?", "About $180 of adjuster time per claim. An auto-approved claim costs about $20 to check."),
         ("How many could be automated?", "About 30%: simple claims like broken windscreens and small water leaks."),
         ("Fraud?", "Northpeak pays out about $900M a year. Industry studies suggest about 3% of payouts are fraudulent; the AI is expected to catch an extra 10% of that."),
         ("Side effects?", "In testing, about 2% of genuine claims were wrongly flagged as suspicious, which delays them. Each costs about $150 in extra handling and goodwill gestures.")],
        ("Should Northpeak invest in AI claims triage?", [
            ("Savings", ["Handling cost on automated claims", "Fraud caught"]),
            ("Costs", ["Build and running costs", "Wrongly flagged claims"]),
            ("Customers and regulators", ["Faster payouts", "Fair treatment", "Explaining decisions"]),
        ]),
        "Automating simple claims should save a lot of handling cost. Fraud savings depend on an estimate, and wrongly flagged genuine customers are a real cost.",
        [
            Q("Size the yearly savings and costs.",
              f"""<p><b>Automation:</b> 120k × 30% = 36k claims × ($180 − $20) = <b>${s_handle:.2f}M</b>.</p>
              <p><b>Fraud:</b> $900M × 3% × 10% = <b>${s_fraud:.1f}M</b>.</p>
              <p><b>Wrongly flagged claims:</b> 120k × 2% × $150 = −${c_fp:.2f}M. <b>Running cost:</b> −$1M.</p>
              <p>Net: <b>${net:.2f}M a year</b>; payback on $4M: <b>{pb:.1f} years</b>.</p>""",
              T(["Item", "$M a year"], [["Automated simple claims", f"+{s_handle:.2f}"], ["Extra fraud caught", f"+{s_fraud:.2f}"], ["Wrongly flagged genuine claims", f"−{c_fp:.2f}"],
                 ["Running cost", "−1.00"], ["Net benefit", f"{net:.2f}"]], title="Exhibit 1 · Yearly benefit", bold_last=True)),
            Q("Which number would you trust least?",
              f"""<p>The fraud saving: both the 3% fraud rate and the extra 10% caught are estimates. Even if fraud savings were zero, the system would still pay back in {build/(s_handle-runc-c_fp):.1f} years on automation alone.</p>"""),
            Q("What safeguards would you build in?",
              """<ul><li>A human reviews every claim the AI wants to reject or flag; the AI never refuses a claim on its own</li><li>Fast-track wrongly flagged customers once cleared</li>
              <li>Test regularly whether some customer groups are flagged more than others</li><li>Keep the reasons for each flag, so decisions can be explained to customers and regulators</li></ul>"""),
        ],
        f"""Invest. Automating simple claims saves about ${s_handle:.1f}M a year and catching more fraud about ${s_fraud:.1f}M; after running costs and wrongly flagged claims, the net benefit is about ${net:.1f}M,
        paying back the $4M in about {pb:.1f} years, and within a year on automation alone. Keep a human in the loop for every flag or rejection, fast-track wrongly flagged customers,
        and test for unfair patterns. Next step: pilot on windscreen claims, where decisions are simplest.""",
        ["Sizes each benefit separately", "Counts the cost of false positives",
         "Tests the case without the least certain benefit", "Designs safeguards for fairness and explainability"],
        "AI business case · automation · false positives")

CASES.append(northpeak())

# ---------------------------------------------------------------- Larchwood Bank (medium-hard): AI coding assistants
def larchwood():
    devs, cost_dev = 2000, 150.0                    # $k a year fully loaded
    coding, speed, adopt = 0.40, 0.25, 0.70
    vendor = 0.55
    seat = 40 * 12 / 1000                            # $k a year
    train = 0.5                                      # $M one-off
    naive_fte = devs * vendor
    fte = devs * coding * speed * adopt
    value = fte * cost_dev / 1000
    cost = devs * seat / 1000
    hire_plan = 150
    assert fte < hire_plan and value > 10 * cost
    return C(
        "Larchwood Bank", "Will AI coding assistants make 2,000 developers 55% faster?",
        "Cost & operations", "Banking", "United Kingdom", 2,
        """Larchwood Bank employs 2,000 software developers at about $150k a year each, fully loaded. A vendor's study says developers complete tasks 55% faster with its AI coding assistant,
        which costs $40 per developer a month. The CTO asks what it's really worth, and whether the bank can cancel some of the 150 new hires planned for next year.""",
        [("How do developers spend their time?", "About 40% writing and changing code; the rest on design, meetings, reviews, testing and support."),
         ("The vendor's study?", "Measured on well-defined coding tasks only."),
         ("Your own pilot?", "Developers who used it regularly spent about 25% less time on coding tasks; about 70% kept using it after a month."),
         ("Other costs?", "About $0.5M for training and security review.")],
        ("What is the AI assistant worth to Larchwood?", [
            ("Time saved", ["Share of time spent coding", "Speed-up on coding", "Adoption"]),
            ("Cost", ["Licences", "Training and security"]),
            ("Using the time", ["Fewer hires", "More work delivered"]),
            ("Risks", ["Code quality and security"]),
        ]),
        "A 55% speed-up on coding tasks doesn't mean 55% more output, because developers spend most of their time on other things, and not everyone will use the tool.",
        [
            Q("What would the vendor's claim imply, and what is a realistic estimate?",
              f"""<p>Read literally, 55% faster across 2,000 developers sounds like {num(naive_fte)} extra developers of capacity. But it only applies to coding time.</p>
              <p>Realistic: 2,000 × 40% coding × 25% less time × 70% using it = <b>{fte:.0f} developers' worth</b> of time, about ${value:.0f}M a year.</p>
              <p>Cost: 2,000 × $480 = ${cost:.2f}M a year plus $0.5M once. <b>Worth roughly {value/cost:.0f}× its cost.</b></p>""",
              WF("2,000 developers", devs, [("Not coding (60%)", -devs * (1 - coding)), ("Coding time not saved (75%)", -devs * coding * (1 - speed)), ("Not using it (30%)", -devs * coding * speed * (1 - adopt))],
                 "Developers' worth of time saved", title="Exhibit 1 · From headcount to real capacity gained", fmt="{:+,.0f}", base_fmt="{:,.0f}")),
            Q("Can the bank cancel the 150 planned hires?",
              f"""<p>Not all of them: the realistic gain is about {fte:.0f} developers' worth, and it is spread across 2,000 people in small slices, not 140 free people.</p>
              <p>A prudent plan: hire about {hire_plan - fte/2:.0f} instead of 150 (bank half the gain), and use the rest to clear the backlog. Review after six months of measured data.</p>"""),
            Q("What could go wrong?",
              """<ul><li><b>Quality:</b> AI-written code can contain bugs or security flaws; keep code review and automated security scanning</li>
              <li><b>Data:</b> make sure code and customer data don't leave the bank's control</li>
              <li><b>Measuring:</b> track delivery speed and defect rates, not just how often the tool is used</li></ul>"""),
        ],
        f"""Buy the assistant for all developers: it costs about ${cost:.1f}M a year and is realistically worth about ${value:.0f}M of developer time ({fte:.0f} developers' worth), about {value/cost:.0f}× its cost.
        But the vendor's 55% applies only to coding, which is 40% of a developer's time, and not everyone uses the tool. So trim next year's hiring modestly, to about {hire_plan - fte/2:.0f} rather than 150,
        and use the rest to clear the backlog. Keep code review and security scanning in place. Next step: measure delivery speed and defects for six months.""",
        ["Breaks the vendor's claim into time share × speed-up × adoption", "Compares value with cost",
         "Is cautious about turning time saved into fewer hires", "Raises quality, security and measurement"],
        "AI productivity · realistic benefit sizing · capacity vs headcount", fmt="Candidate-led")

CASES.append(larchwood())

# ---------------------------------------------------------------- Brinewater Ports (hard): value only at the bottleneck
def brinewater():
    cranes, hours = 12, 8000
    down0, down1 = 0.08, 0.05
    saved = cranes * hours * (down0 - down1)
    moves, margin = 30, 40.0
    peak = 4 / 12
    vendor = saved * moves * margin / 1e6
    real_tp = saved * peak * moves * margin / 1e6
    maint = 0.6
    capex, runc = 1.2, 0.4
    net = real_tp + maint - runc
    vendor_net = vendor + maint - runc
    assert vendor > 2.5 * real_tp and net > 0 and capex / net < 2
    return C(
        "Brinewater Ports", "Predictive maintenance: a $3.5M promise",
        "Investment decision", "Ports and shipping", "Singapore", 3,
        """Brinewater runs a container terminal with 12 ship-to-shore cranes. A vendor offers AI that predicts crane breakdowns from sensor data, claiming it would cut unplanned downtime from 8% to 5%
        and add about $3.5M a year of container moves. It costs $1.2M to install and $0.4M a year to run. The terminal director asks for your view.""",
        [("Crane operation?", "Each crane is available about 8,000 hours a year and moves about 30 containers an hour; each move earns about $40 of margin."),
         ("Is the terminal full?", "For about four months a year (the peak season) ships queue and every crane hour is used. The rest of the year, cranes are often idle."),
         ("Maintenance savings?", "Fewer emergency repairs and overtime would save about $0.6M a year."),
         ("Other bottlenecks?", "None during peak; berths and yard have spare capacity.")],
        ("Is predictive maintenance worth it for Brinewater?", [
            ("Extra crane hours", ["Downtime reduction × hours"]),
            ("Are those hours valuable?", ["Only when cranes are the bottleneck"]),
            ("Other savings", ["Repairs, overtime, safety"]),
            ("Costs", ["Install", "Running"]),
        ]),
        "Extra crane hours are only valuable when ships are waiting. Most of the year cranes are idle, so the vendor is probably overstating the value.",
        [
            Q("Recreate the vendor's claim.",
              f"""<p>Hours saved: 12 cranes × 8,000 × (8% − 5%) = {num(saved)}. Containers: × 30 = {num(saved*moves)}; × $40 = <b>${vendor:.2f}M</b> a year.</p>"""),
            Q("Which of those hours actually add moves?",
              f"""<p>Only during peak season, when ships are queuing: one-third of the year. Off-peak, a crane that would have broken down is simply replaced by an idle one.</p>
              <p>Valuable hours: {num(saved)} × 1/3 = {num(saved*peak)}; × 30 × $40 = <b>${real_tp:.2f}M</b>. Plus maintenance savings $0.6M, less $0.4M running: <b>${net:.2f}M a year</b>.</p>
              <p>Payback on $1.2M: <b>{capex/net:.1f} years</b>. Still a good investment, but the extra moves are worth only a third of what the vendor claims (${real_tp:.2f}M vs ${vendor:.2f}M). On the same net basis as ours (adding maintenance savings, less running costs), the vendor's case would be ${vendor_net:.1f}M.</p>""",
              BAR(["Vendor's case, net", "Realistic, net"], [r(vendor_net, 2), r(net, 2)], title="Exhibit 1 · Net yearly benefit, including maintenance savings and running costs ($M)", ylabel="$M", fmt="{:.1f}", h=2.2, highlight=[1])),
            Q("How could Brinewater get more value from it?",
              """<ul><li><b>Plan maintenance for the quiet months</b>, using the predictions to do repairs off-peak so cranes are fully available in peak season</li>
              <li>Negotiate the vendor's fee as a share of peak-season availability gains</li><li>Extend later to yard equipment if that becomes a bottleneck</li></ul>"""),
        ],
        f"""Invest, but expect about ${net:.1f}M of net yearly benefit, not the ${vendor_net:.1f}M the vendor's figures imply. Extra crane hours only add moves in the four-month peak, when ships queue; for the rest of the year cranes have spare time.
        Including $0.6M of maintenance savings, the system pays back in about {capex/net:.1f} years. Use the predictions to shift maintenance into quiet months, and tie part of the vendor's fee to peak-season availability.
        Risk: sensor data quality on older cranes. Next step: pilot on the four busiest cranes.""",
        ["Rebuilds the vendor's figure", "Values capacity only where it is the bottleneck",
         "Includes maintenance savings and running costs", "Finds a way to raise the value (shift maintenance off-peak)"],
        "AI business case · bottleneck value · peak vs off-peak", fmt="Candidate-led")

CASES.append(brinewater())
