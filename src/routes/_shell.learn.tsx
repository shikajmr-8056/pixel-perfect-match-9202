import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, CheckCircle2, Download, SearchX, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { DemoTag, PageHeader } from "@/components/vv/primitives";
import { Button } from "@/components/ui/button";
import { lessons, subjects, type Subject } from "@/data/demo";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/learn")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined } => ({ q: typeof s["q"] === "string" ? (s["q"] as string) : undefined }),
  head: () => ({ meta: [{ title: "Learning library · VidyaVerse" }, { name: "description", content: "Browse lessons by curriculum, class, subject and chapter." }, { property: "og:title", content: "Learning library · VidyaVerse" }, { property: "og:description", content: "Browse lessons by curriculum, class, subject and chapter." }] }),
  component: Library,
});

const packOf: Record<Subject, string> = { Mathematics: "pack-math7", Science: "pack-sci7", "Social Science": "pack-sst7", English: "", Computing: "" };

function Library() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate();
  const d = useDemo();
  const [subject, setSubject] = useState<Subject | "All">("All");
  const [type, setType] = useState("All");
  const [curriculum, setCurriculum] = useState("NCERT-aligned");
  const [cls, setCls] = useState("7");

  const list = useMemo(
    () =>
      lessons.filter(
        (l) =>
          String(l.classLevel) === cls &&
          (subject === "All" || l.subject === subject) &&
          (type === "All" || l.type === type) &&
          (!q || (l.title + l.chapter + l.subject).toLowerCase().includes(q.toLowerCase())),
      ),
    [q, subject, type, cls],
  );
  const chapters = [...new Set(list.map((l) => l.chapter))];
  const sel = "h-10 rounded-lg border border-input bg-card px-3 text-sm";

  return (
    <div>
      <PageHeader title="Learning library" description="Lessons grouped by chapter. Each has learning objectives, notes and a practice quiz where available." eyebrow={<DemoTag>Sample content</DemoTag>} />
      <div className="card-surface mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium text-muted-foreground">Curriculum
          <select className={cn(sel, "mt-1 w-full text-foreground")} value={curriculum} onChange={(e) => setCurriculum(e.target.value)}>
            <option>NCERT-aligned</option><option>Karnataka State Board</option>
          </select>
        </label>
        <label className="text-xs font-medium text-muted-foreground">Class
          <select className={cn(sel, "mt-1 w-full text-foreground")} value={cls} onChange={(e) => setCls(e.target.value)}>
            {[5, 6, 7, 8, 9].map((c) => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-muted-foreground">Type
          <select className={cn(sel, "mt-1 w-full text-foreground")} value={type} onChange={(e) => setType(e.target.value)}>
            {["All", "Video", "Reading", "Activity"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-muted-foreground">Search
          <span className="relative mt-1 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input className={cn(sel, "w-full pl-9 text-foreground")} value={q} placeholder="e.g. fractions" onChange={(e) => navigate({ to: "/learn", search: { q: e.target.value || undefined }, replace: true })} />
          </span>
        </label>
      </div>
      {curriculum !== "NCERT-aligned" && <p className="mb-4 text-sm text-muted-foreground">Board-specific ordering is not in the demo yet. Showing the same sample lessons.</p>}

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Subjects">
        {(["All", ...subjects] as const).map((s) => {
          const isActive = subject === s;
          return (
            <button
              key={s}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSubject(s)}
              className={cn(
                "h-9 shrink-0 rounded-lg px-4 text-xs font-bold transition-all shadow-sm",
                isActive
                  ? "bg-[#6541F5] text-white shadow-[#6541F5]/25"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-[#6541F5]/40"
              )}
            >
              {s}
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="card-surface flex flex-col items-center p-10 text-center">
          <SearchX className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No lessons match these filters</p>
          <p className="mt-1 text-sm text-muted-foreground">{cls !== "7" ? `The demo only includes Class 7 lessons.` : "Try a different word or clear the filters."}</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSubject("All"); setType("All"); setCls("7"); navigate({ to: "/learn", search: {} }); }}>Clear filters</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {chapters.map((ch) => (
            <section key={ch}>
              <h2 className="mb-3 text-base font-bold text-foreground">{ch}</h2>
              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {list.filter((l) => l.chapter === ch).map((l) => {
                  const done = d.completed.includes(l.id);
                  const offline = d.downloads[packOf[l.subject]] === "saved";

                  // Subject colorful tag mapping
                  const subjectStyles: Record<string, { bg: string; text: string; border: string }> = {
                    Mathematics: { bg: "#DDF2FC", text: "#42A5E8", border: "#42A5E8" },
                    Science: { bg: "#DDF8EE", text: "#19B99A", border: "#19B99A" },
                    Computing: { bg: "#EAE7FF", text: "#6541F5", border: "#6541F5" },
                    "Social Science": { bg: "#FFF0D5", text: "#F5A623", border: "#F5A623" },
                    English: { bg: "#FCE5EB", text: "#E95778", border: "#E95778" },
                  };
                  const style = subjectStyles[l.subject] || { bg: "#EAE7FF", text: "#6541F5", border: "#6541F5" };

                  return (
                    <Link
                      key={l.id}
                      to="/lesson/$id"
                      params={{ id: l.id }}
                      className="card-surface flex flex-col p-4.5 rounded-xl transition-all hover:border-[#6541F5]/40 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className="rounded-md px-2 py-0.5 text-[11px] font-bold"
                          style={{
                            backgroundColor: style.bg,
                            color: style.text,
                            border: `1px solid ${style.border}30`,
                          }}
                        >
                          {l.subject}
                        </span>
                        {done && (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#28B987] text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Done
                          </span>
                        )}
                      </div>
                      <p className="mt-2.5 font-bold text-sm text-foreground leading-snug">{l.title}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 text-xs text-muted-foreground font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-[#42A5E8]" /> {l.durationMin} min
                        </span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{l.type}</span>
                        <span className="inline-flex items-center gap-1">
                          <Download className="h-3.5 w-3.5 text-[#19B99A]" />
                          {offline ? "In downloaded pack" : `${l.sizeMb} MB`}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
