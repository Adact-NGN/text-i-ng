"use client";

import { X, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVersion } from "../hooks/useVersion";
import { GitHubReleaseInfo } from "./GitHubReleaseInfo";
import { LocalVersionInfo } from "./LocalVersionInfo";

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VersionModal({ isOpen, onClose }: VersionModalProps) {
  const { version, isLoading, error } = useVersion();

  if (!isOpen) return null;

  return (
    <div className="absolute top-10 right-0 z-50 w-96">
      <Card className="shadow-lg border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {version?.current || "v0.12.0"}
              </CardTitle>
              <CardDescription>
                {version?.publishedAt 
                  ? `Published ${new Date(version.publishedAt).toLocaleDateString()}`
                  : "Local version"
                }
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            <GitHubReleaseInfo 
              version={version}
              isLoading={isLoading}
              error={error}
            />
            
            <LocalVersionInfo />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
