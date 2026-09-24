#!/usr/bin/env bash
# Build estático + HTML pre-renderizado (lo que ve Google). Uso: bash scripts/build-static.sh
set -euo pipefail
cd "$(dirname "$0")/.."
npx vite build --config vite.config.static.ts
npx vite build --config vite.config.static.ts --ssr entry-server.tsx --outDir ../dist-ssr --emptyOutDir
node scripts/prerender.mjs
