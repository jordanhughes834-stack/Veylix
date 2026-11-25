#!/usr/bin/env python3
"""
Regenerates Veylix's PWA icon sizes from the canonical source image,
logo-source.png (the full-resolution app icon artwork). Not part of
build.py - run manually (`python3 gen_icons.py`) if the source artwork is
ever replaced; output PNGs are committed to the repo.
"""
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).parent
SOURCE = ROOT / "logo-source.png"

SIZES = {
    "icon-512.png": 512,
    "icon-192.png": 192,
    "apple-touch-icon.png": 180,
}


def main():
    src = Image.open(SOURCE).convert("RGB")
    for filename, size in SIZES.items():
        src.resize((size, size), Image.LANCZOS).save(ROOT / filename)
    print("Wrote " + ", ".join(SIZES.keys()))


if __name__ == "__main__":
    main()
