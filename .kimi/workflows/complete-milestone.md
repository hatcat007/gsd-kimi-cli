---
name: gsd-complete-milestone-flow
description: Automated workflow for completing a milestone. Audits, verifies, archives, and celebrates completion.
type: flow
---

# Complete Milestone Workflow

```mermaid
flowchart TD
    BEGIN([BEGIN]) --> AUDIT[Audit Milestone]
    AUDIT --> ALL_COMPLETE{All Phases<br/>Complete?}
    ALL_COMPLETE -->|No| IDENTIFY[Identify Blockers]
    IDENTIFY --> PLAN_GAPS[Plan Gap Resolution]
    PLAN_GAPS --> EXECUTE_GAPS[Execute Gap Plans]
    EXECUTE_GAPS --> AUDIT
    ALL_COMPLETE -->|Yes| VERIFY[Verify All Work]
    VERIFY --> VERIFICATION_PASS{Verification<br/>Pass?}
    VERIFICATION_PASS -->|No| FIX[Fix Issues]
    FIX --> VERIFY
    VERIFICATION_PASS -->|Yes| ARCHIVE[Archive Work]
    ARCHIVE --> SUMMARY[Create Summary]
    SUMMARY --> UPDATE_ROADMAP[Update ROADMAP]
    UPDATE_ROADMAP --> UPDATE_STATE[Update STATE]
    UPDATE_STATE --> CELEBRATE[Celebrate! 🎉]
    CELEBRATE --> END([END])
```

## Workflow Steps

1. **Audit Milestone** - Run comprehensive audit
2. **Check Completion** - Verify all phases done
3. **Fix Blockers** - Address any issues
4. **Verify Work** - Final verification
5. **Archive** - Move completed work
6. **Document** - Create completion summary
7. **Celebrate** - Acknowledge achievement!
