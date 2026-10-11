import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  HeartHandshake, Sparkles, Trophy, BookOpen, Award, CheckCircle2,
  Smile, ShieldCheck, ArrowRight, Bell, Calendar, ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { demoStudent } from "@/data/demo";

export const Route = createFileRoute("/_shell/parent")({
  head: () => ({
    meta: [
      { title: "Parent Guardian Portal · VidyaVerse" },
      { name: "description", content: "Supportive, encouraging overview of your child's academic journey and accomplishments." },
    ],
  }),
  component: ParentDashboardPage,
});

function ParentDashboardPage() {
  const d = useDemo();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Guardian Portal: ${demoStudent.name}'s Learning Journey`}
        description="A supportive, encouraging overview designed for parents. Celebrate real effort and discover positive ways to guide learning at home."
        eyebrow={<Badge variant="outline" className="border-[#18C7A5]/50 text-[#18C7A5]">Parent & Family View</Badge>}
      />

      {/* Encouragement Banner */}
      <div className="rounded-2xl border border-[#2B3452] bg-gradient-to-r from-[#171936] via-[#171D33] to-[#0B1020] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#18C7A5]/20 text-[#18C7A5] border border-[#18C7A5]/40 shrink-0">
            <Smile className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#F4F6FF]">
                Ananya has had a wonderful learning week!
              </h2>
              <Badge className="bg-[#18C7A5]/20 text-[#18C7A5] border-[#18C7A5]/40 text-xs">Consistent Learner</Badge>
            </div>
            <p className="mt-1 text-xs text-[#A8B0CC] max-w-2xl leading-relaxed">
              She attended all 4 school science activities, scored full marks on the Simple Circuits check, and practiced fraction logic for a 6-day streak.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Weekly Growth & Completed Projects */}
        <div className="lg:col-span-8 space-y-6">
          <Panel title="Weekly Highlights & Celebrations">
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-[#18C7A5]/40 bg-[#141A30] p-3.5 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#18C7A5] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F4F6FF] block">Hands-on STEM Accomplishment:</span>
                  <p className="text-[#A8B0CC] leading-relaxed mt-0.5">
                    Ananya wired an emergency lantern circuit in CircuitVerse and tested resistor ratings. Her teacher praised her safety calculations!
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#38D9F5]/40 bg-[#141A30] p-3.5 flex items-start gap-3">
                <ThumbsUp className="h-5 w-5 text-[#38D9F5] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F4F6FF] block">Fractions Progress in Mathematics:</span>
                  <p className="text-[#A8B0CC] leading-relaxed mt-0.5">
                    Completed 3 practice modules on dividing fractions. Solved 12 practice questions correctly.
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          {/* Supportive Home Guidance (Non-Punitive) */}
          <Panel title="How You Can Support Learning at Home">
            <div className="space-y-3 text-xs text-[#A8B0CC] leading-relaxed">
              <div className="p-3 rounded-xl bg-[#141A30] border border-[#2B3452]">
                <strong className="text-[#FFC857] block mb-1">Friendly Conversation Starter:</strong>
                <p>
                  Ask Ananya: <em>"Can you explain why a switch needs to be closed for a flashlight to work?"</em> She loves explaining this analogy!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#141A30] border border-[#2B3452]">
                <strong className="text-[#38D9F5] block mb-1">Kitchen Math Activity:</strong>
                <p>
                  While preparing rotis or cutting vegetables, invite her to show you what 1/4 and 3/4 equal. Real-life hands-on practice cements decimal mastery.
                </p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right: Goals & Rewards */}
        <div className="lg:col-span-4 space-y-6">
          <Panel title="Current Learning Goals">
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#141A30] border border-[#2B3452]">
                <div className="flex justify-between font-semibold text-[#F4F6FF] mb-1">
                  <span>Science Chapter 10</span>
                  <span className="text-[#18C7A5]">85% Ready</span>
                </div>
                <div className="h-2 w-full bg-[#0B1020] rounded-full overflow-hidden">
                  <div className="h-full bg-[#18C7A5] rounded-full w-[85%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#141A30] border border-[#2B3452]">
                <div className="flex justify-between font-semibold text-[#F4F6FF] mb-1">
                  <span>Math Decimals Practice</span>
                  <span className="text-[#FFC857]">60% Ready</span>
                </div>
                <div className="h-2 w-full bg-[#0B1020] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFC857] rounded-full w-[60%]" />
                </div>
              </div>
            </div>
          </Panel>

          {/* Claimed Rewards */}
          <Panel title="Rewards & Badges Earned">
            <div className="space-y-2 text-xs">
              {d.redeemedItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#0B1020] border border-[#2B3452]">
                  <Award className="h-4 w-4 text-[#FFC857]" />
                  <span className="font-semibold text-[#F4F6FF]">{item}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
