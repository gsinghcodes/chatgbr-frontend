"use client";

import { useState } from "react";
import {
  GitBranch,
  Plus,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import UserProfileModal from "@/components/profile/UserProfileModal";
import { Button } from "@/components/ui/button";

import { useRepositories } from "@/hooks/repositories/useRepositories";
import { useGitHubRepositories } from "@/hooks/repositories/useGithubRepositories";

import { useAppSelector } from "@/store/hooks";

import RepositoryNotice from "../../repository-tree/RepositoryNotice";
import GitHubRepositoryButton from "../../repository-tree/GitHubRepositoryButton";
import RepositoryTreeItem from "../../repository-tree/RepositoryTreeItem";
import { connectGitHub } from "@/api/github";
import { useCreateRepository } from "@/hooks/repositories/useCreateRepository";
import { getRepository } from "@/api/repositories";
import { getConversations } from "@/api/conversations";
import { useQueryClient } from "@tanstack/react-query";
import { RepositoryListSkeleton } from "../../LoadingSkeletons";
import Image from "next/image";
import AddRepositoryModal from "../../repository-tree/AddRepositoryModal";
import axios from "axios";
import { Repository } from "@/types/repositories/repository";
import RepositoryProgressModal from "../../repository-tree/RepositoryProgressModal";

export default function Sidebar() {
  const router = useRouter();
  const params = useParams<{ id?: string; conversationId?: string }>();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [pendingRepositoryId, setPendingRepositoryId] = useState<string>();
  const [addRepositoryOpen, setAddRepositoryOpen] = useState(false);
  const [githubRepositoriesOpen, setGitHubRepositoriesOpen] = useState(false);
  const [cloneUrl, setCloneUrl] = useState("");
  const [query, setQuery] = useState("");
  const [progressRepositoryId, setProgressRepositoryId] = useState<string | null>(null);
  // Closed by default on mobile/tablet, always visible on lg+
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    data: repositoryData,
    isLoading: repositoriesLoading,
    isError: repositoriesError,
  } = useRepositories();

  const {
    data: githubRepositories = [],
    isLoading: githubLoading,
    isError: githubError,
  } = useGitHubRepositories(githubRepositoriesOpen);

  const createRepository = useCreateRepository();

  const handleCreateRepository = async (cloneUrl: string) => {
    const result = await createRepository.mutateAsync({
      clone_url: cloneUrl,
    });

    setAddRepositoryOpen(false);
    setCloneUrl("");
    setProgressRepositoryId(result.data.repository.id);
  };

  const user = useAppSelector((state) => state.user.details);

  const [profileOpen, setProfileOpen] = useState(false);

  const repositoryId = params.id;
  const conversationId = params.conversationId;
  const showNewConversation = searchParams.get("new") === "1";

  function prepareRepository(repository: Repository) {
    const href = `/repositories/${repository.id}`;

    router.prefetch(href);
    void queryClient.prefetchQuery({
      queryKey: ["repositories", repository.id],
      queryFn: () => getRepository(repository.id),
    });
    void queryClient.prefetchQuery({
      queryKey: ["conversations", repository.id],
      queryFn: () => getConversations(repository.id),
    });
  }

  const repositories: Repository[] = repositoryData?.data?.repositories || [];

  const filteredRepositories = query
    ? repositories.filter((r) =>
      r.name?.toLowerCase().includes(query.toLowerCase()),
    )
    : repositories;

  const existingCloneURLs = new Set(
    repositories
      .map((repository) => repository.clone_url)
      .filter(Boolean)
      .map(String),
  );

  const displayName = user?.github_username ?? user?.email ?? "Signed in";

  return (
    <>
      {/* Mobile/tablet toggle button — hidden once the sidebar is open (close button takes over) */}
      {!showSidebar && (
        <button
          aria-label="Open sidebar"
          onClick={() => setShowSidebar(true)}
          className="fixed left-3 top-3 z-50 flex h-8 w-8 items-center justify-center rounded-md bg-[#161613] text-[#eeeadf] shadow-md lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      )}

      {/* Backdrop, mobile/tablet only, shown when sidebar is open */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 shrink-0 flex-col bg-[#0c0d0c] transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 pb-3 pt-4">
          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md">
            <Image
              src="/chatgbr-logo.png"
              alt="Chat GBR"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="truncate text-sm font-medium text-[#eeeadf]">
            Chat GBR
          </h1>

          {/* Close button, mobile/tablet only */}
          <button
            aria-label="Close sidebar"
            onClick={() => setShowSidebar(false)}
            className="ml-auto rounded-md p-1 text-[#6b685f] transition-colors duration-150 hover:bg-[#1c1c18] hover:text-[#eeeadf] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 rounded-md bg-[#161613] px-2.5 py-1.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#6b685f]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories"
              className="w-full bg-transparent text-xs text-[#eeeadf] placeholder:text-[#6b685f] focus:outline-none"
            />
          </div>
        </div>

        {/* Repository lists */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
          {/* Repositories */}
          <div className="mb-1.5 flex items-center justify-between px-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#6b685f]">
              Repositories
            </p>
            <button
              aria-label="Add repository"
              onClick={() => setAddRepositoryOpen(true)}
              className="rounded-md p-1 text-[#6b685f] transition-colors duration-150 hover:bg-[#1c1c18] hover:text-[#eeeadf]"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {repositoriesLoading && <RepositoryListSkeleton />}

          {repositoriesError && (
            <RepositoryNotice tone="error" text="Repositories could not be loaded." />
          )}

          {!repositoriesLoading && filteredRepositories.length === 0 && (
            <RepositoryNotice
              text={query ? "No matching repositories." : "No repositories added yet."}
            />
          )}

          <div className="space-y-0.5">
            {filteredRepositories.map((repository: Repository, index) => (
              <RepositoryTreeItem
                key={repository.id}
                index={index}
                repository={repository}
                selected={repository.id === (pendingRepositoryId ?? repositoryId)}
                activeConversationId={conversationId}
                onRepositoryIntent={(nextRepository) => {
                  prepareRepository(nextRepository);
                }}
                onRepositorySelect={(nextRepository) => {
                  prepareRepository(nextRepository);
                  setPendingRepositoryId(nextRepository.id);
                  setShowSidebar(false);
                }}
                showNewConversation={
                  repository.id === repositoryId && showNewConversation
                }
              />
            ))}
          </div>

          {/* GitHub repositories */}
          <div className="mb-1.5 mt-6 flex items-center px-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#6b685f]">
              GitHub
            </p>
          </div>

          {!githubRepositoriesOpen && (
            <button
              onClick={() => setGitHubRepositoriesOpen(true)}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs text-[#a7a399] transition-colors duration-150 hover:bg-[#1c1c18] hover:text-[#eeeadf]"
            >
              <GitBranch className="h-3.5 w-3.5 text-[#6b685f]" />
              Browse repositories
            </button>
          )}

          {githubRepositoriesOpen && githubLoading && (
            <RepositoryListSkeleton count={5} />
          )}

          {githubRepositoriesOpen && githubError && (
            <RepositoryNotice tone="error" text="GitHub repositories could not be loaded." />
          )}

          {githubRepositoriesOpen &&
            !githubLoading &&
            !githubError &&
            githubRepositories.length === 0 && (
              <div className="rounded-md bg-[#161613] p-3.5">
                <p className="text-xs font-medium text-[#eeeadf]">Connect GitHub</p>
                <p className="mt-1 text-[11px] leading-4 text-[#6b685f]">
                  Browse repositories available to add.
                </p>
                <Button
                  onClick={connectGitHub}
                  size="sm"
                  className="mt-3 w-full bg-[#f4f1ea] text-[#0f0f0d] hover:bg-[#d9d5ca]"
                >
                  <GitBranch className="mr-2 h-3.5 w-3.5" />
                  Connect GitHub
                </Button>
              </div>
            )}

          {githubRepositoriesOpen && (
            <div className="space-y-0.5">
              {githubRepositories.map((repository, index) => {
                const isAdded = existingCloneURLs.has(String(repository.clone_url));
                return (
                  <GitHubRepositoryButton
                    key={repository.id}
                    repository={repository}
                    index={index}
                    isAdded={isAdded}
                    onAdd={async () => {
                      const result = await createRepository.mutateAsync({
                        clone_url: repository.clone_url,
                      });
                      console.log(result.data.repository.id)
                      setProgressRepositoryId(result.data.repository.id);
                    }}
                  />
                );
              })}
            </div>
          )}
        </nav>

        {/* Profile */}
        <div className="border-t border-[#232320] p-2">
          <button
            className="flex w-full min-w-0 items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-[#1c1c18]"
            onClick={() => setProfileOpen(true)}
            type="button"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={displayName}
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#232320] bg-[#161613] text-xs font-medium text-[#eeeadf]">
                {displayName?.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#eeeadf]">
                {displayName}
              </p>
              {user?.github_username && (
                <p className="truncate text-[11px] text-[#6b685f]">{user.email}</p>
              )}
            </div>
          </button>
        </div>


      </aside>
      {addRepositoryOpen && (
        <AddRepositoryModal
          onClose={() => {
            setAddRepositoryOpen(false);
            createRepository.reset();
          }}
          cloneUrl={cloneUrl}
          setCloneUrl={setCloneUrl}
          onSubmit={handleCreateRepository}
          isSubmitting={createRepository.isPending}
          error={
            createRepository.isError
              ? axios.isAxiosError(createRepository.error)
                ? createRepository.error.response?.data?.message ?? "Something went wrong"
                : createRepository.error.message
              : null
          }
        />
      )}

      {profileOpen && user && (
        <UserProfileModal onClose={() => setProfileOpen(false)} user={user} />
      )}

      {progressRepositoryId && (
        <RepositoryProgressModal
          repositoryId={progressRepositoryId}
          onComplete={() => {
            setProgressRepositoryId(null);
            queryClient.invalidateQueries({
              queryKey: ["repositories"],
            });
          }}
        />
      )}
    </>
  );
}