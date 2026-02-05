---
name: gsd-resume-flow
description: Resume work on an existing GSD project. Reads state and prepares context.
type: flow
---

# Resume Project Workflow

```mermaid
flowchart TD
    BEGIN([BEGIN]) --> READ_STATE[Read STATE.md]
    READ_STATE --> READ_ROADMAP[Read ROADMAP.md]
    READ_ROADMAP --> CHECK_HANDOFF{Handoff<br/>Exists?}
    CHECK_HANDOFF -->|Yes| READ_HANDOFF[Read Handoff]
    READ_HANDOFF --> UPDATE_CONTEXT[Update Context]
    CHECK_HANDOFF -->|No| ANALYZE_PROGRESS[Analyze Progress]
    ANALYZE_PROGRESS --> IDENTIFY_NEXT[Identify Next Work]
    IDENTIFY_NEXT --> CHECK_TODOS[Check Todos]
    CHECK_TODOS --> SHOW_STATUS[Show Status Dashboard]
    SHOW_STATUS --> RECOMMEND[Recommend Action]
    RECOMMEND --> END([END])
```

## Resume Actions

Based on state, recommend:
- **Continue Phase** - If phase in progress
- **Start Next Phase** - If current complete
- **Verify Work** - If verification pending
- **Plan Phase** - If no plan exists
- **Debug Issues** - If blocked

## Status Dashboard

Shows:
- Current phase and % complete
- Open todos
- Recent commits
- Blockers (if any)
- Next recommended action
