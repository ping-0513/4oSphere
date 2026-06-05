---
name: 4osphere-toolchain-upgrade
description: Use when upgrading package manager, TypeScript, lint, test, Playwright, build, or CI dependencies in 4oSphere. Keeps upgrades narrow, reversible, and verified without mixing unrelated product changes.
---

# 4oSphere Toolchain Upgrade

## Purpose

Upgrade development tooling safely. This wraps the public pnpm-upgrade/toolchain skill pattern for 4oSphere.

## Required workflow

1. Identify the toolchain surface:
   - package manager
   - Node/runtime version
   - TypeScript
   - lint/format
   - test runner
   - Playwright/browser tooling
   - build tool
   - GitHub Actions
2. Separate tooling changes from product behavior changes.
3. Check compatibility notes where available.
4. Make the smallest upgrade set.
5. Run focused verification:
   - install/lockfile check
   - typecheck
   - lint
   - affected tests
   - build
6. Document any migration or config change.

## Output format

Return:

1. Upgrade scope
2. Files changed
3. Compatibility notes
4. Verification commands/results
5. Risks
6. Rollback plan

## Hard rules

- Do not combine broad dependency upgrades with feature work.
- Do not rewrite config style unless required by the upgrade.
- Do not change runtime behavior unless explicitly requested.
