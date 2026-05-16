"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategorySelector } from "./CategorySelector";
import { createSession, addMessage } from "@/lib/localSessions";
import { ArrowRight } from "lucide-react";

const PLACEHOLDERS = [
  "I have two job offers and can't decide which to take...",
  "Should I break up with my partner of 3 years?",
  "I'm debating whether to start a side business...",
  "Should I move to a new city for a fresh start?",
  "I keep procrastinating on this one big project...",
];

export function StartInput() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % PLACEHOLDERS.length;
      setPlaceholder(PLACEHOLDERS[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);
    const session = createSession(category);
    addMessage(session.id, {
      role: "user",
      content: message.trim(),
      is_decision: false,
      created_at: new Date().toISOString(),
    });
    router.push(`/chat/${session.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <CategorySelector selected={category} onSelect={setCategory} />

      <div className="relative rounded-2xl border border-zinc-700 bg-zinc-900 focus-within:border-violet-500/60 transition-colors shadow-xl shadow-black/20">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => { setMessage(e.target.value); autoResize(); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none bg-transparent px-5 pt-4 pb-14 text-zinc-100 placeholder:text-zinc-600 text-base outline-none leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-xs text-zinc-600 hidden sm:block">⌘ + Enter</span>
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20 cursor-pointer"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>Tell me what to do <ArrowRight size={14} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
