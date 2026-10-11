import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gamepad2, CircuitBoard, Code2, WifiOff, MessageCircleQuestion, GraduationCap, BookOpen, Network, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/vv/primitives";
import { PublicFooter, PublicHeader } from "@/components/vv/public-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VidyaVerse · Lessons, games, circuits and coding for school students" },
      { name: "description", content: "Explore curriculum lessons, solve challenges, and learn electronics and coding, even when internet access is limited." },
      { property: "og:title", content: "VidyaVerse · A Universe of Learning" },
      { property: "og:description", content: "Curriculum lessons, PlayLab games, CircuitVerse electronics and CodeVerse coding, designed for limited internet." },
    ],
  }),
  component: Landing,
});

function HeroArt() {
  return (
    <svg viewBox="0 0 420 320" className="h-auto w-full" role="img" aria-label="Illustration: a lesson card, a lit bulb circuit and a code block orbiting a learning centre">
      <rect x="0" y="0" width="420" height="320" rx="20" className="fill-primary" />
      <ellipse cx="210" cy="160" rx="170" ry="70" fill="none" strokeWidth="1.5" strokeDasharray="4 6" className="stroke-teal" transform="rotate(-12 210 160)" />
      <circle cx="210" cy="160" r="34" className="fill-saffron" />
      <path d="M198 160h24M210 148v24" strokeWidth="4" strokeLinecap="round" className="stroke-primary" />
      <g transform="translate(40 50)">
        <rect width="120" height="74" rx="10" className="fill-card" />
        <rect x="12" y="14" width="60" height="8" rx="4" className="fill-primary" />
        <rect x="12" y="30" width="96" height="6" rx="3" className="fill-muted" />
        <rect x="12" y="44" width="80" height="6" rx="3" className="fill-muted" />
        <rect x="12" y="58" width="56" height="6" rx="3" className="fill-teal" />
      </g>
      <g transform="translate(270 40)">
        <rect width="110" height="90" rx="10" className="fill-card" />
        <path d="M20 60 h20 v-30 h40 v30 h10" fill="none" strokeWidth="3" className="stroke-primary" />
        <circle cx="60" cy="30" r="10" className="fill-saffron" />
        <rect x="16" y="56" width="10" height="14" className="fill-teal" />
      </g>
      <g transform="translate(250 210)">
        <rect width="130" height="70" rx="10" className="fill-card" />
        <rect x="12" y="14" width="50" height="14" rx="4" className="fill-teal" />
        <rect x="24" y="34" width="70" height="14" rx="4" className="fill-saffron" />
        <rect x="12" y="54" width="40" height="8" rx="4" className="fill-muted" />
      </g>
      <g transform="translate(50 220)">
        <rect width="110" height="56" rx="10" className="fill-card" />
        <circle cx="24" cy="28" r="10" className="fill-teal" />
        <rect x="42" y="18" width="54" height="7" rx="3" className="fill-primary" />
        <rect x="42" y="32" width="40" height="7" rx="3" className="fill-muted" />
      </g>
    </svg>
  );
}

const features = [
  { icon: Gamepad2, name: "PlayLab", to: "/playlab", text: "Curriculum games for the classroom floor and the screen. Math Ludo, Newton's Race and CodeBot Maze each teach one clear concept, and physical games work without any device." },
  { icon: CircuitBoard, name: "CircuitVerse", to: "/circuitverse", text: "Learn electronics from cell and switch to series circuits. Place parts on a workspace, close the loop and see why the bulb lights, then debug broken circuits." },
  { icon: Code2, name: "CodeVerse", to: "/codeverse", text: "Computational thinking from Class 5 up. Sequence commands, spot the bug in an algorithm and solve beginner challenges with instant feedback." },
] as const;

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
          <div>
            <p className="text-sm font-semibold text-teal-strong">For school students, Class 5 to 9</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-primary md:text-5xl">Learn concepts. Build skills. Explore more.</h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">Explore curriculum lessons, solve challenges, and learn electronics and coding, even when internet access is limited.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/dashboard">Explore learning <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/learn">Browse lessons</Link></Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">This is a working prototype with demo data. No account is needed.</p>
          </div>
          <HeroArt />
        </section>

        <section className="border-y bg-card">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3 md:px-6">
            {[
              { icon: BookOpen, t: "Lessons that follow the syllabus", d: "Short video, reading and activity lessons arranged by class, subject and chapter, each with a practice quiz." },
              { icon: Lightbulb, t: "Help when you get stuck", d: "Concept Detective spots common mistakes and points you to the lesson that fixes them." },
              { icon: GraduationCap, t: "Visible to your teacher", d: "Teachers see assignments, quiz results and topic gaps for their classroom." },
            ].map((x) => (
              <div key={x.t} className="flex gap-4">
                <IconBox><x.icon /></IconBox>
                <div><h2 className="text-base font-semibold">{x.t}</h2><p className="mt-1 text-sm text-muted-foreground">{x.d}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-semibold">Three ways to learn by doing</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {features.map((f, i) => (
              <article key={f.name} className="card-surface flex flex-col p-6">
                <IconBox tone={i === 0 ? "saffron" : i === 1 ? "teal" : "primary"}><f.icon /></IconBox>
                <h3 className="mt-4 text-lg font-semibold">{f.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{f.text}</p>
                <Link to={f.to} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Open {f.name} <ArrowRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-16 md:grid-cols-2 md:px-6">
          <div className="panel-feature bg-primary p-8 text-primary-foreground">
            <WifiOff className="h-6 w-6 text-saffron" />
            <h2 className="mt-4 text-2xl font-semibold">Built for patchy internet</h2>
            <p className="mt-3 text-primary-foreground/80">Download learning packs when you have a connection, then study without one. With Learning Mesh, a school can share packs over its local network so each student does not use mobile data for the same video.</p>
            <ul className="mt-4 space-y-1.5 text-sm text-primary-foreground/80">
              <li>Works offline: downloaded lessons, quizzes, PlayLab activities</li>
              <li>Needs internet: first download, syncing progress, live AI answers</li>
            </ul>
            <Button asChild variant="saffron" className="mt-6"><Link to="/mesh"><Network /> How Learning Mesh works</Link></Button>
          </div>
          <div className="panel-feature border bg-card p-8">
            <MessageCircleQuestion className="h-6 w-6 text-teal-strong" />
            <h2 className="mt-4 text-2xl font-semibold">An AI tutor that gives hints first</h2>
            <p className="mt-3 text-muted-foreground">Ask a question in English, Hindi or Kannada. The tutor starts with a hint so you do the thinking, then explains and offers a practice question.</p>
            <p className="mt-3 text-sm text-muted-foreground">In this prototype the tutor uses a fixed set of prepared answers. No AI model is connected yet.</p>
            <Button asChild variant="outline" className="mt-6"><Link to="/tutor">Try the demo tutor</Link></Button>
          </div>
        </section>

        <section className="border-t bg-card">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:px-6">
            <div>
              <h2 className="text-xl font-semibold">For students</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Pick up where you left off with one clear next lesson.</li>
                <li>Earn XP for completed lessons, quizzes and challenges.</li>
                <li>Join your class with a code from your teacher.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold">For teachers</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Assign lessons and quizzes to a classroom.</li>
                <li>See which topics students find hard, with sync times shown.</li>
                <li>Run PlayLab games in class, with or without devices.</li>
              </ul>
              <Button asChild variant="outline" className="mt-5"><Link to="/teacher">See the teacher view</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
