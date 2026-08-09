"use client";

import { useRouter } from "next/navigation";
import RepositoryCard from "./RepositoryCard";

const repositories = [
  {
    id: "1",
    name: "code-machine",
    status: "READY",
    language: "Python",
    chunks: 1248,
    lastIndexed: "4 min ago",
  },
  {
    id: "2",
    name: "frontend-console",
    status: "READY",
    language: "TypeScript",
    chunks: 843,
    lastIndexed: "18 min ago",
  },
  {
    id: "3",
    name: "experimental-rag",
    status: "INGESTING",
    language: "Python",
    chunks: 421,
    lastIndexed: "Processing",
  },
];

export default function RepositoryGrid() {
  const router = useRouter();

  return (
    <section>
      {/* Section heading */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#F26A21]">
            System / Repositories
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-tight">
            YOUR MACHINES
          </h2>

          <p className="mt-2 text-sm text-[#716960]">
            Repository intelligence nodes available to the operator.
          </p>
        </div>

        <button
          onClick={() => router.push("/repositories/new")}
          className="border border-[#F26A21] bg-[#F26A21] px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#0A0A08] transition hover:bg-[#FF7D32]"
        >
          + Add Repository
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 border border-[#3A2A20] bg-[#11100D] sm:grid-cols-4">
        <Stat
          label="Repositories"
          value="03"
        />

        <Stat
          label="Ready"
          value="02"
        />

        <Stat
          label="Indexed Chunks"
          value="2,512"
        />

        <Stat
          label="System"
          value="ONLINE"
          accent
        />
      </div>

      {/* Repository cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {repositories.map((repository) => (
          <RepositoryCard
            key={repository.id}
            repository={repository}
          />
        ))}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border-r border-[#3A2A20] p-5 last:border-r-0">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#716960]">
        {label}
      </p>

      <p
        className={`mt-3 text-xl font-black ${
          accent ? "text-[#F26A21]" : "text-[#F3EBDD]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}