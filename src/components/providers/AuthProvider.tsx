"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/store";

import {
  setUserDetails,
  setIsLoggedIn,
} from "@/store/slices/userSlice";
import { getCurrentUser } from "@/api/auth";


const PUBLIC_PATHS = ["/login", "/register", "/auth/github/callback"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  const [hasVerifiedSession, setHasVerifiedSession] = useState(false);

  useEffect(() => {
    if (isPublicPath) {
      return;
    }

    let isMounted = true;

    async function hydrateUser() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const user = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        dispatch(setIsLoggedIn(true));
        setHasVerifiedSession(true);

        dispatch(
          setUserDetails({
            id: user.id,
            email: user.email,
            github_username: user.github_username ?? null,
            avatar_url: user.avatar_url ?? null,
            github_installed: user.github_installed ?? null,
          }),
        );
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          // localStorage.removeItem("access_token");

          // dispatch(setIsLoggedIn(false));
          // setHasVerifiedSession(false);

          // router.replace("/login");

          // return;
        }

        console.error("Failed to authenticate user:", error);
      }
    }

    void hydrateUser();

    return () => {
      isMounted = false;
    };
  }, [dispatch, router, isPublicPath, pathname]);

  if (!isPublicPath && !hasVerifiedSession) {
    return (
      <main
        aria-label="Loading workspace"
        className="flex min-h-screen items-center justify-center bg-[#0f0f0d]"
        role="status"
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#85827a]/30 border-t-[#85827a]"
          aria-hidden="true"
        />

        <span className="sr-only">Loading workspace</span>
      </main>
    );
  }

  return <>{children}</>;
}