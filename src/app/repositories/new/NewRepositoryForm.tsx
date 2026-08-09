"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GitBranch,
  Loader2,
  Plus,
  SquareCode,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateRepository } from "@/hooks/repositories/useCreateRepository";
import Sidebar from "../[id]/Sidebar";

export default function NewRepositoryForm() {
  const router = useRouter();
  const createRepository = useCreateRepository();
  const [name, setName] = useState("");
  const [cloneUrl, setCloneUrl] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const repository = await createRepository.mutateAsync({
      name: name.trim(),
      clone_url: cloneUrl.trim(),
    });

    router.push(`/repositories/${repository.id}`);
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#0f0f0d] text-[#f4f1ea]">
      <Sidebar />

      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(236,230,216,0.08),transparent_34%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:auto,42px_42px,42px_42px]" />

        <header className="relative z-10 flex h-16 items-center justify-between border-b border-[#24241f] bg-[#141412]/90 px-5 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#30302a] bg-[#191916] text-[#d9d5ca]">
              <GitBranch className="h-4 w-4" />
            </div>

            <div>
              <h1 className="text-sm font-semibold">
                Add repository
              </h1>

              <p className="text-xs text-[#77756e]">
                Connect a codebase to start asking questions.
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/")}
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </header>

        <div className="relative z-10 flex flex-1 items-center justify-center px-6">
          <motion.form
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl rounded-2xl border border-[#2d2d28] bg-[#171715]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
            initial={{ opacity: 0, y: 12 }}
            onSubmit={handleSubmit}
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#30302a] bg-[#10100e] text-[#d9d5ca]">
              <SquareCode className="h-5 w-5" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              New repository
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8c8a82]">
              Add the repository name and clone URL. Codex will open a chat
              for it as soon as it is created.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-[#aaa79e]">
                  Repository name
                </span>

                <Input
                  autoFocus
                  disabled={createRepository.isPending}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="chat-frontend"
                  required
                  value={name}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-[#aaa79e]">
                  Clone URL
                </span>

                <Input
                  disabled={createRepository.isPending}
                  onChange={(e) => setCloneUrl(e.target.value)}
                  placeholder="https://github.com/user/repository.git"
                  required
                  type="url"
                  value={cloneUrl}
                />
              </label>
            </div>

            {createRepository.isError && (
              <p className="mt-4 rounded-lg border border-[#593126] bg-[#241612] px-3 py-2 text-sm text-[#d59684]">
                {createRepository.error instanceof Error
                  ? createRepository.error.message
                  : "Repository could not be created."}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                disabled={createRepository.isPending}
                onClick={() => router.push("/")}
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>

              <Button
                disabled={
                  createRepository.isPending ||
                  !name.trim() ||
                  !cloneUrl.trim()
                }
                type="submit"
              >
                {createRepository.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add repository
              </Button>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
