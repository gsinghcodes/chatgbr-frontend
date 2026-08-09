"use client";

import { motion } from "framer-motion";
import {
  GitBranch,
  GitPullRequest,
  LogOut,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Repository } from "@/api/repositories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRepositories } from "@/hooks/repositories/useRepositories";
import { cn } from "@/lib/utils";

interface SidebarProps {
  repositoryId?: string;
}

export default function Sidebar({
  repositoryId,
}: SidebarProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useRepositories();
  const repositories = Array.isArray(data) ? data : [];

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-[#24241f] bg-[#151512]">
      <div className="border-b border-[#24241f] p-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ece6d8] text-[#151512] shadow-[0_0_34px_rgba(236,230,216,0.12)]">
              <Sparkles className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold">
                Codex
              </h1>

              <p className="truncate text-xs text-[#85827a]">
                Code workspace
              </p>
            </div>
          </div>

          <Button
            aria-label="Add repository"
            onClick={() => router.push("/repositories/new")}
            size="icon"
            variant="ghost"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#2c2c26] bg-[#10100e] px-3 py-2 text-[#77746c]">
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate text-sm">
            Search repositories
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-3 flex items-center justify-between px-2">
          <p className="text-xs font-medium text-[#aaa79e]">
            Your Repositories
          </p>

          <Badge>
            <GitBranch className="h-3 w-3" />
            {repositories.length}
          </Badge>
        </div>

        {isLoading && (
          <RepositoryNotice text="Finding your repositories..." />
        )}

        {isError && (
          <RepositoryNotice
            tone="error"
            text="Repositories could not be loaded."
          />
        )}

        {!isLoading && repositories.length === 0 && (
          <RepositoryNotice text="Add a repository to begin." />
        )}

        <div className="space-y-1.5">
          {repositories.map((repository: Repository, index) => (
            <RepositoryButton
              key={repository.id}
              index={index}
              repository={repository}
              selected={repository.id === repositoryId}
              onSelect={() =>
                router.push(`/repositories/${repository.id}`)
              }
            />
          ))}
        </div>
      </nav>

      <div className="border-t border-[#24241f] p-3">
        <Button
          className="w-full justify-start"
          onClick={() => router.push("/login")}
          variant="ghost"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

function RepositoryButton({
  index,
  repository,
  selected,
  onSelect,
}: {
  index: number;
  repository: Repository;
  selected: boolean;
  onSelect: () => void;
}) {
  const ready =
    repository.status === "ready" ||
    repository.status === "READY";

  return (
    <motion.button
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left outline-none transition",
        selected
          ? "bg-[#2a2a24] text-[#fffaf0] shadow-[inset_0_0_0_1px_rgba(236,230,216,0.08)]"
          : "text-[#b8b5ad] hover:bg-[#20201c] hover:text-[#f4f1ea]",
      )}
      initial={{ opacity: 0, x: -8 }}
      onClick={onSelect}
      transition={{
        delay: index * 0.035,
        duration: 0.22,
        ease: "easeOut",
      }}
      whileHover={{ x: 2 }}
    >
      {selected && (
        <motion.span
          className="absolute left-0 top-2 h-[calc(100%-1rem)] w-1 rounded-r-full bg-[#ece6d8]"
          layoutId="activeRepository"
        />
      )}

      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
          selected
            ? "border-[#4a4a40] bg-[#191916]"
            : "border-[#30302a] bg-[#171715]",
        )}
      >
        <GitPullRequest className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {repository.name}
        </span>

        <span className="block truncate text-xs text-[#77756e]">
          {repository.clone_url}
        </span>
      </span>

      <span
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          ready ? "bg-[#57c878]" : "bg-[#dca85c]",
        )}
      />
    </motion.button>
  );
}

function RepositoryNotice({
  text,
  tone = "muted",
}: {
  text: string;
  tone?: "muted" | "error";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-4 text-sm leading-6",
        tone === "error"
          ? "border-[#593126] bg-[#241612] text-[#d59684]"
          : "border-[#2c2c26] bg-[#10100e] text-[#77756e]",
      )}
    >
      {text}
    </div>
  );
}
