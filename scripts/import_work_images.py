from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps


CATEGORY_PREFIX = {
    "store-visuals": "SV",
    "campaign-design": "CD",
    "social-campaign": "SC",
    "advertising-banners": "AB",
}

MARKETS = {
    "jp": "JAPAN",
    "kr": "KOREA",
    "tw": "TAIWAN",
    "hktw": "HK / TW",
    "hk": "HONG KONG",
    "sea": "SEA",
    "global": "GLOBAL",
}

SUPPORTED = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}


def natural_key(path: Path) -> list[object]:
    return [int(part) if part.isdigit() else part.casefold() for part in re.split(r"(\d+)", path.name)]


def clean_stem(path: Path) -> str:
    stem = path.stem
    while re.search(r"\.(?:jpe?g|png|webp|gif|avif)$", stem, flags=re.IGNORECASE):
        stem = Path(stem).stem
    return stem


def metadata(path: Path, category: str, index: int) -> tuple[str, str, str]:
    stem = clean_stem(path)
    prefix = f"{category}_"
    normalized = stem[len(prefix):] if stem.casefold().startswith(prefix.casefold()) else stem
    match = re.match(r"(.+?)_([a-z]{2,6})_(\d{4})_detail_?\d+.*$", normalized, flags=re.IGNORECASE)
    if match:
        project, market_code, year = match.groups()
        title = project.replace("_", " ").replace("-", " ").strip().title()
        market = MARKETS.get(market_code.casefold(), market_code.upper())
        return title or f"Project {index:03d}", market, year

    year_match = re.search(r"(?:19|20)\d{2}", normalized)
    title = re.sub(r"[_-]+", " ", normalized).strip()
    return title or f"Project {index:03d}", "GLOBAL", year_match.group(0) if year_match else "—"


def display_ratio(width: int, height: int) -> str:
    ratio = width / height
    if ratio < 1.22:
        return "1-1"
    return "16-9" if abs(ratio - (16 / 9)) <= abs(ratio - (300 / 157)) else "300-157"


def main() -> int:
    source_root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(r"E:\2026-作品集\work")
    project_root = Path(__file__).resolve().parents[1]
    destination_root = project_root / "public" / "work"
    manifest_path = project_root / "lib" / "work-images.ts"
    exclusions = json.loads((project_root / "scripts" / "work-exclusions.json").read_text(encoding="utf-8"))
    destination_root.mkdir(parents=True, exist_ok=True)

    records: list[dict[str, object]] = []
    errors: list[str] = []
    counts: dict[str, int] = {}

    for category, prefix in CATEGORY_PREFIX.items():
        source_dir = source_root / category
        if not source_dir.is_dir():
            counts[category] = 0
            continue

        files = sorted(
            (path for path in source_dir.rglob("*") if path.is_file() and path.suffix.casefold() in SUPPORTED and path.name not in exclusions.get(category, [])),
            key=natural_key,
        )
        destination_dir = destination_root / category
        destination_dir.mkdir(parents=True, exist_ok=True)
        expected_previews = set()

        for index, source in enumerate(files, start=1):
            try:
                with Image.open(source) as image:
                    image.seek(0)
                    image.load()
                    image = ImageOps.exif_transpose(image)
                    transparent = image.mode in ("RGBA", "LA") or "transparency" in image.info
                    scale = min(1.0, 1200 / image.width, math.sqrt(1_200_000 / (image.width * image.height)))
                    if scale < 1.0:
                        image = image.resize(
                            (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
                            Image.Resampling.LANCZOS,
                        )
                    image = image.convert("RGBA" if transparent else "RGB")
                    width, height = image.size
            except Exception as exc:
                errors.append(f"{source}: {exc}")
                continue

            filename = f"{index:03d}.webp"
            destination = destination_dir / filename
            image.save(destination, "WEBP", quality=80, method=4)
            expected_previews.add(filename)
            title, market, year = metadata(source, category, index)
            relative = source.relative_to(source_dir)
            section = "other"
            merchandise_type = ""
            if category == "campaign-design":
                if len(relative.parts) > 1:
                    title = relative.parts[0]
                if re.search(r"(?:_|-)kv(?:_|-)", source.name, re.IGNORECASE):
                    section = "key-visual"
                elif "社群" in source.name:
                    section = "social"
                elif "周邊" in source.name or "周边" in source.name:
                    section = "merchandise"
                    kind = re.search(r"[（(](.*?)[）)]", source.name)
                    merchandise_type = kind.group(1) if kind else "周边延展"
            records.append(
                {
                    "id": f"{category}-{index:03d}",
                    "code": f"{prefix}{index:03d}",
                    "title": title,
                    "category": category,
                    "market": market,
                    "year": year,
                    "ratio": display_ratio(width, height),
                    "tone": index % 6,
                    "src": f"/work/{category}/{filename}",
                    "width": width,
                    "height": height,
                    "sourceName": source.name,
                    "transparent": transparent,
                    "section": section,
                    "merchandiseType": merchandise_type,
                }
            )
        counts[category] = sum(1 for record in records if record["category"] == category)
        if not errors:
            for folder, expected in ((destination_dir, expected_previews),):
                for stale in folder.iterdir():
                    if stale.is_file() and re.fullmatch(r"\d+\.(?:webp|png|jpe?g|gif|avif)", stale.name) and stale.name not in expected:
                        stale.unlink()

    manifest = [
        "import type { Work } from '@/lib/works';",
        "",
        "// Generated by scripts/import_work_images.py. Re-run after changing the source work folders.",
        "export const importedWorks: Work[] = [",
    ]
    for record in records:
        fields = ", ".join(f"{key}:{json.dumps(value, ensure_ascii=False)}" for key, value in record.items())
        manifest.append(f"  {{ {fields} }},")
    manifest.extend(["]", ""])
    manifest_path.write_text("\n".join(manifest), encoding="utf-8")

    print(json.dumps({"counts": counts, "total": len(records), "errors": errors}, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
