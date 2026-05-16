import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";

async function isAuthed(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === adminPassword;
}

export default async function AdminPage() {
  if (!process.env.ADMIN_PASSWORD) {
    redirect("/");
  }

  const authed = await isAuthed();

  return (
    <div className="min-h-screen bg-zinc-950">
      {authed ? <AdminDashboard /> : <AdminLogin />}
    </div>
  );
}
