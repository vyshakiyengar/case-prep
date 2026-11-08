"""Helpers for writing cases. Every number shown is computed here, so exhibits and answers agree."""
import re, sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit

def T(headers, rows, title=None, note=None, bold_last=False, align=None):
    rows = [[str(c) for c in r] for r in rows]
    for r in rows:
        assert len(r) == len(headers), f'row width {r} vs {headers}'
    return {"kind": "table", "headers": headers, "rows": rows, "title": title, "note": note,
            "align": align or (["l"] + ["r"] * (len(headers) - 1)), "boldLast": bold_last}

def BAR(cats, series, title=None, note=None, **kw):
    if not isinstance(series, dict): series = {"": series}
    return {"kind": "chart", "svg": kit.bar(cats, series, **kw), "title": title, "note": note}

def LINE(cats, series, title=None, note=None, **kw):
    if not isinstance(series, dict): series = {"": series}
    return {"kind": "chart", "svg": kit.line(cats, series, **kw), "title": title, "note": note}

def Q(q, answer, exhibit=None, note=None):
    d = {"q": q, "exhibit": exhibit, "answer": " ".join(answer.split())}
    if note: d["note"] = note
    return d

def C(title, sub, type, industry, geo, diff, prompt, clarify, tree, hypothesis, questions, reco, great,
      skills, fmt="Interviewer-led", time="25-30 min"):
    assert diff in (1, 2, 3)
    return dict(title=title, sub=sub, type=type, industry=industry, geo=geo, diff=diff, fmt=fmt, time=time, skills=skills,
                prompt=" ".join(prompt.split()), clarify=[{"q": a, "a": b} for a, b in clarify],
                structure={"root": tree[0], "branches": [{"head": h, "items": i} for h, i in tree[1]]},
                hypothesis=" ".join(hypothesis.split()), questions=questions, reco=" ".join(reco.split()), great=great)

# ---- number formatting -------------------------------------------------
def r(x, dp=1):
    """Round half away from zero, like people do by hand."""
    from decimal import Decimal, ROUND_HALF_UP
    q = Decimal(1).scaleb(-dp)
    return float(Decimal(str(x)).quantize(q, rounding=ROUND_HALF_UP))

def num(x, dp=0):
    """dp < 0 rounds to tens, hundreds...: num(81234, -2) -> 81,200"""
    if dp < 0:
        v = round(x / 10 ** -dp) * 10 ** -dp
        return ("−" if v < 0 else "") + f"{abs(v):,.0f}"
    v = r(x, dp)
    s = f"{abs(v):,.{dp}f}"
    return ("−" if v < 0 else "") + s

def money(x, cur="$", dp=1, unit="M"):
    v = r(x, dp)
    return ("−" if v < 0 else "") + f"{cur}{abs(v):,.{dp}f}{unit}"

def pct(x, dp=0):
    """x is a fraction: 0.153 -> 15%"""
    v = r(x * 100, dp)
    return ("−" if v < 0 else "") + f"{abs(v):.{dp}f}%"

def signed(x, dp=1, cur="", unit=""):
    v = r(x, dp)
    return ("+" if v > 0 else "−" if v < 0 else "") + f"{cur}{abs(v):,.{dp}f}{unit}"

def close(a, b, tol=1e-6):
    assert abs(a - b) <= tol * max(1, abs(a), abs(b)), f'{a} != {b}'
    return True

def WF(start_label, start, steps, end_label, title=None, note=None, **kw):
    return {"kind": "chart", "svg": kit.waterfall(start_label, start, steps, end_label, **kw), "title": title, "note": note}
