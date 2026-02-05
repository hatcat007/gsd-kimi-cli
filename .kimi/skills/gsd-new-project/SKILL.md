---
name: gsd-new-project
description: Initialize a new project with deep context gathering. Creates PROJECT.md, REQUIREMENTS.md, ROADMAP.md through questioning and optional research.
type: standard
---

# GSD New Project

## Objective

Initialize a new project through unified flow: questioning → research (optional) → requirements → roadmap.

This is the most leveraged moment in any project. Deep questioning here means better plans, better execution, better outcomes.

**Creates:**
- `.planning/PROJECT.md` — project context
- `.planning/config.json` — workflow preferences
- `.planning/research/` — domain research (optional)
- `.planning/REQUIREMENTS.md` — scoped requirements
- `.planning/ROADMAP.md` — phase structure
- `.planning/STATE.md` — project memory

**After this command:** Run `/skill:gsd-plan-phase 1` to start execution.

## Context

### Prerequisites
- Git must be available
- User must have project idea

### References
- @~/.kimi/gsd/templates/project.md
- @~/.kimi/gsd/templates/requirements.md
- @~/.kimi/gsd/templates/roadmap.md
- @~/.kimi/gsd/templates/state.md

## Process

### Phase 1: Setup

**Execute these checks before ANY user interaction:**

**Step 1.1: Abort if project exists**
```bash
if [ -f .planning/PROJECT.md ]; then
    echo "ERROR: Project already initialized. Use /skill:gsd-progress"
    exit 1
fi
```

**Step 1.2: Initialize git repository**
```bash
if [ -d .git ] || [ -f .git ]; then
    echo "Git repo exists in current directory"
else
    git init
    echo "Initialized new git repo"
fi
```

**Step 1.3: Detect existing code (brownfield)**
```bash
CODE_FILES=$(find . -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.rs" -o -name "*.java" 2>/dev/null | grep -v node_modules | grep -v .git | head -20)
HAS_PACKAGE=$([ -f package.json ] || [ -f requirements.txt ] || [ -f Cargo.toml ] || [ -f go.mod ] && echo "yes" || echo "no")
HAS_CODEBASE_MAP=$([ -d .planning/codebase ] && echo "yes" || echo "no")
```

### Phase 2: Brownfield Offer

**If existing code detected and no codebase map:**

If (CODE_FILES non-empty OR HAS_PACKAGE = "yes") AND HAS_CODEBASE_MAP = "no":

Use AskUserQuestion:
- **header:** "Existing Code Detected"
- **question:** "I found existing code in this directory. Would you like to map the codebase first?"
- **options:**
  - "Map codebase first" — Understanding existing code is recommended
  - "Skip mapping" — Proceed with new project initialization

**If "Map codebase first":**
- Guide to `/skill:gsd-map-codebase`
- Exit this skill

**If "Skip mapping" or no existing code:** Continue to Phase 3.

### Phase 3: Deep Questioning

**Display banner:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► NEW PROJECT ► QUESTIONING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Opening question:**
> "What do you want to build?"

**Follow-up questions** (based on their response):

Use AskUserQuestion to probe:

**Motivation:**
- "What prompted this idea?"
- "What are you doing today that this replaces?"

**Concreteness:**
- "Walk me through using this"
- "What does that actually look like?"

**Clarification:**
- "When you say X, do you mean A or B?"
- "You mentioned Y — tell me more"

**Success:**
- "How will you know this is working?"
- "What does done look like?"

**Decision gate:**

When ready, use AskUserQuestion:
- **header:** "Ready to Proceed?"
- **question:** "I think I understand what you're building. Ready to create the project files?"
- **options:**
  - "Create project files" — Proceed with initialization
  - "Keep exploring" — Ask more questions

Loop until "Create project files" selected.

### Phase 4: Write PROJECT.md

Synthesize all context into `.planning/PROJECT.md`.

**Use template:** @~/.kimi/gsd/templates/project.md

**Fill in:**
- Project name
- Vision (from questioning)
- Problem statement
- Solution
- Goals and success criteria
- Target users
- Constraints

### Phase 5: Create REQUIREMENTS.md

Create `.planning/REQUIREMENTS.md` using template.

**For greenfield:**
```markdown
## Requirements

### Validated
(None yet — ship to validate)

### Active (v1)
- [ ] [Requirement 1 from questioning]
- [ ] [Requirement 2 from questioning]

### Out of Scope (v2+)
- [Feature] — [why deferred]
```

### Phase 6: Create ROADMAP.md

Create `.planning/ROADMAP.md` using template.

**Based on questioning, define:**
- Milestone structure
- Initial phases (2-4 phases for v1)
- Phase goals

### Phase 7: Create STATE.md and config.json

**Create `.planning/STATE.md`:**
```markdown
# State: [Project Name]

## Current Position
**Project:** [Name]
**Phase:** Not started
**Status:** Initialized
**Last Updated:** [date]

## Progress Summary
### Completed
- [x] Project initialized

### Pending
- [ ] Phase 1 planning
```

**Create `.planning/config.json`:**
```json
{
  "mode": "interactive",
  "depth": "standard",
  "model_profile": "balanced",
  "workflow": {
    "research": true,
    "plan_check": true,
    "verifier": true
  },
  "parallelization": {
    "enabled": true
  },
  "planning": {
    "commit_docs": true
  }
}
```

### Phase 8: Initialize .planning/ Structure

Create directory structure:
```bash
mkdir -p .planning/{phases,todos/{pending,done},debug}
```

**Commit initial files:**
```bash
git add .planning/
git commit -m "docs(00-01): initialize GSD project

Created:
- PROJECT.md
- REQUIREMENTS.md
- ROADMAP.md
- STATE.md
- config.json

Co-Authored-By: Kimi k2.5 <noreply@moonshot.cn>"
```

## Optional: Research Phase

**If user wants research:**

Use AskUserQuestion:
- **header:** "Domain Research"
- **question:** "Would you like me to research the domain before planning?"
- **options:**
  - "Research first" — Spawn research subagents
  - "Skip research" — Proceed to planning

**If research selected:**

Spawn Task subagents:
```python
Task(
    description="Research domain ecosystem",
    subagent_name="gsd-project-researcher",
    prompt=f"""
Research the domain and tech stack for this project.

## Project
{PROJECT_NAME}
{PROJECT_DESCRIPTION}

## Your Task
Research:
1. Tech stack options and trade-offs
2. Best practices for this domain
3. Common pitfalls to avoid
4. Standard libraries/frameworks
5. Architecture patterns

Write findings to `.planning/research/DOMAIN-RESEARCH.md`
"""
)

# Optionally spawn synthesizer if multiple research areas
Task(
    description="Synthesize research findings",
    subagent_name="gsd-research-synthesizer",
    prompt="Synthesize all research files into actionable recommendations..."
)
```

Save research to `.planning/research/`.

## Success Criteria

- [ ] Git repo initialized
- [ ] PROJECT.md created with clear vision
- [ ] REQUIREMENTS.md scoped for v1
- [ ] ROADMAP.md with phases
- [ ] STATE.md initialized
- [ ] config.json created
- [ ] .planning/ directory structure complete
- [ ] Initial commit made

## Output

### Files Created
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/config.json`

### Next Steps
```
/skill:gsd-plan-phase 1
```

## Completion Banner

```
╔══════════════════════════════════════════════════════════════╗
║              PROJECT INITIALIZED                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Project: [name]                                             ║
║  Location: .planning/                                        ║
║                                                              ║
║  Created:                                                    ║
║  ✓ PROJECT.md                                                ║
║  ✓ REQUIREMENTS.md                                           ║
║  ✓ ROADMAP.md                                                ║
║  ✓ STATE.md                                                  ║
║  ✓ config.json                                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

Next: /skill:gsd-plan-phase 1
```

## Notes

- Questioning is collaborative thinking, not interrogation
- Follow the thread of what excites the user
- Challenge vagueness: "fast" means what? "users" means who?
- Research is optional but recommended for unfamiliar domains
