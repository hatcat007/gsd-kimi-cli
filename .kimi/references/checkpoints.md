# Checkpoint System Guide

Understanding and using GSD checkpoints.

## What are Checkpoints?

Checkpoints save the full context at a moment in time:
- Conversation history
- Current state
- Plans and todos
- All work in progress

## Automatic Checkpoints

Created automatically:
- Before each turn
- After tool execution
- At phase boundaries

## Manual Checkpoints

Create manually with:
```
/checkpoint "Before major refactor"
```

## Checkpoint Uses

### Recovery
If something goes wrong:
```
/restore checkpoint-5
```

### Comparison
Compare current to previous:
```
/diff checkpoint-3
```

### Handoff
Export checkpoint for another agent:
```
/export checkpoint handoff.md
```

## Checkpoint Files

Stored in `.planning/checkpoints/`:
```
checkpoint-000.jsonl
checkpoint-001.jsonl
checkpoint-002.jsonl
...
```

## Best Practices

### When to Checkpoint
- Before risky changes
- After major progress
- Before context switch
- End of session

### Naming
Use descriptive names:
- ✅ "API endpoints complete"
- ❌ "checkpoint 1"

### Cleanup
Old checkpoints auto-deleted after:
- 30 days
- Or manually: `/cleanup-checkpoints`

## Integration with Pause/Resume

Pause work:
```
/skill:gsd-pause-work
```
This creates a special checkpoint.

Resume:
```
/skill:gsd-resume-work
```
Restores from pause checkpoint.

## Checkpoint vs Git

| Checkpoint | Git |
|------------|-----|
| Full context | Code only |
| Private | Shared |
| Temporary | Permanent |
| Quick | Requires commit |

Use both: Git for code, checkpoints for context.
