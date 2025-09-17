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
import { ReleaseHistory } from "./ReleaseHistory";

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VersionModal({ isOpen, onClose }: VersionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-10 right-0 z-50 w-[32rem] max-w-[90vw] max-h-[80vh]">
      <Card className="shadow-lg border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Release History</CardTitle>
              <CardDescription>
                GitHub releases and version information
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
          <ReleaseHistory />
        </CardContent>
      </Card>
    </div>
  );
}
