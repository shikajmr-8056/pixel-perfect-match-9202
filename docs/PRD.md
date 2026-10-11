# VidyaVerse — Product Requirements Document (PRD)

> **Tagline:** A Universe of Learning  
> **Target Audience:** Rural and underserved students, government school teachers, and guardians across India  
> **Current Version:** v2.4 (Hackathon-Ready Interactive Frontend Prototype)  
> **Status:** Live Prototype (Frontend client with simulated offline/mesh/AI capabilities)

---

## 1. Executive Summary & Vision

India's rural education system faces severe constraints: intermittent cellular connectivity, prohibitive data costs, shared household smartphones, and rote textbook memorization. 

**VidyaVerse** transforms rural STEM education into an interactive, gamified universe. Built on an offline-first foundation, it enables students to run virtual circuit simulations, solve algorithmic mazes, interact with an AI Concept Detective tutor, and sync academic progress over local school micro-mesh hubs without active internet access.

---

## 2. User Personas

| Persona | Role | Primary Needs & Pain Points |
| :--- | :--- | :--- |
| **Ananya R.** (Student, Class 7B) | Rural middle-school learner | Limited daily phone access, high data costs, wants engaging game-based learning (Math Ludo, CodeBot). |
| **Mrs. K. Lakshmi** (Teacher) | Govt. school science teacher | Multi-grade classrooms, wants automated misconception diagnosis, zero-internet classroom roster sync. |
| **Ramesh R.** (Guardian / Parent) | Rural artisan / farmer | Non-English speaker, anxious about screen time, needs vernacular progress summaries and kitchen-math home activities. |

---

## 3. Product Features & Route Matrix

### 3.1 Core Learning
* **Home Landing (`/`)**: Public hero presentation, feature cards, and offline micro-hub benefits.
* **Student Dashboard (`/dashboard`)**: Daily mission card, Continue Learning featured banner, XP/streak stat tiles, recommended lessons, STEM shortcuts, and classroom leaderboard snapshot.
* **Curriculum Library (`/learn`)**: NCERT-aligned lessons indexed by subject (Math, Science, Social Science, Computing), class grade level, and media type.
* **Lesson Viewer (`/lesson/$id`)**: Multimedia reader featuring objective checklists, conceptual analogies, embedded video simulation, downloadable pack triggers, and quiz shortcuts.
* **Interactive Quiz Engine (`/quiz/$id`)**: Timed/untimed single-select and multi-select questions with immediate rationale explanations, XP rewards, and error tagging.

### 3.2 Creative & STEM Labs
* **PlayLab (`/playlab`)**: Playable CodeBot Maze (drag-and-drop instruction runner) and Math Ludo (dice-roll fraction/arithmetic challenge), alongside 5 board-game blueprints (Newton's Race, Bharat Explorer, EcoQuest).
* **CircuitVerse (`/circuitverse`)**: Real-time virtual breadboard simulator with Ohm's Law physics ($I = V/R$), voltage and resistor sliders, glowing LED illumination, and burnout protection warnings.
* **CodeVerse (`/codeverse`)**: Visual block coding environment featuring loops, conditionals, a terminal output runner, and live Python / Arduino C++ code generation bridges.
* **AI Concept Detective (`/tutor`)**: Diagnostic tutor that identifies root cognitive misconceptions (e.g., adding numerators directly in fractions) using village analogies instead of answering directly.
* **VidyaVerse Voice (`/voice`)**: Regional audio guide with multilingual voice playback (English, Hindi, Kannada) and microphone audio wave visualizer.

### 3.3 Offline & Community Systems
* **Learning Mesh (`/mesh`)**: Interactive network topology visualizer simulating Raspberry Pi school hubs, Wi-Fi Direct bubbles, and offline queue reconciliation.
* **Classrooms (`/classrooms`)**: Cohort management supporting join codes (`SCI7B`, `MATH7`, `CODE1`), homework assignments, announcements, and group challenges.
* **Leaderboard (`/leaderboard`)**: Weekly cup and all-time XP rankings with fair offline sync reconciliation rules.
* **Rewards Store (`/rewards`)**: Redemption bazaar converting academic XP into physical STEM kits, solar torches, and book vouchers.
* **My Progress (`/progress`)**: Subject mastery heatmaps, quiz accuracy logs, flagged learning gaps, and revision recommendations.
* **Downloads Manager (`/downloads`)**: Offline pack cache manager showing storage consumption, cached chapters, and download simulators.
* **Student Portfolio (`/projects`)**: STEM project showcase with project submission modals, verified badges, and printable PDF certificate previews.
* **Daily Challenges (`/challenges`)**: Rotating daily quests with incremental hint unlocks and XP rewards.

### 3.4 Stakeholder Portals & Settings
* **Teacher Dashboard (`/teacher`)**: Class 7B roster, student-by-student assignment completion, common misconception alerts, and new assignment creator.
* **Parent Portal (`/parent`)**: Encouraging vernacular summary, weekly study time breakdown, and practical home activities.
* **Settings & Accessibility (`/settings`)**: Theme switcher (Default Purple & Lavender vs Charcoal Dark), text scaling (112.5%), reduced motion toggle, and demo localStorage reset.
* **Legal Pages (`/privacy`, `/terms`)**: Strict child privacy notice (zero biometric/location exposure) and educational terms.

---

## 4. Implementation Status Classification

| Feature Area | Current Status | Details |
| :--- | :--- | :--- |
| **All 18 Route Pages** | **Fully Implemented** | Native routes rendered via TanStack Router with complete UI and interactivity. |
| **Design System** | **Fully Implemented** | Custom purple (`#6541F5`) & lavender (`#D8D5FF`) design system with dark mode. |
| **Gamification Engine** | **Implemented (Client)** | XP, levels ($250 \text{ XP/level}$), streak, badges, and redemptions stored in `localStorage`. |
| **CodeBot & Math Ludo** | **Fully Playable** | Interactive game engines running directly in the browser. |
| **Circuit Breadboard** | **Fully Playable** | Live mathematical simulation of Ohm's Law and resistor calculations. |
| **Block Coding Engine** | **Interactive Prototype** | Step execution, terminal log, and Python/C++ code preview. |
| **AI Concept Detective** | **Mock Simulation** | Local misconception catalog with rule-based diagnostic chat responses. |
| **Voice Recognition** | **UI Prototype** | Simulated audio playback and mic wave animation; no Web Speech API or cloud STT yet. |
| **Mesh Network Sync** | **Mock Simulation** | Queued offline actions simulated in `localStorage` with manual "Sync" trigger. |
| **User Authentication** | **Mock State** | Role switcher (`student`, `teacher`, `parent`) in top header without real JWT/session backend. |
| **Database & Backend** | **Unresolved / None** | Client-only application using static datasets (`demo.ts`) and browser `localStorage`. |

---

## 5. Non-Functional & Accessibility Requirements

1. **Lightweight Execution:** Must execute smoothly on low-power devices (Android Go, low-spec tablets).
2. **Accessible Typography:** High contrast ratios ($> 4.5:1$), enlarged text mode (112.5%), and reduced motion preference toggles.
3. **Multilingual Architecture:** Interface labels and voice models structured for English (`en`), Hindi (`hi`), and Kannada (`kn`).
4. **Zero Unintended Data Usage:** Downloads disabled over mobile tethering unless explicitly permitted.
