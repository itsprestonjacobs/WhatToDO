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

// Dynamically load fs only in Node.js environments (local dev).
// On Cloudflare Workers / edge, this silently does nothing.
function getFs() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("fs") as typeof import("fs");
  } catch {
    return null;
  }
}

function getPath() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path") as typeof import("path");
    return path.join(process.cwd(), "data", "analytics.jsonl");
  } catch {
    return null;
  }
}

export function logEvent(event: AnalyticsEvent): void {
  try {
    const fs = getFs();
    const logFile = getPath();
    if (!fs || !logFile) return;
    const dir = logFile.replace(/\/[^/]+$/, "");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(logFile, JSON.stringify(event) + "\n", "utf8");
  } catch {
    // Non-critical — never crash the app over logging
  }
}

export function readEvents(): AnalyticsEvent[] {
  try {
    const fs = getFs();
    const logFile = getPath();
    if (!fs || !logFile || !fs.existsSync(logFile)) return [];
    const lines = fs.readFileSync(logFile, "utf8").trim().split("\n").filter(Boolean);
    return lines.map((l) => JSON.parse(l) as AnalyticsEvent);
  } catch {
    return [];
  }
}

export function computeStats(events: AnalyticsEvent[]) {
  const totalSessions = events.length;
  const totalDecisions = events.filter((e) => e.isDecision).length;
  const decisionRate = totalSessions > 0 ? Math.round((totalDecisions / totalSessions) * 100) : 0;
  const avgMessages =
    totalSessions > 0
      ? Math.round((events.reduce((s, e) => s + e.msgs, 0) / totalSessions) * 10) / 10
      : 0;

  const categoryCounts: Record<string, number> = {};
  for (const e of events) {
    const cat = e.cat ?? "general";
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
  }

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

  return { totalSessions, totalDecisions, decisionRate, avgMessages, categoryCounts, daily: Object.values(daily), recent };
}
