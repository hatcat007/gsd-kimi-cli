#!/usr/bin/env node

/**
 * CLI Fallback Installer (Node.js compatible)
 * Used when Bun is not available
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const C = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

function log(msg, color = C.reset) {
  console.log(color + msg + C.reset);
}

// Parse arguments
const args = process.argv.slice(2);
const globalMode = args.includes('-g') || args.includes('--global');
const nonInteractive = args.includes('-y') || args.includes('--yes') || process.env.CI;

const GSD_DIR = path.resolve(__dirname, '..');
const HOME_DIR = process.env.HOME || process.env.USERPROFILE || '/tmp';
const LOCAL_KIMI_DIR = path.join(process.cwd(), '.kimi');
const GLOBAL_KIMI_DIR = path.join(HOME_DIR, '.kimi');

const TARGET_DIR = globalMode ? GLOBAL_KIMI_DIR : LOCAL_KIMI_DIR;

function printBanner() {
  console.log(`
${C.cyan}${C.bold}   ██████╗ ███████╗██████╗${C.reset}
${C.cyan}${C.bold}  ██╔════╝ ██╔════╝██╔══██╗${C.reset}
${C.cyan}${C.bold}  ██║  ███╗███████╗██║  ██║${C.reset}
${C.cyan}${C.bold}  ██║   ██║╚════██║██║  ██║${C.reset}
${C.cyan}${C.bold}  ╚██████╔╝███████║██████╔╝${C.reset}
${C.cyan}${C.bold}   ╚═════╝ ╚══════╝╚═════╝${C.reset}

${C.bold}  Get Shit Done for Kimi CLI v2.0.0${C.reset}
${C.dim}  CLI Installer (Node.js mode)${C.reset}
`);
}

function copyDirRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    
    if (entry.isDirectory()) {
      copyDirRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

async function installSkills(targetDir) {
  const skillsDir = path.join(GSD_DIR, 'skills');
  const targetSkillsDir = path.join(targetDir, 'skills');
  
  if (!fs.existsSync(targetSkillsDir)) {
    fs.mkdirSync(targetSkillsDir, { recursive: true });
  }
  
  const skills = fs.readdirSync(skillsDir)
    .filter(name => name.startsWith('gsd-'))
    .filter(name => fs.statSync(path.join(skillsDir, name)).isDirectory());
  
  let installed = 0;
  let updated = 0;
  
  log('\n📦 Installing skills...', C.blue);
  
  for (const skill of skills) {
    const source = path.join(skillsDir, skill);
    const target = path.join(targetSkillsDir, skill);
    
    if (fs.existsSync(target)) {
      updated++;
      log(`  ↻ ${skill}`, C.yellow);
    } else {
      installed++;
      log(`  ✓ ${skill}`, C.green);
    }
    
    copyDirRecursive(source, target);
  }
  
  return { installed, updated };
}

async function installAgents(targetDir) {
  const agentsDir = path.join(GSD_DIR, 'agents');
  const targetAgentsDir = path.join(targetDir, 'agents');
  
  if (!fs.existsSync(targetAgentsDir)) {
    fs.mkdirSync(targetAgentsDir, { recursive: true });
  }
  
  const agents = fs.readdirSync(agentsDir)
    .filter(name => name.startsWith('gsd-'))
    .filter(name => fs.statSync(path.join(agentsDir, name)).isDirectory());
  
  let installed = 0;
  let updated = 0;
  
  log('\n🤖 Installing agents...', C.blue);
  
  for (const agent of agents) {
    const source = path.join(agentsDir, agent);
    const target = path.join(targetAgentsDir, agent);
    
    if (fs.existsSync(target)) {
      updated++;
      log(`  ↻ ${agent}`, C.yellow);
    } else {
      installed++;
      log(`  ✓ ${agent}`, C.green);
    }
    
    copyDirRecursive(source, target);
  }
  
  // Copy gsd-system.md
  const systemSource = path.join(agentsDir, 'gsd-system.md');
  if (fs.existsSync(systemSource)) {
    fs.copyFileSync(systemSource, path.join(targetAgentsDir, 'gsd-system.md'));
  }
  
  return { installed, updated };
}

async function installReferences(targetDir) {
  const refsDir = path.join(GSD_DIR, 'references');
  const targetRefsDir = path.join(targetDir, 'references');
  
  if (!fs.existsSync(targetRefsDir)) {
    fs.mkdirSync(targetRefsDir, { recursive: true });
  }
  
  const refs = fs.readdirSync(refsDir).filter(name => name.endsWith('.md'));
  
  log('\n📚 Installing references...', C.blue);
  
  for (const ref of refs) {
    fs.copyFileSync(path.join(refsDir, ref), path.join(targetRefsDir, ref));
    log(`  ✓ ${ref}`, C.green);
  }
  
  return refs.length;
}

async function installWorkflows(targetDir) {
  const workflowsDir = path.join(GSD_DIR, 'workflows');
  const targetWorkflowsDir = path.join(targetDir, 'workflows');
  
  if (!fs.existsSync(targetWorkflowsDir)) {
    fs.mkdirSync(targetWorkflowsDir, { recursive: true });
  }
  
  const workflows = fs.readdirSync(workflowsDir).filter(name => name.endsWith('.md'));
  
  log('\n🔄 Installing workflows...', C.blue);
  
  for (const workflow of workflows) {
    fs.copyFileSync(path.join(workflowsDir, workflow), path.join(targetWorkflowsDir, workflow));
    log(`  ✓ ${workflow}`, C.green);
  }
  
  return workflows.length;
}

async function installPatches(targetDir) {
  const patchesDir = path.join(GSD_DIR, 'patches');
  const targetPatchesDir = path.join(targetDir, 'patches');
  
  if (!fs.existsSync(targetPatchesDir)) {
    fs.mkdirSync(targetPatchesDir, { recursive: true });
  }
  
  const patches = fs.readdirSync(patchesDir).filter(name => name.endsWith('.py'));
  
  log('\n🔧 Installing patches...', C.blue);
  
  for (const patch of patches) {
    fs.copyFileSync(path.join(patchesDir, patch), path.join(targetPatchesDir, patch));
    fs.chmodSync(path.join(targetPatchesDir, patch), 0o755);
    log(`  ✓ ${patch}`, C.green);
  }
  
  return patches.length;
}

async function installMasterAgent(targetDir) {
  const source = path.join(GSD_DIR, 'gsd-agent.yaml');
  let content = fs.readFileSync(source, 'utf8');
  content = content.replace(/~\/\.kimi/g, targetDir);
  fs.writeFileSync(path.join(targetDir, 'gsd-agent.yaml'), content);
  log('\n🎯 Master agent installed', C.blue);
}

async function createJimScript(targetDir, isGlobal) {
  const jimPath = path.join(targetDir, 'jim');
  
  let jimScript;
  
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
  
  fs.writeFileSync(jimPath, jimScript);
  fs.chmodSync(jimPath, 0o755);
  log('\n📝 Jim launcher created', C.blue);
}

async function main() {
  printBanner();
  
  if (!nonInteractive) {
    // Simple prompts for CLI mode
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const ask = (question) => new Promise(resolve => rl.question(question, resolve));
    
    if (!globalMode) {
      log(`\n📁 Installation mode: ${C.cyan}LOCAL${C.reset} (current project)`);
      log(`${C.dim}Location: ${TARGET_DIR}${C.reset}\n`);
    } else {
      log(`\n🌍 Installation mode: ${C.cyan}GLOBAL${C.reset} (all projects)`);
      log(`${C.dim}Location: ${TARGET_DIR}${C.reset}\n`);
    }
    
    const proceed = await ask('Proceed with installation? [Y/n] ');
    if (proceed.toLowerCase() === 'n') {
      log('Installation cancelled.', C.yellow);
      rl.close();
      process.exit(0);
    }
    
    rl.close();
  } else {
    log(`\n📁 Mode: ${globalMode ? 'GLOBAL' : 'LOCAL'}`, C.cyan);
    log(`${C.dim}Location: ${TARGET_DIR}${C.reset}\n`);
  }
  
  // Create target directory
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }
  
  // Install components
  const results = {
    skills: await installSkills(TARGET_DIR),
    agents: await installAgents(TARGET_DIR),
    references: await installReferences(TARGET_DIR),
    workflows: await installWorkflows(TARGET_DIR),
    patches: await installPatches(TARGET_DIR),
  };
  
  await installMasterAgent(TARGET_DIR);
  await createJimScript(TARGET_DIR, globalMode);
  
  // Summary
  console.log(`\n${C.bold}╔═══════════════════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}║              ✅ Installation Complete!                        ║${C.reset}`);
  console.log(`${C.bold}╠═══════════════════════════════════════════════════════════════╣${C.reset}`);
  console.log(`${C.bold}║${C.reset}  Skills:     ${String(results.skills.installed).padStart(2)} new, ${String(results.skills.updated).padStart(2)} updated                    ${C.bold}║${C.reset}`);
  console.log(`${C.bold}║${C.reset}  Agents:     ${String(results.agents.installed).padStart(2)} new, ${String(results.agents.updated).padStart(2)} updated                    ${C.bold}║${C.reset}`);
  console.log(`${C.bold}║${C.reset}  References: ${String(results.references).padStart(2)} knowledge bases                        ${C.bold}║${C.reset}`);
  console.log(`${C.bold}║${C.reset}  Workflows:  ${String(results.workflows).padStart(2)} templates                           ${C.bold}║${C.reset}`);
  console.log(`${C.bold}║${C.reset}  Patches:    ${String(results.patches).padStart(2)} installed                              ${C.bold}║${C.reset}`);
  console.log(`${C.bold}╚═══════════════════════════════════════════════════════════════╝${C.reset}`);
  
  const jimCommand = globalMode ? 'jim' : './.kimi/jim';
  
  console.log(`\n${C.bold}Quick Start:${C.reset}`);
  console.log(`  ${C.cyan}${jimCommand}${C.reset}              # Start GSD`);
  console.log(`  ${C.cyan}${jimCommand} --patch${C.reset}      # Apply patches`);
  console.log(`  ${C.cyan}/skill:gsd-help${C.reset}     # Show commands`);
  
  if (globalMode) {
    console.log(`\n${C.yellow}💡 Add to PATH: export PATH="$HOME/.local/bin:$PATH"${C.reset}`);
  }
  
  console.log('');
}

main().catch(err => {
  log(`\n❌ Installation failed: ${err.message}`, C.red);
  process.exit(1);
});
