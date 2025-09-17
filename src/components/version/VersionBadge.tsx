"use client";

import { useVersion } from "../hooks/useVersion";

export function VersionBadge() {
  const { version, isLoading } = useVersion();

  if (isLoading) {
    return <span className="animate-pulse">Loading...</span>;
  }

  return (
    <span>
      {version?.current || "v0.12.0"}
      {version?.isPrerelease && (
        <span className="ml-1 text-orange-500">⚠️</span>
      )}
    </span>
  );
}
