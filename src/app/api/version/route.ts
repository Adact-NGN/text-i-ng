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
      // Handle specific error cases
      if (response.status === 404) {
        console.warn("GitHub repository not found or not accessible");
        throw new Error("Repository not found or not accessible");
      }
      if (response.status === 403) {
        console.warn("GitHub API rate limit exceeded");
        throw new Error("GitHub API rate limit exceeded");
      }
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

    return NextResponse.json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch GitHub release information",
    });
  }
}
