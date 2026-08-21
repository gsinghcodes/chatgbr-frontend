import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, GitPullRequest, Lock, Plus } from "lucide-react";

export default function GitHubRepositoryButton({
  repository,
  index,
  isAdded,
  onAdd,
}: {
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
  onAdd: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.035,
        duration: 0.22,
        ease: "easeOut",
      }}
      className="group flex items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[#20201c]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#30302a] bg-[#171715]">
        <GitPullRequest className="h-4 w-4 text-[#85827a]" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="block truncate text-sm font-medium text-[#b8b5ad]">
            {repository.name}
          </span>

          {repository.private && (
            <Lock
              className="h-3 w-3 shrink-0 text-[#77756e]"
              aria-label="Private repository"
            />
          )}
        </span>

        <span className="block truncate text-xs text-[#77756e]">
          {repository.full_name}
        </span>
      </span>

      {isAdded ? (
        <span
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-[#7fae82]"
          title="Already indexed"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Indexed
        </span>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 shrink-0 opacity-0 transition group-hover:opacity-100"
          onClick={onAdd}
          aria-label={`Add ${repository.name}`}
          title="Add repository"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
}