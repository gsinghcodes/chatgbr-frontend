"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  GitBranch,
  Lock,
  Plus,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface GitHubRepositoryButtonProps {
  repository: {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    description: string | null;
    default_branch: string;
  };
  index: number;
  isAdded: boolean;
  onAdd: () => Promise<void>;
}

export default function GitHubRepositoryButton({
  repository,
  index,
  isAdded,
  onAdd,
}: GitHubRepositoryButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      await onAdd();
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.03,
        duration: 0.2,
        ease: "easeOut",
      }}
      className="group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-150 hover:bg-[#1c1c18]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#232320] bg-[#161613]">
        <GitBranch className="h-3.5 w-3.5 text-[#6b685f]" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="block truncate text-sm font-medium text-[#a7a399]">
            {repository.name}
          </span>

          {repository.private && (
            <Lock
              className="h-3 w-3 shrink-0 text-[#6b685f]"
              aria-label="Private repository"
            />
          )}
        </span>

        <span className="block truncate text-[11px] text-[#6b685f]">
          {repository.full_name}
        </span>
      </span>

      {isAdded ? (
        <span
          className="flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-[#7fae82]"
          title="Already indexed"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Indexed
        </span>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          disabled={isAdding}
          className="h-7 w-7 shrink-0 text-[#6b685f] opacity-0 transition group-hover:opacity-100 hover:text-[#eeeadf]"
          onClick={handleAdd}
          aria-label={`Add ${repository.name}`}
          title="Add repository"
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      )}
    </motion.div>
  );
}