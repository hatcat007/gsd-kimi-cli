---
name: gsd-help
description: Show help for GSD commands, workflows, and configuration
type: standard
---

# GSD Help

Show help for GSD (Get Shit Done) workflow system.

## Arguments

```
/skill:gsd-help [topic]
```

**Topics:**
- (none) - Show main help menu
- `overview` - What is GSD and quick start
- `commands` - List all available commands
- `workflow` - The GSD development workflow
- `config` - Configuration options
- `tips` - Best practices and tips
- `<command>` - Help for specific command (e.g., `new-project`, `plan-phase`)

## Process

### Step 0: Source Directory Check

**Check if running from GSD source code:**

```bash
if [ -f "./package.json" ] && grep -q '"name": "gsd-kimi-cli"' ./package.json 2>/dev/null; then
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════╗
║  ⚠️  YOU'RE IN THE GSD SOURCE DIRECTORY                          ║
╚══════════════════════════════════════════════════════════════════╝

This is the gsd-kimi-cli tool repository itself.

To USE GSD on your own project:

  cd /path/to/your/project
  kimi --skills-dir ~/.kimi/skills
  /skill:gsd-new-project

To TEST GSD:

  cd /tmp
  mkdir gsd-test && cd gsd-test
  kimi --skills-dir ~/.kimi/skills
  /skill:gsd-new-project

SKILL.md files in this directory ARE the implementation.
Kimi reads and executes them directly.

EOF
    exit 0
fi
```

### Step 1: Detect Context

**Check if in GSD project:**

```bash
if [ -d ".planning" ] && [ -f ".planning/PROJECT.md" ]; then
    IN_GSD_PROJECT=true
    PROJECT_NAME=$(head -1 .planning/PROJECT.md | sed 's/^# //' 2>/dev/null || echo "Unknown")
    CURRENT_PHASE=$(grep "^Phase:" .planning/STATE.md 2>/dev/null | head -1)
else
    IN_GSD_PROJECT=false
fi
```

### Step 2: Route to Topic

**If no topic provided:** Show main menu

**If topic provided:** Show specific help

## Help Topics

### Main Menu (Default)

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     ██╗   ██╗███████╗ ██████╗    ███████╗██████╗  ██████╗        ║
║     ██║   ██║██╔════╝██╔════╝    ██╔════╝██╔══██╗██╔════╝        ║
║     ██║   ██║███████╗██║  ███╗   █████╗  ██║  ██║██║  ███╗       ║
║     ██║   ██║╚════██║██║   ██║   ██╔══╝  ██║  ██║██║   ██║       ║
║     ╚██████╔╝███████║╚██████╔╝   ██║     ██████╔╝╚██████╔╝       ║
║      ╚═════╝ ╚══════╝ ╚═════╝    ╚═╝     ╚═════╝  ╚═════╝        ║
║                                                                  ║
║              Get Shit Done - Spec-Driven Development             ║
╚══════════════════════════════════════════════════════════════════╝

Welcome to GSD! A workflow system for structured, documented,
spec-driven development.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📚 Quick Start

New to GSD? Start here:

1. **Initialize a project**
   /skill:gsd-new-project

2. **Plan a phase**
   /skill:gsd-plan-phase 01

3. **Execute plans**
   /skill:gsd-execute-phase 01

4. **Verify work**
   /skill:gsd-verify-work 01

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🔍 Help Topics

Run: /skill:gsd-help <topic>

  overview     What is GSD and how to get started
  commands     Full list of GSD commands
  workflow     The complete GSD development workflow
  config       Configuration options and settings
  tips         Best practices and pro tips

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 Common Commands

  /flow:gsd-master           Activate GSD workflow
  /skill:gsd-new-project     Initialize new project
  /skill:gsd-plan-phase      Create phase plans
  /skill:gsd-execute-phase   Execute phase plans
  /skill:gsd-verify-work     Verify completed work
  /skill:gsd-progress        Check project progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If in GSD project, append:**

```
## 📊 Current Project

Project: <project_name>
<current_phase>

Next: /skill:gsd-progress  → See detailed progress
```

---

### Topic: Overview

```
╔══════════════════════════════════════════════════════════════════╗
║  GSD OVERVIEW                                                    ║
╚══════════════════════════════════════════════════════════════════╝

## What is GSD?

GSD (Get Shit Done) is a spec-driven development workflow that helps
you build software with:

✓ Clear requirements and specifications
✓ Structured phase-based execution
✓ Built-in quality verification
✓ Complete project documentation
✓ AI-assisted planning and execution

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Core Concepts

### The Planning Directory (.planning/)

Every GSD project has a `.planning/` directory containing:

  PROJECT.md       Project vision and overview
  REQUIREMENTS.md  Detailed requirements and specs
  ROADMAP.md       Development phases and milestones
  STATE.md         Current project state and decisions
  config.json      Workflow configuration
  phases/          Phase-specific plans and summaries

### Phases and Plans

Work is organized into **phases** (e.g., Phase 01: Setup, Phase 02: Auth)
Each phase contains **plans** (e.g., 01-01, 01-02) with specific tasks

### Wave-Based Execution

Plans are executed in **waves** - independent plans run in parallel,
dependent plans wait for their dependencies.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Quick Start Guide

### 1. Initialize Your Project

/skill:gsd-new-project

  → Creates .planning/ directory
  → Gathers requirements through deep questioning
  → Generates PROJECT.md, REQUIREMENTS.md, ROADMAP.md
  → Initializes git repository

### 2. Plan Your First Phase

/skill:gsd-plan-phase 01

  → Researches phase requirements
  → Creates detailed execution plans
  → Includes verification criteria

### 3. Execute the Phase

/skill:gsd-execute-phase 01

  → Runs plans in parallel waves
  → Commits changes atomically
  → Creates execution summaries

### 4. Verify the Work

/skill:gsd-verify-work 01

  → Checks against phase goals
  → Identifies gaps if any
  → Approves or requests fixes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Why GSD?

### Traditional Development          GSD Approach
─────────────────────────────────────────────────────────────
Requirements in emails/Slack   →  Centralized REQUIREMENTS.md
Tribal knowledge               →  Documented in PROJECT.md
Ad-hoc execution               →  Wave-based parallel planning
Hope it works                  →  Verification at each phase
Lost context after breaks      →  STATE.md preserves context

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Next Steps

Learn more:
  /skill:gsd-help workflow    See the complete workflow
  /skill:gsd-help commands    View all available commands
  /skill:gsd-help tips        Get pro tips

Start building:
  /flow:gsd-master            Activate GSD in this directory
```

---

### Topic: Commands

```
╔══════════════════════════════════════════════════════════════════╗
║  GSD COMMANDS                                                    ║
╚══════════════════════════════════════════════════════════════════╝

## Core Commands

### Project Lifecycle

  /flow:gsd-master
    Entry point. Detects state and routes to appropriate action.

  /skill:gsd-new-project
    Initialize new project with deep context gathering.
    Creates: PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md

  /skill:gsd-discuss-phase <phase>
    Gather context and clarify approach for a phase.

  /skill:gsd-research-phase <phase>
    Research phase requirements before planning.

### Planning & Execution

  /skill:gsd-plan-phase <phase> [--research] [--gaps]
    Create detailed execution plans for a phase.
    --research: Include research phase
    --gaps: Plan gap closure (after verification)

  /skill:gsd-execute-phase <phase> [--gaps-only]
    Execute all plans in a phase using wave-based parallelization.
    --gaps-only: Execute only gap closure plans

  /skill:gsd-execute-plan <phase>-<plan>
    Execute a single plan manually.

### Quality & Verification

  /skill:gsd-verify-work <phase>
    Verify phase completion against goals.
    Creates VERIFICATION.md report.

  /skill:gsd-check-todos
    List and check todo items.

### Progress Tracking

  /skill:gsd-progress
    Show project progress dashboard.

  /skill:gsd-list-phase-assumptions <phase>
    Show assumptions for a phase.

  /skill:gsd-show-roadmap
    Display project roadmap.

### Utility

  /skill:gsd-quick <task>
    Execute ad-hoc task with GSD conventions.

  /skill:gsd-help [topic]
    Show this help.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Command Reference Table

┌────────────────────────┬──────────────────────────────────────┐
│ Command                │ When to Use                          │
├────────────────────────┼──────────────────────────────────────┤
│ gsd-master             │ Start of session, unsure what to do  │
│ gsd-new-project        │ Starting a new project               │
│ gsd-discuss-phase      │ Before planning, need clarity        │
│ gsd-research-phase     │ Need to research before planning     │
│ gsd-plan-phase         │ Ready to plan a phase                │
│ gsd-execute-phase      │ Plans ready, time to build           │
│ gsd-verify-work        │ Phase complete, need verification    │
│ gsd-progress           │ Check overall status                 │
│ gsd-quick              │ Small ad-hoc task                    │
│ gsd-help               │ Need help (you're here!)             │
└────────────────────────┴──────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Usage Examples

# Start a new project
/skill:gsd-new-project

# Plan phase 2 with research
/skill:gsd-plan-phase 02 --research

# Execute phase 2
/skill:gsd-execute-phase 02

# Verify phase 2
/skill:gsd-verify-work 02

# Check progress
/skill:gsd-progress

# Quick task
/skill:gsd-quick "Add email validation to signup form"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Topic: Workflow

```
╔══════════════════════════════════════════════════════════════════╗
║  GSD WORKFLOW                                                    ║
╚══════════════════════════════════════════════════════════════════╝

## The Complete GSD Development Cycle

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   DISCUSS   │───→│   RESEARCH  │───→│    PLAN     │
│   (Context) │    │  (Knowledge)│    │  (Design)   │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
┌─────────────┐    ┌─────────────┐    ┌──────▼──────┐
│   VERIFY    │←───│   EXECUTE   │←───│    WAVE     │
│   (Quality) │    │   (Build)   │    │ (Parallel)  │
└──────┬──────┘    └─────────────┘    └─────────────┘
       │
       ▼
┌─────────────┐
│   GAPS?     │──── Yes ───→ Create gap plans ───→ Re-plan
│  (Check)    │
└──────┬──────┘
       │ No
       ▼
┌─────────────┐
│   PHASE     │
│  COMPLETE   │
└─────────────┘
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Phase Workflow Detail

### Phase 0: Project Initialization

/skill:gsd-new-project

  1. Detect existing code (brownfield)
  2. Deep questioning about project vision
  3. Generate PROJECT.md
  4. Generate REQUIREMENTS.md
  5. Generate ROADMAP.md
  6. Initialize STATE.md
  7. Git init + initial commit

### Phase 1: Context Gathering (Optional)

/skill:gsd-discuss-phase 01
  → Gather context, clarify approach

/skill:gsd-research-phase 01
  → Research libraries, patterns, APIs

### Phase 2: Planning

/skill:gsd-plan-phase 01

  1. Read ROADMAP.md for phase goals
  2. Research (if --research flag)
  3. Create plans (01-01-PLAN.md, 01-02-PLAN.md, ...)
  4. Verify plans achieve phase goals
  5. Commit planning docs

### Phase 3: Execution

/skill:gsd-execute-phase 01

  1. Resolve model profile
  2. Discover plans
  3. Group by wave
  4. Execute waves in parallel
  5. Collect results
  6. Update STATE.md
  7. Commit phase completion

### Phase 4: Verification

/skill:gsd-verify-work 01

  1. Check against phase goals
  2. Review deliverables
  3. Assign status:
     - passed → Phase complete
     - gaps_found → Plan gaps
     - human_needed → Get approval

### Phase 5: Gap Closure (if needed)

/skill:gsd-plan-phase 01 --gaps
  → Create plans for gaps

/skill:gsd-execute-phase 01 --gaps-only
  → Execute gap plans

Loop until verification passes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Commit Conventions

GSD uses structured commits:

  type(phase-plan): description

Types:
  feat     New feature
  fix      Bug fix
  test     Test changes
  refactor Code refactoring
  perf     Performance
  docs     Documentation
  style    Formatting
  chore    Tooling/config

Examples:
  feat(01-02): add JWT authentication middleware
  fix(02-01): resolve race condition in user cache
  docs(03): complete API documentation phase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## State Management

STATE.md tracks:
  - Current phase and plan
  - Decisions made
  - Blockers and concerns
  - Session continuity info

This enables:
  - Resuming after interruptions
  - Context preservation
  - Team handoffs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Topic: Config

```
╔══════════════════════════════════════════════════════════════════╗
║  GSD CONFIGURATION                                               ║
╚══════════════════════════════════════════════════════════════════╝

## Configuration File

Location: `.planning/config.json`

## Default Configuration

```json
{
  "model_profile": "balanced",
  "parallelization": {
    "enabled": true,
    "max_workers": 3
  },
  "workflow": {
    "research": true,
    "verifier": true,
    "auto_commit": true
  },
  "planning": {
    "commit_docs": true,
    "max_plans_per_phase": 10
  }
}
```

## Options Reference

### model_profile

Controls AI model selection:

  "quality"   - Best quality (highest cost)
  "balanced"  - Good balance (default)
  "budget"    - Most economical

Example:
```json
"model_profile": "balanced"
```

### parallelization

Controls wave execution:

```json
"parallelization": {
  "enabled": true,      // Run plans in parallel
  "max_workers": 3      // Max concurrent plans
}
```

### workflow

Toggle workflow features:

```json
"workflow": {
  "research": true,     // Enable research phase
  "verifier": true,     // Enable verification
  "auto_commit": true   // Auto-commit changes
}
```

### planning

Planning document options:

```json
"planning": {
  "commit_docs": true,           // Commit planning files
  "max_plans_per_phase": 10      // Limit plans per phase
}
```

## Modifying Configuration

1. Edit `.planning/config.json`
2. Commit the change:
   ```bash
   git add .planning/config.json
   git commit -m "config: update workflow settings"
   ```

## Per-Phase Overrides

Not currently supported. Configure at project level.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Topic: Tips

```
╔══════════════════════════════════════════════════════════════════╗
║  GSD TIPS & BEST PRACTICES                                       ║
╚══════════════════════════════════════════════════════════════════╝

## Getting Started

✓ Start with /flow:gsd-master
  It detects your state and guides you.

✓ Be specific in PROJECT.md
  Vague specs lead to vague implementations.

✓ Use phases to organize work
  Don't put everything in one phase.

## Planning

✓ Keep plans small (2-3 tasks max)
  Smaller plans = easier verification.

✓ Use waves for dependencies
  Wave 1: infrastructure
  Wave 2: features that need infrastructure

✓ Include verification criteria
  Define "done" clearly in each plan.

## Execution

✓ Let GSD handle git
  Don't manually commit during execution.

✓ Watch for checkpoints
  Some plans pause for human input.

✓ Review SUMMARY.md files
  They document what was actually built.

## Verification

✓ Be honest about gaps
  Better to catch issues now than later.

✓ Use --gaps flag
  When verification finds gaps, use the flag.

## Recovery

✓ STATE.md is your friend
  Lost context? Read STATE.md.

✓ Check execution logs
  They're in .planning/execution/

✓ Git history tells the story
  Each task is a commit - review with git log.

## Advanced

✓ Customize config.json
  Tune to your project's needs.

✓ Use gsd-quick for small tasks
  Don't create a full phase for everything.

✓ Pause with checkpoints
  Add checkpoint tasks when you need breaks.

## Common Mistakes

✗ Don't git add .
  GSD stages files individually for clean history.

✗ Don't skip verification
  It's there for a reason.

✗ Don't make giant plans
  Break them down into waves.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Pro Tips

🔹 Use /skill:gsd-progress frequently
   Keeps you aware of overall status.

🔹 Commit .planning/ to git
   Preserves your project history.

🔹 Document decisions in STATE.md
   Future you will thank present you.

🔹 Run /skill:gsd-help <command>
   Get help on specific commands.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Command-Specific Help

If user asks for help on a specific command (e.g., `/skill:gsd-help plan-phase`), show:

1. Command syntax
2. Arguments and flags
3. Prerequisites
4. What it does (step by step)
5. Examples
6. Related commands

Extract from the respective SKILL.md files.

## Auto-Discovery

**Detect available commands:**

```bash
# List all gsd-* skills
ls ~/.kimi/skills/gsd-*/SKILL.md 2>/dev/null | xargs -I{} basename $(dirname {})
```

**Build command reference dynamically from installed skills.**

## Outputs

### Console Output

Help is displayed as formatted markdown in the chat.

### No File Changes

This skill only displays help - it doesn't modify any files.

## Success Criteria

- [ ] Help displays correctly for all topics
- [ ] Context-aware (shows project status if in GSD project)
- [ ] Command-specific help works
- [ ] ASCII art renders correctly
