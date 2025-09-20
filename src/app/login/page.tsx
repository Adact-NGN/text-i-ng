"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Force dynamic rendering to avoid Suspense issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorParam = searchParams.get("error");

  useEffect(() => {
    // Handle authentication errors
    if (errorParam) {
      switch (errorParam) {
        case "AccessDenied":
          setError(
            "Access denied. You are not authorized to use this application. Please contact your administrator."
          );
          break;
        case "Configuration":
          setError(
            "Authentication configuration error. Please try again later."
          );
          break;
        case "Verification":
          setError("Verification failed. Please try again.");
          break;
        case "Default":
        default:
          setError("Authentication failed. Please try again.");
          break;
      }
    }
  }, [errorParam]);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use NextAuth signIn with automatic redirect
      await signIn("azure-ad", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Sign in error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col justify-center py-12 px-0 relative">
      <div className="relative z-10 mx-auto w-full max-w-md px-6">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground animate-fade-in hover:scale-105 transition-transform duration-300">
            Welcome to TextiNG ✨
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in-delay">
            Sign in with your Microsoft work or school account
          </p>
        </div>
      </div>

      <div className="mt-12 relative z-10 mx-auto w-full max-w-md px-6">
        <div className="bg-card/90 backdrop-blur-sm py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-border transform hover:shadow-3xl transition-all duration-300">
          {error && (
            <div className="mb-6 rounded-xl bg-destructive/10 backdrop-blur-sm p-4 border border-destructive/20 animate-slide-down">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-destructive"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-destructive">
                    Authentication Error
                  </h3>
                  <div className="mt-2 text-sm text-destructive/80">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="font-medium">Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                  </svg>
                  <span className="font-medium">Sign in with Microsoft</span>
                </div>
              )}
            </button>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card/80 backdrop-blur-sm text-muted-foreground font-medium">
                  🔒 Secure authentication powered by Microsoft Entra ID
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              By signing in, you agree to our terms of service and privacy
              policy.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Contact your IT administrator if you need access to this
              application.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 relative z-10 text-center">
        <p className="text-sm text-muted-foreground">
          Powered by <span className="font-semibold text-primary">TextiNG</span>{" "}
          • Secure • Reliable • Professional
        </p>
      </div>
    </div>
  );
}
