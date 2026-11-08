"""Shared HTML/SVG helpers for the casebook and guide."""
import io, html
import matplotlib
matplotlib.use("Agg")
matplotlib.rcParams["svg.hashsalt"] = "prepforcase"   # stable SVG ids, so re-exports only change what changed
import matplotlib.pyplot as plt
from matplotlib import font_manager

import glob, os
for f in glob.glob(os.path.expanduser("~/.fonts/*.ttf")):
    if True:
        try: font_manager.fontManager.addfont(f)
        except Exception: pass
plt.rcParams.update({
    "font.family": "IBM Plex Sans", "font.size": 9, "axes.edgecolor": "#C9D1DC", "axes.linewidth": 0.8,
    "axes.spines.top": False, "axes.spines.right": False, "xtick.color": "#4A5568", "ytick.color": "#4A5568",
    "axes.labelcolor": "#4A5568", "svg.fonttype": "path", "axes.titleweight": "bold", "axes.titlesize": 10,
    "axes.titlecolor": "#1B2A41", "axes.titlelocation": "left",
})
NAVY = "#0F1B33"; TEAL = "#0A8F9C"; BLUE = "#3B5BDB"; CORAL = "#C2410C"; AMBER = "#B7791F"; GREY = "#B8C2CF"; VIOLET = BLUE
# Validated categorical order (dataviz validator, light surface): teal, burnt orange, blue, amber
SERIES = [TEAL, CORAL, BLUE, AMBER, NAVY, GREY]

def _svg(fig):
    buf = io.StringIO(); fig.savefig(buf, format="svg", bbox_inches="tight", transparent=True); plt.close(fig)
    s = buf.getvalue(); return s[s.find("<svg"):]

import textwrap
def _f(fmt, v): return fmt.format(v).replace('-', '\u2212')
plt.rcParams['text.parse_math'] = False
def _wrap(labels, width=13):
    return [textwrap.fill(str(l), width, break_long_words=False) for l in labels]

def bar(cats, series, title="", ylabel="", w=6.2, h=2.6, horizontal=False, stacked=False, labels=True, fmt="{:,.0f}", highlight=None, colors=None, ylim=None, legend_loc="upper left"):
    """series: dict name -> list"""
    fig, ax = plt.subplots(figsize=(w, h))
    names = list(series); n = len(names)
    import numpy as np
    x = np.arange(len(cats)); width = 0.8 / (1 if stacked else n)
    bottom = np.zeros(len(cats))
    for i, nm in enumerate(names):
        vals = np.array(series[nm], dtype=float)
        col = (colors or SERIES)[i % 6]
        cols = [CORAL if (highlight is not None and j in highlight) else col for j in range(len(cats))] if n == 1 else col
        if horizontal:
            pos = x if stacked else x + (i - (n - 1) / 2) * width
            b = ax.barh(pos, vals, height=width, left=bottom if stacked else None, color=cols, label=nm)
        else:
            pos = x if stacked else x + (i - (n - 1) / 2) * width
            b = ax.bar(pos, vals, width=width, bottom=bottom if stacked else None, color=cols, label=nm)
        if labels:
            for rect, v in zip(b, vals):
                if horizontal:
                    ax.text(rect.get_x() + rect.get_width() + (0.01 * max(vals)), rect.get_y() + rect.get_height() / 2,
                            _f(fmt, v), va="center", fontsize=8, color="#2D3748")
                elif stacked:
                    if v > 0: ax.text(rect.get_x() + rect.get_width() / 2, rect.get_y() + rect.get_height() / 2, _f(fmt, v),
                                      ha="center", va="center", fontsize=7.5, color="white", fontweight="bold")
                else:
                    ax.text(rect.get_x() + rect.get_width() / 2, rect.get_height(), _f(fmt, v), ha="center", va="bottom" if v >= 0 else "top", fontsize=8, color="#2D3748")
        if stacked: bottom = bottom + vals
    if horizontal:
        ax.set_yticks(x); ax.set_yticklabels(cats); ax.invert_yaxis(); ax.set_xlabel(ylabel)
        ax.spines["left"].set_visible(False); ax.tick_params(axis="y", length=0)
    else:
        ax.set_xticks(x); ax.set_xticklabels(_wrap(cats, 16 if len(cats) <= 4 else 12)); ax.set_ylabel(ylabel)
    if ylim: ax.set_ylim(*ylim)
    elif not horizontal and not stacked and labels:
        lo_v = min(min(series[nm]) for nm in names)
        if lo_v < 0:   # room for value labels under negative bars
            lo, hi = ax.get_ylim(); ax.set_ylim(min(lo, lo_v * 1.4), hi)
    ax.grid(axis="x" if horizontal else "y", color="#E6EAF0", linewidth=0.6); ax.set_axisbelow(True)
    if title: ax.set_title(title, pad=8)
    if n > 1: ax.legend(frameon=False, fontsize=8, loc="lower left", bbox_to_anchor=(0, 1.0), ncol=min(n, 4))
    return _svg(fig)

def line(cats, series, title="", ylabel="", w=6.2, h=2.5, fmt="{:,.0f}", labels=True, vline=None, ylim=None):
    fig, ax = plt.subplots(figsize=(w, h))
    for i, (nm, vals) in enumerate(series.items()):
        ax.plot(cats, vals, marker="o", color=SERIES[i % 6], linewidth=2, markersize=4, label=nm)
        if labels:
            for xx, v in zip(cats, vals):
                ax.annotate(_f(fmt, v), (xx, v), textcoords="offset points", xytext=(0, 6), ha="center", fontsize=7.5, color="#2D3748")
    if vline is not None:
        ax.axvline(vline[0], color=CORAL, linestyle="--", linewidth=1)
        ax.text(vline[0], ax.get_ylim()[1], " " + vline[1], color=CORAL, fontsize=8, va="top")
    if ylim: ax.set_ylim(*ylim)
    ax.set_ylabel(ylabel); ax.grid(axis="y", color="#E6EAF0", linewidth=0.6); ax.set_axisbelow(True)
    if title: ax.set_title(title, pad=8)
    if len(series) > 1: ax.legend(frameon=False, fontsize=8, loc="lower left", bbox_to_anchor=(0, 1.0), ncol=len(series))
    return _svg(fig)

def esc(s): return html.escape(str(s))

def table(headers, rows, title=None, note=None, align=None, bold_last=False, highlight_rows=()):
    a = align or (["l"] + ["r"] * (len(headers) - 1))
    th = "".join(f'<th class="{a[i]}">{h}</th>' for i, h in enumerate(headers))
    trs = []
    for ri, r in enumerate(rows):
        cls = []
        if bold_last and ri == len(rows) - 1: cls.append("total")
        if ri in highlight_rows: cls.append("hl")
        tds = "".join(f'<td class="{a[i]}">{c}</td>' for i, c in enumerate(r))
        trs.append(f'<tr class="{" ".join(cls)}">{tds}</tr>')
    t = f'<div class="ex-title">{title}</div>' if title else ""
    n = f'<div class="ex-note">{note}</div>' if note else ""
    return f'<div class="exhibit">{t}<table class="data"><thead><tr>{th}</tr></thead><tbody>{"".join(trs)}</tbody></table>{n}</div>'

def chart(svg, title=None, note=None):
    t = f'<div class="ex-title">{title}</div>' if title else ""
    n = f'<div class="ex-note">{note}</div>' if note else ""
    return f'<div class="exhibit">{t}<div class="chart">{svg}</div>{n}</div>'

def tree(root, branches):
    """branches: list of (header, [items])"""
    cols = "".join(
        f'<div class="branch"><div class="bh">{h}</div><ul>' + "".join(f"<li>{i}</li>" for i in items) + "</ul></div>"
        for h, items in branches)
    return f'<div class="tree"><div class="root">{root}</div><div class="branches" style="grid-template-columns:repeat({len(branches)},1fr)">{cols}</div></div>'

def waterfall(start_label, start, steps, end_label, w=6.2, h=2.7, fmt="{:+,.1f}", base_fmt="{:,.1f}", ylabel=""):
    """Bridge chart: start bar, signed steps, end bar. steps: list of (label, delta)."""
    import numpy as np
    labels = [start_label] + [s[0] for s in steps] + [end_label]
    fig, ax = plt.subplots(figsize=(w, h))
    level = start
    ax.bar(0, start, color=NAVY, width=0.6)
    ax.text(0, start, _f(base_fmt, start), ha="center", va="bottom", fontsize=8, color="#2D3748")
    for i, (lab, d) in enumerate(steps, start=1):
        lo, hi = sorted([level, level + d])
        col = TEAL if d >= 0 else CORAL
        ax.bar(i, hi - lo, bottom=lo, color=col, width=0.6)
        ax.text(i, hi, _f(fmt, d), ha="center", va="bottom", fontsize=8, color="#2D3748")
        ax.plot([i - 1 + 0.3, i - 0.3], [level, level], color="#A0AEC0", linewidth=0.8)
        level += d
    end = level
    n = len(steps) + 1
    ax.plot([n - 1 + 0.3, n - 0.3], [end, end], color="#A0AEC0", linewidth=0.8)
    ax.bar(n, end, color=NAVY, width=0.6)
    ax.text(n, max(end, 0), _f(base_fmt, end), ha="center", va="bottom", fontsize=8, color="#2D3748")
    ax.axhline(0, color="#A0AEC0", linewidth=0.8)
    ax.set_xticks(range(len(labels))); ax.set_xticklabels(_wrap(labels, 12), fontsize=8)
    ax.set_ylabel(ylabel)
    ax.grid(axis="y", color="#E6EAF0", linewidth=0.6); ax.set_axisbelow(True)
    return _svg(fig)
