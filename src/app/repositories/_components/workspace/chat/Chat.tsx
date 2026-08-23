"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { streamChat } from "@/api/chat";
import { useRepository } from "@/hooks/repositories/useRepository";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useConversationMessages } from "@/hooks/conversations/useConversationMessages";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface Message {
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
}

interface ChatProps {
  repositoryId?: string;
  conversationId?: string;
}


export default function Chat({
  repositoryId,
  conversationId
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: repositoryData } = useRepository(repositoryId);
  const { data: history, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversationMessages(conversationId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const repository = repositoryData?.data?.repository || {};
  const repositoryName = repository?.name ?? "Select a repository";
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);
  const isPrependingRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const userSentMessageRef = useRef(false);
  const SCROLL_THRESHOLD = 100;

  useEffect(() => {
    isInitialLoadRef.current = true;
  }, [conversationId])


  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    if (history) {
      const flattened = [...history.pages]
        .reverse()
        .flatMap((page) => [...page.messages].reverse())
        .map((message) => ({
          role: message.role,
          content: message.content
        }))
      setMessages(flattened)
    }
  }, [conversationId, history]);

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  };

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (isInitialLoadRef.current) {
      scrollToBottom()
      isInitialLoadRef.current = false;
      return;
    }
    if (isPrependingRef.current) {
      container.scrollTop = container.scrollHeight - prevScrollHeightRef.current;
      isPrependingRef.current = false
      return;
    }
    if (userSentMessageRef.current) {
      container.scrollTop = container.scrollHeight;
      userSentMessageRef.current = false;
      return;
    }
  }, [messages])

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    if (container.scrollTop <= SCROLL_THRESHOLD) {
      prevScrollHeightRef.current = container.scrollHeight;
      isPrependingRef.current = true;
      fetchNextPage()
    }
  }

  async function sendMessage(question: string) {
    if (!repositoryId || loading) {
      return;
    }

    userSentMessageRef.current = true;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: question,
      },
    ]);

    // Create an empty assistant message.
    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        content: "",
      },
    ]);

    setLoading(true);

    let streamedConversationId: string | undefined;

    try {
      await streamChat(
        repositoryId,
        {
          question,
          conversation_id: conversationId,
        },
        (event) => {
          if (event.type === "conversation") {
            streamedConversationId =
              event.conversation_id;

            return;
          }

          if (event.type === "reasoning") {
            setMessages((previous) => {
              const updated = [...previous];
              const lastMessage = updated[updated.length - 1];

              if (lastMessage?.role === "assistant") {
                updated[updated.length - 1] = {
                  ...lastMessage,
                  reasoning: (lastMessage.reasoning ?? "") + (event.content ?? ""),
                };
              }

              return updated;
            });

            return;
          }

          if (event.type === "token") {
            setMessages((previous) => {
              const updated = [...previous];

              const lastMessage =
                updated[updated.length - 1];

              if (
                lastMessage?.role === "assistant"
              ) {
                updated[updated.length - 1] = {
                  ...lastMessage,
                  content:
                    lastMessage.content +
                    (event.content ?? ""),
                };
              }

              return updated;
            });

            return;
          }

          if (event.type === "error") {
            throw new Error(
              event.message ??
              "Unable to generate response.",
            );
          }

          if (event.type === "done") {
            streamedConversationId =
              event.conversation_id ??
              streamedConversationId;

            if (
              !conversationId &&
              streamedConversationId
            ) {
              router.replace(
                `/repositories/${repositoryId}/${streamedConversationId}`,
              );
            }
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["conversations", repositoryId],
      });
    } catch (error) {
      setMessages((previous) => {
        const updated = [...previous];

        const lastMessage =
          updated[updated.length - 1];

        if (
          lastMessage?.role === "assistant" &&
          lastMessage.content === ""
        ) {
          updated[updated.length - 1] = {
            ...lastMessage,
            content:
              error instanceof Error
                ? error.message
                : "Unable to generate response.",
          };
        }

        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#0f0f0d]"
      initial={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* Messages */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={`no-scrollbar relative z-10 h-full ${messages.length > 0 ? "overflow-y-auto" : "overflow-hidden"
            }`}
        >
          {!repositoryId ? (
            /* Empty state: no repository */
            <div className="flex h-full items-center px-4 py-10 sm:px-6">
              <div className="mx-auto w-full max-w-2xl text-center">
                <h3 className="text-2xl font-semibold tracking-tight text-[#fffaf0] sm:text-3xl lg:text-4xl">
                  Select a repository.
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-[#8c8a82] sm:mt-4 sm:text-sm sm:leading-6">
                  Select one from the sidebar to start a code-aware
                  conversation with repository context already attached.
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            /* Empty state: repository selected */
            <div
              key="ready"
              className="flex h-full items-center px-4 py-10 sm:px-6"
            >
              <div className="mx-auto w-full max-w-2xl text-center">
                <h3 className="text-2xl font-semibold tracking-tight text-[#fffaf0] sm:text-3xl lg:text-4xl">
                  Ready when you are.
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-xs leading-5 text-[#8c8a82] sm:mt-4 sm:text-sm sm:leading-6">
                  Ask about the architecture, trace a bug, explain a file, or
                  plan the next change.
                </p>
              </div>
            </div>
          ) : (
            /* Conversation */
            <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-5 px-3 py-5 sm:gap-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={`${message.role}-${index}`}
                    message={message}
                  />
                ))}

                {loading &&
                  !messages[messages.length - 1]?.content &&
                  !messages[messages.length - 1]?.reasoning && (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                      exit={{ opacity: 0, y: -8 }}
                      initial={{ opacity: 0, y: 8 }}
                      key="loading"
                    >
                      <Loader2 className="h-4 w-4 animate-spin text-[#aaa79e]" />
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bottom fade */}
        <div
          className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-20
          h-16
          bg-linear-to-b
          from-transparent
          to-[#0f0f0d]
          sm:h-18
        "
        />
      </div>

      {/* Input */}
      <div className="relative z-30 w-full shrink-0 px-2 pb-2 sm:px-4 sm:pb-4 lg:px-6">
        <ChatInput
          disabled={!repositoryId}
          loading={loading}
          repositoryName={repositoryName}
          onSubmit={sendMessage}
        />
      </div>
    </motion.section>
  );
}
