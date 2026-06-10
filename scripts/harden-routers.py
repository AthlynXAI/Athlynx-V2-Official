#!/usr/bin/env python3
"""
ATHLYNX — SERVER ROUTER HARDENING SCRIPT (SAFE VERSION)
========================================================
Fixes ONLY server-side routers — no client code touched.
Only replaces exact patterns that are known safe.
Run this at the start of every session.

Usage: python3 scripts/harden-routers.py
"""
import os
import re

ROUTER_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'server', 'routers')

TRPC_IMPORT = 'import { TRPCError } from "@trpc/server";'

# Only these exact patterns are safe to replace in server routers
SAFE_REPLACEMENTS = [
    # Silent null returns that cause mutations to silently fail
    ('if (!db) return null;',
     'if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });'),
    ('if (!db) return [];',
     'if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });'),
    ('if (!db) return false;',
     'if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });'),
    ('if (!db) return {};',
     'if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });'),
    ('if (!db) return { success: false };',
     'if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });'),
    # Generic Error throws (not TRPCError)
    ('throw new Error("Database unavailable");',
     'throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });'),
    ('throw new Error("Database not available");',
     'throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });'),
]


def harden_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    content = original
    changed = False

    for old, new in SAFE_REPLACEMENTS:
        if old in content:
            content = content.replace(old, new)
            changed = True

    # Add TRPCError import only if needed and not already present
    if changed and 'TRPCError' in content and TRPC_IMPORT not in content:
        # Insert after the first import line
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('import '):
                lines.insert(i + 1, TRPC_IMPORT)
                break
        content = '\n'.join(lines)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def main():
    if not os.path.exists(ROUTER_DIR):
        print(f"ERROR: Router dir not found: {ROUTER_DIR}")
        return

    fixed = []
    for filename in sorted(os.listdir(ROUTER_DIR)):
        if not filename.endswith('.ts'):
            continue
        if harden_file(os.path.join(ROUTER_DIR, filename)):
            fixed.append(filename)

    if fixed:
        print(f"Hardened {len(fixed)} server routers:")
        for f in fixed:
            print(f"  server/routers/{f}")
    else:
        print("All server routers already hardened.")

    print("Server router hardening complete.")


if __name__ == '__main__':
    main()
