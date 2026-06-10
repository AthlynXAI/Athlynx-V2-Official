#!/bin/bash
# ATHLYNX — SESSION START (run this first, every session)
set -e
echo "=== ATHLYNX SESSION START ==="
cd "$(dirname "$0")/.."
echo "Pulling latest..."
git pull origin main --quiet
echo "Hardening server routers..."
python3 scripts/harden-routers.py
echo "Running build check..."
npm run build:vercel 2>&1 | tail -3
echo "=== READY TO BUILD ==="
echo "Platform: https://athlynx.ai"
echo "RULES: Never run manus-config save-config. Never push untested code. Home page is LOCKED."
