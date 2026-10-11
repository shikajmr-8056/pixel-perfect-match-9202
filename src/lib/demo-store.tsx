import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { classrooms, demoStudent, learningPacks, type AchievementId } from "@/data/demo";

export type Lang = "en" | "hi" | "kn";
export type UserRole = "student" | "teacher" | "parent";
export type NetworkMode = "online" | "mesh" | "offline";
export type DownloadState = "none" | "downloading" | "saved";

export interface StudentProject {
  id: string;
  title: string;
  category: "Electronics" | "Coding" | "Science" | "Math";
  date: string;
  status: "completed" | "draft" | "submitted";
  xpEarned: number;
  description: string;
  skills: string[];
}

interface DemoState {
  role: UserRole;
  theme: "dark" | "light";
  networkMode: NetworkMode;
  pendingSyncCount: number;
  lastSyncTime: string;
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
  redeemedItems: string[];
  completedChallenges: string[];
  projects: StudentProject[];
}

const initialProjects: StudentProject[] = [
  {
    id: "proj-1",
    title: "Dual-Switch Emergency Lantern Circuit",
    category: "Electronics",
    date: "8 Oct 2026",
    status: "completed",
    xpEarned: 120,
    description: "Designed in CircuitVerse: Parallel switch setup with an LED array and a 9V battery emulator for rural night-study.",
    skills: ["Ohm's Law", "Parallel Circuits", "LED Polarities"],
  },
  {
    id: "proj-2",
    title: "Automatic Crop Irrigation Maze Logic",
    category: "Coding",
    date: "4 Oct 2026",
    status: "completed",
    xpEarned: 150,
    description: "Built in CodeVerse: Step-by-step block sequence guiding an autonomous water sprinkler robot around field obstacles.",
    skills: ["Loops", "Conditional Logic", "Pathfinding"],
  },
  {
    id: "proj-3",
    title: "Deccan Plateau Soil & Water Filtration Model",
    category: "Science",
    date: "1 Oct 2026",
    status: "submitted",
    xpEarned: 90,
    description: "Physical PlayLab eco-experiment using gravel, charcoal, and sand layers to test river water purification.",
    skills: ["Ecosystems", "Sedimentation", "Data Logging"],
  },
];

const initial: DemoState = {
  role: "student",
  theme: "light",
  networkMode: "online",
  pendingSyncCount: 2,
  lastSyncTime: "11 Oct 2026, 12:45 PM",
  xp: demoStudent.startingXp,
  weeklyXp: 260,
  completed: ["decimals-place-value"],
  joined: ["SCI7B"],
  unlocked: ["first-lesson"],
  downloads: { "pack-math7": "saved", "pack-sci7": "saved", "pack-circuit": "none", "pack-sst7": "none" },
  language: "en",
  reducedMotion: false,
  largeText: false,
  notifyAssignments: true,
  notifyStreak: true,
  wifiOnlyDownloads: true,
  redeemedItems: ["Solar Torch Badge"],
  completedChallenges: ["daily-fractions-1"],
  projects: initialProjects,
};

const KEY = "vidyaverse-demo-v4";

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
  syncNow: () => void;
  redeemItem: (name: string, cost: number) => { ok: boolean; message: string };
  completeChallenge: (id: string, xpReward: number, title: string) => void;
  addProject: (project: Omit<StudentProject, "id" | "date">) => void;
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
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({ ...initial, ...parsed });
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const persist = {
      ...state,
      downloads: Object.fromEntries(
        Object.entries(state.downloads).map(([k, v]) => [k, v === "downloading" ? "none" : v])
      ),
    };
    localStorage.setItem(KEY, JSON.stringify(persist));

    // Theme handling
    document.documentElement.classList.toggle("light", state.theme === "light");
    document.documentElement.classList.toggle("dark", state.theme === "dark");
    document.documentElement.classList.toggle("reduce-motion", state.reducedMotion);
    document.documentElement.classList.toggle("large-text", state.largeText);
    document.documentElement.lang = state.language;
  }, [state, loaded]);

  const unlock = useCallback((id: AchievementId) => {
    setState((s) => {
      if (s.unlocked.includes(id)) return s;
      toast.success("Achievement Unlocked!", { description: id.replace(/-/g, " ") });
      return { ...s, unlocked: [...s.unlocked, id] };
    });
  }, []);

  const addXp = useCallback((amount: number, reason: string) => {
    setState((s) => ({ ...s, xp: s.xp + amount, weeklyXp: s.weeklyXp + amount }));
    toast.success(`+${amount} XP Awarded`, { description: reason });
  }, []);

  const completeLesson = useCallback(
    (id: string) => {
      setState((s) => {
        if (s.completed.includes(id)) return s;
        const pendingInc = s.networkMode !== "online" ? 1 : 0;
        return {
          ...s,
          completed: [...s.completed, id],
          xp: s.xp + 25,
          weeklyXp: s.weeklyXp + 25,
          pendingSyncCount: s.pendingSyncCount + pendingInc,
        };
      });
      toast.success("+25 XP", { description: "Lesson completed and recorded" });
      unlock("first-lesson");
    },
    [unlock]
  );

  const syncNow = useCallback(() => {
    setState((s) => ({
      ...s,
      pendingSyncCount: 0,
      lastSyncTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " (Just now)",
    }));
    toast.success("School Mesh Synchronized", {
      description: "Offline quizzes, challenge milestones, and completed lessons synced with school server.",
    });
  }, []);

  const redeemItem = useCallback((name: string, cost: number) => {
    let result = { ok: false, message: "" };
    setState((s) => {
      if (s.redeemedItems.includes(name)) {
        result = { ok: false, message: "You already redeemed this item!" };
        return s;
      }
      if (s.xp < cost) {
        result = { ok: false, message: `Need ${cost - s.xp} more XP to redeem.` };
        return s;
      }
      result = { ok: true, message: `Successfully claimed ${name}!` };
      return {
        ...s,
        xp: s.xp - cost,
        redeemedItems: [...s.redeemedItems, name],
      };
    });
    return result;
  }, []);

  const completeChallenge = useCallback(
    (id: string, xpReward: number, title: string) => {
      setState((s) => {
        if (s.completedChallenges.includes(id)) {
          toast.info("Challenge already completed");
          return s;
        }
        toast.success(`Challenge Completed: +${xpReward} XP`, { description: title });
        return {
          ...s,
          completedChallenges: [...s.completedChallenges, id],
          xp: s.xp + xpReward,
          weeklyXp: s.weeklyXp + xpReward,
        };
      });
    },
    []
  );

  const addProject = useCallback((project: Omit<StudentProject, "id" | "date">) => {
    const newProj: StudentProject = {
      ...project,
      id: `proj-${Date.now()}`,
      date: "Today",
    };
    setState((s) => ({
      ...s,
      projects: [newProj, ...s.projects],
      xp: s.xp + 100,
    }));
    toast.success("+100 XP", { description: `Project added to portfolio: ${project.title}` });
  }, []);

  const joinClass = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase();
      const c = classrooms.find((x) => x.code === code);
      if (!code) return { ok: false, message: "Enter a classroom code." };
      if (!c) return { ok: false, message: `No demo classroom uses "${code}". Try SCI7B, MATH7 or CODE1.` };
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
    [unlock]
  );

  const startDownload = useCallback((id: string) => {
    setState((s) => ({ ...s, downloads: { ...s.downloads, [id]: "downloading" } }));
    const pack = learningPacks.find((p) => p.id === id);
    setTimeout(() => {
      setState((s) => (s.downloads[id] === "downloading" ? { ...s, downloads: { ...s.downloads, [id]: "saved" } } : s));
      toast.success("Download Finished", { description: `${pack?.name} is available offline.` });
    }, 1800);
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
      removeDownload: (id) => {
        setState((s) => ({ ...s, downloads: { ...s.downloads, [id]: "none" } }));
        toast.info("Content pack removed from offline storage");
      },
      syncNow,
      redeemItem,
      completeChallenge,
      addProject,
      set: (k, v) => setState((s) => ({ ...s, [k]: v })),
      resetDemo: () => {
        setState(initial);
        toast("Demo state reset to defaults");
      },
    }),
    [state, addXp, completeLesson, unlock, joinClass, startDownload, syncNow, redeemItem, completeChallenge, addProject]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
