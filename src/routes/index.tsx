import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Gamepad2, CircuitBoard, Code2, Bot, Mic, Network,
  GraduationCap, BookOpen, Sparkles, Shield, Rocket, Users, Award, Play, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconBox, DemoTag } from "@/components/vv/primitives";
import { PublicFooter, PublicHeader } from "@/components/vv/public-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VidyaVerse · A Universe of Learning" },
      { name: "description", content: "Futuristic, gamified learning platform for rural & underserved students across India." },
      { property: "og:title", content: "VidyaVerse · A Universe of Learning" },
      { property: "og:description", content: "Curriculum lessons, PlayLab, CircuitVerse, CodeVerse and offline Learning Mesh." },
    ],
  }),
  component: Landing,
});

function HeroCosmicArt() {
  return (
    <div className="relative flex aspect-square max-w-lg items-center justify-center mx-auto">
      {/* Outer Soft Lavender Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D8D5FF]/50 via-[#6541F5]/10 to-[#F4B942]/15 blur-3xl" />

      {/* Orbit Rings */}
      <svg viewBox="0 0 400 400" className="relative z-10 w-full h-full" aria-hidden="true">
        {/* Orbital ellipses */}
        <ellipse cx="200" cy="200" rx="170" ry="70" fill="none" stroke="#6541F5" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" transform="rotate(-25 200 200)" />
        <ellipse cx="200" cy="200" rx="140" ry="60" fill="none" stroke="#31B98A" strokeWidth="1.2" opacity="0.4" transform="rotate(35 200 200)" />
        <ellipse cx="200" cy="200" rx="185" ry="85" fill="none" stroke="#F4B942" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" transform="rotate(-65 200 200)" />

        {/* Core Center Planet / Sun */}
        <circle cx="200" cy="200" r="48" fill="#5230E8" stroke="#6541F5" strokeWidth="2" />
        <circle cx="200" cy="200" r="38" fill="url(#coreGradient)" />
        <circle cx="200" cy="200" r="16" fill="#FFFFFF" opacity="0.9" />

        {/* Orbiting Satellite Badges */}
        {/* 1. Circuit Module (Top Left) */}
        <g transform="translate(60, 90)">
          <rect width="80" height="48" rx="10" fill="#FFFFFF" stroke="#31B98A" strokeWidth="1.5" filter="drop-shadow(0px 2px 6px rgba(0,0,0,0.06))" />
          <text x="40" y="28" fill="#242438" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CircuitLab</text>
          <circle cx="40" cy="38" r="3" fill="#31B98A" />
        </g>

        {/* 2. Code Blocks (Top Right) */}
        <g transform="translate(260, 60)">
          <rect width="84" height="52" rx="10" fill="#FFFFFF" stroke="#6541F5" strokeWidth="1.5" filter="drop-shadow(0px 2px 6px rgba(0,0,0,0.06))" />
          <text x="42" y="26" fill="#242438" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CodeVerse</text>
          <text x="42" y="40" fill="#6541F5" fontSize="8" textAnchor="middle" fontFamily="monospace">step()</text>
        </g>

        {/* 3. PlayLab Ludo (Bottom Left) */}
        <g transform="translate(40, 240)">
          <rect width="86" height="50" rx="10" fill="#FFFFFF" stroke="#F4B942" strokeWidth="1.5" filter="drop-shadow(0px 2px 6px rgba(0,0,0,0.06))" />
          <text x="43" y="28" fill="#242438" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">PlayLab</text>
          <circle cx="43" cy="38" r="4" fill="#F4B942" />
        </g>

        {/* 4. Mesh Node (Bottom Right) */}
        <g transform="translate(260, 250)">
          <rect width="90" height="50" rx="10" fill="#FFFFFF" stroke="#6541F5" strokeWidth="1.5" filter="drop-shadow(0px 2px 6px rgba(0,0,0,0.06))" />
          <text x="45" y="26" fill="#242438" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Offline Mesh</text>
          <circle cx="45" cy="38" r="3" fill="#31B98A" />
        </g>

        <defs>
          <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6541F5" />
            <stop offset="60%" stopColor="#5230E8" />
            <stop offset="100%" stopColor="#D8D5FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />

      <main>
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D8D5FF] bg-[#D8D5FF]/35 px-3 py-1 text-xs font-semibold text-[#5230E8] dark:border-[#7C5CFA]/30 dark:bg-[#7C5CFA]/15 dark:text-[#D8D5FF]">
                <Sparkles className="h-3.5 w-3.5 text-[#6541F5]" />
                <span>Next-Gen Educational Universe for Rural India</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                A Universe of <span className="text-[#6541F5] dark:text-[#7C5CFA]">Learning.</span>
              </h1>

              <p className="max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
                Futuristic, gamified STEM & curriculum platform built specifically for government schools and rural learners. Run virtual electronics, computational thinking, and games—even with zero internet.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold px-6 shadow-sm shadow-[#6541F5]/25"
                >
                  <Link to="/dashboard">
                    Launch Student Explorer <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-border bg-card text-foreground hover:bg-[#F4F2FF] hover:border-[#6541F5]/40"
                >
                  <Link to="/learn">Curriculum Library</Link>
                </Button>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-[#31B98A]" /> 100% Offline Mesh</span>
                <span className="flex items-center gap-1.5"><Rocket className="h-4 w-4 text-[#6541F5]" /> Hackathon Build</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#F4B942]" /> Multilingual EN/HI/KN</span>
              </div>
            </div>

            <HeroCosmicArt />
          </div>
        </section>

        {/* 2. Interactive Feature Matrix (PlayLab, CircuitVerse, CodeVerse, AI Tutor) */}
        <section className="border-y border-border bg-[#F4F2FF]/40 dark:bg-card/40 py-16">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6541F5] dark:text-[#7C5CFA]">Hands-On Discovery</span>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl mt-1">
                Beyond Boring Textbooks: Three Creative Labs
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Every module bridges conceptual curriculum theory with real physical or simulated experimentation.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* PlayLab */}
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-[#6541F5]/50 hover:shadow-md transition-all shadow-sm">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-[#F4B942]/15 border border-[#F4B942]/30 flex items-center justify-center text-[#F4B942] mb-4">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">PlayLab Games</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Math Ludo, CodeBot Maze, Newton's Race and Bharat Explorer. Designed for zero-screen paper boards or interactive digital screens.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button asChild variant="outline" size="sm" className="w-full border-border text-[#6541F5] hover:bg-[#F4F2FF] text-xs font-semibold">
                    <Link to="/playlab">Play Games →</Link>
                  </Button>
                </div>
              </div>

              {/* CircuitVerse */}
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-[#6541F5]/50 hover:shadow-md transition-all shadow-sm">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-[#31B98A]/15 border border-[#31B98A]/30 flex items-center justify-center text-[#31B98A] mb-4">
                    <CircuitBoard className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">CircuitVerse</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Interactive virtual breadboard simulating batteries, switches, resistors, and LEDs with real Ohm's Law physics and burnout prevention.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button asChild variant="outline" size="sm" className="w-full border-border text-[#31B98A] hover:bg-[#31B98A]/10 text-xs font-semibold">
                    <Link to="/circuitverse">Wire Virtual Circuit →</Link>
                  </Button>
                </div>
              </div>

              {/* CodeVerse */}
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-[#6541F5]/50 hover:shadow-md transition-all shadow-sm">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-[#D8D5FF]/40 border border-[#D8D5FF] flex items-center justify-center text-[#6541F5] mb-4">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">CodeVerse</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Visual block coding with loops, conditionals, and simulated maze pathfinding that maps directly to Python and Arduino C++.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button asChild variant="outline" size="sm" className="w-full border-border text-[#6541F5] hover:bg-[#F4F2FF] text-xs font-semibold">
                    <Link to="/codeverse">Build Algorithms →</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Learning Mesh Architecture Section */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#31B98A]">Engineered for Rural Schools</span>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl mt-1">
                  How Learning Mesh Eliminates Data Costs
                </h2>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  Traditional edtech requires 4G connection which rural schools often lack. VidyaVerse uses a low-power micro-hub to broadcast an offline Wi-Fi bubble. Students stream video lectures and take quizzes with zero cellular bills.
                </p>

                <div className="mt-6 space-y-3 text-xs">
                  <div className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-[#31B98A] shrink-0" />
                    <span>Local NVMe storage holds 400+ curriculum lessons & voice guides</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-[#31B98A] shrink-0" />
                    <span>Cryptographic timestamps ensure offline quizzes sync fairly</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-[#31B98A] shrink-0" />
                    <span>Runs on solar battery backup during village power outages</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <Button asChild className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs shadow-sm">
                    <Link to="/mesh">Inspect Mesh Network Architecture</Link>
                  </Button>
                </div>
              </div>

              {/* Graphic card preview */}
              <div className="rounded-2xl border border-border bg-[#F5F5FF] dark:bg-[#12121A] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-bold text-xs text-foreground">Kalyan Village Micro-Hub</span>
                  <span className="h-2 w-2 rounded-full bg-[#31B98A] animate-ping" />
                </div>
                <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-xs shadow-sm">
                  <div>
                    <span className="font-bold text-[#6541F5] dark:text-[#7C5CFA] block">24 Students Streaming Video</span>
                    <span className="text-[10px] text-muted-foreground">Zero Internet Bandwidth Consumed</span>
                  </div>
                  <Badge className="bg-[#31B98A]/15 text-[#31B98A] border-[#31B98A]/30 text-[10px]">100% Free</Badge>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-xs shadow-sm">
                  <div>
                    <span className="font-bold text-[#F4B942] block">Offline XP Sync Queue</span>
                    <span className="text-[10px] text-muted-foreground">Reconciles automatically near teacher hub</span>
                  </div>
                  <Badge className="bg-[#F4B942]/15 text-[#F4B942] border-[#F4B942]/30 text-[10px]">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
