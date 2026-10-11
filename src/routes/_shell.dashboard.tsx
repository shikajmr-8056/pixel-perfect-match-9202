import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight, Flame, Sparkles, Trophy, Target, Gamepad2, CircuitBoard, Code2,
  Bot, Network, Download, Award, Play, CheckCircle2, TrendingUp, BarChart3,
  BookOpen
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoTag, IconBox, Meter, Panel, NetworkTag } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { achievements, demoStudent, leaderboardDemo, learningPacks, lessons } from "@/data/demo";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Student dashboard · VidyaVerse" },
      { name: "description", content: "Continue learning, today's mission, recommended lessons and progress." },
    ],
  }),
  component: Dashboard,
});

const weeklyActivityData = [
  { day: "Mon", minutes: 35, xp: 85 },
  { day: "Tue", minutes: 45, xp: 110 },
  { day: "Wed", minutes: 25, xp: 60 },
  { day: "Thu", minutes: 55, xp: 140 },
  { day: "Fri", minutes: 40, xp: 95 },
  { day: "Sat", minutes: 60, xp: 160 },
  { day: "Sun", minutes: 30, xp: 75 },
];

const subjectDistribution = [
  { subject: "Mathematics", pct: 38, count: "6 lessons", color: "#42A5E8", bg: "#DDF2FC" },
  { subject: "Science", pct: 32, count: "5 lessons", color: "#19B99A", bg: "#DDF8EE" },
  { subject: "Computing", pct: 18, count: "3 lessons", color: "#6541F5", bg: "#EAE7FF" },
  { subject: "Social Science", pct: 12, count: "2 lessons", color: "#F5A623", bg: "#FFF0D5" },
];

function getSubjectBadge(subject: string) {
  switch (subject) {
    case "Mathematics":
      return { text: "#42A5E8", bg: "#DDF2FC", border: "#42A5E840" };
    case "Science":
      return { text: "#19B99A", bg: "#DDF8EE", border: "#19B99A40" };
    case "Social Science":
      return { text: "#F5A623", bg: "#FFF0D5", border: "#F5A62340" };
    case "Computing":
      return { text: "#6541F5", bg: "#EAE7FF", border: "#6541F540" };
    case "English":
      return { text: "#E95778", bg: "#FCE5EB", border: "#E9577840" };
    default:
      return { text: "#6541F5", bg: "#EAE7FF", border: "#6541F540" };
  }
}

function Dashboard() {
  const d = useDemo();
  const [missionDone, setMissionDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lesson progress
  const firstLesson = lessons[0];
  const chapter = firstLesson ? lessons.filter((l) => l.chapter === firstLesson.chapter) : [];
  const next = chapter.find((l) => !d.completed.includes(l.id)) ?? lessons.find((l) => !d.completed.includes(l.id)) ?? firstLesson ?? lessons[0]!;
  const doneCount = chapter.filter((l) => d.completed.includes(l.id)).length;
  const chapterPct = chapter.length > 0 ? Math.round((doneCount / chapter.length) * 100) : 0;

  const recommended = lessons.filter((l) => !d.completed.includes(l.id) && l.id !== next.id).slice(0, 4);
  const board = [...leaderboardDemo, { name: `You (${demoStudent.name})`, weekly: d.weeklyXp }].sort((a, b) => b.weekly - a.weekly);
  const savedPacks = learningPacks.filter((p) => d.downloads[p.id] === "saved");

  const handleCompleteMission = () => {
    if (!missionDone) {
      setMissionDone(true);
      d.addXp(50, "Completed Daily Mission: Fractions Practice");
      d.unlock("quiz-ace");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Profile & Welcome */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <DemoTag>DEMO PROFILE</DemoTag>
            <span className="text-xs font-medium text-muted-foreground">Class 7B · Kalyan School</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {demoStudent.name}!
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-[#6541F5]/30 bg-[#EAE7FF]/50 text-[#5230E8] text-xs py-1 px-3">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-[#6541F5]" /> Term 2 Active Explorer
          </Badge>
        </div>
      </div>

      {/* 2. Five Colorful Analytics Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* Metric 1: XP (Purple) */}
        <div className="card-surface p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total XP</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAE7FF] text-[#6541F5] dark:bg-[#6541F5]/20 dark:text-[#7C5CFA]">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-foreground">{d.xp.toLocaleString("en-IN")}</div>
            <div className="mt-1 flex items-center text-[11px] font-semibold text-[#6541F5] dark:text-[#7C5CFA]">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +120 this week
            </div>
          </div>
        </div>

        {/* Metric 2: Mastery Level (Blue) */}
        <div className="card-surface p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Mastery Level</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DDF2FC] text-[#42A5E8] dark:bg-[#42A5E8]/20 dark:text-[#42A5E8]">
              <Trophy className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-foreground">Level {d.level}</div>
            <div className="mt-1 text-[11px] font-medium text-[#42A5E8]">
              Next level in 90 XP
            </div>
          </div>
        </div>

        {/* Metric 3: Study Streak (Pink) */}
        <div className="card-surface p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Daily Streak</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FCE5EB] text-[#E95778] dark:bg-[#E95778]/20 dark:text-[#E95778]">
              <Flame className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-foreground">{demoStudent.streakDays} Days</div>
            <div className="mt-1 text-[11px] font-semibold text-[#E95778]">
              Active today 🔥
            </div>
          </div>
        </div>

        {/* Metric 4: Quiz Accuracy (Teal) */}
        <div className="card-surface p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Quiz Accuracy</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DDF8EE] text-[#19B99A] dark:bg-[#19B99A]/20 dark:text-[#19B99A]">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-foreground">92%</div>
            <div className="mt-1 text-[11px] font-medium text-[#19B99A]">
              +4% improvement
            </div>
          </div>
        </div>

        {/* Metric 5: Daily Mission (Orange) */}
        <div className="card-surface p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Daily Mission</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0D5] text-[#F5A623] dark:bg-[#F5A623]/20 dark:text-[#F5A623]">
              <Target className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-foreground">{missionDone ? "100%" : "25%"}</div>
            <div className="mt-1 text-[11px] font-semibold text-[#F5A623]">
              {missionDone ? "Completed ✓" : "+50 XP Reward"}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Continue Learning Featured Card + Daily Mission Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Continue Learning Featured Card - Deep Purple Gradient */}
        <section
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5230E8] to-[#6541F5] text-white p-6 lg:col-span-2 md:p-8 shadow-md border border-[#5230E8] shadow-[#6541F5]/10"
          aria-labelledby="continue-heading"
        >
          {/* Subtle decorative orbital background ring */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full border border-white/15" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EAE7FF] bg-white/15 px-2.5 py-0.5 rounded-full">
              Continue learning
            </span>
            <span className="text-xs text-white/80">· Chapter 2</span>
          </div>

          <h2 id="continue-heading" className="mt-3 text-2xl font-bold text-white md:text-[28px] leading-tight">
            {next.title}
          </h2>
          <p className="mt-1 text-sm text-white/85">
            {next.subject} · {next.chapter}
          </p>

          <div className="mt-6 max-w-md">
            <div className="mb-2 flex justify-between text-xs font-medium text-white/85">
              <span>Chapter progress</span>
              <span>{doneCount} of {chapter.length} lessons completed</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#19B99A] transition-all duration-500 shadow-sm"
                style={{ width: `${chapterPct}%` }}
              />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="bg-white text-[#5230E8] hover:bg-white/95 font-bold px-5 shadow-sm"
            >
              <Link to="/lesson/$id" params={{ id: next.id }}>
                <Play className="h-4 w-4 mr-1.5 fill-current" /> Resume learning
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/15 hover:text-white"
            >
              <Link to="/learn">All lessons</Link>
            </Button>
          </div>
        </section>

        {/* Daily Mission Card */}
        <Panel
          title={
            <span className="inline-flex items-center gap-2 text-foreground font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF0D5] text-[#F5A623]">
                <Target className="h-3.5 w-3.5" />
              </span>
              Daily mission
            </span>
          }
        >
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-sm text-foreground">
                Score full marks on the Fractions practice quiz
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                4 questions on comparing and multiplying fractions.
              </p>
            </div>

            <div className="space-y-1.5">
              <Meter value={missionDone ? 100 : 0} tone="orange" label="Mission Progress" />
              <p className="text-[11px] text-muted-foreground mt-2">
                {missionDone ? "Completed ✓" : "Not started"} · Reward: +50 XP and the Quiz Ace badge
              </p>
            </div>

            <Button
              onClick={handleCompleteMission}
              className={`w-full text-xs font-semibold ${missionDone ? "bg-[#19B99A] hover:bg-[#159a80] text-white" : "bg-[#F5A623] hover:bg-[#e09419] text-white shadow-sm"}`}
            >
              {missionDone ? "Completed (+50 XP) ✓" : "Start mission"}
            </Button>
          </div>
        </Panel>
      </div>

      {/* 4. Visual Analytics: Weekly Activity Chart & Subject Distribution */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Weekly Activity Area Chart */}
        <div className="card-surface p-5 rounded-xl lg:col-span-8 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#42A5E8]" /> Weekly Learning Activity
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Minutes studied vs XP earned across the last 7 days
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-[#42A5E8]" /> Study Minutes
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E95778]" /> XP Earned
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#42A5E8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#42A5E8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorXp" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#E95778" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E95778" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E7EF" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#77778D" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#77778D" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "10px",
                      border: "1px solid #E7E7EF",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="#42A5E8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorMinutes)"
                    name="Minutes"
                  />
                  <Area
                    type="monotone"
                    dataKey="xp"
                    stroke="#E95778"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorXp)"
                    name="XP"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                Loading activity trends...
              </div>
            )}
          </div>
        </div>

        {/* Subject Time Breakdown */}
        <div className="card-surface p-5 rounded-xl lg:col-span-4 flex flex-col justify-between">
          <div className="border-b border-border pb-3 mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#6541F5]" /> Subject Engagement
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Curriculum distribution this term</p>
          </div>

          <div className="space-y-3.5">
            {subjectDistribution.map((s) => (
              <div key={s.subject} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.subject}
                  </span>
                  <span className="text-muted-foreground font-medium">{s.count} · {s.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total study: <strong>4.8 hrs this wk</strong></span>
            <Link to="/progress" className="text-[#6541F5] font-semibold hover:underline">
              View Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Recommended for you with colorful subject tags */}
      <Panel
        title="Recommended for you"
        action={
          <Link to="/learn" className="text-xs font-semibold text-[#6541F5] hover:underline dark:text-[#7C5CFA]">
            Library
          </Link>
        }
      >
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((l) => {
            const badge = getSubjectBadge(l.subject);
            return (
              <Link
                key={l.id}
                to="/lesson/$id"
                params={{ id: l.id }}
                className="rounded-xl border border-border bg-card p-4 transition-all hover:border-[#6541F5]/40 hover:bg-[#F4F3FD]/40 dark:hover:bg-[#25253B] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span
                    className="inline-block rounded-md px-2 py-0.5 text-[11px] font-bold"
                    style={{ color: badge.text, backgroundColor: badge.bg, border: `1px solid ${badge.border}` }}
                  >
                    {l.subject}
                  </span>
                  <p className="mt-2.5 font-bold text-sm text-foreground leading-snug line-clamp-2">
                    {l.title}
                  </p>
                </div>
                <p className="mt-4 text-xs text-muted-foreground font-medium">
                  {l.type} · {l.durationMin} min
                </p>
              </Link>
            );
          })}
        </div>
      </Panel>

      {/* 6. PlayLab, CircuitVerse, CodeVerse feature shortcuts */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { to: "/playlab", icon: <Gamepad2 />, tone: "orange" as const, t: "PlayLab", d: "Play CodeBot Maze or Math Ludo." },
          { to: "/circuitverse", icon: <CircuitBoard />, tone: "teal" as const, t: "CircuitVerse", d: "Close a circuit and light the bulb." },
          { to: "/codeverse", icon: <Code2 />, tone: "blue" as const, t: "CodeVerse", d: "Solve the beginner loop challenge." },
        ].map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="card-surface flex items-center gap-4 p-4 rounded-xl transition-all hover:border-[#6541F5]/40 hover:bg-[#F4F3FD]/40 dark:hover:bg-[#25253B] shadow-sm"
          >
            <IconBox tone={f.tone}>{f.icon}</IconBox>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-foreground">{f.t}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.d}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* 7. AI Tutor & Learning Mesh & Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Tutor Card */}
        <Panel
          title={
            <span className="inline-flex items-center gap-2 text-foreground font-bold">
              <Bot className="h-4 w-4 text-[#6541F5] dark:text-[#7C5CFA]" /> AI Tutor
            </span>
          }
        >
          <p className="text-xs text-muted-foreground mb-3">Try asking one of these questions:</p>
          <ul className="space-y-2 text-xs">
            {["Why do we need equal parts in a fraction?", "Why does the bulb not glow when the switch is open?"].map((q) => (
              <li key={q}>
                <Link
                  to="/tutor"
                  search={{ q }}
                  className="block rounded-lg border border-border bg-card p-2.5 hover:bg-[#EAE7FF]/30 hover:border-[#6541F5]/40 dark:hover:bg-[#25253B] transition-colors"
                >
                  "{q}"
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted-foreground">Demo tutor with Concept Detective responses.</p>
        </Panel>

        {/* Recent Achievements */}
        <Panel
          title={
            <span className="inline-flex items-center gap-2 text-foreground font-bold">
              <Award className="h-4 w-4 text-[#F5A623]" /> Recent achievements
            </span>
          }
          action={
            <Link to="/rewards" className="text-xs font-semibold text-[#6541F5] hover:underline dark:text-[#7C5CFA]">
              All
            </Link>
          }
        >
          <ul className="space-y-2.5 text-xs">
            {achievements.filter((a) => d.unlocked.includes(a.id)).slice(-3).map((a, i) => {
              const colors = ["#F5A623", "#42A5E8", "#19B99A"];
              const bgs = ["#FFF0D5", "#DDF2FC", "#DDF8EE"];
              const c = colors[i % colors.length]!;
              const bg = bgs[i % bgs.length]!;
              return (
                <li key={a.id} className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: bg, color: c }}
                  >
                    <Award className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">{a.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* Class Leaderboard Table with Colored Rank Badges */}
        <Panel
          title="Class leaderboard"
          action={<span className="text-[10px] font-semibold text-muted-foreground uppercase">Class 7B</span>}
        >
          <ol className="space-y-2 text-xs">
            {board.slice(0, 5).map((p, i) => {
              const rankColor =
                i === 0
                  ? "bg-[#FFF0D5] text-[#F5A623] border border-[#F5A623]/30 font-bold"
                  : i === 1
                  ? "bg-[#DDF2FC] text-[#42A5E8] border border-[#42A5E8]/30 font-bold"
                  : i === 2
                  ? "bg-[#FCE5EB] text-[#E95778] border border-[#E95778]/30 font-bold"
                  : "bg-muted text-muted-foreground";

              return (
                <li
                  key={p.name}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                    p.name.includes("You")
                      ? "bg-[#EAE7FF]/60 font-bold text-[#5230E8] border border-[#6541F5]/25 dark:bg-[#7C5CFA]/20 dark:text-[#EAE7FF]"
                      : i % 2 === 0
                      ? "bg-muted/40 text-foreground"
                      : "bg-card text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${rankColor}`}>
                      {i + 1}
                    </span>
                    <span>{p.name}</span>
                  </div>
                  <span className="tabular-nums font-mono font-semibold">{p.weekly} pts</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-[10px] text-muted-foreground">Weekly points, Class 7B Science.</p>
        </Panel>
      </div>

      {/* 8. Learning Mesh & Downloads */}
      <div className="grid gap-6 md:grid-cols-2">
        <Panel
          title={
            <span className="inline-flex items-center gap-2 text-foreground font-bold">
              <Network className="h-4 w-4 text-[#19B99A]" /> Learning Mesh
            </span>
          }
          action={<NetworkTag status={d.networkMode} />}
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            Connected to Kalyan School Hub micro-server. All lessons, PlayLab, and quizzes function without cellular data bills.
          </p>
          <Link to="/mesh" className="mt-3 inline-block text-xs font-semibold text-[#6541F5] hover:underline dark:text-[#7C5CFA]">
            How offline mesh works →
          </Link>
        </Panel>

        <Panel
          title={
            <span className="inline-flex items-center gap-2 text-foreground font-bold">
              <Download className="h-4 w-4 text-[#42A5E8]" /> Downloads & sync
            </span>
          }
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            {savedPacks.length} of {learningPacks.length} packs cached on device. {d.pendingSyncCount} offline activities waiting to sync.
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Last sync: {d.lastSyncTime}</p>
          <Link to="/downloads" className="mt-3 inline-block text-xs font-semibold text-[#6541F5] hover:underline dark:text-[#7C5CFA]">
            Manage downloads →
          </Link>
        </Panel>
      </div>
    </div>
  );
}
