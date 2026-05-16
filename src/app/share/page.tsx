"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { decodeSession, LocalSession } from "@/lib/localSessions";
import { Navbar } from "@/components/layout/Navbar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";

function ShareContent() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<LocalSession | null | undefined>(undefined);

  useEffect(() => {
    const d = searchParams.get("d");
    if (!d) { setSession(null); return; }
    setSession(decodeSession(d));
  }, [searchParams]);

  if (session === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <div className="space-y-3">
          <p className="text-zinc-400">This decision link is invalid or has expired.</p>
          <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm">
            Make a new decision →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-violet-950/40 border-b border-violet-800/30 px-4 py-2 text-center">
        <p className="text-xs text-zinc-400">
          Someone shared this decision with you.{" "}
          <Link href="/" className="text-violet-400 hover:text-violet-300 font-medium">
            Get your own →
          </Link>
        </p>
      </div>
      <div className="flex-1 overflow-hidden max-w-2xl w-full mx-auto">
        <ChatInterface session={session} readOnly />
      </div>
      <div className="border-t border-zinc-800 p-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20"
        >
          Get my own decision <ArrowRight size={14} />
        </Link>
      </div>
    </>
  );
}

export default function SharePage() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="text-zinc-500 text-sm">Loading...</div></div>}>
        <ShareContent />
      </Suspense>
    </div>
  );
}
