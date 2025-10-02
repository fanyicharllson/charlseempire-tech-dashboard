"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  const isClerkError =
    error.message.includes("Clerk") || (error as any).clerkError;
  const isNetworkError =
    error.message.includes("fetch") ||
    error.message.includes("network") ||
    error.message.includes("ENOTFOUND");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isNetworkError
              ? "Connection Lost 📡"
              : isClerkError
              ? "Authentication Issue"
              : "Something Went Wrong"}
          </h2>

          {/* Error Description */}
          <p className="text-gray-600 text-sm mb-6">
            {isNetworkError
              ? "Lost connection to the server. Please check your internet."
              : isClerkError
              ? "There was an issue with authentication. This might be a network problem or configuration issue."
              : "An unexpected error occurred. Please try again."}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Try Again
            </button>

            <button
              onClick={() => (window.location.href = "/sign-in")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-all duration-200"
            >
              Back to Sign In
            </button>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-6">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                Error Details (Dev Only)
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
