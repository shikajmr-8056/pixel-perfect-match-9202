import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { classrooms, demoStudent, learningPacks, type AchievementId } from "@/data/demo";

export type Lang = "en" | "hi" | "kn";
export type DownloadState = "none" | "downloading" | "saved";

interface DemoState {
  xp: number;
  weeklyXp: number;
  completed: string[];
  joined: string[];
  unlocked: AchievementId[];
  downloads: Record<string, DownloadState>;
  language: Lang;
  reducedMotion: boolean;
  largeText: boolean;
  notifyAssignments: boolean;
  notifyStreak: boolean;
  wifiOnlyDownloads: boolean;
}

const initial: DemoState = {
  xp: demoStudent.startingXp,
  weeklyXp: 220,
  completed: ["decimals-place-value"],
  joined: ["SCI7B"],
  unlocked: ["first-lesson"],
  downloads: { "pack-math7": "saved", "pack-sci7": "none", "pack-circuit": "none", "pack-sst7": "none" },
  language: "en",
  reducedMotion: false,
  largeText: false,
  notifyAssignments: true,
  notifyStreak: true,
  wifiOnlyDownloads: true,
};

const KEY = "vidyaverse-demo-v1";

export const XP_PER_LEVEL = 250;
export const levelFor = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

interface Ctx extends DemoState {
  level: number;
  addXp: (amount: number, reason: string) => void;
  completeLesson: (id: string) => void;
  unlock: (id: AchievementId) => void;
  joinClass: (code: string) => { ok: boolean; message: string };
  leaveClass: (code: string) => void;
  startDownload: (id: string) => void;
  removeDownload: (id: string) => void;
  set: <K extends keyof DemoState>(k: K, v: DemoState[K]) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt demo storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const persist = { ...state, downloads: Object.fromEntries(Object.entries(state.downloads).map(([k, v]) => [k, v === "downloading" ? "none" : v])) };
    localStorage.setItem(KEY, JSON.stringify(persist));
    document.documentElement.classList.toggle("reduce-motion", state.reducedMotion);
    document.documentElement.classList.toggle("large-text", state.largeText);
    document.documentElement.lang = state.language;
  }, [state, loaded]);

  const unlock = useCallback((id: AchievementId) => {
    setState((s) => {
      if (s.unlocked.includes(id)) return s;
      toast.success("Achievement unlocked", { description: id.replace(/-/g, " ") });
      return { ...s, unlocked: [...s.unlocked, id] };
    });
  }, []);

  const addXp = useCallback((amount: number, reason: string) => {
    setState((s) => ({ ...s, xp: s.xp + amount, weeklyXp: s.weeklyXp + amount }));
    toast(`+${amount} XP`, { description: reason });
  }, []);

  const completeLesson = useCallback(
    (id: string) => {
      setState((s) => {
        if (s.completed.includes(id)) return s;
        return { ...s, completed: [...s.completed, id], xp: s.xp + 20, weeklyXp: s.weeklyXp + 20 };
      });
      toast("+20 XP", { description: "Lesson marked as completed" });
      unlock("first-lesson");
    },
    [unlock],
  );

  const joinClass = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase();
      const c = classrooms.find((x) => x.code === code);
      if (!code) return { ok: false, message: "Enter a classroom code." };
      if (!c) return { ok: false, message: `No demo classroom uses the code "${code}". Try SCI7B, MATH7 or CODE1.` };
      let already = false;
      setState((s) => {
        if (s.joined.includes(code)) {
          already = true;
          return s;
        }
        return { ...s, joined: [...s.joined, code] };
      });
      if (already) return { ok: false, message: `You are already in ${c.name}.` };
      unlock("classmate");
      return { ok: true, message: `Joined ${c.name}.` };
    },
    [unlock],
  );

  const startDownload = useCallback((id: string) => {
    setState((s) => ({ ...s, downloads: { ...s.downloads, [id]: "downloading" } }));
    const pack = learningPacks.find((p) => p.id === id);
    setTimeout(() => {
      setState((s) => (s.downloads[id] === "downloading" ? { ...s, downloads: { ...s.downloads, [id]: "saved" } } : s));
      toast.success("Simulated download finished", { description: pack?.name });
    }, 2500);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      level: levelFor(state.xp),
      addXp,
      completeLesson,
      unlock,
      joinClass,
      leaveClass: (code) => setState((s) => ({ ...s, joined: s.joined.filter((c) => c !== code) })),
      startDownload,
      removeDownload: (id) => setState((s) => ({ ...s, downloads: { ...s.downloads, [id]: "none" } })),
      set: (k, v) => setState((s) => ({ ...s, [k]: v })),
      resetDemo: () => {
        setState(initial);
        toast("Demo progress reset");
      },
    }),
    [state, addXp, completeLesson, unlock, joinClass, startDownload],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
