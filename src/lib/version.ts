// Version management system following conventional commits format
// Format: major.minor.patch-prerelease

export interface VersionInfo {
  version: string;
  buildDate: string;
  changes: string[];
}

// Current version - update this with each significant change
// Following Semantic Versioning (SemVer):
// MAJOR.MINOR.PATCH
// MAJOR: Breaking changes, irreversible changes
// MINOR: New features, backward compatible
// PATCH: Bug fixes, config changes, minor updates
export const CURRENT_VERSION: VersionInfo = {
  version: "0.9.1",
  buildDate: "2025-09-17",
  changes: [
    "fix: improve user menu display and reduce redundancy",
"feat: implement dedicated version management system",
"feat: implement tabbed SMS interface combining send, bulk upload, and history",
    "feat: create dedicated /sms page with organized tab navigation",
    "feat: add comprehensive user profile page with Azure AD information",
    "feat: add Azure AD phone number support for SMS template personalization",
    "feat: implement Neon database integration for better performance",
    "feat: add message deletion functionality (individual and bulk)",
    "feat: enhance Excel template with user-specific phone numbers",
    "feat: add navigation component with Home, SMS, and Profile links",
    "feat: update home page to serve as landing page with clear navigation",
    "feat: implement Vercel Postgres database for persistent message storage",
    "feat: replace file-based storage with proper database solution",
    "feat: add database table initialization and SQL queries",
    "feat: update all message storage functions to use async database operations",
    "feat: remove NG Nordic TextiNG logo from header and login page",
    "feat: clean up branding elements for simplified design",
    "feat: add sparkle emoji and hover animation to welcome text",
    "feat: enhance login page interactivity with hover effects",
    "fix: make animated background full viewport width and height",
    "fix: remove grey areas and ensure complete screen coverage",
    "feat: add more floating background elements for better visual coverage",
    "feat: enhance login page with modern gradient background and animations",
    "feat: add floating background elements with pulse animations",
    "feat: implement glassmorphism design with backdrop blur effects",
    "feat: add custom CSS animations for smooth page transitions",
    "feat: improve button styling with gradient backgrounds and hover effects",
    "feat: enhance responsive design for mobile and desktop devices",
    "feat: add professional footer with branding elements",
    "fix: resolve login loop issues in Vercel deployment",
    "fix: improve NextAuth redirect logic for external URLs",
    "fix: update middleware configuration for better Vercel compatibility",
    "fix: replace window.location.href with router.push for better navigation",
    "fix: add proper error handling and session management",
    "feat: add Azure AD (Microsoft Entra ID) authentication",
    "feat: add separate login page with professional design",
    "feat: add user session management and logout functionality",
    "feat: add authentication middleware and route protection",
    "feat: add user menu with profile and logout options",
    "feat: add comprehensive error handling for authentication",
    "feat: move logo and branding to header bar",
    "feat: add NG Nordic logo and rebrand to TextiNG",
    "feat: add support for multiple phone numbers (comma/semicolon separated)",
    "feat: add batch SMS processing with individual result tracking",
    "feat: add version management system with conventional commits",
    "feat: add version display component with change history",
    "feat: implement Twilio alphanumeric sender ID support",
    "feat: add real-time message history updates",
    "feat: add comprehensive message storage system",
    "feat: add bulk SMS with sender ID support",
    "feat: add message validation and error handling",
    "feat: add from name field for personalized messaging",
    "feat: add message history with database integration",
    "feat: add bulk SMS upload with Excel support",
    "feat: add Twilio SMS integration",
    "feat: initial SMS application setup",
  ],
};

// Version history for reference
export const VERSION_HISTORY: VersionInfo[] = [
  {
    version: "0.9.1",
    buildDate: "2025-09-17",
    changes: [
      "fix: improve user menu display and reduce redundancy"
    ],
  },
{
    version: "0.9.0",
    buildDate: "2025-09-17",
    changes: [
      "feat: implement dedicated version management system"
    ],
  },
{
    version: "0.8.0",
    buildDate: "2024-01-15",
    changes: [
      "feat: implement tabbed SMS interface combining send, bulk upload, and history",
      "feat: create dedicated /sms page with organized tab navigation",
      "feat: add comprehensive user profile page with Azure AD information",
      "feat: add Azure AD phone number support for SMS template personalization",
      "feat: implement Neon database integration for better performance",
      "feat: add message deletion functionality (individual and bulk)",
      "feat: enhance Excel template with user-specific phone numbers",
      "feat: add navigation component with Home, SMS, and Profile links",
      "feat: update home page to serve as landing page with clear navigation",
    ],
  },
  {
    version: "0.7.0",
    buildDate: "2024-01-15",
    changes: [
      "feat: implement Vercel Postgres database for persistent message storage",
      "feat: replace file-based storage with proper database solution",
      "feat: add database table initialization and SQL queries",
      "feat: update all message storage functions to use async database operations",
    ],
  },
  {
    version: "0.6.5",
    buildDate: "2024-01-15",
    changes: [
      "feat: remove NG Nordic TextiNG logo from header and login page",
      "feat: clean up branding elements for simplified design",
    ],
  },
  {
    version: "0.6.4",
    buildDate: "2024-01-15",
    changes: [
      "feat: add sparkle emoji and hover animation to welcome text",
      "feat: enhance login page interactivity with hover effects",
    ],
  },
  {
    version: "0.6.3",
    buildDate: "2024-01-15",
    changes: [
      "fix: make animated background full viewport width and height",
      "fix: remove grey areas and ensure complete screen coverage",
      "feat: add more floating background elements for better visual coverage",
    ],
  },
  {
    version: "0.6.2",
    buildDate: "2024-01-15",
    changes: [
      "feat: enhance login page with modern gradient background and animations",
      "feat: add floating background elements with pulse animations",
      "feat: implement glassmorphism design with backdrop blur effects",
      "feat: add custom CSS animations for smooth page transitions",
      "feat: improve button styling with gradient backgrounds and hover effects",
      "feat: enhance responsive design for mobile and desktop devices",
      "feat: add professional footer with branding elements",
    ],
  },
  {
    version: "0.6.1",
    buildDate: "2024-01-15",
    changes: [
      "fix: resolve login loop issues in Vercel deployment",
      "fix: improve NextAuth redirect logic for external URLs",
      "fix: update middleware configuration for better Vercel compatibility",
      "fix: replace window.location.href with router.push for better navigation",
      "fix: add proper error handling and session management",
    ],
  },
  {
    version: "0.6.0",
    buildDate: "2024-01-15",
    changes: [
      "feat: add Azure AD (Microsoft Entra ID) authentication",
      "feat: add separate login page with professional design",
      "feat: add user session management and logout functionality",
      "feat: add authentication middleware and route protection",
      "feat: add user menu with profile and logout options",
      "feat: add comprehensive error handling for authentication",
    ],
  },
  {
    version: "0.5.1",
    buildDate: "2024-01-15",
    changes: ["feat: move logo and branding to header bar"],
  },
  {
    version: "0.5.0",
    buildDate: "2024-01-15",
    changes: ["feat: add NG Nordic logo and rebrand to TextiNG"],
  },
  {
    version: "0.4.0",
    buildDate: "2024-01-15",
    changes: [
      "feat: add support for multiple phone numbers (comma/semicolon separated)",
      "feat: add batch SMS processing with individual result tracking",
    ],
  },
  {
    version: "0.3.0",
    buildDate: "2024-01-15",
    changes: [
      "feat: add version management system with conventional commits",
      "feat: add version display component with change history",
    ],
  },
  {
    version: "0.2.0",
    buildDate: "2024-01-15",
    changes: [
      "feat: implement Twilio alphanumeric sender ID support",
      "feat: add real-time message history updates",
      "feat: add comprehensive message storage system",
    ],
  },
  {
    version: "0.1.0",
    buildDate: "2024-01-15",
    changes: [
      "feat: add from name field for personalized messaging",
      "feat: add message history with database integration",
      "feat: add real-time UI updates",
      "feat: add bulk SMS upload with Excel support",
      "feat: add Twilio SMS integration",
      "feat: initial SMS application setup",
    ],
  },
];

// Helper function to get version display string
export const getVersionDisplay = (): string => {
  return `v${CURRENT_VERSION.version}`;
};

// Helper function to get full version info
export const getFullVersionInfo = (): VersionInfo => {
  return CURRENT_VERSION;
};

// Helper function to get recent changes
export const getRecentChanges = (count: number = 5): string[] => {
  return CURRENT_VERSION.changes.slice(0, count);
};
