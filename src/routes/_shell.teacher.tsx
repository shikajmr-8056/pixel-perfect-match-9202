import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  GraduationCap, Users, BookOpen, AlertTriangle, CheckCircle2, Plus,
  FileSpreadsheet, RefreshCw, Clock, ShieldCheck, Download, Search,
  BarChart3, Sparkles
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader, Panel } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { teacherRoster } from "@/data/demo";

export const Route = createFileRoute("/_shell/teacher")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard · Class 7B Science · VidyaVerse" },
      { name: "description", content: "Mastery heatmaps, student diagnostics, offline sync tracker and assignment creator." },
    ],
  }),
  component: TeacherDashboardPage,
});

const chapterPerformanceData = [
  { chapter: "Ch 1: Plants", submitted: 24, mastered: 22 },
  { chapter: "Ch 2: Animals", submitted: 23, mastered: 20 },
  { chapter: "Ch 4: Heat", submitted: 22, mastered: 18 },
  { chapter: "Ch 6: Acids", submitted: 21, mastered: 17 },
  { chapter: "Ch 10: Circuits", submitted: 24, mastered: 23 },
];

function TeacherDashboardPage() {
  const d = useDemo();
  const [mounted, setMounted] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDue, setNewDue] = useState("Next Monday");

  useEffect(() => {
    setMounted(true);
  }, []);

  const flaggedStudents = [
    { name: "Demo Student 02", gap: "Comparing Fractions", action: "Assigned Math Ludo Session", color: "#E95778", bg: "#FCE5EB" },
    { name: "Demo Student 04", gap: "Not Synced Since 5 Oct", action: "Inspect Tablet at School Hub", color: "#F5A623", bg: "#FFF0D5" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Dashboard: Class 7B Science"
        description="Monitor cohort competencies, identify root misconceptions early, track offline device syncs, and deploy targeted interventions."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0D5] px-3 py-1 text-xs font-bold text-[#F5A623]">
            <GraduationCap className="h-3 w-3" /> Instructor Command Hub
          </span>
        }
        actions={
          <div className="flex gap-2.5">
            <Button size="sm" variant="outline" className="border-border text-xs font-semibold">
              <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-[#19B99A]" /> Export Report
            </Button>
            <Dialog open={assignmentModal} onOpenChange={setAssignmentModal}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs shadow-sm">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Deploy Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-[#6541F5]">Create Classroom Learning Assignment</DialogTitle>
                </DialogHeader>
                <div className="space-y-3.5 py-2 text-xs">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">Assignment Title:</label>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Chapter 10 Circuit Troubleshooting Lab"
                      className="w-full rounded-lg bg-background border border-border p-2.5 text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">Due Date:</label>
                    <input
                      value={newDue}
                      onChange={(e) => setNewDue(e.target.value)}
                      className="w-full rounded-lg bg-background border border-border p-2.5 text-foreground text-xs"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setAssignmentModal(false);
                      setNewTitle("");
                    }}
                    className="w-full bg-[#19B99A] text-white font-bold text-xs mt-3 shadow-sm"
                  >
                    Broadcast to School Mesh Hub
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Overview Stat Tiles in Colorful Theme */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Enrolled Cohort (Blue) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Enrolled Cohort</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DDF2FC] text-[#42A5E8]">
              <Users className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-foreground mt-2">24 Students</div>
          <p className="mt-2 text-[11px] font-semibold text-[#42A5E8]">Class Code: SCI7B</p>
        </div>

        {/* Average Mastery (Teal) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Class Average Mastery</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DDF8EE] text-[#19B99A]">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-[#19B99A] mt-2">79.4%</div>
          <p className="mt-2 text-[11px] font-semibold text-[#19B99A]">+8.2% vs state benchmark</p>
        </div>

        {/* Flagged Learning Gaps (Pink) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Flagged Interventions</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FCE5EB] text-[#E95778]">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-[#E95778] mt-2">2 Learners</div>
          <p className="mt-2 text-[11px] font-semibold text-[#E95778]">Need targeted concept support</p>
        </div>

        {/* Mesh Sync Health (Orange) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Mesh Sync Health</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF0D5] text-[#F5A623]">
              <RefreshCw className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-[#F5A623] mt-2">22 / 24 Devices</div>
          <p className="mt-2 text-[11px] font-semibold text-[#F5A623]">Synced in last 48 hours</p>
        </div>
      </div>

      {/* Chapter Performance Recharts Bar Chart */}
      <div className="card-surface p-5 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#42A5E8]" /> Chapter Completion &amp; Mastery Distribution
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submissions vs Concept Detective verified mastery across active syllabus
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-[#42A5E8]" /> Submissions
            </span>
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-[#19B99A]" /> Verified Mastered
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chapterPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E7EF" />
                <XAxis dataKey="chapter" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#77778D" }} />
                <YAxis domain={[0, 25]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#77778D" }} />
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
                <Bar dataKey="submitted" fill="#42A5E8" radius={[4, 4, 0, 0]} name="Submissions" />
                <Bar dataKey="mastered" fill="#19B99A" radius={[4, 4, 0, 0]} name="Mastered" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
              Loading chapter analytics...
            </div>
          )}
        </div>
      </div>

      {/* Main Roster & Misconceptions Breakdown */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <Panel title="Student Roster Competency Matrix">
            <div className="space-y-2.5">
              {teacherRoster.map((st, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border border-border p-3 flex items-center justify-between text-xs transition-colors ${
                      isEven ? "bg-card" : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#EAE7FF] flex items-center justify-center font-bold text-[#6541F5]">
                        0{idx + 1}
                      </div>
                      <div>
                        <span className="font-bold text-foreground block">{st.name}</span>
                        <span className="text-[11px] text-muted-foreground">Assignments: {st.assignments} · Sync: {st.lastSync}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#19B99A]">
                        {st.quiz !== null ? `${st.quiz}%` : "No Data"}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          st.gap.includes("None")
                            ? "bg-[#DDF8EE] text-[#19B99A] border border-[#19B99A]/30"
                            : "bg-[#FCE5EB] text-[#E95778] border border-[#E95778]/30"
                        }`}
                      >
                        {st.gap}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Right: Intervention Center & Common Misconceptions */}
        <div className="lg:col-span-4 space-y-6">
          <Panel
            title={
              <span className="inline-flex items-center gap-2 text-foreground font-bold">
                <AlertTriangle className="h-4 w-4 text-[#E95778]" /> Targeted Interventions
              </span>
            }
          >
            <div className="space-y-3 text-xs">
              {flaggedStudents.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-3.5 space-y-1"
                  style={{ backgroundColor: f.bg, borderColor: `${f.color}40`, color: f.color }}
                >
                  <span className="font-bold block text-sm">{f.name}</span>
                  <p className="text-[11px] text-foreground font-medium"><strong>Bottleneck:</strong> {f.gap}</p>
                  <p className="text-[11px] text-muted-foreground"><strong>Action:</strong> {f.action}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* Top Misconceptions Flagged in Class */}
          <Panel title="Aggregated Class Misconceptions">
            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-[#FFF0D5] border border-[#F5A623]/30 p-3 space-y-1">
                <span className="font-bold text-[#F5A623] block">Switch Creates Electricity (6 students)</span>
                <p className="text-[11px] text-foreground">Students believe switch is energy source rather than battery.</p>
              </div>
              <div className="rounded-xl bg-[#FCE5EB] border border-[#E95778]/30 p-3 space-y-1">
                <span className="font-bold text-[#E95778] block">Decimal Length Illusion (4 students)</span>
                <p className="text-[11px] text-foreground">Assumed 0.45 is larger than 0.5 because 45 &gt; 5.</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
