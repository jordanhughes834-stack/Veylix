#!/usr/bin/env python3
"""
One-off generator for Veylix's PWA icons. Not part of build.py - run
manually (`python3 gen_icons.py`) if the icons ever need regenerating;
output PNGs are committed to the repo.

Draws the same abstract V monogram used inline in the app UI (two thick
angled strokes meeting at a point - left leg in ink, right leg in accent)
on a graphite rounded-square background, so the home-screen icon matches
the in-app wordmark exactly.
"""
import pathlib
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).parent
BG = (18, 23, 20)        # #121714 graphite
INK = (236, 241, 237)    # #ECF1ED
ACCENT = (30, 158, 107)  # #1E9E6B emerald


def draw_v(size, corner_ratio):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * corner_ratio), fill=BG)

    apex = (size * 0.5, size * 0.78)
    top_left = (size * 0.20, size * 0.22)
    top_right = (size * 0.80, size * 0.22)
    stroke_w = size * 0.135

    def thick_line(p1, p2, color):
        draw.line([p1, p2], fill=color, width=int(stroke_w))
        r = stroke_w / 2
        for p in (p1, p2):
            draw.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=color)

    thick_line(top_left, apex, INK)
    thick_line(top_right, apex, ACCENT)
    return img


def main():
    draw_v(192, 0.22).save(ROOT / "icon-192.png")
    draw_v(512, 0.22).save(ROOT / "icon-512.png")
    # iOS applies its own corner mask over whatever's supplied, so ship a
    # square (no rounding baked in) for the apple-touch-icon.
    Image.alpha_composite(
        Image.new("RGBA", (180, 180), BG + (255,)),
        draw_v(180, 0),
    ).convert("RGB").save(ROOT / "apple-touch-icon.png")
    print("Wrote icon-192.png, icon-512.png, apple-touch-icon.png")


if __name__ == "__main__":
    main()
