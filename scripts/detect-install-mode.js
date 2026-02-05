#!/usr/bin/env node

/**
 * Detect Installation Mode
 * Called by postinstall to determine if we're installing locally or globally
 * 
 * Local install: npm install (in project)
 * Global install: npm install -g gsd-kimi-cli
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const C = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

function log(msg, color = C.reset) {
  console.log(color + msg + C.reset);
}

function isGlobalInstall() {
  // Check if we're in a global npm prefix
  try {
    const globalPrefix = execSync('npm prefix -g', { encoding: 'utf8' }).trim();
    const currentDir = process.cwd();
    
    // If current directory is within global prefix, it's a global install
    if (currentDir.startsWith(globalPrefix)) {
      return true;
    }
    
    // Alternative: Check npm_config_global environment variable
    if (process.env.npm_config_global === 'true') {
      return true;
    }
    
    // Check if we're in node_modules (local install)
    if (currentDir.includes('node_modules')) {
      return false;
    }
    
    // If gsd-agent.yaml exists in parent, we're likely in dev/local mode
    const parentDir = path.resolve(currentDir, '..');
    if (fs.existsSync(path.join(parentDir, 'gsd-agent.yaml'))) {
      return false;
    }
    
    return false;
  } catch (e) {
    // Default to local if we can't detect
    return false;
  }
}

function isDevRepo() {
  // Check if we're in the GSD development repo
  const currentDir = process.cwd();
  return fs.existsSync(path.join(currentDir, 'gsd-agent.yaml')) &&
         fs.existsSync(path.join(currentDir, 'skills'));
}

function runLocalInstall() {
  log('\n📁 Running LOCAL installation...', C.blue);
  
  if (isDevRepo()) {
    // In dev repo, use the local installer
    const installLocal = path.join(__dirname, '..', '.kimi', 'install-local.js');
    if (fs.existsSync(installLocal)) {
      require(installLocal);
      return;
    }
  }
  
  // Otherwise, we're being installed as a dependency
  // Set up .kimi in the project root (look for package.json)
  let projectRoot = process.cwd();
  while (!fs.existsSync(path.join(projectRoot, 'package.json'))) {
    const parent = path.resolve(projectRoot, '..');
    if (parent === projectRoot) {
      // Reached root, use current directory
      projectRoot = process.cwd();
      break;
    }
    projectRoot = parent;
  }
  
  const localKimiDir = path.join(projectRoot, '.kimi');
  
  if (!fs.existsSync(localKimiDir)) {
    log(`  Creating ${C.cyan}.kimi/${C.reset} in project...`);
    fs.mkdirSync(localKimiDir, { recursive: true });
  }
  
  // Copy GSD components to local .kimi
  const gsdDir = path.join(__dirname, '..');
  const skillsDir = path.join(gsdDir, 'skills');
  const targetSkillsDir = path.join(localKimiDir, 'skills');
  
  if (fs.existsSync(skillsDir) && !fs.existsSync(targetSkillsDir)) {
    fs.mkdirSync(targetSkillsDir, { recursive: true });
    const skills = fs.readdirSync(skillsDir)
      .filter(name => name.startsWith('gsd-'))
      .filter(name => fs.statSync(path.join(skillsDir, name)).isDirectory());
    
    for (const skill of skills) {
      const source = path.join(skillsDir, skill);
      const target = path.join(targetSkillsDir, skill);
      fs.cpSync(source, target, { recursive: true });
    }
    log(`  ✓ Installed ${skills.length} skills`, C.green);
  }
  
  log(`\n✅ Local installation complete!`, C.green);
  log(`   Run: ${C.cyan}./.kimi/jim${C.reset} to start GSD`, C.dim);
}

function runGlobalInstall() {
  log('\n🌍 Running GLOBAL installation...', C.blue);
  
  const installScript = path.join(__dirname, 'install.js');
  if (fs.existsSync(installScript)) {
    require(installScript);
  } else {
    log('  Global install script not found', C.yellow);
    log('  Please run: npm run install:global', C.dim);
  }
}

function main() {
  // Check for explicit flags
  const args = process.argv.slice(2);
  const forceGlobal = args.includes('--global') || args.includes('-g');
  const forceLocal = args.includes('--local') || args.includes('-l');
  
  if (forceGlobal) {
    runGlobalInstall();
    return;
  }
  
  if (forceLocal) {
    runLocalInstall();
    return;
  }
  
  // Auto-detect
  const isGlobal = isGlobalInstall();
  const isDev = isDevRepo();
  
  if (isGlobal && !isDev) {
    runGlobalInstall();
  } else {
    runLocalInstall();
  }
}

main();
