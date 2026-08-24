#!/usr/bin/env python3
"""
blend-project-images.py
=======================
Pre-build script for obair-lann-monny.

For each design project that has `chart:` data in its frontmatter, reads all
project images, blends them into a single atmospheric texture, and writes the
result to public/img/chart-blend/<slug>.webp.

The blend approach:
  - Load up to MAX_IMAGES source images per project
  - Resize each to TARGET_SIZE × TARGET_SIZE
  - Apply per-image blur (radius 14) to dissolve content detail into color zones
  - Composite images using offset radial soft masks so each contributes from
    a different angular zone of the frame → organic multi-color wash
  - Final pass: light blur + saturation/contrast boost

Output is used by the Three.js chart as a tube material texture, wrapped onto
TubeGeometry arcs representing each project's duration.

Run directly:
    python3 scripts/blend-project-images.py

Or via npm:
    npm run blend-images
"""

import os
import re
import sys
import math
from pathlib import Path
from typing import Optional

try:
    from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
    import numpy as np
except ImportError:
    print("[blend] ERROR: Pillow / numpy not installed. Run: pip3 install Pillow numpy", file=sys.stderr)
    sys.exit(1)

# ── Config ────────────────────────────────────────────────────────────────────
REPO_ROOT    = Path(__file__).parent.parent
CONTENT_DIR  = REPO_ROOT / "content" / "design"
OUTPUT_DIR   = REPO_ROOT / "public" / "img" / "chart-blend"
TARGET_SIZE  = 512   # texture resolution; Three.js will display at ~44px tube radius
MAX_IMAGES   = 8     # max images to blend per project
IMG_EXTS     = {'.png', '.jpg', '.jpeg', '.webp', '.gif'}
BLUR_RADIUS  = 14    # per-image blur before compositing
FINAL_BLUR   = 3     # smoothing blur on the output
SAT_BOOST    = 1.55  # saturation enhancement
CONTRAST     = 1.18  # contrast enhancement
BRIGHTNESS   = 0.93  # slight darkening — looks better on lit 3D surfaces


def has_chart_frontmatter(md_path: Path) -> bool:
    """Return True if the markdown file contains a chart: block."""
    try:
        text = md_path.read_text(encoding='utf-8', errors='ignore')
        return bool(re.search(r'^chart:', text, re.MULTILINE))
    except Exception:
        return False


def get_image_paths(project_dir: Path) -> list[Path]:
    """Return sorted list of image file paths in a project directory."""
    paths = sorted(
        p for p in project_dir.iterdir()
        if p.is_file() and p.suffix.lower() in IMG_EXTS
    )
    return paths


def blend_images(img_paths: list, size: int = TARGET_SIZE) -> Optional[Image.Image]:
    """
    Blend a list of images into a single atmospheric texture.
    Returns a PIL Image (RGB), or None if no images could be loaded.
    """
    use = img_paths[:MAX_IMAGES]
    loaded = []

    for p in use:
        try:
            img = Image.open(p).convert('RGB').resize((size, size), Image.Resampling.LANCZOS)
            img = img.filter(ImageFilter.GaussianBlur(radius=BLUR_RADIUS))
            loaded.append(img)
        except Exception as e:
            print(f"  [skip] {p.name}: {e}")

    if not loaded:
        return None

    if len(loaded) == 1:
        result = loaded[0].filter(ImageFilter.GaussianBlur(radius=FINAL_BLUR + 2))
        return _finish(result)

    # Composite images with angular soft masks so each sits in a different zone
    base = Image.new('RGB', (size, size), (100, 100, 100))

    for i, img in enumerate(loaded):
        angle = (i / len(loaded)) * 2 * math.pi
        # Offset mask center — images contribute from different parts of the frame
        cx = int(size / 2 + size * 0.26 * math.cos(angle))
        cy = int(size / 2 + size * 0.26 * math.sin(angle))

        # Build soft radial mask
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        r_max  = size * 0.65
        steps  = 28
        weight = 2.4 / len(loaded)   # balance total contribution
        for s in range(steps):
            r     = int(r_max * (1.0 - s / steps))
            alpha = int(255 * ((1.0 - s / steps) ** 1.5) * weight)
            alpha = min(255, alpha)
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=alpha)

        base = Image.composite(img, base, mask)

    return _finish(base)


def _finish(img: Image.Image) -> Image.Image:
    """Apply final polish passes."""
    img = img.filter(ImageFilter.GaussianBlur(radius=FINAL_BLUR))
    img = ImageEnhance.Color(img).enhance(SAT_BOOST)
    img = ImageEnhance.Contrast(img).enhance(CONTRAST)
    img = ImageEnhance.Brightness(img).enhance(BRIGHTNESS)
    return img


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    project_dirs = sorted(d for d in CONTENT_DIR.iterdir() if d.is_dir())
    processed = 0
    skipped   = 0
    errors    = 0

    for project_dir in project_dirs:
        slug     = project_dir.name
        md_files = list(project_dir.glob('*.md'))
        if not md_files:
            continue

        md_file = md_files[0]
        if not has_chart_frontmatter(md_file):
            skipped += 1
            continue

        img_paths = get_image_paths(project_dir)
        if not img_paths:
            print(f"  [no imgs] {slug}")
            skipped += 1
            continue

        out_path = OUTPUT_DIR / f"{slug}.webp"

        # Skip if output is newer than all source images (incremental rebuild)
        if out_path.exists():
            out_mtime = out_path.stat().st_mtime
            if all(p.stat().st_mtime < out_mtime for p in img_paths):
                print(f"  [cached]  {slug}")
                processed += 1
                continue

        print(f"  [blend]   {slug}  ({len(img_paths)} imgs → up to {MAX_IMAGES})")
        result = blend_images(img_paths)

        if result is None:
            print(f"  [error]   {slug}: no images loaded")
            errors += 1
            continue

        result.save(str(out_path), 'WEBP', quality=88, method=6)
        processed += 1

    print(f"\nDone: {processed} blended, {skipped} skipped, {errors} errors")
    print(f"Output dir: {OUTPUT_DIR}")


if __name__ == '__main__':
    main()
