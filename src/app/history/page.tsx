import { Navbar } from "@/components/layout/Navbar";
import { HistoryList } from "./HistoryList";

export default function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">My Decisions</h1>
          <p className="text-zinc-500 text-sm mt-1">Every decision you&apos;ve made on this device</p>
        </div>
        <HistoryList />
      </main>
    </div>
  );
}
