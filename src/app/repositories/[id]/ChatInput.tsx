"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Command, GitBranch } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ChatInputProps {
  disabled?: boolean;
  loading: boolean;
  repositoryName: string;
  onSubmit: (question: string) => void;
}

export default function ChatInput({
  disabled = false,
  loading,
  repositoryName,
  onSubmit,
}: ChatInputProps) {
  const [question, setQuestion] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const value = question.trim();

    if (!value || loading || disabled) {
      return;
    }

    setQuestion("");
    onSubmit(value);
  }

  return (
    <div className="border-t border-[#24241f] bg-[#141412]/95 px-5 py-4 backdrop-blur">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-2 flex items-center justify-between gap-3 px-1">
          <div className="flex min-w-0 items-center gap-2">
            <GitBranch className="h-3.5 w-3.5 shrink-0 text-[#77756e]" />

            <span className="truncate text-xs font-medium text-[#d9d5ca]">
              {repositoryName}
            </span>
          </div>

          <div className="hidden items-center gap-1 text-xs text-[#66645d] sm:flex">
            <Command className="h-3.5 w-3.5" />
            <span>Enter to send</span>
          </div>
        </div>

        <motion.div
          className="flex items-end rounded-2xl border border-[#33332d] bg-[#0d0d0b] shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition focus-within:border-[#646458] focus-within:shadow-[0_20px_70px_rgba(0,0,0,0.38)]"
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={disabled}
            placeholder={
              disabled
                ? "Select a repository to ask about its code"
                : "Ask about this repository"
            }
            rows={1}
            className="min-h-16 flex-1 resize-none bg-transparent px-5 py-5 text-sm leading-6 text-[#f4f1ea] outline-none placeholder:text-[#66645d] disabled:cursor-not-allowed"
          />

          <Button
            className="m-2 h-10 w-10 rounded-xl p-0"
            disabled={disabled || loading || !question.trim()}
            size="icon"
            type="submit"
          >
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">
              {loading ? "Working" : "Send"}
            </span>
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
