"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Lock } from "lucide-react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      setError("Invalid password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-600/30 mx-auto">
            <Lock size={20} className="text-violet-400" />
          </div>
          <h1 className="text-xl font-bold text-zinc-100">Admin Access</h1>
          <p className="text-sm text-zinc-500">Founder & owner dashboard</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/50 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-violet-500/60 outline-none text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-sm font-medium transition-all cursor-pointer"
            >
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
          <Zap size={11} />
          <span>WhatToDo Admin</span>
        </div>
      </div>
    </div>
  );
}
