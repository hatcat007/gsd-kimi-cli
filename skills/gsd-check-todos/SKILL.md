---
name: gsd-check-todos
description: List and check todo items
type: standard
---

# GSD Check Todos

List and manage todo items from the project backlog.

## Arguments

```
/skill:gsd-check-todos [--all] [--pending] [--completed]
```

**Options:**
- `--all` - Show all todos (default if no option specified)
- `--pending` - Show only pending todos
- `--completed` - Show only completed todos

## Purpose

Provides visibility into project todos:
- See what's pending and prioritized
- Review recently completed work
- Identify blockers and high-priority items
- Access todo management actions

## Process

### Step 1: Verify Planning Structure

**Check if in GSD project:**

```bash
if [ ! -d ".planning" ]; then
    echo "No planning structure found."
    echo ""
    echo "Run /skill:gsd-new-project to start a new project."
    exit 1
fi
```

**Ensure todo directories exist:**

```bash
mkdir -p .planning/todos/pending .planning/todos/completed 2>/dev/null
```

### Step 2: Parse Arguments

```bash
# Default: show all
SHOW_MODE="all"

# Check for flags
for arg in "$@"; do
    case "$arg" in
        --pending) SHOW_MODE="pending" ;;
        --completed) SHOW_MODE="completed" ;;
        --all) SHOW_MODE="all" ;;
    esac
done
```

### Step 3: Scan Todo Directories

**Count todos:**

```bash
PENDING_COUNT=$(ls -1 .planning/todos/pending/*.md 2>/dev/null | wc -l)
COMPLETED_COUNT=$(ls -1 .planning/todos/completed/*.md 2>/dev/null | wc -l)
```

**Get pending todos by priority:**

```bash
# Extract high priority todos
HIGH_TODOS=$(grep -l "^\\*\\*Priority:\\*\\* high" .planning/todos/pending/*.md 2>/dev/null)

# Extract medium priority todos
MEDIUM_TODOS=$(grep -l "^\\*\\*Priority:\\*\\* medium" .planning/todos/pending/*.md 2>/dev/null)

# Extract low priority todos
LOW_TODOS=$(grep -l "^\\*\\*Priority:\\*\\* low" .planning/todos/pending/*.md 2>/dev/null)
```

### Step 4: Extract Todo Information

**For each todo file, extract:**

```bash
extract_todo_info() {
    local file="$1"
    local filename=$(basename "$file" .md)
    local title=$(head -1 "$file" | sed 's/^# //')
    local priority=$(grep "^\\*\\*Priority:\\*\\*" "$file" | sed 's/.*: //')
    local created=$(grep "^\\*\\*Created:\\*\\*" "$file" | sed 's/.*: //')
    local completed=$(grep "^\\*\\*Completed:\\*\\*" "$file" | sed 's/.*: //')
    local status=$(grep "^\\*\\*Status:\\*\\*" "$file" | sed 's/.*: //')
    
    echo "$filename|$title|$priority|$created|$completed|$status"
}
```

### Step 5: Build Output Display

**Header:**

```
╔══════════════════════════════════════════════════════════════════╗
║  TODO ITEMS                                                      ║
╚══════════════════════════════════════════════════════════════════╝
```

**Pending section:**

```
## Pending (N)
```

_Use `PENDING_COUNT=$(ls -1 .planning/todos/pending/*.md 2>/dev/null | wc -l | tr -d ' ')` to trim whitespace_

**High priority subsection:**

```
### 🔴 High Priority

- TODO-001: Fix authentication bug (created: 2026-02-01)
- TODO-005: Update API documentation (created: 2026-02-03)
```

**Medium priority subsection:**

```
### 🟡 Medium Priority

- TODO-002: Refactor user module (created: 2026-02-02)
```

**Low priority subsection:**

```
### 🟢 Low Priority

- TODO-003: Add logging to debug endpoint (created: 2026-02-02)
```

**Empty state:**

```
No pending todos. Great work! 🎉
```

**Completed section (when showing all or --completed):**

```
## Recently Completed (N of M total)

- TODO-000: Initial project setup (completed: 2026-02-01)
- TODO-004: Configure CI pipeline (completed: 2026-02-02)
```

_Use `COMPLETED_COUNT=$(ls -1 .planning/todos/completed/*.md 2>/dev/null | wc -l | tr -d ' ')` to trim whitespace_

### Step 6: Sort and Limit Completed Todos

**Get 5 most recently completed:**

```bash
RECENT_COMPLETED=$(ls -1t .planning/todos/completed/*.md 2>/dev/null | head -5)
```

### Step 7: Offer Management Actions

**Always show:**

```
───────────────────────────────────────────────────────────────

## Available Actions

### Add New Todo
`/skill:gsd-add-todo "description" [--priority=high|medium|low]`

### View Specific Todo
Read file: `.planning/todos/pending/TODO-NNN.md`

### Mark as Complete
1. Read the todo file
2. Move: `mv .planning/todos/pending/TODO-NNN.md .planning/todos/completed/`
3. Update Status: `**Status:** completed`
4. Add: `**Completed:** [current date]`
```

**If pending todos exist:**

```
### Change Priority
Edit `.planning/todos/pending/TODO-NNN.md`:
Change: `**Priority:** [old]` → `**Priority:** [new]`

### Delete Todo
`rm .planning/todos/pending/TODO-NNN.md`
```

### Step 8: Handle Edge Cases

**No todos at all:**

```
╔══════════════════════════════════════════════════════════════════╗
║  TODO ITEMS                                                      ║
╚══════════════════════════════════════════════════════════════════╝

No todos found. Project backlog is empty!

───────────────────────────────────────────────────────────────

## ▶ Create First Todo

`/skill:gsd-add-todo "Your first task description"`

───────────────────────────────────────────────────────────────
```

**No pending but has completed:**

```
## Pending (0)

No pending todos. All caught up! 🎉

## Recently Completed (3)

...
```

**Filter results in empty view:**

```
## Pending (0)

No pending todos match the filter.
```

## Todo File Format

Each todo follows this structure:

```markdown
# TODO-NNN: Brief description

**Priority:** [high|medium|low]
**Created:** YYYY-MM-DD
**Status:** [pending|completed]

## Description

Full description of the todo item.

## Notes

Additional context, links, or references.
```

Completed todos have additional fields:

```markdown
**Completed:** YYYY-MM-DD
**Resolution:** How it was resolved (optional)
```

## Sample Output

```
╔══════════════════════════════════════════════════════════════════╗
║  TODO ITEMS                                                      ║
╚══════════════════════════════════════════════════════════════════╝

## Pending (4)

### 🔴 High Priority

- TODO-001: Fix critical authentication bug (created: 2026-02-01)
- TODO-005: Update API documentation before release (created: 2026-02-03)

### 🟡 Medium Priority

- TODO-002: Refactor user module for better testability (created: 2026-02-02)

### 🟢 Low Priority

- TODO-003: Add debug logging to webhook endpoint (created: 2026-02-02)

## Recently Completed (3 of 8 total)

- TODO-000: Initial project setup and configuration (completed: 2026-02-01)
- TODO-004: Configure CI/CD pipeline (completed: 2026-02-02)
- TODO-006: Add input validation middleware (completed: 2026-02-03)

───────────────────────────────────────────────────────────────

## Available Actions

### Add New Todo
`/skill:gsd-add-todo "description" [--priority=high|medium|low]`

### View / Edit / Complete
Read todo files in `.planning/todos/pending/`

───────────────────────────────────────────────────────────────
```

## Integration with Other Skills

| Related Skill | When to Use |
|---------------|-------------|
| `gsd-add-todo` | Add new todo items |
| `gsd-progress` | See todos as part of project status |
| `gsd-debug` | Often creates todos for fix tracking |
| `gsd-verify-work` | May create todos for UAT gaps |

## Outputs

### Console Output

Rich todo list displayed in chat with priority grouping.

### No File Changes

This skill is read-only for display. Use `/skill:gsd-add-todo` or manual file edits to modify todos.

## Success Criteria

- [ ] All pending todos displayed by priority
- [ ] Recently completed todos shown for context
- [ ] Empty states handled gracefully
- [ ] Management actions clearly explained
- [ ] Filter options work correctly
