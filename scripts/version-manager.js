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
    this.currentVersion = null;
    this.versionHistory = [];
  }

  /**
   * Load current version information from GitHub releases
   */
  async loadVersionInfo() {
    try {
      // Get the latest release from GitHub API
      const response = await fetch(
        "https://api.github.com/repos/Adact-NGN/text-i-ng/releases/latest",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // No releases found, start with version 0.1.0
          this.currentVersion = "0.1.0";
          console.log(`📋 No releases found, starting with version: ${this.currentVersion}`);
          return true;
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const release = await response.json();
      // Extract version from tag (remove 'v' prefix if present)
      this.currentVersion = release.tag_name.replace(/^v/, "");
      
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
   * No longer needed - we don't update local version files
   */
  updateVersionFile(newVersion, changes) {
    // This method is no longer needed since we use GitHub releases only
    console.log(`📝 Version update: ${this.currentVersion} → ${newVersion}`);
    return true;
  }

  /**
   * Create version update commit
   */
  createVersionCommit(newVersion, bumpType) {
    try {
      const commitMessage = `chore: update version to ${newVersion}\n\n- ${bumpType} version bump\n- Updated changelog with recent changes\n- Automated version management`;

      // No need to add specific files since we're not updating local version files
      execSync(`git add .`, { stdio: "inherit" });
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
    if (!(await this.loadVersionInfo())) {
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
