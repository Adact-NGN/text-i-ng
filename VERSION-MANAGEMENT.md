# Version Management System

This project includes a dedicated version management system with automated tools and workflows.

## 🚀 Quick Start

### Check Current Version
```bash
npm run version:current
```

### Analyze Commits for Version Bump
```bash
npm run version:analyze
```

### Update Version Automatically
```bash
npm run version:update
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run version:current` | Show current version information |
| `npm run version:commits` | Show recent commits |
| `npm run version:history` | Show version history |
| `npm run version:analyze` | Analyze commits for version bump |
| `npm run version:update` | Update version automatically |

## 🔧 How It Works

### Automatic Version Management
The system automatically:
1. **Analyzes commits** since the last version update
2. **Determines version bump type** based on conventional commits:
   - `feat:` → MINOR version bump
   - `fix:` → PATCH version bump
   - `BREAKING CHANGE` → MAJOR version bump
3. **Updates version files** with new version number
4. **Generates changelog** with recent changes
5. **Creates version commit** and pushes changes

### Version Bump Rules

#### PATCH (0.0.X)
- Bug fixes
- Minor UI tweaks
- Configuration updates
- Documentation updates

#### MINOR (0.X.0)
- New features
- New pages/components
- Enhanced functionality
- New API endpoints

#### MAJOR (X.0.0)
- Breaking changes
- Major architecture changes
- Complete rewrites
- Irreversible changes

## 🤖 Automated Workflows

### GitHub Actions
The system includes automated GitHub Actions that:
- Trigger on pushes to main branch
- Analyze commits for version updates
- Automatically update versions
- Create GitHub releases
- Notify about version changes

### Workflow Triggers
- **Push to main**: Automatically checks for version updates
- **Merged PRs**: Analyzes changes and updates version if needed
- **Manual trigger**: Can be triggered manually for specific updates

## 📁 File Structure

```
scripts/
├── version-manager.js    # Main version management script
├── version-cli.js        # CLI tool for manual version management
└── .github/workflows/
    └── version-management.yml  # GitHub Actions workflow
```

## 🛠️ Manual Usage

### CLI Tool
```bash
# Show current version
node scripts/version-cli.js current

# Analyze commits
node scripts/version-cli.js analyze

# Show version history
node scripts/version-cli.js history

# Show recent commits
node scripts/version-cli.js commits
```

### Direct Script Usage
```bash
# Run version manager
node scripts/version-manager.js

# Check version
node scripts/version-cli.js current
```

## 📊 Version Information

### Current Version
The current version is stored in `src/lib/version.ts` and includes:
- Version number (semantic versioning)
- Build date
- Change log
- Version history

### Version Display
The version is displayed in the application through:
- Version display component
- Footer information
- About page
- User interface

## 🔍 Monitoring

### Version Tracking
- All version updates are tracked in git
- Version history is maintained in the codebase
- GitHub releases are created automatically
- Change logs are generated automatically

### Error Handling
- Version conflicts are detected and resolved
- Missing changes are identified
- Deployment issues are monitored
- Version consistency is maintained

## 🚀 Best Practices

### Commit Messages
Use conventional commit format:
```
feat: add new feature
fix: resolve bug
chore: maintenance task
docs: documentation update
style: code formatting
refactor: code refactoring
```

### Version Updates
- Update version after significant changes
- Include meaningful change descriptions
- Test version updates before deployment
- Monitor version consistency

### Release Management
- Use semantic versioning
- Maintain version history
- Document breaking changes
- Test version updates

## 🆘 Troubleshooting

### Common Issues

#### Version Not Updating
```bash
# Check if commits exist since last version
npm run version:analyze

# Force version update
npm run version:update
```

#### Version Conflicts
```bash
# Check current version
npm run version:current

# Analyze version history
npm run version:history
```

#### Missing Changes
```bash
# Check recent commits
npm run version:commits

# Analyze for version bump
npm run version:analyze
```

### Getting Help
- Check the version management documentation
- Review the GitHub Actions logs
- Analyze commit history
- Contact the development team

## 📈 Future Enhancements

### Planned Features
- Automated release note generation
- Version comparison tools
- Change impact analysis
- Release cycle optimization
- Integration with external tools

### Monitoring Improvements
- Version update tracking
- Change frequency analysis
- Release cycle optimization
- Performance monitoring

---

**Note**: This version management system is designed to be automated and require minimal manual intervention. It follows semantic versioning principles and conventional commit standards.
