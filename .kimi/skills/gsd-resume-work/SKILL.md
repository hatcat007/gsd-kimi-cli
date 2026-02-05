---
name: gsd-resume-work
description: Resume work from a handoff file
type: standard
---

# GSD Resume Work

Resume work from a handoff file.

## Arguments

```
/skill:gsd-resume-work [handoff-file]
```

If no handoff file specified, lists available handoffs.

## Process

1. Check `.planning/handoffs/` for `.continue-here` files
2. If multiple, show list:
   ```
   Available handoff files:
   1. 2026-02-03-phase-02.continue-here
   2. 2026-02-01-urgent-fix.continue-here
   ```
3. Read selected handoff file
4. Present context:
   - Where we stopped
   - What was in progress
   - Decisions made
   - Blockers
5. Load relevant files
6. Ask: "Continue where we left off?"
7. If yes, spawn appropriate agent with context
8. Archive handoff file after successful resume
