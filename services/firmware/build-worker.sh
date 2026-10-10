#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
EXPECTED_COMMIT=e0b7bb01b17b21351057e9ead2d1ab39dd44fa16
SOURCE_DIR=${1:-${BETAFLIGHT_SOURCE_DIR:-}}

if [[ -z "$SOURCE_DIR" ]]; then
  echo "Usage: $0 /path/to/betaflight-2026.6.2-src" >&2
  echo "Or set BETAFLIGHT_SOURCE_DIR to that local source checkout." >&2
  exit 2
fi

SOURCE_DIR=$(cd "$SOURCE_DIR" && pwd)
ACTUAL_COMMIT=$(git -C "$SOURCE_DIR" rev-parse HEAD)
if [[ "$ACTUAL_COMMIT" != "$EXPECTED_COMMIT" ]]; then
  echo "Expected Betaflight commit $EXPECTED_COMMIT, found $ACTUAL_COMMIT." >&2
  exit 1
fi

if [[ -n "$(git -C "$SOURCE_DIR" -c core.autocrlf=true status --porcelain --untracked-files=all)" ]]; then
  echo "Betaflight source checkout has local changes; refusing to include them in the Worker image." >&2
  exit 1
fi

for submodule in src/config lib/modules/dronecan/libcanard; do
  STATUS=$(git -C "$SOURCE_DIR" submodule status -- "$submodule")
  if [[ "${STATUS:0:1}" != " " ]]; then
    echo "Required submodule is missing or mismatched: $submodule" >&2
    exit 1
  fi
done

# The toolchain tag is built and verified locally. Do not pull or resolve an
# unverified replacement from a registry while constructing the Worker.
if ! docker image inspect betaflight/betaflight-build:arm-2026.6 >/dev/null 2>&1; then
  echo "Local toolchain image betaflight/betaflight-build:arm-2026.6 is missing; refusing to pull it automatically." >&2
  exit 1
fi

docker build --network=none \
  --build-arg BETAFLIGHT_COMMIT="$EXPECTED_COMMIT" \
  -t cshk-betaflight:2026.6.2 \
  -f "$SCRIPT_DIR/Dockerfile.worker" \
  "$SOURCE_DIR"
