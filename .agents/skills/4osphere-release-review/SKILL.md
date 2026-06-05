---
name: 4osphere-release-review
description: Use before tagging, publishing, deploying, or announcing a 4oSphere release. Checks final readiness across settings coverage, security gates, CI, docs, changelog, compatibility, and rollback considerations for the GPT-4o-only edition.
---

# 4oSphere Release Review

## Purpose

Perform a final release-readiness pass. This wraps the public final-release-review pattern for 4oSphere.

## Required workflow

1. Identify release scope:
   - changed user-visible behavior
   - settings/config changes
   - GPT-4o request behavior changes
   - security/safety changes
   - docs/help text changes
   - CI/build/test changes
2. Check merge readiness:
   - required PR reviews complete
   - CI status known
   - verification commands documented
   - no known critical/high security issues
3. Check settings compatibility:
   - saved settings still load
   - presets/import/export compatible
   - defaults documented
   - migrations handled or unnecessary
4. Check docs/release notes:
   - README/docs updated
   - changelog/release notes drafted
   - limitations documented
5. Check operational risk:
   - deploy plan
   - rollback plan
   - secret/env requirements
   - monitoring/logging concerns

## Output format

Return:

1. Release summary
2. Release readiness: yes / no / conditional
3. Required blockers
4. Settings compatibility
5. Security status
6. CI/test/build status
7. Docs/changelog status
8. Rollback/operational notes
9. Final checklist

## Hard rules

- Do not mark a release ready if required checks are unknown.
- Do not approve deploys involving new secrets/env vars without explicit setup notes.
- Keep GPT-4o-only scope clear in release notes.
