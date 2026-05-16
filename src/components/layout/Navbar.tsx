import Link from "next/link";
import { Zap, History, Plus } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:bg-violet-500 transition-colors">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm text-zinc-100 tracking-tight">WhatToDo</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/history"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all"
          >
            <History size={13} />
            History
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-600/30 text-xs font-medium text-violet-400 hover:text-violet-300 transition-all"
          >
            <Plus size={13} />
            New
          </Link>
        </div>
      </div>
    </nav>
  );
}
