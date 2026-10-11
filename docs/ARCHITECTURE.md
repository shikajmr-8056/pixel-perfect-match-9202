# VidyaVerse — System Architecture & Technology Decisions

> **Architecture Style:** Component-driven, Offline-First Jamstack / SSR Client  
> **Primary Framework:** TanStack Start + React 19 + Vite  
> **Source of Truth:** `package.json`, `src/routes/`, `src/lib/demo-store.tsx`

---

## 1. Verified Technology Stack

| Layer | Technology | Version | Purpose in VidyaVerse |
| :--- | :--- | :--- | :--- |
| **Language** | TypeScript | `5.8.3` | Strict type safety across all routes and components |
| **Runtime & Bundler** | Vite | `8.1.5` | Fast HMR dev server and production asset compilation |
| **UI Framework** | React | `19.2.0` | Declarative UI and component tree |
| **Routing & SSR** | TanStack Start / Router | `1.170.x` | File-based type-safe routing with layout nesting |
| **Styling Engine** | Tailwind CSS v4 | `4.2.1` | Native `@theme` engine with CSS variable tokens |
| **Headless UI** | Radix UI | Latest | Accessible accessible dialogs, dropdowns, switches, tabs |
| **Command Palette** | `cmdk` | `1.1.1` | Keyboard shortcut (`Ctrl+K`) search across modules |
| **Icons** | Lucide React | `0.575.0` | Comprehensive icon library |
| **Toast Notifications**| Sonner | `2.0.7` | Action feedback and achievement notifications |
| **Testing Engine** | Vitest + JSDOM | `4.1.x` | Unit and integration test runner |

---

## 2. Repository Directory Structure

```
d:/repos/pixel-perfect-match-9202/
├── docs/                     # Vibe Coding project documentation
├── public/                   # Static assets, manifests, icons
├── src/
│   ├── components/
│   │   ├── ui/               # Radix/shadcn atomic primitives (Button, Badge, Dialog)
│   │   └── vv/               # VidyaVerse primitives (Logo, Panel, Meter, Nav)
│   ├── data/
│   │   └── demo.ts           # Static mock dataset (lessons, quizzes, classrooms)
│   ├── lib/
│   │   ├── demo-store.tsx    # React Context & persistence store
│   │   └── utils.ts          # Class merging (`cn`) helper
│   ├── routes/
│   │   ├── __root.tsx        # HTML document shell, head tags, global providers
│   │   ├── index.tsx         # Public marketing landing page
│   │   ├── _shell.tsx        # Persistent sidebar, command palette, header shell
│   │   ├── _shell.dashboard.tsx  # Student dashboard
│   │   ├── _shell.playlab.tsx    # PlayLab maze & math ludo
│   │   ├── _shell.circuitverse.tsx # Breadboard simulator
│   │   ├── _shell.codeverse.tsx  # Visual block coding
│   │   ├── _shell.tutor.tsx      # Concept Detective diagnostic chat
│   │   ├── _shell.mesh.tsx       # Offline mesh visualizer
│   │   └── [13 other route files]
│   ├── styles.css            # Tailwind v4 theme, tokens & utility rules
│   └── routeTree.gen.ts      # TanStack Router auto-generated route tree
├── AGENTS.md                 # Root instructions for AI coding assistants
├── package.json              # Project dependencies and script commands
├── tsconfig.json             # Strict TypeScript compiler options
└── vite.config.ts            # Vite & TanStack Router compiler plugins
```

---

## 3. Client State Management & Persistence

### 3.1 Store Architecture (`src/lib/demo-store.tsx`)

Global application state is managed using a dedicated React Context (`DemoContext`) accessed via `useDemo()`. State is automatically synchronized to the browser's `localStorage` under the key:

```typescript
const KEY = "vidyaverse-demo-v4";
```

### 3.2 State Properties

```typescript
interface DemoState {
  role: "student" | "teacher" | "parent";
  theme: "light" | "dark";
  networkMode: "online" | "mesh" | "offline";
  pendingSyncCount: number;
  lastSyncTime: string;
  xp: number;
  weeklyXp: number;
  completed: string[];
  joined: string[];
  unlocked: AchievementId[];
  downloads: Record<string, "none" | "downloading" | "saved">;
  language: "en" | "hi" | "kn";
  reducedMotion: boolean;
  largeText: boolean;
  wifiOnlyDownloads: boolean;
  redeemedItems: string[];
  completedChallenges: string[];
  projects: StudentProject[];
}
```

### 3.3 Core Action Mutations

* `addXp(amount, reason)`: Increments lifetime and weekly XP, triggers Sonner toast notification.
* `completeLesson(id)`: Marks lesson ID as completed, adds 25 XP. If in `offline` or `mesh` mode, increments `pendingSyncCount`.
* `syncNow()`: Simulates network reconciliation with the school Raspberry Pi micro-hub, resetting `pendingSyncCount` to 0.
* `joinClass(code)`: Validates code (`SCI7B`, `MATH7`, `CODE1`) and appends to student cohort.
* `redeemItem(name, cost)`: Deducts XP and records cosmetic or physical reward redemption.

---

## 4. Routing & Layout Model

TanStack Router utilizes a path prefixing hierarchy:
1. **Root (`__root.tsx`)**: Establishes `QueryClientProvider`, `DemoProvider`, HTML `<head>` tags, and global toast containers.
2. **Public Routes (`/`, `/privacy`, `/terms`)**: Render standalone pages with `PublicHeader` and `PublicFooter`.
3. **Application Shell (`_shell.tsx`)**: Acts as a pathless layout container. Renders the fixed desktop sidebar, mobile drawer, global header, search palette, and renders child routes via `<Outlet />`.

---

## 5. Offline-First & Mesh Protocol Architecture

### Current Simulation:
The application simulates a 3-tier connectivity spectrum:
1. **`online`**: Cloud internet connection.
2. **`mesh`**: Local Wi-Fi connection to a school Raspberry Pi hub. Content loads from local storage without external bandwidth.
3. **`offline`**: Zero connectivity. Content loads from downloaded packs; learning events queue in `pendingSyncCount`.

### Unresolved Production Architecture:
* **Database Engine:** SQLite on Raspberry Pi hub vs. PostgreSQL/Supabase in cloud.
* **Sync Strategy:** CRDTs (Conflict-free Replicated Data Types) vs. append-only event logs with cryptographic timestamps.
* **Service Worker:** Native PWA caching for binary media assets (videos, audio voice models) vs. IndexedDB storage.
* **Edge AI Engine:** Client-side WebLLM / ONNX runtime vs. local Ollama instance running on the village hub.
