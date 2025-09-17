"use client";

import { useVersion } from "../hooks/useVersion";

export function VersionBadge() {
  const { version, isLoading, error } = useVersion();

  if (isLoading) {
    return <span className="animate-pulse">Loading...</span>;
  }

  if (error) {
    return <span className="text-red-500" title={error}>Error</span>;
  }

  if (!version) {
    return <span className="text-muted-foreground">No version</span>;
  }

  return (
    <span>
      {version.current}
      {version.isPrerelease && (
        <span className="ml-1 text-orange-500">⚠️</span>
      )}
    </span>
  );
}
