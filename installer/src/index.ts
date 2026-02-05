#!/usr/bin/env node

/**
 * GSD TUI Installer with OpenTUI
 * Local-first installation with -g global option
 */

import {
  createCliRenderer,
  TextRenderable,
  BoxRenderable,
  SelectRenderable,
  SelectRenderableEvents,
  TextAttributes,
} from "@opentui/core";
import * as fs from "fs-extra";
import * as path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors
const C = {
  cyan: "#7dcfff",
  green: "#9ece6a",
  yellow: "#e0af68",
  red: "#f7768e",
  purple: "#bb9af7",
  blue: "#2ac3de",
  white: "#c0caf5",
  gray: "#565f89",
  darkBg: "#1a1b26",
  panelBg: "#24283b",
};

// Installation state
interface InstallState {
  mode: "local" | "global";
  components: {
    skills: boolean;
    agents: boolean;
    references: boolean;
    workflows: boolean;
    patches: boolean;
  };
  progress: number;
  status: string;
  results: {
    skills: { installed: number; updated: number };
    agents: { installed: number; updated: number };
    references: number;
    workflows: number;
  };
}

const state: InstallState = {
  mode: "local",
  components: {
    skills: true,
    agents: true,
    references: true,
    workflows: true,
    patches: true,
  },
  progress: 0,
  status: "Ready",
  results: {
    skills: { installed: 0, updated: 0 },
    agents: { installed: 0, updated: 0 },
    references: 0,
    workflows: 0,
  },
};

// Paths
const GSD_DIR = path.resolve(__dirname, "../..");
const HOME_DIR = process.env.HOME || process.env.USERPROFILE || "/tmp";
const LOCAL_KIMI_DIR = path.join(process.cwd(), ".kimi");
const GLOBAL_KIMI_DIR = path.join(HOME_DIR, ".kimi");

// Check for -g flag
const args = process.argv.slice(2);
if (args.includes("-g") || args.includes("--global")) {
  state.mode = "global";
}

// Check for -y flag (non-interactive)
const nonInteractive = args.includes("-y") || args.includes("--yes") || !!process.env.CI;

async function copyDirRecursive(source: string, target: string) {
  await fs.ensureDir(target);
  const entries = await fs.readdir(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirRecursive(sourcePath, targetPath);
    } else {
      await fs.copy(sourcePath, targetPath);
    }
  }
}

async function waitForEnter(): Promise<void> {
  return new Promise((resolve) => {
    process.stdin.once("data", () => resolve());
  });
}

async function showWelcome(renderer: any) {
  const container = new BoxRenderable(renderer, {
    id: "welcome-container",
    width: "100%",
    height: "100%",
    backgroundColor: C.darkBg,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  });

  const banner = new TextRenderable(renderer, {
    id: "banner",
    content: "\n   ██████╗ ███████╗██████╗ \n  ██╔════╝ ██╔════╝██╔══██╗\n  ██║  ███╗███████╗██║  ██║\n  ██║   ██║╚════██║██║  ██║\n  ╚██████╔╝███████║██████╔╝\n   ╚═════╝ ╚══════╝╚═════╝ \n",
    fg: C.cyan,
  });

  const title = new TextRenderable(renderer, {
    id: "title",
    content: "Get Shit Done for Kimi CLI v2.0.0",
    fg: C.white,
    attributes: TextAttributes.BOLD,
  });

  const subtitle = new TextRenderable(renderer, {
    id: "subtitle",
    content: "Spec-driven development workflow system",
    fg: C.gray,
  });

  const spacer = new BoxRenderable(renderer, {
    id: "spacer",
    width: 1,
    height: 2,
  });

  const hint = new TextRenderable(renderer, {
    id: "hint",
    content: "Press Enter to continue...",
    fg: C.yellow,
  });

  container.add(banner);
  container.add(title);
  container.add(subtitle);
  container.add(spacer);
  container.add(hint);
  renderer.root.add(container);

  if (!nonInteractive) {
    await waitForEnter();
  } else {
    await new Promise(r => setTimeout(r, 1500));
  }
  
  renderer.root.remove(container);
}

async function showModeSelection(renderer: any) {
  if (nonInteractive) return;

  const container = new BoxRenderable(renderer, {
    id: "mode-container",
    width: "100%",
    height: "100%",
    backgroundColor: C.darkBg,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  });

  const title = new TextRenderable(renderer, {
    id: "mode-title",
    content: "Select Installation Mode",
    fg: C.cyan,
    attributes: TextAttributes.BOLD,
  });

  const desc1 = new TextRenderable(renderer, {
    id: "mode-desc1",
    content: "Local: Creates .kimi/ in current directory",
    fg: C.gray,
  });

  const desc2 = new TextRenderable(renderer, {
    id: "mode-desc2",
    content: "Global: Installs to ~/.kimi/ for all projects",
    fg: C.gray,
  });

  const spacer = new BoxRenderable(renderer, {
    id: "spacer",
    width: 1,
    height: 1,
  });

  const select = new SelectRenderable(renderer, {
    id: "mode-select",
    width: 50,
    height: 8,
    options: [
      { name: "📁 Local (recommended)", description: "Install in current project only", value: "local" },
      { name: "🌍 Global", description: "Install for all projects", value: "global" },
    ],
    selectedIndex: state.mode === "local" ? 0 : 1,
    backgroundColor: C.panelBg,
    focusedBackgroundColor: C.blue,
    selectedBackgroundColor: C.green,
  });

  container.add(title);
  container.add(desc1);
  container.add(desc2);
  container.add(spacer);
  container.add(select);
  renderer.root.add(container);

  select.focus();

  await new Promise<void>((resolve) => {
    select.on(SelectRenderableEvents.ITEM_SELECTED, (index: number, option: any) => {
      state.mode = option.value;
      resolve();
    });
  });
  
  renderer.root.remove(container);
}

async function showComponentSelection(renderer: any) {
  if (nonInteractive) return;

  renderer.root.clear();

  const container = new BoxRenderable(renderer, {
    id: "component-container",
    width: "100%",
    height: "100%",
    backgroundColor: C.darkBg,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  });

  const title = new TextRenderable(renderer, {
    id: "comp-title",
    content: "Select Components to Install",
    fg: C.cyan,
    attributes: TextAttributes.BOLD,
  });

  const spacer1 = new BoxRenderable(renderer, { id: "spacer1", width: 1, height: 1 });
  container.add(title);
  container.add(spacer1);

  const componentKeys = ["skills", "agents", "references", "workflows", "patches"] as const;
  const componentLabels: Record<string, string> = {
    skills: "1. GSD Skills (30)      - Core workflow skills",
    agents: "2. GSD Agents (11)      - AI subagents",
    references: "3. References (9)       - Knowledge bases",
    workflows: "4. Workflows (6)        - Workflow templates",
    patches: "5. Patches              - Kimi CLI patches",
  };

  const componentTexts: Record<string, TextRenderable> = {};

  const updateDisplay = () => {
    for (const key of componentKeys) {
      const checked = state.components[key];
      const label = componentLabels[key];
      const text = `[${checked ? "✓" : " "}] ${label}`;
      if (componentTexts[key]) {
        componentTexts[key].content = text;
        componentTexts[key].fg = checked ? C.green : C.gray;
      }
    }
  };

  for (const key of componentKeys) {
    const checked = state.components[key];
    const label = componentLabels[key];
    const textNode = new TextRenderable(renderer, {
      id: `comp-${key}`,
      content: `[${checked ? "✓" : " "}] ${label}`,
      fg: checked ? C.green : C.gray,
    });
    componentTexts[key] = textNode;
    container.add(textNode);
  }

  const spacer2 = new BoxRenderable(renderer, { id: "spacer2", width: 1, height: 2 });
  const hint = new TextRenderable(renderer, {
    id: "comp-hint",
    content: "Press 1-5 to toggle, Enter to continue...",
    fg: C.yellow,
  });

  container.add(spacer2);
  container.add(hint);
  renderer.root.add(container);

  await new Promise<void>((resolve) => {
    const handler = (data: Buffer) => {
      const key = data.toString().trim();
      if (key === "1") state.components.skills = !state.components.skills;
      else if (key === "2") state.components.agents = !state.components.agents;
      else if (key === "3") state.components.references = !state.components.references;
      else if (key === "4") state.components.workflows = !state.components.workflows;
      else if (key === "5") state.components.patches = !state.components.patches;
      else if (key === "" || key === "\n") {
        process.stdin.off("data", handler);
        resolve();
        return;
      }
      updateDisplay();
    };
    process.stdin.on("data", handler);
  });
  
  renderer.root.remove(container);
}

async function installSkills(targetDir: string) {
  if (!state.components.skills) return;
  
  const skillsDir = path.join(GSD_DIR, "skills");
  const targetSkillsDir = path.join(targetDir, "skills");
  
  await fs.ensureDir(targetSkillsDir);
  const skills = await fs.readdir(skillsDir);
  
  let installed = 0;
  let updated = 0;
  
  for (const skill of skills) {
    if (!skill.startsWith("gsd-")) continue;
    const source = path.join(skillsDir, skill);
    const target = path.join(targetSkillsDir, skill);
    const stat = await fs.stat(source).catch(() => null);
    
    if (!stat?.isDirectory()) continue;
    
    if (await fs.pathExists(target)) {
      updated++;
    } else {
      installed++;
    }
    
    await copyDirRecursive(source, target);
    state.status = `Installing skill: ${skill}`;
    state.progress += 2;
  }
  
  state.results.skills = { installed, updated };
}

async function installAgents(targetDir: string) {
  if (!state.components.agents) return;
  
  const agentsDir = path.join(GSD_DIR, "agents");
  const targetAgentsDir = path.join(targetDir, "agents");
  
  await fs.ensureDir(targetAgentsDir);
  const agents = await fs.readdir(agentsDir);
  
  let installed = 0;
  let updated = 0;
  
  for (const agent of agents) {
    if (!agent.startsWith("gsd-")) continue;
    const source = path.join(agentsDir, agent);
    const target = path.join(targetAgentsDir, agent);
    const stat = await fs.stat(source).catch(() => null);
    
    if (!stat?.isDirectory()) continue;
    
    if (await fs.pathExists(target)) {
      updated++;
    } else {
      installed++;
    }
    
    await copyDirRecursive(source, target);
    state.status = `Installing agent: ${agent}`;
    state.progress += 3;
  }
  
  const systemSource = path.join(agentsDir, "gsd-system.md");
  if (await fs.pathExists(systemSource)) {
    await fs.copy(systemSource, path.join(targetAgentsDir, "gsd-system.md"));
  }
  
  state.results.agents = { installed, updated };
}

async function installReferences(targetDir: string) {
  if (!state.components.references) return;
  
  const refsDir = path.join(GSD_DIR, "references");
  const targetRefsDir = path.join(targetDir, "references");
  
  await fs.ensureDir(targetRefsDir);
  const refs = await fs.readdir(refsDir);
  
  let count = 0;
  for (const ref of refs) {
    if (!ref.endsWith(".md")) continue;
    await fs.copy(path.join(refsDir, ref), path.join(targetRefsDir, ref));
    count++;
    state.status = `Installing reference: ${ref}`;
    state.progress += 2;
  }
  
  state.results.references = count;
}

async function installWorkflows(targetDir: string) {
  if (!state.components.workflows) return;
  
  const workflowsDir = path.join(GSD_DIR, "workflows");
  const targetWorkflowsDir = path.join(targetDir, "workflows");
  
  await fs.ensureDir(targetWorkflowsDir);
  const workflows = await fs.readdir(workflowsDir);
  
  let count = 0;
  for (const workflow of workflows) {
    if (!workflow.endsWith(".md")) continue;
    await fs.copy(path.join(workflowsDir, workflow), path.join(targetWorkflowsDir, workflow));
    count++;
    state.status = `Installing workflow: ${workflow}`;
    state.progress += 2;
  }
  
  state.results.workflows = count;
}

async function installMasterAgent(targetDir: string) {
  const source = path.join(GSD_DIR, "gsd-agent.yaml");
  let content = await fs.readFile(source, "utf8");
  content = content.replace(/~\/\.kimi/g, targetDir);
  await fs.writeFile(path.join(targetDir, "gsd-agent.yaml"), content);
  state.progress += 5;
}

async function installPatches(targetDir: string) {
  if (!state.components.patches) return;
  
  const patchesDir = path.join(GSD_DIR, "patches");
  const targetPatchesDir = path.join(targetDir, "patches");
  
  await fs.ensureDir(targetPatchesDir);
  const patches = await fs.readdir(patchesDir);
  
  for (const patch of patches) {
    if (!patch.endsWith(".py")) continue;
    await fs.copy(path.join(patchesDir, patch), path.join(targetPatchesDir, patch));
    await fs.chmod(path.join(targetPatchesDir, patch), 0o755);
    state.status = `Installing patch: ${patch}`;
    state.progress += 3;
  }
}

async function createJimScript(targetDir: string, isGlobal: boolean) {
  const jimPath = path.join(targetDir, "jim");
  
  let jimScript: string;
  
  if (isGlobal) {
    jimScript = `#!/usr/bin/env python3
import sys
from pathlib import Path

patches_dir = Path.home() / '.kimi' / 'patches'
sys.path.insert(0, str(patches_dir))

if len(sys.argv) > 1 and sys.argv[1] in ['--patch', '--restore', '--status']:
    patcher = patches_dir / 'kimi_cli_patcher_v2.py'
    if not patcher.exists():
        patcher = patches_dir / 'kimi_cli_patcher.py'
    if patcher.exists():
        import subprocess
        action = sys.argv[1].replace('--', '')
        subprocess.run([sys.executable, str(patcher), action])
    else:
        print("❌ Patcher not found.")
else:
    import subprocess
    agent_file = Path.home() / '.kimi' / 'gsd-agent.yaml'
    cmd = ['kimi']
    if agent_file.exists():
        cmd.extend(['--agent-file', str(agent_file)])
    cmd.extend(sys.argv[1:])
    subprocess.run(cmd)
`;
  } else {
    jimScript = `#!/usr/bin/env python3
import sys
from pathlib import Path

kimi_dir = Path(__file__).parent.resolve()
project_root = kimi_dir.parent

patches_dir = kimi_dir / 'patches'
sys.path.insert(0, str(patches_dir))

if len(sys.argv) > 1 and sys.argv[1] in ['--patch', '--restore', '--status']:
    patcher = patches_dir / 'kimi_cli_patcher_v2.py'
    if not patcher.exists():
        patcher = patches_dir / 'kimi_cli_patcher.py'
    if patcher.exists():
        import subprocess
        action = sys.argv[1].replace('--', '')
        subprocess.run([sys.executable, str(patcher), action])
    else:
        print("❌ Patcher not found.")
else:
    import subprocess
    agent_file = kimi_dir / 'gsd-agent.yaml'
    cmd = ['kimi']
    if agent_file.exists():
        cmd.extend(['--agent-file', str(agent_file)])
    cmd.extend(sys.argv[1:])
    subprocess.run(cmd, cwd=project_root)
`;
  }
  
  await fs.writeFile(jimPath, jimScript);
  await fs.chmod(jimPath, 0o755);
}

async function showProgress(renderer: any) {
  renderer.root.clear();
  
  const targetDir = state.mode === "global" ? GLOBAL_KIMI_DIR : LOCAL_KIMI_DIR;
  
  const container = new BoxRenderable(renderer, {
    id: "progress-container",
    width: "100%",
    height: "100%",
    backgroundColor: C.darkBg,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  });

  const panel = new BoxRenderable(renderer, {
    id: "progress-panel",
    width: 60,
    height: 10,
    backgroundColor: C.panelBg,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  });

  const titleText = new TextRenderable(renderer, {
    id: "progress-title",
    content: "Installing GSD...",
    fg: C.cyan,
    attributes: TextAttributes.BOLD,
  });

  const statusText = new TextRenderable(renderer, {
    id: "progress-status",
    content: "Preparing...",
    fg: C.white,
  });

  const progressText = new TextRenderable(renderer, {
    id: "progress-bar",
    content: "[                    ] 0%",
    fg: C.green,
  });

  panel.add(titleText);
  panel.add(statusText);
  panel.add(progressText);
  container.add(panel);
  renderer.root.add(container);

  const updateProgress = () => {
    const filled = Math.floor(state.progress / 5);
    const bar = "█".repeat(filled) + " ".repeat(20 - filled);
    progressText.content = `[${bar}] ${state.progress}%`;
    statusText.content = state.status;
  };

  try {
    await fs.ensureDir(targetDir);
    
    await installSkills(targetDir);
    updateProgress();
    
    await installAgents(targetDir);
    updateProgress();
    
    await installReferences(targetDir);
    updateProgress();
    
    await installWorkflows(targetDir);
    updateProgress();
    
    await installPatches(targetDir);
    updateProgress();
    
    await installMasterAgent(targetDir);
    state.progress = 95;
    state.status = "Finalizing...";
    updateProgress();
    
    await createJimScript(targetDir, state.mode === "global");
    state.progress = 100;
    state.status = "Installation complete!";
    statusText.fg = C.green;
    updateProgress();
    
    await new Promise(r => setTimeout(r, 1500));
    
  } catch (err: any) {
    state.status = `Error: ${err.message || err}`;
    statusText.content = state.status;
    statusText.fg = C.red;
    updateProgress();
    await new Promise(r => setTimeout(r, 2000));
    throw err;
  }
  
  renderer.root.remove(container);
}

async function showSummary(renderer: any) {
  renderer.root.clear();
  
  const targetDir = state.mode === "global" ? GLOBAL_KIMI_DIR : LOCAL_KIMI_DIR;
  const jimCommand = state.mode === "global" ? "jim" : "./.kimi/jim";
  
  const container = new BoxRenderable(renderer, {
    id: "summary-container",
    width: "100%",
    height: "100%",
    backgroundColor: C.darkBg,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  });

  const lines = [
    { content: "✅ Installation Complete!", fg: C.green, bold: true },
    { content: "", fg: C.gray },
    { content: `Mode: ${state.mode === "global" ? "🌍 Global" : "📁 Local"}`, fg: C.white },
    { content: `Location: ${targetDir}`, fg: C.gray },
    { content: "", fg: C.gray },
    { content: "Installed:", fg: C.cyan, bold: true },
    { content: `  • Skills: ${state.results.skills.installed} new, ${state.results.skills.updated} updated`, fg: C.white },
    { content: `  • Agents: ${state.results.agents.installed} new, ${state.results.agents.updated} updated`, fg: C.white },
    { content: `  • References: ${state.results.references}`, fg: C.white },
    { content: `  • Workflows: ${state.results.workflows}`, fg: C.white },
    { content: "", fg: C.gray },
    { content: "Quick Start:", fg: C.cyan, bold: true },
    { content: `  ${jimCommand}                    # Start GSD`, fg: C.yellow },
    { content: `  ${jimCommand} --patch            # Apply patches`, fg: C.yellow },
    { content: "", fg: C.gray },
    { content: "  /skill:gsd-help                  # Show commands", fg: C.gray },
    { content: "  /skill:gsd-new-project           # Create project", fg: C.gray },
  ];

  if (state.mode === "global") {
    lines.push({ content: "", fg: C.gray });
    lines.push({ content: "💡 Add to PATH: export PATH=\"$HOME/.local/bin:$PATH\"", fg: C.gray });
  }

  for (const line of lines) {
    const text = new TextRenderable(renderer, {
      id: `summary-line-${lines.indexOf(line)}`,
      content: line.content,
      fg: line.fg,
      attributes: line.bold ? TextAttributes.BOLD : 0,
    });
    container.add(text);
  }

  renderer.root.add(container);

  if (!nonInteractive) {
    await waitForEnter();
  } else {
    console.log(chalk.green("\n✅ GSD installation complete!"));
    console.log(chalk.gray(`Location: ${targetDir}`));
  }
  
  renderer.root.remove(container);
}

async function resetTerminal() {
  // Reset terminal to normal mode
  process.stdout.write('\x1b[?25h'); // Show cursor
  process.stdout.write('\x1b[0m');   // Reset attributes
  process.stdout.write('\x1b[2J');   // Clear screen
  process.stdout.write('\x1b[H');    // Move cursor to home
  process.stdout.write('\x1b[?1049l'); // Exit alternate screen
  process.stdout.write('\x1b[?2004l'); // Disable bracketed paste
  process.stdout.write('\x1b[?1004l'); // Disable focus events
  process.stdin.setRawMode(false);
  process.stdin.pause();
}

async function main() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    useMouse: false,
  });
  
  try {
    await showWelcome(renderer);
    await showModeSelection(renderer);
    await showComponentSelection(renderer);
    await showProgress(renderer);
    await showSummary(renderer);
  } catch (err: any) {
    console.error(chalk.red("\n❌ Installation failed:"), err.message || err);
    process.exit(1);
  } finally {
    renderer.destroy();
    await resetTerminal();
  }
}

main();
