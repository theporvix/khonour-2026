#!/usr/bin/env python3
"""Generate responsive WebP derivatives from assets/originals into assets/img.

Usage:  python3 -I tools/build-images.py
Each entry: output name -> (source file, crop box or None, widths).
Crop boxes are (left, top, right, bottom) in source pixels and are used to
remove the white presentation frame baked into the ESCAVE interior renders.
Also writes assets/img/manifest.json (name -> {widths, ratio}) for the page build.
"""
import json
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "originals")
OUT = os.path.join(ROOT, "assets", "img")

HERO = [640, 1024, 1600, 2400]
WIDE = [640, 1024, 1600]
CARD = [480, 800, 1200]
THUMB = [400, 800]
FRAME = (100, 70, 1500, 830)  # interior renders are 1600x900 with a white frame

IMAGES = {
    # ESCAVE (new launch)
    "escave-vale-hero": ("escave-vale-exterior-1-1.jpg", None, HERO),
    "escave-vale-side": ("escave-vale-exterior-3-1.jpg", None, WIDE),
    "escave-grove": ("escave-grove-exterior-1-1.jpg", None, WIDE),
    "escave-cove": ("escave-cove-exterior-1-1.jpg", None, WIDE),
    "escave-dune": ("escave-dune-exterior-1-1.jpg", None, WIDE),
    "escave-vale": ("escave-vale-exterior-2-1.jpg", None, WIDE),
    "escave-gate": ("escave-clubhouse-1-1.jpg", None, WIDE),
    "escave-clubhouse": ("escave-clubhouse-2-1.jpg", None, WIDE),
    "escave-terrace": ("escave-clubhouse-3-1.jpg", None, WIDE),
    "escave-entry-road": ("escave-clubhouse-4-1.jpg", None, WIDE),
    "escave-interior-living": ("escave-vale-interior-02-1.jpg", FRAME, CARD),
    "escave-interior-dining": ("escave-dune-interior-02-1.jpg", FRAME, CARD),
    "escave-interior-cove": ("escave-cove-interior-02-1.jpg", FRAME, CARD),
    # 9th Canale (townhomes)
    "canale-entrance": ("9th-canal-02-entrance.webp", None, WIDE),
    "canale-terra": ("9th-canal-terra-01-front-view.webp", None, CARD),
    "canale-aqua": ("9th-canal-aqua-01-front-view.webp", None, CARD),
    "canale-living": ("9th-canal-terra-02-living-area.webp", None, CARD),
    "canale-playground": ("9th-canal-03-playground.webp", None, CARD),
    # Track record
    "past-atv-s5": ("au-thong-village-au-kaew-single-house-60-sqw.webp", None, CARD),
    "past-atp1": ("au-thong-place-1.webp", None, [480, 800]),
    "past-atp2": ("au-thong-place-2-au-ngun-home-office-20-sqw.webp", None, CARD),
    "past-atp3": ("au-thong-place-3.webp", None, [480, 800]),
    "past-atp4": ("au-thong-place-4.webp", None, [480, 600]),
    "past-atp5": ("au-thong-place-5-au-mongkol-townhome-17-5-sqw.webp", None, CARD),
    "past-atp6": ("au-thong-place-6-habitat-townhome.webp", None, CARD),
    "past-avenue": ("au-thong-avenue-lam-luk-ka-pearnon-hero.webp", None, CARD),
    # Home knowledge articles
    "article-location": ("article-location.png", None, THUMB),
    "article-documents": ("article-documents.png", None, THUMB),
    "article-first-home": ("article-first-home.png", None, THUMB),
}


def main():
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for name, (src, crop, widths) in IMAGES.items():
        im = Image.open(os.path.join(SRC, src)).convert("RGB")
        if crop:
            im = im.crop(crop)
        made = []
        for w in widths:
            if w > im.width:
                w = im.width
            if w in made:
                continue
            h = round(im.height * w / im.width)
            out = im.resize((w, h), Image.LANCZOS)
            out.save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=76, method=6)
            made.append(w)
        manifest[name] = {"widths": made, "w": im.width, "h": im.height}
        print(f"{name:28s} {made}")
    with open(os.path.join(OUT, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=1)

    # Social share image (1200x630) and favicons
    og = Image.open(os.path.join(SRC, "escave-vale-exterior-1-1.jpg")).convert("RGB")
    ratio = 1200 / 630
    ch = round(og.width / ratio)
    top = max(0, (og.height - ch) // 2)
    og.crop((0, top, og.width, top + ch)).resize((1200, 630), Image.LANCZOS).save(
        os.path.join(OUT, "og-escave.jpg"), "JPEG", quality=82, optimize=True)
    fav = Image.open(os.path.join(SRC, "k-honour-favicon.png")).convert("RGBA")
    for size in (32, 180, 512):
        canvas = Image.new("RGBA", (size, size), (255, 255, 255, 0 if size == 32 else 255))
        f = fav.copy()
        pad = 0 if size == 32 else size // 8
        f.thumbnail((size - 2 * pad, size - 2 * pad), Image.LANCZOS)
        canvas.paste(f, ((size - f.width) // 2, (size - f.height) // 2), f)
        canvas.save(os.path.join(OUT, f"favicon-{size}.png"))


if __name__ == "__main__":
    main()
