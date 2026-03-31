from __future__ import annotations

import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "makergym" / "assets"
SOURCE_GIF = Path("/Users/kevin/MakerGym/assets/app-entry.gif")
ICON_PATH = Path("/Users/kevin/MakerGym/assets/icon.png")

OUTPUT_MP4 = ASSETS / "makergym-promo.mp4"
OUTPUT_POSTER = ASSETS / "makergym-promo-poster.png"
OUTPUT_STILLS = [
    ASSETS / "makergym-shot-1.png",
    ASSETS / "makergym-shot-2.png",
    ASSETS / "makergym-shot-3.png",
]

WIDTH = 720
HEIGHT = 1280
FPS = 30
TOTAL_FRAMES = 150

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"


def rgba(color: tuple[int, int, int], alpha: int) -> tuple[int, int, int, int]:
    return color[0], color[1], color[2], alpha


def load_font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


def make_gradient_overlay(width: int, height: int, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    arr = np.zeros((height, width, 4), dtype=np.uint8)
    for y in range(height):
        t = y / max(1, height - 1)
        r = int(top[0] * (1 - t) + bottom[0] * t)
        g = int(top[1] * (1 - t) + bottom[1] * t)
        b = int(top[2] * (1 - t) + bottom[2] * t)
        arr[y, :, 0] = r
        arr[y, :, 1] = g
        arr[y, :, 2] = b
        arr[y, :, 3] = 76
    return Image.fromarray(arr, "RGBA")


def build_light_layer(width: int, height: int, frame_index: int) -> Image.Image:
    layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    t = frame_index / TOTAL_FRAMES
    cx1 = int(width * (0.18 + 0.06 * math.sin(t * math.tau)))
    cy1 = int(height * (0.18 + 0.03 * math.cos(t * math.tau * 1.7)))
    cx2 = int(width * (0.82 + 0.04 * math.cos(t * math.tau * 1.2)))
    cy2 = int(height * (0.76 + 0.05 * math.sin(t * math.tau * 1.5)))
    draw.ellipse((cx1 - 180, cy1 - 180, cx1 + 180, cy1 + 180), fill=(21, 188, 236, 72))
    draw.ellipse((cx2 - 170, cy2 - 170, cx2 + 170, cy2 + 170), fill=(138, 114, 255, 58))
    return layer.filter(ImageFilter.GaussianBlur(80))


def rounded_panel(size: tuple[int, int], radius: int, fill: tuple[int, int, int, int], outline: tuple[int, int, int, int]) -> Image.Image:
    panel = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(panel)
    draw.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=fill, outline=outline, width=2)
    return panel


def add_text(draw: ImageDraw.ImageDraw, pos: tuple[int, int], text: str, font: ImageFont.FreeTypeFont, fill: tuple[int, int, int, int]) -> None:
    draw.text(pos, text, font=font, fill=fill)


def format_bg_frame(frame: Image.Image, frame_index: int) -> Image.Image:
    canvas = ImageOps.fit(frame.convert("RGBA"), (WIDTH, HEIGHT), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    base = Image.new("RGBA", (WIDTH, HEIGHT), (7, 11, 20, 255))
    base.alpha_composite(canvas)
    base.alpha_composite(make_gradient_overlay(WIDTH, HEIGHT, (5, 10, 18), (8, 13, 22)))
    base.alpha_composite(build_light_layer(WIDTH, HEIGHT, frame_index))

    vignette = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    vdraw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, 42))
    vignette = vignette.filter(ImageFilter.GaussianBlur(28))
    base.alpha_composite(vignette)
    return base


def paste_icon(base: Image.Image, frame_index: int) -> None:
    icon = Image.open(ICON_PATH).convert("RGBA")
    icon = ImageOps.fit(icon, (96, 96), method=Image.Resampling.LANCZOS)
    angle = (frame_index * 1.6) % 360
    icon = icon.rotate(angle, resample=Image.Resampling.BICUBIC, expand=False)
    holder = rounded_panel((128, 128), 34, (9, 14, 22, 178), (255, 255, 255, 34))
    holder.alpha_composite(icon, dest=((128 - icon.width) // 2, (128 - icon.height) // 2))
    base.alpha_composite(holder, dest=(WIDTH - 160, 86))


def build_hud(base: Image.Image, frame_index: int, title_font, number_font, label_font, body_font) -> Image.Image:
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    top_pill = rounded_panel((260, 54), 27, (8, 16, 28, 176), (255, 255, 255, 32))
    overlay.alpha_composite(top_pill, dest=(34, 36))
    add_text(draw, (60, 52), "MAKER GYM", label_font, rgba((21, 188, 236), 255))
    add_text(draw, (175, 52), "LIVE", label_font, rgba((238, 247, 255), 210))

    title_panel = rounded_panel((WIDTH - 68, 150), 34, (6, 12, 22, 170), (255, 255, 255, 28))
    overlay.alpha_composite(title_panel, dest=(34, 92))
    add_text(draw, (64, 124), "UPPER FOCUS", title_font, rgba((238, 247, 255), 255))
    add_text(draw, (64, 176), "Treino com ritmo, volume e consistencia visivel.", body_font, rgba((176, 196, 214), 230))

    left_card = rounded_panel((220, 132), 30, (7, 14, 24, 178), (255, 255, 255, 28))
    right_card = rounded_panel((220, 132), 30, (10, 15, 26, 178), (255, 255, 255, 28))
    bottom_band = rounded_panel((WIDTH - 68, 172), 38, (6, 11, 20, 184), (255, 255, 255, 28))
    overlay.alpha_composite(bottom_band, dest=(34, HEIGHT - 216))
    overlay.alpha_composite(left_card, dest=(54, HEIGHT - 196))
    overlay.alpha_composite(right_card, dest=(WIDTH - 274, HEIGHT - 196))

    pulse = 0.5 + 0.5 * math.sin((frame_index / TOTAL_FRAMES) * math.tau * 3)
    volume_width = int(180 + pulse * 18)
    draw.rounded_rectangle((84, HEIGHT - 92, 84 + volume_width, HEIGHT - 80), radius=6, fill=rgba((21, 188, 236), 255))
    draw.rounded_rectangle((84, HEIGHT - 92, 84 + 220, HEIGHT - 80), radius=6, outline=rgba((255, 255, 255), 28), width=2)

    add_text(draw, (84, HEIGHT - 182), "4.280 kg", number_font, rgba((21, 188, 236), 255))
    add_text(draw, (84, HEIGHT - 145), "VOLUME TOTAL", label_font, rgba((176, 196, 214), 220))
    add_text(draw, (WIDTH - 244, HEIGHT - 182), "01:15", number_font, rgba((138, 114, 255), 255))
    add_text(draw, (WIDTH - 244, HEIGHT - 145), "REST TIMER", label_font, rgba((176, 196, 214), 220))
    add_text(draw, (84, HEIGHT - 62), "Bench Press • Progressao ao vivo", body_font, rgba((234, 242, 250), 218))

    for i in range(3):
      dx = int(30 * math.sin((frame_index / TOTAL_FRAMES) * math.tau + i))
      dot_y = 286 + i * 18
      draw.ellipse((WIDTH - 90 + dx, dot_y, WIDTH - 78 + dx, dot_y + 12), fill=rgba((21, 188, 236), 140 - i * 25))

    overlay.alpha_composite(build_light_layer(WIDTH, HEIGHT, frame_index + 20))
    return Image.alpha_composite(base, overlay)


def generate() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)

    source = Image.open(SOURCE_GIF)
    src_frames = []
    for i in range(getattr(source, "n_frames", 1)):
        source.seek(i)
        src_frames.append(source.convert("RGBA").copy())

    title_font = load_font(FONT_BOLD, 44)
    number_font = load_font(FONT_BOLD, 34)
    label_font = load_font(FONT_BOLD, 18)
    body_font = load_font(FONT_REGULAR, 22)

    frames_np = []
    still_indices = [18, 72, 122]
    still_hits = 0

    for i in range(TOTAL_FRAMES):
        src = src_frames[i % len(src_frames)]
        frame = format_bg_frame(src, i)
        paste_icon(frame, i)
        frame = build_hud(frame, i, title_font, number_font, label_font, body_font)

        if i == TOTAL_FRAMES // 2:
            frame.save(OUTPUT_POSTER)
        if still_hits < len(still_indices) and i == still_indices[still_hits]:
            frame.save(OUTPUT_STILLS[still_hits])
            still_hits += 1

        frames_np.append(np.asarray(frame.convert("RGB")))

    imageio.mimsave(
        OUTPUT_MP4,
        frames_np,
        fps=FPS,
        codec="libx264",
        quality=7,
        pixelformat="yuv420p",
        macro_block_size=1,
    )


if __name__ == "__main__":
    generate()
