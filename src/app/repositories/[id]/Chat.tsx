"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Braces,
  Bug,
  CheckCircle2,
  FileCode2,
  GitBranch,
  Loader2,
  Network,
  Sparkles,
  User,
  WandSparkles,
} from "lucide-react";

import { chat } from "@/api/chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRepository } from "@/hooks/repositories/useRepository";
import ChatInput from "./ChatInput";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  repositoryId?: string;
}

const suggestions = [
  {
    icon: Network,
    label: "Map the main app flow",
  },
  {
    icon: Braces,
    label: "Explain the repository architecture",
  },
  {
    icon: Bug,
    label: "Find likely error paths",
  },
  {
    icon: WandSparkles,
    label: "What should I refactor first?",
  },
];

export default function Chat({
  repositoryId,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: repository } = useRepository(repositoryId);
  const repositoryName = repository?.name ?? "Select a repository";

  async function sendMessage(question: string) {
    if (!repositoryId) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: question,
      },
    ]);

    setLoading(true);

    try {
      const result = await chat(repositoryId, {
        question,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: result.data.answer,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Unable to generate response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#0f0f0d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(236,230,216,0.08),transparent_34%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:auto,42px_42px,42px_42px]" />

      <header className="relative z-10 flex h-16 items-center justify-between border-b border-[#24241f] bg-[#141412]/90 px-5 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#30302a] bg-[#191916] text-[#d9d5ca]">
            <FileCode2 className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[#f4f1ea]">
              {repositoryName}
            </h2>

            <p className="truncate text-xs text-[#77756e]">
              Repository context is attached to every message
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {repositoryId && (
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" />
              Indexed
            </Badge>
          )}

          <Badge>
            <GitBranch className="h-3 w-3" />
            Chat
          </Badge>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
          <AnimatePresence mode="wait">
            {!repositoryId && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[58vh] flex-col justify-center"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: 12 }}
                key="empty"
              >
                <div className="max-w-xl">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#30302a] bg-[#191916] text-[#d9d5ca]">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <h3 className="text-4xl font-semibold tracking-tight text-[#fffaf0]">
                    Choose a repository.
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-[#8c8a82]">
                    Select one from the sidebar to start a code-aware
                    conversation with repository context already attached.
                  </p>
                </div>
              </motion.div>
            )}

            {repositoryId && messages.length === 0 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[58vh] flex-col justify-center"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: 12 }}
                key="ready"
              >
                <div className="max-w-2xl">
                  <Badge className="mb-5">
                    <Bot className="h-3 w-3" />
                    Repository assistant
                  </Badge>

                  <h3 className="text-4xl font-semibold tracking-tight text-[#fffaf0]">
                    Ready when you are.
                  </h3>

                  <p className="mt-4 max-w-lg text-sm leading-6 text-[#8c8a82]">
                    Ask about the architecture, trace a bug, explain a file,
                    or plan the next change.
                  </p>

                  <div className="mt-8 grid gap-2 sm:grid-cols-2">
                    {suggestions.map((suggestion, index) => {
                      const Icon = suggestion.icon;

                      return (
                        <motion.div
                          animate={{ opacity: 1, y: 0 }}
                          initial={{ opacity: 0, y: 8 }}
                          key={suggestion.label}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Button
                            className="h-auto w-full justify-start p-4 text-left"
                            onClick={() =>
                              sendMessage(suggestion.label)
                            }
                            variant="subtle"
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="min-w-0 whitespace-normal leading-5">
                              {suggestion.label}
                            </span>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <ChatMessage
                key={`${message.role}-${index}`}
                message={message}
              />
            ))}

            {loading && (
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

                    <span className="text-sm text-[#8c8a82]">
                      Reading the code...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10">
        <ChatInput
          disabled={!repositoryId}
          loading={loading}
          repositoryName={repositoryName}
          onSubmit={sendMessage}
        />
      </div>
    </section>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const user = message.role === "user";
  const Icon = user ? User : Bot;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={user ? "flex justify-end" : "flex justify-start"}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div
        className={
          user
            ? "max-w-2xl rounded-2xl bg-[#ece6d8] px-5 py-4 text-[#151512] shadow-[0_14px_40px_rgba(0,0,0,0.2)]"
            : "max-w-3xl rounded-2xl border border-[#2d2d28] bg-[#171715]/95 px-5 py-4 text-[#f4f1ea] shadow-[0_14px_40px_rgba(0,0,0,0.16)]"
        }
      >
        <p
          className={
            user
              ? "mb-2 flex items-center gap-2 text-xs font-medium text-[#57534b]"
              : "mb-2 flex items-center gap-2 text-xs font-medium text-[#aaa79e]"
          }
        >
          <Icon className="h-3.5 w-3.5" />
          {user ? "You" : "Codex"}
        </p>

        <p className="whitespace-pre-wrap text-sm leading-7">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}
