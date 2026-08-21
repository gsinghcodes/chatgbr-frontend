import { cn } from "@/lib/utils";

interface RepositoryNoticeProps {
  text: string;
  tone?: "muted" | "error";
}

export default function RepositoryNotice({
  text,
  tone = "muted",
}: RepositoryNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-lg px-3 py-2 text-sm leading-6",
        tone === "error"
          ? "bg-[#241612] text-[#d59684]"
          : "bg-[#1a1a19] text-[#77756e]",
      )}
    >
      {text}
    </div>
  );
}