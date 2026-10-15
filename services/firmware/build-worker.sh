#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
EXPECTED_COMMIT=e0b7bb01b17b21351057e9ead2d1ab39dd44fa16
SOURCE_DIR=${1:-${BETAFLIGHT_SOURCE_DIR:-}}
SDK=${2:-arm}

if [[ -z "$SOURCE_DIR" ]]; then
  echo "Usage: $0 /path/to/betaflight-2026.6.2-src [sdk]" >&2
  echo "SDKs: arm, apm32f4, esp_idf, none, pico_sdk, stm32c5, stm32h5, stm32n6, x32m7" >&2
  echo "Or set BETAFLIGHT_SOURCE_DIR to that local source checkout." >&2
  exit 2
fi

case "$SDK" in
  arm|apm32f4|esp_idf|none|pico_sdk|stm32c5|stm32h5|stm32n6|x32m7) ;;
  *) echo "Unsupported Betaflight SDK: $SDK" >&2; exit 2 ;;
esac

BASE_SDK=$SDK
if [[ "$SDK" == "none" ]]; then BASE_SDK=arm; fi
TOOLCHAIN_IMAGE="betaflight/betaflight-build:${BASE_SDK}-2026.6"
WORKER_TAG="cshk-betaflight:2026.6.2"
if [[ "$SDK" != "arm" ]]; then WORKER_TAG="${WORKER_TAG}-${SDK}"; fi

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

case "$SDK" in
  apm32f4) SDK_SUBMODULE=lib/modules/APM32F4 ;;
  esp_idf) SDK_SUBMODULE=lib/modules/esp-idf ;;
  pico_sdk) SDK_SUBMODULE=lib/modules/pico-sdk ;;
  stm32c5) SDK_SUBMODULE=lib/modules/STM32C5 ;;
  stm32h5) SDK_SUBMODULE=lib/modules/STM32H5 ;;
  stm32n6) SDK_SUBMODULE=lib/modules/STM32N6 ;;
  x32m7) SDK_SUBMODULE=lib/modules/X32M7 ;;
  *) SDK_SUBMODULE= ;;
esac

for submodule in src/config lib/modules/dronecan/libcanard ${SDK_SUBMODULE:+$SDK_SUBMODULE}; do
  STATUS=$(git -C "$SOURCE_DIR" submodule status -- "$submodule")
  if [[ "${STATUS:0:1}" != " " ]]; then
    echo "Required submodule is missing or mismatched: $submodule" >&2
    exit 1
  fi
done

# The toolchain tag is built and verified locally. Do not pull or resolve an
# unverified replacement from a registry while constructing the Worker.
if ! docker image inspect "$TOOLCHAIN_IMAGE" >/dev/null 2>&1; then
  echo "Local toolchain image $TOOLCHAIN_IMAGE is missing; refusing to pull it automatically." >&2
  exit 1
fi

docker build --network=none \
  --build-arg TOOLCHAIN_IMAGE="$TOOLCHAIN_IMAGE" \
  --build-arg BETAFLIGHT_COMMIT="$EXPECTED_COMMIT" \
  -t "$WORKER_TAG" \
  -f "$SCRIPT_DIR/Dockerfile.worker" \
  "$SOURCE_DIR"
