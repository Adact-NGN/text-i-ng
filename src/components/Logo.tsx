"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* NG Nordic Logo */}
      <div className={cn("relative", sizeClasses[size])}>
        <Image
          src="https://media.crystallize.com/ng-nordic/25/6/3/5/logo.svg"
          alt="NG Nordic Logo"
          fill
          className="object-contain"
        />
      </div>

      {/* App Name */}
      <span className={cn("font-bold text-foreground", textSizeClasses[size])}>
        TextiNG
      </span>
    </div>
  );
}
