import RepositoryWorkspace from "../RepositoryWorkspace";

interface RepositoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RepositoryPage({
  params,
}: RepositoryPageProps) {
  const { id } = await params;

  return <RepositoryWorkspace repositoryId={id} />;
}
