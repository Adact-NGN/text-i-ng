#!/usr/bin/env node

/**
 * Version Management CLI Tool
 * Manual version management interface
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class VersionCLI {
  constructor() {
    this.versionFile = path.join(__dirname, '../src/lib/version.ts');
  }

  /**
   * Display current version information
   */
  showCurrentVersion() {
    try {
      const versionContent = fs.readFileSync(this.versionFile, 'utf8');
      const versionMatch = versionContent.match(/version: "([^"]+)"/);
      const buildDateMatch = versionContent.match(/buildDate: "([^"]+)"/);
      
      if (versionMatch) {
        console.log(`📋 Current Version: ${versionMatch[1]}`);
        if (buildDateMatch) {
          console.log(`📅 Build Date: ${buildDateMatch[1]}`);
        }
      } else {
        console.log('❌ Could not determine current version');
      }
    } catch (error) {
      console.error('❌ Error reading version file:', error.message);
    }
  }

  /**
   * Show recent commits
   */
  showRecentCommits() {
    try {
      console.log('\n📝 Recent Commits:');
      const commits = execSync('git log --oneline -10 --no-merges', { encoding: 'utf8' });
      console.log(commits);
    } catch (error) {
      console.error('❌ Error fetching commits:', error.message);
    }
  }

  /**
   * Show version history
   */
  showVersionHistory() {
    try {
      const versionContent = fs.readFileSync(this.versionFile, 'utf8');
      const historyMatch = versionContent.match(/VERSION_HISTORY: VersionInfo\[\] = \[([\s\S]*?)\];/);
      
      if (historyMatch) {
        console.log('\n📚 Version History:');
        const historyContent = historyMatch[1];
        const versions = historyContent.match(/version: "([^"]+)"/g);
        
        if (versions) {
          versions.forEach((version, index) => {
            const versionNumber = version.match(/"([^"]+)"/)[1];
            console.log(`  ${index + 1}. v${versionNumber}`);
          });
        }
      }
    } catch (error) {
      console.error('❌ Error reading version history:', error.message);
    }
  }

  /**
   * Analyze commits for version bump
   */
  analyzeCommits() {
    try {
      console.log('\n🔍 Analyzing commits for version bump...');
      
      // Get commits since last version update
      const lastVersionCommit = execSync('git log --oneline --grep="chore: update version" -1 --format="%H"', { encoding: 'utf8' }).trim();
      
      let commits;
      if (lastVersionCommit) {
        commits = execSync(`git log --oneline ${lastVersionCommit}..HEAD --no-merges`, { encoding: 'utf8' }).trim();
      } else {
        commits = execSync('git log --oneline --no-merges -10', { encoding: 'utf8' }).trim();
      }
      
      if (!commits) {
        console.log('📝 No new commits since last version update');
        return;
      }

      const commitList = commits.split('\n');
      let hasBreaking = false;
      let hasFeatures = false;
      let hasFixes = false;

      console.log('\n📊 Commit Analysis:');
      commitList.forEach(commit => {
        const message = commit.split(' ').slice(1).join(' ');
        
        if (message.includes('BREAKING CHANGE') || message.includes('!:')) {
          hasBreaking = true;
          console.log(`  🔴 BREAKING: ${message}`);
        } else if (message.startsWith('feat:')) {
          hasFeatures = true;
          console.log(`  🟢 FEATURE: ${message}`);
        } else if (message.startsWith('fix:')) {
          hasFixes = true;
          console.log(`  🟡 FIX: ${message}`);
        } else {
          console.log(`  ⚪ OTHER: ${message}`);
        }
      });

      console.log('\n📈 Recommended Version Bump:');
      if (hasBreaking) {
        console.log('  🔴 MAJOR version bump recommended (breaking changes)');
      } else if (hasFeatures) {
        console.log('  🟢 MINOR version bump recommended (new features)');
      } else if (hasFixes) {
        console.log('  🟡 PATCH version bump recommended (bug fixes)');
      } else {
        console.log('  ⚪ No version bump needed');
      }
    } catch (error) {
      console.error('❌ Error analyzing commits:', error.message);
    }
  }

  /**
   * Show help information
   */
  showHelp() {
    console.log(`
🚀 Version Management CLI

Usage: node scripts/version-cli.js [command]

Commands:
  current     Show current version information
  commits     Show recent commits
  history     Show version history
  analyze     Analyze commits for version bump
  help        Show this help message

Examples:
  node scripts/version-cli.js current
  node scripts/version-cli.js analyze
  node scripts/version-cli.js history
    `);
  }

  /**
   * Main CLI handler
   */
  run() {
    const command = process.argv[2];

    switch (command) {
      case 'current':
        this.showCurrentVersion();
        break;
      case 'commits':
        this.showRecentCommits();
        break;
      case 'history':
        this.showVersionHistory();
        break;
      case 'analyze':
        this.analyzeCommits();
        break;
      case 'help':
      case '--help':
      case '-h':
        this.showHelp();
        break;
      default:
        console.log('❌ Unknown command. Use "help" for available commands.');
        this.showHelp();
    }
  }
}

// Run the CLI
if (require.main === module) {
  const cli = new VersionCLI();
  cli.run();
}

module.exports = VersionCLI;
