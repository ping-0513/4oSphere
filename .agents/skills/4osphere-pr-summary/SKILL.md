---
name: 4osphere-pr-summary
description: Use when drafting a 4oSphere pull request title, body, changelog note, or reviewer summary. Produces concise PR descriptions that call out settings coverage, security implications, tests, docs, and GPT-4o-only scope.
---

# 4oSphere PR Summary

## Purpose

Draft clear PR descriptions so reviewers can understand intent, risk, verification, and what is intentionally not included.

## Required workflow

1. Inspect the diff or requested change summary.
2. Identify:
   - user-visible behavior
   - settings/config impact
   - GPT-4o request payload impact
   - security/safety impact
   - docs/test impact
   - non-goals
3. Produce a concise PR body.

## Output format

Use:

```markdown
## Summary
- ...

## Changes
- ...

## 4oSphere settings coverage
- UI:
- Persistence:
- Payload mapping:
- Deferred/unsupported:

## Security / safety
- ...

## Tests / verification
- [ ] ...

## Docs
- ...

## Non-goals
- ...
```

## Hard rules

- Do not invent tests that were not run. Use unchecked boxes for proposed checks.
- Mention GPT-4o-only scope when relevant.
- Call out deferred or unsupported settings explicitly.
