import { Navbar } from "@/components/layout/Navbar";
import { StartInput } from "@/components/home/StartInput";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const EXAMPLES = [
  {
    q: "I have two job offers and can't decide",
    a: "TAKE the Stripe job. Higher growth ceiling, and you said stability matters less right now.",
    cat: "Career",
    catColor: "text-blue-400",
  },
  {
    q: "Should I break up with him?",
    a: "YES. You've said this three times now. Trust that feeling. Do it today.",
    cat: "Relationships",
    catColor: "text-rose-400",
  },
  {
    q: "Should I invest in crypto?",
    a: "NO. Put it in an index fund instead. Boring wins long-term.",
    cat: "Money",
    catColor: "text-emerald-400",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Gradient background orb */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-10 space-y-5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-semibold tracking-wide mb-1">
            <Zap size={11} />
            AI DECISIVENESS ENGINE
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-50 leading-[1.1]">
            Stop overthinking.
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-violet-600">
              Start doing.
            </span>
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-lg mx-auto">
            Describe what you&apos;re stuck on. The AI asks at most 2 questions,
            then gives you <strong className="text-zinc-200">one clear action</strong> — no hedging, no options list.
          </p>
        </div>

        {/* Input */}
        <StartInput />

        {/* How it works */}
        <div className="mt-14 flex items-center gap-6 text-xs text-zinc-600">
          {["Describe your situation", "AI asks 1–2 questions", "Get your decision"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              {i > 0 && <ArrowRight size={12} className="text-zinc-700" />}
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Example decisions */}
        <div className="mt-14 w-full max-w-2xl">
          <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest text-center mb-4">
            Example decisions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {EXAMPLES.map((ex) => (
              <div
                key={ex.q}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${ex.catColor}`}>{ex.cat}</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">&ldquo;{ex.q}&rdquo;</p>
                <div className="flex items-start gap-1.5 pt-1 border-t border-zinc-800">
                  <span className="text-violet-500 mt-0.5">▶</span>
                  <p className="text-xs font-semibold text-zinc-200 leading-relaxed">{ex.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-zinc-700">
          Your decisions stay on your device · No account needed ·{" "}
          <Link href="/history" className="hover:text-zinc-500 transition-colors">View history</Link>
        </div>
      </main>
    </div>
  );
}
