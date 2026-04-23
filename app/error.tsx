"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-black text-zinc-900 mb-2">Something went wrong</h2>
        <p className="text-zinc-500 mb-8">
          We encountered an unexpected error. Please try again or return to the home page.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Go Home
          </Button>
          <Button onClick={reset}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
