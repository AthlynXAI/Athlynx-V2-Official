#!/usr/bin/env python3
"""Deterministic source-only AthlynXAI brand pass.

This script creates vertical approved-brand stills and a contact sheet from supplied source images.
It does not use AI generation. Adjust SOURCE_FILES and BRAND_POINTS per task.
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
import math
import argparse

APPROVED_BRANDS = ["AthlynXAI", "AXN", "XAI", "AthlynX"]
BLUE = (0, 168, 255, 225)
CYAN = (125, 226, 255, 230)
WHITE = (245, 250, 255, 240)
FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"


def font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def fit_contain(im: Image.Image, size=(1080, 1920), bg=(2, 6, 14)) -> Image.Image:
    im = im.convert("RGB")
    w, h = im.size
    tw, th = size
    scale = min(tw / w, th / h)
    nw, nh = int(w * scale), int(h * scale)
    canvas = Image.new("RGB", size, bg)
    canvas.paste(im.resize((nw, nh), Image.LANCZOS), ((tw - nw) // 2, (th - nh) // 2))
    return canvas


def vignette(im: Image.Image, strength=150) -> Image.Image:
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    limit = max(1, min(w, h) // 2 - 8)
    for i in range(0, limit, 8):
        alpha = int(strength * (i / limit) ** 1.8)
        d.rectangle([i, i, w - i, h - i], outline=min(alpha, 255), width=8)
    dark = Image.new("RGB", im.size, (0, 0, 0))
    return Image.composite(dark, im, mask.filter(ImageFilter.GaussianBlur(42)))


def add_brand_lockup(im: Image.Image, title="AthlynXAI", subtitle="The Athlete Playbook") -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rounded_rectangle([54, 54, w - 54, 172], radius=28, fill=(0, 0, 0, 155), outline=BLUE, width=3)
    d.text((88, 78), title, font=font(56), fill=WHITE, stroke_width=2, stroke_fill=(0, 0, 0, 255))
    d.text((88, 132), "AXN  •  XAI  •  AthlynX", font=font(25), fill=CYAN, stroke_width=1, stroke_fill=(0, 0, 0, 255))
    d.rounded_rectangle([54, h - 210, w - 54, h - 70], radius=28, fill=(0, 0, 0, 165), outline=(0, 140, 255, 205), width=3)
    d.text((88, h - 184), subtitle, font=font(38), fill=WHITE, stroke_width=2, stroke_fill=(0, 0, 0, 255))
    d.text((88, h - 132), "Media • Recruiting • NIL • Performance • Recovery", font=font(26), fill=CYAN, stroke_width=1, stroke_fill=(0, 0, 0, 255))
    return Image.alpha_composite(im, overlay).convert("RGB")


def add_repeating_branding(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    points = [
        (.26, .30, 34, 0), (.52, .31, 32, 1), (.74, .32, 32, 2),
        (.31, .44, 30, 3), (.50, .47, 34, 0), (.69, .46, 30, 1),
        (.23, .58, 26, 2), (.43, .60, 26, 3), (.63, .60, 26, 0), (.79, .59, 25, 1),
        (.29, .73, 23, 0), (.48, .75, 24, 2), (.68, .73, 23, 3),
        (.22, .84, 21, 1), (.51, .86, 22, 0), (.76, .84, 21, 2),
    ]
    for x, y, size, idx in points:
        text = APPROVED_BRANDS[idx]
        f = font(size)
        text_w = d.textlength(text, font=f)
        px, py = int(w * x), int(h * y)
        pad = max(8, size // 3)
        d.rounded_rectangle([px - text_w / 2 - pad, py - size / 1.4 - pad, px + text_w / 2 + pad, py + size / 1.4 + pad], radius=10, fill=(0, 0, 0, 132), outline=(0, 170, 255, 185), width=2)
        d.text((px, py), text, font=f, fill=WHITE, anchor="mm", stroke_width=2, stroke_fill=(0, 0, 0, 240))
    return Image.alpha_composite(im, overlay).convert("RGB")


def process_image(src: Path, out_dir: Path, studio: bool = False) -> Path:
    im = fit_contain(Image.open(src))
    im = ImageEnhance.Brightness(im).enhance(0.62 if studio else 0.84)
    im = ImageEnhance.Contrast(im).enhance(1.20)
    im = ImageEnhance.Color(im).enhance(0.86)
    im = vignette(im, 210 if studio else 145)
    im = add_repeating_branding(im)
    im = add_brand_lockup(im, "AthlynXAI", "The Athlete Playbook")
    out = out_dir / f"APPROVED_BRAND_{src.stem}.png"
    im.save(out, quality=95)
    return out


def make_contact_sheet(files: list[Path], out_dir: Path) -> Path:
    thumb_w, thumb_h = 270, 480
    cols = 4
    rows = math.ceil(len(files) / cols)
    sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h + 90), (4, 8, 16))
    d = ImageDraw.Draw(sheet)
    d.text((30, 22), "AthlynXAI SOURCE-ONLY APPROVED BRAND PASS", font=font(28), fill=WHITE)
    d.text((30, 58), "Allowed only: AXN / XAI / AthlynX / AthlynXAI", font=font(22), fill=CYAN)
    for i, p in enumerate(files):
        im = Image.open(p).resize((thumb_w, thumb_h), Image.LANCZOS)
        sheet.paste(im, ((i % cols) * thumb_w, 90 + (i // cols) * thumb_h))
    out = out_dir / "APPROVED_BRAND_CONTACT_SHEET.png"
    sheet.save(out, quality=95)
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-dir", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--studio", nargs="*", default=[], help="Filenames to darken as studio/podcast sources")
    args = parser.parse_args()
    input_dir = Path(args.input_dir)
    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    images = sorted([p for p in input_dir.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}])
    created = [process_image(p, out_dir, studio=p.name in set(args.studio)) for p in images]
    if created:
        make_contact_sheet(created, out_dir)
    with open(out_dir / "MANIFEST.md", "w") as f:
        f.write("# Approved Brand Output Manifest\n\n")
        for p in sorted(out_dir.iterdir()):
            if p.is_file():
                f.write(f"- `{p.name}` — {p.stat().st_size} bytes\n")


if __name__ == "__main__":
    main()
