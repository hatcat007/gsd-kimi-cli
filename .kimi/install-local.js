#!/usr/bin/env node

/**
 * Local GSD Installation Script
 * Installs GSD components into the local .kimi/ directory
 */

const fs = require('fs');
const path = require('path');

const GSD_DIR = path.join(__dirname, '..');
const KIMI_DIR = __dirname;

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

function installSkills() {
  const skillsDir = path.join(GSD_DIR, 'skills');
  const targetDir = path.join(KIMI_DIR, 'skills');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const skills = fs.readdirSync(skillsDir)
    .filter(name => name.startsWith('gsd-'))
    .filter(name => fs.statSync(path.join(skillsDir, name)).isDirectory());
  
  for (const skill of skills) {
    copyDirRecursive(path.join(skillsDir, skill), path.join(targetDir, skill));
    log(`  ✓ ${skill}`, C.green);
  }
  
  return skills.length;
}

function installAgents() {
  const agentsDir = path.join(GSD_DIR, 'agents');
  const targetDir = path.join(KIMI_DIR, 'agents');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const agents = fs.readdirSync(agentsDir)
    .filter(name => name.startsWith('gsd-'))
    .filter(name => fs.statSync(path.join(agentsDir, name)).isDirectory());
  
  for (const agent of agents) {
    copyDirRecursive(path.join(agentsDir, agent), path.join(targetDir, agent));
    log(`  ✓ ${agent}`, C.green);
  }
  
  // Copy gsd-system.md
  const systemSource = path.join(agentsDir, 'gsd-system.md');
  if (fs.existsSync(systemSource)) {
    fs.copyFileSync(systemSource, path.join(targetDir, 'gsd-system.md'));
  }
  
  return agents.length;
}

function installReferences() {
  const refsDir = path.join(GSD_DIR, 'references');
  const targetDir = path.join(KIMI_DIR, 'references');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const refs = fs.readdirSync(refsDir).filter(name => name.endsWith('.md'));
  
  for (const ref of refs) {
    fs.copyFileSync(path.join(refsDir, ref), path.join(targetDir, ref));
    log(`  ✓ ${ref}`, C.green);
  }
  
  return refs.length;
}

function installWorkflows() {
  const workflowsDir = path.join(GSD_DIR, 'workflows');
  const targetDir = path.join(KIMI_DIR, 'workflows');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const workflows = fs.readdirSync(workflowsDir).filter(name => name.endsWith('.md'));
  
  for (const workflow of workflows) {
    fs.copyFileSync(path.join(workflowsDir, workflow), path.join(targetDir, workflow));
    log(`  ✓ ${workflow}`, C.green);
  }
  
  return workflows.length;
}

function installMasterAgent() {
  const source = path.join(GSD_DIR, 'gsd-agent.yaml');
  const target = path.join(KIMI_DIR, 'gsd-agent.yaml');
  
  let content = fs.readFileSync(source, 'utf8');
  // Update paths to use local directory
  content = content.replace(/~\/\.kimi/g, KIMI_DIR);
  
  fs.writeFileSync(target, content);
  log(`  ✓ gsd-agent.yaml`, C.green);
}

function installPatches() {
  const patchesDir = path.join(GSD_DIR, 'patches');
  const targetDir = path.join(KIMI_DIR, 'patches');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const patches = fs.readdirSync(patchesDir).filter(name => name.endsWith('.py'));
  
  for (const patch of patches) {
    fs.copyFileSync(path.join(patchesDir, patch), path.join(targetDir, patch));
    fs.chmodSync(path.join(targetDir, patch), 0o755);
    log(`  ✓ ${patch}`, C.green);
  }
  
  return patches.length;
}

function createJimScript() {
  const jimPath = path.join(KIMI_DIR, 'jim');
  
  const jimScript = `#!/usr/bin/env python3
import sys
from pathlib import Path

# Get the project root (parent of .kimi directory)
kimi_dir = Path(__file__).parent.resolve()
project_root = kimi_dir.parent

# Add patches to path
patches_dir = kimi_dir / 'patches'
sys.path.insert(0, str(patches_dir))

# Handle patch commands
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
    # Set working directory to project root
    cmd.extend(sys.argv[1:])
    subprocess.run(cmd, cwd=project_root)
`;
  
  fs.writeFileSync(jimPath, jimScript);
  fs.chmodSync(jimPath, 0o755);
  log(`  ✓ jim launcher`, C.green);
}

function main() {
  console.log(`
${C.cyan}${C.bold}   ██████╗ ███████╗██████╗${C.reset}
${C.cyan}${C.bold}  ██╔════╝ ██╔════╝██╔══██╗${C.reset}
${C.cyan}${C.bold}  ██║  ███╗███████╗██║  ██║${C.reset}
${C.cyan}${C.bold}  ██║   ██║╚════██║██║  ██║${C.reset}
${C.cyan}${C.bold}  ╚██████╔╝███████║██████╔╝${C.reset}
${C.cyan}${C.bold}   ╚═════╝ ╚══════╝╚═════╝${C.reset}

${C.bold}  Local GSD Installation${C.reset}
${C.dim}  Project: ${GSD_DIR}${C.reset}
`);

  log('📦 Installing skills...', C.blue);
  const skillsCount = installSkills();
  
  log('\n🤖 Installing agents...', C.blue);
  const agentsCount = installAgents();
  
  log('\n📚 Installing references...', C.blue);
  const refsCount = installReferences();
  
  log('\n🔄 Installing workflows...', C.blue);
  const workflowsCount = installWorkflows();
  
  log('\n🎯 Installing master agent...', C.blue);
  installMasterAgent();
  
  log('\n🔧 Installing patches...', C.blue);
  const patchesCount = installPatches();
  
  log('\n📝 Creating launcher...', C.blue);
  createJimScript();
  
  console.log(`
${C.bold}╔═══════════════════════════════════════════════════════════════╗${C.reset}
${C.bold}║              ✅ Local Installation Complete!                  ║${C.reset}
${C.bold}╠═══════════════════════════════════════════════════════════════╣${C.reset}
${C.bold}║${C.reset}  Skills:     ${String(skillsCount).padStart(2)} installed                              ${C.bold}║${C.reset}
${C.bold}║${C.reset}  Agents:     ${String(agentsCount).padStart(2)} installed                              ${C.bold}║${C.reset}
${C.bold}║${C.reset}  References: ${String(refsCount).padStart(2)} knowledge bases                         ${C.bold}║${C.reset}
${C.bold}║${C.reset}  Workflows:  ${String(workflowsCount).padStart(2)} templates                           ${C.bold}║${C.reset}
${C.bold}║${C.reset}  Master:     ✓ Installed                                      ${C.bold}║${C.reset}
${C.bold}║${C.reset}  Patches:    ✓ Installed                                      ${C.bold}║${C.reset}
${C.bold}╚═══════════════════════════════════════════════════════════════╝${C.reset}

${C.bold}Quick Start:${C.reset}

  1. Start GSD locally:
     ${C.cyan}./.kimi/jim${C.reset}

  2. Or use the local run script:
     ${C.cyan}npm run gsd${C.reset}

  3. Try these commands inside GSD:
     ${C.cyan}/skill:gsd-new-project${C.reset}     # Create a new project
     ${C.cyan}/skill:gsd-help${C.reset}            # Show all commands
     ${C.cyan}/skill:gsd-progress${C.reset}        # Check project status

${C.dim}Note: This is a LOCAL installation. It only works in this project.${C.reset}
`);
}

main();
