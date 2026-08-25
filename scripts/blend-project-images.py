#!/usr/bin/env python3
"""
blend-project-images.py — v2
Vivid multi-image blend: dominant hue extraction with screen compositing.
"""
import os, re, sys, math
from pathlib import Path
from typing import Optional

try:
    from PIL import Image, ImageFilter, ImageEnhance, ImageDraw, ImageChops
    import numpy as np
except ImportError:
    print("[blend] ERROR: Pillow/numpy not installed. Run: pip3 install Pillow numpy", file=sys.stderr)
    sys.exit(1)

REPO_ROOT   = Path(__file__).parent.parent
CONTENT_DIR = REPO_ROOT / "content" / "design"
OUTPUT_DIR  = REPO_ROOT / "public" / "img" / "chart-blend"
TARGET_SIZE = 512
MAX_IMAGES  = 6
IMG_EXTS    = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


def has_chart_frontmatter(md_path: Path) -> bool:
    try:
        return bool(re.search(r"^chart:", md_path.read_text(encoding="utf-8", errors="ignore"), re.MULTILINE))
    except Exception:
        return False


def get_image_paths(project_dir: Path) -> list:
    return sorted(p for p in project_dir.iterdir() if p.is_file() and p.suffix.lower() in IMG_EXTS)


def extract_vivid_crop(img: Image.Image, size: int) -> Image.Image:
    """
    Find the most colorful (high-saturation) region of the image.
    Returns a center-weighted crop of that region, then resized to (size, size).
    """
    import colorsys
    # Downsample to find hot spot quickly
    small = img.resize((64, 64), Image.Resampling.BILINEAR).convert("RGB")
    arr   = np.array(small, dtype=np.float32) / 255.0
    # Saturation per pixel: max(rgb) - min(rgb)
    sat   = arr.max(axis=2) - arr.min(axis=2)
    # Find centroid of top-20% saturation pixels
    thresh = np.percentile(sat, 80)
    mask   = sat >= thresh
    ys, xs = np.where(mask)
    if len(xs) == 0:
        cx, cy = 0.5, 0.5
    else:
        cx = float(xs.mean()) / 64.0
        cy = float(ys.mean()) / 64.0
    
    # Map centroid to source image
    W, H   = img.size
    crop_r = min(W, H) * 0.55
    x0 = max(0, int(cx * W - crop_r))
    y0 = max(0, int(cy * H - crop_r))
    x1 = min(W, int(cx * W + crop_r))
    y1 = min(H, int(cy * H + crop_r))
    cropped = img.crop((x0, y0, x1, y1))
    return cropped.resize((size, size), Image.Resampling.LANCZOS)


def blend_images(img_paths: list, size: int = TARGET_SIZE) -> Optional[Image.Image]:
    """
    Vivid blend: extract the most saturated crop of each image,
    then screen-composite them so colors ADD rather than average.
    Screen formula: 1 - (1-a)(1-b)  — keeps things bright and vibrant.
    """
    use    = img_paths[:MAX_IMAGES]
    layers = []
    for p in use:
        try:
            img = Image.open(p).convert("RGB")
            crop = extract_vivid_crop(img, size)
            # Moderate blur — keeps some color structure, removes fine detail
            crop = crop.filter(ImageFilter.GaussianBlur(radius=9))
            layers.append(crop)
        except Exception as e:
            print(f"  [skip] {p.name}: {e}")

    if not layers:
        return None
    if len(layers) == 1:
        result = layers[0]
    else:
        # Screen composite all layers: result = 1 - prod(1 - layer_i)
        # Work in float [0,1]
        acc = np.ones((size, size, 3), dtype=np.float32)
        for layer in layers:
            arr = np.array(layer, dtype=np.float32) / 255.0
            # Reduce each layer's weight so screen doesn't blow out to white
            weight = 0.58          # lower weight = less blow-out on bright/white images
            arr    = arr * weight
            acc   *= (1.0 - arr)
        result_arr = np.clip(1.0 - acc, 0, 1)
        result = Image.fromarray((result_arr * 255).astype(np.uint8), "RGB")

    # Final polish: heavy saturation boost to fight grey-averaging
    result = ImageEnhance.Color(result).enhance(2.0)
    result = ImageEnhance.Contrast(result).enhance(1.25)
    result = ImageEnhance.Brightness(result).enhance(0.88)
    result = result.filter(ImageFilter.GaussianBlur(radius=2))
    return result


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    project_dirs = sorted(d for d in CONTENT_DIR.iterdir() if d.is_dir())
    processed = skipped = errors = 0

    for project_dir in project_dirs:
        slug     = project_dir.name
        md_files = list(project_dir.glob("*.md"))
        if not md_files or not has_chart_frontmatter(md_files[0]):
            skipped += 1
            continue
        img_paths = get_image_paths(project_dir)
        if not img_paths:
            print(f"  [no imgs] {slug}")
            skipped += 1
            continue
        out_path = OUTPUT_DIR / f"{slug}.webp"
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
        result.save(str(out_path), "WEBP", quality=90, method=6)
        processed += 1

    print(f"\nDone: {processed} blended, {skipped} skipped, {errors} errors")


if __name__ == "__main__":
    main()
