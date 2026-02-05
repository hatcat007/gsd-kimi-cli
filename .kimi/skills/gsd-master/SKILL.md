---
name: gsd-master
description: Activate GSD (Get Shit Done) workflow system for spec-driven development. Entry point for all GSD functionality.
type: flow
---

# GSD Master Flow

Activate the Get Shit Done workflow system for systematic, phased project development.

## Objective

Determine the user's current state and route them to the appropriate GSD action:
- New project → Guide to project initialization
- Existing project → Show progress and next steps
- Return user → Resume from previous state

## Flow Diagram

```mermaid
flowchart TD
    Start([User activates GSD]) --> CheckProject{Project exists?}
    
    CheckProject -->|No .planning/|> NewProject[gsd-new-project]
    CheckProject -->|Has .planning/|> CheckActive{Active phase?}
    
    CheckActive -->|Yes|> CheckPlan{Plan exists?}
    CheckActive -->|No phases|> Progress[gsd-progress]
    
    CheckPlan -->|Yes|> CheckExec{Plans executed?}
    CheckPlan -->|No plans|> PlanPhase[gsd-plan-phase]
    
    CheckExec -->|All executed|> VerifyPhase[gsd-verify-work]
    CheckExec -->|Plans pending|> ExecutePhase[gsd-execute-phase]
    
    NewProject --> ProjectCreated[PROJECT.md created]
    ProjectCreated --> PlanPhase
    
    PlanPhase --> PlansCreated[NN-YY-PLAN.md created]
    PlansCreated --> ExecutePhase
    
    ExecutePhase --> PhaseComplete[Phase done]
    PhaseComplete --> VerifyPhase
    
    VerifyPhase --> MorePhases{More phases?}
    MorePhases -->|Yes|> NextPhase[Next phase]
    MorePhases -->|No|> MilestoneComplete[Milestone complete!]
    
    NextPhase --> PlanPhase
    
    style Start fill:#4CAF50
    style MilestoneComplete fill:#4CAF50
```

## Entry Points

### New User, New Project
**Trigger:** `/flow:gsd-master` or "activate GSD"
**Path:** Start → CheckProject → NewProject → PlanPhase → ExecutePhase → ...

### Existing Project, Continue Work
**Trigger:** `/flow:gsd-master` or "gsd progress"
**Path:** Start → CheckProject → CheckActive → [route to appropriate action]

### Quick Task
**Trigger:** "gsd quick" or "quick mode"
**Path:** Direct to `/skill:gsd-quick`

## Routing Logic

### Check 1: Project Existence
```bash
if [ -d .planning ] && [ -f .planning/PROJECT.md ]; then
    echo "EXISTING_PROJECT"
else
    echo "NEW_PROJECT"
fi
```

**If NEW_PROJECT:**
- Welcome message
- Explain GSD workflow
- Route to `/skill:gsd-new-project`

**If EXISTING_PROJECT:**
- Read `.planning/STATE.md` for current position
- Show progress summary
- Route to appropriate next action

### Check 2: Current Phase Status
```bash
# Check ROADMAP.md for current phase
CURRENT_PHASE=$(grep "Current Phase:" .planning/ROADMAP.md | head -1)
```

**Routing:**
| State | Action | Command |
|-------|--------|---------|
| No active phase | Initialize first phase | `/skill:gsd-plan-phase 1` |
| Plans not created | Create plans | `/skill:gsd-plan-phase N` |
| Plans pending execution | Execute | `/skill:gsd-execute-phase N` |
| Phase executed, not verified | Verify | `/skill:gsd-verify-work N` |
| All phases complete | Milestone complete | `/skill:gsd-complete-milestone` |

## User Interface

### Welcome Banner
```
╔══════════════════════════════════════════════════════════════╗
║                    GSD FOR KIMI CLI                          ║
║           Get Shit Done - Spec-Driven Development            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Current Status: [Project State]                             ║
║  Phase: [Current Phase] / [Total Phases]                     ║
║  Progress: [████████░░] 80%                                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Next Actions
```
▶ Next Up

[Primary Action] - [Description]
`[command]`

Also available:
- [Alternative 1]
- [Alternative 2]
- [Alternative 3]
```

## Available Commands

### Core Workflow
| Command | Description |
|---------|-------------|
| `/skill:gsd-new-project` | Initialize new project |
| `/skill:gsd-plan-phase N` | Plan phase N |
| `/skill:gsd-execute-phase N` | Execute phase N |
| `/skill:gsd-verify-work N` | Verify phase N |

### Navigation
| Command | Description |
|---------|-------------|
| `/skill:gsd-progress` | Show project status |
| `/skill:gsd-help` | List all commands |
| `/skill:gsd-quick` | Quick ad-hoc task |

### Session Management
| Command | Description |
|---------|-------------|
| `/skill:gsd-pause-work` | Create handoff |
| `/skill:gsd-resume-work` | Resume from handoff |

## Context Preservation

When routing, preserve:
- Current phase number
- Active plan status
- Recent decisions (from STATE.md)
- User preferences (from config.json)

## Error Handling

### If STATE.md is missing
**Action:** Reconstruct from ROADMAP.md and git history
**Fallback:** Treat as new phase

### If ROADMAP.md is missing
**Action:** Check if PROJECT.md exists
**If PROJECT exists:** Create minimal ROADMAP
**If no PROJECT:** Route to new-project

### If .planning/ is gitignored
**Warning:** Planning files won't be version controlled
**Action:** Suggest removing from .gitignore

## Success Criteria

- [ ] User state correctly identified
- [ ] Appropriate action suggested
- [ ] Context preserved between skills
- [ ] Clear next steps presented
- [ ] All routing paths functional

## Integration with Other Skills

This skill is the **orchestrator** that routes to other GSD skills. It does not perform work itself - it delegates to:

- `gsd-new-project` - Project initialization
- `gsd-plan-phase` - Planning
- `gsd-execute-phase` - Execution
- `gsd-verify-work` - Verification
- `gsd-progress` - Status display
- `gsd-help` - Documentation
- `gsd-quick` - Quick tasks

## Notes

- This is a **flow skill** - it orchestrates but doesn't implement
- Uses Task tool to spawn sub-skills as needed
- Preserves GSD's philosophy: thin orchestrator, specialized workers
- All paths eventually return to this flow for next routing decision
