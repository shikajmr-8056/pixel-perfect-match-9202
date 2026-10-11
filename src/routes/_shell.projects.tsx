import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FolderGit2, Plus, Sparkles, Award, CheckCircle2, FileText,
  CircuitBoard, Code2, Atom, Printer, MessageSquare, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo, type StudentProject } from "@/lib/demo-store";
import { demoStudent } from "@/data/demo";

export const Route = createFileRoute("/_shell/projects")({
  head: () => ({
    meta: [
      { title: "Student Projects & Portfolio · VidyaVerse" },
      { name: "description", content: "Showcase of student-engineered circuits, coding algorithms, and science projects." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const d = useDemo();
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  // New project modal states
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"Electronics" | "Coding" | "Science" | "Math">("Electronics");
  const [newDesc, setNewDesc] = useState("");
  const [newSkills, setNewSkills] = useState("Ohm's Law, Breadboard, LED Logic");
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    d.addProject({
      title: newTitle,
      category: newCategory,
      status: "completed",
      xpEarned: 100,
      description: newDesc,
      skills: newSkills.split(",").map((s) => s.trim()),
    });
    setNewTitle("");
    setNewDesc("");
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Projects & STEM Portfolio"
        description="Authentic student-created engineering artifacts. Build digital circuits in CircuitVerse, algorithms in CodeVerse, and document physical science models."
        eyebrow={<Badge variant="outline" className="border-[#38D9F5]/50 text-[#38D9F5]">Authentic Assessment</Badge>}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCertificate(true)}
              variant="outline"
              size="sm"
              className="border-[#2B3452] text-xs text-[#FFC857]"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" /> Printable Certificate
            </Button>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#38D9F5] text-[#0B1020] hover:bg-[#38D9F5]/90 font-bold text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add New Project (+100 XP)
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#171936] border-[#2B3452] text-[#F4F6FF]">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-[#38D9F5]">Document New Student STEM Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-3 py-2 text-xs">
                  <div>
                    <label className="block text-[#A8B0CC] mb-1 font-semibold">Project Title:</label>
                    <input
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Automatic Solar Well Water Level Monitor"
                      className="w-full rounded-lg bg-[#0B1020] border border-[#2B3452] p-2 text-[#F4F6FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A8B0CC] mb-1 font-semibold">Discipline Domain:</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full rounded-lg bg-[#0B1020] border border-[#2B3452] p-2 text-[#F4F6FF]"
                    >
                      <option value="Electronics">Electronics (CircuitVerse)</option>
                      <option value="Coding">Coding (CodeVerse)</option>
                      <option value="Science">Physical Science</option>
                      <option value="Math">Applied Mathematics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#A8B0CC] mb-1 font-semibold">Description & Findings:</label>
                    <textarea
                      required
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Summarize the circuit logic, physical apparatus, or mathematical algorithm..."
                      className="w-full rounded-lg bg-[#0B1020] border border-[#2B3452] p-2 text-[#F4F6FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A8B0CC] mb-1 font-semibold">Key Competencies (Comma Separated):</label>
                    <input
                      value={newSkills}
                      onChange={(e) => setNewSkills(e.target.value)}
                      className="w-full rounded-lg bg-[#0B1020] border border-[#2B3452] p-2 text-[#F4F6FF]"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#18C7A5] text-[#0B1020] font-bold text-xs mt-3">
                    Publish Project to Portfolio
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Projects Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {d.projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl border border-[#2B3452] bg-[#171D33] p-5 flex flex-col justify-between hover:border-[#38D9F5]/40 transition-all shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge
                  className={`text-[10px] ${
                    proj.category === "Electronics"
                      ? "bg-[#18C7A5]/15 text-[#18C7A5] border-[#18C7A5]/30"
                      : proj.category === "Coding"
                      ? "bg-[#38D9F5]/15 text-[#38D9F5] border-[#38D9F5]/30"
                      : "bg-[#FFC857]/15 text-[#FFC857] border-[#FFC857]/30"
                  }`}
                >
                  {proj.category}
                </Badge>
                <span className="text-[11px] text-[#A8B0CC]">{proj.date}</span>
              </div>

              <h3 className="font-bold text-sm text-[#F4F6FF] mb-1.5">{proj.title}</h3>
              <p className="text-xs text-[#A8B0CC] leading-relaxed line-clamp-3">{proj.description}</p>

              <div className="mt-4 border-t border-[#2B3452]/40 pt-3">
                <span className="text-[10px] font-bold uppercase text-[#A8B0CC] block mb-1.5">Mastered Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {proj.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-[#141A30] border border-[#2B3452] px-2 py-0.5 text-[10px] text-[#38D9F5]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[#2B3452]/40 pt-3 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#FFC857]">+{proj.xpEarned} XP</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedProject(proj)}
                className="border-[#2B3452] text-xs h-8 text-[#F4F6FF] hover:bg-[#1e2544]"
              >
                Project File & Teacher Feedback
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="bg-[#171936] border-[#2B3452] text-[#F4F6FF]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#38D9F5] flex items-center gap-2">
              <FolderGit2 className="h-5 w-5" /> {selectedProject?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4 py-2 text-xs">
              <div className="flex items-center justify-between text-[#A8B0CC] border-b border-[#2B3452]/50 pb-2">
                <span>Domain: <strong>{selectedProject.category}</strong></span>
                <span>Date: <strong>{selectedProject.date}</strong></span>
                <Badge className="bg-[#18C7A5]/20 text-[#18C7A5] border-[#18C7A5]/40 text-[10px]">Verified Submission</Badge>
              </div>

              <div>
                <strong className="text-[#F4F6FF] block mb-1">Architecture & Technical Overview:</strong>
                <p className="text-[#A8B0CC] leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Teacher Feedback Box */}
              <div className="rounded-xl border border-[#38D9F5]/40 bg-[#141A30] p-3 text-xs space-y-1">
                <span className="font-bold text-[#38D9F5] flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> Teacher Feedback (Mrs. K. Lakshmi):
                </span>
                <p className="text-[#F4F6FF] leading-relaxed italic">
                  "Exemplary calculation of current limiting resistor values! Ananya demonstrated exceptional understanding of Ohm's Law and breadboard polarity safety."
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Demonstration Certificate Modal */}
      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="bg-[#0B1020] border-2 border-[#FFC857]/60 text-[#F4F6FF] max-w-lg p-8">
          <div className="border border-[#2B3452] p-6 rounded-xl text-center space-y-4 bg-gradient-to-b from-[#171936] to-[#0B1020]">
            <div className="flex justify-center">
              <Award className="h-12 w-12 text-[#FFC857]" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest text-[#FFC857]">
              Certificate of STEM Diligence
            </h2>
            <p className="text-xs text-[#A8B0CC]">
              This certifies that student explorer
            </p>
            <p className="text-2xl font-bold text-[#F4F6FF] font-serif underline decoration-[#38D9F5]">
              {demoStudent.name}
            </p>
            <p className="text-xs text-[#A8B0CC] max-w-sm mx-auto leading-relaxed">
              has completed verified projects across CircuitVerse and CodeVerse within {demoStudent.school}.
            </p>
            <div className="flex justify-between items-end border-t border-[#2B3452] pt-6 text-[10px] text-[#A8B0CC]">
              <div>
                <span className="font-bold block text-[#F4F6FF]">Mrs. K. Lakshmi</span>
                <span>Science Master</span>
              </div>
              <div className="text-center font-mono text-[9px] text-[#38D9F5]">
                VIDYA-CERT-2026-AR7B
              </div>
              <div>
                <span className="font-bold block text-[#F4F6FF]">VidyaVerse Hub</span>
                <span>Autonomous Mesh Node</span>
              </div>
            </div>
          </div>
          <SimNote>
            Demonstration certificate format for student motivation. Not an official state accreditation.
          </SimNote>
        </DialogContent>
      </Dialog>
    </div>
  );
}
