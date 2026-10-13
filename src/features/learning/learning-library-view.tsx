import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  Download,
  Cloud,
  Clock,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Code2,
  RefreshCw,
  X,
  Play,
  FileText,
  Gamepad2,
  SearchX,
  Check,
  ChevronRight,
  ListChecks,
  HardDriveDownload,
} from "lucide-react";
import { DemoTag, PageHeader, Meter } from "@/components/vv/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared";
import {
  lessons,
  subjects,
  getSubjectTheme,
  learningPacks,
  type Subject,
  type Lesson,
  type CurriculumBoard,
  type Lang,
} from "@/data/demo";
import { useDemo, type DownloadState } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

// Pack mapping for offline subject collections
const packOf: Record<Subject, string> = {
  Mathematics: "pack-math7",
  Science: "pack-sci7",
  "Social Science": "pack-sst7",
  English: "pack-sst7",
  Computing: "pack-math7",
};

export function isLessonSaved(lesson: Lesson, downloads: Record<string, DownloadState>): boolean {
  if (downloads[lesson.id] === "saved") return true;
  if (lesson.packId && downloads[lesson.packId] === "saved") return true;
  const defaultPack = packOf[lesson.subject];
  return Boolean(defaultPack && downloads[defaultPack] === "saved" && lesson.classLevel === 7);
}

export function isLessonDownloading(lesson: Lesson, downloads: Record<string, DownloadState>): boolean {
  if (downloads[lesson.id] === "downloading") return true;
  if (lesson.packId && downloads[lesson.packId] === "downloading") return true;
  const defaultPack = packOf[lesson.subject];
  return Boolean(defaultPack && downloads[defaultPack] === "downloading" && lesson.classLevel === 7);
}

const subjectIcons: Record<Subject, React.ComponentType<{ className?: string }>> = {
  Mathematics: Calculator,
  Science: FlaskConical,
  English: BookOpen,
  "Social Science": Globe,
  Computing: Code2,
};

interface LearningLibraryViewProps {
  initialQuery?: string;
}

export function LearningLibraryView({ initialQuery = "" }: LearningLibraryViewProps) {
  const navigate = useNavigate();
  const d = useDemo();

  // Primary filters
  const [q, setQ] = useState(initialQuery);
  const [board, setBoard] = useState<CurriculumBoard | "All">("All");
  const [cls, setCls] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<Subject | "All">("All");
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<Lang | "All">("All");
  const [contentType, setContentType] = useState<string>("All");
  const [availability, setAvailability] = useState<"All" | "offline-only" | "online">("All");

  // Dynamic available chapters based on subject, class, and board
  const availableChapters = useMemo(() => {
    const pool = lessons.filter(
      (l) =>
        (board === "All" || l.board === board) &&
        (cls === "All" || String(l.classLevel) === cls) &&
        (selectedSubject === "All" || l.subject === selectedSubject),
    );
    return Array.from(new Set(pool.map((l) => l.chapter)));
  }, [board, cls, selectedSubject]);

  // Reset selected chapter if it no longer exists in available chapters
  const validChapter = selectedChapter === "All" || availableChapters.includes(selectedChapter) ? selectedChapter : "All";

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      // Board filter
      if (board !== "All" && l.board !== board) return false;
      // Class filter
      if (cls !== "All" && String(l.classLevel) !== cls) return false;
      // Subject filter
      if (selectedSubject !== "All" && l.subject !== selectedSubject) return false;
      // Chapter filter
      if (validChapter !== "All" && l.chapter !== validChapter) return false;
      // Content type filter
      if (contentType !== "All" && l.type !== contentType) return false;
      // Language filter
      if (selectedLanguage !== "All") {
        const hasLang = l.availableLanguages?.includes(selectedLanguage) || l.language === selectedLanguage;
        if (!hasLang) return false;
      }
      // Offline availability filter
      const isSaved = isLessonSaved(l, d.downloads);
      if (availability === "offline-only" && !isSaved) return false;
      if (availability === "online" && isSaved) return false;

      // Query search across title, chapter, objectives, and summary
      if (q.trim()) {
        const query = q.toLowerCase();
        const searchable = [
          l.title,
          l.chapter,
          l.subject,
          l.summary ?? "",
          ...l.objectives,
          ...l.notes,
        ]
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [board, cls, selectedSubject, validChapter, contentType, selectedLanguage, availability, q, d.downloads]);

  // Group filtered lessons by chapter
  const chaptersInView = useMemo(() => {
    const set = new Set<string>();
    filteredLessons.forEach((l) => set.add(l.chapter));
    return Array.from(set);
  }, [filteredLessons]);

  // Reset all filters
  const resetFilters = () => {
    setQ("");
    setBoard("All");
    setCls("All");
    setSelectedSubject("All");
    setSelectedChapter("All");
    setSelectedLanguage("All");
    setContentType("All");
    setAvailability("All");
    navigate({ to: "/learn", search: {} });
  };

  const hasActiveFilters =
    q !== "" ||
    board !== "All" ||
    cls !== "All" ||
    selectedSubject !== "All" ||
    validChapter !== "All" ||
    selectedLanguage !== "All" ||
    contentType !== "All" ||
    availability !== "All";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Curriculum Library"
        description="Structured curriculum syllabus organized by board, class, chapter, and learning objective. Download packs to study anywhere without internet."
        eyebrow={
          <div className="flex items-center gap-2">
            <DemoTag>NCERT & State Board Aligned</DemoTag>
            <span className="text-[11px] font-semibold text-muted-foreground">· 13 Sample Modules</span>
          </div>
        }
      />

      {/* 1. Consistent Subject Overview with Progress & Recognizable Icons */}
      <section aria-labelledby="subjects-overview-heading">
        <div className="flex items-center justify-between mb-3.5">
          <h2 id="subjects-overview-heading" className="text-sm font-bold text-foreground">
            Subject Progress & Collections
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            {lessons.filter((l) => d.completed.includes(l.id)).length} of {lessons.length} total lessons completed
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(["All", ...subjects] as const).map((s) => {
            const isAll = s === "All";
            const isSelected = selectedSubject === s;
            const subjectLessons = isAll ? lessons : lessons.filter((l) => l.subject === s);
            const completedCount = subjectLessons.filter((l) => d.completed.includes(l.id)).length;
            const pct = subjectLessons.length > 0 ? Math.round((completedCount / subjectLessons.length) * 100) : 0;
            const theme = !isAll ? getSubjectTheme(s) : { primary: "#6541F5", tint: "#EAE7FF", border: "#6541F5", meterTone: "purple" as const };
            const Icon = !isAll ? subjectIcons[s] : BookOpen;
            const packId = !isAll ? packOf[s] : "";
            const isPackSaved = Boolean(packId && d.downloads[packId] === "saved");

            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSelectedSubject(s);
                  setSelectedChapter("All");
                }}
                className={cn(
                  "flex flex-col text-left p-3.5 rounded-xl border transition-all shadow-sm",
                  isSelected
                    ? "border-[#6541F5] ring-2 ring-[#6541F5]/20 bg-card shadow-md"
                    : "border-border bg-card hover:border-[#6541F5]/40 hover:bg-[#F5F5FF]/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: theme.tint, color: theme.primary }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {isPackSaved && (
                    <Badge variant="outline" className="text-[10px] bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/40 font-bold px-1.5 py-0">
                      Offline ✓
                    </Badge>
                  )}
                </div>

                <div className="mt-3">
                  <p className="font-bold text-xs text-foreground truncate">{isAll ? "All Subjects" : s}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {subjectLessons.length} {subjectLessons.length === 1 ? "lesson" : "lessons"}
                  </p>
                </div>

                <div className="mt-3 w-full">
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: theme.primary }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Structured Curriculum Hierarchy Selectors & Search Filter Bar */}
      <section className="card-surface p-5 rounded-2xl border border-border shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Curriculum Filter Bar
            </span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-[10px] bg-[#6541F5]/10 text-[#6541F5] font-bold">
                Filters Active
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Reset all filters
            </Button>
          )}
        </div>

        {/* 6 Integrated Dropdown Controls: Board, Class, Chapter, Language, Type, Availability */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {/* Board Selector */}
          <label className="text-xs font-semibold text-muted-foreground">
            Curriculum Board
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={board}
              onChange={(e) => {
                setBoard(e.target.value as CurriculumBoard | "All");
                setSelectedChapter("All");
              }}
            >
              <option value="All">All Boards</option>
              <option value="NCERT">NCERT (Central)</option>
              <option value="Karnataka State Board">Karnataka State Board</option>
            </select>
          </label>

          {/* Class Level Selector */}
          <label className="text-xs font-semibold text-muted-foreground">
            Grade / Class
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={cls}
              onChange={(e) => {
                setCls(e.target.value);
                setSelectedChapter("All");
              }}
            >
              <option value="All">All Grades (6-8)</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
            </select>
          </label>

          {/* Chapter Selector (Dynamically populated from matching lessons) */}
          <label className="text-xs font-semibold text-muted-foreground">
            Chapter
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={validChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              <option value="All">All Chapters ({availableChapters.length})</option>
              {availableChapters.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </label>

          {/* Preferred Language Selector */}
          <label className="text-xs font-semibold text-muted-foreground">
            Language
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Lang | "All")}
            >
              <option value="All">All Languages</option>
              <option value="en">English (English)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </label>

          {/* Content Type Selector */}
          <label className="text-xs font-semibold text-muted-foreground">
            Content Format
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="All">All Formats</option>
              <option value="Video">Video Lessons</option>
              <option value="Reading">Illustrated Reading</option>
              <option value="Activity">Interactive Activity</option>
            </select>
          </label>

          {/* Offline Availability Filter */}
          <label className="text-xs font-semibold text-muted-foreground">
            Offline Storage
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={availability}
              onChange={(e) => setAvailability(e.target.value as "All" | "offline-only" | "online")}
            >
              <option value="All">All Content</option>
              <option value="offline-only">Downloaded Only ✓</option>
              <option value="online">Online / Needs Download</option>
            </select>
          </label>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-24 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-[#6541F5] focus:outline-none"
            value={q}
            placeholder="Search topics, objectives, notes (e.g. fractions, circuits, photosynthesis, past tense)..."
            onChange={(e) => {
              const val = e.target.value;
              setQ(val);
              navigate({ to: "/learn", search: { q: val || undefined }, replace: true });
            }}
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                navigate({ to: "/learn", search: {} });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Selected Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[11px] font-bold text-muted-foreground mr-1">Active:</span>
            {board !== "All" && (
              <Badge variant="outline" className="text-[10px] bg-card border-border font-medium">
                Board: {board}
              </Badge>
            )}
            {cls !== "All" && (
              <Badge variant="outline" className="text-[10px] bg-card border-border font-medium">
                Class {cls}
              </Badge>
            )}
            {selectedSubject !== "All" && (
              <Badge variant="outline" className="text-[10px] bg-card border-border font-medium">
                Subject: {selectedSubject}
              </Badge>
            )}
            {validChapter !== "All" && (
              <Badge variant="outline" className="text-[10px] bg-card border-border font-medium">
                Chapter: {validChapter}
              </Badge>
            )}
            {selectedLanguage !== "All" && (
              <Badge variant="outline" className="text-[10px] bg-card border-border font-medium">
                Language: {selectedLanguage.toUpperCase()}
              </Badge>
            )}
            {contentType !== "All" && (
              <Badge variant="outline" className="text-[10px] bg-card border-border font-medium">
                Type: {contentType}
              </Badge>
            )}
            {availability !== "All" && (
              <Badge variant="outline" className="text-[10px] bg-card border-border font-medium">
                {availability === "offline-only" ? "Downloaded Only" : "Online Only"}
              </Badge>
            )}
            <span className="text-[11px] text-muted-foreground ml-auto font-medium">
              Showing {filteredLessons.length} {filteredLessons.length === 1 ? "lesson" : "lessons"}
            </span>
          </div>
        )}
      </section>

      {/* 3. Empty State Handling (When No Lessons Match Filters) */}
      {filteredLessons.length === 0 ? (
        <EmptyState
          title="No lessons match these filters"
          description={
            availability === "offline-only"
              ? "You don't have any downloaded lessons matching this filter yet. Clear the filter or download packs from online mode."
              : "Try choosing a different board, class level, or keyword to explore the representative curriculum."
          }
          icon={SearchX}
          action={{
            label: "Clear all filters",
            onClick: resetFilters,
          }}
        />
      ) : (
        /* 4. Structured Chapters View: Chapters, Objectives, Quizzes, STEM Links */
        <div className="space-y-10">
          {chaptersInView.map((chapterTitle) => {
            const chapterLessons = filteredLessons.filter((l) => l.chapter === chapterTitle);
            const firstLesson = chapterLessons[0]!;
            const theme = getSubjectTheme(firstLesson.subject);
            const chapterCompletedCount = chapterLessons.filter((l) => d.completed.includes(l.id)).length;
            const chapterPct = Math.round((chapterCompletedCount / chapterLessons.length) * 100);

            // Related chapter pack
            const pack = learningPacks.find((p) => p.id === firstLesson.packId) ||
              learningPacks.find((p) => p.name.toLowerCase().includes(firstLesson.subject.toLowerCase().split(" ")[0] || ""));
            const packState = pack ? d.downloads[pack.id] : undefined;

            return (
              <section
                key={chapterTitle}
                className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
              >
                {/* Chapter Banner & Overview Header */}
                <div className="flex flex-col gap-3 pb-2 border-b border-border/60 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-md px-2 py-0.5 text-[11px] font-bold"
                        style={{
                          backgroundColor: theme.tint,
                          color: theme.primary,
                          border: `1px solid ${theme.border}40`,
                        }}
                      >
                        {firstLesson.subject}
                      </span>
                      <span className="text-xs text-muted-foreground font-semibold">
                        Class {firstLesson.classLevel} · {firstLesson.board ?? "NCERT"}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-lg font-black text-foreground tracking-tight">
                      {chapterTitle}
                    </h3>
                    {firstLesson.summary && (
                      <p className="mt-1 text-xs text-muted-foreground max-w-2xl leading-relaxed">
                        {firstLesson.summary}
                      </p>
                    )}
                  </div>

                  {/* Chapter Progress & Offline Pack Download Action */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">
                        {chapterCompletedCount} of {chapterLessons.length} finished
                      </p>
                      <div className="mt-1 w-28">
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${chapterPct}%`, backgroundColor: theme.primary }}
                          />
                        </div>
                      </div>
                    </div>

                    {pack && (
                      <Button
                        size="sm"
                        variant={packState === "saved" ? "secondary" : "outline"}
                        disabled={packState === "downloading"}
                        onClick={() => d.startDownload(pack.id)}
                        className={cn(
                          "h-8 text-xs font-bold",
                          packState === "saved" && "bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/40 hover:bg-[#DDF8EE]",
                        )}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        {packState === "saved"
                          ? "Chapter Offline Ready ✓"
                          : packState === "downloading"
                          ? "Downloading Pack..."
                          : `Download Chapter (${pack.sizeMb} MB)`}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Chapter Lessons Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {chapterLessons.map((lesson) => {
                    const isCompleted = d.completed.includes(lesson.id);
                    const isSaved = isLessonSaved(lesson, d.downloads);
                    const isDownloading = isLessonDownloading(lesson, d.downloads);
                    const lessonTheme = getSubjectTheme(lesson.subject);

                    return (
                      <div
                        key={lesson.id}
                        className={cn(
                          "group flex flex-col justify-between rounded-xl border p-4.5 transition-all shadow-sm",
                          isCompleted
                            ? "border-[#19B99A]/30 bg-card hover:border-[#19B99A]/60"
                            : "border-border bg-card hover:border-[#6541F5]/40 hover:shadow-md",
                        )}
                      >
                        <div>
                          {/* Card Top Pill Bar: Status & Content Type */}
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="flex items-center gap-1.5">
                              {lesson.type === "Video" ? (
                                <span className="inline-flex items-center gap-1 rounded bg-[#EAE7FF] px-2 py-0.5 text-[10px] font-bold text-[#6541F5]">
                                  <Play className="h-2.5 w-2.5 fill-current" /> Video
                                </span>
                              ) : lesson.type === "Reading" ? (
                                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                                  <FileText className="h-2.5 w-2.5" /> Reading
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded bg-[#FFF0D5] px-2 py-0.5 text-[10px] font-bold text-[#F5A623]">
                                  <Gamepad2 className="h-2.5 w-2.5" /> Activity
                                </span>
                              )}
                              <span className="text-[11px] font-medium text-muted-foreground">
                                {lesson.durationMin} mins
                              </span>
                            </span>

                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#19B99A]">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Done
                              </span>
                            )}
                          </div>

                          {/* Lesson Title */}
                          <Link
                            to="/lesson/$id"
                            params={{ id: lesson.id }}
                            className="block font-bold text-sm text-foreground group-hover:text-[#6541F5] leading-snug transition-colors"
                          >
                            {lesson.title}
                          </Link>

                          {/* Learning Objectives Preview */}
                          <div className="mt-3 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Learning Objectives:
                            </p>
                            <ul className="space-y-1 text-[11px] text-muted-foreground">
                              {lesson.objectives.slice(0, 2).map((obj) => (
                                <li key={obj} className="flex items-start gap-1.5 leading-snug">
                                  <Check className="h-3 w-3 mt-0.5 shrink-0 text-[#19B99A]" />
                                  <span className="line-clamp-1">{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Bottom Metadata & Primary Action */}
                        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                          {/* Offline / Storage Status Badge */}
                          <div className="flex items-center gap-1.5">
                            {isSaved ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#19B99A]">
                                <HardDriveDownload className="h-3 w-3" /> Offline Cached
                              </span>
                            ) : isDownloading ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0284C7] animate-pulse">
                                <Download className="h-3 w-3" /> Downloading...
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                <Cloud className="h-3 w-3" /> Online ({lesson.sizeMb} MB)
                              </span>
                            )}
                          </div>

                          {/* Open Lesson Button */}
                          <Button asChild size="sm" variant="ghost" className="h-7 text-xs font-bold text-[#6541F5] group-hover:bg-[#EAE7FF]/50 p-1.5">
                            <Link to="/lesson/$id" params={{ id: lesson.id }}>
                              Study <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chapter Secondary Learning Elements: Assessment Quiz & STEM Sandbox Links */}
                <div className="mt-2 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#F5F5FF]/50 p-3 rounded-xl">
                  <div className="flex flex-wrap items-center gap-4">
                    {firstLesson.quizId && (
                      <Link
                        to="/quiz/$id"
                        params={{ id: firstLesson.quizId }}
                        className="inline-flex items-center gap-1.5 font-bold text-[#6541F5] hover:underline"
                      >
                        <ListChecks className="h-3.5 w-3.5 text-[#6541F5]" /> Chapter Assessment Quiz →
                      </Link>
                    )}
                    {firstLesson.stemActivity && (
                      <Link
                        to={firstLesson.stemActivity.route as any}
                        className="inline-flex items-center gap-1.5 font-bold text-[#19B99A] hover:underline"
                      >
                        <Gamepad2 className="h-3.5 w-3.5 text-[#19B99A]" /> {firstLesson.stemActivity.badge}: {firstLesson.stemActivity.title} →
                      </Link>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Ver: {firstLesson.version ?? "v2.0.0"} · Multi-lingual Transcripts
                  </span>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
