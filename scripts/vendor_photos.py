#!/usr/bin/env python3
"""Fetch licensed real-person exercise photographs before deploying GitHub Pages.

Source: https://github.com/yuhonas/free-exercise-db (Unlicense).
Downloads only the exact paired exercise photos referenced by site/data.js.
Use: python3 scripts/vendor_photos.py
"""
from pathlib import Path
from urllib.request import Request, urlopen
import re
import time
import sys

ROOT = Path(__file__).resolve().parents[1]
DATA_JS = ROOT / 'site' / 'data.js'
TARGET = ROOT / 'site' / 'photos'
RAW_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'


def main():
    source = DATA_JS.read_text(encoding='utf-8')
    ids = sorted(set(re.findall(r"photo:'([^']+)'", source)))
    if len(ids) < 10:
        raise RuntimeError('The exercise photo manifest contains too few entries; refusing partial media bundle')
    completed = 0
    for id in ids:
        if not re.fullmatch(r'[A-Za-z0-9_-]+', id):
            raise ValueError(f'Invalid exercise ID: {id!r}')
        for i in (0, 1):
            dest = TARGET / id / f'{i}.jpg'
            if dest.exists() and dest.stat().st_size > 2000:
                completed += 1
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            url = f'{RAW_BASE}{id}/{i}.jpg'
            error = None
            for attempt in range(3):
                try:
                    req = Request(url, headers={'User-Agent': 'FORM-Gym-Photo-Bundler/1.0', 'Accept': 'image/jpeg'})
                    with urlopen(req, timeout=30) as response:
                        payload = response.read()
                    if not payload.startswith(b'\xff\xd8\xff') or len(payload) < 2000:
                        raise RuntimeError(f'Unexpected payload for {url}')
                    dest.write_bytes(payload)
                    completed += 1
                    print(f'[photo] {id}/{i}.jpg — {len(payload):,} B', flush=True)
                    error = None
                    break
                except Exception as exc:
                    error = exc
                    time.sleep(1.5 * (attempt + 1))
            if error is not None:
                raise RuntimeError(f'Could not fetch {url}: {error}') from error
    print(f'Bundled {completed} actual photographs ({len(ids)} movements).')


if __name__ == '__main__':
    sys.exit(main())
