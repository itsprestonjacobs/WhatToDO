"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LocalSession, LocalMessage, addMessage, encodeSession } from "@/lib/localSessions";
import { DecisionBanner } from "./DecisionBanner";
import { getCategoryById } from "@/lib/categories";
import { Briefcase, Heart, DollarSign, Activity, Compass, ArrowRight, Share2, Check, Zap } from "lucide-react";
import toast from "react-hot-toast";

const ICONS = { Briefcase, Heart, DollarSign, Activity, Compass };

interface ChatInterfaceProps {
  session: LocalSession;
  readOnly?: boolean;
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end fade-in-up">
      <div className="max-w-[80%] bg-zinc-800 border border-zinc-700 rounded-2xl rounded-tr-sm px-4 py-3 text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}

function AIMessage({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  const isDecision = /^\*\*[A-Z]/.test(content.trim());
  if (isDecision) {
    return <DecisionBanner content={content} isStreaming={isStreaming} />;
  }
  return (
    <div className="flex gap-3 fade-in-up">
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-600/30 flex items-center justify-center mt-0.5">
        <Zap size={12} className="text-violet-400" />
      </div>
      <p className="flex-1 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
        {content}
        {isStreaming && <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 cursor-blink" />}
      </p>
    </div>
  );
}

export function ChatInterface({ session: initialSession, readOnly = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<LocalMessage[]>(initialSession.messages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionRef = useRef(initialSession);

  const category = getCategoryById(initialSession.category);
  const Icon = category ? ICONS[category.icon as keyof typeof ICONS] : null;
  const hasDecision = messages.some((m) => m.is_decision);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const sendToAI = useCallback(async (history: LocalMessage[]) => {
    setStreaming(true);
    setStreamingContent("");

    const apiMessages = history.map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, category: sessionRef.current.category }),
      });

      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setStreamingContent(full);
      }

      const isDecision = /^\*\*[A-Z]/.test(full.trim());
      const msg: LocalMessage = {
        role: "assistant",
        content: full,
        is_decision: isDecision,
        created_at: new Date().toISOString(),
      };

      addMessage(sessionRef.current.id, msg);
      setMessages((prev) => [...prev, msg]);
      setStreamingContent("");
    } catch {
      setStreamingContent("");
      toast.error("Failed to get response");
    } finally {
      setStreaming(false);
    }
  }, []);

  // Auto-trigger first AI response on mount
  useEffect(() => {
    const hasAssistant = messages.some((m) => m.role === "assistant");
    if (!hasAssistant && messages.length >= 1 && !streaming && !readOnly) {
      sendToAI(messages);
    }
  }, []);

  const handleSend = () => {
    if (!input.trim() || streaming || readOnly) return;
    const msg: LocalMessage = {
      role: "user",
      content: input.trim(),
      is_decision: false,
      created_at: new Date().toISOString(),
    };
    addMessage(sessionRef.current.id, msg);
    const updated = [...messages, msg];
    setMessages(updated);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    sendToAI(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  const handleShare = async () => {
    const sessionSnapshot = { ...sessionRef.current, messages };
    const encoded = encodeSession(sessionSnapshot);
    const url = `${window.location.origin}/share?d=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          {category && Icon ? (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${category.bgColor} ${category.color}`}>
              <Icon size={11} />
              {category.label}
            </span>
          ) : (
            <span className="text-xs text-zinc-500">General</span>
          )}
        </div>
        {!readOnly && hasDecision && (
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-all cursor-pointer"
          >
            {copied ? <><Check size={12} className="text-green-400" /> Copied!</> : <><Share2 size={12} /> Share</>}
          </button>
        )}
        {readOnly && <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-1 rounded">Read-only</span>}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <UserMessage key={i} content={msg.content} />
          ) : (
            <div key={i} className="fade-in-up">
              <AIMessage content={msg.content} />
            </div>
          )
        )}

        {streaming && streamingContent && (
          <div className="fade-in-up">
            <AIMessage content={streamingContent} isStreaming />
          </div>
        )}

        {streaming && !streamingContent && (
          <div className="flex gap-3 fade-in-up">
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
              <svg className="animate-spin w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-500">Thinking...</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!readOnly && (
        <div className="border-t border-zinc-800/60 p-4">
          <div className="relative rounded-xl border border-zinc-700 bg-zinc-900 focus-within:border-violet-500/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder="Reply..."
              rows={1}
              disabled={streaming}
              className="w-full resize-none bg-transparent px-4 pt-3 pb-10 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none leading-relaxed disabled:opacity-50"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
              <span className="text-xs text-zinc-700 hidden sm:block">⌘↵</span>
              <button
                onClick={handleSend}
                disabled={!input.trim() || streaming}
                className="w-7 h-7 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
