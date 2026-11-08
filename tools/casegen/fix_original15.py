"""Accuracy fixes for the original 15 cases in cases.json (from the independent review)."""
import json, re, sys
import os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import kit
def slim(s):
    s = re.sub(r"<metadata>.*?</metadata>", "", s, flags=re.S)
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    s = re.sub(r">\s+<", "><", s)
    return re.sub(r"\s{2,}", " ", s)
P = os.path.join(HERE, "..", "..", "src", "content", "cases.json")
cs = json.load(open(P, encoding="utf-8")); by = {c["id"]: c for c in cs}
def sub(cid, path, old, new):
    o = by[cid]; keys = re.findall(r"\w+|\[\d+\]", path)
    for k in keys[:-1]: o = o[int(k[1:-1])] if k.startswith("[") else o[k]
    last = keys[-1]; last = int(last[1:-1]) if last.startswith("[") else last
    v = o[last]
    if new in v: return  # already applied
    assert v.count(old) == 1, (cid, path, old[:50], v.count(old)); o[last] = v.replace(old, new)
# 1 Coastal Brew
sub(1, "questions[3].answer", "After: 2.43M × $4.10 ≈ $10.0M. <b>Gain ≈ $1.5M a year.</b>", "After: 2.43M × $4.10 ≈ $9.95M. <b>Gain ≈ $1.45M a year.</b>")
sub(1, "questions[3].answer", "≈ $0.85M, so ≈ $1.5M. ✓", "≈ $0.85M, so ≈ $1.45M. ✓")
sub(1, "reco", "worth about $1.5M a year;", "worth about $1.45M a year;")
sub(1, "reco", "Next step: test the price increa", "The price rise closes about $1.45M of the $5.5M gap to the $10M target; the rest has to come from moving orders to click-and-collect and lower commissions, which we should size next. Next step: test the price increa")
sub(1, "great[2]", "Sanity-checks the $1.5M a second way", "Sanity-checks the ~$1.45M a second way")
# 2 Nordwind
sub(2, "prompt", "Their goal: $40M of US revenue within five years,", "Their goal: $44M of US revenue (measured at Nordwind's selling price to shops) within five years,")
c2 = by[2]["clarify"][2]
if c2["a"].startswith("Use $1"): c2["q"], c2["a"] = "How is the revenue goal measured?", "At Nordwind's selling price to shops, not at retail prices."
sub(2, "questions[2].answer", "At year-5 volume (18,500): A = $8.5M, B = $10.65M.", "At year-5 volume (~18,300): A ≈ $8.4M, B ≈ $10.5M.")
sub(2, "questions[2].answer", "15k → 18.5k,", "15k → 18.3k,")
sub(2, "reco", "Hitting $40M needs about 8%", "Hitting $44M needs about 8%")
# 3 Meridian
sub(3, "questions[2].answer", "<b>Funding:</b> ~$230M over 5 years", "<b>Funding:</b> ~$230M over 5 years, plus upgrade capex for the acquired hospitals (ask the interviewer),")
sub(3, "reco", "(1) fix the three under-filled hospitals and lift occupancy to 75% (+~$40M),", "(1) lift occupancy across all 12 hospitals to the 75% peer benchmark, starting with the three under-filled ones (+~$40M; fixing only those three gives about +$26M),")
q3 = by[3]["questions"][1]
if "means every hospital" not in q3["answer"]:
    q3["answer"] += "<p>Note: a 75% <i>average</i> means every hospital at the peer benchmark. Lifting only H10-H12 to 75% takes the average to about 70% (about +$26M); the nine established hospitals (about 69%) must also rise.</p>"
# 4 PackRight
sub(4, "prompt", "a recycler with revenue of $100M and EBITDA of $12M.", "a recycler with revenue of $120M and EBITDA of $12M.")
sub(4, "questions[2].q", "will pay a 5% premium", "will pay a 3% premium")
# 5 FitHub
sub(5, "reco", "returns ~2.7× ($245M ÷ $90M).", "returns ~2.7× if we still exit at 8× ($245M ÷ $90M), or ~2.55× even if the exit multiple only matches our 7.6× entry.")
# 8 Desert Dairy
sub(8, "questions[1].answer", "Payback ≈ <b>2 years</b>.", "Payback ≈ <b>2.5–3 years</b> from today ($0 in year 1, $8M in year 2, $18M in year 3), even if the new plant later takes over this volume.")
sub(8, "reco", "it pays back in about 2 years", "it pays back in under 3 years")
# 9 SkyLine
sub(9, "reco", "then look at the testing stage, where SkyLine is actually faster than its peers.", "then tackle the 2 extra days still spent waiting for parts (4 vs 2); testing needs no work, as SkyLine is already a day faster than its peers there.")
ex9 = by[9]["questions"][1]["exhibit"]
ex9["svg"] = slim(kit.bar(["Inspection", "Waiting for parts", "Repairs", "Waiting for approvals", "Testing & release"],
                          {"SkyLine": [3, 9, 10, 3, 3], "Best airlines": [3, 2, 10, 1, 4]}, fmt="{:.0f}", w=6.4, h=2.6))
# 10 Al Noor
for q in by[10]["questions"]:
    ex = q.get("exhibit")
    if isinstance(ex, dict) and ex.get("kind") == "chart" and ex.get("note") and "arrive by road" not in ex["note"]:
        ex["note"] += " Most GCC visitors arrive by road; Europe, South Asia and others arrive by air."
# 11 Plugged In
sub(11, "reco", "worth about $300M,", "worth about $290M,")
sub(11, "questions[1].answer", "<b>Cross-check:</b> ~80% of new-EV owners with parking install one, so units should track EV sales closely",
    "<b>Cross-check from the stock side:</b> EVs on the road × share with a home charger, change year on year; or chargers sold as reported by the makers")
# 13 Vertex
sub(13, "questions[2].answer", "Loss = 2% × 3.3M ≈ 67k", "Loss = 2% × 3.3M = 66k")
# 15 LinguaLeap: labels overlapped; draw lines without per-point labels
for q in by[15]["questions"]:
    ex = q.get("exhibit")
    if isinstance(ex, dict) and ex.get("kind") == "chart" and "WAU" in (ex.get("title") or ""):
        ex["svg"] = slim(kit.line(["Wk -4", "Wk -3", "Wk -2", "Wk -1", "This wk"], {"iOS": [100, 101, 100, 101, 100], "Android": [100, 100, 99, 100, 82]},
                                  fmt="{:.0f}", w=6.0, h=2.4, ylim=(75, 106), labels=False))
        if "Index values" not in ex["note"]: ex["note"] += " Index values: iOS stays at 100–101; Android is 99–100 until this week, then 82."
json.dump(cs, open(P, "w", encoding="utf-8"), ensure_ascii=True)
print("patched")
