"use client";

import { useRouter } from "next/navigation";

interface Repository {
  id: string;
  name: string;
  status: string;
  language: string;
  chunks: number;
  lastIndexed: string;
}

interface RepositoryCardProps {
  repository: Repository;
}

export default function RepositoryCard({
  repository,
}: RepositoryCardProps) {
  const router = useRouter();

  const ready = repository.status === "READY";

  return (
    <button
      onClick={() =>
        router.push(`/repositories/${repository.id}`)
      }
      className="group relative border border-[#3A2A20] bg-[#11100D] p-6 text-left transition hover:border-[#F26A21] hover:bg-[#15120F]"
    >
      {/* Machine number */}
      <div className="absolute right-5 top-5 font-mono text-[9px] text-[#514A43]">
        NODE-{repository.id.padStart(2, "0")}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 ${
            ready
              ? "bg-[#F26A21]"
              : "animate-pulse bg-[#A94418]"
          }`}
        />

        <span
          className={`font-mono text-[9px] font-bold uppercase tracking-[0.2em] ${
            ready ? "text-[#F26A21]" : "text-[#A94418]"
          }`}
        >
          {repository.status}
        </span>
      </div>

      {/* Name */}
      <h3 className="mt-8 text-2xl font-black tracking-tight transition group-hover:text-[#F26A21]">
        {repository.name}
      </h3>

      <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#716960]">
        {repository.language} Repository
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-[#3A2A20]" />

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#514A43]">
            Indexed Chunks
          </p>

          <p className="mt-1 font-mono text-sm text-[#C9BFB3]">
            {repository.chunks.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#514A43]">
            Last Index
          </p>

          <p className="mt-1 font-mono text-sm text-[#C9BFB3]">
            {repository.lastIndexed}
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="mt-7 flex items-center justify-between border-t border-[#3A2A20] pt-4">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#716960]">
          Open Console
        </span>

        <span className="text-[#F26A21] transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </button>
  );
}