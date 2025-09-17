"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorParam = searchParams.get("error");

  useEffect(() => {
    // Check if user is already authenticated
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          // Use router.push for better navigation handling
          router.push("/");
          router.refresh();
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    
    // Check immediately
    checkSession();
    
    // Also check periodically in case session is established after page load
    const interval = setInterval(checkSession, 2000);
    
    return () => clearInterval(interval);
  }, [router]);

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
      const result = await signIn("azure-ad", {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setError("Authentication failed. Please try again.");
        console.error("Authentication error:", result.error);
      } else if (result?.ok) {
        // Use router for better navigation
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8 transform hover:scale-105 transition-transform duration-300">
          <Logo size="lg" />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Welcome to TextiNG
          </h2>
          <p className="text-lg text-gray-600 animate-fade-in-delay">
            Sign in with your Microsoft work or school account
          </p>
        </div>
      </div>

      <div className="mt-12 relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20 transform hover:shadow-3xl transition-all duration-300">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50/90 backdrop-blur-sm p-4 border border-red-200 animate-slide-down">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
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
                  <h3 className="text-sm font-semibold text-red-800">
                    Authentication Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
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
                <div className="w-full border-t border-gray-300/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 backdrop-blur-sm text-gray-500 font-medium">
                  🔒 Secure authentication powered by Microsoft Entra ID
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
            <p className="text-xs text-gray-500">
              Contact your IT administrator if you need access to this application.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 relative z-10 text-center">
        <p className="text-sm text-gray-500">
          Powered by <span className="font-semibold text-blue-600">TextiNG</span> • 
          Secure • Reliable • Professional
        </p>
      </div>
    </div>
  );
}
