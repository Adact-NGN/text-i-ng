"use client";

import { useState } from "react";
import {
  getVersionDisplay,
  getFullVersionInfo,
  getRecentChanges,
  VERSION_HISTORY,
} from "@/lib/version";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VersionDisplay() {
  const [showDetails, setShowDetails] = useState(false);
  const versionInfo = getFullVersionInfo();
  const recentChanges = getRecentChanges(5);
  const recentVersions = VERSION_HISTORY.slice(0, 5);

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
        {getVersionDisplay()}
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
                {/* Recent Changes for Current Version */}
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Current Version Changes:
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {recentChanges.map((change, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
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
                        className="border-l-2 border-gray-200 pl-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs text-blue-600">
                            v{version.version}
                          </span>
                          <span className="text-xs text-gray-500">
                            {version.buildDate}
                          </span>
                        </div>
                        <ul className="space-y-1 text-xs text-gray-600">
                          {version.changes
                            .slice(0, 2)
                            .map((change, changeIndex) => (
                              <li
                                key={changeIndex}
                                className="flex items-start gap-2"
                              >
                                <span className="text-gray-400 mt-1">•</span>
                                <span>{change}</span>
                              </li>
                            ))}
                          {version.changes.length > 2 && (
                            <li className="text-xs text-gray-400">
                              +{version.changes.length - 2} more changes
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
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
