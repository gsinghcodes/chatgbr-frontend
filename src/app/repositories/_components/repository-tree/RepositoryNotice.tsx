import { AlertCircle, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

interface RepositoryNoticeProps {
  text: string;
  tone?: "muted" | "error";
}

export default function RepositoryNotice({
  text,
  tone = "muted",
}: RepositoryNoticeProps) {
  const Icon = tone === "error" ? AlertCircle : Inbox;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-xs leading-5",
        tone === "error"
          ? "bg-[#241612] text-[#d59684]"
          : "bg-[#161613] text-[#6b685f]",
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{text}</span>
    </div>
  );
}