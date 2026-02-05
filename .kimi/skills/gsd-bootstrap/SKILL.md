---
name: gsd-bootstrap
description: Automated GSD workflow for bootstrapping a new project with full planning and initial phase setup. Use when starting a completely new project to create PROJECT.md, REQUIREMENTS.md, ROADMAP.md, and Phase 1 planning in one automated flow.
type: flow
---

# GSD Bootstrap Flow

This flow skill automates the complete GSD setup for a new project:
1. Project initialization with deep questioning
2. Requirements documentation
3. Roadmap creation with phases
4. Phase 1 planning with research

```mermaid
flowchart TD
    A([BEGIN]) --> B[Run /skill:gsd-new-project to initialize project]
    B --> C{Project initialized successfully?}
    C -->|No| D[Report error and stop]
    D --> Z([END])
    C -->|Yes| E[Run /skill:gsd-progress to verify setup]
    E --> F{Setup complete?}
    F -->|No| G[Fix any issues]
    G --> E
    F -->|Yes| H[Run /skill:gsd-discuss-phase 1 to gather context]
    H --> I{Context gathered?}
    I -->|No| J[Continue with basic planning]
    I -->|Yes| K[Use gathered context]
    J --> L[Run /skill:gsd-plan-phase 1 to create Phase 1 plans]
    K --> L
    L --> M{Plans created?}
    M -->|No| N[Retry planning with adjustments]
    N --> L
    M -->|Yes| O[Display completion summary]
    O --> P[Show next steps]
    P --> Z
```

## Execution Notes

**Phase 1 (Initialization)**:
- Ask user what they want to build
- Gather deep context through questioning
- Create all planning documents
- Initialize .planning/ structure

**Phase 2 (Discussion)**:
- Analyze Phase 1 goals
- Identify gray areas
- Get user decisions
- Create CONTEXT.md

**Phase 3 (Planning)**:
- Research if enabled
- Create NN-01-PLAN.md
- Verify with plan-checker if enabled
- Present results

**Completion**: Project is ready for execution with `/skill:gsd-execute-phase 1`
