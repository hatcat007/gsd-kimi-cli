# GSD Installer Requirements

**Status:** Draft  
**Last Updated:** 2026-02-05

---

## Functional Requirements

### FR1: Installation Modes
- **FR1.1:** Default mode MUST install GSD locally in current project
- **FR1.2:** `-g` or `--global` flag MUST install to user's home directory
- **FR1.3:** `--local` flag MUST explicitly request local installation

### FR2: TUI Interface
- **FR2.1:** Installer MUST display a branded welcome screen
- **FR2.2:** Installer MUST show installation mode selection
- **FR2.3:** Installer MUST display progress with animated indicators
- **FR2.4:** Installer MUST show component selection (checkboxes):
  - GSD Skills (30)
  - GSD Agents (11)
  - GSD References (9)
  - GSD Workflows (6)
  - Patches (optional)
- **FR2.5:** Installer MUST display installation summary with:
  - Number of components installed/updated
  - Installation location
  - Next steps

### FR3: Non-Interactive Mode
- **FR3.1:** `--yes` or `-y` flag MUST skip all prompts and use defaults
- **FR3.2:** CI environment detection MUST auto-enable non-interactive mode

### FR4: Detection & Updates
- **FR4.1:** Installer MUST detect existing GSD installations
- **FR4.2:** Installer MUST offer to update or overwrite existing installations
- **FR4.3:** Installer MUST show version comparison (installed vs available)

---

## Non-Functional Requirements

### NFR1: Performance
- **NFR1.1:** TUI MUST render within 1 second
- **NFR1.2:** Installation progress MUST update in real-time

### NFR2: Compatibility
- **NFR2.1:** MUST work on macOS 12+
- **NFR2.2:** MUST work on Ubuntu 20.04+ and RHEL 8+
- **NFR2.3:** MUST detect and use available package manager (npm/yarn/pnpm/bun)

### NFR3: Reliability
- **NFR3.1:** Installation MUST be atomic (rollback on failure)
- **NFR3.2:** MUST validate installation before reporting success

---

## Out of Scope

- Windows PowerShell support (future)
- GUI installer (future)
- Automatic dependency installation (node, git)
