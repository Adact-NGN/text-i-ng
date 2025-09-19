"use client";

import { useState } from "react";

export function useAuthError() {
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthError = (error: any) => {
    if (error?.code === "TOKEN_EXPIRED" || error?.requiresReauth) {
      setAuthError("Your session has expired. Please sign out and sign in again.");
      
      // Show error for 3 seconds, then redirect to sign out
      setTimeout(() => {
        window.location.href = "/api/auth/signout";
      }, 3000);
      
      return true; // Indicates this was an auth error
    }
    return false; // Not an auth error
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return {
    authError,
    handleAuthError,
    clearAuthError
  };
}
