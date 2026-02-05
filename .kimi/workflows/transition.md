---
name: gsd-transition-flow
description: Transition between phases smoothly. Ensures clean handoff and setup.
type: flow
---

# Phase Transition Workflow

```mermaid
flowchart TD
    BEGIN([BEGIN]) --> VERIFY_CURRENT[Verify Current Phase]
    VERIFY_CURRENT --> COMPLETE{Complete?}
    COMPLETE -->|No| FINISH[Finish Current]
    FINISH --> VERIFY_CURRENT
    COMPLETE -->|Yes| CREATE_SUMMARY[Create SUMMARY.md]
    CREATE_SUMMARY --> UPDATE_ROADMAP[Update ROADMAP]
    UPDATE_ROADMAP --> ARCHIVE[Archive Phase Files]
    ARCHIVE --> CHECK_NEXT{Next Phase<br/>Planned?}
    CHECK_NEXT -->|No| PLAN_NEXT[Plan Next Phase]
    PLAN_NEXT --> CHECK_NEXT
    CHECK_NEXT -->|Yes| SETUP_NEXT[Setup Next Phase]
    SETUP_NEXT --> UPDATE_STATE[Update STATE.md]
    UPDATE_STATE --> NOTIFY[Notify Transition]
    NOTIFY --> END([END])
```

## Transition Checklist

- [ ] Current phase verified complete
- [ ] SUMMARY.md created
- [ ] ROADMAP.md updated
- [ ] Phase files archived
- [ ] Next phase planned
- [ ] STATE.md updated
- [ ] Context switched

## Clean Transition

Leave previous phase:
- All files committed
- Tests passing
- Documentation complete

Enter next phase:
- Plan reviewed
- Todos created
- Context loaded
