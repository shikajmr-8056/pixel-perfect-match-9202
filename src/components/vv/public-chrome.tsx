import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "@/components/vv/primitives";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 md:px-6">
        <Link to="/" aria-label="VidyaVerse home"><Logo /></Link>
        <nav aria-label="Public" className="ml-auto hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/playlab" className="hover:text-foreground">PlayLab</Link>
          <Link to="/circuitverse" className="hover:text-foreground">CircuitVerse</Link>
          <Link to="/codeverse" className="hover:text-foreground">CodeVerse</Link>
          <Link to="/mesh" className="hover:text-foreground">Offline learning</Link>
        </nav>
        <Button asChild size="sm" className="ml-auto md:ml-0"><Link to="/dashboard">Sign in (demo)</Link></Button>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">A Universe of Learning. Prototype, not yet launched.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Learn</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/learn" className="hover:text-foreground">Lesson library</Link></li>
            <li><Link to="/playlab" className="hover:text-foreground">PlayLab</Link></li>
            <li><Link to="/circuitverse" className="hover:text-foreground">CircuitVerse</Link></li>
            <li><Link to="/codeverse" className="hover:text-foreground">CodeVerse</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">For schools</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/teacher" className="hover:text-foreground">Teacher view</Link></li>
            <li><Link to="/parent" className="hover:text-foreground">Parent view</Link></li>
            <li><Link to="/mesh" className="hover:text-foreground">Learning Mesh</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <p className="mt-3 text-sm text-muted-foreground">[Contact email to be added]</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms and Conditions</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { h: string; body: ReactNode }[] }) {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <p className="inline-flex rounded-md border border-dashed border-warning/40 bg-warning-soft px-2 py-1 text-xs font-semibold text-warning">Draft. Not legally reviewed. Placeholders in [brackets].</p>
        <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{updated}</p>
        <nav aria-label="Sections" className="card-surface mt-6 p-4">
          <ol className="grid gap-1 text-sm sm:grid-cols-2">
            {sections.map((s, i) => <li key={s.h}><a className="text-primary hover:underline" href={`#s${i}`}>{i + 1}. {s.h}</a></li>)}
          </ol>
        </nav>
        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <section key={s.h} id={`s${i}`} className="scroll-mt-20">
              <h2 className="text-xl font-semibold">{i + 1}. {s.h}</h2>
              <div className="mt-2 space-y-2 text-[15px] leading-relaxed text-muted-foreground">{s.body}</div>
            </section>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
