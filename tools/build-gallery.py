#!/usr/bin/env python3
"""Build the ESCAVE house-type gallery (photos + floor plans) from assets/originals.

Usage:  python3 -I tools/build-gallery.py
Writes assets/img/gallery/<type>-<n>-<w>.webp and assets/img/gallery/gallery.json
({type: {photos: [{file, w, h}], plans: [...]}}) for the page build.
Interior renders on the live site sit inside a white presentation frame; that frame
is removed by cropping inside the grey keyline and trimming the remaining white margin.
"""
import json
import os
from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "originals")
OUT = os.path.join(ROOT, "assets", "img", "gallery")
WIDTHS = [960, 1600]

TYPES = {
    "grove": {"ext": ["1-2", "2-1", "3-1"], "int": ["02", "03", "04", "06", "08", "09"]},
    "cove": {"ext": ["1-2", "2-1", "3-1"], "int": ["02", "03", "07", "08", "09", "05"]},
    "dune": {"ext": ["1-2", "2-1", "3-1"], "int": ["02", "03", "04", "07", "09", "11"]},
    "vale": {"ext": ["1-3", "2-1", "3-1"], "int": ["02", "03", "09", "10", "11", "13"]},
}


def trim_white(im, threshold=244, pad=0):
    """Crop away near-white margins."""
    grey = im.convert("L").point(lambda v: 255 if v > threshold else 0)
    bbox = ImageChops.invert(grey).getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


def unframe(im):
    # Step inside the grey keyline (~40px in on 1600x900 renders), then trim white.
    inset = round(im.width * 0.035)
    inner = im.crop((inset, inset, im.width - inset, im.height - inset))
    return trim_white(inner)


def save(im, name, quality):
    out = []
    for w in WIDTHS:
        w = min(w, im.width)
        if out and out[-1] == w:
            continue
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=quality, method=6)
        out.append(w)
    return {"file": name, "widths": out, "w": im.width, "h": im.height}


def main():
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for t, spec in TYPES.items():
        photos, plans = [], []
        n = 0
        for e in spec["ext"]:
            im = Image.open(os.path.join(SRC, f"escave-{t}-exterior-{e}.jpg")).convert("RGB")
            n += 1
            photos.append(save(im, f"{t}-{n}", 78))
        for i in spec["int"]:
            im = unframe(Image.open(os.path.join(SRC, f"escave-{t}-interior-{i}-1.jpg")).convert("RGB"))
            n += 1
            photos.append(save(im, f"{t}-{n}", 78))
        for f in (1, 2):
            im = Image.open(os.path.join(SRC, f"escave-{t}-plan-floor{f}-1.jpg")).convert("RGB")
            plans.append(save(trim_white(im, 248, pad=8), f"{t}-plan{f}", 86))
        manifest[t] = {"photos": photos, "plans": plans}
        print(t, len(photos), "photos,", len(plans), "plans")
    with open(os.path.join(OUT, "gallery.json"), "w") as fh:
        json.dump(manifest, fh, indent=1)


if __name__ == "__main__":
    main()
