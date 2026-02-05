---
name: gsd-check-todos
description: List and check todo items
type: standard
---

# GSD Check Todos

List and manage todo items.

## Arguments

```
/skill:gsd-check-todos [--all] [--pending] [--completed]
```

## Process

1. Scan `.planning/todos/` directories
2. Display organized list:

```
╔══════════════════════════════════════════════════════════════════╗
║  TODO ITEMS                                                      ║
╚══════════════════════════════════════════════════════════════════╝

## Pending (N)

### High Priority
- TODO-001: [Description] (created: date)
- TODO-002: [Description]

### Medium Priority
- TODO-003: [Description]

### Low Priority
- TODO-004: [Description]

## Recently Completed (last 5)

- TODO-000: [Description] (completed: date)
```

3. Offer actions:
   - View specific todo
   - Mark as complete
   - Change priority
   - Delete todo
