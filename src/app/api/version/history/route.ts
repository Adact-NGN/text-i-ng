import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all releases from GitHub
    const response = await fetch(
      "https://api.github.com/repos/Adact-NGN/text-i-ng/releases",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("GitHub repository not found or not accessible");
        throw new Error("Repository not found or not accessible");
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const releases = await response.json();

    // Transform the releases data to include only what we need
    const releaseHistory = releases.map((release: any) => ({
      id: release.id,
      tagName: release.tag_name,
      name: release.name,
      publishedAt: release.published_at,
      url: release.html_url,
      body: release.body,
      isPrerelease: release.prerelease,
      isDraft: release.draft,
      author: {
        login: release.author.login,
        avatarUrl: release.author.avatar_url,
      },
    }));

    return NextResponse.json({
      success: true,
      releases: releaseHistory,
      total: releaseHistory.length,
    });
  } catch (error) {
    console.error("Error fetching GitHub release history:", error);

    return NextResponse.json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch GitHub release history",
      releases: [],
      total: 0,
    });
  }
}
