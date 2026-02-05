#!/usr/bin/env python3
"""
jim - GSD-enhanced Kimi CLI wrapper

This wrapper provides:
- Automatic patching on first run
- GSD status bar enhancements
- Project context detection
- Enhanced welcome messages

Usage:
    jim [kimi-cli-args...]
    jim --patch    # Force re-patch Kimi CLI
    jim --restore  # Restore original Kimi CLI
"""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

# Configuration
KIMI_CLI_ROOT = Path("/Users/aig/.local/share/uv/tools/kimi-cli/lib/python3.13/site-packages/kimi_cli")
GSD_AGENT = Path.home() / ".kimi" / "gsd-agent.yaml"


def ensure_patched() -> bool:
    """Ensure Kimi CLI is patched, apply if not."""
    patcher_script = Path(__file__).parent / "kimi_cli_patcher.py"
    
    # Check if already patched
    backup_exists = (KIMI_CLI_ROOT / "ui" / "shell" / "prompt.py.gsd-backup").exists()
    
    if not backup_exists and patcher_script.exists():
        print("🔧 First run: Applying GSD patches to Kimi CLI...")
        result = subprocess.run(
            [sys.executable, str(patcher_script), "apply"],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print("✅ Patches applied successfully!\n")
            return True
        else:
            print("⚠️  Patching failed, continuing with standard Kimi CLI...")
            print(result.stderr)
            return False
    
    return backup_exists


def get_gsd_welcome():
    """Generate GSD welcome message."""
    try:
        from pathlib import Path
        import re
        
        planning_dir = Path.cwd() / '.planning'
        if not planning_dir.exists():
            return None
        
        lines = []
        
        # Project name
        project_file = planning_dir / 'PROJECT.md'
        if project_file.exists():
            content = project_file.read_text()
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            if title_match:
                lines.append(f"📋 Project: {title_match.group(1)}")
        
        # Phase info
        state_file = planning_dir / 'STATE.md'
        if state_file.exists():
            content = state_file.read_text()
            phase_match = re.search(r'Current Phase[:\s]+(\d+)', content, re.IGNORECASE)
            if phase_match:
                lines.append(f"🎯 Phase: {phase_match.group(1)}")
        
        if lines:
            return " | ".join(lines)
        return None
    except Exception:
        return None


def launch_kimi(args: list[str]) -> int:
    """Launch Kimi CLI with GSD agent."""
    # Build command
    cmd = ["kimi"]
    
    # Add agent file if exists and not already specified
    if GSD_AGENT.exists() and "--agent-file" not in args and "--agent" not in args:
        cmd.extend(["--agent-file", str(GSD_AGENT)])
    
    # Add remaining args
    cmd.extend(args)
    
    # Show GSD welcome if in project
    welcome = get_gsd_welcome()
    if welcome:
        print(f"\n🚀 {welcome}\n")
    
    # Run kimi
    return subprocess.run(cmd).returncode


def main():
    parser = argparse.ArgumentParser(
        description="jim - GSD-enhanced Kimi CLI",
        add_help=False
    )
    parser.add_argument(
        "--patch",
        action="store_true",
        help="Force re-patch Kimi CLI"
    )
    parser.add_argument(
        "--restore",
        action="store_true",
        help="Restore original Kimi CLI"
    )
    parser.add_argument(
        "--status",
        action="store_true",
        help="Show patch status"
    )
    parser.add_argument(
        "kimi_args",
        nargs="*",
        help="Arguments to pass to Kimi CLI"
    )
    
    args, unknown = parser.parse_known_args()
    
    patcher_script = Path(__file__).parent / "kimi_cli_patcher.py"
    
    if args.patch:
        if patcher_script.exists():
            return subprocess.run([sys.executable, str(patcher_script), "apply"]).returncode
        else:
            print("❌ Patcher script not found")
            return 1
    
    if args.restore:
        if patcher_script.exists():
            return subprocess.run([sys.executable, str(patcher_script), "restore"]).returncode
        else:
            print("❌ Patcher script not found")
            return 1
    
    if args.status:
        if patcher_script.exists():
            return subprocess.run([sys.executable, str(patcher_script), "status"]).returncode
        else:
            print("❌ Patcher script not found")
            return 1
    
    # Ensure patches are applied
    ensure_patched()
    
    # Combine kimi_args with unknown args
    all_args = (args.kimi_args or []) + unknown
    
    # Launch kimi
    return launch_kimi(all_args)


if __name__ == "__main__":
    sys.exit(main())
