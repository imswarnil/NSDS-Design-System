#!/usr/bin/env python3
"""NS Design System — static font instance build.

The three N&M cuts ship as latin-subset VARIABLE woff2s: that is what the web
loads, and it is the source of truth. This script derives the redistributable
STATIC family from them — one file per named weight — so the type family can
be open-sourced and installed like any other font:

    fonts/static/woff2/*.woff2   web use where variable fonts are not an option
    fonts/static/ttf/*.ttf       desktop install (Figma, Sketch, Word, print)

Nothing in the design system consumes these; they exist so `fonts/` is a
complete, self-contained OFL package that someone can download and use.

Requires:  pip install "fonttools[woff]" brotli
Run:       python3 scripts/build-fonts.py
"""
from __future__ import annotations

import os
import shutil
import sys

try:
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
except ImportError:  # pragma: no cover — tooling guard, not a code path
    sys.exit("fontTools is required:  pip install 'fonttools[woff]' brotli")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "fonts")
OUT_TTF = os.path.join(FONTS, "static", "ttf")
OUT_WOFF2 = os.path.join(FONTS, "static", "woff2")

# (file, family, postscript prefix, [(weight, style name)])
# The weight lists are the system's named weights plus the two the OFL package
# needs to be a complete family. "Book" (450) is not a conventional name — it
# is this system's reading regular, documented in fonts/README.md, and it ships
# as a static so the printed/desktop family matches the web one.
FAMILIES = [
    ("nmdisplay-var-latin.woff2", "N&M Display", "NMDisplay", [
        (200, "ExtraLight"), (300, "Light"), (400, "Regular"), (500, "Medium"),
        (600, "SemiBold"), (700, "Bold"), (800, "ExtraBold"),
    ]),
    ("nmtext-var-latin.woff2", "N&M Text", "NMText", [
        (200, "ExtraLight"), (300, "Light"), (400, "Regular"), (450, "Book"),
        (500, "Medium"), (600, "SemiBold"), (700, "Bold"), (800, "ExtraBold"),
        (900, "Black"),
    ]),
    ("nmmono-var-latin.woff2", "N&M Mono", "NMMono", [
        (300, "Light"), (400, "Regular"), (500, "Medium"), (600, "SemiBold"),
        (700, "Bold"),
    ]),
]

# OS/2 usWeightClass is the static file's only weight signal, and the name
# table has to agree with it or installers show every cut as "Regular".
# Windows' 4-style model: only Regular and Bold are "RIBBI" styles; everything
# else becomes its own family so the whole range is reachable from a menu.
RIBBI = {"Regular", "Bold"}


def set_names(font: TTFont, family: str, style: str, ps_prefix: str, weight: int) -> None:
    name = font["name"]
    typographic_family = family
    typographic_style = style
    if style in RIBBI:
        win_family, win_style = family, style
    else:
        win_family, win_style = f"{family} {style}", "Regular"

    full = f"{family} {style}"
    ps = f"{ps_prefix}-{style.replace(' ', '')}"

    for nid, value in (
        (1, win_family),
        (2, win_style),
        (4, full),
        (6, ps),
        (16, typographic_family),
        (17, typographic_style),
    ):
        name.setName(value, nid, 3, 1, 0x409)
        name.setName(value, nid, 1, 0, 0)

    font["OS/2"].usWeightClass = weight
    # fsSelection / macStyle bold bits must match the style or the OS
    # synthesises a second bold on top of the real one.
    bold = style == "Bold"
    fs = font["OS/2"].fsSelection & ~(1 << 0 | 1 << 5 | 1 << 6)  # clear italic/bold/regular
    fs |= (1 << 5) if bold else (1 << 6)                          # then set exactly one
    font["OS/2"].fsSelection = fs
    font["head"].macStyle = 1 if bold else 0


def build() -> None:
    shutil.rmtree(os.path.join(FONTS, "static"), ignore_errors=True)
    os.makedirs(OUT_TTF, exist_ok=True)
    os.makedirs(OUT_WOFF2, exist_ok=True)

    total = 0
    for src, family, ps_prefix, weights in FAMILIES:
        path = os.path.join(FONTS, src)
        if not os.path.exists(path):
            sys.exit(f"missing source font: {path}")
        for weight, style in weights:
            var = TTFont(path)
            static = instancer.instantiateVariableFont(var, {"wght": weight}, inplace=True, updateFontNames=False)
            set_names(static, family, style, ps_prefix, weight)

            stem = f"{ps_prefix}-{style.replace(' ', '')}"
            static.flavor = None
            static.save(os.path.join(OUT_TTF, f"{stem}.ttf"))
            static.flavor = "woff2"
            static.save(os.path.join(OUT_WOFF2, f"{stem}.woff2"))
            total += 1
            print(f"  {family} {style} ({weight})  →  {stem}")

    write_css()

    size = sum(
        os.path.getsize(os.path.join(d, f))
        for d in (OUT_TTF, OUT_WOFF2)
        for f in os.listdir(d)
    )
    print(f"\nwrote {total} static cuts × 2 formats — {size / 1024:.0f} kB total in fonts/static/")


def write_css() -> None:
    """The @font-face sheet for the static package.

    The design system itself never loads this — it loads the three variable
    files via tokens/fonts.css. This exists for the open-source download, so
    a consumer without variable-font support (or without a build step) can
    link one stylesheet and get the whole family."""
    out = [
        "/* N&M type family — static cuts. Generated by scripts/build-fonts.py.",
        "   The design system loads the VARIABLE files (tokens/fonts.css); this",
        "   sheet is for consumers that cannot. SIL OFL 1.1 — see fonts/OFL.txt. */",
    ]
    for _src, family, ps_prefix, weights in FAMILIES:
        for weight, style in weights:
            stem = f"{ps_prefix}-{style.replace(' ', '')}"
            out.append(
                f'@font-face {{\n'
                f'  font-family: "{family}";\n'
                f'  src: url("./woff2/{stem}.woff2") format("woff2"),\n'
                f'       url("./ttf/{stem}.ttf") format("truetype");\n'
                f'  font-weight: {weight};\n'
                f'  font-style: normal;\n'
                f'  font-display: swap;\n'
                f'}}'
            )
    with open(os.path.join(FONTS, "static", "nm-static.css"), "w", encoding="utf8") as fh:
        fh.write("\n".join(out) + "\n")


if __name__ == "__main__":
    build()
