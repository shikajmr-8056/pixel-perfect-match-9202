import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users, UserPlus, BookOpen, Clock, Megaphone, Trophy, CheckCircle2,
  Calendar, Award, ArrowRight, ShieldCheck, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { classrooms } from "@/data/demo";

export const Route = createFileRoute("/_shell/classrooms")({
  head: () => ({
    meta: [
      { title: "Classrooms · Learning Cohorts · VidyaVerse" },
      { name: "description", content: "Collaborative school cohorts, assignments, team challenges and announcements." },
    ],
  }),
  component: ClassroomsPage,
});

function ClassroomsPage() {
  const d = useDemo();
  const [inputCode, setInputCode] = useState("");
  const [selectedClassCode, setSelectedClassCode] = useState("SCI7B");
  const [joinMsg, setJoinMsg] = useState<string | null>(null);

  // New classroom modal preview state
  const [newClassName, setNewClassName] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("Science");
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const activeClass = classrooms.find((c) => c.code === selectedClassCode) || classrooms[0]!;
  const isMember = d.joined.includes(activeClass.code);

  const handleJoin = () => {
    const res = d.joinClass(inputCode);
    setJoinMsg(res.message);
    if (res.ok) {
      setSelectedClassCode(inputCode.trim().toUpperCase());
      setInputCode("");
    }
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const generated = "HUB" + Math.floor(100 + Math.random() * 900);
    setCreatedCode(generated);
  };

  const rosterStudents = [
    { name: "Ananya R. (You)", roll: "7B-01", xp: d.xp, badges: 4, status: "Online (Mesh)" },
    { name: "Ravi Kumar", roll: "7B-02", xp: 1190, badges: 3, status: "Active" },
    { name: "Pooja Hegde", roll: "7B-03", xp: 1340, badges: 5, status: "Active" },
    { name: "Kiran Das", roll: "7B-04", xp: 950, badges: 2, status: "Offline" },
    { name: "Suresh Gowda", roll: "7B-05", xp: 1100, badges: 3, status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classrooms & Learning Cohorts"
        description="Connect with your rural school section, complete collaborative team challenges, and sync assignments."
        eyebrow={<Badge variant="outline" className="border-[#38D9F5]/50 text-[#38D9F5]">Collaborative Learning</Badge>}
        actions={
          <div className="flex gap-2">
            {/* Teacher Create Classroom Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-[#2B3452] text-xs">
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" /> + Create Classroom Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#171936] border-[#2B3452] text-[#F4F6FF]">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-[#38D9F5]">Create New School Section</DialogTitle>
                </DialogHeader>
                {createdCode ? (
                  <div className="space-y-3 py-3 text-center">
                    <CheckCircle2 className="h-10 w-10 text-[#18C7A5] mx-auto" />
                    <p className="font-bold text-sm text-[#F4F6FF]">Classroom Generated Successfully!</p>
                    <div className="p-3 bg-[#0B1020] rounded-xl border border-[#2B3452] font-mono text-lg font-bold text-[#FFC857]">
                      JOIN CODE: {createdCode}
                    </div>
                    <p className="text-xs text-[#A8B0CC]">Distribute this code to students on blackboard.</p>
                  </div>
                ) : (
                  <form onSubmit={handleCreateClass} className="space-y-3 py-2 text-xs">
                    <div>
                      <label className="block text-[#A8B0CC] mb-1 font-semibold">Classroom Name:</label>
                      <input
                        required
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="e.g. Class 7A Science Explorers"
                        className="w-full rounded-lg bg-[#0B1020] border border-[#2B3452] p-2 text-[#F4F6FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8B0CC] mb-1 font-semibold">Subject:</label>
                      <select
                        value={newClassSubject}
                        onChange={(e) => setNewClassSubject(e.target.value)}
                        className="w-full rounded-lg bg-[#0B1020] border border-[#2B3452] p-2 text-[#F4F6FF]"
                      >
                        <option value="Science">Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Computing">Computing & Robotics</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                    <Button type="submit" className="w-full bg-[#38D9F5] text-[#0B1020] font-bold text-xs mt-3">
                      Generate Classroom Join Code
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Classroom Selection Bar & Join Input */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-[#2B3452] bg-[#141A30] p-4">
        {/* Class switcher buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {classrooms.map((c) => {
            const active = selectedClassCode === c.code;
            const enrolled = d.joined.includes(c.code);
            return (
              <button
                key={c.code}
                onClick={() => setSelectedClassCode(c.code)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all ${
                  active
                    ? "bg-[#38D9F5] text-[#0B1020] border-[#38D9F5] shadow-[0_0_12px_rgba(56,217,245,0.3)]"
                    : "bg-[#171936] text-[#A8B0CC] border-[#2B3452] hover:border-[#38D9F5]/40"
                }`}
              >
                <span>{c.name}</span>
                {enrolled && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${active ? "bg-[#0B1020] text-[#38D9F5]" : "bg-[#18C7A5]/20 text-[#18C7A5]"}`}>
                    Joined
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Join Code Input Form */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="Enter Code (e.g. SCI7B)"
            className="w-full md:w-44 rounded-xl border border-[#2B3452] bg-[#0B1020] px-3 py-2 text-xs font-mono text-[#F4F6FF] uppercase placeholder:text-[#A8B0CC]/50 focus:outline-none focus:border-[#38D9F5]"
          />
          <Button onClick={handleJoin} size="sm" className="bg-[#18C7A5] text-[#0B1020] hover:bg-[#18C7A5]/90 font-bold text-xs h-9">
            Join
          </Button>
        </div>
      </div>

      {joinMsg && (
        <div className="rounded-xl border border-[#38D9F5]/40 bg-[#171936] p-3 text-xs text-[#38D9F5]">
          {joinMsg}
        </div>
      )}

      {/* Selected Classroom View Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-[#171936] border border-[#2B3452] p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#38D9F5] data-[state=active]:text-[#0B1020] text-xs font-semibold">
            Cohort Overview
          </TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-[#38D9F5] data-[state=active]:text-[#0B1020] text-xs font-semibold">
            Assignments ({activeClass.assigned.length})
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-[#38D9F5] data-[state=active]:text-[#0B1020] text-xs font-semibold">
            Team Challenges
          </TabsTrigger>
          <TabsTrigger value="roster" className="data-[state=active]:bg-[#38D9F5] data-[state=active]:text-[#0B1020] text-xs font-semibold">
            Members & Teams (24)
          </TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              {/* Classroom Header Banner */}
              <div className="rounded-2xl border border-[#2B3452] bg-gradient-to-r from-[#171936] to-[#141A30] p-6 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-[#38D9F5]/10 text-[#38D9F5] border-[#38D9F5]/30">
                    Code: {activeClass.code}
                  </Badge>
                  <span className="text-xs text-[#A8B0CC]">Teacher: {activeClass.teacher}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#F4F6FF]">{activeClass.name}</h2>
                <p className="mt-1 text-xs text-[#A8B0CC]">
                  Weekly target: Electricity practical modules and Ohm's Law circuit verification.
                </p>

                <div className="mt-5 flex items-center gap-4 text-xs text-[#A8B0CC] border-t border-[#2B3452]/50 pt-4">
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#38D9F5]" /> 24 Explorers</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-[#18C7A5]" /> 2 Active Modules</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#FFC857]" /> Weekly Quiz Fri</span>
                </div>
              </div>

              {/* Announcements Feed */}
              <Panel title={<span className="inline-flex items-center gap-2"><Megaphone className="h-4 w-4 text-[#FFC857]" /> Teacher Announcements</span>}>
                <div className="space-y-3">
                  {activeClass.announcements.map((ann, idx) => (
                    <div key={idx} className="rounded-xl border border-[#2B3452] bg-[#141A30] p-3.5 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[#A8B0CC] text-[11px]">
                        <span className="font-semibold text-[#FFC857]">{activeClass.teacher}</span>
                        <span>{ann.date}</span>
                      </div>
                      <p className="text-[#F4F6FF] font-medium leading-relaxed">{ann.text}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            {/* Right: Team Challenge Preview */}
            <div className="lg:col-span-4 space-y-6">
              <Panel title={<span className="inline-flex items-center gap-2 text-[#18C7A5]"><Trophy className="h-4 w-4" /> Team Mission</span>}>
                <div className="rounded-xl border border-[#18C7A5]/40 bg-[#18C7A5]/10 p-4 space-y-2 text-xs">
                  <span className="font-bold text-[#18C7A5] block">Current Team Goal:</span>
                  <p className="text-[#F4F6FF] leading-relaxed">{activeClass.team}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#A8B0CC] border-t border-[#18C7A5]/30 pt-2">
                    <span>Collaborative Bonus:</span>
                    <strong className="text-[#FFC857]">+150 XP per teammate</strong>
                  </div>
                </div>

                <div className="mt-4">
                  <Button asChild size="sm" className="w-full bg-[#18C7A5] text-[#0B1020] hover:bg-[#18C7A5]/90 font-bold text-xs">
                    <Link to="/circuitverse">Launch Circuit Lab for Team</Link>
                  </Button>
                </div>
              </Panel>
            </div>
          </div>
        </TabsContent>

        {/* 2. ASSIGNMENTS TAB */}
        <TabsContent value="assignments" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {activeClass.assigned.map((task) => (
              <div key={task.title} className="rounded-2xl border border-[#2B3452] bg-[#141A30] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[10px] border-[#38D9F5]/40 text-[#38D9F5]">
                      {task.kind} Assignment
                    </Badge>
                    <span className="text-xs text-[#FFC857] font-semibold">Due: {task.due}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#F4F6FF] mt-1">{task.title}</h3>
                  <p className="mt-1 text-xs text-[#A8B0CC]">
                    Read lesson material, complete diagnostic check, and submit result via school mesh.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#2B3452]/50 flex items-center justify-between">
                  <span className="text-xs text-[#18C7A5] font-semibold">Status: In Progress</span>
                  {task.kind === "Lesson" && (
                    <Button asChild size="sm" className="bg-[#38D9F5] text-[#0B1020] hover:bg-[#38D9F5]/90 font-bold text-xs h-8">
                      <Link to="/lesson/$id" params={{ id: task.lessonId || "electric-circuits" }}>Start Lesson</Link>
                    </Button>
                  )}
                  {task.kind === "Quiz" && (
                    <Button asChild size="sm" className="bg-[#FFC857] text-[#0B1020] hover:bg-[#FFC857]/90 font-bold text-xs h-8">
                      <Link to="/quiz/$id" params={{ id: task.quizId || "circuits" }}>Launch Quiz</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 3. TEAM CHALLENGES TAB */}
        <TabsContent value="team" className="space-y-4">
          <div className="rounded-2xl border border-[#2B3452] bg-[#171D33] p-6 shadow-xl">
            <h3 className="font-bold text-base text-[#F4F6FF] mb-2 flex items-center gap-2">
              <Award className="h-5 w-5 text-[#FFC857]" /> Cohort Team Challenge: The Rural Torch Challenge
            </h3>
            <p className="text-xs text-[#A8B0CC] max-w-2xl leading-relaxed mb-4">
              Work in teams of 4 using the CircuitVerse virtual simulator or the physical low-cost cardboard kit. Each team must construct a two-switch torch circuit with an indicator LED.
            </p>
            <div className="grid gap-3 sm:grid-cols-3 text-xs mb-6">
              <div className="p-3 bg-[#141A30] rounded-xl border border-[#2B3452]">
                <strong className="text-[#38D9F5] block">Team Alpha (Ravi, Ananya)</strong>
                <p className="text-[11px] text-[#A8B0CC] mt-1">Circuit schematic: Completed ✓</p>
              </div>
              <div className="p-3 bg-[#141A30] rounded-xl border border-[#2B3452]">
                <strong className="text-[#18C7A5] block">Team Beta (Pooja, Suresh)</strong>
                <p className="text-[11px] text-[#A8B0CC] mt-1">Breadboard wired: Testing switch ⚡</p>
              </div>
              <div className="p-3 bg-[#141A30] rounded-xl border border-[#2B3452]">
                <strong className="text-[#FFC857] block">Team Gamma (Kiran, Meena)</strong>
                <p className="text-[11px] text-[#A8B0CC] mt-1">Cardboard prototype in progress</p>
              </div>
            </div>
            <Button asChild className="bg-[#38D9F5] text-[#0B1020] hover:bg-[#38D9F5]/90 font-bold text-xs">
              <Link to="/circuitverse">Open Circuit Workspace for Team</Link>
            </Button>
          </div>
        </TabsContent>

        {/* 4. MEMBERS ROSTER TAB */}
        <TabsContent value="roster" className="space-y-4">
          <Panel title="Enrolled Explorers (Class 7B)">
            <div className="space-y-2">
              {rosterStudents.map((st) => (
                <div key={st.roll} className="flex items-center justify-between p-3 rounded-xl bg-[#141A30] border border-[#2B3452] text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#171936] text-[#38D9F5] flex items-center justify-center font-bold">
                      {st.roll.split("-")[1]}
                    </div>
                    <div>
                      <span className="font-semibold text-[#F4F6FF] block">{st.name}</span>
                      <span className="text-[11px] text-[#A8B0CC]">Roll: {st.roll}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[#FFC857] font-bold">{st.xp} XP</span>
                    <Badge variant="outline" className="border-[#2B3452] text-[10px] text-[#A8B0CC]">
                      {st.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
