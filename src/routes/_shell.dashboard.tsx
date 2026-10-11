import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Sparkles, Trophy, Target, Gamepad2, CircuitBoard, Code2, MessageCircleQuestion, Network, Download, Award, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoTag, IconBox, Meter, Panel } from "@/components/vv/primitives";
import { useDemo, XP_PER_LEVEL } from "@/lib/demo-store";
import { achievements, demoStudent, leaderboardDemo, learningPacks, lessons, DEMO_LAST_SYNC } from "@/data/demo";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Student dashboard · VidyaVerse" }, { name: "description", content: "Continue learning, today's mission, recommended lessons and progress." }, { property: "og:title", content: "Student dashboard · VidyaVerse" }, { property: "og:description", content: "Continue learning, today's mission, recommended lessons and progress." }] }),
  component: Dashboard,
});

function Dashboard() {
  const d = useDemo();
  const chapter = lessons.filter((l) => l.chapter === lessons[0].chapter);
  const next = chapter.find((l) => !d.completed.includes(l.id)) ?? lessons.find((l) => !d.completed.includes(l.id)) ?? lessons[0];
  const done = chapter.filter((l) => d.completed.includes(l.id)).length;
  const pct = (done / chapter.length) * 100;
  const intoLevel = d.xp % XP_PER_LEVEL;
  const quizDone = d.unlocked.includes("quiz-ace");
  const recommended = lessons.filter((l) => !d.completed.includes(l.id) && l.id !== next.id).slice(0, 4);
  const board = [...leaderboardDemo, { name: `You (${demoStudent.name})`, weekly: d.weeklyXp }].sort((a, b) => b.weekly - a.weekly);
  const saved = learningPacks.filter((p) => d.downloads[p.id] === "saved");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <DemoTag>Demo profile</DemoTag>
          <h1 className="mt-2 text-[28px] font-semibold md:text-[30px]">Welcome back, explorer!</h1>
          <p className="text-muted-foreground">{demoStudent.name} · Class {demoStudent.classLevel}{demoStudent.section}</p>
        </div>
        <dl className="grid grid-cols-3 gap-2 sm:gap-3">
          <Stat icon={<Sparkles />} label="XP" value={d.xp.toLocaleString("en-IN")} />
          <Stat icon={<Trophy />} label="Level" value={String(d.level)} />
          <Stat icon={<Flame />} label="Streak" value={`${demoStudent.streakDays} days`} />
        </dl>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="panel-feature bg-primary p-6 text-primary-foreground lg:col-span-2 md:p-8" aria-labelledby="continue">
          <p className="text-sm font-medium text-saffron">Continue learning</p>
          <h2 id="continue" className="mt-2 text-2xl font-semibold md:text-[26px]">{next.title}</h2>
          <p className="mt-1 text-primary-foreground/75">{next.subject} · {next.chapter}</p>
          <div className="mt-6 max-w-md">
            <div className="mb-2 flex justify-between text-sm"><span>Chapter progress</span><span>{done} of {chapter.length} lessons</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-primary-foreground/15"><div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} /></div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="saffron" size="lg"><Link to="/lesson/$id" params={{ id: next.id }}><Play /> Resume learning</Link></Button>
            <Button asChild variant="outline-inverse" size="lg"><Link to="/learn">All lessons</Link></Button>
          </div>
        </section>

        <Panel title={<span className="inline-flex items-center gap-2"><Target className="h-5 w-5 text-saffron-strong" /> Daily mission</span>}>
          <p className="font-medium">Score full marks on the Fractions practice quiz</p>
          <p className="mt-1 text-sm text-muted-foreground">4 questions on comparing and multiplying fractions.</p>
          <Meter className="mt-4" value={quizDone ? 100 : 0} label="Mission progress" />
          <p className="mt-2 text-xs text-muted-foreground">{quizDone ? "Completed" : "Not started"} · Reward: +50 XP and the Quiz Ace badge</p>
          <Button asChild variant="outline" className="mt-4 w-full"><Link to="/quiz/$id" params={{ id: "fractions" }}>Start mission</Link></Button>
        </Panel>
      </div>

      <Panel title="Recommended for you" action={<Link to="/learn" className="text-sm font-semibold text-primary hover:underline">Library</Link>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((l) => (
            <Link key={l.id} to="/lesson/$id" params={{ id: l.id }} className="rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-accent">
              <p className="text-xs font-semibold text-teal-strong">{l.subject}</p>
              <p className="mt-1 font-medium leading-snug">{l.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">{l.type} · {l.durationMin} min</p>
            </Link>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { to: "/playlab", icon: <Gamepad2 />, tone: "saffron" as const, t: "PlayLab", d: "Play CodeBot Maze or Math Ludo." },
          { to: "/circuitverse", icon: <CircuitBoard />, tone: "teal" as const, t: "CircuitVerse", d: "Close a circuit and light the bulb." },
          { to: "/codeverse", icon: <Code2 />, tone: "primary" as const, t: "CodeVerse", d: "Solve the beginner loop challenge." },
        ].map((f) => (
          <Link key={f.to} to={f.to} className="card-surface flex items-center gap-4 p-4 transition-colors hover:border-primary/40">
            <IconBox tone={f.tone}>{f.icon}</IconBox>
            <div className="min-w-0 flex-1"><p className="font-semibold">{f.t}</p><p className="text-sm text-muted-foreground">{f.d}</p></div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title={<span className="inline-flex items-center gap-2"><MessageCircleQuestion className="h-5 w-5 text-teal-strong" />AI Tutor</span>}>
          <p className="text-sm text-muted-foreground">Try one of these:</p>
          <ul className="mt-3 space-y-2">
            {["Why do we need equal parts in a fraction?", "Why does the bulb not glow when the switch is open?"].map((q) => (
              <li key={q}><Link to="/tutor" search={{ ask: q }} className="block rounded-lg border px-3 py-2 text-sm hover:bg-accent">{q}</Link></li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Demo tutor with prepared answers.</p>
        </Panel>

        <Panel title={<span className="inline-flex items-center gap-2"><Award className="h-5 w-5 text-saffron-strong" />Recent achievements</span>} action={<Link to="/rewards" className="text-sm font-semibold text-primary hover:underline">All</Link>}>
          <ul className="space-y-3">
            {achievements.filter((a) => d.unlocked.includes(a.id)).slice(-3).map((a) => (
              <li key={a.id} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-saffron-soft text-saffron-strong"><Award className="h-4 w-4" /></span><div><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-muted-foreground">{a.desc}</p></div></li>
            ))}
          </ul>
        </Panel>

        <Panel title="Class leaderboard" action={<DemoTag>Demo</DemoTag>}>
          <ol className="space-y-2">
            {board.slice(0, 5).map((p, i) => (
              <li key={p.name} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${p.name.startsWith("You") ? "bg-saffron-soft font-semibold" : ""}`}>
                <span>{i + 1}. {p.name}</span><span className="tabular-nums">{p.weekly} pts</span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-muted-foreground">Weekly points, Class 7B Science.</p>
        </Panel>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title={<span className="inline-flex items-center gap-2"><Network className="h-5 w-5 text-teal-strong" />Learning Mesh</span>} action={<DemoTag>Simulated</DemoTag>}>
          <p className="text-sm">No school network has been detected on this device. Mesh status shown in the Mesh page is a simulation.</p>
          <Link to="/mesh" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">How it works</Link>
        </Panel>
        <Panel title={<span className="inline-flex items-center gap-2"><Download className="h-5 w-5" />Downloads and sync</span>}>
          <p className="text-sm">{saved.length} of {learningPacks.length} demo packs marked as downloaded. 2 quiz results waiting to sync.</p>
          <p className="mt-1 text-xs text-muted-foreground">Last sync: {DEMO_LAST_SYNC}</p>
          <Link to="/downloads" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Manage downloads</Link>
        </Panel>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-surface flex items-center gap-2 px-3 py-2 sm:px-4">
      <span className="text-saffron-strong [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      <div><dt className="text-[11px] text-muted-foreground">{label}</dt><dd className="font-display text-sm font-semibold sm:text-base">{value}</dd></div>
    </div>
  );
}
