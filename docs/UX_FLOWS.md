# VidyaVerse — User Journeys & Interaction States (UX_FLOWS.md)

> **Focus:** Seamless pedagogical flow, motivating feedback loops, and intuitive navigation for rural learners.

---

## 1. Primary User Journeys

```
                    +------------------------------------+
                    |       1. Daily Learning Loop       |
                    +------------------------------------+
                                      |
                                      v
  Dashboard ────────> Continue Lesson ────────> Practice Quiz ────────> XP & Level Up
  (View Streak & XP)  (Read Analogy/Video)     (Instant Feedback)       (Toast + Sound)
                                                                               |
                                                                               v
                                                                        Daily Mission
                                                                          Completed!
```

---

### Journey 1: Student Daily Learning Routine
1. **Entry:** Student opens `http://localhost:8080/dashboard`.
2. **Status Check:** Observes streak count (`6 days`) and daily mission progress.
3. **Resume Learning:** Clicks **"Resume learning"** on the featured purple gradient banner.
4. **Lesson Engagement (`/lesson/$id`):** Reads core objectives, checks analogies, downloads offline pack if needed.
5. **Knowledge Check (`/quiz/$id`):** Takes a 4-question check. Correct answers turn green with explanations; mistakes offer clear diagnostic tips.
6. **Progression Reward:** Scores 100%, earning +50 XP and unlocking the "Quiz Ace" achievement. The dashboard mission changes to "Completed ✓".

---

### Journey 2: Hands-On STEM Lab Flow (CircuitVerse & CodeVerse)
1. **Initiation:** Student navigates to **CircuitVerse** (`/circuitverse`) from sidebar or dashboard shortcut.
2. **Breadboard Interaction:** Toggles the knife switch, adjusts 9V battery slider and 330Ω resistor.
3. **Observation:** Current ($27.27\text{ mA}$) illuminates the LED; student observes physics in real time.
4. **Project Submission:** Navigates to **Projects** (`/projects`), clicks "Submit New Project", fills in circuit specs, and gains +120 XP.
5. **Certificate Preview:** Clicks "View Certificate" to render printable PDF verification.

---

### Journey 3: Concept Detective Misconception Diagnosis
1. **Trigger:** Student struggles with fractions addition in a quiz (answers $1/2 + 1/3 = 2/5$).
2. **Remediation Link:** Quiz redirects to `/tutor?q=Why+is+1/2+plus+1/3+not+2/5`.
3. **Analogy Diagnostic:** Concept Detective explains:
   > *"Halves and thirds are different-sized slices of a roti. You cannot count them together until both are cut into equal sixths: $3/6 + 2/6 = 5/6$."*
4. **Instant Practice:** Tutor displays a targeted 1-question check. Student picks $3/4$ for $1/4 + 1/2$, validating mastery.

---

### Journey 4: Rural Classroom Cohort Flow
1. **Teacher Action (`/teacher`):** Teacher reviews Class 7B roster, notes a gap in "Comparing fractions", and assigns a remedial task.
2. **Student Action (`/classrooms`):** Student enters join code `SCI7B` and enrolls.
3. **Offline Sync (`/mesh`):** Classroom tasks are cached locally over the school's micro-hub Wi-Fi bubble.
4. **Completion & Sync:** Student completes the task. When tablet reconnects to the school mesh, scores synchronize to the teacher's roster.

---

### Journey 5: Guardian Home Review (`/parent`)
1. **Language Selection:** Parent chooses Hindi or Kannada in the top bar.
2. **Portal View:** Reviews Ananya's weekly study time and mastered concepts presented in welcoming, accessible vernacular language.
3. **Home Activity Tip:** Reads a "Kitchen Math" prompt (*"Ask Ananya to measure half a cup of rice and explain what 1/2 means"*).

---

## 2. Interaction States & Edge Cases

| State Type | Trigger Scenario | Expected UI Behavior |
| :--- | :--- | :--- |
| **Empty State** | No downloads saved in `/downloads` | Displays clear illustration, storage capacity gauge, and "Browse recommended packs" button. |
| **Offline Mode** | Simulated offline disconnect | Changes top pill to amber `#F4B942`, increments pending sync counter, displays banner explaining local caching. |
| **Circuit Overload** | 0Ω resistance set with 9V battery | Shows warning badge, flashes red LED overload indicator, and explains thermal fuse trip. |
| **Invalid Join Code** | Student enters unknown class code | Highlights input border in destructive red with helper text: *"Code not found. Ask your teacher for the 5-character class code."* |
| **Mobile Navigation** | Screen width $< 1024\text{px}$ | Desktop sidebar hides; hamburger button in sticky header opens full mobile drawer with equal navigation hierarchy. |
