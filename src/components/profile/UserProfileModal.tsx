"use client";

import { FormEvent, useState } from "react";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-xl border border-[#35352e] bg-[#171715] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#2d2d27] px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#99958b]">
              Account
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#f4f1ea]" id="profile-dialog-title">
              {displayName}
            </h2>
          </div>

          <Button aria-label="Close profile" onClick={onClose} size="icon" type="button" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex items-center gap-3 rounded-lg border border-[#2d2d27] bg-[#11110f] p-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#46463d] bg-[#24241f] text-[#c7c2b7]">
              {user.avatar_url ? (
                <img alt="Profile" className="h-full w-full object-cover" src={user.avatar_url} />
              ) : (
                <>
                  {displayName?.charAt(0).toUpperCase()}
                </>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#f4f1ea]">{user.email}</p>
              <p className="truncate text-xs text-[#85827a]">
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

          {error && <p className="text-sm text-[#e2937c]">{error}</p>}

          <Button className="w-full text-[#e2937c] hover:bg-[#311a17] hover:text-[#ffc0ad]" onClick={handleLogout} type="button" variant="ghost">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}