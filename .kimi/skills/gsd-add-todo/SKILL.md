---
name: gsd-add-todo
description: Add a todo item to the project backlog
type: standard
---

# GSD Add Todo

Add a todo item to the project backlog.

## Arguments

```
/skill:gsd-add-todo "description" [--priority=high|medium|low]
```

## Process

1. Ensure `.planning/todos/pending/` exists
2. Calculate next todo number
3. Create `{NNN}-TODO.md`:

```markdown
# TODO-NNN: [Description]

**Priority:** [high/medium/low]
**Created:** [date]
**Status:** pending

## Description

[Full description]

## Notes

[Any additional context]
```

4. Update STATE.md todo count
5. Confirm creation

## Priority Levels

- **high** - Blocks current work
- **medium** - Should do soon
- **low** - Nice to have
