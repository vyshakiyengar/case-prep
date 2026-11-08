"""Service throughput and capacity. Concepts from CaseCraft #071-#075; rewritten, with the constraint (rooms vs staff) identified correctly."""
from lib import *
CASES = []

# ---------------------------------------------------------------- Westmoor Clinic (easy-medium): doctors, not rooms
def westmoor():
    docs, doc_hours, appt = 6, 7.0, 20.0
    rooms, open_h, room_min = 10, 9.0, 30.0
    demand = 160
    cap_doc = docs * doc_hours * 60 / appt
    cap_room = rooms * open_h * 60 / room_min
    cap_doc2 = docs * doc_hours * 60 / 15.0
    nurse_cost = 2 * 70.0                               # $k a year for two intake nurses
    assert cap_doc < demand < cap_room and cap_doc2 > demand
    return C(
        "Westmoor Clinic", "Patients wait three weeks. Build more rooms?",
        "Cost & operations", "Healthcare services", "United Kingdom", 1,
        """Westmoor is a private outpatient clinic. Patients wait about three weeks for an appointment, and some go elsewhere. The practice manager wants to convert storage space into
        four more consultation rooms for $600k. The owners ask whether that will cut waiting times.""",
        [("Rooms and hours?", "10 consultation rooms, open 9 hours a day. Each appointment holds a room for about 30 minutes, including cleaning and set-up."),
         ("Doctors?", "6 doctors, each seeing patients for about 7 hours a day. Each appointment takes about 20 minutes of doctor time, much of it taking history and measurements."),
         ("Demand?", "About 160 appointment requests a working day.")],
        ("How can Westmoor see more patients?", [
            ("Room capacity", ["Rooms × hours ÷ time per appointment"]),
            ("Doctor capacity", ["Doctors × hours ÷ doctor time per appointment"]),
            ("Which one limits us?", ["Compare with demand"]),
        ]),
        "More rooms only help if rooms are the constraint. I'd compare room capacity with doctor capacity first.",
        [
            Q("How many patients a day can the rooms handle, and how many can the doctors see?",
              f"""<p>Rooms: 10 × 9 hours × 2 an hour = <b>{cap_room:.0f}</b>. Doctors: 6 × 7 hours × 3 an hour = <b>{cap_doc:.0f}</b>.</p>
              <p>Demand is {demand} a day. <b>Doctors are the bottleneck</b>; rooms already have spare capacity. Four more rooms would add nothing.</p>""",
              BAR(["Room capacity", "Doctor capacity", "Demand"], [cap_room, cap_doc, demand], title="Exhibit 1 · Patients a day", ylabel="Patients", h=2.3, highlight=[1])),
            Q("How could Westmoor raise doctor capacity without hiring doctors?",
              f"""<p>Give history-taking and measurements to <b>intake nurses</b> before the doctor comes in: if doctor time falls from 20 to 15 minutes, capacity rises to 6 × 7 × 4 = <b>{cap_doc2:.0f}</b>, above demand.</p>
              <p>Cost: two nurses at about $70k = ${nurse_cost:.0f}k a year, against $600k for rooms that wouldn't help. Rooms still fit: {cap_doc2:.0f} patients need {cap_doc2*room_min/60:.0f} room-hours, against {rooms*open_h:.0f} available.</p>"""),
            Q("What else could help?",
              """<ul><li>Video appointments for follow-ups, which need no room</li><li>Reminders to cut no-shows, so doctor time isn't wasted</li><li>Longer doctor sessions on the busiest days</li></ul>"""),
        ],
        f"""Don't build the rooms: doctors, not rooms, limit Westmoor to about {cap_doc:.0f} patients a day against {demand} requests, and the rooms can already handle {cap_room:.0f}.
        Hire two intake nurses to take histories and measurements, cutting doctor time to 15 minutes and lifting capacity to about {cap_doc2:.0f} a day for about ${nurse_cost:.0f}k a year.
        Risk: doctors must trust the nurses' notes. Next step: trial with two doctors for a month and measure appointment length.""",
        ["Computes capacity for both rooms and doctors", "Identifies the real constraint",
         "Rejects a fix aimed at the wrong constraint", "Finds a cheaper fix that shifts work off the bottleneck"],
        "Capacity · bottleneck · task shifting")

CASES.append(westmoor())

# ---------------------------------------------------------------- Willow Physio (medium): no-shows
def willow():
    ther, slots, days, fee = 40, 16, 250, 90.0
    appts = ther * slots * days
    ns0 = 0.15
    lost0 = appts * ns0 * fee / 1e6
    ns_sms, sms_cost = 0.09, 0.10
    gain_sms = appts * (ns0 - ns_sms) * fee / 1e6 - appts * sms_cost / 1e6
    ns_dep, lost_book = 0.05, 0.05
    gain_dep = appts * (1 - lost_book) * (1 - ns_dep) * fee / 1e6 - appts * (1 - ns0) * fee / 1e6
    over = 1
    p_all = 1 - ns_sms
    # one extra booking a day per therapist on top of 16; extra patient only seen if someone else no-shows; otherwise overtime
    exp_extra = over * ther * days * (1 - ns_sms) * fee / 1e6
    assert gain_sms > 0 and gain_dep < gain_sms and lost0 > 2
    return C(
        "Willow Physio", "One appointment in seven is a no-show",
        "Cost & operations", "Healthcare services", "Australia", 2,
        """Willow runs 40 physiotherapists across Sydney, each with 16 half-hour appointments a day, 250 days a year, at $90 an appointment. About 15% of patients don't turn up and don't cancel.
        The CEO asks how much no-shows cost and what to do about them.""",
        [("Reminders?", "None today. In a trial, an SMS reminder the day before cut no-shows to 9%. Each SMS costs about $0.10."),
         ("Deposits?", "Taking a card deposit at booking cut no-shows to 5% in another clinic group, but about 5% of patients chose not to book at all."),
         ("Overbooking?", "Some clinics book one extra patient a day per therapist, expecting at least one no-show."),
         ("Waiting list?", "Most clinics have a short waiting list that can fill the odd late cancellation, but it could not replace a lasting fall in bookings.")],
        ("How should Willow reduce the cost of no-shows?", [
            ("Size the problem", ["Appointments × no-show rate × fee"]),
            ("Options", ["Reminders", "Deposits", "Overbooking"]),
            ("Patient experience", ["Fairness", "Waiting times"]),
        ]),
        "No-shows waste a fixed cost: the physio is paid anyway. Reminders are cheap; deposits work but may put patients off.",
        [
            Q("How much do no-shows cost Willow?",
              f"""<p>Appointments: 40 × 16 × 250 = {num(appts)}. No-shows: 15% = {num(appts*ns0)}. Lost revenue: <b>${lost0:.2f}M a year</b>, and the physios are paid anyway.</p>"""),
            Q("Compare reminders and deposits.",
              f"""<p><b>SMS reminders:</b> no-shows fall to 9%: {num(appts*(ns0-ns_sms))} more appointments × $90 = ${appts*(ns0-ns_sms)*fee/1e6:.2f}M, less SMS costs ${appts*sms_cost/1e6:.2f}M: <b>+${gain_sms:.2f}M</b>.</p>
              <p><b>Deposits:</b> 5% fewer bookings, but only 5% no-shows: attended appointments = 95% × 95% = 90.25% of today's slots, against 85% now: <b>+${gain_dep:.2f}M</b>.</p>
              <p><b>So-what:</b> reminders gain more, cost almost nothing and don't put patients off.</p>""",
              BAR(["SMS reminders", "Deposits"], [r(gain_sms, 2), r(gain_dep, 2)], title="Exhibit 1 · Extra revenue a year ($M)", ylabel="$M", fmt="{:.2f}", h=2.2, highlight=[0])),
            Q("Should Willow also overbook?",
              f"""<p>With reminders, about 9% still don't come, so a physio with 16 bookings expects about 1.4 no-shows a day. One extra booking a day would usually be seen in a no-show gap,
              adding up to about ${exp_extra:.1f}M a year. But on days when everyone turns up, a patient waits or the physio works late. Use it only for therapists and times with high no-show rates,
              and use the waiting list to fill late cancellations first.</p>"""),
        ],
        f"""No-shows cost Willow about ${lost0:.1f}M a year in lost revenue. Start with SMS reminders the day before: they cut no-shows from 15% to about 9% and add about ${gain_sms:.2f}M a year for almost no cost,
        more than deposits (${gain_dep:.2f}M), which also put some patients off. Then fill late gaps from the waiting list, and overbook only where no-show rates stay high.
        Risk: overbooking can make patients wait. Next step: roll out reminders to all clinics this month.""",
        ["Sizes the problem in dollars", "Compares options including their side effects",
         "Counts lost bookings from deposits", "Treats overbooking carefully"],
        "Capacity utilisation · no-shows · option comparison")

CASES.append(willow())

# ---------------------------------------------------------------- Summit Dialysis (medium-hard): shift vs chairs
def summit():
    chairs, shifts, days, sessions_wk = 20, 2, 6, 3
    cap = chairs * shifts * days / sessions_wk
    waiting = 25
    rev, var = 300.0, 90.0                           # $ per session
    # option A: third (evening) shift on Mon/Wed/Fri
    evA_sessions = chairs * 3
    patientsA = evA_sessions / sessions_wk
    nurses_per_chair = 0.25
    shift_staff = chairs * nurses_per_chair * 1 + 1  # nurses + one technician
    shift_pay = 0.40                                  # $k per staff shift
    staff_cost = shift_staff * 3 * 52 * shift_pay
    gainA = evA_sessions * 52 * (rev - var) / 1000 - staff_cost
    # option B: 6 more chairs, both shifts, six days
    add_ch = 6
    patientsB = add_ch * shifts * days / sessions_wk
    capexB = add_ch * 60.0 + 300.0                   # $k chairs and building works
    nurses_B = add_ch * nurses_per_chair * shifts * days * 52 * shift_pay   # $k
    gainB = add_ch * shifts * days * 52 * (rev - var) / 1000 - nurses_B
    smallC = 8                                        # chairs staffed on Tue/Thu/Sat evenings
    patientsC = smallC * 3 / sessions_wk
    staffC = (smallC * nurses_per_chair + 1) * 3 * 52 * shift_pay
    gainC = smallC * 3 * 52 * (rev - var) / 1000 - staffC
    assert patientsA < waiting and patientsB < waiting and patientsA + patientsC >= waiting and gainA > 0 and gainB > 0 and gainC > 0 and capexB / gainB < 3
    return C(
        "Summit Dialysis", "25 patients waiting for a dialysis slot",
        "Cost & operations", "Healthcare services", "United States", 2,
        """Summit runs a dialysis centre with 20 chairs. Patients with kidney failure need three 4-hour sessions a week, so slots are fixed for months at a time. The centre is full and 25 patients are on a waiting list,
        travelling to a centre an hour away. The director asks how to make room for them.""",
        [("Current schedule?", "Two shifts a day (morning and afternoon), Monday to Saturday. Patients come either Mon/Wed/Fri or Tue/Thu/Sat."),
         ("Staffing?", "One nurse per four chairs plus one technician per shift. A staff shift costs about $400."),
         ("Money?", "Insurers pay about $300 per session. Supplies and drugs cost about $90."),
         ("Options?", "(A) An evening shift on Mon/Wed/Fri. (B) Six more chairs in an unused room, for about $660k of chairs and works.")],
        ("How can Summit treat the 25 waiting patients?", [
            ("Capacity today", ["Chairs × shifts × days ÷ 3 sessions"]),
            ("Option A: evening shift", ["Patients added", "Staff cost"]),
            ("Option B: more chairs", ["Patients added", "Investment and staff"]),
            ("Patient needs", ["Evening slots suit working patients"]),
        ]),
        "The chairs are idle in the evenings, so an extra shift uses existing equipment. It may not fit all 25 patients, though.",
        [
            Q("How many patients can Summit treat today?",
              f"""<p>20 chairs × 2 shifts × 6 days = 240 sessions a week ÷ 3 per patient = <b>{cap:.0f} patients</b>.</p>"""),
            Q("Compare the two options.",
              f"""<p><b>A: evening shift Mon/Wed/Fri:</b> 20 chairs × 3 evenings = 60 sessions = <b>{patientsA:.0f} patients</b>. Staff: 5 nurses + 1 technician = 6 shifts × 3 evenings × 52 weeks × $400 = ${staff_cost:.0f}k.
              Yearly gain: 60 × 52 × ($300 − $90) − ${staff_cost:.0f}k = <b>${gainA:.0f}k</b>, with no investment.</p>
              <p><b>B: six more chairs:</b> 6 × 2 × 6 ÷ 3 = <b>{patientsB:.0f} patients</b>. Investment ${capexB:.0f}k; extra nurses (1.5 per shift) ${nurses_B:.0f}k a year; the existing technician covers the room. Yearly gain: ${gainB:.0f}k; payback {capexB/gainB:.1f} years.</p>""",
              T(["", "A: evening shift", "B: six chairs"], [["Patients added", f"{patientsA:.0f}", f"{patientsB:.0f}"], ["Investment ($k)", "0", f"{capexB:.0f}"],
                 ["Yearly gain ($k)", f"{gainA:.0f}", f"{gainB:.0f}"]], title="Exhibit 1 · Options")),
            Q("What would you do?",
              f"""<p>Start the Mon/Wed/Fri evening shift now: it treats {patientsA:.0f} patients within weeks, needs no investment and suits patients who work.</p>
              <p>For the other {waiting-patientsA:.0f}, a small Tue/Thu/Sat evening shift on {smallC} chairs (2 nurses and a technician) adds {patientsC:.0f} places and about ${gainC:.0f}k a year. Together that's
              {patientsA+patientsC:.0f} places, enough for all 25, without spending ${capexB:.0f}k on chairs.</p>
              <p>Keep the six chairs as the next step if the waiting list grows again. Check first that enough nurses will work evenings.</p>"""),
        ],
        f"""Treat the waiting patients in two steps. First, open an evening shift on Mon/Wed/Fri, which uses idle chairs and adds {patientsA:.0f} places with no investment and about ${gainA:.0f}k a year of margin.
        Then run a smaller evening shift on Tue/Thu/Sat with {smallC} chairs for another {patientsC:.0f} places, so all 25 waiting patients can be treated locally without
        spending ${capexB:.0f}k on new chairs; keep that investment for when the list grows again. Risk: recruiting nurses for evenings.
        Next step: survey waiting patients on evening slots and start recruiting.""",
        ["Computes capacity in patients, not sessions", "Uses idle hours before buying equipment",
         "Compares options on patients added and economics", "Meets the full need without over-building"],
        "Capacity planning · shifts vs assets · healthcare operations")

CASES.append(summit())

# ---------------------------------------------------------------- Lantern Vaccination Centre (hard): sequential bottlenecks
def lantern():
    st = {"Check-in": (4, 1.5), "Screening": (6, 3.0), "Vaccination": (8, 2.0)}   # staff, minutes per person
    chairs, obs = 60, 15.0
    def cap(st):
        c = {k: n * 60 / m for k, (n, m) in st.items()}
        c["Observation"] = chairs * 60 / obs
        return c
    c0 = cap(st)
    b0 = min(c0, key=c0.get)
    target = 200
    online = 0.70
    scr = online * 1.0 + (1 - online) * 3.0
    st1 = dict(st, Screening=(6, scr))
    c1 = cap(st1); b1 = min(c1, key=c1.get)
    st2 = dict(st1, **{"Check-in": (5, 1.5)})
    c2 = cap(st2); b2 = min(c2, key=c2.get)
    nurses_needed = target * 3.0 / 60
    assert b0 == "Screening" and b1 == "Check-in" and c2[b2] >= target and c1["Screening"] >= target
    return C(
        "Lantern Vaccination Centre", "From 120 to 200 people an hour",
        "Public sector", "Public health", "Canada", 3,
        """A city health department runs a mass vaccination centre in a sports hall during a flu-and-COVID campaign. It vaccinates about 120 people an hour; the target is 200.
        The centre manager wants to hire more nurses. The deputy health officer asks you how to reach 200 an hour at the lowest cost.""",
        [("Process?", "Check-in desk, then a screening interview (health questions, consent), then vaccination, then 15 minutes' observation in a chair."),
         ("Staff and times?", "Check-in: 4 desks, 1.5 minutes each. Screening: 6 nurses, 3 minutes each. Vaccination: 8 vaccinators, 2 minutes each. Observation: 60 chairs."),
         ("Online forms?", "If people complete health questions online before they arrive, screening takes about 1 minute. About 70% would do so if asked when booking.")],
        ("How can the centre reach 200 people an hour?", [
            ("Capacity per station", ["Staff × 60 ÷ minutes each", "Chairs ÷ observation time"]),
            ("Bottleneck", ["Slowest station today", "Next bottleneck after each fix"]),
            ("Cheapest fixes", ["Remove work vs add staff"]),
        ]),
        "Throughput is set by the slowest step. Screening looks slowest; but after fixing it, another step will probably limit the flow.",
        [
            Q("Work out the capacity of each station per hour. Where is the bottleneck?",
              f"""<p>Check-in: 4 × 60 ÷ 1.5 = {c0['Check-in']:.0f}. Screening: 6 × 60 ÷ 3 = <b>{c0['Screening']:.0f}</b>. Vaccination: 8 × 30 = {c0['Vaccination']:.0f}. Observation: 60 chairs × 4 an hour = {c0['Observation']:.0f}.</p>
              <p><b>Screening is the bottleneck</b> at 120 an hour.</p>""",
              BAR(list(c0), [r(v, 0) for v in c0.values()], title="Exhibit 1 · People per hour by station", ylabel="People per hour", h=2.3, highlight=[1])),
            Q("The manager wants more screening nurses. How many would be needed, and is there a cheaper way?",
              f"""<p>For 200 an hour at 3 minutes each: 200 × 3 ÷ 60 = <b>{nurses_needed:.0f} nurses</b>, 4 more.</p>
              <p>Cheaper: ask people to complete health questions online. Average screening time: 70% × 1 + 30% × 3 = {scr:.1f} minutes, so 6 nurses screen {c1['Screening']:.0f} an hour.</p>
              <p>But now <b>check-in ({c1['Check-in']:.0f} an hour) is the bottleneck</b>.</p>"""),
            Q("How do you get to 200?",
              f"""<p>Add one check-in desk (5 desks: {c2['Check-in']:.0f} an hour). Now every station handles at least 200: the slowest is {b2.lower()} at {c2[b2]:.0f}.</p>
              <p>Total change: online forms plus one desk clerk, instead of four extra nurses. Check observation: at 200 an hour, 200 × 15 ÷ 60 = 50 people seated at once, within 60 chairs.</p>""",
              T(["Station", "Today", "+ online forms", "+ one check-in desk"], [[k, f"{c0[k]:.0f}", f"{c1[k]:.0f}", f"{c2[k]:.0f}"] for k in c0], title="Exhibit 2 · Capacity per hour")),
        ],
        f"""Reach 200 an hour by removing work rather than adding nurses. Screening limits the centre to 120 an hour; asking people to complete health questions online cuts screening time to about {scr:.1f} minutes,
        lifting it to {c1['Screening']:.0f} an hour, and one extra check-in desk clears the next bottleneck, taking every station to at least {c2[b2]:.0f}. That needs one clerk instead of four extra nurses.
        Risk: fewer people complete forms online than expected, so keep two nurses on call. Next step: add the online form to the booking confirmation.""",
        ["Computes capacity for every station, including observation chairs", "Finds the bottleneck and the next one",
         "Prefers removing work to adding staff", "Checks that every station meets the target"],
        "Process throughput · moving bottlenecks · public services", fmt="Candidate-led")

CASES.append(lantern())
