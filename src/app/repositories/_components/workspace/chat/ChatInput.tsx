"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, GitBranch, Mic, Square } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { Button } from "@/components/ui/button";

interface ChatInputProps {
  disabled?: boolean;
  loading: boolean;
  repositoryName: string;
  onSubmit: (question: string) => void;
}

const MIN_HEIGHT = 48;
const MAX_HEIGHT = 200;

export default function ChatInput({
  disabled = false,
  loading,
  repositoryName,
  onSubmit,
}: ChatInputProps) {
  const [question, setQuestion] = useState("");
  const [textareaHeight, setTextareaHeight] = useState(48);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (listening) setQuestion(transcript);
  }, [transcript, listening]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);

    e.target.style.height = "auto";

    const height = Math.min(e.target.scrollHeight, MAX_HEIGHT);

    e.target.style.height = `${height}px`;
    setTextareaHeight(height);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, MAX_HEIGHT);
    el.style.height = `${Math.max(nextHeight, MIN_HEIGHT)}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  }, [question]);

  function handleSubmit(e: FormEvent | React.KeyboardEvent) {
    e.preventDefault();

    if (listening) SpeechRecognition.stopListening();

    const value = question.trim();
    if (!value || loading || disabled) return;

    setQuestion("");
    resetTranscript();
    onSubmit(value);
  }

  return (
    <div className="bg-transparent px-15 pb-8 pt-4">
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="mb-2 flex items-center justify-between gap-3 px-1">
          <div className="flex min-w-0 items-center gap-2">
            <GitBranch className="h-3.5 w-3.5 shrink-0 text-[#77756e]" />
            <span className="truncate text-xs font-medium text-[#d9d5ca]">
              {repositoryName}
            </span>
          </div>
        </div>

        <motion.div
          className="flex min-h-12 items-center bg-[#191917] shadow-inner transition-[border-radius]"
          animate={{
            borderRadius: textareaHeight > 48 ? 20 : 9999,
          }}
        >
          <textarea
            ref={textareaRef}
            value={question}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            maxLength={2000}
            disabled={disabled}
            placeholder={
              listening
                ? "Listening…"
                : disabled
                  ? "Select a repository to ask about its code"
                  : "Ask about this repository"
            }
            rows={1}
            style={{
              maxHeight: MAX_HEIGHT,
              overflowY: textareaHeight >= MAX_HEIGHT ? "auto" : "hidden",
            }}
            className="min-h-12 flex-1 resize-none overflow-x-hidden bg-transparent px-4 py-3 text-sm leading-6 text-[#f4f1ea] outline-none placeholder:text-[#66645d] disabled:cursor-not-allowed [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#33332d] [&::-webkit-scrollbar-thumb]:hover:bg-[#464640] scrollbar-thin [scrollbar-color:#33332d_transparent]"
          />

          {/* mic */}
          {browserSupportsSpeechRecognition && (
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
              {listening && (
                <>
                  <motion.span
                    className="absolute inset-0 rounded-full bg-red-400/25"
                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full bg-red-400/25"
                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.7,
                    }}
                  />
                </>
              )}

              <Button
                type="button"
                onClick={toggleListening}
                disabled={disabled || loading}
                size="icon"
                variant="ghost"
                className={`relative z-10 h-8 w-8 rounded-full p-0 transition-colors ${listening
                    ? "bg-red-500/15 text-red-400 hover:bg-red-500/20"
                    : "text-[#77756e] hover:text-[#d9d5ca]"
                  }`}
              >
                {listening ? (
                  <Square className="h-3 w-3 fill-current" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {listening ? "Stop recording" : "Start recording"}
                </span>
              </Button>
            </div>
          )}

          <Button
            className="m-2 h-8 w-8 shrink-0 rounded-full p-0"
            disabled={disabled || loading || !question.trim()}
            size="icon"
            type="submit"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </motion.div>
      </form>
    </div>
  );
}