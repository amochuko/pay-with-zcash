"use client";

import { RefreshCcwIcon } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="max-w-md text-center">
        {/* Warning icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>

        <p className="mb-6 text-muted-foreground">
          An unexpected error occurred while loading this page. Please try
          refreshing or contact support if the problem persists.
        </p>

        {process.env.NODE_ENV !== "production" && (
          <p className="mb-6 text-muted-foreground">{error.message}</p>
        )}
        <button
          onClick={() => reset()}
          // onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-[50] hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <RefreshCcwIcon className="h-4 w-4" />
          Refresh Page
        </button>
      </div>
    </div>
  );
}
