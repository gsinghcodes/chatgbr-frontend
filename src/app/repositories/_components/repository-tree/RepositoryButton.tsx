"use client";

import { motion } from "framer-motion";
import { GitPullRequest } from "lucide-react";

import { Repository } from "@/api/repositories";
import { cn } from "@/lib/utils";

interface RepositoryButtonProps {
  index: number;
  repository: Repository;
  selected: boolean;
  onSelect: () => void;
  onPrefetch?: () => void;
}

export default function RepositoryButton({
  index,
  repository,
  selected,
  onSelect,
  onPrefetch,
}: RepositoryButtonProps) {
  const ready =
    repository.status === "ready" ||
    repository.status === "READY";

  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.035,
        duration: 0.22,
        ease: "easeOut",
      }}
      whileHover={{ x: 2 }}
      onFocus={onPrefetch}
      onMouseEnter={onPrefetch}
      onClick={onSelect}
      className={cn(
        "group relative flex w-full items-center gap-1 rounded-lg px-3 mb-1 py-1 text-left outline-none transition",
        selected
          ? "bg-[#2a2a24] text-[#fffaf0] shadow-[inset_0_0_0_1px_rgba(236,230,216,0.08)]"
          : "text-[#b8b5ad] hover:bg-[#20201c] hover:text-[#f4f1ea]",
      )}
    >
      {selected && (
        <motion.span
          layoutId="activeRepository"
          className="absolute left-0 top-2 h-[calc(100%-1rem)] w-1 rounded-r-full bg-[#ece6d8]"
        />
      )}

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
          ready
            ? "bg-[#57c878]"
            : "bg-[#dca85c]",
        )}
      />
    </motion.button>
  );
}
