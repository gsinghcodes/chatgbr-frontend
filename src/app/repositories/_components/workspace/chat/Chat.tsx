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
  const { data: repository } = useRepository(repositoryId);
  const { data: history, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversationMessages(conversationId);
  const router = useRouter();
  const queryClient = useQueryClient();
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
      className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#0f0f0d]"
      initial={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div onScroll={handleScroll} ref={scrollContainerRef} className="no-scrollbar relative z-10 flex-1 overflow-y-auto">
        {!Boolean(repositoryId) ? (
          <div
            className="flex h-full items-center"
            key="empty">
            <div className="mx-auto">
              <h3 className="text-4xl text-center font-semibold text-[#fffaf0]">Select a repository.</h3>
              <p className="mt-4 text-sm leading-6 text-[#8c8a82]">Select one from the sidebar to start a code-aware conversation with repository context already attached.</p>
            </div>
          </div>
        ) : (messages.length === 0) ? (
          <div
            className="flex h-full items-center"
            key="ready"
          >
            <div className="mx-auto">
              <h3 className="text-4xl font-semibold text-center text-[#fffaf0]">Ready when you are.</h3>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#8c8a82]">Ask about the architecture, trace a bug, explain a file, or plan the next change.</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex flex-col gap-6 px-20 py-8">

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
                    <div className="rounded-xl border border-[#2d2d28] bg-[#171715]/95 px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-[#aaa79e]" />
                        <span className="text-sm text-[#8c8a82]">Reading the code...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        )
        }
      </div>

      <div className="relative z-10">
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
