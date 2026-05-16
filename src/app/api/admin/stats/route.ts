import { NextRequest, NextResponse } from "next/server";
import { readEvents, computeStats } from "@/lib/analytics";
import { cookies } from "next/headers";

export const runtime = "nodejs";

async function isAuthed(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === adminPassword;
}

export async function GET(_req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = readEvents();
  const stats = computeStats(events);
  return NextResponse.json(stats);
}
