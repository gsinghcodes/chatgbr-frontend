"use client";

import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="border-b border-[#3A2A20] bg-[#11100D]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center bg-[#F26A21] text-xl font-black text-[#0A0A08]">
            C
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight">
              CODEMACHINE
            </h1>

            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#A94418]">
              Intelligence Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden text-right sm:block">
            <p className="font-mono text-[9px] uppercase tracking-wider text-[#716960]">
              Operator
            </p>

            <p className="text-sm font-bold">
              Gyanendra
            </p>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="border border-[#3A2A20] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[#8B8176] transition hover:border-[#F26A21] hover:text-[#F26A21]"
          >
            Disconnect
          </button>
        </div>
      </div>
    </header>
  );
}