---
name: gsd-pause-work
description: Pause current work and create handoff file
type: standard
---

# GSD Pause Work

Pause current work and create handoff file for later resumption.

## Arguments

```
/skill:gsd-pause-work ["reason"]
```

## Process

1. **Capture current state:**
   - Current phase and plan
   - Files being worked on
   - In-progress changes (git status)
   - Recent commits
   - Any blockers

2. **Create handoff file** `.planning/handoffs/YYYY-MM-DD-{slug}.continue-here`:

```markdown
# Handoff: [Date] - [Reason]

## Stopped At

**Phase:** [X] of [total]
**Plan:** [XX-YY]
**Task:** [N of M]

## Context

[What we were doing]

## Files in Progress

- [file1] - [status]
- [file2] - [status]

## Decisions Made

- [Decision 1]

## Blockers

- [Any blockers]

## Next Steps

1. [Step 1]
2. [Step 2]

## To Resume

/skill:gsd-resume-work [this-file]
```

3. Commit any staged changes
4. Confirm handoff created

## Use Cases

- End of session
- Context switch to urgent task
- Need user input before continuing
- Long-running operation to resume later
