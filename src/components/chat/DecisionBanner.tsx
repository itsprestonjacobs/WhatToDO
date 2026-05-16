"use client";

import { Zap } from "lucide-react";

interface DecisionBannerProps {
  content: string;
  isStreaming?: boolean;
}

function renderDecision(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-extrabold text-white text-base">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function DecisionBanner({ content, isStreaming }: DecisionBannerProps) {
  return (
    <div className="fade-in-up relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-950/80 via-violet-900/20 to-zinc-900/80 border border-violet-500/40 rounded-2xl" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-violet-500/30 border border-violet-400/40 flex items-center justify-center">
            <Zap size={12} className="text-violet-300" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-violet-300">
            Your Decision
          </span>
        </div>

        {/* Decision text */}
        <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap space-y-1">
          {renderDecision(content)}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 cursor-blink" />
          )}
        </div>
      </div>
    </div>
  );
}
