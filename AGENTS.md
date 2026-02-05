# GSD for Kimi CLI - Agent Guide

> **Get Shit Done (GSD)** - A spec-driven development workflow system for Kimi CLI

## ⚠️ THIS IS THE DEVELOPMENT PROJECT

**Important:** This repository is the **development source** for GSD Kimi CLI. When you run skills via `/skill:gsd-*` commands in this project, they load from the local `.kimi/` directory (development version), NOT from the system `~/.kimi/` installation.

### Local Development Structure

```
/Users/buddythacat/Documents/TOOLS/gsd-kimi-cli/
├── agents/                    # Source: Agent definitions (editable)
├── skills/                    # Source: Skill definitions (editable)
├── gsd-agent.yaml             # Source: Master agent config
├── .kimi/                     # DEV INSTALLATION (used by Kimi CLI)
│   ├── agents/               # Copy of agents/ (runtime uses this)
│   ├── skills/               # Copy of skills/ (runtime uses this)
│   ├── gsd-agent.yaml        # Copy with local paths patched
│   └── ...
```

**When testing skills:**
- `/skill:gsd-progress` → Loads from `.kimi/skills/gsd-progress/SKILL.md`
- `/skill:gsd-plan-phase` → Loads from `.kimi/skills/gsd-plan-phase/SKILL.md`
- Subagents spawn from `.kimi/agents/` and `.kimi/skills/gsd-agents/`

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
├── agents/                    # SOURCE: 11 GSD subagents (EDIT HERE)
│   ├── gsd-executor/         # Executes plans atomically
│   ├── gsd-planner/          # Creates detailed phase plans
│   ├── gsd-verifier/         # Validates work against requirements
│   └── ... (8 more agents)
│
├── skills/                    # SOURCE: 27 GSD skills (EDIT HERE)
│   ├── gsd-master/           # Entry point flow skill
│   ├── gsd-new-project/      # Project initialization
│   ├── gsd-plan-phase/       # Phase planning
│   └── ... (24 more skills)
│
├── references/                # 9 knowledge bases
├── workflows/                 # Flow skill templates
├── patches/                   # Kimi CLI source patches
├── scripts/                   # Installation scripts
├── templates/                 # Project templates
├── docs/                      # Documentation
├── gsd-agent.yaml             # SOURCE: Master agent config
├── package.json               # Node.js package manifest
├── install.sh                 # Bash one-line installer
├── README.md                  # Project documentation
│
└── .kimi/                     # DEV RUNTIME (auto-populated)
    ├── agents/                # Copied from agents/
    ├── skills/                # Copied from skills/
    ├── skills/gsd-agents/     # Agent subagent configs
    ├── gsd-agent.yaml         # Patched with local paths
    └── ...
```

**Key Points:**
- Edit source files in `agents/`, `skills/`, `gsd-agent.yaml`
- Local testing uses `.kimi/` (development runtime)
- Run `node scripts/install.js` to sync source → `.kimi/`

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

### Documentation Lookup (ALWAYS Use Context7)

**CRITICAL:** When you need information about libraries, frameworks, or APIs, **ALWAYS use the Context7 MCP tool** instead of guessing or relying on training data.

```
1. Call resolve-library-id with the library name
2. Call query-docs with the library ID and your specific question
3. Use the returned documentation to implement correctly
```

**Use Context7 for:**
- Library/framework APIs (OpenTUI, React, Express, etc.)
- Function signatures and options
- Official patterns and best practices
- Troubleshooting and common issues

**NEVER guess APIs** - always look them up with Context7 to ensure accuracy.

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

### Testing Changes (Development Workflow)

When working on this project, follow this workflow:

```bash
# 1. Edit source files
#    - agents/<agent-name>/system.md
#    - skills/<skill-name>/SKILL.md
#    - gsd-agent.yaml

# 2. Sync to development runtime (.kimi/)
node scripts/install.js

# 3. Test with REAL skill execution
#    (This uses .kimi/ NOT ~/.kimi/)
jim
/skill:gsd-progress
/skill:gsd-help
/skill:gsd-<skill-name>

# 4. Verify changes
node scripts/install.js --verify
```

**Important:** Skills load from `/Users/buddythacat/Documents/TOOLS/gsd-kimi-cli/.kimi/skills/` when in this project directory. This ensures you're testing the development version, not the system-installed version.

---

*Last updated: 2025-02-06*  
*Generated for GSD for Kimi CLI v2.0.0*
