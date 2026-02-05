# GSD Installer Roadmap

## Phase 1: Research & Architecture
**Goal:** Understand OpenTUI and design the installer architecture

### 1.1 Research OpenTUI
- [x] Research OpenTUI library capabilities
- [ ] Evaluate OpenTUI stability (in development warning)
- [ ] Create proof-of-concept TUI
- [ ] Identify fallback strategy if OpenTUI fails

### 1.2 Design Architecture
- [ ] Design TUI flow (screens, transitions)
- [ ] Design installation modes (local vs global)
- [ ] Design component selection UI
- [ ] Design progress reporting

### 1.3 Create Shell Wrapper
- [ ] Create install.sh bootstrap script
- [ ] Handle Node.js/Bun detection
- [ ] Download and execute TUI installer

**Deliverable:** Architecture decision record

---

## Phase 2: Core TUI Implementation
**Goal:** Build the interactive installer

### 2.1 Setup OpenTUI Project
- [ ] Create installer/ directory
- [ ] Setup package.json with OpenTUI dependency
- [ ] Create TypeScript configuration

### 2.2 Build TUI Screens
- [ ] Welcome screen with GSD branding
- [ ] Mode selection (local/global)
- [ ] Component selection screen
- [ ] Progress screen with animated spinner
- [ ] Summary/results screen

### 2.3 Installation Logic
- [ ] Port install.js logic to TypeScript
- [ ] Implement local installation
- [ ] Implement global installation
- [ ] Add validation and rollback

**Deliverable:** Working TUI installer in installer/ directory

---

## Phase 3: Shell Script & Distribution
**Goal:** Create curl-bash install experience

### 3.1 Create install.sh
- [ ] Detect Node.js/Bun availability
- [ ] Download latest installer
- [ ] Handle -g flag parsing
- [ ] Execute TUI or fallback to CLI

### 3.2 Update package.json
- [ ] Add postinstall script for local-first
- [ ] Support -g flag in npm install
- [ ] Update bin entries

### 3.3 Testing
- [ ] Test on macOS
- [ ] Test on Ubuntu
- [ ] Test local install
- [ ] Test global install
- [ ] Test CI/non-interactive mode

**Deliverable:** curl -L code.kimi.com/install.sh | bash works

---

## Phase 4: Documentation & Polish
**Goal:** Document and release

### 4.1 Documentation
- [ ] Update README with new install instructions
- [ ] Document TUI usage
- [ ] Document CI/non-interactive usage

### 4.2 Polish
- [ ] Add error handling
- [ ] Add colored output
- [ ] Add animations and visual flair

**Deliverable:** Released and documented

---

## Timeline

| Phase | Duration | Owner |
|-------|----------|-------|
| Phase 1 | 1 day | AI |
| Phase 2 | 2 days | AI |
| Phase 3 | 1 day | AI |
| Phase 4 | 1 day | AI |
