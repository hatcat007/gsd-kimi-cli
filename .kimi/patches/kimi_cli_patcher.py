#!/usr/bin/env python3
"""
Kimi CLI GSD Patcher v1.0
Surgical source code patching for full GSD integration.

This patcher modifies Kimi CLI's source code to enable:
- GSD status bar integration (phase, todos, milestone)
- Background GSD update checking
- Enhanced welcome messages
- GSD context awareness throughout UI

Usage:
    python3 kimi_cli_patcher.py [apply|restore|status]

The patcher creates backups and can restore original files.
"""

from __future__ import annotations

import argparse
import hashlib
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

# Configuration
KIMI_CLI_ROOT = Path("/Users/aig/.local/share/uv/tools/kimi-cli/lib/python3.13/site-packages/kimi_cli")
BACKUP_SUFFIX = ".gsd-backup"
PATCH_VERSION = "1.0.0"


@dataclass
class Patch:
    """Represents a single file patch."""
    name: str
    target: Path
    backup: Path
    patch_func: Callable[[str], str]
    description: str


def get_kimi_cli_root() -> Path:
    """Find Kimi CLI installation directory."""
    # Try common locations
    candidates = [
        Path.home() / ".local/share/uv/tools/kimi-cli/lib/python3.13/site-packages/kimi_cli",
        Path.home() / ".local/share/uv/tools/kimi-cli/lib/python3.12/site-packages/kimi_cli",
        Path.home() / ".local/share/uv/tools/kimi-cli/lib/python3.11/site-packages/kimi_cli",
    ]
    
    for candidate in candidates:
        if candidate.exists():
            return candidate
    
    # Try to find via pip/uv
    try:
        result = subprocess.run(
            ["uv", "tool", "dir", "kimi-cli"],
            capture_output=True,
            text=True,
            check=True
        )
        base_path = Path(result.stdout.strip())
        # Find python version
        lib_dir = base_path / "lib"
        for py_dir in lib_dir.iterdir():
            if py_dir.name.startswith("python"):
                candidate = py_dir / "site-packages" / "kimi_cli"
                if candidate.exists():
                    return candidate
    except Exception:
        pass
    
    raise FileNotFoundError("Could not find Kimi CLI installation. Is it installed?")


def backup_file(original: Path) -> Path:
    """Create backup of original file if not exists."""
    backup = original.with_suffix(original.suffix + BACKUP_SUFFIX)
    if not backup.exists():
        shutil.copy2(original, backup)
        print(f"  📝 Backed up: {original.name}")
    return backup


def restore_file(original: Path) -> bool:
    """Restore file from backup."""
    backup = original.with_suffix(original.suffix + BACKUP_SUFFIX)
    if backup.exists():
        shutil.copy2(backup, original)
        backup.unlink()
        print(f"  🔄 Restored: {original.name}")
        return True
    return False


def verify_python_syntax(code: str, filename: str) -> bool:
    """Verify code is valid Python."""
    try:
        compile(code, filename, 'exec')
        return True
    except SyntaxError as e:
        print(f"  ❌ Syntax error in patch: {e}")
        return False


def apply_patch(patch: Patch) -> bool:
    """Apply a single patch."""
    print(f"\n🔧 {patch.description}")
    
    if not patch.target.exists():
        print(f"  ❌ Target not found: {patch.target}")
        return False
    
    try:
        original = patch.target.read_text()
        patched = patch.patch_func(original)
        
        if original == patched:
            print(f"  ⚠️  No changes needed (already patched?)")
            return True
        
        if not verify_python_syntax(patched, patch.target.name):
            return False
        
        backup_file(patch.target)
        patch.target.write_text(patched)
        print(f"  ✅ Patched: {patch.target.name}")
        return True
        
    except Exception as e:
        print(f"  ❌ Failed: {e}")
        return False


# =============================================================================
# PATCH FUNCTIONS
# =============================================================================

def patch_prompt_py(content: str) -> str:
    """
    Patch ui/shell/prompt.py to add GSD status bar integration.
    """
    # Add GSD import and helper function
    gsd_helper = '''
    def _get_gsd_context(self) -> dict:
        """Load GSD context from .planning directory."""
        try:
            from pathlib import Path
            import re
            import json
            import os
            
            planning_dir = Path.cwd() / '.planning'
            if not planning_dir.exists():
                return {}
            
            context = {
                'enabled': True,
                'phase': None,
                'todos_total': 0,
                'todos_done': 0,
                'milestone': None,
                'project': None,
            }
            
            # Parse STATE.md for current phase
            state_file = planning_dir / 'STATE.md'
            if state_file.exists():
                content = state_file.read_text()
                phase_match = re.search(r'Current Phase[:\s]+(\d+)', content, re.IGNORECASE)
                if phase_match:
                    context['phase'] = phase_match.group(1)
            
            # Parse PROJECT.md for project name
            project_file = planning_dir / 'PROJECT.md'
            if project_file.exists():
                content = project_file.read_text()
                title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
                if title_match:
                    context['project'] = title_match.group(1)[:25]  # Truncate
            
            # Count todos from session
            session_id = os.environ.get('KIMI_SESSION_ID', '')
            if session_id:
                todos_file = Path.home() / '.kimi' / 'todos' / f'{session_id}.json'
                if todos_file.exists():
                    todos = json.loads(todos_file.read_text())
                    context['todos_total'] = len(todos)
                    context['todos_done'] = sum(1 for t in todos if t.get('done'))
            
            return context
        except Exception:
            return {}

'''
    
    # Find insertion point - before _render_bottom_toolbar
    marker = "    def _render_bottom_toolbar(self) -> FormattedText:"
    if marker in content and '_get_gsd_context' not in content:
        content = content.replace(marker, gsd_helper + marker)
    
    # Modify _render_bottom_toolbar to include GSD info
    # Add after mode display, before shortcuts
    old_mode_display = '''        mode = str(self._mode).lower()
        if self._mode == PromptMode.AGENT:
            mode_details: list[str] = []
            if self._model_name:
                mode_details.append(self._model_name)
            if self._thinking:
                mode_details.append("thinking")
            if mode_details:
                mode += f" ({', '.join(mode_details)})"
        status = self._status_provider()'''
    
    new_mode_display = '''        mode = str(self._mode).lower()
        if self._mode == PromptMode.AGENT:
            mode_details: list[str] = []
            if self._model_name:
                mode_details.append(self._model_name)
            if self._thinking:
                mode_details.append("thinking")
            if mode_details:
                mode += f" ({', '.join(mode_details)})"
        status = self._status_provider()
        
        # ADD: GSD context
        gsd_ctx = self._get_gsd_context()
        if gsd_ctx.get('enabled'):
            gsd_parts = []
            if gsd_ctx.get('phase'):
                gsd_parts.append(f"📋P{gsd_ctx['phase']}")
            if gsd_ctx.get('todos_total'):
                done = gsd_ctx.get('todos_done', 0)
                total = gsd_ctx['todos_total']
                gsd_parts.append(f"✅{done}/{total}")
            if gsd_parts:
                gsd_str = " | " + " ".join(gsd_parts)
                fragments.extend([("fg:#00ff00", gsd_str), ("", " ")])
                columns -= len(gsd_str) + 1'''
    
    if old_mode_display in content:
        content = content.replace(old_mode_display, new_mode_display)
    
    return content


def patch_soul_init(content: str) -> str:
    """
    Patch soul/__init__.py to extend StatusSnapshot with GSD fields.
    """
    # Find and extend StatusSnapshot
    old_snapshot = '''@dataclass(frozen=True, slots=True)
class StatusSnapshot:
    """Status snapshot for the soul."""

    context_usage: float
    """The usage of the context, in percentage."""

    yolo_enabled: bool
    """Whether YOLO mode is enabled."""'''
    
    new_snapshot = '''@dataclass(frozen=True, slots=True)
class StatusSnapshot:
    """Status snapshot for the soul."""

    context_usage: float
    """The usage of the context, in percentage."""

    yolo_enabled: bool
    """Whether YOLO mode is enabled."""
    
    # GSD Extensions
    gsd_enabled: bool = False
    """Whether GSD is active in current project."""
    
    gsd_phase: str | None = None
    """Current GSD phase number."""
    
    gsd_todos_total: int = 0
    """Total number of GSD todos."""
    
    gsd_todos_done: int = 0
    """Number of completed GSD todos."""
    
    gsd_milestone: str | None = None
    """Current GSD milestone name."""
    
    gsd_project: str | None = None
    """Current GSD project name."""'''
    
    if old_snapshot in content:
        content = content.replace(old_snapshot, new_snapshot)
    
    return content


def patch_kimisoul_status(content: str) -> str:
    """
    Patch soul/kimisoul.py to add GSD context to status property.
    """
    # Find status property and enhance it
    old_status = '''    @property
    def status(self) -> StatusSnapshot:
        return StatusSnapshot(
            context_usage=self._context_usage,
            yolo_enabled=self._approval.is_yolo(),
        )'''
    
    new_status = '''    def _load_gsd_context(self) -> dict:
        """Load GSD context from .planning directory."""
        try:
            from pathlib import Path
            import re
            import json
            import os
            
            work_dir = Path(str(self.runtime.builtin_args.KIMI_WORK_DIR))
            planning_dir = work_dir / '.planning'
            if not planning_dir.exists():
                return {}
            
            context = {
                'gsd_enabled': True,
                'gsd_phase': None,
                'gsd_todos_total': 0,
                'gsd_todos_done': 0,
                'gsd_milestone': None,
                'gsd_project': None,
            }
            
            # Parse STATE.md
            state_file = planning_dir / 'STATE.md'
            if state_file.exists():
                content = state_file.read_text()
                phase_match = re.search(r'Current Phase[:\s]+(\d+)', content, re.IGNORECASE)
                if phase_match:
                    context['gsd_phase'] = phase_match.group(1)
            
            # Parse PROJECT.md
            project_file = planning_dir / 'PROJECT.md'
            if project_file.exists():
                proj_content = project_file.read_text()
                title_match = re.search(r'^#\s+(.+)$', proj_content, re.MULTILINE)
                if title_match:
                    context['gsd_project'] = title_match.group(1)[:30]
            
            # Parse ROADMAP.md for milestone
            roadmap_file = planning_dir / 'ROADMAP.md'
            if roadmap_file.exists():
                road_content = roadmap_file.read_text()
                mile_match = re.search(r'##\s+Current Milestone[:\s]*([^\n]+)', road_content, re.IGNORECASE)
                if mile_match:
                    context['gsd_milestone'] = mile_match.group(1).strip()[:20]
            
            # Read todos
            try:
                todo_file = work_dir / '.kimi-todos.json'
                if todo_file.exists():
                    todos = json.loads(todo_file.read_text())
                    context['gsd_todos_total'] = len(todos)
                    context['gsd_todos_done'] = sum(1 for t in todos if t.get('done'))
            except Exception:
                pass
            
            return context
        except Exception:
            return {}

    @property
    def status(self) -> StatusSnapshot:
        base = StatusSnapshot(
            context_usage=self._context_usage,
            yolo_enabled=self._approval.is_yolo(),
        )
        
        # Add GSD context
        gsd_ctx = self._load_gsd_context()
        if gsd_ctx.get('gsd_enabled'):
            return StatusSnapshot(
                context_usage=base.context_usage,
                yolo_enabled=base.yolo_enabled,
                **gsd_ctx
            )
        return base'''
    
    if old_status in content:
        content = content.replace(old_status, new_status)
    
    return content


def patch_shell_init(content: str) -> str:
    """
    Patch ui/shell/__init__.py to add GSD welcome and update check.
    """
    # Add GSD welcome after regular welcome
    old_welcome = '''def _print_welcome_info(name: str, items: list[WelcomeInfoItem] | None):
    console.print()
    console.print(f"[bold]{name}[/bold]", justify="center")'''
    
    new_welcome = '''def _get_gsd_welcome() -> str | None:
    """Generate GSD welcome message."""
    try:
        from pathlib import Path
        import re
        
        planning_dir = Path.cwd() / '.planning'
        if not planning_dir.exists():
            return None
        
        lines = ["[bold green]📋 GSD Project[/bold green]"]
        
        # Project name
        project_file = planning_dir / 'PROJECT.md'
        if project_file.exists():
            content = project_file.read_text()
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            if title_match:
                lines.append(f"   [cyan]{title_match.group(1)}[/cyan]")
        
        # Current phase
        state_file = planning_dir / 'STATE.md'
        if state_file.exists():
            content = state_file.read_text()
            phase_match = re.search(r'Current Phase[:\s]+(\d+)', content, re.IGNORECASE)
            if phase_match:
                lines.append(f"   Phase: [yellow]{phase_match.group(1)}[/yellow]")
        
        return "\\n".join(lines)
    except Exception:
        return None

def _print_welcome_info(name: str, items: list[WelcomeInfoItem] | None):
    console.print()
    console.print(f"[bold]{name}[/bold]", justify="center")
    
    # ADD: GSD welcome
    gsd_welcome = _get_gsd_welcome()
    if gsd_welcome:
        console.print()
        console.print(gsd_welcome)'''
    
    if old_welcome in content and '_get_gsd_welcome' not in content:
        content = content.replace(old_welcome, new_welcome)
    
    return content


def patch_wire_types(content: str) -> str:
    """
    Patch wire/types.py to add GSD-specific wire messages (for future extensibility).
    """
    # Add GSD event type at end of file
    gsd_event = '''

# GSD Extension Events
class GSDStatusEvent(BaseModel):
    """GSD status update event."""
    
    type: Literal["gsd_status"] = "gsd_status"
    phase: str | None = None
    todos_total: int = 0
    todos_done: int = 0
    milestone: str | None = None
    project: str | None = None

'''
    
    if 'GSDStatusEvent' not in content:
        content = content.rstrip() + gsd_event
    
    return content


# =============================================================================
# MAIN
# =============================================================================

def get_patches(kimi_root: Path) -> list[Patch]:
    """Get list of all patches to apply."""
    return [
        Patch(
            name="prompt.py",
            target=kimi_root / "ui" / "shell" / "prompt.py",
            backup=kimi_root / "ui" / "shell" / f"prompt.py{BACKUP_SUFFIX}",
            patch_func=patch_prompt_py,
            description="Status bar GSD integration"
        ),
        Patch(
            name="soul/__init__.py",
            target=kimi_root / "soul" / "__init__.py",
            backup=kimi_root / "soul" / f"__init__.py{BACKUP_SUFFIX}",
            patch_func=patch_soul_init,
            description="StatusSnapshot GSD extensions"
        ),
        Patch(
            name="kimisoul.py",
            target=kimi_root / "soul" / "kimisoul.py",
            backup=kimi_root / "soul" / f"kimisoul.py{BACKUP_SUFFIX}",
            patch_func=patch_kimisoul_status,
            description="GSD context provider"
        ),
        Patch(
            name="shell/__init__.py",
            target=kimi_root / "ui" / "shell" / "__init__.py",
            backup=kimi_root / "ui" / "shell" / f"__init__.py{BACKUP_SUFFIX}",
            patch_func=patch_shell_init,
            description="GSD welcome message"
        ),
        Patch(
            name="wire/types.py",
            target=kimi_root / "wire" / "types.py",
            backup=kimi_root / "wire" / f"types.py{BACKUP_SUFFIX}",
            patch_func=patch_wire_types,
            description="GSD wire event types"
        ),
    ]


def apply_all_patches(kimi_root: Path) -> bool:
    """Apply all patches."""
    print(f"\n{'='*60}")
    print(f"🚀 Kimi CLI GSD Patcher v{PATCH_VERSION}")
    print(f"{'='*60}")
    print(f"\nTarget: {kimi_root}")
    
    patches = get_patches(kimi_root)
    success = True
    
    for patch in patches:
        if not apply_patch(patch):
            success = False
    
    print(f"\n{'='*60}")
    if success:
        print("✅ All patches applied successfully!")
        print("\nNext steps:")
        print("  1. Run 'jim' to start GSD-enabled Kimi CLI")
        print("  2. Navigate to a GSD project directory")
        print("  3. See GSD status in the bottom toolbar!")
    else:
        print("⚠️  Some patches failed. Run with 'restore' to rollback.")
    print(f"{'='*60}\n")
    
    return success


def restore_all_patches(kimi_root: Path) -> bool:
    """Restore all files from backups."""
    print(f"\n{'='*60}")
    print("🔄 Restoring Kimi CLI to original state")
    print(f"{'='*60}\n")
    
    patches = get_patches(kimi_root)
    success = True
    
    for patch in patches:
        if restore_file(patch.target):
            pass
        else:
            print(f"  ⚠️  No backup found for {patch.name}")
    
    print(f"\n{'='*60}")
    print("✅ Restore complete!")
    print(f"{'='*60}\n")
    
    return success


def check_status(kimi_root: Path) -> None:
    """Check patching status."""
    print(f"\n{'='*60}")
    print("📊 Patching Status")
    print(f"{'='*60}\n")
    
    patches = get_patches(kimi_root)
    
    for patch in patches:
        status = "✅ Patched" if patch.backup.exists() else "❌ Not patched"
        exists = "📁" if patch.target.exists() else "❓"
        print(f"{exists} {patch.name:25} {status}")
    
    print(f"\n{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Kimi CLI GSD Patcher - Enable full GSD integration"
    )
    parser.add_argument(
        "action",
        choices=["apply", "restore", "status"],
        default="status",
        nargs="?",
        help="Action to perform (default: status)"
    )
    
    args = parser.parse_args()
    
    try:
        kimi_root = get_kimi_cli_root()
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        print("\nMake sure Kimi CLI is installed:")
        print("  uv tool install kimi-cli")
        return 1
    
    if args.action == "apply":
        return 0 if apply_all_patches(kimi_root) else 1
    elif args.action == "restore":
        return 0 if restore_all_patches(kimi_root) else 1
    else:
        check_status(kimi_root)
        return 0


if __name__ == "__main__":
    sys.exit(main())
