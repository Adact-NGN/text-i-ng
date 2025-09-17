"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Github, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GitHubRelease {
  id: number;
  tagName: string;
  name: string;
  publishedAt: string;
  url: string;
  body: string;
  isPrerelease: boolean;
  isDraft: boolean;
  author: {
    login: string;
    avatarUrl: string;
  };
}

interface ReleaseHistoryProps {
  className?: string;
}

export function ReleaseHistory({ className }: ReleaseHistoryProps) {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleaseHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/version/history");
        const data = await response.json();

        if (data.success) {
          setReleases(data.releases);
        } else {
          setError(data.error || "Failed to fetch release history");
        }
      } catch (err) {
        setError("Network error");
        console.error("Failed to fetch release history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReleaseHistory();
  }, []);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-primary animate-pulse" />
          <h3 className="font-medium text-sm">Release History</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          Loading release history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">Release History</h3>
        </div>
        <div className="text-xs text-amber-600">
          Unable to load release history
        </div>
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">Release History</h3>
        </div>
        <div className="text-xs text-muted-foreground">No releases found</div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">All Releases</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {releases.length} releases
        </Badge>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {releases.map((release, index) => (
          <div
            key={release.id}
            className="border border-border rounded-lg p-4 bg-muted/10 hover:bg-muted/20 transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <h4 className="font-semibold text-base">{release.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(release.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {release.author.login}
                    </div>
                  </div>
                </div>
                {index === 0 && (
                  <Badge variant="default" className="text-xs font-medium">
                    Latest
                  </Badge>
                )}
                {release.isPrerelease && (
                  <Badge variant="outline" className="text-xs">
                    Pre-release
                  </Badge>
                )}
              </div>
              <a
                href={release.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors p-1 rounded hover:bg-primary/10"
                title="View on GitHub"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {release.body && (
              <div className="text-sm text-muted-foreground leading-relaxed">
                <div className="whitespace-pre-line bg-muted/30 rounded p-3 border">
                  {release.body}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
