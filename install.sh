#!/usr/bin/env bash

# GSD for Kimi CLI - Bootstrap Installer
# 
# IMPORTANT: This installs GSD (Get Shit Done), NOT Kimi CLI itself.
# To install Kimi CLI, visit: https://github.com/MoonshotAI/kimi-cli
#
# REQUIREMENT: Bun is required for the TUI installer.
# Install Bun: curl -fsSL https://bun.sh/install | bash
#
# Usage: 
#   curl -fsSL https://raw.githubusercontent.com/hatcat007/gsd-kimi-cli/main/install.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/hatcat007/gsd-kimi-cli/main/install.sh | bash -s -- -g

set -e

# Colors
C_RESET='\033[0m'
C_GREEN='\033[32m'
C_YELLOW='\033[33m'
C_RED='\033[31m'
C_BLUE='\033[34m'
C_CYAN='\033[36m'
C_BOLD='\033[1m'
C_DIM='\033[2m'

# Configuration
GSD_VERSION="2.0.0"
GSD_REPO="https://github.com/hatcat007/gsd-kimi-cli"
INSTALLER_URL="${GSD_REPO}/raw/main/installer"
TEMP_DIR="$(mktemp -d)"

# Cleanup on exit
trap 'rm -rf "${TEMP_DIR}"' EXIT

# Logging
log() { echo -e "${1}${2}${C_RESET}"; }
info() { log "$C_BLUE" "ℹ $1"; }
success() { log "$C_GREEN" "✓ $1"; }
warn() { log "$C_YELLOW" "⚠ $1"; }
error() { log "$C_RED" "✗ $1"; }
header() { log "$C_BOLD$C_CYAN" "$1"; }

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Print banner
print_banner() {
  echo ""
  header "   ██████╗ ███████╗██████╗"
  header "  ██╔════╝ ██╔════╝██╔══██╗"
  header "  ██║  ███╗███████╗██║  ██║"
  header "  ██║   ██║╚════██║██║  ██║"
  header "  ╚██████╔╝███████║██████╔╝"
  header "   ╚═════╝ ╚══════╝╚═════╝"
  echo ""
  log "$C_BOLD" "  Get Shit Done for Kimi CLI v${GSD_VERSION}"
  log "$C_DIM" "  Spec-driven development workflow system"
  echo ""
}

# Check prerequisites - Bun is REQUIRED
check_prerequisites() {
  info "Checking prerequisites..."
  
  # Check Bun (REQUIRED)
  if command_exists bun; then
    BUN_VERSION=$(bun --version 2>/dev/null)
    success "Bun ${BUN_VERSION} ✨"
  else
    error "Bun is required but not installed."
    echo ""
    info "Install Bun with:"
    info "  curl -fsSL https://bun.sh/install | bash"
    echo ""
    info "Then restart your terminal and run this installer again."
    exit 1
  fi
  
  # Check git (optional but recommended)
  if command_exists git; then
    success "Git available"
  else
    warn "Git not found (optional)"
  fi
  
  # Check kimi CLI
  if command_exists kimi; then
    success "Kimi CLI available"
  else
    warn "Kimi CLI not found. Install with: uv tool install kimi-cli"
  fi
}

# Parse arguments
parse_args() {
  GLOBAL_MODE=false
  NON_INTERACTIVE=false
  
  for arg in "$@"; do
    case $arg in
      -g|--global)
        GLOBAL_MODE=true
        shift
        ;;
      -y|--yes)
        NON_INTERACTIVE=true
        shift
        ;;
      -h|--help)
        show_help
        exit 0
        ;;
    esac
  done
}

# Show help
show_help() {
  echo "GSD for Kimi CLI - Installer"
  echo ""
  echo "Installs GSD (Get Shit Done) workflow system for Kimi CLI."
  echo ""
  echo "REQUIREMENT: Bun must be installed."
  echo "  Install: curl -fsSL https://bun.sh/install | bash"
  echo ""
  echo "Usage:"
  echo "  curl -fsSL https://raw.githubusercontent.com/hatcat007/gsd-kimi-cli/main/install.sh | bash"
  echo "  curl -fsSL https://raw.githubusercontent.com/hatcat007/gsd-kimi-cli/main/install.sh | bash -s -- [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  -g, --global       Install globally (default: local)"
  echo "  -y, --yes          Non-interactive mode (default: false)"
  echo "  -h, --help         Show this help"
  echo ""
  echo "Examples:"
  echo "  # Local install (recommended)"
  echo "  curl -fsSL https://raw.githubusercontent.com/hatcat007/gsd-kimi-cli/main/install.sh | bash"
  echo ""
  echo "  # Global install"
  echo "  curl -fsSL https://raw.githubusercontent.com/hatcat007/gsd-kimi-cli/main/install.sh | bash -s -- -g"
  echo ""
  echo "  # CI/Non-interactive"
  echo "  curl -fsSL https://raw.githubusercontent.com/hatcat007/gsd-kimi-cli/main/install.sh | bash -s -- -y"
  echo ""
  echo "Note: This installs GSD, not Kimi CLI itself."
  echo "      Get Kimi CLI at: https://github.com/MoonshotAI/kimi-cli"
}

# Setup installer based on available runtime
setup_installer() {
  info "Setting up installer..."
  
  # Check if we're in the GSD repo (development mode)
  if [ -f "$(pwd)/gsd-agent.yaml" ] && [ -d "$(pwd)/installer" ]; then
    success "Development mode detected"
    INSTALLER_DIR="$(pwd)/installer"
    return 0
  fi
  
  # Download installer from GitHub
  info "Downloading GSD installer..."
  
  # Download and extract to temp directory (don't change working dir)
  curl -sL "${GSD_REPO}/archive/refs/heads/main.tar.gz" | tar -xz -C "$TEMP_DIR" --strip-components=1 || {
    error "Failed to download installer"
    info "Try: git clone ${GSD_REPO} && cd gsd-kimi-cli && bun install"
    exit 1
  }
  
  # Verify the installer directory exists
  if [ ! -d "$TEMP_DIR/installer" ]; then
    error "Installer directory not found after extraction"
    error "Contents of temp dir:"
    ls -la "$TEMP_DIR" >&2
    exit 1
  fi
  
  INSTALLER_DIR="$TEMP_DIR/installer"
  success "Installer downloaded to $INSTALLER_DIR"
}

# Install dependencies using Bun
install_deps() {
  info "Installing dependencies with Bun..."
  
  (cd "$INSTALLER_DIR" && bun install) || {
    error "Failed to install dependencies"
    exit 1
  }
  
  success "Dependencies installed"
}

# Run the TUI installer
run_tui_installer() {
  info "Starting TUI installer..."
  
  ARGS=""
  if [ "$GLOBAL_MODE" = true ]; then
    ARGS="$ARGS -g"
  fi
  
  if [ "$NON_INTERACTIVE" = true ]; then
    ARGS="$ARGS -y"
  fi
  
  # Build and run with Bun
  (cd "$INSTALLER_DIR" && bun run build) || {
    error "Failed to build installer"
    exit 1
  }
  
  bun "$INSTALLER_DIR/dist/index.js" $ARGS
}

# Main installation logic
run_installer() {
  install_deps
  run_tui_installer
}

# Main
main() {
  print_banner
  parse_args "$@"
  check_prerequisites
  setup_installer
  run_installer
}

main "$@"
