#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
docker build --pull --build-arg BETAFLIGHT_REF=2026.6.2 --build-arg BETAFLIGHT_COMMIT=e0b7bb01b17b21351057e9ead2d1ab39dd44fa16 -t cshk-betaflight:2026.6.2 -f "$SCRIPT_DIR/Dockerfile.worker" "$SCRIPT_DIR"
