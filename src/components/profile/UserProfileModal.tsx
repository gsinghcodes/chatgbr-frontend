"use client";

import { FormEvent, useEffect, useState } from "react";
import { ImageIcon, Loader2, LogOut, RefreshCw, X } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  syncGitHubProfile,
  updateCurrentUser,
  type User,
} from "@/api/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store/hooks";
import { clearUser, setUserDetails } from "@/store/slices/userSlice";
import { logoutUser } from "@/api/auth";

interface UserProfileModalProps {
  onClose: () => void;
  user: User;
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = error.response;

    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = response.data;

      if (
        typeof data === "object" &&
        data !== null &&
        "detail" in data &&
        typeof data.detail === "string"
      ) {
        return data.detail;
      }
    }
  }

  return error instanceof Error ? error.message : "Unable to update profile.";
}

export default function UserProfileModal({
  onClose,
  user,
}: UserProfileModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function updateStoredUser(updatedUser: User) {
    dispatch(
      setUserDetails({
        ...user,
        ...updatedUser,
        github_username: updatedUser.github_username ?? null,
        avatar_url: updatedUser.avatar_url ?? null,
      }),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const updatedUser = await updateCurrentUser({
        avatar_url: avatarUrl.trim() || null,
      });
      updateStoredUser(updatedUser);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleGitHubSync() {
    setSyncing(true);
    setError("");

    try {
      const updatedUser = await syncGitHubProfile();
      updateStoredUser(updatedUser);
      setAvatarUrl(updatedUser.avatar_url ?? "");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSyncing(false);
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } finally {
      localStorage.removeItem("access_token");
      dispatch(clearUser());
      router.replace("/login");
    }
  }

  const displayName = user.github_username ?? user.email;

  return (
    <div
      aria-labelledby="profile-dialog-title"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
      role="dialog"
    >
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#1a1a17] to-[#141412] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-500 ease-out ${
          mounted
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-95 opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#eeeadf]/10 blur-3xl" />

        <div className="relative flex items-start justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8c8878]">
              Account
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#f4f1ea]" id="profile-dialog-title">
              {displayName}
            </h2>
          </div>

          <Button
            aria-label="Close profile"
            onClick={onClose}
            size="icon"
            type="button"
            variant="ghost"
            className="shrink-0 text-[#8c8878] hover:bg-white/[0.05] hover:text-[#f4f1ea]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative space-y-5 p-5">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#eeeadf]/20 to-[#eeeadf]/5 text-sm font-semibold text-[#eeeadf] ring-1 ring-white/[0.08]">
              {user.avatar_url ? (
                <img alt="Profile" className="h-full w-full object-cover" src={user.avatar_url} />
              ) : (
                <>{displayName?.charAt(0).toUpperCase()}</>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#f4f1ea]">{user.email}</p>
              <p className="truncate text-xs text-[#8c8878]">
                {user.github_username ? `@${user.github_username}` : "GitHub not linked"}
              </p>
            </div>
          </div>

          {/* <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-[#d9d5ca]" htmlFor="avatar-url">
              Profile image URL
            </label>
            <Input
              id="avatar-url"
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://example.com/avatar.png"
              type="url"
              value={avatarUrl}
            />
            <Button className="w-full" disabled={saving} type="submit">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save image
            </Button>
          </form> */}

          {/* <Button className="w-full" disabled={syncing} onClick={handleGitHubSync} type="button" variant="subtle">
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Sync with GitHub
          </Button> */}

          {error && <p className="text-sm text-[#f0a894]">{error}</p>}

          <Button
            className="w-full text-[#f0a894] hover:bg-red-500/[0.08] hover:text-[#ffc0ad]"
            onClick={handleLogout}
            type="button"
            variant="ghost"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}