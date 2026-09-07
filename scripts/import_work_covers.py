"""Import ordered cover sets without changing the source artwork."""
import argparse
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

CATEGORIES = {
    "campaign-design": ("CAMPAIGN DESIGN", 2),
    "store-visuals": ("STORE VISUALS", 2),
    "advertising-banners": ("ADVERTISING BANNERS", 4),
    "social-campaign": ("SOCIAL CAMPAIGN", 2),
}
EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".avif"}
AD_PROJECTS = ["以閃亮之名", "運命逆転", "갈락티코", "ワルキューレの試練"]


def natural(path):
    return [int(part) if part.isdigit() else part.casefold() for part in re.split(r"(\d+)", path.name)]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("root", nargs="?", default=r"E:\2026-作品集\work_cover")
    parser.add_argument("--only", help="Refresh one configured cover ID and preserve other cards")
    args = parser.parse_args()
    root = Path(args.root)
    project = Path(__file__).resolve().parents[1]
    if not root.is_dir():
        print(f"Cover directory not found: {root}. Existing cover data is unchanged.")
        return 1
    records = []
    overrides = json.loads((project / "scripts" / "cover-sources.json").read_text(encoding="utf-8"))
    if args.only and args.only not in {item["id"] for item in overrides}:
        raise ValueError(f"No configured source for cover: {args.only}")
    for category, (label, limit) in CATEGORIES.items():
        if args.only:
            continue
        folder = root / category
        if not folder.is_dir():
            raise ValueError(f"Missing category folder: {folder}")
        subfolders = sorted((p for p in folder.iterdir() if p.is_dir()), key=natural)
        if subfolders:
            groups = [(sub.name, sorted((p for p in sub.iterdir() if p.suffix.lower() in EXTENSIONS), key=natural)) for sub in subfolders]
        else:
            files = sorted((p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in EXTENSIONS), key=natural)
            grouped = {}
            for source in files:
                match = re.match(re.escape(category) + r"_(.+?)_[a-z]{2,6}_\d{4}_(?:cover|detail)_(\d+)", source.name, re.I)
                if not match:
                    raise ValueError(f"Unrecognized cover name: {source.name}")
                grouped.setdefault(match.group(1), []).append((int(match.group(2)), source))
            groups = [(title, [p for _, p in sorted(entries, key=lambda entry: (entry[0], natural(entry[1])))]) for title, entries in grouped.items()]
        if category == "advertising-banners":
            by_title = dict(groups)
            groups = [(title, by_title[title]) for title in AD_PROJECTS]
        if not groups:
            raise ValueError(f"{category}: no cover images found")
        for index, (title, files) in enumerate(groups, 1):
            if not files:
                raise ValueError(f"{category}, card {index}: no images")
            records.append({"id": f"{category}-{index:02d}", "category": category, "title": title, "images": [], "files": files})
    for override in overrides:
        if args.only and override["id"] != args.only:
            continue
        folder = root.parent / override["directory"]
        files = sorted((p for p in folder.glob(override["pattern"]) if p.is_file() and p.suffix.lower() in EXTENSIONS), key=natural)
        if len(files) < 2:
            raise ValueError(f"Expected at least two carousel frames for {override['title']}: {folder}")
        records = [r for r in records if r["id"] != override["id"] and not (r["category"] == override["category"] and r["title"] == override["title"])]
        records.append({key: override[key] for key in ("id", "category", "title")} | {"images": [], "files": files})
    for record in records:
        destination = project / "public" / "work-covers" / record["id"]
        destination.mkdir(parents=True, exist_ok=True)
        for index, source in enumerate(record.pop("files"), 1):
            with Image.open(source) as image:
                image = ImageOps.exif_transpose(image)
                transparent = image.mode in ("RGBA", "LA") or "transparency" in image.info
                image = image.convert("RGBA" if transparent else "RGB")
                image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
                image.save(destination / f"{index:02d}.webp", "WEBP", quality=88, method=4)
            record["images"].append(f"/work-covers/{record['id']}/{index:02d}.webp")
    if args.only:
        current = (project / "lib" / "work-covers.ts").read_text(encoding="utf-8")
        existing = json.loads(current.split("export const workCovers: CoverSet[] = ", 1)[1].strip().removesuffix(";"))
        replacements = {r["id"]: r for r in records}
        records = [replacements.pop(r["id"], r) for r in existing] + list(replacements.values())
    records.sort(key=lambda r: (list(CATEGORIES).index(r["category"]), r["id"]))
    manifest = "export type CoverSet = { id: string; category: string; title: string; images: string[] };\n\n"
    manifest += "export const workCovers: CoverSet[] = " + json.dumps(records, ensure_ascii=False, indent=2) + ";\n"
    (project / "lib" / "work-covers.ts").write_text(manifest, encoding="utf-8")
    print(json.dumps({"cards": len(records), "images": sum(len(r["images"]) for r in records)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
