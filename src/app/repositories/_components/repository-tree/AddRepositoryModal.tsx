"use client";

import { FormEvent, useState } from "react";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  return (
    <div
      aria-labelledby="add-repository-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-xl bg-[#171715] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#2d2d27] px-5 py-4">
          <div>
            <h2
              className="mt-1 text-lg font-semibold text-[#f4f1ea]"
              id="add-repository-dialog-title"
            >
              Add repository
            </h2>
          </div>

          <Button
            aria-label="Close"
            onClick={onClose}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form className="space-y-3 p-5" onSubmit={handleSubmit}>
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
          />

          {(validationError || error) && (
            <p className="text-sm text-[#e2937c]">
              {validationError || error}
            </p>
          )}

          <Button
            className="w-full bg-[#f4f1ea] text-[#0f0f0d] hover:bg-[#d9d5ca]"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Add repository
          </Button>
        </form>
      </div>
    </div>
  );
}