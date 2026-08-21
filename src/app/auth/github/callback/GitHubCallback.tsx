"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    localStorage.setItem("access_token", accessToken);
    router.replace("/");
  }, [router, searchParams]);

  return (
    <main
      aria-label="Signing you in"
      className="flex min-h-screen items-center justify-center bg-[#0A0A08]"
      role="status"
    >
      <div className="space-y-4">
        <Skeleton className="mx-auto h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-32" />
      </div>

      <span className="sr-only">Signing you in</span>
    </main>
  );
}

export default function GitHubCallback() {
  return (
    <Suspense
      fallback={
        <main
          aria-label="Signing you in"
          className="flex min-h-screen items-center justify-center bg-[#0A0A08]"
          role="status"
        >
          <div className="space-y-4">
            <Skeleton className="mx-auto h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-32" />
          </div>

          <span className="sr-only">Signing you in</span>
        </main>
      }
    >
      <GitHubCallbackContent />
    </Suspense>
  );
}