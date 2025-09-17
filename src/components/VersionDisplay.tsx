"use client";

import { useState, useEffect } from "react";
import {
  getVersionDisplay,
  getFullVersionInfo,
  getRecentChanges,
  VERSION_HISTORY,
} from "@/lib/version";
import { Info, X, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GitHubVersion {
  current: string;
  name: string;
  publishedAt: string;
  url: string;
  body: string;
  isPrerelease: boolean;
  isDraft: boolean;
}

export function VersionDisplay() {
  const [showDetails, setShowDetails] = useState(false);
  const [githubVersion, setGithubVersion] = useState<GitHubVersion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const versionInfo = getFullVersionInfo();
  const recentChanges = getRecentChanges(5);
  const recentVersions = VERSION_HISTORY.slice(0, 5);

  useEffect(() => {
    const fetchGitHubVersion = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/version');
        const data = await response.json();
        
        if (data.success) {
          setGithubVersion(data.version);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub version:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (showDetails) {
      fetchGitHubVersion();
    }
  }, [showDetails]);

  return (
    <div className="relative">
      {/* Version Badge */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 text-xs"
      >
        <Info className="h-3 w-3" />
        {githubVersion ? githubVersion.current : getVersionDisplay()}
        {githubVersion && githubVersion.isPrerelease && (
          <span className="text-orange-500">⚠️</span>
        )}
      </Button>

      {/* Version Details Modal */}
      {showDetails && (
        <div className="absolute top-10 right-0 z-50 w-96">
          <Card className="shadow-lg border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {getVersionDisplay()}
                  </CardTitle>
                  <CardDescription>
                    Built on {versionInfo.buildDate}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* GitHub Release Information */}
                {isLoading && (
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Github className="h-4 w-4 text-primary animate-pulse" />
                      <h4 className="font-medium text-sm">Latest GitHub Release</h4>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Loading GitHub release information...
                    </div>
                  </div>
                )}
                {githubVersion && (
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Github className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-sm">Latest GitHub Release</h4>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Version:</span>
                        <span className="font-medium text-primary">{githubVersion.current}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Published:</span>
                        <span>{new Date(githubVersion.publishedAt).toLocaleDateString()}</span>
                      </div>
                      {githubVersion.isPrerelease && (
                        <div className="flex items-center gap-1">
                          <span className="text-orange-500">⚠️</span>
                          <span className="text-orange-600">Pre-release version</span>
                        </div>
                      )}
                      <div className="pt-2">
                        <a
                          href={githubVersion.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View on GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Changes for Current Version */}
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Current Version Changes:
                  </h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {recentChanges.map((change, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 dark:text-green-400 mt-1">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Version History */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Version History:</h4>
                  <div className="space-y-2">
                    {recentVersions.map((version, index) => (
                      <div
                        key={version.version}
                        className="border-l-2 border-border pl-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs text-primary">
                            v{version.version}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {version.buildDate}
                          </span>
                        </div>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {version.changes
                            .slice(0, 2)
                            .map((change, changeIndex) => (
                              <li
                                key={changeIndex}
                                className="flex items-start gap-2"
                              >
                                <span className="text-muted-foreground/60 mt-1">•</span>
                                <span>{change}</span>
                              </li>
                            ))}
                          {version.changes.length > 2 && (
                            <li className="text-xs text-muted-foreground/60">
                              +{version.changes.length - 2} more changes
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Total changes in current version:{" "}
                    {versionInfo.changes.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
