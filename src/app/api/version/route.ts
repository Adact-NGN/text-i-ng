import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch latest release from GitHub
    const response = await fetch(
      "https://api.github.com/repos/Adact-NGN/text-i-ng/releases/latest",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const release = await response.json();
    
    return NextResponse.json({
      success: true,
      version: {
        current: release.tag_name,
        name: release.name,
        publishedAt: release.published_at,
        url: release.html_url,
        body: release.body,
        isPrerelease: release.prerelease,
        isDraft: release.draft,
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub release:", error);
    
    // Fallback to local version if GitHub is unavailable
    return NextResponse.json({
      success: false,
      error: "Failed to fetch GitHub release information",
      fallback: {
        version: "0.9.1",
        source: "local",
      },
    });
  }
}
