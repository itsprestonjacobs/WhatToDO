"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getSession, LocalSession } from "@/lib/localSessions";
import { Navbar } from "@/components/layout/Navbar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Spinner } from "@/components/ui/Spinner";

export default function ChatPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<LocalSession | null | undefined>(undefined);

  useEffect(() => {
    const s = getSession(sessionId);
    setSession(s);
  }, [sessionId]);

  if (session === undefined) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      </div>
    );
  }

  if (session === null) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-hidden max-w-2xl w-full mx-auto">
        <ChatInterface session={session} />
      </div>
    </div>
  );
}
