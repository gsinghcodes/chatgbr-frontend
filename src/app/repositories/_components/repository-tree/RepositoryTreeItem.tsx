"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, MessageSquare, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Repository } from "@/api/repositories";
import { Button } from "@/components/ui/button";
import { useConversations } from "@/hooks/conversations/useConversations";

import RepositoryButton from "./RepositoryButton";
import RepositoryNotice from "./RepositoryNotice";
import { RepositoryListSkeleton } from "../LoadingSkeletons";

interface RepositoryTreeItemProps {
  repository: Repository;
  index: number;
  selected: boolean;
  activeConversationId?: string;
  showNewConversation?: boolean;
  onRepositoryIntent?: (repository: Repository) => void;
  onRepositorySelect?: (repository: Repository) => void;
}

export default function RepositoryTreeItem({
  repository,
  index,
  selected,
  activeConversationId,
  showNewConversation = false,
  onRepositoryIntent,
  onRepositorySelect,
}: RepositoryTreeItemProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);


  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    isError: conversationsError,
  } = useConversations(expanded ? repository.id : undefined);

  const conversations = Array.isArray(conversationsData)
    ? conversationsData
    : [];

  return (
    <div>
      <div className="flex items-center gap-1">
        <button
          aria-label={expanded ? "Collapse conversations" : "Expand conversations"}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#77756e] transition hover:bg-[#171715] hover:text-[#d9d5ca]"
          onClick={() => setExpanded((previous) => !previous)}
          type="button"
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <RepositoryButton
            index={index}
            repository={repository}
            selected={selected}
            onPrefetch={() => onRepositoryIntent?.(repository)}
            onSelect={() => {
              onRepositorySelect?.(repository);
              router.push(`/repositories/${repository.id}`);
            }}
          />
        </div>
      </div>

      {expanded && (
        <div className="ml-6 mt-1 space-y-1 border-l border-[#24241f] pl-3">
          <div className="flex items-center justify-between py-1 pr-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#5f5d57]">
              Conversations
            </p>

            <Button
              aria-label="New chat"
              className="h-6 w-6"
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/repositories/${repository.id}?new=1`);
              }}
              size="icon"
              variant="ghost"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {conversationsLoading && <RepositoryListSkeleton count={3} />}

          {conversationsError && (
            <RepositoryNotice
              tone="error"
              text="Conversations could not be loaded."
            />
          )}

          {!conversationsLoading &&
            !conversationsError &&
            !showNewConversation &&
            conversations.length === 0 && (
              <RepositoryNotice text="No conversations yet." />
            )}

          <AnimatePresence initial={false} mode="popLayout">
            {showNewConversation && (
              <ConversationButton
                active
                conversationId="new-conversation"
                key="new-conversation"
                title="New conversation"
              />
            )}

            {conversations.map((conversation) => (
              <ConversationButton
                active={conversation.id === activeConversationId}
                conversationId={conversation.id}
                key={conversation.id}
                onClick={() =>
                  router.push(
                    `/repositories/${repository.id}/${conversation.id}`,
                  )
                }
                title={conversation.title}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

interface ConversationButtonProps {
  active: boolean;
  conversationId: string;
  onClick?: () => void;
  title: string;
}

function ConversationButton({
  active,
  conversationId,
  onClick,
  title,
}: ConversationButtonProps) {
  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      className={
        active
          ? "flex w-full min-w-0 items-center gap-2 rounded-md bg-[#20201c] px-2 py-1.5 text-left text-xs text-[#f4f1ea]"
          : "flex w-full min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-[#aaa79e] transition hover:bg-[#171715]"
      }
      exit={{ opacity: 0, y: -4 }}
      initial={{ opacity: 0, y: -6 }}
      key={conversationId}
      layout="position"
      onClick={onClick}
      transition={{ duration: 0.2, ease: "easeOut" }}
      type="button"
    >
      <MessageSquare className="h-3 w-3 shrink-0" />
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className="truncate"
          exit={{ opacity: 0, y: -3 }}
          initial={{ opacity: 0, y: 3 }}
          key={title}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {title}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
