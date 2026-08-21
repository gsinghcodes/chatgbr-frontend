"use client";

import { usePathname } from "next/navigation";

import RepositoryWorkspace from "./_components/workspace/RepositoryWorkspace";
import Sidebar from "./_components/workspace/sidebar/Sidebar";

export default function RepositoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isNewRepositoryPage = pathname === "/repositories/new";

  return (
    <main className="no-scrollbar flex h-screen overflow-hidden bg-[#0f0f0d] text-[#f4f1ea]">
      <Sidebar />
      {isNewRepositoryPage ? children : <RepositoryWorkspace />}
    </main>
  );
}
