"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, X, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GithubIcon } from "../../../../../public/svgs/githubIcon";

interface AddRepositoryModalProps {
  onClose: () => void;
  cloneUrl: string;
  setCloneUrl: (e: any) => void;
  onSubmit: (cloneUrl: string) => void;
  isSubmitting: boolean;
  error?: string;
}

const GITHUB_URL_PATTERN =
  /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+(\.git)?\/?$/;

export default function AddRepositoryModal({
  onClose,
  cloneUrl,
  setCloneUrl,
  onSubmit,
  isSubmitting,
  error,
}: AddRepositoryModalProps) {
  const [validationError, setValidationError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUrl = cloneUrl.trim();

    if (!GITHUB_URL_PATTERN.test(trimmedUrl)) {
      setValidationError("Enter a valid GitHub repository URL.");
      return;
    }

    setValidationError("");
    onSubmit(trimmedUrl);
  }

  const activeError = validationError || error;

  return (
    <div
      aria-labelledby="add-repository-dialog-title"
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
        <div
          className={`pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl transition-colors duration-700 ${
            activeError ? "bg-red-500/10" : "bg-[#eeeadf]/10"
          }`}
        />

        <div className="relative flex items-start justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.05] ring-1 ring-white/[0.06]">
              <GithubIcon className="h-4.5 w-4.5 text-[#eeeadf]" />
            </div>
            <div>
              <h2
                className="text-lg font-semibold tracking-tight text-[#f4f1ea]"
                id="add-repository-dialog-title"
              >
                Add repository
              </h2>
              <p className="mt-0.5 text-xs text-[#8c8878]">
                Connect a GitHub repo to start chatting with it
              </p>
            </div>
          </div>

          <Button
            aria-label="Close"
            onClick={onClose}
            size="icon"
            type="button"
            variant="ghost"
            className="shrink-0 text-[#8c8878] hover:bg-white/[0.05] hover:text-[#f4f1ea]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form className="relative space-y-3 p-5" onSubmit={handleSubmit}>
          <label
            className="block text-sm font-medium text-[#d9d5ca]"
            htmlFor="clone-url"
          >
            GitHub repository URL
          </label>

          <Input
            id="clone-url"
            onChange={(event) => {
              setCloneUrl(event.target.value);
              if (validationError) setValidationError("");
            }}
            placeholder="https://github.com/owner/repo"
            type="url"
            value={cloneUrl}
            autoFocus
            className={`border-white/[0.08] bg-white/[0.03] text-[#f4f1ea] placeholder:text-[#55554e] transition-colors focus-visible:ring-1 focus-visible:ring-[#eeeadf]/30 ${
              activeError ? "border-red-500/40 focus-visible:ring-red-500/30" : ""
            }`}
          />

          {activeError && (
            <div className="flex items-start gap-1.5 text-sm text-[#f0a894]">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>{activeError}</p>
            </div>
          )}

          <Button
            className="w-full bg-[#eeeadf] font-semibold text-[#171715] transition-colors hover:bg-[#f4f1ea] disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Adding repository…" : "Add repository"}
          </Button>
        </form>
      </div>
    </div>
  );
}