"use client";

import Chat from "./[id]/Chat";
import Sidebar from "./[id]/Sidebar";

interface RepositoryWorkspaceProps {
  repositoryId?: string;
}

export default function RepositoryWorkspace({
  repositoryId,
}: RepositoryWorkspaceProps) {
  return (
    <main className="flex h-screen overflow-hidden bg-[#0f0f0d] text-[#f4f1ea]">
      <Sidebar repositoryId={repositoryId} />
      <Chat repositoryId={repositoryId} />
    </main>
  );
}
