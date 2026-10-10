// All data in this file is DEMONSTRATION DATA for the VidyaVerse prototype.
// No real students, schools, classrooms or scores are represented.

export type Subject = "Mathematics" | "Science" | "English" | "Social Science" | "Computing";

export interface Lesson {
  id: string;
  title: string;
  subject: Subject;
  chapter: string;
  classLevel: number;
  durationMin: number;
  type: "Video" | "Reading" | "Activity";
  sizeMb: number;
  objectives: string[];
  notes: string[];
  quizId?: string;
}

export const demoStudent = {
  name: "Ananya R.",
  classLevel: 7,
  section: "B",
  school: "Demo Government Higher Primary School",
  startingXp: 1240,
  streakDays: 6,
};

export const lessons: Lesson[] = [
  {
    id: "fractions-intro",
    title: "What a fraction really means",
    subject: "Mathematics",
    chapter: "Ch 2 · Fractions and Decimals",
    classLevel: 7,
    durationMin: 12,
    type: "Video",
    sizeMb: 18,
    objectives: [
      "Describe a fraction as equal parts of a whole",
      "Compare fractions with the same denominator",
      "Place simple fractions on a number line",
    ],
    notes: [
      "A fraction a/b means the whole is split into b equal parts and we take a of them.",
      "The parts must be equal. Three unequal pieces of a roti are not thirds.",
      "When denominators are the same, the fraction with the larger numerator is larger.",
    ],
    quizId: "fractions",
  },
  {
    id: "fractions-multiply",
    title: "Multiplying a fraction by a whole number",
    subject: "Mathematics",
    chapter: "Ch 2 · Fractions and Decimals",
    classLevel: 7,
    durationMin: 15,
    type: "Activity",
    sizeMb: 6,
    objectives: ["Use repeated addition to multiply fractions", "Simplify the product"],
    notes: [
      "3 × 2/5 is the same as 2/5 + 2/5 + 2/5 = 6/5.",
      "Multiply the numerator by the whole number and keep the denominator.",
    ],
    quizId: "fractions",
  },
  {
    id: "decimals-place-value",
    title: "Decimals and place value",
    subject: "Mathematics",
    chapter: "Ch 2 · Fractions and Decimals",
    classLevel: 7,
    durationMin: 10,
    type: "Reading",
    sizeMb: 2,
    objectives: ["Read tenths and hundredths", "Convert between fractions and decimals"],
    notes: ["0.25 means 2 tenths and 5 hundredths, which equals 25/100 or 1/4."],
  },
  {
    id: "electric-circuits",
    title: "Electric current and simple circuits",
    subject: "Science",
    chapter: "Ch 10 · Electric Current and its Effects",
    classLevel: 7,
    durationMin: 14,
    type: "Video",
    sizeMb: 22,
    objectives: [
      "Identify the parts of a simple circuit",
      "Explain why a circuit must be closed for a bulb to glow",
      "Draw circuit symbols for cell, switch and bulb",
    ],
    notes: [
      "Current flows only through a closed path from one terminal of the cell to the other.",
      "A switch opens or closes the path. When open, no current flows.",
    ],
    quizId: "circuits",
  },
  {
    id: "heating-effect",
    title: "Heating effect of current",
    subject: "Science",
    chapter: "Ch 10 · Electric Current and its Effects",
    classLevel: 7,
    durationMin: 9,
    type: "Reading",
    sizeMb: 3,
    objectives: ["Explain how a fuse protects a circuit"],
    notes: ["When current flows through a thin wire, the wire heats up. Fuses use this effect."],
  },
  {
    id: "nutrition-plants",
    title: "How plants make their food",
    subject: "Science",
    chapter: "Ch 1 · Nutrition in Plants",
    classLevel: 7,
    durationMin: 11,
    type: "Video",
    sizeMb: 16,
    objectives: ["Describe photosynthesis in simple words", "Name the raw materials needed"],
    notes: ["Leaves use sunlight, water and carbon dioxide to make food and release oxygen."],
  },
  {
    id: "tenses-past",
    title: "Simple past tense in stories",
    subject: "English",
    chapter: "Unit 3 · Grammar in Context",
    classLevel: 7,
    durationMin: 8,
    type: "Reading",
    sizeMb: 1,
    objectives: ["Change verbs to simple past", "Use past tense to retell an event"],
    notes: ["Regular verbs add -ed (walk, walked). Irregular verbs change form (go, went)."],
  },
  {
    id: "rivers-india",
    title: "Rivers of the Deccan plateau",
    subject: "Social Science",
    chapter: "Ch 4 · Our Land and Water",
    classLevel: 7,
    durationMin: 13,
    type: "Video",
    sizeMb: 20,
    objectives: ["Locate the Godavari, Krishna and Kaveri on a map", "Explain why most flow east"],
    notes: ["The Deccan plateau slopes from west to east, so most rivers flow into the Bay of Bengal."],
  },
  {
    id: "algorithms-steps",
    title: "Algorithms are step-by-step plans",
    subject: "Computing",
    chapter: "Unit 1 · Computational Thinking",
    classLevel: 7,
    durationMin: 10,
    type: "Activity",
    sizeMb: 4,
    objectives: ["Write instructions in the correct order", "Find and fix a wrong step"],
    notes: ["An algorithm is a precise list of steps. Order matters: you cannot pour tea before boiling water."],
  },
];

export const subjects: Subject[] = ["Mathematics", "Science", "English", "Social Science", "Computing"];

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  topic: string;
}

export const quizzes: Record<string, { title: string; lessonId: string; questions: QuizQuestion[] }> = {
  fractions: {
    title: "Fractions practice",
    lessonId: "fractions-intro",
    questions: [
      {
        id: "q1",
        text: "A chapati is cut into 8 equal pieces. Ravi eats 3 pieces. What fraction did he eat?",
        options: ["3/5", "3/8", "5/8", "8/3"],
        correct: 1,
        explanation: "The whole has 8 equal parts and Ravi took 3, so the fraction is 3/8.",
        topic: "Meaning of a fraction",
      },
      {
        id: "q2",
        text: "Which is larger: 5/9 or 4/9?",
        options: ["5/9", "4/9", "They are equal", "Cannot be compared"],
        correct: 0,
        explanation: "The denominators are the same, so compare numerators. 5 is more than 4.",
        topic: "Comparing fractions",
      },
      {
        id: "q3",
        text: "What is 3 × 2/7?",
        options: ["6/21", "5/7", "6/7", "2/21"],
        correct: 2,
        explanation: "Multiply only the numerator by 3: 3 × 2 = 6. The denominator stays 7.",
        topic: "Multiplying fractions",
      },
      {
        id: "q4",
        text: "Which decimal equals 1/4?",
        options: ["0.4", "0.14", "1.4", "0.25"],
        correct: 3,
        explanation: "1/4 = 25/100, which is written as 0.25.",
        topic: "Fractions and decimals",
      },
    ],
  },
  circuits: {
    title: "Simple circuits check",
    lessonId: "electric-circuits",
    questions: [
      {
        id: "c1",
        text: "A bulb does not glow even though it is connected to a cell. The switch is open. Why?",
        options: ["The cell is too strong", "The circuit is not closed", "The bulb is too new", "Wires are too long"],
        correct: 1,
        explanation: "An open switch breaks the path, so current cannot flow through the bulb.",
        topic: "Closed circuits",
      },
      {
        id: "c2",
        text: "Which material would you use to connect a cell to a bulb?",
        options: ["Plastic straw", "Rubber band", "Copper wire", "Cotton thread"],
        correct: 2,
        explanation: "Copper is a good conductor. The others are insulators.",
        topic: "Conductors and insulators",
      },
      {
        id: "c3",
        text: "What does a fuse do in a circuit?",
        options: ["Makes the bulb brighter", "Stores current", "Melts to stop excess current", "Changes direction of current"],
        correct: 2,
        explanation: "A fuse wire heats up and melts when too much current flows, opening the circuit.",
        topic: "Heating effect",
      },
    ],
  },
};

export const playlabGames = [
  {
    id: "codebot-maze",
    name: "CodeBot Maze",
    mode: "Digital",
    classes: "Class 5 to 8",
    objective: "Plan a sequence of moves so a robot reaches the goal. Builds sequencing and debugging.",
    activity: "Arrange arrow commands, run them and fix the path if the robot hits a wall.",
    playable: true,
  },
  {
    id: "math-ludo",
    name: "Math Ludo",
    mode: "Physical + optional QR",
    classes: "Class 4 to 7",
    objective: "Practise fractions and integer operations while moving tokens.",
    activity: "Solve the card question to move your token. A wrong answer means you stay. Printable board, no device needed.",
    playable: true,
  },
  {
    id: "newtons-race",
    name: "Newton's Race",
    mode: "Physical",
    classes: "Class 8 to 9",
    objective: "Understand force, mass and motion through toy-car ramp races.",
    activity: "Teams change ramp height and load, predict which car travels farther, then measure with a scale.",
    playable: false,
  },
  {
    id: "circuit-masters",
    name: "Circuit Masters",
    mode: "Card game",
    classes: "Class 6 to 8",
    objective: "Recognise circuit components and complete working circuits.",
    activity: "Collect cell, wire, switch and bulb cards to build a closed circuit before other players.",
    playable: false,
  },
  {
    id: "ecoquest",
    name: "EcoQuest",
    mode: "Outdoor + worksheet",
    classes: "Class 5 to 7",
    objective: "Observe local plants and animals and classify them by habitat.",
    activity: "Groups walk the school grounds with a checklist and record observations for a class map.",
    playable: false,
  },
  {
    id: "bharat-explorer",
    name: "Bharat Explorer",
    mode: "Board game",
    classes: "Class 6 to 8",
    objective: "Learn states, rivers and landforms of India.",
    activity: "Travel across a map board answering geography clues to collect state cards.",
    playable: false,
  },
] as const;

export const classrooms = [
  {
    code: "SCI7B",
    name: "Class 7B Science",
    teacher: "Demo Teacher: Mrs. K. Lakshmi",
    announcements: [
      { date: "Mon, 5 Oct", text: "Bring one cell and two wires on Thursday for the circuit activity." },
      { date: "Thu, 1 Oct", text: "Chapter 10 reading is assigned. Finish before the practical." },
    ],
    assigned: [
      { title: "Electric current and simple circuits", kind: "Lesson", due: "Wed, 14 Oct", lessonId: "electric-circuits" },
      { title: "Simple circuits check", kind: "Quiz", due: "Fri, 16 Oct", quizId: "circuits" },
    ],
    team: "Team challenge: build a working torch from the CircuitVerse kit. Due Mon, 19 Oct.",
  },
  {
    code: "MATH7",
    name: "Class 7 Mathematics",
    teacher: "Demo Teacher: Mr. S. Prakash",
    announcements: [{ date: "Tue, 6 Oct", text: "Fractions quiz this Friday. Practise in VidyaVerse." }],
    assigned: [
      { title: "What a fraction really means", kind: "Lesson", due: "Thu, 15 Oct", lessonId: "fractions-intro" },
      { title: "Fractions practice", kind: "Quiz", due: "Fri, 16 Oct", quizId: "fractions" },
    ],
    team: "Team challenge: Math Ludo tournament in the activity period.",
  },
  {
    code: "CODE1",
    name: "Coding Club",
    teacher: "Demo Teacher: Ms. F. Begum",
    announcements: [{ date: "Wed, 7 Oct", text: "This week: loops. Try the CodeBot Maze before Saturday." }],
    assigned: [{ title: "Algorithms are step-by-step plans", kind: "Lesson", due: "Sat, 17 Oct", lessonId: "algorithms-steps" }],
    team: "Team challenge: design a maze for another team to solve.",
  },
];

export const leaderboardDemo = [
  { name: "Demo student A", weekly: 310 },
  { name: "Demo student B", weekly: 285 },
  { name: "Demo student C", weekly: 240 },
  { name: "Demo student D", weekly: 190 },
];

export const achievements = [
  { id: "first-lesson", name: "First Step", desc: "Complete your first lesson.", rule: "Complete 1 lesson" },
  { id: "quiz-ace", name: "Quiz Ace", desc: "Score full marks on any practice quiz.", rule: "100% on a quiz" },
  { id: "maze-solver", name: "Maze Solver", desc: "Guide CodeBot to the goal in PlayLab.", rule: "Solve CodeBot Maze" },
  { id: "circuit-closed", name: "Circuit Closer", desc: "Light the bulb in the CircuitVerse workspace.", rule: "Close a circuit" },
  { id: "coder", name: "Loop Starter", desc: "Solve the beginner CodeVerse challenge.", rule: "Solve challenge 1" },
  { id: "classmate", name: "Classmate", desc: "Join a classroom with a code.", rule: "Join 1 classroom" },
  { id: "detective", name: "Detective", desc: "Fix a misconception in Concept Detective.", rule: "Correct a retry" },
  { id: "streak-7", name: "Week Streak", desc: "Learn on 7 days in a row.", rule: "7-day streak" },
] as const;

export type AchievementId = (typeof achievements)[number]["id"];

export const learningPacks = [
  { id: "pack-math7", name: "Class 7 Mathematics · Fractions", sizeMb: 26, lessons: 3 },
  { id: "pack-sci7", name: "Class 7 Science · Electricity", sizeMb: 25, lessons: 2 },
  { id: "pack-circuit", name: "CircuitVerse starter kit guides", sizeMb: 12, lessons: 4 },
  { id: "pack-sst7", name: "Class 7 Social Science · Rivers", sizeMb: 20, lessons: 1 },
];

export const rewardCatalogue = [
  { name: "Saffron profile frame", cost: 500, kind: "Cosmetic" },
  { name: "Unlock bonus CodeBot levels", cost: 800, kind: "Content" },
  { name: "Class certificate of effort (teacher-approved)", cost: 1500, kind: "Recognition" },
];

export const misconceptions = [
  {
    id: "add-fractions",
    question: "What is 1/2 + 1/3?",
    studentAnswer: "2/5",
    rule: "Answer equals (sum of numerators)/(sum of denominators)",
    misconception: "Adding numerators and denominators separately",
    why: "Halves and thirds are different sized pieces. You must first cut them into same-sized pieces (sixths) before adding: 3/6 + 2/6.",
    lessonId: "fractions-intro",
    practice: { text: "What is 1/4 + 1/2?", options: ["2/6", "3/4", "2/4", "1/6"], correct: 1 },
  },
  {
    id: "decimal-length",
    question: "Which is greater: 0.5 or 0.45?",
    studentAnswer: "0.45",
    rule: "Chose the decimal with more digits",
    misconception: "Thinking more digits means a bigger decimal",
    why: "0.5 is 5 tenths, which is 50 hundredths. 0.45 is only 45 hundredths. Compare place by place, starting from tenths.",
    lessonId: "decimals-place-value",
    practice: { text: "Which is greater: 0.7 or 0.65?", options: ["0.65", "0.7", "They are equal"], correct: 1 },
  },
  {
    id: "open-switch",
    question: "Why does the bulb glow when the switch is closed?",
    studentAnswer: "Because the switch makes electricity",
    rule: "Answer contains 'switch makes' or 'switch creates'",
    misconception: "Believing the switch is a source of current",
    why: "The cell is the source. A closed switch only completes the path so current from the cell can flow through the bulb.",
    lessonId: "electric-circuits",
    practice: { text: "What provides the current in a torch?", options: ["The switch", "The bulb", "The cell", "The case"], correct: 2 },
  },
];

export const teacherRoster = [
  { name: "Demo student 01", assignments: "2/2", quiz: 92, gap: "None flagged", lastSync: "Fri, 9 Oct 4:10 PM" },
  { name: "Demo student 02", assignments: "1/2", quiz: 64, gap: "Comparing fractions", lastSync: "Fri, 9 Oct 3:55 PM" },
  { name: "Demo student 03", assignments: "2/2", quiz: 78, gap: "Fractions and decimals", lastSync: "Thu, 8 Oct 2:20 PM" },
  { name: "Demo student 04", assignments: "0/2", quiz: null, gap: "Not yet synced", lastSync: "Not synced since Mon, 5 Oct" },
  { name: "Demo student 05", assignments: "2/2", quiz: 85, gap: "Multiplying fractions", lastSync: "Fri, 9 Oct 4:02 PM" },
];

export const DEMO_LAST_SYNC = "Fri, 9 Oct 2026, 4:12 PM (demo)";
