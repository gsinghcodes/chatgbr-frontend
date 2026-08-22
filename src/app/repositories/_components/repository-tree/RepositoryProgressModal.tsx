"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, X, GitBranch, FileSearch, Sparkles, PartyPopper, ArrowRight, RotateCcw } from "lucide-react";
import { useRepository } from "@/hooks/repositories/useRepository";

interface RepositoryProgressModalProps {
  repositoryId: string;
  onComplete: () => void;
  onRetry?: () => void;
}

const steps = [
  {
    status: "PENDING",
    label: "Preparing repository",
    description: "Setting up environment and configuration",
    progress: 0,
    icon: Sparkles,
  },
  {
    status: "CLONING",
    label: "Cloning repository",
    description: "Fetching source code and repository history",
    progress: 25,
    icon: GitBranch,
  },
  {
    status: "CHUNKING",
    label: "Indexing files",
    description: "Analyzing architecture and splitting code into chunks",
    progress: 50,
    icon: FileSearch,
  },
  {
    status: "EMBEDDING",
    label: "Generating embeddings",
    description: "Building vector search index for semantic code AI",
    progress: 75,
    icon: Sparkles,
  },
  {
    status: "READY",
    label: "Repository ready",
    description: "Indexing complete! Your workspace is fully set up",
    progress: 100,
    icon: PartyPopper,
  },
] as const;

export default function RepositoryProgressModal({
  repositoryId,
  onComplete,
  onRetry,
}: RepositoryProgressModalProps) {
  const { data, isError } = useRepository(repositoryId);

  const status = data?.data?.repository?.status;
  const isFailed = status === "FAILED" || isError;
  const isReady = status === "READY";

  const currentStepIndex = Math.max(
    0,
    steps.findIndex((step) => step.status === status),
  );
  const currentStep = steps[currentStepIndex] ?? steps[0];

  const [displayProgress, setDisplayProgress] = useState<number>(currentStep.progress);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (isFailed) return;

    const target = currentStep.progress;
    const start = displayProgress;
    const difference = target - start;

    if (difference <= 0) return;

    const duration = 500;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayProgress(start + difference * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [currentStep.progress, isFailed]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayProgress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#161614] px-8 py-9 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out ${
          mounted ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
        style={{
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 24px 48px -12px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Dynamic ambient glow background */}
        <div
          className={`pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-[90px] transition-all duration-700 ${
            isFailed
              ? "bg-red-500/20"
              : isReady
                ? "bg-emerald-500/20"
                : "bg-amber-100/10"
          }`}
        />

        <div className="relative flex flex-col items-center text-center">
          {/* Progress Ring with Outer Glow */}
          <div className="relative h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isFailed ? "#f87171" : "#f4f1ea"} />
                  <stop offset="100%" stopColor={isFailed ? "#dc2626" : "#b5a388"} />
                </linearGradient>
              </defs>

              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-white/[0.06]"
              />

              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-[stroke-dashoffset] duration-300 drop-shadow-[0_0_8px_rgba(244,241,234,0.3)]"
              />
            </svg>

            {/* Inner Ring Icon State */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isFailed ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                  <X className="h-6 w-6 text-red-400" />
                </div>
              ) : isReady ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                  <Check className="h-6 w-6 text-emerald-400" />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#f4f1ea]" />
                  <span className="mt-1.5 text-xs font-semibold tabular-nums tracking-wide text-[#a89f88]">
                    {Math.round(displayProgress)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Heading & Context Subtitle */}
          <h2 className="mt-6 text-xl font-semibold tracking-tight text-[#f4f1ea]">
            {isFailed
              ? "Indexing Failed"
              : isReady
                ? "Setup Complete"
                : currentStep.label}
          </h2>

          <p className="mt-1.5 text-xs leading-relaxed text-[#9e9786] max-w-[260px]">
            {isFailed
              ? "We couldn't finish indexing this repository. Please check permissions or try again."
              : currentStep.description}
          </p>

          {/* Step Timeline List */}
          {!isReady && !isFailed && (
            <div className="mt-8 w-full space-y-0.5 text-left">
              {steps.map((step, idx) => {
                const isDone = !isFailed && displayProgress > step.progress;
                const isCurrent = !isFailed && step.status === (status ?? "PENDING");
                const Icon = step.icon;

                return (
                  <div key={step.status} className="relative flex items-center gap-3.5 px-3 py-2 rounded-xl transition-colors duration-200">
                    {/* Vertical Connector Line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute left-[23px] top-[28px] h-5 w-[2px] transition-colors duration-300 ${
                          displayProgress > steps[idx + 1].progress
                            ? "bg-emerald-500/40"
                            : "bg-white/5"
                        }`}
                      />
                    )}

                    {/* Step Icon Indicator */}
                    <div
                      className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isDone
                          ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                          : isCurrent
                            ? "bg-[#f4f1ea] text-[#161614] shadow-[0_0_12px_rgba(244,241,234,0.4)]"
                            : "bg-white/5 text-[#5e5c54]"
                      }`}
                    >
                      {isDone ? (
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      ) : isCurrent ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin stroke-[2.5]" />
                      ) : (
                        <Icon className="h-3 w-3" />
                      )}
                    </div>

                    <span
                      className={`text-xs font-medium transition-colors duration-300 ${
                        isDone
                          ? "text-[#c9c5b8]"
                          : isCurrent
                            ? "text-[#f4f1ea] font-semibold"
                            : "text-[#5e5c54]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          {isReady && (
            <button
              onClick={onComplete}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f4f1ea] px-5 py-3 text-sm font-semibold text-[#161614] shadow-md transition-all duration-200 hover:bg-white active:scale-[0.98]"
            >
              Continue to Workspace
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {isFailed && (
            <div className="mt-8 flex w-full gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-[#f4f1ea] border border-white/10 transition-colors hover:bg-white/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Retry
                </button>
              )}
              <button
                onClick={onComplete}
                className="flex flex-1 items-center justify-center rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pop {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          60% {
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}