---
name: 4osphere-goal-guardrails
description: Use before creating or approving any long-running /goal-style Codex or Claude Code workflow for 4oSphere. Converts vague goals into bounded work orders with cost, time, scope, safety, and human approval gates.
---

# 4oSphere Goal Guardrails

## Purpose

Prevent runaway autonomous work. Treat `/goal`-style execution as a bounded work order, not infinite autopilot.

This skill should be explicit-only in practice unless the user directly asks about `/goal`, long-running workflows, or autonomous continuation.

## Required workflow

Before starting a long-running goal, define:

1. Completion condition
   - concrete observable outcome
   - no vague wording like "make it better"
2. Scope limit
   - target files/directories
   - allowed behavior changes
   - non-goals
3. Cost/time/turn limit
   - maximum turns
   - maximum elapsed time
   - maximum retry count
   - tests allowed without approval
4. Tool/action limits
   - read-only first when possible
   - no deploy without approval
   - no destructive actions without approval
   - no broad network access without approval
   - no secret access/printing
5. Stop conditions
   - ambiguity
   - repeated failure
   - secret/security concern
   - migration needed
   - provider generalization pressure
   - scope expansion
6. Reporting cadence
   - summarize before continuing after major checkpoints
   - summarize before expensive tests
   - summarize before changing public behavior

## Safe goal template

Use this shape:

```text
/goal <bounded outcome>.
Scope: <files/features allowed>.
Non-goals: <excluded work>.
Limits: stop after <N> turns or <time>; run only <tests> unless approved.
Approval gates: stop before deploy, destructive actions, new sensitive storage, broad network access, or changing unrelated behavior.
Report: summarize progress and remaining risks before continuing past the limit.
```

## Examples

Good:

```text
/goal Create a settings coverage table for the current PR and classify each gap as Required, Priority, Deferred, or Unsupported.
Scope: read-only analysis of settings, persistence, and payload mapping files.
Limits: stop after 10 turns or 20 minutes.
Approval gates: do not edit files; stop if secrets or deploy behavior appear.
```

Risky:

```text
/goal Make the whole app better.
```

## Output format

Return:

1. Rewritten bounded goal
2. Scope
3. Non-goals
4. Cost/time/turn limits
5. Approval gates
6. Stop conditions
7. Recommended first command or first inspection step
