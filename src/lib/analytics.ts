import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "data", "analytics.jsonl");

export interface AnalyticsEvent {
  t: string;
  cat: string | null;
  msgs: number;
  isDecision: boolean;
}

export interface DailyCount {
  date: string;
  sessions: number;
  decisions: number;
}

export function logEvent(event: AnalyticsEvent): void {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(event) + "\n", "utf8");
  } catch {
    // Non-critical — don't crash the chat if logging fails
  }
}

export function readEvents(): AnalyticsEvent[] {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];
    const lines = fs.readFileSync(LOG_FILE, "utf8").trim().split("\n").filter(Boolean);
    return lines.map((l) => JSON.parse(l) as AnalyticsEvent);
  } catch {
    return [];
  }
}

export function computeStats(events: AnalyticsEvent[]) {
  const totalSessions = events.length;
  const totalDecisions = events.filter((e) => e.isDecision).length;
  const decisionRate = totalSessions > 0 ? Math.round((totalDecisions / totalSessions) * 100) : 0;
  const avgMessages = totalSessions > 0
    ? Math.round((events.reduce((s, e) => s + e.msgs, 0) / totalSessions) * 10) / 10
    : 0;

  const categoryCounts: Record<string, number> = {};
  for (const e of events) {
    const cat = e.cat ?? "general";
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
  }

  // Last 7 days
  const daily: Record<string, DailyCount> = {};
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    daily[key] = { date: key, sessions: 0, decisions: 0 };
  }
  for (const e of events) {
    const day = e.t.slice(0, 10);
    if (daily[day]) {
      daily[day].sessions++;
      if (e.isDecision) daily[day].decisions++;
    }
  }

  const recent = events.slice(-20).reverse();

  return {
    totalSessions,
    totalDecisions,
    decisionRate,
    avgMessages,
    categoryCounts,
    daily: Object.values(daily),
    recent,
  };
}
