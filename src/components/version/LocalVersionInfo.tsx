"use client";

import { getFullVersionInfo, getRecentChanges } from "@/lib/version";

export function LocalVersionInfo() {
  const versionInfo = getFullVersionInfo();
  const recentChanges = getRecentChanges(5);

  return (
    <div>
      <h4 className="font-medium text-sm mb-2">Current Version Changes:</h4>
      <ul className="space-y-1 text-xs text-muted-foreground">
        {recentChanges.map((change, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-green-500 dark:text-green-400 mt-1">•</span>
            <span>{change}</span>
          </li>
        ))}
      </ul>
      
      <div className="pt-2 border-t border-border mt-4">
        <p className="text-xs text-muted-foreground">
          Local Version: {versionInfo.version} • Total changes: {versionInfo.changes.length}
        </p>
      </div>
    </div>
  );
}
