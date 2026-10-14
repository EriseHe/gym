#!/usr/bin/env python3
"""Fetch exact real-person exercise photographs referenced by data.js and plan.js.
Source: https://github.com/yuhonas/free-exercise-db (project Unlicense).
"""
from pathlib import Path
from urllib.request import Request, urlopen
import re
import time

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'site' / 'photos'
RAW_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'


def main():
    source = '\n'.join((ROOT / 'site' / f).read_text(encoding='utf-8') for f in ['data.js', 'plan.js'])
    ids = sorted(set(re.findall(r"photo:'([^']+)'", source)))
    if len(ids) < 13:
        raise RuntimeError('Incomplete photo manifest; refusing partial bundle')
    completed = 0
    for name in ids:
        if not re.fullmatch(r'[A-Za-z0-9_-]+', name):
            raise ValueError(f'Invalid photo ID: {name!r}')
        for index in (0, 1):
            dest = TARGET / name / f'{index}.jpg'
            if dest.exists() and dest.stat().st_size > 2000:
                completed += 1
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            url = f'{RAW_BASE}{name}/{index}.jpg'
            error = None
            for attempt in range(3):
                try:
                    request = Request(url, headers={'User-Agent': 'FORM-Photo-Bundler/3.0', 'Accept': 'image/jpeg'})
                    with urlopen(request, timeout=30) as response:
                        payload = response.read()
                    if not payload.startswith(b'\xff\xd8\xff') or len(payload) < 2000:
                        raise RuntimeError(f'Unexpected photo response: {url}')
                    dest.write_bytes(payload)
                    completed += 1
                    print(f'[photo] {name}/{index}.jpg - {len(payload)} B', flush=True)
                    error = None
                    break
                except Exception as exc:
                    error = exc
                    time.sleep(1.5 * (attempt + 1))
            if error:
                raise RuntimeError(f'Could not fetch {url}: {error}') from error
    print(f'Bundled {completed} real photographs ({len(ids)} movements).')


if __name__ == '__main__':
    main()
