"use client";

export interface LocalMessage {
  role: "user" | "assistant";
  content: string;
  is_decision: boolean;
  created_at: string;
}

export interface LocalSession {
  id: string;
  category: string | null;
  created_at: string;
  messages: LocalMessage[];
}

const STORAGE_KEY = "whattodo_sessions";

function getSessions(): Record<string, LocalSession> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveSessions(sessions: Record<string, LocalSession>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function createSession(category: string | null): LocalSession {
  const session: LocalSession = {
    id: crypto.randomUUID(),
    category,
    created_at: new Date().toISOString(),
    messages: [],
  };
  const all = getSessions();
  all[session.id] = session;
  saveSessions(all);
  return session;
}

export function getSession(id: string): LocalSession | null {
  return getSessions()[id] ?? null;
}

export function getAllSessions(): LocalSession[] {
  return Object.values(getSessions()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function addMessage(sessionId: string, message: LocalMessage): void {
  const all = getSessions();
  if (!all[sessionId]) return;
  all[sessionId].messages.push(message);
  saveSessions(all);
}

export function deleteSession(id: string): void {
  const all = getSessions();
  delete all[id];
  saveSessions(all);
}

export function encodeSession(session: LocalSession): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(session))));
}

export function decodeSession(encoded: string): LocalSession | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch {
    return null;
  }
}
