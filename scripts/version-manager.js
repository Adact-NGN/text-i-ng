#!/usr/bin/env node

/**
 * Version Management Script
 * Dedicated agent for managing version numbers and changelogs
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class VersionManager {
  constructor() {
    this.versionFile = path.join(__dirname, "../src/lib/version.ts");
    this.currentVersion = null;
    this.versionHistory = [];
  }

  /**
   * Load current version information
   */
  loadVersionInfo() {
    try {
      const versionContent = fs.readFileSync(this.versionFile, "utf8");

      // Extract current version using regex
      const versionMatch = versionContent.match(/version: "([^"]+)"/);
      if (versionMatch) {
        this.currentVersion = versionMatch[1];
      }

      console.log(`📋 Current version: ${this.currentVersion}`);
      return true;
    } catch (error) {
      console.error("❌ Error loading version info:", error.message);
      return false;
    }
  }

  /**
   * Analyze recent commits to determine version bump type
   */
  analyzeCommits() {
    try {
      // Get commits since last version update
      const lastVersionCommit = execSync(
        'git log --oneline --grep="chore: update version" -1 --format="%H"',
        { encoding: "utf8" }
      ).trim();

      if (!lastVersionCommit) {
        console.log(
          "📝 No previous version commit found, analyzing all commits"
        );
        const commits = execSync("git log --oneline --no-merges", {
          encoding: "utf8",
        })
          .trim()
          .split("\n");
        return this.categorizeCommits(commits);
      }

      const commits = execSync(
        `git log --oneline ${lastVersionCommit}..HEAD --no-merges`,
        { encoding: "utf8" }
      ).trim();

      if (!commits) {
        console.log("📝 No new commits since last version update");
        return { type: "none", changes: [] };
      }

      const commitList = commits.split("\n");
      return this.categorizeCommits(commitList);
    } catch (error) {
      console.error("❌ Error analyzing commits:", error.message);
      return { type: "none", changes: [] };
    }
  }

  /**
   * Categorize commits to determine version bump type
   */
  categorizeCommits(commits) {
    const changes = [];
    let hasBreaking = false;
    let hasFeatures = false;
    let hasFixes = false;

    commits.forEach((commit) => {
      const message = commit.split(" ").slice(1).join(" ");

      if (message.includes("BREAKING CHANGE") || message.includes("!:")) {
        hasBreaking = true;
        changes.push(`BREAKING: ${message}`);
      } else if (message.startsWith("feat:")) {
        hasFeatures = true;
        changes.push(message);
      } else if (message.startsWith("fix:")) {
        hasFixes = true;
        changes.push(message);
      } else if (
        message.startsWith("chore:") ||
        message.startsWith("docs:") ||
        message.startsWith("style:")
      ) {
        changes.push(message);
      }
    });

    // Determine version bump type
    let bumpType = "none";
    if (hasBreaking) {
      bumpType = "major";
    } else if (hasFeatures) {
      bumpType = "minor";
    } else if (hasFixes) {
      bumpType = "patch";
    }

    return { type: bumpType, changes };
  }

  /**
   * Calculate new version number
   */
  calculateNewVersion(bumpType) {
    if (bumpType === "none") {
      return this.currentVersion;
    }

    const [major, minor, patch] = this.currentVersion.split(".").map(Number);

    switch (bumpType) {
      case "major":
        return `${major + 1}.0.0`;
      case "minor":
        return `${major}.${minor + 1}.0`;
      case "patch":
        return `${major}.${minor}.${patch + 1}`;
      default:
        return this.currentVersion;
    }
  }

  /**
   * Update version file
   */
  updateVersionFile(newVersion, changes) {
    try {
      let content = fs.readFileSync(this.versionFile, "utf8");

      // Update current version
      content = content.replace(/version: "[^"]+"/, `version: "${newVersion}"`);

      // Update build date
      const buildDate = new Date().toISOString().split("T")[0];
      content = content.replace(
        /buildDate: "[^"]+"/,
        `buildDate: "${buildDate}"`
      );

      // Add new changes to the beginning of changes array
      const newChanges = changes.map((change) => `    "${change}"`).join(",\n");
      const changesRegex = /changes: \[\s*([\s\S]*?)\s*\],/;
      const match = content.match(changesRegex);

      if (match) {
        const existingChanges = match[1].trim();
        const updatedChanges = `changes: [\n${newChanges},\n${existingChanges}\n  ],`;
        content = content.replace(changesRegex, updatedChanges);
      }

      // Add new version to history
      const historyEntry = `  {
    version: "${newVersion}",
    buildDate: "${buildDate}",
    changes: [
${changes.map((change) => `      "${change}"`).join(",\n")}
    ],
  },`;

      // Insert new version at the beginning of VERSION_HISTORY
      const historyRegex =
        /export const VERSION_HISTORY: VersionInfo\[\] = \[\s*([\s\S]*?)\s*\];/;
      const historyMatch = content.match(historyRegex);

      if (historyMatch) {
        const existingHistory = historyMatch[1].trim();
        const updatedHistory = `export const VERSION_HISTORY: VersionInfo[] = [\n${historyEntry}\n${existingHistory}\n];`;
        content = content.replace(historyRegex, updatedHistory);
      }

      fs.writeFileSync(this.versionFile, content);
      console.log(`✅ Updated version to ${newVersion}`);
      return true;
    } catch (error) {
      console.error("❌ Error updating version file:", error.message);
      return false;
    }
  }

  /**
   * Create version update commit
   */
  createVersionCommit(newVersion, bumpType) {
    try {
      const commitMessage = `chore: update version to ${newVersion}\n\n- ${bumpType} version bump\n- Updated changelog with recent changes\n- Automated version management`;

      execSync(`git add ${this.versionFile}`, { stdio: "inherit" });
      execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

      console.log(`✅ Created version commit for ${newVersion}`);

      // Output the new version for GitHub Actions
      if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `new-version=${newVersion}\n`
        );
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `previous-version=${this.currentVersion}\n`
        );
      }

      return true;
    } catch (error) {
      console.error("❌ Error creating version commit:", error.message);
      return false;
    }
  }

  /**
   * Main version management workflow
   */
  async run() {
    console.log("🚀 Starting Version Management Agent...\n");

    // Load current version
    if (!this.loadVersionInfo()) {
      process.exit(1);
    }

    // Analyze recent commits
    console.log("📊 Analyzing recent commits...");
    const analysis = this.analyzeCommits();

    if (analysis.type === "none") {
      console.log("✅ No version update needed");
      return;
    }

    // Calculate new version
    const newVersion = this.calculateNewVersion(analysis.type);
    console.log(
      `📈 Version bump: ${analysis.type} (${this.currentVersion} → ${newVersion})`
    );

    // Update version file
    console.log("📝 Updating version file...");
    if (!this.updateVersionFile(newVersion, analysis.changes)) {
      process.exit(1);
    }

    // Create commit
    console.log("💾 Creating version commit...");
    if (!this.createVersionCommit(newVersion, analysis.type)) {
      process.exit(1);
    }

    console.log(`\n🎉 Version management complete!`);
    console.log(`📋 New version: ${newVersion}`);
    console.log(`📝 Changes: ${analysis.changes.length} items`);
    console.log(`🔧 Bump type: ${analysis.type}`);
  }
}

// Run the version manager
if (require.main === module) {
  const versionManager = new VersionManager();
  versionManager.run().catch(console.error);
}

module.exports = VersionManager;
