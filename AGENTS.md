# GSD for Kimi CLI - Agent Guide

> **Get Shit Done (GSD)** - A spec-driven development workflow system for Kimi CLI

## Project Overview

**Project Name:** GSD for Kimi CLI  
**Version:** 2.0.0  
**Type:** AI-assisted software development workflow system  
**License:** MIT  

GSD (Get Shit Done) is a context engineering and spec-driven development workflow that makes AI assistants reliable for building software. It solves "context rot" — the quality degradation that happens as AI fills its context window.

### Key Features

- 📋 **Structured Planning** - Organize work into phases with clear objectives
- 🤖 **Multi-Agent System** - 11 specialized subagents for different tasks
- 🌊 **Wave-Based Execution** - Run independent plans in parallel
- ✅ **Verification Built-in** - User acceptance testing with gap detection
- 📝 **Complete Documentation** - PROJECT.md, REQUIREMENTS.md, ROADMAP.md
- 🔄 **State Persistence** - Resume work seamlessly after interruptions

---

## Technology Stack

### Core Technologies
- **Node.js** (≥16.0.0) - Installation scripts and tooling
- **Python** (≥3.11) - Kimi CLI patches
- **YAML** - Agent configurations
- **Markdown** - Skills, workflows, and documentation

### Installation Methods
1. **One-line installer** (bash): `curl -sSL ... | bash`
2. **Node.js installer**: `node scripts/install.js`
3. **Manual installation**: Copy skills/agents to `~/.kimi/`

---

## Repository Structure

```
gsd-kimi-cli/
├── skills/                    # 27 GSD skills (SKILL.md files)
│   ├── gsd-master/           # Entry point flow skill
│   ├── gsd-new-project/      # Project initialization
│   ├── gsd-plan-phase/       # Phase planning
│   ├── gsd-execute-phase/    # Plan execution
│   ├── gsd-verify-work/      # Verification
│   ├── gsd-progress/         # Status display
│   ├── gsd-debug/            # Debugging
│   ├── gsd-quick/            # Quick tasks
│   └── ... (19 more skills)
│
├── agents/                    # 11 GSD subagents
│   ├── gsd-executor/         # Executes plans atomically
│   ├── gsd-planner/          # Creates detailed phase plans
│   ├── gsd-verifier/         # Validates work against requirements
│   ├── gsd-debugger/         # Root cause analysis
│   ├── gsd-roadmapper/       # Creates project roadmaps
│   ├── gsd-phase-researcher/ # Researches phase implementation
│   ├── gsd-project-researcher/ # Researches project domain
│   ├── gsd-research-synthesizer/ # Combines research outputs
│   ├── gsd-codebase-mapper/  # Analyzes existing codebases
│   ├── gsd-plan-checker/     # Validates plans before execution
│   └── gsd-integration-checker/ # Checks cross-phase wiring
│
├── references/                # 9 knowledge bases
│   ├── questioning.md        # How to gather requirements
│   ├── planning-config.md    # Planning configuration
│   ├── verification-patterns.md # Verification approaches
│   ├── git-integration.md    # Git workflow best practices
│   ├── model-profiles.md     # Model-specific settings
│   ├── tdd.md                # Test-driven development
│   ├── ui-brand.md           # UI/UX guidelines
│   ├── checkpoints.md        # Checkpoint system
│   └── continuation-format.md # Handoff format
│
├── workflows/                 # Flow skill templates
│   ├── complete-milestone.md
│   ├── diagnose-issues.md
│   ├── discovery-phase.md
│   ├── resume-project.md
│   ├── transition.md
│   └── verify-phase.md
│
├── patches/                   # Kimi CLI source patches
│   ├── kimi_cli_patcher.py   # Main patcher script
│   └── jim-wrapper.py        # Wrapper launcher
│
├── scripts/                   # Installation scripts
│   ├── install.js            # Main installer (Node.js)
│   └── uninstall.js          # Uninstaller
│
├── templates/                 # Project templates
│   ├── AGENTS.md             # Template for project AGENTS.md
│   └── SKILL.md.template     # Template for new skills
│
├── docs/                      # Documentation
│   ├── USAGE.md              # Usage guide
│   ├── PATCHES.md            # Patch documentation
│   └── phases/               # Phase-specific docs
│
├── gsd-agent.yaml            # Master agent configuration
├── package.json              # Node.js package manifest
├── install.sh                # Bash one-line installer
└── README.md                 # Project documentation
```

---

## Build and Installation Commands

### Development Installation

```bash
# Clone the repository
git clone https://github.com/hatcat007/gsd-kimi-cli.git
cd gsd-kimi-cli

# Run the Node.js installer
node scripts/install.js

# Apply Kimi CLI patches (optional but recommended)
jim --patch

# Start using GSD
jim
```

### Installation Options

```bash
# Full installation (recommended)
node scripts/install.js

# Skills only (no patches)
node scripts/install.js --skills-only

# Verify installation
node scripts/install.js --verify

# Uninstall
node scripts/install.js --uninstall
```

### Patch Management

```bash
# Apply patches
jim --patch

# Check patch status
jim --status

# Restore original files
jim --restore
```

### After Kimi CLI Updates

When Kimi CLI is updated, patches need to be re-applied:

```bash
# Update Kimi CLI
uv tool update kimi-cli

# Re-apply GSD patches
jim --patch
```

---

## Code Organization

### Skills Architecture

Each skill is a self-contained directory with a `SKILL.md` file:

```
skills/gsd-<skill-name>/
└── SKILL.md          # Skill definition and instructions
```

**Skill Types:**
- `standard` - Single-purpose skills with specific tasks
- `flow` - Orchestrator skills that route to other skills

**Skill Frontmatter:**
```yaml
---
name: gsd-skill-name
description: Brief description of what the skill does
type: standard  # or 'flow'
---
```

### Agents Architecture

Each agent has three files:

```
agents/gsd-<agent-name>/
├── agent.yaml        # Agent configuration (tools, permissions)
├── sub.yaml          # Subagent registration
└── system.md         # System prompt and behavior instructions
```

**Agent Configuration (agent.yaml):**
```yaml
version: 1
agent:
  name: gsd-agent-name
  system_prompt_path: ./system.md
  tools:
    - "kimi_cli.tools.shell:Shell"
    - "kimi_cli.tools.file:ReadFile"
    - "kimi_cli.tools.file:WriteFile"
    # ... more tools
```

### Master Agent Configuration

The master agent (`gsd-agent.yaml`) defines:
- System prompt path and additional role context
- Available tools
- All 11 subagents with descriptions

---

## Development Conventions

### Git Workflow

- **Commit format:** `type(scope): description`
- **Types:** feat, fix, test, refactor, docs, style, chore
- **Atomic commits:** One logical change per commit
- **No broad adds:** Never `git add .`, stage specific files
- **Co-authored by:** Include `Co-Authored-By: Kimi k2.5 <noreply@moonshot.cn>` for AI contributions

### Planning Document Structure

Projects using GSD create these files in `.planning/`:

| File | Purpose |
|------|---------|
| `PROJECT.md` | Project vision, goals, constraints |
| `REQUIREMENTS.md` | Scoped requirements (Validated/Active/Out of Scope) |
| `ROADMAP.md` | Phase structure and milestones |
| `STATE.md` | Current position and progress |
| `config.json` | Workflow preferences and settings |
| `phases/NN-name/` | Phase-specific plans and summaries |

### File Naming Conventions

- Plans: `NN-YY-PLAN.md` (phase number - plan number)
- Summaries: `NN-YY-SUMMARY.md`
- Research: `NN-RESEARCH.md`
- Verification: `VERIFICATION.md`

### Code Style Guidelines

**For JavaScript (scripts):**
- Use `const` and `let`, avoid `var`
- Async/await for asynchronous operations
- Template literals for string interpolation
- Destructuring for object properties

**For Python (patches):**
- Type hints where appropriate
- f-strings for formatting
- Pathlib for file operations
- Dataclasses for structured data

**For Markdown:**
- ATX-style headers (`# Header`)
- Fenced code blocks with language tags
- Tables for structured data
- Frontmatter for metadata

---

## Testing Strategy

### Verification Testing

The project includes comprehensive verification in `VERIFICATION.md`:
- 13 integration tests for GSD patches
- Tests cover status bar, welcome messages, edge cases
- All tests must pass before release

### Manual Testing

```bash
# Run installer verification
node scripts/install.js --verify

# Check patch status
jim --status

# Test skill loading
jim
/skill:gsd-help
```

### Test Categories

1. **Installation Tests** - Verify files copied correctly
2. **Patch Tests** - Verify Kimi CLI modifications work
3. **Integration Tests** - End-to-end workflow testing
4. **Edge Case Tests** - Graceful handling of missing/corrupt files

---

## Deployment Process

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run verification tests
4. Create GitHub release
5. Update Homebrew formula

### GitHub Actions

The repository uses GitHub Actions for:
- Automated releases
- Tarball generation
- Homebrew formula updates

### Distribution

- **npm:** Package published to npm registry
- **GitHub Releases:** Tarballs for direct download
- **Homebrew:** `brew install hatcat007/gsd-kimi-cli/gsd-kimi-cli`
- **One-line installer:** `curl` script from GitHub

---

## Security Considerations

### Patch Safety

- Patches create backups before modifying files (`.gsd-backup` suffix)
- Restore function can revert all changes
- Syntax verification before applying Python patches
- Patcher only modifies known Kimi CLI files

### File Permissions

- Scripts are installed with `0o755` permissions
- Patches directory restricted to user
- No elevated privileges required

### Data Privacy

- All GSD data stored locally in `.planning/` directory
- No network calls for GSD functionality (except research skills)
- Todo data in `.kimi-todos.json` is local only

---

## Common Commands Reference

### GSD Skills

| Command | Description |
|---------|-------------|
| `/skill:gsd-new-project` | Initialize new project |
| `/skill:gsd-plan-phase N` | Plan phase N |
| `/skill:gsd-execute-phase N` | Execute phase N |
| `/skill:gsd-verify-work N` | Verify phase N |
| `/skill:gsd-progress` | Show project status |
| `/skill:gsd-help` | List all commands |
| `/skill:gsd-quick` | Quick ad-hoc task |
| `/skill:gsd-debug` | Debug an issue |
| `/skill:gsd-check-todos` | View pending tasks |
| `/skill:gsd-map-codebase` | Analyze existing code |

### Utility Commands

```bash
# Create new project structure
/skill:gsd-new-project

# Check current status
/skill:gsd-progress

# Plan next phase
/skill:gsd-plan-phase 1

# Execute plans
/skill:gsd-execute-phase 1

# Verify completion
/skill:gsd-verify-work 1
```

---

## Resources and References

### Internal Documentation

- `references/questioning.md` - Requirements gathering techniques
- `references/planning-config.md` - Planning configuration options
- `references/verification-patterns.md` - Verification approaches
- `references/git-integration.md` - Git workflow best practices
- `references/tdd.md` - Test-driven development guidelines

### External Links

- **GitHub Repository:** https://github.com/hatcat007/gsd-kimi-cli
- **Kimi CLI:** https://github.com/MoonshotAI/kimi-cli
- **Original GSD:** https://github.com/glittercowboy/get-shit-done

---

## For AI Agents Working on This Project

### Before Making Changes

1. Read `package.json` for project metadata
2. Check `CHANGELOG.md` for recent changes
3. Understand the skill/agent you're modifying
4. Review similar existing implementations

### When Adding New Skills

1. Create directory: `skills/gsd-<name>/`
2. Write `SKILL.md` with frontmatter
3. Follow existing skill structure
4. Update `package.json` `files` array if needed

### When Adding New Agents

1. Create directory: `agents/gsd-<name>/`
2. Create `agent.yaml`, `sub.yaml`, `system.md`
3. Register in `gsd-agent.yaml` subagents section
4. Add description for Task tool integration

### Testing Changes

```bash
# Reinstall locally
node scripts/install.js

# Verify installation
node scripts/install.js --verify

# Test the skill/agent
jim
/skill:gsd-<skill-name>
```

---

*Last updated: 2025-02-05*  
*Generated for GSD for Kimi CLI v2.0.0*
