import { Skeleton } from "@/components/ui/skeleton";

export function RepositoryListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-label="Loading repositories" className="space-y-1.5" role="status">
      <span className="sr-only">Loading repositories</span>
      {Array.from({ length: count }, (_, index) => (
        <div className="flex items-center gap-2 px-2 py-1.5" key={index}>
          <Skeleton className="h-5 w-5 shrink-0 rounded" />
          <Skeleton className={`h-3 ${index % 3 === 2 ? "w-2/5" : "w-3/5"}`} />
        </div>
      ))}
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div aria-label="Loading conversation" className="space-y-6 py-2" role="status">
      <span className="sr-only">Loading conversation</span>
      <div className="flex justify-end gap-3">
        <div className="w-full max-w-md space-y-3 rounded-2xl bg-[#24241f] px-5 py-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="w-full max-w-2xl space-y-3 rounded-2xl border border-[#2d2d28] bg-[#171715]/95 px-5 py-4">
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}
