"""Append the generated cases (casegen b01, f01-f20) to the site's cases.json after the original 15."""
import sys, importlib, re, json
import os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
CONTENT = os.path.join(HERE, "..", "..", "src", "content")
SITE = os.path.join(CONTENT, "cases.json")

def slim(s):
    s = re.sub(r"<metadata>.*?</metadata>", "", s, flags=re.S)
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    s = re.sub(r">\s+<", "><", s)
    return re.sub(r"\s{2,}", " ", s)

def slugify(t): return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")

TYPE_FIX = {"Investment decision": "Investment / capacity"}

site = json.load(open(SITE, encoding="utf-8"))
orig = [c for c in site if c["id"] <= 15]
assert len(orig) == 15
slugs = {c["slug"] for c in orig}
new = []
for m in ["b01"] + ["f%02d" % i for i in range(1, 21)]:
    for c in importlib.import_module(m).CASES:
        c = dict(c)
        c["type"] = TYPE_FIX.get(c["type"], c["type"])
        for q in c["questions"]:
            ex = q.get("exhibit")
            if ex and ex["kind"] == "chart": ex["svg"] = slim(ex["svg"])
        s = slugify(c["title"])
        assert s not in slugs, s
        slugs.add(s)
        c["id"], c["slug"] = 15 + len(new) + 1, s
        assert set(c) == set(orig[0]), set(c) ^ set(orig[0])
        new.append(c)
out = orig + new
json.dump(out, open(SITE, "w", encoding="utf-8"), ensure_ascii=True)
print(len(orig), "+", len(new), "=", len(out))

open(os.path.join(CONTENT, "caseCount.ts"), "w").write(f"// Written by the case export script. Number of cases in cases.json.\nexport const CASE_COUNT = {len(out)}\n")
print("caseCount.ts written")
