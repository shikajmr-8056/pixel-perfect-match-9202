import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Target, Flame, Trophy, Sparkles, CheckCircle2, Clock, Lightbulb,
  Award, Shield, ArrowRight, Zap, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/_shell/challenges")({
  head: () => ({
    meta: [
      { title: "Challenges & STEM Missions · VidyaVerse" },
      { name: "description", content: "Daily curriculum challenges, school competitions and hands-on build missions." },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const d = useDemo();
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  const challengesList = [
    {
      id: "ch-daily-1",
      title: "Fraction Division Inversion Proof",
      category: "Daily Mission",
      subject: "Mathematics",
      difficulty: "Intermediate",
      rewardXp: 40,
      due: "Tonight 8:00 PM",
      offline: true,
      desc: "Explain why dividing by 1/2 is the same as multiplying by 2 using visual circles.",
      hint: "How many half-cups of water are needed to fill a 1-cup pitcher? Exactly 2!",
    },
    {
      id: "ch-circuit-2",
      title: "Zero-Resistance Hazard Inspection",
      category: "STEM Build",
      subject: "Science",
      difficulty: "Beginner",
      rewardXp: 60,
      due: "Thursday",
      offline: true,
      desc: "Demonstrate in CircuitVerse why connecting a battery directly to an LED without a resistor causes a burnout.",
      hint: "An LED has very small internal resistance. Without R, current I = V/R becomes unsafely huge.",
    },
    {
      id: "ch-code-3",
      title: "Optimized Loop Maze Runner",
      category: "Coding",
      subject: "Computing",
      difficulty: "Advanced",
      rewardXp: 80,
      due: "Saturday",
      offline: true,
      desc: "Reach the goal in CodeBot Maze using no more than 4 instruction blocks by utilizing repeat loops.",
      hint: "Look for repeating patterns of 'move forward'. Wrap them in a loop block.",
    },
    {
      id: "ch-team-4",
      title: "Class 7B School Clean Energy Quest",
      category: "Team Challenge",
      subject: "Environmental Science",
      difficulty: "Intermediate",
      rewardXp: 120,
      due: "Next Monday",
      offline: false,
      desc: "Document three solar energy implementations across Kalyan village with your team.",
      hint: "Check rooftop solar heaters, irrigation pump panels, and street lamp batteries.",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Challenges & Academic Mission Center"
        description="Earn XP, unlock rare astronaut badges, and prove conceptual mastery through interactive problem-solving quests."
        eyebrow={<Badge variant="outline" className="border-[#FFC857]/50 text-[#FFC857]">Gamified Quests</Badge>}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#2B3452] bg-[#141A30] p-4 text-center">
          <span className="text-xs text-[#A8B0CC]">Completed Quests</span>
          <div className="text-2xl font-bold text-[#18C7A5] mt-1">{d.completedChallenges.length} Done</div>
        </div>
        <div className="rounded-2xl border border-[#2B3452] bg-[#141A30] p-4 text-center">
          <span className="text-xs text-[#A8B0CC]">Available Quests</span>
          <div className="text-2xl font-bold text-[#38D9F5] mt-1">{challengesList.length} Active</div>
        </div>
        <div className="rounded-2xl border border-[#2B3452] bg-[#141A30] p-4 text-center">
          <span className="text-xs text-[#A8B0CC]">Potential Quest XP</span>
          <div className="text-2xl font-bold text-[#FFC857] mt-1">+300 XP</div>
        </div>
        <div className="rounded-2xl border border-[#2B3452] bg-[#141A30] p-4 text-center">
          <span className="text-xs text-[#A8B0CC]">Offline Ready</span>
          <div className="text-2xl font-bold text-[#18C7A5] mt-1">100% Cached</div>
        </div>
      </div>

      <div className="space-y-4">
        {challengesList.map((ch) => {
          const isCompleted = d.completedChallenges.includes(ch.id);

          return (
            <div
              key={ch.id}
              className={`rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                isCompleted
                  ? "bg-[#141A30] border-[#18C7A5]/50"
                  : "bg-[#171D33] border-[#2B3452] hover:border-[#38D9F5]/40"
              }`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-[#38D9F5]/40 text-[#38D9F5] text-[10px]">
                    {ch.category}
                  </Badge>
                  <span className="text-xs font-semibold text-[#A8B0CC]">{ch.subject}</span>
                  {ch.offline && (
                    <span className="text-[10px] text-[#18C7A5] bg-[#18C7A5]/10 px-2 py-0.5 rounded font-mono">
                      Offline Capable ✓
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#F4F6FF]">{ch.title}</h3>
                <p className="text-xs text-[#A8B0CC] leading-relaxed">{ch.desc}</p>

                {activeHintId === ch.id && (
                  <div className="rounded-lg bg-[#0B1020] border border-[#FFC857]/40 p-2.5 text-xs text-[#FFC857] flex items-center gap-2 mt-2">
                    <Lightbulb className="h-4 w-4 shrink-0" />
                    <span>{ch.hint}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="text-right sm:mr-2">
                  <span className="font-mono font-bold text-sm text-[#FFC857] flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> +{ch.rewardXp} XP
                  </span>
                  <span className="text-[10px] text-[#A8B0CC]">Due: {ch.due}</span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveHintId(activeHintId === ch.id ? null : ch.id)}
                  className="border-[#2B3452] text-xs h-8"
                >
                  <Lightbulb className="h-3.5 w-3.5 mr-1 text-[#FFC857]" />
                  {activeHintId === ch.id ? "Hide Hint" : "Hint"}
                </Button>

                {isCompleted ? (
                  <Button size="sm" disabled className="bg-[#18C7A5]/20 text-[#18C7A5] border border-[#18C7A5]/40 text-xs h-8">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Completed
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => d.completeChallenge(ch.id, ch.rewardXp, ch.title)}
                    className="bg-[#38D9F5] text-[#0B1020] hover:bg-[#38D9F5]/90 font-bold text-xs h-8 shadow-[0_0_12px_rgba(56,217,245,0.3)]"
                  >
                    Solve Quest
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SimNote>
        Challenge completions earn verified XP and update the school leaderboard automatically upon sync.
      </SimNote>
    </div>
  );
}
