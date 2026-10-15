#!/usr/bin/env python3
"""Build a static, brand-toned location map for ESCAVE from OpenStreetMap tiles.

Usage:  python3 -I tools/build-map.py
Downloads a small block of OSM tiles once (cached in assets/originals/osm/), stitches
them around the project pin, tones them to the site palette and writes
assets/img/map-escave-{w}.webp. The pin is drawn in HTML/CSS at the image centre.
Map data © OpenStreetMap contributors (ODbL); the page shows this attribution.
"""
import math
import os
import subprocess
from PIL import Image, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "assets", "originals", "osm")
OUT = os.path.join(ROOT, "assets", "img")

LAT, LON = 13.9864891, 100.7059832  # ESCAVE pin, from the project's Google Maps link
ZOOM = 14
OUT_W, OUT_H = 1400, 1000
UA = "KHonourHomepageBuild/1.0 (static map for khonour.co.th homepage)"


def tile_xy(lat, lon, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y


def get_tile(x, y, z):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f"{z}-{x}-{y}.png")
    if not os.path.exists(path):
        # curl uses the system certificate store (some Python installs lack one)
        subprocess.run(["curl", "-sfL", "-A", UA, "-o", path, f"https://tile.openstreetmap.org/{z}/{x}/{y}.png"], check=True)
    return Image.open(path).convert("RGB")


def main():
    fx, fy = tile_xy(LAT, LON, ZOOM)
    cx, cy = fx * 256, fy * 256  # pin in global pixels
    left, top = cx - OUT_W / 2, cy - OUT_H / 2
    tx0, ty0 = int(left // 256), int(top // 256)
    tx1, ty1 = int((left + OUT_W) // 256), int((top + OUT_H) // 256)
    canvas = Image.new("RGB", ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            canvas.paste(get_tile(tx, ty, ZOOM), ((tx - tx0) * 256, (ty - ty0) * 256))
    ox, oy = round(left - tx0 * 256), round(top - ty0 * 256)
    img = canvas.crop((ox, oy, ox + OUT_W, oy + OUT_H))

    # Tone to the palette: soft, desaturated, with roads reading in brand navy.
    # Keep roads and labels legible: partial desaturation, a touch more contrast,
    # then a light wash of the brand paper colour.
    toned = ImageEnhance.Color(img).enhance(0.45)
    toned = ImageEnhance.Contrast(toned).enhance(1.12)
    toned = Image.blend(toned, Image.new("RGB", toned.size, "#eef1f6"), 0.12)

    for w in (700, 1400):
        h = round(OUT_H * w / OUT_W)
        toned.resize((w, h), Image.LANCZOS).save(os.path.join(OUT, f"map-escave-{w}.webp"), "WEBP", quality=80, method=6)
    print("map written", OUT_W, "x", OUT_H, "tiles", (tx1 - tx0 + 1) * (ty1 - ty0 + 1))


if __name__ == "__main__":
    main()
