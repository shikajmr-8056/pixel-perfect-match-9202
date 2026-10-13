import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Flame,
  Trophy,
  Play,
  BookOpen,
  Gamepad2,
  CircuitBoard,
  Code2,
  Bot,
  Mic,
  Award,
  Network,
  Download,
  CheckCircle2,
  Target,
  ArrowRight,
  RefreshCw,
  Zap,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { Panel, NetworkTag, DemoTag } from "@/components/vv/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared";
import { useDemo, levelFor, XP_PER_LEVEL } from "@/lib/demo-store";
import {
  achievements,
  demoStudent,
  lessons,
  misconceptions,
  getSubjectTheme,
  type Lesson,
} from "@/data/demo";

export function StudentDashboardView() {
  const d = useDemo();
  const [isSyncing, setIsSyncing] = useState(false);

  // Level calculations
  const currentLvl = levelFor(d.xp);
  const currentLvlXp = d.xp % XP_PER_LEVEL;
  const nextLvlPct = Math.min(100, Math.round((currentLvlXp / XP_PER_LEVEL) * 100));

  // Determine the next incomplete lesson to continue learning
  const incompleteLessons = lessons.filter((l) => !d.completed.includes(l.id));
  const continueLesson: Lesson | undefined = incompleteLessons[0] ?? lessons[0];
  const allLessonsDone = incompleteLessons.length === 0 && lessons.length > 0;

  // Chapter progress for the continue lesson
  const chapterLessons = continueLesson
    ? lessons.filter(
        (l) => l.chapter === continueLesson.chapter && l.subject === continueLesson.subject,
      )
    : [];
  const chapterCompletedCount = chapterLessons.filter((l) => d.completed.includes(l.id)).length;
  const chapterPct =
    chapterLessons.length > 0
      ? Math.round((chapterCompletedCount / chapterLessons.length) * 100)
      : 0;

  // Today's learning goal status (idempotent tracking)
  const isGoalDone =
    d.completedChallenges.includes("daily-goal-fractions") ||
    d.completedChallenges.includes("daily-fractions-1");

  const handleCompleteGoal = () => {
    if (!isGoalDone) {
      d.completeChallenge(
        "daily-goal-fractions",
        50,
        "Completed daily Fractions Concept practice quiz",
      );
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await d.syncNow();
    } finally {
      setIsSyncing(false);
    }
  };

  // Subjects configuration
  const subjectsList = [
    { id: "Mathematics", name: "Mathematics" },
    { id: "Science", name: "Science" },
    { id: "Computing", name: "Computing" },
    { id: "Social Science", name: "Social Science" },
  ] as const;

  // Saved offline packs
  const savedPacks = Object.entries(d.downloads).filter(([, st]) => st === "saved");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* =========================================================================
          1. Welcome Message & Profile Summary (Lean, Focused, Not an Admin Grid)
         ========================================================================= */}
      <section
        aria-label="Student profile summary"
        className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <DemoTag>Demo Student Profile</DemoTag>
              <span className="text-xs font-semibold text-muted-foreground">
                Class 7B · Kalyan School
              </span>
              <Badge
                variant="outline"
                className="bg-[#6541F5]/10 text-[#6541F5] border-[#6541F5]/25 dark:text-[#7C5CFA] text-[10px] font-bold"
              >
                <Sparkles className="h-3 w-3 mr-1" /> Term 2 Active Explorer
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {demoStudent.name}!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {d.completed.length === 0
                ? "Ready to begin your journey? Pick your first lesson below!"
                : `You've completed ${d.completed.length} of ${lessons.length} core curriculum lessons so far.`}
            </p>
          </div>

          {/* Meaningful Compact Progress Badges */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border/80">
            {/* Daily Streak */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FCE5EB] text-[#E95778]">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Active Streak</p>
                <p className="text-sm font-bold text-foreground">
                  {demoStudent.streakDays} Days 🔥
                </p>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-border" />

            {/* Mastery Level & XP */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAE7FF] text-[#6541F5] dark:bg-[#7C5CFA]/20 dark:text-[#D8D5FF]">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground">Level {currentLvl}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ({d.xp.toLocaleString("en-IN")} XP)
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-1.5 w-16 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6541F5] dark:bg-[#7C5CFA] rounded-full transition-all"
                      style={{ width: `${nextLvlPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    +{d.weeklyXp} wk
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2 & 3. Continue Learning & Today's Learning Goal (Primary Learning Focus)
         ========================================================================= */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Continue Learning Featured Card */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#5230E8] via-[#6541F5] to-[#7C5CFA] p-6 text-white shadow-md shadow-[#6541F5]/20 relative overflow-hidden min-h-[240px]">
          {/* Subtle background cosmic decorative elements */}
          <div
            className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/5 pointer-events-none blur-xl"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                Continue Learning
              </span>
              {continueLesson && (
                <span className="text-xs text-white/80 font-medium">
                  {continueLesson.subject} · {continueLesson.chapter}
                </span>
              )}
            </div>

            {allLessonsDone ? (
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
                  All active curriculum lessons completed! 🎉
                </h2>
                <p className="text-xs sm:text-sm text-white/80 max-w-lg mt-1">
                  Outstanding job, Ananya. You can review past lessons, take mastery quizzes, or
                  explore the interactive STEM labs below.
                </p>
              </div>
            ) : continueLesson ? (
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
                  {continueLesson.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 max-w-lg mt-1">
                  {continueLesson.objectives[0] ??
                    `${continueLesson.type} · ${continueLesson.durationMin} min interactive lesson`}
                </p>
              </div>
            ) : null}
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {continueLesson && !allLessonsDone && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-white/90">
                  <span className="font-medium">Chapter progress</span>
                  <span className="font-semibold">
                    {chapterCompletedCount} of {chapterLessons.length} lessons
                  </span>
                </div>
                <div className="h-2 w-44 sm:w-52 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-300"
                    style={{ width: `${chapterPct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {continueLesson && (
                <Button
                  asChild
                  className="bg-white text-[#5230E8] hover:bg-white/90 font-bold text-xs shadow-md h-10 px-4 min-h-[44px]"
                >
                  <Link to="/lesson/$id" params={{ id: continueLesson.id }}>
                    <Play className="h-4 w-4 mr-1.5 fill-[#5230E8]" />
                    {allLessonsDone ? "Review Lesson" : "Resume Lesson"}
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 text-xs font-semibold h-10 px-4 min-h-[44px]"
              >
                <Link to="/learn">Browse Curriculum</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 3. Today's Learning Goal Card */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Target className="h-4 w-4 text-[#F5A623]" /> Today's Learning Goal
              </span>
              <Badge
                variant="outline"
                className="bg-[#FFF0D5] text-[#F5A623] border-[#F5A623]/30 font-bold text-[10px]"
              >
                +50 XP
              </Badge>
            </div>

            <h3 className="text-sm font-bold text-foreground">
              Complete Fractions Practice Checkpoint
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Solve 4 interactive questions on comparing, multiplying, and visualizing fractions.
            </p>

            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Status</span>
                <span className="font-bold text-foreground">
                  {isGoalDone ? "100% Completed" : "In Progress"}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: isGoalDone ? "100%" : "30%",
                    backgroundColor: isGoalDone ? "#19B99A" : "#F5A623",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border">
            {isGoalDone ? (
              <div className="flex items-center justify-between gap-2 rounded-xl bg-[#DDF8EE] p-3 text-xs font-bold text-[#19B99A]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> Goal Accomplished! +50 XP
                </span>
                <Link
                  to="/challenges"
                  className="text-[11px] underline font-semibold hover:opacity-80"
                >
                  More Quests
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  className="w-full bg-[#F5A623] text-white hover:bg-[#e0951b] font-bold text-xs shadow-sm h-10 min-h-[44px]"
                >
                  <Link to="/quiz/$id" params={{ id: "fractions" }}>
                    Start Practice Quiz →
                  </Link>
                </Button>
                <button
                  type="button"
                  onClick={handleCompleteGoal}
                  className="text-[11px] text-muted-foreground hover:text-foreground text-center font-medium transition-colors"
                >
                  (Mark as completed for demo)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. My Subjects (Course & Chapter Progress with Next Recommended Lesson)
         ========================================================================= */}
      <section aria-labelledby="my-subjects-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="my-subjects-heading" className="text-lg font-bold text-foreground">
              My Subjects
            </h2>
            <p className="text-xs text-muted-foreground">
              Course chapters, mastery progress, and next recommended lessons
            </p>
          </div>
          <Link to="/learn" className="text-xs font-semibold text-[#6541F5] hover:underline">
            Full Library →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subjectsList.map((sub) => {
            const theme = getSubjectTheme(sub.name);
            const subLessons = lessons.filter((l) => l.subject === sub.name);
            const subCompleted = subLessons.filter((l) => d.completed.includes(l.id)).length;
            const subPct =
              subLessons.length > 0 ? Math.round((subCompleted / subLessons.length) * 100) : 0;
            const nextSubLesson = subLessons.find((l) => !d.completed.includes(l.id));

            return (
              <div
                key={sub.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between transition-all hover:border-[#6541F5]/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold"
                      style={{
                        backgroundColor: theme.tint,
                        color: theme.primary,
                        border: `1px solid ${theme.border}40`,
                      }}
                    >
                      {sub.name}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {subCompleted}/{subLessons.length} done
                    </span>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${subPct}%`, backgroundColor: theme.primary }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      {nextSubLesson ? "Next Lesson" : "Status"}
                    </p>
                    {nextSubLesson ? (
                      <div>
                        <p className="text-xs font-bold text-foreground line-clamp-1">
                          {nextSubLesson.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {nextSubLesson.chapter} · {nextSubLesson.durationMin}m
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-[#19B99A] flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> All chapters completed
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60">
                  {nextSubLesson ? (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs font-semibold text-[#6541F5] hover:bg-[#EAE7FF]/50 p-2 h-8"
                    >
                      <Link to="/lesson/$id" params={{ id: nextSubLesson.id }}>
                        <span>Study next</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs font-semibold text-muted-foreground hover:bg-muted p-2 h-8"
                    >
                      <Link to="/learn">
                        <span>Review</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. Practice & Revision Recommendations (Concept Checkpoints)
         ========================================================================= */}
      <section aria-labelledby="practice-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2
              id="practice-heading"
              className="text-lg font-bold text-foreground flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4 text-[#F5A623]" /> Practice &amp; Revision
            </h2>
            <p className="text-xs text-muted-foreground">
              Targeted concept checkpoints based on recorded mistakes and common misconceptions
            </p>
          </div>
          <Link to="/tutor" className="text-xs font-semibold text-[#6541F5] hover:underline">
            All AI Doubt Topics →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {misconceptions.slice(0, 2).map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="bg-[#FFF0D5] text-[#b48216] border-[#F5A623]/30 text-[10px] font-semibold"
                  >
                    Concept Checkpoint
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Diagnostic Retry
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">{m.question}</h3>
                  <p className="text-xs text-[#E95778] font-medium mt-0.5">
                    Common misconception: {m.misconception}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/50 p-3 text-xs text-foreground/90 leading-relaxed border border-border/70">
                  <span className="font-semibold text-primary">Concept Tip: </span>
                  {m.why}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  Quick Check: {m.practice.text}
                </span>
                <Button
                  asChild
                  size="sm"
                  className="bg-[#6541F5] hover:bg-[#5230E8] text-white text-xs font-bold"
                >
                  <Link
                    to="/tutor"
                    search={{
                      q: `Why is the answer to ${encodeURIComponent(m.question)} not ${encodeURIComponent(m.studentAnswer)}?`,
                    }}
                  >
                    Solve with AI Tutor →
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. Explore STEM: PlayLab, CircuitVerse & CodeVerse (Distinct Experiences)
         ========================================================================= */}
      <section aria-labelledby="stem-heading" className="space-y-3">
        <div>
          <h2 id="stem-heading" className="text-lg font-bold text-foreground">
            Explore STEM &amp; Creative Labs
          </h2>
          <p className="text-xs text-muted-foreground">
            Interactive, hands-on science and engineering environments
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* 1. PlayLab */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between transition-all hover:border-[#F5A623]/40">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0D5] text-[#F5A623]">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-[#FFF0D5] text-[#b48216] border-[#F5A623]/30 text-[10px] font-bold"
                >
                  Game Arenas
                </Badge>
              </div>
              <h3 className="text-base font-bold text-foreground">PlayLab</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Step-by-step algorithms in CodeBot Maze and fast mental calculations in Math Ludo
                tournaments.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <Button
                asChild
                variant="outline"
                className="w-full border-[#F5A623]/30 text-[#b48216] hover:bg-[#FFF0D5]/50 font-bold text-xs h-10 min-h-[44px]"
              >
                <Link to="/playlab">Launch PlayLab →</Link>
              </Button>
            </div>
          </div>

          {/* 2. CircuitVerse */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between transition-all hover:border-[#19B99A]/40">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF8EE] text-[#19B99A]">
                  <CircuitBoard className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/30 text-[10px] font-bold"
                >
                  Virtual Hardware
                </Badge>
              </div>
              <h3 className="text-base font-bold text-foreground">CircuitVerse</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Connect knife switches, resistors, and 9V cells on a virtual breadboard to observe
                real Ohm's Law physics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <Button
                asChild
                variant="outline"
                className="w-full border-[#19B99A]/30 text-[#19B99A] hover:bg-[#DDF8EE]/50 font-bold text-xs h-10 min-h-[44px]"
              >
                <Link to="/circuitverse">Open Circuit Lab →</Link>
              </Button>
            </div>
          </div>

          {/* 3. CodeVerse */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between transition-all hover:border-[#42A5E8]/40">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF2FC] text-[#42A5E8]">
                  <Code2 className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-[#DDF2FC] text-[#42A5E8] border-[#42A5E8]/30 text-[10px] font-bold"
                >
                  Block Coding
                </Badge>
              </div>
              <h3 className="text-base font-bold text-foreground">CodeVerse</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Snap visual logic blocks together to solve automated farming puzzles and see Python
                source code generated.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <Button
                asChild
                variant="outline"
                className="w-full border-[#42A5E8]/30 text-[#42A5E8] hover:bg-[#DDF2FC]/50 font-bold text-xs h-10 min-h-[44px]"
              >
                <Link to="/codeverse">Start Coding →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. AI Tutor & VidyaVerse Voice Shortcuts
         ========================================================================= */}
      <section aria-labelledby="helpers-heading" className="space-y-3">
        <div>
          <h2 id="helpers-heading" className="text-lg font-bold text-foreground">
            Smart Learning Companions
          </h2>
          <p className="text-xs text-muted-foreground">
            Pedagogical guidance and voice explanations built for offline school servers
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* AI Concept Detective */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <Bot className="h-4 w-4 text-[#6541F5]" /> AI Concept Detective
                </span>
                <Badge
                  variant="outline"
                  className="bg-[#6541F5]/10 text-[#6541F5] border-[#6541F5]/25 text-[10px]"
                >
                  Analogy AI
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Ask doubts in natural language. The Concept Detective avoids giving dry answers and
                explains concepts with familiar analogies.
              </p>
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-foreground">Try asking:</p>
                <div className="flex flex-col gap-1.5">
                  <Link
                    to="/tutor"
                    search={{ q: "Why do we need equal parts in a fraction?" }}
                    className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-foreground/80 hover:bg-[#EAE7FF]/40 hover:text-[#6541F5] transition-colors"
                  >
                    "Why do we need equal parts in a fraction?"
                  </Link>
                  <Link
                    to="/tutor"
                    search={{ q: "Why does the bulb not glow when the switch is open?" }}
                    className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-foreground/80 hover:bg-[#EAE7FF]/40 hover:text-[#6541F5] transition-colors"
                  >
                    "Why does the bulb not glow when the switch is open?"
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <Button
                asChild
                className="w-full bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs h-10 min-h-[44px]"
              >
                <Link to="/tutor">Open Concept Detective →</Link>
              </Button>
            </div>
          </div>

          {/* VidyaVoice Audio Assistant */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <Mic className="h-4 w-4 text-[#E95778]" /> VidyaVerse Voice Assistant
                </span>
                <Badge
                  variant="outline"
                  className="bg-[#FCE5EB] text-[#E95778] border-[#E95778]/30 text-[10px]"
                >
                  Audio Guides
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Listen to spoken lesson walk-throughs and audio quizzes in your preferred regional
                language (हिन्दी, ಕನ್ನಡ, English).
              </p>
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-foreground">Featured audio tracks:</p>
                <div className="flex flex-col gap-1.5">
                  <Link
                    to="/voice"
                    className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs text-foreground/80 hover:bg-[#FCE5EB]/40 hover:text-[#E95778] transition-colors"
                  >
                    <span>Fractions Explained (हिन्दी ऑडियो)</span>
                    <span className="text-[10px] font-mono text-muted-foreground">4 min</span>
                  </Link>
                  <Link
                    to="/voice"
                    className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs text-foreground/80 hover:bg-[#FCE5EB]/40 hover:text-[#E95778] transition-colors"
                  >
                    <span>Simple Circuits (ಕನ್ನಡ ವಿವರಣೆ)</span>
                    <span className="text-[10px] font-mono text-muted-foreground">5 min</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <Button
                asChild
                variant="outline"
                className="w-full border-[#E95778]/30 text-[#E95778] hover:bg-[#FCE5EB]/40 font-bold text-xs h-10 min-h-[44px]"
              >
                <Link to="/voice">Listen on VidyaVoice →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. Recent Achievements & Compact XP Summary
         ========================================================================= */}
      <section aria-labelledby="achievements-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="achievements-heading" className="text-lg font-bold text-foreground">
              Achievements &amp; XP Sparks
            </h2>
            <p className="text-xs text-muted-foreground">
              Lifetime learning points and badges earned
            </p>
          </div>
          <Link to="/rewards" className="text-xs font-semibold text-[#6541F5] hover:underline">
            Rewards Bazaar ({d.sparks} Sparks) →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-12">
          {/* XP & Sparks Summary Box */}
          <div className="md:col-span-5 rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Points Breakdown
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/40 p-3 border border-border/80">
                  <p className="text-[11px] font-medium text-muted-foreground">Lifetime XP</p>
                  <p className="text-xl font-black text-foreground mt-0.5">
                    {d.xp.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Permanent record</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 border border-border/80">
                  <p className="text-[11px] font-medium text-muted-foreground">Weekly Score</p>
                  <p className="text-xl font-black text-[#6541F5] mt-0.5">+{d.weeklyXp}</p>
                  <p className="text-[10px] text-muted-foreground">Class 7B quest</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#FFF0D5]/50 border border-[#F5A623]/25 p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#b48216]">Spendable Sparks</p>
                  <p className="text-[11px] text-muted-foreground">
                    Lifetime XP is never depleted when shopping
                  </p>
                </div>
                <span className="text-lg font-black text-[#F5A623]">{d.sparks} ⚡</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <Link
                to="/progress"
                className="text-xs font-semibold text-[#6541F5] hover:underline flex items-center justify-between"
              >
                <span>View Full Study History in My Progress</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Unlocked Badges */}
          <div className="md:col-span-7 rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-[#F5A623]" /> Unlocked Milestones
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {d.unlocked.length} of {achievements.length} unlocked
                </span>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {achievements
                  .filter((a) => d.unlocked.includes(a.id))
                  .map((a, i) => {
                    const badgeStyles = [
                      { bg: "bg-[#FFF0D5]", text: "text-[#F5A623]" },
                      { bg: "bg-[#DDF2FC]", text: "text-[#42A5E8]" },
                      { bg: "bg-[#DDF8EE]", text: "text-[#19B99A]" },
                    ][i % 3]!;

                    return (
                      <div
                        key={a.id}
                        className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/20 p-2.5"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${badgeStyles.bg} ${badgeStyles.text}`}
                        >
                          <Award className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{a.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{a.desc}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Next up: <strong>Week Streak (7 Days)</strong>
              </span>
              <Link to="/leaderboard" className="text-[#6541F5] font-semibold hover:underline">
                Class Leaderboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. Discreet Offline Status Area (Downloaded Content & Pending Sync)
         ========================================================================= */}
      <section
        aria-label="Offline sync status"
        className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Network className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">Kalyan School Mesh Hub</span>
                <NetworkTag status={d.networkMode} />
              </div>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                {savedPacks.length} packs cached offline ·{" "}
                {d.pendingSyncCount > 0
                  ? `${d.pendingSyncCount} activities waiting to sync`
                  : "All learning data synchronized"}
                · Last sync: {d.lastSyncTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="h-8 gap-1.5 text-xs font-semibold text-primary"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Button>
            <Link
              to="/downloads"
              className="text-muted-foreground hover:text-foreground font-semibold text-xs hover:underline"
            >
              Downloads →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
