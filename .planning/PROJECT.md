# GSD Installer TUI Project

**Project:** GSD Local-First Installer with OpenTUI  
**Goal:** Create a modern, interactive TUI installer for GSD with local-first default and global option  
**Date:** 2026-02-05

## Vision

Transform the GSD installation experience from a simple CLI script into a rich, interactive terminal user interface using OpenTUI. The installer should:

1. Default to **local installation** (project-specific)
2. Support **global installation** via `-g` flag
3. Provide a **beautiful TUI** with progress indicators, selections, and confirmation dialogs
4. Work via `curl -L code.kimi.com/install.sh | bash`

## Goals

### Primary Goals
- [ ] Create interactive TUI installer using OpenTUI
- [ ] Support local-first installation (default)
- [ ] Support global installation with `-g` flag
- [ ] Provide visual feedback during installation
- [ ] Allow component selection (skills, agents, patches)

### Secondary Goals
- [ ] Detect existing installations and offer update/overwrite
- [ ] Show installation summary with color-coded results
- [ ] Support non-interactive mode for CI/CD
- [ ] Cross-platform compatibility (macOS, Linux)

## Constraints

- Must work with `curl | bash` pattern
- Must handle both Node.js and Bun environments
- OpenTUI is in development - may need fallbacks
- Must maintain backward compatibility with existing install.js

## Success Criteria

1. User can run `curl -L code.kimi.com/install.sh | bash` and see TUI
2. Default installation is local to project
3. `-g` flag triggers global installation
4. Installation completes with visual success/failure indicators
5. Works on macOS and Linux
