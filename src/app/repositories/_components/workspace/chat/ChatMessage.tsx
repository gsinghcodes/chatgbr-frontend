"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Check, ChevronDown, Copy, Sparkles, User } from "lucide-react";
import Markdown from "react-markdown";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
    reasoning?: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const user = message.role === "user";

  const hasReasoning = Boolean(message.reasoning);
  const isThinking = hasReasoning && !message.content;

  const [expanded, setExpanded] = useState(true);
  const [userToggled, setUserToggled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userToggled && message.content) {
      setExpanded(false);
    }
  }, [message.content, userToggled]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      className={user ? "flex justify-end gap-3" : "flex justify-start gap-3"}
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >

      <div
        className={
          user
            ? "group relative min-w-0 max-w-2xl rounded-lg bg-[#ece6d8] px-3 py-2 text-[#151512]"
            : "group relative min-w-0 max-w-3xl rounded-lg bg-[#171715] px-3 py-2 text-[#f4f1ea]"
        }
      >
        {hasReasoning && (
          <div className="relative mb-3 overflow-hidden rounded-lg bg-[#131311]">
            {/* trace rail — pulses while the model is actively reasoning */}
            <motion.div
              animate={
                isThinking
                  ? { opacity: [0.3, 1, 0.3] }
                  : { opacity: 0.5 }
              }
              className="absolute bottom-0 left-0 top-0 w-1 bg-linear-to-b from-[#4cc95f] via-[#4cc95f]/40 to-transparent"
              transition={
                isThinking
                  ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
            />

            <button
              className="flex w-full items-center justify-between gap-2 py-2 pl-4 pr-3 text-left"
              onClick={() => {
                setUserToggled(true);
                setExpanded((prev) => !prev);
              }}
              type="button"
            >
              <span className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-wide text-[#aaa79e]">
                {isThinking ? "Thinking" : "Thought process"}
                {isThinking && (
                  <span className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        className="h-1 w-1 rounded-full bg-[#4cc95f]"
                        key={i}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </span>
                )}
              </span>

              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-[#8c8a82] transition-transform duration-200 ${expanded ? "rotate-180" : ""
                  }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div className="max-h-64 scrollbar-none overflow-y-auto whitespace-pre-wrap py-3 pl-4 pr-3 font-mono text-xs leading-6 text-[#8c8a82]">
                    {message.reasoning}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {message.content && (
          <div className="prose-invert-custom custom-scrollbar text-sm overflow-x-scroll leading-7">
            <Markdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 whitespace-pre-wrap last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className={user ? "font-semibold text-[#151512]" : "font-semibold text-[#f4f1ea]"}>
                    {children}
                  </strong>
                ),
                a: ({ children, href }) => (
                  <a
                    className="text-[#4cc95f] underline decoration-[#c9a44c]/40 underline-offset-2 hover:decoration-[#4cc95f]"
                    href={href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="mb-3 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-3 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>
                ),
                h1: ({ children }) => (
                  <h1 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-2 mt-4 text-[15px] font-semibold first:mt-0">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-2 mt-3 text-sm font-semibold first:mt-0">{children}</h3>
                ),
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (match) {
                    return (
                      <div className="my-3 overflow-hidden rounded-lg border border-[#2d2d28] bg-[#0d0d0b]">
                        <div className="flex items-center justify-between border-b border-[#2d2d28] bg-[#131311] px-3 py-1.5">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a82]">
                            {match[1]}
                          </span>
                        </div>
                        <pre className="overflow-x-auto px-4 py-3">
                          <code
                            className="font-mono text-[13px] leading-6 text-[#e8e5db]"
                            {...props}
                          >
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <code
                      className={
                        user
                          ? `
                            rounded-md
                            bg-[#cfcfbe]
                            px-1.5
                            py-0.5
                            font-mono
                            text-[13px]
                            text-[#263027]
                          `
                          : `
                            rounded-md
                            bg-[#202920]
                            px-1.5
                            py-0.5
                            font-mono
                            text-[13px]
                            text-[#91bfa0]
                          `
                      }
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </Markdown>
          </div>
        )}

        {!user && message.content && (
          <button
            aria-label="Copy message"
            className="absolute -right-5 -top-5 rounded-md border border-transparent p-1.5 text-[#8c8a82] opacity-0 transition-all duration-150 hover:text-[#f4f1ea] focus-visible:opacity-100 group-hover:opacity-100"
            onClick={handleCopy}
            type="button"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-[#c9a44c]" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

    </motion.div>
  );
}