#!/usr/bin/env bash
# Publica el sitio estático en GitHub Pages (grupoproinnova.com).
# Uso: bash scripts/deploy-pages.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$(mktemp -d)"
REMOTE="$(git -C "$ROOT" remote get-url origin)"

cd "$ROOT"
bash scripts/build-static.sh

cp -r dist-static/. "$OUT/"
printf "grupoproinnova.com\n" > "$OUT/CNAME"   # dominio propio en GitHub Pages
touch "$OUT/.nojekyll"

cd "$OUT"
git init -q -b gh-pages
git config user.name "$(git -C "$ROOT" config user.name)"
git config user.email "$(git -C "$ROOT" config user.email)"
git add -A
git commit -q -m "Publicar sitio ($(git -C "$ROOT" rev-parse --short HEAD))"
git push -q -f "$REMOTE" gh-pages

echo "Publicado. GitHub Pages tarda ~1 minuto en actualizar https://grupoproinnova.com"
