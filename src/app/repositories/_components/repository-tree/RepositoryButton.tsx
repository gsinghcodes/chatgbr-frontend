"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MoreHorizontal, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Repository } from "@/types/repositories/repository";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteRepository } from "@/hooks/repositories/useDeleteRepository";

interface RepositoryButtonProps {
  index: number;
  repository: Repository;
  selected: boolean;
  onSelect: (e: any) => void;
  onPrefetch?: () => void;
}

const statusConfig = {
  READY: {
    label: "Ready",
    badge: "bg-emerald-500/10 text-emerald-400 opacity-0",
  },
  FAILED: {
    label: "Failed",
    badge: "bg-rose-500/10 text-rose-400",
  },
  PENDING: {
    label: "Pending",
    badge: "bg-amber-500/10 text-amber-400",
  },
  INDEXING: {
    label: "Indexing",
    badge: "bg-blue-500/10 text-blue-400 animate-pulse",
  },
  INGESTING: {
    label: "Ingesting",
    badge: "bg-purple-500/10 text-purple-400 animate-pulse",
  },
} satisfies Record<
  Repository["status"],
  {
    label: string;
    badge: string;
  }
>;

export default function RepositoryButton({
  index,
  repository,
  selected,
  onSelect,
  onPrefetch,
}: RepositoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const status = statusConfig[repository.status] ?? statusConfig.PENDING;
  const deleteRepository = useDeleteRepository()

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsDeleting(true);
      await deleteRepository.mutateAsync(repository.id);
    } catch (error) {
      console.error("Failed to delete repository:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: Math.min(index * 0.02, 0.3),
        duration: 0.18,
        ease: "easeOut",
      }}
      className="relative w-full"
    >
      <div
        onMouseEnter={onPrefetch}
        onFocus={onPrefetch}
        className={cn(
          "group relative flex w-full items-center justify-between rounded-lg px-3 py-1.5",
          "transition-all duration-150 ease-in-out active:scale-[0.99]",
          selected
            ? "bg-[#24231e] text-[#f4f1ea] shadow-sm"
            : "text-[#a7a399] hover:bg-[#1a1916] hover:text-[#eeeadf]"
        )}
      >
        {/* Active Indicator Line */}
        {selected && (
          <motion.span
            layoutId="activeRepository"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#ece6d8]"
          />
        )}

        {/* Repository Details */}
        <button
          type="button"
          onClick={onSelect}
          className="min-w-0 flex-1 pr-3 text-left outline-none focus-visible:ring-1 focus-visible:ring-[#ece6d8]"
        >
          <span className="block truncate text-sm font-medium leading-none">
            {repository.name}
          </span>
          <span className="mt-1 block truncate text-[11px] text-[#6b685f] pr-7 group-hover:text-[#8f8b81] transition-colors">
            {repository.clone_url}
          </span>
        </button>

        {/* Status Badge & Actions Container */}
        <span
          className={cn(
            "absolute top-1 right-1 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium transition-opacity duration-150",
            status.badge
          )}
        >
          {status.label}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => {
              onSelect?.(repository)
              e.stopPropagation()
            }}
            disabled={isDeleting}
            className={cn(
              "absolute bottom-2 right-2 z-10",
              "flex h-3 w-7 items-center justify-center rounded-md",
              "text-[#8f8b81]",
              "opacity-0 transition-all duration-150",
              "group-hover:opacity-100",
              "focus-visible:opacity-100",
              "data-[state=open]:opacity-100",
              "hover:bg-[#302f29] hover:text-[#eeeadf]",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ece6d8]"
            )}
            aria-label="Repository options"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#a7a399]" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={4}
            className="w-40 border-[#2f2e27] rounded bg-[#1a1916] text-[#eeeadf]"
          >
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer  text-xs rounded"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}