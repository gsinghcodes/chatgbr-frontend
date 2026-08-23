import RepositoryWorkspace from "./repositories/_components/workspace/RepositoryWorkspace";
import Sidebar from "./repositories/_components/workspace/sidebar/Sidebar";

export default function Home() {
  return (
    <main className="no-scrollbar flex h-dvh overflow-hidden bg-[#0f0f0d] text-[#f4f1ea]">
      <Sidebar />
      <RepositoryWorkspace />
    </main>
  );
}
