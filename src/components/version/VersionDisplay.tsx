"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VersionBadge } from "./VersionBadge";
import { VersionModal } from "./VersionModal";

export function VersionDisplay() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 text-xs"
      >
        <Info className="h-3 w-3" />
        <VersionBadge />
      </Button>

      {isModalOpen && (
        <VersionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
