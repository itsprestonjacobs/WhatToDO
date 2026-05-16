"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap, TrendingUp, MessageSquare, CheckCircle2,
  BarChart2, LogOut, RefreshCw, Clock, Activity,
  Briefcase, Heart, DollarSign, Compass,
} from "lucide-react";
import type { DailyCount, AnalyticsEvent } from "@/lib/analytics";
import { CATEGORIES } from "@/lib/categories";

interface Stats {
  totalSessions: number;
  totalDecisions: number;
  decisionRate: number;
  avgMessages: number;
  categoryCounts: Record<string, number>;
  daily: DailyCount[];
  recent: AnalyticsEvent[];
}

const CAT_ICONS: Record<string, React.ElementType> = {
  career: Briefcase,
  relationships: Heart,
  money: DollarSign,
  health: Activity,
  life: Compass,
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={15} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-zinc-100 tabular-nums">{value}</p>
        {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function DailyChart({ daily }: { daily: DailyCount[] }) {
  const maxSessions = Math.max(...daily.map((d) => d.sessions), 1);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {daily.map((d) => {
        const pct = d.sessions / maxSessions;
        const label = new Date(d.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full flex flex-col justify-end h-16">
              <div
                className="w-full rounded-t bg-violet-600/60 group-hover:bg-violet-500/80 transition-all relative"
                style={{ height: `${Math.max(pct * 100, 4)}%` }}
              >
                {d.sessions > 0 && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {d.sessions}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10px] text-zinc-600">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/stats");
    if (res.ok) {
      setStats(await res.json());
      setLastRefresh(new Date());
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  };

  const catTotal = stats ? Object.values(stats.categoryCounts).reduce((s, v) => s + v, 0) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm text-zinc-100">WhatToDo</span>
            <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-600 hidden sm:flex items-center gap-1">
              <Clock size={11} />
              {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              onClick={load}
              disabled={loading}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Hero row */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Real-time usage analytics for WhatToDo</p>
        </div>

        {loading && !stats ? (
          <div className="flex items-center justify-center py-32">
            <RefreshCw size={24} className="animate-spin text-violet-400" />
          </div>
        ) : stats ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Sessions"
                value={stats.totalSessions.toLocaleString()}
                sub="All-time conversations"
                icon={MessageSquare}
                color="bg-blue-500/10 text-blue-400"
              />
              <StatCard
                label="Decisions Made"
                value={stats.totalDecisions.toLocaleString()}
                sub="Times AI gave a verdict"
                icon={CheckCircle2}
                color="bg-violet-500/10 text-violet-400"
              />
              <StatCard
                label="Decision Rate"
                value={`${stats.decisionRate}%`}
                sub="Sessions with a clear answer"
                icon={TrendingUp}
                color="bg-emerald-500/10 text-emerald-400"
              />
              <StatCard
                label="Avg Messages"
                value={stats.avgMessages}
                sub="Per conversation"
                icon={BarChart2}
                color="bg-orange-500/10 text-orange-400"
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 7-day activity */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-100">7-Day Activity</h2>
                  <p className="text-xs text-zinc-500">Sessions per day</p>
                </div>
                <DailyChart daily={stats.daily} />
              </div>

              {/* Category breakdown */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-100">Categories</h2>
                  <p className="text-xs text-zinc-500">What people are deciding</p>
                </div>
                <div className="space-y-3">
                  {[...CATEGORIES, { id: "general", label: "General", color: "text-zinc-400" }].map((cat) => {
                    const count = stats.categoryCounts[cat.id] ?? 0;
                    const pct = catTotal > 0 ? Math.round((count / catTotal) * 100) : 0;
                    const Icon = CAT_ICONS[cat.id];
                    return (
                      <div key={cat.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`flex items-center gap-1.5 font-medium ${cat.color}`}>
                            {Icon && <Icon size={11} />}
                            {cat.label}
                          </span>
                          <span className="text-zinc-500">{count} · {pct}%</span>
                        </div>
                        <MiniBar
                          value={count}
                          max={catTotal}
                          color={
                            cat.id === "career" ? "bg-blue-500" :
                            cat.id === "relationships" ? "bg-rose-500" :
                            cat.id === "money" ? "bg-emerald-500" :
                            cat.id === "health" ? "bg-orange-500" :
                            cat.id === "life" ? "bg-violet-500" :
                            "bg-zinc-500"
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-zinc-100">Recent Activity</h2>
              {stats.recent.length === 0 ? (
                <p className="text-sm text-zinc-600 py-4 text-center">No activity yet. Start a conversation on the main app.</p>
              ) : (
                <div className="space-y-0 divide-y divide-zinc-800/60">
                  {stats.recent.map((e, i) => {
                    const cat = CATEGORIES.find((c) => c.id === e.cat);
                    const Icon = e.cat ? CAT_ICONS[e.cat] : null;
                    return (
                      <div key={i} className="flex items-center gap-4 py-3">
                        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                          e.isDecision ? "bg-violet-500/10 border border-violet-500/20" : "bg-zinc-800"
                        }`}>
                          {e.isDecision ? (
                            <CheckCircle2 size={13} className="text-violet-400" />
                          ) : Icon ? (
                            <Icon size={13} className={cat?.color ?? "text-zinc-500"} />
                          ) : (
                            <MessageSquare size={13} className="text-zinc-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-300">
                            {e.isDecision ? "Decision delivered" : "Follow-up message"}
                            {cat && <span className={`ml-2 text-xs ${cat.color}`}>· {cat.label}</span>}
                          </p>
                          <p className="text-xs text-zinc-600">{e.msgs} messages in conversation</p>
                        </div>
                        <time className="text-xs text-zinc-600 whitespace-nowrap">
                          {new Date(e.t).toLocaleString("en-US", {
                            month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                          })}
                        </time>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-zinc-500">Failed to load stats</div>
        )}
      </main>
    </div>
  );
}
