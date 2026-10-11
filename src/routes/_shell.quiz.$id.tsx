import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Meter, Panel } from "@/components/vv/primitives";
import { quizzes } from "@/data/demo";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";
import { scoreQuiz } from "@/lib/quiz";

export const Route = createFileRoute("/_shell/quiz/$id")({
  loader: ({ params }) => {
    const quiz = quizzes[params.id];
    if (!quiz) throw notFound();
    return { quiz, id: params.id };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.quiz.title} · VidyaVerse` : "Quiz not found · VidyaVerse";
    return { meta: [{ title: t }, { name: "description", content: "Practice quiz with explanations." }, { property: "og:title", content: t }, { property: "og:description", content: "Practice quiz with explanations." }] };
  },
  notFoundComponent: () => <div className="card-surface p-10 text-center">Quiz not found. <Link to="/learn" className="text-primary underline">Back to library</Link></div>,
  component: Quiz,
});

function Quiz() {
  const { quiz } = Route.useLoaderData();
  const d = useDemo();
  const qs = quiz.questions;
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => qs.map(() => null));
  const [submitted, setSubmitted] = useState<boolean[]>(() => qs.map(() => false));
  const [finished, setFinished] = useState(false);
  const q = qs[i];
  const pick = answers[i];
  const isSub = submitted[i];

  const reset = () => { setI(0); setAnswers(qs.map(() => null)); setSubmitted(qs.map(() => false)); setFinished(false); };

  if (finished) {
    const score = scoreQuiz(qs, answers);
    const wrong = qs.filter((x, k) => answers[k] !== x.correct);
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Panel>
          <p className="text-sm text-muted-foreground">{quiz.title} · result</p>
          <p className="mt-2 font-display text-4xl font-semibold text-primary">{score} / {qs.length}</p>
          <p className="mt-2">{score === qs.length ? "Full marks. You earned the Quiz Ace badge." : "Good effort. Review the topics below and try again."}</p>
          <p className="mt-1 text-xs text-muted-foreground">Scores are kept only for this session and are not sent anywhere.</p>
        </Panel>
        {wrong.length > 0 && (
          <Panel title="Revise these topics">
            <ul className="space-y-2 text-sm">{wrong.map((w) => <li key={w.id}><span className="font-medium">{w.topic}:</span> {w.explanation}</li>)}</ul>
            <Link to="/lesson/$id" params={{ id: quiz.lessonId }} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Open the lesson</Link>
          </Panel>
        )}
        <div className="flex gap-3"><Button onClick={reset}><RotateCcw />Try again</Button><Button asChild variant="outline"><Link to="/dashboard">Back to dashboard</Link></Button></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <p className="text-sm text-muted-foreground">{quiz.title}</p>
        <div className="mt-2 flex items-center gap-3"><Meter value={(submitted.filter(Boolean).length / qs.length) * 100} label="Quiz progress" /><span className="shrink-0 text-sm">{i + 1} / {qs.length}</span></div>
      </div>
      <nav aria-label="Questions" className="flex gap-2">
        {qs.map((x, k) => (
          <button key={x.id} onClick={() => setI(k)} aria-current={k === i} aria-label={`Question ${k + 1}`} className={cn("h-9 w-9 rounded-lg border text-sm font-semibold", k === i && "border-primary bg-primary text-primary-foreground", k !== i && submitted[k] && (answers[k] === x.correct ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive"))}>{k + 1}</button>
        ))}
      </nav>
      <Panel>
        <h1 className="text-lg font-semibold">{q.text}</h1>
        <div role="radiogroup" className="mt-5 space-y-2">
          {q.options.map((o, k) => {
            const state = isSub ? (k === q.correct ? "right" : k === pick ? "wrong" : "") : pick === k ? "picked" : "";
            return (
              <button key={o} role="radio" aria-checked={pick === k} disabled={isSub} onClick={() => setAnswers((a) => a.map((v, j) => (j === i ? k : v)))}
                className={cn("flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-[15px]", state === "picked" && "border-saffron bg-saffron-soft", state === "right" && "border-success bg-success-soft", state === "wrong" && "border-destructive bg-destructive-soft", !state && !isSub && "hover:bg-accent")}>
                {o}{state === "right" && <CheckCircle2 className="h-5 w-5 text-success" />}{state === "wrong" && <XCircle className="h-5 w-5 text-destructive" />}
              </button>
            );
          })}
        </div>
        {isSub && (
          <div className={cn("mt-4 rounded-lg p-4 text-sm", pick === q.correct ? "bg-success-soft" : "bg-destructive-soft")} role="status">
            <p className="font-semibold">{pick === q.correct ? "Correct" : "Not quite"}</p>
            <p className="mt-1">{q.explanation}</p>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          {!isSub ? (
            <Button disabled={pick === null} onClick={() => setSubmitted((s) => s.map((v, j) => (j === i ? true : v)))}>Submit answer</Button>
          ) : i < qs.length - 1 ? (
            <Button onClick={() => setI(i + 1)}>Next question<ArrowRight /></Button>
          ) : (
            <Button variant="teal" disabled={submitted.some((s) => !s)} onClick={() => {
              setFinished(true);
              const score = scoreQuiz(qs, answers);
              d.addXp(score * 10 + (score === qs.length ? 50 : 0), `${quiz.title}: ${score}/${qs.length}`);
              if (score === qs.length) d.unlock("quiz-ace");
            }}>See results</Button>
          )}
        </div>
        {isSub && i === qs.length - 1 && submitted.some((s) => !s) && <p className="mt-2 text-right text-xs text-muted-foreground">Answer every question to see results.</p>}
      </Panel>
    </div>
  );
}
