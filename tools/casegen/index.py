# Writes src/content/caseIndex.json: a small list of every case (no answers), so pages like Home
# can pick a case of the day without downloading the whole casebook. Run after fix_original15.py.
import json, os
CONTENT = os.path.join(os.path.dirname(__file__), "..", "..", "src", "content")
cases = json.load(open(os.path.join(CONTENT, "cases.json"), encoding="utf-8"))
idx = [{k: c[k] for k in ("id", "slug", "title", "sub", "type", "industry", "diff", "time")} for c in cases]
json.dump(idx, open(os.path.join(CONTENT, "caseIndex.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("caseIndex.json:", len(idx), "cases")
