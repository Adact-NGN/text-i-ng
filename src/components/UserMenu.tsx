"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm text-foreground hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1 transition-colors"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {session.user?.name?.charAt(0) ||
                session.user?.email?.charAt(0) ||
                "U"}
            </span>
          </div>
        )}
        <span className="hidden sm:block font-medium text-sm">
          {session.user?.name?.split(" ")[0] ||
            session.user?.email?.split("@")[0] ||
            "User"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-72 bg-popover rounded-md shadow-lg ring-1 ring-border z-20">
            <div className="py-1">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-popover-foreground">
                  {session.user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {session.user?.email}
                </p>
              </div>

              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full px-4 py-3 text-sm text-popover-foreground hover:bg-accent focus:outline-none focus:bg-accent transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-3 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">View Profile</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-3 text-sm text-popover-foreground hover:bg-accent focus:outline-none focus:bg-accent transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-3 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium">Sign out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
