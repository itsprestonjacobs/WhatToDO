"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LocalSession, getAllSessions, deleteSession } from "@/lib/localSessions";
import { getCategoryById } from "@/lib/categories";
import { Briefcase, Heart, DollarSign, Activity, Compass, ChevronRight, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ICONS = { Briefcase, Heart, DollarSign, Activity, Compass };

export function HistoryList() {
  const [sessions, setSessions] = useState<LocalSession[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSessions(getAllSessions());
    setMounted(true);
  }, []);

  const handleDelete = (sessionId: string) => {
    deleteSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success("Decision deleted");
  };

  if (!mounted) return null;

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-zinc-500 text-lg">No decisions yet.</p>
        <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm">
          Make your first one →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const category = getCategoryById(session.category);
        const Icon = category ? ICONS[category.icon as keyof typeof ICONS] : null;
        const firstUserMsg = session.messages.find((m) => m.role === "user");
        const decisionMsg = session.messages.find((m) => m.is_decision);
        const date = new Date(session.created_at).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        });

        return (
          <div
            key={session.id}
            className="group relative rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all"
          >
            <Link href={`/chat/${session.id}`} className="block p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    {category && Icon && (
                      <span className={`flex items-center gap-1 text-xs font-medium ${category.color}`}>
                        <Icon size={10} />
                        {category.label}
                      </span>
                    )}
                    <span className="text-xs text-zinc-600">{date}</span>
                  </div>
                  {firstUserMsg && (
                    <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed pr-8">
                      {firstUserMsg.content}
                    </p>
                  )}
                  {decisionMsg && (
                    <p className="text-xs text-violet-400 font-medium line-clamp-1">
                      {decisionMsg.content.replace(/\*\*/g, "").split("\n")[0]}
                    </p>
                  )}
                </div>
                <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 mt-0.5 transition-colors" />
              </div>
            </Link>
            <button
              onClick={() => handleDelete(session.id)}
              className="absolute top-3 right-8 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-900/30 text-zinc-600 hover:text-red-400 transition-all cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
