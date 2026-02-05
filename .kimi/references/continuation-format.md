# Handoff and Continuation Format

Standard format for transferring work between sessions or agents.

## When to Use

- Ending session
- Switching agents
- Long-running tasks
- Team handoff

## Handoff File Format

File: `HANDOFF-<date>.md`

### Template

```markdown
# Work Handoff

**Date:** YYYY-MM-DD
**Session:** <session-id>
**Agent:** <agent-name>
**Project:** <project-name>

## Current State

### Phase
- Current: Phase N
- Status: In Progress / Complete / Blocked
- % Complete: XX%

### Active Tasks
1. [ ] Task description (started)
2. [ ] Task description (pending)

### Recently Completed
1. ✅ Task description
2. ✅ Task description

## Context

### Key Files
- `src/...` - Description
- `src/...` - Description

### Important Decisions
- Decision 1: Reasoning
- Decision 2: Reasoning

### Open Questions
1. Question?
2. Question?

## Next Steps

1. Immediate next action
2. Following action
3. Future consideration

## Notes

Any additional context, warnings, or insights.
```

## Quick Handoff

For short breaks, use abbreviated format:
```markdown
## Quick Handoff

**Active:** Task name
**Files:** key/file.js, other/file.css
**Status:** Just finished X, need to do Y
**Resume:** Start with /skill:gsd-execute-phase N
```

## Programmatic Handoff

Use `/skill:gsd-pause-work` to auto-generate.

## Reading Handoff

When resuming:
1. Read HANDOFF file
2. Verify current state
3. Update STATE.md
4. Continue work

## Best Practices

### Writing
- Be specific
- Include file paths
- Note blockers
- Estimate effort remaining

### Reading
- Verify before proceeding
- Ask if unclear
- Update after understanding

### Storage
- Keep in `.planning/`
- Commit to git
- Clean up old handoffs
