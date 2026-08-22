"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, MessageSquare, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useConversations } from "@/hooks/conversations/useConversations";

import RepositoryButton from "./RepositoryButton";
import RepositoryNotice from "./RepositoryNotice";
import { RepositoryListSkeleton } from "../LoadingSkeletons";
import { Repository } from "@/types/repositories/repository";

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
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#6b685f] transition-colors duration-150 hover:bg-[#1c1c18] hover:text-[#eeeadf]"
          onClick={() => setExpanded((previous) => !previous)}
          type="button"
        >
          <ChevronRight
            className={cn_transition_class(expanded)}
          />
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
        <div className="relative ml-[13px] space-y-0.5 border-l border-[#232320] pl-4">
          <div className="flex items-center justify-between py-1 pr-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#6b685f]">
              Conversations
            </p>

            <Button
              aria-label="New chat"
              className="h-6 w-6 text-[#6b685f] hover:text-[#eeeadf]"
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onRepositorySelect?.(repository);
                router.push(`/repositories/${repository.id}?new=1`);
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {conversationsLoading && <RepositoryListSkeleton count={3} />}

          {conversationsError && (
            <RepositoryNotice tone="error" text="Conversations could not be loaded." />
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
                onClick={() => {
                  onRepositorySelect?.(repository);
                  router.push(`/repositories/${repository.id}/${conversation.id}`);
                }}
                title={conversation.title}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function cn_transition_class(expanded: boolean) {
  return `h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`;
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
          ? "flex w-full min-w-0 items-center gap-2 rounded-md border-l-2 border-[#ece6d8] bg-[#1c1c18] py-1.5 pl-[10px] pr-2 text-left text-[#f4f1ea]"
          : "flex w-full min-w-0 items-center gap-2 rounded-md border-l-2 border-transparent py-1.5 pl-[10px] pr-2 text-left text-[#a7a399] transition-colors duration-150 hover:bg-[#171715] hover:text-[#eeeadf]"
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
          className="truncate text-xs"
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