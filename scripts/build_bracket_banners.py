"""
Build AthlynX-branded MCWS + WCWS bracket banners for athlynx.ai homepage.

Locked spec (per Chad 2026-06-01):
  - 1920x1080 PNG/JPG, vertical-safe layout
  - AthlynX glyph + ATHLYNX header top-left
  - LIVE · CHAMPIONSHIP · BRACKETS subtitle
  - MEN / WOMEN badge top-right
  - "LIVE · AUTO-REFRESH 60s" live indicator
  - Tournament subtitle
  - Hero title "Road to Omaha" / "Road to OKC" with two-tone styling
  - Right rail: regional hosts (MCWS) / Final Four standings (WCWS)
  - Status pill row: Regionals / Super Regionals / MCWS dates
  - Bracket path bullets
  - CTAs: OPEN FULL BRACKET, ATHLYNX LIVE VIEW
  - Bottom ecosystem stack footer: POWERED BY ATHLYNX OS · ATHLYNX · ATHLYNXAI · AXN · AVN · STRAANUNG · THE PLAYBOOK
  - NO faith signoff (per PR #83, retired sitewide)
  - Brand colors: cobalt #1E90FF, cyan #00C2FF, true black #000000, white

Data is hard-coded here from authoritative source (ncaa.com 2026-06-01 evening).
Re-run this script when bracket state changes; commit the resulting JPGs.
"""

import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np

# === Brand constants ===
COBALT = (30, 144, 255)
CYAN = (0, 194, 255)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
DEEP_NAVY = (5, 20, 50)
PATTERN_TINT = (20, 50, 90)

W = 1920
H = 1080
OUT_DIR = "/tmp/athlynx-clean/client/public/brackets"
GLYPH_PATH = "/tmp/athlynx-clean/client/public/athlynx-icon.png"

os.makedirs(OUT_DIR, exist_ok=True)

# === Fonts ===
def font(size, bold=False):
    path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    if os.path.exists(path):
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()


# === Backdrop: deep cobalt gradient with bracket-pattern watermark ===
def make_backdrop():
    img = Image.new("RGB", (W, H), DEEP_NAVY)
    # Vertical gradient
    grad = Image.new("RGB", (1, H), DEEP_NAVY)
    px = grad.load()
    for y in range(H):
        t = y / H
        r = int(DEEP_NAVY[0] + (BLACK[0] - DEEP_NAVY[0]) * t * 0.6)
        g = int(DEEP_NAVY[1] + (BLACK[1] - DEEP_NAVY[1]) * t * 0.6)
        b = int(DEEP_NAVY[2] + (BLACK[2] - DEEP_NAVY[2]) * t * 0.6)
        px[0, y] = (r, g, b)
    img = grad.resize((W, H))

    # Subtle bracket-pattern watermark — diagonal repeating "N" pattern
    watermark = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    wd = ImageDraw.Draw(watermark)
    wm_font = font(80, bold=True)
    for row in range(-2, 8):
        for col in range(-1, 12):
            x = col * 240 + (row % 2) * 120
            y = row * 200
            wd.text((x, y), "N", font=wm_font, fill=(PATTERN_TINT[0], PATTERN_TINT[1], PATTERN_TINT[2], 30))
    watermark = watermark.filter(ImageFilter.GaussianBlur(0.5))
    img = Image.alpha_composite(img.convert("RGBA"), watermark).convert("RGB")

    # Cobalt corner glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for r in range(800, 0, -40):
        a = int(50 * (1 - r / 800) ** 1.5)
        gd.ellipse([-200 - r, -200 - r, 400 + r, 400 + r],
                   fill=(COBALT[0], COBALT[1], COBALT[2], a))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")

    return img.convert("RGBA")


# === Glyph (AthlynX twin-horn) ===
def load_glyph(target_h=80):
    if not os.path.exists(GLYPH_PATH):
        return None
    g = Image.open(GLYPH_PATH).convert("RGBA")
    ratio = target_h / g.height
    g = g.resize((int(g.width * ratio), target_h), Image.LANCZOS)
    return g


# === Common header ===
def draw_header(img, side_label):
    """side_label: 'MEN' or 'WOMEN'"""
    d = ImageDraw.Draw(img, "RGBA")
    # AthlynX glyph
    glyph = load_glyph(70)
    box_x, box_y = 50, 40
    if glyph:
        # Black icon box
        d.rounded_rectangle([box_x, box_y, box_x + 100, box_y + 100], radius=12,
                            fill=(0, 0, 0, 255), outline=(COBALT[0], COBALT[1], COBALT[2], 200), width=2)
        img.alpha_composite(glyph, (box_x + (100 - glyph.width) // 2, box_y + (100 - glyph.height) // 2))

    # ATHLYNX wordmark
    d.text((box_x + 130, box_y + 18), "ATHLYNX", font=font(48, bold=True), fill=WHITE)
    d.text((box_x + 130, box_y + 75), "LIVE  ·  CHAMPIONSHIP  ·  BRACKETS",
           font=font(18, bold=True), fill=(COBALT[0], COBALT[1], COBALT[2]))

    # Side label pill (MEN/WOMEN)
    pill_w = 130
    pill_h = 50
    pill_x = W - pill_w - 50
    pill_y = 55
    d.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=25,
                        fill=(COBALT[0], COBALT[1], COBALT[2], 220), outline=WHITE, width=2)
    bbox = d.textbbox((0, 0), side_label, font=font(22, bold=True))
    tw = bbox[2] - bbox[0]
    d.text((pill_x + (pill_w - tw) // 2, pill_y + 13), side_label, font=font(22, bold=True), fill=WHITE)


# === Common footer ===
def draw_footer(img):
    """Ecosystem stack bottom bar — POWERED BY ATHLYNX OS + brand pillars"""
    d = ImageDraw.Draw(img, "RGBA")
    bar_top = H - 100
    bar_bottom = H - 30
    # Subtle line
    d.line([(50, bar_top - 5), (W - 50, bar_top - 5)], fill=(COBALT[0], COBALT[1], COBALT[2], 100), width=2)
    # Left: POWERED BY ATHLYNX OS
    d.text((50, bar_top + 5), "POWERED BY  ·  ATHLYNX OS",
           font=font(18, bold=True), fill=(COBALT[0], COBALT[1], COBALT[2]))
    # Right: ecosystem stack
    pillars = [
        ("ATHLYNX", "PLATFORM"),
        ("ATHLYNXAI", "OS"),
        ("AXN", "NETWORK"),
        ("AVN", "VAULT"),
        ("STRAANUNG", "INSIGHTS"),
        ("THE PLAYBOOK", "PODCAST"),
    ]
    x = W - 60
    for name, role in reversed(pillars):
        bbox_name = d.textbbox((0, 0), name, font=font(20, bold=True))
        bbox_role = d.textbbox((0, 0), role, font=font(12, bold=True))
        cell_w = max(bbox_name[2] - bbox_name[0], bbox_role[2] - bbox_role[0])
        x -= cell_w
        d.text((x, bar_top + 2), name, font=font(20, bold=True), fill=WHITE)
        d.text((x, bar_top + 32), role, font=font(12, bold=True),
               fill=(COBALT[0], COBALT[1], COBALT[2]))
        x -= 35  # gap between pillars
        # Separator dot
        if x > 460:
            d.text((x + 12, bar_top + 5), "·", font=font(20, bold=True),
                   fill=(COBALT[0], COBALT[1], COBALT[2]))


# === Common body helpers ===
def draw_live_indicator(d, x, y):
    """Green pulse dot + LIVE · AUTO-REFRESH 60s"""
    d.ellipse([x, y + 8, x + 14, y + 22], fill=(0, 220, 100))
    d.text((x + 22, y), "LIVE  ·  AUTO-REFRESH 60s",
           font=font(20, bold=True), fill=(COBALT[0], COBALT[1], COBALT[2]))


def draw_two_tone_hero(d, x, y, white_word, cyan_word, size=140):
    """E.g. 'Road to' (white) + 'Omaha' (cyan) on same line"""
    f = font(size, bold=True)
    d.text((x, y), white_word, font=f, fill=WHITE)
    bbox = d.textbbox((0, 0), white_word + " ", font=f)
    d.text((x + bbox[2] - bbox[0], y), cyan_word, font=f, fill=(COBALT[0], COBALT[1], COBALT[2]))


def draw_status_pill(d, x, y, label, w=380, h=60, filled=True):
    if filled:
        d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2,
                            fill=(COBALT[0], COBALT[1], COBALT[2], 230), outline=WHITE, width=2)
        text_color = WHITE
    else:
        d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2,
                            outline=(COBALT[0], COBALT[1], COBALT[2]), width=2)
        text_color = (COBALT[0], COBALT[1], COBALT[2])
    bbox = d.textbbox((0, 0), label, font=font(24, bold=True))
    tw = bbox[2] - bbox[0]
    d.text((x + (w - tw) // 2, y + (h - 30) // 2), label, font=font(24, bold=True), fill=text_color)


def draw_cta(d, x, y, label, primary=True):
    w = 320
    h = 70
    if primary:
        d.rounded_rectangle([x, y, x + w, y + h], radius=12,
                            fill=(COBALT[0], COBALT[1], COBALT[2], 255))
        text_color = WHITE
    else:
        d.rounded_rectangle([x, y, x + w, y + h], radius=12,
                            fill=BLACK, outline=WHITE, width=2)
        text_color = WHITE
    bbox = d.textbbox((0, 0), label, font=font(22, bold=True))
    tw = bbox[2] - bbox[0]
    arrow = " →" if primary else ""
    d.text((x + 24, y + 22), label + arrow, font=font(22, bold=True), fill=text_color)


# ============================================================
# MCWS BANNER — Road to Omaha (Super Regionals 16 teams set!)
# ============================================================
def build_mcws():
    img = make_backdrop()
    draw_header(img, "MEN")
    d = ImageDraw.Draw(img, "RGBA")

    # Live indicator
    draw_live_indicator(d, 80, 175)

    # Subtitle
    d.text((80, 215), "2026 NCAA D1 BASEBALL CHAMPIONSHIP",
           font=font(28, bold=True), fill=WHITE)

    # Hero "Road to Omaha"
    draw_two_tone_hero(d, 80, 260, "Road to ", "Omaha", size=130)

    # Underline accents
    d.rectangle([80, 410, 240, 425], fill=(COBALT[0], COBALT[1], COBALT[2], 255))
    d.rectangle([260, 410, 330, 425], fill=(CYAN[0], CYAN[1], CYAN[2], 255))

    # Status pill: Super Regionals · LIVE NOW (changed from "Regionals · LIVE TODAY")
    draw_status_pill(d, 80, 450, "SUPER REGIONALS  ·  ALL 16 SET", w=440, h=60, filled=True)

    # Bullet list
    d.text((80, 540), "▸  REGIONALS  ·  COMPLETE — ALL 16 WINNERS",
           font=font(24, bold=True), fill=WHITE)
    d.text((80, 580), "▸  SUPER REGIONALS  ·  JUN 5-8",
           font=font(24, bold=True), fill=WHITE)
    d.text((80, 620), "▸  MCWS  ·  CHARLES SCHWAB FIELD  ·  JUN 12-22",
           font=font(24, bold=True), fill=WHITE)

    # CTAs
    draw_cta(d, 80, 700, "OPEN FULL BRACKET", primary=True)
    draw_cta(d, 420, 700, "ATHLYNX LIVE VIEW", primary=False)

    # Right rail — 16 Super Regional teams
    rx = 1100
    ry = 175
    d.text((rx, ry), "16 SUPER REGIONAL TEAMS  ·  LOCKED",
           font=font(24, bold=True), fill=(COBALT[0], COBALT[1], COBALT[2]))

    # Two columns of teams
    teams_left = [
        "▸  No. 1 Georgia (Athens)",
        "▸  No. 2 Oklahoma (Atlanta)",
        "▸  No. 1 Auburn (Auburn)",
        "▸  No. 1 Texas (Austin)",
        "▸  No. 1 N. Carolina (Chapel Hill)",
        "▸  No. 2 USC (College Station)",
        "▸  No. 1 Oregon (Eugene)",
        "▸  No. 3 Troy (Gainesville)",
    ]
    teams_right = [
        "▸  No. 4 Little Rock (Hattiesburg)",
        "▸  No. 1 Kansas (Lawrence)",
        "▸  No. 2 Ole Miss (Lincoln)",
        "▸  No. 3 Cal Poly (Los Angeles)",
        "▸  No. 1 W. Virginia (Morgantown)",
        "▸  No. 1 Miss State (Starkville)",
        "▸  No. 4 St. John's (Tallahassee)",
        "▸  No. 1 Alabama (Tuscaloosa)",
    ]

    f_team = font(20, bold=True)
    for i, t in enumerate(teams_left):
        d.text((rx, ry + 40 + i * 40), t, font=f_team, fill=WHITE)
    for i, t in enumerate(teams_right):
        d.text((rx + 380, ry + 40 + i * 40), t, font=f_team, fill=WHITE)

    draw_footer(img)
    # Save
    out_path = os.path.join(OUT_DIR, "mcws-banner.jpg")
    img.convert("RGB").save(out_path, "JPEG", quality=92, optimize=True)
    print(f"✓ {out_path}")


# ============================================================
# WCWS BANNER — Road to OKC (Championship Series imminent)
# ============================================================
def build_wcws():
    img = make_backdrop()
    draw_header(img, "WOMEN")
    d = ImageDraw.Draw(img, "RGBA")

    draw_live_indicator(d, 80, 175)
    d.text((80, 215), "2026 NCAA D1 SOFTBALL CHAMPIONSHIP",
           font=font(28, bold=True), fill=WHITE)
    draw_two_tone_hero(d, 80, 260, "Road to ", "OKC", size=130)

    d.rectangle([80, 410, 240, 425], fill=(COBALT[0], COBALT[1], COBALT[2], 255))
    d.rectangle([260, 410, 330, 425], fill=(CYAN[0], CYAN[1], CYAN[2], 255))

    draw_status_pill(d, 80, 450, "CHAMPIONSHIP SERIES  ·  WED JUN 3", w=520, h=60, filled=True)

    d.text((80, 540), "▸  TEXAS  ·  WCWS FINALS  ·  CLINCHED",
           font=font(24, bold=True), fill=WHITE)
    d.text((80, 580), "▸  ALABAMA  vs  TEXAS TECH  ·  TONIGHT 7 PM CT  ·  ESPN",
           font=font(24, bold=True), fill=WHITE)
    d.text((80, 620), "▸  CHAMPIONSHIP SERIES  ·  JUN 3-5  ·  BEST OF 3  ·  ESPN",
           font=font(24, bold=True), fill=WHITE)

    draw_cta(d, 80, 700, "OPEN FULL BRACKET", primary=True)
    draw_cta(d, 420, 700, "ATHLYNX LIVE VIEW", primary=False)

    # Right rail — Final Four status
    rx = 1100
    ry = 175
    d.text((rx, ry), "WCWS FINAL FOUR STATUS",
           font=font(24, bold=True), fill=(COBALT[0], COBALT[1], COBALT[2]))

    standings = [
        ("● No. 1  Texas", "(WCWS finals — clinched)", (0, 220, 100)),
        ("● No. 1  Alabama", "(alive — wins tonight = finals)", (255, 200, 0)),
        ("● No. 3  Texas Tech", "(alive — must beat Bama 2x)", (255, 200, 0)),
        ("✕  No. 2  Tennessee", "(eliminated · Jun 1)", (200, 80, 80)),
    ]
    for i, (label, sub, color) in enumerate(standings):
        d.text((rx, ry + 50 + i * 80), label, font=font(26, bold=True), fill=color)
        d.text((rx, ry + 85 + i * 80), sub, font=font(18, bold=True), fill=(200, 220, 255))

    # Venue line
    d.text((rx, ry + 50 + 4 * 80 + 20), "Devon Park  ·  Oklahoma City",
           font=font(22, bold=True), fill=WHITE)

    draw_footer(img)
    out_path = os.path.join(OUT_DIR, "wcws-banner.jpg")
    img.convert("RGB").save(out_path, "JPEG", quality=92, optimize=True)
    print(f"✓ {out_path}")


if __name__ == "__main__":
    print(f"Building bracket banners @ {datetime.utcnow().isoformat()}Z")
    build_mcws()
    build_wcws()
    print("DONE")
