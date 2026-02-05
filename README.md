# GSD for Kimi CLI

> **Get Shit Done** - A spec-driven development workflow system for [Kimi CLI](https://github.com/MoonshotAI/kimi-cli)

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/optivent/gsd-kimi-cli)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🎯 What is GSD?

GSD (Get Shit Done) is a **context engineering and spec-driven development workflow** that makes AI assistants reliable for building software. It solves "context rot" — the quality degradation that happens as AI fills its context window.

**Key Features:**
- 📋 **Structured Planning** - Organize work into phases with clear objectives
- 🤖 **Multi-Agent System** - 11 specialized subagents for different tasks
- 🌊 **Wave-Based Execution** - Run independent plans in parallel
- ✅ **Verification Built-in** - User acceptance testing with gap detection
- 📝 **Complete Documentation** - PROJECT.md, REQUIREMENTS.md, ROADMAP.md
- 🔄 **State Persistence** - Resume work seamlessly after interruptions

## 🚀 Quick Start

### Installation

#### Option 1: One-Line Installer (Recommended)

```bash
# Install locally in current project (default)
curl -fsSL https://raw.githubusercontent.com/optivent/gsd-kimi-cli/main/install.sh | bash

# Install globally for all projects
curl -fsSL https://raw.githubusercontent.com/optivent/gsd-kimi-cli/main/install.sh | bash -s -- -g

# CI/Non-interactive mode
curl -fsSL https://raw.githubusercontent.com/optivent/gsd-kimi-cli/main/install.sh | bash -s -- -y
```

The installer will:
- **Auto-detect** if Bun is available for beautiful TUI mode
- **Fallback** to CLI mode with Node.js
- **Default to local** installation (project-specific)
- Support `-g` flag for global installation

#### Option 2: npm (Global)

```bash
# Install globally
npm install -g gsd-kimi-cli

# Or install locally in a project
npm install gsd-kimi-cli
```

#### Option 3: Manual

```bash
# Clone the repository
git clone https://github.com/optivent/gsd-kimi-cli.git
cd gsd-kimi-cli

# Run the local installer
node .kimi/install-local.js

# Or for global install
node scripts/install.js

# Apply Kimi CLI patches (optional but recommended)
jim --patch

# Start using GSD
jim
```

**Note:** `code.kimi.com/install.sh` installs **Kimi CLI itself**. The GSD installer is hosted at `raw.githubusercontent.com/optivent/gsd-kimi-cli/main/install.sh`.

### Usage

```bash
# Create a new project
/skill:gsd-new-project

# Plan a phase
/skill:gsd-plan-phase 1

# Execute the phase
/skill:gsd-execute-phase 1

# Verify the work
/skill:gsd-verify-work 1

# Check progress
/skill:gsd-progress
```

## 📦 What's Included

### 27 GSD Skills

| Category | Skills |
|----------|--------|
| **Project** | `gsd-new-project`, `gsd-progress`, `gsd-help` |
| **Phase** | `gsd-plan-phase`, `gsd-execute-phase`, `gsd-verify-work` |
| **Milestone** | `gsd-new-milestone`, `gsd-complete-milestone`, `gsd-audit-milestone` |
| **Management** | `gsd-add-phase`, `gsd-insert-phase`, `gsd-remove-phase` |
| **Utilities** | `gsd-debug`, `gsd-quick`, `gsd-check-todos`, `gsd-map-codebase` |

### 11 GSD Agents

- `gsd-executor` - Executes plans atomically
- `gsd-planner` - Creates detailed phase plans
- `gsd-verifier` - Validates work against requirements
- `gsd-debugger` - Root cause analysis
- `gsd-roadmapper` - Creates project roadmaps
- `gsd-phase-researcher` - Researches phase implementation
- `gsd-project-researcher` - Researches project domain
- `gsd-research-synthesizer` - Combines research outputs
- `gsd-codebase-mapper` - Analyzes existing codebases
- `gsd-plan-checker` - Validates plans before execution
- `gsd-integration-checker` - Checks cross-phase wiring

### 9 Reference Knowledge Bases

- `questioning.md` - How to gather requirements
- `planning-config.md` - Planning configuration
- `verification-patterns.md` - Verification approaches
- `git-integration.md` - Git workflow best practices
- `model-profiles.md` - Model-specific settings
- `tdd.md` - Test-driven development
- `ui-brand.md` - UI/UX guidelines
- `checkpoints.md` - Checkpoint system
- `continuation-format.md` - Handoff format

### Source Code Patching

For full UI integration, GSD patches Kimi CLI's source code:

- **Status Bar** - Shows GSD context (phase, todos, milestone)
- **Welcome Message** - GSD project awareness
- **Context Provider** - Real-time GSD state

## 🛠️ Installation Options

### Option 1: Full Installation (Recommended)

```bash
node scripts/install.js
jim --patch
```

Includes:
- ✅ All 27 skills
- ✅ All 11 agents
- ✅ All 9 references
- ✅ All workflows
- ✅ UI patches

### Option 2: Skills Only

```bash
node scripts/install.js --skills-only
```

Installs skills without patching Kimi CLI source.

### Option 3: Manual Installation

```bash
# Copy skills to Kimi CLI skills directory
cp -r skills/* ~/.kimi/skills/

# Copy agents
cp -r agents/* ~/.kimi/agents/

# Create master agent
cp gsd-agent.yaml ~/.kimi/
```

## 🔄 Updating

### After Kimi CLI Updates

When Kimi CLI is updated, the patches need to be re-applied:

```bash
# Update Kimi CLI
uv tool update kimi-cli

# Re-apply GSD patches
jim --patch
```

### Update GSD Itself

```bash
cd gsd-kimi-cli
git pull
node scripts/install.js
jim --patch
```

## 📊 Comparison with Official GSD

| Feature | Claude Code GSD | Kimi CLI GSD (This) |
|---------|-----------------|---------------------|
| Commands | 27 | 27 ✅ |
| Agents | 11 | 11 ✅ |
| References | 9 | 9 ✅ |
| Workflows | 11 | 9+ ✅ |
| Status Bar | Native | Patched ✅ |
| Update Check | Automatic | Manual ⚠️ |

**Functional parity: ~95%**

## 🏗️ Repository Structure

```
gsd-kimi-cli/
├── skills/              # 27 GSD skills
│   ├── gsd-master/
│   ├── gsd-new-project/
│   └── ...
├── agents/              # 11 GSD agents
│   ├── gsd-executor/
│   ├── gsd-planner/
│   └── ...
├── references/          # 9 knowledge bases
│   ├── questioning.md
│   ├── planning-config.md
│   └── ...
├── workflows/           # Flow skill templates
│   ├── complete-milestone.md
│   └── ...
├── patches/             # Kimi CLI source patches
│   ├── kimi_cli_patcher.py
│   └── jim-wrapper.py
├── scripts/             # Installation scripts
│   └── install.js
├── templates/           # Project templates
├── docs/                # Documentation
└── README.md
```

## 🧪 Testing

```bash
# Run test suite
npm test

# Verify installation
node scripts/install.js --verify

# Check patch status
jim --status
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Credits

- Original GSD concept by [TÂCHES](https://github.com/glittercowboy) for Claude Code
- Adapted for Kimi CLI by the community

## 🔗 Links

- [GitHub Repository](https://github.com/optivent/gsd-kimi-cli)
- [Kimi CLI](https://github.com/MoonshotAI/kimi-cli)
- [Original GSD](https://github.com/glittercowboy/get-shit-done)

---

**Ready to Get Shit Done?**

```bash
git clone https://github.com/optivent/gsd-kimi-cli.git
cd gsd-kimi-cli
node scripts/install.js
jim --patch
jim
```
