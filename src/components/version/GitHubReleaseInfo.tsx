"use client";

import { ExternalLink, Github } from "lucide-react";

interface GitHubVersion {
  current: string;
  name: string;
  publishedAt: string;
  url: string;
  body: string;
  isPrerelease: boolean;
  isDraft: boolean;
}

interface GitHubReleaseInfoProps {
  version: GitHubVersion | null;
  isLoading: boolean;
  error: string | null;
}

export function GitHubReleaseInfo({
  version,
  isLoading,
  error,
}: GitHubReleaseInfoProps) {
  return (
    <div className="border border-border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-3">
        <Github
          className={`h-4 w-4 text-primary ${isLoading ? "animate-pulse" : ""}`}
        />
        <h4 className="font-medium text-sm">Latest GitHub Release</h4>
      </div>

      {isLoading ? (
        <div className="text-xs text-muted-foreground">
          Loading GitHub release information...
        </div>
      ) : error ? (
        <div className="text-xs text-red-500">
          Failed to load GitHub release information
        </div>
      ) : version ? (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Version:</span>
            <span className="font-medium text-primary">{version.current}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Published:</span>
            <span>{new Date(version.publishedAt).toLocaleDateString()}</span>
          </div>
          {version.isPrerelease && (
            <div className="flex items-center gap-1">
              <span className="text-orange-500">⚠️</span>
              <span className="text-orange-600">Pre-release version</span>
            </div>
          )}
          <div className="pt-2">
            <a
              href={version.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              View on GitHub
            </a>
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">
          Unable to load GitHub release information
        </div>
      )}
    </div>
  );
}
