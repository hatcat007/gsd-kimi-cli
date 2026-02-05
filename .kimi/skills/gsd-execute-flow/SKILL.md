---
name: gsd-execute-flow
description: Automated GSD workflow for executing a complete phase with verification. Use when you want to execute all plans in a phase and verify completion automatically. Handles parallel execution, wave coordination, and post-execution verification.
type: flow
---

# GSD Phase Execution Flow

This flow skill automates phase execution:
1. Validate phase exists and has plans
2. Execute plans in parallel by wave
3. Verify phase completion
4. Handle gaps if found

```mermaid
flowchart TD
    A([BEGIN]) --> B[Get phase number from user input]
    B --> C[Run /skill:gsd-progress to check current state]
    C --> D{Phase exists and has plans?}
    D -->|No| E[Error: Phase not planned]
    E --> Z([END])
    D -->|Yes| F[Run /skill:gsd-execute-phase N]
    F --> G{Execution complete?}
    G -->|No| H[Check for errors]
    H --> I{Errors fixable?}
    I -->|No| J[Report blocking issues]
    J --> Z
    I -->|Yes| K[Fix issues and retry]
    K --> F
    G -->|Yes| L[Run /skill:gsd-verify-work N]
    L --> M{Verification passed?}
    M -->|Yes| N[Phase complete!]
    N --> O{More phases?}
    O -->|Yes| P[Suggest next phase]
    O -->|No| Q[Project complete!]
    M -->|No| R[Gaps found]
    R --> S[Create gap closure plans]
    S --> T[Execute gaps or defer]
    P --> Z
    Q --> Z
    T --> Z
```

## Execution Notes

**Pre-execution**:
- Verify phase has PLAN.md files
- Check current project state
- Confirm user wants to proceed

**Execution**:
- Spawn gsd-executor subagents in parallel
- Coordinate by wave (Wave 1, then Wave 2, etc.)
- Collect results and summaries
- Handle any checkpoints

**Verification**:
- Spawn gsd-verifier to check completion
- Compare against phase goals
- Identify any gaps
- Create fix plans if needed

**Next Steps**:
- If passed → Suggest next phase or complete
- If gaps → Offer to fix or defer to next phase
