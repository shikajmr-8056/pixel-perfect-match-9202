import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Search, Languages, Menu, Wifi, WifiOff, ChevronDown, Flame, Sparkles } from "lucide-react";
import { Logo } from "@/components/vv/primitives";
import { allNav, exploreNav, langNames, primaryNav, type NavItem } from "@/components/vv/nav";
import { useDemo, type Lang } from "@/lib/demo-store";
import { classrooms, demoStudent } from "@/data/demo";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell")({
  component: Shell,
});

function useBrowserOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

function NavLinkItem({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const { language } = useDemo();
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className="group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground", "aria-current": "page" }}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label[language]}</span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      {primaryNav.map((i) => <NavLinkItem key={i.to} item={i} onNavigate={onNavigate} />)}
      <p className="mt-5 mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Explore</p>
      {exploreNav.map((i) => <NavLinkItem key={i.to} item={i} onNavigate={onNavigate} />)}
    </nav>
  );
}

function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const demo = useDemo();
  const online = useBrowserOnline();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const current = allNav.find((n) => pathname === n.to || pathname.startsWith(n.to + "/"));
  const title = pathname.startsWith("/quiz") ? "Quiz" : current?.label[demo.language] ?? "VidyaVerse";
  const myAnnouncements = classrooms.filter((c) => demo.joined.includes(c.code)).flatMap((c) => c.announcements.map((a) => ({ ...a, cls: c.name })));

  return (
    <div className="min-h-screen bg-background">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">Skip to content</a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-16 items-center px-5">
          <Link to="/" aria-label="VidyaVerse home"><Logo /></Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4"><NavList /></div>
        <div className="border-t p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Prototype build</p>
          <p className="mt-0.5">Progress is stored only in this browser.</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <Link to="/" className="lg:hidden" aria-label="VidyaVerse home"><Logo className="[&>span:last-child]:hidden sm:[&>span:last-child]:inline" /></Link>
            <p className="hidden truncate font-display text-[15px] font-semibold text-foreground lg:block">{title}</p>

            <form
              role="search"
              className="relative ml-auto hidden w-full max-w-xs md:block"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/learn", search: { q: q.trim() || undefined } });
              }}
            >
              <label htmlFor="global-search" className="sr-only">Search lessons</label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input id="global-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lessons" className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-teal" />
            </form>

            <div className="ml-auto flex items-center gap-1 md:ml-2">
              <span className={cn("hidden items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium xl:inline-flex", online ? "text-success" : "text-warning")} title="Reported by your browser. School mesh connection is simulated.">
                {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                {online ? "Browser online" : "Browser offline"}
                <span className="text-muted-foreground">· Demo mode</span>
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium hover:bg-accent" aria-label={`Language: ${langNames[demo.language]}`}>
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline">{langNames[demo.language]}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Interface language</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={demo.language} onValueChange={(v) => demo.set("language", v as Lang)}>
                    {(Object.keys(langNames) as Lang[]).map((l) => (
                      <DropdownMenuRadioItem key={l} value={l}>{langNames[l]}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <p className="px-2 py-1 text-xs text-muted-foreground">Demo translates navigation labels only.</p>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent" aria-label="Classroom announcements">
                  <Bell className="h-[18px] w-[18px]" />
                  {myAnnouncements.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-saffron" aria-hidden="true" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Announcements from your demo classrooms</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {myAnnouncements.length === 0 ? (
                    <p className="px-2 py-3 text-sm text-muted-foreground">Join a classroom to see teacher announcements here.</p>
                  ) : (
                    myAnnouncements.map((a, i) => (
                      <DropdownMenuItem key={i} onSelect={() => navigate({ to: "/classrooms" })} className="flex-col items-start gap-0.5">
                        <span className="text-xs text-muted-foreground">{a.cls} · {a.date}</span>
                        <span className="text-sm">{a.text}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 rounded-lg pl-1 pr-2 hover:bg-accent" aria-label="Student profile menu">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-saffron-soft font-display text-sm font-semibold text-saffron-strong">AR</span>
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel>
                    <span className="block">{demoStudent.name}</span>
                    <span className="block text-xs font-normal text-muted-foreground">Class {demoStudent.classLevel}{demoStudent.section} · Demo profile</span>
                  </DropdownMenuLabel>
                  <div className="flex gap-3 px-2 pb-2 text-xs">
                    <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-saffron-strong" />{demo.xp} XP</span>
                    <span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-warning" />{demoStudent.streakDays}-day streak</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate({ to: "/progress" })}>My progress</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate({ to: "/settings" })}>Settings</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate({ to: "/" })}>Exit to public site</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-[1240px] px-4 pb-28 pt-6 md:px-6 lg:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav aria-label="Primary mobile" className="fixed inset-x-0 bottom-0 z-30 border-t bg-card lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {primaryNav.filter((n) => ["/dashboard", "/learn", "/playlab", "/tutor"].includes(n.to)).map((n) => (
            <Link key={n.to} to={n.to} className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground" activeProps={{ className: "text-primary", "aria-current": "page" }}>
              <n.icon className="h-5 w-5" aria-hidden="true" />
              <span className="max-w-full truncate px-1">{n.label[demo.language]}</span>
            </Link>
          ))}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground">
              <Menu className="h-5 w-5" aria-hidden="true" />
              More
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] overflow-y-auto p-4">
              <SheetHeader className="px-0"><SheetTitle><Logo /></SheetTitle></SheetHeader>
              <div className="mt-2"><NavList onNavigate={() => setMenuOpen(false)} /></div>
              <p className={cn("mt-6 inline-flex items-center gap-1.5 text-xs", online ? "text-success" : "text-warning")}>
                {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                {online ? "Browser online" : "Browser offline"} · Demo mode
              </p>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
