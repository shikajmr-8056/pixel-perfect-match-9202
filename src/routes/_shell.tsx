import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell, Search, Languages, Menu, Wifi, WifiOff, ChevronDown, Flame, Sparkles,
  Sun, Moon, RefreshCw, Radio, Check, ChevronRight, ShieldCheck,
  GraduationCap, HeartHandshake, User, ArrowUpRight
} from "lucide-react";
import { Logo, NetworkTag } from "@/components/vv/primitives";
import {
  allNav, primaryNav, labsNav, progressNav, rolesNav, langNames, type NavItem
} from "@/components/vv/nav";
import { useDemo, type Lang, type UserRole, type NetworkMode } from "@/lib/demo-store";
import { classrooms, demoStudent, lessons } from "@/data/demo";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell")({
  component: Shell,
});

function NavLinkItem({ item, onNavigate }: { item: NavItem; onNavigate?: (() => void) | undefined }) {
  const { language } = useDemo();
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className="group flex h-10 items-center justify-between rounded-xl px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-[#F4F2FF] hover:text-[#6541F5] dark:hover:bg-[#25253B] dark:hover:text-[#7C5CFA]"
      activeProps={{
        className: "bg-[#6541F5] text-white font-semibold shadow-sm shadow-[#6541F5]/25 hover:bg-[#5230E8] hover:text-white dark:bg-[#7C5CFA] dark:text-white",
        "aria-current": "page",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" aria-hidden="true" />
        <span className="truncate">{item.label[language]}</span>
      </div>
      {item.badge && (
        <span className="rounded-md bg-[#D8D5FF]/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#5230E8] group-hover:text-inherit dark:bg-[#7C5CFA]/20 dark:text-[#D8D5FF]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function NavSection({ title, items, onNavigate }: { title: string; items: NavItem[]; onNavigate?: (() => void) | undefined }) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75">
        {title}
      </p>
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => (
          <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  );
}

function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const demo = useDemo();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  // Keyboard shortcut for Cmd/Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const current = allNav.find((n) => pathname === n.to || (pathname.startsWith(n.to + "/") && n.to !== "/"));
  const pageTitle = pathname.startsWith("/quiz")
    ? "Quiz"
    : pathname.startsWith("/lesson")
    ? "Lesson"
    : current?.label[demo.language] ?? "Home";

  const notifications = [
    { id: "1", title: "Class 7B Science Practical", desc: "Bring one cell & two wires on Thursday.", time: "1 hr ago", tag: "Class" },
    { id: "2", title: "Daily Mission Active", desc: "Score 100% on Fractions quiz for +50 XP", time: "Today", tag: "Mission" },
    { id: "3", title: "Mesh Sync Pending", desc: `${demo.pendingSyncCount} offline activities ready to sync with school hub.`, time: demo.lastSyncTime, tag: "Sync" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>

      {/* Global Command Palette */}
      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="Search universe of lessons, labs, experiments or pages..." />
        <CommandList className="max-h-96">
          <CommandEmpty>No matching learning module found.</CommandEmpty>
          <CommandGroup heading="Core Pages & Labs">
            {allNav.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.to}
                  onSelect={() => {
                    navigate({ to: item.to });
                    setCmdOpen(false);
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary dark:text-[#38D9F5]" />
                    <span>{item.label[demo.language]}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase">{item.category}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="Curriculum Lessons">
            {lessons.map((lesson) => (
              <CommandItem
                key={lesson.id}
                onSelect={() => {
                  navigate({ to: "/lesson/$id", params: { id: lesson.id } });
                  setCmdOpen(false);
                }}
                className="cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{lesson.title}</span>
                  <span className="text-xs text-muted-foreground">{lesson.subject} · {lesson.chapter}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        {/* Brand header */}
        <div className="flex h-16 items-center px-5 border-b border-sidebar-border bg-sidebar/80 backdrop-blur">
          <Link to="/" aria-label="VidyaVerse home">
            <Logo />
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <NavSection title="Core Learning" items={primaryNav} />
          <NavSection title="Creative & STEM Labs" items={labsNav} />
          <NavSection title="Progress & Community" items={progressNav} />
          <NavSection title="Roles & Settings" items={rolesNav} />
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-4 bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-foreground">Kalyan School Hub</span>
            <span className="text-[10px] font-mono">v2.4 Demo</span>
          </div>
          <div className="flex items-center justify-between bg-card px-2.5 py-1.5 rounded-lg border border-border">
            <span>Pending sync: <strong className="text-primary dark:text-[#38D9F5]">{demo.pendingSyncCount}</strong></span>
            <button
              onClick={demo.syncNow}
              className="text-primary dark:text-[#38D9F5] hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="h-3 w-3" /> Sync
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            {/* Mobile Sheet Trigger */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-foreground hover:bg-accent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar border-r border-sidebar-border p-0 text-sidebar-foreground">
                <SheetHeader className="p-4 border-b border-sidebar-border">
                  <SheetTitle asChild>
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                      <Logo />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto px-3 py-4 max-h-[calc(100vh-80px)]">
                  <NavSection title="Core Learning" items={primaryNav} onNavigate={() => setMenuOpen(false)} />
                  <NavSection title="Creative & STEM Labs" items={labsNav} onNavigate={() => setMenuOpen(false)} />
                  <NavSection title="Progress & Community" items={progressNav} onNavigate={() => setMenuOpen(false)} />
                  <NavSection title="Roles & Settings" items={rolesNav} onNavigate={() => setMenuOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Logo */}
            <Link to="/" className="lg:hidden">
              <Logo className="[&>div:last-child]:hidden sm:[&>div:last-child]:flex" />
            </Link>

            {/* Current Page Title */}
            <div className="hidden lg:flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">{pageTitle}</h1>
            </div>

            {/* Centered Search Bar */}
            <div className="mx-auto hidden md:flex items-center justify-center w-full max-w-sm">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchVal.trim()) {
                      navigate({ to: "/learn", search: { q: searchVal.trim() } });
                    }
                  }}
                  placeholder="Search lessons"
                  className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-12 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <button
                  onClick={() => setCmdOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border"
                  title="Search Palette"
                >
                  Ctrl+K
                </button>
              </div>
            </div>

            {/* Right Header Badges & Actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Network Connectivity Status Pill */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-accent transition-colors">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      demo.networkMode === "online" ? "bg-[#31B98A]" : demo.networkMode === "mesh" ? "bg-[#6541F5]" : "bg-[#F4B942]"
                    )} />
                    <span className="capitalize">{demo.networkMode === "online" ? "Browser online" : demo.networkMode === "mesh" ? "School mesh" : "Offline"} · Demo mode</span>
                    <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground border-border">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Connection Simulator</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={demo.networkMode} onValueChange={(v) => demo.set("networkMode", v as NetworkMode)}>
                    <DropdownMenuRadioItem value="online" className="cursor-pointer">
                      <Wifi className="h-4 w-4 mr-2 text-[#31B98A]" />
                      <div>
                        <p className="font-medium text-xs">Cloud Online</p>
                        <p className="text-[10px] text-muted-foreground">Standard internet</p>
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="mesh" className="cursor-pointer">
                      <Radio className="h-4 w-4 mr-2 text-[#6541F5] dark:text-[#7C5CFA]" />
                      <div>
                        <p className="font-medium text-xs">School Mesh</p>
                        <p className="text-[10px] text-muted-foreground">Micro-hub local Wi-Fi</p>
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="offline" className="cursor-pointer">
                      <WifiOff className="h-4 w-4 mr-2 text-[#F4B942]" />
                      <div>
                        <p className="font-medium text-xs">Autonomous Offline</p>
                        <p className="text-[10px] text-muted-foreground">Queues pending sync</p>
                      </div>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button size="sm" onClick={demo.syncNow} className="w-full text-xs font-semibold h-8 bg-[#6541F5] hover:bg-[#5230E8] text-white">
                      <RefreshCw className="h-3 w-3 mr-1" /> Force Sync Now
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                    <Languages className="h-4 w-4" />
                    <span className="hidden sm:inline">{langNames[demo.language]}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-border">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={demo.language} onValueChange={(l) => demo.set("language", l as Lang)}>
                    <DropdownMenuRadioItem value="en" className="cursor-pointer">English</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="hi" className="cursor-pointer">हिन्दी (Hindi)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="kn" className="cursor-pointer">ಕನ್ನಡ (Kannada)</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => demo.set("theme", demo.theme === "dark" ? "light" : "dark")}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title={`Switch to ${demo.theme === "dark" ? "Light Mode" : "Dark Mode"}`}
              >
                {demo.theme === "dark" ? (
                  <Sun className="h-4 w-4 text-[#F4B942]" />
                ) : (
                  <Moon className="h-4 w-4 text-[#6541F5]" />
                )}
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-popover text-popover-foreground border-border p-0">
                  <div className="flex items-center justify-between p-3 border-b border-border">
                    <span className="font-semibold text-xs">Class & Mesh Alerts</span>
                    <Badge variant="outline" className="text-[10px]">3 New</Badge>
                  </div>
                  <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-accent transition-colors">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                          <span className="font-semibold text-primary">{n.tag}</span>
                          <span>{n.time}</span>
                        </div>
                        <p className="text-xs font-medium text-foreground">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Student Avatar / Role Indicator */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-lg border border-border bg-[#FFC857]/20 p-1.5 text-xs font-bold text-[#b48216] dark:text-[#FFC857] hover:bg-[#FFC857]/30 transition-colors">
                    <span className="flex h-6 w-6 items-center justify-center rounded font-extrabold text-xs">
                      AR
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 bg-popover text-popover-foreground border-border">
                  <DropdownMenuLabel className="text-xs">
                    <p className="font-bold text-foreground">{demoStudent.name}</p>
                    <p className="text-[10px] text-muted-foreground font-normal">Class 7B · Kalyan School</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={demo.role}
                    onValueChange={(r) => {
                      const role = r as UserRole;
                      demo.set("role", role);
                      if (role === "teacher") navigate({ to: "/teacher" });
                      else if (role === "parent") navigate({ to: "/parent" });
                      else navigate({ to: "/dashboard" });
                    }}
                  >
                    <DropdownMenuRadioItem value="student" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      <span>Student (Ananya)</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="teacher" className="cursor-pointer">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <span>Teacher (Mrs. Lakshmi)</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="parent" className="cursor-pointer">
                      <HeartHandshake className="h-4 w-4 mr-2" />
                      <span>Parent (Guardian)</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
