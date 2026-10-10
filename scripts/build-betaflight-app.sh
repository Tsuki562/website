#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
SOURCE_DIR=${BETAFLIGHT_CONFIGURATOR_DIR:-/home/suki/Betaflight/betaflight-configurator}
CACHE_DIR="$ROOT_DIR/.cache/betaflight-2026.6.2"
OUTPUT_DIR="$ROOT_DIR/apps/web/public/betaflight"
TAG=2026.6.2
cd "$ROOT_DIR"

git -C "$SOURCE_DIR" rev-parse --verify "refs/tags/$TAG" >/dev/null
if [[ ! -d "$CACHE_DIR/.git" ]]; then
  git clone --no-hardlinks --branch "$TAG" "$SOURCE_DIR" "$CACHE_DIR"
fi
[[ "$(git -C "$CACHE_DIR" describe --tags --exact-match)" == "$TAG" ]]
[[ "$(git -C "$CACHE_DIR" rev-parse HEAD)" == "091127c1a5b15268321b0e5b71b8cec89f1de56b" ]]
PATCH_FILE="$ROOT_DIR/scripts/betaflight-2026.6.2.patch"
if git -C "$CACHE_DIR" apply --reverse --check "$PATCH_FILE" 2>/dev/null; then
  :
else
  git -C "$CACHE_DIR" apply --check "$PATCH_FILE"
  git -C "$CACHE_DIR" apply "$PATCH_FILE"
fi

if [[ "${BETAFLIGHT_SKIP_INSTALL:-0}" != 1 ]]; then
  REGISTRY=${BETAFLIGHT_NPM_REGISTRY:-https://registry.npmjs.org}
  sed -i "s#https://registry.npmjs.org/#$REGISTRY/#g; s#https://registry.npmmirror.com/#$REGISTRY/#g" "$CACHE_DIR/package-lock.json"
  npm --prefix "$CACHE_DIR" ci --ignore-scripts --no-audit --no-fund --registry "$REGISTRY" --fetch-timeout=20000 --fetch-retries=1
fi

npm --prefix "$CACHE_DIR" run build
mkdir -p "$OUTPUT_DIR"
cp -a "$CACHE_DIR/src/dist/." "$OUTPUT_DIR/"
cp "$CACHE_DIR/LICENSE" "$OUTPUT_DIR/LICENSE"
tar --exclude='./node_modules' --exclude='./.git' --exclude='./src/dist' --exclude='./dist' -czf "$OUTPUT_DIR/source-$TAG.tar.gz" -C "$CACHE_DIR" .
