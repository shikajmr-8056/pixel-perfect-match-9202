import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, FileText, ListChecks, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoTag, Meter, Panel } from "@/components/vv/primitives";
import { lessons, learningPacks } from "@/data/demo";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/_shell/lesson/$id")({
  loader: ({ params }) => {
    const lesson = lessons.find((l) => l.id === params.id);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.lesson.title} · VidyaVerse` : "Lesson not found · VidyaVerse";
    const desc = loaderData ? `${loaderData.lesson.subject}, ${loaderData.lesson.chapter}.` : "This lesson does not exist.";
    return { meta: [{ title: t }, { name: "description", content: desc }, { property: "og:title", content: t }, { property: "og:description", content: desc }] };
  },
  notFoundComponent: () => (
    <div className="card-surface p-10 text-center"><p className="font-semibold">Lesson not found</p><Link to="/learn" className="mt-3 inline-block text-primary underline">Back to library</Link></div>
  ),
  component: LessonPage,
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const d = useDemo();
  const chapter = lessons.filter((l) => l.chapter === lesson.chapter);
  const idx = chapter.findIndex((l) => l.id === lesson.id);
  const prev = chapter[idx - 1];
  const next = chapter[idx + 1];
  const done = d.completed.includes(lesson.id);
  const chapterDone = chapter.filter((l) => d.completed.includes(l.id)).length;
  const subjectKeyword = lesson.subject === "Mathematics" ? "math" : (lesson.subject.toLowerCase().split(" ")[0] || "");
  const pack = learningPacks.find((p) => p.name.toLowerCase().includes(subjectKeyword));
  const packState = pack ? d.downloads[pack.id] : undefined;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Library</Link>
        <p className="mt-3 text-sm font-semibold text-teal-strong">{lesson.subject} · {lesson.chapter}</p>
        <h1 className="mt-1 text-[26px] font-semibold md:text-[30px]">{lesson.title}</h1>
        <div className="mt-3 flex max-w-md items-center gap-3 text-sm text-muted-foreground">
          <Meter value={(chapterDone / chapter.length) * 100} label="Chapter progress" />
          <span className="shrink-0">Lesson {idx + 1} of {chapter.length}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="panel-feature dot-grid flex aspect-video flex-col items-center justify-center border bg-card p-6 text-center">
            {lesson.type === "Video" ? <PlayCircle className="h-12 w-12 text-primary/40" /> : <FileText className="h-12 w-12 text-primary/40" />}
            <p className="mt-3 font-semibold">{lesson.type === "Video" ? "Video not included in this prototype" : `${lesson.type} lesson`}</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{lesson.type === "Video" ? `Planned length ${lesson.durationMin} minutes. Study the notes below in the meantime.` : "Work through the notes and objectives below."}</p>
          </div>

          <Panel title="Lesson notes">
            <ol className="space-y-3">
              {lesson.notes.map((n, i) => (
                <li key={i} className="flex gap-3 text-[15px]"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-soft text-xs font-semibold text-primary">{i + 1}</span>{n}</li>
              ))}
            </ol>
          </Panel>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {prev ? <Button asChild variant="outline"><Link to="/lesson/$id" params={{ id: prev.id }}><ArrowLeft />Previous</Link></Button> : <span />}
            {next ? <Button asChild variant="outline"><Link to="/lesson/$id" params={{ id: next.id }}>Next lesson<ArrowRight /></Link></Button> : <span className="text-sm text-muted-foreground">Last lesson in this chapter</span>}
          </div>
        </div>

        <div className="space-y-6">
          <Panel title="You will learn to">
            <ul className="space-y-2 text-sm">
              {lesson.objectives.map((o) => <li key={o} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-strong" />{o}</li>)}
            </ul>
          </Panel>
          <div className="card-surface space-y-3 p-5">
            <Button className="w-full" variant={done ? "outline" : "default"} disabled={done} onClick={() => d.completeLesson(lesson.id)}>
              <CheckCircle2 />{done ? "Completed" : "Mark as completed (+20 XP)"}
            </Button>
            {lesson.quizId && <Button asChild variant="teal" className="w-full"><Link to="/quiz/$id" params={{ id: lesson.quizId }}><ListChecks />Practice quiz</Link></Button>}
            {pack && (
              <Button variant="outline" className="w-full" disabled={packState !== "none"} onClick={() => d.startDownload(pack.id)}>
                <Download />{packState === "saved" ? "Pack marked downloaded" : packState === "downloading" ? "Downloading (simulated)" : `Download pack (${pack.sizeMb} MB, demo)`}
              </Button>
            )}
            <DemoTag>Download is simulated</DemoTag>
          </div>
          <Panel title="Related">
            <ul className="space-y-2 text-sm">
              {lessons.filter((l) => l.subject === lesson.subject && l.id !== lesson.id).slice(0, 3).map((l) => (
                <li key={l.id}><Link to="/lesson/$id" params={{ id: l.id }} className="text-primary hover:underline">{l.title}</Link></li>
              ))}
              <li><Link to="/tutor" search={{}} className="text-primary hover:underline">Check common mistakes in Concept Detective</Link></li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
